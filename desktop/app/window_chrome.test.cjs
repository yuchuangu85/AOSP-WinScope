"use strict";

const assert = require("node:assert/strict");
const { EventEmitter } = require("node:events");
const { test } = require("node:test");
const {
  windowChromeOptions,
  installWindowShortcuts,
  updateWindowTheme,
} = require("./window_chrome.cjs");

const origin = "http://127.0.0.1:43127";
const platforms = ["darwin", "win32", "linux"];
const overlay = (dark) => ({
  height: 32,
  color: "#00000000",
  symbolColor: dark ? "#ffffff" : "#222222",
});

function shortcutWindow(t, platform) {
  const actions = [];
  let zoomLevel = 2;
  const contents = new EventEmitter();
  for (const action of [
    "reload",
    "copy",
    "cut",
    "paste",
    "pasteAndMatchStyle",
    "selectAll",
    "undo",
    "redo",
  ])
    contents[action] = t.mock.fn(() => actions.push(action));
  contents.getZoomLevel = () => zoomLevel;
  contents.setZoomLevel = t.mock.fn((level) => {
    zoomLevel = level;
    actions.push("zoom");
  });
  contents.getZoomFactor = () => 1.2 ** zoomLevel;
  contents.setZoomFactor = t.mock.fn((factor) => {
    zoomLevel = Math.log(factor) / Math.log(1.2);
    actions.push("zoom");
  });
  contents.isDestroyed = () => false;
  const win = {
    webContents: contents,
    isDestroyed: () => false,
    close: t.mock.fn(() => actions.push("close")),
  };
  const quit = t.mock.fn(() => actions.push("quit"));
  const openTrace = t.mock.fn(() => actions.push("openTrace"));
  return {
    win,
    contents,
    actions,
    quit,
    openTrace,
    zoom: () => zoomLevel,
    dispatch(key, overrides = {}) {
      const event = { preventDefault: t.mock.fn() };
      contents.emit("before-input-event", event, {
        type: "keyDown",
        key,
        meta: platform === "darwin",
        control: platform !== "darwin",
        alt: false,
        shift: false,
        isComposing: false,
        ...overrides,
      });
      return event.preventDefault.mock.callCount();
    },
  };
}

function themeWindow(t, url = origin + "/") {
  const frame = { url, origin, parent: null, isDestroyed: () => false };
  const contents = { mainFrame: frame, isDestroyed: () => false };
  const win = {
    webContents: contents,
    isDestroyed: () => false,
    setTitleBarOverlay: t.mock.fn(),
  };
  return {
    win,
    contents,
    frame,
    event: { sender: contents, senderFrame: frame },
  };
}

test("macOS chrome has a hidden titlebar and exact traffic-light offsets", () => {
  const expected = {
    titleBarStyle: "hidden",
    trafficLightPosition: { x: 12, y: 9 },
  };
  assert.deepEqual(
    windowChromeOptions(),
    windowChromeOptions(process.platform),
  );
  for (const dark of [false, true])
    assert.deepEqual(windowChromeOptions("darwin", dark), expected);
});

test("Windows/Linux chrome has an exact transparent 32px theme-aware overlay", () => {
  for (const platform of ["win32", "linux"]) {
    assert.deepEqual(windowChromeOptions(platform), {
      titleBarStyle: "hidden",
      titleBarOverlay: overlay(false),
    });
    for (const dark of [false, true])
      assert.deepEqual(windowChromeOptions(platform, dark), {
        titleBarStyle: "hidden",
        titleBarOverlay: overlay(dark),
      });
  }
});

test("unsupported chrome platforms are rejected", () => {
  for (const platform of [
    "freebsd",
    "windows",
    "Darwin",
    "",
    "__proto__",
    null,
    {},
  ])
    assert.throws(() => windowChromeOptions(platform), String(platform));
});

