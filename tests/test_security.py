import argparse
import importlib.util
import unittest
from pathlib import Path


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
