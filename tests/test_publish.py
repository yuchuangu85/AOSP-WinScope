import hashlib
import importlib.util
import json
import os
import sys
import tempfile
from datetime import datetime, timezone
import unittest
import zipfile
from pathlib import Path
from unittest import mock


ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("publish", ROOT / "scripts/publish.py")
publish = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(publish)
RELEASE_SPEC = importlib.util.spec_from_file_location("release", ROOT / "scripts/release.py")
release = importlib.util.module_from_spec(RELEASE_SPEC)
assert RELEASE_SPEC.loader is not None
RELEASE_SPEC.loader.exec_module(release)


VERSION = "17.0.0-rc.1"
BUILD_IMAGE = "ghcr.io/example/release@sha256:" + "a" * 64
MEMBERS = (
    "manifest.json",
    "release-manifest.json",
    "LICENSES/LICENSE",
    "LICENSES/NOTICE",
    "LICENSES/sbom.spdx.json",
    "LICENSES/attribution.json",
    "dependency-bundle/dependencies.lock.json",
)


class PublishTest(unittest.TestCase):
    def make_release(self, root: Path, version: str = VERSION, missing: str | None = None):
        release_dir = root / "release"
        release_dir.mkdir()
        package_root = root / "package"
        web = package_root / "web"
        web.mkdir(parents=True)
        (web / "index.html").write_text("<html>offline</html>\n", encoding="utf-8")
        (web / "runtime-config.json").write_text(
            '{"schemaVersion":1,"capture":{"provider":"none"}}\n',
            encoding="utf-8",
        )
        commit = publish.git_commit()
        epoch = publish.git_epoch()
        release.make_license_evidence(package_root)
        release.make_sbom(package_root, version, epoch)
        release.dependency_bundle(package_root)
        release.create_web_manifest(package_root)
        if missing is not None:
            (package_root / missing).unlink(missing_ok=True)
        release_manifest = {
            "schemaVersion": 1,
            "version": version,
            "sourceCommit": commit,
            "sourceDateEpoch": epoch,
            "files": [
                {
                    "path": path.relative_to(package_root).as_posix(),
                    "sha256": release.sha256_file(path),
                    "size": path.stat().st_size,
                }
                for path in release.files_under(package_root)
            ],
        }
        release.write_json(package_root / "release-manifest.json", release_manifest)
        release_manifest_path = package_root / "release-manifest.json"
        archive = release_dir / f"aosp-winscope-{version}.zip"
        release.write_deterministic_zip(package_root, archive, epoch)
        archive_digest = hashlib.sha256(archive.read_bytes()).hexdigest()
        sums = release_dir / "SHA256SUMS"
        sums.write_text(f"{archive_digest}  {archive.name}\n", encoding="utf-8")
        lock_digest = publish.sha256_file(publish.LOCK)
        (release_dir / f"aosp-winscope-{version}.attestation.json").write_text(
            json.dumps({
                "_type": "https://in-toto.io/Statement/v1",
                "subject": [
                    {"name": archive.name, "digest": {"sha256": archive_digest}},
                    {"name": sums.name, "digest": {"sha256": hashlib.sha256(sums.read_bytes()).hexdigest()}},
                ],
                "predicateType": "https://slsa.dev/provenance/v1",
                "predicate": {
                    "buildDefinition": {
                        "buildType": release.BUILD_TYPE,
                        "externalParameters": {"version": version},
                        "internalParameters": {"sourceDateEpoch": epoch},
                        "resolvedDependencies": [
                            {"uri": "git:repository", "digest": {"sha1": commit}},
                            {
                                "uri": "build/dependencies.lock.json",
                                "digest": {"sha256": lock_digest},
                            },
                        ],
                    },
                    "runDetails": {
                        "builder": {"id": release.BUILDER_ID},
                        "metadata": {},
                        "byproducts": [{
                            "name": "release-manifest.json",
                            "digest": {"sha256": release.sha256_file(release_manifest_path)},
                        }],
                    },
                },
            }, sort_keys=True),
            encoding="utf-8",
        )
        validation = root / "validation.json"
        validation.write_text(
            json.dumps({
                "schemaVersion": 1,
                "stage": 7,
                "ok": True,
                "complete": True,
                "checks": [
                    {"name": "release:reproducibility", "status": "pass"},
                    {"name": "runtime:security", "status": "pass"},
                ],
            }),
            encoding="utf-8",
        )
        reproducibility = root / "reproducibility.json"
        reproducibility.write_text(
            json.dumps({
                "schemaVersion": 1,
                "stage": 10,
                "ok": True,
                "version": version,
                "sourceCommit": commit,
                "dependencyLockSha256": lock_digest,
                "byteIdentical": True,
                "provenanceVerified": True,
                "builds": [
                    {"zipSha256": archive_digest, "provenanceVerified": True},
                    {"zipSha256": archive_digest, "provenanceVerified": True},
                ],
            }),
            encoding="utf-8",
        )
        release_image = root / "release-image.json"
        release_image.write_text(
            json.dumps({
                "schemaVersion": 1,
                "ok": True,
                "image": BUILD_IMAGE,
                "imageId": "sha256:" + "b" * 64,
                "platform": "linux/amd64",
                "anonymousPull": True,
                "networkDisabledDuringProbe": True,
                "readOnlyProbe": True,
                "tools": list(publish.REQUIRED_RELEASE_IMAGE_TOOLS),
                "errors": [],
            }),
            encoding="utf-8",
        )
        return release_dir, validation, reproducibility

    def publish_fixture(self, root: Path, version: str = VERSION, tag: str | None = None):
        release_dir, validation, reproducibility = self.make_release(root, version)
        with mock.patch.object(publish, "require_clean_tree"):
            result = publish.publish(
                version, release_dir, validation, root / "public", tag, reproducibility, build_image=BUILD_IMAGE
            )
        return result

    def test_candidate_publish_generates_index_and_verifies(self):
        with tempfile.TemporaryDirectory() as temporary:
            result = self.publish_fixture(Path(temporary))
            index = Path(result["index"])

            self.assertEqual(result["channel"], "rc")
            self.assertEqual(publish.verify(index)["artifactsVerified"], 8)
            value = json.loads(index.read_text())
            self.assertEqual(value["channel"], "rc")
            self.assertEqual(value["support"]["status"], "prerelease")
            self.assertFalse(value["support"]["securityUpdates"])
            self.assertTrue(value["publicationPolicy"]["protectedTagRequired"])
            self.assertEqual(value["support"]["track"], "prerelease")
            self.assertEqual(value["securityResponse"]["policy"], publish.SECURITY_RESPONSE_POLICY)
            frozen = json.loads((index.parent / "frozen-inputs.json").read_text())
            self.assertEqual(frozen["buildImage"], BUILD_IMAGE)
            self.assertEqual(value["reports"]["releaseImage"], "release-image.json")
            self.assertEqual(
                frozen["releaseImageReportSha256"],
                publish.sha256_file(index.parent / "release-image.json"),
            )

    def test_cli_reads_build_image_from_environment(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            release_dir, validation, reproducibility = self.make_release(root)
            output = root / "public"
            arguments = [
                "publish.py",
                "publish",
                "--version",
                VERSION,
                "--release-dir",
                str(release_dir),
                "--validation",
                str(validation),
                "--reproducibility",
                str(reproducibility),
                "--release-image-report",
                str(root / "release-image.json"),
                "--output",
                str(output),
                "--json",
            ]
            with (
                mock.patch.object(publish, "require_clean_tree"),
                mock.patch.object(sys, "argv", arguments),
                mock.patch.dict(os.environ, {"OFFICIAL_RELEASE_IMAGE": BUILD_IMAGE}),
            ):
                self.assertEqual(publish.main(), 0)
            frozen = json.loads((output / VERSION / "frozen-inputs.json").read_text())
            self.assertEqual(frozen["buildImage"], BUILD_IMAGE)

    def test_build_image_must_be_digest_pinned(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            release_dir, validation, reproducibility = self.make_release(root)
            with mock.patch.object(publish, "require_clean_tree"):
                with self.assertRaisesRegex(ValueError, "build image"):
                    publish.publish(
                        VERSION,
                        release_dir,
                        validation,
                        root / "public",
                        None,
                        reproducibility,
                        build_image="ghcr.io/example/release:latest",
                    )


    def test_release_image_evidence_must_match_the_approved_image(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            release_dir, validation, reproducibility = self.make_release(root)
            report = root / "release-image.json"
            value = json.loads(report.read_text())
            value["image"] = "ghcr.io/example/other@sha256:" + "c" * 64
            report.write_text(json.dumps(value), encoding="utf-8")
            with mock.patch.object(publish, "require_clean_tree"):
                with self.assertRaisesRegex(ValueError, "release image evidence"):
                    publish.publish(
                        VERSION,
                        release_dir,
                        validation,
                        root / "public",
                        None,
                        reproducibility,
                        build_image=BUILD_IMAGE,
                    )

    def test_existing_publication_target_is_immutable(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            release_dir, validation, reproducibility = self.make_release(root)
            output = root / "public"
            output.mkdir()
            (output / VERSION).mkdir()
            marker = output / VERSION / "keep.txt"
            marker.write_text("keep", encoding="utf-8")
            with mock.patch.object(publish, "require_clean_tree"):
                with self.assertRaisesRegex(ValueError, "immutable"):
                    publish.publish(VERSION, release_dir, validation, output, None, reproducibility, build_image=BUILD_IMAGE)
            self.assertEqual(marker.read_text(encoding="utf-8"), "keep")

    def test_failed_publication_leaves_no_final_or_staging_directory(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            release_dir, validation, reproducibility = self.make_release(root)
            output = root / "public"
            with mock.patch.object(publish, "require_clean_tree"), mock.patch.object(
                publish.shutil, "copyfile", side_effect=OSError("copy failed")
            ):
                with self.assertRaisesRegex(OSError, "copy failed"):
                    publish.publish(VERSION, release_dir, validation, output, None, reproducibility, build_image=BUILD_IMAGE)
            self.assertFalse((output / VERSION).exists())
            self.assertEqual(list(output.iterdir()), [])

    def test_publication_uses_explicit_event_time(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            release_dir, validation, reproducibility = self.make_release(root)
            event_time = datetime(2026, 8, 20, 12, 34, 56, tzinfo=timezone.utc)
            with mock.patch.object(publish, "require_clean_tree"):
                result = publish.publish(
                    VERSION, release_dir, validation, root / "public", None, reproducibility,
                    published_at=event_time,
                    build_image=BUILD_IMAGE,
                )
            index = json.loads(Path(result["index"]).read_text())
            self.assertEqual(index["publishedAt"], "2026-08-20T12:34:56Z")

    def test_stable_and_version_validation(self):
        self.assertEqual(publish.version_channel("17.0.0"), "stable")
        self.assertEqual(publish.version_channel("17.2.3-alpha.1"), "alpha")
        self.assertEqual(publish.version_channel("17.2.3-rc.4"), "rc")
        for version in ("16.0.0", "17.1.0", "17.0", "17.0.0-beta.1"):
            with self.assertRaises(ValueError):
                publish.version_channel(version)

        with tempfile.TemporaryDirectory() as temporary:
            with self.assertRaisesRegex(ValueError, "must be tagged v17.0.0"):
                self.publish_fixture(Path(temporary), "17.0.0", "wrong-tag")
        with tempfile.TemporaryDirectory() as temporary:
            with self.assertRaisesRegex(ValueError, f"must be tagged v{VERSION}"):
                self.publish_fixture(Path(temporary), VERSION, "candidate")

    def test_attestation_must_cover_checksum_set(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            release_dir, validation, reproducibility = self.make_release(root)
            attestation = release_dir / f"aosp-winscope-{VERSION}.attestation.json"
            value = json.loads(attestation.read_text())
            value["subject"] = [item for item in value["subject"] if item["name"] != "SHA256SUMS"]
            attestation.write_text(json.dumps(value), encoding="utf-8")
            with mock.patch.object(publish, "require_clean_tree"):
                with self.assertRaisesRegex(ValueError, "checksums"):
                    publish.publish(VERSION, release_dir, validation, root / "public", None, reproducibility, build_image=BUILD_IMAGE)

    def test_missing_archive_evidence_is_rejected(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            release_dir, validation, reproducibility = self.make_release(root, missing="LICENSES/NOTICE")
            with mock.patch.object(publish, "require_clean_tree"):
                with self.assertRaisesRegex(ValueError, "omits required evidence"):
                    publish.publish(
                        VERSION, release_dir, validation, root / "public", None, reproducibility, build_image=BUILD_IMAGE
                    )

    def test_final_index_requires_reports_and_aps_instructions(self):
        with tempfile.TemporaryDirectory() as temporary:
            result = self.publish_fixture(Path(temporary))
            index = Path(result["index"])
            value = json.loads(index.read_text())
            value.pop("instructions")
            index.write_text(json.dumps(value), encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "omits final reports"):
                publish.verify(index)

    def test_tampered_published_archive_is_rejected(self):
        with tempfile.TemporaryDirectory() as temporary:
            result = self.publish_fixture(Path(temporary))
            index = Path(result["index"])
            archive = index.parent / f"aosp-winscope-{VERSION}.zip"
            archive.write_bytes(archive.read_bytes() + b"tampered")

            with self.assertRaisesRegex(ValueError, "published artifact digest mismatch"):
                publish.verify(index)

    def test_tampered_frozen_inputs_are_rejected(self):
        with tempfile.TemporaryDirectory() as temporary:
            result = self.publish_fixture(Path(temporary))
            index = Path(result["index"])
            frozen = index.parent / "frozen-inputs.json"
            frozen.write_bytes(frozen.read_bytes() + b"tampered")

            with self.assertRaisesRegex(ValueError, "frozen input evidence digest mismatch"):
                publish.verify(index)


if __name__ == "__main__":
    unittest.main()
