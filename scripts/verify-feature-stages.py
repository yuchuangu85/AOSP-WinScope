#!/usr/bin/env python3
"""Produce machine-readable exit evidence for standalone feature Stages 20-25."""

from __future__ import annotations

import argparse
import hashlib
import json
import subprocess
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_OUTPUT = ROOT / "dist/validation/feature-stages.json"
STAGES = {
    20: [
        "src/ui/trace_loading/file_loader_test.ts",
        "src/ui/trace_loading/trace_file_identifier.ts",
        "src/ui/trace_loading/warnings.ts",
    ],
    21: [
        "src/app/trace_collection/collect_traces_component.ts",
        "src/trace_collection/controller/trace_collection_controller.ts",
    ],
    22: [
        "src/app/trace_collection/trace_config_component.ng.html",
        "src/trace_collection/controller/trace_collection_controller.ts",
    ],
    23: [
        "src/app/trace_loading/upload_traces_component.ts",
        "src/legacy_file_readers/common/legacy_file_reader_factory.ts",
    ],
    24: [
        "src/app/trace_loading/upload_traces_component.ts",
        "src/app/viewer_factory.ts",
    ],
    25: [
        "src/app/window_manager/viewer_window_manager.ts",
        "src/app/surface_flinger/viewer_surface_flinger.ts",
    ],
}
COMMANDS = {
    "typescript": ["npx", "tsc", "--noEmit", "-p", "tsconfig.karma.json"],
    "python": ["python3", "-m", "unittest", "discover", "-s", "tests"],
    "go": ["go", "test", "./..."],
    "angularUnit": ["npm", "run", "test:unit:ci"],
}


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def git_commit() -> str:
    return subprocess.check_output(
        ["git", "rev-parse", "HEAD"], cwd=ROOT, text=True
    ).strip()


def require_clean_tree() -> None:
    dirty = subprocess.check_output(
        ["git", "status", "--porcelain", "--untracked-files=all"],
        cwd=ROOT,
        text=True,
    ).strip()
    if dirty:
        raise ValueError("feature-stage verification requires a clean Git worktree")


def run_check(name: str, command: list[str], timeout: int) -> dict[str, Any]:
    completed = subprocess.run(
        command,
        cwd=ROOT,
        capture_output=True,
        text=True,
        timeout=timeout,
    )
    return {
        "name": name,
        "status": "pass" if completed.returncode == 0 else "fail",
        "returncode": completed.returncode,
        "stdoutTail": completed.stdout[-2000:],
        "stderrTail": completed.stderr[-2000:],
    }


def verify(timeout: int, evidence_only: bool = False) -> dict[str, Any]:
    require_clean_tree()
    plan = (ROOT / "docs/REBUILD_PLAN.md").read_text(encoding="utf-8")
    stage_reports = []
    for stage, names in STAGES.items():
        files = []
        missing = []
        for name in names:
            path = ROOT / name
            if not path.is_file():
                missing.append(name)
                continue
            files.append({"path": name, "sha256": sha256_file(path)})
        documented = f"## Stage {stage} implementation evidence" in plan
        stage_reports.append({
            "stage": stage,
            "status": "pass" if not missing and documented else "fail",
            "documented": documented,
            "missing": missing,
            "files": files,
        })
    checks = [] if evidence_only else [run_check(name, command, timeout) for name, command in COMMANDS.items()]
    return {
        "schemaVersion": 1,
        "ok": all(item["status"] == "pass" for item in [*stage_reports, *checks]),
        "sourceCommit": git_commit(),
        "stages": stage_reports,
        "checks": checks,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--timeout", type=int, default=1800)
    parser.add_argument("--evidence-only", action="store_true")
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()
    try:
        report = verify(args.timeout, args.evidence_only)
    except (OSError, ValueError, subprocess.SubprocessError) as error:
        report = {"schemaVersion": 1, "ok": False, "errors": [str(error)]}
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(
        json.dumps(report, indent=2, sort_keys=True) + "\n", encoding="utf-8"
    )
    print(json.dumps(report, sort_keys=True) if args.json else args.output)
    return 0 if report.get("ok") is True else 1


if __name__ == "__main__":
    raise SystemExit(main())
