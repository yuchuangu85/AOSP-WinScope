#!/usr/bin/env python3
"""Prepare and verify the immutable standalone build dependency closure."""

from __future__ import annotations

import argparse
import concurrent.futures
import hashlib
import json
import os
import platform
import re
import runpy
import shutil
import subprocess
import sys
import tarfile
import tempfile
import time
import urllib.parse
import urllib.request
import zipfile
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
LOCK_PATH = Path(
    os.environ.get("AOSP_WINSCOPE_DEPENDENCY_LOCK", ROOT / "build/dependencies.lock.json")
).resolve()
PACKAGE_LOCK_PATH = ROOT / "package-lock.json"
DEPS_ROOT = Path(os.environ.get("AOSP_WINSCOPE_DEPS_ROOT", ROOT / ".deps")).resolve()
PERFETTO_ROOT = DEPS_ROOT / "perfetto/src"
DOWNLOAD_ROOT = DEPS_ROOT / "downloads"
STATE_ROOT = DEPS_ROOT / "state"
NPM_CACHE = DEPS_ROOT / "npm/cache"
PNPM_STORE = DEPS_ROOT / "perfetto/pnpm-store"
PERFETTO_GIT_CACHE = DEPS_ROOT / "perfetto/git-cache"

PERFETTO_REPOSITORY = "https://android.googlesource.com/platform/external/perfetto"
PERFETTO_REVISION = "ece66975738007dd0978b911d8a2077e49b8f31e"
PERFETTO_TREE = "201a16e409911aa016522a95143af2e5d52a3662"
NODE_VERSION = "24.19.0"
NPM_VERSION = "11.17.0"
GO_VERSION = "1.26.6"
PYTHON_VERSIONS = {"3.11", "3.12", "3.13"}

ALLOWED_ORIGINS = {
    "android.googlesource.com",
    "chromium.googlesource.com",
    "commondatastorage.googleapis.com",
    "fuchsia.googlesource.com",
    "node-precompiled-binaries.grpc.io",
    "registry.npmjs.org",
    "storage.googleapis.com",
}

GRPC_TOOLS_VERSION = "1.13.1"
GRPC_TOOLS_ARTIFACTS = {
    "darwin-arm64": "1a8d221c68c11389f16805d8e84724596ecbd68ba178efb5438df0ffb06a0d4b",
    "darwin-x64": "1a6d0ce976dffa494c26c40c32a8a9bdc60234c90424aed4cbd99db0baf06392",
    "linux-arm64": "3491d4001cb8b07109ed94da5d05d032ece21d3229ac46191027ccfd1dfc9b56",
    "linux-x64": "179eb5ff3b18827b06ae015433932c75b1c18b023847b414d31dbb92ea5677a3",
}


class DependencyError(RuntimeError):
    """A dependency contract invariant was not satisfied."""


def require(condition: bool, message: str) -> None:
    if not condition:
        raise DependencyError(message)


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def read_json(path: Path) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        raise DependencyError(f"cannot read {path}: {error}") from error
    require(isinstance(value, dict), f"{path} must contain a JSON object")
    return value


def run(command: list[str], *, cwd: Path = ROOT, env: dict[str, str] | None = None) -> str:
    result = subprocess.run(command, cwd=cwd, env=env, capture_output=True, text=True)
    if result.returncode != 0:
        detail = result.stderr.strip() or result.stdout.strip()
        raise DependencyError(f"{' '.join(command)} failed: {detail}")
    return result.stdout.strip()


def command_version(
    command: list[str], pattern: str, label: str, *, env: dict[str, str] | None = None
) -> str:
    output = run(command, env=env)
    match = re.search(pattern, output)
    require(match is not None, f"cannot parse {label} version from {output!r}")
    return match.group(1)


def find_node() -> tuple[str, str]:
    override = os.environ.get("AOSP_WINSCOPE_NODE")
    candidates = (
        [override]
        if override
        else [
            str(Path(os.environ["NVM_DIR"]) / "versions/node" / f"v{NODE_VERSION}/bin/node")
            if os.environ.get("NVM_DIR")
            else None,
            "node",
        ]
    )
    for candidate in candidates:
        if not candidate or shutil.which(candidate) is None and not Path(candidate).is_file():
            continue
        try:
            version = command_version([candidate, "--version"], r"v(\d+\.\d+\.\d+)", "Node.js")
        except (DependencyError, OSError):
            if override:
                break
            continue
        if version == NODE_VERSION:
            return candidate, version
    raise DependencyError(f"Node.js {NODE_VERSION} is required")


def environment_for_node(node_command: str) -> dict[str, str]:
    node_path = Path(shutil.which(node_command) or node_command).resolve()
    environment = os.environ.copy()
    environment["PATH"] = f"{node_path.parent}{os.pathsep}{environment.get('PATH', '')}"
    return environment


