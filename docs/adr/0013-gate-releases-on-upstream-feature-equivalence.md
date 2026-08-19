---
status: accepted
---

# Gate releases on upstream feature equivalence

Version `17.0.0` must preserve the pinned public Android 17 WinScope parsers, legacy readers, viewers, trace collection, timelines, hierarchy/property/rect visualization, playback, search, media, Perfetto, and proxy workflows. Only the accepted local-runtime security removals, unavailable non-public vendor/Wayland extensions, and deferred AndroidPerformanceStudio integration may differ; all upstream unit and end-to-end behavior remains release-gating, supplemented by production-dist, cold-build, security, and real Android 17 capture/import validation rather than skipped or weakened tests.
