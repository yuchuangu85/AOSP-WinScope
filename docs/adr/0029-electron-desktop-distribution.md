# ADR 0029: Electron Desktop Distribution

## Status

Accepted for implementation. Native installer, upgrade, signing, and hosted
cross-platform qualification remain evidence-gated.

[ADR 0030](0030-multi-platform-desktop-release.md) supersedes only this decision's
initial four-target and candidate-only delivery scope. Runtime isolation,
service ownership, profile preservation, and unsigned-evidence boundaries below
remain in force. The expanded release implementation is underway; acceptance of
the decision does not mean hosted qualification or publication has passed.

## Context

The portable Go Launcher remains a supported delivery channel, but its browser,
Python, and ADB setup is not an install-and-run desktop experience. WinScope
already has one production Web/Trace Processor build, a security-sensitive local
Launcher/capture contract, and an independent AI gateway. Reimplementing those
services in Electron would create unnecessary behavioral and security drift.
Installed users should not need Node.js, Python, or Android SDK tools merely to
start WinScope. Optional external AI providers cannot be made credential-free by
bundling their gateway.

## Decision

Add an Electron distribution alongside, not in place of, the existing portable
distribution. ADR 0030 integrates both into the existing gated official release
flow rather than creating an independent release authority. Pin Electron
`45.2.1` and electron-builder `26.18.1`
with npm lockfile integrity; use the builder's v26 configuration contract.

Use `desktop/app` as a dedicated app directory with a dependency-free
`main.cjs` host (Electron and Node built-ins only). Keep the renderer sandboxed,
context-isolated, and without Node integration. It consumes the existing
loopback Web origin; it does not receive general filesystem/shell IPC or provider
credentials. Navigation, new windows, and permissions are restricted by the host.

Reuse the native Go Launcher for verified Web serving and authenticated capture
and AI proxying. The Electron parent owns its Launcher through a parent pipe so
parent exit or pipe closure also ends capture. Prefer the bundled frozen capture
executable, not system Python. Run the compiled AI gateway in Electron's
`utilityProcess`, not an external Node installation. The app stops only its owned
children and does not kill unrelated processes.

Stage `dist/desktop/runtime/<platform>-<arch>` with the fresh `dist/prod` Web and
Trace Processor WASM, native Go Launcher, PyInstaller onedir capture executable
plus Python libraries/resources, the declared pinned ADB provider for the host,
and compiled AI gateway. Preserve the whole native runtime outside ASAR in
packaged resources. Preparation owns pinned PyInstaller/runtime inputs and
download verification. Installed startup does not download missing dependencies
or updates. External Codex/Claude CLIs, configuration/authentication, and model
entitlements remain user-owned; no private config, credential, CLI, or model is
bundled.

PyInstaller is pinned to `6.22.3`. Electron, Go, and frozen capture are native
for all six targets; ADB is not uniformly native. Both Windows builds include
Google Platform Tools `37.0.1` PE ia32 ADB, with Windows 11 x86 emulation on ARM64.
Linux arm64 uses native Ubuntu 24.04 ADB `34.0.4-1build3`, not Google Linux x64
ADB. Its bounded libraries require glibc 2.38 or later and authenticated source,
license, and provenance evidence. The Linux ARM64 release additionally includes
the full matching application-commit source archive and a user-controlled
replacement/relink route that regenerates integrity manifests without private
keys. Integrity is not DRM; no source-inspection/reverse-engineering prohibition
is added. Final application-level license compliance remains a fail-closed
release requirement, not an assumption from packaging or source delivery.

Store the stable per-user profile outside the installation in Electron
`userData`, so application replacement/update preserves it. This does not make
gateway-memory-only AI conversations durable. Actual installer upgrade and
uninstall data behavior must be tested separately.

Build the shared Web and AI once on supported Linux using the existing pinned
dependency/build pipeline. Transfer the same-run artifacts to native macOS
arm64/x64, Windows arm64/x64, and Linux arm64/x64 jobs. Native jobs consume them via
`node desktop/prepare.mjs --skip-web-build`, build their own frozen Python/Go
runtime and correct ADB, package an unpacked app, smoke its actual executable,
then make installers. They must not rebuild Perfetto on unsupported native hosts.
Linux smoke runs under Xvfb; macOS/Windows smoke runs natively.

The native workflow supports manual or path-filtered PR CI and reusable
`workflow_call`, with SHA-pinned actions, read-only repository permissions, and
workflow artifact retention. It does not itself publish a release. The official
caller reuses its canonical gated Web/AI artifact, waits for all six complete
native deliveries, and publishes portable and desktop assets in one remotely
verified draft-first release under ADR 0030. Candidate success does not bypass
or relax any existing portable official release gate.
Developer ID signing/notarization and Windows code signing require external
credentials and a separate credentialed release decision, not a local build flag.

## Consequences

- Installed startup no longer depends on host Node, Python, or ADB installations;
  artifacts are larger and require platform-native runtime maintenance.
- One Web build and the existing Launcher/AI boundaries avoid parser and service
  duplication, but lifecycle and packaged-resource resolution need regression
  coverage.
- Frozen Python cannot be assumed cross-compilable. Package and smoke each native
  target on the matching OS/architecture; retain ADB-provider licenses and
  redistribution evidence with the candidate runtime. ADB emulation and the
  Linux ARM64 distribution/glibc baseline must be disclosed separately.
- USB debugging, device authorization, Windows drivers, Linux udev rules, and
  Linux desktop/AppImage system requirements remain OS/device prerequisites.
- A dependency lock, local macOS success, or a green unpacked smoke is not proof
  of all-platform installation, update retention, trusted signing, remote AI
  availability, SBOM approval, or official reproducible release qualification.

## Validation

Use `desktop:test` for host/preparation contracts, `desktop:smoke` for staged
development startup, and `node desktop/smoke.mjs --executable <path>` for the
packaged-runtime boundary before generating installers. Record native hosted
results separately from local checks and from real-device/provider tests.
Before delivery, reconcile skip-build behavior, complete onedir packaging, and
packaged smoke/resource resolution with their implementing scripts. See
[Electron Desktop](../ELECTRON.md) for commands and evidence limits.
ADR 0030 additionally requires two packaged acceptance runs, complete target and
format inventories, source delivery, and remote draft asset verification. The
historical local macOS result is not hosted Windows/Linux, native Linux ARM64
GPG, installer upgrade, source-compliance, or official-release evidence.
