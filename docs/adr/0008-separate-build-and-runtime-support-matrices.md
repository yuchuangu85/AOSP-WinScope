---
status: accepted
---

# Separate build and runtime support matrices

Cold source builds are release-gated on Linux x86_64 and macOS arm64, with macOS x86_64 and Linux arm64 treated as compatible but initially non-blocking; Windows source builds are out of scope. The platform-neutral release archive is supported on current Windows, macOS, and Linux desktop architectures through the current and previous stable Chrome or Edge, served only from a loopback HTTP origin; `file://`, Safari, Firefox, mobile browsers, and embedded webviews are not supported in the first release.

## Consequences

The release includes newly authored cross-platform loopback launchers and never binds a public interface. Offline trace analysis requires neither ADB nor network access after installation, while device collection additionally requires a supported Python, ADB, and a compatible Android device.
