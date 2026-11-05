# Electron Desktop

Electron Desktop is the install-and-run distribution of WinScope. It embeds the
existing Web UI and reuses the Go Launcher; it is not a replacement trace parser
or a second implementation of capture or AI. CI generates native installers
and uploads Actions artifacts. The same workflow automatically releases successful
default-branch manual builds as GitHub Releases through its `publish` job.
Required source, license, integrity, and native acceptance evidence accompanies
those artifacts. Legacy
portable browser/Launcher and APS CLI contracts remain available for manual/local
use only; GitHub CI does not generate or publish those products. The five-target,
ten-installer contract below is implementation work
in progress, not evidence that hosted builds or public release qualification
have passed.

## Installation and runtime prerequisites

Choose the artifact matching the machine: macOS arm64 (Apple Silicon), macOS x64
(Intel), Windows x64 (AMD64), Linux x64, or Linux arm64. Windows ARM64 desktop is
not supported. These are distinct native Electron packages, not a universal
macOS binary or a
cross-platform validation claim. Manual/PR runs upload candidates to the GitHub
Actions run's artifacts; successful default-branch manual builds also produce
an automatically published stable Release. The protected official-release
workflow remains removed; the desktop Release is not official release approval.
Only install an artifact from a trusted source.

On macOS, open the DMG and install the application in Applications, or run the
PKG installer. On Windows x64, run the NSIS EXE or MSI installer. On Linux,
install the DEB/RPM with the OS package manager. Start the installed application
from the normal OS application entry point. Linux still needs the desktop system
libraries. An unpacked `--dir` application is a packaging test target, not proof
that an installer works.

The installed application includes its Node runtime through Electron, its Python
runtime through a frozen capture service, and a pinned ADB provider: Google
Platform Tools except for native Ubuntu ADB on Linux arm64. It needs no separate
Node.js, Python, or ADB installation and does not
download missing runtime components or updates on startup. Missing or invalid
bundled files must produce a startup failure, not an implicit installer, `pip`,
`npm`, or SDK download. Build-time preparation can download locked dependencies.

Device capture still needs USB debugging enabled on the Android device, device
authorization, a working connection, and OS permissions. Windows USB drivers and
Linux udev rules may need administrator-managed setup; the application does not
install drivers, change permissions, or elevate itself. A machine without a
connected device can still pass a desktop startup smoke; that does not validate
capture against a physical device.

AI gateway startup does not imply model access. Optional Codex/Claude executables,
CLI versions, configuration, authentication, and provider entitlements remain
user-owned. No provider CLI, credential, private configuration, or model is
bundled. See [the AI module](../ai/README.md) for supported configuration sources
and the distinction between deterministic analysis and configured model calls.

### Platform and component support

[`desktop/app/targets.cjs`](../desktop/app/targets.cjs) is the single source of
truth for targets, native runners, component architectures, and required formats.
Electron `45.2.1`, the Go Launcher, and PyInstaller `6.22.3` capture are native to
each listed OS/CPU. Go uses `amd64` for the Electron `x64` targets. ADB's
architecture and provider are deliberately separate from the application label:

- `darwin-x64`: Intel macOS, runner `macos-26-intel`, DMG and PKG only.
- `darwin-arm64`: Apple Silicon macOS, runner `macos-26`, DMG and PKG only.
- `win32-x64`: Windows AMD64, runner `windows-2025`, NSIS EXE and MSI only.
- `linux-x64`: Linux AMD64, runner `ubuntu-22.04`, DEB and RPM only.
- `linux-arm64`: Linux ARM64, runner `ubuntu-24.04-arm`, DEB and RPM only.

This is **five targets and ten installer assets**. CI excludes portable Launcher
ZIPs, desktop ZIPs, AppImage, and binary tar.gz products. The Linux ARM64 source
tar.gz remains a separate required legal/source artifact, not an installer.
Legacy portable packaging/APS tools are manual-only; their local contracts are
not removed by this CI policy.

macOS requires macOS 13 (Ventura) or later under Electron's support policy.
Intel and Apple Silicon
packages are released together, not combined into a universal application.
Windows x64 requires Windows 10 or later. Runner labels are build environments,
not proof of acceptance on every supported OS version.

Google Platform Tools `37.0.1` supplies macOS universal ADB and Linux x64 ADB.
Its Windows `adb.exe` and companion DLLs are **PE ia32 (32-bit x86) in both
Windows x64 installer formats**, even though Electron, Go, and frozen capture
are native x64. USB drivers, device authorization, and OS rights remain
prerequisites. Binary-header checks must validate these component-specific
architectures rather than pretending the application label applies to all files.

