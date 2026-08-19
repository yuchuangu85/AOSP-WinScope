---
status: accepted
---

# Operate an explicit security response lifecycle

Pull requests, weekly jobs, and releases scan source, dependency closure, SBOM, Web output, Go launcher, and Python proxy with pinned audit, OSV, CodeQL, Go vulnerability, secret, CSP/network, and hostile-input tooling. Runtime and build-chain Critical/High findings block releases unless a documented, expiring reachability exception applies; confirmed trace execution, data exfiltration, unauthorized ADB, traversal, or integrity bypass receives highest priority, with Critical assessment within 24 hours/fix or mitigation within 72 hours and High assessment within three working days/fix within seven days.

## Consequences

Dependency bots propose reviewed PRs but never update or merge automatically, and every change regenerates closure/SBOM evidence and repeats security, reproducibility, and performance gates. Published bytes are never replaced: standalone-only fixes increment the patch, changed product inputs increment the baseline generation, affected releases may be marked withdrawn with retained evidence, and APS deliberately repins and republishes rather than relying on launcher auto-update or telemetry.
