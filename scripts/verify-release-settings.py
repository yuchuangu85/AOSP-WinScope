#!/usr/bin/env python3
"""Audit GitHub settings required before creating an official release."""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import quote
from urllib.request import Request, urlopen

API_ROOT = "https://api.github.com"
API_VERSION = "2022-11-28"
IMAGE_RE = re.compile(r"^[a-z0-9][a-z0-9._/-]*@sha256:[0-9a-f]{64}$")
REPOSITORY_RE = re.compile(r"^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$")
REQUIRED_SECRETS = {
    "ANDROID17_DEVICE_EVIDENCE_B64",
    "VULNERABILITY_EVIDENCE_B64",
    "PERFORMANCE_BASELINE_B64",
    "PERFORMANCE_BENCHMARK_B64",
}


def objects(value: Any) -> list[dict[str, Any]]:
    return [item for item in value if isinstance(item, dict)] if isinstance(value, list) else []


def object_field(value: Any, field: str) -> dict[str, Any]:
    item = value.get(field) if isinstance(value, dict) else None
    return item if isinstance(item, dict) else {}


def list_field(value: Any, field: str) -> list[dict[str, Any]]:
    item = value.get(field) if isinstance(value, dict) else None
    return objects(item)


def audit_snapshot(snapshot: Any, repository: str, environment_name: str) -> dict[str, Any]:
    if not isinstance(snapshot, dict):
        raise ValueError("snapshot must be a JSON object")

    checks: list[dict[str, str]] = []

    def add(name: str, ok: bool, success: str, failure: str) -> None:
        checks.append({"name": name, "status": "pass" if ok else "fail", "detail": success if ok else failure})

    identity_ok = (
        snapshot.get("schemaVersion") == 1
        and snapshot.get("repository") == repository
        and snapshot.get("environmentName") == environment_name
    )
    add(
        "snapshot:identity",
        identity_ok,
        f"snapshot is bound to {repository} and {environment_name}",
        "snapshot schemaVersion, repository, or environmentName does not match the audit target",
    )

    environment = object_field(snapshot, "environment")
    add(
        "environment:name",
        environment.get("name") == environment_name,
        f"environment {environment_name} exists",
        f"expected environment {environment_name}",
    )

    reviewer_rules = [
        rule for rule in list_field(environment, "protection_rules")
        if rule.get("type") == "required_reviewers"
    ]
    reviewer_rule = reviewer_rules[0] if len(reviewer_rules) == 1 else {}
    reviewers = [
        reviewer for reviewer in objects(reviewer_rule.get("reviewers"))
        if reviewer.get("type") in {"User", "Team"}
        and bool(object_field(reviewer, "reviewer"))
    ]
    add(
        "environment:reviewers",
        bool(reviewers),
        f"{len(reviewers)} required reviewer(s) configured",
        "required_reviewers must contain at least one reviewer",
    )
    add(
        "environment:self-review",
        reviewer_rule.get("prevent_self_review") is True,
        "self-review is prevented",
        "required_reviewers must set prevent_self_review to true",
    )

    policies = list_field(object_field(snapshot, "deploymentBranchPolicies"), "branch_policies")
    deployment_policy = object_field(environment, "deployment_branch_policy")
    tag_policy = (
        deployment_policy.get("custom_branch_policies") is True
        and any(policy.get("name") == "v17.*" and policy.get("type") == "tag" for policy in policies)
    )
    add(
        "environment:tag-policy",
        tag_policy,
        "custom deployment tag policy v17.* is configured",
        "custom deployment policies must be enabled and contain the exact tag pattern v17.*",
    )

    variables = [
        variable for variable in list_field(object_field(snapshot, "variables"), "variables")
        if variable.get("name") == "OFFICIAL_RELEASE_IMAGE"
    ]
    image = variables[0].get("value") if len(variables) == 1 else None
    add(
        "environment:image-variable",
        isinstance(image, str) and IMAGE_RE.fullmatch(image) is not None,
        "OFFICIAL_RELEASE_IMAGE is pinned by SHA-256 digest",
        "OFFICIAL_RELEASE_IMAGE must be a single lowercase name@sha256:<64 hex> value",
    )

    secret_names = {
        secret.get("name") for secret in list_field(object_field(snapshot, "secrets"), "secrets")
        if isinstance(secret.get("name"), str)
    }
    missing_secrets = sorted(REQUIRED_SECRETS - secret_names)
    add(
        "environment:evidence-secrets",
        not missing_secrets,
        "all four evidence secrets are configured",
        "missing evidence secrets: " + ", ".join(missing_secrets),
    )

    valid_ruleset = False
    for ruleset in objects(snapshot.get("rulesets")):
        # GitHub returns ref patterns as strings, not objects.
        raw_includes = object_field(object_field(ruleset, "conditions"), "ref_name").get("include")
        patterns = raw_includes if isinstance(raw_includes, list) else []
        raw_excludes = object_field(object_field(ruleset, "conditions"), "ref_name").get("exclude")
        exclusions = raw_excludes if isinstance(raw_excludes, list) else []
        rule_types = {rule.get("type") for rule in objects(ruleset.get("rules"))}
        if (
            ruleset.get("target") == "tag"
            and ruleset.get("enforcement") == "active"
            and "refs/tags/v17.*" in patterns
            and not exclusions
            and {"update", "deletion"} <= rule_types
        ):
            valid_ruleset = True
            break
    add(
        "repository:tag-ruleset",
        valid_ruleset,
        "active v17.* tag ruleset blocks updates and deletions",
        "an active tag ruleset for refs/tags/v17.* without exclusions must contain update and deletion rules",
    )

    immutable = object_field(snapshot, "immutableReleases")
    add(
        "repository:immutable-releases",
        immutable.get("enabled") is True,
        "immutable releases are enabled",
        "repository immutable releases must be enabled",
    )

    failures = [item["detail"] for item in checks if item["status"] == "fail"]
    api_errors = snapshot.get("_errors", [])
    if isinstance(api_errors, list):
        failures.extend(str(error) for error in api_errors)
    return {
        "schemaVersion": 1,
        "repository": repository,
        "environment": environment_name,
        "ok": not failures,
        "checks": checks,
        "errors": failures,
    }


