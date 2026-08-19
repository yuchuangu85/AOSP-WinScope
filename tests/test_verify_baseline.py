#!/usr/bin/env python3

import json
import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


REPOSITORY_ROOT = Path(__file__).resolve().parents[1]


class BaselineVerificationTest(unittest.TestCase):
    def run_verifier(self, *, metadata=None, revision=None):
        command = [sys.executable, "scripts/verify-baseline.py", "--json"]
        if revision is not None:
            command.extend(["--revision", revision])
        if metadata is None:
            return subprocess.run(
                command,
                cwd=REPOSITORY_ROOT,
                capture_output=True,
                text=True,
            )

        with tempfile.NamedTemporaryFile(mode="w", suffix=".json", encoding="utf-8") as temporary:
            json.dump(metadata, temporary)
            temporary.flush()
            command.extend(["--metadata", temporary.name])
            return subprocess.run(
                command,
                cwd=REPOSITORY_ROOT,
                capture_output=True,
                text=True,
            )

    def load_metadata(self):
        metadata_path = REPOSITORY_ROOT / "provenance/android17-baseline.json"
        return json.loads(metadata_path.read_text(encoding="utf-8"))

    def test_repository_reports_the_accepted_clean_room_baseline(self):
        result = self.run_verifier()

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
        self.assertTrue(report["productLineageVerified"])
        self.assertTrue(report["legacyAssetsAbsent"])
        self.assertEqual(report["filesVerified"], 1086)

    def test_repository_rejects_metadata_for_a_different_upstream_revision(self):
        metadata = self.load_metadata()
        metadata["productInputs"]["winscope"]["revision"] = "0" * 40
        result = self.run_verifier(metadata=metadata)

        self.assertNotEqual(result.returncode, 0)
        report = json.loads(result.stdout)
        self.assertFalse(report["ok"])
        self.assertIn("WinScope revision mismatch", report["errors"][0])

    def test_repository_rejects_weakened_provenance_identities_and_policy(self):
        cases = [
            (
                ("productInputs", "winscope", "repository"),
                "https://example.invalid/development",
                "WinScope repository mismatch",
            ),
            (("productInputs", "winscope", "path"), "not/winscope", "WinScope source path mismatch"),
            (
                ("productInputs", "perfetto", "repository"),
                "https://example.invalid/perfetto",
                "Perfetto repository mismatch",
            ),
            (
                ("cleanRoom", "prohibitedPaths"),
                ["definitely-not-a-legacy-path"],
                "clean-room prohibited paths mismatch",
            ),
            (("vendor", "fileInventory"), "/tmp/untrusted-inventory.json", "vendor file inventory path mismatch"),
            (("toolchain", "node"), "24.19.1", "Node version mismatch"),
        ]
        for field_path, replacement, expected_error in cases:
            with self.subTest(field_path=field_path):
                metadata = self.load_metadata()
                target = metadata
                for key in field_path[:-1]:
                    target = target[key]
                target[field_path[-1]] = replacement

                result = self.run_verifier(metadata=metadata)

                self.assertNotEqual(result.returncode, 0)
                report = json.loads(result.stdout)
                self.assertFalse(report["ok"])
                self.assertIn(expected_error, report["errors"][0])

    def test_repository_rejects_an_unprovenanced_product_file(self):
        with tempfile.TemporaryDirectory() as temporary_directory:
            environment = os.environ.copy()
            environment["GIT_INDEX_FILE"] = str(Path(temporary_directory) / "index")
            subprocess.run(
                ["git", "read-tree", "HEAD"],
                cwd=REPOSITORY_ROOT,
                env=environment,
                check=True,
            )
            blob = subprocess.run(
                ["git", "hash-object", "-w", "--stdin"],
                cwd=REPOSITORY_ROOT,
                input="legacy project bytes must not enter the product\n",
                capture_output=True,
                text=True,
                check=True,
            ).stdout.strip()
            subprocess.run(
                [
                    "git",
                    "update-index",
                    "--add",
                    "--cacheinfo",
                    f"100644,{blob},src/unprovenanced_legacy_copy.ts",
                ],
                cwd=REPOSITORY_ROOT,
                env=environment,
                check=True,
            )
            tree = subprocess.run(
                ["git", "write-tree"],
                cwd=REPOSITORY_ROOT,
                env=environment,
                capture_output=True,
                text=True,
                check=True,
            ).stdout.strip()
            commit_environment = environment | {
                "GIT_AUTHOR_NAME": "Baseline Test",
                "GIT_AUTHOR_EMAIL": "baseline-test@example.invalid",
                "GIT_COMMITTER_NAME": "Baseline Test",
                "GIT_COMMITTER_EMAIL": "baseline-test@example.invalid",
            }
            product_commit = subprocess.run(
                ["git", "commit-tree", tree, "-p", "HEAD"],
                cwd=REPOSITORY_ROOT,
                env=commit_environment,
                input="test unprovenanced product delta\n",
                capture_output=True,
                text=True,
                check=True,
            ).stdout.strip()

        result = self.run_verifier(revision=product_commit)

        self.assertNotEqual(result.returncode, 0)
        report = json.loads(result.stdout)
        self.assertFalse(report["ok"])
        self.assertIn("not fully provenance-recorded", report["errors"][0])


if __name__ == "__main__":
    unittest.main()
