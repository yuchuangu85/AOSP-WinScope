#!/usr/bin/env python3
"""Verify an AOSP-WinScope publication offline before APS consumes it."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import stat
import unicodedata
import zipfile
from pathlib import Path, PurePosixPath
from typing import Any

SHA256_LENGTH = 64
IMAGE_RE = re.compile(r"^[a-z0-9][a-z0-9._/-]*@sha256:[0-9a-f]{64}$")
VERSION_RE = re.compile(r"^17\.\d+\.\d+(?:-(alpha|rc)\.\d+)?$")
REQUIRED_ARCHIVE_FILES = {
    "manifest.json",
    "release-manifest.json",
    "LICENSES/LICENSE",
    "LICENSES/NOTICE",
    "LICENSES/sbom.spdx.json",
    "LICENSES/attribution.json",
    "dependency-bundle/dependencies.lock.json",
    "dependency-bundle/package-lock.json",
    "dependency-bundle/package.json",
    "dependency-bundle/android17-baseline.json",
    "dependency-bundle/android17-winscope-files.json",
    "dependency-bundle/manifest.json",
}
REQUIRED_GATES = {"release:reproducibility", "runtime:security"}
BUILD_TYPE = "https://android.googlesource.com/aosp-winscope/release"
BUILDER_ID = "https://android.googlesource.com/aosp-winscope/release-builder"
MAX_ARCHIVE_MEMBERS = 10_000
MAX_MEMBER_SIZE = 256 * 1024 * 1024
MAX_TOTAL_SIZE = 512 * 1024 * 1024
MAX_COMPRESSION_RATIO = 200
ALLOWED_ZIP_COMPRESSION = {zipfile.ZIP_STORED, zipfile.ZIP_DEFLATED}
WINDOWS_RESERVED_NAMES = {
    "aux",
    "con",
    "nul",
    "prn",
    *(f"com{index}" for index in range(1, 10)),
    *(f"lpt{index}" for index in range(1, 10)),
}
WINDOWS_INVALID_CHARACTERS = set('<>"|?*')


def fail(message: str) -> None:
    raise ValueError(message)


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def read_json_file(path: Path) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        raise ValueError(f"cannot read JSON evidence: {path}: {error}") from error
    if not isinstance(value, dict):
        fail(f"JSON evidence must be an object: {path}")
    return value


def read_json_value(value: bytes, name: str) -> Any:
    try:
        return json.loads(value.decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError) as error:
        raise ValueError(f"cannot read archive JSON: {name}: {error}") from error


def read_json_bytes(value: bytes, name: str) -> dict[str, Any]:
    parsed = read_json_value(value, name)
    if not isinstance(parsed, dict):
        fail(f"archive JSON must be an object: {name}")
    return parsed


def valid_hex(value: Any, length: int) -> bool:
    return isinstance(value, str) and len(value) == length and all(
        character in "0123456789abcdef" for character in value
    )


def valid_sha256(value: Any) -> bool:
    return valid_hex(value, SHA256_LENGTH)


def is_regular_file(path: Path) -> bool:
    try:
        return stat.S_ISREG(path.lstat().st_mode)
    except OSError:
        return False


def safe_basename(value: Any, label: str) -> str:
    if (
        not isinstance(value, str)
        or not value
        or "/" in value
        or "\\" in value
        or Path(value).name != value
    ):
        fail(f"invalid {label} path")
    return value


def safe_archive_path(value: str) -> PurePosixPath:
    path = PurePosixPath(value)
    if (
        not value
        or not path.parts
        or path.is_absolute()
        or "\\" in value
        or ":" in value
        or ".." in path.parts
        or path.as_posix() != value
    ):
        fail(f"invalid archive path: {value!r}")
    for part in path.parts:
        normalized = unicodedata.normalize("NFC", part)
        basename = normalized.split(".", 1)[0].casefold()
        if (
            part.endswith((" ", "."))
            or basename in WINDOWS_RESERVED_NAMES
            or any(
                character in WINDOWS_INVALID_CHARACTERS or ord(character) < 32
                for character in part
            )
        ):
            fail(f"invalid archive path: {value!r}")
    return path


def portable_archive_key(path: PurePosixPath) -> str:
    return "/".join(unicodedata.normalize("NFC", part).casefold() for part in path.parts)


def verify_artifacts(publication: Path, index: dict[str, Any]) -> dict[str, Path]:
    entries = index.get("artifacts")
    if not isinstance(entries, list) or not entries:
        fail("release index has no published artifacts")
    artifacts: dict[str, Path] = {}
    for entry in entries:
        if not isinstance(entry, dict):
            fail("release index artifact entry is invalid")
        name = safe_basename(entry.get("name"), "artifact")
        digest, size = entry.get("sha256"), entry.get("size")
        if name in artifacts or not valid_sha256(digest) or not isinstance(size, int) or size < 0:
            fail("release index artifact entry is invalid")
        path = publication / name
        if not is_regular_file(path) or path.stat().st_size != size or sha256_file(path) != digest:
            fail(f"artifact digest mismatch: {name}")
        artifacts[name] = path
    expected_names = set(artifacts) | {"release-index.json"}
    actual_names = set()
    for path in publication.iterdir():
        if not is_regular_file(path):
            fail(f"publication contains a non-regular entry: {path.name}")
        actual_names.add(path.name)
    if actual_names != expected_names:
        fail("publication directory does not exactly match the release index")
    return artifacts


def required_artifact(
    publication: Path,
    artifacts: dict[str, Path],
    name: Any,
    label: str,
) -> Path:
    basename = safe_basename(name, label)
    path = publication / basename
    if artifacts.get(basename) != path:
        fail(f"release index omits {label}: {basename}")
    return path


def verify_reports(
    index: dict[str, Any],
    validation_path: Path,
    reproducibility_path: Path,
    frozen: dict[str, Any],
    archive_sha256: str,
    dependency_sha256: str,
) -> None:
    validation = read_json_file(validation_path)
    checks = validation.get("checks")
    passing = {
        item.get("name")
        for item in checks
        if isinstance(item, dict) and item.get("status") == "pass"
    } if isinstance(checks, list) else set()
    if (
        validation.get("schemaVersion") != 1
        or validation.get("stage") != 7
        or validation.get("ok") is not True
        or validation.get("complete") is not True
        or not REQUIRED_GATES.issubset(passing)
        or frozen.get("validationReportSha256") != sha256_file(validation_path)
    ):
        fail("Stage 7 validation evidence is invalid")

    reproducibility = read_json_file(reproducibility_path)
    builds = reproducibility.get("builds")
    if not (
        reproducibility.get("schemaVersion") == 1
        and reproducibility.get("stage") == 10
        and reproducibility.get("ok") is True
        and reproducibility.get("version") == index.get("version")
        and reproducibility.get("sourceCommit") == index.get("sourceCommit")
        and reproducibility.get("dependencyLockSha256") == dependency_sha256
        and reproducibility.get("byteIdentical") is True
        and reproducibility.get("provenanceVerified") is True
        and isinstance(builds, list)
        and len(builds) == 2
        and all(
            isinstance(build, dict)
            and build.get("provenanceVerified") is True
            and build.get("zipSha256") == archive_sha256
            for build in builds
        )
        and frozen.get("reproducibilityReportSha256") == sha256_file(reproducibility_path)
    ):
        fail("Stage 10 reproducibility evidence is invalid")


def verify_attestation(
    attestation_path: Path,
    index: dict[str, Any],
    archive_name: str,
    archive_sha256: str,
    sums_name: str,
    sums_sha256: str,
    release_manifest_sha256: str,
    dependency_sha256: str,
) -> None:
    attestation = read_json_file(attestation_path)
    subjects = attestation.get("subject")
    subject_ok = isinstance(subjects, list) and any(
        isinstance(subject, dict)
        and subject.get("name") == archive_name
        and isinstance(subject.get("digest"), dict)
        and subject["digest"].get("sha256") == archive_sha256
        for subject in subjects
    )
    sums_subject_ok = isinstance(subjects, list) and any(
        isinstance(subject, dict)
        and subject.get("name") == sums_name
        and isinstance(subject.get("digest"), dict)
        and subject["digest"].get("sha256") == sums_sha256
        for subject in subjects
    )
    predicate = attestation.get("predicate")
    build_definition = predicate.get("buildDefinition") if isinstance(predicate, dict) else None
    run_details = predicate.get("runDetails") if isinstance(predicate, dict) else None
    external_parameters = (
        build_definition.get("externalParameters") if isinstance(build_definition, dict) else None
    )
    internal_parameters = (
        build_definition.get("internalParameters") if isinstance(build_definition, dict) else None
    )
    dependencies = (
        build_definition.get("resolvedDependencies") if isinstance(build_definition, dict) else None
    )
    builder = run_details.get("builder") if isinstance(run_details, dict) else None
    byproducts = run_details.get("byproducts") if isinstance(run_details, dict) else None
    git_material = next(
        (item for item in dependencies if isinstance(item, dict) and item.get("uri") == "git:repository"),
        None,
    ) if isinstance(dependencies, list) else None
    lock_material = next(
        (
            item
            for item in dependencies
            if isinstance(item, dict) and item.get("uri") == "build/dependencies.lock.json"
        ),
        None,
    ) if isinstance(dependencies, list) else None
    manifest_byproduct = next(
        (
            item
            for item in byproducts
            if isinstance(item, dict) and item.get("name") == "release-manifest.json"
        ),
        None,
    ) if isinstance(byproducts, list) else None
    valid = (
        attestation.get("_type") == "https://in-toto.io/Statement/v1"
        and attestation.get("predicateType") == "https://slsa.dev/provenance/v1"
        and subject_ok
        and sums_subject_ok
        and isinstance(build_definition, dict)
        and build_definition.get("buildType") == BUILD_TYPE
        and isinstance(external_parameters, dict)
        and external_parameters.get("version") == index.get("version")
        and isinstance(internal_parameters, dict)
        and internal_parameters.get("sourceDateEpoch") == index.get("sourceDateEpoch")
        and isinstance(builder, dict)
        and builder.get("id") == BUILDER_ID
        and isinstance(git_material, dict)
        and isinstance(git_material.get("digest"), dict)
        and git_material["digest"].get("sha1") == index.get("sourceCommit")
        and isinstance(lock_material, dict)
        and isinstance(lock_material.get("digest"), dict)
        and lock_material["digest"].get("sha256") == dependency_sha256
        and isinstance(manifest_byproduct, dict)
        and isinstance(manifest_byproduct.get("digest"), dict)
        and manifest_byproduct["digest"].get("sha256") == release_manifest_sha256
    )
    if not valid:
        fail("attestation provenance mismatch")


def verify_supply_chain(members: dict[str, bytes]) -> dict[str, Any]:
    lock = read_json_bytes(
        members["dependency-bundle/dependencies.lock.json"],
        "dependency-bundle/dependencies.lock.json",
    )
    dependencies = lock.get("dependencies")
    if lock.get("schemaVersion") != 1 or not isinstance(dependencies, list):
        fail("dependency lock evidence is invalid")
    dependency_ids = {
        item.get("id") for item in dependencies if isinstance(item, dict) and isinstance(item.get("id"), str)
    }
    if len(dependency_ids) != len(dependencies):
        fail("dependency lock evidence is invalid")

    baseline = read_json_bytes(
        members["dependency-bundle/android17-baseline.json"],
        "dependency-bundle/android17-baseline.json",
    )
    inventory = read_json_bytes(
        members["dependency-bundle/android17-winscope-files.json"],
        "dependency-bundle/android17-winscope-files.json",
    )
    inventory_files = inventory.get("files")
    if (
        baseline.get("schemaVersion") != 1
        or baseline.get("baseline") != "android17-release"
        or not isinstance(baseline.get("productInputs"), dict)
        or not isinstance(baseline.get("toolchain"), dict)
        or not isinstance(inventory_files, list)
        or inventory.get("fileCount") != len(inventory_files)
    ):
        fail("Android 17 provenance evidence is invalid")

    read_json_bytes(members["dependency-bundle/package-lock.json"], "dependency-bundle/package-lock.json")
    read_json_bytes(members["dependency-bundle/package.json"], "dependency-bundle/package.json")
    bundle_manifest = read_json_bytes(
        members["dependency-bundle/manifest.json"],
        "dependency-bundle/manifest.json",
    )
    bundle_entries = bundle_manifest.get("files")
    expected_bundle = {
        "dependency-bundle/dependencies.lock.json",
        "dependency-bundle/package-lock.json",
        "dependency-bundle/package.json",
        "dependency-bundle/android17-baseline.json",
        "dependency-bundle/android17-winscope-files.json",
    }
    seen_bundle: set[str] = set()
    if bundle_manifest.get("schemaVersion") != 1 or not isinstance(bundle_entries, list):
        fail("dependency bundle manifest is invalid")
    for entry in bundle_entries:
        if not isinstance(entry, dict) or entry.get("path") not in expected_bundle:
            fail("dependency bundle manifest is invalid")
        name = entry["path"]
        data = members[name]
        if (
            name in seen_bundle
            or entry.get("size") != len(data)
            or entry.get("sha256") != sha256_bytes(data)
        ):
            fail("dependency bundle manifest is invalid")
        seen_bundle.add(name)
    if seen_bundle != expected_bundle:
        fail("dependency bundle manifest is incomplete")

    sbom = read_json_bytes(members["LICENSES/sbom.spdx.json"], "LICENSES/sbom.spdx.json")
    packages = sbom.get("packages")
    if sbom.get("spdxVersion") != "SPDX-2.3" or not isinstance(packages, list):
        fail("SPDX evidence is invalid")
    sbom_ids: set[str] = set()
    for package in packages:
        refs = package.get("externalRefs") if isinstance(package, dict) else None
        if not isinstance(refs, list):
            fail("SPDX evidence is invalid")
        ids = {
            ref.get("referenceLocator")
            for ref in refs
            if isinstance(ref, dict) and isinstance(ref.get("referenceLocator"), str)
        }
        if len(ids) != 1:
            fail("SPDX evidence is invalid")
        sbom_ids.update(ids)
    attribution = read_json_value(members["LICENSES/attribution.json"], "LICENSES/attribution.json")
    if not isinstance(attribution, list):
        fail("attribution evidence is invalid")
    attribution_ids = {
        item.get("id") for item in attribution if isinstance(item, dict) and isinstance(item.get("id"), str)
    }
    if (
        sbom_ids != dependency_ids
        or attribution_ids != dependency_ids
        or len(packages) != len(dependencies)
        or len(attribution) != len(dependencies)
    ):
        fail("license and dependency evidence are inconsistent")
    if not members["LICENSES/LICENSE"].strip() or not members["LICENSES/NOTICE"].strip():
        fail("license evidence is empty")

    return {
        "baseline": baseline["baseline"],
        "productInputs": baseline["productInputs"],
        "toolchain": baseline["toolchain"],
        "dependencyLockSha256": sha256_bytes(members["dependency-bundle/dependencies.lock.json"]),
        "packageLockSha256": sha256_bytes(members["dependency-bundle/package-lock.json"]),
        "vendorFileInventorySha256": sha256_bytes(members["dependency-bundle/android17-winscope-files.json"]),
        "dependencyEntries": len(dependencies),
    }


def verify_archive(
    archive_path: Path,
    index: dict[str, Any],
) -> tuple[int, str, dict[str, Any]]:
    try:
        with zipfile.ZipFile(archive_path) as archive:
            infos = archive.infolist()
            if len(infos) > MAX_ARCHIVE_MEMBERS:
                fail("release archive exceeds the member limit")
            members: dict[str, bytes] = {}
            portable_names: set[str] = set()
            total_size = 0
            for info in infos:
                path = safe_archive_path(info.filename)
                portable_name = portable_archive_key(path)
                total_size += info.file_size
                if (
                    info.filename in members
                    or portable_name in portable_names
                    or info.is_dir()
                    or stat.S_ISLNK(info.external_attr >> 16)
                ):
                    fail(f"invalid archive member: {info.filename}")
                if info.compress_type not in ALLOWED_ZIP_COMPRESSION or info.flag_bits & 0x1:
                    fail(f"unsupported archive compression: {info.filename}")
                if (
                    info.file_size > MAX_MEMBER_SIZE
                    or total_size > MAX_TOTAL_SIZE
                    or info.file_size / max(info.compress_size, 1) > MAX_COMPRESSION_RATIO
                ):
                    fail(f"release archive exceeds resource limits: {info.filename}")
                members[info.filename] = archive.read(info)
                portable_names.add(portable_name)
    except zipfile.BadZipFile as error:
        raise ValueError(f"invalid release archive: {error}") from error
    missing = sorted(REQUIRED_ARCHIVE_FILES - set(members))
    if missing:
        fail(f"release archive omits required evidence: {', '.join(missing)}")

    manifest = read_json_bytes(members["manifest.json"], "manifest.json")
    assets = manifest.get("assets")
    if manifest.get("schemaVersion") != 1 or not isinstance(assets, list):
        fail("unsupported Web manifest")
    asset_names: set[str] = set()
    for asset in assets:
        if not isinstance(asset, dict):
            fail("Web manifest asset entry is invalid")
        name = asset.get("path")
        if not isinstance(name, str) or not name.startswith("web/"):
            fail(f"Web manifest contains a non-Web asset: {name}")
        safe_archive_path(name)
        if name in asset_names or not valid_sha256(asset.get("sha256")):
            fail("Web manifest asset entry is invalid")
        data = members.get(name)
        if data is None or sha256_bytes(data) != asset["sha256"]:
            fail(f"Web asset digest mismatch: {name}")
        asset_names.add(name)
    if not {"web/index.html", "web/runtime-config.json"}.issubset(asset_names):
        fail("Web manifest omits required assets")
    if asset_names != {name for name in members if name.startswith("web/")}:
        fail("Web manifest does not exactly inventory the Web tree")

    release_manifest_bytes = members["release-manifest.json"]
    release_manifest = read_json_bytes(release_manifest_bytes, "release-manifest.json")
    entries = release_manifest.get("files")
    if (
        release_manifest.get("schemaVersion") != 1
        or release_manifest.get("version") != index.get("version")
        or release_manifest.get("sourceCommit") != index.get("sourceCommit")
        or release_manifest.get("sourceDateEpoch") != index.get("sourceDateEpoch")
        or not isinstance(entries, list)
    ):
        fail("release manifest lineage mismatch")
    listed: set[str] = set()
    for entry in entries:
        if not isinstance(entry, dict):
            fail("release manifest entry is invalid")
        name = entry.get("path")
        if not isinstance(name, str):
            fail("release manifest entry is invalid")
        safe_archive_path(name)
        if name in listed or not valid_sha256(entry.get("sha256")) or not isinstance(entry.get("size"), int):
            fail("release manifest entry is invalid")
        data = members.get(name)
        if data is None or len(data) != entry["size"] or sha256_bytes(data) != entry["sha256"]:
            fail(f"release asset digest mismatch: {name}")
        listed.add(name)
    if set(members) != listed | {"release-manifest.json"}:
        fail("release archive contains unlisted files")
    supply_chain = verify_supply_chain(members)
    return len(listed), sha256_bytes(release_manifest_bytes), supply_chain


def verify_publication(
    publication: Path,
    expected_index_sha256: str,
    expected_build_image: str,
) -> dict[str, Any]:
    if IMAGE_RE.fullmatch(expected_build_image) is None:
        fail("trusted build image is invalid")
    publication = publication.resolve()
    index_path = publication / "release-index.json"
    if not valid_sha256(expected_index_sha256) or sha256_file(index_path) != expected_index_sha256:
        fail("trusted release index digest mismatch")
    index = read_json_file(index_path)
    if (
        index.get("schemaVersion") != 1
        or index.get("product") != "aosp-winscope"
        or index.get("baseline") != "android17-release"
    ):
        fail("unsupported release index")
    version = index.get("version")
    version_match = VERSION_RE.fullmatch(version) if isinstance(version, str) else None
    channel = version_match.group(1) if version_match and version_match.group(1) else "stable"
    if (
        version_match is None
        or index.get("channel") != channel
        or index.get("tag") != f"v{version}"
        or not valid_hex(index.get("sourceCommit"), 40)
    ):
        fail("release index lineage is invalid")
    if not isinstance(index.get("sourceDateEpoch"), int) or index["sourceDateEpoch"] < 0:
        fail("release index source time is invalid")

    artifacts = verify_artifacts(publication, index)
    archive_name = f"aosp-winscope-{version}.zip"
    archive_path = required_artifact(publication, artifacts, archive_name, "release archive")
    sums_path = required_artifact(publication, artifacts, "SHA256SUMS", "checksums")
    attestation_path = required_artifact(
        publication,
        artifacts,
        f"aosp-winscope-{version}.attestation.json",
        "attestation",
    )
    reports = index.get("reports")
    instructions = index.get("instructions")
    frozen_reference = index.get("frozenInputs")
    if not isinstance(reports, dict) or not isinstance(instructions, dict) or not isinstance(frozen_reference, dict):
        fail("release index omits APS verification evidence")
    validation_path = required_artifact(publication, artifacts, reports.get("validation"), "validation report")
    reproducibility_path = required_artifact(
        publication,
        artifacts,
        reports.get("reproducibility"),
        "reproducibility report",
    )
    required_artifact(publication, artifacts, instructions.get("apsIntegration"), "APS instructions")
    frozen_path = required_artifact(publication, artifacts, frozen_reference.get("path"), "frozen inputs")
    if not valid_sha256(frozen_reference.get("sha256")) or sha256_file(frozen_path) != frozen_reference["sha256"]:
        fail("frozen input evidence digest mismatch")

    archive_sha256 = sha256_file(archive_path)
    lines = [line for line in sums_path.read_text(encoding="utf-8").splitlines() if line.strip()]
    if lines != [f"{archive_sha256}  {archive_name}"]:
        fail("SHA256SUMS does not match the release archive")
    files_verified, release_manifest_sha256, supply_chain = verify_archive(archive_path, index)
    dependency_sha256 = supply_chain["dependencyLockSha256"]

    frozen = read_json_file(frozen_path)
    if frozen.get("buildImage") != expected_build_image:
        fail("trusted build image mismatch")
    if not (
        frozen.get("schemaVersion") == 1
        and frozen.get("version") == version
        and frozen.get("sourceCommit") == index.get("sourceCommit")
        and frozen.get("sourceDateEpoch") == index.get("sourceDateEpoch")
        and frozen.get("releaseArchiveSha256") == archive_sha256
        and IMAGE_RE.fullmatch(frozen.get("buildImage", "")) is not None
        and all(frozen.get(field) == value for field, value in supply_chain.items())
    ):
        fail("frozen input lineage mismatch")
    verify_reports(
        index,
        validation_path,
        reproducibility_path,
        frozen,
        archive_sha256,
        dependency_sha256,
    )
    verify_attestation(
        attestation_path,
        index,
        archive_name,
        archive_sha256,
        sums_path.name,
        sha256_file(sums_path),
        release_manifest_sha256,
        dependency_sha256,
    )
    return {
        "ok": True,
        "version": version,
        "archiveSha256": archive_sha256,
        "artifactsVerified": len(artifacts),
        "archiveFilesVerified": files_verified,
        "provenanceStatementVerified": True,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--publication", type=Path, required=True)
    parser.add_argument("--expected-index-sha256", required=True)
    parser.add_argument("--expected-build-image", required=True)
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()
    try:
        report = verify_publication(
            args.publication, args.expected_index_sha256, args.expected_build_image
        )
        print(json.dumps(report, sort_keys=True) if args.json else "APS release verified successfully.")
        return 0
    except (OSError, ValueError) as error:
        report = {"ok": False, "errors": [str(error)]}
        print(json.dumps(report, sort_keys=True) if args.json else f"ERROR: {error}")
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
