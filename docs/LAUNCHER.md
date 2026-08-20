# Standalone launcher contract

`cmd/launcher` is the no-CGO, standard-library desktop host for one packaged
Winscope distribution. It listens only on `127.0.0.1:0`, prints the resulting
local URL, and does not automatically start a browser unless `--open` is
specified. It does not download software, change Host configuration, elevate
privileges, or run a caller-provided command.

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
launcher also ends its loopback server and capture session.

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
