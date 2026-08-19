---
status: accepted
---

# Publish evidence-tiered Android compatibility

Android 17 is the mandatory real-device capture/import validation tier; Android 15 and 16 retain Perfetto compatibility and separately report fixture-validated versus device-validated status; older formats retain only the legacy import behavior present in the pinned Android 17 upstream. Capability is determined from the actual device and trace rather than API level alone, missing producers degrade independently with diagnostics, and the product never claims that a host can create unavailable device data or that future Android versions and arbitrary vendor ROMs are automatically supported.
