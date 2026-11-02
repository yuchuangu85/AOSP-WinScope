"use strict";
const assert = require("node:assert/strict");
const { test } = require("node:test");
const { mkdtemp, mkdir, writeFile, rm, symlink } = require("node:fs/promises");
const { createHash } = require("node:crypto");
const { tmpdir } = require("node:os");
const path = require("node:path");
const {
  parseReadyOrigin,
  isAppUrl,
  isRendererResource,
  isExternalDocumentation,
  secureWebPreferences,
  validAssetPath,
  verifyRuntime,
  runtimeMetadata,
} = require("./security.cjs");
const { targets, targetFor } = require("./targets.cjs");

test("readiness accepts only the exact local launcher protocol", () => {
  assert.equal(
    parseReadyOrigin("Winscope is available at http://127.0.0.1:8080/"),
    "http://127.0.0.1:8080",
  );
  for (const value of [
    "http://127.0.0.1:8080",
    "Winscope is available at http://localhost:8080/",
    "Winscope is available at http://127.0.0.1:65536/",
    "Winscope is available at http://127.0.0.1:0/",
    "Winscope is available at http://127.0.0.1:80.evil.test/",
  ])
    assert.throws(() => parseReadyOrigin(value));
});

test("renderer navigation and network access stay inside the owned origin", () => {
  const origin = "http://127.0.0.1:8080";
  assert.ok(isAppUrl(origin + "/capture/devices/", origin));
  assert.ok(isRendererResource("blob:" + origin + "/media", origin));
  for (const value of [
    "file:///etc/passwd",
    "javascript:alert(1)",
    "http://127.0.0.1:8081/",
    "http://user:secret@127.0.0.1:8080/",
    "https://example.test/",
    "blob:http://example.test/x",
  ]) {
    assert.equal(isAppUrl(value, origin), false);
    assert.equal(isRendererResource(value, origin), false);
  }
});

test("only the existing official documentation host can open externally", () => {
  assert.ok(
    isExternalDocumentation(
      "https://source.android.com/docs/core/graphics/tracing-win-transitions",
    ),
  );
  for (const value of [
    "http://source.android.com/",
    "file:///tmp/app",
    "https://source.android.com.evil.test/",
    "https://user@source.android.com/",
    "https://source.android.com:8443/",
  ])
    assert.equal(isExternalDocumentation(value), false);
});

test("web preferences keep Node privileges outside the renderer", () => {
  assert.equal(secureWebPreferences.nodeIntegration, false);
  assert.equal(secureWebPreferences.contextIsolation, true);
  assert.equal(secureWebPreferences.sandbox, true);
  assert.equal(secureWebPreferences.webSecurity, true);
  assert.equal(secureWebPreferences.webviewTag, false);
});

test("runtime paths reject traversal, ambiguous separators and Windows paths", () => {
  assert.ok(validAssetPath("capture/_internal/libpython.dylib"));
  for (const value of [
    "../secret",
    "/tmp/file",
    "web/../secret",
    "web//app",
    "C:/secret",
    "web\\app",
    "web/./app",
    "web/\x00",
  ]) {
    assert.equal(validAssetPath(value), false);
  }
});

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

async function fixture(t, platform = "darwin", arch = "arm64") {
  const target = targetFor(platform, arch);
  const root = await mkdtemp(
    path.join(tmpdir(), "winscope desktop integrity "),
  );
  t.after(() => rm(root, { recursive: true, force: true }));
  const assets = [];
  for (const name of [
    "web/index.html",
    "web/runtime-config.json",
    "web/engine_bundle.js",
    "web/trace_processor.wasm",
    "web/trace_processor_memory64.wasm",
    "manifest.json",
    `launcher/winscope-launcher${target.suffix}`,
    `capture/winscope-capture${target.suffix}`,
    `platform-tools/adb${target.suffix}`,
    "capture/_internal/python.bin",
    "platform-tools/NOTICE.txt",
    "platform-tools/source.properties",
    ...(platform === "win32"
      ? [
          "platform-tools/AdbWinApi.dll",
          "platform-tools/AdbWinUsbApi.dll",
          "platform-tools/libwinpthread-1.dll",
        ]
      : []),
    "ai/gateway.js",
    "ai/config.js",
    "ai/cli.js",
    "ai/index.js",
  ]) {
    await mkdir(path.dirname(path.join(root, name)), { recursive: true });
    const content = /^(launcher|capture)\/winscope-/.test(name)
      ? binaryHeader(platform, arch)
      : /^platform-tools\/(adb(?:\.exe)?|.*\.dll)$/.test(name)
        ? binaryHeader(platform, target.adbArch)
        : name;
    await writeFile(path.join(root, name), content);
    assets.push({
      path: name,
      sha256: createHash("sha256").update(content).digest("hex"),
    });
  }
  const manifest = {
    schemaVersion: 1,
    platform,
    arch,
    ...runtimeMetadata(target, target.adbSource ? "34.0.4" : "37.0.1"),
    assets,
  };
  const save = () =>
    writeFile(
      path.join(root, "runtime-manifest.json"),
      JSON.stringify(manifest),
    );
  await save();
  return { root, manifest, save };
}

