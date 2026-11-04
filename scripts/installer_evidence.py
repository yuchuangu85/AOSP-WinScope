#!/usr/bin/env python3
"""Stage and reverify bounded, non-executable installer publication evidence."""

from __future__ import annotations

import argparse
import importlib.util
import json
import os
import shutil
import stat
import subprocess
import sys
import tempfile
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT / "scripts") not in sys.path:
    sys.path.insert(0, str(ROOT / "scripts"))
import publish
import release

SPEC = importlib.util.spec_from_file_location("installer_feature_stages", ROOT / "scripts/verify-feature-stages.py")
assert SPEC is not None and SPEC.loader is not None
FEATURES = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(FEATURES)

INDEX = "installer-release.json"
SUMS = "SHA256SUMS.txt"
MAX_FILE_BYTES = 64 * 1024 * 1024
MAX_TOTAL_BYTES = 256 * 1024 * 1024
TARGETS = {f"{system}-{arch}" for system, arch, _ in release.LAUNCHER_TARGETS}
REPORTS = {
    "validation": "validation-report.json",
    "reproducibility": "reproducibility.json",
    "releaseImage": "release-image.json",
    "featureStages": "feature-stages.json",
}
COMMON_FILES = {
    "LICENSE": "LICENSES/LICENSE",
    "NOTICE": "LICENSES/NOTICE",
    "sbom.spdx.json": "LICENSES/sbom.spdx.json",
    "attribution.json": "LICENSES/attribution.json",
    "compliance.json": "LICENSES/compliance.json",
    "web-third-party-licenses.txt": "LICENSES/third-party/web-third-party-licenses.txt",
    "licenses-README.txt": "LICENSES/third-party/README.txt",
    "dependencies.lock.json": "dependency-bundle/dependencies.lock.json",
    "package-lock.json": "dependency-bundle/package-lock.json",
    "package.json": "dependency-bundle/package.json",
    "android17-baseline.json": "dependency-bundle/android17-baseline.json",
    "android17-winscope-files.json": "dependency-bundle/android17-winscope-files.json",
    "dependency-bundle-manifest.json": "dependency-bundle/manifest.json",
}


def require(condition: Any, message: str) -> None:
    if not condition:
        raise ValueError(message)


def digest_valid(value: Any) -> bool:
    return isinstance(value, str) and publish.SHA256_RE.fullmatch(value) is not None


def regular(path: Path) -> int:
    info = path.lstat()
    require(stat.S_ISREG(info.st_mode) and 0 < info.st_size <= MAX_FILE_BYTES,
            f"evidence is not a bounded regular file: {path.name}")
    return info.st_size


def read_json(path: Path) -> dict[str, Any]:
    regular(path)
    return publish.read_json(path)


def descriptor(path: Path) -> dict[str, Any]:
    size = regular(path)
    return {"name": path.name, "sha256": publish.sha256_file(path), "size": size}


def manifest_name(target: str) -> str:
    return f"release-manifest-{target}.json"


def known_names(version: str) -> set[str]:
    return {*REPORTS.values(), *COMMON_FILES, "internal-SHA256SUMS",
            f"aosp-winscope-{version}.attestation.json",
            *(manifest_name(target) for target in TARGETS)}


def source_inputs() -> dict[str, Path]:
    return {
        "dependencies.lock.json": publish.LOCK,
        "package-lock.json": publish.PACKAGE_LOCK,
        "package.json": ROOT / "package.json",
        "android17-baseline.json": publish.BASELINE,
        "android17-winscope-files.json": publish.FILE_INVENTORY,
    }


def source_identity(version: str, build_image: str) -> dict[str, Any]:
    publish.version_channel(version)
    require(isinstance(build_image, str) and publish.IMAGE_RE.fullmatch(build_image),
            "build image must use an immutable sha256 digest")
    return {
        "schemaVersion": 1, "product": "aosp-winscope", "artifactMode": "unpacked",
        "version": version, "sourceCommit": publish.git_commit(),
        "sourceDateEpoch": publish.git_epoch(), "buildImage": build_image,
        "dependencyLockSha256": publish.sha256_file(publish.LOCK),
        "packageLockSha256": publish.sha256_file(publish.PACKAGE_LOCK),
        "vendorFileInventorySha256": publish.sha256_file(publish.FILE_INVENTORY),
        "baselineSha256": publish.sha256_file(publish.BASELINE),
    }


