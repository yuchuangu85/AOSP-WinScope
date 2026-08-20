#!/usr/bin/env python3
"""Scan tracked product source for secrets and unsafe standalone-runtime APIs."""

from __future__ import annotations

import argparse
import json
import re
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
TEXT_SUFFIXES = {
    ".css", ".go", ".html", ".js", ".json", ".md", ".py", ".scss", ".ts", ".yaml", ".yml"
}
EXCLUDED_PREFIXES = ("docs/", "src/test/", "tests/")
SECRET_PATTERNS = {
    "private-key": re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----"),
    "github-token": re.compile(r"\bgh[opsu]_[A-Za-z0-9]{30,}\b"),
    "generic-secret": re.compile(
        r"(?i)(?:api[_-]?key|access[_-]?token|client[_-]?secret)\s*[:=]\s*['\"][^'\"]{16,}['\"]"
    ),
}
RUNTIME_PATTERNS = {
    "external-request-literal": re.compile(
        r"\b(?:fetch|WebSocket|EventSource)\s*\(\s*['\"](?:https?|wss?)://",
        re.IGNORECASE,
    ),
    "dynamic-code": re.compile(r"\b(?:eval|Function)\s*\("),
}
RUNTIME_PREFIXES = ("src/app/", "src/common/", "src/runtime/", "src/ui/")


def tracked_files() -> list[Path]:
    output = subprocess.check_output(
        ["git", "ls-files", "-z"], cwd=ROOT
    )
    return [ROOT / value.decode("utf-8") for value in output.split(b"\0") if value]


def scan() -> list[dict[str, object]]:
    findings: list[dict[str, object]] = []
    for path in tracked_files():
        relative = path.relative_to(ROOT).as_posix()
        if path.suffix not in TEXT_SUFFIXES or relative.startswith(EXCLUDED_PREFIXES):
            continue
        try:
            lines = path.read_text(encoding="utf-8").splitlines()
        except (OSError, UnicodeDecodeError):
            continue
        for line_number, line in enumerate(lines, start=1):
            for name, pattern in SECRET_PATTERNS.items():
                if pattern.search(line):
                    findings.append({"kind": name, "path": relative, "line": line_number})
            if relative.startswith(RUNTIME_PREFIXES) and not path.stem.endswith("_test"):
                for name, pattern in RUNTIME_PATTERNS.items():
                    if pattern.search(line):
                        findings.append({"kind": name, "path": relative, "line": line_number})
    return findings


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()
    findings = scan()
    report = {"schemaVersion": 1, "ok": not findings, "findings": findings}
    print(json.dumps(report, sort_keys=True) if args.json else report)
    return 0 if report["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
