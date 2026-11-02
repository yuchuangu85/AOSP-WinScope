import concurrent.futures
import http.client
import importlib.util
import json
import os
from pathlib import Path
import queue
import signal
import socket
import subprocess
import sys
import tempfile
import threading
import time
import unittest
from unittest import mock


ROOT = Path(__file__).resolve().parents[1]
PROXY = ROOT / "src/adb/winscope_proxy.py"
SPEC = importlib.util.spec_from_file_location("capture_shutdown_proxy", PROXY)
proxy = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(proxy)
TOKEN = "a" * 64
ORIGIN = "http://127.0.0.1:43210"
ARGUMENTS = ["--token", TOKEN, "--allowed-origin", ORIGIN, "--parent-pipe"]

SLEEPER = """
import os, pathlib, signal, sys, time
signal.signal(signal.SIGTERM, signal.SIG_IGN)
pathlib.Path(sys.argv[1]).write_text(str(os.getpid()))
time.sleep(60)
"""

# Substitute only the ADB executable boundary, keeping real Popen, pipes,
# requests, trace threads, timeouts and the production shutdown entry point.
BOOTSTRAP = """
import importlib.util, json, os, pathlib, subprocess, sys
spec = importlib.util.spec_from_file_location("proxy", sys.argv.pop(1))
proxy = importlib.util.module_from_spec(spec)
spec.loader.exec_module(proxy)
real_popen = subprocess.Popen
children = []
def start(command, **kwargs):
    child = real_popen([sys.executable, "-c", os.environ["TEST_SLEEPER"],
                       os.environ["TEST_CHILD_PID"]], **kwargs)
    children.append(child)
    return child
proxy.subprocess.Popen = start
proxy.main()
results = []
for child in children:
    reaped = child.returncode is not None
    if os.name == "posix":
        try:
            os.waitpid(child.pid, os.WNOHANG)
            reaped = False
        except ChildProcessError:
            pass
    results.append({"pid": child.pid, "returncode": child.returncode, "reaped": reaped})
pathlib.Path(os.environ["TEST_REAPED"]).write_text(json.dumps(results))
"""


