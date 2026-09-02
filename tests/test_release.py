#!/usr/bin/env python3

import hashlib
import importlib.util
import json
import os
import tempfile
import unittest
import warnings
import zipfile
from unittest import mock
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("release", ROOT / "scripts/release.py")
release = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(release)


class ReleaseEngineeringTest(unittest.TestCase):
    def make_inputs(self, root: Path) -> tuple[Path, Path, Path]:
        web = root / "web"
        web.mkdir()
        (web / "index.html").write_text('<base href="./">\n', encoding="utf-8")
        (web / "runtime-config.json").write_text('{"schemaVersion":1}\n', encoding="utf-8")
        (web / "main.abc.js").write_text("console.log('ok');\n", encoding="utf-8")
        (web / "3rdpartylicenses.txt").write_text("dependency\nMIT\nlicense text\n", encoding="utf-8")

        launchers = root / "launchers"
        for operating_system, architecture, filename in release.LAUNCHER_TARGETS:
            path = launchers / f"{operating_system}-{architecture}" / filename
            path.parent.mkdir(parents=True)
            path.write_bytes(f"{operating_system}-{architecture}".encode())

        proxy = root / "winscope_proxy.py"
        proxy.write_text("#!/usr/bin/env python3\n", encoding="utf-8")
        return web, launchers, proxy

    def test_package_is_reproducible_and_contains_release_evidence(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            web, launchers, proxy = self.make_inputs(root)
            old_epoch = os.environ.get("SOURCE_DATE_EPOCH")
            os.environ["SOURCE_DATE_EPOCH"] = "1700000001"
            try:
                first = release.package_distribution("17.0.0", root / "first", web, launchers, proxy)
                second = release.package_distribution("17.0.0", root / "second", web, launchers, proxy)
            finally:
                if old_epoch is None:
                    os.environ.pop("SOURCE_DATE_EPOCH", None)
                else:
                    os.environ["SOURCE_DATE_EPOCH"] = old_epoch

            first_archives = first["archives"]
            second_archives = second["archives"]
            self.assertEqual(
                [item["sha256"] for item in first_archives],
                [item["sha256"] for item in second_archives],
            )
            self.assertEqual(len(first_archives), len(release.LAUNCHER_TARGETS))
            for item in first_archives:
                self.assertEqual(Path(item["archive"]).read_bytes(), Path(next(
                    candidate["archive"] for candidate in second_archives
                    if candidate["target"] == item["target"]
                )).read_bytes())
                verified_zip = release.verify_package(Path(item["archive"]))
                self.assertEqual(verified_zip["zipSha256"], item["sha256"])

            package = Path(first_archives[0]["package"])
            self.assertTrue((package / "start-winscope.bat").is_file())
            self.assertTrue((package / "start-winscope.ps1").is_file())
            self.assertIn("%ROOT%bin\\windows-amd64\\winscope-launcher.exe", (package / "start-winscope.bat").read_text())
            self.assertIn("@args", (package / "start-winscope.ps1").read_text())
            self.assertNotIn("double-click", (package / "README.txt").read_text(encoding="utf-8"))
            self.assertTrue((package / "LICENSES/sbom.spdx.json").is_file())
            compliance = json.loads(
                (package / "LICENSES/compliance.json").read_text(encoding="utf-8")
            )
            self.assertTrue(compliance["ok"])
            self.assertEqual(compliance["distributedDependencies"], 223)
            self.assertEqual(first["distributedDependencies"], 223)
            self.assertTrue((package / "dependency-bundle/dependencies.lock.json").is_file())
            sbom = json.loads((package / "LICENSES/sbom.spdx.json").read_text())
            self.assertEqual(
                len(sbom["packages"]),
                len(json.loads((ROOT / "build/dependencies.lock.json").read_text())["dependencies"]),
            )
            self.assertEqual(
                {item["fileName"] for item in sbom["files"]},
                {
                    path.relative_to(package).as_posix()
                    for path in release.runtime_payload_files(package)
                },
            )
            self.assertEqual(
                (package / "LICENSES/third-party/web-third-party-licenses.txt").read_bytes(),
                (package / "web/3rdpartylicenses.txt").read_bytes(),
            )
            self.assertEqual(
                hashlib.sha256(Path(first_archives[0]["archive"]).read_bytes()).hexdigest(),
                first_archives[0]["sha256"],
            )
            attestation = json.loads(Path(first["attestation"]).read_text())
            subjects = {item["name"]: item["digest"]["sha256"] for item in attestation["subject"]}
            self.assertEqual(subjects["SHA256SUMS"], release.sha256_file(Path(first["sums"])))
            self.assertEqual(
                {Path(item["archive"]).name for item in first_archives},
                set(subjects) - {"SHA256SUMS"},
            )
            self.assertEqual(
                attestation["predicate"]["buildDefinition"]["buildType"],
                release.BUILD_TYPE,
            )
            self.assertEqual(
                attestation["predicate"]["runDetails"]["builder"]["id"],
                release.BUILDER_ID,
            )

    def test_repository_documents_stage_nineteen_license_gate(self):
        plan = (ROOT / "docs/REBUILD_PLAN.md").read_text(encoding="utf-8")
        self.assertIn("## Stage 19 implementation evidence", plan)
        self.assertIn("LICENSES/compliance.json", plan)
        self.assertIn("No restrictive", plan)
        self.assertIn("license exception is approved", plan)

    def test_double_build_emits_verified_reproducibility_evidence(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            web, launchers, proxy = self.make_inputs(root)
            with mock.patch.object(release, "require_clean_tree"):
                report = release.double_build("17.0.0", web, launchers, proxy)
            self.assertEqual(report["schemaVersion"], 1)
            self.assertEqual(report["stage"], 10)
            self.assertTrue(report["byteIdentical"])
            self.assertTrue(report["provenanceVerified"])
            self.assertEqual(len(report["builds"]), 2)
            self.assertEqual(report["builds"][0]["archives"], report["builds"][1]["archives"])
            self.assertEqual(len(report["builds"][0]["archives"]), len(release.LAUNCHER_TARGETS))
            self.assertTrue(all(build["provenanceVerified"] for build in report["builds"]))

    def test_attestation_tampering_is_rejected(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            web, launchers, proxy = self.make_inputs(root)
            report = release.package_distribution("17.0.0", root / "release", web, launchers, proxy)
            attestation = Path(report["attestation"])
            value = json.loads(attestation.read_text(encoding="utf-8"))
            dependency = next(
                item
                for item in value["predicate"]["buildDefinition"]["resolvedDependencies"]
                if item["uri"] == "git:repository"
            )
            dependency["digest"]["sha1"] = "tampered"
            attestation.write_text(json.dumps(value), encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "attestation does not verify"):
                release.verify_attestation(
                    attestation,
                    report["archives"],
                    None,
                    [Path(item["package"]) for item in report["archives"]],
                )

    def test_attestation_checksum_subject_tampering_is_rejected(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            web, launchers, proxy = self.make_inputs(root)
            report = release.package_distribution("17.0.0", root / "release", web, launchers, proxy)
            attestation = Path(report["attestation"])
            value = json.loads(attestation.read_text(encoding="utf-8"))
            subject = next(item for item in value["subject"] if item["name"] == "SHA256SUMS")
            subject["digest"]["sha256"] = "0" * 64
            attestation.write_text(json.dumps(value), encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "attestation does not verify"):
                release.verify_attestation(
                    attestation,
                    report["archives"],
                    None,
                    [Path(item["package"]) for item in report["archives"]],
                )

    def test_zip_with_duplicate_evidence_member_is_rejected(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            web, launchers, proxy = self.make_inputs(root)
            report = release.package_distribution(
                "17.0.0", root / "release", web, launchers, proxy
            )
            archive = Path(report["archives"][0]["archive"])
            with warnings.catch_warnings():
                warnings.simplefilter("ignore", UserWarning)
                with zipfile.ZipFile(archive, "a") as package:
                    package.writestr("LICENSES/compliance.json", b'{}\n')

            with self.assertRaisesRegex(ValueError, "invalid release archive member"):
                release.verify_package(archive)

    def test_package_rejects_unapproved_runtime_license(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            web, launchers, proxy = self.make_inputs(root)
            lock = json.loads(release.LOCK_PATH.read_text(encoding="utf-8"))
            dependency = next(
                entry
                for entry in lock["dependencies"]
                if entry["distribution"] == "runtime"
            )
            dependency["license"] = "NOASSERTION"
            lock_path = root / "dependencies.lock.json"
            lock_path.write_text(json.dumps(lock), encoding="utf-8")

            with mock.patch.object(release, "LOCK_PATH", lock_path):
                with self.assertRaisesRegex(ValueError, "unapproved distributed license"):
                    release.package_distribution(
                        "17.0.0", root / "release", web, launchers, proxy
                    )

    def test_package_rejects_runtime_origin_without_host(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            web, launchers, proxy = self.make_inputs(root)
            lock = json.loads(release.LOCK_PATH.read_text(encoding="utf-8"))
            dependency = next(
                entry
                for entry in lock["dependencies"]
                if entry["distribution"] == "runtime"
            )
            dependency["origin"] = "https://user@"
            lock_path = root / "dependencies.lock.json"
            lock_path.write_text(json.dumps(lock), encoding="utf-8")

            with mock.patch.object(release, "LOCK_PATH", lock_path):
                with self.assertRaisesRegex(ValueError, "invalid distributed dependency origin"):
                    release.package_distribution(
                        "17.0.0", root / "release", web, launchers, proxy
                    )

    def test_package_rejects_missing_launcher(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            web, launchers, proxy = self.make_inputs(root)
            (launchers / "linux-amd64/winscope-launcher").unlink()
            with self.assertRaisesRegex(ValueError, "missing launcher"):
                release.package_distribution("17.0.0", root / "release", web, launchers, proxy)


if __name__ == "__main__":
    unittest.main()
