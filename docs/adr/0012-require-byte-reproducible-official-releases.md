---
status: accepted
---

# Require byte-reproducible official releases

Official archives are produced only by a pinned Linux x86_64 CI image and must be byte-identical across two isolated cold-cache builds of the same tag. The build uses a commit-derived `SOURCE_DATE_EPOCH`, excludes host identity and wall-clock data, normalizes paths, file ordering, modes, timestamps, manifests, and archive parameters, and treats any nondeterminism from WinScope or Perfetto as a defect rather than an allowed variance; supported macOS builds must be behaviorally equivalent but need not match Linux bytes.
