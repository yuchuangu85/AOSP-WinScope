import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import * as fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { test } from "node:test";
import {
  ROOT,
  adbEnvironment,
  assertNativeTarget,
  copyTree,
  createManifests,
  downloadArchive,
  extractPlatformTools,
  inventory,
  inspectPython,
  parseArgs,
  run,
  readAdbSourceVersion,
  safeRelative,
  sha256,
  targetFor,
  stageLinuxArmAdb,
  validateArchiveEntries,
  validateLock,
  verifyChecksum,
  verifyAdbVersion,
  verifyRuntime,
} from "./prepare.mjs";

const require = createRequire(import.meta.url);
const createConfiguration = require("./electron-builder.cjs");
const { targets, matrix } = require("./app/targets.cjs");
const python =
  process.env.WINSCOPE_TEST_PYTHON ||
  (process.platform === "win32" ? "python" : "python3");
const digest = (data) => createHash("sha256").update(data).digest("hex");

async function temporary(t) {
  const directory = await fs.mkdtemp(
    path.join(os.tmpdir(), "winscope desktop tests "),
  );
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  return directory;
}

async function put(root, relative, content = relative, mode = 0o644) {
  const file = path.join(root, relative);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, content, { mode });
  return file;
}

function binaryHeader(platform, arch) {
  if (platform === "win32") {
    const size = arch === "ia32" ? 96 : 112;
    const bytes = Buffer.alloc(88 + size);
    bytes.write("MZ");
    bytes.writeUInt32LE(64, 60);
    bytes.write("PE\0\0", 64);
    bytes.writeUInt16LE({ ia32: 0x14c, x64: 0x8664, arm64: 0xaa64 }[arch], 68);
    bytes.writeUInt16LE(size, 84);
    bytes.writeUInt16LE(2, 86);
    bytes.writeUInt16LE(arch === "ia32" ? 0x10b : 0x20b, 88);
    return bytes;
  }
  if (platform === "linux") {
    const bytes = Buffer.alloc(64);
    bytes.set([0x7f, 0x45, 0x4c, 0x46, 2, 1, 1]);
    bytes.writeUInt16LE(2, 16);
    bytes.writeUInt16LE(arch === "x64" ? 62 : 183, 18);
    bytes.writeUInt32LE(1, 20);
    bytes.writeUInt16LE(64, 52);
    return bytes;
  }
  if (arch === "universal") {
    const bytes = Buffer.alloc(112);
    bytes.writeUInt32BE(0xcafebabe, 0);
    bytes.writeUInt32BE(2, 4);
    ["x64", "arm64"].forEach((cpu, i) => {
      bytes.writeUInt32BE(cpu === "x64" ? 0x01000007 : 0x0100000c, 8 + i * 20);
      bytes.writeUInt32BE(48 + i * 32, 16 + i * 20);
      bytes.writeUInt32BE(32, 20 + i * 20);
      binaryHeader(platform, cpu).copy(bytes, 48 + i * 32);
    });
    return bytes;
  }
  const bytes = Buffer.alloc(32);
  bytes.writeUInt32LE(0xfeedfacf, 0);
  bytes.writeUInt32LE(arch === "x64" ? 0x01000007 : 0x0100000c, 4);
  bytes.writeUInt32LE(2, 12);
  return bytes;
}

async function fixture(root, target) {
  for (const file of [
    "web/index.html",
    "web/runtime-config.json",
    "web/engine_bundle.js",
    "web/trace_processor.wasm",
    "web/trace_processor_memory64.wasm",
    "web/3rdpartylicenses.txt",
    `launcher/winscope-launcher${target.suffix}`,
    `capture/winscope-capture${target.suffix}`,
    "capture/_internal/python.bin",
    `platform-tools/adb${target.suffix}`,
    "platform-tools/NOTICE.txt",
    "platform-tools/source.properties",
    "ai/cli.js",
    "ai/gateway.js",
    "ai/config.js",
    "ai/index.js",
  ]) {
    await put(
      root,
      file,
      file,
      /(?:launcher|capture|adb)(?:\.exe)?$/.test(file) ? 0o755 : 0o644,
    );
  }
  if (target.platform === "win32")
    for (const file of [
      "AdbWinApi.dll",
      "AdbWinUsbApi.dll",
      "libwinpthread-1.dll",
    ])
      await put(
        root,
        `platform-tools/${file}`,
        binaryHeader("win32", target.adbArch),
      );
  for (const [file, arch] of [
    [`launcher/winscope-launcher${target.suffix}`, target.arch],
    [`capture/winscope-capture${target.suffix}`, target.captureArch],
    [`platform-tools/adb${target.suffix}`, target.adbArch],
  ])
    await put(root, file, binaryHeader(target.platform, arch), 0o755);
  await put(
    root,
    "platform-tools/source.properties",
    `Pkg.Revision = ${target.adbSource === "ubuntu-24.04" ? "34.0.4" : "37.0.1"}\n`,
  );
  await createManifests(root, target);
  return root;
}

