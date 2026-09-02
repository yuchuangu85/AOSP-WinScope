import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WORKFLOW = ROOT / ".github/workflows/official-release.yml"
CI_WORKFLOW = ROOT / ".github/workflows/ci.yml"
PACKAGE_WORKFLOW = ROOT / ".github/workflows/package.yml"
SECURITY_WORKFLOW = ROOT / ".github/workflows/security.yml"


class OfficialReleaseWorkflowTest(unittest.TestCase):
    def setUp(self):
        self.workflow = WORKFLOW.read_text(encoding="utf-8")

    def test_release_runs_only_for_android17_tags_in_protected_environment(self):
        self.assertIn("push:\n    tags:\n      - 'v17.*'", self.workflow)
        self.assertNotIn("workflow_dispatch:", self.workflow)
        self.assertNotIn("pull_request:", self.workflow)
        self.assertIn("environment: official-release", self.workflow)
        self.assertIn("git merge-base --is-ancestor \"$GITHUB_SHA\" origin/main", self.workflow)
        self.assertIn("^v17\\.[0-9]+\\.[0-9]+(-(alpha|rc)\\.[0-9]+)?$", self.workflow)

    def test_release_uses_digest_pinned_image_and_actions(self):
        self.assertIn("image: ${{ needs.preflight.outputs.release-image }}", self.workflow)
        self.assertIn("release-image: ${{ steps.contract.outputs.release-image }}", self.workflow)
        self.assertIn("^[a-z0-9][a-z0-9._/-]*@sha256:[0-9a-f]{64}$", self.workflow)
        uses = re.findall(r"^\s+(?:- )?uses: ([^\s]+)", self.workflow, re.MULTILINE)
        self.assertGreaterEqual(len(uses), 5)
        self.assertTrue(all(re.fullmatch(r"[^@]+@[0-9a-f]{40}", value) for value in uses), uses)
        for action in (
            "actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1",
            "actions/setup-node@820762786026740c76f36085b0efc47a31fe5020",
            "actions/setup-go@b7ad1dad31e06c5925ef5d2fc7ad053ef454303e",
            "actions/setup-python@5fda3b95a4ea91299a34e894583c3862153e4b97",
            "actions/attest@508db95dd578ae2727ebd6217d5ba78e4fbda05d",
        ):
            self.assertIn(action, self.workflow)
        self.assertIn("persist-credentials: false", self.workflow)
        self.assertIn("fetch-depth: 0", self.workflow)
        self.assertIn("go-version: '1.26.6'", self.workflow)
        for action in (
            "actions/upload-artifact@043fb46d1a93c77aae656e7c1c64a875d1fc6a0a",
            "actions/download-artifact@3e5f45b2cfb9172054b4087a40e8e0b5a5461e7c",
        ):
            self.assertIn(action, self.workflow)

    def test_release_replays_all_existing_gates_before_publication(self):
        for command in (
            "python3 scripts/verify-baseline.py --json",
            "npm ci",
            "npm run toolchain:verify",
            "npm run deps:prepare",
            "npm run deps:verify",
            "npm run build:prod",
            "npm run build:launchers",
            "npm run release:double-build",
            "npm run release:package",
            "python3 scripts/validate.py gate",
            "--require-complete",
            "--run-unit",
            "--run-e2e",
            "--run-production-e2e",
            "--run-offline",
            "--run-security",
            "python3 scripts/publish.py publish",
            "python3 scripts/publish.py verify",
        ):
            self.assertIn(command, self.workflow)
        for secret in (
            "ANDROID17_DEVICE_EVIDENCE_B64",
            "VULNERABILITY_EVIDENCE_B64",
            "PERFORMANCE_BASELINE_B64",
            "PERFORMANCE_BENCHMARK_B64",
        ):
            self.assertIn(f"secrets.{secret}", self.workflow)
        baseline_position = self.workflow.index("python3 scripts/verify-baseline.py --json")
        build_position = self.workflow.index("npm run build:prod")
        self.assertLess(baseline_position, build_position)
        self.assertIn('--build-image "$OFFICIAL_RELEASE_IMAGE"', self.workflow)
        self.assertIn('--expected-build-image "$OFFICIAL_RELEASE_IMAGE"', self.workflow)


    def test_release_image_evidence_is_transferred_into_publication(self):
        preflight = self.workflow.split("\n  preflight:", 1)[1].split("\n  build:", 1)[0]
        build = self.workflow.split("\n  build:", 1)[1].split("\n  publish:", 1)[0]
        self.assertIn(
            'python3 scripts/verify-release-image.py --image "$OFFICIAL_RELEASE_IMAGE" '
            '--output dist/validation/release-image.json --json',
            preflight,
        )
        self.assertIn("name: official-release-image-${{ steps.contract.outputs.version }}", preflight)
        self.assertIn("path: dist/validation/release-image.json", preflight)
        self.assertIn("name: official-release-image-${{ needs.preflight.outputs.version }}", build)
        self.assertIn("path: dist/validation", build)
        self.assertIn("--release-image-report dist/validation/release-image.json", build)
        self.assertLess(
            preflight.index("python3 scripts/verify-release-image.py"),
            preflight.index("actions/upload-artifact@"),
        )
        self.assertLess(build.index("actions/download-artifact@"), build.index("python3 scripts/publish.py publish"))

    def test_build_is_read_only_and_publish_holds_oidc_permissions(self):
        build_job = self.workflow.split("\n  build:", 1)[1].split("\n  publish:", 1)[0]
        publish_job = self.workflow.split("\n  publish:", 1)[1]
        for permission in ("contents: write", "id-token: write", "attestations: write"):
            self.assertNotIn(permission, build_job)
            self.assertIn(permission, publish_job)
        self.assertIn("actions/upload-artifact@", build_job)
        self.assertIn("actions/download-artifact@", publish_job)
        self.assertIn("retention-days: 7", build_job)

    def test_release_attests_index_and_publication_before_immutable_upload(self):
        self.assertIn("id-token: write", self.workflow)
        self.assertIn("artifact-metadata: write", self.workflow)
        self.assertIn("attestations: write", self.workflow)
        self.assertIn("contents: write", self.workflow)
        self.assertIn(
            "subject-path: dist/public/${{ needs.preflight.outputs.version }}/*",
            self.workflow,
        )
        publish_job = self.workflow.split("\n  publish:", 1)[1]
        publication_verify_position = publish_job.index("python3 scripts/publish.py verify")
        aps_verify_position = publish_job.index("python3 scripts/verify-aps-release.py")
        existing_release_position = publish_job.index("gh release view")
        attest_position = publish_job.index("actions/attest@")
        release_position = publish_job.index("gh release create")
        self.assertLess(publication_verify_position, aps_verify_position)
        self.assertLess(aps_verify_position, existing_release_position)
        self.assertLess(existing_release_position, attest_position)
        self.assertLess(attest_position, release_position)
        self.assertIn("--verify-tag", self.workflow)
        self.assertNotIn("--clobber", self.workflow)
        self.assertIn("--prerelease", self.workflow)
        self.assertIn("--latest=false", self.workflow)

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


