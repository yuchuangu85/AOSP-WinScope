"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const vm = require("node:vm");
const { test } = require("node:test");
const {
  PreferenceStore,
  isTrustedPreferenceSender,
  PREFERENCE_LIMITS: limits,
} = require("./preferences.cjs");

const preload = fs.readFileSync(path.join(__dirname, "preload.cjs"), "utf8");
const origin = "http://127.0.0.1:43127";

function fixture(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "winscope-prefs-"));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const file = path.join(directory, "userData", "preferences.json");
  return { directory, file, store: new PreferenceStore(file) };
}

function warnings(t) {
  const messages = [];
  t.mock.method(console, "warn", (...args) => messages.push(args.join(" ")));
  return messages;
}

function fakePreload({
  reply = {},
  initial = {},
  href = origin + "/",
  childFrame = false,
  unavailable = false,
  sendFails = false,
  readFails = false,
  restoreFails = false,
  rawReply,
} = {}) {
  const data = new Map(Object.entries(initial));
  const reads = [];
  const calls = [];
  const imports = [];
  const timers = [];
  const listeners = new Map();
  const failures = {
    get: false,
    set: restoreFails,
    remove: false,
    send: sendFails,
  };
  const storage = {
    get length() {
      if (failures.get) throw new Error("Storage is unavailable");
      return data.size;
    },
    key: (index) => [...data.keys()][index] ?? null,
    getItem(key) {
      reads.push(key);
      if (failures.get) throw new Error("Storage is unavailable");
      return data.get(key) ?? null;
    },
    setItem(key, value) {
      if (failures.set) throw new Error("Storage quota exceeded");
      data.set(key, value);
    },
    removeItem(key) {
      if (failures.remove) throw new Error("Storage is unavailable");
      data.delete(key);
    },
  };
  const window = {
    location: { href },
    setInterval(callback, milliseconds) {
      timers.push({ callback, milliseconds });
    },
    addEventListener(name, callback) {
      listeners.set(name, callback);
    },
  };
  window.top = childFrame ? {} : window;
  Object.defineProperty(window, "localStorage", {
    get() {
      if (unavailable) throw new Error("Storage denied");
      return storage;
    },
  });
  const context = vm.createContext({ window, URL, TextEncoder });
  // Electron's structured-cloned reply belongs to the preload's realm.
  context.reply =
    rawReply !== undefined
      ? rawReply
      : vm.runInContext(
          `JSON.parse(${JSON.stringify(JSON.stringify(reply))})`,
          context,
        );
  context.require = (name) => {
    imports.push(name);
    assert.equal(name, "electron", "sandbox preload must import only electron");
    return {
      ipcRenderer: {
        sendSync(channel) {
          calls.push({ channel });
          if (readFails) throw new Error("Read IPC failed");
          return context.reply;
        },
        send(channel, value) {
          if (failures.send) throw new Error("Write IPC failed");
          calls.push({ channel, value: JSON.parse(JSON.stringify(value)) });
        },
      },
      get contextBridge() {
        throw new Error("No contextBridge may be accessed");
      },
    };
  };
  assert.doesNotThrow(() => vm.runInContext(preload, context));
  return {
    data,
    reads,
    calls,
    imports,
    timers,
    listeners,
    failures,
    window,
    tick: () => timers.forEach(({ callback }) => callback()),
    unload: () => listeners.get("beforeunload")?.(),
  };
}

