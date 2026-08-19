# Android 17 Standalone WinScope Rebuild Plan

## Status

This document consolidates the decisions accepted during the `grill-with-docs` session. Product implementation begins only after the final shared-understanding confirmation. The ADRs under `docs/adr/` are authoritative when a summary here is ambiguous.

## Outcome

Rebuild this repository as a clean-room, standalone distribution of the pinned AOSP `android17-release` WinScope. A clean clone must build a complete browser-hosted product without an AOSP checkout, and AndroidPerformanceStudio (APS) must be able to consume either the pinned source repository or the same verified binary distribution without depending on internal source paths.

The first stable delivery is `17.0.0`. It preserves public Android 17 WinScope analysis and capture behavior except for explicitly approved privacy and security removals.

## Source and provenance boundary

### Product inputs

| Input | Repository/path | Accepted revision |
|---|---|---|
| WinScope | `platform/development/tools/winscope` | `4dafd114fab3c3d9543a5aff0ad097f479915176` |
| Perfetto | `platform/external/perfetto` | `ece66975738007dd0978b911d8a2077e49b8f31e` |

WinScope is acquired through a commit-addressed partial Git clone. The import verifies both the accepted revision and the `tools/winscope` subtree Git tree, then runs `git archive` against that tree object with the upstream commit timestamp as its normalized mtime. Archiving the tree object avoids embedding the downstream vendor commit identity. The canonical tar SHA-256 is recorded, but the nondeterministic compression bytes returned by the Gitiles HTTP archive endpoint are deliberately not treated as a stable integrity anchor. Perfetto acquisition evidence is established independently during its dependency-lock stage.

The Android 17 WinScope baseline evidence is:

| Evidence | Value |
|---|---|
| `tools/winscope` subtree Git tree | `36d46569800176ce00f60ef27c7dfcca1e967886` |
| Upstream commit epoch / canonical tar mtime | `1778818815` |
| Canonical uncompressed tar SHA-256 | `9ed6c973ae70296f85b47a712f80e65719adacb63f5eaf5956b47ff7147db465` |
| Git files in the imported subtree | `1086` |

### Context revisions

| Context | Repository | Accepted revision |
|---|---|---|
| Android Framework | `platform/frameworks/base` | `94b4c163b7dfe5ce3607f7bb8456f9573f7de57d` |
| SystemUI/WMShell | `platform/frameworks/libs/systemui` | `11e04f60f563aed48e4ec080bd7bde06bae1b2f3` |

Context revisions are diagnostic metadata. They are not downloaded, copied, or consumed by the build unless a future ADR promotes a proven dependency to a Product Input.

### Clean-room rule

The deleted Android 16-era implementation is retained only in Git history and is not an implementation reference. The rebuilt product cannot reuse its source, generated output, WASM, protos, scripts, configuration, media, README text, tests, fixtures, or capture configuration. Equivalent assets come from the pinned Android 17 inputs or are newly authored with provenance.

## Repository and synchronization model

The repository root is the npm product root:

```text
AOSP-WinScope/
├── package.json
├── package-lock.json
├── angular.json
├── src/
├── protos/
├── configs/
├── build/
├── cmd/launcher/
├── scripts/
├── docs/
├── CONTEXT.md
└── upstream metadata
```

`upstream/android17-release` is a pure vendor branch containing verified exports of `development/tools/winscope`. Main merges vendor imports and carries standalone adaptations directly. Synchronization uses an explicit revision, reports the full delta, surfaces conflicts for human resolution, and never follows a moving head, commits, pushes, deletes branches, or resolves conflicts automatically.

## Build contract

The developer-facing contract remains:

```bash
npm ci
npm run build:prod
```

It succeeds outside AOSP with no `ANDROID_BUILD_TOP` and no legacy or pre-generated output. The first build may obtain declared dependencies; valid caches support later builds.

Official CI separates preparation from compilation:

```text
verify toolchain
    -> prepare all locked dependencies with network access
    -> verify cache and disable external networking
    -> build, test, and package offline
```

