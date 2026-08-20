#!/usr/bin/env python3
"""Verify the digest-pinned official release image without publishing it."""

from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import threading
from pathlib import Path
from typing import Any

IMAGE_RE = re.compile(r"^[a-z0-9][a-z0-9._/-]*@sha256:[0-9a-f]{64}$")
SHA256_RE = re.compile(r"^sha256:[0-9a-f]{64}$")
CONTAINER_ID_RE = re.compile(r"^[0-9a-f]{12,64}$")
MAX_DIAGNOSTIC_BYTES = 64 * 1024
PULL_TIMEOUT_SECONDS = 10 * 60
PROBE_TIMEOUT_SECONDS = 2 * 60
REQUIRED_TOOLS = (
    "bash",
    "base64",
    "sha256sum",
    "mkdir",
    "rm",
    "cut",
    "find",
    "xargs",
    "tar",
    "gzip",
    "unzip",
    "curl",
    "wget",
    "git",
    "gh",
    "google-chrome",
    "cc",
    "c++",
    "make",
    "ar",
)


class CommandError(RuntimeError):
    pass


def drain_output(
    stream: Any, buffer: bytearray, truncated: list[bool]
) -> None:
    for chunk in iter(lambda: stream.read(8192), b""):
        remaining = MAX_DIAGNOSTIC_BYTES - len(buffer)
        if remaining > 0:
            buffer.extend(chunk[:remaining])
        if len(chunk) > remaining:
            truncated[0] = True


def rendered_output(buffer: bytearray, truncated: bool) -> str:
    rendered = bytes(buffer).decode("utf-8", errors="replace")
    return rendered + ("\n[output truncated]" if truncated else "")


def run_command(
    command: list[str],
    environment: dict[str, str] | None = None,
    timeout: int = PROBE_TIMEOUT_SECONDS,
) -> subprocess.CompletedProcess[str]:
    try:
        process = subprocess.Popen(
            command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, env=environment
        )
    except OSError as error:
        raise CommandError(f"cannot run {command[0]}: {error}") from error

    assert process.stdout is not None and process.stderr is not None
    stdout_buffer, stderr_buffer = bytearray(), bytearray()
    stdout_truncated, stderr_truncated = [False], [False]
    threads = [
        threading.Thread(
            target=drain_output,
            args=(process.stdout, stdout_buffer, stdout_truncated),
            daemon=True,
        ),
        threading.Thread(
            target=drain_output,
            args=(process.stderr, stderr_buffer, stderr_truncated),
            daemon=True,
        ),
    ]
    for thread in threads:
        thread.start()
    try:
        returncode = process.wait(timeout=timeout)
    except subprocess.TimeoutExpired as error:
        process.kill()
        process.wait()
        for thread in threads:
            thread.join()
        process.stdout.close()
        process.stderr.close()
        raise CommandError(
            f"command timed out after {timeout}s: {' '.join(command[:4])}"
        ) from error
    for thread in threads:
        thread.join()
    process.stdout.close()
    process.stderr.close()

    captured_stdout = rendered_output(stdout_buffer, stdout_truncated[0])
    captured_stderr = rendered_output(stderr_buffer, stderr_truncated[0])
    if returncode != 0:
        detail = captured_stderr.strip() or captured_stdout.strip() or f"exit {returncode}"
        raise CommandError(f"command failed: {' '.join(command[:4])}: {detail}")
    return subprocess.CompletedProcess(
        command, returncode, captured_stdout, captured_stderr
    )


def write_anonymous_docker_config(
    destination: Path, environment: dict[str, str]
) -> None:
    source = Path(
        environment.get("DOCKER_CONFIG", str(Path.home() / ".docker"))
    ).expanduser()
    anonymous: dict[str, Any] = {"auths": {}}
    source_config = source / "config.json"
    if source_config.is_file():
        try:
            existing = json.loads(source_config.read_text(encoding="utf-8"))
        except json.JSONDecodeError as error:
            raise ValueError(f"invalid Docker client configuration: {error}") from error
        if not isinstance(existing, dict):
            raise ValueError("Docker client configuration must be a JSON object")
        current_context = existing.get("currentContext")
        if isinstance(current_context, str) and current_context:
            anonymous["currentContext"] = current_context
    contexts = source / "contexts"
    if contexts.is_dir():
        shutil.copytree(contexts, destination / "contexts")
    destination.mkdir(parents=True, exist_ok=True)
    (destination / "config.json").write_text(
        json.dumps(anonymous, separators=(",", ":")) + "\n", encoding="utf-8"
    )


def inspect_image(stdout: str, image: str) -> dict[str, Any]:
    try:
        values = json.loads(stdout)
    except json.JSONDecodeError as error:
        raise ValueError(f"invalid Docker image inspection: {error}") from error
    if not isinstance(values, list) or len(values) != 1 or not isinstance(values[0], dict):
        raise ValueError("invalid Docker image inspection result")
    value = values[0]
    image_id = value.get("Id")
    if not isinstance(image_id, str) or SHA256_RE.fullmatch(image_id) is None:
        raise ValueError("image id is not a SHA-256 digest")
    expected_digest = image.rsplit("@", 1)[1]
    repo_digests = value.get("RepoDigests")
    if not isinstance(repo_digests, list) or not any(
        isinstance(digest, str) and digest.endswith("@" + expected_digest)
        for digest in repo_digests
    ):
        raise ValueError("inspected image digest does not match the requested digest")
    if value.get("Os") != "linux":
        raise ValueError(f"image os must be linux, got {value.get('Os')!r}")
    if value.get("Architecture") != "amd64":
        raise ValueError(
            f"image architecture must be amd64, got {value.get('Architecture')!r}"
        )
    return value