async function hostFixture(root, target, version = "19.2.3") {
  await put(
    root,
    "package.json",
    JSON.stringify({ version, devDependencies: { electron: "45.2.1" } }),
  );
  await put(
    root,
    "desktop/app/package.json",
    JSON.stringify({ version: "0.0.1", main: "main.cjs" }),
  );
  for (const name of [
    "main",
    "window_chrome",
    "services",
    "ai-service",
    "security",
    "targets",
    "binary_arch",
    "preferences",
    "preload",
    "smoke-probe",
  ])
    await put(root, `desktop/app/${name}.cjs`);
  await fixture(path.join(root, "dist/desktop/runtime", target.key), target);
  return createConfiguration({
    projectRoot: root,
    hostPlatform: target.platform,
    hostArch: target.arch,
  });
}

const entry = (name, options = {}) => ({
  name,
  size: 1,
  directory: false,
  mode: 0o100644,
  encrypted: false,
  ...options,
});

test("five immutable SSOT native targets map Go, capture, ADB sources and architectures", () => {
  const keys = [
    "darwin-x64",
    "darwin-arm64",
    "win32-x64",
    "linux-x64",
    "linux-arm64",
  ];
  assert.deepEqual(
    keys.map((key) => {
      const [platform, arch] = key.split("-");
      const value = targetFor(platform, arch);
      assert.equal(value.goarch, arch === "x64" ? "amd64" : arch);
      assert.equal(value.suffix, platform === "win32" ? ".exe" : "");
      assert.equal(value.captureArch, arch);
      assert.ok(Object.isFrozen(value));
      assert.equal(
        value.adbArch,
        platform === "win32"
          ? "ia32"
          : platform === "darwin"
            ? "universal"
            : arch,
      );
      return value.key;
    }),
    keys,
  );
  assert.ok(Object.isFrozen(targets));
  assert.deepEqual(
    matrix().include.map((row) => row.target),
    keys,
  );
  assert.equal(targetFor("linux", "arm64").archive, null);
  assert.equal(targetFor("linux", "arm64").adbSource, "ubuntu-24.04");
  for (const [platform, arch] of [
    ["freebsd", "x64"],
    ["darwin", "ia32"],
    ["win32", "ia32"],
    ["win32", "arm64"],
    ["linux", "riscv64"],
  ]) {
    assert.throws(() => targetFor(platform, arch), /Unsupported/);
  }
  for (const platform of ["darwin", "win32", "linux"])
    assert.throws(
      () => assertNativeTarget(targetFor(platform, "x64"), platform, "arm64"),
      /Native host build required|Unsupported native runtime target/,
    );
});

test("CLI builds by default; skip and Python path are explicit and unknown options fail", () => {
  assert.equal(parseArgs([]).skipWebBuild, false);
  assert.deepEqual(
    parseArgs(["--skip-web-build", "--python", "/a path/python"]),
    { skipWebBuild: true, python: "/a path/python", help: false },
  );
  for (const args of [
    ["--target", "linux-arm64"],
    ["--python"],
    ["--skip-ai-build"],
  ])
    assert.throws(() => parseArgs(args), /Unknown or incomplete/);
});

