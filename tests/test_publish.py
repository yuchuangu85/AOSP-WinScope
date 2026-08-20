import hashlib
import importlib.util
import json
import tempfile
import unittest
import zipfile
from pathlib import Path
from unittest import mock


ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("publish", ROOT / "scripts/publish.py")
publish = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(publish)


VERSION = "17.0.0-rc.1"
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
        archive = release_dir / f"aosp-winscope-{version}.zip"
        with zipfile.ZipFile(archive, "w") as package:
            for name in MEMBERS:
                if name != missing:
                    content = b"{}" if name.endswith(".json") else b"license evidence\n"
                    package.writestr(name, content)

        digest = hashlib.sha256(archive.read_bytes()).hexdigest()
        (release_dir / "SHA256SUMS").write_text(
            f"{digest}  {archive.name}\n", encoding="utf-8"
        )
        (release_dir / f"aosp-winscope-{version}.attestation.json").write_text(
            json.dumps({"subject": [{"name": archive.name, "digest": {"sha256": digest}}]}),
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
                "sourceCommit": publish.git_commit(),
                "dependencyLockSha256": publish.sha256_file(publish.LOCK),
                "byteIdentical": True,
                "provenanceVerified": True,
                "builds": [
                    {"zipSha256": "same", "provenanceVerified": True},
                    {"zipSha256": "same", "provenanceVerified": True},
                ],
            }),
            encoding="utf-8",
        )
        return release_dir, validation, reproducibility

    def publish_fixture(self, root: Path, version: str = VERSION, tag: str | None = None):
        release_dir, validation, reproducibility = self.make_release(root, version)
        with mock.patch.object(publish, "require_clean_tree"):
            result = publish.publish(
                version, release_dir, validation, root / "public", tag, reproducibility
            )
        return result

    def test_candidate_publish_generates_index_and_verifies(self):
        with tempfile.TemporaryDirectory() as temporary:
            result = self.publish_fixture(Path(temporary))
            index = Path(result["index"])

            self.assertEqual(result["channel"], "rc")
            self.assertEqual(publish.verify(index)["artifactsVerified"], 7)
            self.assertEqual(json.loads(index.read_text())["channel"], "rc")

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

    def test_missing_archive_evidence_is_rejected(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            release_dir, validation, reproducibility = self.make_release(root, missing="LICENSES/NOTICE")
            with mock.patch.object(publish, "require_clean_tree"):
                with self.assertRaisesRegex(ValueError, "omits required evidence"):
                    publish.publish(
                        VERSION, release_dir, validation, root / "public", None, reproducibility
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
