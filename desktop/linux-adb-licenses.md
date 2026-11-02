# Ubuntu arm64 ADB: Sources, Notices, and Rebuilding

This provider is Ubuntu 24.04 arm64 ADB 34.0.4, not Google Platform Tools 37.0.1.
The bundle does not install packages, execute maintainer scripts, or download
anything on the end user's machine. Ubuntu 24.04 and its system glibc are the
initial runtime baseline. The bundled files require glibc 2.38 or later.

## Delivered Materials

- `packages/` contains the original 19 authenticated binary Debian packages.
- `sources/<source-name>/` contains every file from each matching signed APT
  `Sources` record: the `.dsc`, upstream archives, Debian/Ubuntu changes, and
  detached upstream signatures where supplied. Archives remain compressed.
- `apt/` contains the original signed `InRelease` documents and compressed
  binary/source indexes used to authenticate those exact files.
- `licenses/<binary-name>/copyright` retains each binary package's complete
  copyright information, including copyright resolved through package links.
- `licenses/common/` contains the common license texts referenced by those
  copyright files. `NOTICE.txt` also aggregates the package copyright notices.
- `provenance.json` records versions, origins, SHA-256 values, sizes, APT signing
  authority, ELF dependencies, and the output file hashes (excluding itself).
- `sources/bundler/` contains the bundler, its provider lock, and these notes.

The source records are authenticated through the Ubuntu archive signature;
this does not assert verification of individual upstream/uploader signatures.
Do not replace these delivered materials with links to moving package pages.
Do not remove source archives to reduce the installer size without establishing
and documenting another compliant source-delivery arrangement first.

## License Scope

These files are not all Apache-2.0. Preserve the complete supplied notices and
terms, including Android's third-party notices, BoringSSL/OpenSSL/SSLeay terms,
BSD/ISC/Expat-family terms, LGPL library terms, and the GCC Runtime Library
Exception. The `gcc-14-base` copyright material also covers the GCC runtimes.
The original packages and full matching source packages are retained even when
ELF closure analysis prunes an unnecessary shared library from `lib64/`.

Delivering these library sources is not, by itself, a claim that the enclosing
application meets every LGPL obligation. In particular, the parent application
must preserve applicable debugging/reverse-engineering and replacement/relink
rights. If its integrity checks reject modified libraries, the release must
supply a compatible rebuild/relink path and the application source/object and
build materials needed for that path, or another compliant replacement route.
Do not describe a URL-only source offer or an immutable-library mechanism as
automatically compliant. The parent release owns that application-level gate.

The parent release's intended route is to include a source archive of the exact
application commit in each Linux arm64 delivery, with concrete relink/rebuild
commands that regenerate the runtime manifests using exported `createManifests`
and rebuild the package. That route must work without private release-signing
keys. Treat the delivered archive and verified instructions as a parent release
gate, not as something this helper has already implemented or legally certified.

## Rebuilding the Components

Use a separate native Ubuntu 24.04 arm64 development environment. These are
source development actions, not runtime installation requirements.

1. Verify the recorded source files against `provenance.json` and the retained
   signed APT indexes. Keep each source package's files together.
2. Install Ubuntu's standard source-building tools in that development
   environment. Read the authenticated `.dsc` and install its declared build
   dependencies for the same Ubuntu release.
3. Run `dpkg-source -x <package>.dsc`, then run `dpkg-buildpackage -b -uc -us`
   inside the extracted source directory. This applies the included Ubuntu/
   Debian changes rather than silently substituting a different upstream tree.
4. For unchanged, official pinned packages, the delivered bundler can reproduce
   the component layout using the original signed metadata and package cache:

   ```sh
   python3 bundle-linux-adb.py --output <new-platform-tools> \
     --cache <ubuntu-cache> --lock provider-lock.json
   ```

5. Modified/rebuilt packages are deliberately not accepted as official Ubuntu
   pins. Use the parent application's documented source-build/relink process to
   select the rebuilt libraries, regenerate its runtime integrity manifest, and
   rebuild its package. The enclosing release must supply that process and its
   required application build materials; this helper does not bypass integrity
   checks or claim reproducibility of modified compiler output.

## Build and Validation Boundary

The helper requires native Ubuntu 24.04 arm64, Python 3.12+ with `lzma`, `curl`,
`dpkg-deb` (the `dpkg` package), `readelf` (`binutils`), `gpgv`, and the installed
`ubuntu-keyring` and common license files (`base-files`). An unprivileged build
user is required. No ADB package installation is needed.

APT metadata is cached and reverified on every build. If a cached snapshot has
`Valid-Until`, expiration is enforced. A fresh cache can fail after Ubuntu
replaces an index and removes the pinned version; refresh pins explicitly or
retain the authenticated cache. Never substitute a newer package silently.

The test suite uses synthetic data and mocked tool output. Passing it on macOS
does not establish native execution, successful real `gpgv` authentication,
device connectivity, USB permissions, or final application license compliance.
Hash tests and source delivery are engineering evidence, not legal-compliance
claims. No compliance claim is based solely on source URLs.
