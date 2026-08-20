#!/usr/bin/env python3
"""Verify release support lifecycle and security advisory evidence."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any

VERSION_RE = re.compile(
    r"^(?P<major>\d+)\.(?P<generation>\d+)\.(?P<patch>\d+)"
    r"(?:-(?P<channel>alpha|rc)\.(?P<pre>\d+))?$"
)
SHA256_RE = re.compile(r"^[0-9a-f]{64}$")
STATUSES = {"supported", "security-transition", "prerelease", "eol", "withdrawn"}
SEVERITIES = {"critical", "high", "moderate", "low"}
ADVISORY_STATUSES = {"open", "fixed", "mitigated", "withdrawn"}
POLICY = {
    "criticalAssessmentHours": 24,
    "criticalFixOrMitigationHours": 72,
    "highAssessmentWorkingDays": 3,
    "highFixWorkingDays": 7,
}


def fail(message: str) -> None:
    raise ValueError(message)


def read_json(path: Path) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        raise ValueError(f"cannot read JSON evidence: {path}: {error}") from error
    if not isinstance(value, dict):
        fail(f"JSON evidence must be an object: {path}")
    return value


def parse_version(value: Any) -> dict[str, Any]:
    match = VERSION_RE.fullmatch(value) if isinstance(value, str) else None
    if match is None:
        fail(f"unsupported release version: {value}")
    result = match.groupdict()
    return {
        "major": int(result["major"]),
        "generation": int(result["generation"]),
        "patch": int(result["patch"]),
        "channel": result["channel"] or "stable",
        "prerelease": int(result["pre"]) if result["pre"] else None,
    }


def parse_time(value: Any, field: str) -> datetime:
    if not isinstance(value, str):
        fail(f"{field} must be an ISO-8601 timestamp")
    try:
        parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError as error:
        raise ValueError(f"{field} must be an ISO-8601 timestamp") from error
    if parsed.tzinfo is None:
        fail(f"{field} must include a timezone")
    return parsed.astimezone(timezone.utc)


def iso_time(value: datetime) -> str:
    return value.astimezone(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def release_time(index: dict[str, Any]) -> datetime:
    return parse_time(index.get("publishedAt"), "publishedAt")


def verify_advisory(path: Path) -> dict[str, Any]:
    advisory = read_json(path)
    required = ("schemaVersion", "id", "severity", "status", "publishedAt", "summary", "affectedVersions")
    if advisory.get("schemaVersion") != 1 or any(field not in advisory for field in required):
        fail(f"security advisory schema is incomplete: {path}")
    if not isinstance(advisory["id"], str) or not advisory["id"].strip():
        fail(f"invalid security advisory id: {path}")
    severity = advisory["severity"].lower() if isinstance(advisory["severity"], str) else ""
    status = advisory["status"].lower() if isinstance(advisory["status"], str) else ""
    if severity not in SEVERITIES or status not in ADVISORY_STATUSES:
        fail(f"invalid security advisory severity or status: {path}")
    parse_time(advisory["publishedAt"], "publishedAt")
    if not isinstance(advisory["summary"], str) or not advisory["summary"].strip():
        fail(f"security advisory summary is empty: {path}")
    affected = advisory["affectedVersions"]
    if not isinstance(affected, list) or not affected or any(not isinstance(version, str) for version in affected):
        fail(f"security advisory affectedVersions is invalid: {path}")
    for version in affected:
        parse_version(version)
    if status in {"fixed", "mitigated"}:
        fixed = advisory.get("fixedVersion")
        if not isinstance(fixed, str):
            fail(f"resolved security advisory needs fixedVersion: {path}")
        parse_version(fixed)
    artifacts = advisory.get("artifacts", [])
    if not isinstance(artifacts, list):
        fail(f"security advisory artifacts are invalid: {path}")
    for artifact in artifacts:
        if not isinstance(artifact, dict):
            fail(f"security advisory artifact entry is invalid: {path}")
        name, digest = artifact.get("path"), artifact.get("sha256")
        if not isinstance(name, str) or Path(name).name != name or not isinstance(digest, str) or not SHA256_RE.fullmatch(digest):
            fail(f"security advisory artifact entry is invalid: {path}")
        artifact_path = path.parent / name
        if not artifact_path.is_file() or hashlib.sha256(artifact_path.read_bytes()).hexdigest() != digest:
            fail(f"security advisory artifact digest mismatch: {name}")
    return {"ok": True, "id": advisory["id"], "status": status}


def validate_advisory_references(index_path: Path, references: list[Any]) -> None:
    seen_paths: set[str] = set()
    seen_ids: set[str] = set()
    for reference in references:
        if not isinstance(reference, dict):
            fail(f"security advisory reference is invalid: {index_path}")
        name, digest = reference.get("path"), reference.get("sha256")
        if (
            not isinstance(name, str)
            or Path(name).name != name
            or not isinstance(digest, str)
            or not SHA256_RE.fullmatch(digest)
            or name in seen_paths
        ):
            fail(f"security advisory reference is invalid: {index_path}")
        advisory_path = index_path.parent / name
        if not advisory_path.is_file() or hashlib.sha256(advisory_path.read_bytes()).hexdigest() != digest:
            fail(f"security advisory digest mismatch: {name}")
        advisory = verify_advisory(advisory_path)
        if advisory["id"] in seen_ids:
            fail(f"duplicate security advisory: {advisory['id']}")
        seen_paths.add(name)
        seen_ids.add(advisory["id"])


def validate_index(index_path: Path) -> dict[str, Any]:
    index = read_json(index_path)
    if index.get("schemaVersion") != 1 or index.get("product") != "aosp-winscope":
        fail(f"unsupported release index: {index_path}")
    version = parse_version(index.get("version"))
    support = index.get("support")
    if (
        not isinstance(support, dict)
        or support.get("status") not in STATUSES
        or not isinstance(support.get("securityUpdates"), bool)
        or support.get("baselineGeneration") != version["generation"]
        or support.get("track") not in {"current", "previous", "prerelease", "eol", "withdrawn"}
        or not isinstance(support.get("withdrawn"), bool)
    ):
        fail(f"release index support metadata is invalid: {index_path}")
    withdrawal = support.get("withdrawal")
    if support["withdrawn"]:
        if (
            support["status"] != "withdrawn"
            or support["track"] != "withdrawn"
            or support["securityUpdates"]
            or support.get("securitySupportUntil") is not None
            or not isinstance(withdrawal, dict)
            or not isinstance(withdrawal.get("reason"), str)
            or not withdrawal["reason"].strip()
        ):
            fail(f"withdrawn release metadata is invalid: {index_path}")
        parse_time(withdrawal.get("effectiveAt"), "withdrawal.effectiveAt")
    elif withdrawal is not None:
        fail(f"active release cannot carry withdrawal metadata: {index_path}")
    if version["channel"] != "stable" and (
        support["status"] != "prerelease"
        or support["track"] != "prerelease"
        or support["securityUpdates"]
        or support.get("securitySupportUntil") is not None
    ):
        fail(f"prerelease support metadata is invalid: {index_path}")
    if version["channel"] == "stable" and (
        support["status"], support["track"], support["securityUpdates"]
    ) not in {
        ("supported", "current", True),
        ("security-transition", "previous", True),
        ("eol", "eol", False),
    } and not support["withdrawn"]:
        fail(f"stable support metadata is invalid: {index_path}")
    if support.get("securitySupportUntil") is not None:
        if support["status"] != "security-transition":
            fail(f"security support deadline is invalid: {index_path}")
        parse_time(support["securitySupportUntil"], "securitySupportUntil")
    elif support["status"] == "security-transition":
        fail(f"security transition needs a deadline: {index_path}")
    response = index.get("securityResponse")
    if not isinstance(response, dict) or response.get("schemaVersion") != 1:
        fail(f"release index omits security response metadata: {index_path}")
    if response.get("policy") != POLICY or not isinstance(response.get("advisories"), list):
        fail(f"release index security response policy is invalid: {index_path}")
    validate_advisory_references(index_path, response["advisories"])
    release_time(index)
    return {"path": index_path, "index": index, "version": version}


def expected_statuses(releases: list[dict[str, Any]], now: datetime) -> dict[str, dict[str, Any]]:
    all_stable = [item for item in releases if item["version"]["channel"] == "stable"]
    stable = [item for item in all_stable if not item["index"]["support"]["withdrawn"]]
    current_baseline = max(
        ((item["version"]["major"], item["version"]["generation"]) for item in all_stable),
        default=None,
    )
    latest_current = None
    transition_baseline = None
    transition_release = None
    transition_days = 90
    if current_baseline is not None:
        current_events = [item for item in all_stable if (item["version"]["major"], item["version"]["generation"]) == current_baseline]
        current = [item for item in stable if (item["version"]["major"], item["version"]["generation"]) == current_baseline]
        latest_current = max(current, key=lambda item: item["version"]["patch"], default=None)
        first_current = min(current_events, key=lambda item: release_time(item["index"]))
        if current_baseline[0] == 18:
            transition_baseline = max(
                ((item["version"]["major"], item["version"]["generation"]) for item in stable if item["version"]["major"] == 17),
                default=None,
            )
            transition_days = 365
        else:
            transition_baseline = (current_baseline[0], current_baseline[1] - 1)
        previous = [item for item in stable if (item["version"]["major"], item["version"]["generation"]) == transition_baseline]
        if previous:
            transition_release = first_current
    result = {}
    for item in releases:
        index, version, support = item["index"], item["version"], item["index"]["support"]
        key = (version["major"], version["generation"])
        if support["withdrawn"]:
            values = ("withdrawn", False, "withdrawn", None)
        elif version["channel"] != "stable":
            values = ("prerelease", False, "prerelease", None)
        elif item is latest_current:
            values = ("supported", True, "current", None)
        elif transition_release is not None and key == transition_baseline:
            latest_previous = max(
                (old for old in stable if (old["version"]["major"], old["version"]["generation"]) == transition_baseline),
                key=lambda old: old["version"]["patch"],
            )
            deadline = release_time(transition_release["index"]) + timedelta(days=transition_days)
            values = (
                ("security-transition", True, "previous", iso_time(deadline))
                if item is latest_previous and now < deadline
                else ("eol", False, "eol", None)
            )
        else:
            values = ("eol", False, "eol", None)
        result[index["version"]] = dict(zip(("status", "securityUpdates", "track", "securitySupportUntil"), values))
    return result


def verify_policy(index_paths: list[Path], now: datetime | None = None) -> dict[str, Any]:
    if not index_paths:
        fail("at least one --index is required")
    releases = [validate_index(path) for path in index_paths]
    versions = [item["index"]["version"] for item in releases]
    if len(set(versions)) != len(versions):
        fail("support policy contains duplicate release versions")
    expected = expected_statuses(releases, now or datetime.now(timezone.utc))
    for item in releases:
        version, actual = item["index"]["version"], item["index"]["support"]
        for field in ("status", "securityUpdates", "track", "securitySupportUntil"):
            if actual.get(field) != expected[version][field]:
                fail(f"support policy mismatch for {version}: {field}")
    return {"ok": True, "schemaVersion": 1, "releases": len(releases), "statuses": {version: expected[version]["status"] for version in sorted(expected)}}


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("command", choices=("verify", "verify-advisory"))
    parser.add_argument("--index", action="append", type=Path)
    parser.add_argument("--advisory", action="append", type=Path)
    parser.add_argument("--as-of")
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()
    try:
        if args.command == "verify-advisory":
            if not args.advisory:
                fail("at least one --advisory is required")
            payload = {"ok": True, "advisories": [verify_advisory(path) for path in args.advisory]}
        else:
            as_of = parse_time(args.as_of, "--as-of") if args.as_of else None
            payload = verify_policy(args.index or [], as_of)
        print(json.dumps(payload, sort_keys=True) if args.json else "Support evidence verified successfully.")
        return 0
    except (OSError, ValueError) as error:
        payload = {"ok": False, "errors": [str(error)]}
        print(json.dumps(payload, sort_keys=True) if args.json else f"ERROR: {error}")
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
