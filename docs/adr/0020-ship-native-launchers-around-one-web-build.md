---
status: accepted
---

# Ship native launchers around one web build

One platform-neutral Web build is packaged with minimal, no-cgo, standard-library Go launchers cross-compiled for Windows, macOS, and Linux on amd64 and arm64. A launcher verifies the manifest, serves `web/` with correct loopback security semantics, opens or prints the browser URL, and optionally coordinates the Python/ADB proxy; it never parses traces, downloads updates, elevates privileges, runs arbitrary host shell, or participates in the downstream consumer API.

## Consequences

Pure offline analysis needs no Node, Python, ADB, or other runtime, while device collection checks for Python and ADB only when requested. All binaries enter the dependency closure, SBOM, integrity manifest, and reproducibility checks; AndroidPerformanceStudio consumes only `web/` and the manifest, and any Developer ID notarization remains a separate credentialed wrapper over the reproducible core release.