def find_npm(node_command: str) -> tuple[str, str]:
    override = os.environ.get("AOSP_WINSCOPE_NPM")
    node_path = Path(shutil.which(node_command) or node_command).resolve()
    candidates = [override] if override else [str(node_path.with_name("npm")), "npm"]
    environment = environment_for_node(node_command)
    for candidate in candidates:
        if not candidate or shutil.which(candidate) is None and not Path(candidate).is_file():
            continue
        try:
            version = command_version(
                [candidate, "--version"], r"(\d+\.\d+\.\d+)", "npm", env=environment
            )
        except (DependencyError, OSError):
            if override:
                break
            continue
        if version == NPM_VERSION:
            return candidate, version
    raise DependencyError(f"npm {NPM_VERSION} is required")


def find_python() -> tuple[str, str]:
    override = os.environ.get("AOSP_WINSCOPE_PYTHON")
    candidates = [override] if override else ["python3.12", "python3.13", "python3.11"]
    for candidate in candidates:
        if not candidate or shutil.which(candidate) is None:
            continue
        version = command_version([candidate, "--version"], r"Python (\d+\.\d+)", "Python")
        if version in PYTHON_VERSIONS:
            return candidate, version
    raise DependencyError("Python 3.11, 3.12, or 3.13 is required")


def find_go() -> tuple[str, str]:
    override = os.environ.get("AOSP_WINSCOPE_GO")
    candidates = (
        [override]
        if override
        else [str(Path.home() / ".local/bin/go1.26.6"), "go1.26.6", "go"]
    )
    for candidate in candidates:
        if not candidate or shutil.which(candidate) is None:
            continue
        version = command_version([candidate, "version"], r"go version go(\d+\.\d+\.\d+)", "Go")
        if version == GO_VERSION:
            return candidate, version
    raise DependencyError(f"Go {GO_VERSION} is required")


def verify_toolchain() -> dict[str, Any]:
    node_command, _ = find_node()
    npm_command, _ = find_npm(node_command)
    node_environment = environment_for_node(node_command)
    actual = {
        "node": command_version([node_command, "--version"], r"v(\d+\.\d+\.\d+)", "Node.js"),
        "npm": command_version(
            [npm_command, "--version"], r"(\d+\.\d+\.\d+)", "npm", env=node_environment
        ),
    }
    python_command, actual["python"] = find_python()
    go_command, actual["go"] = find_go()
    expected = {
        "node": NODE_VERSION,
        "npm": NPM_VERSION,
        "go": GO_VERSION,
        "python": sorted(PYTHON_VERSIONS),
    }
    require(actual["node"] == NODE_VERSION, f"Node.js {NODE_VERSION} is required; found {actual['node']}")
    require(actual["npm"] == NPM_VERSION, f"npm {NPM_VERSION} is required; found {actual['npm']}")
    return {
        "ok": True,
        "actual": actual,
        "expected": expected,
        "commands": {"node": node_command, "npm": npm_command, "python": python_command, "go": go_command},
    }


def npm_package_name(package_path: str) -> str:
    marker = "node_modules/"
    require(marker in package_path, f"invalid package-lock path: {package_path}")
    return package_path.rsplit(marker, 1)[1]


def registry_tarball(name: str, version: str) -> str:
    basename = name.split("/")[-1]
    return f"https://registry.npmjs.org/{name}/-/{basename}-{version}.tgz"


def normalized_license(value: Any) -> str:
    if isinstance(value, str) and value.strip():
        return value.strip()
    if isinstance(value, list):
        licenses = sorted(
            item.get("type", "").strip()
            for item in value
            if isinstance(item, dict) and item.get("type", "").strip()
        )
        if licenses:
            return " OR ".join(licenses)
    return "NOASSERTION"


def npm_dependencies() -> list[dict[str, Any]]:
    package_lock = read_json(PACKAGE_LOCK_PATH)
    require(package_lock.get("lockfileVersion") == 3, "package-lock.json must use lockfileVersion 3")
    root_package = package_lock["packages"][""]
    direct = set(root_package.get("dependencies", {})) | set(root_package.get("devDependencies", {}))
    license_overrides = {
        "exit@0.1.2": "MIT",
        "grpc-tools@1.13.1": "Apache-2.0",
        "saucelabs@1.5.0": "Apache-2.0",
    }
    dependencies = []
    for package_path, package in sorted(package_lock["packages"].items()):
        if not package_path:
            continue
        name = npm_package_name(package_path)
        version = package.get("version")
        resolved = package.get("resolved")
        integrity = package.get("integrity")
        require(isinstance(version, str), f"missing npm version: {package_path}")
        require(isinstance(resolved, str), f"missing npm origin: {package_path}")
        require(isinstance(integrity, str) and integrity.startswith("sha512-"), f"missing npm integrity: {package_path}")
        dependencies.append(
            {
                "id": f"npm:{package_path}",
                "kind": "npm-package",
                "name": name,
                "version": version,
                "origin": resolved,
                "integrity": {"algorithm": "sha512-sri", "value": integrity},
                "platforms": ["all"],
                "license": license_overrides.get(f"{name}@{version}", normalized_license(package.get("license"))),
                "introducedBy": "package.json" if name in direct else "package-lock.json",
                "distribution": "runtime-or-build-only-pending-ticket-12",
            }
        )
    return dependencies


