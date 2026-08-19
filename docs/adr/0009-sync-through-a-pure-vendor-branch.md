---
status: accepted
---

# Sync through a pure vendor branch

The `upstream/android17-release` vendor branch contains only verified exports of `platform/development/tools/winscope`, with one import commit per explicitly selected upstream revision. Main merges those imports and carries standalone adaptations directly, allowing Git three-way conflict detection without a duplicate source directory, runtime patch application, a nested AOSP submodule, or a full AOSP checkout.

## Consequences

Synchronization requires a clean tree, an explicit target revision, archive integrity verification, and a human-reviewed merge; it reports the complete file delta and never commits, pushes, deletes branches, follows a moving head, or resolves conflicts automatically. Normal builds do not read the vendor branch.
