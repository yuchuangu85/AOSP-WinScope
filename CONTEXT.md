# AOSP-WinScope

AOSP-WinScope is a standalone distribution of Android WinScope whose product lineage is rooted in an explicitly identified Android 17 upstream baseline.

## Language

**Standalone WinScope Distribution**:
A WinScope product that can be built and run without an AOSP source checkout, while retaining trace-analysis compatibility with its declared upstream baseline.
_Avoid_: Offline copy, extracted webpage, source-tree build

**Android 17 Upstream Baseline**:
The authoritative, mutually recorded set of source revisions selected from the AOSP `android17-release` line for one AOSP-WinScope release.
_Avoid_: Latest source, Android 17 code, current branch

**Legacy Project Source**:
The previously committed WinScope implementation in this repository, which is excluded as a source for the rebuilt product.
_Avoid_: Reference implementation, fallback source

**Upstream Source**:
The read-only AOSP repositories from which a pinned Android 17 baseline is acquired; the imported local copy may be adapted, but those adaptations are never treated as changes to the upstream origin.
_Avoid_: Upstream content, remote working tree

**Standalone Adaptation**:
A local, auditable change applied after upstream import to make the distribution independently buildable or consumable without changing its declared product lineage.
_Avoid_: Upstream fix, legacy patch, local hack

**Standalone Release**:
A versioned, integrity-described WinScope web distribution that can analyze local traces and use the upstream proxy for device trace collection without an AOSP checkout.
_Avoid_: APS plugin, embedded WinScope, development build

**Consumer Integration**:
The downstream embedding of a Standalone Release into another product, including host-specific webview, bridge, ADB, or native Trace Processor integration.
_Avoid_: Standalone build, WinScope distribution

**Clean-room Rebuild**:
The new product lineage in which no product asset from the Legacy Project Source is reused; its inputs are the declared Android 17 upstream baseline plus newly authored standalone adaptations.
_Avoid_: Upgrade, migration, port of the old project

**Local Analysis Boundary**:
The runtime privacy boundary within which trace data and derived information remain confined to the browser, its workers, and explicitly declared loopback services on the same host.
_Avoid_: Offline mode, anonymous telemetry, local-first

**Distribution Contract**:
The versioned build, artifact, metadata, asset-resolution, and runtime-origin boundary through which a downstream product consumes a Standalone Release without depending on its internal source layout.
_Avoid_: APS bridge, submodule layout, dist folder

**Product Input**:
A pinned, integrity-verified upstream source whose bytes are consumed by the standalone build and therefore affect the released product.
_Avoid_: Context revision, source reference, related repository

**Context Revision**:
A recorded Android baseline revision used to diagnose producer/schema compatibility but not downloaded or consumed by the standalone build.
_Avoid_: Build dependency, product input

**Dependency Closure**:
The complete, integrity-pinned set of direct and transitive source, package, and tool inputs required to prepare and build a release on a declared platform.
_Avoid_: Node modules, Perfetto dependencies, build cache

**Redistribution Evidence**:
The license texts, notices, attribution, component inventory, and integrity links that allow a downstream consumer to redistribute a Standalone Release without reconstructing its internal dependency graph.
_Avoid_: License file, SBOM only, legal metadata

**Capture Session**:
A launcher-scoped, authenticated association among one loopback UI origin, one proxy instance, and explicitly selected ADB devices, ending when the launcher terminates it.
_Avoid_: Persistent proxy, local server, browser session

**Validation Tier**:
The stated evidence level for an Android version or trace format, distinguishing real-device capture/import validation, fixture validation, and retained legacy file-import compatibility.
_Avoid_: Supported Android version, compatible ROM

**Standalone Launcher**:
A minimal native host utility that verifies and serves the distribution over a secure loopback origin and optionally coordinates a Capture Session, without analyzing traces or becoming part of the consumer integration API.
_Avoid_: Desktop application, APS bridge, WinScope server

**Release Attestation**:
Cryptographic provenance binding immutable release artifacts to the expected repository, protected workflow, source revision, build environment, inputs, and commands.
_Avoid_: SHA-256 file, GitHub release, platform code signature

**Runtime Configuration Contract**:
The versioned, same-origin, ephemeral configuration through which a host declares its identity and available capture provider to an otherwise immutable Web distribution.
_Avoid_: Build configuration, manifest, bridge protocol

**Recovery Capture**:
The single most recent device-side WinScope capture intentionally retained for explicit recovery after a browser or host interruption, distinct from temporary session files and normal Host persistence.
_Avoid_: Trace cache, automatic backup, capture history

**Upstream-relative Baseline**:
A performance, memory, and size comparison between the pinned public Android WinScope and its standalone distribution under identical inputs, tools, environment, datasets, and statistical rules.
_Avoid_: Previous release performance, developer machine benchmark, absolute target

**Supported Release**:
An immutable published version that remains eligible for vulnerability assessment and corrective patch releases under the project's declared security policy.
_Avoid_: Latest build, maintained branch, downloadable artifact

**Baseline Generation**:
The middle component of an Android-aligned release version, identifying one exact set of Product Input revisions shared by all patches in that generation.
_Avoid_: Minor version, upstream branch, Android release
