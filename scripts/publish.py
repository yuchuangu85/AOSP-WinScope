#!/usr/bin/env python3
"""Stage and verify candidate/stable AOSP-WinScope publications."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import zipfile
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT / "scripts") not in sys.path:
    sys.path.insert(0, str(ROOT / "scripts"))
from support import validate_index as validate_support_index

BASELINE = ROOT / "provenance/android17-baseline.json"
FILE_INVENTORY = ROOT / "provenance/android17-winscope-files.json"
LOCK = ROOT / "build/dependencies.lock.json"
PACKAGE_LOCK = ROOT / "package-lock.json"
DEFAULT_OUTPUT = ROOT / "dist/public"
DEFAULT_REPRODUCIBILITY = ROOT / "dist/validation/reproducibility.json"
DEFAULT_RELEASE_IMAGE_REPORT = ROOT / "dist/validation/release-image.json"
DEFAULT_GUIDE = ROOT / "docs/APS_INTEGRATION.md"
APS_VERIFIER = ROOT / "scripts/verify-aps-release.py"
SECURITY_RESPONSE_POLICY = {
    "criticalAssessmentHours": 24,
    "criticalFixOrMitigationHours": 72,
    "highAssessmentWorkingDays": 3,
    "highFixWorkingDays": 7,
}
VERSION_RE = re.compile(r"^17\.\d+\.\d+(?:-(?:alpha|rc)\.\d+)?$")
IMAGE_RE = re.compile(r"^[a-z0-9][a-z0-9._/-]*@sha256:[0-9a-f]{64}$")
IMAGE_ID_RE = re.compile(r"^sha256:[0-9a-f]{64}$")
REQUIRED_RELEASE_IMAGE_TOOLS = (
    "bash",
    "base64",
    "sha256sum",
    "mkdir",
    "rm",
    "cut",
    "find",
    "xargs",
    "tar",
    "gzip",
    "unzip",
    "curl",
    "wget",
    "git",
    "gh",
    "google-chrome",
    "cc",
    "c++",
    "make",
    "ar",
)


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
    checks = validation.get("checks")
    required = {"release:reproducibility", "runtime:security"}
    passing = {
        check.get("name")
        for check in checks
        if isinstance(check, dict) and check.get("status") == "pass"
    } if isinstance(checks, list) else set()
    missing = sorted(required - passing)
    if missing:
        fail(f"final publication is missing passing gates: {', '.join(missing)}")
    return validation


def verify_release_image(path: Path, build_image: str) -> dict[str, Any]:
    evidence = read_json(path)
    tools = evidence.get("tools")
    valid = (
        evidence.get("schemaVersion") == 1
        and evidence.get("ok") is True
        and evidence.get("image") == build_image
        and isinstance(evidence.get("imageId"), str)
        and IMAGE_ID_RE.fullmatch(evidence["imageId"]) is not None
        and evidence.get("platform") == "linux/amd64"
        and evidence.get("anonymousPull") is True
        and evidence.get("networkDisabledDuringProbe") is True
        and evidence.get("readOnlyProbe") is True
        and isinstance(tools, list)
        and all(isinstance(tool, str) for tool in tools)
        and len(tools) == len(REQUIRED_RELEASE_IMAGE_TOOLS)
        and set(tools) == set(REQUIRED_RELEASE_IMAGE_TOOLS)
        and evidence.get("errors") == []
    )
    if not valid:
        fail("release image evidence is not a complete Stage 16 report for the approved image")
    return evidence


def verify_reproducibility(path: Path, version: str) -> dict[str, Any]:
    evidence = read_json(path)
    builds = evidence.get("builds")
    valid = (
        evidence.get("schemaVersion") == 1
        and evidence.get("stage") == 10
        and evidence.get("ok") is True
        and evidence.get("version") == version
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
    if not valid:
        fail("reproducibility evidence is not a complete Stage 10 report for this release")
    return evidence


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
    if not any(
        isinstance(subject, dict)
        and subject.get("name") == sums.name
        and isinstance(subject.get("digest"), dict)
        and subject["digest"].get("sha256") == sha256_file(sums)
        for subject in subjects
    ):
        fail("release attestation does not match the checksums")
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


def frozen_inputs(
    version: str,
    validation: dict[str, Any],
    reproducibility: dict[str, Any],
    artifact: dict[str, Any],
    build_image: str,
    release_image: dict[str, Any],
) -> dict[str, Any]:
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
        "reproducibilityReportSha256": reproducibility["reportSha256"],
        "releaseImageReportSha256": release_image["reportSha256"],
        "releaseArchiveSha256": artifact["sha256"],
        "buildImage": build_image,
    }


def publish(
    version: str,
    release_dir: Path,
    validation_path: Path,
    output: Path,
    tag: str | None,
    reproducibility_path: Path = DEFAULT_REPRODUCIBILITY,
    guide_path: Path = DEFAULT_GUIDE,
    published_at: datetime | None = None,
    build_image: str | None = None,
    release_image_path: Path | None = None,
) -> dict[str, Any]:
    if published_at is not None:
        if published_at.tzinfo is None:
            fail("published-at must include a timezone")
        published_at = published_at.astimezone(timezone.utc)
    channel = version_channel(version)
    build_image = build_image or os.environ.get("OFFICIAL_RELEASE_IMAGE")
    if not isinstance(build_image, str) or IMAGE_RE.fullmatch(build_image) is None:
        fail("build image must use an immutable sha256 digest; pass --build-image or set OFFICIAL_RELEASE_IMAGE")
    if tag not in (None, f"v{version}"):
        fail(f"release must be tagged v{version}")
    require_clean_tree()
    validation = verify_validation(validation_path)
    validation = {**validation, "reportSha256": sha256_file(validation_path)}
    reproducibility = verify_reproducibility(reproducibility_path, version)
    reproducibility = {**reproducibility, "reportSha256": sha256_file(reproducibility_path)}
    release_image_path = release_image_path or validation_path.with_name("release-image.json")
    release_image = verify_release_image(release_image_path, build_image)
    release_image = {**release_image, "reportSha256": sha256_file(release_image_path)}
    if not guide_path.is_file() or guide_path.stat().st_size == 0:
        fail(f"APS integration guide is missing: {guide_path}")
    if not APS_VERIFIER.is_file() or APS_VERIFIER.stat().st_size == 0:
        fail(f"APS release verifier is missing: {APS_VERIFIER}")
    artifact = verify_release_artifact(release_dir, version)
    target = output / version
    if target.exists():
        fail(f"publication target already exists and is immutable: {target}")
    output.mkdir(parents=True, exist_ok=True)
    staging = Path(tempfile.mkdtemp(prefix=f".{version}.", dir=output))
    try:
        copied = []
        for source in (
            artifact["archive"],
            artifact["sums"],
            artifact["attestation"],
            validation_path,
            reproducibility_path,
            release_image_path,
            guide_path,
        ):
            destination = staging / source.name
            shutil.copyfile(source, destination)
            copied.append(destination)

        frozen = frozen_inputs(
            version, validation, reproducibility, artifact, build_image, release_image
        )
        frozen_path = staging / "frozen-inputs.json"
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
            "publishedAt": (published_at or datetime.now(timezone.utc))
            .replace(microsecond=0).isoformat().replace("+00:00", "Z"),
            "support": {
                "status": "supported" if channel == "stable" else "prerelease",
                "securityUpdates": channel == "stable",
                "baselineGeneration": int(version.split(".")[1]),
                "track": "current" if channel == "stable" else "prerelease",
                "securitySupportUntil": None,
                "withdrawn": False,
                "withdrawal": None,
            },
            "securityResponse": {
                "schemaVersion": 1,
                "policy": SECURITY_RESPONSE_POLICY,
                "advisories": [],
            },
            "publicationPolicy": {
                "protectedTagRequired": True,
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
            "reports": {
                "validation": validation_path.name,
                "reproducibility": reproducibility_path.name,
                "releaseImage": release_image_path.name,
            },
            "instructions": {"apsIntegration": guide_path.name},
            "artifacts": artifacts,
        }
        index_path = staging / "release-index.json"
        write_json(index_path, index)
        aps_check = subprocess.run(
            [
                sys.executable,
                str(APS_VERIFIER),
                "--publication",
                str(staging),
                "--expected-index-sha256",
                sha256_file(index_path),
                "--expected-build-image",
                build_image,
                "--json",
            ],
            capture_output=True,
            text=True,
        )
        if aps_check.returncode != 0:
            fail(f"APS release verification failed: {aps_check.stdout.strip() or aps_check.stderr.strip()}")
        staging.rename(target)
    except Exception:
        shutil.rmtree(staging, ignore_errors=True)
        raise
    return {
        "ok": True,
        "version": version,
        "channel": channel,
        "directory": target.as_posix(),
        "index": (target / "release-index.json").as_posix(),
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
    validate_support_index(index_path)
    reports = index.get("reports")
    instructions = index.get("instructions")
    if not isinstance(reports, dict) or not isinstance(instructions, dict):
        fail("release index omits final reports or APS instructions")
    required_names = {
        reports.get("validation"),
        reports.get("reproducibility"),
        reports.get("releaseImage"),
        instructions.get("apsIntegration"),
    }
    artifact_names = {
        artifact.get("name") for artifact in index.get("artifacts", []) if isinstance(artifact, dict)
    }
    if None in required_names or not required_names.issubset(artifact_names):
        fail("release index omits final reports or APS instructions")
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
    frozen_value = read_json(frozen_path)
    if IMAGE_RE.fullmatch(frozen_value.get("buildImage", "")) is None:
        fail("frozen input build image is invalid")
    release_image_name = reports.get("releaseImage")
    if not isinstance(release_image_name, str) or Path(release_image_name).name != release_image_name:
        fail("release index release image report path is invalid")
    release_image_path = root / release_image_name
    verify_release_image(release_image_path, frozen_value["buildImage"])
    if frozen_value.get("releaseImageReportSha256") != sha256_file(release_image_path):
        fail("release image evidence digest mismatch")
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
    parser.add_argument("--reproducibility", type=Path, default=DEFAULT_REPRODUCIBILITY)
    parser.add_argument("--guide", type=Path, default=DEFAULT_GUIDE)
    parser.add_argument("--release-image-report", type=Path, default=DEFAULT_RELEASE_IMAGE_REPORT)
    parser.add_argument("--published-at")
    parser.add_argument("--build-image")
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--index", type=Path)
    parser.add_argument("--tag")
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()
    try:
        if args.command == "publish":
            payload = publish(
                args.version,
                args.release_dir,
                args.validation,
                args.output,
                args.tag,
                args.reproducibility,
                args.guide,
                datetime.fromisoformat(args.published_at.replace("Z", "+00:00")) if args.published_at else None,
                args.build_image,
                args.release_image_report,
            )
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