def cleanup_probe_container(
    base: list[str], cidfile: Path, environment: dict[str, str]
) -> None:
    if not cidfile.is_file():
        return
    try:
        container_id = cidfile.read_text(encoding="utf-8").strip()
    except OSError as error:
        raise CommandError(f"cannot read probe container id: {error}") from error
    if CONTAINER_ID_RE.fullmatch(container_id) is None:
        raise CommandError("probe container id is invalid")
    try:
        run_command(
            base + ["rm", "-f", container_id],
            environment=environment,
            timeout=30,
        )
    except CommandError as error:
        if "No such container" not in str(error):
            raise


def verify_image(image: str, docker: str = "docker") -> dict[str, Any]:
    if IMAGE_RE.fullmatch(image) is None:
        raise ValueError("OFFICIAL_RELEASE_IMAGE must be an immutable lowercase image digest")

    probe_script = "set -eu\n" + "\n".join(
        f"command -v {tool} >/dev/null" for tool in REQUIRED_TOOLS
    )
    probe_script += """
bash --version >/dev/null
test "$(printf ok | base64 | base64 --decode)" = ok
printf ok | sha256sum >/dev/null
mkdir --version >/dev/null
rm --version >/dev/null
cut --version >/dev/null
find --version >/dev/null
xargs --version >/dev/null
tar --version >/dev/null
gzip --version >/dev/null
unzip -v >/dev/null
curl --version >/dev/null
wget --version >/dev/null
git --version >/dev/null
gh --version >/dev/null
google-chrome --version >/dev/null 2>&1
cc --version >/dev/null
c++ --version >/dev/null
make --version >/dev/null
ar --version >/dev/null
"""

    try:
        with tempfile.TemporaryDirectory(prefix="aosp-winscope-docker-") as temporary:
            config = Path(temporary)
            environment = os.environ.copy()
            write_anonymous_docker_config(config, environment)
            base = [docker, "--config", str(config)]
            environment.pop("DOCKER_AUTH_CONFIG", None)
            environment.pop("DOCKER_CONFIG", None)
            run_command(
                base + ["pull", "--platform", "linux/amd64", image],
                environment=environment,
                timeout=PULL_TIMEOUT_SECONDS,
            )
            inspected = inspect_image(
                run_command(
                    base + ["image", "inspect", image], environment=environment
                ).stdout,
                image,
            )
            cidfile = config / "probe.cid"
            try:
                run_command(
                    base
                    + [
                        "run",
                        "--cidfile",
                        str(cidfile),
                        "--rm",
                        "--platform",
                        "linux/amd64",
                        "--network",
                        "none",
                        "--read-only",
                        "--cap-drop",
                        "ALL",
                        "--security-opt",
                        "no-new-privileges=true",
                        "--pids-limit",
                        "64",
                        "--memory",
                        "1g",
                        "--cpus",
                        "1",
                        "--entrypoint",
                        "/bin/bash",
                        image,
                        "-lc",
                        probe_script,
                    ],
                    environment=environment,
                )
            except CommandError as error:
                try:
                    cleanup_probe_container(base, cidfile, environment)
                except CommandError as cleanup_error:
                    raise ValueError(
                        f"{error}; probe cleanup failed: {cleanup_error}"
                    ) from error
                raise
    except CommandError as error:
        raise ValueError(str(error)) from error

    return {
        "schemaVersion": 1,
        "ok": True,
        "image": image,
        "imageId": inspected["Id"],
        "platform": "linux/amd64",
        "anonymousPull": True,
        "networkDisabledDuringProbe": True,
        "readOnlyProbe": True,
        "tools": list(REQUIRED_TOOLS),
        "errors": [],
    }


def emit(report: dict[str, Any], as_json: bool, output: Path | None) -> dict[str, Any]:
    if output is not None:
        try:
            output.parent.mkdir(parents=True, exist_ok=True)
            output.write_text(
                json.dumps(report, indent=2, sort_keys=True) + "\n", encoding="utf-8"
            )
        except OSError as error:
            report = dict(report)
            report["ok"] = False
            report["errors"] = list(report.get("errors", [])) + [
                f"cannot write report {output}: {error}"
            ]
    rendered = json.dumps(report, indent=2, sort_keys=True) + "\n"
    if as_json:
        sys.stdout.write(rendered)
    elif report["ok"]:
        print(f"Official release image verified: {report['image']}")
    else:
        for error in report["errors"]:
            print(f"ERROR {error}", file=sys.stderr)
    return report


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--image", default=os.environ.get("OFFICIAL_RELEASE_IMAGE"))
    parser.add_argument("--docker", default=os.environ.get("DOCKER", "docker"))
    parser.add_argument("--output", type=Path)
    parser.add_argument("--json", action="store_true")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    image = args.image or ""
    try:
        report = verify_image(image, args.docker)
    except (OSError, ValueError) as error:
        report = {
            "schemaVersion": 1,
            "ok": False,
            "image": image,
            "platform": "linux/amd64",
            "errors": [str(error)],
        }
    report = emit(report, args.json, args.output)
    return 0 if report["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
