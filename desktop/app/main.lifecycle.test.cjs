"use strict";
const assert = require("node:assert/strict");
const { EventEmitter } = require("node:events");
const { readFileSync } = require("node:fs");
const { test } = require("node:test");
const vm = require("node:vm");
const path = require("node:path");

test("quit during service startup waits for the service owner and its cleanup", async () => {
  const app = new EventEmitter();
  const exits = [];
  let resolveStartup;
  let resolveStop;
  let stops = 0;
  const startup = new Promise((resolve) => {
    resolveStartup = resolve;
  });
  const stopped = new Promise((resolve) => {
    resolveStop = resolve;
  });
  const owner = {
    stop: () => {
      stops++;
      return stopped;
    },
  };
  Object.assign(app, {
    isPackaged: false,
    setName() {},
    enableSandbox() {},
    requestSingleInstanceLock: () => true,
    whenReady: () => Promise.resolve(),
    exit: (code) => exits.push(code),
    quit: () => app.emit("before-quit", { preventDefault() {} }),
  });
  const code = readFileSync(path.join(__dirname, "main.cjs"), "utf8");
  vm.runInNewContext(code, {
    require(name) {
      if (name === "electron")
        return { app, dialog: {}, ipcMain: {}, utilityProcess: {} };
      if (name === "./security.cjs") return { verifyRuntime: async () => {} };
      if (name === "./services.cjs") return { startServices: () => startup };
      if (name === "./preferences.cjs") return {};
      return require(name);
    },
    __dirname,
    process: { platform: "darwin", arch: "arm64", env: {}, on() {} },
    console,
  });
  await new Promise((resolve) => setImmediate(resolve));
  app.quit();
  await new Promise((resolve) => setImmediate(resolve));
  assert.deepEqual(exits, [], "Pending startup must not be abandoned");
  resolveStartup(owner);
  await new Promise((resolve) => setImmediate(resolve));
  assert.ok(stops > 0);
  assert.deepEqual(exits, [], "Owned cleanup must finish before process exit");
  resolveStop();
  await new Promise((resolve) => setImmediate(resolve));
  assert.deepEqual(exits, [0]);
});