def native_artifact_dependencies() -> list[dict[str, Any]]:
    dependencies = []
    for target, digest in sorted(GRPC_TOOLS_ARTIFACTS.items()):
        dependencies.append(
            {
                "id": f"native:grpc-tools:{target}",
                "kind": "archive",
                "name": "grpc-tools",
                "version": GRPC_TOOLS_VERSION,
                "origin": (
                    "https://node-precompiled-binaries.grpc.io/grpc-tools/"
                    f"v{GRPC_TOOLS_VERSION}/{target}.tar.gz"
                ),
                "integrity": {"algorithm": "sha256", "value": digest},
                "platforms": [target],
                "license": "Apache-2.0",
                "introducedBy": f"grpc-tools@{GRPC_TOOLS_VERSION} install script",
                "distribution": "build-only",
            }
        )
    return dependencies


def parse_pnpm_packages(path: Path) -> list[tuple[str, str, str]]:
    packages: list[tuple[str, str, str]] = []
    current_key: str | None = None
    in_packages = False
    for line in path.read_text(encoding="utf-8").splitlines():
        if line == "packages:":
            in_packages = True
            continue
        if in_packages and line and not line.startswith(" "):
            break
        if not in_packages:
            continue
        key_match = re.match(r"^  /(.+):$", line)
        if key_match:
            current_key = key_match.group(1)
            continue
        resolution_match = re.match(r"^    resolution: \{integrity: ([^,}]+)(?:[,}])", line)
        if current_key and resolution_match:
            package_match = re.match(r"^(.+)@([^()]+)(?:\(.*\))?$", current_key)
            require(package_match is not None, f"cannot parse pnpm package key: {current_key}")
            packages.append((package_match.group(1), package_match.group(2), resolution_match.group(1)))
            current_key = None
    require(packages, f"no packages found in {path}")
    return sorted(set(packages))


def load_perfetto_module() -> dict[str, Any]:
    require(PERFETTO_ROOT.is_dir(), "Perfetto source is not prepared")
    return runpy.run_path(str(PERFETTO_ROOT / "tools/install-build-deps"), run_name="dependency_lock_reader")


def perfetto_dependencies() -> list[dict[str, Any]]:
    namespace = load_perfetto_module()
    dependencies = [
        {
            "id": "git:perfetto-source",
            "kind": "git-source",
            "name": "perfetto",
            "revision": PERFETTO_REVISION,
            "tree": PERFETTO_TREE,
            "origin": PERFETTO_REPOSITORY,
            "integrity": {"algorithm": "git-commit", "value": PERFETTO_REVISION},
            "platforms": ["all"],
            "license": "Apache-2.0",
            "introducedBy": "Android 17 Product Input",
            "distribution": "build-only-source",
        }
    ]
    seen = set()
    for group in ("BUILD_DEPS_HOST", "BUILD_DEPS_TOOLCHAIN_HOST", "UI_DEPS"):
        for dependency in namespace[group]:
            key = (dependency.target_folder, dependency.source_url, dependency.checksum, dependency.target_os, dependency.target_arch)
            if key in seen:
                continue
            seen.add(key)
            is_git = dependency.source_url.endswith(".git")
            dependencies.append(
                {
                    "id": f"perfetto:{dependency.target_folder}:{dependency.target_os}:{dependency.target_arch}",
                    "kind": "git-source" if is_git else "archive",
                    "name": dependency.target_folder,
                    "revision": dependency.checksum if is_git else None,
                    "origin": dependency.source_url,
                    "integrity": {
                        "algorithm": "git-commit" if is_git else "sha256",
                        "value": dependency.checksum,
                    },
                    "platforms": [f"{dependency.target_os}-{dependency.target_arch}"],
                    "license": "NOASSERTION",
                    "introducedBy": f"Perfetto {group}",
                    "distribution": "build-only",
                    "target": dependency.target_folder,
                    "submodules": dependency.submodules,
                }
            )

    for name, version, integrity in parse_pnpm_packages(PERFETTO_ROOT / "ui/pnpm-lock.yaml"):
        dependencies.append(
            {
                "id": f"perfetto-ui-npm:{name}@{version}",
                "kind": "npm-package",
                "name": name,
                "version": version,
                "origin": registry_tarball(name, version),
                "integrity": {"algorithm": "sha512-sri", "value": integrity},
                "platforms": ["all"],
                "license": "NOASSERTION",
                "introducedBy": "Perfetto ui/pnpm-lock.yaml",
                "distribution": "build-only",
            }
        )
    return dependencies


def origin_host(origin: str) -> str:
    host = urllib.parse.urlparse(origin).hostname
    require(host is not None, f"dependency origin is not an absolute URL: {origin}")
    return host


