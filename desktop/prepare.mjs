import { spawn } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import { createReadStream } from "node:fs";
import * as fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import targetDefinitions from "./app/targets.cjs";
import binaryArchitecture from "./app/binary_arch.cjs";
import runtimeSecurity from "./app/security.cjs";

export const { targetFor } = targetDefinitions;
const { targets } = targetDefinitions;
const { assertBinaryArchitecture } = binaryArchitecture;
const { runtimeMetadata, verifyRuntimeMetadata, verifyRuntimeBinaries } =
  runtimeSecurity;

export const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const MAX_ARCHIVE_BYTES = 256 * 1024 * 1024;
const MAX_EXPANDED_BYTES = 512 * 1024 * 1024;
const SHA256 = /^[a-f0-9]{64}$/;
export function assertNativeTarget(
  target,
  platform = process.platform,
  arch = process.arch,
) {
  if (target.key !== targetFor(platform, arch).key) {
    throw new Error(
      `Native host build required: ${target.key}; host is ${platform}-${arch}`,
    );
  }
}

export function safeRelative(value) {
  if (
    typeof value !== "string" ||
    !value ||
    value.includes("\\") ||
    /[\x00-\x1f\x7f]/.test(value)
  ) {
    throw new Error(`Unsafe relative path: ${JSON.stringify(value)}`);
  }
  const parts = value.split("/");
  if (
    parts.some(
      (p) =>
        !p ||
        p === "." ||
        p === ".." ||
        /[<>:"|?*]/.test(p) ||
        /[. ]$/.test(p) ||
        /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(?:\.|$)/i.test(p),
    )
  ) {
    throw new Error(`Unsafe relative path: ${value}`);
  }
  return value;
}

function inside(root, candidate) {
  const relative = path.relative(root, candidate);
  return (
    relative === "" ||
    (!path.isAbsolute(relative) &&
      relative !== ".." &&
      !relative.startsWith(`..${path.sep}`))
  );
}

export async function sha256(file) {
  const hash = createHash("sha256");
  for await (const chunk of createReadStream(file)) hash.update(chunk);
  return hash.digest("hex");
}

export async function verifyChecksum(file, expected) {
  if (!SHA256.test(expected ?? "") || (await sha256(file)) !== expected) {
    throw new Error(`SHA256 mismatch: ${file}`);
  }
}

// Python's zipfile supplies structured central-directory metadata, including duplicates.
export function validateArchiveEntries(entries) {
  if (!Array.isArray(entries) || !entries.length || entries.length > 10000)
    throw new Error("Invalid archive entry count");
  const seen = new Map();
  let total = 0;
  for (const entry of entries) {
    const name = safeRelative(
      entry.directory ? entry.name.replace(/\/$/, "") : entry.name,
    );
    if (name !== "platform-tools" && !name.startsWith("platform-tools/"))
      throw new Error(`Unexpected archive root: ${name}`);
    if (name === "platform-tools" && !entry.directory)
      throw new Error("Archive root must be a directory");
    const key = name.normalize("NFC").toLowerCase();
    if (seen.has(key)) throw new Error(`Duplicate archive path: ${name}`);
    const kind = (entry.mode >>> 12) & 15;
    if (
      typeof entry.directory !== "boolean" ||
      entry.encrypted !== false ||
      !Number.isInteger(entry.mode) ||
      entry.mode < 0 ||
      entry.mode > 65535 ||
      !Number.isSafeInteger(entry.size) ||
      entry.size < 0 ||
      entry.size > 128 * 1024 * 1024 ||
      (kind !== 0 && kind !== (entry.directory ? 4 : 8))
    )
      throw new Error(`Unsafe archive entry: ${name}`);
    total += entry.size;
    if (total > MAX_EXPANDED_BYTES)
      throw new Error("Archive exceeds expanded size limit");
    seen.set(key, { directory: entry.directory, name });
  }
  for (const [key, entry] of seen) {
    const parts = key.split("/");
    parts.pop();
    while (parts.length) {
      if (seen.get(parts.join("/"))?.directory === false)
        throw new Error(`Archive file/directory collision: ${entry.name}`);
      parts.pop();
    }
  }
  return entries;
}

export function run(
  command,
  args,
  {
    cwd = ROOT,
    env = process.env,
    capture = false,
    input,
    timeout = 20 * 60 * 1000,
  } = {},
) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      env,
      shell: false,
      windowsHide: true,
      stdio: [
        input === undefined ? "ignore" : "pipe",
        capture ? "pipe" : "inherit",
        "inherit",
      ],
    });
    let stdout = "";
    let failure;
    const timer = setTimeout(() => {
      failure = new Error(`Command timed out: ${command} ${args.join(" ")}`);
      child.kill();
    }, timeout);
    child.on("error", (error) => {
      failure = error;
    });
    child.stdout?.on("data", (chunk) => {
      stdout += chunk;
      if (stdout.length > 8 * 1024 * 1024) {
        failure = new Error("Command output limit exceeded");
        child.kill();
      }
    });
    child.stdin?.on("error", (error) => {
      failure ??= error;
    });
    if (input !== undefined) child.stdin.end(input);
    child.on("close", (code, signal) => {
      clearTimeout(timer);
      if (failure || code !== 0)
        reject(
          failure ??
            new Error(
              `Command failed (${code ?? signal}): ${command} ${args.join(" ")}`,
            ),
        );
      else resolve(stdout.trim());
    });
  });
}

