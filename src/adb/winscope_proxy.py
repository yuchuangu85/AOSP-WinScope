#!/usr/bin/env python3
"""Launcher-managed, loopback-only ADB proxy for Winscope.

This process is deliberately not a browser-facing server. The standalone Go
launcher creates one process for one capture session, authenticates to it with
a fresh in-memory secret, and reverse-proxies the browser's exact same-origin
requests. Running this script directly requires an explicit allowed origin and
one-time token; it never creates or persists credentials.
"""

# Copyright (C) 2019 The Android Open Source Project
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import abc
import argparse
import base64
import enum
import gzip
import hmac
import http
from http import server
import json
import logging
import os
import re
import signal
import subprocess
import sys
import threading
import time
from urllib import parse

INFO = logging.INFO
DEBUG = logging.DEBUG
HTTPServer = server.ThreadingHTTPServer
BaseHTTPRequestHandler = server.BaseHTTPRequestHandler
HTTPStatus = http.HTTPStatus
Enum = enum.Enum
abstractmethod = abc.abstractmethod
version = sys.version_info
assert version.major == 3 and version.minor >= 10, "This script requires Python 3.10+"

log = logging.getLogger("ADBProxy")
secret_token = ""
allowed_origin = ""
allowed_host = ""

# Keep in sync with VERSION in src/trace_collection/winscope_proxy/utils.ts
VERSION = "6.0.5"
WINSCOPE_VERSION_HEADER = "Winscope-Proxy-Version"
WINSCOPE_TOKEN_HEADER = "Winscope-Token"

SIGNAL_HANDLER_LOG = "/data/local/tmp/winscope_signal_handler.log"
WINSCOPE_STATUS = "/data/local/tmp/winscope_status"
KEEP_ALIVE_INTERVAL_S = 5
COMMAND_TIMEOUT_S = 15
MAX_REQUEST_BYTES = 1 << 20
MAX_COMMAND_BYTES = 64 << 10
MAX_FETCH_BYTES = 128 << 20
MAX_ADB_DIAGNOSTIC_CHARS = 2048
DEVICE_ID_RE = re.compile(r"[A-Za-z0-9._:/\\-]+")
TARGET_ID_RE = re.compile(r"[A-Za-z0-9._-]{1,128}")
OPTIONAL_ADB_SHELL_COMMANDS = frozenset({
  "cmd protolog_configuration groups list",
  "dumpsys SurfaceFlinger --display-id",
  "screenrecord --help",
  "screenrecord --version",
  "service check Wayland",
})


def create_argument_parser() -> argparse.ArgumentParser:
  """Creates the launcher-only process argument parser."""
  parser = argparse.ArgumentParser(description="Launcher-managed Winscope ADB proxy")
  parser.add_argument("--info", "-i", dest="loglevel", action="store_const", const=INFO)
  parser.add_argument("--port", "-p", type=int, default=0)
  parser.add_argument("--token", required=True, help="ephemeral launcher session secret")
  parser.add_argument(
      "--allowed-origin", required=True, help="exact loopback origin served by the launcher"
  )
  parser.set_defaults(loglevel=DEBUG)
  return parser


def validate_launcher_config(args: argparse.Namespace) -> tuple[str, str]:
  """Rejects direct/non-loopback and malformed launcher settings."""
  if args.port < 0 or args.port > 65535:
    raise ValueError("port must be between 0 and 65535")
  if not re.fullmatch(r"[0-9a-fA-F]{64}", args.token):
    raise ValueError("token must be a 32-byte hexadecimal session secret")
  parsed = parse.urlsplit(args.allowed_origin)
  if (
      parsed.scheme != "http"
      or parsed.hostname != "127.0.0.1"
      or parsed.port is None
      or parsed.path not in ("", "/")
      or parsed.query
      or parsed.fragment
  ):
    raise ValueError("allowed origin must be an exact 127.0.0.1 HTTP origin")
  return args.allowed_origin.rstrip("/"), parsed.netloc


class RequestType(Enum):
  GET = 1
  POST = 2
  HEAD = 3


class RequestEndpoint:
  @abstractmethod
  def process(self, http_server, path: list[str]):
    pass