def validate_dependency(entry: dict[str, Any]) -> tuple[int, int]:
    required = {
        "id",
        "kind",
        "name",
        "origin",
        "integrity",
        "platforms",
        "license",
        "introducedBy",
        "distribution",
    }
    require(required <= set(entry), f"dependency entry is incomplete: {entry.get('id')}")
    unapproved = int(origin_host(entry["origin"]) not in ALLOWED_ORIGINS)
    integrity = entry["integrity"]
    require(integrity.get("algorithm") in {"sha256", "sha512-sri", "git-commit"}, f"invalid integrity: {entry['id']}")
    value = integrity.get("value", "")
    floating = int(
        not value
        or value in {"HEAD", "main", "master", "latest"}
        or (integrity["algorithm"] == "git-commit" and not re.fullmatch(r"[0-9a-f]{40}", value))
    )
    return floating, unapproved


def closure_from_cache() -> dict[str, Any]:
    dependencies = npm_dependencies() + native_artifact_dependencies() + perfetto_dependencies()
    dependencies.sort(key=lambda entry: entry["id"])
    floating = 0
    unapproved = 0
    for entry in dependencies:
        entry_floating, entry_unapproved = validate_dependency(entry)
        floating += entry_floating
        unapproved += entry_unapproved
    require(floating == 0, f"generated closure contains {floating} floating dependencies")
    require(unapproved == 0, f"generated closure contains {unapproved} unapproved origins")
    return {
        "schemaVersion": 1,
        "allowedOrigins": sorted(ALLOWED_ORIGINS),
        "generatedFrom": {
            "packageLockSha256": sha256_file(PACKAGE_LOCK_PATH),
            "perfetto": {
                "repository": PERFETTO_REPOSITORY,
                "revision": PERFETTO_REVISION,
                "tree": PERFETTO_TREE,
                "installBuildDepsSha256": sha256_file(PERFETTO_ROOT / "tools/install-build-deps"),
                "pnpmLockSha256": sha256_file(PERFETTO_ROOT / "ui/pnpm-lock.yaml"),
            },
        },
        "dependencies": dependencies,
    }


def verify_lock(*, require_cache: bool = False) -> dict[str, Any]:
    lock = read_json(LOCK_PATH)
    require(lock.get("schemaVersion") == 1, "unsupported dependency lock schema")
    require(lock.get("allowedOrigins") == sorted(ALLOWED_ORIGINS), "allowed dependency origins mismatch")
    generated_from = lock.get("generatedFrom", {})
    require(generated_from.get("packageLockSha256") == sha256_file(PACKAGE_LOCK_PATH), "package-lock.json digest mismatch")
    perfetto = generated_from.get("perfetto", {})
    require(perfetto.get("repository") == PERFETTO_REPOSITORY, "Perfetto repository mismatch")
    require(perfetto.get("revision") == PERFETTO_REVISION, "Perfetto revision mismatch")
    require(perfetto.get("tree") == PERFETTO_TREE, "Perfetto tree mismatch")
    entries = lock.get("dependencies")
    require(isinstance(entries, list) and entries, "dependency closure is empty")
    require(entries == sorted(entries, key=lambda entry: entry["id"]), "dependency closure must be sorted")
    require(len({entry["id"] for entry in entries}) == len(entries), "dependency closure has duplicate IDs")
    floating = 0
    unapproved = 0
    for entry in entries:
        entry_floating, entry_unapproved = validate_dependency(entry)
        floating += entry_floating
        unapproved += entry_unapproved
    require(floating == 0, f"dependency closure contains {floating} floating dependencies")
    require(unapproved == 0, f"dependency closure contains {unapproved} unapproved origins")

    npm_entries = npm_dependencies()
    recorded_npm = [entry for entry in entries if entry["id"].startswith("npm:")]
    require(recorded_npm == sorted(npm_entries, key=lambda entry: entry["id"]), "npm dependency closure drift")
    if require_cache or PERFETTO_ROOT.exists():
        generated = closure_from_cache()
        require(generated == lock, "generated dependency closure differs from committed lock")
    return {
        "ok": True,
        "perfettoRevision": PERFETTO_REVISION,
        "perfettoTree": PERFETTO_TREE,
        "npmLockVersion": read_json(PACKAGE_LOCK_PATH)["lockfileVersion"],
        "dependenciesVerified": len(entries),
        "floatingDependencies": floating,
        "unapprovedOrigins": unapproved,
        "cacheCompared": PERFETTO_ROOT.exists(),
    }