const ZIP_SCRIPT = String.raw`
import hashlib, json, os, pathlib, shutil, sys, zipfile
archive, expected, destination = sys.argv[1:]
with open(archive, "rb") as raw:
    digest = hashlib.sha256()
    for chunk in iter(lambda: raw.read(1024 * 1024), b""): digest.update(chunk)
    if digest.hexdigest() != expected:
        raise ValueError("Archive SHA256 mismatch")
    raw.seek(0)
    with zipfile.ZipFile(raw) as z:
        entries = [{"name": i.orig_filename, "size": i.file_size,
                    "directory": i.is_dir(), "mode": i.external_attr >> 16,
                    "encrypted": bool(i.flag_bits & 1)} for i in z.infolist()]
        if destination == "-":
            print(json.dumps(entries))
        else:
            approved = json.load(sys.stdin)
            if entries != approved:
                raise ValueError("Archive directory changed")
            for info, entry in zip(z.infolist(), entries):
                target = pathlib.Path(destination).joinpath(*entry["name"].rstrip("/").split("/"))
                if entry["directory"]:
                    target.mkdir(parents=True, exist_ok=True)
                else:
                    target.parent.mkdir(parents=True, exist_ok=True)
                    with z.open(info) as src, open(target, "xb") as dst:
                        shutil.copyfileobj(src, dst, 1024 * 1024)
                    if target.stat().st_size != entry["size"]:
                        raise ValueError("Archive entry length mismatch")
                    os.chmod(target, 0o755 if entry["mode"] & 0o111 else 0o644)
`;

export async function extractPlatformTools(
  archive,
  expected,
  destination,
  python,
) {
  await verifyChecksum(archive, expected);
  const entries = validateArchiveEntries(
    JSON.parse(
      await run(python, ["-I", "-c", ZIP_SCRIPT, archive, expected, "-"], {
        capture: true,
      }),
    ),
  );
  await fs.mkdir(destination); // Never extract over existing files or links.
  try {
    await run(
      python,
      ["-I", "-c", ZIP_SCRIPT, archive, expected, destination],
      { input: JSON.stringify(entries) },
    );
  } catch (error) {
    await fs.rm(destination, { recursive: true, force: true });
    throw error;
  }
}

