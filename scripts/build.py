#!/usr/bin/env python3
"""Build and verify standalone WinScope from the pinned dependency cache."""

from __future__ import annotations

import argparse
import json
import os
import platform
import re
import shutil
import subprocess
import sys
import tarfile
import tempfile
from pathlib import Path
from typing import Any

import dependencies


ROOT = Path(__file__).resolve().parents[1]
PERFETTO_ROOT = dependencies.PERFETTO_ROOT
# GN discovers the Perfetto source root from the output directory, so the
# temporary build tree must stay beneath the pinned source checkout. Perfetto
# ignores `out/`; it remains a derived output rather than a source input.
PERFETTO_BUILD = PERFETTO_ROOT / "out/aosp-winscope-trace-processor"
TRACE_PROCESSOR_OUTPUT = ROOT / "deps_build/trace_processor/to_be_served"
PROTO_OUTPUT = ROOT / "deps_build/protos"
WEB_OUTPUT = ROOT / "dist/prod"
BUILD_STATE = dependencies.STATE_ROOT / "standalone-build.json"
FIRST_TRACE = ROOT / "src/test/fixtures/traces/perfetto/layers_trace.perfetto-trace"

TRACE_PROCESSOR_ARTIFACTS = (
    "engine_bundle.js",
    "trace_processor.wasm",
    "trace_processor_memory64.wasm",
)
RUNTIME_CONFIG_NAME = "runtime-config.json"
REQUIRED_CSP_DIRECTIVES = (
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "script-src 'self' 'wasm-unsafe-eval'",
    "media-src 'self' blob:",
    "connect-src 'self'",
)
FORBIDDEN_WEB_RUNTIME_MARKERS = (
    "googletagmanager.com",
    "fonts.googleapis.com",
    "localhost:5544",
    "localhost:9167",
    "ws://localhost",
)


require = dependencies.require
run = dependencies.run
sha256_file = dependencies.sha256_file


def preflight() -> dict[str, Any]:
    cache = dependencies.verify_cache()
    package = json.loads((ROOT / "package.json").read_text(encoding="utf-8"))
    require("ANDROID_BUILD_TOP" not in package["scripts"]["build:prod"], "production build uses ANDROID_BUILD_TOP")
    require(FIRST_TRACE.is_file() and FIRST_TRACE.stat().st_size > 0, "first trace fixture is missing")
    return {
        "ok": True,
        "perfettoRevision": dependencies.PERFETTO_REVISION,
        "perfettoTree": dependencies.PERFETTO_TREE,
        "dependenciesVerified": cache["dependenciesVerified"],
        "usesAndroidBuildTop": False,
        "firstTrace": FIRST_TRACE.relative_to(ROOT).as_posix(),
        "toolchain": cache["toolchain"],
    }


def entry_matches_host(entry: dict[str, Any]) -> bool:
    operating_system, architecture = dependencies.current_perfetto_platform()
    target_os, target_arch = entry["platforms"][0].split("-", 1)
    return target_os in {"all", operating_system} and target_arch in {"all", architecture}


def materialize_git(entry: dict[str, Any]) -> None:
    destination = PERFETTO_ROOT / entry["target"]
    # Android bionic has case-colliding UAPI paths which cannot be represented
    # on the default case-insensitive macOS filesystem. It is not referenced by
    # the WebAssembly/UI targets, so omit it only on that host.
    if platform.system() == "Darwin" and entry["target"] == "buildtools/bionic":
        if destination.exists():
            shutil.rmtree(destination)
        return
    if destination.exists():
        shutil.rmtree(destination)
    destination.mkdir(parents=True)
    cache = dependencies.git_cache_path(entry["origin"])
    with tempfile.TemporaryFile() as archive:
        result = subprocess.run(
            ["git", f"--git-dir={cache}", "archive", "--format=tar", entry["revision"]],
            stdout=archive,
            stderr=subprocess.PIPE,
        )
        require(result.returncode == 0, f"cannot materialize {entry['id']}: {result.stderr.decode(errors='replace')}")
        archive.seek(0)
        with tarfile.open(fileobj=archive, mode="r:") as source:
            destination_root = destination.resolve()

            def safe_member(
                member: tarfile.TarInfo, _destination: str
            ) -> tarfile.TarInfo | None:
                if member.issym() or member.islnk():
                    link_target = (destination / member.name).parent / member.linkname
                    try:
                        link_target.resolve().relative_to(destination_root)
                    except ValueError:
                        # AOSP source repos contain formatting links back to an
                        # absent full AOSP tree. They are not build inputs for
                        # Perfetto's WebAssembly target and must not escape the
                        # standalone dependency directory.
                        return None
                return member

            source.extractall(destination, filter=safe_member)


