# ADR 0030: Multi-Platform Desktop Release

## Status

Accepted for implementation on 2026-11-02; implementation and native hosted
qualification are underway. This is a release contract, not a report of five
passing hosted jobs, completed source/license compliance, signing, or a published
release. It supersedes ADR 0029's four-target and candidate-only delivery scope,
not its runtime or security decisions.

CI distribution policy updated on 2026-11-04: native installers and required
evidence only; no portable executable/archive generation in GitHub workflows.
Candidate publication is limited to the verified native aggregate. Local/manual
legacy CLI contracts are retained.

CI automation updated on 2026-11-04: retain `electron.yml` for Desktop packaging,
native smoke checks, and artifact uploads; publish successful default-branch manual
builds as stable Releases after local and remote asset verification. The
separate packaging entry point, protected official-release workflow, old manual
candidate publisher, and standalone security workflow remain removed. This
candidate automation does not restore official release authority or weaken the
native/local/manual trust contracts.

Desktop target scope updated on 2026-11-05: removed the `darwin-x64` (macOS Intel)
target temporarily. A subsequent request on the same day restored native Intel
packaging on `macos-26-intel`. The current contract requires five native targets
and ten installer assets; macOS ships separate x64 and arm64 packages.

Publisher draft metadata updated on 2026-11-05: the inline publisher reads an
unpublished draft by numeric release id (GraphQL `databaseId`) because GitHub's
release-by-tag endpoint serves published releases only and answers 404 for drafts.
The same id is used to publish with `draft=false`.

CI workflow consolidated on 2026-11-05: packaging and candidate publication now
run from the same `.github/workflows/electron.yml` file. The `publish` job is
dependent on the verified `bundle` job and is gated to successful manual dispatches
on the default branch.

## Context

Users need native Intel and Apple Silicon macOS packages, Windows AMD64
packages, and Linux x64 and ARM64 packages available together in GitHub
Releases. A target flag alone cannot supply an Electron binary, native frozen
Python/Go runtime, compatible ADB, or trustworthy acceptance evidence. The
historical official portable release established protected approval, provenance,
reproducibility, device, performance, vulnerability, and APS-consumer contracts.
Native-only CI must preserve the full validation and release authority without
generating or publishing legacy portable products or rebuilding a second
unrelated Web/Perfetto product. Legacy packaging and APS CLI tools remain
available for explicitly manual/local use.

## Decision

### One native target registry

Use [`desktop/app/targets.cjs`](../../desktop/app/targets.cjs) as the single source
of truth for targets, component architectures, runner selection, and formats:

- `darwin-x64`: `macos-26-intel`, DMG and PKG only.
- `darwin-arm64`: `macos-26`, DMG and PKG only.
- `win32-x64`: `windows-2025`, NSIS EXE and MSI only.
- `linux-x64`: `ubuntu-22.04`, DEB and RPM only.
- `linux-arm64`: `ubuntu-24.04-arm`, DEB and RPM only.

Require all **five targets and ten installer assets**, plus the separate Linux
ARM64 application-source asset described below. Windows ARM64 desktop and
desktop ZIP, AppImage, and binary tar.gz outputs are excluded. CI also generates
and publishes no portable Launcher ZIPs. This policy does not remove the required
source tar.gz, metadata, checksums, or evidence, or delete local/manual portable
Launcher and APS CLI contracts.
Pin Electron `45.2.1`, electron-builder `26.18.1`, and PyInstaller `6.22.3`;
build Electron, frozen
capture, and Go for the matching native OS/CPU. macOS minimum is 13 under
Electron's policy and Windows x64 minimum is 10.
Ship macOS applications as separate native Intel and Apple Silicon packages, not a
universal macOS package. Windows ia32, Linux armv7, and Linux riscv64 have no
official Electron `45.2.1` assets and are excluded. Windows ia32/Linux armv7 were
removed in Electron 44; additional builder flags do not restore those assets.

### Disclose component compatibility