export function validateLock(lock) {
  if (
    lock?.schemaVersion !== 1 ||
    !/^\d+\.\d+\.\d+$/.test(lock.platformTools?.version ?? "")
  )
    throw new Error("Invalid runtime lock");
  if (
    !Array.isArray(lock.supportedTargets) ||
    lock.supportedTargets.length !== targets.length ||
    new Set(lock.supportedTargets).size !== targets.length ||
    targets.some((target) => !lock.supportedTargets.includes(target.key))
  )
    throw new Error(
      "Runtime lock supportedTargets must match the native SSOT targets",
    );
  const tools = lock.platformTools;
  for (const host of ["darwin", "windows", "linux"]) {
    const archive = tools.archives?.[host];
    const expected = `https://dl.google.com/android/repository/platform-tools_r${tools.version}-${host === "windows" ? "win" : host}.zip`;
    if (
      archive?.url !== expected ||
      !SHA256.test(archive.sha256 ?? "") ||
      !Number.isSafeInteger(archive.size) ||
      archive.size <= 0 ||
      archive.size > MAX_ARCHIVE_BYTES
    ) {
      throw new Error(`Invalid official Platform-Tools lock for ${host}`);
    }
    if (!Array.isArray(archive.runtimeFiles) || !archive.runtimeFiles.length)
      throw new Error(`Missing Platform-Tools file allowlist: ${host}`);
    for (const file of archive.runtimeFiles) safeRelative(file);
  }
  return lock;
}

export async function downloadArchive(record, cache) {
  await fs.mkdir(cache, { recursive: true });
  const destination = path.join(cache, `${record.sha256}.zip`);
  try {
    const stat = await fs.lstat(destination);
    if (!stat.isFile() || stat.size !== record.size)
      throw new Error("Invalid cached archive");
    await verifyChecksum(destination, record.sha256);
    return destination;
  } catch (error) {
    if (error.code !== "ENOENT")
      throw new Error(
        `Invalid desktop cache; remove ${destination} and retry: ${error.message}`,
      );
  }
  const partial = `${destination}.${randomUUID()}.partial`;
  try {
    try {
      const response = await fetch(record.url, {
        redirect: "error",
        signal: AbortSignal.timeout(30000),
      });
      if (!response.ok || !response.body)
        throw new Error(`Official download failed: HTTP ${response.status}`);
      const output = await fs.open(partial, "wx");
      let size = 0;
      try {
        for await (const chunk of response.body) {
          size += chunk.length;
          if (size > record.size || size > MAX_ARCHIVE_BYTES)
            throw new Error("Download exceeds pinned archive size");
          await output.writeFile(chunk);
        }
      } finally {
        await output.close();
      }
    } catch (error) {
      await fs.rm(partial, { force: true });
      console.warn(
        `Node HTTPS failed (${error.message}); retrying official archive with curl.`,
      );
      await run(
        "curl",
        [
          "--fail",
          "--location",
          "--silent",
          "--show-error",
          "--proto",
          "=https",
          "--proto-redir",
          "=https",
          "--connect-timeout",
          "15",
          "--max-time",
          "180",
          "--max-filesize",
          String(record.size),
          "--output",
          partial,
          record.url,
        ],
        { timeout: 190000 },
      );
    }
    if ((await fs.stat(partial)).size !== record.size)
      throw new Error("Download does not match pinned archive size");
    await verifyChecksum(partial, record.sha256);
    await fs.rename(partial, destination);
    return destination;
  } finally {
    await fs.rm(partial, { force: true });
  }
}

export async function copyTree(
  source,
  destination,
  { exclude = () => false } = {},
) {
  const root = await fs.realpath(source);
  async function copy(current, output, relative, ancestors) {
    if (relative && exclude(relative)) return;
    const canonical = await fs.realpath(current);
    if (!inside(root, canonical))
      throw new Error(`Symlink escapes source root: ${current}`);
    const stat = await fs.stat(canonical);
    if (stat.isDirectory()) {
      if (ancestors.has(canonical))
        throw new Error(`Symlink directory cycle: ${current}`);
      await fs.mkdir(output, { recursive: true });
      const next = new Set([...ancestors, canonical]);
      for (const name of (await fs.readdir(canonical)).sort()) {
        safeRelative(name);
        await copy(
          path.join(canonical, name),
          path.join(output, name),
          relative ? `${relative}/${name}` : name,
          next,
        );
      }
      await fs.chmod(output, stat.mode & 0o777);
    } else if (stat.isFile()) {
      await fs.copyFile(canonical, output);
      await fs.chmod(output, stat.mode & 0o777);
    } else throw new Error(`Unsupported non-regular source: ${current}`);
  }
  await copy(source, destination, "", new Set());
}

