#!/usr/bin/env python3
"""Stage and verify candidate/stable AOSP-WinScope publications."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import shutil
import subprocess
import zipfile
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
BASELINE = ROOT / "provenance/android17-baseline.json"
FILE_INVENTORY = ROOT / "provenance/android17-winscope-files.json"
LOCK = ROOT / "build/dependencies.lock.json"
PACKAGE_LOCK = ROOT / "package-lock.json"
DEFAULT_OUTPUT = ROOT / "dist/public"
VERSION_RE = re.compile(r"^17\.\d+\.\d+(?:-(?:alpha|rc)\.\d+)?$")


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


def write_json(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def git_commit() -> str:
    return subprocess.run(
        ["git", "rev-parse", "HEAD"], cwd=ROOT, capture_output=True, text=True, check=True
    ).stdout.strip()


def git_epoch() -> int:
    return int(
        subprocess.run(
            ["git", "show", "-s", "--format=%ct", "HEAD"],
            cwd=ROOT,
            capture_output=True,
            text=True,
            check=True,
        ).stdout.strip()
    )


def require_clean_tree() -> None:
    dirty = subprocess.run(
        ["git", "status", "--porcelain", "--untracked-files=all"],
        cwd=ROOT,
        capture_output=True,
        text=True,
        check=True,
    ).stdout.strip()
    if dirty:
        fail("publication requires a clean Git worktree")


def version_channel(version: str) -> str:
    if not isinstance(version, str) or not VERSION_RE.fullmatch(version):
        fail(f"unsupported Android 17 release version: {version}")
    if "-alpha." in version:
        return "alpha"
    if "-rc." in version:
        return "rc"
    if version != "17.0.0":
        fail("the first stable release must be exactly 17.0.0")
    return "stable"


def verify_validation(path: Path) -> dict[str, Any]:
    validation = read_json(path)
    if validation.get("schemaVersion") != 1 or validation.get("stage") != 7:
        fail("validation evidence is not a Stage 7 schema-v1 report")
    if validation.get("ok") is not True or validation.get("complete") is not True:
        fail("Stage 7 validation is not complete and passing")
    return validation


def verify_release_artifact(release_dir: Path, version: str) -> dict[str, Any]:
    if not release_dir.is_dir():
        fail(f"release directory is missing: {release_dir}")
    archive = release_dir / f"aosp-winscope-{version}.zip"
    sums = release_dir / "SHA256SUMS"
    attestation = release_dir / f"aosp-winscope-{version}.attestation.json"
    for path in (archive, sums, attestation):
        if not path.is_file() or path.stat().st_size == 0:
            fail(f"release artifact is missing: {path}")
    expected = sha256_file(archive)
    if f"{expected}  {archive.name}" not in sums.read_text(encoding="utf-8"):
        fail("SHA256SUMS does not match the release archive")
    attestation_data = read_json(attestation)
    subjects = attestation_data.get("subject")
    if not isinstance(subjects, list) or not any(
        isinstance(subject, dict)
        and subject.get("name") == archive.name
        and isinstance(subject.get("digest"), dict)
        and subject["digest"].get("sha256") == expected
        for subject in subjects
    ):
        fail("release attestation does not match the release archive")
    with zipfile.ZipFile(archive) as package:
        names = set(package.namelist())
    required = {
        "manifest.json",
        "release-manifest.json",
        "LICENSES/LICENSE",
        "LICENSES/NOTICE",
        "LICENSES/sbom.spdx.json",
        "LICENSES/attribution.json",
        "dependency-bundle/dependencies.lock.json",
    }
    missing = sorted(required - names)
    if missing:
        fail(f"release archive omits required evidence: {', '.join(missing)}")
    return {
        "archive": archive,
        "sums": sums,
        "attestation": attestation,
        "sha256": expected,
        "size": archive.stat().st_size,
    }


def frozen_inputs(version: str, validation: dict[str, Any], artifact: dict[str, Any]) -> dict[str, Any]:
    baseline = read_json(BASELINE)
    lock = read_json(LOCK)
    return {
        "schemaVersion": 1,
        "version": version,
        "baseline": baseline["baseline"],
        "sourceCommit": git_commit(),
        "sourceDateEpoch": git_epoch(),
        "productInputs": baseline["productInputs"],
        "toolchain": baseline["toolchain"],
        "dependencyLockSha256": sha256_file(LOCK),
        "packageLockSha256": sha256_file(PACKAGE_LOCK),
        "vendorFileInventorySha256": sha256_file(FILE_INVENTORY),
        "dependencyEntries": len(lock["dependencies"]),
        "validationReportSha256": validation["reportSha256"],
        "releaseArchiveSha256": artifact["sha256"],
    }


def publish(version: str, release_dir: Path, validation_path: Path, output: Path, tag: str | None) -> dict[str, Any]:
    channel = version_channel(version)
    if channel == "stable" and tag not in (None, "v17.0.0"):
        fail("stable release must be tagged v17.0.0")
    require_clean_tree()
    validation = verify_validation(validation_path)
    validation = {**validation, "reportSha256": sha256_file(validation_path)}
    artifact = verify_release_artifact(release_dir, version)
    target = output / version
    if target.exists():
        shutil.rmtree(target)
    target.mkdir(parents=True)
    copied = []
    for source in (artifact["archive"], artifact["sums"], artifact["attestation"], validation_path):
        destination = target / source.name
        shutil.copyfile(source, destination)
        copied.append(destination)

    frozen = frozen_inputs(version, validation, artifact)
    frozen_path = target / "frozen-inputs.json"
    write_json(frozen_path, frozen)
    copied.append(frozen_path)
    artifacts = [
        {
            "name": path.name,
            "sha256": sha256_file(path),
            "size": path.stat().st_size,
            "kind": "archive" if path.suffix == ".zip" else "evidence",
        }
        for path in sorted(copied, key=lambda item: item.name)
    ]
    index = {
        "schemaVersion": 1,
        "product": "aosp-winscope",
        "baseline": "android17-release",
        "version": version,
        "channel": channel,
        "tag": tag or f"v{version}",
        "sourceCommit": git_commit(),
        "sourceDateEpoch": git_epoch(),
        "support": {
            "status": "supported" if channel == "stable" else "prerelease",
            "securityUpdates": channel == "stable",
        },
        "publicationPolicy": {
            "protectedTagRequired": channel == "stable",
            "environmentApprovalRequired": True,
            "artifactsImmutable": True,
        },
        "aps": {
            "manifestSchemaVersion": 1,
            "archiveConsumerSupported": True,
            "sourceConsumerSupported": True,
            "bridgeProtocol": None,
        },
        "frozenInputs": {"path": frozen_path.name, "sha256": sha256_file(frozen_path)},
        "artifacts": artifacts,
    }
    index_path = target / "release-index.json"
    write_json(index_path, index)
    return {
        "ok": True,
        "version": version,
        "channel": channel,
        "directory": target.as_posix(),
        "index": index_path.as_posix(),
        "archiveSha256": artifact["sha256"],
        "artifacts": len(artifacts),
    }


def verify(index_path: Path) -> dict[str, Any]:
    index = read_json(index_path)
    if index.get("schemaVersion") != 1 or index.get("product") != "aosp-winscope":
        fail("unsupported release index")
    version = index.get("version")
    channel = version_channel(version)
    if index.get("channel") != channel or index.get("sourceCommit") != git_commit():
        fail("release index lineage mismatch")
    root = index_path.parent
    frozen = index.get("frozenInputs", {})
    if not isinstance(frozen, dict):
        fail("release index frozen input evidence is invalid")
    frozen_name = frozen.get("path")
    if not isinstance(frozen_name, str) or Path(frozen_name).name != frozen_name:
        fail("release index frozen input path is invalid")
    frozen_path = root / frozen_name
    if not isinstance(frozen.get("sha256"), str):
        fail("release index frozen input digest is invalid")
    if not frozen_path.is_file() or sha256_file(frozen_path) != frozen["sha256"]:
        fail("frozen input evidence digest mismatch")
    artifacts = index.get("artifacts")
    if not isinstance(artifacts, list) or not artifacts:
        fail("release index has no published artifacts")
    for artifact in artifacts:
        if (
            not isinstance(artifact, dict)
            or not isinstance(artifact.get("name"), str)
            or not isinstance(artifact.get("sha256"), str)
            or not isinstance(artifact.get("size"), int)
        ):
            fail("release index artifact entry is invalid")
        if Path(artifact["name"]).name != artifact["name"]:
            fail("release index artifact path is invalid")
        path = root / artifact["name"]
        if not path.is_file() or sha256_file(path) != artifact["sha256"] or path.stat().st_size != artifact["size"]:
            fail(f"published artifact digest mismatch: {artifact.get('name')}")
    if channel == "stable" and index.get("tag") != "v17.0.0":
        fail("stable release must be tagged v17.0.0")
    return {"ok": True, "version": version, "channel": channel, "artifactsVerified": len(index.get("artifacts", []))}


def emit(payload: dict[str, Any], as_json: bool) -> None:
    print(json.dumps(payload, sort_keys=True) if as_json else "Publication operation completed successfully.")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("command", choices=("publish", "verify"))
    parser.add_argument("--version", default="17.0.0-rc.1")
    parser.add_argument("--release-dir", type=Path, default=ROOT / "dist/release")
    parser.add_argument("--validation", type=Path, default=ROOT / "dist/validation/report.json")
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--index", type=Path)
    parser.add_argument("--tag")
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()
    try:
        if args.command == "publish":
            payload = publish(args.version, args.release_dir, args.validation, args.output, args.tag)
        else:
            if args.index is None:
                fail("--index is required for verify")
            payload = verify(args.index)
        emit(payload, args.json)
        return 0
    except (OSError, ValueError, subprocess.SubprocessError, zipfile.BadZipFile) as error:
        payload = {"ok": False, "errors": [str(error)]}
        if args.json:
            print(json.dumps(payload, sort_keys=True))
        else:
            print(f"ERROR: {error}")
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