class AdbError(Exception):
  """Unsuccessful ADB operation."""


class BadRequestError(Exception):
  """Invalid client request."""


class RequestRouter:
  """Authenticates one launcher session and routes its bounded API."""

  def __init__(self, handler):
    self.request = handler
    self.endpoints = {}

  def register_endpoint(self, method: RequestType, name: str, endpoint: RequestEndpoint):
    self.endpoints[(method, name)] = endpoint

  def _bad_request(self, error: str):
    log.warning("Rejected proxy request: %s", error)
    self.request.respond(HTTPStatus.BAD_REQUEST, error.encode("utf-8"), "text/plain; charset=utf-8")

  def _internal_error(self):
    log.exception("ADB proxy request failed")
    self.request.respond(
        HTTPStatus.INTERNAL_SERVER_ERROR,
        b"ADB proxy request failed",
        "text/plain; charset=utf-8",
    )

  def _bad_token(self):
    log.warning("Rejected proxy request with an invalid session credential")
    self.request.respond(
        HTTPStatus.FORBIDDEN,
        b"Capture session is not authorized",
        "text/plain; charset=utf-8",
    )

  def process(self, method: RequestType):
    token = self.request.headers.get(WINSCOPE_TOKEN_HEADER, "")
    if not hmac.compare_digest(token, secret_token):
      self._bad_token()
      return
    try:
      path = parse_request_path(self.request.path)
      endpoint_name = path[0]
      endpoint = self.endpoints[(method, endpoint_name)]
      endpoint.process(self.request, path[1:])
    except KeyError:
      self._bad_request("Unknown endpoint")
    except AdbError as error:
      message = safe_adb_diagnostic(str(error))
      log.warning("ADB command failed: %s", message)
      self.request.respond(
          HTTPStatus.BAD_GATEWAY,
          message.encode("utf-8"),
          "text/plain; charset=utf-8",
      )
    except BadRequestError as error:
      self._bad_request(str(error))
    except Exception:  # pylint: disable=broad-exception-caught
      self._internal_error()


def parse_request_path(raw_path: str) -> list[str]:
  parsed = parse.urlsplit(raw_path)
  if parsed.query or parsed.fragment or not parsed.path.startswith("/"):
    raise BadRequestError("Invalid request path")
  normalized = parsed.path.strip("/")
  if not normalized:
    raise BadRequestError("Invalid request path")
  parts = [parse.unquote(part) for part in normalized.split("/")]
  if any(
      not part
      or part in (".", "..")
      or "/" in part
      or "\\" in part
      for part in parts
  ):
    raise BadRequestError("Invalid request path")
  return parts


def valid_device_id(value: str) -> bool:
  return bool(DEVICE_ID_RE.fullmatch(value))


def adb_executable() -> str:
  """Returns the launcher-selected ADB executable as one process argument."""
  return os.environ.get("WINSCOPE_ADB", "adb")


def safe_adb_diagnostic(output: bytes | str | None) -> str:
  """Returns a bounded, single-line ADB diagnostic safe for the local UI."""
  if isinstance(output, bytes):
    text = output.decode("utf-8", errors="replace")
  else:
    text = output or ""
  text = re.sub(r"\x1b\[[0-?]*[ -/]*[@-~]", "", text)
  text = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]", " ", text)
  if secret_token:
    text = text.replace(secret_token, "<redacted>")
  text = " ".join(text.split())
  if not text:
    return "no diagnostic output"
  if len(text) > MAX_ADB_DIAGNOSTIC_CHARS:
    return text[: MAX_ADB_DIAGNOSTIC_CHARS - 3] + "..."
  return text


