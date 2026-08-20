# AndroidPerformanceStudio integration

AOSP-WinScope is consumed by AndroidPerformanceStudio (APS) through one
versioned, relocatable distribution contract. Version 1 has two supported
inputs: a pinned source checkout for development and a digest-verified release
archive for packaged builds. Both expose the same `web/` tree and root
`manifest.json`; APS must not depend on hashed bundle names or repository
source paths.

## Source checkout

1. Pin the AOSP-WinScope source revision and verify the Android 17 provenance
   files before building.
2. Build the standalone Web output with the repository's documented toolchain.
3. Treat `dist/prod/` as the Web root and consume its generated
   `manifest.json`.

Source consumption is a build-time path. APS does not need to add Kotlin,
JCEF, Compose, or a WinScope-specific bridge to use the standalone viewer.

## Release archive

1. Select an immutable release under `dist/public/<version>/` or its published
   equivalent.
2. Verify `SHA256SUMS` against `aosp-winscope-<version>.zip`.
3. Verify `release-index.json`, `frozen-inputs.json`, the attestation, the
   copied Stage 7 validation report, and the Stage 10 reproducibility report.
4. Read the copied `APS_INTEGRATION.md` instructions and verify every artifact
   listed by the release index before unpacking.
5. Unpack the archive and use its `web/` directory plus root `manifest.json`.

The archive is self-contained for APS release CI: Node, npm, Python, Go, and
Perfetto build tools are not required after verification and unpacking.

## Web contract

The consumer-visible files are:

```text
<distribution>/
├── web/
│   ├── index.html
│   ├── runtime-config.json
│   └── local JavaScript, CSS, WASM, and other assets
└── manifest.json
```

`manifest.json` is schema version 1 and lists the Web assets and SHA-256
digests. `web/index.html` and `web/runtime-config.json` are mandatory. Resolve
all resources relative to the Web root: the application must work when mounted
under a non-root path, and APS must not rewrite asset URLs or infer bundle
names.

The default runtime configuration is standalone/file-only. Capture is enabled
only through the launcher-managed, authenticated loopback proxy contract. No
automatic external runtime request, remote CDN, fixed port, or `file://` load
is part of the APS integration boundary.

## Bridge status

There is no APS host bridge in version 1. APS can embed or serve the Web tree as
an ordinary local application. A future bridge must introduce its own protocol
version and capability negotiation while preserving this distribution contract;
it must not fork the Web product or make the standalone archive depend on APS.
