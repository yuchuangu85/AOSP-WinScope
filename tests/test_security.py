import argparse
import importlib.util
import unittest
from pathlib import Path
from unittest import mock


ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("winscope_proxy", ROOT / "src/adb/winscope_proxy.py")
proxy = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(proxy)


class HostileInputSecurityTest(unittest.TestCase):
    def test_launcher_config_accepts_only_ephemeral_loopback_origin(self):
        valid = argparse.Namespace(port=0, token="a" * 64, allowed_origin="http://127.0.0.1:4321")
        self.assertEqual(proxy.validate_launcher_config(valid), ("http://127.0.0.1:4321", "127.0.0.1:4321"))
        for origin in ("http://localhost:4321", "https://127.0.0.1:4321", "http://127.0.0.1:4321/path"):
            with self.subTest(origin=origin):
                invalid = argparse.Namespace(port=0, token="a" * 64, allowed_origin=origin)
                with self.assertRaises(ValueError):
                    proxy.validate_launcher_config(invalid)

    def test_request_paths_reject_plain_and_encoded_traversal(self):
        for path in ("/capture/../status", "/capture/%2e%2e/status", "/capture/%2Fetc/passwd", "/capture/%5Cetc"):
            with self.subTest(path=path):
                with self.assertRaises(proxy.BadRequestError):
                    proxy.parse_request_path(path)
        self.assertEqual(proxy.parse_request_path("/devices"), ["devices"])

    def test_adb_environment_path_is_used_as_one_argument(self):
        completed = mock.Mock(returncode=0, stdout=b"ok")
        with mock.patch.dict("os.environ", {"WINSCOPE_ADB": r"C:\Android SDK\adb.exe"}):
            with mock.patch.object(proxy.subprocess, "run", return_value=completed) as run:
                self.assertEqual(proxy.call_adb(["devices", "-l"]), "ok")
        self.assertEqual(
            run.call_args.args[0],
            [r"C:\Android SDK\adb.exe", "devices", "-l"],
        )

    def test_adb_text_output_normalizes_windows_line_endings(self):
        completed = mock.Mock(returncode=0, stdout=b"first\r\nsecond\r\n")
        with mock.patch.object(proxy.subprocess, "run", return_value=completed):
            self.assertEqual(
                proxy.call_adb(["shell", "find /data/local/tmp"]),
                "first\nsecond\n",
            )

    def test_shell_command_normalizes_windows_line_endings(self):
        completed = mock.Mock(returncode=0, stdout=b"ok")
        with mock.patch.object(proxy.subprocess, "run", return_value=completed) as run:
            self.assertEqual(
                proxy.call_adb_shell("echo start\r\necho stop\r", "serial_01"),
                "ok",
            )

        self.assertEqual(
            run.call_args.args[0],
            ["adb", "-s", "serial_01", "shell", "echo start\necho stop\n"],
        )

    def test_nonzero_adb_error_identifies_operation_status_and_bounded_output(self):
        device_output = (
            b"\x1b[31merror: device unauthorized\x1b[0m\x00"
            + b"x" * (proxy.MAX_ADB_DIAGNOSTIC_CHARS + 100)
        )
        completed = mock.Mock(returncode=7, stdout=device_output)
        with mock.patch.object(proxy.subprocess, "run", return_value=completed):
            with self.assertRaises(proxy.AdbError) as raised:
                proxy.call_adb(
                    ["devices", "-l"],
                    operation="device discovery",
                )

        message = str(raised.exception)
        self.assertIn("ADB device discovery failed with status 7", message)
        self.assertIn("error: device unauthorized", message)
        self.assertNotIn("\x1b", message)
        self.assertNotIn("\x00", message)
        self.assertLessEqual(len(message), proxy.MAX_ADB_DIAGNOSTIC_CHARS + 100)

    def test_router_returns_safe_adb_diagnostic_to_browser(self):
        class FailingEndpoint(proxy.RequestEndpoint):
            def process(self, http_server, path):
                raise proxy.AdbError(
                    "ADB Perfetto capability query failed with status 1: "
                    "/system/bin/sh: perfetto: inaccessible or not found"
                )

        request = mock.Mock()
        request.headers = {proxy.WINSCOPE_TOKEN_HEADER: "session-token"}
        request.path = "/probe"
        with mock.patch.object(proxy, "secret_token", "session-token"):
            router = proxy.RequestRouter(request)
            router.register_endpoint(proxy.RequestType.GET, "probe", FailingEndpoint())

            router.process(proxy.RequestType.GET)

        request.respond.assert_called_once_with(
            proxy.HTTPStatus.BAD_GATEWAY,
            (
                b"ADB Perfetto capability query failed with status 1: "
                b"/system/bin/sh: perfetto: inaccessible or not found"
            ),
            "text/plain; charset=utf-8",
        )

    def test_optional_capability_probes_degrade_when_service_is_missing(self):
        with mock.patch.object(proxy, "call_adb_shell", side_effect=proxy.AdbError("missing")):
            for command in proxy.OPTIONAL_ADB_SHELL_COMMANDS:
                with self.subTest(command=command):
                    self.assertEqual(
                        proxy.call_optional_adb_shell(command, "serial_01"),
                        "",
                    )

    def test_trace_thread_preserves_status_read_failure(self):
        thread = proxy.TraceThread.__new__(proxy.TraceThread)
        thread.target_id = "ScreenRecording"
        thread.status_filename = proxy.WINSCOPE_STATUS + "_ScreenRecording"
        thread._device_id = "serial_01"
        thread._keep_alive_timer = None
        thread._command_timed_out = False
        thread._success = False
        thread._failure_message = ""
        thread.trace_command = "screenrecord /data/local/tmp/out.mp4"
        thread.process = mock.Mock(returncode=1)
        thread.process.communicate.return_value = (
            b"",
            b"/system/bin/sh: screenrecord: inaccessible or not found\n",
        )

        with mock.patch.object(thread, "reset_timer"):
            with mock.patch.object(
                proxy,
                "call_adb_shell",
                side_effect=proxy.AdbError(
                    "ADB trace status read failed with status 1: error: device offline"
                ),
            ):
                thread.run()

        self.assertFalse(thread.success())
        self.assertIn("screenrecord: inaccessible or not found", thread.failure())
        self.assertIn("device offline", thread.failure())

    def test_non_optional_adb_errors_are_preserved(self):
        with mock.patch.object(proxy, "call_adb_shell", side_effect=proxy.AdbError("failed")):
            with self.assertRaises(proxy.AdbError):
                proxy.call_optional_adb_shell("settings get system user_setup_complete", "serial_01")

    def test_shell_and_device_inputs_remain_bounded(self):
        proxy.validate_shell_command("atrace --async_start -b 4096")
        for command in ("", "a" * (proxy.MAX_COMMAND_BYTES + 1), "bad\x00command"):
            with self.subTest(command=repr(command)):
                with self.assertRaises(proxy.BadRequestError):
                    proxy.validate_shell_command(command)
        self.assertTrue(proxy.valid_device_id("serial_01"))
        self.assertFalse(proxy.valid_device_id("serial with spaces"))


if __name__ == "__main__":
    unittest.main()
