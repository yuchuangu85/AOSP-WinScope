# Tool for visualizing window manager traces

## Electron Desktop

The install-and-run desktop distribution packages the WinScope Web UI, Trace
Processor WASM, Go Launcher, frozen Python capture service, a pinned ADB provider
(Google Platform Tools or native Ubuntu ARM64 ADB), and AI gateway with Electron. Installed users do not need to
install Node.js, Python, or ADB separately; optional Codex/Claude CLIs and their
authentication remain user-managed. No credentials or model access are bundled.

The desktop release contract covers five native Electron targets: macOS Intel
(`x64`) and Apple Silicon (`arm64`), Windows AMD64 (`x64`), and Linux
`x64` and `arm64`. macOS requires 13 or later; Windows x64 requires Windows 10
or later. Windows ARM64 desktop is not supported. The Windows x64 packages bundle
Google's **32-bit x86 ADB**, while Electron, Go, and frozen capture are native
x64. Linux x64 uses an Ubuntu 22.04 build baseline. Linux ARM64
initially targets Ubuntu 24.04 with native Ubuntu ADB and requires glibc 2.38 or
later, not arbitrary Linux distributions. USB debugging, authorization, drivers,
OS rights, and Linux udev permissions still apply.

The five-target contract requires ten installer assets: DMG/PKG only for each
macOS architecture, NSIS EXE/MSI only for Windows x64, and DEB/RPM only for each
Linux architecture. The packaging jobs in
[`electron.yml`](.github/workflows/electron.yml) run manually, on pushes of a
stable release tag, or on path-filtered PRs and retain the reusable interface.
After a successful manual run on the repository's default branch or a pushed
release tag named exactly `v<package.json version>`, its inline `publish` job
automatically revalidates the complete publication and publishes a GitHub
**Release**: manual runs are tagged `v<version>-desktop.<packaging-run-id>`,
while a tag push publishes under the pushed `v<version>` tag. PRs, other
branches, and other tag names do not publish. Uploads remain unpublished drafts
until their exact asset names, sizes, and SHA-256 digests pass remote
verification; existing releases and tags are never overwritten. The protected
official-release and standalone security workflows remain removed. There is no
portable Launcher ZIP, desktop ZIP, AppImage, binary tar.gz, or universal macOS
package. Packages are unsigned; local installer names and metadata do not
authenticate a publisher. This packaging lane supplies no official OIDC
attestation, OS code signing, or Apple notarization.

Desktop assets include `desktop-release.json` and `desktop-SHA256SUMS.txt`
alongside the installers. Linux ARM64 additionally delivers the exact app-commit
source `.tar.gz` archive (a separate legal/source artifact, not an installer) and
bundled library sources, original DEBs, signed indexes,
licenses, and provenance. Source delivery and a private-key-free replacement/
relink procedure are release requirements, not a claim of completed legal or
native GPG approval. Local/manual official-release tools and their validation
contracts remain available, but no current workflow runs that release gate or
produces its attestations. Desktop metadata and checksums are integrity evidence,
not release approval or authenticated provenance. GitHub Actions may
use ZIP for artifact transfer; that transport is not a release ZIP product.

This multi-platform release implementation is underway; adding the publisher is
not evidence of a successful hosted publication or official release qualification.
See [Electron Desktop](docs/ELECTRON.md)
for installation, artifact names/index/checksums, build/start/test commands, data
retention, and validation gaps, and
[ADR 0030](docs/adr/0030-multi-platform-desktop-release.md) for the release policy.
Legacy portable Launcher packaging and APS consumer CLI contracts remain
available for manual/local use only. GitHub CI does not generate or publish
those legacy products; this CI policy does not delete the local tools.

## Developing WinScope

When the trace is enabled, Window Manager and Surface Flinger capture and
save current state to a file at each point of interest.
`frameworks/base/core/proto/android/server/windowmanagertrace.proto`
and `frameworks/native/services/surfaceflinger/layerproto/layerstrace.proto`
contain the proto definitions for their internal states.

### Checking out code and setting up environment

- [Download Android source](https://source.android.com/setup/build/downloading)
- Navigate to `development/tools/winscope`
- Install dependencies:
  ```bash
  npm ci
  ```

### Running the project locally

From the repository root, start WinScope with the Launcher and device capture:

```bash
npm start
```

The default startup builds the current Web UI and the host-native Launcher,
then opens the browser with device capture enabled. It requires the pinned
standalone build toolchain, Python, and Android Platform Tools (`adb`). See
[the Launcher contract](docs/LAUNCHER.md) for prerequisites and launch options.

The product runs through the standalone Launcher, which owns the loopback
server and device capture proxy. Direct Web-only startup is not a supported
product mode.

### Interface languages

All application pages support English and Simplified Chinese. Use the language
selector in the top toolbar, or **AI settings → Interface language**, to switch
in place without resetting loaded traces, filters, SQL queries, or AI drafts.
On first launch the interface follows the browser's preferred supported language;
an explicit selection is remembered locally. Opening `/?no-persistence` uses the
browser preference without reading or writing the saved language.

Only application-owned interface text is translated. Trace properties and values,
file/device names, SQL and result aliases, provider/model names, user content,
and AI answers retain their original text.

Translations live in `src/common/i18n_*.ts`; English source strings are the keys.
Run `npm run i18n:verify -- --strict` to audit all page templates and curated UI
labels and literal loading-progress messages,
`node --test scripts/verify-i18n.test.mjs` for the audit's regression
tests, and `npm run test:unit:i18n` for focused browser unit tests. The production
browser regression (`npm run test:e2e:ai:browser`) also checks language switching,
reload, privacy behavior, data preservation, and Chinese narrow-window layouts;
its evidence is written to `dist/validation/i18n-browser.json`.

### Build & test & deploy changes

- Navigate to `development/tools/winscope`
- Run `npm run` to get the list of available commands

### Update IntDefMapping

- Build `framework-minus-apex-intdefs` module and a preprocessor will
  generate the latest IntDefMapping. From the `ANDROID_ROOT` run:

```
. build/envsetup.sh
m framework-minus-apex-intdefs
```

- Copy the generated `intDefMapping.json` files to the `winscope`.

```
python3 -c 'import sys,json,collections; print(json.dumps(collections.OrderedDict(sorted(collections.ChainMap(*map(lambda x:json.load(open(x)), sys.argv[1:])).items())), indent=2))' $(find out/soong/.intermediates/frameworks/base -iname intDefMapping.json) > ./development/tools/winscope/src/common/intDefMapping.json
```

- Upload the changes.

```
repo start intdef-update
git commit -am "Update intdef mapping" "Test: N/A"
repo upload --cbr .
```

### Building with internal extensions

Internal paths in vendor/ which are not available in AOSP must be replaced by
stub files. See getWaylandSafePath for an example
