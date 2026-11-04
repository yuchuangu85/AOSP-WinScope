import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, readFile, mkdir, rm, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import path from "node:path";

const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL("..", import.meta.url));
const args = process.argv.slice(2);
const index = args.indexOf("--executable");
if (index >= 0 && !args[index + 1])
  throw new Error("--executable requires a path");
const executable =
  index >= 0 ? path.resolve(args[index + 1]) : require("electron");
const output = path.join(
  root,
  "dist/validation/electron",
  index >= 0 ? "packaged" : "source",
);
await mkdir(output, { recursive: true });
await rm(path.join(output, "result.json"), { force: true });
await rm(path.join(output, "acceptance.json"), { force: true });
const userData = await mkdtemp(path.join(tmpdir(), "winscope desktop smoke "));
const commandArgs = index < 0 ? [path.join(root, "desktop/app")] : [];
let child;
const runs = [];
try {
  const environment = {
    ...process.env,
    WINSCOPE_DESKTOP_SMOKE: output,
    WINSCOPE_DESKTOP_USER_DATA: userData,
    WINSCOPE_DESKTOP_SMOKE_TRACE: path.join(
      root,
      "src/test/fixtures/traces/perfetto/layers_trace.perfetto-trace",
    ),
  };
  // Installed runtime acceptance must not depend on development Python/ADB/Node.
  delete environment.ELECTRON_RUN_AS_NODE;
  delete environment.WINSCOPE_AI_CONFIG;
  environment.PATH =
    process.platform === "win32"
      ? `${process.env.SystemRoot}\\System32`
      : "/usr/bin:/bin:/usr/sbin:/sbin";
  for (let attempt = 0; attempt < 2; attempt++) {
    if (attempt === 1) delete environment.WINSCOPE_DESKTOP_SMOKE_TRACE;
    await rm(path.join(output, "result.json"), { force: true });
    child = spawn(executable, commandArgs, {
      cwd: userData,
      env: environment,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let log = "";
    child.stdout.on("data", (chunk) => {
      log += chunk;
    });
    child.stderr.on("data", (chunk) => {
      log += chunk;
    });
    let hardStop;
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill("SIGTERM");
      hardStop = setTimeout(() => child.kill("SIGKILL"), 30000);
    }, 120000);
    const status = await new Promise((resolve, reject) => {
      child.once("error", reject);
      child.once("exit", (code, signal) => resolve({ code, signal }));
    }).finally(() => {
      clearTimeout(timer);
      clearTimeout(hardStop);
    });
    await writeFile(
      path.join(output, attempt === 0 ? "electron.log" : "restart.log"),
      log,
    );
    assert.equal(
      timedOut,
      false,
      `Electron smoke exceeded its deadline\n${log}`,
    );
    assert.equal(
      status.code,
      0,
      `Electron did not exit cleanly: ${JSON.stringify(status)}\n${log}`,
    );
    const result = JSON.parse(
      await readFile(path.join(output, "result.json"), "utf8"),
    );
    assert.equal(result.ok, true);
    if (attempt === 0) {
      assert.equal(result.nativeOpenVerified, true);
    }
    if (attempt === 1) {
      assert.ok(
        result.initialRecentFiles > 0,
        "Recent files restore before opening the File menu",
      );
      assert.equal(
        result.recentReopenVerified,
        true,
        "A persisted recent file reopens through the real parser",
      );
      assert.equal(
        result.initialLanguage,
        result.systemLanguage,
        "Saved preferences must restore before Angular bootstrap on restart",
      );
      assert.equal(result.initialLanguagePreference, "system");
      assert.equal(
        result.initialDisplayScale,
        80,
        "Saved display size must restore before Angular bootstrap on restart",
      );
      assert.equal(
        result.initialConfirmTraceReset,
        false,
        "Suppressed confirmation restores before bootstrap on restart",
      );
    }
    for (const origin of [result.origin, result.aiOrigin]) {
      await assert.rejects(
        fetch(origin, { signal: AbortSignal.timeout(2000) }),
        "Owned service must stop when Electron exits",
      );
    }
    const preferences = JSON.parse(
      await readFile(path.join(userData, "preferences.json"), "utf8"),
    );
    assert.equal(
      preferences.language,
      "system",
      "System language preference must survive random-origin changes",
    );
    assert.equal(preferences["display-scale"], "80");
    assert.equal(preferences["confirm-trace-reset"], "false");
    runs.push({
      ...result,
      servicesStopped: true,
      preferencesSaved: true,
      preferenceRestoreVerified: attempt === 1,
    });
    console.log(
      JSON.stringify(
        {
          ...result,
          servicesStopped: true,
          preferencesSaved: true,
          preferenceRestoreVerified: attempt === 1,
          evidence: output,
        },
        null,
        2,
      ),
    );
    if (attempt === 0)
      await writeFile(
        path.join(output, "first-run.json"),
        JSON.stringify(result, null, 2) + "\n",
      );
  }
  await writeFile(
    path.join(output, "acceptance.json"),
    JSON.stringify(
      {
        schemaVersion: 1,
        ok: true,
        packaged: runs.every((run) => run.packaged),
        platform: process.platform,
        arch: process.arch,
        runs,
      },
      null,
      2,
    ) + "\n",
  );
} finally {
  if (child && child.exitCode === null && child.signalCode === null)
    child.kill("SIGTERM");
  await rm(userData, { recursive: true, force: true });
}