test("runtime verifies complete payload, target and changed binary bytes", async (t) => {
  const { root } = await fixture(t);
  await verifyRuntime(root, "darwin", "arm64");
  await assert.rejects(verifyRuntime(root, "darwin", "x64"), /does not match/);
  await assert.rejects(verifyRuntime(root, "linux", "arm64"), /does not match/);
  await assert.rejects(verifyRuntime(root, "freebsd", "x64"), /Unsupported/);
  await writeFile(path.join(root, "capture/winscope-capture"), "tampered");
  await assert.rejects(
    verifyRuntime(root, "darwin", "arm64"),
    /integrity check failed/,
  );
});

test("startup accepts all five native binary payloads, including Windows ia32 ADB", async (t) => {
  for (const target of targets) {
    const { root, manifest } = await fixture(t, target.platform, target.arch);
    assert.deepEqual(
      await verifyRuntime(root, target.platform, target.arch),
      manifest,
    );
  }
});

test("Linux ARM64 requires exact components, emulation and minimum OS metadata", async (t) => {
  for (const platform of ["linux"]) {
    for (const mutate of [
      (value) => {
        delete value.components;
      },
      (value) => {
        delete value.compatibility;
      },
      (value) => {
        delete value.compatibility.minimumOS;
      },
      (value) => {
        value.compatibility.minimumOS = "any OS";
      },
      (value) => {
        value.compatibility.emulation = "none";
      },
      (value) => {
        value.components.launcher.arch = "x64";
      },
      (value) => {
        value.components.capture.arch = "x64";
      },
      (value) => {
        value.components.adb.arch = "x64";
      },
      (value) => {
        value.components.adb.source = "untrusted";
      },
      (value) => {
        delete value.components.adb.version;
      },
      (value) => {
        value.components.adb.version = "0.0.0";
      },
    ]) {
      const { root, manifest, save } = await fixture(t, platform, "arm64");
      mutate(manifest);
      await save();
      await assert.rejects(
        verifyRuntime(root, platform, "arm64"),
        /compatibility metadata/,
      );
    }
  }
  const { root, manifest, save } = await fixture(t, "linux", "arm64");
  manifest.components.adb.version = "37.0.1";
  await save();
  await assert.rejects(
    verifyRuntime(root, "linux", "arm64"),
    /compatibility metadata/,
  );
});

test("legacy metadata-free original four manifests still require real architecture checks", async (t) => {
  for (const target of targets.filter(
    (value) => value.platform === "darwin" || value.arch === "x64",
  )) {
    const { root, manifest, save } = await fixture(
      t,
      target.platform,
      target.arch,
    );
    delete manifest.components;
    delete manifest.compatibility;
    await save();
    await verifyRuntime(root, target.platform, target.arch);
    manifest.compatibility = {};
    await save();
    await assert.rejects(
      verifyRuntime(root, target.platform, target.arch),
      /compatibility metadata/,
    );
  }
});

test("startup rejects rehashed wrong native architectures and every Windows ADB DLL", async (t) => {
  for (const target of targets) {
    for (const name of [
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
      const { root, manifest, save } = await fixture(
        t,
        target.platform,
        target.arch,
      );
      const arch = name.startsWith("platform-tools/")
        ? target.adbArch
        : target.arch;
      const content = binaryHeader(
        target.platform,
        arch === "x64" ? "arm64" : "x64",
      );
      await writeFile(path.join(root, name), content);
      manifest.assets.find((asset) => asset.path === name).sha256 = createHash(
        "sha256",
      )
        .update(content)
        .digest("hex");
      await save();
      await assert.rejects(
        verifyRuntime(root, target.platform, target.arch),
        /architecture mismatch/,
      );
    }
  }
});

test("runtime rejects incomplete, duplicate and linked assets", async (t) => {
  const { root, manifest, save } = await fixture(t);
  const entry = manifest.assets.pop();
  await save();
  await assert.rejects(verifyRuntime(root, "darwin", "arm64"), /incomplete/);
  manifest.assets.push(entry, entry);
  await save();
  await assert.rejects(
    verifyRuntime(root, "darwin", "arm64"),
    /Invalid.*inventory/,
  );
  manifest.assets.pop();
  await save();
  const binary = path.join(root, "platform-tools/adb");
  await rm(binary);
  await symlink("../web/index.html", binary);
  await assert.rejects(
    verifyRuntime(root, "darwin", "arm64"),
    /symbolic links/,
  );
});
