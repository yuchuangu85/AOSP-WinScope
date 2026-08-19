---
status: accepted
---

# Attest immutable releases from a protected workflow

Official releases originate only from reviewed `main` commits through protected version tags and an approved GitHub Environment, then rebuild twice from cold caches in a digest-pinned Linux image using Node/npm and Go `1.26.6`. Actions and tool downloads are immutably pinned, artifacts cannot be overwritten, and Sigstore/GitHub OIDC provenance binds every archive and checksum set to this repository, workflow, tag, source, dependency closure, build image, and command sequence; unofficial builds cannot produce official attestations.

## Consequences

AndroidPerformanceStudio verifies the archive digest, attested repository/workflow/tag identity, and internal manifest integrity rather than trusting a filename or TLS alone. Authenticode, Developer ID, and notarization remain optional outer packaging identities and never replace or mutate the reproducible core ZIP consumed by APS.
