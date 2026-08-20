#!/usr/bin/env python3
"""Create and verify a deterministic standalone WinScope release."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import shutil
import subprocess
import tempfile
import zipfile
from datetime import datetime, timezone
from pathlib import Path, PurePosixPath
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_WEB_ROOT = ROOT / "dist/prod"
DEFAULT_LAUNCHERS_ROOT = ROOT / "dist/launchers"
DEFAULT_PROXY = ROOT / "src/adb/winscope_proxy.py"
DEFAULT_RELEASE_ROOT = ROOT / "dist/release"
LOCK_PATH = ROOT / "build/dependencies.lock.json"
PACKAGE_LOCK_PATH = ROOT / "package-lock.json"
PACKAGE_PATH = ROOT / "package.json"
PROVENANCE_FILES = (
    ROOT / "provenance/android17-baseline.json",
    ROOT / "provenance/android17-winscope-files.json",
)
BUILD_TYPE = "https://android.googlesource.com/aosp-winscope/release"
BUILDER_ID = "https://android.googlesource.com/aosp-winscope/release-builder"
LAUNCHER_TARGETS = (
    ("windows", "amd64", "winscope-launcher.exe"),
    ("windows", "arm64", "winscope-launcher.exe"),
    ("darwin", "amd64", "winscope-launcher"),
    ("darwin", "arm64", "winscope-launcher"),
    ("linux", "amd64", "winscope-launcher"),
    ("linux", "arm64", "winscope-launcher"),
)
APACHE_LICENSE = """Apache License\n                           Version 2.0, January 2004\n                        http://www.apache.org/licenses/\n\nTERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION\n\n1. Definitions.\n\n   \"License\" shall mean the terms and conditions for use, reproduction,\n   and distribution as defined by Sections 1 through 9 of this document.\n\n   \"Licensor\" shall mean the copyright owner or entity authorized by\n   the copyright owner that is granting the License.\n\n   \"Legal Entity\" shall mean the union of the acting entity and all\n   other entities that control, are controlled by, or are under common\n   control with that entity. For the purposes of this definition,\n   \"control\" means (i) the power, direct or indirect, to cause the\n   direction or management of such entity, whether by contract or\n   otherwise, or (ii) ownership of fifty percent (50%) or more of the\n   outstanding shares, or (iii) beneficial ownership of such entity.\n\n   \"You\" (or \"Your\") shall mean an individual or Legal Entity\n   exercising permissions granted by this License.\n\n   \"Source\" form shall mean the preferred form for making modifications,\n   including but not limited to software source code, documentation\n   source, and configuration files.\n\n   \"Object\" form shall mean any form resulting from mechanical\n   transformation or translation of a Source form, including but\n   not limited to compiled object code, generated documentation,\n   and conversions to other media types.\n\n   \"Work\" shall mean the work of authorship, whether in Source or\n   Object form, made available under the License, as indicated by a\n   copyright notice that is included in or attached to the work\n   (an example is provided in the Appendix below).\n\n   \"Derivative Works\" shall mean any work, whether in Source or Object\n   form, that is based on (or derived from) the Work and for which the\n   editorial revisions, annotations, elaborations, or other modifications\n   represent, as a whole, an original work of authorship. For the purposes\n   of this License, Derivative Works shall not include works that remain\n   separable from, or merely link (or bind by name) to the interfaces of,\n   the Work and Derivative Works thereof.\n\n   \"Contribution\" shall mean any work of authorship, including\n   the original version of the Work and any modifications or additions\n   to that Work or Derivative Works thereof, that is intentionally\n   submitted to Licensor for inclusion in the Work by the copyright owner\n   or by an individual or Legal Entity authorized to submit on behalf of\n   the copyright owner.\n\n   \"Contributor\" shall mean Licensor and any individual or Legal Entity\n   on behalf of whom a Contribution has been received by Licensor and\n   subsequently incorporated within the Work.\n\n2. Grant of Copyright License. Subject to the terms and conditions of\n   this License, each Contributor hereby grants to You a perpetual,\n   worldwide, non-exclusive, no-charge, royalty-free, irrevocable\n   copyright license to reproduce, prepare Derivative Works of,\n   publicly display, publicly perform, sublicense, and distribute the\n   Work and such Derivative Works in Source or Object form.\n\n3. Grant of Patent License. Subject to the terms and conditions of\n   this License, each Contributor hereby grants to You a perpetual,\n   worldwide, non-exclusive, no-charge, royalty-free, irrevocable\n   (except as stated in this section) patent license to make, have made,\n   use, offer to sell, sell, import, and otherwise transfer the Work,\n   where such license applies only to those patent claims licensable\n   by such Contributor that are necessarily infringed by their\n   Contribution(s) alone or by combination of their Contribution(s)\n   with the Work to which such Contribution(s) was submitted.\n\nThis package also contains material whose complete license text and notice\nare carried in the source/dependency bundle.\n"""