def git_checkout(path: Path, origin: str, revision: str, *, tree: str | None = None, submodules: bool = False) -> None:
    if (path / ".git").exists():
        actual = run(["git", "rev-parse", "HEAD"], cwd=path)
        if actual == revision:
            if tree is not None:
                require(run(["git", "show", "-s", "--format=%T", "HEAD"], cwd=path) == tree, f"Git tree mismatch: {path}")
            require(not run(["git", "status", "--porcelain"], cwd=path), f"Git dependency is dirty: {path}")
            return
        shutil.rmtree(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(dir=path.parent, prefix=f".{path.name}.") as temporary:
        checkout = Path(temporary) / "checkout"
        run(["git", "init", "--quiet", str(checkout)])
        run(["git", "remote", "add", "origin", origin], cwd=checkout)
        run(["git", "-c", "http.followRedirects=false", "fetch", "--depth=1", "--filter=blob:none", "origin", revision], cwd=checkout)
        run(["git", "checkout", "--quiet", "--detach", "FETCH_HEAD"], cwd=checkout)
        require(run(["git", "rev-parse", "HEAD"], cwd=checkout) == revision, f"Git revision mismatch: {origin}")
        if tree is not None:
            require(run(["git", "show", "-s", "--format=%T", "HEAD"], cwd=checkout) == tree, f"Git tree mismatch: {origin}")
        if submodules:
            run(["git", "submodule", "update", "--init", "--recursive", "--depth=1"], cwd=checkout)
        checkout.rename(path)


def git_cache_path(origin: str) -> Path:
    return PERFETTO_GIT_CACHE / sha256_bytes(origin.encode("utf-8"))


def cache_git_dependency(origin: str, revision: str) -> Path:
    cache = git_cache_path(origin)
    if not cache.exists():
        cache.parent.mkdir(parents=True, exist_ok=True)
        run(["git", "init", "--quiet", "--bare", str(cache)])
        run(["git", "remote", "add", "origin", origin], cwd=cache)
    result = subprocess.run(
        ["git", "cat-file", "-e", f"{revision}^{{commit}}"],
        cwd=cache,
        capture_output=True,
    )
    if result.returncode != 0:
        run(
            ["git", "-c", "http.followRedirects=false", "fetch", "--depth=1", "--filter=blob:none", "origin", revision],
            cwd=cache,
        )
    require(run(["git", "rev-parse", f"{revision}^{{commit}}"], cwd=cache) == revision, f"Git cache revision mismatch: {origin}")
    run(["git", "fsck", "--no-dangling"], cwd=cache)
    return cache


class OriginCheckingRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, request, file_pointer, code, message, headers, new_url):  # type: ignore[no-untyped-def]
        require(origin_host(new_url) in ALLOWED_ORIGINS, f"redirect to unapproved origin: {new_url}")
        return super().redirect_request(request, file_pointer, code, message, headers, new_url)


def download(origin: str, digest: str) -> Path:
    require(origin_host(origin) in ALLOWED_ORIGINS, f"unapproved download origin: {origin}")
    DOWNLOAD_ROOT.mkdir(parents=True, exist_ok=True)
    destination = DOWNLOAD_ROOT / digest
    if destination.exists():
        require(sha256_file(destination) == digest, f"download cache digest mismatch: {destination}")
        return destination
    temporary = destination.with_suffix(".tmp")
    opener = urllib.request.build_opener(OriginCheckingRedirect())
    head_request = urllib.request.Request(origin, method="HEAD")
    with opener.open(head_request) as response:
        require(origin_host(response.geturl()) in ALLOWED_ORIGINS, f"download ended at unapproved origin: {response.geturl()}")
        content_length = int(response.headers.get("Content-Length", "0"))
        accepts_ranges = response.headers.get("Accept-Ranges", "").lower() == "bytes"
    if content_length > 64 * 1024 * 1024 and accepts_ranges:
        parts = 8
        chunk_size = (content_length + parts - 1) // parts

        def fetch_part(index: int) -> Path:
            start = index * chunk_size
            end = min(content_length - 1, start + chunk_size - 1)
            part = temporary.with_suffix(f".part-{index}")
            request = urllib.request.Request(origin, headers={"Range": f"bytes={start}-{end}"})
            with urllib.request.build_opener(OriginCheckingRedirect()).open(request) as response, part.open("wb") as output:
                require(response.status == 206, f"server ignored range request for {origin}")
                require(origin_host(response.geturl()) in ALLOWED_ORIGINS, f"download ended at unapproved origin: {response.geturl()}")
                shutil.copyfileobj(response, output)
            require(part.stat().st_size == end - start + 1, f"partial download size mismatch: {origin}")
            return part

        part_paths: list[Path] = []
        try:
            with concurrent.futures.ThreadPoolExecutor(max_workers=parts) as executor:
                part_paths = list(executor.map(fetch_part, range(parts)))
            with temporary.open("wb") as output:
                for part in part_paths:
                    with part.open("rb") as source:
                        shutil.copyfileobj(source, output)
            require(temporary.stat().st_size == content_length, f"download size mismatch: {origin}")
            require(sha256_file(temporary) == digest, f"download digest mismatch: {origin}")
            temporary.replace(destination)
            return destination
        finally:
            for part in temporary.parent.glob(f"{temporary.name}.part-*"):
                part.unlink(missing_ok=True)
            temporary.unlink(missing_ok=True)

    last_error: Exception | None = None
    for attempt in range(1, 4):
        try:
            with opener.open(origin) as response, temporary.open("wb") as output:
                require(origin_host(response.geturl()) in ALLOWED_ORIGINS, f"download ended at unapproved origin: {response.geturl()}")
                shutil.copyfileobj(response, output)
            require(sha256_file(temporary) == digest, f"download digest mismatch: {origin}")
            temporary.replace(destination)
            return destination
        except (OSError, DependencyError) as error:
            last_error = error
            if temporary.exists():
                temporary.unlink()
            if attempt < 3:
                time.sleep(attempt)
    assert last_error is not None
    raise last_error


