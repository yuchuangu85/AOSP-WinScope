#!/usr/bin/env python3
"""Enforces zero runtime vulnerabilities and expiring build-only exceptions."""

from __future__ import annotations

import argparse
import datetime as dt
import json
import pathlib
import subprocess
import sys
from typing import Any


ROOT = pathlib.Path(__file__).resolve().parents[1]
DEFAULT_EXCEPTIONS = ROOT / "configs" / "npm-audit-exceptions.json"
BLOCKING_SEVERITIES = {"high", "critical"}


def run_audit(*extra_args: str) -> dict[str, Any]:
    completed = subprocess.run(
        ["npm", "audit", "--json", *extra_args],
        cwd=ROOT,
        check=False,
        capture_output=True,
        text=True,
    )
    try:
        return json.loads(completed.stdout)
    except json.JSONDecodeError as error:
        raise RuntimeError(
            f"npm audit did not return JSON (exit {completed.returncode}): "
            f"{completed.stderr.strip()}"
        ) from error


def blocking_advisories(report: dict[str, Any]) -> dict[tuple[str, int], dict[str, Any]]:
    vulnerabilities = report.get("vulnerabilities", {})
    advisories: dict[tuple[str, int], dict[str, Any]] = {}
    visited: set[str] = set()

    def visit(package: str) -> None:
        if package in visited:
            return
        visited.add(package)
        vulnerability = vulnerabilities.get(package, {})
        for cause in vulnerability.get("via", []):
            if isinstance(cause, str):
                visit(cause)
            elif cause.get("severity") in BLOCKING_SEVERITIES:
                source = cause.get("source")
                dependency = cause.get("dependency") or cause.get("name") or package
                if not isinstance(source, int):
                    raise ValueError(f"blocking advisory for {dependency} has no numeric source")
                advisories[(dependency, source)] = cause

    for package, vulnerability in vulnerabilities.items():
        if vulnerability.get("severity") in BLOCKING_SEVERITIES:
            visit(package)
    return advisories


def validate(
    runtime_report: dict[str, Any],
    complete_report: dict[str, Any],
    policy: dict[str, Any],
    today: dt.date,
) -> dict[str, Any]:
    runtime = blocking_advisories(runtime_report)
    if runtime:
        names = ", ".join(f"{name}#{source}" for name, source in sorted(runtime))
        raise ValueError(f"runtime high/critical vulnerabilities are not permitted: {names}")

    configured: dict[tuple[str, int], dict[str, Any]] = {}
    for exception in policy.get("exceptions", []):
        key = (exception["package"], exception["source"])
        if key in configured:
            raise ValueError(f"duplicate audit exception: {key[0]}#{key[1]}")
        expiry = dt.date.fromisoformat(exception["expires"])
        if expiry < today:
            raise ValueError(f"expired audit exception: {key[0]}#{key[1]} ({expiry})")
        if exception.get("severity") not in BLOCKING_SEVERITIES:
            raise ValueError(f"invalid exception severity: {key[0]}#{key[1]}")
        if len(exception.get("reason", "").strip()) < 40:
            raise ValueError(f"audit exception reason is not specific: {key[0]}#{key[1]}")
        configured[key] = exception

    actual = blocking_advisories(complete_report)
    missing = sorted(set(actual) - set(configured))
    stale = sorted(set(configured) - set(actual))
    if missing:
        names = ", ".join(f"{name}#{source}" for name, source in missing)
        raise ValueError(f"unapproved build-chain vulnerabilities: {names}")
    if stale:
        names = ", ".join(f"{name}#{source}" for name, source in stale)
        raise ValueError(f"stale audit exceptions must be removed: {names}")

    return {
        "schemaVersion": 1,
        "runtimeBlockingVulnerabilities": 0,
        "buildChainExceptions": [
            {
                "package": name,
                "source": source,
                "severity": actual[(name, source)]["severity"],
                "expires": configured[(name, source)]["expires"],
            }
            for name, source in sorted(actual)
        ],
        "passed": True,
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--exceptions", type=pathlib.Path, default=DEFAULT_EXCEPTIONS)
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()
    try:
        policy = json.loads(args.exceptions.read_text())
        result = validate(
            run_audit("--omit=dev"),
            run_audit(),
            policy,
            dt.date.today(),
        )
    except (OSError, RuntimeError, ValueError, KeyError, json.JSONDecodeError) as error:
        if args.json:
            print(json.dumps({"passed": False, "error": str(error)}, indent=2))
        else:
            print(f"npm audit policy failed: {error}", file=sys.stderr)
        return 1
    print(json.dumps(result, indent=2) if args.json else "npm audit policy passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