@unittest.skipUnless(os.name == "posix", "Linux library paths require a POSIX filesystem")
class DesktopAdbEnvironmentTest(unittest.TestCase):
    def setUp(self):
        directory = tempfile.TemporaryDirectory()
        self.addCleanup(directory.cleanup)
        self.root = Path(directory.name)
        self.tools = self.root / "platform-tools"
        self.tools.mkdir()
        self.adb = self.tools / "adb"
        self.adb.write_bytes(b"test adb")
        self.library = self.tools / "lib64"
        self.library.mkdir()
        self.environment = {
            "WINSCOPE_ADB": str(self.adb),
            "WINSCOPE_ADB_LIBRARY_PATH": str(self.library),
            "LD_LIBRARY_PATH": str(self.root / "capture/_internal") + ":/inherited/lib",
            "PATH": "/system/bin",
            "KEEP": "host",
        }
        for patcher in (mock.patch.dict(os.environ, self.environment, clear=True),
                        mock.patch.object(proxy.sys, "platform", "linux")):
            patcher.start()
            self.addCleanup(patcher.stop)

    def test_environment_replaces_frozen_and_inherited_loader_paths_without_global_mutation(self):
        before = dict(os.environ)
        environment = proxy.adb_process_environment()
        self.assertEqual(environment, dict(before, LD_LIBRARY_PATH=str(self.library)))
        self.assertEqual(dict(os.environ), before)
        environment["KEEP"] = "leaf only"
        self.assertEqual(os.environ["KEEP"], "host")

    def test_explicit_environment_is_copied_even_when_empty(self):
        for base in ({}, {"KEEP": "caller", "PATH": "/caller/bin",
                          "LD_LIBRARY_PATH": "/caller/_internal:/caller/lib",
                          "WINSCOPE_ADB_LIBRARY_PATH": "/caller/untrusted"}):
            with self.subTest(base=base):
                before = dict(base)
                environment = proxy.adb_process_environment(base)
                self.assertEqual(environment, dict(before, LD_LIBRARY_PATH=str(self.library)))
                self.assertIsNot(environment, base)
                self.assertEqual(base, before)
                self.assertEqual(dict(os.environ), self.environment)

    def test_only_launcher_environment_can_select_libraries(self):
        for signal_value in (None, ""):
            with self.subTest(signal=signal_value):
                if signal_value is None:
                    os.environ.pop("WINSCOPE_ADB_LIBRARY_PATH", None)
                else:
                    os.environ["WINSCOPE_ADB_LIBRARY_PATH"] = signal_value
                base = {"WINSCOPE_ADB_LIBRARY_PATH": str(self.library),
                        "LD_LIBRARY_PATH": "/caller/lib"}
                environment = proxy.adb_process_environment(base)
                self.assertEqual(environment, base)
                self.assertIsNot(environment, base)

    def test_non_linux_environment_is_unchanged(self):
        for platform in ("darwin", "win32"):
            with self.subTest(platform=platform), mock.patch.object(proxy.sys, "platform", platform):
                self.assertEqual(proxy.adb_process_environment(), self.environment)

    def test_invalid_library_signals_are_ignored(self):
        for library in ("platform-tools/lib64", str(self.tools) + "/./lib64",
                        str(self.tools) + "/../platform-tools/lib64",
                        str(self.root / "other/lib64"), str(self.library) + ":/untrusted/lib",
                        str(self.library) + "/"):
            with self.subTest(library=library):
                os.environ["WINSCOPE_ADB_LIBRARY_PATH"] = library
                before = dict(os.environ)
                self.assertEqual(proxy.adb_process_environment(), before)
                self.assertEqual(dict(os.environ), before)

    def test_non_bundled_or_unnormalized_adb_is_not_eligible(self):
        for adb in ("adb", "platform-tools/adb", "/usr/bin/adb",
                    str(self.root / "adb"), str(self.tools / "other-adb"),
                    str(self.tools) + "/./adb"):
            with self.subTest(adb=adb):
                os.environ["WINSCOPE_ADB"] = adb
                before = dict(os.environ)
                self.assertEqual(proxy.adb_process_environment(), before)
        system_tools = self.root / "system-bin"
        system_tools.mkdir()
        (system_tools / "adb").write_bytes(b"system adb")
        (system_tools / "lib64").mkdir()
        os.environ.update(WINSCOPE_ADB=str(system_tools / "adb"),
                          WINSCOPE_ADB_LIBRARY_PATH=str(system_tools / "lib64"))
        self.assertEqual(proxy.adb_process_environment(), dict(os.environ))

    def test_library_must_be_a_real_directory(self):
        self.library.rmdir()
        before = dict(os.environ)
        self.assertEqual(proxy.adb_process_environment(), before)
        self.library.write_bytes(b"not a directory")
        self.assertEqual(proxy.adb_process_environment(), before)
        self.library.unlink()
        target = self.root / "libraries"
        target.mkdir()
        try:
            self.library.symlink_to(target, target_is_directory=True)
        except OSError as error:
            self.skipTest(f"symlinks unavailable: {error}")
        self.assertEqual(proxy.adb_process_environment(), before)
        target.rmdir()
        self.assertEqual(proxy.adb_process_environment(), before)

    def test_adb_must_be_a_regular_file(self):
        before = dict(os.environ)
        self.adb.unlink()
        self.assertEqual(proxy.adb_process_environment(), before)
        self.adb.mkdir()
        self.assertEqual(proxy.adb_process_environment(), before)
        self.adb.rmdir()
        target = self.root / "system-adb"
        target.write_bytes(b"not the bundled executable")
        try:
            self.adb.symlink_to(target)
        except OSError as error:
            self.skipTest(f"symlinks unavailable: {error}")
        self.assertEqual(proxy.adb_process_environment(), before)

    def test_both_helpers_apply_environment_before_source_or_managed_dispatch(self):
        for managed in (False, True):
            for helper, method, subprocess_method in ((proxy.run_adb_process, "run", "run"),
                                                     (proxy.start_adb_process, "start", "Popen")):
                for base in (None, {}, {"KEEP": "caller", "LD_LIBRARY_PATH": "/caller/_internal"}):
                    with self.subTest(managed=managed, method=method, base=base):
                        manager = mock.Mock() if managed else None
                        owner = manager if managed else proxy.subprocess
                        target = method if managed else subprocess_method
                        before = None if base is None else dict(base)
                        command = [str(self.adb), "devices"]
                        kwargs = {"stdout": subprocess.PIPE}
                        if method == "run":
                            kwargs.update(timeout=3, check=False)
                        if base is not None:
                            kwargs["env"] = base
                        with mock.patch.object(proxy, "adb_processes", manager):
                            with mock.patch.object(owner, target) as dispatch:
                                self.assertIs(helper(command, **kwargs), dispatch.return_value)
                        expected = dict(self.environment if base is None else before,
                                        LD_LIBRARY_PATH=str(self.library))
                        dispatch.assert_called_once_with(command, **dict(kwargs, env=expected))
                        self.assertEqual(base, before)
                        self.assertEqual(dict(os.environ), self.environment)

    def test_non_adb_commands_keep_their_environment_and_dispatch(self):
        for managed in (False, True):
            for helper, method, subprocess_method in ((proxy.run_adb_process, "run", "run"),
                                                     (proxy.start_adb_process, "start", "Popen")):
                for command in ([sys.executable, "-c", "pass"], ["adb", "devices"], [], str(self.adb)):
                    for base in (None, {"LD_LIBRARY_PATH": "/other/lib"}):
                        with self.subTest(managed=managed, method=method, command=command, base=base):
                            manager = mock.Mock() if managed else None
                            owner = manager if managed else proxy.subprocess
                            target = method if managed else subprocess_method
                            kwargs = {} if base is None else {"env": base}
                            with mock.patch.object(proxy, "adb_processes", manager):
                                with mock.patch.object(owner, target) as dispatch:
                                    helper(command, **kwargs)
                            dispatch.assert_called_once_with(command, **kwargs)
                            if base is not None:
                                self.assertIs(dispatch.call_args.kwargs["env"], base)


