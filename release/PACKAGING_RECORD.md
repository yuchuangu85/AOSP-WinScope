# WinScope Release 打包记录

记录时间：2026-05-19 20:33:00 CST  
仓库路径：`/Users/yuchuan.gu/Workspace/MX/AOSP-WinScope`  
产物名称：`winscope-windows-offline.zip`  
产物目录：`release/`

## 1. 打包目标

生成一个可在 Windows 上离线使用的 WinScope 包，用户解压后可通过批处理脚本启动：

- `START_WINScope.bat`：启动 ADB proxy，并打开本地 `index.html`。
- `START_PROXY.bat`：仅启动 WinScope ADB proxy。
- `README_WINDOWS.txt`：Windows 使用说明和常见问题。
- `tools/`：附带抓取辅助文件。
- `docs/`：附带说明文档。

## 1.1 本次 Windows 修复说明

问题现象：Windows 下采集后加载提示 `No valid trace files found`，macOS 正常。

根因判断：Windows ADB/子进程输出常见 CRLF (`\r\n`) 换行，前端 `findFiles()` 之前只按 `\n` 分割但返回未 trim 的路径，可能把隐藏 `\r` 带入 `/fetch/...` 文件路径；代理端也有 `os.linesep` 依赖，导致 Windows/macOS 对 adb 输出和 `TRACE_OK` 状态的处理不一致。

修复内容：

- `winscope/src/trace_collection/adb/adb_device_connection.ts`：对 `find` 输出的每个路径做 `trim()`，避免隐藏 `\r` 污染 device filepath。
- `winscope/src/trace_collection/adb/adb_device_connection_test.ts`：新增 Windows CRLF 路径测试。
- `winscope/src/adb/winscope_proxy.py`：`adb devices -l` 改用 `splitlines()`；trace 完成状态改为 `status.strip() == "TRACE_OK"`，不再依赖宿主 OS 换行符。
- release 包内 `README_WINDOWS.txt` 增加 Windows CRLF 修复说明。

验证：

- `python3 -m py_compile winscope/src/adb/winscope_proxy.py` 通过。
- `npm run build:app` 通过，仅有既有 webpack bundle size warning。
- `zip -T release/winscope-windows-offline.zip` 通过。
- 包内确认 `winscope_proxy.py` 包含 `splitlines()` 与 `status.strip() == "TRACE_OK"`。
- Karma 选定测试尝试运行，但本机缺少 `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`，无法启动 `ChromeHeadless`；新增测试已随 `build:app` 完成 TypeScript/webpack 编译。

## 2. 运行要求

### 构建机要求

- macOS / Linux shell 环境。
- Node.js 与 npm 可用。
- 项目依赖已安装，即 `winscope/node_modules/` 存在。
- `winscope/deps_build/trace_processor/to_be_served/` 已包含 trace processor 产物：
  - `engine_bundle.js`
  - `trace_processor.wasm`
- 系统命令可用：
  - `rsync`
  - `zip`
  - `shasum`
  - `python3`

### Windows 使用端要求

- Python 3.10+
- Android platform-tools，且 `adb.exe` 在 `PATH` 中。
- 手机已开启 USB 调试，并完成授权。
- 建议同一时间只连接一台目标设备。

## 3. 构建命令

在仓库根目录执行：

```bash
cd /Users/yuchuan.gu/Workspace/MX/AOSP-WinScope/winscope
npm run build:app
```

该命令实际执行：

```bash
rm -rf dist/prod/ \
  && webpack --config webpack.config.prod.js --progress \
  && cp deps_build/trace_processor/to_be_served/* \
        src/adb/winscope_proxy.py \
        src/logo_light_mode.svg \
        src/logo_dark_mode.svg \
        src/viewers/components/rects/cube_full_shade.svg \
        src/viewers/components/rects/cube_partial_shade.svg \
        src/app/components/trackpad_right_click.svg \
        src/app/components/trackpad_vertical_scroll.svg \
        src/app/components/trackpad_horizontal_scroll.svg \
        dist/prod/ \
  && npm run prepare:offline-prod
```

`npm run prepare:offline-prod` 会执行：

```bash
node scripts/prepare-offline-prod.js
```

其作用：

- 确保 `trace_processor_memory64.wasm` 存在；当缺失时用 `trace_processor.wasm` 生成兼容 fallback。
- 为旧版缓存/旧 hash 的 JS 引用准备兼容文件，降低离线包打开时出现 404 的概率。
- 避免依赖 symlink，提升 Windows 解压后的兼容性。

本次构建结果：构建成功；webpack 仅输出 bundle size 相关 warning。

## 4. 打包命令

在仓库根目录执行以下脚本，生成 `release/winscope-windows-offline.zip` 和 sha256 文件：