def github_json(path: str, token: str) -> Any:
    request = Request(
        API_ROOT + path,
        headers={
            "Accept": "application/vnd.github+json",
            "Authorization": f"Bearer {token}",
            "User-Agent": "aosp-winscope-release-settings-audit",
            "X-GitHub-Api-Version": API_VERSION,
        },
    )
    try:
        with urlopen(request, timeout=30) as response:
            return json.load(response)
    except HTTPError as error:
        try:
            body = json.loads(error.read().decode("utf-8")).get("message", error.reason)
        except (UnicodeDecodeError, json.JSONDecodeError, AttributeError):
            body = error.reason
        raise RuntimeError(f"GitHub API {error.code} for {path}: {body}") from error
    except (OSError, URLError, json.JSONDecodeError) as error:
        raise RuntimeError(f"GitHub API request failed for {path}: {error}") from error


def github_collection(path: str, token: str, field: str | None = None) -> Any:
    collected: list[dict[str, Any]] = []
    page = 1
    while True:
        separator = "&" if "?" in path else "?"
        value = github_json(f"{path}{separator}per_page=100&page={page}", token)
        raw_items = value.get(field) if field is not None and isinstance(value, dict) else value
        if not isinstance(raw_items, list):
            raise RuntimeError(f"GitHub API returned an invalid collection for {path}")
        if not raw_items:
            break
        collected.extend(objects(raw_items))
        page += 1
    return {field: collected} if field is not None else collected


def fetch_snapshot(repository: str, environment_name: str, token: str) -> dict[str, Any]:
    repository_path = "/repos/" + repository
    environment_path = repository_path + "/environments/" + quote(environment_name, safe="")
    errors: list[str] = []

    def fetch(label: str, path: str, default: Any) -> Any:
        try:
            return github_json(path, token)
        except RuntimeError as error:
            errors.append(f"{label}: {error}")
            return default

    def fetch_collection(label: str, path: str, field: str | None, default: Any) -> Any:
        try:
            return github_collection(path, token, field)
        except RuntimeError as error:
            errors.append(f"{label}: {error}")
            return default

    rulesets = fetch_collection(
        "rulesets", repository_path + "/rulesets?includes_parents=false", None, []
    )
    detailed_rulesets: list[dict[str, Any]] = []
    for ruleset in objects(rulesets):
        ruleset_id = ruleset.get("id")
        if isinstance(ruleset_id, int):
            detail = fetch(
                f"ruleset {ruleset_id}",
                repository_path + f"/rulesets/{ruleset_id}",
                ruleset,
            )
            if isinstance(detail, dict):
                detailed_rulesets.append(detail)

    return {
        "schemaVersion": 1,
        "repository": repository,
        "environmentName": environment_name,
        "environment": fetch("environment", environment_path, {}),
        "deploymentBranchPolicies": fetch_collection(
            "deployment branch policies",
            environment_path + "/deployment-branch-policies",
            "branch_policies",
            {},
        ),
        "variables": fetch_collection(
            "environment variables", environment_path + "/variables", "variables", {}
        ),
        "secrets": fetch_collection(
            "environment secrets", environment_path + "/secrets", "secrets", {}
        ),
        "rulesets": detailed_rulesets,
        "immutableReleases": fetch(
            "immutable releases", repository_path + "/immutable-releases", {}
        ),
        "_errors": errors,
    }


def read_snapshot(path: Path) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        raise ValueError(f"cannot read snapshot {path}: {error}") from error


def emit(report: dict[str, Any], as_json: bool, output: Path | None) -> None:
    rendered = json.dumps(report, indent=2, sort_keys=True) + "\n"
    if output is not None:
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(rendered, encoding="utf-8")
    if as_json:
        sys.stdout.write(rendered)
    else:
        for item in report["checks"]:
            print(f"{item['status'].upper():4} {item['name']}: {item['detail']}")
        for error in report["errors"]:
            print(f"ERROR {error}", file=sys.stderr)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repository", default=os.environ.get("GITHUB_REPOSITORY"))
    parser.add_argument("--environment", default="official-release")
    parser.add_argument("--snapshot", type=Path)
    parser.add_argument("--output", type=Path)
    parser.add_argument("--json", action="store_true")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    repository = args.repository or ""
    report: dict[str, Any]
    try:
        if REPOSITORY_RE.fullmatch(repository) is None:
            raise ValueError("--repository must use owner/repo format")
        if not args.environment:
            raise ValueError("--environment must not be empty")
        if args.snapshot is not None:
            snapshot = read_snapshot(args.snapshot)
        else:
            token = os.environ.get("GH_TOKEN") or os.environ.get("GITHUB_TOKEN")
            if not token:
                raise ValueError("GH_TOKEN or GITHUB_TOKEN is required without --snapshot")
            snapshot = fetch_snapshot(repository, args.environment, token)
        report = audit_snapshot(snapshot, repository, args.environment)
    except ValueError as error:
        report = {
            "schemaVersion": 1,
            "repository": repository,
            "environment": args.environment,
            "ok": False,
            "checks": [],
            "errors": [str(error)],
        }
    emit(report, args.json, args.output)
    return 0 if report["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
