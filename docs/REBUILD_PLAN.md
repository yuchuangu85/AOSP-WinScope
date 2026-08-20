# Android 17 Standalone WinScope Rebuild Plan

## Status

This document consolidates the decisions accepted during the `grill-with-docs` session. Product implementation begins only after the final shared-understanding confirmation. The ADRs under `docs/adr/` are authoritative when a summary here is ambiguous.

## Outcome

Rebuild this repository as a clean-room, standalone distribution of the pinned AOSP `android17-release` WinScope. A clean clone must build a complete browser-hosted product without an AOSP checkout, and AndroidPerformanceStudio (APS) must be able to consume either the pinned source repository or the same verified binary distribution without depending on internal source paths.

The first stable delivery is `17.0.0`. It preserves public Android 17 WinScope analysis and capture behavior except for explicitly approved privacy and security removals.

## Source and provenance boundary

### Product inputs

| Input    | Repository/path                       | Accepted revision                          |
| -------- | ------------------------------------- | ------------------------------------------ |
| WinScope | `platform/development/tools/winscope` | `4dafd114fab3c3d9543a5aff0ad097f479915176` |
| Perfetto | `platform/external/perfetto`          | `ece66975738007dd0978b911d8a2077e49b8f31e` |

WinScope is acquired through a commit-addressed partial Git clone. The import verifies both the accepted revision and the `tools/winscope` subtree Git tree, then runs `git archive` against that tree object with the upstream commit timestamp as its normalized mtime. Archiving the tree object avoids embedding the downstream vendor commit identity. The canonical tar SHA-256 is recorded, but the nondeterministic compression bytes returned by the Gitiles HTTP archive endpoint are deliberately not treated as a stable integrity anchor. Perfetto acquisition evidence is established independently during its dependency-lock stage.

The Android 17 WinScope baseline evidence is:

| Evidence                                    | Value                                                              |
| ------------------------------------------- | ------------------------------------------------------------------ |
| `tools/winscope` subtree Git tree           | `36d46569800176ce00f60ef27c7dfcca1e967886`                         |
| Perfetto source Git tree                    | `201a16e409911aa016522a95143af2e5d52a3662`                         |
| Upstream commit epoch / canonical tar mtime | `1778818815`                                                       |
| Canonical uncompressed tar SHA-256          | `9ed6c973ae70296f85b47a712f80e65719adacb63f5eaf5956b47ff7147db465` |
| Git files in the imported subtree           | `1086`                                                             |

Run `python3 scripts/verify-baseline.py --json` from the repository root to verify the fixed identities, orphan vendor branch and tree, canonical tar, per-file vendor inventory, toolchain declarations, prohibited legacy paths, and the complete current product delta recorded as newly authored clean-room adaptation.

### Context revisions

| Context           | Repository                          | Accepted revision                          |
| ----------------- | ----------------------------------- | ------------------------------------------ |
| Android Framework | `platform/frameworks/base`          | `94b4c163b7dfe5ce3607f7bb8456f9573f7de57d` |
| SystemUI/WMShell  | `platform/frameworks/libs/systemui` | `11e04f60f563aed48e4ec080bd7bde06bae1b2f3` |

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

The dependency preparation contract is executable from a clean checkout:

```bash
npm run toolchain:verify
npm run deps:prepare
npm run deps:verify
npm run deps:offline-check
```

`deps:prepare` is the only network-enabled step. It checks out the fixed Perfetto commit and tree, fills the ignored `.deps/` cache from declared origins, forces npm and pnpm to the public npm registry, records the platform-specific `grpc-tools` build binary, and prepares complete (non-partial) Perfetto Git repositories plus its archive and pnpm inputs. A first `build:prod` delegates to this same preparation operation when `.deps/` is entirely absent; a partial or corrupt cache fails closed rather than being repaired implicitly. `deps:verify` rechecks the committed whole-lock digest, Git object completeness, content-addressed downloads, npm cache, and prepared Perfetto UI dependency tree. `deps:offline-check` enters an OS-enforced network namespace/sandbox, confirms external sockets are denied, performs fresh offline npm and pnpm installs, rebuilds the complete production output from an empty Perfetto output tree, and runs the imported WinScope browser test suite without `ANDROID_BUILD_TOP`.

