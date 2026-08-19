---
status: accepted
---

# Pin upstream revisions per release

Each AOSP-WinScope release records exact `android17-release` revisions for `platform/development`, `platform/frameworks/base`, `platform/frameworks/libs/systemui`, and `platform/external/perfetto`. Normal builds never resolve moving branch heads; upstream changes enter only through an explicit synchronization change, preserving reproducible builds while still allowing deliberate updates to newer Android 17 snapshots.

## Considered Options

Automatically building the current `android17-release` heads was rejected because the same AOSP-WinScope revision could then produce different source inputs over time.
