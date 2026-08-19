---
status: accepted
---

# Load ephemeral host configuration at runtime

The immutable Web distribution fetches a bounded, schema-validated, non-redirecting, `no-store` runtime configuration from a fixed relative same-origin endpoint. Standalone launchers dynamically provide either no capture provider or `loopback-proxy-v1` behind a same-origin reverse proxy, eliminating production CORS and hard-coded ports; configuration failure degrades safely to local file analysis, and secrets remain memory-only and absent from URLs, logs, disks, and release manifests.

## Consequences

Schema version 1 accepts only the standalone host and the declared first-release providers, rejects unknown required major versions, and ignores unknown optional fields. A future AndroidPerformanceStudio host adds an independently versioned provider through this contract and serves the same untouched Web bytes rather than rewriting HTML or impersonating the loopback proxy.
