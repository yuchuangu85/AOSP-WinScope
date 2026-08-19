---
status: accepted
---

# Pin the JavaScript toolchain

The first standalone baseline uses Node.js `24.19.0` and npm `11.17.0`, declared through repository version files, package metadata, CI, and a fail-fast preflight check; production dependency installation uses only `npm ci`. Python scripts support Python 3.11 through 3.13 while CI fixes Python 3.12, balancing a reproducible validated lane with practical host availability.

## Consequences

Toolchain upgrades are explicit changes that must repeat the cold-cache production build and full validation. A developer toolchain outside the declared ranges is unsupported rather than silently accepted.