Linux x64 uses Google ADB `37.0.1` and an Ubuntu 22.04 native build baseline.
Linux ARM64 instead requires genuine native Ubuntu 24.04 ADB `34.0.4`, package
version `1:34.0.4-1build3`, with a bounded shared-library dependency closure.
That bundle requires **glibc 2.38 or later** and the host's system loader/glibc;
Ubuntu 24.04 is the initial supported ARM64 distribution. A DEB or RPM
extension is not a claim of compatibility with all Linux distributions or older
glibc installations.

The ARM64 provider must fail closed unless hashes, original Ubuntu APT
`InRelease` GPG authentication, and matching binary/source index records verify.
It must retain complete corresponding source archives, licenses, notices, and
provenance for ADB and redistributed libraries, not just links to source pages.
See [the native ARM64 bundler notes](../desktop/linux-adb-licenses.md). Application
replacement/relink rights and required build materials remain an additional
license-review gate; bundling source archives alone is not a declaration of full
compliance. Real native GPG execution and final source/license completeness have
not been established by the local macOS evidence below.

Windows ia32, Linux armv7, and RISC-V (`riscv64`) are not supported targets:
Electron `45.2.1` has no matching official assets. Windows ia32 and Linux armv7
were removed in Electron 44. Adding electron-builder target flags cannot create
missing Electron, capture, ADB, runner, and acceptance support.

## Runtime architecture

`desktop/app` is the dedicated electron-builder app directory. Its
`main.cjs` host uses Electron and Node built-ins without application-level npm
runtime dependencies; Angular's build dependencies are not host dependencies.
Electron is pinned to `45.2.1` and electron-builder to `26.18.1`; updates are
explicit package/lockfile changes, not floating `latest` lookups.

The host owns one sandboxed, context-isolated renderer with Node integration
disabled. It loads only the Launcher's loopback Web origin, denies unsolicited
navigation/windows and permissions, and does not expose a generic shell or
filesystem bridge to Web content. The Launcher retains responsibility for
integrity-checked Web serving and authenticated same-origin `./capture/` and
`./ai/` proxying. Electron does not open a second public capture or AI endpoint.

The desktop window uses a single 32px title/toolbar, retaining native macOS
traffic lights or Windows/Linux caption buttons. The former File/Edit/View/Help
application menu is removed; essential local keyboard commands remain active.
Only blank toolbar space is draggable. The existing toolbar buttons remain
interactive, with native control safe areas reserved and caption colors following
the resolved page theme. The sandboxed preload exposes no general renderer API;
its visual theme message is validated against the current main frame. Browser
startup does not receive the desktop marker and keeps the original toolbar.

The AI gateway runs in an Electron `utilityProcess`, using Electron's bundled
Node runtime rather than a `node` command on `PATH`. The Go Launcher is a native
child managed through a parent pipe: closing the parent or its pipe ends the
Launcher and its capture child. Quitting the app also stops its owned AI process.
The bundled frozen capture executable is preferred over a system Python; its
onedir payload must stay together, including the Python libraries. Only children
owned by the app are terminated; unrelated ADB servers or provider sessions are
not blanket-killed.

Shutdown also waits for cancelled AI commands to exit and for capture to
terminate and reap its own in-flight ADB commands. Parent-pipe EOF handles
Windows without relying on Unix signals. Quitting during startup waits for
the pending service owner, and forced termination has a finite deadline.

Preparation stages a host-native tree at
`dist/desktop/runtime/<platform>-<arch>`, using Node platform identifiers
(`darwin`, `win32`, `linux`) and architectures (`arm64`, `x64`). It contains:

- A fresh copy of `dist/prod`, including the pinned Trace Processor engine and
  both WASM variants, served through the Launcher rather than `file://`.
- The native Go Launcher and the generated Web integrity manifest.
- A native PyInstaller `6.22.3` **onedir** capture executable with its Python standard library,
  extension modules, shared libraries, and required capture resources.
- The pinned ADB provider and companion libraries, licenses, and provenance.
  A macOS universal Google binary must contain the runner's architecture;
  Windows uses explicitly declared ia32 ADB and Linux arm64 uses the native
  Ubuntu provider described above. Undeclared architecture mismatches fail.
- The compiled `ai/dist` gateway, without user credentials or provider CLIs.

The builder copies this runtime outside `app.asar` into packaged resources so
native executables and the frozen Python libraries remain directly accessible.
In development the host resolves the staged host tree; in an installed or
unpacked package it resolves `process.resourcesPath`, not the source checkout,
the current working directory, or a developer's staging tree. PyInstaller pins
belong to `desktop/requirements.txt`; ADB provider origins and checksums belong
to `desktop/runtime-lock.json`, including the separate Ubuntu ARM64 provider,
enforced by `desktop/prepare.mjs`. Frozen Python
and other redistributed components also need their license evidence. A candidate is not an
official SBOM, reproducibility, or redistribution approval merely because it
packages successfully.

