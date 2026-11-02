"use strict";

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");
const vm = require("node:vm");

const preload = readFileSync(path.join(__dirname, "preload.cjs"), "utf8");
const origin = "http://127.0.0.1:43127";
const themeChannel = "winscope:window-theme";

function fakeChromePreload({
  platform = "darwin",
  electron = "42.0.0",
  href = origin + "/",
  childFrame = false,
  readyState = "loading",
  dark = false,
  storageFails = false,
  readFails = false,
  restoreFails = false,
} = {}) {
  const calls = [];
  const imports = [];
  const storageReads = [];
  const timeline = [];
  const timers = [];
  const observers = [];
  const documentListeners = new Map();
  const windowListeners = new Map();
  const classes = new Set(dark ? ["dark-mode"] : []);
  const storage = new Map();
  const addListener = (listeners) => (name, callback) => {
    const entries = listeners.get(name) ?? [];
    entries.push(callback);
    listeners.set(name, entries);
  };
  const dataset = new Proxy(
    {},
    {
      set(target, key, value) {
        timeline.push("marker:" + key);
        target[key] = value;
        return true;
      },
    },
  );
  const body = {
    classList: {
      contains: (name) => classes.has(name),
    },
  };
  const document = {
    documentElement: { dataset },
    body: readyState === "loading" ? null : body,
    readyState,
    addEventListener: addListener(documentListeners),
  };
  const window = {
    document,
    location: { href },
    addEventListener: addListener(windowListeners),
    setInterval(callback, milliseconds) {
      timers.push({ callback, milliseconds });
    },
  };
  window.top = childFrame ? {} : window;
  Object.defineProperty(window, "localStorage", {
    get() {
      timeline.push("storage");
      if (storageFails) throw new Error("Storage is unavailable");
      return {
        get length() {
          return storage.size;
        },
        key: (index) => [...storage.keys()][index] ?? null,
        getItem(key) {
          storageReads.push(key);
          return storage.get(key) ?? null;
        },
        setItem(key, value) {
          if (restoreFails) throw new Error("Storage quota exceeded");
          storage.set(key, value);
        },
        removeItem: (key) => storage.delete(key),
      };
    },
  });
  class MutationObserver {
    constructor(callback) {
      this.callback = callback;
      this.observations = [];
      observers.push(this);
    }
    observe(target, options) {
      this.observations.push({ target, options });
    }
    disconnect() {
      this.observations = [];
    }
  }
  const context = vm.createContext({
    window,
    document,
    MutationObserver,
    URL,
    TextEncoder,
    process: { platform, versions: { electron } },
  });
  context.reply = vm.runInContext('({ language: "en" })', context);
  context.require = (name) => {
    imports.push(name);
    assert.equal(name, "electron", "sandbox preload imports only electron");
    return {
      ipcRenderer: {
        sendSync(channel) {
          timeline.push(channel);
          calls.push({ channel });
          if (readFails) throw new Error("Read IPC failed");
          return context.reply;
        },
        send(channel, value) {
          timeline.push(channel);
          calls.push({ channel, value });
        },
      },
      get contextBridge() {
        assert.fail("Desktop chrome must not expose a renderer API");
      },
    };
  };
  assert.doesNotThrow(() => vm.runInContext(preload, context));
  const emit = (listeners, type) => {
    for (const callback of listeners.get(type) ?? []) callback({ type });
  };
  const notify = () => {
    for (const observer of observers) {
      if (observer.observations.some(({ target }) => target === body))
        observer.callback([
          { type: "attributes", attributeName: "class", target: body },
        ]);
    }
  };
  return {
    calls,
    imports,
    storageReads,
    timeline,
    timers,
    observers,
    document,
    window,
    body,
    dataset,
    themeCalls: () => calls.filter(({ channel }) => channel === themeChannel),
    preferenceCalls: () =>
      calls.filter(({ channel }) =>
        channel.startsWith("winscope:preferences:"),
      ),
    domReady() {
      document.body = body;
      document.readyState = "interactive";
      emit(documentListeners, "DOMContentLoaded");
      emit(windowListeners, "DOMContentLoaded");
    },
    setDark(enabled) {
      if (enabled) classes.add("dark-mode");
      else classes.delete("dark-mode");
      notify();
    },
    notify,
    tick: () => timers.forEach(({ callback }) => callback()),
    unload: () => emit(windowListeners, "beforeunload"),
  };
}

for (const platform of ["darwin", "win32", "linux"]) {
  test(`${platform}: desktop marker is synchronous, precedes preferences, and exposes no API`, () => {
    const run = fakeChromePreload({ platform });
    assert.equal(run.dataset.winscopeDesktop, platform);
    assert.ok(run.imports.length > 0);
    assert.deepEqual(Object.keys(run.dataset), ["winscopeDesktop"]);
    assert.deepEqual(Object.keys(run.window).sort(), [
      "addEventListener",
      "document",
      "location",
      "setInterval",
      "top",
    ]);
    const marker = run.timeline.indexOf("marker:winscopeDesktop");
    const preferences = run.timeline.indexOf("winscope:preferences:read");
    assert.ok(marker >= 0);
    assert.ok(
      preferences > marker,
      "desktop setup must precede preference IPC",
    );
  });
}