def extract_archive(archive: Path, destination: Path) -> None:
    if destination.exists():
        shutil.rmtree(destination)
    destination.mkdir(parents=True)
    if zipfile.is_zipfile(archive):
        with zipfile.ZipFile(archive) as source:
            source.extractall(destination)
    elif tarfile.is_tarfile(archive):
        with tarfile.open(archive) as source:
            source.extractall(destination, filter="data")
    else:
        raise DependencyError(f"unsupported dependency archive: {archive}")
    children = list(destination.iterdir())
    if len(children) == 1 and children[0].is_dir():
        root = children[0]
        for child in list(root.iterdir()):
            child.rename(destination / child.name)
        root.rmdir()


def current_perfetto_platform() -> tuple[str, str]:
    operating_system = {"Darwin": "darwin", "Linux": "linux"}.get(platform.system())
    architecture = {"arm64": "arm64", "aarch64": "arm64", "x86_64": "x64", "AMD64": "x64"}.get(platform.machine())
    require(operating_system is not None and architecture is not None, "unsupported Perfetto build host")
    return operating_system, architecture


def current_native_target() -> str:
    operating_system, architecture = current_perfetto_platform()
    target = f"{operating_system}-{architecture}"
    require(target in GRPC_TOOLS_ARTIFACTS, f"unsupported grpc-tools build host: {target}")
    return target


def grpc_tools_artifact(*, allow_download: bool) -> Path:
    target = current_native_target()
    digest = GRPC_TOOLS_ARTIFACTS[target]
    origin = (
        "https://node-precompiled-binaries.grpc.io/grpc-tools/"
        f"v{GRPC_TOOLS_VERSION}/{target}.tar.gz"
    )
    if allow_download:
        return download(origin, digest)
    artifact = DOWNLOAD_ROOT / digest
    require(artifact.is_file(), f"missing dependency cache entry: native:grpc-tools:{target}")
    require(sha256_file(artifact) == digest, f"download cache digest mismatch: {artifact}")
    return artifact


def install_grpc_tools_artifact(artifact: Path) -> None:
    package_bin = ROOT / "node_modules/grpc-tools/bin"
    require(package_bin.is_dir(), "grpc-tools npm package is not installed")
    with tempfile.TemporaryDirectory(dir=DEPS_ROOT, prefix=".grpc-tools.") as temporary:
        extracted = Path(temporary) / "extracted"
        extract_archive(artifact, extracted)
        for name in ("protoc", "grpc_node_plugin"):
            source = extracted / name
            require(source.is_file(), f"grpc-tools artifact is missing {name}")
            destination = package_bin / name
            shutil.copy2(source, destination)
            destination.chmod(0o755)


def tree_digest(path: Path) -> tuple[str, int]:
    digest = hashlib.sha256()
    count = 0
    for item in sorted(path.rglob("*")):
        if not item.is_file() or ".git" in item.parts:
            continue
        relative = item.relative_to(path).as_posix().encode()
        # pnpm rewrites this installation metadata on every otherwise-identical
        # install; it is not a dependency artifact and contains no package bytes.
        if relative == b".modules.yaml":
            continue
        digest.update(len(relative).to_bytes(4, "big"))
        digest.update(relative)
        digest.update(bytes.fromhex(sha256_file(item)))
        count += 1
    return digest.hexdigest(), count


