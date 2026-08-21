#!/usr/bin/env python3

import json
import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


REPOSITORY_ROOT = Path(__file__).resolve().parents[1]


class DependencyClosureTest(unittest.TestCase):
    def run_command(self, *arguments, env=None):
        return subprocess.run(
            [sys.executable, "scripts/dependencies.py", *arguments],
            cwd=REPOSITORY_ROOT,
            capture_output=True,
            text=True,
            env={**os.environ, **(env or {})},
        )

    def write_lock_copy(self, mutate):
        lock = json.loads(
            (REPOSITORY_ROOT / "build/dependencies.lock.json").read_text(encoding="utf-8")
        )
        mutate(lock)
        temporary = tempfile.NamedTemporaryFile(mode="w", suffix=".json", delete=False)
        self.addCleanup(Path(temporary.name).unlink, missing_ok=True)
        json.dump(lock, temporary)
        temporary.close()
        return temporary.name

    def test_committed_dependency_closure_matches_immutable_inputs(self):
        result = self.run_command("verify-lock", "--json")

        self.assertEqual(result.returncode, 0, result.stderr or result.stdout)
        report = json.loads(result.stdout)
        self.assertTrue(report["ok"])
        self.assertEqual(report["perfettoRevision"], "ece66975738007dd0978b911d8a2077e49b8f31e")
        self.assertEqual(report["perfettoTree"], "201a16e409911aa016522a95143af2e5d52a3662")
        self.assertEqual(report["npmLockVersion"], 3)
        self.assertGreater(report["dependenciesVerified"], 1_000)
        self.assertEqual(report["floatingDependencies"], 0)
        self.assertEqual(report["unapprovedOrigins"], 0)
        self.assertEqual(report["distributedDependencies"], 223)

        grpc_platforms = {
            entry["platforms"][0]
            for entry in json.loads(
                (REPOSITORY_ROOT / "build/dependencies.lock.json").read_text(encoding="utf-8")
            )["dependencies"]
            if entry["id"].startswith("native:grpc-tools:")
        }
        self.assertEqual(
            grpc_platforms,
            {"darwin-arm64", "darwin-x64", "linux-arm64", "linux-x64"},
        )
        entries = json.loads(
            (REPOSITORY_ROOT / "build/dependencies.lock.json").read_text(encoding="utf-8")
        )["dependencies"]
        runtime_by_name = {
            entry["name"]: entry
            for entry in entries
            if entry["distribution"] == "runtime"
        }
        self.assertEqual(runtime_by_name["jszip"]["license"], "MIT")
        self.assertEqual(runtime_by_name["mp4box"]["license"], "BSD-3-Clause")

    def test_complete_lock_digest_rejects_non_npm_drift_without_a_cache(self):
        def mutate(lock):
            perfetto_entry = next(
                entry for entry in lock["dependencies"] if entry["id"].startswith("perfetto:")
            )
            lock["dependencies"].remove(perfetto_entry)

        with tempfile.TemporaryDirectory() as empty_cache:
            result = self.run_command(
                "verify-lock",
                "--json",
                env={
                    "AOSP_WINSCOPE_DEPENDENCY_LOCK": self.write_lock_copy(mutate),
                    "AOSP_WINSCOPE_DEPS_ROOT": empty_cache,
                },
            )

        self.assertNotEqual(result.returncode, 0)
        self.assertIn("complete dependency lock digest mismatch", result.stdout)

    def test_npm_platform_and_introducer_metadata_are_not_flattened(self):
        entries = json.loads(
            (REPOSITORY_ROOT / "build/dependencies.lock.json").read_text(encoding="utf-8")
        )["dependencies"]
        nested_chalk = next(
            entry
            for entry in entries
            if entry["id"] == "npm:node_modules/@angular-devkit/build-angular/node_modules/chalk"
        )
        linux_esbuild = next(
            entry for entry in entries if entry["name"] == "@esbuild/linux-x64"
        )

        self.assertEqual(linux_esbuild["platforms"], ["linux-x64"])
        self.assertTrue(nested_chalk["introducedBy"].startswith("package-lock.json:"))

    def test_toolchain_preflight_reports_the_fixed_versions(self):
        result = self.run_command("verify-toolchain", "--json")

        self.assertEqual(result.returncode, 0, result.stderr or result.stdout)
        report = json.loads(result.stdout)
        self.assertTrue(report["ok"])
        self.assertEqual(report["actual"]["node"], "24.19.0")
        self.assertEqual(report["actual"]["npm"], "11.17.0")
        self.assertIn(report["actual"]["python"], ["3.11", "3.12", "3.13"])
        self.assertEqual(
            report["runtimePython"],
            report["actual"]["python"],
        )

    def test_explicit_tool_override_fails_closed_on_a_version_mismatch(self):
        result = self.run_command(
            "verify-toolchain",
            "--json",
            env={"AOSP_WINSCOPE_NODE": sys.executable},
        )

        self.assertNotEqual(result.returncode, 0)
        self.assertFalse(json.loads(result.stdout)["ok"])
        self.assertIn("Node.js 24.19.0 is required", result.stdout)

    def test_unapproved_dependency_origin_is_rejected(self):
        def mutate(lock):
            lock["dependencies"][0]["origin"] = "https://example.invalid/archive.tgz"

        result = self.run_command(
            "verify-lock",
            "--json",
            env={"AOSP_WINSCOPE_DEPENDENCY_LOCK": self.write_lock_copy(mutate)},
        )

        self.assertNotEqual(result.returncode, 0)
        self.assertIn("unapproved origins", result.stdout)

    def test_unapproved_runtime_license_is_rejected(self):
        def mutate(lock):
            dependency = next(
                entry
                for entry in lock["dependencies"]
                if entry["distribution"] == "runtime"
            )
            dependency["license"] = "NOASSERTION"

        result = self.run_command(
            "verify-lock",
            "--json",
            env={"AOSP_WINSCOPE_DEPENDENCY_LOCK": self.write_lock_copy(mutate)},
        )

        self.assertNotEqual(result.returncode, 0)
        self.assertIn("unapproved distributed license", result.stdout)

    def test_non_https_runtime_origin_is_rejected(self):
        def mutate(lock):
            dependency = next(
                entry
                for entry in lock["dependencies"]
                if entry["distribution"] == "runtime"
            )
            dependency["origin"] = dependency["origin"].replace("https://", "http://", 1)

        result = self.run_command(
            "verify-lock",
            "--json",
            env={"AOSP_WINSCOPE_DEPENDENCY_LOCK": self.write_lock_copy(mutate)},
        )

        self.assertNotEqual(result.returncode, 0)
        self.assertIn("invalid distributed dependency origin", result.stdout)

    def test_floating_git_revision_is_rejected(self):
        def mutate(lock):
            git_entry = next(
                entry
                for entry in lock["dependencies"]
                if entry["integrity"]["algorithm"] == "git-commit"
            )
            git_entry["integrity"]["value"] = "HEAD"

        result = self.run_command(
            "verify-lock",
            "--json",
            env={"AOSP_WINSCOPE_DEPENDENCY_LOCK": self.write_lock_copy(mutate)},
        )

        self.assertNotEqual(result.returncode, 0)
        self.assertIn("floating dependencies", result.stdout)

    def test_missing_dependency_cache_fails_before_offline_generation(self):
        with tempfile.TemporaryDirectory() as empty_cache:
            result = self.run_command(
                "verify",
                "--json",
                env={"AOSP_WINSCOPE_DEPS_ROOT": empty_cache},
            )

        self.assertNotEqual(result.returncode, 0)
        self.assertFalse(json.loads(result.stdout)["ok"])
        self.assertIn("Perfetto source is not prepared", result.stdout)

    def test_proto_generation_has_no_aosp_checkout_assumption(self):
        build_script = (REPOSITORY_ROOT / "protos/build.js").read_text(encoding="utf-8")

        self.assertNotIn("ANDROID_BUILD_TOP", build_script)
        self.assertNotIn("external/perfetto", build_script)
        self.assertNotIn("rm -rf", build_script)
        self.assertNotIn("const {exec} = require('child_process');", build_script)
        self.assertIn("execFile", build_script)
        self.assertIn("AOSP_WINSCOPE_PERFETTO", build_script)

    def test_package_scripts_expose_separate_prepare_verify_and_offline_steps(self):
        package = json.loads((REPOSITORY_ROOT / "package.json").read_text(encoding="utf-8"))
        scripts = package["scripts"]

        self.assertEqual(scripts["deps:prepare"], "python3 scripts/dependencies.py prepare")
        self.assertEqual(scripts["deps:verify"], "python3 scripts/dependencies.py verify --json")
        self.assertEqual(scripts["deps:offline-check"], "python3 scripts/dependencies.py offline-check --json")


if __name__ == "__main__":
    unittest.main()
