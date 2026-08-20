import importlib.util
import json
import subprocess
import sys
import tempfile
import unittest
from unittest import mock
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts/verify-release-settings.py"
SPEC = importlib.util.spec_from_file_location("release_settings", SCRIPT)
release_settings = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(release_settings)

REPOSITORY = "owner/repo"
ENVIRONMENT = "official-release"
IMAGE = "ghcr.io/example/aosp-winscope-release@sha256:" + "a" * 64
SECRETS = [
    "ANDROID17_DEVICE_EVIDENCE_B64",
    "VULNERABILITY_EVIDENCE_B64",
    "PERFORMANCE_BASELINE_B64",
    "PERFORMANCE_BENCHMARK_B64",
]


def valid_snapshot() -> dict[str, object]:
    return {
        "schemaVersion": 1,
        "repository": REPOSITORY,
        "environmentName": ENVIRONMENT,
        "environment": {
            "name": ENVIRONMENT,
            "deployment_branch_policy": {
                "protected_branches": False,
                "custom_branch_policies": True,
            },
            "protection_rules": [
                {
                    "type": "required_reviewers",
                    "prevent_self_review": True,
                    "reviewers": [
                        {"type": "User", "reviewer": {"login": "release-reviewer"}},
                    ],
                }
            ],
        },
        "deploymentBranchPolicies": {
            "branch_policies": [{"name": "v17.*", "type": "tag"}],
        },
        "variables": {
            "variables": [{"name": "OFFICIAL_RELEASE_IMAGE", "value": IMAGE}],
        },
        "secrets": {"secrets": [{"name": name} for name in SECRETS]},
        "rulesets": [
            {
                "id": 1,
                "name": "Protect v17 tags",
                "target": "tag",
                "enforcement": "active",
                "conditions": {
                    "ref_name": {"include": ["refs/tags/v17.*"], "exclude": []},
                },
                "rules": [{"type": "update"}, {"type": "deletion"}],
            }
        ],
        "immutableReleases": {"enabled": True},
    }


def check(report: dict[str, object], name: str) -> dict[str, str]:
    return next(item for item in report["checks"] if item["name"] == name)


