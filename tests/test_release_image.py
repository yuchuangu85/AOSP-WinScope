import importlib.util
import json
import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from types import SimpleNamespace
from unittest import mock

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts/verify-release-image.py"
SPEC = importlib.util.spec_from_file_location("release_image", SCRIPT)
release_image = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(release_image)

IMAGE = "ghcr.io/example/aosp-winscope-release@sha256:" + "a" * 64
IMAGE_ID = "sha256:" + "b" * 64


def completed(stdout: str = "", stderr: str = "") -> SimpleNamespace:
    return SimpleNamespace(returncode=0, stdout=stdout, stderr=stderr)


def inspect_value(**overrides: object) -> str:
    value = {
        "Id": IMAGE_ID,
        "RepoDigests": [IMAGE],
        "Os": "linux",
        "Architecture": "amd64",
    }
    value.update(overrides)
    return json.dumps([value])


class ReleaseImageTest(unittest.TestCase):
    def test_valid_image_is_pulled_anonymously_and_probed_in_a_sandbox(self):
        with mock.patch.dict(os.environ, {"DOCKER_AUTH_CONFIG": "secret"}), mock.patch.object(
            release_image,
            "run_command",
            side_effect=[completed(), completed(inspect_value()), completed("tools ok\n")],
        ) as run_command:
            report = release_image.verify_image(IMAGE, docker="docker-test")

        self.assertTrue(report["ok"])
        self.assertEqual(report["image"], IMAGE)
        self.assertEqual(report["imageId"], IMAGE_ID)
        self.assertEqual(report["platform"], "linux/amd64")
        self.assertEqual(report["tools"], list(release_image.REQUIRED_TOOLS))

        pull, inspect, probe = [call.args[0] for call in run_command.call_args_list]
        self.assertEqual(pull[0], "docker-test")
        self.assertEqual(pull[-4:], ["pull", "--platform", "linux/amd64", IMAGE])
        self.assertEqual(inspect[-3:], ["image", "inspect", IMAGE])
        self.assertIn("--network", probe)
        self.assertIn("none", probe)
        self.assertIn("--read-only", probe)
        self.assertEqual(probe[probe.index("--cap-drop") + 1], "ALL")
        self.assertIn("no-new-privileges=true", probe)
        self.assertIn("--platform", probe)
        self.assertIn("linux/amd64", probe)
        self.assertEqual(probe[probe.index("--pids-limit") + 1], "64")
        self.assertEqual(probe[probe.index("--memory") + 1], "1g")
        self.assertEqual(probe[probe.index("--cpus") + 1], "1")
        probe_script = probe[-1]
        for tool in release_image.REQUIRED_TOOLS:
            self.assertIn(f"command -v {tool}", probe_script)
            self.assertGreaterEqual(probe_script.count(tool), 2)

        for call in run_command.call_args_list:
            self.assertNotIn("DOCKER_AUTH_CONFIG", call.kwargs["environment"])
        config_paths = {command[command.index("--config") + 1] for command in (pull, inspect, probe)}
        self.assertEqual(len(config_paths), 1)
        self.assertNotIn(str(Path.home()), config_paths.pop())

    def test_anonymous_config_preserves_daemon_context_but_removes_registry_credentials(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            source = root / "source"
            destination = root / "destination"
            (source / "contexts/meta/context-id").mkdir(parents=True)
            (source / "contexts/meta/context-id/meta.json").write_text("{}", encoding="utf-8")
            (source / "config.json").write_text(
                json.dumps({
                    "auths": {"ghcr.io": {"auth": "secret"}},
                    "credsStore": "keychain",
                    "currentContext": "desktop-linux",
                }),
                encoding="utf-8",
            )
            release_image.write_anonymous_docker_config(
                destination, {"DOCKER_CONFIG": str(source)}
            )
            config = json.loads((destination / "config.json").read_text())
            self.assertEqual(config, {"auths": {}, "currentContext": "desktop-linux"})
            self.assertTrue((destination / "contexts/meta/context-id/meta.json").is_file())

    def test_mutable_or_uppercase_image_reference_is_rejected_before_docker(self):
        for image in ("ghcr.io/example/release:latest", "GHCR.IO/example/release@sha256:" + "a" * 64):
            with self.subTest(image=image), mock.patch.object(release_image, "run_command") as run_command:
                with self.assertRaisesRegex(ValueError, "immutable lowercase image digest"):
                    release_image.verify_image(image)
                run_command.assert_not_called()

    def test_inspected_image_must_match_digest_and_linux_amd64_platform(self):
        cases = {
            "digest": {"RepoDigests": ["ghcr.io/example/release@sha256:" + "c" * 64]},
            "os": {"Os": "windows"},
            "architecture": {"Architecture": "arm64"},
            "id": {"Id": "bad"},
        }
        for name, overrides in cases.items():
            with self.subTest(name=name), mock.patch.object(
                release_image,
                "run_command",
                side_effect=[completed(), completed(inspect_value(**overrides))],
            ):
                with self.assertRaisesRegex(ValueError, name):
                    release_image.verify_image(IMAGE)

    def test_command_timeout_is_reported(self):
        with self.assertRaisesRegex(release_image.CommandError, "timed out"):
            release_image.run_command(
                [sys.executable, "-c", "import time; time.sleep(5)"], timeout=0.01
            )

    def test_command_diagnostics_are_bounded(self):
        command = [
            sys.executable,
            "-c",
            (
                "import sys; "
                f"sys.stderr.write('x' * {release_image.MAX_DIAGNOSTIC_BYTES + 100}); "
                "raise SystemExit(1)"
            ),
        ]
        with self.assertRaisesRegex(release_image.CommandError, "truncated") as raised:
            release_image.run_command(command)
        self.assertLess(len(str(raised.exception)), release_image.MAX_DIAGNOSTIC_BYTES + 200)

    def test_failed_probe_force_removes_created_container(self):
        calls: list[list[str]] = []

        def fake_run(
            command: list[str], **kwargs: object
        ) -> SimpleNamespace:
            calls.append(command)
            if "pull" in command:
                return completed()
            if command[-3:-1] == ["image", "inspect"]:
                return completed(inspect_value())
            if "run" in command:
                cidfile = Path(command[command.index("--cidfile") + 1])
                cidfile.write_text("c" * 64, encoding="utf-8")
                raise release_image.CommandError("command timed out")
            return completed()

        with mock.patch.object(release_image, "run_command", side_effect=fake_run):
            with self.assertRaisesRegex(ValueError, "timed out"):
                release_image.verify_image(IMAGE)
        self.assertEqual(calls[-1][-3:], ["rm", "-f", "c" * 64])

    def test_docker_failure_is_reported_without_running_later_steps(self):
        error = release_image.CommandError("anonymous pull failed")
        with mock.patch.object(release_image, "run_command", side_effect=error) as run_command:
            with self.assertRaisesRegex(ValueError, "anonymous pull failed"):
                release_image.verify_image(IMAGE)
        self.assertEqual(run_command.call_count, 1)

    def test_cli_emits_machine_readable_failure_and_output_file(self):
        with tempfile.TemporaryDirectory() as temporary:
            output = Path(temporary) / "report.json"
            result = subprocess.run(
                [
                    sys.executable,
                    str(SCRIPT),
                    "--image",
                    "mutable:latest",
                    "--json",
                    "--output",
                    str(output),
                ],
                cwd=ROOT,
                text=True,
                capture_output=True,
                check=False,
            )
            self.assertEqual(result.returncode, 1, result.stderr)
            report = json.loads(result.stdout)
            self.assertFalse(report["ok"])
            self.assertIn("immutable lowercase image digest", report["errors"][0])
            self.assertEqual(json.loads(output.read_text()), report)

    def test_output_write_failure_remains_machine_readable(self):
        with tempfile.TemporaryDirectory() as temporary:
            blocked_parent = Path(temporary) / "blocked"
            blocked_parent.write_text("not a directory", encoding="utf-8")
            result = subprocess.run(
                [
                    sys.executable,
                    str(SCRIPT),
                    "--image",
                    "mutable:latest",
                    "--json",
                    "--output",
                    str(blocked_parent / "report.json"),
                ],
                cwd=ROOT,
                text=True,
                capture_output=True,
                check=False,
            )
            self.assertEqual(result.returncode, 1, result.stderr)
            report = json.loads(result.stdout)
            self.assertFalse(report["ok"])
            self.assertTrue(any("cannot write report" in error for error in report["errors"]))

    def test_repository_exposes_stage_sixteen_command_and_evidence(self):
        package = json.loads((ROOT / "package.json").read_text())
        self.assertEqual(
            package["scripts"]["release:image"],
            "python3 scripts/verify-release-image.py --json",
        )
        plan = (ROOT / "docs/REBUILD_PLAN.md").read_text()
        self.assertIn("## Stage 16 implementation evidence", plan)
        self.assertIn("npm run release:image", plan)
        self.assertIn("does not build or publish", plan)
        workflow = (ROOT / ".github/workflows/official-release.yml").read_text()
        self.assertIn("Verify official release image", workflow)
        self.assertIn(
            'python3 scripts/verify-release-image.py --image "$OFFICIAL_RELEASE_IMAGE" --json',
            workflow,
        )


if __name__ == "__main__":
    unittest.main()