export async function inventory(root, { exclude = new Set() } = {}) {
  const assets = [];
  const seen = new Set();
  async function visit(directory, prefix) {
    for (const entry of (
      await fs.readdir(directory, { withFileTypes: true })
    ).sort((a, b) => a.name.localeCompare(b.name, "en"))) {
      const relative = safeRelative(prefix + entry.name);
      const key = relative.normalize("NFC").toLowerCase();
      if (seen.has(key))
        throw new Error(`Case/normalization path collision: ${relative}`);
      seen.add(key);
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) await visit(file, `${relative}/`);
      else if (!entry.isFile())
        throw new Error(
          `Runtime must contain regular files, not links: ${relative}`,
        );
      else if (!exclude.has(relative))
        assets.push({ path: relative, sha256: await sha256(file) });
    }
  }
  const stat = await fs.lstat(root);
  if (!stat.isDirectory() || stat.isSymbolicLink())
    throw new Error("Runtime root must be a real directory");
  await visit(root, "");
  return assets.sort((a, b) =>
    a.path < b.path ? -1 : a.path > b.path ? 1 : 0,
  );
}

async function writeJSON(file, data) {
  await fs.writeFile(file, `${JSON.stringify(data, null, 2)}\n`, {
    flag: "wx",
  });
}

export async function createManifests(root, target) {
  await verifyRuntimeBinaries(root, target, await inventory(root));
  const adbVersion = await readAdbSourceVersion(root, target);
  const web = (await inventory(path.join(root, "web"))).map((asset) => ({
    ...asset,
    path: `web/${asset.path}`,
  }));
  for (const required of ["web/index.html", "web/runtime-config.json"]) {
    if (!web.some((asset) => asset.path === required))
      throw new Error(`Missing required web asset: ${required}`);
  }
  await writeJSON(path.join(root, "manifest.json"), {
    schemaVersion: 1,
    assets: web,
  });
  const assets = await inventory(root, {
    exclude: new Set(["runtime-manifest.json"]),
  });
  await writeJSON(path.join(root, "runtime-manifest.json"), {
    schemaVersion: 1,
    platform: target.platform,
    arch: target.arch,
    ...runtimeMetadata(target, adbVersion),
    assets,
  });
}

function validateAssets(manifest, label) {
  if (
    manifest?.schemaVersion !== 1 ||
    !Array.isArray(manifest.assets) ||
    !manifest.assets.length
  )
    throw new Error(`Invalid ${label} manifest`);
  const seen = new Set();
  for (const asset of manifest.assets) {
    safeRelative(asset.path);
    if (!SHA256.test(asset.sha256 ?? "") || seen.has(asset.path))
      throw new Error(`Invalid ${label} asset: ${asset.path}`);
    seen.add(asset.path);
  }
  return manifest.assets;
}

