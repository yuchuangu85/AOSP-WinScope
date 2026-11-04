import copy
import importlib.util
import json
import os
import sys
import tempfile
import unittest
from pathlib import Path
from unittest import mock


ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("installer_evidence", ROOT / "scripts/installer_evidence.py")
evidence = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(evidence)
release = evidence.release
publish = evidence.publish
VERSION = "17.0.1-rc.1"
IMAGE = "ghcr.io/example/release@sha256:" + "a" * 64


class InstallerEvidenceTest(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name).resolve()
        self.release_dir = self.root / "release"
        self.output = self.root / "public"
        self.validation = self.root / "report.json"
        self.reproducibility = self.root / "reproducibility.json"
        self.image = self.root / "release-image.json"
        self.features = self.root / "feature-stages.json"
        self.identity = evidence.source_identity(VERSION, IMAGE)
        self.artifact = self.make_distribution()
        self.make_reports()
        self.clean = mock.patch.object(publish, "require_clean_tree")
        self.clean.start()
        self.addCleanup(self.clean.stop)
        self.verifier = mock.patch.object(release, "verify_distribution", wraps=release.verify_distribution)
        self.verify_distribution = self.verifier.start()
        self.addCleanup(self.verifier.stop)

    def write(self, path, value):
        publish.write_json(path, value)

    def make_distribution(self):
        self.web = self.root / "web"
        self.web.mkdir()
        for name, content in {"index.html": "<html>offline</html>\n", "runtime-config.json": "{}\n",
                              "3rdpartylicenses.txt": "dependency\nMIT\nlicense text\n"}.items():
            (self.web / name).write_text(content)
        self.launchers = self.root / "launchers"
        for system, arch, filename in release.LAUNCHER_TARGETS:
            launcher = self.launchers / f"{system}-{arch}" / filename
            launcher.parent.mkdir(parents=True)
            launcher.write_bytes(f"{system}-{arch}".encode())
        self.proxy = self.root / "winscope_proxy.py"
        self.proxy.write_text("#!/usr/bin/env python3\n")
        return release.package_distribution(VERSION, self.release_dir, self.web, self.launchers,
                                            self.proxy, unpacked_only=True)

    def make_reports(self):
        self.write(self.validation, {"schemaVersion": 1, "stage": 7, "ok": True, "complete": True,
            "checks": [{"name": name, "status": "pass"} for name in
                       ("release:reproducibility", "runtime:security", "device:android17-capture")],
            "externalEvidence": {"schemaVersion": 1, "inputs": {
                name: {"sha256": str(index) * 64, "size": index}
                for index, name in enumerate(publish.REQUIRED_EXTERNAL_EVIDENCE, 1)}, "missing": []}})
        build = {"packages": [{"target": item["target"], "sha256": item["sha256"]}
                              for item in self.artifact["packages"]],
                 "attestationSha256": publish.sha256_file(Path(self.artifact["attestation"])),
                 "filesVerified": sum(item["files"] for item in self.artifact["packages"]),
                 "provenanceVerified": True}
        self.write(self.reproducibility, {"schemaVersion": 1, "stage": 10, "artifactMode": "unpacked",
            "ok": True, "version": VERSION, "sourceCommit": self.identity["sourceCommit"],
            "sourceDateEpoch": self.identity["sourceDateEpoch"],
            "dependencyLockSha256": self.identity["dependencyLockSha256"],
            "byteIdentical": True, "provenanceVerified": True, "builds": [build, copy.deepcopy(build)]})
        self.write(self.image, {"schemaVersion": 1, "ok": True, "image": IMAGE,
            "imageId": "sha256:" + "b" * 64, "platform": "linux/amd64", "anonymousPull": True,
            "networkDisabledDuringProbe": True, "readOnlyProbe": True,
            "tools": list(publish.REQUIRED_RELEASE_IMAGE_TOOLS), "errors": []})
        self.write(self.features, {"schemaVersion": 1, "ok": True, "sourceCommit": self.identity["sourceCommit"],
            "stages": [{"stage": stage, "status": "pass", "documented": True, "missing": [],
                        "files": [{"path": name, "sha256": publish.sha256_file(ROOT / name)} for name in names]}
                       for stage, names in evidence.FEATURES.STAGES.items()],
            "checks": [{"name": name, "status": "pass", "returncode": 0} for name in evidence.FEATURES.COMMANDS]})

    def stage(self):
        return evidence.stage(VERSION, self.release_dir, self.validation, self.reproducibility,
                              self.image, self.features, IMAGE, self.output)

    def snapshot(self, directory):
        return {str(path.relative_to(directory)): (path.read_bytes(), path.stat().st_mode)
                for path in directory.rglob("*") if path.is_file() and not path.is_symlink()}

    def rehash(self, directory):
        index = publish.read_json(directory / evidence.INDEX)
        index["files"] = [evidence.descriptor(directory / name) for name in sorted(evidence.known_names(VERSION))]
        self.write(directory / evidence.INDEX, index)
        (directory / evidence.SUMS).write_text(evidence.checksum_text(directory,
            evidence.known_names(VERSION) | {evidence.INDEX}))

    def test_stage_and_verify_bounded_evidence_without_source_or_output_mutation(self):
        before = self.snapshot(self.release_dir)
        (self.root / "private-device-evidence.zip").write_bytes(b"protected raw evidence")
        result = self.stage()
        directory = Path(result["directory"])
        self.verify_distribution.assert_called_once_with(VERSION, self.release_dir, unpacked_only=True)
        self.assertEqual(set(path.name for path in directory.iterdir()),
                         evidence.known_names(VERSION) | {evidence.INDEX, evidence.SUMS})
        self.assertEqual(self.snapshot(self.release_dir), before)
        self.assertFalse(any(path.suffix.lower() == ".zip" or path.stat().st_mode & 0o111
                             for path in directory.iterdir()))
        published = self.snapshot(directory)
        self.assertTrue(evidence.verify(directory, VERSION, IMAGE)["ok"])
        self.assertEqual(self.snapshot(directory), published)
        with self.assertRaisesRegex(ValueError, "immutable"):
            self.stage()
        self.assertEqual(self.snapshot(directory), published)

    def test_stage_rejects_invalid_or_stale_unpacked_reports_without_publication(self):
        original = publish.read_json(self.reproducibility)
        variants = []
        for key, value in (("version", "17.0.2"), ("sourceCommit", "0" * 40),
                           ("dependencyLockSha256", "0" * 64), ("sourceDateEpoch", 0),
                           ("artifactMode", "archive"), ("ok", False), ("byteIdentical", False)):
            changed = copy.deepcopy(original)
            changed[key] = value
            variants.append(changed)
        for mutate in (
            lambda value: value.pop("artifactMode"),
            lambda value: value.update(archives=[]),
            lambda value: value["builds"][0]["packages"].pop(),
            lambda value: value["builds"][0]["packages"].__setitem__(1, value["builds"][0]["packages"][0]),
            lambda value: value["builds"][0]["packages"][0].update(target="unsupported"),
            lambda value: value["builds"][0]["packages"][0].update(sha256="0" * 64),
            lambda value: value["builds"][0].update(attestationSha256="0" * 64),
            lambda value: value["builds"][0].update(filesVerified=True),
            lambda value: value["builds"][0].update(provenanceVerified=False),
            lambda value: value["builds"][0].update(archives=[]),
        ):
            changed = copy.deepcopy(original)
            mutate(changed)
            variants.append(changed)
        changed = copy.deepcopy(original)
        for build in changed["builds"]:
            build["packages"][0]["sha256"] = "0" * 64
        variants.append(changed)
        for index, changed in enumerate(variants):
            with self.subTest(variant=index):
                self.write(self.reproducibility, changed)
                before = self.snapshot(self.release_dir)
                with self.assertRaises(ValueError):
                    self.stage()
                self.assertFalse((self.output / VERSION).exists())
                self.assertEqual(before, self.snapshot(self.release_dir))
                self.assertFalse(self.output.exists() and list(self.output.iterdir()))

    def test_verify_rejects_tamper_sizes_extra_archives_directories_and_symlinks(self):
        directory = Path(self.stage()["directory"])
        path = directory / "NOTICE"
        original = path.read_bytes()
        path.write_bytes(b"x" * len(original))
        with self.assertRaisesRegex(ValueError, "hash/size"):
            evidence.verify(directory, VERSION, IMAGE)
        path.write_bytes(original + b"changed size")
        with self.assertRaisesRegex(ValueError, "hash/size"):
            evidence.verify(directory, VERSION, IMAGE)
        path.write_bytes(original)
        for name in ("stale.zip", "raw-device.json", "unexpected.ZIP"):
            extra = directory / name
            extra.write_bytes(b"unexpected")
            with self.assertRaisesRegex(ValueError, "unexpected"):
                evidence.verify(directory, VERSION, IMAGE)
            extra.unlink()
        extra = directory / "nested"
        extra.mkdir()
        with self.assertRaises(ValueError):
            evidence.verify(directory, VERSION, IMAGE)
        extra.rmdir()
        path.unlink()
        path.symlink_to(self.validation)
        with self.assertRaisesRegex(ValueError, "regular file"):
            evidence.verify(directory, VERSION, IMAGE)

    def test_verify_reruns_semantics_even_after_checksums_are_recomputed(self):
        directory = Path(self.stage()["directory"])
        variants = [
            ("validation-report.json", lambda value: value.update(complete=False)),
            ("validation-report.json", lambda value: value["externalEvidence"].update(missing=["android17Device"])),
            ("validation-report.json", lambda value: value["checks"][-1].update(status="fail")),
            ("validation-report.json", lambda value: value["checks"][0].update(evidence={"stale": True})),
            ("reproducibility.json", lambda value: value.update(artifactMode="archive")),
            ("reproducibility.json", lambda value: value.update(sourceCommit="0" * 40)),
            ("reproducibility.json", lambda value: value["builds"][0]["packages"][0].update(sha256="0" * 64)),
            ("release-image.json", lambda value: value.update(networkDisabledDuringProbe=False)),
            ("feature-stages.json", lambda value: value.update(sourceCommit="0" * 40)),
            ("feature-stages.json", lambda value: value["stages"][0].update(status="fail")),
            ("feature-stages.json", lambda value: value["stages"].__setitem__(1, value["stages"][0])),
            ("feature-stages.json", lambda value: value["stages"][0]["files"][0].update(sha256="0" * 64)),
            ("feature-stages.json", lambda value: value["checks"][0].update(returncode=1)),
            ("dependency-bundle-manifest.json", lambda value: value["files"].pop()),
            ("compliance.json", lambda value: value.update(ok=False)),
        ]
        for name, mutate in variants:
            with self.subTest(name=name, mutate=mutate):
                path = directory / name
                original = path.read_bytes()
                value = json.loads(original)
                mutate(value)
                self.write(path, value)
                self.rehash(directory)
                before = self.snapshot(directory)
                with self.assertRaises(ValueError):
                    evidence.verify(directory, VERSION, IMAGE)
                self.assertEqual(self.snapshot(directory), before)
                path.write_bytes(original)
                self.rehash(directory)

    def test_bounded_regular_files_exact_index_inventory_and_nonexecutability(self):
        directory = Path(self.stage()["directory"])
        before = self.snapshot(directory)
        for name, maximum in (("MAX_FILE_BYTES", 4), ("MAX_TOTAL_BYTES", 4)):
            with self.subTest(bound=name), mock.patch.object(evidence, name, maximum):
                with self.assertRaisesRegex(ValueError, "bound"):
                    evidence.verify(directory, VERSION, IMAGE)
                self.assertEqual(self.snapshot(directory), before)
        notice = directory / "NOTICE"
        notice.chmod(0o755)
        with self.assertRaisesRegex(ValueError, "executable"):
            evidence.verify(directory, VERSION, IMAGE)
        notice.chmod(0o644)
        index_path = directory / evidence.INDEX
        original = index_path.read_bytes()
        for mutate in (lambda value: value.update(unexpected={"rawDevice": "forbidden"}),
                       lambda value: value["files"].append(value["files"][0]),
                       lambda value: value["files"][0].update(size=True)):
            value = json.loads(original)
            mutate(value)
            self.write(index_path, value)
            (directory / evidence.SUMS).write_text(evidence.checksum_text(directory,
                evidence.known_names(VERSION) | {evidence.INDEX}))
            with self.assertRaises(ValueError):
                evidence.verify(directory, VERSION, IMAGE)
        index_path.write_bytes(original)
        self.rehash(directory)
        self.assertEqual(self.snapshot(directory), before)

    def test_stage_rejects_current_payload_tampering_without_mutating_internal_tree(self):
        tree = Path(self.artifact["packages"][0]["package"])
        (tree / "web/index.html").write_text("changed current payload")
        before = self.snapshot(self.release_dir)
        with self.assertRaisesRegex(ValueError, "digest mismatch"):
            self.stage()
        self.assertFalse((self.output / VERSION).exists())
        self.assertEqual(before, self.snapshot(self.release_dir))

    def test_verify_rechecks_attestation_semantics_after_rehashing_all_reports(self):
        directory = Path(self.stage()["directory"])
        path = directory / f"aosp-winscope-{VERSION}.attestation.json"
        value = publish.read_json(path)
        value["predicate"]["buildDefinition"]["resolvedDependencies"][0]["digest"]["sha1"] = "0" * 40
        self.write(path, value)
        reproducibility = directory / "reproducibility.json"
        report = publish.read_json(reproducibility)
        for build in report["builds"]:
            build["attestationSha256"] = publish.sha256_file(path)
        self.write(reproducibility, report)
        self.rehash(directory)
        before = self.snapshot(directory)
        with self.assertRaisesRegex(ValueError, "attestation.*provenance"):
            evidence.verify(directory, VERSION, IMAGE)
        self.assertEqual(before, self.snapshot(directory))

    def test_current_source_identity_build_image_and_clean_checkout_are_required(self):
        directory = Path(self.stage()["directory"])
        with mock.patch.object(publish, "git_commit", return_value="0" * 40):
            with self.assertRaisesRegex(ValueError, "identity"):
                evidence.verify(directory, VERSION, IMAGE)
        with self.assertRaisesRegex(ValueError, "identity"):
            evidence.verify(directory, VERSION, IMAGE[:-1] + "b")
        with self.assertRaises(ValueError):
            evidence.verify(directory, "17.0.2", IMAGE)
        with mock.patch.object(publish, "require_clean_tree", side_effect=ValueError("dirty worktree")):
            with self.assertRaisesRegex(ValueError, "dirty"):
                evidence.verify(directory, VERSION, IMAGE)
            with self.assertRaisesRegex(ValueError, "dirty"):
                self.stage()

    def test_cli_stage_verify_and_invalid_reports(self):
        args = ["installer_evidence.py", "stage", "--version", VERSION, "--build-image", IMAGE,
                "--release-dir", str(self.release_dir), "--validation", str(self.validation),
                "--reproducibility", str(self.reproducibility), "--release-image-report", str(self.image),
                "--feature-stages-report", str(self.features), "--output", str(self.output), "--json"]
        with mock.patch.object(sys, "argv", args):
            self.assertEqual(evidence.main(), 0)
        args = ["installer_evidence.py", "verify", "--version", VERSION,
                "--directory", str(self.output / VERSION), "--json"]
        with mock.patch.object(sys, "argv", args), mock.patch.dict(os.environ, {"OFFICIAL_RELEASE_IMAGE": IMAGE}):
            self.assertEqual(evidence.main(), 0)
        with mock.patch.object(sys, "argv", args + ["--build-image", "mutable:latest"]):
            self.assertEqual(evidence.main(), 1)

    def test_stage_accepts_real_double_build_and_relative_input_directory(self):
        with mock.patch.object(release, "require_clean_tree"):
            report = release.double_build(VERSION, self.web, self.launchers, self.proxy, unpacked_only=True)
        self.write(self.reproducibility, report)
        previous = Path.cwd()
        try:
            os.chdir(self.root)
            result = evidence.stage(VERSION, Path("release"), self.validation, self.reproducibility,
                                    self.image, self.features, IMAGE, self.output)
        finally:
            os.chdir(previous)
        self.assertTrue(evidence.verify(Path(result["directory"]), VERSION, IMAGE)["ok"])
        self.assertFalse(list(self.release_dir.rglob("*.zip")))


if __name__ == "__main__":
    unittest.main()