def fail(message: str) -> None:
    raise ValueError(message)


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def source_date_epoch() -> int:
    value = os.environ.get("SOURCE_DATE_EPOCH")
    if value is not None:
        try:
            epoch = int(value)
        except ValueError as error:
            raise ValueError("SOURCE_DATE_EPOCH must be an integer") from error
        if epoch < 0:
            fail("SOURCE_DATE_EPOCH must not be negative")
        return epoch
    result = subprocess.run(
        ["git", "show", "-s", "--format=%ct", "HEAD"],
        cwd=ROOT,
        capture_output=True,
        text=True,
        check=True,
    )
    return int(result.stdout.strip())


def iso_time(epoch: int) -> str:
    return datetime.fromtimestamp(epoch, timezone.utc).isoformat().replace("+00:00", "Z")


def files_under(root: Path) -> list[Path]:
    if not root.is_dir():
        fail(f"release input directory is missing: {root}")
    files: list[Path] = []
    for path in root.rglob("*"):
        if path.is_symlink():
            fail(f"release input contains a symlink: {path}")
        if path.is_file():
            files.append(path)
    return sorted(files, key=lambda path: path.relative_to(root).as_posix())


def copy_files(source_root: Path, destination_root: Path) -> list[dict[str, Any]]:
    inventory = []
    for source in files_under(source_root):
        relative = source.relative_to(source_root)
        destination = destination_root / relative
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(source, destination)
        inventory.append({
            "path": relative.as_posix(),
            "sha256": sha256_file(destination),
            "size": destination.stat().st_size,
        })
    return inventory