`build/dependencies.lock.json` describes the complete direct and transitive dependency closure, including immutable identity, integrity, origin, platform, license, introducer, and distribution status. A generated-lock comparison fails rather than silently updating inputs.

### Fixed tools

- Node.js `24.19.0`
- npm `11.17.0`
- Go `1.26.6`
- Python 3.11 through 3.13; official CI uses Python 3.12

Official release compilation occurs in a digest-pinned Linux x86_64 image. macOS arm64 is also a release-gated source-build environment, but it does not sign official core archives.

## Standalone adaptation boundary

The imported source is changed locally in auditable commits. A second immutable source directory, runtime patch application, nested AOSP submodule, and full AOSP checkout are all rejected.

Required adaptation areas include:

- replace AOSP-relative Perfetto and proto paths with declared dependency paths;
- prepare and build the pinned Trace Processor JS/WASM from source;
- remove runtime analytics, Auth0, remote fonts/CDNs, and non-public remote-tool paths;
- bundle all runtime assets locally;
- add a restrictive Content Security Policy and runtime external-request enforcement;
- replace hard-coded proxy configuration with the Runtime Configuration Contract;
- constrain persistence, logging, proxy access, and device cleanup;
- produce relocatable Web output, manifests, launchers, licenses, SBOM, and release evidence.

## Distribution Contract

The stable release layout is:

```text
aosp-winscope/
├── web/
│   ├── index.html
│   ├── JavaScript and CSS
│   ├── trace_processor WASM
│   └── local assets
├── bin/
│   ├── windows-amd64/winscope-launcher.exe
│   ├── windows-arm64/winscope-launcher.exe
│   ├── darwin-amd64/winscope-launcher
│   ├── darwin-arm64/winscope-launcher
│   ├── linux-amd64/winscope-launcher
│   └── linux-arm64/winscope-launcher
├── proxy/winscope_proxy.py
├── manifest.json
├── README.txt
└── LICENSES/
    ├── LICENSE
    ├── NOTICE
    ├── third-party/
    ├── sbom.spdx.json
    └── attribution.json
```

APS relies only on `web/` and the schema-versioned `manifest.json`. It cannot depend on hashed bundle names or source paths. All Web resource URLs are relative, non-root mounting is validated, and no static-server port is embedded.

APS development may pin a source submodule and explicitly build it. APS release CI may instead verify and unpack `aosp-winscope-<version>.zip` without Node, npm, Python, Go, or Perfetto build tools. Both routes converge on identical Web bytes and manifest semantics.

The first release declares no APS bridge. A future bridge has an independent protocol version and negotiated capability; it reuses the core distribution rather than creating an APS fork.

## Runtime Configuration Contract

The immutable Web application fetches a bounded, schema-validated, non-redirecting, same-origin, `no-store` `./runtime-config.json`.

Version 1 supports:

- `host.kind: standalone`;
- `capture.provider: none`;
- `capture.provider: loopback-proxy-v1` through a relative same-origin endpoint.

Failure or an unsupported required schema safely degrades to file-only analysis with a clear diagnostic. Unknown optional fields are ignored. Session secrets are memory-only and never enter URLs, logs, persistent storage, or release metadata. Future APS configuration adds its own host identity and bridge provider.

## Native launcher and capture

One Web build is packaged with minimal standard-library, `CGO_ENABLED=0` Go launchers for Windows, macOS, and Linux on amd64 and arm64. The launcher:

- verifies the manifest and critical assets;
- binds only `127.0.0.1` on an OS-selected port by default;
- serves correct MIME, CSP, and security headers;
- opens or prints the local URL;
- provides runtime configuration;
- optionally checks Python/ADB and manages a capture proxy session;
- stops only its own services and child processes.

It does not analyze traces, download or install tools, update itself, elevate privileges, change firewall/registry configuration, or run arbitrary Host shell.

Capture uses a fresh launcher-scoped secret and an exact same-origin reverse-proxy path. Wildcard CORS, persistent home-directory tokens, hard-coded `localhost:5544`, null origins, and direct cross-origin production access are removed. Origin, Host, authentication, content type, methods, body size, path, and command arguments are validated. The required upstream ADB behavior remains available only to the authenticated session and uses argument-vector execution.

