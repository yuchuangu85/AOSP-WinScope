import json
import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class CIConfigurationTest(unittest.TestCase):
    def test_product_and_release_versions_match_the_root_package(self):
        package = json.loads((ROOT / "package.json").read_text(encoding="utf-8"))
        lock = json.loads((ROOT / "package-lock.json").read_text(encoding="utf-8"))
        desktop = json.loads((ROOT / "desktop/app/package.json").read_text(encoding="utf-8"))
        version = package["version"]
        self.assertEqual(lock["version"], version)
        self.assertEqual(lock["packages"][""]["version"], version)
        self.assertEqual(desktop["version"], version)
        for channel, suffix in (("alpha", "-alpha.1"), ("rc", "-rc.1"), ("stable", "")):
            script = package["scripts"][f"publish:{channel}"]
            self.assertIn(f"--version {version}{suffix} ", script)
        self.assertIn(f"--tag v{version} ", package["scripts"]["publish:stable"])

    def test_only_desktop_packaging_and_publication_workflows_are_kept(self):
        workflows = {
            path.name
            for path in (ROOT / ".github/workflows").iterdir()
            if path.is_file() and path.suffix in {".yml", ".yaml"}
        }
        self.assertEqual(workflows, {"electron.yml"})

    def test_desktop_ci_does_not_invoke_legacy_release_publishers(self):
        workflow = (ROOT / ".github/workflows/electron.yml").read_text(encoding="utf-8")
        self.assertNotIn("scripts/publish.py", workflow)
        self.assertNotIn("scripts/verify-aps-release.py", workflow)
        self.assertNotRegex(workflow, r"npm run (?:build:release|release:|publish:|aps:verify)\S*\b")

    def test_ci_karma_tolerates_transient_hosted_runner_disconnects(self):
        config = (ROOT / "karma.config.ci.js").read_text(encoding="utf-8")
        for setting in (
            "pingTimeout: 60000",
            "browserDisconnectTimeout: 30000",
            "browserDisconnectTolerance: 1",
            "browserNoActivityTimeout: 120000",
            "'--disable-dev-shm-usage'",
            "'--disable-background-timer-throttling'",
            "'--disable-renderer-backgrounding'",
            "random: false",
        ):
            self.assertIn(setting, config)

    def test_e2e_webdriver_runs_chrome_headless(self):
        webdriver = (ROOT / "src/test/e2e/webdriver.ts").read_text(encoding="utf-8")
        helpers = (ROOT / "src/test/e2e/helpers.ts").read_text(encoding="utf-8")
        self.assertIn("'--headless=new'", webdriver)
        self.assertIn("'--no-sandbox'", webdriver)
        self.assertIn("'--disable-dev-shm-usage'", webdriver)
        self.assertIn("width: 1280", helpers)
        self.assertIn("height: 1024", helpers)
        self.assertNotIn("window().maximize()", helpers)

    def test_desktop_packaging_uses_the_pinned_go_toolchain(self):
        workflow = (ROOT / ".github/workflows/electron.yml").read_text(encoding="utf-8")
        self.assertIn('go-version: "1.26.6"', workflow)
        self.assertNotIn("go-version-file: go.mod", workflow)
        self.assertRegex(
            (ROOT / "go.mod").read_text(encoding="utf-8"),
            re.compile(r"^go 1\.26\.6$", re.MULTILINE),
        )

    def test_osv_config_retains_expiring_reachability_exceptions(self):
        config = (ROOT / "osv-scanner.toml").read_text(encoding="utf-8")
        for advisory in (
            "GHSA-5p2g-fcmc-qvqq",
            "GHSA-w3rx-r6r6-pgpr",
            "GHSA-w5hq-g745-h8pq",
        ):
            self.assertIn(f'id = "{advisory}"', config)
        self.assertEqual(config.count("ignoreUntil = 2026-11-19"), 3)
        self.assertNotIn("ignore = true", config)


class LegacyReleaseDocumentationTest(unittest.TestCase):
    def test_aps_documentation_verifies_oidc_identity_before_content(self):
        guide = (ROOT / "docs/APS_INTEGRATION.md").read_text(encoding="utf-8")
        self.assertIn("gh attestation verify", guide)
        self.assertIn(
            "--signer-workflow yuchuangu85/AOSP-WinScope/.github/workflows/official-release.yml",
            guide,
        )
        self.assertIn("--source-ref refs/tags/v<version>", guide)
        self.assertIn("--source-digest <trusted-release-commit>", guide)
        self.assertIn("--signer-digest <trusted-release-commit>", guide)
        self.assertIn("--expected-build-image <trusted-build-image>", guide)
        self.assertIn("--deny-self-hosted-runners", guide)
        self.assertLess(guide.index("gh attestation verify"), guide.index("--expected-index-sha256"))
        plan = (ROOT / "docs/REBUILD_PLAN.md").read_text(encoding="utf-8")
        self.assertIn("## Stage 14 implementation evidence", plan)
        self.assertIn("release immutability", plan)
        self.assertIn("publicly pullable", plan)


if __name__ == "__main__":
    unittest.main()
