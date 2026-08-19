---
status: accepted
---

# Lock and audit the complete dependency closure

The repository derives and commits an auditable lock description for npm, Perfetto, and all transitive source/tool downloads, including immutable identity, integrity, origin, platform, license, introducer, and release inclusion. CI first prepares and re-verifies a cache using only declared origins, then disables external networking for compilation, tests, and packaging; the convenience production command may prepare a missing cache automatically, but cannot introduce an undeclared input or silently change the derived lock.

## Consequences

Release evidence retains a digest-verified source/dependency bundle outside Git and outside the end-user web archive so a vanished upstream resource does not destroy rebuildability. Cache hits remain untrusted until verified, redirects are origin-checked, floating references are forbidden, and the offline build phase proves there are no hidden downloads.