test("Linux ARM stages the native locked APT helper without Google archive selection", async (t) => {
  const root = await temporary(t);
  const calls = [];
  await stageLinuxArmAdb(
    "/native python",
    path.join(root, "stage"),
    path.join(root, "cache"),
    async (...args) => calls.push(args),
  );
  assert.deepEqual(calls, [
    [
      "/native python",
      [
        "-I",
        path.join(ROOT, "desktop/bundle-linux-adb.py"),
        "--output",
        path.join(root, "stage/platform-tools"),
        "--cache",
        path.join(root, "cache/ubuntu"),
        "--lock",
        path.join(ROOT, "desktop/runtime-lock.json"),
      ],
    ],
  ]);
  const env = { PATH: "/original", LD_LIBRARY_PATH: "/untrusted" };
  for (const target of targets) {
    const actual = adbEnvironment(root, target, env);
    assert.deepEqual(
      actual,
      target.key === "linux-arm64"
        ? { ...env, LD_LIBRARY_PATH: path.join(root, "platform-tools/lib64") }
        : env,
    );
  }
  assert.equal(env.LD_LIBRARY_PATH, "/untrusted");
});

test("ADB source metadata and actual version output keep Ubuntu 34 separate from Google 37", async (t) => {
  const base = await temporary(t);
  for (const target of targets) {
    const root = await fixture(path.join(base, target.key), target);
    const expected = target.key === "linux-arm64" ? "34.0.4" : "37.0.1";
    assert.equal(await readAdbSourceVersion(root, target), expected);
    verifyAdbVersion(
      `Android Debug Bridge version 1.0.41\nVersion ${expected}-fixture\nInstalled as /adb`,
      expected,
    );
    assert.throws(
      () =>
        verifyAdbVersion(
          "Android Debug Bridge version 1.0.41\nVersion 0.0.0",
          expected,
        ),
      /differs/,
    );
  }
  const root = path.join(base, "linux-arm64");
  await put(
    root,
    "platform-tools/source.properties",
    "Pkg.Revision = 37.0.1\n",
  );
  await assert.rejects(
    readAdbSourceVersion(root, targetFor("linux", "arm64")),
    /source version/,
  );
  await put(
    root,
    "platform-tools/source.properties",
    "Pkg.Revision = 34.0.4\nPkg.Revision = 34.0.4\n",
  );
  await assert.rejects(
    readAdbSourceVersion(root, targetFor("linux", "arm64")),
    /source version/,
  );
});

test("Python binary architecture is checked before any interpreter execution", async (t) => {
  const root = await temporary(t);
  const executable = await put(
    root,
    "python-arm64",
    binaryHeader("linux", "x64"),
    0o755,
  );
  await assert.rejects(
    inspectPython(executable, targetFor("linux", "arm64")),
    /architecture mismatch/,
  );
  await put(root, "python-arm64", "#!/bin/sh\nexit 0\n");
  await assert.rejects(
    inspectPython(executable, targetFor("linux", "arm64")),
    /Mach-O|truncated/,
  );
});

test("portable relative paths reject traversal, absolute names, ADS and platform aliases", () => {
  for (const file of [
    "web/a file.js",
    "capture/_internal/Python.framework/Versions/3.12/Python",
  ])
    assert.equal(safeRelative(file), file);
  for (const file of [
    "",
    "/tmp/x",
    "../escape",
    "web/../escape",
    "./x",
    "web//x",
    "C:/a",
    "C:\\a",
    "//server/a",
    "web/a\u0000b",
    "web/x:stream",
    "web/a.",
    "web/a ",
    "web/NUL.txt",
    "web/COM1",
    "web/a\\b",
  ])
    assert.throws(() => safeRelative(file), /Unsafe/);
});

test("archive metadata rejects traversal, duplicate aliases, special files and bombs", () => {
  assert.equal(validateArchiveEntries([entry("platform-tools/adb")]).length, 1);
  const bad = [
    [entry("../escape")],
    [entry("/platform-tools/adb")],
    [entry("elsewhere/adb")],
    [entry("platform-tools/../escape")],
    [entry("platform-tools/adb"), entry("platform-tools/ADB")],
    [entry("platform-tools/link", { mode: 0o120777 })],
    [entry("platform-tools/fifo", { mode: 0o010644 })],
    [entry("platform-tools/adb", { encrypted: true })],
    [entry("platform-tools/adb", { size: -1 })],
    [entry("platform-tools/adb", { size: 129 * 1024 * 1024 })],
    [entry("platform-tools/a"), entry("platform-tools/a/child")],
    [entry("platform-tools", { directory: false })],
  ];
  for (const entries of bad)
    assert.throws(() => validateArchiveEntries(entries));
  assert.throws(
    () =>
      validateArchiveEntries(
        Array.from({ length: 5 }, (_, i) =>
          entry(`platform-tools/${i}`, { size: 128 * 1024 * 1024 }),
        ),
      ),
    /expanded/,
  );
});