export async function verifyRuntime(root, target) {
  const value = JSON.parse(
    await fs.readFile(path.join(root, "runtime-manifest.json"), "utf8"),
  );
  if (value.platform !== target.platform || value.arch !== target.arch)
    throw new Error(`Runtime target mismatch; expected ${target.key}`);
  const declared = validateAssets(value, "runtime");
  verifyRuntimeMetadata(value, target);
  const actual = await inventory(root, {
    exclude: new Set(["runtime-manifest.json"]),
  });
  const byPath = new Map(actual.map((asset) => [asset.path, asset.sha256]));
  if (
    declared.length !== actual.length ||
    declared.some((asset) => byPath.get(asset.path) !== asset.sha256)
  )
    throw new Error("Runtime inventory/checksum mismatch");
  const web = validateAssets(
    JSON.parse(await fs.readFile(path.join(root, "manifest.json"), "utf8")),
    "web",
  );
  if (
    web.some(
      (asset) =>
        !asset.path.startsWith("web/") ||
        byPath.get(asset.path) !== asset.sha256,
    ) ||
    web.length !==
      actual.filter((asset) => asset.path.startsWith("web/")).length
  )
    throw new Error("Web manifest mismatch");
  const required = [
    "web/index.html",
    "web/runtime-config.json",
    `launcher/winscope-launcher${target.suffix}`,
    "web/engine_bundle.js",
    "web/trace_processor.wasm",
    "web/trace_processor_memory64.wasm",
    `capture/winscope-capture${target.suffix}`,
    `platform-tools/adb${target.suffix}`,
    "platform-tools/NOTICE.txt",
    "platform-tools/source.properties",
    "ai/cli.js",
    "ai/gateway.js",
    "ai/config.js",
    "ai/index.js",
  ];
  if (target.platform === "win32")
    required.push(
      "platform-tools/AdbWinApi.dll",
      "platform-tools/AdbWinUsbApi.dll",
      "platform-tools/libwinpthread-1.dll",
    );
  for (const file of required) {
    if (!byPath.has(file))
      throw new Error(`Missing bundled runtime asset: ${file}`);
  }
  if (!actual.some((asset) => asset.path.startsWith("capture/_internal/")))
    throw new Error("Capture is missing its embedded Python runtime");
  // NTFS and Windows build hosts do not carry POSIX execute bits, so the
  // permission contract can only be asserted from a POSIX host. Cross-platform
  // fixtures staged on Windows describe other targets without those bits.
  const executableBitsApply = process.platform !== "win32";
  for (const file of [
    `launcher/winscope-launcher${target.suffix}`,
    `capture/winscope-capture${target.suffix}`,
    `platform-tools/adb${target.suffix}`,
  ]) {
    if (
      executableBitsApply &&
      target.platform !== "win32" &&
      !((await fs.stat(path.join(root, file))).mode & 0o111)
    )
      throw new Error(`Runtime executable permission missing: ${file}`);
  }
  await verifyRuntimeBinaries(root, target, actual);
  return value;
}

export async function readAdbSourceVersion(root, target) {
  const properties = await fs.readFile(
    path.join(root, "platform-tools/source.properties"),
    "utf8",
  );
  const matches = [
    ...properties.matchAll(/^Pkg\.Revision\s*=\s*(\d+\.\d+\.\d+)\s*$/gm),
  ];
  if (
    matches.length !== 1 ||
    (target.adbSource === "ubuntu-24.04" && matches[0][1] !== "34.0.4")
  )
    throw new Error("Invalid Platform-Tools source version");
  return matches[0][1];
}

export function adbEnvironment(root, target, env = process.env) {
  return target.platform === "linux" && target.arch === "arm64"
    ? { ...env, LD_LIBRARY_PATH: path.join(root, "platform-tools/lib64") }
    : { ...env };
}

export function verifyAdbVersion(output, expected) {
  const matches = [...output.matchAll(/^Version (\d+\.\d+\.\d+)(?:[-\s]|$)/gm)];
  if (matches.length !== 1 || matches[0][1] !== expected)
    throw new Error("Executed ADB version differs from source metadata/lock");
}

export async function stageLinuxArmAdb(python, stage, cache, execute = run) {
  await execute(python, [
    "-I",
    path.join(ROOT, "desktop/bundle-linux-adb.py"),
    "--output",
    path.join(stage, "platform-tools"),
    "--cache",
    path.join(cache, "ubuntu"),
    "--lock",
    path.join(ROOT, "desktop/runtime-lock.json"),
  ]);
}

const PYTHON_INFO = String.raw`
import json, pathlib, platform, sys, sysconfig
if sys.version_info < (3, 10): raise RuntimeError("Build requires Python 3.10+")
candidates = [pathlib.Path(sysconfig.get_path("stdlib")) / "LICENSE.txt", pathlib.Path(sys.base_prefix) / "LICENSE.txt"]
license_file = next((str(p) for p in candidates if p.is_file()), None)
if not license_file: raise RuntimeError("Python distribution LICENSE.txt is missing; use an official CPython build")
print(json.dumps({"platform":sys.platform,"machine":platform.machine(),"license":license_file,"version":sys.version}))
`;

