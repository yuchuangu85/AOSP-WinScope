---
status: accepted
---

# Enforce a local-only runtime boundary

The standalone runtime makes no automatic non-loopback request and never transmits trace content, metadata, device information, errors, or usage events outside the host. Production assets are bundled locally, analytics and unneeded remote authentication/tool integrations are removed, services bind only to loopback, a restrictive content-security policy permits only declared local origins, and end-to-end tests fail on any unexpected external request; explicitly clicked documentation links are the only user-initiated exception.

## Consequences

Build-time access to pinned package and source origins remains allowed and is governed separately from runtime networking. The release must not depend on Google Fonts, CDNs, or other remote resources to render or analyze traces.