test("committed official lock pins all archives and exact file allowlists", async () => {
  const lock = validateLock(
    JSON.parse(
      await fs.readFile(path.join(ROOT, "desktop/runtime-lock.json"), "utf8"),
    ),
  );
  assert.deepEqual(
    [...lock.supportedTargets].sort(),
    targets.map((target) => target.key).sort(),
  );
  assert.match(lock.platformTools.archives.windows.url, /-win\.zip$/);
  for (const record of Object.values(lock.platformTools.archives)) {
    assert.ok(record.runtimeFiles.includes("NOTICE.txt"));
    assert.ok(record.runtimeFiles.includes("source.properties"));
    assert.ok(!record.runtimeFiles.includes("fastboot"));
  }
  for (const mutate of [
    (value) => {
      value.supportedTargets.push("win32-arm64");
    },
    (value) => {
      value.supportedTargets.pop();
    },
    (value) => {
      value.supportedTargets[0] = value.supportedTargets[1];
    },
    (value) => {
      value.platformTools.archives.darwin.sha256 = "not a hash";
    },
    (value) => {
      value.platformTools.archives.linux.url =
        "https://untrusted.invalid/file.zip";
    },
    (value) => {
      value.platformTools.archives.windows.runtimeFiles = ["../escape"];
    },
  ]) {
    const bad = structuredClone(lock);
    mutate(bad);
    assert.throws(() => validateLock(bad));
  }
});

test("complete Apache license is included rather than the truncated legacy constant", async () => {
  const license = await fs.readFile(
    path.join(ROOT, "desktop/LICENSE.txt"),
    "utf8",
  );
  for (let section = 1; section <= 9; section++)
    assert.match(license, new RegExp(`^   ${section}\\. `, "m"));
  assert.match(license, /END OF TERMS AND CONDITIONS/);
  assert.match(license, /APPENDIX: How to apply/);
});

test("checksum validation and separate cache reuse fail closed on corrupt cache", async (t) => {
  const root = await temporary(t);
  const content = "official archive fixture";
  const record = {
    sha256: digest(content),
    size: Buffer.byteLength(content),
    url: "https://dl.google.com/test.zip",
  };
  const file = await put(root, `${record.sha256}.zip`, content);
  assert.equal(await sha256(file), record.sha256);
  await verifyChecksum(file, record.sha256);
  assert.equal(await downloadArchive(record, root), file);
  await assert.rejects(verifyChecksum(file, "0".repeat(64)), /SHA256 mismatch/);
  await fs.writeFile(file, "bad");
  await assert.rejects(downloadArchive(record, root), /Invalid desktop cache/);
});

test("run uses argument arrays without shell expansion, including paths with spaces", async (t) => {
  const root = await temporary(t);
  const arg = "a path with spaces; $(not a command)";
  assert.equal(
    await run(
      process.execPath,
      ["-e", "process.stdout.write(process.argv[1])", arg],
      { cwd: root, capture: true },
    ),
    arg,
  );
  await assert.rejects(
    run(process.execPath, ["-e", "process.exit(7)"]),
    /Command failed \(7\)/,
  );
});

test("real ZIP extraction verifies hash and central directory before writing", async (t) => {
  const root = await temporary(t);
  const file = path.join(root, "official fixture.zip");
  const script =
    'import sys,zipfile; z=zipfile.ZipFile(sys.argv[1],"w"); z.writestr(sys.argv[2],"hello"); z.close()';
  await run(python, ["-I", "-c", script, file, "platform-tools/NOTICE.txt"]);
  const expected = await sha256(file);
  await extractPlatformTools(
    file,
    expected,
    path.join(root, "valid extraction"),
    python,
  );
  assert.equal(
    await fs.readFile(
      path.join(root, "valid extraction/platform-tools/NOTICE.txt"),
      "utf8",
    ),
    "hello",
  );
  await assert.rejects(
    extractPlatformTools(
      file,
      "0".repeat(64),
      path.join(root, "bad hash"),
      python,
    ),
    /SHA256 mismatch/,
  );
  await run(python, ["-I", "-c", script, file, "platform-tools/../../escape"]);
  await assert.rejects(
    extractPlatformTools(
      file,
      await sha256(file),
      path.join(root, "traversal"),
      python,
    ),
    /Unsafe/,
  );
  await assert.rejects(fs.stat(path.join(root, "escape")), { code: "ENOENT" });
  await assert.rejects(fs.stat(path.join(root, "traversal")), {
    code: "ENOENT",
  });
});

