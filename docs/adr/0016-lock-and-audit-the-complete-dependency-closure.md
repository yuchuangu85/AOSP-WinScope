---
status: accepted
---

# Lock and audit the complete dependency closure

The repository derives and commits an auditable lock description for npm, Perfetto, and all transitive source/tool downloads, including immutable identity, integrity, origin, platform, license, introducer, and release inclusion. CI first prepares and re-verifies a cache using only declared origins, then disables external networking for compilation, tests, and packaging; the convenience production command may prepare a missing cache automatically, but cannot introduce an undeclared input or silently change the derived lock.

## Consequences

Release evidence retains a digest-verified source/dependency bundle outside Git and outside the end-user web archive so a vanished upstream resource does not destroy rebuildability. Cache hits remain untrusted until verified, redirects are origin-checked, floating references are forbidden, and the offline build phase proves there are no hidden downloads.

Offline proof runs inside the host operating system's network-denial boundary rather than relying only on proxy variables. Retained Git inputs contain all objects reachable from the pinned commit and are rejected if marked as a partial/promisor repository or if any object is missing.

The committed lock also declares install-script artifacts that package-manager locks do not cover by themselves, including the fixed `grpc-tools` binaries for release-gated and compatible source-build hosts. Preparation materializes these artifacts into a content-addressed cache; offline installation runs dependency scripts only through repository-controlled, verified materialization rather than allowing package install hooks to fetch undeclared content.