test("filters to the existing exact preference boundary and string values", (t) => {
  const { store, file } = fixture(t);
  const value = {
    "dark-mode": "true",
    language: "zh-CN",
    savedSearches: '[{"query":"layer"}]',
    hierarchyOptions: '{"flat":true}',
    Options: "bare suffix is allowed",
    treeView: "bare prefix is allowed",
    treeViewExpanded: "[]",
    darkMode: "ignored",
    languageOptionsExtra: "ignored",
    TreeView: "ignored",
    trace: "private trace",
    aiPrompts: "private prompt",
    aiSessions: "private session",
    access_token: "private token",
    browserAuth: "private authentication",
    invalidOptions: { nested: "do not stringify" },
    numberOptions: 3,
    booleanOptions: false,
    nullOptions: null,
    undefinedOptions: undefined,
  };
  const expected = {
    "dark-mode": value["dark-mode"],
    language: value.language,
    savedSearches: value.savedSearches,
    hierarchyOptions: value.hierarchyOptions,
    Options: value.Options,
    treeView: value.treeView,
    treeViewExpanded: value.treeViewExpanded,
  };
  assert.deepEqual(store.set(value), { ok: true });
  assert.deepEqual(store.snapshot(), expected);
  assert.deepEqual(JSON.parse(fs.readFileSync(file, "utf8")), expected);
  const copy = store.snapshot();
  copy.language = "en";
  assert.equal(store.snapshot().language, "zh-CN");
  assert.deepEqual(new PreferenceStore(file).snapshot(), expected);
});

test("display presets and system theme survive disk save and a different launch origin", (t) => {
  const { store, file } = fixture(t);
  for (const scale of [80, 90, 100, 110, 120, 130, 140]) {
    const saved = {
      "display-scale": String(scale),
      "theme-mode": "system",
      language: "system",
    };
    assert.equal(store.set(saved).ok, true);
    const reopened = new PreferenceStore(file);
    assert.deepEqual(reopened.snapshot(), saved);
    const first = fakePreload({ reply: reopened.snapshot() });
    assert.equal(first.data.get("display-scale"), String(scale));
    first.data.set("display-scale", "80");
    first.unload();
    const updated = first.calls.find(
      (call) => call.channel === "winscope:preferences:write",
    );
    if (updated) assert.equal(store.set(updated.value).ok, true);
    const next = fakePreload({
      href: "http://127.0.0.1:43128/",
      reply: new PreferenceStore(file).snapshot(),
      initial: { "display-scale": "140" },
    });
    assert.equal(next.data.get("display-scale"), "80");
    assert.equal(next.data.get("theme-mode"), "system");
    assert.equal(next.data.get("language"), "system");
  }
});

test("reset confirmation round-trips across disk and launch origins in both directions", (t) => {
  const { store, file } = fixture(t);
  for (const value of ["false", "true"]) {
    const nextValue = value === "true" ? "false" : "true";
    assert.equal(store.set({ "confirm-trace-reset": value }).ok, true);
    const first = fakePreload({ reply: new PreferenceStore(file).snapshot() });
    assert.equal(first.data.get("confirm-trace-reset"), value);
    first.data.set("confirm-trace-reset", nextValue);
    first.data.set("aiPrompts", "private");
    first.unload();
    assert.deepEqual(first.calls[1].value, { "confirm-trace-reset": nextValue });
    assert.equal(store.set(first.calls[1].value).ok, true);
    const second = fakePreload({
      href: "http://127.0.0.1:51234/",
      reply: new PreferenceStore(file).snapshot(),
      initial: { "confirm-trace-reset": value, aiSessions: "private" },
    });
    assert.equal(second.data.get("confirm-trace-reset"), nextValue);
    assert.equal(second.data.get("aiPrompts"), undefined);
    assert.equal(second.data.get("aiSessions"), "private");
    second.data.delete("confirm-trace-reset");
    second.tick();
    assert.deepEqual(second.calls[1].value, {});
    assert.equal(store.set(second.calls[1].value).ok, true);
    assert.deepEqual(new PreferenceStore(file).snapshot(), {});
  }
});

test("reset confirmation expands only the exact main and preload key boundary", (t) => {
  const { store } = fixture(t);
  const values = {
    "confirm-trace-reset": "false",
    "confirm-trace-reset-extra": "private",
    "confirm-trace": "private",
    confirmTraceReset: "private",
    aiPrompts: "private",
    trace: "private",
  };
  const expected = { "confirm-trace-reset": "false" };
  assert.equal(store.set(values).ok, true);
  assert.deepEqual(store.snapshot(), expected);
  const restored = fakePreload({ reply: values });
  assert.deepEqual(Object.fromEntries(restored.data), expected);
  const captured = fakePreload();
  Object.entries(values).forEach(([key, value]) => captured.data.set(key, value));
  captured.tick();
  assert.deepEqual(captured.calls[1].value, expected);
  assert.deepEqual(captured.reads, ["confirm-trace-reset"]);
  for (const value of [true, false, null, 1, {}]) {
    store.set({ "confirm-trace-reset": value });
    assert.deepEqual(store.snapshot(), {});
    assert.equal(
      fakePreload({ reply: { "confirm-trace-reset": value } }).data.size,
      0,
    );
  }
});

