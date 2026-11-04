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
WORKFLOW = ROOT / ".github/workflows/release.yml"
SHA = "a" * 40
REPO = "example/winscope"


class ReleaseWorkflowTest(unittest.TestCase):
    def setUp(self):
        self.workflow = WORKFLOW.read_text(encoding="utf-8")

    def step(self, marker):
        matches = [
            step for step in re.split(r"(?=^      - )", self.workflow, flags=re.MULTILINE)
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
                 **env},
            capture_output=True, text=True, check=False,
        )

    def test_completed_packaging_run_is_the_only_trigger(self):
        triggers = self.workflow.split("\npermissions:", 1)[0]
        self.assertIn("workflow_run:", triggers)
        self.assertIn("workflows: [Electron desktop candidates]", triggers)
        self.assertIn("types: [completed]", triggers)
        for forbidden in ("workflow_dispatch:", "pull_request:", "push:", "schedule:"):
            self.assertNotIn(forbidden, triggers)
        self.assertIn("group: desktop-release-${{ github.event.workflow_run.id }}", self.workflow)
        self.assertIn("cancel-in-progress: false", self.workflow)

    def test_job_gate_rejects_prs_forks_other_branches_and_failed_builds(self):
        expression = self.workflow.split("    if: >-\n", 1)[1].split("    runs-on:", 1)[0]
        expression = expression.strip().removeprefix("${{").removesuffix("}}").strip()
        event = {
            "repository": {"default_branch": "main"},
            "workflow_run": {"conclusion": "success", "event": "workflow_dispatch",
                             "head_repository": {"full_name": REPO}, "head_branch": "main"},
        }
        cases = [(event, True)]
        for key, value in (
            ("conclusion", "failure"), ("conclusion", "cancelled"),
            ("conclusion", "skipped"), ("event", "pull_request"),
            ("event", "pull_request_target"), ("event", "push"),
            ("event", "workflow_call"), ("head_branch", "feature"),
            ("head_repository", {"full_name": "fork/winscope"}),
        ):
            changed = copy.deepcopy(event)
            changed["workflow_run"][key] = value
            cases.append((changed, False))
        result = subprocess.run(
            ["node", "-e", textwrap.dedent('''\
                const vm = require("node:vm");
                const {expression, events, repository} = JSON.parse(require("node:fs").readFileSync(0));
                console.log(JSON.stringify(events.map(event => vm.runInNewContext(
                  expression, {github: {event, repository}}, {timeout: 1000}
                ))));
            ''')],
            input=json.dumps({"expression": expression, "events": [x[0] for x in cases],
                              "repository": REPO}),
            capture_output=True, text=True, check=True,
        )
        self.assertEqual(json.loads(result.stdout), [x[1] for x in cases])

    def test_actions_are_pinned_and_only_the_publisher_gets_write_access(self):
        self.assertIn("permissions:\n  contents: read", self.workflow)
        self.assertIn("permissions:\n      actions: read\n      contents: write", self.workflow)
        for action in re.findall(r"uses: (\S+)", self.workflow):
            self.assertRegex(action, r"^[^@]+@[0-9a-f]{40}$")
        self.assertIn("persist-credentials: false", self.workflow)
        for forbidden in ("secrets.", "secrets: inherit", "id-token: write", "npm ci",
                          "npm run", "--clobber", "git push", "actions/cache@"):
            self.assertNotIn(forbidden, self.workflow)
        self.assertNotIn("GH_TOKEN", self.step("Reverify all targets"))

    def test_source_run_is_rechecked_before_checkout_or_artifact_download(self):
        script = self.script("Validate the successful source run")
        fixture = {
            "id": 123, "run_attempt": 1, "name": "Electron desktop candidates",
            "path": ".github/workflows/electron.yml", "status": "completed",
            "conclusion": "success", "event": "workflow_dispatch",
            "repository": {"full_name": REPO}, "head_repository": {"full_name": REPO},
            "head_branch": "main", "head_sha": SHA,
        }
        cases = [(fixture, True)]
        for key, value in (
            ("id", 124), ("run_attempt", 2), ("name", "Other workflow"),
            ("path", ".github/workflows/other.yml"), ("status", "in_progress"),
            ("conclusion", "failure"), ("event", "pull_request"),
            ("repository", {"full_name": "fork/winscope"}),
            ("head_repository", {"full_name": "fork/winscope"}),
            ("head_branch", "feature"), ("head_sha", "b" * 40),
        ):
            cases.append(({**fixture, key: value}, False))
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            for value, valid in cases:
                with self.subTest(value=value):
                    (root / "fixture.json").write_text(json.dumps(value), encoding="utf-8")
                    result = self.run_script('gh() { cat fixture.json; }\n' + script, root)
                    self.assertEqual(result.returncode == 0, valid, result.stderr)
            for env in ({"SOURCE_SHA": "main"}, {"SOURCE_RUN_ID": "1; exit 0"}):
                result = self.run_script('gh() { exit 90; }\n' + script, root, **env)
                self.assertNotEqual(result.returncode, 0)
        self.assertLess(self.workflow.index("Validate the successful source run"),
                        self.workflow.index("actions/checkout@"))

    def test_exact_commit_and_default_branch_ancestry_are_required(self):
        self.assertIn("ref: ${{ github.event.workflow_run.head_sha }}", self.workflow)
        self.assertNotIn("github.sha", self.workflow)
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
        self.assertLess(self.workflow.index("git merge-base --is-ancestor"),
                        self.workflow.index("actions/setup-node@"))

    def test_artifact_download_is_bound_to_the_source_run_and_publication_name(self):
        step = self.step("actions/download-artifact@")
        for value in (
            "name: ${{ steps.identity.outputs.publication-artifact }}",
            "run-id: ${{ github.event.workflow_run.id }}",
            "github-token: ${{ github.token }}", "repository: ${{ github.repository }}",
            "path: ${{ runner.temp }}/desktop-publication",
        ):
            self.assertIn(value, step)
        self.assertNotIn("pattern:", step)
        identity = self.step("id: identity")
        self.assertIn('node desktop/release.mjs plan --commit "$SOURCE_SHA"', identity)
        self.assertIn('"$version" "$SOURCE_RUN_ID" >> "$GITHUB_OUTPUT"', identity)

    def test_release_steps_are_sequential_success_only_with_remote_digest_gate(self):
        markers = (
            "Validate the successful source run", "actions/checkout@",
            "git merge-base --is-ancestor", "id: identity", "actions/download-artifact@",
            "node desktop/release.mjs verify", "gh release create",
            "node desktop/release.mjs check-remote", "test \"$remote_sha\" = \"$SOURCE_SHA\"",
            "gh release edit",
        )
        positions = [self.workflow.index(marker) for marker in markers]
        self.assertEqual(positions, sorted(positions))
        self.assertNotIn("continue-on-error", self.workflow)
        self.assertEqual(self.workflow.count("    if:"), 1)
        self.assertIn('--tag "$RELEASE_TAG"', self.step("Verify the uploaded draft"))
        self.assertIn("--draft --prerelease --latest=false --verify-tag", self.workflow)
        self.assertIn('--draft=false --prerelease --latest=false', self.workflow)

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
            "Publish the verified candidate",
        ))
        stub = '''\
            git() { return 0; }
            node() { [[ "$SCENARIO" != bad-digest ]]; }
            gh() {
              if [[ "$*" = *releases?per_page* ]]; then return 0
              elif [[ "$*" = *git/refs* ]]; then echo "$SOURCE_SHA"
              elif [[ "$*" = *git/ref/tags* ]]; then
                if [[ "$SCENARIO" = wrong-tag-commit ]]; then echo wrong; else echo "$SOURCE_SHA"; fi
              elif [[ "$*" = *releases/tags* ]]; then echo '{}'
              elif [[ "$1 $2" = 'release create' ]]; then
                echo draft >> events
                [[ "$SCENARIO" != upload-failure ]]
              elif [[ "$1 $2" = 'release edit' ]]; then echo public >> events
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