```bash
set -euo pipefail
ROOT="$PWD"
PKG="winscope-windows-offline"
STAGE="$(mktemp -d)"
trap 'rm -rf "$STAGE"' EXIT

mkdir -p "$STAGE/$PKG"
rsync -a --delete --exclude='.DS_Store' winscope/dist/prod/ "$STAGE/$PKG/"

mkdir -p "$STAGE/$PKG/tools" "$STAGE/$PKG/docs"
cp winscope.pbtx "$STAGE/$PKG/tools/perfetto_config.pbtx"
cp winscope_capture.py "$STAGE/$PKG/tools/winscope_capture.py"
cp WinScope.pdf "$STAGE/$PKG/docs/WinScope.pdf"
cp README.md "$STAGE/$PKG/docs/AOSP-WinScope_README.md"

# 生成 Windows 使用说明和启动脚本：
# - README_WINDOWS.txt
# - START_WINScope.bat
# - START_PROXY.bat
# 三个文件需转换为 CRLF，便于 Windows 原生查看/执行。

mkdir -p release
rm -f "release/$PKG.zip" "release/$PKG.zip.sha256"
(
  cd "$STAGE"
  zip -qr "$ROOT/release/$PKG.zip" "$PKG"
)
(
  cd release
  shasum -a 256 "$PKG.zip" > "$PKG.zip.sha256"
)
```

> 注：实际打包时，`README_WINDOWS.txt`、`START_WINScope.bat`、`START_PROXY.bat` 的正文由脚本写入 staging 目录，然后用 `python3` 将换行转换为 CRLF。

## 5. 包内目录结构要求

zip 根目录必须是：

```text
winscope-windows-offline/
```

关键文件必须包含：

```text
winscope-windows-offline/index.html
winscope-windows-offline/winscope_proxy.py
winscope-windows-offline/trace_processor.wasm
winscope-windows-offline/trace_processor_memory64.wasm
winscope-windows-offline/START_WINScope.bat
winscope-windows-offline/START_PROXY.bat
winscope-windows-offline/README_WINDOWS.txt
winscope-windows-offline/tools/perfetto_config.pbtx
winscope-windows-offline/tools/winscope_capture.py
winscope-windows-offline/docs/WinScope.pdf
winscope-windows-offline/docs/AOSP-WinScope_README.md
```

## 6. 校验命令

```bash
zip -T release/winscope-windows-offline.zip
zipinfo -1 release/winscope-windows-offline.zip > /tmp/winscope-release-files.txt

for f in \
  winscope-windows-offline/index.html \
  winscope-windows-offline/winscope_proxy.py \
  winscope-windows-offline/trace_processor.wasm \
  winscope-windows-offline/trace_processor_memory64.wasm \
  winscope-windows-offline/START_WINScope.bat \
  winscope-windows-offline/START_PROXY.bat \
  winscope-windows-offline/README_WINDOWS.txt \
  winscope-windows-offline/tools/perfetto_config.pbtx \
  winscope-windows-offline/tools/winscope_capture.py \
  winscope-windows-offline/docs/WinScope.pdf \
  winscope-windows-offline/docs/AOSP-WinScope_README.md; do
  grep -Fx "$f" /tmp/winscope-release-files.txt >/dev/null || {
    echo "missing $f"
    exit 1
  }
done

wc -l < /tmp/winscope-release-files.txt
grep -c '^winscope-windows-offline/js/.*\.js$' /tmp/winscope-release-files.txt
cat release/winscope-windows-offline.zip.sha256
```

本次校验结果：

```text
test of release/winscope-windows-offline.zip OK
file_count=91
js_count=67
hash_refs=062e760d078d6d886ec2
3996f55200df52d23adccddec7ea0d6f5f3adbbbc903999c6de8a4b5bf39bd02  winscope-windows-offline.zip
```

## 7. 本次 release 产物

```text
release/winscope-windows-offline.zip         67M
release/winscope-windows-offline.zip.sha256  95B
```

sha256：

```text
3996f55200df52d23adccddec7ea0d6f5f3adbbbc903999c6de8a4b5bf39bd02  winscope-windows-offline.zip
```

## 8. Windows 包说明内容要求

`README_WINDOWS.txt` 至少应说明：

- 如何解压和启动。
- 需要 Python 3.10+。
- 需要 Android platform-tools / adb。
- 需要开启 USB 调试。
- 采集时保持 proxy 窗口打开。
- 如果手机卡顿，优先关闭 Screen Recording 或缩短采集时间。
- 如果出现 `No valid trace files found`，说明没有生成或搬运 trace 文件，需要重新开始/停止采集，并确认设备连接授权正常。
- 如果设备列表不稳定，关闭旧 WinScope 页面和旧 proxy，只保留一个 `5544` 端口 proxy。

## 9. 注意事项

- 不要把 `.DS_Store` 打入 release 包。
- `tools/` 和 `docs/` 要在 `rsync --delete` 之后再创建，否则会被清理掉。
- `START_WINScope.bat` 会读取 `%USERPROFILE%\.config\winscope\.token`，并将 token 拼接到本地 file URL。
- 同一时间建议只运行一个 WinScope proxy，默认端口为 `5544`。
- 如后续修改 `winscope/src/adb/winscope_proxy.py` 或前端 trace collection 逻辑，需要重新执行 `npm run build:app` 再打包。