test("private windows neither restore nor save display and reset confirmation preferences", () => {
  const run = fakePreload({
    href: origin + "/?no-persistence",
    reply: {
      "display-scale": "80",
      "theme-mode": "dark",
      "confirm-trace-reset": "true",
    },
    initial: {
      "display-scale": "120",
      "theme-mode": "light",
      "confirm-trace-reset": "false",
    },
  });
  run.tick();
  run.unload();
  assert.equal(run.data.get("display-scale"), "120");
  assert.equal(run.data.get("theme-mode"), "light");
  assert.equal(run.data.get("confirm-trace-reset"), "false");
  assert.deepEqual(run.calls, []);
});

test("rejects prototype names, inherited values, accessors, and coercion", (t) => {
  const { store } = fixture(t);
  const input = JSON.parse(
    '{"__proto__":{"polluted":true},"constructor":"x","prototype":"x","language":"en"}',
  );
  Object.defineProperty(input, "getterOptions", {
    enumerable: true,
    get() {
      assert.fail("must not execute an untrusted getter");
    },
  });
  Object.defineProperty(input, "aiSecret", {
    enumerable: true,
    get() {
      assert.fail("must not inspect private values");
    },
  });
  input.coercionOptions = { toString: () => assert.fail("must not coerce") };
  input.symbolOptions = Symbol("private");
  input.bigintOptions = 1n;
  assert.equal(store.set(input).ok, true);
  assert.deepEqual(store.snapshot(), { language: "en" });
  assert.equal({}.polluted, undefined);
  const nullPrototype = Object.create(null);
  nullPrototype.language = "zh-CN";
  nullPrototype.__proto__ = "private";
  assert.equal(store.set(nullPrototype).ok, true);
  assert.deepEqual(store.snapshot(), { language: "zh-CN" });
});

test("invalid root snapshots are rejected without deleting cached data", (t) => {
  warnings(t);
  const { store } = fixture(t);
  store.set({ language: "en" });
  for (const value of [
    undefined,
    null,
    '{"language":"zh-CN"}',
    1,
    false,
    [],
    new Date(),
    Object.create({ language: "zh-CN" }),
    new Proxy(
      {},
      {
        getPrototypeOf: () => {
          throw new Error("untrusted");
        },
      },
    ),
  ]) {
    assert.equal(store.set(value).ok, false);
    assert.deepEqual(store.snapshot(), { language: "en" });
  }
});

test("enforces UTF-8 key/value, key-count, and exact serialized-size limits", (t) => {
  const { store, file } = fixture(t);
  const maxKey = "treeView" + "x".repeat(limits.keyBytes - 8);
  const input = {
    [maxKey]: "yes",
    [maxKey + "x"]: "no",
    ["treeView" + "\u00e9".repeat(125)]: "no",
    savedSearches: "x".repeat(limits.valueBytes),
    largeOptions: "x".repeat(limits.valueBytes + 1),
    unicodeOptions: "\u00e9".repeat(limits.valueBytes / 2 + 1),
    unicodeAtLimitOptions: "\u00e9".repeat(limits.valueBytes / 2),
  };
  assert.equal(store.set(input).ok, true);
  assert.equal(store.snapshot()[maxKey], "yes");
  assert.equal(store.snapshot().savedSearches.length, limits.valueBytes);
  assert.equal(
    Buffer.byteLength(store.snapshot().unicodeAtLimitOptions),
    limits.valueBytes,
  );
  assert.equal(Object.keys(store.snapshot()).length, 3);

  const many = Object.fromEntries(
    Array.from({ length: limits.keys + 20 }, (_, i) => [
      `treeView${String(i).padStart(3, "0")}`,
      "true",
    ]),
  );
  store.set(many);
  assert.equal(Object.keys(store.snapshot()).length, limits.keys);
  const large = Object.fromEntries(
    Array.from({ length: 20 }, (_, i) => [
      `treeView${i}`,
      "x".repeat(limits.valueBytes),
    ]),
  );
  large.language = "en";
  store.set(large);
  assert.ok(fs.statSync(file).size <= limits.totalBytes);
  assert.equal(Object.keys(store.snapshot()).length, 4);
  assert.deepEqual(new PreferenceStore(file).snapshot(), store.snapshot());
  store.set({ savedSearches: "\u0000".repeat(limits.valueBytes) });
  assert.deepEqual(
    store.snapshot(),
    {},
    "JSON escaping also counts toward total size",
  );
});