test(
  "copy materializes internal framework links, preserves modes, and rejects escapes/cycles",
  { skip: process.platform === "win32" },
  async (t) => {
    const root = await temporary(t);
    const source = path.join(root, "source");
    const destination = path.join(root, "destination");
    await put(source, "framework/Versions/3.12/Python", "native bytes", 0o755);
    await fs.symlink("3.12", path.join(source, "framework/Versions/Current"));
    await fs.symlink(
      "Versions/Current/Python",
      path.join(source, "framework/Python"),
    );
    await copyTree(source, destination);
    assert.equal(
      await fs.readFile(path.join(destination, "framework/Python"), "utf8"),
      "native bytes",
    );
    assert.equal(
      (await fs.stat(path.join(destination, "framework/Python"))).mode & 0o777,
      0o755,
    );
    assert.ok(
      !(
        await fs.lstat(path.join(destination, "framework/Versions/Current"))
      ).isSymbolicLink(),
    );
    const external = await put(root, "external", "secret");
    await fs.symlink(external, path.join(source, "escape"));
    await assert.rejects(
      copyTree(source, path.join(root, "escaped")),
      /escapes/,
    );
    await fs.unlink(path.join(source, "escape"));
    await fs.symlink(".", path.join(source, "cycle"));
    await assert.rejects(copyTree(source, path.join(root, "cycled")), /cycle/);
  },
);

test("manifests are schema 1 exact sorted inventories and never inventory themselves", async (t) => {
  const root = await temporary(t);
  const target = targetFor();
  await fixture(root, target);
  const value = await verifyRuntime(root, target);
  assert.equal(value.schemaVersion, 1);
  assert.equal(value.platform, target.platform);
  assert.equal(value.arch, target.arch);
  assert.ok(
    !value.assets.some((asset) => asset.path === "runtime-manifest.json"),
  );
  assert.ok(value.assets.some((asset) => asset.path === "manifest.json"));
  assert.deepEqual(
    value.assets.map((asset) => asset.path),
    [...value.assets.map((asset) => asset.path)].sort(),
  );
  const web = JSON.parse(
    await fs.readFile(path.join(root, "manifest.json"), "utf8"),
  );
  assert.ok(web.assets.every((asset) => asset.path.startsWith("web/")));
  await assert.rejects(
    verifyRuntime(root, targetFor("win32", "x64")),
    /mismatch/,
  );
  await put(root, "web/index.html", "tampered");
  await assert.rejects(verifyRuntime(root, target), /checksum mismatch/);
});

test("all five runtimes record real native components and explicit ARM compatibility", async (t) => {
  const base = await temporary(t);
  for (const target of targets) {
    const root = await fixture(path.join(base, target.key), target);
    const manifest = await verifyRuntime(root, target);
    assert.equal(manifest.components.launcher.arch, target.arch);
    assert.equal(manifest.components.capture.arch, target.arch);
    assert.equal(manifest.components.adb.arch, target.adbArch);
    assert.equal(
      manifest.components.adb.source,
      target.adbSource ?? "google-platform-tools",
    );
    assert.equal(manifest.compatibility.emulation, target.emulation ?? null);
    assert.equal(
      manifest.compatibility.minimumOS,
      target.key === "linux-arm64" ? "Ubuntu 24.04" : null,
    );
    const file = path.join(root, "runtime-manifest.json");
    delete manifest.components;
    delete manifest.compatibility;
    await fs.writeFile(file, JSON.stringify(manifest));
    if (target.key === "linux-arm64")
      await assert.rejects(
        verifyRuntime(root, target),
        /compatibility metadata/,
      );
    else await verifyRuntime(root, target);
  }
});