## User data and updates

Application data belongs under Electron's per-user `userData` directory, outside
the installation and read-only packaged resources. Its normal OS locations are
under `~/Library/Application Support` on macOS, `%APPDATA%` on Windows, and
`${XDG_CONFIG_HOME:-~/.config}` on Linux. Keep the application identity stable
across versions so replacing/updating the installed application preserves that
profile. Installers must not erase the profile on update. Back up user data
before manual migration or uninstall; uninstall deletion policies and real
upgrade behavior require separate installer testing.

This is not a promise that every runtime object is persisted: AI conversations
are currently gateway-memory-only and end when that process exits. Credentials
remain in the user's existing provider configuration/authentication system, not
the installation. There is no automatic update/downloader in the installed app;
updates are explicit replacement installations from a trusted source.

## Development and local builds

Build-time requirements are the repository's pinned Node.js/npm and Go toolchains,
Python **3.12**, and the host-native packaging tools. `desktop/prepare.mjs` owns
installation of the pinned PyInstaller dependency; do not install a floating
PyInstaller separately. `desktop/requirements.txt` pins its build dependencies;
`desktop/runtime-lock.json` pins ADB provider downloads and source evidence.
Linux installer packaging also requires its native packaging tools. The Linux
ARM64 bundler additionally requires native Ubuntu 24.04 arm64, `curl`, `dpkg-deb`,
`readelf`, `gpgv`, `xz` support, and the Ubuntu archive keyring/common license
files; it extracts pinned packages without installing them or running their
maintainer scripts. Build-time
requirements are not installed-user requirements.

On the supported Linux shared-build host, from the repository root:

```sh
npm ci
npm run deps:prepare
npm run deps:verify
npm run build:prod
npm run desktop:prepare
npm run desktop:start
```

The initial `build:prod` builds fresh Trace Processor artifacts through the
pinned dependency pipeline; desktop preparation then builds the current Angular
Web and AI and stages the native runtime. Do not run a full Perfetto build on Windows
or infer another native host's support from the Electron target matrix. If the
host cannot build the shared Web artifact, obtain `dist/prod` and `ai/dist` from
the same trusted Linux build/commit, restore them at those paths, then use:

```sh
npm ci
node desktop/prepare.mjs --skip-web-build
npm run desktop:start
```

The skip path consumes the supplied Web and compiled AI artifacts. It must reject
missing inputs rather than silently rebuilding Perfetto on the native runner.
Do not mix artifacts from different revisions. `desktop:start` is the Electron
entry point; existing `npm start` remains the standalone browser/Launcher flow.

Root script contract:

```text
desktop:prepare  node desktop/prepare.mjs
desktop:start    node desktop/start.mjs
desktop:pack     npm run desktop:prepare && electron-builder --config desktop/electron-builder.cjs --dir
desktop:dist     npm run desktop:prepare && electron-builder --config desktop/electron-builder.cjs
desktop:test     node --test desktop/*.test.mjs desktop/app/*.test.cjs
desktop:smoke    node desktop/smoke.mjs
```

Run `npm run desktop:test` for the host/preparation contracts,
`npm run desktop:smoke` for the staged development app, `npm run desktop:pack`
for an unpacked app, and `npm run desktop:dist` for native installers. These
commands do not sign, notarize, publish, or grant provider access. With shared
artifacts already staged, CI avoids invoking the full preparation script again:

```sh
node desktop/prepare.mjs --skip-web-build
npx --no-install electron-builder --config desktop/electron-builder.cjs --dir --publish never
node desktop/smoke.mjs --executable <unpacked-application-executable>
```

The smoke command's default is Electron with `desktop/app`. With `--executable`,
it launches the actual packaged binary (on macOS, the executable inside the
`.app`, not the bundle directory), uses the package's own runtime, and returns a
nonzero status on failure or timeout. Its isolated test profile must not modify
the normal user profile. On Linux run it under `xvfb-run -a`; Windows and macOS
use their native runner session. No `--no-sandbox`, quarantine removal, or
Gatekeeper/SmartScreen bypass is part of this contract.

### Release planning and candidate commands

Inspect the version and five-target plan without building or publishing:

```sh
node -p "require('./package.json').version"
node desktop/release.mjs plan --commit "$(git rev-parse HEAD)"
```

To check a proposed release version, pass it explicitly; it must already equal
the root `package.json` version. For example, for the current `17.0.2` contract:

```sh
node desktop/release.mjs plan --version 17.0.2 --commit "$(git rev-parse HEAD)"
```

`plan` validates identity and emits the authoritative matrix and publication
artifact name. It does not change versions, validate a dirty tree as releasable,
or prove native acceptance. Prepare any intentional version/lock changes in a
reviewed commit before release tagging; the workflow never mutates a version to
match a tag. The official policy accepts `v17.<minor>.<patch>` and optional
`-alpha.<n>` or `-rc.<n>` suffixes, requires the tag commit to be an ancestor of
`origin/main`, and retains the protected `official-release` environment.

For a candidate run, use Actions **Electron desktop candidates → Run workflow**
on a reviewed, committed ref, or the equivalent command:

```sh
gh workflow run electron.yml --ref <reviewed-committed-ref>
```

Once `electron.yml` is on the default branch, a successful manual run on that
branch automatically publishes a stable GitHub Release through its `publish` job;
use another branch for packaging-only checks. PR runs never publish. No Actions
dispatch, tag creation, or publication is performed by local workflow validation.
Do not tag or push a dirty branch as a release shortcut.

The release helper separates local evidence and publication checks:

- `node desktop/release.mjs plan`: validate root version/commit and resolve the
  five-target matrix.
- `node desktop/release.mjs record`: bind one target's runtime manifest,
  `acceptance.json`, version, commit, source archive where required, and every
  required installer format to hashed delivery files.
- `node desktop/release.mjs collect`: require exactly five complete same-commit
  native deliveries and create a fresh flat publication directory.
- `node desktop/release.mjs verify`: recheck target/format completeness, raw
  acceptance, source evidence, identity, sizes, SHA-256 values, index, and checksum
  inventory.
- `node desktop/release.mjs check-remote`: compare the uploaded draft's exact
  asset set, sizes, and REST `sha256:` digests against both verified local
  publication directories before public visibility. Read the draft metadata by
  numeric release id: the release-by-tag endpoint returns published releases only,
  so a draft lookup by tag is a 404. The optional
  `--tag v<version>-desktop.<packaging-run-id>` selects a version-bound candidate
  tag; without it the official `v<version>` tag contract is unchanged.

These checks reject missing/duplicate targets, mixed commits or versions,
missing formats, altered acceptance/checksums, and stale output directories.
There is no silent partial-release mode. None replaces the official evidence
gate.

### Linux ARM64 source and replacement/relink procedure

The Linux ARM64 delivery additionally requires
`aosp-winscope-desktop-<version>-linux-arm64-source.tar.gz`: the full tracked
application source at the exact release commit, produced with `git archive`
from a clean matching checkout. It is a separate required legal/source asset,
not one of the ten installers or a desktop binary archive. The packaged
`platform-tools` tree must also retain the original
binary DEBs, complete matching library/ADB source archives and Debian/Ubuntu
changes, signed APT indexes/metadata, notices, licenses, and provenance described
in [the bundler notes](../desktop/linux-adb-licenses.md). Those materials and the
app archive serve different purposes; neither replaces the other.

Users may inspect, debug, reverse engineer as permitted by the applicable
licenses, rebuild, and replace/relink the application and its libraries. This
distribution adds no source-inspection or reverse-engineering prohibition.
Integrity manifests detect unexpected files; they are not DRM or a secret-key
lock on modified builds. A user-controlled unsigned rebuild needs no project
private key or OS-signing credential. It is a modified local build, not an
official attested release.

Use a separate, user-controlled copy of the matching application source and a
native Ubuntu 24.04 ARM64 build environment; do not modify an installed app or
the official release directories in place. The concrete replacement route is:

1. Extract the application source archive, or check out the exact index commit.
   Install the pinned build prerequisites from this guide. On the supported
   shared Linux build host, build `dist/prod` and `ai/dist` from that same
   user-controlled source; copy them to the native ARM64 source tree. This also
   permits application changes without requiring a full Perfetto build on an
   unsupported native host.
2. In that native source tree, run `npm ci` and
   `node desktop/prepare.mjs --skip-web-build` to stage
   `dist/desktop/runtime/linux-arm64`. Do this before replacing files: preparing
   again would restore the official pinned components.
3. Rebuild the selected component from its retained `.dsc` and complete source
   set in a separate build directory using `dpkg-source -x <package>.dsc`, then
   `dpkg-buildpackage -b -uc -us` after installing its declared build
   dependencies. Extract the rebuilt DEB with `dpkg-deb -x <rebuilt.deb>
<extracted-directory>`; do not install it into the host or run maintainer
   scripts merely to replace an app library. Preserve compatible ARM64 ELF
   architecture, SONAMEs, ABI, and the documented glibc baseline.