## Runtime privacy and data lifecycle

Trace data and derived content remain within the Local Analysis Boundary: browser memory/workers and declared loopback services. No automatic non-loopback runtime request is allowed. Explicitly clicked documentation links are the only external-navigation exception.

Imported or collected trace bytes are not written to Host storage unless the user explicitly exports them. Persistent browser state is allowlisted to non-sensitive display preferences and explicitly saved queries; recent searches, paths, trace/device identity, derived values, endpoints, ports, and secrets are excluded. Users can clear all local WinScope state or run in no-persistence privacy mode.

The device may retain only the latest disclosed Recovery Capture. A new capture replaces it; explicit deletion is available; privacy mode deletes it after successful transfer. Session/config/status/signal artifacts are always cleaned and cleanup failures are visible.

Default diagnostics are session-memory-only and redact secrets, trace bytes, full commands/output, user paths, and full device serials. Enhanced diagnostic export requires explicit informed opt-in and never includes tokens or trace contents.

## Feature and compatibility contract

Except for approved security removals, unavailable non-public vendor/Wayland extensions, and deferred APS integration, `17.0.0` retains the pinned public Android 17 functionality:

- Perfetto and retained legacy readers;
- WindowManager and SurfaceFlinger hierarchy, properties, 2D/3D rect views, timelines, and playback;
- Transactions, Transitions, ProtoLog, Input, IME, ViewCapture, CUJ, and Search;
- screenshot and screen recording workflows;
- upstream proxy device discovery, configuration, capture, stop, recovery, and file transfer behavior.

Validation tiers are explicit:

- Android 17: mandatory real-device capture and import validation;
- Android 15/16: fixture validation plus separately reported device validation when available;
- older formats: only the legacy import compatibility retained by the pinned Android 17 source.

Capabilities derive from actual device/trace content, not API level alone. Missing producers degrade independently with diagnostics. No claim covers arbitrary vendor ROMs, data not produced by the device, or unvalidated future Android versions.

## Platform support

### Source build

Release-gated:

- Linux x86_64
- macOS arm64

Initially compatible but non-blocking:

- Linux arm64
- macOS x86_64

Windows source builds are not a first-release requirement.

### Runtime

The release archive supports Windows, macOS, and Linux on amd64 and arm64 through current and previous stable Chrome/Edge. `file://`, Safari, Firefox, mobile browsers, and embedded JCEF are not first-release supported environments. Embed readiness is nevertheless checked through relative paths, non-root hosting, local assets, and absence of popup/auth startup dependencies.

Pure offline analysis needs no external runtime. Device collection additionally needs supported Python, ADB, and a compatible device.

## Versioning and support

Versions use `17.<baseline-generation>.<adaptation-patch>`:

- development begins at `17.0.0-alpha.1`;
- the first stable version is `17.0.0`;
- a changed Product Input advances the baseline generation and resets patch;
- standalone-only changes advance patch;
- Android 18 begins `18.0.0`;
- bridge protocol versions are independent.

Only the latest patch of the current baseline is fully supported. The latest patch of the previous baseline receives 90 days of security transition support. Older generations and superseded patches are EOL. After Android 18 standalone stable, the last Android 17 generation receives 12 months of security support unless an explicit APS requirement extends it. EOL evidence and advisories remain available.

## Reproducibility and release evidence

Two isolated cold-cache builds of the same tag in the pinned Linux image must produce identical `dist` trees and release ZIP SHA-256 values. The build uses commit-derived `SOURCE_DATE_EPOCH` and normalized paths, ordering, modes, timestamps, compression, manifests, and source maps. Nondeterministic WinScope or Perfetto output is a defect.

Every release provides:

- immutable core ZIP and `SHA256SUMS`;
- SPDX 2.3 SBOM and redistribution evidence;
- source/dependency reconstruction bundle with digest;
- machine-readable validation and benchmark reports;
- in-toto/Sigstore GitHub OIDC provenance.

