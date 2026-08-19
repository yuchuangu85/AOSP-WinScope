#!/usr/bin/env python3

import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


REPOSITORY_ROOT = Path(__file__).resolve().parents[1]


class BaselineVerificationTest(unittest.TestCase):
    def test_repository_reports_the_accepted_clean_room_baseline(self):
        result = subprocess.run(
            [sys.executable, "scripts/verify-baseline.py", "--json"],
            cwd=REPOSITORY_ROOT,
            capture_output=True,
            text=True,
        )

        self.assertEqual(result.returncode, 0, result.stderr or result.stdout)
        report = json.loads(result.stdout)
        self.assertTrue(report["ok"])
        self.assertEqual(
            report["productInputs"]["winscope"]["revision"],
            "4dafd114fab3c3d9543a5aff0ad097f479915176",
        )
        self.assertEqual(
            report["productInputs"]["perfetto"]["revision"],
            "ece66975738007dd0978b911d8a2077e49b8f31e",
        )
        self.assertEqual(report["toolchain"]["node"], "24.19.0")
        self.assertEqual(report["toolchain"]["npm"], "11.17.0")
        self.assertEqual(report["toolchain"]["go"], "1.26.6")
        self.assertEqual(report["toolchain"]["python"]["ci"], "3.12")
        self.assertTrue(report["vendorBranchVerified"])
        self.assertTrue(report["legacyAssetsAbsent"])
        self.assertEqual(report["filesVerified"], 1086)

    def test_repository_rejects_metadata_for_a_different_upstream_revision(self):
        metadata_path = REPOSITORY_ROOT / "provenance/android17-baseline.json"
        metadata = json.loads(metadata_path.read_text(encoding="utf-8"))
        metadata["productInputs"]["winscope"]["revision"] = "0" * 40

        with tempfile.NamedTemporaryFile(mode="w", suffix=".json", encoding="utf-8") as temporary:
            json.dump(metadata, temporary)
            temporary.flush()
            result = subprocess.run(
                [
                    sys.executable,
                    "scripts/verify-baseline.py",
                    "--json",
                    "--metadata",
                    temporary.name,
                ],
                cwd=REPOSITORY_ROOT,
                capture_output=True,
                text=True,
            )

        self.assertNotEqual(result.returncode, 0)
        report = json.loads(result.stdout)
        self.assertFalse(report["ok"])
        self.assertIn("WinScope revision mismatch", report["errors"][0])


if __name__ == "__main__":
    unittest.main()
