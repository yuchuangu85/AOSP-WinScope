#!/usr/bin/env python3
"""Build and start the host WinScope launcher from a source checkout."""

from __future__ import annotations

import os
import shutil
import signal
import subprocess
import sys
from pathlib import Path

import build
import dependencies
import release


ROOT = Path(__file__).resolve().parents[1]


def run_build(command: list[str], environment: dict[str, str]) -> None:
    group = (
        {"creationflags": subprocess.CREATE_NEW_PROCESS_GROUP}
        if sys.platform == "win32"
        else {"start_new_session": True}
    )
    process = subprocess.Popen(command, cwd=ROOT, env=environment, **group)

    def interrupted(signum: int, _frame: object) -> None:
        raise SystemExit(128 + signum)

    previous_handlers = {}
    try:
        for signum in (signal.SIGINT, signal.SIGTERM):
            previous_handlers[signum] = signal.signal(signum, interrupted)
        while True:
            try:
                status = process.wait(timeout=0.2)
                break
            except subprocess.TimeoutExpired:
                continue
        if status:
            raise subprocess.CalledProcessError(status, command)
    except BaseException:
        # Builds can spawn npm, compilers, and workers; stop the owned group.
        if sys.platform == "win32":
            if process.poll() is None:
                subprocess.run(["taskkill", "/PID", str(process.pid), "/T", "/F"], check=False)
        else:
            try:
                os.killpg(process.pid, signal.SIGTERM)
            except ProcessLookupError:
                pass
        try:
            process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            if sys.platform == "win32":
                process.kill()
            else:
                os.killpg(process.pid, signal.SIGKILL)
            process.wait()
        raise
    finally:
        for signum, handler in previous_handlers.items():
            signal.signal(signum, handler)


def build_web(npm: str, environment: dict[str, str]) -> None:
    try:
        artifacts = build.recorded_artifacts()
        build.verify_outputs(artifacts)
    except (dependencies.DependencyError, OSError, ValueError) as error:
        print(f"Cannot reuse production outputs: {error}. Running build:prod.", file=sys.stderr)
        run_build([npm, "run", "build:prod"], environment)
        build.verify_outputs()
        return

    for target in ("build:protos", "build:app"):
        run_build([npm, "run", target], environment)
    build.verify_outputs(artifacts)


def build_launcher(go: str, environment: dict[str, str]) -> Path:
    host = subprocess.run(
        [go, "env", "GOHOSTOS", "GOHOSTARCH"],
        cwd=ROOT, env=environment, check=True, capture_output=True, text=True,
    )
    host_os, host_arch = host.stdout.split()
    runtime_root = ROOT / "dist/local"
    if runtime_root.exists():
        shutil.rmtree(runtime_root)
    runtime_root.mkdir(parents=True)
    release.copy_files(build.WEB_OUTPUT, runtime_root / "web")
    proxy = runtime_root / "proxy/winscope_proxy.py"
    proxy.parent.mkdir()
    shutil.copyfile(release.DEFAULT_PROXY, proxy)
    release.create_web_manifest(runtime_root)

    launcher = runtime_root / ("winscope-launcher.exe" if host_os == "windows" else "winscope-launcher")
    run_build(
        [go, "build", "-trimpath", "-o", str(launcher), "./cmd/launcher"],
        environment | {"CGO_ENABLED": "0", "GOOS": host_os, "GOARCH": host_arch},
    )
    return launcher


def launch(launcher: Path, arguments: list[str], environment: dict[str, str]) -> int:
    command = [str(launcher), *arguments]
    sys.stdout.flush()
    sys.stderr.flush()
    if sys.platform != "win32":
        os.execve(command[0], command, environment)
        return 0

    # A separate Windows process group permits graceful console-signal forwarding.
    process = subprocess.Popen(
        command, env=environment, creationflags=subprocess.CREATE_NEW_PROCESS_GROUP,
    )

    def forward_signal(_signum: int, _frame: object) -> None:
        if process.poll() is None:
            process.send_signal(signal.CTRL_BREAK_EVENT)

    previous_handlers = {}
    try:
        for signum in {signal.SIGINT, signal.SIGTERM, signal.SIGBREAK}:
            previous_handlers[signum] = signal.signal(signum, forward_signal)
        while True:
            try:
                return process.wait(timeout=0.2)
            except subprocess.TimeoutExpired:
                continue
    finally:
        for signum, handler in previous_handlers.items():
            signal.signal(signum, handler)


def main(arguments: list[str] | None = None) -> int:
    try:
        dependencies.reexec_with_supported_python()
        environment, toolchain = build.build_environment()
        build_web(toolchain["commands"]["npm"], environment)
        launcher = build_launcher(toolchain["commands"]["go"], environment)
        return launch(launcher, sys.argv[1:] if arguments is None else arguments, environment)
    except subprocess.CalledProcessError as error:
        print(f"Startup command failed: {error}", file=sys.stderr)
        return error.returncode if error.returncode > 0 else 128 - error.returncode
    except (dependencies.DependencyError, OSError, ValueError) as error:
        print(f"Cannot start WinScope: {error}", file=sys.stderr)
        return 1
    except KeyboardInterrupt:
        return 130


if __name__ == "__main__":
    raise SystemExit(main())
