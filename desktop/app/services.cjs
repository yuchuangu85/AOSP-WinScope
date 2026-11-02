"use strict";

const { spawn } = require("node:child_process");
const path = require("node:path");
const { parseReadyOrigin } = require("./security.cjs");

function waitForLauncher(child, timeout = 20000) {
  return new Promise((resolve, reject) => {
    let text = "";
    const cleanup = () => {
      clearTimeout(timer);
      child.stdout.off("data", onData);
      child.off("exit", onExit);
      child.off("error", onError);
    };
    const fail = (error) => {
      cleanup();
      reject(error);
    };
    const onError = () =>
      fail(new Error("Could not start the bundled desktop service"));
    const onExit = (code) =>
      fail(
        new Error(`Bundled desktop service stopped before startup (${code})`),
      );
    const onData = (chunk) => {
      text += chunk.toString("utf8");
      if (text.length > 8192)
        return fail(
          new Error("Desktop service readiness response is too large"),
        );
      const end = text.indexOf("\n");
      if (end === -1) return;
      try {
        const origin = parseReadyOrigin(text.slice(0, end).trim());
        cleanup();
        child.stdout.resume();
        resolve(origin);
      } catch (error) {
        fail(error);
      }
    };
    const timer = setTimeout(
      () => fail(new Error("Bundled capture service startup timed out")),
      timeout,
    );
    child.stdout.on("data", onData);
    child.once("exit", onExit);
    child.once("error", onError);
  });
}

function waitForGateway(child, timeout = 20000) {
  return new Promise((resolve, reject) => {
    const cleanup = () => {
      clearTimeout(timer);
      child.off("message", message);
      child.off("exit", exit);
    };
    const fail = (error) => {
      cleanup();
      reject(error);
    };
    const exit = (code) =>
      fail(new Error(`Bundled AI gateway stopped before startup (${code})`));
    const message = (data) => {
      if (data?.type === "error")
        return fail(new Error("Bundled AI gateway could not initialize"));
      if (data?.type !== "ready") return;
      if (!Number.isInteger(data.port) || data.port < 1 || data.port > 65535)
        return fail(new Error("Invalid AI gateway port"));
      cleanup();
      resolve(`http://127.0.0.1:${data.port}`);
    };
    const timer = setTimeout(
      () => fail(new Error("Bundled AI gateway startup timed out")),
      timeout,
    );
    child.on("message", message);
    child.once("exit", exit);
  });
}

function stopOwned(
  child,
  requestStop,
  { graceMs, forceMs = 3000, forceKill } = {},
) {
  if (!child?.pid) return Promise.resolve();
  const pid = child.pid;
  return new Promise((resolve, reject) => {
    let forceTimer;
    const cleanup = () => {
      clearTimeout(timer);
      clearTimeout(forceTimer);
      child.off("exit", exited);
    };
    const exited = () => {
      cleanup();
      resolve();
    };
    const timer = setTimeout(() => {
      if (child.pid !== pid) return exited();
      forceTimer = setTimeout(() => {
        cleanup();
        reject(
          new Error(
            "Owned desktop service did not exit after forced termination",
          ),
        );
      }, forceMs);
      try {
        if (forceKill) forceKill();
        else process.kill(pid, "SIGKILL");
      } catch (error) {
        if (error.code !== "ESRCH") {
          cleanup();
          reject(error);
          return;
        }
      }
    }, graceMs);
    child.once("exit", exited);
    try {
      requestStop();
    } catch {
      /* The exact owned process still gets a bounded forced stop. */
    }
  });
}

async function stopLauncher(child, options = {}) {
  if (!child?.pid || child.exitCode !== null || child.signalCode !== null)
    return;
  // Closing this owned pipe also works on Windows, unlike Unix signals.
  await stopOwned(child, () => child.stdin.end(), {
    graceMs: 15000,
    forceKill: () => child.kill("SIGKILL"),
    ...options,
  });
}

async function stopGateway(child, options = {}) {
  await stopOwned(child, () => child.postMessage({ type: "shutdown" }), {
    graceMs: 10000,
    ...options,
  });
}

async function startServices({
  runtimeRoot,
  utilityProcess,
  environment = process.env,
  onFailure = () => {},
}) {
  let ai;
  let launcher;
  let stopping = false;
  let stopPromise;
  const failed = () => {
    if (!stopping)
      onFailure(new Error("A bundled desktop service unexpectedly stopped"));
  };
  const stop = () => {
    if (stopPromise) return stopPromise;
    stopping = true;
    stopPromise = (async () => {
      try {
        await stopLauncher(launcher);
      } finally {
        await stopGateway(ai);
      }
    })();
    return stopPromise;
  };
  try {
    ai = utilityProcess.fork(
      path.join(__dirname, "ai-service.cjs"),
      [path.join(runtimeRoot, "ai")],
      {
        serviceName: "WinScope AI gateway",
        stdio: ["ignore", "ignore", "pipe"],
        env: environment,
      },
    );
    // Provider diagnostics can contain local configuration; do not persist them.
    ai.stderr?.resume();
    const aiOrigin = await waitForGateway(ai);
    const suffix = process.platform === "win32" ? ".exe" : "";
    launcher = spawn(
      path.join(runtimeRoot, "launcher", `winscope-launcher${suffix}`),
      ["--root", runtimeRoot, "--parent-pipe", "--ai-url", aiOrigin],
      {
        cwd: runtimeRoot,
        env: environment,
        windowsHide: true,
        stdio: ["pipe", "pipe", "pipe"],
      },
    );
    launcher.stdin.on("error", () => {});
    launcher.stderr.resume();
    const origin = await waitForLauncher(launcher);
    if (!ai.pid || launcher.exitCode !== null || launcher.signalCode !== null) {
      throw new Error("A bundled service stopped during initialization");
    }
    ai.once("exit", failed);
    launcher.once("exit", failed);
    return { origin, aiOrigin, launcherPid: launcher.pid, aiPid: ai.pid, stop };
  } catch (error) {
    await stop();
    throw error;
  }
}

module.exports = {
  waitForLauncher,
  waitForGateway,
  stopLauncher,
  stopGateway,
  startServices,
};
