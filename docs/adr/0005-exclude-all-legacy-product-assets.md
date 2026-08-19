---
status: accepted
---

# Exclude all legacy product assets

The Android 17 distribution is a clean-room rebuild rather than an upgrade of this repository's former Android 16 product. Source code, generated files, WASM, protos, scripts, configuration, media, documentation text, and test fixtures from the legacy project are excluded; any required equivalent must be acquired from the pinned Android 17 upstream baseline or authored anew with recorded provenance. Git history remains intact for auditability but is not an implementation reference.