Official publication requires a protected `v17.x.y` tag on reviewed `main`, a protected GitHub Environment approval, digest-pinned actions and build image, and a fresh two-build verification. Artifacts are never overwritten. APS verifies archive digest, attested repository/workflow/tag identity, and internal manifest integrity.

Platform code signing/notarization may later wrap the reproducible core as separate artifacts; it does not replace project attestation or change the APS-consumed ZIP.

## License and supply-chain gates

The repository and archive preserve AOSP notices and carry complete license, NOTICE, attribution, and SPDX evidence for all distributed code, WASM, fonts, images, and scripts. Unknown licenses, untracked assets, SBOM drift, or unapproved restrictive/copyleft terms block release. APS can redistribute `LICENSES/` without recreating dependency analysis.

PR, weekly, and release workflows perform dependency, OSV, CodeQL, Go vulnerability, secret, CSP/network, dependency-review, and hostile-input scanning. Critical/High runtime or build-chain findings block release unless a documented expiring exception proves non-reachability. Security fixes never replace existing artifacts; they create new patch or baseline-generation releases and downstream APS deliberately repins.

## Performance gate

Each baseline generation compares upstream and standalone builds under the same environment, tools, datasets, and fixed statistical method. Versioned public/synthetic fixtures cover small through large traces, multiple viewers, legacy input, media, deep hierarchies, and high event volumes.

The default regression budget is 10% for medians of critical startup/import/interaction timings, peak memory, and compressed Web size. Approved local-security assets receive an explicit one-time cost baseline. Launcher size is separate. Machine-readable reports are release evidence for APS.

## Evidence-gated delivery stages

1. **Remove legacy inputs** — no new product reference to Android 16-era assets.
2. **Import pure Android 17 baseline** — verified vendor branch and provenance inventory.
3. **Establish standalone build** — cold build outside AOSP, then offline compilation and upstream tests.
4. **Produce secure relocatable Web output** — local assets, CSP, no external runtime requests, runtime configuration, persistence boundary.
5. **Add launcher and authenticated capture** — six launchers, same-origin session, hostile-request/ADB tests, cleanup.
6. **Build release engineering** — normalized ZIP, SBOM/licenses, dependency bundle, double-build equality, attestation.
7. **Complete feature/compatibility/performance validation** — upstream unit/E2E, production-dist E2E, supported browsers/platforms, Android devices, benchmarks, vulnerability and license gates.
8. **Publish candidate and stable release** — alpha, `17.0.0-rc.1`, frozen inputs, protected `v17.0.0`, complete evidence, APS integration guide.

Every stage produces machine-readable verification evidence. Pure vendor imports, one class of adaptation, and its tests remain reviewable commits. `.deps/`, `node_modules/`, transient output, and real device traces are not committed.

## Definition of done for `17.0.0`

The work is complete only when all of the following are true:

1. Product lineage is provably the accepted Android 17 inputs with no legacy project asset reuse.
2. `npm ci && npm run build:prod` succeeds from a clean clone without AOSP.
3. Official compilation and tests succeed with external networking disabled after dependency preparation.
4. The public upstream feature matrix passes except for explicitly accepted removals.
5. Runtime makes no automatic non-loopback request and the proxy resists unauthorized browser access.
6. The Web tree is relocatable and consumable by both the source and archive APS modes.
7. Supported launchers work; offline-only use has no external runtime dependency.
8. Android 17 real-device capture/import validation passes and other Android evidence is accurately tiered.
9. Performance, memory, size, license, SBOM, vulnerability, and hostile-input gates pass.
10. Two official cold builds produce byte-identical output and verified provenance.
11. `v17.0.0` publishes all declared artifacts, reports, verification instructions, and APS consumption guidance.

## Values discovered during implementation

The following are evidence values, not open product decisions, and are filled in by their owning stages:

- verified Perfetto dependency-archive and release-archive SHA-256 values;
- the digest of the official Linux build image;
- generated dependency-closure entries and licenses;
- normalized release-file digests;
- benchmark measurements;
- Android device fingerprints and available data sources in private validation;
- CI action commit SHAs and attestation identities.

Any evidence that contradicts an accepted assumption stops the dependent stage and triggers an explicit decision update rather than a silent workaround.
