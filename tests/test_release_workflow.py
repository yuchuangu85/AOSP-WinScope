import copy
import json
import os
import re
import subprocess
import tempfile
import textwrap
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
WORKFLOW = ROOT / ".github/workflows/electron.yml"
SHA = "a" * 40
REPO = "example/winscope"


class ReleaseWorkflowTest(unittest.TestCase):
    def setUp(self):
        self.workflow = WORKFLOW.read_text(encoding="utf-8")

    def job(self, name):
        match = re.search(
            rf"^  {re.escape(name)}:\n(.*?)(?=^  [\w-]+:|\Z)",
            self.workflow,
            re.MULTILINE | re.DOTALL,
        )
        self.assertIsNotNone(match, name)
        return match.group(1)

    def step(self, marker):
        matches = [
            step for step in re.split(r"(?=^      - )", self.job("publish"), flags=re.MULTILINE)
            if marker in step
        ]
        self.assertEqual(len(matches), 1, marker)
        return matches[0]

    def script(self, marker):
        return textwrap.dedent(self.step(marker).split("        run: |\n", 1)[1])

    def run_script(self, script, root, **env):
        return subprocess.run(
            ["bash", "-c", script], cwd=root,
            env={**os.environ, "GH_REPO": REPO, "SOURCE_RUN_ID": "123",
                 "SOURCE_RUN_ATTEMPT": "1", "SOURCE_SHA": SHA,
                 "DEFAULT_BRANCH": "main", "DESKTOP_VERSION": "17.0.2",
                 "RELEASE_TAG": "v17.0.2-desktop.123", "RUNNER_TEMP": str(root),
                 "GITHUB_ENV": str(root / "github-env"),
                 **env},
            capture_output=True, text=True, check=False,
        )

    def test_publication_is_in_the_packaging_workflow_and_only_manual_default_dispatch_can_publish(self):
        triggers = self.workflow.split("\npermissions:", 1)[0]
        self.assertIn("workflow_dispatch:", triggers)
        self.assertIn("pull_request:", triggers)
        self.assertIn("workflow_call:", triggers)
        self.assertNotIn("workflow_run:", triggers)
        self.assertNotIn(".github/workflows/release.yml", self.workflow)
        publish = self.job("publish")
        self.assertIn("needs: [bundle, plan]", publish)
        self.assertIn("github.event_name == 'workflow_dispatch'", publish)
        self.assertIn("github.ref_name == github.event.repository.default_branch", publish)

    def test_publish_gate_rejects_non_manual_non_default_or_incomplete_runs(self):
        expression = self.job("publish").split("    if: >-\n", 1)[1].split("    runs-on:", 1)[0]
        expression = expression.strip().removeprefix("${{").removesuffix("}}").strip()
        base = {
            "needs": {"bundle": {"result": "success"}, "plan": {"result": "success"}},
            "github": {"event_name": "workflow_dispatch", "ref_name": "main",
                      "ref_type": "branch", "ref": "refs/heads/main", "repository": REPO,
                      "workflow_ref": f"{REPO}/.github/workflows/electron.yml@refs/heads/main",
                      "event": {"repository": {"default_branch": "main"}}},
            "cancelled": False,
        }
        cases = [(base, True)]
        for path, value in (
            (("needs", "bundle", "result"), "failure"),
            (("needs", "bundle", "result"), "skipped"),
            (("needs", "bundle", "result"), "cancelled"),
            (("needs", "plan", "result"), "failure"),
            (("needs", "plan", "result"), "skipped"),
            (("needs", "plan", "result"), "cancelled"),
            (("github", "event_name"), "pull_request"),
            (("github", "event_name"), "pull_request_target"),
            (("github", "event_name"), "push"),
            (("github", "event_name"), "workflow_call"),
            (("github", "ref_name"), "feature"),
            (("github", "ref_type"), "tag"),
            (("github", "workflow_ref"), f"{REPO}/.github/workflows/caller.yml@refs/heads/main"),
            (("github", "workflow_ref"), "fork/winscope/.github/workflows/electron.yml@refs/heads/main"),
            (("cancelled",), True),
        ):
            changed = copy.deepcopy(base)
            target = changed
            for key in path[:-1]:
                target = target[key]
            target[path[-1]] = value
            cases.append((changed, False))
        result = subprocess.run(
            ["node", "-e", textwrap.dedent('''\
                const vm = require("node:vm");
                const {expression, cases} = JSON.parse(require("node:fs").readFileSync(0));
                console.log(JSON.stringify(cases.map(([context]) => vm.runInNewContext(
                  expression, {...context,
                    cancelled: () => context.cancelled,
                    format: (template, ...values) => template.replace(/\\{(\\d+)\\}/g, (_, i) => values[i]),
                  }, {timeout: 1000}
                ))));
            ''')],
            input=json.dumps({"expression": expression, "cases": cases}),
            capture_output=True, text=True, check=True,
        )
        self.assertEqual(json.loads(result.stdout), [expected for _, expected in cases])

    def test_actions_are_pinned_and_only_publish_has_write_access(self):
        self.assertIn("permissions:\n  contents: read", self.workflow)
        for action in re.findall(r"uses: (\S+)", self.workflow):
            self.assertRegex(action, r"^[^@]+@[0-9a-f]{40}$")
        self.assertIn("permissions:\n      actions: read\n      contents: write", self.job("publish"))
        for job in ("plan", "shared", "native", "bundle"):
            self.assertNotIn("contents: write", self.job(job))
        for forbidden in ("secrets.", "secrets: inherit", "id-token: write", "--clobber", "git push", "actions/cache@"):
            self.assertNotIn(forbidden, self.workflow)
        for forbidden in ("npm ci", "npm run", "actions/cache@"):
            self.assertNotIn(forbidden, self.job("publish"))
        self.assertNotIn("GH_TOKEN", self.step("Verify the complete publication aggregate"))

    def test_exact_source_commit_and_default_branch_ancestry_are_required(self):
        self.assertIn("ref: ${{ github.sha }}", self.workflow)
        self.assertIn('git merge-base --is-ancestor "$SOURCE_SHA" "origin/$DEFAULT_BRANCH"', self.workflow)
        script = self.script("Require the exact source commit")
        stub = '''\
            git() {
              if [[ "$1" = rev-parse ]]; then printf '%s' "$ACTUAL_SHA";
              elif [[ "$1" = merge-base ]]; then return "$ANCESTOR_STATUS";
              elif [[ "$1" = diff ]]; then return "$WORKFLOW_DIFF_STATUS";
              else return 90; fi
            }
        '''
        with tempfile.TemporaryDirectory() as temporary:
            for actual, ancestor, difference, valid in (
                (SHA, "0", "0", True), (SHA, "1", "0", False),
                ("b" * 40, "0", "0", False), (SHA, "0", "1", False),
            ):
                result = self.run_script(textwrap.dedent(stub) + script, Path(temporary),
                                         ACTUAL_SHA=actual, ANCESTOR_STATUS=ancestor,
                                         WORKFLOW_DIFF_STATUS=difference)
                self.assertEqual(result.returncode == 0, valid, result.stderr)

    def test_artifact_download_is_bound_to_this_run_and_publication_name(self):
        step = self.step("actions/download-artifact@")
        for value in (
            "name: ${{ steps.identity.outputs.publication-artifact }}",
            "github-token: ${{ github.token }}", "repository: ${{ github.repository }}",
            "path: ${{ runner.temp }}/desktop-publication",
        ):
            self.assertIn(value, step)
        self.assertNotIn("run-id:", step)
        identity = self.step("id: identity")
        self.assertIn('node desktop/release.mjs plan --commit "$SOURCE_SHA"', identity)
        self.assertIn('"$version" "$SOURCE_RUN_ID" >> "$GITHUB_OUTPUT"', identity)

    def test_release_steps_are_sequential_success_only_with_remote_digest_gate(self):
        markers = (
            "actions/download-artifact@", "node desktop/release.mjs verify",
            "gh release create", "node desktop/release.mjs check-remote",
            "gh api -X PATCH",
        )
        positions = [self.job("publish").index(marker) for marker in markers]
        self.assertEqual(positions, sorted(positions))
        self.assertNotIn("continue-on-error", self.job("publish"))
        self.assertIn('--tag "$RELEASE_TAG"', self.step("Verify the uploaded draft"))
        self.assertIn("--draft --latest=true --verify-tag", self.job("publish"))
        self.assertNotIn("--prerelease", self.job("publish"))
        self.assertIn("-F draft=false -F prerelease=false -f make_latest=true", self.job("publish"))
        self.assertNotIn("releases/tags", self.job("publish"))
        self.assertIn("releases/$RELEASE_ID", self.job("publish"))
        self.assertIn('test "$remote_sha" = "$SOURCE_SHA"', self.job("publish"))
        self.assertIn("gh release view", self.step("Publish the verified stable release"))

    def test_manual_runs_are_not_cancelled_by_new_builds(self):
        self.assertIn("cancel-in-progress: ${{ github.event_name != 'workflow_dispatch' }}", self.workflow)

    def test_published_release_is_verified_and_linked_in_summary(self):
        script = self.script("Publish the verified stable release")
        stub = '''\
            gh() {
              if [[ "$1 $2" = 'api -X' ]]; then return 0
              elif [[ "$1 $2" = 'release view' ]]; then
                [[ "$SCENARIO" != view-failure ]] || return 80
                echo https://example.test/release
              else return 90; fi
            }
        '''
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            for scenario in ("success", "view-failure"):
                summary = root / scenario
                result = self.run_script(textwrap.dedent(stub) + script, root,
                                         SCENARIO=scenario, RELEASE_ID="434614696",
                                         GITHUB_STEP_SUMMARY=str(summary))
                self.assertEqual(result.returncode == 0, scenario == "success", result.stderr)
                if scenario == "success":
                    self.assertEqual(summary.read_text().strip(), "https://example.test/release")

    def test_creation_refuses_existing_releases_tags_and_lookup_failures(self):
        script = self.script("Create a new tag and unpublished draft")
        stub = '''\
            gh() {
              if [[ "$*" = *releases?per_page* ]]; then
                [[ "$SCENARIO" != api-failure ]] || return 80
                [[ "$SCENARIO" != existing-release ]] || echo "$RELEASE_TAG"
              elif [[ "$*" = *git/refs* ]]; then
                echo create-tag >> events
                [[ "$SCENARIO" != tag-failure ]] || return 81
                echo "$SOURCE_SHA"
              elif [[ "$1 $2" = 'release create' ]]; then
                echo create-draft >> events
              elif [[ "$*" = *graphql* ]]; then
                [[ "$SCENARIO" != draft-lookup-failure ]] || return 83
                echo 434614696
              else return 90; fi
            }
            git() {
              [[ "$SCENARIO" != git-failure ]] || return 82
              [[ "$SCENARIO" != existing-tag ]] || echo "$SOURCE_SHA refs/tags/$RELEASE_TAG"
              return 0
            }
        '''
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            for scenario, expected in (
                ("success", ["create-tag", "create-draft"]),
                ("existing-release", []), ("existing-tag", []),
                ("api-failure", []), ("git-failure", []), ("tag-failure", ["create-tag"]),
                ("draft-lookup-failure", ["create-tag", "create-draft"]),
            ):
                with self.subTest(scenario=scenario):
                    (root / "events").write_text("", encoding="utf-8")
                    result = self.run_script(textwrap.dedent(stub) + script, root, SCENARIO=scenario)
                    self.assertEqual(result.returncode == 0, scenario == "success", result.stderr)
                    self.assertEqual((root / "events").read_text().splitlines(), expected)

    def test_upload_or_remote_verification_failure_never_makes_a_draft_public(self):
        # Execute the real step bodies in one fail-fast shell with only network
        # and verification commands stubbed. Digest behavior is tested in Node.
        script = "\n".join(self.script(marker) for marker in (
            "Create a new tag and unpublished draft", "Verify the uploaded draft",
            "Publish the verified stable release",
        ))
        stub = '''\
            git() { return 0; }
            node() { [[ "$SCENARIO" != bad-digest ]]; }
            gh() {
              if [[ "$*" = *releases?per_page* ]]; then return 0
              elif [[ "$*" = *graphql* ]]; then echo 434614696
              elif [[ "$*" = *" -X PATCH "* ]]; then
                echo public >> events
                echo '{"draft":false}'
              elif [[ "$*" = *releases/434614696* ]]; then echo '{}'
              elif [[ "$*" = *git/refs* ]]; then echo "$SOURCE_SHA"
              elif [[ "$*" = *git/ref/tags* ]]; then
                if [[ "$SCENARIO" = wrong-tag-commit ]]; then echo wrong; else echo "$SOURCE_SHA"; fi
              elif [[ "$1 $2" = 'release create' ]]; then
                echo draft >> events
                [[ "$SCENARIO" != upload-failure ]]
              elif [[ "$1 $2" = 'release view' ]]; then echo https://example.test/release
              else return 90; fi
            }
        '''
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            for scenario in ("success", "upload-failure", "bad-digest", "wrong-tag-commit"):
                with self.subTest(scenario=scenario):
                    (root / "events").write_text("", encoding="utf-8")
                    result = self.run_script(textwrap.dedent(stub) + script, root,
                                             SCENARIO=scenario, GITHUB_STEP_SUMMARY=str(root / "summary"))
                    self.assertEqual(result.returncode == 0, scenario == "success", result.stderr)
                    self.assertEqual((root / "events").read_text().splitlines(),
                                     ["draft", "public"] if scenario == "success" else ["draft"])


if __name__ == "__main__":
    unittest.main()
