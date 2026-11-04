"use strict";

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");
const vm = require("node:vm");
const code = readFileSync(path.join(__dirname, "preload.cjs"), "utf8");

function fixture({ href = "http://127.0.0.1:43127/", child = false } = {}) {
  const calls = [];
  const listeners = new Map();
  const observers = [];
  const exposed = {};
  const element = { lang: "en", dataset: {} };
  const window = { location: { href } };
  window.top = child ? {} : window;
  Object.defineProperty(window, "localStorage", {
    get() {
      throw new Error("Unavailable storage");
    },
  });
  const context = {
    window,
    URL,
    TextEncoder,
    process: { platform: "darwin", versions: { electron: "45" } },
    document: { documentElement: element, addEventListener() {} },
    MutationObserver: class {
      constructor(callback) {
        this.callback = callback;
        observers.push(this);
      }
      observe(target, options) {
        this.target = target;
        this.options = options;
      }
      disconnect() {
        this.disconnected = true;
      }
    },
    require(name) {
      assert.equal(name, "electron");
      return {
        contextBridge: {
          exposeInMainWorld(name, api) {
            exposed[name] = api;
          },
        },
        webUtils: {
          getPathForFile(file) {
            assert.ok(file.nativeFile);
            return file.path || "";
          },
        },
        ipcRenderer: {
          on(channel, callback) {
            listeners.set(channel, callback);
          },
          removeListener(channel, callback) {
            if (listeners.get(channel) === callback) listeners.delete(channel);
          },
          send(channel, value) {
            calls.push({ channel, value });
          },
          invoke(channel, value) {
            calls.push({ channel, value });
            return Promise.resolve(new Uint8Array([1, 2]));
          },
        },
      };
    },
  };
  vm.runInNewContext(code, context);
  return {
    api: exposed.winscopeFiles,
    calls,
    listeners,
    observers,
    element,
    window,
  };
}

test("exposes a narrow file bridge, subscribes before ready, and discards the IPC event", () => {
  const run = fixture();
  assert.deepEqual(Object.keys(run.api).sort(), [
    "complete",
    "onOpen",
    "readChunk",
    "remember",
  ]);
  let received;
  const unsubscribe = run.api.onOpen((batch) => {
    received = batch;
  });
  const batch = { token: "approved", files: [] };
  run.listeners.get("winscope:files:open")({ sender: "never exposed" }, batch);
  assert.equal(received, batch);
  assert.equal(run.calls[0].channel, "winscope:files:ready");
  assert.equal(run.calls[0].value.persistence, true);
  run.element.lang = "zh-CN";
  run.observers
    .find((o) => o.options.attributeFilter?.includes("lang"))
    .callback();
  assert.equal(run.calls.at(-1).value.language, "zh-CN");
  unsubscribe();
  assert.equal(run.listeners.has("winscope:files:open"), false);
  assert.ok(run.observers.some((o) => o.disconnected));
});

test("only derives remembered paths from native File values, never a renderer path argument", () => {
  const run = fixture();
  run.api.remember([
    { nativeFile: true, path: "/traces/layers.trace" },
    { nativeFile: true },
  ]);
  assert.equal(run.calls.at(-1).channel, "winscope:files:remember");
  assert.deepEqual(Array.from(run.calls.at(-1).value), [
    "/traces/layers.trace",
  ]);
  assert.throws(() => run.api.remember(["/etc/passwd"]));
  run.api.remember(Array(65).fill({ nativeFile: true, path: "/traces/a" }));
  assert.equal(run.calls.length, 1);
});

test("chunk reading and completion cannot specify a filesystem path", async () => {
  const run = fixture();
  const bytes = await run.api.readChunk("authorized", 0, 4);
  assert.deepEqual(Array.from(bytes), [1, 2]);
  run.api.complete("authorized", [0]);
  assert.deepEqual(JSON.parse(JSON.stringify(run.calls)), [
    {
      channel: "winscope:files:read",
      value: { token: "authorized", index: 0, offset: 4 },
    },
    {
      channel: "winscope:files:complete",
      value: { token: "authorized", indexes: [0] },
    },
  ]);
});

test("privacy retains native opening but disables remembered paths and advertises no persistence", () => {
  const run = fixture({ href: "http://127.0.0.1:43127/?no-persistence" });
  run.api.onOpen(() => {});
  assert.equal(run.calls[0].value.persistence, false);
  run.api.remember([{ nativeFile: true, path: "/traces/private" }]);
  assert.equal(run.calls.length, 1);
});

test("foreign URLs and subframes never expose file access", () => {
  for (const options of [
    { href: "https://example.com" },
    { href: "http://user@127.0.0.1:43127/" },
    { href: "http://localhost:43127/" },
    { child: true },
  ]) {
    const run = fixture(options);
    assert.equal(run.api, undefined);
    assert.deepEqual(run.calls, []);
  }
});
