---
status: accepted
---

# Support the current and previous baseline generations

Only the latest patch of the current Android 17 baseline generation is fully supported; the latest patch of the immediately previous generation receives security support for 90 days after its successor's stable release, and all older generations or superseded patches are EOL. Prereleases receive no formal security support, and after Android 18 reaches a standalone stable release the last Android 17 baseline receives 12 months of security support unless an explicit APS-driven maintenance decision extends it.

## Consequences

EOL artifacts, digests, SBOMs, provenance, and advisories remain available for audit, while fixes target the current generation and are backported within the transition window only when product inputs can remain unchanged. Support status is expressed through signed release indexes and advisories rather than launcher networking, and releases occur for real upstream, compatibility, security, or standalone value rather than a mandatory calendar cadence.
