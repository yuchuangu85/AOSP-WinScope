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

With no arguments, every platform's launcher enables device capture and opens
the default browser. It listens only on `127.0.0.1:0` and prints the resulting
local URL. Explicit command-line arguments retain opt-in behavior: include
`--capture --open` to enable capture and open the browser, or use
`--offline-only --open` for file analysis without capture. The
launcher discovers `adb` from `PATH`, Android SDK environment variables, and
Android Studio's default Windows, macOS, and Linux SDK directories. Capture
requires Python 3.10+ and a discoverable `adb`. If no-argument automatic capture
startup fails, the browser still opens in file-only mode and displays the diagnostic instead of
silently exiting. Explicit `--capture` startup failures return an error.
The launcher does not download software, change Host
configuration, elevate privileges, or run a caller-provided command.

## Source checkout

`npm start` builds the current Web UI and a host-native Launcher, stages them
with the capture proxy and an integrity manifest under `dist/local`, and runs
the Launcher with the same defaults as a release. It reuses verified Trace
Processor outputs when available; the first build needs the pinned dependency
cache and toolchain described in `docs/REBUILD_PLAN.md`.

Launcher arguments can be forwarded through npm, for example:

```sh
npm start -- --capture --open --port 8080
npm start -- --offline-only --open
```

`npm run start:web` retains the Angular-only development server for UI work.
That explicit Web-only entry does not start a Launcher or device capture.

## AI gateway

The AI module is an independent Node runtime under `ai/`. Start it separately,
then pass its loopback URL to the launcher:

```sh
npm run ai:build
npm run ai:serve -- --port 7341
npm start -- --open --ai-url http://127.0.0.1:7341
```

The launcher exposes the gateway to the browser only through the same-origin
`./ai/` endpoint. `--ai-url` accepts only an explicit `http` loopback URL
(`127.0.0.1`, `localhost` or `::1`) with no path, query, fragment or
credentials. Omitting the option keeps the launcher-only runtime contract.
The AI gateway can also be used directly through its CLI or MCP stdio entry
point; see `docs/AI_DISPLAY_ANALYSIS_PLAN.md` and the `ai/` module README.

The toolbar opens an independent Settings page with a left-hand General/AI menu.
General contains interface language and theme controls and does not need an AI
gateway. Theme offers **Follow system**, **Dark mode**, and **Light mode** and
applies immediately; Follow system responds to operating-system theme changes.
The toolbar no longer contains a separate theme toggle. AI settings separates
Codex and Claude; each **Get configuration** action
fills only its own model, supported effort, service URL and authentication status.
The last successful Get configuration selects the only active provider; failed
reads leave the previous selection intact. Save applies only that provider/model
without discarding the conversation draft. The composer switches models within
this provider, not across providers. The gateway machine,
not the browser, reads these settings. No credentials or complete configuration
files are returned to the browser. Imports are process-local and must be repeated
after a gateway restart. See `ai/README.md` for supported configuration sources,
CLI requirements and model-access limits.

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

Capture requires a discoverable `adb` and Python 3.10+ in `PATH`. The launcher
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

### AI conversation replay and reports

The optional loopback AI gateway supports in-memory multi-turn history. The
same-origin `/ai/` proxy accepts only the following query fields on GET requests:
`/api/sessions/:id/stream?after=<non-negative event ID>` and
`/api/sessions/:id/report?format=markdown|html`. Other query fields and duplicate
values remain rejected. The gateway separately validates loopback Host/Origin
and JSON mutation requests. Session recovery survives browser/panel reopening,
not gateway process restart. See `ai/README.md` for the provider/model and text
attachment configuration boundary.