def materialize_archive(entry: dict[str, Any]) -> None:
    target = PERFETTO_ROOT / entry["target"]
    source = dependencies.DOWNLOAD_ROOT / entry["integrity"]["value"]
    require(source.is_file(), f"missing cached archive: {entry['id']}")
    compressed = entry["target"].endswith((".zip", ".tgz", ".tbz2"))
    if compressed:
        destination = target.with_suffix("")
        dependencies.extract_archive(source, destination)
        return
    target.parent.mkdir(parents=True, exist_ok=True)
    if not target.is_file() or sha256_file(target) != entry["integrity"]["value"]:
        shutil.copy2(source, target)
        target.chmod(0o755)


def materialize_perfetto_build_inputs() -> int:
    entries = json.loads(dependencies.LOCK_PATH.read_text(encoding="utf-8"))["dependencies"]
    selected = [
        entry
        for entry in entries
        if entry["id"].startswith("perfetto:") and entry_matches_host(entry)
    ]
    for entry in selected:
        if entry["kind"] == "git-source":
            materialize_git(entry)
        elif entry["kind"] == "archive":
            materialize_archive(entry)
    return len(selected)


def build_environment() -> tuple[dict[str, str], dict[str, Any]]:
    toolchain = dependencies.verify_toolchain()
    node_command = toolchain["commands"]["node"]
    environment = dependencies.environment_for_node(node_command)
    node_bin = Path(shutil.which(node_command) or node_command).resolve().parent
    environment["PATH"] = os.pathsep.join(
        (str(node_bin), str(PERFETTO_ROOT / "tools"), environment["PATH"])
    )
    environment["AOSP_WINSCOPE_PERFETTO"] = str(PERFETTO_ROOT)
    return environment, toolchain


def prepare_missing_cache() -> None:
    """Prepare a first clean clone, but never repair a partial/corrupt cache."""
    if dependencies.DEPS_ROOT.exists():
        return
    dependencies.prepare()


