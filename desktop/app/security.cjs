"use strict";

const { createHash } = require("node:crypto");
const { createReadStream } = require("node:fs");
const fs = require("node:fs/promises");
const path = require("node:path");
const os = require("node:os");
const { targetFor } = require("./targets.cjs");
const { assertBinaryArchitecture } = require("./binary_arch.cjs");

function runtimeMetadata(target, adbVersion) {
  return {
    components: {
      launcher: { arch: target.arch, source: "go" },
      capture: { arch: target.captureArch, source: "pyinstaller" },
      adb: {
        arch: target.adbArch,
        source: target.adbSource ?? "google-platform-tools",
        version: adbVersion,
      },
    },
    compatibility: {
      emulation: target.emulation ?? null,
      minimumOS:
        target.emulation === "windows-x86-adb"
          ? "Windows 11 ARM"
          : target.adbSource === "ubuntu-24.04"
            ? "Ubuntu 24.04"
            : null,
    },
  };
}

function verifyRuntimeMetadata(manifest, target) {
  const required = target.arch === "arm64" && target.platform !== "darwin";
  if (
    !required &&
    manifest.components === undefined &&
    manifest.compatibility === undefined
  )
    return; // Original four staged runtimes predate compatibility metadata.
  const version = manifest.components?.adb?.version;
  const expected = runtimeMetadata(target, version);
  if (
    !/^\d+\.\d+\.\d+$/.test(version ?? "") ||
    (target.adbSource === "ubuntu-24.04" && version !== "34.0.4") ||
    (target.emulation === "windows-x86-adb" && version !== "37.0.1") ||
    Object.entries(expected.components).some(([name, fields]) =>
      Object.entries(fields).some(
        ([key, value]) => manifest.components?.[name]?.[key] !== value,
      ),
    ) ||
    Object.entries(expected.compatibility).some(
      ([key, value]) => manifest.compatibility?.[key] !== value,
    )
  )
    throw new Error("Invalid desktop runtime component/compatibility metadata");
}

async function verifyRuntimeBinaries(root, target, assets) {
  const binaries = [
    [`launcher/winscope-launcher${target.suffix}`, target.arch],
    [`capture/winscope-capture${target.suffix}`, target.captureArch],
    [`platform-tools/adb${target.suffix}`, target.adbArch],
  ];
  if (target.platform === "win32") {
    for (const name of [
      "AdbWinApi.dll",
      "AdbWinUsbApi.dll",
      "libwinpthread-1.dll",
    ])
      if (!assets.some((asset) => asset.path === `platform-tools/${name}`))
        throw new Error(
          `Desktop runtime is incomplete: platform-tools/${name}`,
        );
    for (const asset of assets)
      if (
        asset.path.startsWith("platform-tools/") &&
        /\.dll$/i.test(asset.path)
      )
        binaries.push([asset.path, target.adbArch]);
  }
  for (const [file, arch] of binaries)
    await assertBinaryArchitecture(path.join(root, file), {
      platform: target.platform,
      arch,
    });
}

function parseReadyOrigin(line) {
  const match =
    /^Winscope is available at (http:\/\/127\.0\.0\.1:([1-9]\d{0,4}))\/$/.exec(
      line,
    );
  if (!match || Number(match[2]) > 65535)
    throw new Error("Invalid desktop service readiness response");
  return match[1];
}

function isAppUrl(value, origin) {
  try {
    const url = new URL(value);
    return (
      url.origin === origin &&
      url.protocol === "http:" &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}

function isRendererResource(value, origin) {
  if (isAppUrl(value, origin)) return true;
  if (value.startsWith("blob:")) return isAppUrl(value.slice(5), origin);
  return value.startsWith("data:") || value === "about:blank";
}

function isExternalDocumentation(value) {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      !url.port &&
      url.hostname === "source.android.com"
    );
  } catch {
    return false;
  }
}

const secureWebPreferences = Object.freeze({
  nodeIntegration: false,
  nodeIntegrationInWorker: false,
  nodeIntegrationInSubFrames: false,
  contextIsolation: true,
  sandbox: true,
  webSecurity: true,
  webviewTag: false,
  allowRunningInsecureContent: false,
  navigateOnDragDrop: false,
});

function validAssetPath(value) {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value.length <= 1024 &&
    !/[\\\x00-\x1f\x7f:]/.test(value) &&
    !value.startsWith("/") &&
    value.split("/").every((part) => part && part !== "." && part !== "..")
  );
}

async function verifyRuntime(
  root,
  platform = process.platform,
  arch = process.arch,
) {
  const target = targetFor(platform, arch);
  const manifestPath = path.join(root, "runtime-manifest.json");
  if ((await fs.stat(manifestPath)).size > 4 * 1024 * 1024)
    throw new Error("Desktop runtime manifest is too large");
  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
  if (
    manifest.schemaVersion !== 1 ||
    manifest.platform !== platform ||
    manifest.arch !== arch ||
    !Array.isArray(manifest.assets) ||
    manifest.assets.length === 0 ||
    manifest.assets.length > 20000
  ) {
    throw new Error(
      "Desktop runtime does not match this platform and architecture",
    );
  }
  verifyRuntimeMetadata(manifest, target);
  if (
    platform === process.platform &&
    arch === process.arch &&
    target.emulation === "windows-x86-adb" &&
    Number(os.release().split(".")[2] ?? 0) < 22000
  )
    throw new Error("Windows x86 ADB emulation requires Windows 11 ARM");
  const paths = new Set();
  for (const asset of manifest.assets) {
    if (
      !validAssetPath(asset.path) ||
      asset.path === "runtime-manifest.json" ||
      !/^[0-9a-f]{64}$/.test(asset.sha256) ||
      paths.has(asset.path)
    ) {
      throw new Error("Invalid desktop runtime inventory");
    }
    paths.add(asset.path);
    let current = root;
    for (const part of asset.path.split("/")) {
      current = path.join(current, part);
      if ((await fs.lstat(current)).isSymbolicLink())
        throw new Error("Desktop runtime must not contain symbolic links");
    }
    if (!(await fs.stat(current)).isFile())
      throw new Error("Desktop runtime asset is not a regular file");
    const hash = createHash("sha256");
    for await (const chunk of createReadStream(current)) hash.update(chunk);
    if (hash.digest("hex") !== asset.sha256)
      throw new Error(`Desktop runtime integrity check failed: ${asset.path}`);
  }
  const suffix = platform === "win32" ? ".exe" : "";
  for (const required of [
    "web/index.html",
    "web/runtime-config.json",
    "web/engine_bundle.js",
    "web/trace_processor.wasm",
    "web/trace_processor_memory64.wasm",
    "manifest.json",
    `launcher/winscope-launcher${suffix}`,
    `capture/winscope-capture${suffix}`,
    `platform-tools/adb${suffix}`,
    "ai/gateway.js",
    "ai/config.js",
    "ai/cli.js",
    "ai/index.js",
    "platform-tools/NOTICE.txt",
    "platform-tools/source.properties",
  ]) {
    if (!paths.has(required))
      throw new Error(`Desktop runtime is incomplete: ${required}`);
  }
  if (![...paths].some((file) => file.startsWith("capture/_internal/")))
    throw new Error("Capture is missing its embedded Python runtime");
  await verifyRuntimeBinaries(root, target, manifest.assets);
  return manifest;
}

module.exports = {
  parseReadyOrigin,
  isAppUrl,
  isRendererResource,
  isExternalDocumentation,
  secureWebPreferences,
  validAssetPath,
  verifyRuntime,
  runtimeMetadata,
  verifyRuntimeMetadata,
  verifyRuntimeBinaries,
};