def prepare_perfetto_dependencies(node_command: str) -> dict[str, Any]:
    namespace = load_perfetto_module()
    operating_system, architecture = current_perfetto_platform()
    selected = []
    for group in ("BUILD_DEPS_HOST", "BUILD_DEPS_TOOLCHAIN_HOST", "UI_DEPS"):
        for dependency in namespace[group]:
            if dependency.target_os not in {"all", operating_system} or dependency.target_arch not in {"all", architecture}:
                continue
            selected.append((group, dependency))
    for group, dependency in selected:
        destination = PERFETTO_ROOT / dependency.target_folder
        if dependency.source_url.endswith(".git"):
            cache_git_dependency(dependency.source_url, dependency.checksum)
            continue
        archive = download(dependency.source_url, dependency.checksum)
        if group != "UI_DEPS":
            continue
        compressed = dependency.target_folder.endswith((".zip", ".tgz", ".tbz2"))
        if compressed:
            destination = destination.with_suffix("")
            stamp = destination / ".aosp-winscope-sha256"
            if stamp.exists() and stamp.read_text().strip() == dependency.checksum:
                continue
            extract_archive(archive, destination)
            stamp.write_text(dependency.checksum + "\n")
        else:
            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(archive, destination)
            destination.chmod(0o755)

    pnpm = PERFETTO_ROOT / "tools/pnpm"
    env = environment_for_node(node_command)
    env["PATH"] = f"{PERFETTO_ROOT / 'tools'}{os.pathsep}{env['PATH']}"
    node_modules = PERFETTO_ROOT / "ui/node_modules"
    if node_modules.exists():
        shutil.rmtree(node_modules)
    run(
        [str(pnpm), "install", "--shamefully-hoist", "--frozen-lockfile", "--store-dir", str(PNPM_STORE)],
        cwd=PERFETTO_ROOT / "ui",
        env=env,
    )
    status = node_modules / ".last_install"
    status.write_text(sha256_file(PERFETTO_ROOT / "ui/pnpm-lock.yaml") + "\n")
    digest, count = tree_digest(node_modules)
    state = {"nodeModulesTreeSha256": digest, "nodeModulesFiles": count}
    STATE_ROOT.mkdir(parents=True, exist_ok=True)
    (STATE_ROOT / "perfetto-ui.json").write_text(json.dumps(state, indent=2, sort_keys=True) + "\n")
    return {"dependenciesPrepared": len(selected), **state}


def prepare() -> dict[str, Any]:
    toolchain = verify_toolchain()
    git_checkout(PERFETTO_ROOT, PERFETTO_REPOSITORY, PERFETTO_REVISION, tree=PERFETTO_TREE)
    generated = closure_from_cache()
    require(generated == read_json(LOCK_PATH), "committed dependency lock does not match pinned inputs")
    NPM_CACHE.mkdir(parents=True, exist_ok=True)
    npm_environment = environment_for_node(toolchain["commands"]["node"])
    npm_environment["npm_config_cache"] = str(NPM_CACHE)
    npm_command = toolchain["commands"]["npm"]
    run([npm_command, "ci", "--ignore-scripts", "--cache", str(NPM_CACHE)], env=npm_environment)
    install_grpc_tools_artifact(grpc_tools_artifact(allow_download=True))
    perfetto = prepare_perfetto_dependencies(toolchain["commands"]["node"])
    return {
        "ok": True,
        "toolchain": toolchain["actual"],
        "npmPrepared": True,
        "npmNativeArtifacts": 1,
        "perfetto": perfetto,
    }


def verify_cache() -> dict[str, Any]:
    toolchain = verify_toolchain()
    lock = verify_lock(require_cache=True)
    require(NPM_CACHE.is_dir(), "npm dependency cache is missing")
    require(PNPM_STORE.is_dir(), "Perfetto pnpm dependency cache is missing")
    npm_environment = environment_for_node(toolchain["commands"]["node"])
    npm_environment["npm_config_cache"] = str(NPM_CACHE)
    run(
        [toolchain["commands"]["npm"], "cache", "verify", "--cache", str(NPM_CACHE)],
        env=npm_environment,
    )
    require(run(["git", "rev-parse", "HEAD"], cwd=PERFETTO_ROOT) == PERFETTO_REVISION, "Perfetto cache revision mismatch")
    require(run(["git", "show", "-s", "--format=%T", "HEAD"], cwd=PERFETTO_ROOT) == PERFETTO_TREE, "Perfetto cache tree mismatch")
    require(not run(["git", "status", "--porcelain"], cwd=PERFETTO_ROOT), "Perfetto source cache is dirty")
    for path in DOWNLOAD_ROOT.iterdir():
        require(re.fullmatch(r"[0-9a-f]{64}", path.name) is not None, f"unexpected download cache entry: {path}")
        require(sha256_file(path) == path.name, f"download cache digest mismatch: {path}")
    grpc_tools_artifact(allow_download=False)
    operating_system, architecture = current_perfetto_platform()
    for entry in read_json(LOCK_PATH)["dependencies"]:
        if not entry["id"].startswith("perfetto:"):
            continue
        target_os, target_arch = entry["platforms"][0].split("-", 1)
        if target_os not in {"all", operating_system} or target_arch not in {"all", architecture}:
            continue
        if entry["kind"] == "archive":
            digest = entry["integrity"]["value"]
            archive = DOWNLOAD_ROOT / digest
            require(archive.is_file(), f"missing dependency cache entry: {entry['id']}")
            require(sha256_file(archive) == digest, f"download cache digest mismatch: {archive}")
            continue
        if entry["kind"] != "git-source":
            continue
        cache = git_cache_path(entry["origin"])
        require(cache.is_dir(), f"missing Git dependency cache: {entry['id']}")
        require(
            run(["git", "rev-parse", f"{entry['revision']}^{{commit}}"], cwd=cache) == entry["revision"],
            f"Git dependency cache revision mismatch: {entry['id']}",
        )
        run(["git", "fsck", "--no-dangling"], cwd=cache)
    state = read_json(STATE_ROOT / "perfetto-ui.json")
    digest, count = tree_digest(PERFETTO_ROOT / "ui/node_modules")
    require(digest == state["nodeModulesTreeSha256"] and count == state["nodeModulesFiles"], "Perfetto UI node_modules cache mismatch")
    return {
        "ok": True,
        "toolchain": toolchain["actual"],
        "npmCommand": toolchain["commands"]["npm"],
        **lock,
        "downloadsVerified": len(list(DOWNLOAD_ROOT.iterdir())),
    }


