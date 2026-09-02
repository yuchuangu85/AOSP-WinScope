#!/usr/bin/env python3

import importlib.util
import json
import tempfile
import unittest
from unittest import mock
from pathlib import Path
from types import SimpleNamespace


ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("validate", ROOT / "scripts/validate.py")
validate = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(validate)
PUBLISH_SPEC = importlib.util.spec_from_file_location("publish", ROOT / "scripts/publish.py")
publish = importlib.util.module_from_spec(PUBLISH_SPEC)
assert PUBLISH_SPEC.loader is not None
PUBLISH_SPEC.loader.exec_module(publish)
APS_SPEC = importlib.util.spec_from_file_location("aps_release", ROOT / "scripts/verify-aps-release.py")
aps_release = importlib.util.module_from_spec(APS_SPEC)
assert APS_SPEC.loader is not None
APS_SPEC.loader.exec_module(aps_release)


class ValidationGateTest(unittest.TestCase):
    def test_external_evidence_contract_matches_publication_verifiers(self):
        self.assertEqual(validate.REQUIRED_EXTERNAL_EVIDENCE, publish.REQUIRED_EXTERNAL_EVIDENCE)
        self.assertEqual(validate.REQUIRED_EXTERNAL_EVIDENCE, aps_release.REQUIRED_EXTERNAL_EVIDENCE)

    def test_repository_documents_stage_eighteen_private_evidence_contract(self):
        plan = (ROOT / "docs/REBUILD_PLAN.md").read_text(encoding="utf-8")
        self.assertIn("## Stage 18 implementation evidence", plan)
        self.assertIn("does not publish the raw protected", plan)

    def test_external_evidence_manifest_binds_hashes_without_paths_or_contents(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            paths = {}
            for name in validate.REQUIRED_EXTERNAL_EVIDENCE:
                path = root / f"{name}.json"
                path.write_text(json.dumps({"secret": f"private-{name}"}), encoding="utf-8")
                paths[name] = path

            manifest = validate.external_evidence_manifest(paths)

            self.assertEqual(manifest["schemaVersion"], 1)
            self.assertEqual(manifest["missing"], [])
            self.assertEqual(set(manifest["inputs"]), set(validate.REQUIRED_EXTERNAL_EVIDENCE))
            rendered = json.dumps(manifest)
            self.assertNotIn(str(root), rendered)
            self.assertNotIn("private-", rendered)
            for name, path in paths.items():
                self.assertEqual(manifest["inputs"][name]["sha256"], validate.sha256_file(path))
                self.assertEqual(manifest["inputs"][name]["size"], path.stat().st_size)


    def test_protected_evidence_read_errors_redact_paths(self):
        private_root = Path("/private/protected-device-serial-XYZ")
        missing = private_root / "missing.json"
        checks = [
            validate.device_evidence(missing),
            validate.vulnerability_gate(missing),
            validate.performance(private_root / "web", None, missing, require_benchmark=True),
        ]
        with tempfile.TemporaryDirectory() as temporary:
            benchmark = Path(temporary) / "benchmark.json"
            benchmark.write_text(json.dumps({"metrics": {
                "startupMs": 1,
                "importMs": 1,
                "interactionMs": 1,
                "peakMemoryBytes": 1,
            }}), encoding="utf-8")
            checks.append(validate.performance(Path(temporary), missing, benchmark, require_benchmark=True))

        for check in checks:
            with self.subTest(check=check["name"]):
                self.assertEqual(check["status"], "fail")
                self.assertNotIn(str(private_root), json.dumps(check))

    def test_device_evidence_redacts_fingerprint_and_private_details(self):
        with tempfile.TemporaryDirectory() as temporary:
            path = Path(temporary) / "device.json"
            path.write_text(json.dumps({
                "schemaVersion": 1,
                "androidVersion": "17",
                "fingerprint": "private-device-fingerprint",
                "capture": {"ok": True, "serial": "private-serial"},
                "import": {"ok": True, "path": "/private/trace"},
            }), encoding="utf-8")

            check = validate.device_evidence(path)

            self.assertEqual(check["status"], "pass")
            self.assertEqual(check["evidenceSha256"], validate.sha256_file(path))
            self.assertNotIn("evidence", check)
            rendered = json.dumps(check)
            self.assertNotIn("private-device-fingerprint", rendered)
            self.assertNotIn("private-serial", rendered)
            self.assertNotIn("/private/trace", rendered)

    def test_fixture_inventory_covers_stage7_feature_inputs(self):
        inventory = validate.fixture_coverage()["inventory"]
        for name in ("perfetto", "legacy-readers", "screenshot", "screen-recording", "input-and-ime"):
            self.assertGreater(inventory[name]["files"], 0)

    def test_web_contract_accepts_local_file_only_output(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            (root / "index.html").write_text(
                "<base href=\"./\"><meta http-equiv=\"Content-Security-Policy\" "
                "content=\"default-src 'self'; base-uri 'self'; object-src 'none'; "
                "frame-ancestors 'none'; script-src 'self' 'wasm-unsafe-eval'; media-src 'self' blob:; connect-src 'self'\">",
                encoding="utf-8",
            )
            (root / "runtime-config.json").write_text(
                json.dumps({
                    "schemaVersion": 1,
                    "host": {"kind": "standalone"},
                    "capture": {"provider": "none"},
                }),
                encoding="utf-8",
            )
            self.assertEqual(validate.web_contract(root)["status"], "pass")

    def test_performance_budget_rejects_growth(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            (root / "main.js").write_bytes(b"x" * 20)
            baseline = root / "baseline.json"
            baseline.write_text(json.dumps({"webBytes": 10, "maxRegressionPercent": 10}), encoding="utf-8")
            check = validate.performance(root, baseline)
            self.assertEqual(check["status"], "fail")
            self.assertIn("webBytes", check["failures"])

    def test_reproducibility_evidence_requires_two_matching_provenance_verified_builds(self):
        with tempfile.TemporaryDirectory() as temporary:
            path = Path(temporary) / "reproducibility.json"
            archives = [
                {"target": f"{operating_system}-{architecture}", "sha256": "a" * 64}
                for operating_system, architecture, _ in validate.LAUNCHER_TARGETS
            ]
            path.write_text(json.dumps({
                "schemaVersion": 1,
                "stage": 10,
                "ok": True,
                "sourceCommit": validate.git_commit(),
                "dependencyLockSha256": validate.sha256_file(validate.LOCK),
                "byteIdentical": True,
                "provenanceVerified": True,
                "builds": [
                    {"archives": archives, "provenanceVerified": True},
                    {"archives": archives, "provenanceVerified": True},
                ],
            }), encoding="utf-8")
            self.assertEqual(validate.reproducibility_evidence(path)["status"], "pass")
            changed = list(archives)
            changed[0] = {**changed[0], "sha256": "b" * 64}
            value = json.loads(path.read_text())
            value["builds"][1]["archives"] = changed
            path.write_text(json.dumps(value), encoding="utf-8")
            self.assertEqual(validate.reproducibility_evidence(path)["status"], "fail")

    def test_android17_evidence_requires_successful_capture_and_import(self):
        with tempfile.TemporaryDirectory() as temporary:
            path = Path(temporary) / "device.json"
            path.write_text(json.dumps({
                "schemaVersion": 1,
                "androidVersion": "16",
                "fingerprint": "",
                "capture": {"ok": False},
                "import": {"ok": True},
            }), encoding="utf-8")
            self.assertEqual(validate.device_evidence(path)["status"], "fail")

    def test_vulnerability_evidence_is_bound_to_current_lock_and_commit(self):
        with tempfile.TemporaryDirectory() as temporary:
            path = Path(temporary) / "vulnerability.json"
            path.write_text(json.dumps({
                "schemaVersion": 1,
                "scanner": "test-scanner",
                "sourceCommit": validate.git_commit(),
                "lockSha256": validate.sha256_file(validate.LOCK),
                "critical": 0,
                "high": 0,
                "ok": True,
                "privateFindingDetails": "must-not-leak",
            }), encoding="utf-8")
            with mock.patch.object(validate, "working_tree_clean", return_value=True):
                check = validate.vulnerability_gate(path)
            self.assertEqual(check["status"], "pass")
            self.assertEqual(check["evidenceSha256"], validate.sha256_file(path))
            self.assertNotIn("evidence", check)
            self.assertNotIn("must-not-leak", json.dumps(check))




    def test_non_finite_performance_values_are_rejected(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            web = root / "web"
            web.mkdir()
            (web / "main.js").write_bytes(b"ok")
            benchmark = root / "benchmark.json"
            benchmark.write_text(
                '{"metrics":{"startupMs":NaN,"importMs":1,"interactionMs":1,"peakMemoryBytes":1}}',
                encoding="utf-8",
            )
            check = validate.performance(web, None, benchmark, require_benchmark=True)
            self.assertEqual(check["status"], "fail")
            json.dumps(check, allow_nan=False)

            benchmark.write_text(json.dumps({"metrics": {
                "startupMs": 100,
                "importMs": 100,
                "interactionMs": 100,
                "peakMemoryBytes": 100,
            }}), encoding="utf-8")
            baseline = root / "baseline.json"
            baseline.write_text(
                '{"metrics":{"startupMs":1,"importMs":1,"interactionMs":1,"peakMemoryBytes":1},'
                '"maxRegressionPercent":NaN}',
                encoding="utf-8",
            )
            check = validate.performance(web, baseline, benchmark, require_benchmark=True)
            self.assertEqual(check["status"], "fail")
            json.dumps(check, allow_nan=False)

    def test_hostile_known_fields_are_not_echoed(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            device = root / "device.json"
            device.write_text(json.dumps({
                "schemaVersion": 1,
                "androidVersion": {"private": "device-known-field-secret"},
                "fingerprint": "valid-but-private",
                "capture": {"ok": True},
                "import": {"ok": True},
            }), encoding="utf-8")
            device_check = validate.device_evidence(device)
            self.assertEqual(device_check["status"], "fail")
            self.assertIsNone(device_check["androidVersion"])
            self.assertNotIn("device-known-field-secret", json.dumps(device_check))

            vulnerability = root / "vulnerability.json"
            vulnerability.write_text(json.dumps({
                "schemaVersion": 1,
                "scanner": "scanner:private-scanner-secret",
                "sourceCommit": "private-source-secret",
                "lockSha256": "private-lock-secret",
                "critical": False,
                "high": False,
                "ok": True,
            }), encoding="utf-8")
            with mock.patch.object(validate, "working_tree_clean", return_value=True):
                vulnerability_check = validate.vulnerability_gate(vulnerability)
            self.assertEqual(vulnerability_check["status"], "fail")
            self.assertIsNone(vulnerability_check["scanner"])
            self.assertIsNone(vulnerability_check["sourceCommit"])
            self.assertIsNone(vulnerability_check["lockSha256"])
            self.assertIsNone(vulnerability_check["critical"])
            self.assertIsNone(vulnerability_check["high"])
            rendered = json.dumps(vulnerability_check)
            self.assertNotIn("private-scanner-secret", rendered)
            self.assertNotIn("private-source-secret", rendered)
            self.assertNotIn("private-lock-secret", rendered)

    def test_validation_report_uses_stable_repository_identifier(self):
        missing = ROOT / "dist/does-not-exist-stage18"
        args = SimpleNamespace(
            web=missing,
            vulnerability_evidence=None,
            release=missing,
            reproducibility=missing,
            baseline=None,
            benchmark=None,
            require_complete=False,
            device_evidence=None,
            run_unit=False,
            run_e2e=False,
            run_production_e2e=False,
            run_offline=False,
            run_security=False,
            timeout=1,
        )
        report = validate.report(args)
        self.assertEqual(report["repository"], "aosp-winscope")
        self.assertTrue(report["androidCompatibility"]["15"]["fixtureValidated"])
        self.assertFalse(report["androidCompatibility"]["15"]["deviceValidated"])
        self.assertTrue(report["androidCompatibility"]["16"]["fixtureValidated"])
        self.assertFalse(report["androidCompatibility"]["16"]["deviceValidated"])
        self.assertFalse(report["androidCompatibility"]["17"]["deviceValidated"])
        self.assertNotIn(str(ROOT), json.dumps(report))

    def test_invalid_benchmark_metrics_do_not_leak_private_values(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            benchmark = root / "benchmark.json"
            benchmark.write_text(json.dumps({
                "metrics": {
                    "startupMs": "private-startup-value",
                    "importMs": 1,
                    "interactionMs": 1,
                    "peakMemoryBytes": 1,
                    "privateDetail": "must-not-leak",
                },
            }), encoding="utf-8")

            check = validate.performance(root / "missing-web", None, benchmark, require_benchmark=True)

            self.assertEqual(check["status"], "fail")
            rendered = json.dumps(check)
            self.assertNotIn("private-startup-value", rendered)
            self.assertNotIn("must-not-leak", rendered)

    def test_benchmark_requires_a_complete_baseline(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            benchmark = root / "benchmark.json"
            benchmark.write_text(json.dumps({"metrics": {
                "startupMs": 1, "importMs": 2, "interactionMs": 3, "peakMemoryBytes": 4,
            }}), encoding="utf-8")
            baseline = root / "baseline.json"
            baseline.write_text("{}", encoding="utf-8")
            self.assertEqual(validate.performance(root, baseline, benchmark)["status"], "fail")
            self.assertEqual(validate.performance(root, None, benchmark, require_benchmark=True)["status"], "skipped")
            self.assertEqual(validate.performance(root, None, benchmark)["status"], "skipped")



if __name__ == "__main__":
    unittest.main()
