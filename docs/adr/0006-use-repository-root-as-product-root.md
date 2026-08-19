---
status: accepted
---

# Use the repository root as the product root

The imported Android 17 WinScope npm project lives directly at the AOSP-WinScope repository root rather than under another `winscope/` directory. This makes clone-root commands, CI, release packaging, and downstream submodule consumption direct, while synchronization manages an explicit set of upstream-owned paths and preserves standalone documentation, scripts, and metadata.