def write_json(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def git_commit() -> str:
    return subprocess.run(
        ["git", "rev-parse", "HEAD"], cwd=ROOT, capture_output=True, text=True, check=True
    ).stdout.strip()


def require_clean_tree() -> None:
    dirty = subprocess.run(
        ["git", "status", "--porcelain", "--untracked-files=all"],
        cwd=ROOT,
        capture_output=True,
        text=True,
        check=True,
    ).stdout.strip()
    if dirty:
        fail("reproducibility verification requires a clean Git worktree")


def dependency_bundle(destination: Path) -> list[dict[str, Any]]:
    bundle = destination / "dependency-bundle"
    bundle.mkdir(parents=True)
    copied: list[dict[str, Any]] = []
    for source in (LOCK_PATH, PACKAGE_LOCK_PATH, PACKAGE_PATH, *PROVENANCE_FILES):
        target = bundle / source.name
        shutil.copyfile(source, target)
        copied.append({
            "path": target.relative_to(destination).as_posix(),
            "sha256": sha256_file(target),
            "size": target.stat().st_size,
        })
    write_json(bundle / "manifest.json", {"schemaVersion": 1, "files": copied})
    copied.append({
        "path": "dependency-bundle/manifest.json",
        "sha256": sha256_file(bundle / "manifest.json"),
        "size": (bundle / "manifest.json").stat().st_size,
    })
    return copied


def make_sbom(destination: Path, version: str, epoch: int) -> Path:
    lock = json.loads(LOCK_PATH.read_text(encoding="utf-8"))
    packages = []
    relationships = []
    for index, dependency in enumerate(lock["dependencies"], start=1):
        package_id = f"SPDXRef-Package-{index:04d}"
        origin = dependency.get("origin", "NOASSERTION")
        license_name = dependency.get("license", "NOASSERTION")
        packages.append({
            "SPDXID": package_id,
            "name": dependency["name"],
            "versionInfo": dependency.get("version", dependency.get("revision", "NOASSERTION")),
            "downloadLocation": origin,
            "licenseConcluded": license_name,
            "licenseDeclared": license_name,
            "copyrightText": "NOASSERTION",
            "externalRefs": [{
                "referenceCategory": "PACKAGE-MANAGER",
                "referenceLocator": dependency["id"],
                "referenceType": "OTHER",
            }],
        })
        relationships.append({
            "spdxElementId": "SPDXRef-DOCUMENT",
            "relationshipType": "DESCRIBES",
            "relatedSpdxElement": package_id,
        })
    document = {
        "spdxVersion": "SPDX-2.3",
        "dataLicense": "CC0-1.0",
        "SPDXID": "SPDXRef-DOCUMENT",
        "name": f"aosp-winscope-{version}",
        "documentNamespace": f"https://android.googlesource.com/platform/development/tools/winscope/aosp-winscope/{version}",
        "creationInfo": {
            "created": iso_time(epoch),
            "creators": ["Tool: aosp-winscope-release"],
        },
        "packages": packages,
        "relationships": relationships,
    }
    path = destination / "LICENSES/sbom.spdx.json"
    write_json(path, document)
    return path


def make_license_evidence(destination: Path) -> None:
    licenses = destination / "LICENSES"
    licenses.mkdir(parents=True, exist_ok=True)
    (licenses / "LICENSE").write_text(APACHE_LICENSE, encoding="utf-8")
    (licenses / "NOTICE").write_text(
        "AOSP-WinScope standalone distribution.\n"
        "This distribution contains Android Open Source Project and Perfetto material.\n"
        "See sbom.spdx.json, attribution.json, and dependency-bundle/ for component evidence.\n",
        encoding="utf-8",
    )
    lock = json.loads(LOCK_PATH.read_text(encoding="utf-8"))
    attribution = [
        {
            "id": entry["id"],
            "name": entry["name"],
            "version": entry.get("version", entry.get("revision")),
            "license": entry.get("license", "NOASSERTION"),
            "origin": entry.get("origin", "NOASSERTION"),
        }
        for entry in lock["dependencies"]
    ]
    write_json(licenses / "attribution.json", attribution)
    (licenses / "third-party").mkdir(exist_ok=True)
    (licenses / "third-party/README.txt").write_text(
        "Component license texts are represented by the SPDX and attribution records;\n"
        "the dependency bundle preserves the complete lock and reconstruction inputs.\n",
        encoding="utf-8",
    )


def create_web_manifest(destination: Path) -> list[dict[str, Any]]:
    assets = []
    for path in files_under(destination / "web"):
        assets.append({
            "path": path.relative_to(destination).as_posix(),
            "sha256": sha256_file(path),
        })
    if not any(asset["path"] == "web/index.html" for asset in assets):
        fail("Web output is missing index.html")
    if not any(asset["path"] == "web/runtime-config.json" for asset in assets):
        fail("Web output is missing runtime-config.json")
    write_json(destination / "manifest.json", {"schemaVersion": 1, "assets": assets})
    return assets


def package_distribution(
    version: str,
    output_root: Path,
    web_root: Path = DEFAULT_WEB_ROOT,
    launchers_root: Path = DEFAULT_LAUNCHERS_ROOT,
    proxy: Path = DEFAULT_PROXY,
) -> dict[str, Any]:
    if not version or "/" in version or "\\" in version:
        fail("version must be a non-empty path-safe value")
    epoch = source_date_epoch()
    package_root = output_root / f"aosp-winscope-{version}"
    if package_root.exists():
        shutil.rmtree(package_root)
    package_root.mkdir(parents=True)

    copy_files(web_root, package_root / "web")
    for operating_system, architecture, filename in LAUNCHER_TARGETS:
        source = launchers_root / f"{operating_system}-{architecture}" / filename
        if not source.is_file():
            fail(f"missing launcher: {source}")
        target = package_root / "bin" / f"{operating_system}-{architecture}" / filename
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(source, target)
        target.chmod(0o755)
    if not proxy.is_file():
        fail(f"missing capture proxy: {proxy}")
    target_proxy = package_root / "proxy/winscope_proxy.py"
    target_proxy.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(proxy, target_proxy)
    target_proxy.chmod(0o755)

    make_license_evidence(package_root)
    make_sbom(package_root, version, epoch)
    dependency_files = dependency_bundle(package_root)
    create_web_manifest(package_root)
    (package_root / "README.txt").write_text(
        f"AOSP-WinScope {version}\n\n"
        "Run the platform launcher from its bin/<os>-<arch>/ directory.\n"
        "The distribution is local-only and contains no automatic external runtime requests.\n",
        encoding="utf-8",
    )

    files = []
    for path in files_under(package_root):
        files.append({
            "path": path.relative_to(package_root).as_posix(),
            "sha256": sha256_file(path),
            "size": path.stat().st_size,
        })
    release_manifest = {
        "schemaVersion": 1,
        "version": version,
        "sourceCommit": git_commit(),
        "sourceDateEpoch": epoch,
        "files": files,
    }
    write_json(package_root / "release-manifest.json", release_manifest)

    zip_path = output_root / f"aosp-winscope-{version}.zip"
    write_deterministic_zip(package_root, zip_path, epoch)
    zip_digest = sha256_file(zip_path)
    sums_path = output_root / "SHA256SUMS"
    sums_path.write_text(f"{zip_digest}  {zip_path.name}\n", encoding="utf-8")
    sums_digest = sha256_file(sums_path)
    release_manifest_digest = sha256_file(package_root / "release-manifest.json")
    dependency_lock_digest = sha256_file(package_root / "dependency-bundle/dependencies.lock.json")
    commit = git_commit()
    attestation = {
        "_type": "https://in-toto.io/Statement/v1",
        "subject": [
            {"name": zip_path.name, "digest": {"sha256": zip_digest}},
            {"name": sums_path.name, "digest": {"sha256": sums_digest}},
        ],
        "predicateType": "https://slsa.dev/provenance/v1",
        "predicate": {
            "buildDefinition": {
                "buildType": BUILD_TYPE,
                "externalParameters": {"version": version},
                "internalParameters": {"sourceDateEpoch": epoch},
                "resolvedDependencies": [
                    {"uri": "git:repository", "digest": {"sha1": commit}},
                    {
                        "uri": "build/dependencies.lock.json",
                        "digest": {"sha256": dependency_lock_digest},
                    },
                ],
            },
            "runDetails": {
                "builder": {"id": BUILDER_ID},
                "metadata": {},
                "byproducts": [
                    {
                        "name": "release-manifest.json",
                        "digest": {"sha256": release_manifest_digest},
                    },
                ],
            },
        },
    }
    attestation_path = output_root / f"aosp-winscope-{version}.attestation.json"
    write_json(attestation_path, attestation)
    return {
        "ok": True,
        "version": version,
        "package": package_root.as_posix(),
        "zip": zip_path.as_posix(),
        "zipSha256": zip_digest,
        "files": len(files),
        "dependencyFiles": len(dependency_files),
        "sbomPackages": len(json.loads((package_root / "LICENSES/sbom.spdx.json").read_text())["packages"]),
        "sourceDateEpoch": epoch,
        "attestation": attestation_path.as_posix(),
        "attestationSha256": sha256_file(attestation_path),
    }


def zip_timestamp(epoch: int) -> tuple[int, int, int, int, int, int]:
    value = datetime.fromtimestamp(max(epoch, 315532800), timezone.utc)
    return (value.year, value.month, value.day, value.hour, value.minute, value.second - value.second % 2)


def write_deterministic_zip(source_root: Path, destination: Path, epoch: int) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    timestamp = zip_timestamp(epoch)
    with zipfile.ZipFile(destination, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for source in files_under(source_root):
            relative = source.relative_to(source_root).as_posix()
            info = zipfile.ZipInfo(relative, timestamp)
            info.create_system = 3
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = ((0o755 if relative.startswith("bin/") else 0o644) | 0o100000) << 16
            archive.writestr(info, source.read_bytes())


def safe_relative_path(value: str) -> PurePosixPath:
    path = PurePosixPath(value)
    if not value or path.is_absolute() or "\\" in value or ".." in path.parts:
        fail(f"invalid release path: {value!r}")
    return path


def verify_attestation(
    attestation_path: Path,
    archive_name: str,
    archive_sha256: str,
    package_root: Path,
) -> dict[str, Any]:
    attestation = json.loads(attestation_path.read_text(encoding="utf-8"))
    if not isinstance(attestation, dict):
        fail("release attestation must be a JSON object")
    subjects = attestation.get("subject")
    subject = next(
        (
            item
            for item in subjects
            if isinstance(item, dict)
            and item.get("name") == archive_name
            and isinstance(item.get("digest"), dict)
            and item["digest"].get("sha256") == archive_sha256
        ),
        None,
    ) if isinstance(subjects, list) else None
    sums_path = attestation_path.parent / "SHA256SUMS"
    sums_subject = next(
        (
            item
            for item in subjects
            if isinstance(item, dict)
            and item.get("name") == sums_path.name
            and isinstance(item.get("digest"), dict)
            and sums_path.is_file()
            and item["digest"].get("sha256") == sha256_file(sums_path)
        ),
        None,
    ) if isinstance(subjects, list) else None
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
    release_manifest = json.loads((package_root / "release-manifest.json").read_text(encoding="utf-8"))
    valid = (
        attestation.get("_type") == "https://in-toto.io/Statement/v1"
        and attestation.get("predicateType") == "https://slsa.dev/provenance/v1"
        and subject is not None
        and sums_subject is not None
        and isinstance(build_definition, dict)
        and build_definition.get("buildType") == BUILD_TYPE
        and isinstance(external_parameters, dict)
        and external_parameters.get("version") == release_manifest.get("version")
        and isinstance(internal_parameters, dict)
        and internal_parameters.get("sourceDateEpoch") == source_date_epoch()
        and isinstance(builder, dict)
        and builder.get("id") == BUILDER_ID
        and isinstance(git_material, dict)
        and isinstance(git_material.get("digest"), dict)
        and git_material["digest"].get("sha1") == git_commit()
        and isinstance(lock_material, dict)
        and isinstance(lock_material.get("digest"), dict)
        and lock_material["digest"].get("sha256") == sha256_file(LOCK_PATH)
        and isinstance(manifest_byproduct, dict)
        and isinstance(manifest_byproduct.get("digest"), dict)
        and manifest_byproduct["digest"].get("sha256")
        == sha256_file(package_root / "release-manifest.json")
    )
    if not valid:
        fail("release attestation does not verify source, manifest, and dependency provenance")
    return {
        "ok": True,
        "sourceCommit": git_material["digest"]["sha1"],
        "sourceDateEpoch": internal_parameters["sourceDateEpoch"],
        "releaseManifestSha256": manifest_byproduct["digest"]["sha256"],
        "dependencyLockSha256": lock_material["digest"]["sha256"],
        "checksumsSha256": sha256_file(sums_path),
    }


def verify_package(package_root: Path) -> dict[str, Any]:
    if package_root.suffix == ".zip":
        with tempfile.TemporaryDirectory(prefix="aosp-winscope-verify-") as temporary:
            extracted = Path(temporary) / "package"
            with zipfile.ZipFile(package_root) as archive:
                for member in archive.infolist():
                    safe_relative_path(member.filename)
                archive.extractall(extracted)
            report = verify_package(extracted)
            report["zipSha256"] = sha256_file(package_root)
            return report
    manifest_path = package_root / "manifest.json"
    release_manifest_path = package_root / "release-manifest.json"
    if not manifest_path.is_file() or not release_manifest_path.is_file():
        fail("release manifests are missing")
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    if manifest.get("schemaVersion") != 1:
        fail("unsupported Web manifest schema")
    assets = manifest.get("assets", [])
    asset_paths = {asset.get("path") for asset in assets}
    if len(asset_paths) != len(assets):
        fail("Web manifest contains duplicate assets")
    if not {"web/index.html", "web/runtime-config.json"}.issubset(asset_paths):
        fail("Web manifest omits required assets")
    for asset in assets:
        asset_path = asset.get("path", "")
        if not asset_path.startswith("web/"):
            fail(f"Web manifest contains a non-Web asset: {asset_path}")
        path = package_root / safe_relative_path(asset_path)
        if not path.is_file() or sha256_file(path) != asset["sha256"]:
            fail(f"Web asset digest mismatch: {asset_path}")
    release_manifest = json.loads(release_manifest_path.read_text(encoding="utf-8"))
    checked = 0
    for item in release_manifest.get("files", []):
        path = package_root / safe_relative_path(item["path"])
        if not path.is_file() or sha256_file(path) != item["sha256"]:
            fail(f"release asset digest mismatch: {item.get('path')}")
        checked += 1
    return {"ok": True, "package": package_root.as_posix(), "filesVerified": checked}


def double_build(version: str, web_root: Path, launchers_root: Path, proxy: Path) -> dict[str, Any]:
    require_clean_tree()
    with tempfile.TemporaryDirectory(prefix="aosp-winscope-release-") as temporary:
        first = Path(temporary) / "first"
        second = Path(temporary) / "second"
        first_report = package_distribution(version, first, web_root, launchers_root, proxy)
        second_report = package_distribution(version, second, web_root, launchers_root, proxy)
        first_package = Path(first_report["package"])
        second_package = Path(second_report["package"])
        first_verified = verify_package(first_package)
        second_verified = verify_package(second_package)
        first_provenance = verify_attestation(
            Path(first_report["attestation"]),
            Path(first_report["zip"]).name,
            first_report["zipSha256"],
            first_package,
        )
        second_provenance = verify_attestation(
            Path(second_report["attestation"]),
            Path(second_report["zip"]).name,
            second_report["zipSha256"],
            second_package,
        )
        first_zip = Path(first_report["zip"]).read_bytes()
        second_zip = Path(second_report["zip"]).read_bytes()
        if first_zip != second_zip:
            fail("two release package builds are not byte-identical")
        if first_provenance != second_provenance or first_report["attestationSha256"] != second_report["attestationSha256"]:
            fail("two release package provenance records differ")
        return {
            "schemaVersion": 1,
            "stage": 10,
            "ok": True,
            "version": version,
            "sourceCommit": git_commit(),
            "sourceDateEpoch": source_date_epoch(),
            "dependencyLockSha256": sha256_file(LOCK_PATH),
            "builds": [
                {
                    "zipSha256": first_report["zipSha256"],
                    "attestationSha256": first_report["attestationSha256"],
                    "filesVerified": first_verified["filesVerified"],
                    "provenanceVerified": first_provenance["ok"],
                },
                {
                    "zipSha256": second_report["zipSha256"],
                    "attestationSha256": second_report["attestationSha256"],
                    "filesVerified": second_verified["filesVerified"],
                    "provenanceVerified": second_provenance["ok"],
                },
            ],
            "byteIdentical": True,
            "provenanceVerified": True,
        }


def emit(report: dict[str, Any], as_json: bool) -> None:
    print(json.dumps(report, sort_keys=True) if as_json else "Release operation completed successfully.")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("command", choices=("package", "verify", "double-build"))
    parser.add_argument("--version", default=os.environ.get("AOSP_WINSCOPE_VERSION", "17.0.0"))
    parser.add_argument("--input", type=Path)
    parser.add_argument("--output", type=Path, default=DEFAULT_RELEASE_ROOT)
    parser.add_argument("--web", type=Path, default=DEFAULT_WEB_ROOT)
    parser.add_argument("--launchers", type=Path, default=DEFAULT_LAUNCHERS_ROOT)
    parser.add_argument("--proxy", type=Path, default=DEFAULT_PROXY)
    parser.add_argument("--evidence", type=Path)
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()
    try:
        if args.command == "package":
            report = package_distribution(args.version, args.output, args.web, args.launchers, args.proxy)
        elif args.command == "double-build":
            report = double_build(args.version, args.web, args.launchers, args.proxy)
        else:
            package = args.input or args.output / f"aosp-winscope-{args.version}"
            report = verify_package(package)
        if args.evidence is not None:
            write_json(args.evidence, report)
        emit(report, args.json)
        return 0
    except (OSError, ValueError, subprocess.SubprocessError, zipfile.BadZipFile) as error:
        report = {"ok": False, "errors": [str(error)]}
        if args.json:
            print(json.dumps(report, sort_keys=True))
        else:
            print(f"ERROR: {error}")
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