test("replaces snapshots including deletions and writes atomically at 0600", (t) => {
  const { store, file } = fixture(t);
  store.set({ language: "en", "dark-mode": "true" });
  if (process.platform === "win32") {
    // Windows rejects replacing a file that a reader still holds open, so the
    // open-reader proof is only asserted on POSIX hosts.
    assert.equal(store.set({ language: "zh-CN" }).ok, true);
  } else {
    const oldFile = fs.openSync(file, "r");
    t.after(() => fs.closeSync(oldFile));
    assert.equal(store.set({ language: "zh-CN" }).ok, true);
    assert.deepEqual(
      JSON.parse(fs.readFileSync(oldFile, "utf8")),
      {
        "dark-mode": "true",
        language: "en",
      },
      "an open reader retains the complete old file after replacement",
    );
  }
  assert.deepEqual(new PreferenceStore(file).snapshot(), { language: "zh-CN" });
  if (process.platform !== "win32")
    assert.equal(fs.statSync(file).mode & 0o777, 0o600);
  assert.deepEqual(fs.readdirSync(path.dirname(file)), ["preferences.json"]);
  assert.equal(store.set({}).ok, true);
  assert.deepEqual(new PreferenceStore(file).snapshot(), {});
});

test("an unchanged set still normalizes the disk and tightens file permissions", (t) => {
  const { file } = fixture(t);
  fs.mkdirSync(path.dirname(file));
  fs.writeFileSync(file, '{"language":"en","aiPrompts":"private"}', {
    mode: 0o644,
  });
  const store = new PreferenceStore(file);
  assert.equal(store.set(store.snapshot()).ok, true);
  assert.deepEqual(JSON.parse(fs.readFileSync(file, "utf8")), {
    language: "en",
  });
  if (process.platform !== "win32")
    assert.equal(fs.statSync(file).mode & 0o777, 0o600);
  const open = t.mock.method(fs, "openSync", () =>
    assert.fail("snapshot must not touch disk"),
  );
  assert.deepEqual(store.snapshot(), { language: "en" });
  open.mock.restore();
});

test("load is normalized, bounded, and limited to the explicit file", (t) => {
  warnings(t);
  const { file } = fixture(t);
  fs.mkdirSync(path.dirname(file));
  fs.writeFileSync(
    file,
    '{"language":"en","trace":"secret","badOptions":false}',
  );
  assert.deepEqual(new PreferenceStore(file).snapshot(), { language: "en" });
  fs.writeFileSync(file + ".backup", '{"language":"do-not-read-backups"}');
  fs.writeFileSync(file, "{");
  const corrupted = new PreferenceStore(file);
  assert.deepEqual(corrupted.snapshot(), {});
  assert.equal(corrupted.lastError.code, "INVALID_JSON");
  assert.equal(corrupted.set({ language: "en" }).ok, true);
  assert.equal(corrupted.lastError, null);
  assert.deepEqual(new PreferenceStore(file).snapshot(), { language: "en" });
  for (const invalid of [
    "null",
    "[]",
    '"string"',
    Buffer.from([0xff]),
    Buffer.alloc(limits.totalBytes + 1),
  ]) {
    fs.writeFileSync(file, invalid);
    const invalidStore = new PreferenceStore(file);
    assert.deepEqual(invalidStore.snapshot(), {});
    assert.ok(invalidStore.lastError);
  }
  fs.unlinkSync(file);
  assert.deepEqual(new PreferenceStore(file).snapshot(), {});
  fs.mkdirSync(file);
  assert.equal(new PreferenceStore(file).lastError.code, "INVALID_FILE");
});

