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

## Cross compilation

`npm run build:launchers` invokes `scripts/build-launchers.py`, which uses
`CGO_ENABLED=0 go build -trimpath` for Windows, macOS, and Linux on amd64 and
arm64. It writes derived binaries beneath `dist/launchers/`; release packaging
moves them into the stable `bin/<os>-<arch>/` distribution layout.
