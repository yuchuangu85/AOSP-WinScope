#!/usr/bin/env python3
"""
Winscope Capture Tool (Final)
============================

Python3 版本的 AOSP winscope_proxy.py（定型版）
------------------------------------------------

目标：
- 行为 100% 对齐 AOSP tools/winscope/winscope_proxy.py
- 稳定、可维护、可团队共用
- 一条命令完成：Winscope Trace + 可选 Video

特性：
- perfetto --background + SIGINT 停止（官方推荐）
- screenrecord 生命周期与 trace 严格对齐
- 自动生成 Session 目录（含 metadata.json）
- 自动采集设备 Build 信息
- 目录结构可直接拖入 Winscope 使用

示例：
  python winscope_capture.py --duration 12 --video

输出：
  winscope_session_YYYYMMDD_HHMMSS/
    ├── trace.perfetto-trace
    ├── screen.mp4            (optional)
    └── metadata.json
"""

import argparse
import json
import subprocess
import sys
import time
from datetime import datetime
from pathlib import Path

# ========================
# AOSP-aligned constants
# ========================
PERFETTO_DIR = "/data/misc/perfetto-traces"
TMP_DIR = "/sdcard"
SESSION_PREFIX = "winscope_session"

# ========================
# adb helpers
# ========================


def run(cmd: list[str], *, check=True) -> str:
    """Run a host command synchronously and return stdout.

    Using an argument list avoids Windows shell quoting issues, and waiting for
    completion prevents the script from exiting before adb push/pull has
    actually produced local trace files.
    """
    print("$ " + " ".join(cmd))
    result = subprocess.run(
        cmd,
        check=False,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
    )
    if result.stdout:
        print(result.stdout, end="" if result.stdout.endswith("\n") else "\n")
    if check and result.returncode != 0:
        sys.exit(result.returncode)
    return result.stdout


def adb(*args: str, **kw) -> str:
    return run(["adb", *args], **kw)


def adb_shell(cmd: str, **kw) -> str:
    return adb("shell", cmd, **kw)


# ========================
# lifecycle control
# ========================

def start_perfetto(config_path: str, trace_path: str):
    adb_shell(
        f"perfetto --txt --config {config_path} --out {trace_path} "
        ">/dev/null 2>&1 &"
    )


def stop_perfetto():
    adb_shell("pkill -INT perfetto", check=False)


def start_screenrecord(video_path: str):
    adb_shell(f"screenrecord --bugreport {video_path} >/dev/null 2>&1 &")


def stop_screenrecord():
    adb_shell("pkill -INT screenrecord", check=False)


# ========================
# metadata
# ========================


def collect_metadata(duration: int, video: bool) -> dict:
    props = {}
    for key in [
        "ro.build.fingerprint",
        "ro.build.version.sdk",
        "ro.build.version.release",
        "ro.product.device",
    ]:
        props[key] = adb_shell(f"getprop {key}").strip()

    return {
        "timestamp": datetime.now().isoformat(),
        "duration_sec": duration,
        "video_enabled": video,
        "device": props,
    }


# ========================
# main flow
# ========================


def resolve_config_path(config: str) -> Path:
    config_path = Path(config)
    if config_path.is_file():
        return config_path

    # The Windows offline package ships this script under tools/ and renames
    # winscope.pbtx to perfetto_config.pbtx. Support double-click / no-arg use
    # from that layout while keeping the repo-root default unchanged.
    if config == "winscope.pbtx":
        for fallback in [
            Path(__file__).with_name("perfetto_config.pbtx"),
            Path("perfetto_config.pbtx"),
        ]:
            if fallback.is_file():
                return fallback

    print(
        f"[ERROR] Perfetto config not found: {config_path}",
        file=sys.stderr,
    )
    sys.exit(1)


def main():
    parser = argparse.ArgumentParser(
        description="Final AOSP-aligned Winscope capture tool"
    )
    parser.add_argument(
        "--config", default="winscope.pbtx", help="Perfetto pbtx config"
    )
    parser.add_argument(
        "--duration", type=int, default=10, help="Capture duration (seconds)"
    )
    parser.add_argument(
        "--video", action="store_true", help="Enable screen recording"
    )
    args = parser.parse_args()

    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    session_dir = Path(f"{SESSION_PREFIX}_{ts}")
    session_dir.mkdir(exist_ok=False)

    device_config = f"{PERFETTO_DIR}/winscope.pbtx"
    device_trace = f"{PERFETTO_DIR}/winscope.perfetto-trace"
    device_video = f"{TMP_DIR}/winscope.mp4"

    config_path = resolve_config_path(args.config)

    print("=== [1] push perfetto config ===")
    adb("push", str(config_path), device_config)

    print("=== [2] start perfetto (background) ===")
    start_perfetto(device_config, device_trace)

    if args.video:
        print("=== [3] start screenrecord ===")
        start_screenrecord(device_video)
    else:
        print("=== [3] screenrecord disabled ===")

    print(f"=== [4] capturing for {args.duration}s ===")
    time.sleep(args.duration)

    if args.video:
        print("=== [5] stop screenrecord ===")
        stop_screenrecord()
    else:
        print("=== [5] screenrecord was disabled ===")

    print("=== [6] stop perfetto ===")
    stop_perfetto()

    time.sleep(1)

    print("=== [7] pull trace ===")
    adb("pull", device_trace, str(session_dir / "trace.perfetto-trace"))

    if args.video:
        print("=== [8] pull video ===")
        adb("pull", device_video, str(session_dir / "screen.mp4"))
    else:
        print("=== [8] video was disabled ===")

    if args.duration:
        print("=== [9] write metadata ===")
        metadata = collect_metadata(args.duration, args.video)
        with open(session_dir / "metadata.json", "w", encoding="utf-8") as f:
            json.dump(metadata, f, indent=2)

    print("=== [10] cleanup device ===")
    # adb_shell(f"rm -f {device_config} {device_trace}")
    # if args.video:
    #     adb_shell(f"rm -f {device_video}")

    print("\n=== DONE ===")
    print(f"Session directory: {session_dir.resolve()}")
    print("Open trace with Winscope and load video if needed.")


if __name__ == "__main__":
    main()