def call_adb(
    args: list[str],
    device: str | None = None,
    timeout: int = COMMAND_TIMEOUT_S,
    operation: str = "command",
) -> str:
  """Executes ADB with an argument vector, never a shell command string."""
  if device is not None and not valid_device_id(device):
    raise BadRequestError("Invalid device id")
  command = [adb_executable()] + (["-s", device] if device else []) + args
  try:
    completed = subprocess.run(
        command,
        check=False,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        timeout=timeout,
    )
  except OSError as error:
    raise AdbError(
        f"ADB {operation} could not be started: {safe_adb_diagnostic(str(error))}"
    ) from error
  except subprocess.TimeoutExpired as error:
    diagnostic = safe_adb_diagnostic(error.output)
    raise AdbError(
        f"ADB {operation} timed out after {timeout}s: {diagnostic}"
    ) from error
  output = completed.stdout.decode("utf-8", errors="replace")
  output = output.replace("\r\n", "\n").replace("\r", "\n")
  if completed.returncode:
    raise AdbError(
        f"ADB {operation} failed with status {completed.returncode}: "
        f"{safe_adb_diagnostic(output)}"
    )
  return output


def shell_operation(command: str) -> str:
  if command == "cmd protolog_configuration groups list":
    return "ProtoLog capability probe"
  if command.startswith("screenrecord --"):
    return "screen recording capability probe"
  if command == "dumpsys SurfaceFlinger --display-id":
    return "display capability query"
  if command == "perfetto --query":
    return "Perfetto capability query"
  if command == "service check Wayland":
    return "Wayland capability probe"
  if command.startswith("cat " + WINSCOPE_STATUS):
    return "trace status read"
  if command.startswith("rm " + WINSCOPE_STATUS):
    return "trace status cleanup"
  if command.startswith("if command -v su "):
    return "root capability probe"
  return "device shell command"


def call_adb_shell(command: str, device: str) -> str:
  command = normalize_shell_command(command)
  # The remote Android shell intentionally receives one argument. Host process
  # execution remains an argument vector regardless of shell syntax in Android
  # trace commands.
  return call_adb(
      ["shell", command],
      device,
      operation=shell_operation(command),
  )


def call_optional_adb_shell(command: str, device: str) -> str:
  try:
    return call_adb_shell(command, device)
  except AdbError:
    if command in OPTIONAL_ADB_SHELL_COMMANDS:
      log.info("Optional ADB capability is unavailable; continuing without it: %s", command)
      return ""
    raise


def normalize_shell_command(command: str) -> str:
  if not isinstance(command, str) or not command:
    raise BadRequestError("Missing shell command")
  command = command.replace("\r\n", "\n").replace("\r", "\n")
  encoded = command.encode("utf-8")
  if len(encoded) > MAX_COMMAND_BYTES:
    raise BadRequestError("Shell command exceeds the size limit")
  if "\x00" in command or any(ord(char) < 32 and char not in "\n\t" for char in command):
    raise BadRequestError("Shell command contains unsupported control characters")
  return command


def validate_shell_command(command: str):
  normalize_shell_command(command)


class ListDevicesEndpoint(RequestEndpoint):
  ADB_INFO_RE = re.compile(r"^([A-Za-z0-9._:/\\-]+)\s+(\w+)(.*model:(\w+))?")

  def process(self, http_server, path: list[str]):
    if path:
      raise BadRequestError("Invalid devices path")
    lines = list(filter(None, call_adb(["devices", "-l"], operation="device discovery").splitlines()))
    devices = []
    for match in [self.ADB_INFO_RE.match(device) for device in lines[1:]]:
      if match:
        devices.append(
            {
                "id": match.group(1),
                "authorized": match.group(2) != "unauthorized",
                "model": match.group(4).replace("_", " ") if match.group(4) else "",
            }
        )
    http_server.respond(
        HTTPStatus.OK,
        json.dumps(devices).encode("utf-8"),
        "application/json; charset=utf-8",
    )


class DeviceRequestEndpoint(RequestEndpoint):
  def process(self, http_server, path: list[str]):
    if not path or not valid_device_id(path[0]):
      raise BadRequestError("Device id not specified")
    self.process_with_device(http_server, path[1:], path[0])

  @abstractmethod
  def process_with_device(self, http_server, path: list[str], device_id: str):
    pass

  def get_request(self, http_server) -> dict[str, str]:
    content_type = http_server.headers.get("Content-Type", "")
    if not content_type.lower().startswith("application/json"):
      raise BadRequestError("Request must use application/json")
    try:
      length = int(http_server.headers["Content-Length"])
    except (KeyError, ValueError) as error:
      raise BadRequestError("Missing or invalid Content-Length") from error
    if length < 1 or length > MAX_REQUEST_BYTES:
      raise BadRequestError("Request exceeds the size limit")
    try:
      value = json.loads(http_server.rfile.read(length).decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError) as error:
      raise BadRequestError("Malformed JSON request") from error
    if not isinstance(value, dict):
      raise BadRequestError("JSON request must be an object")
    return value


