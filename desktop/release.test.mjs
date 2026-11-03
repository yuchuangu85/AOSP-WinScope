import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import * as fs from "node:fs/promises";
import path from "node:path";
import { tmpdir } from "node:os";
import { test } from "node:test";
import { spawnSync } from "node:child_process";
import registry from "./app/targets.cjs";
import {
  identity,
  plan,
  checkAcceptance,
  record,
  collect,
  verify,
  checkRemote,
  artifactName,
} from "./release.mjs";

const version = "17.0.1";
const commit = "a".repeat(40);
const checks = [
  "single-custom-title-bar-and-no-native-menu",
  "sandboxed-renderer",
  "bundled-capture",
  "bundled-AI",
  "settings-language",
  "AI-workspace",
];

async function temp(t) {
  const root = await fs.mkdtemp(
    path.join(tmpdir(), "winscope native platform publication "),
  );
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  return root;
}
async function write(file, value) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(
    file,
    typeof value === "string" ? value : JSON.stringify(value, null, 2) + "\n",
  );
}
const pkg = { version, devDependencies: { electron: "45.2.1" } };
function acceptance(target) {
  return {
    schemaVersion: 1,
    ok: true,
    packaged: true,
    platform: target.platform,
    arch: target.arch,
    runs: [
      {
        ok: true,
        packaged: true,
        platform: target.platform,
        arch: target.arch,
        servicesStopped: true,
        preferencesSaved: true,
        electron: "45.2.1",
        appVersion: version,
        checks: [...checks, "real-perfetto-trace-upload-and-view"],
      },
      {
        ok: true,
        packaged: true,
        platform: target.platform,
        arch: target.arch,
        servicesStopped: true,
        preferencesSaved: true,
        electron: "45.2.1",
        appVersion: version,
        preferenceRestoreVerified: true,
        checks: [...checks],
      },
    ],
  };
}

async function inputTarget(root, target) {
  const directory = path.join(root, "inputs", target.key);
  const packageFile = path.join(root, "package.json");
  await write(packageFile, pkg);
  const evidence = path.join(directory, "evidence");
  await write(path.join(evidence, "acceptance.json"), acceptance(target));
  const runtime = path.join(directory, "runtime");
  await write(path.join(runtime, "runtime-manifest.json"), {
    schemaVersion: 1,
    platform: target.platform,
    arch: target.arch,
    assets: [],
  });
  const packages = path.join(directory, "packages");
  const sourceArchive = path.join(directory, "application-source.tar.gz");
  await write(sourceArchive, "test corresponding application source");
  const os = { darwin: "mac", win32: "win", linux: "linux" }[target.platform];
  const builderArch = {
    deb: { x64: "amd64", arm64: "arm64" },
    rpm: { x64: "x86_64", arm64: "aarch64" },
  };
  for (const format of target.formats)
    await write(
      path.join(
        packages,
        `aosp-winscope-desktop-${version}-${os}-${builderArch[format]?.[target.arch] ?? target.arch}.${format}`,
      ),
      `${target.key}:${format}`,
    );
  return {
    target: target.key,
    version,
    commit,
    packages,
    runtime,
    evidence,
    packageFile,
    sourceArchive,
    verifyRuntime: async () => ({
      platform: target.platform,
      arch: target.arch,
    }),
  };
}

async function publication(t) {
  const root = await temp(t);
  const artifacts = path.join(root, "artifacts");
  for (const target of registry.targets) {
    const options = await inputTarget(root, target);
    await record({
      ...options,
      output: path.join(artifacts, artifactName(target, commit)),
    });
  }
  const output = path.join(root, "publication");
  await collect({ artifacts, version, commit, output });
  return { root, artifacts, output };
}

test("one target registry provides exactly five native targets and ten installer formats", () => {
  assert.deepEqual(
    new Set(registry.targets.map((t) => t.key)),
    new Set([
      "darwin-x64",
      "darwin-arm64",
      "win32-x64",
      "linux-x64",
      "linux-arm64",
    ]),
  );
  for (const target of registry.targets)
    assert.equal(target.captureArch, target.arch);
  assert.deepEqual(
    registry.targets.map((target) => [target.key, [...target.formats]]),
    [
      ["darwin-x64", ["dmg", "pkg"]],
      ["darwin-arm64", ["dmg", "pkg"]],
      ["win32-x64", ["exe", "msi"]],
      ["linux-x64", ["deb", "rpm"]],
      ["linux-arm64", ["deb", "rpm"]],
    ],
  );
  assert.equal(registry.targetFor("linux", "arm64").adbArch, "arm64");
  assert.equal(registry.targetFor("linux", "arm64").adbSource, "ubuntu-24.04");
  for (const args of [
    ["win32", "ia32"],
    ["win32", "arm64"],
    ["linux", "armv7l"],
    ["linux", "riscv64"],
  ])
    assert.throws(() => registry.targetFor(...args));
});