def offline_check() -> dict[str, Any]:
    cache_report = verify_cache()
    npm_command = cache_report["npmCommand"]
    toolchain = verify_toolchain()
    env = environment_for_node(toolchain["commands"]["node"])
    env.update(
        {
            "npm_config_cache": str(NPM_CACHE),
            "npm_config_offline": "true",
            "npm_config_audit": "false",
            "npm_config_fund": "false",
            "HTTP_PROXY": "http://127.0.0.1:9",
            "HTTPS_PROXY": "http://127.0.0.1:9",
            "ALL_PROXY": "http://127.0.0.1:9",
            "http_proxy": "http://127.0.0.1:9",
            "https_proxy": "http://127.0.0.1:9",
            "all_proxy": "http://127.0.0.1:9",
            "NO_PROXY": "",
            "no_proxy": "",
            "AOSP_WINSCOPE_PERFETTO": str(PERFETTO_ROOT),
        }
    )
    run(
        [npm_command, "ci", "--ignore-scripts", "--offline", "--cache", str(NPM_CACHE)],
        env=env,
    )
    install_grpc_tools_artifact(grpc_tools_artifact(allow_download=False))
    run([npm_command, "run", "build:protos"], env=env)
    pnpm = PERFETTO_ROOT / "tools/pnpm"
    node_modules = PERFETTO_ROOT / "ui/node_modules"
    backup = STATE_ROOT / "perfetto-ui-node-modules.offline-check-backup"
    require(not backup.exists(), f"stale offline-check backup must be removed: {backup}")
    node_modules.rename(backup)
    try:
        run(
            [
                str(pnpm),
                "install",
                "--offline",
                "--shamefully-hoist",
                "--frozen-lockfile",
                "--store-dir",
                str(PNPM_STORE),
            ],
            cwd=PERFETTO_ROOT / "ui",
            env=env,
        )
        status = node_modules / ".last_install"
        status.write_text(sha256_file(PERFETTO_ROOT / "ui/pnpm-lock.yaml") + "\n")
        expected_state = read_json(STATE_ROOT / "perfetto-ui.json")
        digest, count = tree_digest(node_modules)
        require(
            digest == expected_state["nodeModulesTreeSha256"]
            and count == expected_state["nodeModulesFiles"],
            "offline Perfetto UI reinstall differs from the prepared dependency tree: "
            f"expected {expected_state['nodeModulesTreeSha256']}/{expected_state['nodeModulesFiles']}, "
            f"found {digest}/{count}",
        )
    except BaseException:
        if node_modules.exists():
            shutil.rmtree(node_modules)
        backup.rename(node_modules)
        raise
    shutil.rmtree(backup)
    generated_files = sum(item.is_file() for item in (ROOT / "deps_build/protos").rglob("*"))
    require(generated_files > 0, "offline proto generation produced no files")
    return {"ok": True, "networkMode": "offline", "npmInstall": True, "perfettoPnpmInstall": True, "generatedFiles": generated_files}


def emit(report: dict[str, Any], as_json: bool) -> None:
    if as_json:
        print(json.dumps(report, sort_keys=True))
    else:
        print("Dependency operation completed successfully.")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("command", choices=["generate-lock", "verify-lock", "verify-toolchain", "prepare", "verify", "offline-check"])
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()
    try:
        if args.command == "generate-lock":
            closure = closure_from_cache()
            LOCK_PATH.parent.mkdir(parents=True, exist_ok=True)
            LOCK_PATH.write_text(json.dumps(closure, indent=2, sort_keys=True) + "\n", encoding="utf-8")
            report = {"ok": True, "dependenciesWritten": len(closure["dependencies"])}
        elif args.command == "verify-lock":
            report = verify_lock()
        elif args.command == "verify-toolchain":
            report = verify_toolchain()
        elif args.command == "prepare":
            report = prepare()
        elif args.command == "verify":
            report = verify_cache()
        else:
            report = offline_check()
        emit(report, args.json)
        return 0
    except (DependencyError, OSError, subprocess.SubprocessError) as error:
        report = {"ok": False, "errors": [str(error)]}
        if args.json:
            print(json.dumps(report, sort_keys=True))
        else:
            print(f"ERROR: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