The current lock contains 2,362 sorted entries and fixes Perfetto at commit `ece66975738007dd0978b911d8a2077e49b8f31e`, tree `201a16e409911aa016522a95143af2e5d52a3662`. Cache contents are deliberately excluded from Git. Missing, corrupt, floating, or undeclared inputs fail closed. Runtime dependencies use the final `runtime` classification and must carry an explicitly approved permissive SPDX expression; `NOASSERTION` remains permitted only for non-distributed build inputs.

The standalone build-integration stage is executable with:

```bash
python3 scripts/build.py preflight --json
python3 scripts/build.py production --json
python3 scripts/build.py verify --json
```

`build.py` materializes only the locked Perfetto inputs, invokes the pinned
Android 17 Trace Processor GN/WASM build, copies the generated engine and both
WASM modules into the application assets, generates protobuf bindings, and
performs the Angular production build. TypeScript is run through a temporary
symlink outside the application checkout so the application's Jasmine
ambient types cannot leak into Perfetto's Jest types; no upstream Perfetto
source is modified. `deps:offline-check` repeats this production build inside
the OS network sandbox, proving that compilation consumes the prepared cache
without AOSP or external networking. Output verification checks byte identity
between the Trace Processor build and deployed web assets. The Android 17
vendor `layers_trace.perfetto-trace` fixture is the first imported-trace
behavioral seam; the upstream browser test parses it with the generated engine
and queries `surfaceflinger_layers_snapshot` as this stage's import evidence.

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
    ├── attribution.json
    └── compliance.json
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
9. **Close performance and security gates** — upstream-relative benchmark baselines, vulnerability evidence, and hostile-input regression checks are complete before final release eligibility.
10. **Prove reproducible release provenance** — two isolated package builds from a clean source tree are byte-identical and both attest the same source and dependency inputs.
11. **Publish the final release contract** — stable index, all reports, frozen inputs, verification instructions, and APS integration guidance are immutable and digest-verifiable.

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

## Stage 4 implementation evidence

The standalone Web build now ships only local assets, declares a restrictive Content Security Policy, and defaults to file-only analysis through `runtime-config.json`. Startup loads that configuration with `no-store`, same-origin credentials, redirect rejection, a 64 KiB bound, and schema validation; invalid input leaves capture disabled. A configured capture path must be a clean `./` relative endpoint and is resolved only at request time. Production no longer embeds Google analytics, remote fonts, the Web Device Proxy, or a fixed capture port; the capture token is memory-only. `python3 scripts/build.py verify --json` checks the built Web tree for the CSP, relative base URL, default runtime configuration, and forbidden remote runtime markers.

## Stage 6 implementation evidence

`scripts/release.py` provides the release boundary without additional runtime dependencies. `package` copies the verified Web tree, all six CGO-free launchers, and the launcher-managed proxy into the stable distribution layout; emits a Web manifest, normalized release inventory, SPDX 2.3 SBOM, attribution/license evidence, dependency reconstruction bundle, `SHA256SUMS`, and an in-toto/SLSA-shaped attestation. `verify` checks manifest, release-file digests, and the Stage 19 license classification, and `double-build` packages the same inputs twice and requires byte-identical ZIP output. `SOURCE_DATE_EPOCH` or the selected Git commit timestamp controls all generated timestamps.

## Stage 7 implementation evidence

