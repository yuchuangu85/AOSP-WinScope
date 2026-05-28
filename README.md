# AOSP-WinScope
winscope from aosp, The Tools used to analyze black screen, flashing screen, and white screen issues.(用来分析黑屏，闪屏，白屏问题的工具)

版本：Android-16(另一个版本)



详细介绍：

[AndroidOS/Performance/黑屏问题/README.md at main · yuchuangu85/AndroidOS](https://github.com/yuchuangu85/AndroidOS/blob/main/Performance/黑屏问题/README.md)



如果无法打开参考：

[aosp15上winscope离线html如何使用?_winscope.html-CSDN博客](https://blog.csdn.net/learnframework/article/details/144384808?spm=1001.2014.3001.5501)

或者参考附件文档



## 抓取连续的sf winscope

根据：[使用 adb 命令捕获跟踪记录  | Android Open Source Project](https://source.android.google.cn/docs/core/graphics/winscope/capture/adb?hl=zh-cn#capture-adb-vc)

生成一个perfetto_config.pbtx文件，如附件

使用命令将下面文件push到手机

```Java
adb push perfetto_config.pbtx /data/misc/perfetto-traces/
```

然后执行

```Java
adb shell perfetto --txt --config /data/misc/perfetto-traces/perfetto_config.pbtx --out /data/misc/perfetto-traces/1.perfetto-trace
```

离线 WinScope 启动方式（兼容 macOS Intel/Apple Silicon、Windows x64/ARM；实际运行依赖浏览器 WebAssembly 能力，与本机 CPU 架构无关）：

```bash
npm i -g http-server      # 只需装一次，mac 下如果没有权限，在前面加上 sudo
cd winscope/dist/prod
http-server . -p 8000 -o /index.html -c-1
// 根目录
http-server winscope/dist/prod -p 8000 -o /index.html -c-1
```

Windows PowerShell 也可以执行同样命令：

```powershell
cd winscope\dist\prod
http-server . -p 8000 -o /index.html -c-1
// 根目录
http-server winscope/dist/prod -p 8000 -o /index.html -c-1
```

如果遇到旧 hash 的 `js/*.js` 或 `trace_processor_memory64.wasm` 404，先停掉旧服务并强刷/无痕打开；当前离线包已包含无 symlink 的兼容文件。

Windows 离线包请优先双击 `START_WINScope.bat`。该脚本会启动本地
`http://127.0.0.1:8000/` 静态服务后再打开 WinScope，避免直接用
`file://index.html` 时浏览器对 Worker/WASM 本地文件访问的限制导致 trace
加载不完整。

打开 `http://localhost:8000` 或者 `http://127.0.0.1:8000/`

导入**1.perfetto-trace**文件即可

## 新增脚本抓取

执行 `winscope_capture.py` 即可；Windows 离线包内可在 `tools` 目录执行：

```powershell
python winscope_capture.py --duration 12
python winscope_capture.py --duration 12 --video
```

脚本会等待 `adb push/pull` 完成，并自动兼容离线包中的
`perfetto_config.pbtx`。
