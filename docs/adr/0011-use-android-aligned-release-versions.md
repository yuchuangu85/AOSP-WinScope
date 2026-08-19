---
status: accepted
---

# Use Android-aligned release versions

Releases use `17.<baseline-generation>.<adaptation-patch>`: `17` identifies the Android release line, the middle component advances whenever any managed AOSP baseline revision changes, and the final component advances for standalone-only fixes on an unchanged baseline. Development begins at `17.0.0-alpha.1`, the first accepted release is `17.0.0`, Android 18 begins a separate `18.0.0` line, and any future consumer bridge carries its own protocol version rather than overloading the distribution version.

## Consequences

Tags, archives, and manifests carry the exact version and upstream provenance. Downstream consumers pin an immutable tag, commit, or digest-verified archive and never consume a floating `latest` identifier as a release dependency.