class FetchEndpoint(DeviceRequestEndpoint):
  BACKUP_DIRECTORY = "/data/local/tmp/last_winscope_tracing_session/"

  def process_with_device(self, http_server, path: list[str], device_id: str):
    if not path:
      raise BadRequestError("File path not specified")
    filepath = "/" + "/".join(path)
    if (
        not filepath.startswith(self.BACKUP_DIRECTORY)
        or ".." in path
        or any(not segment for segment in path)
    ):
      raise BadRequestError("Requested file is outside the recovery capture directory")
    file_buffer = self.fetch_existing_file(filepath, device_id)
    http_server.respond(
        HTTPStatus.OK,
        json.dumps(file_buffer).encode("utf-8"),
        "application/json; charset=utf-8",
    )

  def fetch_existing_file(self, filepath: str, device_id: str):
    command = [adb_executable(), "-s", device_id, "exec-out", "cat", filepath]
    try:
      completed = subprocess.run(
          command,
          check=False,
          stdout=subprocess.PIPE,
          stderr=subprocess.PIPE,
          timeout=COMMAND_TIMEOUT_S,
      )
    except OSError as error:
      raise AdbError(
          f"ADB capture file fetch could not be started: {safe_adb_diagnostic(str(error))}"
      ) from error
    except subprocess.TimeoutExpired as error:
      raise AdbError(
          f"ADB capture file fetch timed out after {COMMAND_TIMEOUT_S}s: "
          f"{safe_adb_diagnostic(error.stderr)}"
      ) from error
    if completed.returncode:
      raise AdbError(
          f"ADB capture file fetch failed with status {completed.returncode}: "
          f"{safe_adb_diagnostic(completed.stderr)}"
      )
    if len(completed.stdout) > MAX_FETCH_BYTES:
      raise BadRequestError("Capture file exceeds the size limit")
    return {filepath: base64.encodebytes(gzip.compress(completed.stdout)).decode("utf-8")}


class TraceThread(threading.Thread):
  def __init__(self, target_id: str, device_id: str, command: str, status_filename: str):
    self.trace_command = command
    self.target_id = target_id
    self.status_filename = status_filename
    self._device_id = device_id
    self._keep_alive_timer = None
    self.out = b""
    self.err = b""
    self._command_timed_out = False
    self._success = False
    self._failure_message = ""
    try:
      self.process = subprocess.Popen(
          [adb_executable(), "-s", self._device_id, "shell"],
          stdout=subprocess.PIPE,
          stderr=subprocess.PIPE,
          stdin=subprocess.PIPE,
          start_new_session=True,
      )
    except OSError as error:
      raise AdbError(
          "ADB trace shell could not be started: "
          + safe_adb_diagnostic(str(error))
      ) from error
    super().__init__()

  def timeout(self):
    if self.is_alive():
      log.warning("Capture keep-alive timed out for %s", self.target_id)
      self.end_trace()

  def reset_timer(self):
    if self._keep_alive_timer:
      self._keep_alive_timer.cancel()
    self._keep_alive_timer = threading.Timer(KEEP_ALIVE_INTERVAL_S, self.timeout)
    self._keep_alive_timer.start()

  def end_trace(self):
    if self._keep_alive_timer:
      self._keep_alive_timer.cancel()
    if self.process.poll() is None:
      self.process.send_signal(signal.SIGTERM)
      try:
        self.process.wait(timeout=COMMAND_TIMEOUT_S)
      except subprocess.TimeoutExpired:
        self.process.kill()
    if threading.current_thread() is not self:
      self.join()

  def run(self):
    self.reset_timer()
    self.out, self.err = self.process.communicate(self.trace_command.encode("utf-8"))
    status_error = ""
    for _ in range(int(COMMAND_TIMEOUT_S / 0.1)):
      try:
        status = call_adb_shell("cat " + self.status_filename, self._device_id)
      except AdbError as error:
        status_error = str(error)
        break
      if status == "TRACE_OK\n":
        self._success = self.target_id == "PerfettoTrace" or not self.err
        if not self._success:
          self._failure_message = (
              "ADB trace shell reported an error: "
              + safe_adb_diagnostic(self.err or self.out)
          )
        return
      if self.process.returncode is not None:
        break
      time.sleep(0.1)
    else:
      self._command_timed_out = True

    diagnostics = []
    shell_output = safe_adb_diagnostic(self.err or self.out)
    if shell_output != "no diagnostic output":
      diagnostics.append("trace shell output: " + shell_output)
    if status_error:
      diagnostics.append(status_error)
    if not diagnostics:
      diagnostics.append("trace shell exited before reporting TRACE_OK")
    self._failure_message = "; ".join(diagnostics)

  def success(self):
    return self._success

  def timed_out(self):
    return self._command_timed_out

  def failure(self):
    return self._failure_message