`scripts/validate.py` provides the Stage 7 machine-readable validation report and gate. It inventories representative Perfetto, legacy, screenshot, screen-recording, and IME fixtures; checks the production Web CSP/runtime configuration and forbidden runtime markers; runs the existing dependency-lock verifier; validates launcher/browser support declarations; verifies release license/SBOM/dependency evidence; records Web size plus startup/import/interaction/peak-memory benchmark metrics against a regression baseline; and validates schema-bound Android 17 device and vulnerability evidence. The public report records bounded summaries and cryptographic identities for protected external inputs, not raw device or scanner evidence. Unit, development E2E, production-distribution E2E, and offline checks can be requested with `--run-unit`, `--run-e2e`, `--run-production-e2e`, and `--run-offline`. Missing external artifacts are reported as `skipped`, never as false passes; `--require-complete` turns those skips into a blocking gate. `validate:report` is the non-blocking local report; `validate:gate` is the strict release gate.

## Stage 8 implementation evidence

`scripts/publish.py` stages alpha, release-candidate, and the exact stable
`17.0.0` publication without performing external network or tag operations. It
requires a clean source tree, a complete Stage 7 schema-v1 passing report, and
a Stage 6 archive containing the manifest, release manifest, license, SBOM,
attribution, and dependency-lock evidence. Each publication records frozen
Android 17 inputs, source revision/time, toolchain and dependency digests,
validation and archive digests, immutable artifact hashes, support/channel
metadata, and the stable `v17.0.0` tag policy in `release-index.json`.
`publish:verify` rechecks release-index lineage, frozen-input evidence, and all
published artifact digests. `docs/APS_INTEGRATION.md` defines source-checkout
and archive consumption through the relocatable `web/` plus schema-versioned
`manifest.json` contract; version 1 deliberately has no APS bridge.

## Stage 9 implementation evidence

Stage 9 closes the performance and hostile-input gates that are required before
publication. A supplied benchmark now cannot pass without a matching
upstream-relative baseline; missing benchmark or baseline evidence remains an
explicit skip and blocks a complete gate. `security:hostile` runs standard
library regression tests for the Go launcher and Python capture proxy,
including manifest/path traversal, query and method rejection, loopback origin
and token validation, encoded traversal, bounded shell commands, and required
security headers. `validate.py --run-security` records that check alongside
the existing feature, dependency, vulnerability, release, and runtime gates.

## Stage 10 implementation evidence

`release:double-build` now performs two isolated package builds from the clean
source tree, verifies both package inventories, checks each in-toto-shaped
attestation against the current source commit, release manifest, and dependency
lock, and requires identical ZIP bytes and provenance records. It can persist a
schema-v1 Stage 10 report at `dist/validation/reproducibility.json`.
`validate.py` consumes that report as `release:reproducibility`; a complete gate
requires two matching ZIP digests, verified provenance, the current source
commit, and the current dependency-lock digest.

## Stage 11 implementation evidence

The final publication gate now requires passing Stage 9 security and Stage 10
reproducibility checks in the complete Stage 7 validation report. Publication
stages the archive, checksums, attestation, validation report, reproducibility
report, frozen-input metadata, and `APS_INTEGRATION.md` together. The release
index declares report and instruction paths, and `publish:verify` rejects an
index that omits them or whose artifact/frozen-input digests do not match.
Explicit `publish:alpha`, `publish:rc`, and `publish:stable` commands document
the alpha, `17.0.0-rc.1`, and protected `v17.0.0` publication lanes. Set
`OFFICIAL_RELEASE_IMAGE` to the approved public `name@sha256:<digest>` image (or
pass `--build-image`) before invoking a publication command; the digest is
frozen into release evidence. No command performs an external tag, network, or
artifact overwrite operation.


## Stage 12 implementation evidence

`scripts/support.py` verifies the explicit release support lifecycle without
network access. It validates schema-versioned support metadata and security
response policy, computes current/previous-generation support from supplied
release indexes, enforces the 90-day previous-generation transition window,
and retains EOL/withdrawn evidence. It also validates standalone advisories and
SHA-256 digests for their local evidence files. Publication indexes now record
release time, baseline generation, support track, withdrawal metadata, and the
Critical/High response targets. Existing publication directories are immutable;
re-publishing the same version fails instead of deleting evidence.


