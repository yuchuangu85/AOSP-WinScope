import hashlib
import importlib.util
import json
import subprocess
import sys
import tempfile
import unittest
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("aps_release", ROOT / "scripts/verify-aps-release.py")
aps_release = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(aps_release)
RELEASE_SPEC = importlib.util.spec_from_file_location("release", ROOT / "scripts/release.py")
release = importlib.util.module_from_spec(RELEASE_SPEC)
assert RELEASE_SPEC.loader is not None
RELEASE_SPEC.loader.exec_module(release)

VERSION = "17.0.0-rc.1"
COMMIT = "1" * 40
EPOCH = 1_700_000_000
BUILD_IMAGE = "ghcr.io/example/release@sha256:" + "a" * 64
POLICY = {
    "criticalAssessmentHours": 24,
    "criticalFixOrMitigationHours": 72,
    "highAssessmentWorkingDays": 3,
    "highFixWorkingDays": 7,
}


def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


class ApsReleaseTest(unittest.TestCase):
    def make_publication(
        self,
        root: Path,
        bad_web_digest: bool = False,
        traversal: bool = False,
        alias: bool = False,
        unmanifested_web: bool = False,
        root_member: bool = False,
        frozen_overrides: dict[str, object] | None = None,
        sbom_dependency_id: str | None = None,
        attribution_dependency_id: str | None = None,
        duplicate_sbom_dependency: bool = False,
        dependency_license: str = "MIT",
        dependency_origin: str = "https://registry.npmjs.org/dependency/-/dependency-1.0.0.tgz",
        extra_members: dict[str, bytes] | None = None,
        compressed_bomb: bool = False,
        unsupported_compression: bool = False,
    ) -> Path:
        publication = root / "publication"
        publication.mkdir()
        dependency = {
            "id": "test:dependency",
            "name": "dependency",
            "version": "1.0.0",
            "origin": dependency_origin,
            "license": dependency_license,
            "distribution": "runtime",
        }
        lock = {"schemaVersion": 1, "dependencies": [dependency]}
        baseline = {
            "schemaVersion": 1,
            "baseline": "android17-release",
            "productInputs": {"winscope": {"revision": "test"}},
            "toolchain": {"python": "3.12"},
        }
        inventory = {"fileCount": 0, "files": []}
        runtime_files = {
            "web/index.html": b"<html>offline</html>\n",
            "web/runtime-config.json": b'{"schemaVersion":1,"capture":{"provider":"none"}}\n',
            "web/3rdpartylicenses.txt": b"dependency\nMIT\nlicense text\n",
        }
        files = {
            **runtime_files,
            "LICENSES/LICENSE": b"license\n",
            "LICENSES/NOTICE": b"notice\n",
            "LICENSES/third-party/web-third-party-licenses.txt": runtime_files["web/3rdpartylicenses.txt"],
            "LICENSES/sbom.spdx.json": (json.dumps({
                "spdxVersion": "SPDX-2.3",
                "packages": [{
                    "licenseConcluded": dependency["license"],
                    "licenseDeclared": dependency["license"],
                    "downloadLocation": dependency["origin"],
                    "primaryPackagePurpose": "LIBRARY",
                    "comment": "distribution=runtime",
                    "externalRefs": [{"referenceLocator": dependency["id"]}],
                }],
                "files": [
                    {
                        "fileName": name,
                        "checksums": [{"algorithm": "SHA256", "checksumValue": digest(data)}],
                    }
                    for name, data in sorted(runtime_files.items())
                ],
            }) + "\n").encode(),
            "LICENSES/attribution.json": (json.dumps([{
                "id": dependency["id"],
                "name": dependency["name"],
                "version": dependency["version"],
                "license": dependency["license"],
                "origin": dependency["origin"],
                "distribution": dependency["distribution"],
            }]) + "\n").encode(),
            "LICENSES/compliance.json": (json.dumps({
                "schemaVersion": 1,
                "ok": True,
                "distributedDependencies": 1,
                "buildOnlyDependencies": 0,
                "approvedLicenses": [dependency["license"]],
            }) + "\n").encode(),
            "dependency-bundle/dependencies.lock.json": (json.dumps(lock) + "\n").encode(),
            "dependency-bundle/package-lock.json": b'{"lockfileVersion":3}\n',
            "dependency-bundle/package.json": b'{"name":"test"}\n',
            "dependency-bundle/android17-baseline.json": (json.dumps(baseline) + "\n").encode(),
            "dependency-bundle/android17-winscope-files.json": (json.dumps(inventory) + "\n").encode(),
        }
        if sbom_dependency_id is not None:
            files["LICENSES/sbom.spdx.json"] = (json.dumps({
                "spdxVersion": "SPDX-2.3",
                "packages": [{
                    "licenseConcluded": dependency["license"],
                    "licenseDeclared": dependency["license"],
                    "downloadLocation": dependency["origin"],
                    "primaryPackagePurpose": "LIBRARY",
                    "comment": "distribution=runtime",
                    "externalRefs": [{"referenceLocator": sbom_dependency_id}],
                }],
                "files": [
                    {
                        "fileName": name,
                        "checksums": [{"algorithm": "SHA256", "checksumValue": digest(data)}],
                    }
                    for name, data in sorted(runtime_files.items())
                ],
            }) + "\n").encode()
        if attribution_dependency_id is not None:
            files["LICENSES/attribution.json"] = (
                json.dumps([{
                    "id": attribution_dependency_id,
                    "name": dependency["name"],
                    "version": dependency["version"],
                    "license": dependency["license"],
                    "origin": dependency["origin"],
                    "distribution": dependency["distribution"],
                }]) + "\n"
            ).encode()
        if duplicate_sbom_dependency:
            sbom = json.loads(files["LICENSES/sbom.spdx.json"])
            sbom["packages"].append(sbom["packages"][0])
            files["LICENSES/sbom.spdx.json"] = (json.dumps(sbom) + "\n").encode()
        bundle_names = [name for name in files if name.startswith("dependency-bundle/")]
        files["dependency-bundle/manifest.json"] = (json.dumps({
            "schemaVersion": 1,
            "files": [
                {"path": name, "sha256": digest(files[name]), "size": len(files[name])}
                for name in sorted(bundle_names)
            ],
        }) + "\n").encode()
        if alias:
            files["web/./index.html"] = b"shadow"
        if unmanifested_web:
            files["web/unmanifested.js"] = b"shadow"
        if root_member:
            files["."] = b"shadow"
        files.update(extra_members or {})
        if compressed_bomb:
            files["web/compressed-bomb.txt"] = b"0" * 1_000_000
        manifest = {
            "schemaVersion": 1,
            "assets": [
                {
                    "path": name,
                    "sha256": "0" * 64 if bad_web_digest and name == "web/index.html" else digest(data),
                }
                for name, data in files.items()
                if name.startswith("web/") and name != "web/unmanifested.js"
            ],
        }
        files["manifest.json"] = (json.dumps(manifest, sort_keys=True) + "\n").encode()
        release_manifest = {
            "schemaVersion": 1,
            "version": VERSION,
            "sourceCommit": COMMIT,
            "sourceDateEpoch": EPOCH,
            "files": [
                {"path": name, "sha256": digest(data), "size": len(data)}
                for name, data in sorted(files.items())
            ],
        }
        release_manifest_bytes = (json.dumps(release_manifest, sort_keys=True) + "\n").encode()
        files["release-manifest.json"] = release_manifest_bytes
        if traversal:
            files["../outside"] = b"bad"

        archive = publication / f"aosp-winscope-{VERSION}.zip"
        with zipfile.ZipFile(archive, "w") as package:
            for name, data in files.items():
                compression = zipfile.ZIP_STORED
                if compressed_bomb and name == "web/compressed-bomb.txt":
                    compression = zipfile.ZIP_DEFLATED
                elif unsupported_compression and name == "web/index.html":
                    compression = zipfile.ZIP_LZMA
                package.writestr(name, data, compress_type=compression)
        archive_digest = hashlib.sha256(archive.read_bytes()).hexdigest()
        sums = publication / "SHA256SUMS"
        sums.write_text(f"{archive_digest}  {archive.name}\n", encoding="utf-8")
        lock_digest = digest(files["dependency-bundle/dependencies.lock.json"])
        attestation = publication / f"aosp-winscope-{VERSION}.attestation.json"
        attestation.write_text(json.dumps({
            "_type": "https://in-toto.io/Statement/v1",
            "subject": [
                {"name": archive.name, "digest": {"sha256": archive_digest}},
                {"name": sums.name, "digest": {"sha256": hashlib.sha256(sums.read_bytes()).hexdigest()}},
            ],
            "predicateType": "https://slsa.dev/provenance/v1",
            "predicate": {
                "buildDefinition": {
                    "buildType": aps_release.BUILD_TYPE,
                    "externalParameters": {"version": VERSION},
                    "internalParameters": {"sourceDateEpoch": EPOCH},
                    "resolvedDependencies": [
                        {"uri": "git:repository", "digest": {"sha1": COMMIT}},
                        {
                            "uri": "build/dependencies.lock.json",
                            "digest": {"sha256": lock_digest},
                        },
                    ],
                },
                "runDetails": {
                    "builder": {"id": aps_release.BUILDER_ID},
                    "metadata": {},
                    "byproducts": [{
                        "name": "release-manifest.json",
                        "digest": {"sha256": digest(release_manifest_bytes)},
                    }],
                },
            },
        }, sort_keys=True), encoding="utf-8")
        validation = publication / "report.json"
        validation.write_text(json.dumps({
            "schemaVersion": 1,
            "stage": 7,
            "ok": True,
            "complete": True,
            "checks": [
                {"name": "release:reproducibility", "status": "pass"},
                {"name": "runtime:security", "status": "pass"},
            ],
            "externalEvidence": {
                "schemaVersion": 1,
                "inputs": {
                    name: {"sha256": character * 64, "size": index + 1}
                    for index, (name, character) in enumerate((
                        ("android17Device", "1"),
                        ("vulnerability", "2"),
                        ("performanceBaseline", "3"),
                        ("performanceBenchmark", "4"),
                    ))
                },
                "missing": [],
            },
        }), encoding="utf-8")
        reproducibility = publication / "reproducibility.json"
        reproducibility.write_text(json.dumps({
            "schemaVersion": 1,
            "stage": 10,
            "ok": True,
            "version": VERSION,
            "sourceCommit": COMMIT,
            "dependencyLockSha256": lock_digest,
            "byteIdentical": True,
            "provenanceVerified": True,
            "builds": [
                {"zipSha256": archive_digest, "provenanceVerified": True},
                {"zipSha256": archive_digest, "provenanceVerified": True},
            ],
        }), encoding="utf-8")
        release_image = publication / "release-image.json"
        release_image.write_text(json.dumps({
            "schemaVersion": 1,
            "ok": True,
            "image": BUILD_IMAGE,
            "imageId": "sha256:" + "b" * 64,
            "platform": "linux/amd64",
            "anonymousPull": True,
            "networkDisabledDuringProbe": True,
            "readOnlyProbe": True,
            "tools": list(aps_release.REQUIRED_RELEASE_IMAGE_TOOLS),
            "errors": [],
        }), encoding="utf-8")
        feature_stages = publication / "feature-stages.json"
        feature_stages.write_text(json.dumps({
            "schemaVersion": 1,
            "ok": True,
            "sourceCommit": COMMIT,
            "stages": [
                {
                    "stage": stage,
                    "status": "pass",
                    "documented": True,
                    "missing": [],
                    "files": [{"path": f"stage-{stage}", "sha256": str(stage)[-1] * 64}],
                }
                for stage in range(20, 26)
            ],
            "checks": [
                {"name": name, "status": "pass", "returncode": 0}
                for name in ("typescript", "python", "go", "angularUnit")
            ],
        }), encoding="utf-8")
        guide = publication / "APS_INTEGRATION.md"
        guide.write_text("offline integration\n", encoding="utf-8")
        frozen = publication / "frozen-inputs.json"
        frozen_value = {
            "schemaVersion": 1,
            "version": VERSION,
            "sourceCommit": COMMIT,
            "sourceDateEpoch": EPOCH,
            "baseline": baseline["baseline"],
            "productInputs": baseline["productInputs"],
            "toolchain": baseline["toolchain"],
            "dependencyLockSha256": lock_digest,
            "packageLockSha256": digest(files["dependency-bundle/package-lock.json"]),
            "vendorFileInventorySha256": digest(files["dependency-bundle/android17-winscope-files.json"]),
            "dependencyEntries": len(lock["dependencies"]),
            "validationReportSha256": hashlib.sha256(validation.read_bytes()).hexdigest(),
            "reproducibilityReportSha256": hashlib.sha256(reproducibility.read_bytes()).hexdigest(),
            "releaseImageReportSha256": hashlib.sha256(release_image.read_bytes()).hexdigest(),
            "featureStagesReportSha256": hashlib.sha256(feature_stages.read_bytes()).hexdigest(),
            "releaseArchiveSha256": archive_digest,
            "buildImage": BUILD_IMAGE,
        }
        frozen_value.update(frozen_overrides or {})
        frozen.write_text(json.dumps(frozen_value), encoding="utf-8")
        artifacts = []
        for path in sorted(publication.iterdir()):
            if path.name == "release-index.json":
                continue
            artifacts.append({
                "name": path.name,
                "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
                "size": path.stat().st_size,
                "kind": "archive" if path.suffix == ".zip" else "evidence",
            })
        index = {
            "schemaVersion": 1,
            "product": "aosp-winscope",
            "baseline": "android17-release",
            "version": VERSION,
            "channel": "rc",
            "tag": f"v{VERSION}",
            "sourceCommit": COMMIT,
            "sourceDateEpoch": EPOCH,
            "publishedAt": "2026-08-20T00:00:00Z",
            "support": {
                "status": "prerelease",
                "securityUpdates": False,
                "baselineGeneration": 0,
                "track": "prerelease",
                "securitySupportUntil": None,
                "withdrawn": False,
                "withdrawal": None,
            },
            "securityResponse": {"schemaVersion": 1, "policy": POLICY, "advisories": []},
            "frozenInputs": {"path": frozen.name, "sha256": hashlib.sha256(frozen.read_bytes()).hexdigest()},
            "reports": {
                "validation": validation.name,
                "reproducibility": reproducibility.name,
                "releaseImage": release_image.name,
                "featureStages": feature_stages.name,
            },
            "instructions": {"apsIntegration": guide.name},
            "artifacts": artifacts,
        }
        (publication / "release-index.json").write_text(json.dumps(index), encoding="utf-8")
        return publication

    def test_real_release_archive_matches_consumer_contract(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            web = root / "web"
            web.mkdir()
            (web / "index.html").write_text('<base href="./">\n', encoding="utf-8")
            (web / "runtime-config.json").write_text('{"schemaVersion":1}\n', encoding="utf-8")
            (web / "main.js").write_text("ok\n", encoding="utf-8")
            (web / "3rdpartylicenses.txt").write_text(
                "dependency\nMIT\nlicense text\n", encoding="utf-8"
            )
            launchers = root / "launchers"
            for operating_system, architecture, filename in release.LAUNCHER_TARGETS:
                launcher = launchers / f"{operating_system}-{architecture}" / filename
                launcher.parent.mkdir(parents=True)
                launcher.write_bytes(b"launcher")
            proxy = root / "winscope_proxy.py"
            proxy.write_text("#!/usr/bin/env python3\n", encoding="utf-8")
            report = release.package_distribution(VERSION, root / "release", web, launchers, proxy)
            verified, _, supply = aps_release.verify_archive(
                Path(report["zip"]),
                {
                    "version": VERSION,
                    "sourceCommit": release.git_commit(),
                    "sourceDateEpoch": release.source_date_epoch(),
                },
            )
            self.assertEqual(verified, report["files"])
            self.assertEqual(supply["dependencyLockSha256"], release.sha256_file(release.LOCK_PATH))

    def test_valid_publication_verifies_offline(self):
        with tempfile.TemporaryDirectory() as temporary:
            publication = self.make_publication(Path(temporary))
            result = aps_release.verify_publication(publication, digest((publication / "release-index.json").read_bytes()), BUILD_IMAGE)
            self.assertTrue(result["ok"])
            self.assertEqual(result["version"], VERSION)
            self.assertGreater(result["archiveFilesVerified"], 0)

    def test_trusted_verifier_runs_without_repository_working_directory(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            publication = self.make_publication(root)
            result = subprocess.run(
                [
                    sys.executable,
                    str(ROOT / "scripts/verify-aps-release.py"),
                    "--publication",
                    str(publication),
                    "--expected-index-sha256",
                    digest((publication / "release-index.json").read_bytes()),
                    "--expected-build-image",
                    BUILD_IMAGE,
                    "--json",
                ],
                cwd=root,
                capture_output=True,
                text=True,
            )
            self.assertEqual(result.returncode, 0, result.stderr or result.stdout)
            self.assertTrue(json.loads(result.stdout)["ok"])
            result = subprocess.run(
                [
                    sys.executable,
                    str(ROOT / "scripts/verify-aps-release.py"),
                    "--publication",
                    str(publication),
                    "--expected-index-sha256",
                    digest((publication / "release-index.json").read_bytes()),
                    "--expected-build-image",
                    "ghcr.io/example/other@sha256:" + "b" * 64,
                    "--json",
                ],
                cwd=root,
                capture_output=True,
                text=True,
            )
            self.assertNotEqual(result.returncode, 0)
            self.assertIn("trusted build image mismatch", result.stdout)

    def test_expected_index_digest_is_required_as_external_trust_input(self):
        with tempfile.TemporaryDirectory() as temporary:
            publication = self.make_publication(Path(temporary))
            with self.assertRaisesRegex(ValueError, "trusted release index digest mismatch"):
                aps_release.verify_publication(publication, "0" * 64, BUILD_IMAGE)

    def test_release_index_requires_android17_baseline(self):
        with tempfile.TemporaryDirectory() as temporary:
            publication = self.make_publication(Path(temporary))
            index = publication / "release-index.json"
            value = json.loads(index.read_text())
            value["baseline"] = "android16-release"
            index.write_text(json.dumps(value), encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "unsupported release index"):
                aps_release.verify_publication(publication, digest(index.read_bytes()), BUILD_IMAGE)

    def test_frozen_supply_chain_metadata_must_match_archive(self):
        for field, value in (
            ("packageLockSha256", "0" * 64),
            ("vendorFileInventorySha256", "0" * 64),
            ("dependencyEntries", 2),
        ):
            with self.subTest(field=field), tempfile.TemporaryDirectory() as temporary:
                publication = self.make_publication(
                    Path(temporary),
                    frozen_overrides={field: value},
                )
                with self.assertRaisesRegex(ValueError, "frozen input lineage mismatch"):
                    aps_release.verify_publication(
                        publication,
                        digest((publication / "release-index.json").read_bytes()),
                        BUILD_IMAGE,
                    )

    def test_license_policy_matches_release_packager(self):
        self.assertEqual(
            aps_release.APPROVED_DISTRIBUTED_LICENSES,
            release.APPROVED_DISTRIBUTED_LICENSES,
        )
        self.assertEqual(
            aps_release.DISTRIBUTION_PURPOSES,
            release.DISTRIBUTION_PURPOSES,
        )

    def test_unapproved_distributed_license_is_rejected(self):
        with tempfile.TemporaryDirectory() as temporary:
            publication = self.make_publication(
                Path(temporary), dependency_license="NOASSERTION"
            )
            with self.assertRaisesRegex(ValueError, "unapproved distributed license"):
                aps_release.verify_publication(
                    publication,
                    digest((publication / "release-index.json").read_bytes()),
                    BUILD_IMAGE,
                )

    def test_runtime_origin_without_host_is_rejected(self):
        with tempfile.TemporaryDirectory() as temporary:
            publication = self.make_publication(
                Path(temporary), dependency_origin="https://user@"
            )
            with self.assertRaisesRegex(ValueError, "invalid distributed dependency origin"):
                aps_release.verify_publication(
                    publication,
                    digest((publication / "release-index.json").read_bytes()),
                    BUILD_IMAGE,
                )

    def test_license_dependency_ids_must_match_lock(self):
        cases = (
            {"sbom_dependency_id": "test:other-dependency"},
            {"attribution_dependency_id": "test:other-dependency"},
            {"duplicate_sbom_dependency": True},
        )
        for case in cases:
            with self.subTest(case=case), tempfile.TemporaryDirectory() as temporary:
                publication = self.make_publication(Path(temporary), **case)
                with self.assertRaisesRegex(ValueError, "license and dependency evidence are inconsistent"):
                    aps_release.verify_publication(
                        publication,
                        digest((publication / "release-index.json").read_bytes()),
                        BUILD_IMAGE,
                    )

    def test_publication_rejects_unindexed_files(self):
        with tempfile.TemporaryDirectory() as temporary:
            publication = self.make_publication(Path(temporary))
            (publication / "verify-aps-release.py").write_text("untrusted\n", encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "exactly match the release index"):
                aps_release.verify_publication(
                    publication,
                    digest((publication / "release-index.json").read_bytes()),
                    BUILD_IMAGE,
                )

    def test_publication_rejects_artifact_symlinks(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            publication = self.make_publication(root)
            guide = publication / "APS_INTEGRATION.md"
            target = root / "guide.md"
            target.write_bytes(guide.read_bytes())
            guide.unlink()
            guide.symlink_to(target)
            with self.assertRaisesRegex(ValueError, "artifact digest mismatch"):
                aps_release.verify_publication(
                    publication,
                    digest((publication / "release-index.json").read_bytes()),
                    BUILD_IMAGE,
                )

    def test_archive_rejects_cross_platform_path_aliases(self):
        cases = (
            {"web/INDEX.HTML": b"case alias"},
            {"web/index.html.": b"trailing dot"},
            {"web/CON": b"reserved"},
            {"web/caf\u00e9.js": b"nfc", "web/cafe\u0301.js": b"nfd"},
        )
        for extra_members in cases:
            with self.subTest(paths=tuple(extra_members)), tempfile.TemporaryDirectory() as temporary:
                publication = self.make_publication(
                    Path(temporary),
                    extra_members=extra_members,
                )
                with self.assertRaisesRegex(ValueError, "invalid archive"):
                    aps_release.verify_publication(
                        publication,
                        digest((publication / "release-index.json").read_bytes()),
                        BUILD_IMAGE,
                    )

    def test_archive_rejects_extreme_compression_ratio(self):
        with tempfile.TemporaryDirectory() as temporary:
            publication = self.make_publication(Path(temporary), compressed_bomb=True)
            with self.assertRaisesRegex(ValueError, "resource limits"):
                aps_release.verify_publication(
                    publication,
                    digest((publication / "release-index.json").read_bytes()),
                    BUILD_IMAGE,
                )

    def test_archive_rejects_unsupported_compression(self):
        with tempfile.TemporaryDirectory() as temporary:
            publication = self.make_publication(Path(temporary), unsupported_compression=True)
            with self.assertRaisesRegex(ValueError, "unsupported archive compression"):
                aps_release.verify_publication(
                    publication,
                    digest((publication / "release-index.json").read_bytes()),
                    BUILD_IMAGE,
                )

    def test_archive_digest_tampering_is_rejected(self):
        with tempfile.TemporaryDirectory() as temporary:
            publication = self.make_publication(Path(temporary))
            archive = publication / f"aosp-winscope-{VERSION}.zip"
            archive.write_bytes(archive.read_bytes() + b"tampered")
            with self.assertRaisesRegex(ValueError, "artifact digest mismatch"):
                aps_release.verify_publication(publication, digest((publication / "release-index.json").read_bytes()), BUILD_IMAGE)

    def test_web_manifest_tampering_is_rejected_after_outer_digests_match(self):
        with tempfile.TemporaryDirectory() as temporary:
            publication = self.make_publication(Path(temporary), bad_web_digest=True)
            with self.assertRaisesRegex(ValueError, "Web asset digest mismatch"):
                aps_release.verify_publication(publication, digest((publication / "release-index.json").read_bytes()), BUILD_IMAGE)

    def test_archive_path_traversal_is_rejected(self):
        with tempfile.TemporaryDirectory() as temporary:
            publication = self.make_publication(Path(temporary), traversal=True)
            with self.assertRaisesRegex(ValueError, "invalid archive path"):
                aps_release.verify_publication(publication, digest((publication / "release-index.json").read_bytes()), BUILD_IMAGE)

    def test_archive_path_alias_is_rejected(self):
        with tempfile.TemporaryDirectory() as temporary:
            publication = self.make_publication(Path(temporary), alias=True)
            with self.assertRaisesRegex(ValueError, "invalid archive path"):
                aps_release.verify_publication(publication, digest((publication / "release-index.json").read_bytes()), BUILD_IMAGE)

    def test_archive_root_member_is_rejected(self):
        with tempfile.TemporaryDirectory() as temporary:
            publication = self.make_publication(Path(temporary), root_member=True)
            with self.assertRaisesRegex(ValueError, "invalid archive path"):
                aps_release.verify_publication(
                    publication,
                    digest((publication / "release-index.json").read_bytes()),
                    BUILD_IMAGE,
                )

    def test_web_manifest_must_exactly_inventory_web_tree(self):
        with tempfile.TemporaryDirectory() as temporary:
            publication = self.make_publication(Path(temporary), unmanifested_web=True)
            with self.assertRaisesRegex(ValueError, "exactly inventory"):
                aps_release.verify_publication(publication, digest((publication / "release-index.json").read_bytes()), BUILD_IMAGE)



    def test_stage7_report_requires_external_evidence_manifest(self):
        with tempfile.TemporaryDirectory() as temporary:
            publication = self.make_publication(Path(temporary))
            validation = publication / "report.json"
            value = json.loads(validation.read_text())
            value.pop("externalEvidence")
            validation.write_text(json.dumps(value), encoding="utf-8")
            index = publication / "release-index.json"
            index_value = json.loads(index.read_text())
            validation_entry = next(
                item for item in index_value["artifacts"] if item["name"] == validation.name
            )
            validation_entry["sha256"] = digest(validation.read_bytes())
            validation_entry["size"] = validation.stat().st_size
            frozen = publication / "frozen-inputs.json"
            frozen_value = json.loads(frozen.read_text())
            frozen_value["validationReportSha256"] = digest(validation.read_bytes())
            frozen.write_text(json.dumps(frozen_value), encoding="utf-8")
            frozen_entry = next(
                item for item in index_value["artifacts"] if item["name"] == frozen.name
            )
            frozen_entry["sha256"] = digest(frozen.read_bytes())
            frozen_entry["size"] = frozen.stat().st_size
            index_value["frozenInputs"]["sha256"] = digest(frozen.read_bytes())
            index.write_text(json.dumps(index_value), encoding="utf-8")

            with self.assertRaisesRegex(ValueError, "Stage 7 validation evidence is invalid"):
                aps_release.verify_publication(publication, digest(index.read_bytes()), BUILD_IMAGE)

    def test_release_image_evidence_must_match_the_trusted_image(self):
        with tempfile.TemporaryDirectory() as temporary:
            publication = self.make_publication(Path(temporary))
            report = publication / "release-image.json"
            value = json.loads(report.read_text())
            value["image"] = "ghcr.io/example/other@sha256:" + "c" * 64
            report.write_text(json.dumps(value), encoding="utf-8")
            index = publication / "release-index.json"
            index_value = json.loads(index.read_text())
            entry = next(item for item in index_value["artifacts"] if item["name"] == report.name)
            entry["sha256"] = digest(report.read_bytes())
            entry["size"] = report.stat().st_size
            frozen = publication / "frozen-inputs.json"
            frozen_value = json.loads(frozen.read_text())
            frozen_value["releaseImageReportSha256"] = digest(report.read_bytes())
            frozen.write_text(json.dumps(frozen_value), encoding="utf-8")
            frozen_reference = index_value["frozenInputs"]
            frozen_reference["sha256"] = digest(frozen.read_bytes())
            frozen_entry = next(item for item in index_value["artifacts"] if item["name"] == frozen.name)
            frozen_entry["sha256"] = digest(frozen.read_bytes())
            frozen_entry["size"] = frozen.stat().st_size
            index.write_text(json.dumps(index_value), encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "Stage 16 release image evidence is invalid"):
                aps_release.verify_publication(
                    publication,
                    digest(index.read_bytes()),
                    BUILD_IMAGE,
                )



    def test_release_image_evidence_rejects_non_string_image_id(self):
        with tempfile.TemporaryDirectory() as temporary:
            report = Path(temporary) / "release-image.json"
            report.write_text(json.dumps({
                "schemaVersion": 1,
                "ok": True,
                "image": BUILD_IMAGE,
                "imageId": 7,
                "platform": "linux/amd64",
                "anonymousPull": True,
                "networkDisabledDuringProbe": True,
                "readOnlyProbe": True,
                "tools": list(aps_release.REQUIRED_RELEASE_IMAGE_TOOLS),
                "errors": [],
            }), encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "Stage 16 release image evidence is invalid"):
                aps_release.verify_release_image_evidence(
                    report,
                    {"releaseImageReportSha256": digest(report.read_bytes())},
                    BUILD_IMAGE,
                )

    def test_release_image_evidence_rejects_non_string_tool_entries(self):
        with tempfile.TemporaryDirectory() as temporary:
            report = Path(temporary) / "release-image.json"
            report.write_text(json.dumps({
                "schemaVersion": 1,
                "ok": True,
                "image": BUILD_IMAGE,
                "imageId": "sha256:" + "b" * 64,
                "platform": "linux/amd64",
                "anonymousPull": True,
                "networkDisabledDuringProbe": True,
                "readOnlyProbe": True,
                "tools": [*aps_release.REQUIRED_RELEASE_IMAGE_TOOLS[:-1], {}],
                "errors": [],
            }), encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "Stage 16 release image evidence is invalid"):
                aps_release.verify_release_image_evidence(
                    report,
                    {"releaseImageReportSha256": digest(report.read_bytes())},
                    BUILD_IMAGE,
                )

    def test_expected_build_image_argument_cannot_be_omitted(self):
        with tempfile.TemporaryDirectory() as temporary:
            publication = self.make_publication(Path(temporary))
            with self.assertRaises(TypeError):
                aps_release.verify_publication(
                    publication, digest((publication / "release-index.json").read_bytes())
                )

    def test_expected_build_image_is_required_as_external_trust_input(self):
        with tempfile.TemporaryDirectory() as temporary:
            publication = self.make_publication(Path(temporary))
            with self.assertRaisesRegex(ValueError, "trusted build image mismatch"):
                aps_release.verify_publication(
                    publication,
                    digest((publication / "release-index.json").read_bytes()),
                    "ghcr.io/example/other@sha256:" + "b" * 64,
                )

    def test_build_image_must_be_digest_pinned(self):
        with tempfile.TemporaryDirectory() as temporary:
            publication = self.make_publication(
                Path(temporary), frozen_overrides={"buildImage": "ghcr.io/example/release:latest"}
            )
            with self.assertRaisesRegex(ValueError, "trusted build image mismatch"):
                aps_release.verify_publication(
                    publication, digest((publication / "release-index.json").read_bytes()), BUILD_IMAGE
                )

    def test_attestation_source_mismatch_is_rejected(self):
        with tempfile.TemporaryDirectory() as temporary:
            publication = self.make_publication(Path(temporary))
            attestation = publication / f"aosp-winscope-{VERSION}.attestation.json"
            value = json.loads(attestation.read_text())
            dependency = next(
                item
                for item in value["predicate"]["buildDefinition"]["resolvedDependencies"]
                if item["uri"] == "git:repository"
            )
            dependency["digest"]["sha1"] = "2" * 40
            attestation.write_text(json.dumps(value), encoding="utf-8")
            index = publication / "release-index.json"
            index_value = json.loads(index.read_text())
            entry = next(item for item in index_value["artifacts"] if item["name"] == attestation.name)
            entry["sha256"] = hashlib.sha256(attestation.read_bytes()).hexdigest()
            entry["size"] = attestation.stat().st_size
            index.write_text(json.dumps(index_value), encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "attestation provenance mismatch"):
                aps_release.verify_publication(publication, digest((publication / "release-index.json").read_bytes()), BUILD_IMAGE)


if __name__ == "__main__":
    unittest.main()
