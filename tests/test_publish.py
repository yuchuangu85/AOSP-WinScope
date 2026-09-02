import importlib.util
import json
import os
import sys
import tempfile
import unittest
from datetime import datetime, timezone
from pathlib import Path
from unittest import mock


ROOT = Path(__file__).resolve().parents[1]
PUBLISH_SPEC = importlib.util.spec_from_file_location("publish", ROOT / "scripts/publish.py")
publish = importlib.util.module_from_spec(PUBLISH_SPEC)
assert PUBLISH_SPEC.loader is not None
PUBLISH_SPEC.loader.exec_module(publish)
RELEASE_SPEC = importlib.util.spec_from_file_location("release", ROOT / "scripts/release.py")
release = importlib.util.module_from_spec(RELEASE_SPEC)
assert RELEASE_SPEC.loader is not None
RELEASE_SPEC.loader.exec_module(release)

VERSION = "17.0.1-rc.1"
BUILD_IMAGE = "ghcr.io/example/release@sha256:" + "a" * 64


class PublishTest(unittest.TestCase):
    def make_release(self, root: Path, version: str = VERSION):
        web = root / "web"
        web.mkdir()
        (web / "index.html").write_text("<html>offline</html>\n", encoding="utf-8")
        (web / "runtime-config.json").write_text('{"schemaVersion":1}\n', encoding="utf-8")
        (web / "3rdpartylicenses.txt").write_text("dependency\nMIT\nlicense text\n", encoding="utf-8")
        launchers = root / "launchers"
        for operating_system, architecture, filename in release.LAUNCHER_TARGETS:
            path = launchers / f"{operating_system}-{architecture}" / filename
            path.parent.mkdir(parents=True)
            path.write_bytes(f"{operating_system}-{architecture}".encode())
        proxy = root / "winscope_proxy.py"
        proxy.write_text("#!/usr/bin/env python3\n", encoding="utf-8")
        release_dir = root / "release"
        report = release.package_distribution(version, release_dir, web, launchers, proxy)
        commit = publish.git_commit()
        lock_digest = publish.sha256_file(publish.LOCK)
        archive_records = [
            {"target": item["target"], "sha256": item["sha256"]}
            for item in report["archives"]
        ]
        validation = root / "validation.json"
        validation.write_text(json.dumps({
            "schemaVersion": 1, "stage": 7, "ok": True, "complete": True,
            "checks": [{"name": name, "status": "pass"} for name in ("release:reproducibility", "runtime:security")],
            "externalEvidence": {"schemaVersion": 1, "inputs": {
                name: {"sha256": character * 64, "size": index + 1}
                for index, (name, character) in enumerate((("android17Device", "1"), ("vulnerability", "2"), ("performanceBaseline", "3"), ("performanceBenchmark", "4")))
            }, "missing": []},
        }), encoding="utf-8")
        reproducibility = root / "reproducibility.json"
        reproducibility.write_text(json.dumps({
            "schemaVersion": 1, "stage": 10, "ok": True, "version": version,
            "sourceCommit": commit, "dependencyLockSha256": lock_digest,
            "byteIdentical": True, "provenanceVerified": True,
            "builds": [{"archives": archive_records, "provenanceVerified": True}] * 2,
        }), encoding="utf-8")
        (root / "release-image.json").write_text(json.dumps({
            "schemaVersion": 1, "ok": True, "image": BUILD_IMAGE,
            "imageId": "sha256:" + "b" * 64, "platform": "linux/amd64",
            "anonymousPull": True, "networkDisabledDuringProbe": True,
            "readOnlyProbe": True, "tools": list(publish.REQUIRED_RELEASE_IMAGE_TOOLS), "errors": [],
        }), encoding="utf-8")
        (root / "feature-stages.json").write_text(json.dumps({
            "schemaVersion": 1, "ok": True, "sourceCommit": commit,
            "stages": [{"stage": stage, "status": "pass", "documented": True, "missing": [], "files": [{"path": str(stage), "sha256": str(stage)[-1] * 64}]} for stage in range(20, 26)],
            "checks": [{"name": name, "status": "pass", "returncode": 0} for name in ("typescript", "python", "go", "angularUnit")],
        }), encoding="utf-8")
        return release_dir, validation, reproducibility, report

    def publish_fixture(self, root: Path):
        release_dir, validation, reproducibility, report = self.make_release(root)
        with mock.patch.object(publish, "require_clean_tree"):
            result = publish.publish(VERSION, release_dir, validation, root / "public", None, reproducibility, build_image=BUILD_IMAGE)
        return result, report

    def test_candidate_publish_contains_all_portable_archives(self):
        with tempfile.TemporaryDirectory() as temporary:
            result, report = self.publish_fixture(Path(temporary))
            index = Path(result["index"])
            value = json.loads(index.read_text())
            frozen = json.loads((index.parent / "frozen-inputs.json").read_text())
            self.assertEqual(result["channel"], "rc")
            self.assertEqual(publish.verify(index)["artifactsVerified"], 15)
            self.assertEqual(set(result["archiveSha256"]), {item["target"] for item in report["archives"]})
            self.assertEqual(frozen["releaseArchivesSha256"], result["archiveSha256"])
            self.assertEqual({item["name"] for item in value["artifacts"] if item["kind"] == "archive"}, {Path(item["archive"]).name for item in report["archives"]})

    def test_publish_rejects_missing_archive(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            release_dir, validation, reproducibility, report = self.make_release(root)
            Path(report["archives"][0]["archive"]).unlink()
            with mock.patch.object(publish, "require_clean_tree"):
                with self.assertRaisesRegex(ValueError, "missing"):
                    publish.publish(VERSION, release_dir, validation, root / "public", None, reproducibility, build_image=BUILD_IMAGE)

    def test_publish_rejects_missing_checksum_subject(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            release_dir, validation, reproducibility, _ = self.make_release(root)
            attestation = release_dir / f"aosp-winscope-{VERSION}.attestation.json"
            value = json.loads(attestation.read_text())
            value["subject"] = value["subject"][:-1]
            attestation.write_text(json.dumps(value), encoding="utf-8")
            with mock.patch.object(publish, "require_clean_tree"):
                with self.assertRaisesRegex(ValueError, "checksums"):
                    publish.publish(VERSION, release_dir, validation, root / "public", None, reproducibility, build_image=BUILD_IMAGE)

    def test_cli_reads_build_image_from_environment(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            release_dir, validation, reproducibility, _ = self.make_release(root)
            arguments = ["publish.py", "publish", "--version", VERSION, "--release-dir", str(release_dir), "--validation", str(validation), "--reproducibility", str(reproducibility), "--release-image-report", str(root / "release-image.json"), "--feature-stages-report", str(root / "feature-stages.json"), "--output", str(root / "public"), "--json"]
            with mock.patch.object(publish, "require_clean_tree"), mock.patch.object(sys, "argv", arguments), mock.patch.dict(os.environ, {"OFFICIAL_RELEASE_IMAGE": BUILD_IMAGE}):
                self.assertEqual(publish.main(), 0)

    def test_existing_publication_target_is_immutable(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            release_dir, validation, reproducibility, _ = self.make_release(root)
            output = root / "public" / VERSION
            output.mkdir(parents=True)
            with mock.patch.object(publish, "require_clean_tree"):
                with self.assertRaisesRegex(ValueError, "immutable"):
                    publish.publish(VERSION, release_dir, validation, root / "public", None, reproducibility, build_image=BUILD_IMAGE)

    def test_publication_uses_explicit_event_time(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            release_dir, validation, reproducibility, _ = self.make_release(root)
            with mock.patch.object(publish, "require_clean_tree"):
                result = publish.publish(VERSION, release_dir, validation, root / "public", None, reproducibility, published_at=datetime(2026, 8, 20, 12, 34, 56, tzinfo=timezone.utc), build_image=BUILD_IMAGE)
            self.assertEqual(json.loads(Path(result["index"]).read_text())["publishedAt"], "2026-08-20T12:34:56Z")


if __name__ == "__main__":
    unittest.main()