for (const platform of platforms) {
  test(`${platform}: focused shortcuts dispatch once and prevent the default`, (t) => {
    const cases = [
      ["q", {}, "quit"],
      ["w", {}, "close"],
      ["o", {}, "openTrace"],
      ["r", {}, "reload"],
      ["c", {}, "copy"],
      ["x", {}, "cut"],
      ["v", {}, "paste"],
      ["V", { shift: true }, "pasteAndMatchStyle"],
      ["a", {}, "selectAll"],
      ["z", {}, "undo"],
      ["Z", { shift: true }, "redo"],
    ];
    if (platform !== "darwin") cases.push(["y", {}, "redo"]);
    for (const [key, modifiers, action] of cases) {
      const run = shortcutWindow(t, platform);
      const cleanup = installWindowShortcuts(run.win, {
        platform,
        quit: run.quit,
        openTrace: run.openTrace,
      });
      assert.equal(run.dispatch(key, modifiers), 1, key);
      assert.deepEqual(run.actions, [action], key);
      cleanup();
    }
  });

  test(`${platform}: zoom reset/in/out work without assuming a zoom increment`, (t) => {
    for (const [key, modifiers, direction] of [
      ["0", {}, "reset"],
      ["=", {}, "in"],
      ["+", { shift: true }, "in"],
      ["-", {}, "out"],
    ]) {
      const run = shortcutWindow(t, platform);
      const cleanup = installWindowShortcuts(run.win, {
        platform,
        quit: run.quit,
        openTrace: run.openTrace,
      });
      const before = run.zoom();
      assert.equal(run.dispatch(key, modifiers), 1, key);
      assert.deepEqual(run.actions, ["zoom"], key);
      if (direction === "reset") assert.equal(run.zoom(), 0);
      if (direction === "in") assert.ok(run.zoom() > before);
      if (direction === "out") assert.ok(run.zoom() < before);
      cleanup();
    }
  });

  test(`${platform}: ordinary, Alt, IME, and key-up input remain untouched`, (t) => {
    const run = shortcutWindow(t, platform);
    const cleanup = installWindowShortcuts(run.win, {
      platform,
      quit: run.quit,
      openTrace: run.openTrace,
    });
    const blocked = [
      ["q", { meta: false, control: false }],
      ["q", { meta: platform !== "darwin", control: platform === "darwin" }],
      ["q", { alt: true }],
      ["q", { isComposing: true }],
      ["q", { type: "keyUp" }],
      ["q", { type: "char" }],
      ["p", {}],
      ["F12", {}],
      ["Escape", {}],
      ["1", {}],
      ["__proto__", {}],
      ["constructor", {}],
      ["toString", {}],
    ];
    if (platform === "darwin") blocked.push(["y", {}]);
    for (const [key, modifiers] of blocked)
      assert.equal(
        run.dispatch(key, modifiers),
        0,
        JSON.stringify([key, modifiers]),
      );
    assert.deepEqual(run.actions, []);
    assert.equal(run.zoom(), 2);
    cleanup();
  });
}

test("shortcut cleanup removes only its own listener and is safe to repeat", (t) => {
  const run = shortcutWindow(t, "darwin");
  const unrelated = t.mock.fn();
  run.contents.on("before-input-event", unrelated);
  const cleanup = installWindowShortcuts(run.win, {
    platform: "darwin",
    quit: run.quit,
    openTrace: run.openTrace,
  });
  assert.equal(typeof cleanup, "function");
  assert.equal(run.contents.listenerCount("before-input-event"), 2);
  cleanup();
  assert.doesNotThrow(cleanup);
  assert.deepEqual(run.contents.listeners("before-input-event"), [unrelated]);
  assert.equal(run.dispatch("q"), 0);
  assert.deepEqual(run.actions, []);
  assert.equal(unrelated.mock.callCount(), 1);
});

test("shortcuts default to the actual process platform", (t) => {
  const run = shortcutWindow(t, process.platform);
  const cleanup = installWindowShortcuts(run.win, {
    quit: run.quit,
    openTrace: run.openTrace,
  });
  assert.equal(run.dispatch("q"), 1);
  assert.deepEqual(run.actions, ["quit"]);
  cleanup();
});

test("trusted Windows/Linux theme updates return true and set only exact overlay values", (t) => {
  for (const platform of ["win32", "linux"]) {
    for (const dark of [false, true]) {
      const { event, win } = themeWindow(t);
      assert.equal(updateWindowTheme(event, win, origin, dark, platform), true);
      assert.equal(win.setTitleBarOverlay.mock.callCount(), 1);
      assert.deepEqual(win.setTitleBarOverlay.mock.calls[0].arguments, [
        overlay(dark),
      ]);
    }
  }
});

