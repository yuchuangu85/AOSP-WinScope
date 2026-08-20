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

1. Download the publication files from the GitHub release without unpacking
   the archive. Obtain the approved tagged commit through the APS release
   configuration or another independent trusted channel. Obtain the approved
   build-image digest through the same trusted configuration.
2. Authenticate `release-index.json` against that commit, the official
   repository, and the protected workflow, then calculate its trusted digest:

   ```sh
   gh attestation verify <publication-dir>/release-index.json \
     --repo yuchuangu85/AOSP-WinScope \
     --signer-workflow yuchuangu85/AOSP-WinScope/.github/workflows/official-release.yml \
     --source-ref refs/tags/v<version> \
     --source-digest <trusted-release-commit> \
     --signer-digest <trusted-release-commit> \
     --deny-self-hosted-runners
   INDEX_SHA256=$(python3 -c 'import hashlib,sys; print(hashlib.sha256(open(sys.argv[1], "rb").read()).hexdigest())' \
     <publication-dir>/release-index.json)
   ```

3. Run `verify-aps-release.py` from a separately trusted, pinned AOSP-WinScope
   source checkout or APS toolchain, passing that authenticated index digest:

   ```sh
   python3 <trusted-checkout>/scripts/verify-aps-release.py \
     --publication <publication-dir> \
     --expected-index-sha256 "$INDEX_SHA256" \
     --expected-build-image <trusted-build-image> \
     --json
   ```

   From the trusted checkout, the equivalent package wrapper is:

   ```sh
   npm run aps:verify -- \
     --publication <publication-dir> \
     --expected-index-sha256 "$INDEX_SHA256" \
     --expected-build-image <trusted-build-image>
   ```

   The trusted verifier validates every indexed artifact, `SHA256SUMS`, frozen
   inputs, Stage 7, Stage 10, and Stage 16 reports, the in-toto provenance
   statement, safe
   ZIP paths, the release inventory, the digest-pinned build image and its
   sandboxed runtime-verification evidence, and every Web manifest digest
   without Git, Node, build caches, or network access.
4. Only after verification succeeds, unpack the archive and use its `web/`
   directory plus root `manifest.json`.

Never execute a verifier copied from the publication being checked. The
verifier validates the authenticated index, published provenance statement,
and content digests; it does not turn self-asserted JSON into proof of a
protected workflow. Verification rejects publication-root entries not listed by
the index, non-portable ZIP names, more than 10,000 members, members over 256
MiB, more than 512 MiB total uncompressed data, compression ratios over
200:1, and compression methods other than stored or DEFLATE. The official
workflow attests every publication file before creating the GitHub release.
Authenticating `release-index.json` binds the offline verifier to the complete
indexed publication; APS must reject an index whose attestation identity does
not match the repository and workflow above.

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
digests. Its `capabilities.legacyImport` entry declares the Android 17 legacy
formats retained by the standalone product and the `perfetto` conversion path
used before viewer initialization. `capabilities.capabilityDiscovery` records
that capture controls come from device probes and analysis controls come from
the loaded trace content; neither is inferred from an Android version label.
`web/index.html` and
`web/runtime-config.json` are mandatory. Resolve
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
