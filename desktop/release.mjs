import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { execFileSync } from "node:child_process";
import * as fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import registry from "./app/targets.cjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const VERSION =
  /^(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-(?:alpha|beta|rc)\.[1-9]\d*)?$/;
const COMMIT = /^[0-9a-f]{40}$/;
const DIGEST = /^[0-9a-f]{64}$/;
const INDEX = "desktop-release.json";
const SUMS = "desktop-SHA256SUMS.txt";
const requiredChecks = [
  "single-custom-title-bar-and-native-file-menu",
  "sandboxed-renderer",
  "bundled-capture",
  "bundled-AI",
  "settings-language",
  "AI-workspace",
];

function cleanSourceCommit(commit) {
  const actual = execFileSync("git", ["rev-parse", "HEAD"], {
    cwd: ROOT,
    encoding: "utf8",
  }).trim();
  requireValue(
    actual === commit,
    "Publication commit differs from the checked-out source",
  );
  execFileSync("git", ["diff-index", "--quiet", "HEAD", "--"], { cwd: ROOT });
  const untracked = execFileSync(
    "git",
    ["ls-files", "--others", "--exclude-standard"],
    { cwd: ROOT, encoding: "utf8" },
  ).trim();
  requireValue(
    !untracked,
    "Native publication requires a clean tracked checkout",
  );
}

function requireValue(condition, message) {
  if (!condition) throw new Error(message);
}

export function identity(version, commit) {
  requireValue(
    typeof version === "string" && VERSION.test(version),
    "Invalid desktop release version",
  );
  requireValue(
    typeof commit === "string" && COMMIT.test(commit),
    "Invalid desktop release commit",
  );
  return { version, commit };
}

function basename(value) {
  requireValue(
    typeof value === "string" &&
      /^[A-Za-z0-9][A-Za-z0-9._-]{0,220}$/.test(value) &&
      value !== "." &&
      value !== ".." &&
      !value.includes(".."),
    "Invalid publication filename",
  );
  return value;
}

function targetByKey(key) {
  const target = registry.targets.find((value) => value.key === key);
  requireValue(target, `Unsupported publication target: ${key}`);
  return target;
}

// electron-builder expands ${arch} with the distribution architecture for
// DEB/RPM targets, so builder-local names differ from the published contract.
const BUILDER_ARCH = {
  deb: { x64: "amd64", arm64: "arm64" },
  rpm: { x64: "x86_64", arm64: "aarch64" },
};

function packageName(target, version, format, builder = false) {
  const os = builder
    ? { darwin: "mac", win32: "win", linux: "linux" }[target.platform]
    : target.platform;
  const arch = builder
    ? (BUILDER_ARCH[format]?.[target.arch] ?? target.arch)
    : target.arch;
  return basename(`aosp-winscope-desktop-${version}-${os}-${arch}.${format}`);
}

const reportName = (target) => `desktop-target-${target.key}.json`;
const needsSource = (target) =>
  target.platform === "linux" && target.arch === "arm64";
const applicationSourceName = (target, version) =>
  `aosp-winscope-desktop-${version}-${target.key}-source.tar.gz`;
export const artifactName = (target, commit) =>
  `electron-installers-${target.key}-${commit}`;

async function regular(file, maximum = 4 * 1024 ** 3) {
  const stat = await fs.lstat(file);
  requireValue(
    stat.isFile() &&
      !stat.isSymbolicLink() &&
      stat.size > 0 &&
      stat.size <= maximum,
    `Publication input is not a bounded regular file: ${path.basename(file)}`,
  );
  return stat;
}

async function json(file) {
  await regular(file, 4 * 1024 ** 2);
  return JSON.parse(await fs.readFile(file, "utf8"));
}

async function digest(file) {
  const hash = createHash("sha256");
  for await (const bytes of createReadStream(file)) hash.update(bytes);
  return hash.digest("hex");
}

async function descriptor(directory, name) {
  basename(name);
  const file = path.join(directory, name);
  return { name, size: (await regular(file)).size, sha256: await digest(file) };
}