test(
  "does not follow a preference-file symlink",
  { skip: process.platform === "win32" },
  (t) => {
    warnings(t);
    const { directory, file } = fixture(t);
    fs.mkdirSync(path.dirname(file));
    const other = path.join(directory, "private.json");
    fs.writeFileSync(other, '{"language":"private"}');
    fs.symlinkSync(other, file);
    const store = new PreferenceStore(file);
    assert.deepEqual(store.snapshot(), {});
    assert.equal(store.lastError.code, "INVALID_FILE");
    assert.equal(store.set({ language: "en" }).ok, true);
    assert.equal(fs.readFileSync(other, "utf8"), '{"language":"private"}');
    assert.equal(fs.lstatSync(file).isSymbolicLink(), false);
  },
);

test("blocked disk operations are cached locally and do not break startup", (t) => {
  const messages = warnings(t);
  const { store, file } = fixture(t);
  store.set({ language: "en" });
  const originalFile = fs.readFileSync(file, "utf8");
  const rename = t.mock.method(fs, "renameSync", () => {
    const error = new Error("secret/path/private prompt");
    error.code = "EACCES";
    throw error;
  });
  assert.deepEqual(store.set({ language: "zh-CN" }), {
    ok: false,
    error: { operation: "save", code: "EACCES" },
  });
  assert.deepEqual(store.snapshot(), { language: "zh-CN" });
  assert.equal(fs.readFileSync(file, "utf8"), originalFile);
  assert.deepEqual(fs.readdirSync(path.dirname(file)), ["preferences.json"]);
  assert.ok(messages.every((text) => !text.includes("secret")));
  rename.mock.restore();
  assert.equal(
    store.set(store.snapshot()).ok,
    true,
    "failed writes can be retried",
  );
  assert.equal(store.lastError, null);
  const lstat = t.mock.method(fs, "lstatSync", () => {
    throw Object.assign(new Error("secret"), { code: "EACCES" });
  });
  let blocked;
  assert.doesNotThrow(() => {
    blocked = new PreferenceStore(file);
  });
  assert.deepEqual(blocked.snapshot(), {});
  assert.deepEqual(blocked.lastError, { operation: "load", code: "EACCES" });
  lstat.mock.restore();
});

function trustedEvent(url = origin + "/") {
  const frame = { url, origin, parent: null, isDestroyed: () => false };
  const contents = { mainFrame: frame, isDestroyed: () => false };
  return { frame, contents, event: { sender: contents, senderFrame: frame } };
}

test("sender helper requires the exact live window, main frame, and loopback origin", () => {
  const { frame, contents, event } = trustedEvent();
  assert.equal(isTrustedPreferenceSender(event, contents, origin), true);
  assert.equal(isTrustedPreferenceSender(event, undefined, origin), false);
  assert.equal(isTrustedPreferenceSender(null, contents, origin), false);
  assert.equal(
    isTrustedPreferenceSender({ ...event, sender: {} }, contents, origin),
    false,
  );
  assert.equal(
    isTrustedPreferenceSender(
      { ...event, senderFrame: null },
      contents,
      origin,
    ),
    false,
  );
  assert.equal(
    isTrustedPreferenceSender(
      { ...event, senderFrame: { ...frame } },
      contents,
      origin,
    ),
    false,
  );
  assert.equal(
    isTrustedPreferenceSender(event, { ...contents }, origin),
    false,
  );
  contents.isDestroyed = () => true;
  assert.equal(isTrustedPreferenceSender(event, contents, origin), false);
  contents.isDestroyed = () => false;
  frame.isDestroyed = () => true;
  assert.equal(isTrustedPreferenceSender(event, contents, origin), false);
  frame.isDestroyed = () => false;
  frame.parent = {};
  assert.equal(isTrustedPreferenceSender(event, contents, origin), false);
  frame.parent = null;
  frame.origin = "null";
  assert.equal(isTrustedPreferenceSender(event, contents, origin), false);
});

