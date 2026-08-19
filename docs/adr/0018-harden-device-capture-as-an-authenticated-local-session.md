---
status: accepted
---

# Harden device capture as an authenticated local session

Default device collection is a launcher-managed capture session joining a random-port loopback web origin to a proxy through a fresh secret that is never persisted, logged, or placed in a URL. The proxy rejects wildcard, null, non-loopback, mismatched Origin/Host, unauthenticated, oversized, malformed, traversal, and injection attempts; it retains Android 17's required ADB behavior through argument-vector execution and bounded, privacy-conscious audit events, then terminates with the launcher without killing unrelated processes.

## Consequences

The release removes wildcard CORS, the persistent home-directory token, and the hard-coded proxy URL. An advanced proxy-only command requires an explicit allowed origin and one-time authentication, the manifest advertises `loopback-proxy-v1`, and a future host bridge is a distinct negotiated capture provider rather than an insecure compatibility disguise.
