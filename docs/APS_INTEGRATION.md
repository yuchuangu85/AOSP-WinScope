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

1. Obtain the expected release identity and authenticated SHA-256 digest of
   `release-index.json` from a separately configured trusted Sigstore/OIDC
   release workflow.
2. Select the corresponding immutable publication directory without unpacking
   its archive.
3. Run `verify-aps-release.py` from a separately trusted, pinned AOSP-WinScope
   source checkout or APS toolchain, passing the authenticated index digest:

   ```sh
   python3 <trusted-checkout>/scripts/verify-aps-release.py \
     --publication <publication-dir> \
     --expected-index-sha256 <authenticated-index-sha256> \
     --json
   ```

   From the trusted checkout, the equivalent package wrapper is:

   ```sh
   npm run aps:verify -- \
     --publication <publication-dir> \
     --expected-index-sha256 <authenticated-index-sha256>
   ```

   The trusted verifier validates every indexed artifact, `SHA256SUMS`, frozen
   inputs, Stage 7 and Stage 10 reports, the in-toto provenance statement, safe
   ZIP paths, the release inventory, and every Web manifest digest without Git,
   Node, build caches, or network access.
4. Only after verification succeeds, unpack the archive and use its `web/`
   directory plus root `manifest.json`.

Never execute a verifier copied from the publication being checked. The
verifier validates the authenticated index, published provenance statement,
and content digests; it does not turn self-asserted JSON into proof of a
protected workflow. Verification rejects publication-root entries not listed by
the index, non-portable ZIP names, more than 10,000 members, members over 256
MiB, more than 512 MiB total uncompressed data, compression ratios over
200:1, and compression methods other than stored or DEFLATE. This repository
does not currently sign or attest
`release-index.json`; APS consumption remains blocked until the official
release workflow supplies that external identity-bound digest.

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