4. Copy the rebuilt regular shared-library files into the staged
   `platform-tools/lib64/<SONAME>` paths, for example:

```sh
install -m 0644 /path/to/rebuilt/libusb-1.0.so.0 \
  dist/desktop/runtime/linux-arm64/platform-tools/lib64/libusb-1.0.so.0
```

If rebuilding ADB itself, replace staged `platform-tools/adb` with the ARM64
executable and preserve executable mode. This procedure supports same-provider,
ABI-compatible rebuilds; changes to provider/version or application policy must
also be made in the user-controlled source, not disguised as the locked Ubuntu
inputs. Retain corresponding modified sources, notices, and a record of local
changes; original signed provenance authenticates original inputs, not modified
outputs.

Regenerate both Web and runtime manifests in that private staged tree using the
exported helpers. They create new manifests exclusively, so remove only those
two generated manifest files first:

```sh
node --input-type=module <<'JS'
import {rm} from 'node:fs/promises';
import path from 'node:path';
import {createManifests, targetFor, verifyRuntime} from './desktop/prepare.mjs';

const target = targetFor();
if (target.key !== 'linux-arm64') throw new Error('Use native Linux ARM64');
const root = path.resolve('dist/desktop/runtime', target.key);
await rm(path.join(root, 'manifest.json'), {force: true});
await rm(path.join(root, 'runtime-manifest.json'), {force: true});
await createManifests(root, target);
await verifyRuntime(root, target);
JS
npx --no-install electron-builder --config desktop/electron-builder.cjs \
  --dir --arm64 --publish never -c.directories.output=dist/desktop/relinked
sudo chown root:root dist/desktop/relinked/linux-arm64-unpacked/chrome-sandbox
sudo chmod 4755 dist/desktop/relinked/linux-arm64-unpacked/chrome-sandbox
xvfb-run -a node desktop/smoke.mjs \
  --executable dist/desktop/relinked/linux-arm64-unpacked/aosp-winscope-desktop
npx --no-install electron-builder --config desktop/electron-builder.cjs \
  --prepackaged dist/desktop/relinked/linux-arm64-unpacked \
  --arm64 --publish never -c.directories.output=dist/desktop/relinked
```

Resolve the actual generated executable name if it differs from the example.
For an unpacked Linux smoke, establish `chrome-sandbox` ownership/mode as required
by Electron and the host (CI uses root ownership and mode `4755`); do not disable
the sandbox. Do not rerun `desktop:prepare`, `desktop:pack`, or `desktop:dist`
after replacement, because those wrappers restage pinned inputs. The direct
builder checks the regenerated manifests and packages the user-controlled
runtime without requiring a private signing key. Actual native execution,
replacement testing, GPG authentication, complete source delivery, and legal
review remain evidence requirements, not outcomes claimed by these instructions.

### Native DMG fallback

If electron-builder's build-only DMG tool download is unavailable, macOS can
create a local unsigned image from the same already smoke-tested `.app` using
its built-in image tool. This does not rebuild or modify the application:

```sh
stage=$(mktemp -d)
ditto "dist/desktop/packages/mac-arm64/AOSP WinScope.app" "$stage/AOSP WinScope.app"
ln -s /Applications "$stage/Applications"
hdiutil create -volname "AOSP WinScope" -srcfolder "$stage" -format UDZO \
  -o "dist/desktop/packages/AOSP WinScope-native-arm64.dmg"
hdiutil verify "dist/desktop/packages/AOSP WinScope-native-arm64.dmg"
```

Use the matching architecture's unpacked app. Do not overwrite an existing
artifact or installed app implicitly. On newer macOS releases `hdiutil` may
emit a deprecation notice; use the OS-documented `diskutil image` equivalent
when that system removes the compatibility command. Neither path signs or
notarizes the image.

### Local verification (2026-11-02)

macOS arm64 was built and tested with Electron 45.2.1, its Node 24.22.1 runtime,
Python 3.12.16 frozen capture, and Platform Tools 37.0.1. The unpacked app and
the app copied from the verified DMG into `~/Applications` both passed real
Electron startup with a restricted PATH, real Perfetto upload/viewing, AI gateway
and settings navigation, same-profile restart/language restoration, and owned
service shutdown. No physical Android device was attached; this proves the
capture service responds, not device recording acceptance.

Focused verification passed 48 desktop tests, 41 AI tests, 25 capture/security
Python tests, Go race tests/vet, TypeScript checking, production Web build,
dependency-lock verification, and workflow/format checks. The full Python run
still has two provenance-inventory failures; the repository's npm advisory
audit is also not clean. Neither is converted into a release pass here.