Use Google Platform Tools `37.0.1` for macOS and Linux x64, preserving its
notices, metadata, and required companion libraries. The macOS ADB binary is
universal, but must contain the target architecture. Both Windows x64 installer
formats use the official Google `37.0.1` **PE ia32 ADB and DLLs**, not x64 ADB.
Electron, Go, and frozen capture remain native x64. USB drivers, authorization,
and OS rights remain prerequisites. Validate actual binary headers and publish
the component architecture metadata.

Linux x64 uses the Ubuntu 22.04 native runner baseline. Linux ARM64 uses genuine
native Ubuntu 24.04 ADB `34.0.4`, Debian package `1:34.0.4-1build3`, with bounded
redistributed shared libraries, rather than relabeling Google's Linux x64 ADB.
It requires glibc 2.38 or later and the host's loader/glibc. Ubuntu 24.04 is the
initial supported ARM64 distribution; DEB/RPM formats do not establish
compatibility with every Linux distribution.

### Preserve corresponding sources and replacement rights

The ARM64 provider must verify original Ubuntu `InRelease` GPG signatures and
authenticated binary/source index records, enforce locked hashes/sizes and
bounded extraction/ELF dependencies, and retain original binary DEBs, full
corresponding source archives and Debian/Ubuntu changes, signed indexes,
license texts, notices, and provenance for redistributed components. Missing or
unverifiable evidence fails closed; source URLs alone are not enough.

Additionally deliver
`aosp-winscope-desktop-<version>-linux-arm64-source.tar.gz`, containing the full
tracked application at the exact release commit. Generate it with `git archive`
only after confirming the checkout is clean and `HEAD` matches the release
commit. Bind its name, size, and SHA-256 into the target report, aggregate index,
and desktop checksum inventory. The app source archive complements, rather than
replaces, the bundled ADB/library source and package evidence. It is not an
installer and is not counted among the ten installer assets.