test("plan binds package version, exact Electron, five targets and commit", async (t) => {
  const root = await temp(t),
    packageFile = path.join(root, "package.json");
  await write(packageFile, pkg);
  const result = await plan({ commit, packageFile });
  assert.equal(result.version, version);
  assert.deepEqual(result.matrix, registry.matrix());
  assert.equal(
    result["publication-artifact"],
    `electron-publication-${commit}`,
  );
  await assert.rejects(
    plan({ version: "17.0.2", commit, packageFile }),
    /differs/,
  );
  await write(packageFile, {
    ...pkg,
    devDependencies: { electron: "^45.2.1" },
  });
  await assert.rejects(plan({ commit, packageFile }), /exact Electron/);
  for (const [v, c] of [
    ["17.0.1\nforged=x", commit],
    ["17.0.1", "main"],
    ["17.0.1", commit.toUpperCase()],
    ["../x", commit],
  ])
    assert.throws(() => identity(v, c));
});

test("packaged acceptance requires both native runs, real trace and shutdown", () => {
  const target = registry.targets[0];
  assert.equal(checkAcceptance(acceptance(target), target).runs, 2);
  for (const mutate of [
    (v) => (v.packaged = false),
    (v) => (v.arch = "wrong"),
    (v) => v.runs.pop(),
    (v) => (v.runs[0].servicesStopped = false),
    (v) => v.runs[0].checks.pop(),
    (v) => (v.runs[1].preferenceRestoreVerified = false),
  ]) {
    const value = acceptance(target);
    mutate(value);
    assert.throws(() => checkAcceptance(value, target));
  }
});

test("record requires all native package formats and raw smoke evidence", async (t) => {
  const root = await temp(t),
    target = registry.targetFor("linux", "arm64");
  const options = await inputTarget(root, target);
  const output = path.join(root, "record");
  const report = await record({ ...options, output });
  assert.equal(report.assets.length, 2);
  assert.equal(report.compatibility.adbArch, "arm64");
  assert.equal(report.acceptanceReport.name, "desktop-acceptance.json");
  assert.ok(report.assets.some((v) => v.name.endsWith(".rpm")));
  await assert.rejects(record({ ...options, output }), /already exists/);
  await fs.rm(
    path.join(
      options.packages,
      `aosp-winscope-desktop-${version}-linux-aarch64.rpm`,
    ),
  );
  await assert.rejects(
    record({ ...options, output: path.join(root, "missing") }),
    { code: "ENOENT" },
  );
  await assert.rejects(fs.stat(path.join(root, "missing")), { code: "ENOENT" });
  await write(path.join(options.evidence, "acceptance.json"), { ok: true });
  await assert.rejects(
    record({ ...options, output: path.join(root, "bad-evidence") }),
    /two-run/,
  );
});

test("collect verifies and flattens five reports, ten installers and raw acceptance", async (t) => {
  const { output } = await publication(t);
  const result = await verify({ directory: output, version, commit });
  assert.equal(result.targets, 5);
  assert.equal(result.files, 21);
  const index = JSON.parse(
    await fs.readFile(path.join(output, "desktop-release.json"), "utf8"),
  );
  assert.equal(index.targets.length, 5);
  assert.equal(
    index.files.filter(
      (x) => !x.name.endsWith(".json") && !x.name.endsWith("-source.tar.gz"),
    ).length,
    10,
  );
  assert.ok(index.files.some((x) => x.name.endsWith(".pkg")));
  assert.ok(index.files.some((x) => x.name.endsWith(".msi")));
  assert.ok(index.targets.every((x) => x.target !== "win32-arm64"));
  assert.ok(index.files.every((x) => !/\.(zip|AppImage)$/.test(x.name)));
  assert.equal(
    (await fs.readFile(path.join(output, "desktop-SHA256SUMS.txt"), "utf8"))
      .trim()
      .split("\n").length,
    22,
  );
});