test("DOMContentLoaded sends a boolean body theme and observes class changes with deduplication", () => {
  const run = fakeChromePreload();
  run.domReady();
  assert.deepEqual(run.themeCalls(), [{ channel: themeChannel, value: false }]);
  const bodyObservers = run.observers
    .flatMap(({ observations }) => observations)
    .filter(({ target }) => target === run.body);
  assert.ok(bodyObservers.some(({ options }) => options.attributes === true));
  run.notify();
  run.setDark(false);
  assert.equal(run.themeCalls().length, 1);
  run.setDark(true);
  run.setDark(true);
  run.notify();
  run.setDark(false);
  assert.deepEqual(run.themeCalls(), [
    { channel: themeChannel, value: false },
    { channel: themeChannel, value: true },
    { channel: themeChannel, value: false },
  ]);
  assert.ok(run.themeCalls().every(({ value }) => typeof value === "boolean"));
});

test("an already-loaded dark document publishes its initial theme without waiting for an event", () => {
  for (const readyState of ["interactive", "complete"]) {
    const run = fakeChromePreload({ readyState, dark: true });
    assert.deepEqual(run.themeCalls(), [
      { channel: themeChannel, value: true },
    ]);
    run.setDark(false);
    assert.deepEqual(
      run.themeCalls().map(({ value }) => value),
      [true, false],
    );
  }
});

test("privacy URLs keep desktop chrome and theme IPC but perform no preference work", () => {
  for (const query of [
    "?no-persistence",
    "?no-persistence=",
    "?no-persistence=false",
    "?%6eo-persistence=",
  ]) {
    const run = fakeChromePreload({
      href: origin + "/" + query,
      storageFails: true,
    });
    assert.equal(run.dataset.winscopeDesktop, "darwin", query);
    run.domReady();
    run.setDark(true);
    run.tick();
    run.unload();
    assert.deepEqual(
      run.themeCalls().map(({ value }) => value),
      [false, true],
      query,
    );
    assert.deepEqual(run.preferenceCalls(), [], query);
    assert.deepEqual(run.storageReads, [], query);
    assert.equal(run.timeline.includes("storage"), false, query);
    assert.equal(run.timers.length, 0, query);
  }
});

test("blocked storage, failed preference reads, and quota errors do not disable chrome", () => {
  for (const failures of [
    { storageFails: true },
    { readFails: true },
    { restoreFails: true },
  ]) {
    const run = fakeChromePreload(failures);
    assert.equal(run.dataset.winscopeDesktop, "darwin");
    run.domReady();
    run.setDark(true);
    assert.deepEqual(
      run.themeCalls().map(({ value }) => value),
      [false, true],
    );
    assert.equal(
      run.timers.length,
      0,
      "failed preference setup must stay disabled",
    );
    run.tick();
    run.unload();
    assert.equal(
      run.preferenceCalls().some(({ channel }) => channel.endsWith(":write")),
      false,
    );
  }
});

test("foreign, credentialed, malformed, and non-HTTP URLs get no marker or IPC", () => {
  for (const href of [
    "https://example.com/",
    "https://127.0.0.1:43127/",
    "http://localhost:43127/",
    "http://127.0.0.2:43127/",
    "http://127.0.0.1:0/",
    "http://127.0.0.1:65536/",
    "http://127.0.0.1:43127.evil.test/",
    "http://user:secret@127.0.0.1:43127/",
    "file:///index.html",
    "about:blank",
    "blob:" + origin + "/document",
    "not a URL",
  ]) {
    const run = fakeChromePreload({ href, storageFails: true });
    run.domReady();
    run.setDark(true);
    assert.equal(run.dataset.winscopeDesktop, undefined, href);
    assert.deepEqual(run.calls, [], href);
    assert.equal(run.observers.length, 0, href);
    assert.equal(run.timers.length, 0, href);
    assert.equal(run.timeline.includes("storage"), false, href);
  }
});

test("a same-origin child frame gets no desktop marker, theme observer, or IPC", () => {
  const run = fakeChromePreload({ childFrame: true, storageFails: true });
  run.domReady();
  run.setDark(true);
  assert.equal(run.dataset.winscopeDesktop, undefined);
  assert.deepEqual(run.calls, []);
  assert.equal(run.observers.length, 0);
  assert.equal(run.timers.length, 0);
  assert.equal(run.timeline.includes("storage"), false);
});

test("unsupported or malformed platforms never enable desktop chrome", () => {
  for (const platform of [
    "freebsd",
    "Darwin",
    "windows",
    "",
    "__proto__",
    null,
    42,
    {},
  ]) {
    const run = fakeChromePreload({ platform });
    run.domReady();
    run.setDark(true);
    assert.equal(run.dataset.winscopeDesktop, undefined, String(platform));
    assert.deepEqual(run.themeCalls(), [], String(platform));
    assert.equal(run.observers.length, 0, String(platform));
  }
});

test("non-Electron preload contexts never enable the desktop marker or theme channel", () => {
  for (const electron of ["", null, false, 0]) {
    const run = fakeChromePreload({ electron });
    run.domReady();
    run.setDark(true);
    assert.equal(run.dataset.winscopeDesktop, undefined);
    assert.deepEqual(run.themeCalls(), []);
    assert.equal(run.observers.length, 0);
  }
});