test("macOS theme updates return false without an overlay and platform defaults to the host", (t) => {
  for (const dark of [false, true]) {
    const { event, win } = themeWindow(t);
    assert.equal(updateWindowTheme(event, win, origin, dark, "darwin"), false);
    assert.equal(win.setTitleBarOverlay.mock.callCount(), 0);
    const accepted = updateWindowTheme(event, win, origin, dark);
    assert.equal(
      accepted,
      process.platform === "win32" || process.platform === "linux",
    );
    assert.equal(win.setTitleBarOverlay.mock.callCount(), accepted ? 1 : 0);
  }
});

test("theme IPC accepts privacy URLs because visual updates do not persist preferences", (t) => {
  for (const query of [
    "?no-persistence",
    "?no-persistence=false",
    "?%6eo-persistence=",
  ]) {
    for (const platform of ["win32", "linux"]) {
      const { event, win } = themeWindow(t, origin + "/" + query);
      assert.equal(
        updateWindowTheme(event, win, origin, true, platform),
        true,
        query,
      );
      assert.equal(win.setTitleBarOverlay.mock.callCount(), 1);
    }
  }
});

test("theme IPC rejects non-boolean and renderer-supplied platform payloads", (t) => {
  for (const dark of [
    undefined,
    null,
    0,
    1,
    "true",
    "false",
    [],
    {},
    { dark: true, platform: "linux" },
  ]) {
    const { event, win } = themeWindow(t);
    assert.equal(updateWindowTheme(event, win, origin, dark, "linux"), false);
    assert.equal(win.setTitleBarOverlay.mock.callCount(), 0);
  }
});

test("theme IPC requires the exact live window contents and main frame", (t) => {
  const invalid = [
    (run) => {
      run.event = null;
    },
    (run) => {
      run.win = null;
    },
    (run) => {
      run.win.isDestroyed = () => true;
    },
    (run) => {
      run.win.webContents = null;
    },
    (run) => {
      run.event.sender = { ...run.contents };
    },
    (run) => {
      run.event.senderFrame = { ...run.frame };
    },
    (run) => {
      run.event.senderFrame = null;
    },
    (run) => {
      run.contents.isDestroyed = () => true;
    },
    (run) => {
      run.frame.isDestroyed = () => true;
    },
    (run) => {
      run.frame.parent = {};
    },
    (run) => {
      run.frame.origin = "null";
    },
    (run) => {
      delete run.frame.isDestroyed;
    },
    (run) => {
      Object.defineProperty(run.contents, "mainFrame", {
        get() {
          throw new Error("Detached frame");
        },
      });
    },
  ];
  for (const invalidate of invalid) {
    const run = themeWindow(t);
    const setOverlay = run.win.setTitleBarOverlay;
    invalidate(run);
    assert.equal(
      updateWindowTheme(run.event, run.win, origin, true, "linux"),
      false,
    );
    assert.equal(setOverlay.mock.callCount(), 0);
  }
});

test("theme IPC rejects foreign, credentialed, malformed, and non-HTTP frame URLs", (t) => {
  for (const url of [
    "about:blank",
    "blob:" + origin + "/document",
    "file:///index.html",
    "https://127.0.0.1:43127/",
    "https://example.com/",
    "http://localhost:43127/",
    "http://127.0.0.1:43128/",
    "http://127.0.0.1:43127.evil.test/",
    "http://user:secret@127.0.0.1:43127/",
    "not a URL",
  ]) {
    const { event, win } = themeWindow(t, url);
    assert.equal(
      updateWindowTheme(event, win, origin, true, "win32"),
      false,
      url,
    );
    assert.equal(win.setTitleBarOverlay.mock.callCount(), 0, url);
  }
});

test("theme IPC rejects a non-canonical or non-loopback trusted origin", (t) => {
  for (const badOrigin of [
    undefined,
    null,
    {},
    "null",
    origin + "/",
    origin + "/?no-persistence",
    "http://localhost:43127",
    "http://127.0.0.1:0",
    "http://127.0.0.1:65536",
    "https://127.0.0.1:43127",
    "http://user:secret@127.0.0.1:43127",
  ]) {
    const { event, win } = themeWindow(t);
    assert.equal(
      updateWindowTheme(event, win, badOrigin, false, "linux"),
      false,
    );
    assert.equal(win.setTitleBarOverlay.mock.callCount(), 0);
  }
});