## Stage 13 implementation evidence

`verify-aps-release.py` provides the APS pre-unpack verification boundary using
only the Python standard library. APS runs it from a separately trusted, pinned
source checkout or toolchain, never from the untrusted publication being
checked. APS supplies an externally authenticated `release-index.json` digest
through `--expected-index-sha256`. The verifier checks every indexed artifact
and size, `SHA256SUMS`, frozen source/dependency/report lineage, the Stage 7
and Stage 10 reports, the in-toto provenance statement, safe and unique ZIP
paths, the exact release inventory, required license/SBOM/dependency evidence,
and every Web
manifest asset digest before unpacking. It rejects unindexed publication
entries and enforces portable ZIP names, stored/DEFLATE compression, and fixed
member-count, member-size, total-size, and compression-ratio ceilings. It
makes no Git, Node, cache, or network call. From the trusted checkout, use:

```sh
npm run aps:verify -- \
  --publication <dir> \
  --expected-index-sha256 <digest> \
  --expected-build-image <trusted-build-image>
```

Self-asserted JSON does not replace the external Sigstore/OIDC trust root.

## Stage 14 implementation evidence

`.github/workflows/official-release.yml` is the only repository workflow that
creates an official release. It runs only for Android 17 version tags and uses
three explicit trust boundaries: a protected preflight validates the public
release-container digest and tag, a read-only build job verifies clean-room
lineage and replays dependency/build/reproducibility/dynamic/publication gates,
and a narrowly privileged publish job reverifies the transferred publication
before requesting GitHub OIDC credentials. The resolved build-image digest is
recorded in authenticated frozen-input evidence. Alpha and RC tags are created
as GitHub prereleases with latest-release selection disabled; stable tags use
the normal stable release path. Both build and publish jobs refuse an existing
release, and attestation occurs only after the final refusal check. Checkout
does not persist credentials, every action is commit-pinned, and no workflow
path creates or moves a tag or overwrites an artifact.

Repository administration is a separate required prerequisite: protect the
`v17.*` tag namespace, require reviewers for the `official-release`
environment, enable GitHub release immutability, configure a publicly pullable
`OFFICIAL_RELEASE_IMAGE` by immutable SHA-256 digest, and configure the four
approved evidence secrets. The release image must provide Bash/coreutils, Git,
GitHub CLI, Chrome, and native build tools; setup actions install the declared
Node and Go versions plus the Python 3.12 CI series. The workflow remains
non-operational until those repository settings exist; this source change does
not mutate GitHub administration settings.

APS obtains the approved release commit independently, authenticates
`release-index.json` with `gh attestation verify` using the repository, workflow,
tag, source digest, and signer digest, computes the verified file's SHA-256, and
supplies that digest to the trusted offline verifier before unpacking. The
offline verifier requires the authenticated frozen inputs to contain the
immutable build-image digest used by the release job.

## Stage 15 implementation evidence

`scripts/verify-release-settings.py` is a read-only pre-tag auditor for the
repository administration prerequisites left outside the Stage 14 workflow. It
uses the GitHub REST API with `GH_TOKEN` or `GITHUB_TOKEN` and fails unless the
`official-release` environment has at least one required reviewer, prevents
self-review, enables custom deployment policies with the exact `v17.*` tag
pattern, defines a
digest-pinned `OFFICIAL_RELEASE_IMAGE`, and contains all four approved evidence
secrets. It also requires an active repository tag ruleset for
`refs/tags/v17.*` with no exclusions and with update and deletion protections,
and requires immutable
GitHub releases to be enabled.

Run the live, non-mutating administrator audit before creating a release tag:

```sh
npm run release:settings
```

For deterministic review or an air-gapped audit, create a schema-v1 snapshot
object bound by `repository` and `environmentName`, with `environment`,
`deploymentBranchPolicies`, `variables`, `secrets`, `rulesets`, and
`immutableReleases`. The `rulesets` array contains the detailed rule-set
responses, not only the abbreviated list response. Then run:

```sh
npm run release:settings -- --snapshot <snapshot.json> --output <report.json>
```

The command emits a schema-v1 machine-readable report and exits nonzero for any
missing setting or unreadable endpoint. It never creates an environment,
ruleset, variable, secret, tag, or release. Repository administrators remain
responsible for applying settings through a separately authorized process.

## Stage 16 implementation evidence

`scripts/verify-release-image.py` proves the runtime contract of the externally
approved `OFFICIAL_RELEASE_IMAGE` before a release tag is created. It requires
an immutable lowercase `name@sha256:<digest>` reference, uses a temporary empty
Docker client configuration for an anonymous `linux/amd64` pull, and verifies
that the inspected image retains the requested digest and platform. It then
runs a network-disabled, read-only, capability-free probe requiring Bash,
coreutils and archive tools used by setup actions, Git, GitHub CLI, Chrome,
and native C/C++ build tools. The probe mounts no repository data and receives no credentials.

Run the non-publishing preflight with Docker available:

```sh
OFFICIAL_RELEASE_IMAGE=<name@sha256:digest> npm run release:image
```

The command emits a schema-v1 report and exits nonzero for mutable references,
anonymous pull failures, digest/platform mismatches, missing tools, or an
unavailable Docker daemon. It may populate the local Docker image cache, but it
does not build or publish an image, mutate a registry, configure GitHub, or
select which release image administrators should approve.

## Stage 17 implementation evidence

The official workflow now preserves the passing Stage 16 image verification
report instead of discarding its JSON output. Preflight uploads
`release-image.json` as a run-scoped artifact, the read-only build job downloads
that exact report, and `publish.py` requires it to match the approved
`OFFICIAL_RELEASE_IMAGE` before staging a publication. The release index lists
the report, and frozen inputs bind its SHA-256 digest.

The trusted APS verifier checks the indexed Stage 16 report offline alongside
the Stage 7 and Stage 10 reports. It requires the approved image digest,
`linux/amd64` platform, inspected image ID, anonymous pull, network-disabled and
read-only probe flags, the complete release-tool inventory, an empty error list,
and the frozen report digest. The protected workflow attests the resulting
publication. This stage does not choose, build, tag, or publish a container
image; image approval and registry administration remain external prerequisites.

## Stage 18 implementation evidence

The Stage 7 validation report now binds the exact protected device,
vulnerability, performance-baseline, and performance-benchmark inputs through a
schema-v1 manifest containing stable logical names, SHA-256 digests, and byte
sizes. A complete publication requires all four identities, and both
`publish.py` and the trusted APS verifier reject missing, malformed, or partial
manifests.

Device validation now publishes only the evidence digest, Android version, and
capture/import outcomes. Vulnerability validation publishes only its digest and
the bounded scanner, source, lock, and severity summary. Unknown private fields,
device fingerprints, serials, paths, and raw scanner details are excluded from
validation JSON and workflow logs. Stage 18 does not publish the raw protected
evidence or change the separately authorized Stage 15 repository-settings
audit.

## Stage 19 implementation evidence

The dependency lock now distinguishes final `runtime`, `build-only`, and
`build-only-source` classifications. Runtime dependencies must use the
reviewed permissive SPDX allowlist and an absolute HTTPS origin; unknown,
`NOASSERTION`, custom, restrictive, or copyleft runtime classifications fail
the dependency gate. Build-only inputs remain recorded for reproducibility but
may retain unresolved license metadata because they are not redistributed as
runtime components. Production imports such as `jszip` and `mp4box` are declared
as runtime npm dependencies; the JSZip dual-license is distributed under its MIT
option, while `(MIT AND Zlib)` is accepted as a reviewed permissive expression.