def package_digests(items: Any) -> dict[str, str]:
    require(isinstance(items, list) and len(items) == len(TARGETS),
            "unpacked package inventory must contain every target exactly once")
    result = {}
    for item in items:
        require(isinstance(item, dict) and set(item) == {"target", "sha256"}
                and isinstance(item.get("target"), str) and item["target"] in TARGETS
                and item["target"] not in result and digest_valid(item.get("sha256")),
                "unpacked package inventory has invalid or duplicate targets/digests")
        result[item["target"]] = item["sha256"]
    return result


def verify_reproducibility(path: Path, identity: dict[str, Any], packages: list[dict[str, Any]],
                           attestation_sha256: str) -> dict[str, Any]:
    evidence = read_json(path)
    require(type(evidence.get("schemaVersion")) is int and evidence["schemaVersion"] == 1
            and evidence.get("stage") == 10 and evidence.get("artifactMode") == "unpacked"
            and evidence.get("ok") is True and evidence.get("byteIdentical") is True
            and evidence.get("provenanceVerified") is True and "archives" not in evidence
            and all(evidence.get(key) == identity[key] for key in
                    ("version", "sourceCommit", "sourceDateEpoch", "dependencyLockSha256")),
            "Stage 10 unpacked reproducibility report is invalid or stale")
    builds = evidence.get("builds")
    require(isinstance(builds, list) and len(builds) == 2,
            "Stage 10 requires exactly two unpacked builds")
    expected = {item["target"]: item["sha256"] for item in packages}
    files = sum(item["files"] for item in packages)
    for build in builds:
        require(isinstance(build, dict) and "archives" not in build
                and build.get("provenanceVerified") is True
                and build.get("attestationSha256") == attestation_sha256
                and type(build.get("filesVerified")) is int and build["filesVerified"] == files,
                "Stage 10 build provenance, attestation digest or file count differs")
        require(package_digests(build.get("packages")) == expected,
                "Stage 10 package digests differ from the current unpacked packages")
    return evidence


def verify_feature_stages(path: Path, commit: str) -> None:
    evidence = read_json(path)
    stages = evidence.get("stages")
    require(evidence.get("schemaVersion") == 1 and evidence.get("ok") is True
            and evidence.get("sourceCommit") == commit
            and isinstance(stages, list) and len(stages) == len(FEATURES.STAGES),
            "feature-stage exit evidence is incomplete or stale")
    seen = set()
    for entry in stages:
        require(isinstance(entry, dict) and type(entry.get("stage")) is int
                and entry["stage"] in FEATURES.STAGES and entry["stage"] not in seen
                and entry.get("status") == "pass" and entry.get("documented") is True
                and entry.get("missing") == [], "feature stages 20..25 must each pass exactly once")
        stage = entry["stage"]
        seen.add(stage)
        expected = [{"path": name, "sha256": publish.sha256_file(ROOT / name)}
                    for name in FEATURES.STAGES[stage]]
        require(entry.get("files") == expected, "feature-stage file lineage differs from current source")
    checks = evidence.get("checks")
    require(isinstance(checks, list) and len(checks) == len(FEATURES.COMMANDS),
            "feature-stage dynamic checks are incomplete")
    seen_checks = set()
    for check in checks:
        require(isinstance(check, dict) and isinstance(check.get("name"), str)
                and check["name"] in FEATURES.COMMANDS and check["name"] not in seen_checks
                and check.get("status") == "pass" and type(check.get("returncode")) is int
                and check["returncode"] == 0, "feature-stage dynamic checks must all pass")
        seen_checks.add(check["name"])


def verify_manifests(directory: Path, identity: dict[str, Any]) -> list[dict[str, Any]]:
    packages = []
    for system, arch, _ in release.LAUNCHER_TARGETS:
        target = f"{system}-{arch}"
        path = directory / manifest_name(target)
        manifest = read_json(path)
        require(manifest.get("schemaVersion") == 1 and manifest.get("version") == identity["version"]
                and manifest.get("sourceCommit") == identity["sourceCommit"]
                and manifest.get("sourceDateEpoch") == identity["sourceDateEpoch"]
                and manifest.get("target") == {"operatingSystem": system, "architecture": arch}
                and manifest.get("launcher") == f"bin/{target}/{release.launcher_filename(system, arch)}",
                "release manifest version, target or source lineage is stale")
        items = manifest.get("files")
        require(isinstance(items, list) and bool(items), "release manifest file inventory is missing")
        inventory = {}
        for item in items:
            require(isinstance(item, dict) and isinstance(item.get("path"), str)
                    and digest_valid(item.get("sha256")) and type(item.get("size")) is int
                    and item["size"] >= 0, "invalid release manifest file descriptor")
            name = item["path"]
            require(release.safe_relative_path(name).as_posix() == name
                    and name not in inventory, "duplicate or unsafe release manifest file")
            inventory[name] = item
        for name, relative in COMMON_FILES.items():
            if name == "sbom.spdx.json":
                continue  # The common tree includes all launchers; target SPDX files differ.
            actual = descriptor(directory / name)
            require(inventory.get(relative) == {"path": relative, "sha256": actual["sha256"],
                                                "size": actual["size"]},
                    f"release manifest dependency/license evidence differs: {relative}")
        packages.append({
            "target": target, "manifest": path.name,
            "subjectName": f"aosp-winscope-{identity['version']}-{target}/release-manifest.json",
            "sha256": publish.sha256_file(path), "files": len(items),
        })
    return packages


