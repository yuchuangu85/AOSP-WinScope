---
status: accepted
---

# Ship the standalone distribution before consumer integration

The first delivery is a complete standalone Android 17 WinScope web distribution: reproducible source build, browser-hosted static output, local trace import, upstream proxy-based device collection, and a versioned release archive with provenance and integrity metadata. AndroidPerformanceStudio-specific JCEF, Kotlin bridge, ADB-service, native Trace Processor, and Compose work belongs to a later consumer-integration phase, so it cannot obscure whether the standalone boundary actually works.