The local DMG used the native fallback because the builder-only DMG helper
download stalled; the ZIP and unpacked app were produced by electron-builder.
Windows, Linux, Intel macOS, public signing/notarization, installer upgrades,
and clean-machine acceptance remain separate native validation requirements.
Target CPU/OS labels do not imply compatibility with every OS version. This
historical check predates the expanded matrix: Linux x64 now uses Ubuntu 22.04
and Linux ARM64 Ubuntu 24.04 as their native build baselines.

This dated evidence is not a new verification of the five-target, ten-installer
contract. The historical ZIP is not a required output under the current contract,
and no PKG or MSI build or installation result is established by that evidence.
The new Linux ARM64 packager's real native/GPG path and hosted native CI have
not been executed locally. Final application-level source/license compliance,
all-platform installer acceptance, and public release approval remain open.

## CI delivery lane

[`.github/workflows/electron.yml`](../.github/workflows/electron.yml) packages Desktop installers
on manual dispatch or path-filtered pull requests and retains its reusable
`workflow_call` interface. It has no push, tag, or scheduled trigger. The duplicate
`package.yml` entry point, `official-release.yml`, `publish-candidate.yml`, and
`security.yml` remain removed. Its inline `publish` job automatically publishes
eligible candidates after the verified `bundle` job. There is no
standalone security-scan workflow. Local official-release and security commands
remain available; this candidate automation does not waive their validation contracts.

The packaging jobs have read-only repository permissions and immutable action SHAs.
Only the inline `publish` job receives `actions: read` and `contents: write`
through `GITHUB_TOKEN`.

The lineage audit is recorded separately and is not release approval. The
current checkout's unrecorded clean-room adaptation delta prevents that audit
from passing; candidate packaging does not bypass or relax the separate
release-validation requirements. Resolving the provenance inventory is a release task,
not evidence supplied by an Electron startup test.

In manual/PR candidate runs, the shared `ubuntu-24.04` job prepares/verifies pinned dependencies, builds the
production Web (including Trace Processor WASM) and AI once, and transfers
`dist/prod` and `ai/dist` as a same-run, same-commit artifact. Native jobs restore
those paths without running `deps:prepare` or a production Perfetto build:

- `macos-26-intel`: macOS x64.
- `macos-26`: macOS arm64.
- `windows-2025`: Windows x64.
- `ubuntu-22.04`: Linux x64.
- `ubuntu-24.04-arm`: Linux arm64.

The reusable interface can accept an already-built same-run, same-commit
`dist/prod` and `ai/dist` artifact and an expected release version. When supplied,
the workflow skips its shared build job and restores that artifact. No retained
repository workflow calls this interface; manual and PR runs build their own
shared inputs.

Each native job uses Python 3.12 and Go to stage the native frozen capture,
Launcher, and declared ADB provider via `--skip-web-build`. It builds a `--dir`
app, smoke-tests the packaged executable (Linux under Xvfb), then creates
installers from that tested unpacked app. CI overrides the output directory to
`dist/desktop/packages`. Installers are retained as workflow artifacts for seven
days; smoke logs/results and runtime manifests are retained separately even when
a native job fails. The packaged `acceptance.json` must contain two successful
runs of the actual packaged executable: real Perfetto trace upload/viewing,
settings/language persistence across same-profile restart, renderer isolation,
bundled capture/AI, and owned-service cleanup. Native reports and every format
must match the root version and commit. All five jobs must succeed before
collection; a failed target cannot silently become a partial release. There is
no automatic update feed. CI artifact upload is not release approval.
GitHub Actions may wrap transferred artifacts in ZIP transport; that is not a
portable ZIP distribution or a GitHub Release ZIP product.

### Candidate artifacts and public assets

Actions retains `electron-installers-<target>-<commit>` per native target,
`electron-evidence-<platform>-<arch>-<commit>` for diagnostics, and the verified
aggregate `electron-publication-<commit>`. In the per-target delivery,
`desktop-acceptance.json` preserves raw two-run acceptance and
`desktop-target-<target>.json` binds identity, compatibility, runtime-manifest
digest, acceptance, source archive where required, and installer sizes/hashes.

The flat aggregate is staged at `dist/desktop/public/<version>`. The GitHub
Release contract requires these ten installer names, using separate `x64` and
`arm64` packages for macOS and Linux and `x64` only for Windows:

- `aosp-winscope-desktop-<version>-darwin-<arch>.dmg` and `.pkg` (`x64`, `arm64`).
- `aosp-winscope-desktop-<version>-x64.exe` (NSIS) and `.msi`. The internal
  target ID remains `win32-x64`; only the published Windows asset name uses the
  shorter `x64` label.
