---
status: accepted
---

# Minimize and make data retention explicit

Imported and collected trace bytes and derived analysis remain in browser memory unless the user explicitly exports them; production persistence is allowlisted to non-sensitive display preferences and explicitly saved queries, excludes recent searches, trace/device identity, paths, derived values, and session configuration, and offers both complete local-data clearing and a no-persistence privacy mode. Default diagnostics are memory-only and redact secrets, trace content, full commands/output, paths, and device serials; richer diagnostics require explicit warning and opt-in but still never contain tokens or trace bytes.

## Consequences

The device retains only one disclosed Recovery Capture so interrupted sessions can recover, replacing it at the next capture and supporting explicit deletion; privacy mode deletes it after successful transfer. Session/config/status/signal artifacts are always cleaned, failures are reported rather than hidden, and a future host may be stricter but not weaker than this baseline.
