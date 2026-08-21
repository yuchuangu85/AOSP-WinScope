#!/usr/bin/env python3
"""Run Stage 7 feature, compatibility, performance, and release gates."""

from __future__ import annotations

import argparse
import json
import math
import re
import subprocess
import sys
import time
import zipfile
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_REPORT = ROOT / "dist/validation/report.json"
DEFAULT_WEB = ROOT / "dist/prod"
DEFAULT_RELEASE = ROOT / "dist/release/aosp-winscope-17.0.0"
DEFAULT_REPRODUCIBILITY = ROOT / "dist/validation/reproducibility.json"
LOCK = ROOT / "build/dependencies.lock.json"
PACKAGE = ROOT / "package.json"
FORBIDDEN_RUNTIME_MARKERS = (
    "googletagmanager.com",
    "fonts.googleapis.com",
    "localhost:5544",
    "localhost:9167",
    "ws://localhost",
)
SCANNER_RE = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._+ /-]{0,127}$")
CSP_DIRECTIVES = (
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "script-src 'self' 'wasm-unsafe-eval'",
    "media-src 'self' blob:",
    "connect-src 'self'",
)
FEATURE_FIXTURES = {
    "perfetto": ("src/test/fixtures/traces/perfetto", "*.perfetto-trace"),
    "legacy-readers": ("src/test/fixtures/archives", "*"),
    "screenshot": ("src/test/fixtures/traces/screenshot", "*"),
    "screen-recording": ("src/test/fixtures/traces", "**/*.mp4"),
    "input-and-ime": ("src/test/fixtures/traces/ime", "*.pb"),
}
REQUIRED_EXTERNAL_EVIDENCE = (
    "android17Device",
    "vulnerability",
    "performanceBaseline",
    "performanceBenchmark",
)
COMMANDS = {
    "unit": ["npm", "run", "test:unit:ci"],
    "e2e": ["npm", "run", "test:e2e"],
    "production-e2e": ["npm", "run", "test:e2e:prod"],
    "offline": ["npm", "run", "deps:offline-check"],
    "security": ["npm", "run", "security:hostile"],
}


def reject_json_constant(value: str) -> None:
    raise ValueError(f"non-standard JSON number: {value}")


def read_json_object(path: Path) -> dict[str, Any]:
    value = json.loads(path.read_text(encoding="utf-8"), parse_constant=reject_json_constant)
    if not isinstance(value, dict):
        raise ValueError("evidence must be a JSON object")
    return value


def finite_nonnegative(value: Any) -> bool:
    return (
        isinstance(value, (int, float))
        and not isinstance(value, bool)
        and math.isfinite(value)
        and value >= 0
    )


def result(name: str, status: str, **details: Any) -> dict[str, Any]:
    return {"name": name, "status": status, **details}


def display_path(path: Path) -> str:
    try:
        return path.relative_to(ROOT).as_posix()
    except ValueError:
        return str(path)


def files_matching(relative_root: str, pattern: str) -> list[Path]:
    root = ROOT / relative_root
    if not root.is_dir():
        return []
    return sorted(path for path in root.glob(pattern) if path.is_file())


def sha256_file(path: Path) -> str:
    import hashlib

    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def external_evidence_manifest(
    paths: dict[str, Path | None],
) -> dict[str, Any]:
    inputs = {}
    missing = []
    for name in REQUIRED_EXTERNAL_EVIDENCE:
        path = paths.get(name)
        if path is None or not path.is_file():
            missing.append(name)
            continue
        try:
            inputs[name] = {"sha256": sha256_file(path), "size": path.stat().st_size}
        except OSError:
            missing.append(name)
    return {"schemaVersion": 1, "inputs": inputs, "missing": missing}


def git_commit() -> str:
    return subprocess.run(
        ["git", "rev-parse", "HEAD"], cwd=ROOT, capture_output=True, text=True, check=True
    ).stdout.strip()


def working_tree_clean() -> bool:
    return not subprocess.run(
        ["git", "status", "--porcelain", "--untracked-files=all"],
        cwd=ROOT,
        capture_output=True,
        text=True,
        check=True,
    ).stdout.strip()


def fixture_coverage() -> dict[str, Any]:
    checks = []
    inventory = {}
    for name, (root, pattern) in FEATURE_FIXTURES.items():
        files = files_matching(root, pattern)
        inventory[name] = {
            "root": root,
            "pattern": pattern,
            "files": len(files),
            "bytes": sum(path.stat().st_size for path in files),
        }
        checks.append(
            result(
                f"fixture:{name}",
                "pass" if files else "fail",
                files=len(files),
                bytes=inventory[name]["bytes"],
            )
        )
    return {"checks": checks, "inventory": inventory}