test("rehashing a wrong-architecture native binary or Windows ADB DLL cannot bless it", async (t) => {
  const base = await temporary(t);
  for (const target of targets) {
    for (const file of [
      `launcher/winscope-launcher${target.suffix}`,
      `capture/winscope-capture${target.suffix}`,
      `platform-tools/adb${target.suffix}`,
      ...(target.platform === "win32"
        ? [
            "platform-tools/AdbWinApi.dll",
            "platform-tools/AdbWinUsbApi.dll",
            "platform-tools/libwinpthread-1.dll",
          ]
        : []),
    ]) {
      const root = await fixture(
        path.join(base, target.key, file.replaceAll("/", "_")),
        target,
      );
      const wrongArch = file.startsWith("platform-tools/")
        ? target.adbArch === "x64"
          ? "arm64"
          : "x64"
        : target.arch === "x64"
          ? "arm64"
          : "x64";
      await put(root, file, binaryHeader(target.platform, wrongArch), 0o755);
      const manifestFile = path.join(root, "runtime-manifest.json");
      const manifest = JSON.parse(await fs.readFile(manifestFile, "utf8"));
      manifest.assets.find((asset) => asset.path === file).sha256 =
        await sha256(path.join(root, file));
      await fs.writeFile(manifestFile, JSON.stringify(manifest));
      await assert.rejects(
        verifyRuntime(root, target),
        /architecture mismatch/,
      );
      await fs.rm(path.join(root, "manifest.json"));
      await fs.rm(manifestFile);
      await assert.rejects(
        createManifests(root, target),
        /architecture mismatch/,
      );
    }
  }
});

test("unlisted files, missing capture internals, absent WASM and malicious manifest paths fail", async (t) => {
  const base = await temporary(t);
  const target = targetFor();
  for (const [name, mutate] of [
    [
      "unlisted",
      async (root) => {
        await put(root, "unlisted");
      },
    ],
    [
      "internal",
      async (root) => {
        await fs.rm(path.join(root, "capture/_internal"), { recursive: true });
      },
    ],
    [
      "wasm",
      async (root) => {
        await fs.rm(path.join(root, "web/trace_processor.wasm"));
      },
    ],
    [
      "traversal",
      async (root) => {
        const file = path.join(root, "runtime-manifest.json");
        const value = JSON.parse(await fs.readFile(file, "utf8"));
        value.assets[0].path = "../escape";
        await fs.writeFile(file, JSON.stringify(value));
      },
    ],
  ]) {
    const root = await fixture(path.join(base, name), target);
    await mutate(root);
    await assert.rejects(verifyRuntime(root, target));
  }
  const root = await fixture(path.join(base, "missing but rehashed"), target);
  await fs.rm(path.join(root, "web/trace_processor_memory64.wasm"));
  await fs.rm(path.join(root, "manifest.json"));
  await fs.rm(path.join(root, "runtime-manifest.json"));
  await createManifests(root, target);
  await assert.rejects(
    verifyRuntime(root, target),
    /Missing bundled runtime asset/,
  );
});

test(
  "runtime inventory rejects even unlisted symlinks and case collisions",
  { skip: process.platform === "win32" },
  async (t) => {
    const root = await temporary(t);
    await put(root, "regular");
    await fs.symlink("regular", path.join(root, "link"));
    await assert.rejects(inventory(root), /not links/);
    await fs.unlink(path.join(root, "link"));
    // Distinct case names require a case-sensitive filesystem; ZIP validation covers all hosts.
    assert.throws(() =>
      validateArchiveEntries([
        entry("platform-tools/A"),
        entry("platform-tools/a"),
      ]),
    );
  },
);

test("builder config keeps dedicated CJS app, resources outside ASAR and exact version pins", async (t) => {
  const root = await temporary(t);
  const target = targetFor();
  const config = await hostFixture(root, target);
  assert.equal(config.electronVersion, "45.2.1");
  assert.deepEqual(config.extraMetadata, { version: "19.2.3" });
  assert.equal(config.directories.app, path.join(root, "desktop/app"));
  assert.equal(
    config.directories.output,
    path.join(root, "dist/desktop/packages"),
  );
  assert.deepEqual(config.files, [
    "*.cjs",
    "package.json",
    "!*.test.cjs",
    "!node_modules{,/**/*}",
  ]);
  assert.equal(config.asar, true);
  assert.deepEqual(config.extraResources, [
    {
      from: path.join(root, "dist/desktop/runtime", target.key),
      to: "runtime",
      filter: ["**/*"],
    },
  ]);
  assert.equal(config.mac.identity, null);
  assert.equal(config.publish, null);
  assert.equal(
    config.artifactName,
    "aosp-winscope-desktop-${version}-${os}-${arch}.${ext}",
  );
  await config.beforePack({
    electronPlatformName: target.platform,
    arch: target.arch,
  });
  const packed = path.join(root, "packaged");
  const packagedRuntime =
    target.platform === "darwin"
      ? path.join(packed, "AOSP WinScope.app/Contents/Resources/runtime")
      : path.join(packed, "resources/runtime");
  await fs.mkdir(path.dirname(packagedRuntime), { recursive: true });
  await copyTree(
    path.join(root, "dist/desktop/runtime", target.key),
    packagedRuntime,
  );
  const packContext = {
    electronPlatformName: target.platform,
    appOutDir: packed,
    packager: { appInfo: { productFilename: "AOSP WinScope" } },
  };
  await config.afterPack(packContext);
  await put(packagedRuntime, "ai/config.js", "copy corrupted");
  await assert.rejects(config.afterPack(packContext), /checksum mismatch/);
  await fs.rm(path.join(root, "desktop/app/preload.cjs"));
  await assert.rejects(
    config.beforePack({
      electronPlatformName: target.platform,
      arch: target.arch,
    }),
    { code: "ENOENT" },
  );
});