def verify_attestation(directory: Path, identity: dict[str, Any], packages: list[dict[str, Any]]) -> str:
    path = directory / f"aosp-winscope-{identity['version']}.attestation.json"
    attestation = read_json(path)
    subjects = [{"name": item["subjectName"], "digest": {"sha256": item["sha256"]}}
                for item in packages]
    sums = directory / "internal-SHA256SUMS"
    expected_sums = "".join(f"{item['sha256']}  {item['subjectName']}\n"
                            for item in sorted(packages, key=lambda item: item["subjectName"]))
    require(sums.read_text(encoding="utf-8") == expected_sums,
            "internal SHA256SUMS does not match unpacked manifests")
    subjects.append({"name": "SHA256SUMS", "digest": {"sha256": publish.sha256_file(sums)}})
    actual_subjects = attestation.get("subject")
    require(isinstance(actual_subjects, list) and len(actual_subjects) == len(subjects)
            and all(item in actual_subjects for item in subjects),
            "attestation subjects do not match unpacked manifests and checksums")
    predicate = attestation.get("predicate")
    require(isinstance(predicate, dict), "attestation predicate is missing")
    definition = predicate.get("buildDefinition", {})
    details = predicate.get("runDetails", {})
    require(isinstance(definition, dict) and isinstance(details, dict), "attestation provenance is invalid")
    dependencies = [
        {"uri": "git:repository", "digest": {"sha1": identity["sourceCommit"]}},
        {"uri": "build/dependencies.lock.json", "digest": {"sha256": identity["dependencyLockSha256"]}},
    ]
    byproducts = [{"name": f"{item['target']}/release-manifest.json", "digest": {"sha256": item["sha256"]}}
                  for item in packages]
    actual_dependencies = definition.get("resolvedDependencies")
    actual_byproducts = details.get("byproducts")
    require(attestation.get("_type") == "https://in-toto.io/Statement/v1"
            and attestation.get("predicateType") == "https://slsa.dev/provenance/v1"
            and definition.get("buildType") == release.BUILD_TYPE
            and isinstance(definition.get("externalParameters"), dict)
            and definition["externalParameters"].get("version") == identity["version"]
            and definition.get("internalParameters") == {"sourceDateEpoch": identity["sourceDateEpoch"]}
            and details.get("builder") == {"id": release.BUILDER_ID}
            and isinstance(actual_dependencies, list) and len(actual_dependencies) == len(dependencies)
            and all(item in actual_dependencies for item in dependencies)
            and isinstance(actual_byproducts, list) and len(actual_byproducts) == len(byproducts)
            and all(item in actual_byproducts for item in byproducts),
            "attestation source, dependency or manifest provenance is invalid")
    return publish.sha256_file(path)


