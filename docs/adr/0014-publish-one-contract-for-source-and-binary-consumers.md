---
status: accepted
---

# Publish one contract for source and binary consumers

AndroidPerformanceStudio may pin this repository as a source submodule for explicit WinScope development builds or consume a digest-verified release archive without installing the JavaScript/Perfetto toolchain. Both modes converge on one versioned distribution contract: a relocatable `web/` tree plus a schema-versioned manifest describing the entry point, provenance, file integrity, runtime requirements, and capabilities; consumers do not depend on hashed asset names or internal source paths.

## Consequences

The first release declares no host bridge, uses relative assets, works below a non-root URL path, has no fixed static-server port or remote startup dependency, and receives basic embed-readiness validation without claiming JCEF support. A future APS bridge adds a separately versioned, capability-negotiated protocol to the same core web distribution rather than creating an APS-specific fork.