class ReleaseSettingsTest(unittest.TestCase):
    def audit(self, snapshot: dict[str, object]) -> dict[str, object]:
        return release_settings.audit_snapshot(snapshot, REPOSITORY, ENVIRONMENT)

    def test_valid_snapshot_passes(self):
        report = self.audit(valid_snapshot())
        self.assertTrue(report["ok"])
        self.assertEqual(report["errors"], [])
        self.assertTrue(all(item["status"] == "pass" for item in report["checks"]))

    def test_malformed_reviewer_entry_does_not_count(self):
        snapshot = valid_snapshot()
        snapshot["environment"]["protection_rules"][0]["reviewers"] = [{}]
        report = self.audit(snapshot)
        self.assertEqual(check(report, "environment:reviewers")["status"], "fail")

    def test_snapshot_identity_must_match_requested_repository_and_environment(self):
        for field, value in (("repository", "other/repo"), ("environmentName", "other")):
            with self.subTest(field=field):
                snapshot = valid_snapshot()
                snapshot[field] = value
                report = self.audit(snapshot)
                self.assertEqual(check(report, "snapshot:identity")["status"], "fail")

    def test_missing_reviewers_fails(self):
        snapshot = valid_snapshot()
        snapshot["environment"]["protection_rules"][0]["reviewers"] = []
        report = self.audit(snapshot)
        self.assertEqual(check(report, "environment:reviewers")["status"], "fail")

    def test_self_review_must_be_prevented(self):
        snapshot = valid_snapshot()
        snapshot["environment"]["protection_rules"][0]["prevent_self_review"] = False
        report = self.audit(snapshot)
        self.assertEqual(check(report, "environment:self-review")["status"], "fail")

    def test_custom_deployment_policies_must_be_enabled(self):
        snapshot = valid_snapshot()
        snapshot["environment"]["deployment_branch_policy"]["custom_branch_policies"] = False
        report = self.audit(snapshot)
        self.assertEqual(check(report, "environment:tag-policy")["status"], "fail")

    def test_exact_tag_deployment_policy_is_required(self):
        snapshot = valid_snapshot()
        snapshot["deploymentBranchPolicies"]["branch_policies"][0]["name"] = "v17.0.*"
        report = self.audit(snapshot)
        self.assertEqual(check(report, "environment:tag-policy")["status"], "fail")

    def test_image_variable_is_required_and_digest_pinned(self):
        for value in (None, "ghcr.io/example/release:latest", "UPPER@sha256:" + "a" * 64):
            with self.subTest(value=value):
                snapshot = valid_snapshot()
                variables = snapshot["variables"]["variables"]
                if value is None:
                    variables.clear()
                else:
                    variables[0]["value"] = value
                report = self.audit(snapshot)
                self.assertEqual(check(report, "environment:image-variable")["status"], "fail")

    def test_each_required_evidence_secret_is_required(self):
        for missing in SECRETS:
            with self.subTest(missing=missing):
                snapshot = valid_snapshot()
                snapshot["secrets"]["secrets"] = [
                    entry for entry in snapshot["secrets"]["secrets"] if entry["name"] != missing
                ]
                report = self.audit(snapshot)
                item = check(report, "environment:evidence-secrets")
                self.assertEqual(item["status"], "fail")
                self.assertIn(missing, item["detail"])

    def test_active_tag_ruleset_must_block_updates_and_deletions(self):
        mutations = {
            "inactive": lambda ruleset: ruleset.update(enforcement="disabled"),
            "wrong-target": lambda ruleset: ruleset.update(target="branch"),
            "wrong-pattern": lambda ruleset: ruleset["conditions"]["ref_name"].update(
                include=["refs/tags/v17.0.*"]
            ),
            "missing-update": lambda ruleset: ruleset.update(rules=[{"type": "deletion"}]),
            "missing-deletion": lambda ruleset: ruleset.update(rules=[{"type": "update"}]),
            "excluded": lambda ruleset: ruleset["conditions"]["ref_name"].update(
                exclude=["refs/tags/v17.*"]
            ),
        }
        for name, mutate in mutations.items():
            with self.subTest(name=name):
                snapshot = valid_snapshot()
                mutate(snapshot["rulesets"][0])
                report = self.audit(snapshot)
                self.assertEqual(check(report, "repository:tag-ruleset")["status"], "fail")

    def test_immutable_releases_must_be_enabled(self):
        snapshot = valid_snapshot()
        snapshot["immutableReleases"]["enabled"] = False
        report = self.audit(snapshot)
        self.assertEqual(check(report, "repository:immutable-releases")["status"], "fail")

    def test_malformed_snapshot_fails_clearly(self):
        with self.assertRaisesRegex(ValueError, "snapshot must be a JSON object"):
            release_settings.audit_snapshot([], REPOSITORY, ENVIRONMENT)

    def test_repository_exposes_stage_fifteen_audit_command_and_evidence(self):
        package = json.loads((ROOT / "package.json").read_text())
        self.assertEqual(
            package["scripts"]["release:settings"],
            "python3 scripts/verify-release-settings.py --repository yuchuangu85/AOSP-WinScope --json",
        )
        plan = (ROOT / "docs/REBUILD_PLAN.md").read_text()
        self.assertIn("## Stage 15 implementation evidence", plan)
        self.assertIn("npm run release:settings", plan)
        self.assertIn("--snapshot", plan)

    def test_live_collection_reads_later_pages(self):
        first_page = {"variables": [{"name": f"FILLER_{index}"} for index in range(30)]}
        second_page = {"variables": [{"name": "OFFICIAL_RELEASE_IMAGE", "value": IMAGE}]}
        responses = [first_page, second_page, {"variables": []}]
        with mock.patch.object(release_settings, "github_json", side_effect=responses) as github_json:
            result = release_settings.github_collection(
                "/repos/owner/repo/environments/official-release/variables",
                "token",
                "variables",
            )
        self.assertEqual(result["variables"][-1]["name"], "OFFICIAL_RELEASE_IMAGE")
        self.assertEqual(github_json.call_count, 3)
        self.assertIn("page=2", github_json.call_args_list[1].args[0])

    def test_live_snapshot_fetches_rule_details_and_maximum_page_size(self):
        repository_path = "/repos/owner/repo"
        environment_path = repository_path + "/environments/official-release"
        responses = {
            repository_path + "/rulesets?includes_parents=false&per_page=100&page=1": [{"id": 1}],
            repository_path + "/rulesets/1": valid_snapshot()["rulesets"][0],
            environment_path: valid_snapshot()["environment"],
            environment_path + "/deployment-branch-policies?per_page=100&page=1": valid_snapshot()["deploymentBranchPolicies"],
            environment_path + "/variables?per_page=100&page=1": valid_snapshot()["variables"],
            environment_path + "/secrets?per_page=100&page=1": valid_snapshot()["secrets"],
            repository_path + "/immutable-releases": valid_snapshot()["immutableReleases"],
            repository_path + "/rulesets?includes_parents=false&per_page=100&page=2": [],
            environment_path + "/deployment-branch-policies?per_page=100&page=2": {"branch_policies": []},
            environment_path + "/variables?per_page=100&page=2": {"variables": []},
            environment_path + "/secrets?per_page=100&page=2": {"secrets": []},
        }
        with mock.patch.object(
            release_settings, "github_json", side_effect=lambda path, token: responses[path]
        ) as github_json:
            snapshot = release_settings.fetch_snapshot(REPOSITORY, ENVIRONMENT, "token")
        self.assertEqual(snapshot["rulesets"], valid_snapshot()["rulesets"])
        self.assertEqual(snapshot["_errors"], [])
        self.assertEqual(github_json.call_count, len(responses))

    def test_snapshot_cli_emits_json_and_uses_status_code(self):
        for snapshot, expected_code in ((valid_snapshot(), 0), ({}, 1)):
            with self.subTest(expected_code=expected_code), tempfile.TemporaryDirectory() as temporary:
                path = Path(temporary) / "snapshot.json"
                output = Path(temporary) / "report.json"
                path.write_text(json.dumps(snapshot), encoding="utf-8")
                result = subprocess.run(
                    [
                        sys.executable,
                        str(SCRIPT),
                        "--repository",
                        REPOSITORY,
                        "--snapshot",
                        str(path),
                        "--json",
                        "--output",
                        str(output),
                    ],
                    cwd=ROOT,
                    text=True,
                    capture_output=True,
                    check=False,
                )
                self.assertEqual(result.returncode, expected_code, result.stderr)
                report = json.loads(result.stdout)
                self.assertEqual(report["ok"], expected_code == 0)
                self.assertEqual(json.loads(output.read_text()), report)


if __name__ == "__main__":
    unittest.main()
