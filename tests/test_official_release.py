import json
import os
import re
import subprocess
import tempfile
import textwrap
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
        local_workflow = "./.github/workflows/electron.yml"
        self.assertEqual(uses.count(local_workflow), 1)
        self.assertTrue(all(
            value == local_workflow or re.fullmatch(r"[^@]+@[0-9a-f]{40}", value)
            for value in uses
        ), uses)
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
        build = self.workflow.split("\n  build:", 1)[1].split("\n  desktop:", 1)[0]
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
        build_job = self.workflow.split("\n  build:", 1)[1].split("\n  desktop:", 1)[0]
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

    def test_desktop_reuses_canonical_shared_build_only_after_legacy_gates(self):
        build = self.workflow.split("\n  build:", 1)[1].split("\n  desktop:", 1)[0]
        desktop = self.workflow.split("\n  desktop:", 1)[1].split("\n  publish:", 1)[0]
        self.assertIn("needs: [preflight, build]", desktop)
        self.assertIn("uses: ./.github/workflows/electron.yml", desktop)
        self.assertIn("release-version: ${{ needs.preflight.outputs.version }}", desktop)
        self.assertIn("shared-artifact: electron-shared-${{ github.sha }}", desktop)
        self.assertIn("contents: read", desktop)
        self.assertNotIn("secrets:", desktop)
        self.assertNotIn("continue-on-error:", desktop)
        self.assertNotIn("if:", desktop)
        positions = [build.index(command) for command in (
            "python3 scripts/verify-baseline.py --json",
            "npm run build:prod",
            "npm run release:double-build",
            "python3 scripts/validate.py gate",
            "python3 scripts/publish.py publish",
            "python3 scripts/publish.py verify",
            "npm run ai:build",
            "npm run ai:verify",
            "node --test ai/dist/src/test/*.test.js",
            "npm run desktop:test",
            "python3 -m unittest discover -s desktop -p '*_test.py'",
            "name: electron-shared-${{ github.sha }}",
        )]
        self.assertEqual(positions, sorted(positions))
        for command in (
            "npm run build:prod", "npm run ai:build", "npm run desktop:test",
            "python3 -m unittest discover -s desktop -p '*_test.py'",
        ):
            self.assertEqual(build.count(command), 1)
        self.assertIn("path: |\n            dist/prod\n            ai/dist", build)
        self.assertEqual(build.count("name: electron-shared-${{ github.sha }}"), 1)

    def test_publish_waits_for_desktop_and_reverifies_before_both_attestations(self):
        publish = self.workflow.split("\n  publish:", 1)[1]
        self.assertIn("needs: [preflight, build, desktop]", publish)
        self.assertIn("name: ${{ needs.desktop.outputs.publication-artifact }}", publish)
        self.assertIn("path: ${{ env.DESKTOP_PUBLICATION_DIR }}", publish)
        self.assertIn(
            "DESKTOP_PUBLICATION_DIR: dist/desktop/public/${{ needs.preflight.outputs.version }}",
            publish,
        )
        self.assertIn("actions/setup-node@", publish)
        verify_position = publish.index("node desktop/release.mjs verify")
        attest_positions = [match.start() for match in re.finditer("uses: actions/attest@", publish)]
        self.assertEqual(len(attest_positions), 2)
        self.assertLess(publish.index("python3 scripts/verify-aps-release.py"), verify_position)
        for position in attest_positions:
            self.assertLess(verify_position, position)
            self.assertLess(position, publish.index("gh release create"))
        for argument in (
            '--directory "$DESKTOP_PUBLICATION_DIR"',
            '--version "$AOSP_WINSCOPE_VERSION"',
            '--commit "$GITHUB_SHA"',
        ):
            self.assertIn(argument, publish)
        self.assertIn(
            "subject-path: dist/desktop/public/${{ needs.preflight.outputs.version }}/*",
            publish,
        )
        self.assertNotIn("continue-on-error:", publish)
        self.assertNotIn("if: always()", publish)

    def test_one_immutable_release_contains_both_publications_and_honest_signing_notes(self):
        publish = self.workflow.split("\n  publish:", 1)[1]
        self.assertEqual(self.workflow.count("gh release create"), 1)
        self.assertEqual(self.workflow.count("gh release view"), 2)
        self.assertIn('"$PUBLICATION_DIR"/*\n            "$DESKTOP_PUBLICATION_DIR"/*', publish)
        self.assertIn("--verify-tag", publish)
        for forbidden in ("--clobber", "gh release upload", "gh release delete", "gh api --method DELETE", "git tag", "git push"):
            self.assertNotIn(forbidden, self.workflow)
        for note in ("unsigned", "not Apple-notarized", "does not confer Apple trust"):
            self.assertIn(note, publish)

    def test_draft_creation_and_uploaded_asset_verification_precede_final_publication(self):
        publish = self.workflow.split("\n  publish:", 1)[1]
        create_position = publish.index("gh release create")
        api_position = publish.index("gh api -H")
        pagination_position = publish.index("--paginate --slurp")
        merge_position = publish.index("release.assets = pages.flat()")
        check_position = publish.index("node desktop/release.mjs check-remote")
        edit_position = publish.index("gh release edit")
        self.assertLess(create_position, api_position)
        self.assertLess(api_position, pagination_position)
        self.assertLess(pagination_position, merge_position)
        self.assertLess(merge_position, check_position)
        self.assertLess(check_position, edit_position)
        self.assertEqual(self.workflow.count("gh release create"), 1)
        self.assertEqual(self.workflow.count("gh release edit"), 1)
        self.assertIn("            --draft\n            --verify-tag", publish[:create_position])
        self.assertIn("X-GitHub-Api-Version: 2026-03-10", publish[api_position:check_position])
        self.assertIn('"repos/$GITHUB_REPOSITORY/releases/tags/$GITHUB_REF_NAME"', publish[api_position:check_position])
        self.assertIn("> dist/validation/uploaded-release.json", publish[api_position:check_position])
        self.assertIn("Number.isSafeInteger(release.id)", publish[api_position:pagination_position])
        self.assertIn("release.id <= 0", publish[api_position:pagination_position])
        self.assertIn(
            '"repos/$GITHUB_REPOSITORY/releases/$release_id/assets?per_page=100"',
            publish[pagination_position:check_position],
        )
        self.assertIn("> dist/validation/uploaded-release-assets.json", publish[pagination_position:check_position])
        self.assertIn("timeout-minutes: 20", publish)
        check = publish[check_position:edit_position]
        for argument in (
            '--desktop "$DESKTOP_PUBLICATION_DIR"',
            '--portable "$PUBLICATION_DIR"',
            "--metadata dist/validation/uploaded-release.json",
            '--version "$AOSP_WINSCOPE_VERSION"',
            '--commit "$GITHUB_SHA"',
        ):
            self.assertIn(argument, check)
        finalize = publish[edit_position:]
        self.assertIn('gh release edit "$GITHUB_REF_NAME"', finalize)
        self.assertIn('--repo "$GITHUB_REPOSITORY"', finalize)
        self.assertIn("--draft=false", finalize)
        self.assertIn('--prerelease="$IS_PRERELEASE"', finalize)
        self.assertIn('--latest="$latest"', finalize)
        self.assertNotIn("trap ", publish)

    def test_draft_finalization_is_fail_closed_without_executing_github(self):
        publish = self.workflow.split("\n  publish:", 1)[1]
        step = publish.split(
            "      - name: Create draft and publish only after remote asset verification\n", 1,
        )[1]
        script = textwrap.dedent(step.split("        run: |\n", 1)[1])
        stubs = textwrap.dedent('''\
            gh() {
              printf 'gh %s\\n' "$*" >&2
              if [[ "$1 $2" == 'release create' && "$FAIL_PHASE" == upload ]]; then
                return 41
              fi
              if [[ "$1" == api ]]; then
                if [[ "$*" == *'/assets?per_page=100' ]]; then
                  if [[ "$FAIL_PHASE" == assets ]]; then return 44; fi
                  command cat "$REMOTE_ASSETS_FIXTURE"
                else
                  if [[ "$FAIL_PHASE" == metadata ]]; then return 42; fi
                  command cat "$REMOTE_RELEASE_FIXTURE"
                fi
              fi
            }
            node() {
              if [[ "$1" == desktop/release.mjs ]]; then
                printf 'node %s\\n' "$*" >&2
                if [[ "$FAIL_PHASE" == check ]]; then return 43; fi
                test -s dist/validation/uploaded-release.json
              else
                command node "$@"
              fi
            }
        ''')
        publications = {
            "portable": ("portable.zip", "release-index.json", "SHA256SUMS.txt"),
            "desktop": (
                "aosp-winscope-desktop-17.0.1-linux-arm64.AppImage",
                "aosp-winscope-desktop-17.0.1-linux-arm64-source.tar.gz",
                "desktop-target-linux-arm64.json",
                "desktop-acceptance-linux-arm64.json",
                "desktop-release.json",
                "desktop-SHA256SUMS.txt",
            ) + tuple(f"aosp-winscope-desktop-fixture-{index}.zip" for index in range(25)),
        }
        self.assertTrue(set(publications["portable"]).isdisjoint(publications["desktop"]))
        assets = [{"name": filename, "size": len(b"fixture"), "state": "uploaded"}
                  for filenames in publications.values() for filename in filenames]
        self.assertGreater(len(assets), 30)
        pages = [assets[:30], assets[30:]]
        invalid_ids = {"zero-id": 0, "negative-id": -1, "string-id": "17",
                       "fraction-id": 1.5, "unsafe-id": 2 ** 53}
        for prerelease, failure, expected_code in (
            ("false", "", 0), ("true", "", 0),
            ("false", "upload", 41), ("false", "metadata", 42),
            ("false", "assets", 44), ("false", "pages-shape", 1), ("false", "check", 43),
            *(("false", failure, 1) for failure in invalid_ids),
        ):
            with self.subTest(prerelease=prerelease, failure=failure):
                with tempfile.TemporaryDirectory(prefix="winscope draft ") as temporary:
                    root = Path(temporary)
                    for directory, filenames in publications.items():
                        (root / directory).mkdir()
                        for filename in filenames:
                            (root / directory / filename).write_bytes(b"fixture")
                    release_fixture = root / "remote-release.json"
                    release_fixture.write_text(json.dumps({
                        "id": invalid_ids.get(failure, 17), "draft": True,
                        "tag_name": "v17.0.1", "assets": assets[:30],
                    }), encoding="utf-8")
                    assets_fixture = root / "remote-assets.json"
                    assets_fixture.write_text(
                        json.dumps([{"invalid": True}] if failure == "pages-shape" else pages),
                        encoding="utf-8",
                    )
                    result = subprocess.run(
                        ["bash", "-c", stubs + script], cwd=root,
                        env={**os.environ, "PUBLICATION_DIR": str(root / "portable"),
                             "DESKTOP_PUBLICATION_DIR": str(root / "desktop"),
                             "GITHUB_REPOSITORY": "example/repository", "GITHUB_REF_NAME": "v17.0.1",
                             "AOSP_WINSCOPE_VERSION": "17.0.1", "GITHUB_SHA": "a" * 40,
                             "REMOTE_RELEASE_FIXTURE": str(release_fixture),
                             "REMOTE_ASSETS_FIXTURE": str(assets_fixture),
                             "IS_PRERELEASE": prerelease, "FAIL_PHASE": failure},
                        capture_output=True, text=True, check=False,
                    )
                    self.assertEqual(result.returncode, expected_code, result.stderr)
                    calls = [line for line in result.stderr.splitlines()
                             if line.startswith(("gh ", "node desktop/release.mjs"))]
                    self.assertTrue(calls[0].startswith("gh release create "), calls)
                    self.assertIn(" --draft --verify-tag ", calls[0])
                    for directory, filenames in publications.items():
                        for filename in filenames:
                            self.assertIn(str(root / directory / filename), calls[0])
                    expected_prefixes = ["gh release create "]
                    if failure != "upload":
                        expected_prefixes.append("gh api ")
                    stops_before_assets = {"upload", "metadata", *invalid_ids}
                    if failure not in stops_before_assets:
                        expected_prefixes.append("gh api ")
                        self.assertIn("--paginate --slurp", calls[2])
                        self.assertIn("releases/17/assets?per_page=100", calls[2])
                    if failure not in stops_before_assets | {"assets", "pages-shape"}:
                        expected_prefixes.append("node desktop/release.mjs check-remote ")
                        merged = json.loads((root / "dist/validation/uploaded-release.json").read_text(encoding="utf-8"))
                        self.assertEqual(merged["assets"], assets)
                        self.assertEqual(merged["id"], 17)
                        self.assertTrue(merged["draft"])
                    if not failure:
                        expected_prefixes.append("gh release edit ")
                        self.assertIn("--draft=false", calls[-1])
                        self.assertIn(f"--prerelease={prerelease}", calls[-1])
                        self.assertIn(f"--latest={'false' if prerelease == 'true' else 'true'}", calls[-1])
                    else:
                        self.assertNotIn("gh release edit", result.stderr)
                    self.assertEqual(len(calls), len(expected_prefixes), calls)
                    for call, prefix in zip(calls, expected_prefixes):
                        self.assertTrue(call.startswith(prefix), calls)

    def test_all_protected_jobs_and_external_gate_inputs_remain_fail_closed(self):
        for name, end in (("preflight", "build"), ("build", "desktop"), ("publish", None)):
            job = self.workflow.split(f"\n  {name}:", 1)[1]
            if end:
                job = job.split(f"\n  {end}:", 1)[0]
            with self.subTest(job=name):
                self.assertIn("environment: official-release", job)
                self.assertNotIn("continue-on-error:", job)
        for argument in (
            "--reproducibility dist/validation/reproducibility.json",
            "--device-evidence dist/validation/external/android17-device.json",
            "--vulnerability-evidence dist/validation/external/vulnerability.json",
            "--baseline dist/validation/external/performance-baseline.json",
            "--benchmark dist/validation/external/performance-benchmark.json",
            "--expected-index-sha256",
        ):
            self.assertIn(argument, self.workflow)
        self.assertIn('echo "Missing protected environment evidence: $variable" >&2', self.workflow)
        self.assertEqual(self.workflow.count('git merge-base --is-ancestor "$GITHUB_SHA" origin/main'), 2)
        self.assertIn("cancel-in-progress: false", self.workflow)

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
        helpers = (ROOT / "src/test/e2e/helpers.ts").read_text(encoding="utf-8")
        self.assertIn("'--headless=new'", webdriver)
        self.assertIn("'--no-sandbox'", webdriver)
        self.assertIn("'--disable-dev-shm-usage'", webdriver)
        self.assertIn("width: 1280", helpers)
        self.assertIn("height: 1024", helpers)
        self.assertNotIn("window().maximize()", helpers)

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
