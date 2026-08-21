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

            self.assertEqual(first["zipSha256"], second["zipSha256"])
            self.assertEqual(Path(first["zip"]).read_bytes(), Path(second["zip"]).read_bytes())
            verified = release.verify_package(Path(first["package"]))
            self.assertEqual(verified["filesVerified"], first["files"])
            verified_zip = release.verify_package(Path(first["zip"]))
            self.assertEqual(verified_zip["zipSha256"], first["zipSha256"])

            package = Path(first["package"])
            self.assertEqual(
                (package / "AOSP-WinScope.exe").read_bytes(),
                (package / "bin/windows-amd64/winscope-launcher.exe").read_bytes(),
            )
            self.assertEqual(
                (package / "AOSP-WinScope-ARM64.exe").read_bytes(),
                (package / "bin/windows-arm64/winscope-launcher.exe").read_bytes(),
            )
            self.assertIn(
                "double-click AOSP-WinScope.exe",
                (package / "README.txt").read_text(encoding="utf-8"),
            )
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
                hashlib.sha256(Path(first["zip"]).read_bytes()).hexdigest(), first["zipSha256"]
            )
            attestation = json.loads(Path(first["attestation"]).read_text())
            subjects = {item["name"]: item["digest"]["sha256"] for item in attestation["subject"]}
            self.assertEqual(subjects["SHA256SUMS"], release.sha256_file(Path(first["zip"]).parent / "SHA256SUMS"))
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
            self.assertEqual(report["builds"][0]["zipSha256"], report["builds"][1]["zipSha256"])
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
                    Path(report["zip"]).name,
                    report["zipSha256"],
                    Path(report["package"]),
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
                    Path(report["zip"]).name,
                    report["zipSha256"],
                    Path(report["package"]),
                )

    def test_zip_with_duplicate_evidence_member_is_rejected(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            web, launchers, proxy = self.make_inputs(root)
            report = release.package_distribution(
                "17.0.0", root / "release", web, launchers, proxy
            )
            archive = Path(report["zip"])
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