def build_trace_processor() -> dict[str, Any]:
    prepare_missing_cache()
    preflight()
    if BUILD_STATE.exists():
        BUILD_STATE.unlink()
    materialized = materialize_perfetto_build_inputs()
    environment, _ = build_environment()
    # A previous Ninja output is never a source input: rebuilding from an empty
    # GN output tree ensures the verified source/dependency cache is the only
    # authority for generated JS/WASM bytes.
    if PERFETTO_BUILD.exists():
        shutil.rmtree(PERFETTO_BUILD)
    run(
        [
            str(PERFETTO_ROOT / "tools/gn"),
            "gen",
            "--args=is_debug=false skip_buildtools_check=true",
            str(PERFETTO_BUILD),
        ],
        cwd=PERFETTO_ROOT,
        env=environment,
    )
    # Perfetto's UI build creates this link outside the UI directory it cleans.
    # Its target is the isolated path below, so remove a previous invocation's
    # now-broken link before upstream build.js recreates it.
    test_data_link = PERFETTO_BUILD / "test/data"
    if test_data_link.is_symlink():
        test_data_link.unlink()
    # TypeScript searches every ancestor directory for visible @types. If the
    # immutable Perfetto checkout is addressed through its real path, the
    # standalone application's Jasmine types leak into Perfetto's Jest build.
    # Addressing the same checkout through a temporary path outside this repo,
    # while preserving the main-module symlink, gives upstream build.js its own
    # dependency boundary without patching a single upstream source file.
    with tempfile.TemporaryDirectory(prefix="aosp-winscope-perfetto-") as temporary_root:
        isolated_root = Path(temporary_root) / "src"
        isolated_root.symlink_to(PERFETTO_ROOT, target_is_directory=True)
        run(
            [
                str(PERFETTO_ROOT / "ui/node"),
                "--preserve-symlinks-main",
                str(isolated_root / "ui/build.js"),
                "--out",
                str(PERFETTO_BUILD),
                "--no-depscheck",
                "--no-override-gn-args",
                "--minify-js",
                "all",
            ],
            cwd=isolated_root / "ui",
            env=environment,
        )
    version_dir = PERFETTO_BUILD / "ui/dist_version"
    sources = {
        "engine_bundle.js": version_dir / "engine_bundle.js",
        "trace_processor.wasm": PERFETTO_BUILD / "wasm/trace_processor.wasm",
        "trace_processor_memory64.wasm": (
            PERFETTO_BUILD / "wasm_memory64/trace_processor_memory64.wasm"
        ),
    }
    temporary = TRACE_PROCESSOR_OUTPUT.with_name(".to_be_served.tmp")
    if temporary.exists():
        shutil.rmtree(temporary)
    temporary.mkdir(parents=True)
    artifacts = {}
    for name, source in sources.items():
        require(source.is_file() and source.stat().st_size > 0, f"missing Perfetto build artifact: {source}")
        shutil.copy2(source, temporary / name)
        artifacts[name] = {"sha256": sha256_file(source), "size": source.stat().st_size}
    if TRACE_PROCESSOR_OUTPUT.exists():
        shutil.rmtree(TRACE_PROCESSOR_OUTPUT)
    temporary.rename(TRACE_PROCESSOR_OUTPUT)
    return {"materializedDependencies": materialized, "artifacts": artifacts}


