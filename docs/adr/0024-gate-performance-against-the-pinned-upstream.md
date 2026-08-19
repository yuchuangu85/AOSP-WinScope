---
status: accepted
---

# Gate performance against the pinned upstream

Each Android baseline generation benchmarks the pinned public WinScope and the standalone distribution in one fixed environment across versioned non-sensitive small, medium, large, multi-viewer, legacy, media, deep-hierarchy, and high-volume datasets. Release-gating medians for startup, WASM initialization, recognition/import, first interaction, representative UI actions, memory, and compressed Web size receive a default 10% regression budget; approved one-time security asset costs establish an explicitly explained baseline rather than hiding in aggregate, and launcher size is reported separately.

## Consequences

Sampling and statistical rules are fixed before execution, rerunning for a lucky result is forbidden, and improvements cannot remove behavior or fidelity. Results are machine-readable release evidence for APS; secondary platforms are observed for failures and severe resource problems but are not compared through cross-CPU absolute timings in the first release.