def verify_source_and_licenses(directory: Path, version: str) -> None:
    inputs = source_inputs()
    for name, source in inputs.items():
        require(publish.sha256_file(directory / name) == publish.sha256_file(source),
                f"source/dependency evidence is stale: {name}")
    bundle = read_json(directory / "dependency-bundle-manifest.json")
    expected = [{"path": f"dependency-bundle/{name}", "sha256": publish.sha256_file(source),
                 "size": regular(source)} for name, source in inputs.items()]
    entries = bundle.get("files")
    require(bundle.get("schemaVersion") == 1 and isinstance(entries, list)
            and len(entries) == len(expected) and all(item in entries for item in expected),
            "dependency bundle manifest is incomplete or stale")
    dependencies = read_json(directory / "dependencies.lock.json").get("dependencies")
    require(read_json(directory / "compliance.json") == release.license_compliance(dependencies),
            "license compliance evidence is inconsistent")
    require(json.loads((directory / "attribution.json").read_text(encoding="utf-8"))
            == release.attribution_entries(dependencies), "license attribution evidence is inconsistent")
    require((directory / "LICENSE").read_text(encoding="utf-8") == release.APACHE_LICENSE,
            "source license evidence differs")
    sbom = read_json(directory / "sbom.spdx.json")
    require(sbom.get("spdxVersion") == "SPDX-2.3" and sbom.get("name") == f"aosp-winscope-{version}",
            "common SPDX evidence is invalid or stale")
    packages = sbom.get("packages")
    expected_ids = {item["id"] for item in dependencies}
    require(isinstance(packages, list) and len(packages) == len(expected_ids),
            "common SPDX dependency inventory is incomplete")
    seen = set()
    for package in packages:
        require(isinstance(package, dict) and isinstance(package.get("externalRefs"), list)
                and len(package["externalRefs"]) == 1 and isinstance(package["externalRefs"][0], dict),
                "common SPDX dependency identity is invalid")
        locator = package["externalRefs"][0].get("referenceLocator")
        require(isinstance(locator, str) and locator in expected_ids and locator not in seen,
                "common SPDX dependency identity is invalid or duplicate")
        seen.add(locator)
        dependency = next(item for item in dependencies if item["id"] == locator)
        require(package.get("licenseConcluded") == dependency.get("license", "NOASSERTION")
                and package.get("licenseDeclared") == dependency.get("license", "NOASSERTION")
                and package.get("downloadLocation") == dependency.get("origin", "NOASSERTION"),
                "common SPDX dependency license evidence differs")


def checksum_text(directory: Path, names: set[str]) -> str:
    return "".join(f"{publish.sha256_file(directory / name)}  {name}\n" for name in sorted(names))


def verify(directory: Path, version: str, build_image: str, *, check_clean: bool = True) -> dict[str, Any]:
    identity = source_identity(version, build_image)
    if check_clean:
        publish.require_clean_tree()
    require(directory.is_dir() and not directory.is_symlink(), "evidence directory must be a real directory")
    expected = known_names(version)
    require({path.name for path in directory.iterdir()} == expected | {INDEX, SUMS},
            "evidence directory has missing or unexpected files (archives are forbidden)")
    total = 0
    for path in directory.iterdir():
        total += regular(path)
        require(path.lstat().st_mode & 0o111 == 0, f"executable evidence file is forbidden: {path.name}")
    require(total <= MAX_TOTAL_BYTES, "evidence directory exceeds the total size bound")
    index = read_json(directory / INDEX)
    require(set(index) == set(identity) | {"reports", "packages", "files"}
            and all(index.get(key) == value for key, value in identity.items()),
            "installer evidence version, mode, build image or current source identity differs")
    require(index.get("reports") == REPORTS, "installer evidence report inventory differs")
    descriptors = [descriptor(directory / name) for name in sorted(expected)]
    require(index.get("files") == descriptors, "installer evidence hash/size inventory differs")
    require((directory / SUMS).read_text(encoding="utf-8") == checksum_text(directory, expected | {INDEX}),
            "installer evidence SHA256SUMS.txt differs")
    verify_source_and_licenses(directory, version)
    packages = verify_manifests(directory, identity)
    require(index.get("packages") == packages, "installer evidence target manifest inventory differs")
    attestation = verify_attestation(directory, identity, packages)
    validation = publish.verify_validation(directory / REPORTS["validation"])
    checks = validation["checks"]
    require(all(isinstance(check, dict) and isinstance(check.get("name"), str)
                and check.get("status") == "pass" for check in checks)
            and len({check["name"] for check in checks}) == len(checks),
            "Stage 7 validation contains failing, skipped or duplicate gates")
    reproducibility = verify_reproducibility(directory / REPORTS["reproducibility"], identity, packages, attestation)
    for check in checks:
        if check["name"] == "release:reproducibility" and "evidence" in check:
            require(check["evidence"] == reproducibility, "Stage 7 reproducibility report lineage differs")
    publish.verify_release_image(directory / REPORTS["releaseImage"], build_image)
    verify_feature_stages(directory / REPORTS["featureStages"], identity["sourceCommit"])
    return {"ok": True, "version": version, "sourceCommit": identity["sourceCommit"],
            "artifactMode": "unpacked", "directory": str(directory.resolve()),
            "filesVerified": len(expected) + 2, "targetsVerified": len(packages)}


