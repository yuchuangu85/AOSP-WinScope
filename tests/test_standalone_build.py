#!/usr/bin/env python3

import json
import subprocess
import sys
import unittest
from pathlib import Path


REPOSITORY_ROOT = Path(__file__).resolve().parents[1]


class StandaloneBuildContractTest(unittest.TestCase):
    def test_package_build_contract_has_no_aosp_checkout_assumption(self):
        package = json.loads((REPOSITORY_ROOT / "package.json").read_text(encoding="utf-8"))

        for name in ("build:trace_processor", "build:prod", "build:verify"):
            self.assertIn(name, package["scripts"])
            self.assertNotIn("ANDROID_BUILD_TOP", package["scripts"][name])
            self.assertNotIn("external/perfetto", package["scripts"][name])

    def test_build_driver_exposes_machine_readable_preflight(self):
        result = subprocess.run(
            [sys.executable, "scripts/build.py", "preflight", "--json"],
            cwd=REPOSITORY_ROOT,
            capture_output=True,
            text=True,
        )

        self.assertEqual(result.returncode, 0, result.stderr or result.stdout)
        report = json.loads(result.stdout)
        self.assertTrue(report["ok"])
        self.assertEqual(
            report["perfettoRevision"],
            "ece66975738007dd0978b911d8a2077e49b8f31e",
        )
        self.assertEqual(
            report["perfettoTree"],
            "201a16e409911aa016522a95143af2e5d52a3662",
        )
        self.assertFalse(report["usesAndroidBuildTop"])

    def test_first_trace_fixture_is_an_android_17_vendor_input(self):
        fixture = REPOSITORY_ROOT / "src/test/fixtures/traces/perfetto/layers_trace.perfetto-trace"
        inventory = json.loads(
            (REPOSITORY_ROOT / "provenance/android17-winscope-files.json").read_text(
                encoding="utf-8"
            )
        )

        self.assertGreater(fixture.stat().st_size, 0)
        self.assertIn(
            fixture.relative_to(REPOSITORY_ROOT).as_posix(),
            {entry["path"] for entry in inventory["files"]},
        )

    def test_verified_production_outputs_preserve_trace_processor_bytes(self):
        result = subprocess.run(
            [sys.executable, "scripts/build.py", "verify", "--json"],
            cwd=REPOSITORY_ROOT,
            capture_output=True,
            text=True,
        )
        self.assertEqual(result.returncode, 0, result.stderr or result.stdout)
        report = json.loads(result.stdout)
        self.assertTrue(report["ok"])
        for name, artifact in report["traceProcessorArtifacts"].items():
            self.assertEqual(
                (REPOSITORY_ROOT / "deps_build/trace_processor/to_be_served" / name).stat().st_size,
                artifact["size"],
            )
            self.assertEqual(
                (REPOSITORY_ROOT / "dist/prod" / name).read_bytes(),
                (REPOSITORY_ROOT / "deps_build/trace_processor/to_be_served" / name).read_bytes(),
            )

    def test_output_verification_rejects_matching_tampered_copies(self):
        paths = [
            REPOSITORY_ROOT / "deps_build/trace_processor/to_be_served/engine_bundle.js",
            REPOSITORY_ROOT / "dist/prod/engine_bundle.js",
        ]
        originals = [path.read_bytes() for path in paths]
        try:
            for path, contents in zip(paths, originals):
                path.write_bytes(contents + b"\n// tampered\n")
            result = subprocess.run(
                [sys.executable, "scripts/build.py", "verify", "--json"],
                cwd=REPOSITORY_ROOT,
                capture_output=True,
                text=True,
            )
            self.assertNotEqual(result.returncode, 0)
            self.assertIn("recorded build state", result.stdout)
        finally:
            for path, contents in zip(paths, originals):
                path.write_bytes(contents)


if __name__ == "__main__":
    unittest.main()
