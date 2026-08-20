# Changelog

All notable standalone changes are recorded here. Published entries are
immutable; security fixes are released as a new Android-aligned version and
AndroidPerformanceStudio must explicitly repin that version.

## Unreleased

### Added

- Android 17 clean-room standalone build and dependency closure.
- Loopback launcher and authenticated device Capture Session.
- Relocatable Web/manifest contract for source and archive APS consumption.
- Privacy mode, explicit Recovery Capture deletion, and redacted diagnostics.
- Machine-readable feature-stage, validation, reproducibility, image, SBOM,
  provenance, and support evidence.

### Security

- Automatic external runtime requests and persistent proxy credentials are
  removed.
- PR, main, weekly, and release security gates cover dependencies, source,
  runtime boundaries, hostile inputs, Go, Python, JavaScript, and CodeQL.

Release-specific sections are added before creating a protected `v17.*` tag.