TRACE_THREADS: dict[str, dict[str, TraceThread]] = {}


class StartTraceEndpoint(DeviceRequestEndpoint):
  COMMAND = """
set -e

echo "TRACE_START" > {winscope_status}
function close_shell() {{
  echo "start" > {signal_handler_log}
  exec 1>>{signal_handler_log}
  exec 2>>{signal_handler_log}
  set -x
  trap - EXIT HUP INT
  {stop_commands}
  echo "TRACE_OK" > {winscope_status}
}}
trap close_shell EXIT HUP INT
{start_commands}
while true; do sleep 0.1; done
"""

  def process_with_device(self, http_server, path: list[str], device_id: str):
    if path:
      raise BadRequestError("Invalid starttrace path")
    request = self.get_request(http_server)
    target_id = request.get("targetId", "")
    start_cmd = request.get("startCmd", "")
    stop_cmd = request.get("stopCmd", "")
    if not isinstance(target_id, str) or not TARGET_ID_RE.fullmatch(target_id):
      raise BadRequestError("Invalid trace target")
    start_cmd = normalize_shell_command(start_cmd)
    if not isinstance(stop_cmd, str):
      raise BadRequestError("Invalid trace stop command")
    if stop_cmd:
      stop_cmd = normalize_shell_command(stop_cmd)
    status_filename = WINSCOPE_STATUS + "_" + target_id
    command = self.COMMAND.format(
        winscope_status=status_filename,
        signal_handler_log=SIGNAL_HANDLER_LOG,
        stop_commands=stop_cmd,
        start_commands=start_cmd,
    )
    thread = TraceThread(target_id, device_id, command, status_filename)
    TRACE_THREADS.setdefault(device_id, {})[target_id] = thread
    thread.start()
    http_server.respond(HTTPStatus.OK, b"", "application/json; charset=utf-8")


class EndTraceEndpoint(DeviceRequestEndpoint):
  def process_with_device(self, http_server, path: list[str], device_id: str):
    if path:
      raise BadRequestError("Invalid endtrace path")
    request = self.get_request(http_server)
    target_id = request.get("targetId", "")
    if not isinstance(target_id, str) or not TARGET_ID_RE.fullmatch(target_id):
      raise BadRequestError("Invalid trace target")
    threads = TRACE_THREADS.get(device_id, {})
    thread = threads.get(target_id)
    if thread is None:
      raise BadRequestError("No matching trace is in progress")
    if thread.is_alive():
      thread.end_trace()
    errors = []
    if thread.timed_out():
      errors.append("Trace timed out during cleanup")
    if thread.failure():
      errors.append(thread.failure())
    elif not thread.success():
      errors.append("Trace did not complete successfully")
    try:
      call_adb_shell("rm " + thread.status_filename, device_id)
    except AdbError as error:
      errors.append(str(error))
    threads.pop(target_id, None)
    if not threads:
      TRACE_THREADS.pop(device_id, None)
    http_server.respond(
        HTTPStatus.OK,
        json.dumps(errors).encode("utf-8"),
        "application/json; charset=utf-8",
    )