Each release now carries `LICENSES/compliance.json`. The release packager
recomputes that schema-v1 report from the locked dependency closure, records
distribution in attribution, and records matching SPDX package purposes.
`release.py verify`, `publish.py`, and the trusted APS verifier reject missing,
malformed, inconsistent, or unapproved license/SBOM evidence. No restrictive
license exception is approved by this stage; adding one requires a separate
reviewed policy change.

## Stage 20 implementation evidence

File import now produces an explicit warning for every selected file whose
format cannot be recognized as a supported Winscope trace. Content-based
Perfetto detection no longer stops after the first failed candidate, and files
that remain after an extensionless Perfetto trace is found are classified
instead of being silently ignored. Additional valid Perfetto candidates are
reported as overridden, while unrecognized candidates retain their own
filename-specific diagnostic. If classification ends on a rejected candidate,
the selected Perfetto trace is restored before loading continues.

## Stage 21 implementation evidence

Android device capture now exposes a controller-level `endTraceAndFetch`
operation for the complete Stop -> Recovery Capture move -> pull boundary.
The collection UI no longer composes stop and transfer as separate calls: it
receives the completed file set from that operation and emits it through the
existing collected-file event, which immediately reuses the normal file loader
and viewer initialization path. Transfer state changes to `LOADING_DATA` before
the pull begins, successful completion is reported once after all files arrive,
and a failed combined operation closes the progress lifecycle before preserving
the original error. The separate recovery-session fetch remains available for
reload and interruption recovery.

## Stage 22 implementation evidence

Trace-target availability is now refreshed from the selected device's actual
Perfetto datasource inventory instead of from an Android API-level assumption.
Targets with a legacy path continue to use the existing per-target fallback;
Perfetto-only Input capture is disabled independently when
`android.input.inputevent` is missing. Disabled targets remain visible with a
device-specific availability explanation and are excluded from request
construction even if a stored preference previously enabled them. Availability
updates apply safely across both trace and dump configuration maps, allowing
the rest of an Android 15/16 device's supported sources to remain usable.

## Stage 23 implementation evidence

Legacy trace import is now preserved by default. A fresh profile no longer
preselects **Discard legacy traces**: recognized Android 17 legacy readers flow
through the existing Legacy-to-Perfetto converter when the user opens the
trace. Discard remains an explicit user preference for faster loading and is
honored only after the user selects it.

The schema-v1 distribution manifest now also declares
`capabilities.legacyImport`, including the stable list of retained legacy
families and `conversion: perfetto`. This lets standalone and APS consumers
distinguish the supported Android 17 compatibility boundary from removed
historical formats without depending on reader class names or source layout.

## Stage 24 implementation evidence

UI capability decisions now explicitly use runtime evidence. Capture targets
continue to come from selected-device probes, while analysis affordances come
from the current set of loaded readers. In particular, legacy WM and Shell
transition rows stop claiming that visualization is unavailable once their
content has produced the combined `TRANSITION` reader consumed by the viewer.
An isolated transition source still retains the existing missing-companion
diagnostic.

The distribution manifest records these rules through
`capabilities.capabilityDiscovery`, with `capture: device-probe` and
`analysis: trace-content`. Android/API version labels remain provenance and
compatibility evidence, not substitutes for an observed device datasource or
an observed trace entry type.

## Stage 25 implementation evidence

The schema-v1 distribution contract now makes the two core hierarchy viewers
explicit. `capabilities.analysisViewers.windowManager` requires a
`window-manager` trace and
`capabilities.analysisViewers.surfaceFlinger` requires a `surface-flinger`
trace. Both declare the retained Android 17 feature set: hierarchy, properties,
2D rects, 3D rects, timeline, and playback.

These capabilities describe the existing shared hierarchy/rect/playback viewer
implementation rather than introducing an APS-specific UI or alternate parser.
Consumers can inspect the manifest without depending on Angular component names,
hashed bundles, or repository paths, while runtime creation remains gated by
the corresponding loaded trace content from Stage 24.
