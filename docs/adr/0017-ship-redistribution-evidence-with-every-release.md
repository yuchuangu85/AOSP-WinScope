---
status: accepted
---

# Ship redistribution evidence with every release

License compliance is release-gating: the source tree preserves upstream notices and declares standalone licensing, while each archive carries complete license/NOTICE texts, attribution, and a reproducible SPDX 2.3 JSON SBOM covering every distributed script, bundle, WASM module, font, image, and component. Build-only and distributed dependencies are distinguished, the product manifest integrity-links the evidence, and AndroidPerformanceStudio can redistribute the complete `LICENSES/` tree without reverse-engineering WinScope's dependency graph.

## Consequences

Unknown licenses, missing attribution, inventory drift, or unapproved restrictive/copyleft terms fail CI. Permissive licenses may follow policy automatically, while LGPL, GPL, AGPL, SSPL, Commons Clause, or custom restrictions require a separate explicit review and decision.
