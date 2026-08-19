#!/usr/bin/env python3
"""Verify the clean-room Android 17 WinScope vendor baseline."""

from __future__ import annotations

import argparse
import hashlib
import json
import subprocess
import sys
from pathlib import Path
from typing import Any


REPOSITORY_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_METADATA = Path("provenance/android17-baseline.json")

EXPECTED = {
    "winscope_revision": "4dafd114fab3c3d9543a5aff0ad097f479915176",
    "winscope_tree": "36d46569800176ce00f60ef27c7dfcca1e967886",
    "winscope_tar_sha256": "9ed6c973ae70296f85b47a712f80e65719adacb63f5eaf5956b47ff7147db465",
    "perfetto_revision": "ece66975738007dd0978b911d8a2077e49b8f31e",
    "framework_revision": "94b4c163b7dfe5ce3607f7bb8456f9573f7de57d",
    "systemui_revision": "11e04f60f563aed48e4ec080bd7bde06bae1b2f3",
    "node": "24.19.0",
    "npm": "11.17.0",
    "go": "1.26.6",
    "python_supported": ["3.11", "3.12", "3.13"],
    "python_ci": "3.12",
    "vendor_branch": "upstream/android17-release",
    "file_count": 1086,
}


class VerificationError(RuntimeError):
    """A baseline invariant was not satisfied."""


def require(condition: bool, message: str) -> None:
    if not condition:
        raise VerificationError(message)


def git(*args: str, check: bool = True) -> str:
    result = subprocess.run(
        ["git", *args],
        cwd=REPOSITORY_ROOT,
        capture_output=True,
        text=True,
    )
    if check and result.returncode != 0:
        detail = result.stderr.strip() or result.stdout.strip()
        raise VerificationError(f"git {' '.join(args)} failed: {detail}")
    return result.stdout.strip()


def load_json(path: Path) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        raise VerificationError(f"cannot read {path}: {error}") from error
    require(isinstance(value, dict), f"{path} must contain a JSON object")
    return value


def nested(value: dict[str, Any], *keys: str) -> Any:
    current: Any = value
    for key in keys:
        require(isinstance(current, dict) and key in current, f"missing metadata field: {'.'.join(keys)}")
        current = current[key]
    return current


def verify_metadata(metadata: dict[str, Any]) -> None:
    checks = [
        (nested(metadata, "schemaVersion"), 1, "schemaVersion"),
        (nested(metadata, "baseline"), "android17-release", "baseline"),
        (
            nested(metadata, "productInputs", "winscope", "revision"),
            EXPECTED["winscope_revision"],
            "WinScope revision",
        ),
        (
            nested(metadata, "productInputs", "winscope", "subtreeGitTree"),
            EXPECTED["winscope_tree"],
            "WinScope subtree Git tree",
        ),
        (
            nested(metadata, "productInputs", "winscope", "acquisition", "canonicalTarSha256"),
            EXPECTED["winscope_tar_sha256"],
            "WinScope canonical tar SHA-256",
        ),
        (
            nested(metadata, "productInputs", "winscope", "acquisition", "canonicalTarTreeish"),
            EXPECTED["winscope_tree"],
            "WinScope canonical tar treeish",
        ),
        (
            nested(metadata, "productInputs", "winscope", "acquisition", "canonicalTarFileCount"),
            EXPECTED["file_count"],
            "WinScope canonical tar file count",
        ),
        (
            nested(metadata, "productInputs", "perfetto", "revision"),
            EXPECTED["perfetto_revision"],
            "Perfetto revision",
        ),
        (
            nested(metadata, "contextRevisions", "framework", "revision"),
            EXPECTED["framework_revision"],
            "Framework context revision",
        ),
        (
            nested(metadata, "contextRevisions", "systemUi", "revision"),
            EXPECTED["systemui_revision"],
            "SystemUI context revision",
        ),
        (nested(metadata, "vendor", "branch"), EXPECTED["vendor_branch"], "vendor branch"),
        (nested(metadata, "vendor", "tree"), EXPECTED["winscope_tree"], "vendor tree"),
        (nested(metadata, "vendor", "fileCount"), EXPECTED["file_count"], "vendor file count"),
        (nested(metadata, "toolchain", "node"), EXPECTED["node"], "Node version"),
        (nested(metadata, "toolchain", "npm"), EXPECTED["npm"], "npm version"),
        (nested(metadata, "toolchain", "go"), EXPECTED["go"], "Go version"),
        (
            nested(metadata, "toolchain", "python", "supported"),
            EXPECTED["python_supported"],
            "supported Python versions",
        ),
        (nested(metadata, "toolchain", "python", "ci"), EXPECTED["python_ci"], "CI Python version"),
    ]
    for actual, expected, label in checks:
        require(actual == expected, f"{label} mismatch: expected {expected!r}, got {actual!r}")

    acquisition = nested(metadata, "productInputs", "winscope", "acquisition")
    require(
        acquisition.get("method") == "commit-addressed-partial-git-clone",
        "WinScope acquisition must use a commit-addressed partial Git clone",
    )
    require(acquisition.get("sourceDateEpoch") == 1778818815, "source timestamp mismatch")
    require(
        acquisition.get("transportArchiveBytesPinned") is False,
        "unstable HTTP archive bytes must not be treated as pinned evidence",
    )
    require(
        nested(metadata, "cleanRoom", "legacyProjectSourceAllowed") is False,
        "legacy project source must remain forbidden",
    )