def source_security_scan(web_root: Path) -> dict[str, Any]:
    if not web_root.is_dir():
        return {"check": result("security:runtime-boundary", "skipped", reason=f"missing {display_path(web_root)}")}
    matches: list[dict[str, str]] = []
    for path in sorted(web_root.rglob("*")):
        if not path.is_file() or path.suffix not in {".js", ".html", ".css", ".map"}:
            continue
        text = path.read_text(encoding="utf-8", errors="replace")
        for marker in FORBIDDEN_RUNTIME_MARKERS:
            if marker in text:
                matches.append({"path": display_path(path), "marker": marker})
    return {
        "check": result("security:runtime-boundary", "fail" if matches else "pass", matches=matches),
        "markers": FORBIDDEN_RUNTIME_MARKERS,
    }


def web_contract(web_root: Path) -> dict[str, Any]:
    if not web_root.is_dir():
        return result("web:production-contract", "skipped", reason=f"missing {display_path(web_root)}")
    index_path = web_root / "index.html"
    config_path = web_root / "runtime-config.json"
    if not index_path.is_file() or not config_path.is_file():
        return result("web:production-contract", "fail", reason="index.html or runtime-config.json is missing")
    index = index_path.read_text(encoding="utf-8", errors="replace")
    missing = [directive for directive in CSP_DIRECTIVES if directive not in index]
    absolute = [value for value in re.findall(r'(?:src|href)="([^"]+)"', index) if value.startswith(("/", "//", "http:", "https:"))]
    markers = [marker for marker in FORBIDDEN_RUNTIME_MARKERS if marker in index]
    try:
        config = json.loads(config_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        config = None
    valid_config = config == {
        "schemaVersion": 1,
        "host": {"kind": "standalone"},
        "capture": {"provider": "none"},
    }
    status = "pass" if not missing and not absolute and not markers and valid_config else "fail"
    return result(
        "web:production-contract",
        status,
        missingCsp=missing,
        absoluteResources=absolute,
        forbiddenMarkers=markers,
        defaultRuntimeConfig=valid_config,
    )


def dependency_evidence() -> dict[str, Any]:
    command = [sys.executable, str(ROOT / "scripts/dependencies.py"), "verify-lock", "--json"]
    completed = subprocess.run(command, cwd=ROOT, capture_output=True, text=True)
    try:
        verification = json.loads(completed.stdout)
    except json.JSONDecodeError:
        verification = {"raw": completed.stdout[-1000:]}
    return result(
        "supply-chain:lock-and-license",
        "pass" if completed.returncode == 0 and verification.get("ok") is True else "fail",
        verification=verification,
    )


def release_evidence(release_root: Path) -> dict[str, Any]:
    if not release_root.exists():
        return result("release:evidence", "skipped", reason=f"missing {display_path(release_root)}")
    command = [sys.executable, str(ROOT / "scripts/release.py"), "verify", "--input", str(release_root), "--json"]
    completed = subprocess.run(command, cwd=ROOT, capture_output=True, text=True)
    try:
        payload = json.loads(completed.stdout)
    except json.JSONDecodeError:
        payload = {"raw": completed.stdout[-1000:]}
    required = (
        "LICENSES/LICENSE",
        "LICENSES/NOTICE",
        "LICENSES/sbom.spdx.json",
        "LICENSES/attribution.json",
        "dependency-bundle/dependencies.lock.json",
    )
    if release_root.is_file() and release_root.suffix == ".zip":
        with zipfile.ZipFile(release_root) as archive:
            names = set(archive.namelist())
        missing = [path for path in required if path not in names]
    else:
        missing = [path for path in required if not (release_root / path).is_file()]
    status = "pass" if completed.returncode == 0 and not missing else "fail"
    return result("release:evidence", status, missing=missing, **payload)



def platform_support() -> dict[str, Any]:
    launcher_script = ROOT / "scripts/build-launchers.py"
    if not launcher_script.is_file():
        return result("platform:launchers", "fail", reason="launcher build script is missing")
    text = launcher_script.read_text(encoding="utf-8")
    required = ["windows", "darwin", "linux", "amd64", "arm64"]
    missing = [value for value in required if value not in text]
    return result(
        "platform:launchers",
        "pass" if not missing else "fail",
        supported=["windows-amd64", "windows-arm64", "darwin-amd64", "darwin-arm64", "linux-amd64", "linux-arm64"],
        missing=missing,
    )



def browser_matrix() -> dict[str, Any]:
    plan = ROOT / "docs/REBUILD_PLAN.md"
    text = plan.read_text(encoding="utf-8") if plan.is_file() else ""
    required = ("Chrome/Edge", "file://", "Safari", "Firefox")
    missing = [value for value in required if value not in text]
    return result(
        "platform:browsers",
        "pass" if not missing else "fail",
        declaredSupport=["current Chrome", "previous stable Chrome", "current Edge", "previous stable Edge"],
        excluded=["file://", "Safari", "Firefox", "mobile browsers", "embedded JCEF"],
        missing=missing,
    )

def vulnerability_gate(path: Path | None) -> dict[str, Any]:
    if path is None:
        return result("security:vulnerability-scan", "skipped", reason="external scanner evidence not supplied")
    try:
        evidence = read_json_object(path)
    except OSError:
        return result("security:vulnerability-scan", "fail", reason="cannot read vulnerability evidence")
    except (ValueError, json.JSONDecodeError):
        return result("security:vulnerability-scan", "fail", reason="invalid vulnerability evidence JSON")
    required = ("schemaVersion", "scanner", "sourceCommit", "lockSha256", "critical", "high", "ok")
    missing = [key for key in required if key not in evidence]
    valid = (
        not missing
        and type(evidence["schemaVersion"]) is int
        and evidence["schemaVersion"] == 1
        and isinstance(evidence["scanner"], str)
        and SCANNER_RE.fullmatch(evidence["scanner"]) is not None
        and evidence["sourceCommit"] == git_commit()
        and working_tree_clean()
        and evidence["lockSha256"] == sha256_file(LOCK)
        and type(evidence["critical"]) is int
        and type(evidence["high"]) is int
        and evidence["critical"] == 0
        and evidence["high"] == 0
        and evidence["ok"] is True
    )
    return result(
        "security:vulnerability-scan",
        "pass" if valid else "fail",
        evidenceSha256=sha256_file(path),
        scanner=(
            evidence["scanner"]
            if isinstance(evidence.get("scanner"), str)
            and SCANNER_RE.fullmatch(evidence["scanner"]) is not None
            else None
        ),
        sourceCommit=git_commit() if evidence.get("sourceCommit") == git_commit() else None,
        lockSha256=sha256_file(LOCK) if evidence.get("lockSha256") == sha256_file(LOCK) else None,
        critical=evidence.get("critical") if type(evidence.get("critical")) is int else None,
        high=evidence.get("high") if type(evidence.get("high")) is int else None,
        missing=missing,
    )


def performance(web_root: Path, baseline: Path | None, benchmark: Path | None = None, require_benchmark: bool = False) -> dict[str, Any]:
    metrics: dict[str, float] = {}
    if web_root.is_dir():
        files = [path for path in web_root.rglob("*") if path.is_file()]
        metrics.update({
            "webBytes": sum(path.stat().st_size for path in files),
            "webFiles": len(files),
            "traceProcessorBytes": sum(
                (web_root / name).stat().st_size
                for name in ("engine_bundle.js", "trace_processor.wasm", "trace_processor_memory64.wasm")
                if (web_root / name).is_file()
            ),
        })
    elif benchmark is None:
        return result("performance:size-budget", "skipped", reason=f"missing {display_path(web_root)}")

    benchmark_metrics: dict[str, float] = {}
    if benchmark is not None:
        try:
            payload = read_json_object(benchmark)
            raw_metrics = payload.get("metrics", payload)
            if not isinstance(raw_metrics, dict):
                raise ValueError("benchmark metrics must be a JSON object")
            benchmark_metrics = {
                name: value
                for name in ("startupMs", "importMs", "interactionMs", "peakMemoryBytes")
                if finite_nonnegative(value := raw_metrics.get(name))
            }
        except OSError:
            return result("performance:benchmark", "fail", reason="cannot read performance benchmark evidence")
        except (ValueError, json.JSONDecodeError):
            return result("performance:benchmark", "fail", reason="invalid performance benchmark evidence")
        required = ("startupMs", "importMs", "interactionMs", "peakMemoryBytes")
        missing = [name for name in required if name not in benchmark_metrics]
        if missing:
            return result("performance:benchmark", "fail", missing=missing, metrics=benchmark_metrics)
        metrics.update({name: benchmark_metrics[name] for name in required})

    if require_benchmark and benchmark is None:
        return result("performance:benchmark", "skipped", reason="benchmark evidence not supplied", metrics=metrics)
    if benchmark is not None and baseline is None:
        return result("performance:benchmark", "skipped", reason="performance baseline not supplied", metrics=metrics)
    if baseline is None:
        return result(
            "performance:benchmark" if benchmark is not None else "performance:size-budget",
            "pass" if benchmark is not None else "skipped",
            reason=None if benchmark is not None else "no baseline supplied",
            metrics=metrics,
        )
    try:
        expected = read_json_object(baseline)
        expected_metrics = expected.get("metrics", expected)
        if not isinstance(expected_metrics, dict):
            raise ValueError("performance baseline metrics must be a JSON object")
        budget_value = expected.get("maxRegressionPercent", 10)
        if not finite_nonnegative(budget_value):
            raise ValueError("performance regression budget must be finite and non-negative")
        budget = float(budget_value)
        required_baseline = ["startupMs", "importMs", "interactionMs", "peakMemoryBytes"] if benchmark is not None else []
        required_baseline.extend(name for name in ("webBytes", "traceProcessorBytes") if metrics.get(name))
        missing_baseline = [
            name
            for name in required_baseline
            if not finite_nonnegative(expected_metrics.get(name)) or expected_metrics[name] == 0
        ]
        if missing_baseline:
            return result("performance:benchmark", "fail", missing=missing_baseline, metrics=metrics)
        comparable = {name: value for name, value in metrics.items() if name in expected_metrics and expected_metrics[name]}
        regressions = {name: (value / expected_metrics[name] - 1) * 100 for name, value in comparable.items()}
        failures = {name: value for name, value in regressions.items() if value > budget}
    except OSError:
        return result("performance:benchmark", "fail", reason="cannot read performance baseline evidence", metrics=metrics)
    except (ValueError, json.JSONDecodeError, TypeError):
        return result("performance:benchmark", "fail", reason="invalid performance baseline evidence", metrics=metrics)
    return result(
        "performance:benchmark" if benchmark is not None else "performance:size-budget",
        "fail" if failures else "pass",
        metrics=metrics,
        regressionsPercent=regressions,
        maxRegressionPercent=budget,
        failures=failures,
    )


def run_optional(name: str, enabled: bool, timeout: int) -> dict[str, Any]:
    if not enabled:
        return result(f"runtime:{name}", "skipped", reason="not requested")
    started = time.monotonic()
    try:
        completed = subprocess.run(COMMANDS[name], cwd=ROOT, capture_output=True, text=True, timeout=timeout)
    except (OSError, subprocess.TimeoutExpired) as error:
        return result(f"runtime:{name}", "fail", reason=str(error))
    return result(
        f"runtime:{name}",
        "pass" if completed.returncode == 0 else "fail",
        returncode=completed.returncode,
        durationSeconds=round(time.monotonic() - started, 3),
        stdout=completed.stdout[-2000:],
        stderr=completed.stderr[-2000:],
    )


def reproducibility_evidence(path: Path | None) -> dict[str, Any]:
    if path is None:
        return result("release:reproducibility", "skipped", reason="two-build evidence not supplied")
    if not path.is_file():
        return result("release:reproducibility", "skipped", reason=f"missing {display_path(path)}")
    try:
        evidence = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        return result("release:reproducibility", "fail", reason=str(error))
    builds = evidence.get("builds")
    valid = (
        type(evidence.get("schemaVersion")) is int
        and evidence.get("schemaVersion") == 1
        and evidence.get("stage") == 10
        and evidence.get("ok") is True
        and evidence.get("sourceCommit") == git_commit()
        and evidence.get("dependencyLockSha256") == sha256_file(LOCK)
        and evidence.get("byteIdentical") is True
        and evidence.get("provenanceVerified") is True
        and isinstance(builds, list)
        and len(builds) == 2
        and all(
            isinstance(build, dict)
            and build.get("provenanceVerified") is True
            and isinstance(build.get("zipSha256"), str)
            for build in builds
        )
        and builds[0]["zipSha256"] == builds[1]["zipSha256"]
    )
    return result("release:reproducibility", "pass" if valid else "fail", evidence=evidence)


def device_evidence(path: Path | None) -> dict[str, Any]:
    if path is None:
        return result("device:android17-capture", "skipped", reason="real-device evidence not supplied")
    try:
        evidence = read_json_object(path)
    except OSError:
        return result("device:android17-capture", "fail", reason="cannot read device evidence")
    except (ValueError, json.JSONDecodeError):
        return result("device:android17-capture", "fail", reason="invalid device evidence JSON")
    capture = evidence.get("capture")
    imported = evidence.get("import")
    valid = (
        type(evidence.get("schemaVersion")) is int
        and evidence.get("schemaVersion") == 1
        and evidence.get("androidVersion") == "17"
        and isinstance(evidence.get("fingerprint"), str)
        and bool(evidence["fingerprint"].strip())
        and isinstance(capture, dict) and capture.get("ok") is True
        and isinstance(imported, dict) and imported.get("ok") is True
    )
    return result(
        "device:android17-capture",
        "pass" if valid else "fail",
        evidenceSha256=sha256_file(path),
        androidVersion="17" if evidence.get("androidVersion") == "17" else None,
        captureOk=isinstance(capture, dict) and capture.get("ok") is True,
        importOk=isinstance(imported, dict) and imported.get("ok") is True,
    )


def report(args: argparse.Namespace) -> dict[str, Any]:
    coverage = fixture_coverage()
    checks = [*coverage["checks"]]
    checks.append(source_security_scan(args.web)["check"])
    checks.append(dependency_evidence())
    checks.append(platform_support())
    checks.append(browser_matrix())
    checks.append(vulnerability_gate(args.vulnerability_evidence))
    checks.append(web_contract(args.web))
    checks.append(release_evidence(args.release))
    checks.append(reproducibility_evidence(args.reproducibility))
    checks.append(performance(args.web, args.baseline, args.benchmark, args.require_complete))
    android17_device = device_evidence(args.device_evidence)
    checks.append(android17_device)
    checks.extend((
        run_optional("unit", args.run_unit, args.timeout),
        run_optional("e2e", args.run_e2e, args.timeout),
        run_optional("production-e2e", args.run_production_e2e, args.timeout),
        run_optional("offline", args.run_offline, args.timeout),
        run_optional("security", args.run_security, args.timeout),
    ))
    external_evidence = external_evidence_manifest({
        "android17Device": args.device_evidence,
        "vulnerability": args.vulnerability_evidence,
        "performanceBaseline": args.baseline,
        "performanceBenchmark": args.benchmark,
    })
    fixture_validated = all(
        check["status"] == "pass" for check in coverage["checks"]
    )
    compatibility_tiers = {
        "15": {
            "fixtureValidated": fixture_validated,
            "deviceValidated": False,
        },
        "16": {
            "fixtureValidated": fixture_validated,
            "deviceValidated": False,
        },
        "17": {
            "fixtureValidated": fixture_validated,
            "deviceValidated": android17_device["status"] == "pass",
            "releaseRequired": True,
        },
    }
    return {
        "schemaVersion": 1,
        "stage": 7,
        "ok": not any(check["status"] == "fail" for check in checks),
        "complete": not any(check["status"] == "skipped" for check in checks),
        "repository": "aosp-winscope",
        "checks": checks,
        "fixtureCoverage": coverage["inventory"],
        "androidCompatibility": compatibility_tiers,
        "externalEvidence": external_evidence,
        "dynamicChecksRequested": any((
            args.run_unit, args.run_e2e, args.run_production_e2e, args.run_offline, args.run_security
        )),
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("command", choices=("report", "gate"))
    parser.add_argument("--output", type=Path, default=DEFAULT_REPORT)
    parser.add_argument("--web", type=Path, default=DEFAULT_WEB)
    parser.add_argument("--release", type=Path, default=DEFAULT_RELEASE)
    parser.add_argument("--reproducibility", type=Path, default=DEFAULT_REPRODUCIBILITY)
    parser.add_argument("--baseline", type=Path)
    parser.add_argument("--benchmark", type=Path)
    parser.add_argument("--device-evidence", type=Path)
    parser.add_argument("--vulnerability-evidence", type=Path)
    parser.add_argument("--run-unit", action="store_true")
    parser.add_argument("--run-e2e", action="store_true")
    parser.add_argument("--run-production-e2e", action="store_true")
    parser.add_argument("--run-offline", action="store_true")
    parser.add_argument("--run-security", action="store_true")
    parser.add_argument("--timeout", type=int, default=1800)
    parser.add_argument("--require-complete", action="store_true")
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()
    try:
        payload = report(args)
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(json.dumps(payload, indent=2, sort_keys=True, allow_nan=False) + "\n", encoding="utf-8")
        if args.json:
            print(json.dumps(payload, sort_keys=True, allow_nan=False))
        else:
            print("Validation report written to " + str(args.output))
        if args.command == "report":
            return 0
        return 0 if payload["ok"] and (payload["complete"] or not args.require_complete) else 1
    except (OSError, ValueError, subprocess.SubprocessError) as error:
        payload = {"schemaVersion": 1, "stage": 7, "ok": False, "errors": [str(error)]}
        if args.json:
            print(json.dumps(payload, sort_keys=True, allow_nan=False))
        else:
            print(f"ERROR: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