- `aosp-winscope-desktop-<version>-linux-<arch>.deb` and `.rpm` (`x64`, `arm64`).

Builder-local names use `mac`/`win`; `record` normalizes them to `darwin`/`win32`
for publication. The aggregate also contains the Linux ARM64
`aosp-winscope-desktop-<version>-linux-arm64-source.tar.gz`, five
`desktop-target-<target>.json` reports, five
`desktop-acceptance-<target>.json` raw reports, `desktop-release.json`, and
`desktop-SHA256SUMS.txt`. The index identifies the version, source commit,
Electron version, unsigned status, all five targets/formats, and component
compatibility; its file inventory records names, sizes, and SHA-256 values.
`desktop-SHA256SUMS.txt` covers that index and every listed desktop file,
including the app source archive, but not itself. Preserve the `desktop-` checksum
namespace separately from the release-gate evidence inventory. Legacy portable
`release-index.json` and checksum contracts remain local/manual, not CI release
assets. The separate `dist/public/<version>` publication carries only
integrity/source/license/gate evidence, no portable executable or archive.
Names and local checksums alone do not prove provenance or OS trust. The retained
packaging workflow does not produce official OIDC attestations. Its successful
default-branch manual runs publish the stable desktop Release; this is not
official provenance or approval.

### Automatic Release And Trust Boundary

1. **Build gate:** the read-only native workflow requires all five targets,
   all ten installers (two required formats per target), Linux ARM64
   application-source delivery, packaged two-run acceptance, matching identity,
   and verified index/checksums. Passing yields
   Actions artifacts, not public release approval or a signing claim. Its
   separately recorded lineage audit cannot approve an official release.
2. **Release publication:** the inline `publish` job in `electron.yml` runs
   only after `bundle` succeeds for a `workflow_dispatch` on the repository's
   default branch. It uses the current run ID and source SHA, checks the commit
   against the default branch, and downloads only
   `electron-publication-<source-commit>` from that same run into the runner's
   temporary directory, outside the executable checkout. PR builds, reusable
   calls, and manually dispatched non-default branches do not gain publication
   credentials.
3. **Draft-first, complete publication:** after `verify` rechecks the entire
   aggregate, the publisher refuses an existing release or tag, creates
   `v<version>-desktop.<packaging-run-id>` at the packaged commit, and uploads
   the complete flat directory to an unpublished draft. Because the release-by-tag
   endpoint serves published releases only, the draft is read by its numeric
   release id. `check-remote --tag` requires the exact asset set, uploaded states,
   sizes, and REST SHA-256 digests; the tag
   must still point to the source commit. Only then does the workflow publish
   with `prerelease=false` and `make_latest=true`, making it the repository's stable Latest release. It does not rebuild, add portable ZIPs, or replace
   release assets. Upload/verification failures leave the
   draft unpublished (and may leave the new tag); reruns refuse existing state
   rather than clobbering it. Diagnose that state before a new packaging run.
4. **Not official release qualification:** no official OIDC provenance,
   Developer ID signing, notarization, protected approval, or complete external
   evidence is added. Existing local tools such as `scripts/installer_evidence.py`
   and `scripts/validate.py` remain available for separately authorized official
   release work. Existing provenance, advisory, and external-evidence failures
   are not waived by stable desktop publication.

The workflow must be committed to the default branch before a default-branch
manual dispatch can publish. Repository/organization policy must allow the job's
`contents: write` token permission and creation of the release tags; no PAT or
signing secret is configured by this change. Local unit tests and `actionlint`
validate wiring and failure behavior, not a hosted publication. Drafts remain
accessible to users with repository push access; unpublished is not a separate
confidentiality guarantee.

## Signing and evidence boundaries

The multi-platform release changes were locally checked on 2026-11-02 with
109 desktop/publication tests, 51 workflow/release-settings tests, 39 Linux ADB
bundler tests, 35 capture/security tests, Go race/vet, dependency-lock validation,
and Actionlint. The new macOS arm64 packaged app passed both acceptance runs,
including real Perfetto viewing, preference restoration, and owned-service exit.
Fresh Ubuntu metadata still contained all 19 binary and 13 complete source pins;
all 61 downloaded artifacts matched their pinned bytes. This availability audit
did not run real `gpgv` or native Ubuntu ARM64 assembly. Those operations remain
mandatory in the Linux ARM64 job before delivery. No hosted matrix execution or
GitHub publication was performed by this local verification.