test("sender helper fails closed on wrong URLs, private mode, and missing frame evidence", () => {
  for (const url of [
    "about:blank",
    "blob:" + origin + "/document",
    "file:///index.html",
    "https://example.com/",
    "http://127.0.0.1:43128/",
    "http://localhost:43127/",
    "http://127.0.0.1:43127.evil.test/",
    "http://user:secret@127.0.0.1:43127/",
    origin + "/?no-persistence",
    origin + "/?no-persistence=false",
    origin + "/?%6eo-persistence=",
    "not a URL",
  ]) {
    const { event, contents } = trustedEvent(url);
    assert.equal(
      isTrustedPreferenceSender(event, contents, origin),
      false,
      url,
    );
  }
  const { frame, event, contents } = trustedEvent();
  for (const badOrigin of [
    origin + "/",
    "http://localhost:43127",
    "http://127.0.0.1:65536",
    "null",
    undefined,
    {},
  ])
    assert.equal(isTrustedPreferenceSender(event, contents, badOrigin), false);
  delete frame.isDestroyed;
  assert.equal(isTrustedPreferenceSender(event, contents, origin), false);
  Object.defineProperty(contents, "mainFrame", {
    get() {
      throw new Error("detached");
    },
  });
  assert.equal(isTrustedPreferenceSender(event, contents, origin), false);
});

test("preload restores synchronously, removes stale allowed keys, and exposes no API", () => {
  const run = fakePreload({
    initial: {
      language: "en",
      oldOptions: "old",
      treeViewOld: "old",
      aiPrompts: "secret",
      token: "auth",
    },
    reply: {
      language: "zh-CN",
      "dark-mode": "true",
      aiPrompts: "never restore",
      invalidOptions: 1,
    },
  });
  assert.deepEqual(Object.fromEntries(run.data), {
    language: "zh-CN",
    "dark-mode": "true",
    aiPrompts: "secret",
    token: "auth",
  });
  assert.deepEqual(run.calls, [{ channel: "winscope:preferences:read" }]);
  assert.deepEqual(run.imports, ["electron"]);
  assert.equal(run.timers.length, 1);
  assert.equal(run.timers[0].milliseconds, 750);
  assert.ok(run.listeners.has("beforeunload"));
  assert.equal(run.window.electron, undefined);
  assert.equal(run.window.require, undefined);
  assert.equal(run.window.process, undefined);
  run.tick();
  assert.equal(run.calls.length, 1, "unchanged data does not write");
});

test("preload captures only allowlisted values, includes deletions, and saves on unload", () => {
  const run = fakePreload({ reply: { language: "en", "dark-mode": "true" } });
  run.data.delete("dark-mode");
  run.data.set("language", "zh-CN");
  for (const key of [
    "trace",
    "aiPrompts",
    "aiSessions",
    "token",
    "browserAuth",
  ])
    run.data.set(key, "private");
  run.tick();
  assert.deepEqual(run.calls[1], {
    channel: "winscope:preferences:write",
    value: { language: "zh-CN" },
  });
  assert.deepEqual(run.reads, ["language"]);
  run.data.delete("language");
  run.unload();
  assert.deepEqual(run.calls[2], {
    channel: "winscope:preferences:write",
    value: {},
  });
  run.unload();
  assert.equal(run.calls.length, 3);
});

test("preload and main normalization agree on bounds, malformed values, and prototype keys", (t) => {
  const { store } = fixture(t);
  const values = JSON.parse(
    '{"__proto__":"secret","constructor":"secret","prototype":"secret"}',
  );
  Object.assign(values, {
    language: "en",
    trace: "private",
    invalidOptions: 3,
    savedSearches: "\u0000".repeat(limits.valueBytes),
    unicodeOptions: "\u00e9".repeat(limits.valueBytes),
    ["treeView" + "x".repeat(limits.keyBytes)]: "oversize key",
  });
  for (let i = 0; i < limits.keys + 5; ++i) values[`treeView${i}`] = "x";
  store.set(values);
  const restored = fakePreload({ reply: values });
  assert.deepEqual(Object.fromEntries(restored.data), store.snapshot());
  const captured = fakePreload();
  Object.entries(values).forEach(([key, value]) =>
    captured.data.set(key, value),
  );
  captured.tick();
  assert.deepEqual(captured.calls[1].value, store.snapshot());
});

