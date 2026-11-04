## AOSP-WinScope 17.0.1 — desktop installers (5 native targets)

Historical release notes: the workflow/trust descriptions below record this
candidate's release context. Current automation uses a separate `release.yml`
publisher after successful default-branch manual Desktop packaging; the protected
official publisher and standalone security workflow remain removed. These
historical notes do not describe the current publisher's trust guarantees.

Five-platform desktop installers for WinScope 17.0.1, compiled and smoke-tested
by the repository's `Electron desktop candidates` workflow on GitHub-hosted
runners from commit `d447dbc87` (main).

This release exists because the earlier [v17.0.1 source release](https://github.com/yuchuangu85/AOSP-WinScope/releases/tag/v17.0.1)
is immutable and cannot receive additional assets. The source identity is the
same 17.0.1 product version.

### Assets

| Platform | Architecture | Installers |
| --- | --- | --- |
| macOS 13+ | Intel (`x64`) | `.dmg`, `.pkg` |
| macOS 13+ | Apple Silicon (`arm64`) | `.dmg`, `.pkg` |
| Windows 10+ | `x64` | NSIS `.exe`, `.msi` |
| Linux (Ubuntu 22.04 baseline) | `x64` | `.deb`, `.rpm` |
| Linux (Ubuntu 24.04, glibc 2.38+) | `arm64` | `.deb`, `.rpm` |

Alongside the ten installers the publication carries
`aosp-winscope-desktop-17.0.1-linux-arm64-source.tar.gz` (the exact tracked
application source, a legal artifact rather than an installer), the five
`desktop-target-<target>.json` identity/compatibility reports, the five raw
`desktop-acceptance-<target>.json` smoke reports, `desktop-release.json`, and
`desktop-SHA256SUMS.txt`.

### What is bundled

Each package contains the WinScope Web UI, Trace Processor WASM runtime, Go
Launcher, frozen Python capture service, the pinned ADB provider (Google
Platform Tools 37.0.1, or native Ubuntu ARM64 ADB), and the AI gateway.
Installed users do not need Node.js, Python, or ADB. Optional Codex/Claude CLIs
and their authentication stay user-managed; no credentials or model access are
bundled.

### Verification performed by CI

Every packaged executable passed a two-run startup acceptance before any
installer was created: real Perfetto trace upload and viewing, settings/language
persistence across a same-profile restart, renderer isolation, bundled capture
and AI services, and owned-service shutdown. Installers were then produced from
the smoke-tested unpacked application and re-verified by
`desktop/release.mjs verify` before upload. Per-target reports are attached.

### Installing on macOS

1. Open the DMG and drag **AOSP WinScope** into `/Applications` (or run the PKG).
2. Double-click the app. macOS blocks the first launch because the bundle is not
   notarized and shows *"Apple could not verify AOSP WinScope is free of
   malware"* (or *"cannot be opened because the developer cannot be verified"*).
   Click **Done**.
3. Open **System Settings → Privacy & Security**, scroll to **Security**, find the
   blocked **AOSP WinScope** entry and click **Open Anyway**, then confirm with
   Touch ID or the login password.
4. Double-click the app again and confirm **Open**. The warning appears only for
   the first launch of each installed copy.

On macOS 13/14 the same result is available from Finder with **Control-click →
Open → Open**. From Terminal, clearing the download flag also works and does not
require any approval:

```sh
xattr -dr com.apple.quarantine "/Applications/AOSP WinScope.app"
```

These steps only bypass the quarantine/notarization prompt for a locally
installed copy. They are not Developer ID signing or notarization, do not change
the bundle's trust, and must be repeated for each newly downloaded build.
Equivalent Windows SmartScreen and Linux package-manager prompts are not
publisher authentication either.

### Trust and limitations

- Packages are **unsigned and not Apple-notarized**. Gatekeeper/SmartScreen
  warnings are expected; this build carries no OS code-signing or Apple trust.
- This is a **candidate pre-release** from the read-only candidate workflow, not
  from the protected `official-release` workflow. That workflow remains the
  only path that produces OIDC-attested releases, and it requires repository
  administration prerequisites (protected environment, reviewers, digest-pinned
  release image, approved evidence secrets) that are not configured yet.
- There is no automatic update or downloader; updates are explicit replacement
  installations from a trusted source.
- Verify download integrity against `desktop-SHA256SUMS.txt`. Checksums alone do
  not prove provenance.

### Documentation

- [README](https://github.com/yuchuangu85/AOSP-WinScope/blob/main/README.md)
- [Electron desktop](https://github.com/yuchuangu85/AOSP-WinScope/blob/main/docs/ELECTRON.md)
- [CHANGELOG](https://github.com/yuchuangu85/AOSP-WinScope/blob/main/CHANGELOG.md)