def verify_canonical_archive(metadata: dict[str, Any]) -> None:
    acquisition = nested(metadata, "productInputs", "winscope", "acquisition")
    process = subprocess.Popen(
        [
            "git",
            "archive",
            "--format=tar",
            f"--mtime=@{acquisition['sourceDateEpoch']}",
            acquisition["canonicalTarTreeish"],
        ],
        cwd=REPOSITORY_ROOT,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    require(process.stdout is not None and process.stderr is not None, "cannot capture git archive output")
    digest = hashlib.sha256()
    while chunk := process.stdout.read(1024 * 1024):
        digest.update(chunk)
    stderr = process.stderr.read().decode(errors="replace").strip()
    return_code = process.wait()
    require(return_code == 0, f"git archive failed: {stderr}")
    require(digest.hexdigest() == acquisition["canonicalTarSha256"], "canonical WinScope tar SHA-256 mismatch")


def resolve_vendor_ref(branch: str) -> tuple[str, str]:
    candidates = (
        f"refs/heads/{branch}",
        f"refs/remotes/origin/{branch}",
    )
    for candidate in candidates:
        result = subprocess.run(
            ["git", "rev-parse", "--verify", f"{candidate}^{{commit}}"],
            cwd=REPOSITORY_ROOT,
            capture_output=True,
            text=True,
        )
        if result.returncode == 0:
            return candidate, result.stdout.strip()
    raise VerificationError(f"vendor branch not found in local or origin refs: {branch}")


def parse_tree(commit: str) -> list[dict[str, Any]]:
    output = subprocess.check_output(
        ["git", "ls-tree", "-r", "-z", commit],
        cwd=REPOSITORY_ROOT,
    )
    entries: list[dict[str, Any]] = []
    for raw_entry in output.split(b"\0"):
        if not raw_entry:
            continue
        metadata, raw_path = raw_entry.split(b"\t", 1)
        mode, object_type, object_id = metadata.decode("ascii").split()
        require(object_type == "blob", f"unsupported vendor object type {object_type}")
        entries.append(
            {
                "path": raw_path.decode("utf-8", errors="surrogateescape"),
                "mode": mode,
                "gitBlob": object_id,
            }
        )
    return entries


def read_blobs(object_ids: list[str]) -> dict[str, bytes]:
    process = subprocess.Popen(
        ["git", "cat-file", "--batch"],
        cwd=REPOSITORY_ROOT,
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    request = "".join(f"{object_id}\n" for object_id in object_ids).encode("ascii")
    stdout, stderr = process.communicate(request)
    require(process.returncode == 0, f"git cat-file --batch failed: {stderr.decode().strip()}")

    contents: dict[str, bytes] = {}
    offset = 0
    for requested_id in object_ids:
        newline = stdout.find(b"\n", offset)
        require(newline >= 0, "truncated git cat-file response")
        header = stdout[offset:newline].decode("ascii").split()
        require(len(header) == 3 and header[1] == "blob", f"invalid git cat-file response for {requested_id}")
        object_id, _, raw_size = header
        size = int(raw_size)
        start = newline + 1
        end = start + size
        require(end < len(stdout) and stdout[end : end + 1] == b"\n", "truncated Git blob content")
        contents[requested_id] = stdout[start:end]
        offset = end + 1
    require(offset == len(stdout), "unexpected trailing git cat-file output")
    return contents


def verify_vendor(metadata: dict[str, Any]) -> tuple[bool, int]:
    vendor = nested(metadata, "vendor")
    resolved_ref, resolved_commit = resolve_vendor_ref(vendor["branch"])
    require(resolved_commit == vendor["commit"], f"{resolved_ref} does not match recorded vendor commit")
    require(git("show", "-s", "--format=%P", resolved_commit) == "", "vendor import commit must be orphaned")
    require(git("show", "-s", "--format=%T", resolved_commit) == vendor["tree"], "vendor commit tree mismatch")

    ancestry = subprocess.run(
        ["git", "merge-base", "--is-ancestor", resolved_commit, "HEAD"],
        cwd=REPOSITORY_ROOT,
        capture_output=True,
    )
    require(ancestry.returncode == 0, "vendor import commit is not an ancestor of HEAD")

    inventory_path = REPOSITORY_ROOT / vendor["fileInventory"]
    inventory = load_json(inventory_path)
    require(inventory.get("schemaVersion") == 1, "unsupported inventory schema")
    require(inventory.get("source", {}).get("revision") == EXPECTED["winscope_revision"], "inventory revision mismatch")
    require(inventory.get("source", {}).get("subtreeGitTree") == EXPECTED["winscope_tree"], "inventory source tree mismatch")
    require(inventory.get("vendor", {}).get("commit") == resolved_commit, "inventory vendor commit mismatch")
    require(inventory.get("vendor", {}).get("tree") == vendor["tree"], "inventory vendor tree mismatch")

    actual_entries = parse_tree(resolved_commit)
    recorded_entries = inventory.get("files")
    require(isinstance(recorded_entries, list), "inventory files must be an array")
    require(len(actual_entries) == EXPECTED["file_count"], "vendor commit file count mismatch")
    require(inventory.get("fileCount") == len(actual_entries), "inventory file count mismatch")
    require(len(recorded_entries) == len(actual_entries), "inventory entry count mismatch")

    blobs = read_blobs(list(dict.fromkeys(entry["gitBlob"] for entry in actual_entries)))
    expected_records = []
    for entry in actual_entries:
        content = blobs[entry["gitBlob"]]
        expected_records.append(
            {
                **entry,
                "sha256": hashlib.sha256(content).hexdigest(),
                "size": len(content),
            }
        )
    require(recorded_entries == expected_records, "vendor file inventory does not match the recorded commit")
    return True, len(expected_records)


def verify_toolchain_declarations(metadata: dict[str, Any]) -> None:
    toolchain = nested(metadata, "toolchain")
    require((REPOSITORY_ROOT / ".nvmrc").read_text().strip() == toolchain["node"], ".nvmrc mismatch")
    require((REPOSITORY_ROOT / ".node-version").read_text().strip() == toolchain["node"], ".node-version mismatch")

    package = load_json(REPOSITORY_ROOT / "package.json")
    require(package.get("packageManager") == f"npm@{toolchain['npm']}", "packageManager mismatch")
    require(package.get("engines") == {"node": toolchain["node"], "npm": toolchain["npm"]}, "package engines mismatch")

    package_lock = load_json(REPOSITORY_ROOT / "package-lock.json")
    root_package = package_lock.get("packages", {}).get("", {})
    require(root_package.get("engines") == package["engines"], "package-lock engines mismatch")


def verify_legacy_assets_absent(metadata: dict[str, Any]) -> bool:
    prohibited = nested(metadata, "cleanRoom", "prohibitedPaths")
    require(isinstance(prohibited, list) and prohibited, "clean-room prohibited path list is empty")
    tracked = set(git("ls-files").splitlines())
    for path in prohibited:
        require(isinstance(path, str) and path, "invalid prohibited path")
        normalized = path.rstrip("/")
        tracked_match = normalized in tracked or any(item.startswith(f"{normalized}/") for item in tracked)
        disk_match = (REPOSITORY_ROOT / normalized).exists()
        require(not tracked_match and not disk_match, f"prohibited legacy asset is present: {path}")
    return True


def verification_report(metadata_path: Path) -> dict[str, Any]:
    metadata = load_json(metadata_path)
    verify_metadata(metadata)
    vendor_verified, files_verified = verify_vendor(metadata)
    verify_canonical_archive(metadata)
    verify_toolchain_declarations(metadata)
    legacy_absent = verify_legacy_assets_absent(metadata)
    return {
        "ok": True,
        "baseline": metadata["baseline"],
        "productInputs": metadata["productInputs"],
        "contextRevisions": metadata["contextRevisions"],
        "toolchain": metadata["toolchain"],
        "vendorBranchVerified": vendor_verified,
        "legacyAssetsAbsent": legacy_absent,
        "filesVerified": files_verified,
        "errors": [],
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--json", action="store_true", help="emit a machine-readable report")
    parser.add_argument(
        "--metadata",
        type=Path,
        default=DEFAULT_METADATA,
        help="metadata file to verify (relative paths are resolved from the repository root)",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    metadata_path = args.metadata if args.metadata.is_absolute() else REPOSITORY_ROOT / args.metadata
    try:
        report = verification_report(metadata_path)
    except (KeyError, OSError, subprocess.SubprocessError, VerificationError) as error:
        report = {
            "ok": False,
            "vendorBranchVerified": False,
            "legacyAssetsAbsent": False,
            "filesVerified": 0,
            "errors": [str(error)],
        }

    if args.json:
        print(json.dumps(report, sort_keys=True))
    elif report["ok"]:
        print(f"Android 17 baseline verified ({report['filesVerified']} vendor files).")
    else:
        for error in report["errors"]:
            print(f"ERROR: {error}", file=sys.stderr)
    return 0 if report["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