test("builder uses only mac DMG/PKG, Windows x64 NSIS/MSI and Linux DEB/RPM", async (t) => {
  const base = await temporary(t);
  for (const target of targets) {
    const { key, platform, arch } = target;
    const config = await hostFixture(path.join(base, key), target);
    assert.deepEqual(
      config.mac.target.map((t) => t.target),
      ["dmg", "pkg"],
    );
    assert.ok(
      config.mac.target.every((t) => t.arch.length === 1 && t.arch[0] === arch),
    );
    assert.deepEqual(config.win.target, [
      { target: "nsis", arch: ["x64"] },
      { target: "msi", arch: ["x64"] },
    ]);
    assert.deepEqual(config.linux.target, [
      { target: "deb", arch: [arch] },
      { target: "rpm", arch: [arch] },
    ]);
    assert.equal(config.pkg.identity, null);
    assert.equal(config.pkg.installLocation, "/Applications");
    assert.equal(config.pkg.isRelocatable, false);
    assert.equal(config.msi.oneClick, false);
    assert.equal(config.msi.perMachine, false);
    assert.equal(process.env.CSC_IDENTITY_AUTO_DISCOVERY, "false");
    assert.match(
      config.linux.maintainer,
      /^AOSP-WinScope contributors <[^>]+>$/,
    );
    await config.beforePack({
      electronPlatformName: platform,
      arch: arch === "x64" ? 1 : 3,
    });
    const foreign = platform === "darwin" ? "linux" : "darwin";
    await assert.rejects(
      config.beforePack({ electronPlatformName: foreign, arch: "x64" }),
      /Native host|Unsupported/,
    );
    await assert.rejects(
      config.beforePack({
        electronPlatformName: platform,
        arch: arch === "arm64" ? "x64" : "arm64",
      }),
      /Native host|Unsupported/,
    );
    await assert.rejects(
      config.beforePack({ electronPlatformName: platform, arch: 99 }),
      /Unsupported/,
    );
  }
});

test("builder rejects floating Electron, runtime tampering, host dependencies and signing credentials", async (t) => {
  const root = await temporary(t);
  const target = targetFor();
  const config = await hostFixture(root, target);
  const context = { electronPlatformName: target.platform, arch: target.arch };
  const before = process.env.CSC_LINK;
  process.env.CSC_LINK = "/test credential path";
  try {
    await assert.rejects(config.beforePack(context), /Signing credentials/);
  } finally {
    if (before === undefined) delete process.env.CSC_LINK;
    else process.env.CSC_LINK = before;
  }
  await put(
    root,
    "desktop/app/package.json",
    JSON.stringify({ main: "main.cjs", dependencies: { unexpected: "1.0.0" } }),
  );
  await assert.rejects(config.beforePack(context), /dependency-free/);
  await put(
    root,
    "desktop/app/package.json",
    JSON.stringify({ main: "main.cjs" }),
  );
  await put(
    root,
    `dist/desktop/runtime/${target.key}/ai/config.js`,
    "tampered",
  );
  await assert.rejects(config.beforePack(context), /checksum mismatch/);
  await put(
    root,
    "package.json",
    JSON.stringify({ devDependencies: { electron: "^45.2.1" } }),
  );
  await assert.rejects(
    createConfiguration({ projectRoot: root }),
    /exact stable Electron/,
  );
});
