const fs = require("node:fs/promises");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const ROOT = path.resolve(__dirname, "..");
const REQUIRED_HOST_FILES = [
  "main.cjs",
  "window_chrome.cjs",
  "services.cjs",
  "ai-service.cjs",
  "security.cjs",
  "targets.cjs",
  "binary_arch.cjs",
  "preferences.cjs",
  "preload.cjs",
  "smoke-probe.cjs",
  "package.json",
];
const SIGNING_ENV = [
  "CSC_LINK",
  "CSC_KEY_PASSWORD",
  "CSC_NAME",
  "CSC_KEYCHAIN",
  "WIN_CSC_LINK",
  "WIN_CSC_KEY_PASSWORD",
  "APPLE_ID",
  "APPLE_APP_SPECIFIC_PASSWORD",
  "APPLE_TEAM_ID",
  "APPLE_API_KEY",
  "APPLE_API_KEY_ID",
  "APPLE_API_ISSUER",
];

// A function config reads the parent's exact Electron pin at invocation time.
module.exports = async function createConfiguration({
  projectRoot = ROOT,
  hostPlatform = process.platform,
  hostArch = process.arch,
} = {}) {
  const { targetFor, assertNativeTarget, verifyRuntime } = await import(
    pathToFileURL(path.join(__dirname, "prepare.mjs")).href
  );
  const host = targetFor(hostPlatform, hostArch);
  const metadata = JSON.parse(
    await fs.readFile(path.join(projectRoot, "package.json"), "utf8"),
  );
  const electronVersion =
    metadata.devDependencies?.electron ?? metadata.dependencies?.electron;
  if (!/^\d+\.\d+\.\d+$/.test(electronVersion ?? "")) {
    throw new Error(
      "Root package.json must pin an exact stable Electron version",
    );
  }
  const runtime = path.join(projectRoot, "dist/desktop/runtime", host.key);
  console.warn(
    "[desktop] Local unsigned package lane. macOS signing is explicitly disabled to preserve runtime hashes. No signing/notarization is claimed.",
  );
  // PKG certificate discovery otherwise ignores mac.identity = null.
  process.env.CSC_IDENTITY_AUTO_DISCOVERY = "false";
  return {
    appId: "com.aosp.winscope",
    productName: "AOSP WinScope",
    icon: path.join(projectRoot, "desktop/icon.png"),
    extraMetadata: { version: metadata.version },
    electronVersion,
    directories: {
      app: path.join(projectRoot, "desktop/app"),
      output: path.join(projectRoot, "dist/desktop/packages"),
    },
    files: ["*.cjs", "package.json", "!*.test.cjs", "!node_modules{,/**/*}"],
    asar: true,
    extraResources: [{ from: runtime, to: "runtime", filter: ["**/*"] }],
    npmRebuild: false,
    nodeGypRebuild: false,
    buildDependenciesFromSource: false,
    publish: null,
    artifactName: "aosp-winscope-desktop-${version}-${os}-${arch}.${ext}",
    mac: {
      target: [
        {
          target: "dmg",
          arch: [host.arch],
        },
        {
          target: "pkg",
          arch: [host.arch],
        },
      ],
      category: "public.app-category.developer-tools",
      // Signing inner binaries after staging invalidates their manifest digests. A
      // release lane must sign inner files, rehash, then sign the outer app last.
      identity: null,
    },
    win: {
      target: [
        { target: "nsis", arch: ["x64"] },
        { target: "msi", arch: ["x64"] },
      ],
    },
    linux: {
      target: [
        { target: "deb", arch: [host.arch] },
        { target: "rpm", arch: [host.arch] },
      ],
      category: "Development",
      maintainer:
        "AOSP-WinScope contributors <yuchuangu85@users.noreply.github.com>",
    },
    nsis: {
      oneClick: false,
      perMachine: false,
      allowToChangeInstallationDirectory: true,
    },
    msi: {
      oneClick: false,
      perMachine: false,
    },
    pkg: {
      identity: null,
      installLocation: "/Applications",
      isRelocatable: false,
    },
    async beforePack(context) {
      const credentials = SIGNING_ENV.filter((key) => process.env[key]);
      if (credentials.length)
        throw new Error(
          `Signing credentials are unsupported in this local unsigned lane: ${credentials.join(", ")}`,
        );
      if (typeof context.electronPlatformName !== "string")
        throw new Error("Builder target platform is missing");
      // builder-util's Arch enum: x64 = 1, arm64 = 3. Unknown values fail closed.
      const arch =
        typeof context.arch === "string"
          ? context.arch
          : { 1: "x64", 3: "arm64" }[context.arch];
      const target = targetFor(context.electronPlatformName, arch ?? "unknown");
      assertNativeTarget(target, hostPlatform, hostArch);
      if (target.key !== host.key)
        throw new Error("Builder target differs from staged runtime");
      const app = path.join(projectRoot, "desktop/app");
      const pkg = JSON.parse(
        await fs.readFile(path.join(app, "package.json"), "utf8"),
      );
      if (
        pkg.main !== "main.cjs" ||
        pkg.type === "module" ||
        [
          "dependencies",
          "optionalDependencies",
          "bundledDependencies",
          "bundleDependencies",
        ].some((key) => Object.keys(pkg[key] ?? {}).length)
      ) {
        throw new Error(
          "desktop/app must be a dependency-free CJS host with main.cjs",
        );
      }
      const hostFiles = await fs.readdir(app);
      for (const name of new Set([
        ...REQUIRED_HOST_FILES,
        ...hostFiles.filter(
          (file) => file.endsWith(".cjs") && !file.endsWith(".test.cjs"),
        ),
      ])) {
        const stat = await fs.lstat(path.join(app, name));
        if (!stat.isFile() || stat.isSymbolicLink())
          throw new Error(`Host entry must be a regular file: ${name}`);
      }
      await verifyRuntime(runtime, target);
    },
    async afterPack(context) {
      const packagedRuntime =
        context.electronPlatformName === "darwin"
          ? path.join(
              context.appOutDir,
              `${context.packager.appInfo.productFilename}.app`,
              "Contents/Resources/runtime",
            )
          : path.join(context.appOutDir, "resources/runtime");
      await verifyRuntime(packagedRuntime, host);
    },
  };
};
