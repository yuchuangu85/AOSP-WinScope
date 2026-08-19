---
status: accepted
---

# Fetch and build pinned Perfetto source

The repository will not commit the complete Perfetto source tree or reuse a legacy prebuilt Trace Processor. A standalone production build prepares the precisely pinned Android 17 Perfetto revision from `android.googlesource.com`, verifies its declared SHA-256 digest, caches it under a Git-ignored dependency directory, and builds the Trace Processor JavaScript/WASM artifacts from that source; CI proves the path from a cold cache. The build driver invokes Perfetto's upstream UI build through a temporary symlink outside the application checkout. This prevents ancestor `@types` discovery from mixing WinScope's Jasmine declarations with Perfetto's Jest declarations without editing the pinned upstream tree. The generated engine bundle and both WASM modules are copied into the Angular asset tree and checked byte-for-byte after the production build.

## Consequences

The first build requires network access and must fail closed on a revision or digest mismatch. A valid cache enables subsequent builds without downloading Perfetto again, but cached build outputs are never authoritative source inputs.