class DesktopCaptureShutdownTest(unittest.TestCase):
    def wait_for(self, predicate, timeout=3):
        deadline = time.monotonic() + timeout
        while time.monotonic() < deadline:
            value = predicate()
            if value:
                return value
            time.sleep(0.01)
        self.fail("timed out waiting for capture test evidence")

    def manager(self):
        manager = proxy.OwnedAdbProcesses(threading.Event())
        self.addCleanup(manager.shutdown)
        return manager

    def launch(self, arguments=ARGUMENTS, bootstrap=False, env=None):
        command = [sys.executable]
        if bootstrap:
            command += ["-c", BOOTSTRAP]
        command += [str(PROXY), *arguments]
        child = subprocess.Popen(command, stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                                 stderr=subprocess.PIPE, env=env)

        def cleanup():
            child.stdin.close()
            try:
                child.wait(timeout=5)
            except subprocess.TimeoutExpired:
                child.kill()
                child.wait()
            child.stdout.close()
            child.stderr.close()

        self.addCleanup(cleanup)
        return child

    def ready_port(self, child):
        ready = queue.Queue()
        threading.Thread(target=lambda: ready.put(child.stdout.readline()), daemon=True).start()
        line = ready.get(timeout=4)
        fields = line.decode().split()
        self.assertTrue(fields, "capture exited without READY")
        self.assertEqual(fields[0], "READY", line)
        self.assertEqual(len(fields), 2)
        return int(fields[1])

    def assert_port_closed(self, port):
        with socket.socket() as connection:
            connection.settimeout(0.5)
            self.assertNotEqual(connection.connect_ex(("127.0.0.1", port)), 0)

    def test_parent_pipe_data_is_not_shutdown_but_eof_is(self):
        reader, writer = os.pipe()
        stream = os.fdopen(reader, "rb", buffering=0)
        self.addCleanup(stream.close)
        stopping = threading.Event()
        thread = threading.Thread(target=proxy.watch_parent_pipe,
                                  args=(stream, stopping), daemon=True)
        thread.start()
        try:
            os.write(writer, b"still owned")
            self.assertFalse(stopping.wait(0.1))
        finally:
            os.close(writer)
        self.assertTrue(stopping.wait(1))
        thread.join(1)
        self.assertFalse(thread.is_alive())

    def test_plain_entry_point_preserves_ready_and_closes_port_on_eof(self):
        child = self.launch()
        port = self.ready_port(child)
        child.stdin.close()
        self.assertEqual(child.wait(timeout=4), 0, child.stderr.read().decode())
        self.assert_port_closed(port)

    def test_eof_before_ready_exits_without_hanging(self):
        child = self.launch()
        child.stdin.close()
        self.assertEqual(child.wait(timeout=4), 0, child.stderr.read().decode())
        line = child.stdout.read().decode().strip()
        if line:
            self.assertTrue(line.startswith("READY "), line)
            self.assert_port_closed(int(line.split()[1]))

    def test_eof_does_not_wait_for_an_incomplete_http_request(self):
        child = self.launch()
        port = self.ready_port(child)
        with socket.create_connection(("127.0.0.1", port), timeout=1) as connection:
            connection.sendall(b"GET /devices HTTP/1.1\r\n")
            child.stdin.close()
            self.assertEqual(child.wait(timeout=4), 0, child.stderr.read().decode())
        self.assert_port_closed(port)

    def test_legacy_entry_point_does_not_watch_stdin_without_flag(self):
        child = self.launch(ARGUMENTS[:-1])
        port = self.ready_port(child)
        child.stdin.close()
        self.assert_port_open(port)
        child.terminate()
        status = child.wait(timeout=4)
        if os.name == "posix":
            self.assertEqual(status, 0)
        self.assert_port_closed(port)

    def assert_port_open(self, port):
        with socket.create_connection(("127.0.0.1", port), timeout=1):
            pass

    def test_shutdown_rejects_new_commands_including_fetch_and_trace(self):
        manager = self.manager()
        manager.shutdown()
        with mock.patch.object(proxy, "adb_processes", manager):
            with mock.patch.object(proxy.subprocess, "Popen") as popen:
                with self.assertRaisesRegex(proxy.AdbError, "shutting down"):
                    proxy.call_adb(["devices", "-l"])
                with self.assertRaisesRegex(proxy.AdbError, "shutting down"):
                    proxy.FetchEndpoint().fetch_existing_file("/capture", "serial")
                with self.assertRaisesRegex(proxy.AdbError, "shutting down"):
                    proxy.TraceThread("target", "serial", "echo capture", "/status")
                popen.assert_not_called()

    def test_managed_timeout_reaps_and_preserves_run_diagnostics(self):
        manager = self.manager()
        code = "import sys,time; print('partial', flush=True); sys.stderr.write('failure\\n'); sys.stderr.flush(); time.sleep(60)"
        with self.assertRaises(subprocess.TimeoutExpired) as raised:
            manager.run([sys.executable, "-c", code], stdout=subprocess.PIPE,
                        stderr=subprocess.PIPE, timeout=1)
        self.assertEqual(raised.exception.output, b"partial\n")
        self.assertEqual(raised.exception.stderr, b"failure\n")
        self.assertFalse(manager._processes)

    def test_managed_run_preserves_exit_status_and_binary_output(self):
        manager = self.manager()
        completed = manager.run(
            [sys.executable, "-c", "import sys; sys.stdout.buffer.write(b'\\x00\\xff'); sys.exit(7)"],
            stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=3, check=False)
        self.assertEqual(completed.returncode, 7)
        self.assertEqual(completed.stdout, b"\x00\xff")
        self.assertFalse(manager._processes)

    def test_registration_racing_shutdown_cannot_escape_ownership(self):
        manager = self.manager()
        entered, release = threading.Event(), threading.Event()
        process = mock.Mock()
        process.poll.side_effect = [None, 0, 0]

        def start(*args, **kwargs):
            entered.set()
            self.assertTrue(release.wait(2))
            return process

        with mock.patch.object(proxy.subprocess, "Popen", side_effect=start):
            with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
                launch = pool.submit(manager.start, ["adb"])
                self.assertTrue(entered.wait(1))
                shutdown = pool.submit(manager.shutdown)
                self.assertTrue(manager.stopping.wait(1))
                release.set()
                self.assertIs(launch.result(timeout=2), process)
                shutdown.result(timeout=2)
        process.terminate.assert_called_once()
        process.wait.assert_called()
        self.assertFalse(manager._processes)

    def test_startup_failure_still_shuts_down_owned_processes(self):
        manager = self.manager()
        with tempfile.TemporaryDirectory() as directory:
            pid = Path(directory) / "pid"
            process = manager.start([sys.executable, "-c", SLEEPER, str(pid)],
                                    stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            self.wait_for(lambda: pid.exists() and pid.read_text())
            with mock.patch.object(proxy, "OwnedAdbProcesses", return_value=manager):
                with mock.patch.object(proxy, "HTTPServer", side_effect=OSError("bind failed")):
                    with mock.patch.object(proxy, "adb_processes", None):
                        with self.assertRaisesRegex(OSError, "bind failed"):
                            proxy.main(ARGUMENTS[:-1])
            self.assertIsNotNone(process.returncode)
            self.assertFalse(manager._processes)
        self.assertTrue(manager.stopping.is_set())

    def test_bind_failure_exits_even_while_parent_pipe_is_open(self):
        with socket.socket() as listener:
            listener.bind(("127.0.0.1", 0))
            listener.listen()
            port = listener.getsockname()[1]
            child = self.launch([*ARGUMENTS, "--port", str(port)])
            self.assertNotEqual(child.wait(timeout=4), 0)
            self.assertNotIn(b"_enter_buffered_busy", child.stderr.read())

    def test_owned_children_share_one_bounded_shutdown_grace(self):
        manager = self.manager()
        with tempfile.TemporaryDirectory() as directory:
            children = []
            for index in range(4):
                pid = Path(directory) / str(index)
                children.append(manager.start([sys.executable, "-c", SLEEPER, str(pid)],
                                              stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL))
                self.wait_for(lambda: pid.exists() and pid.read_text())
            started = time.monotonic()
            manager.shutdown()
            self.assertLess(time.monotonic() - started, 2)
            self.assertTrue(all(child.returncode is not None for child in children))
            self.assertFalse(manager._processes)

    def test_eof_during_server_construction_closes_server_without_serving(self):
        class ParentReader:
            def read(self, size):
                allow_eof.wait(2)
                return b""

        allow_eof = threading.Event()
        httpd = mock.Mock()

        def create_server(*args):
            allow_eof.set()
            self.assertTrue(proxy.adb_processes.stopping.wait(2))
            return httpd

        with mock.patch.object(proxy, "HTTPServer", side_effect=create_server):
            with mock.patch.object(proxy, "adb_processes", None):
                proxy.main(ARGUMENTS, parent_reader=ParentReader())
        httpd.server_close.assert_called_once()
        httpd.serve_forever.assert_not_called()
        httpd.shutdown.assert_not_called()

    def test_real_request_children_ignore_sigterm_then_are_reaped_on_owned_eof(self):
        for endpoint in ("devices", "fetch", "trace"):
            with self.subTest(endpoint=endpoint), tempfile.TemporaryDirectory() as directory:
                pid_path = Path(directory) / "adb.pid"
                reaped_path = Path(directory) / "reaped.json"
                env = dict(os.environ, TEST_SLEEPER=SLEEPER,
                           TEST_CHILD_PID=str(pid_path), TEST_REAPED=str(reaped_path))
                unrelated = subprocess.Popen([sys.executable, "-c", "import time; time.sleep(60)"])
                child = None
                try:
                    child = self.launch(bootstrap=True, env=env)
                    port = self.ready_port(child)
                    errors = []

                    def request():
                        connection = http.client.HTTPConnection("127.0.0.1", port, timeout=5)
                        headers = {"Host": "127.0.0.1:43210", "Origin": ORIGIN,
                                   proxy.WINSCOPE_TOKEN_HEADER: TOKEN, "Content-Type": "application/json"}
                        try:
                            if endpoint == "trace":
                                body = json.dumps({"targetId": "ScreenRecording", "startCmd": "echo start", "stopCmd": "echo stop"})
                                connection.request("POST", "/starttrace/serial", body, headers)
                            else:
                                path = "/devices" if endpoint == "devices" else "/fetch/serial/data/local/tmp/last_winscope_tracing_session/capture"
                                connection.request("GET", path, headers=headers)
                            connection.getresponse().read()
                        except (OSError, http.client.HTTPException) as error:
                            errors.append(error)
                        finally:
                            connection.close()

                    request_thread = threading.Thread(target=request, daemon=True)
                    request_thread.start()
                    self.wait_for(lambda: pid_path.exists() and pid_path.read_text())
                    started = time.monotonic()
                    child.stdin.close()
                    self.assertEqual(child.wait(timeout=4), 0, child.stderr.read().decode())
                    self.assertLess(time.monotonic() - started, 4)
                    request_thread.join(2)
                    self.assertFalse(request_thread.is_alive(), errors)
                    self.assert_port_closed(port)
                    results = json.loads(reaped_path.read_text())
                    self.assertEqual(len(results), 1, results)
                    self.assertTrue(results[0]["reaped"], results)
                    if os.name == "posix":
                        self.assertEqual(results[0]["returncode"], -signal.SIGKILL)
                    self.assertIsNone(unrelated.poll(), "shutdown affected an unrelated process")
                finally:
                    if child is not None:
                        child.stdin.close()
                        try:
                            child.wait(timeout=5)
                        except subprocess.TimeoutExpired:
                            child.kill()
                            child.wait()
                        if not reaped_path.exists() and pid_path.exists() and pid_path.read_text():
                            try:
                                os.kill(int(pid_path.read_text()), signal.SIGTERM if os.name == "nt" else signal.SIGKILL)
                            except ProcessLookupError:
                                pass
                    unrelated.kill()
                    unrelated.wait()


if __name__ == "__main__":
    unittest.main()