class StatusEndpoint(DeviceRequestEndpoint):
  def process_with_device(self, http_server, path: list[str], device_id: str):
    if len(path) != 1 or not TARGET_ID_RE.fullmatch(path[0]):
      raise BadRequestError("Invalid trace status path")
    thread = TRACE_THREADS.get(device_id, {}).get(path[0])
    if thread is None:
      raise BadRequestError("No matching trace is in progress")
    alive = thread.is_alive()
    if not alive and thread.failure():
      raise AdbError(thread.failure())
    if alive:
      thread.reset_timer()
    http_server.respond(HTTPStatus.OK, str(alive).encode("utf-8"), "text/plain; charset=utf-8")


class RunAdbCmdEndpoint(DeviceRequestEndpoint):
  def process_with_device(self, http_server, path: list[str], device_id: str):
    if path:
      raise BadRequestError("Invalid runadbcmd path")
    request = self.get_request(http_server)
    command = request.get("cmd", "")
    if not isinstance(command, str) or not command.startswith("shell "):
      raise BadRequestError("Only Android shell commands are supported")
    output = call_optional_adb_shell(command[6:], device_id)
    http_server.respond(
        HTTPStatus.OK,
        json.dumps(output).encode("utf-8"),
        "application/json; charset=utf-8",
    )


class ADBWinscopeProxy(BaseHTTPRequestHandler):
  """Strict private endpoint behind the launcher's same-origin proxy."""

  protocol_version = "HTTP/1.1"

  def __init__(self, request, client_address, http_server):
    self.router = RequestRouter(self)
    self.router.register_endpoint(RequestType.GET, "devices", ListDevicesEndpoint())
    self.router.register_endpoint(RequestType.GET, "status", StatusEndpoint())
    self.router.register_endpoint(RequestType.GET, "fetch", FetchEndpoint())
    self.router.register_endpoint(RequestType.POST, "runadbcmd", RunAdbCmdEndpoint())
    self.router.register_endpoint(RequestType.POST, "starttrace", StartTraceEndpoint())
    self.router.register_endpoint(RequestType.POST, "endtrace", EndTraceEndpoint())
    super().__init__(request, client_address, http_server)

  def _valid_request_origin(self) -> bool:
    return (
        self.headers.get("Origin") == allowed_origin
        and self.headers.get("Host") == allowed_host
        and self.client_address[0] == "127.0.0.1"
    )

  def respond(self, code: int, data: bytes, mime: str) -> None:
    self.send_response(code)
    self.send_header("Content-Type", mime)
    self.send_header("Content-Length", str(len(data)))
    self.send_header("Cache-Control", "no-store")
    self.send_header(WINSCOPE_VERSION_HEADER, VERSION)
    self.end_headers()
    if self.command != "HEAD":
      self.wfile.write(data)

  def _process(self, method: RequestType):
    if not self._valid_request_origin():
      self.respond(HTTPStatus.FORBIDDEN, b"Capture session origin is not authorized", "text/plain; charset=utf-8")
      return
    self.router.process(method)

  def do_GET(self):
    self._process(RequestType.GET)

  def do_POST(self):
    self._process(RequestType.POST)

  def do_HEAD(self):
    self._process(RequestType.HEAD)

  def do_OPTIONS(self):
    self.respond(HTTPStatus.METHOD_NOT_ALLOWED, b"Method not allowed", "text/plain; charset=utf-8")

  def log_request(self, code="-", size="-"):
    log.info("%s %s", self.command, code)


if __name__ == "__main__":
  args = create_argument_parser().parse_args()
  try:
    allowed_origin, allowed_host = validate_launcher_config(args)
  except ValueError as error:
    raise SystemExit(str(error)) from error
  secret_token = args.token
  logging.basicConfig(
      stream=sys.stderr,
      level=args.loglevel,
      format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
  )
  httpd = HTTPServer(("127.0.0.1", args.port), ADBWinscopeProxy)
  print("READY " + str(httpd.server_port), flush=True)
  try:
    httpd.serve_forever()
  except KeyboardInterrupt:
    pass
  finally:
    httpd.server_close()