test("privacy mode, foreign URLs, and child frames perform no storage/IPC/timers", () => {
  for (const href of [
    origin + "/?no-persistence",
    origin + "/?no-persistence=",
    origin + "/?no-persistence=false",
    origin + "/?%6eo-persistence",
    "https://example.com/",
    "file:///index.html",
    "http://localhost:43127/",
    "http://user:secret@127.0.0.1:43127/",
    "about:blank",
    "blob:" + origin + "/document",
  ]) {
    const run = fakePreload({
      href,
      initial: { language: "en", "confirm-trace-reset": "false" },
      reply: { language: "zh-CN", "confirm-trace-reset": "true" },
      unavailable: true,
    });
    assert.deepEqual(run.calls, [], href);
    assert.deepEqual(run.reads, [], href);
    assert.equal(run.timers.length, 0, href);
    assert.equal(run.listeners.size, 0, href);
    assert.equal(run.data.get("language"), "en");
    assert.equal(run.data.get("confirm-trace-reset"), "false");
  }
  const child = fakePreload({ childFrame: true });
  assert.deepEqual(child.calls, []);
  const run = fakePreload();
  run.data.set("language", "en");
  run.data.set("confirm-trace-reset", "false");
  run.window.location.href = origin + "/?no-persistence";
  run.tick();
  run.unload();
  assert.equal(run.calls.length, 1, "privacy is rechecked before every write");
});

test("unavailable localStorage and malformed/failed reads cannot erase preferences", () => {
  const blocked = fakePreload({ unavailable: true });
  assert.deepEqual(blocked.calls, []);
  for (const reply of [undefined, null, [], "malformed", 3, false]) {
    const run = fakePreload({
      rawReply: reply === undefined ? () => {} : reply,
      initial: { language: "en" },
    });
    assert.equal(run.data.get("language"), "en");
    assert.equal(run.timers.length, 0);
    assert.equal(run.calls.length, 1);
  }
  const failed = fakePreload({ readFails: true, initial: { language: "en" } });
  assert.equal(failed.data.get("language"), "en");
  assert.equal(failed.timers.length, 0);
  const quota = fakePreload({
    restoreFails: true,
    reply: { language: "zh-CN" },
    initial: { language: "en" },
  });
  assert.equal(quota.data.get("language"), "en");
  assert.equal(
    quota.timers.length,
    0,
    "an incomplete restore must not overwrite disk",
  );
  const run = fakePreload({ reply: { language: "en" } });
  run.data.set("language", "zh-CN");
  run.failures.get = true;
  assert.doesNotThrow(run.tick);
  assert.equal(run.calls.length, 1);
  run.failures.get = false;
  run.failures.send = true;
  assert.doesNotThrow(run.unload);
  assert.equal(run.calls.length, 1);
  run.failures.send = false;
  run.tick();
  assert.deepEqual(run.calls[1].value, { language: "zh-CN" });
});

test("cached preferences survive different launcher ports and app directories", (t) => {
  const { file, store } = fixture(t);
  const first = fakePreload({ href: origin + "/", reply: store.snapshot() });
  first.data.set("language", "zh-CN");
  first.data.set("aiPrompts", "never persisted");
  first.unload();
  assert.equal(store.set(first.calls[1].value).ok, true);
  const updatedApp = new PreferenceStore(file);
  const second = fakePreload({
    href: "http://127.0.0.1:51234/",
    reply: updatedApp.snapshot(),
  });
  assert.deepEqual(Object.fromEntries(second.data), { language: "zh-CN" });
  assert.equal(
    JSON.stringify(updatedApp.snapshot()).includes("never persisted"),
    false,
  );
});