for (const variant of [
  "missing-target",
  "removed-target",
  "wrong-commit",
  "duplicate-asset",
  "changed-installer",
  "unexpected-file",
  "altered-smoke",
]) {
  test(`collect rejects ${variant} before publishing output`, async (t) => {
    const { root, artifacts } = await publication(t);
    const target = registry.targets[0],
      directory = path.join(artifacts, artifactName(target, commit));
    const reportFile = path.join(
      directory,
      `desktop-target-${target.key}.json`,
    );
    const report = JSON.parse(await fs.readFile(reportFile, "utf8"));
    if (variant === "missing-target")
      await fs.rm(directory, { recursive: true });
    if (variant === "removed-target")
      await fs.mkdir(
        path.join(artifacts, `electron-installers-win32-arm64-${commit}`),
      );
    if (variant === "wrong-commit") {
      report.commit = "b".repeat(40);
      await write(reportFile, report);
    }
    if (variant === "duplicate-asset") {
      report.assets[1] = report.assets[0];
      await write(reportFile, report);
    }
    if (variant === "changed-installer")
      await write(path.join(directory, report.assets[0].name), "changed bytes");
    if (variant === "unexpected-file")
      await write(path.join(directory, "stale.zip"), "stale");
    if (variant === "altered-smoke")
      await write(path.join(directory, "desktop-acceptance.json"), {
        ok: true,
      });
    const output = path.join(root, "rejected");
    await assert.rejects(collect({ artifacts, version, commit, output }));
    await assert.rejects(fs.stat(output), { code: "ENOENT" });
  });
}

test("verification rejects post-assembly tampering and malicious names", async (t) => {
  const { output } = await publication(t);
  const indexFile = path.join(output, "desktop-release.json");
  const index = JSON.parse(await fs.readFile(indexFile, "utf8"));
  const asset = index.files.find((x) => x.name.endsWith(".rpm"));
  await write(path.join(output, asset.name), "different");
  await assert.rejects(
    verify({ directory: output, version, commit }),
    /checksum mismatch/,
  );
  index.files[0].name = "../escape";
  await write(indexFile, index);
  await assert.rejects(verify({ directory: output, version, commit }));
});

test("remote draft must contain the exact complete digest-bound combined publication", async (t) => {
  const { root, output } = await publication(t);
  const portable = path.join(root, "portable");
  await write(path.join(portable, "release-index.json"), { old: true });
  const assets = [];
  for (const dir of [portable, output])
    for (const name of await fs.readdir(dir)) {
      const bytes = await fs.readFile(path.join(dir, name));
      assets.push({
        name,
        state: "uploaded",
        size: bytes.length,
        digest: "sha256:" + createHash("sha256").update(bytes).digest("hex"),
      });
    }
  const metadata = path.join(root, "remote.json");
  const value = { draft: true, tag_name: `v${version}`, assets };
  await write(metadata, value);
  assert.equal(
    (
      await checkRemote({
        desktop: output,
        portable,
        metadata,
        version,
        commit,
      })
    ).assets,
    assets.length,
  );
  for (const mutate of [
    (v) => (v.draft = false),
    (v) => (v.tag_name = "v17.0.2"),
    (v) => v.assets.pop(),
    (v) => (v.assets[0].digest = "sha256:" + "0".repeat(64)),
    (v) => (v.assets[0].state = "new"),
    (v) => v.assets.push(v.assets[0]),
  ]) {
    const changed = structuredClone(value);
    mutate(changed);
    await write(metadata, changed);
    await assert.rejects(
      checkRemote({ desktop: output, portable, metadata, version, commit }),
    );
  }
});

test("CLI rejects missing and duplicate options without writing GitHub output", async (t) => {
  const root = await temp(t),
    output = path.join(root, "github-output");
  const command = path.join(import.meta.dirname, "release.mjs");
  for (const args of [
    ["plan", "--commit", "main", "--github-output", output],
    ["plan", "--commit", commit, "--commit", commit],
    ["verify", "--version", version],
    ["publish", "--all"],
  ]) {
    const result = spawnSync(process.execPath, [command, ...args], {
      encoding: "utf8",
    });
    assert.notEqual(result.status, 0);
  }
  await assert.rejects(fs.stat(output), { code: "ENOENT" });
});