export async function inspectPython(python, target) {
  const candidates =
    python.includes("/") || python.includes("\\")
      ? [path.resolve(python)]
      : (process.env.PATH ?? "")
          .split(path.delimiter)
          .flatMap((directory) =>
            target.platform === "win32" && !path.extname(python)
              ? [
                  path.join(directory, `${python}.exe`),
                  path.join(directory, python),
                ]
              : [path.join(directory, python)],
          );
  let executable;
  for (const candidate of candidates) {
    try {
      if ((await fs.stat(candidate)).isFile()) {
        executable = await fs.realpath(candidate);
        break;
      }
    } catch (error) {
      if (error.code !== "ENOENT" && error.code !== "ENOTDIR") throw error;
    }
  }
  if (!executable)
    throw new Error(`Cannot locate native Python executable: ${python}`);
  await assertBinaryArchitecture(executable, {
    platform: target.platform,
    arch: target.arch,
    allowUniversal: true,
  });
  const info = JSON.parse(
    await run(executable, ["-I", "-c", PYTHON_INFO], { capture: true }),
  );
  const arch = {
    aarch64: "arm64",
    arm64: "arm64",
    amd64: "x64",
    x86_64: "x64",
  }[info.machine.toLowerCase()];
  if (info.platform !== target.platform || arch !== target.arch)
    throw new Error(
      `Python build architecture mismatch: ${info.platform}-${info.machine}`,
    );
  return { ...info, executable };
}

async function freezeCapture(python, work, stage, target, cache, info) {
  const venv = path.join(work, "venv");
  await run(python, ["-I", "-m", "venv", venv]);
  const executable = path.join(
    venv,
    target.platform === "win32" ? "Scripts/python.exe" : "bin/python",
  );
  await assertBinaryArchitecture(executable, {
    platform: target.platform,
    arch: target.arch,
    allowUniversal: true,
  });
  const env = {
    ...process.env,
    PYTHONNOUSERSITE: "1",
    PIP_CONFIG_FILE: target.platform === "win32" ? "NUL" : "/dev/null",
    PIP_INDEX_URL: "https://pypi.org/simple",
    PIP_EXTRA_INDEX_URL: "",
    PIP_CACHE_DIR: path.join(cache, "pip"),
    PYINSTALLER_CONFIG_DIR: path.join(work, "pyinstaller-cache"),
  };
  delete env.PYTHONPATH;
  delete env.PYTHONHOME;
  await run(
    executable,
    [
      "-I",
      "-m",
      "pip",
      "--isolated",
      "install",
      "--disable-pip-version-check",
      "--index-url",
      "https://pypi.org/simple",
      "--cache-dir",
      env.PIP_CACHE_DIR,
      "--only-binary=:all:",
      "--no-deps",
      "-r",
      path.join(ROOT, "desktop/requirements.txt"),
    ],
    { env },
  );
  await run(executable, ["-I", "-m", "pip", "--isolated", "check"], { env });
  const dist = path.join(work, "frozen");
  const args = [
    "-I",
    "-m",
    "PyInstaller",
    "--noconfirm",
    "--clean",
    "--onedir",
    "--noupx",
    "--name",
    "winscope-capture",
    "--contents-directory",
    "_internal",
    "--distpath",
    dist,
    "--workpath",
    path.join(work, "freeze-work"),
    "--specpath",
    work,
  ];
  if (target.platform === "darwin")
    args.push(
      "--target-architecture",
      target.arch === "x64" ? "x86_64" : "arm64",
    );
  args.push(path.join(ROOT, "src/adb/winscope_proxy.py"));
  await run(executable, args, { env });
  await copyTree(
    path.join(dist, "winscope-capture"),
    path.join(stage, "capture"),
  );
  await fs.copyFile(
    info.license,
    path.join(stage, "capture/PYTHON-LICENSE.txt"),
  );
  await fs.copyFile(
    path.join(ROOT, "desktop/LICENSE.txt"),
    path.join(stage, "capture/WINSCOPE-LICENSE.txt"),
  );
  await fs.copyFile(
    path.join(ROOT, "src/adb/winscope_proxy.py"),
    path.join(stage, "capture/winscope_proxy.source.py"),
  );
  await fs.copyFile(
    path.join(ROOT, "desktop/requirements.txt"),
    path.join(stage, "capture/BUILD-REQUIREMENTS.txt"),
  );
  await writeJSON(path.join(stage, "capture/build-info.json"), {
    python: info.version,
    arch: target.captureArch,
    buildOnlyRequirements: "BUILD-REQUIREMENTS.txt",
    pyinstallerLicense: "GPL-2.0-or-later WITH Bootloader-exception",
    licenseReference: "https://pyinstaller.org/en/v6.22.3/license.html",
  });
  await assertBinaryArchitecture(
    path.join(stage, "capture", `winscope-capture${target.suffix}`),
    {
      platform: target.platform,
      arch: target.captureArch,
    },
  );
  // --help exits before opening a port; a restricted PATH proves no python lookup is needed.
  await run(
    path.join(stage, "capture", `winscope-capture${target.suffix}`),
    ["--help"],
    {
      env: {
        ...process.env,
        PATH:
          target.platform === "win32"
            ? (process.env.SystemRoot ?? "C:\\Windows")
            : "/usr/bin:/bin",
        PYTHONHOME: "",
        PYTHONPATH: "",
      },
      capture: true,
      timeout: 30000,
    },
  );
}

