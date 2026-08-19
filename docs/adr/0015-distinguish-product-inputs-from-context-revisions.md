---
status: accepted
---

# Distinguish product inputs from context revisions

Only the pinned `platform/development/tools/winscope` export and `platform/external/perfetto` source are product inputs because Android 17 WinScope already carries its legacy protos, IntDef mapping, and ProtoLog configuration and does not build from Framework or SystemUI trees. Exact `frameworks/base` and `frameworks/libs/systemui` revisions remain recorded context for device-producer compatibility diagnosis, but normal builds neither fetch them nor copy or overwrite schemas from them.

## Consequences

Changing a product input advances the baseline generation; changing context alone does not require a release. A filesystem and network audit rejects undeclared AOSP inputs, and any future repository becomes a product input only through an explicit architectural decision backed by an actual build dependency.
