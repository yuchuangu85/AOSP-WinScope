#!/usr/bin/env python3

import importlib.util
import json
import tempfile
import unittest
from unittest import mock
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("validate", ROOT / "scripts/validate.py")
validate = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(validate)


class ValidationGateTest(unittest.TestCase):
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
                "frame-ancestors 'none'; script-src 'self' 'wasm-unsafe-eval'; connect-src 'self'\">",
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
            path.write_text(json.dumps({
                "schemaVersion": 1,
                "stage": 10,
                "ok": True,
                "sourceCommit": validate.git_commit(),
                "dependencyLockSha256": validate.sha256_file(validate.LOCK),
                "byteIdentical": True,
                "provenanceVerified": True,
                "builds": [
                    {"zipSha256": "same", "provenanceVerified": True},
                    {"zipSha256": "same", "provenanceVerified": True},
                ],
            }), encoding="utf-8")
            self.assertEqual(validate.reproducibility_evidence(path)["status"], "pass")
            path.write_text(path.read_text().replace('"same"', '"different"', 1), encoding="utf-8")
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
            }), encoding="utf-8")
            with mock.patch.object(validate, "working_tree_clean", return_value=True):
                self.assertEqual(validate.vulnerability_gate(path)["status"], "pass")


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