Provide a concrete user-controlled replacement/relink route in
[Electron Desktop](../ELECTRON.md#linux-arm64-source-and-replacementrelink-procedure):
build the matching user-controlled application source/shared Web and AI, stage
the native runtime, rebuild selected libraries from retained sources, copy
ABI-compatible ARM64 regular files into staged `platform-tools/lib64`, then
regenerate both Web and runtime manifests using exported `createManifests` and
`verifyRuntime` before invoking electron-builder directly. Do not rerun prepare
after replacement, because that would restore the locked components. Preserve
modified sources/notices and distinguish the modified build from authenticated
original Ubuntu inputs and official attestation.

Integrity is not DRM. The route must not require project private keys or
OS-signing credentials, and this distribution adds no source-inspection,
debugging, or reverse-engineering prohibition. Applicable licenses govern those
rights. Application-level replacement/relink rights and the necessary
source/object/build materials still require review. This decision is not legal
approval: source delivery and hash tests alone do not establish compliance, and
the license gate remains open until actual native bundle/GPG verification and
the application-level review are complete. See
[the bundler's license and rebuilding requirements](../../desktop/linux-adb-licenses.md)
and [ADR 0017](0017-ship-redistribution-evidence-with-every-release.md).

### Reuse the canonical shared build

Keep [`electron.yml`](../../.github/workflows/electron.yml) reusable through
`workflow_call`, in addition to manual and path-filtered PR candidate runs. Its
packaging jobs are read-only; the inline `publish` job consumes the verified
aggregate after eligible manual default-branch runs. The duplicate `package.yml`
entry point remains removed. Neither adds a push or scheduled trigger.
Manual/PR runs build shared Web, Trace Processor WASM,
and AI once through the pinned Linux build pipeline. Native jobs consume same-run, same-commit
`dist/prod` and `ai/dist` via `--skip-web-build`; they must not silently rebuild
missing shared inputs or run a full Perfetto build on unsupported native hosts.

The reusable interface still accepts a same-run, same-commit Web/AI artifact and
expected release version, skipping the shared-build job when supplied. No
retained repository workflow calls it. Each native job builds its own frozen capture/Go
runtime and ADB provider, tests the actual `--dir` packaged executable, then
creates every required format from that tested app.

For local/manual release validation, `release:double-build` and `release:package` can pass
`--version "$AOSP_WINSCOPE_VERSION" --unpacked-only`. Retain uncompressed target
directories and internal attestation for reproducibility and the full Stage 7
gate, without generating ZIP files. Default `scripts/release.py verify`
auto-detects the tree; `validate.py gate --release dist/release` must retain
`--require-complete`, all dynamic unit/E2E/production E2E/offline/security checks,
and every protected external evidence input. These internal inputs are not
portable distribution assets.

### Bind identity and acceptance to every format

Use [`desktop/release.mjs`](../../desktop/release.mjs) for `plan`, `record`,
`collect`, `verify`, and `check-remote`. The root package version must already
equal the release tag without its leading `v`; never mutate it automatically in
CI. `plan --commit "$(git rev-parse HEAD)"` resolves the current root version and
matrix; `--version <version>` additionally checks an intended version. Planning
does not make a dirty checkout releasable.

`record` requires the runtime inventory and raw `acceptance.json` to match the
target and binds version, source commit, Electron pin, compatibility, manifest
digest, application-source archive where required, and all installer
sizes/hashes. Acceptance requires exactly two successful packaged runs: real
Perfetto trace upload/viewing, bundled capture and AI, renderer isolation,
settings/language persistence across same-profile restart, and cleanup of owned
services. Preserve raw acceptance as well as its summary so collection can
revalidate it.

`collect` requires exactly five same-commit native delivery artifacts and a fresh
output directory. `verify` rechecks every target, format, raw acceptance report,
source asset, identity, size, digest, and exact file/checksum inventory. Reject
partial, duplicate, mixed-version/commit, stale, or altered deliveries. All five
native jobs must succeed; there is no silent allow-partial mode.

### Packaging Artifacts And Automatic Release

The candidate gate produces Actions artifacts, not official publication:
`electron-installers-<target>-<commit>` and
`electron-evidence-<platform>-<arch>-<commit>`, followed by the complete verified
`electron-publication-<commit>`. Retain diagnostics on failure. A separately
recorded lineage audit does not approve a release or waive official lineage
failure.

The inline `publish` job uses the completed `bundle` aggregate to publish only
successful manual builds on the same repository's default branch. PRs, reusable
calls, other branches, failures, and cancellations do not publish. Revalidate the
current run's exact source SHA, default-branch ancestry, and complete aggregate
before creating any release state.
Create a unique `v<version>-desktop.<packaging-run-id>` tag at the source commit,
refuse existing tags/releases, and upload all desktop files to an unpublished draft.
Fetch the unpublished draft by numeric release id rather than by tag: the
release-by-tag endpoint returns published releases only. Reuse
`desktop/release.mjs check-remote --tag` to verify exact asset names,
uploaded states, sizes, and REST SHA-256 digests, then recheck the tag's source
SHA before publishing with `prerelease=false` and `make_latest=true`. Failures
leave the draft unpublished; reruns never overwrite it. Only this `publish` job gets
`contents: write`; packaging stays read-only and all actions stay SHA-pinned.

Tags do not trigger packaging. The protected official publisher remains absent.
`scripts/installer_evidence.py` and official validation tools remain local/manual;
their lineage, external-evidence, and approval requirements are unchanged.
GitHub workflows invoke neither `publish.py` nor `verify-aps-release.py`, and
never publish raw protected external secret manifests. Stable desktop Releases are not OIDC-attested official releases and do not waive
provenance or advisory blockers to separately authorized official release work.

For separately authorized local/manual publication, stage release evidence and
desktop assets in separate verified flat directories,
`dist/public/<version>` and `dist/desktop/public/<version>`. The former contains
only integrity/source/license/gate evidence, no portable executable or archive;
the latter contains the ten native installers and required source/metadata.
Publish both inventories in one release for the tag. Refuse any existing release,
including a prior draft;
never clobber or automatically overwrite it. Create the new release as a draft,
upload both complete asset sets, then read its actual GitHub REST asset metadata.
`check-remote --desktop <desktop-directory> --evidence <evidence-directory>` must
require the matching unpublished draft/tag and compare exact
combined names, uploaded state, byte sizes, and REST SHA-256 digests against both
local directories. Only after that check succeeds may the publisher set
`draft=false`. A local checksum pass alone is insufficient. Failed uploads or
verification leave the draft unpublished for operator diagnosis, not automatic
replacement.
Actions artifact transfer may still use ZIP transport, but that is not a release
ZIP product or permission to generate portable archives in CI.

### Stable public assets and trust boundaries

Normalize installer names to
`aosp-winscope-desktop-<version>-<platform>-<arch>.<format>`, with `darwin`,
`win32`, or `linux` platform identifiers. Require `.dmg`/`.pkg` for
each `darwin-x64` and `darwin-arm64`, `.exe` (NSIS)/`.msi` for `win32-x64` only, and
`.deb`/`.rpm` for each `linux-x64` and `linux-arm64`.
The desktop flat directory also carries the Linux ARM64 full application-source
archive, five `desktop-target-<target>.json` reports, five
`desktop-acceptance-<target>.json` raw acceptance reports,
`desktop-release.json`, and `desktop-SHA256SUMS.txt`. The index records identity,
unsigned status, targets/formats, compatibility, and per-file sizes/digests.
The checksum file covers the index and every indexed desktop file, including
the source archive but excluding itself. Preserve its `desktop-` checksum
namespace separately from the release-gate evidence inventory. Legacy portable
`release-index.json` and checksum files remain local/manual CLI contracts, not
assets in current Desktop CI.

These are explicitly unsigned packages: no Apple Developer ID/notarization and
no Windows code signing are supplied by this lane. Current CI does not create
OIDC attestations. Such attestations bind provenance when independently available;
they are not OS trust, Gatekeeper/SmartScreen approval, or evidence
that every installer/source-license obligation is satisfied. Preserve ADR 0029's
sandbox, loopback-only service boundaries, no startup downloads, user-owned
provider credentials, and profile retention. Any future OS signing must sign
inner binaries before regenerating runtime hashes and signing the outer app.

Local unsigned installer names, app IDs, bundle/package identifiers, and version
metadata are not authenticated publisher identities. In particular, an unsigned
PKG has no trusted Developer ID Installer identity, and unsigned EXE/MSI files
have no authenticated code-signing publisher. File creation and metadata checks
do not establish OS trust or successful native installation; these remain
separate qualification requirements.

## Consequences

- One packaging workflow lets users choose an honest native host/component
  combination from Actions artifacts; release publication and legacy CLI
  contracts remain separate local/manual work.
- Native runners and all required formats increase CI cost; a missing target or
  evidence blocks the complete release instead of reducing coverage silently.
- Windows desktop is x64-only with explicitly declared ia32 ADB; Linux ARM64 has
  an explicit Ubuntu/glibc and source/license-evidence boundary.
- Package startup is distinct from installer installation, update/uninstall,
  physical-device capture, external AI access, OS trust, and release approval.

## Validation and Remaining Evidence

Keep the dated 2026-11-02 macOS ARM64 local results in
[Electron Desktop](../ELECTRON.md) as historical, platform-specific evidence.
They do not prove Intel macOS, Windows, Linux, all ten installers, native Linux
ARM64 GPG/source assembly, or hosted release execution. Real native Linux ARM64
GPG/packager and replacement-path execution, complete application source/license
review, five hosted target acceptances with two-run reports, installer
upgrade/clean-machine acceptance, and the unchanged official gates remain
evidence requirements. Historical ZIP output remains historical evidence, not a
current required installer; it does not establish PKG/MSI qualification under
the revised contract. No hosted platform pass, tag push, Actions dispatch,
commit, or publication is claimed by this documentation-only change.

## References

- [ADR 0029](0029-electron-desktop-distribution.md) and
  [protected immutable release policy](0021-attest-immutable-releases-from-a-protected-workflow.md).
- [GitHub-hosted runner reference](https://docs.github.com/en/actions/reference/runners/github-hosted-runners).
- [Electron v45.2.1 platform support](https://github.com/electron/electron/blob/v45.2.1/README.md#platform-support)
  and [actual release assets](https://github.com/electron/electron/releases/tag/v45.2.1).
- [PyInstaller 6.22.3 requirements](https://pyinstaller.org/en/v6.22.3/requirements.html)
  and [license](https://pyinstaller.org/en/v6.22.3/license.html).
- [Developer commands, artifact inventory, and evidence boundaries](../ELECTRON.md).
