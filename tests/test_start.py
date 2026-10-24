#!/usr/bin/env python3

import hashlib
import json
import os
import select
import signal
import subprocess
import sys
import tempfile
import time
import unittest
from pathlib import Path
from unittest import mock


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
import start


class SourceCheckoutStartTest(unittest.TestCase):
    def setUp(self):
        self.environment = {"PATH": "/pinned/bin", "AOSP_WINSCOPE_GO": "/pinned/go"}
        self.toolchain = {"commands": {"npm": "/pinned/npm", "go": "/pinned/go"}}

    def test_npm_scripts_register_launcher_and_preserve_web_dev_server(self):
        scripts = json.loads((ROOT / "package.json").read_text(encoding="utf-8"))["scripts"]
        self.assertEqual(scripts["start"], "python3 scripts/start.py")
        self.assertEqual(scripts["start:web"], "ng serve winscope --open")

    def test_verified_outputs_rebuild_only_protos_and_app_and_reverify(self):
        artifacts = {"trace_processor.wasm": {"sha256": "verified", "size": 1}}
        with (
            mock.patch.object(start.build, "recorded_artifacts", return_value=artifacts),
            mock.patch.object(start.build, "verify_outputs") as verify,
            mock.patch.object(start, "run_build") as run,
        ):
            events = mock.Mock()
            events.attach_mock(verify, "verify")
            events.attach_mock(run, "run")
            start.build_web("/pinned/npm", self.environment)

        self.assertEqual(events.mock_calls, [
            mock.call.verify(artifacts),
            mock.call.run(["/pinned/npm", "run", "build:protos"], self.environment),
            mock.call.run(["/pinned/npm", "run", "build:app"], self.environment),
            mock.call.verify(artifacts),
        ])

    def test_missing_or_unreadable_record_uses_full_build_then_verifies(self):
        errors = (
            start.dependencies.DependencyError("standalone production build state is missing"),
            OSError("unreadable state"),
            json.JSONDecodeError("invalid state", "{", 0),
        )
        for error in errors:
            with (
                self.subTest(error=error),
                mock.patch.object(start.build, "recorded_artifacts", side_effect=error),
                mock.patch.object(start.build, "verify_outputs") as verify,
                mock.patch.object(start, "run_build") as run,
                mock.patch.object(start.sys, "stderr") as stderr,
            ):
                start.build_web("/pinned/npm", self.environment)
                run.assert_called_once_with(
                    ["/pinned/npm", "run", "build:prod"], self.environment,
                )
                verify.assert_called_once_with()
                self.assertIn("Cannot reuse production outputs", "".join(
                    call.args[0] for call in stderr.write.call_args_list
                ))

    def test_corrupt_outputs_are_not_reused(self):
        error = start.dependencies.DependencyError("trace_processor.wasm differs from recorded build state")
        artifacts = {"trace_processor.wasm": {"sha256": "recorded", "size": 1}}
        with (
            mock.patch.object(start.build, "recorded_artifacts", return_value=artifacts),
            mock.patch.object(start.build, "verify_outputs", side_effect=[error, None]) as verify,
            mock.patch.object(start, "run_build") as run,
            mock.patch.object(start.sys, "stderr"),
        ):
            start.build_web("/pinned/npm", self.environment)

        run.assert_called_once_with(
            ["/pinned/npm", "run", "build:prod"], self.environment,
        )
        self.assertEqual(verify.call_args_list, [mock.call(artifacts), mock.call()])

    def test_rebuild_failures_propagate_without_retry(self):
        for target, call_number in (("build:protos", 1), ("build:app", 2)):
            error = subprocess.CalledProcessError(19, ["npm", "run", target])
            with (
                self.subTest(target=target),
                mock.patch.object(start.build, "recorded_artifacts", return_value={"verified": True}),
                mock.patch.object(start.build, "verify_outputs") as verify,
                mock.patch.object(start, "run_build", side_effect=[None] * (call_number - 1) + [error]) as run,
            ):
                with self.assertRaises(subprocess.CalledProcessError):
                    start.build_web("/pinned/npm", self.environment)
                self.assertEqual(run.call_count, call_number)
                self.assertEqual(verify.call_count, 1)

    def test_full_build_failure_does_not_reverify_or_continue(self):
        with (
            mock.patch.object(start.build, "recorded_artifacts", side_effect=start.dependencies.DependencyError("missing")),
            mock.patch.object(start.build, "verify_outputs") as verify,
            mock.patch.object(start, "run_build", side_effect=subprocess.CalledProcessError(23, ["npm"])),
            mock.patch.object(start.sys, "stderr"),
        ):
            with self.assertRaises(subprocess.CalledProcessError):
                start.build_web("/pinned/npm", self.environment)
        verify.assert_not_called()

    def test_post_build_verification_failure_does_not_trigger_full_build(self):
        error = start.dependencies.DependencyError("new output is invalid")
        with (
            mock.patch.object(start.build, "recorded_artifacts", return_value={"verified": True}),
            mock.patch.object(start.build, "verify_outputs", side_effect=[None, error]),
            mock.patch.object(start, "run_build") as run,
        ):
            with self.assertRaisesRegex(start.dependencies.DependencyError, "new output is invalid"):
                start.build_web("/pinned/npm", self.environment)
        self.assertEqual(run.call_count, 2)

    def test_runtime_copies_current_ui_and_canonical_proxy_and_builds_only_host(self):
        for host_os, host_arch in (("linux", "amd64"), ("darwin", "arm64"), ("windows", "arm64")):
            with self.subTest(host_os=host_os), tempfile.TemporaryDirectory() as temporary:
                root = Path(temporary)
                web = root / "dist/prod"
                web.mkdir(parents=True)
                assets = {
                    "index.html": b'<base href="./">',
                    "runtime-config.json": b'{"schemaVersion":1}',
                    "main.current.js": b"current UI",
                    "assets/trace_processor.wasm": b"verified wasm",
                }
                for name, contents in assets.items():
                    path = web / name
                    path.parent.mkdir(parents=True, exist_ok=True)
                    path.write_bytes(contents)
                runtime = root / "dist/local"
                runtime.mkdir()
                (runtime / "stale.js").write_text("old", encoding="utf-8")
                sibling = root / "dist/other"
                sibling.mkdir()
                proxy = root / "canonical_proxy.py"
                proxy.write_bytes(b"# canonical capture proxy\n")
                environment = self.environment | {"GOOS": "foreign", "GOARCH": "foreign"}
                with (
                    mock.patch.object(start, "ROOT", root),
                    mock.patch.object(start.build, "WEB_OUTPUT", web),
                    mock.patch.object(start.release, "DEFAULT_PROXY", proxy),
                    mock.patch.object(start.release, "create_web_manifest", wraps=start.release.create_web_manifest) as manifest,
                    mock.patch.object(start.subprocess, "run", return_value=mock.Mock(stdout=f"{host_os}\n{host_arch}\n")) as run,
                    mock.patch.object(start, "run_build") as compile_launcher,
                ):
                    launcher = start.build_launcher("/pinned/go", environment)

                self.assertEqual(launcher, runtime / ("winscope-launcher.exe" if host_os == "windows" else "winscope-launcher"))
                manifest.assert_called_once_with(runtime)
                self.assertEqual((runtime / "proxy/winscope_proxy.py").read_bytes(), proxy.read_bytes())
                for name, contents in assets.items():
                    self.assertEqual((runtime / "web" / name).read_bytes(), contents)
                value = json.loads((runtime / "manifest.json").read_text(encoding="utf-8"))
                self.assertEqual(value["schemaVersion"], 1)
                self.assertEqual({entry["path"]: entry["sha256"] for entry in value["assets"]}, {
                    f"web/{name}": hashlib.sha256(contents).hexdigest() for name, contents in assets.items()
                })
                self.assertFalse((runtime / "stale.js").exists())
                self.assertTrue(sibling.is_dir())
                run.assert_called_once_with(
                    ["/pinned/go", "env", "GOHOSTOS", "GOHOSTARCH"], cwd=root,
                    env=environment, check=True, capture_output=True, text=True,
                )
                compile_launcher.assert_called_once_with(
                    ["/pinned/go", "build", "-trimpath", "-o", str(launcher), "./cmd/launcher"],
                    environment | {"CGO_ENABLED": "0", "GOOS": host_os, "GOARCH": host_arch},
                )
                self.assertEqual(environment["GOOS"], "foreign")

    def test_main_uses_verified_toolchain_and_forwards_arguments_unchanged(self):
        launcher = ROOT / "dist/local/winscope-launcher"
        for arguments in ([], ["--offline-only"], ["--capture", "--open", "--port", "8123", "--browser", "path with spaces"]):
            with (
                self.subTest(arguments=arguments),
                mock.patch.object(start.dependencies, "reexec_with_supported_python") as reexec,
                mock.patch.object(start.build, "build_environment", return_value=(self.environment, self.toolchain)),
                mock.patch.object(start, "build_web") as web,
                mock.patch.object(start, "build_launcher", return_value=launcher) as build_launcher,
                mock.patch.object(start, "launch", return_value=27) as launch,
                mock.patch.object(start.sys, "argv", ["scripts/start.py", *arguments]),
            ):
                self.assertEqual(start.main(), 27)
                reexec.assert_called_once_with()
                web.assert_called_once_with("/pinned/npm", self.environment)
                build_launcher.assert_called_once_with("/pinned/go", self.environment)
                launch.assert_called_once_with(launcher, arguments, self.environment)

    def test_main_stops_before_launch_on_build_or_verification_failure(self):
        cases = (
            ("build_web", subprocess.CalledProcessError(17, ["npm"]), 17),
            ("build_web", subprocess.CalledProcessError(-signal.SIGTERM, ["npm"]), 143),
            ("build_web", start.dependencies.DependencyError("invalid output"), 1),
            ("build_launcher", subprocess.CalledProcessError(21, ["go"]), 21),
            ("build_launcher", FileNotFoundError("missing proxy"), 1),
            ("build_web", KeyboardInterrupt(), 130),
        )
        for stage, error, status in cases:
            with (
                self.subTest(stage=stage, error=error),
                mock.patch.object(start.dependencies, "reexec_with_supported_python"),
                mock.patch.object(start.build, "build_environment", return_value=(self.environment, self.toolchain)),
                mock.patch.object(start, "build_web") as web,
                mock.patch.object(start, "build_launcher") as build_launcher,
                mock.patch.object(start, "launch") as launch,
                mock.patch.object(start.sys, "stderr"),
            ):
                (web if stage == "build_web" else build_launcher).side_effect = error
                self.assertEqual(start.main([]), status)
                launch.assert_not_called()
                if stage == "build_web":
                    build_launcher.assert_not_called()

    def test_posix_exec_preserves_argument_boundaries_and_environment(self):
        launcher = ROOT / "dist/local/winscope-launcher"
        arguments = ["--offline-only", "--browser", "path with spaces"]
        with (
            mock.patch.object(start.sys, "platform", "linux"),
            mock.patch.object(start.os, "execve") as execute,
            mock.patch.object(start.subprocess, "Popen") as popen,
        ):
            start.launch(launcher, arguments, self.environment)
        execute.assert_called_once_with(str(launcher), [str(launcher), *arguments], self.environment)
        popen.assert_not_called()

    def test_windows_waits_for_exit_forwards_signals_and_restores_handlers(self):
        launcher = ROOT / "dist/local/winscope-launcher.exe"
        handlers = {}
        previous = {signal.SIGINT: object(), signal.SIGTERM: object(), 21: object()}
        process = mock.Mock()
        process.poll.return_value = None
        waits = 0

        def install(signum, handler):
            handlers[signum] = handler
            return previous[signum]

        def wait(timeout):
            nonlocal waits
            self.assertEqual(timeout, 0.2)
            waits += 1
            if waits == 1:
                raise subprocess.TimeoutExpired([str(launcher)], timeout)
            for signum in previous:
                handlers[signum](signum, None)
            process.poll.return_value = 37
            handlers[signal.SIGTERM](signal.SIGTERM, None)
            return 37

        process.wait.side_effect = wait
        with (
            mock.patch.object(start.sys, "platform", "win32"),
            mock.patch.object(start.subprocess, "CREATE_NEW_PROCESS_GROUP", 512, create=True),
            mock.patch.object(start.signal, "CTRL_BREAK_EVENT", 1, create=True),
            mock.patch.object(start.signal, "SIGBREAK", 21, create=True),
            mock.patch.object(start.signal, "signal", side_effect=install),
            mock.patch.object(start.subprocess, "Popen", return_value=process) as popen,
            mock.patch.object(start.os, "execve") as execute,
        ):
            self.assertEqual(start.launch(launcher, ["--offline-only"], self.environment), 37)

        execute.assert_not_called()
        popen.assert_called_once_with(
            [str(launcher), "--offline-only"], env=self.environment, creationflags=512,
        )
        self.assertEqual(process.send_signal.call_args_list, [mock.call(1)] * 3)
        self.assertEqual(handlers, previous)
        self.assertEqual(waits, 2)

    def test_build_command_returns_failures_and_restores_handlers(self):
        command = [sys.executable, "-c", "raise SystemExit(23)"]
        handlers = {signum: signal.getsignal(signum) for signum in (signal.SIGINT, signal.SIGTERM)}
        with self.assertRaises(subprocess.CalledProcessError) as result:
            start.run_build(command, os.environ.copy())
        self.assertEqual(result.exception.returncode, 23)
        self.assertEqual(handlers, {signum: signal.getsignal(signum) for signum in handlers})

    def test_windows_build_interruption_terminates_owned_process_tree(self):
        process = mock.Mock(pid=12345)
        process.poll.return_value = None
        process.wait.side_effect = [SystemExit(143), 0]
        with (
            mock.patch.object(start.sys, "platform", "win32"),
            mock.patch.object(start.subprocess, "CREATE_NEW_PROCESS_GROUP", 512, create=True),
            mock.patch.object(start.subprocess, "Popen", return_value=process) as popen,
            mock.patch.object(start.subprocess, "run") as terminate,
            mock.patch.object(start.signal, "signal"),
        ):
            with self.assertRaises(SystemExit) as result:
                start.run_build(["npm", "run", "build:app"], self.environment)
        self.assertEqual(result.exception.code, 143)
        popen.assert_called_once_with(
            ["npm", "run", "build:app"], cwd=ROOT, env=self.environment, creationflags=512,
        )
        terminate.assert_called_once_with(["taskkill", "/PID", "12345", "/T", "/F"], check=False)
        self.assertEqual(process.wait.call_args_list, [mock.call(timeout=0.2), mock.call(timeout=5)])

    @unittest.skipIf(os.name == "nt", "requires POSIX process groups")
    def test_sigterm_during_build_stops_owned_descendants(self):
        child_code = "import time; time.sleep(60)"
        build_code = (
            "import os,subprocess,sys,time; "
            f"child=subprocess.Popen([sys.executable,'-c',{child_code!r}]); "
            "print(os.getpid(),child.pid,flush=True); time.sleep(60)"
        )
        wrapper_code = (
            f"import os,sys; sys.path.insert(0,{str(ROOT / 'scripts')!r}); import start; "
            f"start.run_build([sys.executable,'-c',{build_code!r}],os.environ.copy())"
        )
        wrapper = subprocess.Popen(
            [sys.executable, "-c", wrapper_code], stdout=subprocess.PIPE,
            stderr=subprocess.PIPE, text=True,
        )
        group = None
        try:
            self.assertTrue(select.select([wrapper.stdout], [], [], 5)[0], "build did not become ready")
            group, descendant = map(int, wrapper.stdout.readline().split())
            wrapper.send_signal(signal.SIGTERM)
            self.assertEqual(wrapper.wait(timeout=10), 143)
            deadline = time.monotonic() + 5
            while time.monotonic() < deadline:
                state = subprocess.run(
                    ["ps", "-o", "stat=", "-p", str(descendant)], capture_output=True, text=True,
                ).stdout.strip()
                if not state or state.startswith("Z"):
                    break
                time.sleep(0.05)
            else:
                self.fail("owned build descendant survived wrapper SIGTERM")
        finally:
            if wrapper.poll() is None:
                wrapper.kill()
                wrapper.wait()
            if group is not None:
                try:
                    os.killpg(group, signal.SIGKILL)
                except ProcessLookupError:
                    pass
            wrapper.stdout.close()
            wrapper.stderr.close()


if __name__ == "__main__":
    unittest.main()
