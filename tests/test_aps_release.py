import hashlib
import importlib.util
import json
import shutil
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
APS_SPEC = importlib.util.spec_from_file_location("aps_release", ROOT / "scripts/verify-aps-release.py")
aps_release = importlib.util.module_from_spec(APS_SPEC)
assert APS_SPEC.loader is not None
APS_SPEC.loader.exec_module(aps_release)
RELEASE_SPEC = importlib.util.spec_from_file_location("release", ROOT / "scripts/release.py")
release = importlib.util.module_from_spec(RELEASE_SPEC)
assert RELEASE_SPEC.loader is not None
RELEASE_SPEC.loader.exec_module(release)

VERSION = "17.0.0-rc.1"
BUILD_IMAGE = "ghcr.io/example/release@sha256:" + "a" * 64


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


class ApsReleaseTest(unittest.TestCase):
    def make_publication(self, root: Path) -> Path:
        web = root / "web"
        web.mkdir()
        (web / "index.html").write_text('<base href="./">\n', encoding="utf-8")
        (web / "runtime-config.json").write_text('{"schemaVersion":1}\n', encoding="utf-8")
        (web / "3rdpartylicenses.txt").write_text("dependency\nMIT\nlicense text\n", encoding="utf-8")
        launchers = root / "launchers"
        for operating_system, architecture, filename in release.LAUNCHER_TARGETS:
            path = launchers / f"{operating_system}-{architecture}" / filename
            path.parent.mkdir(parents=True)
            path.write_bytes(f"{operating_system}-{architecture}".encode())
        proxy = root / "winscope_proxy.py"
        proxy.write_text("#!/usr/bin/env python3\n", encoding="utf-8")
        publication = root / "publication"
        report = release.package_distribution(VERSION, root / "release", web, launchers, proxy)
        publication.mkdir()
        for item in report["archives"]:
            shutil.copyfile(item["archive"], publication / Path(item["archive"]).name)
        shutil.copyfile(report["sums"], publication / "SHA256SUMS")
        shutil.copyfile(report["attestation"], publication / f"aosp-winscope-{VERSION}.attestation.json")
        commit = release.git_commit()
        epoch = release.source_date_epoch()
        lock_digest = release.sha256_file(release.LOCK_PATH)
        archive_records = [{"target": item["target"], "sha256": item["sha256"]} for item in report["archives"]]
        validation = publication / "report.json"
        validation.write_text(json.dumps({
            "schemaVersion": 1, "stage": 7, "ok": True, "complete": True,
            "checks": [{"name": name, "status": "pass"} for name in ("release:reproducibility", "runtime:security")],
            "externalEvidence": {"schemaVersion": 1, "inputs": {name: {"sha256": value * 64, "size": index + 1} for index, (name, value) in enumerate((("android17Device", "1"), ("vulnerability", "2"), ("performanceBaseline", "3"), ("performanceBenchmark", "4")))}, "missing": []},
        }), encoding="utf-8")
        reproducibility = publication / "reproducibility.json"
        reproducibility.write_text(json.dumps({
            "schemaVersion": 1, "stage": 10, "ok": True, "version": VERSION,
            "sourceCommit": commit, "dependencyLockSha256": lock_digest,
            "byteIdentical": True, "provenanceVerified": True,
            "builds": [{"archives": archive_records, "provenanceVerified": True}] * 2,
        }), encoding="utf-8")
        release_image = publication / "release-image.json"
        release_image.write_text(json.dumps({"schemaVersion": 1, "ok": True, "image": BUILD_IMAGE, "imageId": "sha256:" + "b" * 64, "platform": "linux/amd64", "anonymousPull": True, "networkDisabledDuringProbe": True, "readOnlyProbe": True, "tools": list(aps_release.REQUIRED_RELEASE_IMAGE_TOOLS), "errors": []}), encoding="utf-8")
        features = publication / "feature-stages.json"
        features.write_text(json.dumps({"schemaVersion": 1, "ok": True, "sourceCommit": commit, "stages": [{"stage": stage, "status": "pass", "documented": True, "missing": [], "files": [{"path": str(stage), "sha256": str(stage)[-1] * 64}]} for stage in range(20, 26)], "checks": [{"name": name, "status": "pass", "returncode": 0} for name in ("typescript", "python", "go", "angularUnit")]}), encoding="utf-8")
        guide = publication / "APS_INTEGRATION.md"
        guide.write_text("offline integration\n", encoding="utf-8")
        packages = [Path(item["package"]) for item in report["archives"]]
        supply = json.loads((packages[0] / "dependency-bundle/dependencies.lock.json").read_text())
        baseline = json.loads((packages[0] / "dependency-bundle/android17-baseline.json").read_text())
        frozen = publication / "frozen-inputs.json"
        frozen.write_text(json.dumps({
            "schemaVersion": 1, "version": VERSION, "sourceCommit": commit, "sourceDateEpoch": epoch,
            "baseline": baseline["baseline"], "productInputs": baseline["productInputs"],
            "toolchain": baseline["toolchain"],
            "buildImage": BUILD_IMAGE, "releaseArchivesSha256": {
                item["target"]: item["sha256"] for item in archive_records
            },
            "validationReportSha256": digest(validation), "reproducibilityReportSha256": digest(reproducibility),
            "releaseImageReportSha256": digest(release_image), "featureStagesReportSha256": digest(features),
            "dependencyLockSha256": lock_digest,
            "packageLockSha256": release.sha256_file(packages[0] / "dependency-bundle/package-lock.json"),
            "vendorFileInventorySha256": release.sha256_file(packages[0] / "dependency-bundle/android17-winscope-files.json"),
            "dependencyEntries": len(supply["dependencies"]),
        }), encoding="utf-8")
        artifacts = [{"name": path.name, "sha256": digest(path), "size": path.stat().st_size, "kind": "archive" if path.suffix == ".zip" else "evidence"} for path in sorted(publication.iterdir())]
        index = {"schemaVersion": 1, "product": "aosp-winscope", "baseline": "android17-release", "version": VERSION, "channel": "rc", "tag": f"v{VERSION}", "sourceCommit": commit, "sourceDateEpoch": epoch, "publishedAt": "2026-08-20T00:00:00Z", "support": {"status": "prerelease", "securityUpdates": False, "baselineGeneration": 0, "track": "prerelease", "securitySupportUntil": None, "withdrawn": False, "withdrawal": None}, "securityResponse": {"schemaVersion": 1, "policy": {"criticalAssessmentHours": 24, "criticalFixOrMitigationHours": 72, "highAssessmentWorkingDays": 3, "highFixWorkingDays": 7}, "advisories": []}, "frozenInputs": {"path": frozen.name, "sha256": digest(frozen)}, "reports": {"validation": validation.name, "reproducibility": reproducibility.name, "releaseImage": release_image.name, "featureStages": features.name}, "instructions": {"apsIntegration": guide.name}, "artifacts": artifacts}
        (publication / "release-index.json").write_text(json.dumps(index), encoding="utf-8")
        return publication

    def verify(self, publication: Path):
        return aps_release.verify_publication(publication, digest(publication / "release-index.json"), BUILD_IMAGE)

    def test_valid_publication_verifies_all_portable_archives(self):
        with tempfile.TemporaryDirectory() as temporary:
            result = self.verify(self.make_publication(Path(temporary)))
            self.assertTrue(result["ok"])
            self.assertEqual(set(result["archiveSha256"]), {f"{os}-{arch}" for os, arch, _ in release.LAUNCHER_TARGETS})

    def test_archive_tampering_is_rejected(self):
        with tempfile.TemporaryDirectory() as temporary:
            publication = self.make_publication(Path(temporary))
            archive = next(publication.glob("*.zip"))
            archive.write_bytes(archive.read_bytes() + b"tampered")
            with self.assertRaisesRegex(ValueError, "artifact digest mismatch"):
                self.verify(publication)

    def test_archive_set_must_be_complete(self):
        with tempfile.TemporaryDirectory() as temporary:
            publication = self.make_publication(Path(temporary))
            index = publication / "release-index.json"
            value = json.loads(index.read_text())
            entry = next(item for item in value["artifacts"] if item["name"].endswith(".zip"))
            value["artifacts"].remove(entry)
            (publication / entry["name"]).unlink()
            index.write_text(json.dumps(value), encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "portable archive set"):
                self.verify(publication)

    def test_attestation_subject_tampering_is_rejected(self):
        with tempfile.TemporaryDirectory() as temporary:
            publication = self.make_publication(Path(temporary))
            attestation = publication / f"aosp-winscope-{VERSION}.attestation.json"
            value = json.loads(attestation.read_text())
            value["subject"] = value["subject"][:-1]
            attestation.write_text(json.dumps(value), encoding="utf-8")
            index = publication / "release-index.json"
            index_value = json.loads(index.read_text())
            entry = next(item for item in index_value["artifacts"] if item["name"] == attestation.name)
            entry.update({"sha256": digest(attestation), "size": attestation.stat().st_size})
            index.write_text(json.dumps(index_value), encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "attestation provenance mismatch"):
                self.verify(publication)


if __name__ == "__main__":
    unittest.main()