export function parseArgs(args) {
  const options = {
    skipWebBuild: false,
    python: process.platform === "win32" ? "python" : "python3",
    help: false,
  };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--skip-web-build") options.skipWebBuild = true;
    else if (args[i] === "--help") options.help = true;
    else if (
      args[i] === "--python" &&
      args[i + 1] &&
      !args[i + 1].startsWith("--")
    )
      options.python = args[++i];
    else throw new Error(`Unknown or incomplete option: ${args[i]}`);
  }
  return options;
}

export async function prepare(options = {}) {
  const target = targetFor();
  assertNativeTarget(target);
  const {
    skipWebBuild = false,
    python: requestedPython = process.platform === "win32"
      ? "python"
      : "python3",
  } = options;
  const lock = validateLock(
    JSON.parse(
      await fs.readFile(path.join(ROOT, "desktop/runtime-lock.json"), "utf8"),
    ),
  );
  const base = path.join(ROOT, "dist/desktop");
  const cache = path.join(base, "cache");
  await fs.mkdir(base, { recursive: true });
  const mutex = path.join(base, ".prepare.lock");
  let handle;
  try {
    handle = await fs.open(mutex, "wx");
  } catch (error) {
    throw new Error(
      `Desktop prepare is locked (${mutex}); check for another build before removing a stale lock: ${error.message}`,
    );
  }
  let work;
  try {
    await handle.writeFile(`${process.pid}\n`);
    work = await fs.mkdtemp(path.join(base, ".prepare-"));
    const pythonInfo = await inspectPython(requestedPython, target);
    const python = pythonInfo.executable;
    // Fetch before the expensive builds, using only the separate desktop cache.
    const record =
      target.archive === null
        ? null
        : lock.platformTools.archives[target.archive];
    const archive = record
      ? await downloadArchive(record, path.join(cache, "platform-tools"))
      : null;
    if (!skipWebBuild) {
      const npm = path.join(ROOT, "node_modules/npm/bin/npm-cli.js");
      // npm_execpath supports npm's Windows .cmd shim without invoking a shell.
      const npmCLI = process.env.npm_execpath || (await locateNpmCLI(npm));
      await fs.rm(path.join(ROOT, "dist/prod"), {
        recursive: true,
        force: true,
      });
      await fs.rm(path.join(ROOT, "ai/dist/src"), {
        recursive: true,
        force: true,
      });
      for (const script of ["build:protos", "build:app", "ai:build"])
        await run(process.execPath, [npmCLI, "run", script]);
    } else
      console.log(
        "Using explicitly prebuilt dist/prod and ai/dist/src (--skip-web-build); no source fallback.",
      );
    const stage = path.join(work, "runtime");
    await fs.mkdir(stage);
    await copyTree(path.join(ROOT, "dist/prod"), path.join(stage, "web"));
    await copyTree(path.join(ROOT, "ai/dist/src"), path.join(stage, "ai"), {
      exclude: (name) =>
        name === "test" || name.startsWith("test/") || name.endsWith(".map"),
    });
    if (target.platform === "linux" && target.arch === "arm64") {
      await stageLinuxArmAdb(python, stage, cache);
    } else {
      const extracted = path.join(work, "extracted");
      await extractPlatformTools(archive, record.sha256, extracted, python);
      await copyTree(
        path.join(extracted, "platform-tools"),
        path.join(stage, "platform-tools"),
        {
          exclude: (name) =>
            !record.runtimeFiles.some(
              (file) => file === name || file.startsWith(`${name}/`),
            ),
        },
      );
      for (const file of record.runtimeFiles) {
        if (!(await fs.stat(path.join(stage, "platform-tools", file))).isFile())
          throw new Error(`Missing required ADB support file: ${file}`);
      }
    }
    const sourceVersion = await readAdbSourceVersion(stage, target);
    if (sourceVersion !== (record ? lock.platformTools.version : "34.0.4"))
      throw new Error("Platform-Tools version differs from lock");
    if (
      !(
        await fs.readFile(path.join(stage, "platform-tools/NOTICE.txt"), "utf8")
      ).trim()
    )
      throw new Error("Platform-Tools license notice is empty");
    await fs.copyFile(
      path.join(ROOT, "desktop/runtime-lock.json"),
      path.join(stage, "platform-tools/runtime-lock.json"),
    );
    await freezeCapture(python, work, stage, target, cache, pythonInfo);
    await fs.mkdir(path.join(stage, "launcher"));
    await run(
      "go",
      [
        "build",
        "-trimpath",
        "-buildvcs=false",
        "-o",
        path.join(stage, "launcher", `winscope-launcher${target.suffix}`),
        "./cmd/launcher",
      ],
      {
        env: {
          ...process.env,
          CGO_ENABLED: "0",
          GOOS: target.goos,
          GOARCH: target.goarch,
        },
      },
    );
    await verifyRuntimeBinaries(stage, target, await inventory(stage));
    const adbVersion = await run(
      path.join(stage, "platform-tools", `adb${target.suffix}`),
      ["version"],
      { capture: true, timeout: 30000, env: adbEnvironment(stage, target) },
    );
    verifyAdbVersion(adbVersion, sourceVersion);
    await createManifests(stage, target);
    const manifest = await verifyRuntime(stage, target);
    const parent = path.join(base, "runtime");
    await fs.mkdir(parent, { recursive: true });
    const destination = path.join(parent, target.key);
    const backup = path.join(work, "previous-runtime");
    let previous = false;
    try {
      await fs.rename(destination, backup);
      previous = true;
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
    try {
      await fs.rename(stage, destination);
    } catch (error) {
      if (previous) await fs.rename(backup, destination);
      throw error;
    }
    const result = {
      ok: true,
      target: target.key,
      runtime: destination,
      assets: manifest.assets.length,
      platformTools: sourceVersion,
      ...runtimeMetadata(target, sourceVersion),
      adbVersion,
      signing: "not asserted",
    };
    console.log(JSON.stringify(result, null, 2));
    return result;
  } finally {
    if (work) await fs.rm(work, { recursive: true, force: true });
    await handle.close();
    await fs.rm(mutex, { force: true });
  }
}

async function locateNpmCLI(local) {
  for (const candidate of [
    local,
    path.join(
      path.dirname(process.execPath),
      "../lib/node_modules/npm/bin/npm-cli.js",
    ),
    path.join(
      path.dirname(process.execPath),
      "node_modules/npm/bin/npm-cli.js",
    ),
  ]) {
    try {
      if ((await fs.stat(candidate)).isFile()) return candidate;
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }
  throw new Error(
    "Cannot locate npm-cli.js; invoke prepare via npm or install npm beside Node",
  );
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
) {
  try {
    const options = parseArgs(process.argv.slice(2));
    if (options.help)
      console.log(
        "Usage: node desktop/prepare.mjs [--skip-web-build] [--python /path/to/python]\nNative host only. Default: build protos, production web and AI; freeze capture, bundle pinned ADB, compile Go, verify manifests.\n--skip-web-build asserts dist/prod and ai/dist/src are already verified current builds.\nBuild tools: Node/npm dependencies, Go, Python 3.10+ with venv and a Python LICENSE.txt. The packaged app needs none of these.",
      );
    else await prepare(options);
  } catch (error) {
    console.error(`Desktop prepare failed: ${error.message}`);
    process.exitCode = 1;
  }
}