Local/CI unsigned packaging is not Developer ID signing, Apple notarization,
Windows code signing, or approval by OS trust services. This lane disables
developer signing. Any ad-hoc signatures on bundled build inputs are not trusted
Developer ID signatures. A future signed release must sign nested native files,
regenerate their integrity-manifest hashes, then sign the outer app and notarize
it; signing after hashing would invalidate the runtime inventory. macOS
signing/notarization and Windows signing require separately provisioned external
credentials and a credentialed release policy. This lane does not use those
credentials and does not promise unsigned packages will pass Gatekeeper or
SmartScreen.

The candidate macOS jobs do ad-hoc sign the packaged bundle
(`codesign --force --deep --sign -`) after the unpacked application is produced
and before smoke testing and installer creation. That is not Developer ID trust
or notarization, but it makes the bundle signature structurally valid, so a
quarantined download reports the standard unverified-developer prompt with an
"Open Anyway" entry instead of Gatekeeper's "damaged" refusal. The signing step
does not touch `Contents/Resources/runtime` binaries because they are packaged
resources rather than nested code, so the runtime inventory digests recorded by
`desktop/prepare.mjs` remain valid and the packaged smoke still asserts the
bundled runtime. Local `desktop:dist` runs remain unsigned unless the operator
signs them explicitly.

A candidate downloaded through a browser carries the macOS quarantine flag. With
the candidate lane's ad-hoc signature, Gatekeeper reports it as an unverified
developer (not "damaged") and the operator can approve it once through
**System Settings → Privacy & Security → Security → Open Anyway**, or with
Control-click → Open on macOS 13/14. Clearing the download flag from the
installed copy works as well and needs no approval:

```sh
xattr -dr com.apple.quarantine "/Applications/AOSP WinScope.app"
```

A locally built, completely unsigned bundle (`npm run desktop:dist` without the
ad-hoc signing step) fails `codesign --verify`, so Gatekeeper refuses it as
"damaged" and offers no Open Anyway entry; only clearing the download flag or
signing the bundle makes it launchable. None of these steps signs, notarizes, or
vouches for the application, and they must be repeated for each newly downloaded
build. The equivalent Windows SmartScreen and Linux package prompts are also not
publisher authentication.

Local unsigned installer identity is limited to names and package metadata:
an app ID, bundle/package identifier, version, or installer filename is not an
authenticated publisher identity. An unsigned macOS PKG has no trusted Developer
ID Installer identity, just as an unsigned Windows EXE/MSI has no authenticated
code-signing publisher. Successfully creating or inspecting those files does
not prove installation, OS trust, or platform qualification. Do not bypass trust
checks to turn a local packaging result into a release claim.

GitHub OIDC attestations, when independently available for historical releases,
establish artifact provenance, not Apple Developer ID/notarization, Windows code
signing, Gatekeeper, or SmartScreen trust. Current Desktop CI does not create
those attestations. Calling artifacts an official GitHub Release does not change
their unsigned status or provision OS-signing credentials.

Static workflow validation proves syntax and wiring only. Unit tests prove their
asserted contracts. A native `--dir` smoke proves startup using that package on
that runner, not installer installation, profile-preserving upgrade/uninstall,
physical-device capture, external CLI authentication/model availability, or
official release qualification. A macOS local run proves nothing about Windows
or Linux execution. Keep each platform's hosted run results explicit; do not
describe the matrix as validated until those jobs actually pass.

Integration checks before the first delivery run: confirm `--skip-web-build`
consumes both supplied artifacts without rebuilding them, the builder includes
the complete frozen onedir tree outside ASAR, and `--executable` smoke selects
packaged resources and cleans up owned child processes on success and failure.

## References

- [ADR 0029: Electron desktop distribution](adr/0029-electron-desktop-distribution.md).
- [ADR 0030: Multi-platform desktop release](adr/0030-multi-platform-desktop-release.md).
- [GitHub-hosted runner reference](https://docs.github.com/en/actions/reference/runners/github-hosted-runners),
  native architecture labels checked November 2, 2026; label availability is not
  hosted-run evidence.
- [Electron v45.2.1 platform policy](https://github.com/electron/electron/blob/v45.2.1/README.md#platform-support)
  and [release assets](https://github.com/electron/electron/releases/tag/v45.2.1),
  not the builder's possible target flags.
- [PyInstaller 6.22.3 requirements](https://pyinstaller.org/en/v6.22.3/requirements.html)
  and [license](https://pyinstaller.org/en/v6.22.3/license.html), for native frozen
  runtime building and redistribution requirements.
- [electron-builder stable v26 CLI documentation](https://www.electron.build/v26/docs/cli),
  for `--dir`, `--prepackaged`, and publishing controls; the package pin is
  `26.18.1`, not the documentation site's unreleased v27 default.
- [Electron process sandboxing](https://www.electronjs.org/docs/latest/tutorial/sandbox),
  for the renderer isolation boundary; packaging does not waive it.
