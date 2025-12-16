#!/usr/bin/env python3
import subprocess
import time
import os

# ------------------------
# 配置部分
# ------------------------
CONFIG_SRC = "perfetto_config.pbtx"
CONFIG_DST = "/data/misc/perfetto-traces/perfetto_config.pbtx"
TRACE_DST = "/data/misc/perfetto-traces/trace1.perfetto-trace"
VIDEO_DST = "/data/local/tmp/screen.mp4"

RESULT_DIR = "result"
LOCAL_TRACE = os.path.join(RESULT_DIR, "trace.perfetto-trace")
LOCAL_VIDEO = os.path.join(RESULT_DIR, "screen.mp4")

DEVICE_ID = None
DURATION = 10
ENABLE_VIDEO = True


def adb(cmd):
    full = ["adb"]
    if DEVICE_ID:
        full += ["-s", DEVICE_ID]
    full += cmd.split(" ")
    print("ADB:", " ".join(full))
    return subprocess.check_output(full, stderr=subprocess.STDOUT).decode()


def adb_no_output(cmd):
    full = ["adb"]
    if DEVICE_ID:
        full += ["-s", DEVICE_ID]
    full += cmd.split(" ")
    print("ADB:", " ".join(full))
    subprocess.run(full)


def main():

    print("===== 创建 result 文件夹 =====")
    if not os.path.exists(RESULT_DIR):
        os.makedirs(RESULT_DIR)
        print("已创建 result/")
    else:
        print("result/ 已存在")

    print("===== 1. 推送 perfetto 配置文件 =====")
    adb(f"push {CONFIG_SRC} {CONFIG_DST}")

    print("===== 2. 清理旧 trace 文件 =====")
    # adb_no_output(f"shell su root rm -f {TRACE_DST}")

    if ENABLE_VIDEO:
        print("===== 3. 开始 screenrecord 视频录制 =====")
        adb_no_output(f"shell su root rm -f {VIDEO_DST}")
        adb_no_output(
            f"shell su root screenrecord --bugreport --bit-rate 8000000 "
            f"{VIDEO_DST} >/dev/null 2>&1 &"
        )

    print("===== 4. 开始 Perfetto 录制 ===============")
    adb_no_output(
        f"shell su root perfetto --txt --config {CONFIG_DST} "
        f"--out {TRACE_DST} &"
    )

    print(f"===== 5. 录制 {DURATION} 秒 =====")
    time.sleep(DURATION)

    print("===== 6. 停止 Perfetto ===============")
    # adb_no_output("shell su root pkill -l SIGINT perfetto")

    time.sleep(1.0)
    if ENABLE_VIDEO:
        print("===== 7. 停止 screenrecord =====")
        adb_no_output("shell su root pkill -l SIGINT screenrecord")

    time.sleep(1.0)

    print("===== 8. 拉取 Trace 到 result/ =====")
    adb(f"pull {TRACE_DST} {LOCAL_TRACE}")
    print("Trace 保存:", LOCAL_TRACE)

    if ENABLE_VIDEO:
        print("===== 9. 拉取视频到 result/ =====")
        adb(f"pull {VIDEO_DST} {LOCAL_VIDEO}")
        print("视频保存:", LOCAL_VIDEO)

    print("\n===== 全部完成（未自动打开文件） =====")


if __name__ == "__main__":
    main()