def stage(version: str, release_dir: Path, validation_path: Path, reproducibility_path: Path,
          release_image_path: Path, feature_stages_path: Path, build_image: str,
          output: Path) -> dict[str, Any]:
    identity = source_identity(version, build_image)
    publish.require_clean_tree()
    target = output / version
    require(not target.exists() and not target.is_symlink(), "publication target already exists and is immutable")
    release_dir = release_dir.resolve()
    artifact = release.verify_distribution(version, release_dir, unpacked_only=True)
    items = artifact.get("packages")
    require(artifact.get("ok") is True and artifact.get("artifactMode") == "unpacked"
            and artifact.get("version") == version and "archives" not in artifact,
            "installer evidence requires verified unpacked distribution outputs")
    package_digests([{key: item.get(key) for key in ("target", "sha256")} for item in items]
                    if isinstance(items, list) and all(isinstance(item, dict) for item in items) else None)
    common = release_dir / f"aosp-winscope-{version}-common"
    release.verify_license_evidence(common)
    sources = {name: common / relative for name, relative in COMMON_FILES.items()}
    sources.update({REPORTS["validation"]: validation_path, REPORTS["reproducibility"]: reproducibility_path,
                    REPORTS["releaseImage"]: release_image_path, REPORTS["featureStages"]: feature_stages_path,
                    "internal-SHA256SUMS": release_dir / "SHA256SUMS",
                    f"aosp-winscope-{version}.attestation.json": release_dir / f"aosp-winscope-{version}.attestation.json"})
    for item in items:
        tree = release_dir / f"aosp-winscope-{version}-{item['target']}"
        manifest = tree / "release-manifest.json"
        require(Path(item.get("package", "")).is_absolute()
                and Path(item["package"]) == tree.resolve()
                and Path(item.get("manifest", "")).is_absolute()
                and Path(item["manifest"]) == manifest.resolve()
                and item.get("subjectName") == f"{tree.name}/release-manifest.json"
                and item["sha256"] == publish.sha256_file(manifest),
                "verified unpacked package path or manifest digest differs")
        sources[manifest_name(item["target"])] = manifest
    require(set(sources) == known_names(version), "installer evidence source inventory differs")
    require(sum(regular(source) for source in sources.values()) <= MAX_TOTAL_BYTES,
            "evidence inputs exceed the total size bound")
    output.mkdir(parents=True, exist_ok=True)
    staging = Path(tempfile.mkdtemp(prefix=f".{version}-evidence-", dir=output))
    try:
        for name, source in sources.items():
            shutil.copyfile(source, staging / name)
            (staging / name).chmod(0o644)
        packages = verify_manifests(staging, identity)
        require({item["target"]: item["sha256"] for item in packages}
                == {item["target"]: item["sha256"] for item in items},
                "staged digests differ from current unpacked packages")
        index = {**identity, "reports": REPORTS, "packages": packages,
                 "files": [descriptor(staging / name) for name in sorted(sources)]}
        publish.write_json(staging / INDEX, index)
        (staging / SUMS).write_text(checksum_text(staging, set(sources) | {INDEX}), encoding="utf-8")
        result = verify(staging, version, build_image, check_clean=False)
        require(not target.exists() and not target.is_symlink(), "publication target already exists and is immutable")
        staging.rename(target)
        return {**result, "directory": str(target.resolve()), "index": str((target / INDEX).resolve())}
    finally:
        if staging.exists():
            shutil.rmtree(staging)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("command", choices=("stage", "verify"))
    parser.add_argument("--version", required=True)
    parser.add_argument("--build-image", default=os.environ.get("OFFICIAL_RELEASE_IMAGE"))
    parser.add_argument("--release-dir", type=Path, default=ROOT / "dist/release")
    parser.add_argument("--validation", type=Path, default=ROOT / "dist/validation/report.json")
    parser.add_argument("--reproducibility", type=Path, default=publish.DEFAULT_REPRODUCIBILITY)
    parser.add_argument("--release-image-report", type=Path, default=publish.DEFAULT_RELEASE_IMAGE_REPORT)
    parser.add_argument("--feature-stages-report", type=Path, default=publish.DEFAULT_FEATURE_STAGES_REPORT)
    parser.add_argument("--output", type=Path, default=publish.DEFAULT_OUTPUT)
    parser.add_argument("--directory", type=Path)
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()
    try:
        if args.command == "stage":
            result = stage(args.version, args.release_dir, args.validation, args.reproducibility,
                           args.release_image_report, args.feature_stages_report, args.build_image, args.output)
        else:
            require(args.directory is not None, "--directory is required for verify")
            result = verify(args.directory, args.version, args.build_image)
    except (OSError, ValueError, subprocess.SubprocessError) as error:
        result = {"ok": False, "errors": [str(error)]}
    print(json.dumps(result, sort_keys=True) if args.json else
          (result.get("directory") if result["ok"] else f"ERROR: {result['errors'][0]}"))
    return 0 if result["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
