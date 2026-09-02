# Standalone launcher contract

`cmd/launcher` is the no-CGO, standard-library desktop host for one packaged
WinScope distribution. Releases are portable ZIP archives, one for each
supported operating-system and architecture pair:

- `windows-amd64` or `windows-arm64`
- `darwin-amd64` or `darwin-arm64`
- `linux-amd64` or `linux-arm64`

Download the archive matching the host exactly and extract it to any directory.
There is no universal archive and macOS does not require an `.app` bundle. At
the archive root, start the application with `start-winscope.sh` on macOS/Linux,
or with either `start-winscope.bat` or `start-winscope.ps1` on Windows. Each
entry point resolves the archive directory itself, invokes only its matching
launcher, forwards all arguments, and preserves the launcher's exit status.

The launcher listens only on `127.0.0.1:0`, prints the resulting local URL, and
does not automatically start a browser unless `--open` is specified. Passing
`--capture --open` enables device capture and opens the default browser. The
launcher discovers `adb` from `PATH`, Android SDK environment variables, and
Android Studio's default SDK directory. Capture requires Python 3.10+ and
`adb` available in `PATH`. If automatic capture startup fails, the browser
still opens in file-only mode and displays the startup diagnostic instead of
silently exiting. The launcher does not download software, change Host
configuration, elevate privileges, or run a caller-provided command.

## Distribution inputs

Before serving anything, the launcher reads `manifest.json` at the package root
and verifies every declared SHA-256 asset. Version 1 uses this shape:

```json
{
  "schemaVersion": 1,
  "assets": [
    {"path": "web/index.html", "sha256": "<64 lowercase hexadecimal characters>"},
    {"path": "web/runtime-config.json", "sha256": "<64 lowercase hexadecimal characters>"}
  ]
}
```

All paths are clean, relative `web/` paths. The manifest must cover at least
`web/index.html` and `web/runtime-config.json`; release engineering owns the
complete generated inventory and places the Python proxy at
`proxy/winscope_proxy.py`.

## Device capture

Passing `--capture` requires `adb` and Python 3.10+ in `PATH`. The launcher
creates a fresh 32-byte secret, starts only its packaged proxy child on a second
random `127.0.0.1` port, and exposes it only through `./capture/` on the Web
origin. The secret stays in launcher/proxy memory and is injected only over the
private proxy hop. Browser credentials, URL parameters, persistent tokens,
CORS, direct proxy access, and a fixed proxy port are not supported.

The Go launcher owns and stops only the Python child it starts. Closing the
launcher also ends its loopback server and capture session. Optional capability
probes such as ProtoLog, screen recording version, display metadata, and Wayland
do not block capture when absent. Windows CRLF command text and ADB text output are normalized before use, and an
empty Recovery Capture directory is treated as an empty result
rather than as a file path. Fatal ADB failures are shown with the failing
operation, exit status, and a bounded device diagnostic so Windows device,
authorization, permission, and missing-command problems can be distinguished.

Advanced launch controls are explicit and remain loopback-only:

- `--port <1-65535>` requests a fixed Web port; `0` keeps the default random
  available port and a conflict fails without terminating another process;
- `--open` uses the operating-system browser handler;
- `--browser <executable>` launches that browser directly with the local URL;
- `--offline-only` explicitly disables capture and cannot be combined with
  `--capture`.

With capture enabled, select an available Android device in Winscope, choose
trace targets, and start the trace. Ending the trace is one managed operation:
Winscope stops every active target, moves the resulting files into the disclosed
Recovery Capture directory, pulls that session, and immediately imports the
files into the existing viewers. **Fetch traces from last session** repeats the
pull-and-import portion after a page reload or interrupted browser session.

Target availability is refreshed from the selected device rather than inferred
from its Android version. Targets with a legacy capture path remain selectable
when their Perfetto datasource is absent. Perfetto-only targets are disabled
individually when the datasource is missing, so the remaining Android 15/16
capture capabilities continue to work.

## Cross compilation

`npm run build:launchers` invokes `scripts/build-launchers.py`, which uses
`CGO_ENABLED=0 go build -trimpath` for Windows, macOS, and Linux on amd64 and
arm64. It writes derived binaries beneath `dist/launchers/`; release packaging
moves them into the stable `bin/<os>-<arch>/` distribution layout.