async function checkFile(directory, entry) {
  requireValue(
    entry &&
      typeof entry.name === "string" &&
      DIGEST.test(entry.sha256) &&
      Number.isSafeInteger(entry.size) &&
      entry.size > 0,
    "Invalid publication asset descriptor",
  );
  const actual = await descriptor(directory, entry.name);
  requireValue(
    actual.size === entry.size && actual.sha256 === entry.sha256,
    `Publication checksum mismatch: ${entry.name}`,
  );
}

async function writeJson(file, value) {
  await fs.writeFile(file, JSON.stringify(value, null, 2) + "\n", {
    flag: "wx",
  });
}

async function inFreshDirectory(output, task) {
  const destination = path.resolve(output);
  try {
    await fs.lstat(destination);
    throw new Error(
      "Publication output already exists; refusing to merge stale artifacts",
    );
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  await fs.mkdir(path.dirname(destination), { recursive: true });
  const work = await fs.mkdtemp(
    path.join(path.dirname(destination), ".desktop-publication-"),
  );
  try {
    const result = await task(work);
    await fs.rename(work, destination);
    return result;
  } finally {
    await fs.rm(work, { recursive: true, force: true });
  }
}

export function checkAcceptance(value, target) {
  requireValue(
    value?.schemaVersion === 1 &&
      value.ok === true &&
      value.packaged === true &&
      value.platform === target.platform &&
      value.arch === target.arch &&
      Array.isArray(value.runs) &&
      value.runs.length === 2,
    "A complete two-run packaged acceptance report is required",
  );
  for (const run of value.runs) {
    requireValue(
      run.ok === true &&
        run.packaged === true &&
        run.platform === target.platform &&
        run.arch === target.arch &&
        run.servicesStopped === true &&
        run.preferencesSaved === true &&
        Array.isArray(run.checks) &&
        requiredChecks.every((check) => run.checks.includes(check)),
      "Packaged acceptance checks are incomplete",
    );
  }
  requireValue(
    value.runs[0].checks.includes("real-perfetto-trace-upload-and-view") &&
      value.runs[1].preferenceRestoreVerified === true,
    "Trace viewing and restart acceptance are required",
  );
  return {
    ok: true,
    packaged: true,
    runs: 2,
    servicesStopped: true,
    preferencesRestored: true,
    traceViewed: true,
    checks: [...new Set(value.runs.flatMap((run) => run.checks))].sort(),
  };
}

export async function plan({
  version,
  commit,
  packageFile = path.join(ROOT, "package.json"),
} = {}) {
  const pkg = await json(packageFile);
  const selected = version || pkg.version;
  identity(selected, commit);
  requireValue(
    pkg.version === selected,
    "Release tag version differs from package.json; update the version before tagging",
  );
  requireValue(
    /^\d+\.\d+\.\d+$/.test(pkg.devDependencies?.electron),
    "An exact Electron pin is required",
  );
  return {
    version: selected,
    matrix: registry.matrix(),
    "publication-artifact": `electron-publication-${commit}`,
  };
}

export async function record({
  target: key,
  version,
  commit,
  packages,
  runtime,
  evidence,
  output,
  packageFile = path.join(ROOT, "package.json"),
  verifyRuntime: suppliedVerifier,
  sourceArchive,
}) {
  identity(version, commit);
  const target = targetByKey(key);
  if (!suppliedVerifier) cleanSourceCommit(commit);
  const verifyRuntime =
    suppliedVerifier ?? (await import("./prepare.mjs")).verifyRuntime;
  const runtimeManifest = await verifyRuntime(path.resolve(runtime), target);
  const acceptance = checkAcceptance(
    await json(path.join(evidence, "acceptance.json")),
    target,
  );
  const pkg = await json(packageFile);
  requireValue(
    pkg.version === version,
    "Package version differs from desktop publication version",
  );
  requireValue(
    (await json(path.join(evidence, "acceptance.json"))).runs.every(
      (run) =>
        run.electron === pkg.devDependencies.electron &&
        run.appVersion === version,
    ),
    "Actual packaged Electron/application version differs from release inputs",
  );
  const report = {
    schemaVersion: 1,
    version,
    commit,
    target: key,
    platform: target.platform,
    arch: target.arch,
    electron: pkg.devDependencies.electron,
    signing: "unsigned",
    acceptance,
    compatibility: {
      captureArch: target.captureArch,
      adbArch: target.adbArch,
      emulation: target.emulation ?? null,
      adbSource: target.adbSource ?? "google-platform-tools",
    },
    runtimeManifestSha256: await digest(
      path.join(runtime, "runtime-manifest.json"),
    ),
    assets: [],
  };
  requireValue(
    runtimeManifest.platform === target.platform &&
      runtimeManifest.arch === target.arch,
    "Wrong native runtime target",
  );
  await inFreshDirectory(output, async (stage) => {
    await writeJson(
      path.join(stage, "desktop-acceptance.json"),
      await json(path.join(evidence, "acceptance.json")),
    );
    report.acceptanceReport = await descriptor(
      stage,
      "desktop-acceptance.json",
    );
    if (needsSource(target)) {
      const name = applicationSourceName(target, version);
      if (sourceArchive) {
        await regular(sourceArchive);
        await fs.copyFile(sourceArchive, path.join(stage, name));
      } else {
        cleanSourceCommit(commit);
        execFileSync(
          "git",
          [
            "archive",
            "--format=tar.gz",
            `--prefix=aosp-winscope-${version}/`,
            `--output=${path.join(stage, name)}`,
            commit,
          ],
          { cwd: ROOT },
        );
      }
      report.applicationSource = await descriptor(stage, name);
    }
    for (const format of target.formats) {
      const sourceName = packageName(target, version, format, true);
      await regular(path.join(packages, sourceName));
      const name = packageName(target, version, format);
      await fs.copyFile(
        path.join(packages, sourceName),
        path.join(stage, name),
      );
      report.assets.push({ ...(await descriptor(stage, name)), format });
    }
    await writeJson(path.join(stage, reportName(target)), report);
  });
  return report;
}

function checkReport(report, target, version, commit) {
  requireValue(
    report?.schemaVersion === 1 &&
      report.version === version &&
      report.commit === commit &&
      report.target === target.key &&
      report.platform === target.platform &&
      report.arch === target.arch &&
      /^\d+\.\d+\.\d+$/.test(report.electron ?? "") &&
      report.signing === "unsigned" &&
      DIGEST.test(report.runtimeManifestSha256 ?? ""),
    `Wrong release identity or runtime evidence for ${target.key}`,
  );
  requireValue(
    report.acceptance?.ok === true &&
      report.acceptance.packaged === true &&
      report.acceptance.runs === 2 &&
      report.acceptance.servicesStopped === true &&
      report.acceptance.preferencesRestored === true &&
      report.acceptance.traceViewed === true &&
      Array.isArray(report.acceptance.checks) &&
      requiredChecks.every((check) => report.acceptance.checks.includes(check)),
    `Missing native acceptance: ${target.key}`,
  );
  requireValue(
    report.compatibility?.captureArch === target.captureArch &&
      report.compatibility.adbArch === target.adbArch &&
      report.compatibility.emulation === (target.emulation ?? null) &&
      report.compatibility.adbSource ===
        (target.adbSource ?? "google-platform-tools"),
    `Undisclosed runtime compatibility: ${target.key}`,
  );
  requireValue(
    Array.isArray(report.assets) &&
      report.assets.length === target.formats.length,
    `Missing installer formats: ${target.key}`,
  );
  requireValue(
    report.acceptanceReport?.name === "desktop-acceptance.json",
    "Raw native acceptance report is required",
  );
  if (needsSource(target))
    requireValue(
      report.applicationSource?.name === applicationSourceName(target, version),
      "Matching application source archive is required",
    );
  else
    requireValue(
      report.applicationSource === undefined,
      "Unexpected application source declaration",
    );
  const expected = target.formats
    .map((format) => packageName(target, version, format))
    .sort();
  const actual = report.assets.map((entry) => basename(entry.name)).sort();
  requireValue(
    JSON.stringify(expected) === JSON.stringify(actual),
    `Wrong or duplicate installer assets: ${target.key}`,
  );
  for (const entry of report.assets)
    requireValue(
      target.formats.includes(entry.format) &&
        entry.name === packageName(target, version, entry.format),
      "Installer format does not match its filename",
    );
}

async function exactFiles(directory, expected) {
  const stat = await fs.lstat(directory);
  requireValue(
    stat.isDirectory() && !stat.isSymbolicLink(),
    "Publication input must be a real directory",
  );
  const names = await fs.readdir(directory);
  requireValue(
    JSON.stringify(names.sort()) === JSON.stringify([...expected].sort()),
    "Unexpected or missing publication files",
  );
  for (const name of names) await regular(path.join(directory, basename(name)));
}

export async function collect({ artifacts, version, commit, output }) {
  identity(version, commit);
  const directories = await fs.readdir(artifacts);
  const expectedDirectories = registry.targets
    .map((target) => artifactName(target, commit))
    .sort();
  requireValue(
    JSON.stringify(directories.sort()) === JSON.stringify(expectedDirectories),
    "Exactly the configured same-commit native artifacts are required",
  );
  const index = {
    schemaVersion: 1,
    product: "AOSP-WinScope Desktop",
    version,
    commit,
    signing: "unsigned",
    targets: [],
    files: [],
  };
  await inFreshDirectory(output, async (stage) => {
    for (const target of registry.targets) {
      const directory = path.join(artifacts, artifactName(target, commit));
      const report = await json(path.join(directory, reportName(target)));
      checkReport(report, target, version, commit);
      await exactFiles(directory, [
        reportName(target),
        "desktop-acceptance.json",
        ...(needsSource(target)
          ? [applicationSourceName(target, version)]
          : []),
        ...report.assets.map((entry) => entry.name),
      ]);
      await checkFile(directory, report.acceptanceReport);
      if (needsSource(target)) {
        await checkFile(directory, report.applicationSource);
        const name = applicationSourceName(target, version);
        await fs.copyFile(path.join(directory, name), path.join(stage, name));
        index.files.push({
          ...(await descriptor(stage, name)),
          target: target.key,
        });
      }
      const rawAcceptance = await json(
        path.join(directory, "desktop-acceptance.json"),
      );
      requireValue(
        rawAcceptance.runs.every(
          (run) =>
            run.electron === report.electron && run.appVersion === version,
        ),
        "Native packaged versions differ from the target report",
      );
      requireValue(
        JSON.stringify(checkAcceptance(rawAcceptance, target)) ===
          JSON.stringify(report.acceptance),
        "Acceptance summary differs from raw evidence",
      );
      const acceptanceName = `desktop-acceptance-${target.key}.json`;
      await fs.copyFile(
        path.join(directory, "desktop-acceptance.json"),
        path.join(stage, acceptanceName),
      );
      index.files.push({
        ...(await descriptor(stage, acceptanceName)),
        target: target.key,
      });
      for (const entry of report.assets) {
        await checkFile(directory, entry);
        await fs.copyFile(
          path.join(directory, entry.name),
          path.join(stage, entry.name),
        );
        index.files.push({
          ...(await descriptor(stage, entry.name)),
          target: target.key,
        });
      }
      await fs.copyFile(
        path.join(directory, reportName(target)),
        path.join(stage, reportName(target)),
      );
      index.files.push({
        ...(await descriptor(stage, reportName(target))),
        target: target.key,
      });
      index.targets.push({
        target: target.key,
        platform: target.platform,
        arch: target.arch,
        formats: [...target.formats],
        compatibility: report.compatibility,
        report: reportName(target),
      });
      if (index.electron === undefined) index.electron = report.electron;
      requireValue(
        index.electron === report.electron,
        "Native artifacts use different Electron versions",
      );
    }
    index.files.sort((a, b) => a.name.localeCompare(b.name, "en"));
    await writeJson(path.join(stage, INDEX), index);
    const files = [...index.files, await descriptor(stage, INDEX)].sort(
      (a, b) => a.name.localeCompare(b.name, "en"),
    );
    await fs.writeFile(
      path.join(stage, SUMS),
      files.map((entry) => `${entry.sha256}  ${entry.name}\n`).join(""),
      { flag: "wx" },
    );
    await verify({ directory: stage, version, commit });
  });
  return index;
}

export async function verify({ directory, version, commit }) {
  identity(version, commit);
  const index = await json(path.join(directory, INDEX));
  requireValue(
    index.schemaVersion === 1 &&
      index.product === "AOSP-WinScope Desktop" &&
      index.version === version &&
      index.commit === commit &&
      index.signing === "unsigned" &&
      /^\d+\.\d+\.\d+$/.test(index.electron ?? ""),
    "Wrong desktop release index identity",
  );
  requireValue(
    Array.isArray(index.targets) &&
      index.targets.length === registry.targets.length &&
      Array.isArray(index.files),
    "Incomplete desktop release index",
  );
  const expectedNames = new Set();
  for (const target of registry.targets) {
    const declarations = index.targets.filter(
      (value) => value.target === target.key,
    );
    requireValue(
      declarations.length === 1,
      `Missing or duplicate target: ${target.key}`,
    );
    const report = await json(path.join(directory, reportName(target)));
    checkReport(report, target, version, commit);
    requireValue(
      report.electron === index.electron,
      "Desktop release Electron version mismatch",
    );
    requireValue(
      JSON.stringify(declarations[0]) ===
        JSON.stringify({
          target: target.key,
          platform: target.platform,
          arch: target.arch,
          formats: [...target.formats],
          compatibility: report.compatibility,
          report: reportName(target),
        }),
      "Index compatibility differs from native report",
    );
    const acceptanceName = `desktop-acceptance-${target.key}.json`;
    const rawAcceptance = await json(path.join(directory, acceptanceName));
    requireValue(
      rawAcceptance.runs.every(
        (run) => run.electron === report.electron && run.appVersion === version,
      ),
      "Native packaged versions differ from the target report",
    );
    requireValue(
      JSON.stringify(checkAcceptance(rawAcceptance, target)) ===
        JSON.stringify(report.acceptance),
      "Acceptance summary differs from raw evidence",
    );
    const actualAcceptance = await descriptor(directory, acceptanceName);
    requireValue(
      actualAcceptance.sha256 === report.acceptanceReport.sha256 &&
        actualAcceptance.size === report.acceptanceReport.size,
      "Raw acceptance digest mismatch",
    );
    for (const name of [
      reportName(target),
      acceptanceName,
      ...(needsSource(target) ? [applicationSourceName(target, version)] : []),
      ...report.assets.map((entry) => entry.name),
    ]) {
      requireValue(!expectedNames.has(name), "Duplicate desktop release asset");
      expectedNames.add(name);
      const entries = index.files.filter(
        (entry) => entry.name === name && entry.target === target.key,
      );
      requireValue(entries.length === 1, `Missing indexed file: ${name}`);
      await checkFile(directory, entries[0]);
    }
    for (const entry of report.assets) await checkFile(directory, entry);
    if (needsSource(target))
      await checkFile(directory, report.applicationSource);
  }
  requireValue(
    index.files.length === expectedNames.size,
    "Unexpected indexed desktop release asset",
  );
  await exactFiles(directory, [...expectedNames, INDEX, SUMS]);
  const sums = [...index.files, await descriptor(directory, INDEX)]
    .sort((a, b) => a.name.localeCompare(b.name, "en"))
    .map((entry) => `${entry.sha256}  ${entry.name}\n`)
    .join("");
  requireValue(
    (await fs.readFile(path.join(directory, SUMS), "utf8")) === sums,
    "Desktop checksum inventory does not match the release",
  );
  return {
    ok: true,
    version,
    commit,
    targets: index.targets.length,
    files: index.files.length,
    signing: index.signing,
  };
}

export async function checkRemote({
  desktop,
  portable,
  evidence,
  metadata,
  version,
  commit,
}) {
  requireValue(
    !(portable !== undefined && evidence !== undefined),
    "Portable and evidence publication directories are mutually exclusive",
  );
  await verify({ directory: desktop, version, commit });
  const release = await json(metadata);
  requireValue(
    release.draft === true &&
      release.tag_name === `v${version}` &&
      Array.isArray(release.assets),
    "Remote release must be the same-version unpublished draft",
  );
  const expected = new Map();
  const directories = [desktop];
  if (portable !== undefined) directories.push(portable);
  if (evidence !== undefined) directories.push(evidence);
  for (const directory of directories) {
    for (const name of await fs.readdir(directory)) {
      basename(name);
      requireValue(
        evidence === undefined || !name.toLowerCase().endsWith(".zip"),
        "Installer-only publication must not contain ZIP assets",
      );
      requireValue(
        !expected.has(name),
        "Release asset names collide across publication directories",
      );
      expected.set(name, await descriptor(directory, name));
    }
  }
  requireValue(
    release.assets.length === expected.size,
    "Remote draft has missing or unexpected assets",
  );
  const seen = new Set();
  for (const asset of release.assets) {
    requireValue(
      evidence === undefined ||
        (typeof asset?.name === "string" &&
          !asset.name.toLowerCase().endsWith(".zip")),
      "Installer-only remote publication must not contain ZIP assets",
    );
    const local = expected.get(asset.name);
    requireValue(
      local &&
        !seen.has(asset.name) &&
        asset.state === "uploaded" &&
        asset.size === local.size &&
        asset.digest === `sha256:${local.sha256}`,
      `Remote draft asset is incomplete or changed: ${asset.name}`,
    );
    seen.add(asset.name);
  }
  return { ok: true, draft: true, tag: release.tag_name, assets: seen.size };
}

function argumentsFor(args) {
  const [command, ...rest] = args;
  requireValue(
    ["plan", "record", "collect", "verify", "check-remote"].includes(command),
    "Expected plan, record, collect, verify or check-remote",
  );
  const allowed = {
    plan: ["version", "commit", "github-output"],
    record: [
      "target",
      "version",
      "commit",
      "packages",
      "runtime",
      "evidence",
      "output",
    ],
    collect: ["artifacts", "version", "commit", "output"],
    verify: ["directory", "version", "commit"],
    "check-remote": [
      "desktop",
      "portable",
      "evidence",
      "metadata",
      "version",
      "commit",
    ],
  }[command];
  const options = {};
  for (let i = 0; i < rest.length; i += 2) {
    const name = rest[i].replace(/^--/, "");
    requireValue(
      rest[i].startsWith("--") &&
        allowed.includes(name) &&
        !Object.hasOwn(options, name) &&
        typeof rest[i + 1] === "string" &&
        !rest[i + 1].startsWith("--"),
      "Unknown, duplicate or incomplete desktop release option",
    );
    options[name] = rest[i + 1];
  }
  for (const name of allowed.filter(
    (name) =>
      name !== "github-output" &&
      !(command === "plan" && name === "version") &&
      !(command === "check-remote" && ["portable", "evidence"].includes(name)),
  )) {
    requireValue(
      typeof options[name] === "string" && options[name].length > 0,
      `Missing --${name}`,
    );
  }
  requireValue(
    command !== "check-remote" ||
      !(
        Object.hasOwn(options, "portable") && Object.hasOwn(options, "evidence")
      ),
    "--portable and --evidence are mutually exclusive",
  );
  return { command, options };
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
) {
  try {
    const { command, options } = argumentsFor(process.argv.slice(2));
    const handlers = {
      plan,
      record,
      collect,
      verify,
      "check-remote": checkRemote,
    };
    const result = await handlers[command](options);
    if (command === "plan" && options["github-output"]) {
      await fs.appendFile(
        options["github-output"],
        Object.entries(result)
          .map(
            ([key, value]) =>
              `${key}=${typeof value === "string" ? value : JSON.stringify(value)}\n`,
          )
          .join(""),
      );
    }
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(`Desktop release failed: ${error.message}`);
    process.exitCode = 1;
  }
}