class SupportingWorkflowTest(unittest.TestCase):
    def test_ci_fetches_vendor_branch_for_baseline_verification(self):
        workflow = CI_WORKFLOW.read_text(encoding="utf-8")
        validate_job = workflow.split("\n  validate:", 1)[1].split("\n  native-installers:", 1)[0]
        self.assertIn("fetch-depth: 0", validate_job)

    def test_fast_ci_does_not_build_or_package_release_artifacts(self):
        workflow = CI_WORKFLOW.read_text(encoding="utf-8")
        self.assertIn("npm run test:fast", workflow)
        self.assertNotIn("npm run test:unit:ci", workflow)
        for command in (
            "npm run build:prod",
            "npm run test:e2e:prod",
            "npm run release:package",
            "native-installers:",
        ):
            self.assertNotIn(command, workflow)

    def test_packaging_is_manual_and_portable_only(self):
        workflow = PACKAGE_WORKFLOW.read_text(encoding="utf-8")
        self.assertIn("workflow_dispatch:", workflow)
        self.assertNotIn("pull_request:", workflow)
        self.assertNotIn("push:", workflow)
        for obsolete in ("native_installers", "Inno", "WiX", "RPM", "native-installers:"):
            self.assertNotIn(obsolete, workflow)
        for command in (
            "npm run build:prod",
            "npm run test:e2e:prod",
            "npm run release:package",
            "npm run release:verify",
        ):
            self.assertIn(command, workflow)
        self.assertLess(workflow.index("npm run test:fast"), workflow.index("npm run build:prod"))
        self.assertLess(workflow.index("npm run build:prod"), workflow.index("npm run test:unit:ci"))
        self.assertLess(workflow.index("npm run install:chromedriver"), workflow.index("npm run test:e2e:prod"))

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
        self.assertIn("'--headless=new'", webdriver)
        self.assertIn("'--no-sandbox'", webdriver)
        self.assertIn("'--disable-dev-shm-usage'", webdriver)

    def test_security_uses_the_pinned_go_toolchain(self):
        workflow = SECURITY_WORKFLOW.read_text(encoding="utf-8")
        self.assertIn("go-version: '1.26.6'", workflow)
        self.assertNotIn("go-version-file: go.mod", workflow)
        self.assertRegex(
            (ROOT / "go.mod").read_text(encoding="utf-8"),
            re.compile(r"^go 1\.26\.6$", re.MULTILINE),
        )

    def test_codeql_uses_a_supported_build_mode_for_each_language(self):
        workflow = SECURITY_WORKFLOW.read_text(encoding="utf-8")
        for language, build_mode in (
            ("javascript-typescript", "none"),
            ("python", "none"),
            ("go", "autobuild"),
        ):
            self.assertIn(
                f"- language: {language}\n            build-mode: {build_mode}",
                workflow,
            )
        self.assertIn("build-mode: ${{ matrix.build-mode }}", workflow)

    def test_osv_scan_uses_expiring_reachability_exceptions(self):
        workflow = SECURITY_WORKFLOW.read_text(encoding="utf-8")
        config = (ROOT / "osv-scanner.toml").read_text(encoding="utf-8")
        self.assertIn("--config=./osv-scanner.toml", workflow)
        for advisory in (
            "GHSA-5p2g-fcmc-qvqq",
            "GHSA-w3rx-r6r6-pgpr",
            "GHSA-w5hq-g745-h8pq",
        ):
            self.assertIn(f'id = "{advisory}"', config)
        self.assertEqual(config.count("ignoreUntil = 2026-11-19"), 3)
        self.assertNotIn("ignore = true", config)


if __name__ == "__main__":
    unittest.main()
