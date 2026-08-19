---
status: accepted
---

# Adapt the imported source in place

The pinned Android 17 WinScope source is imported into this repository and then changed locally through explicit standalone-adaptation commits. We will not maintain a second immutable source tree and apply a patch stack into a temporary build tree, because that duplication complicates development and verification; the AOSP repositories remain read-only origins, and all product changes exist only in this project.

## Consequences

An upstream import must be distinguishable from subsequent adaptations, and synchronization must surface conflicts rather than silently replacing locally adapted files. No implementation from the deleted legacy project may be used to resolve those conflicts.