def build_production() -> dict[str, Any]:
    trace_processor = build_trace_processor()
    environment, toolchain = build_environment()
    npm = toolchain["commands"]["npm"]
    run([npm, "run", "build:protos"], env=environment)
    run([npm, "run", "build:app"], env=environment)
    report = verify_outputs(trace_processor["artifacts"])
    report["traceProcessorBuild"] = trace_processor
    dependencies.STATE_ROOT.mkdir(parents=True, exist_ok=True)
    BUILD_STATE.write_text(json.dumps(report, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    return report


def recorded_artifacts() -> dict[str, Any]:
    require(BUILD_STATE.is_file(), "standalone production build state is missing")
    state = json.loads(BUILD_STATE.read_text(encoding="utf-8"))
    require(state.get("perfettoRevision") == dependencies.PERFETTO_REVISION, "build state Perfetto revision mismatch")
    require(state.get("perfettoTree") == dependencies.PERFETTO_TREE, "build state Perfetto tree mismatch")
    artifacts = state.get("traceProcessorArtifacts")
    require(isinstance(artifacts, dict), "build state artifact inventory is missing")
    return artifacts


def verify_outputs(expected_artifacts: dict[str, Any] | None = None) -> dict[str, Any]:
    expected_artifacts = expected_artifacts or recorded_artifacts()
    artifacts = {}
    for name in TRACE_PROCESSOR_ARTIFACTS:
        path = TRACE_PROCESSOR_OUTPUT / name
        require(path.is_file() and path.stat().st_size > 0, f"missing Trace Processor artifact: {name}")
        artifacts[name] = {"sha256": sha256_file(path), "size": path.stat().st_size}
        require(artifacts[name] == expected_artifacts.get(name), f"{name} differs from recorded build state")
    require(PROTO_OUTPUT.is_dir() and any(PROTO_OUTPUT.rglob("*.js")), "generated proto output is missing")
    require((WEB_OUTPUT / "index.html").is_file(), "Angular production index is missing")
    for name in TRACE_PROCESSOR_ARTIFACTS:
        deployed = WEB_OUTPUT / name
        require(deployed.is_file(), f"Angular production output is missing {name}")
        require(sha256_file(deployed) == artifacts[name]["sha256"], f"deployed {name} differs from pinned build output")
    web_files = [path for path in WEB_OUTPUT.rglob("*") if path.is_file()]
    require(any(path.name.startswith("main.") and path.suffix == ".js" for path in web_files), "Angular main bundle is missing")
    web_contract = verify_web_contract(web_files)
    return {
        "ok": True,
        "perfettoRevision": dependencies.PERFETTO_REVISION,
        "perfettoTree": dependencies.PERFETTO_TREE,
        "traceProcessorArtifacts": artifacts,
        "protoFiles": sum(path.is_file() for path in PROTO_OUTPUT.rglob("*")),
        "webFiles": len(web_files),
        "webContract": web_contract,
        "firstTrace": FIRST_TRACE.relative_to(ROOT).as_posix(),
    }


def verify_web_contract(web_files: list[Path]) -> dict[str, Any]:
    """Validate the stable, relocatable Web distribution boundary."""
    index = (WEB_OUTPUT / "index.html").read_text(encoding="utf-8")
    require('<base href="./"' in index, "Web output is not relocatable")
    require("Content-Security-Policy" in index, "Web output does not declare a CSP")
    for directive in REQUIRED_CSP_DIRECTIVES:
        require(directive in index, f"Web CSP is missing {directive}")
    for marker in FORBIDDEN_WEB_RUNTIME_MARKERS:
        require(marker not in index, f"Web index contains a forbidden external runtime marker: {marker}")
    for resource in re.findall(r'(?:src|href)="([^"]+)"', index):
        require(
            not resource.startswith(('/', '//', 'http:', 'https:', 'ws:', 'wss:')),
            f"Web index contains a non-relative resource URL: {resource}",
        )

    runtime_config = WEB_OUTPUT / RUNTIME_CONFIG_NAME
    require(runtime_config.is_file(), "Web output is missing runtime-config.json")
    config = json.loads(runtime_config.read_text(encoding="utf-8"))
    require(config == {
        "schemaVersion": 1,
        "host": {"kind": "standalone"},
        "capture": {"provider": "none"},
    }, "default runtime configuration must disable capture")

    scanned = 0
    for path in web_files:
        if path.suffix not in {".html", ".js", ".css"}:
            continue
        contents = path.read_text(encoding="utf-8", errors="replace")
        for marker in FORBIDDEN_WEB_RUNTIME_MARKERS:
            require(marker not in contents, f"Web output contains forbidden runtime marker {marker}: {path.name}")
        scanned += 1
    return {
        "csp": True,
        "defaultFileOnly": True,
        "relativeBaseHref": True,
        "runtimeConfig": RUNTIME_CONFIG_NAME,
        "scannedTextFiles": scanned,
    }


def emit(report: dict[str, Any], as_json: bool) -> None:
    if as_json:
        print(json.dumps(report, sort_keys=True))
    else:
        print("Standalone build operation completed successfully.")


def main() -> int:
    dependencies.reexec_with_supported_python()
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("command", choices=["preflight", "trace-processor", "production", "verify"])
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()
    try:
        if args.command == "preflight":
            report = preflight()
        elif args.command == "trace-processor":
            report = {"ok": True, **build_trace_processor()}
        elif args.command == "production":
            report = build_production()
        else:
            preflight()
            report = verify_outputs()
        emit(report, args.json)
        return 0
    except (dependencies.DependencyError, json.JSONDecodeError, OSError, subprocess.SubprocessError) as error:
        report = {"ok": False, "errors": [str(error)]}
        if args.json:
            print(json.dumps(report, sort_keys=True))
        else:
            print(f"ERROR: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
