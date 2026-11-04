"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { EventEmitter } = require("node:events");
const { execFileSync } = require("node:child_process");
const { test } = require("node:test");
const { installFileMenu } = require("./file_menu.cjs");

const origin = "http://127.0.0.1:43127";
const chunkBytes = 4 * 1024 * 1024;

function deferred() {
  let resolve;
  const promise = new Promise((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

function fakeWindow() {
  const window = new EventEmitter();
  window.destroyed = false;
  window.isDestroyed = () => window.destroyed;
  const contents = new EventEmitter();
  contents.destroyed = false;
  contents.isDestroyed = () => contents.destroyed;
  contents.mainFrame = {
    isDestroyed: () => false,
    parent: null,
    origin,
    url: origin + "/",
  };
  contents.messages = [];
  contents.send = (channel, payload) =>
    contents.messages.push({ channel, payload });
  contents.executeJavaScript = () =>
    assert.fail("Native opening must not execute renderer code");
  window.webContents = contents;
  return window;
}

function fixture(t, options = {}) {
  const root =
    options.root ??
    fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()), "winscope-files-"));
  if (!options.root)
    t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const userData = options.userData ?? path.join(root, "userData");
  const historyPath =
    options.historyPath ?? path.join(userData, "recent-files.json");
  const ipcMain = new EventEmitter();
  const handlers = new Map();
  ipcMain.handle = (channel, callback) => {
    assert.equal(handlers.has(channel), false);
    handlers.set(channel, callback);
  };
  ipcMain.removeHandler = (channel) => handlers.delete(channel);
  const Menu = {
    current: null,
    buildFromTemplate: (template) => ({ items: template }),
    setApplicationMenu(menu) {
      this.current = menu;
    },
    getApplicationMenu() {
      return this.current;
    },
  };
  const app = {
    getPath(name) {
      assert.equal(name, "userData");
      return userData;
    },
    addRecentDocument: () => assert.fail("No OS recent documents"),
    clearRecentDocuments: () => assert.fail("No OS recent documents"),
  };
  const dialog = {
    calls: [],
    errors: [],
    next: { canceled: true, filePaths: [] },
    async showOpenDialog(window, options) {
      this.calls.push({ window, options });
      return this.next;
    },
    async showMessageBox(window, options) {
      this.errors.push({ window, options });
      return { response: 0 };
    },
  };
  const state = { window: fakeWindow() };
  const api = installFileMenu({
    app,
    Menu,
    dialog,
    ipcMain,
    getWindow: () => state.window,
    origin,
    historyPath,
    platform: options.platform ?? "linux",
  });
  t.after(() => api.dispose());
  const event = () => ({
    sender: state.window.webContents,
    senderFrame: state.window.webContents.mainFrame,
  });
  const send = (channel, payload, sender = event()) =>
    ipcMain.emit(`winscope:files:${channel}`, sender, payload);
  const ready = (value = {}) =>
    send("ready", {
      language: "en",
      persistence: true,
      ...value,
    });
  const read = (value, sender = event()) =>
    handlers.get("winscope:files:read")(sender, value);
  const items = () =>
    Menu.current.items.find((item) =>
      item.submenu?.some((entry) => entry.accelerator === "CmdOrCtrl+O"),
    ).submenu;
  const write = (name, content = name) => {
    const filePath = path.join(root, name);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content);
    return filePath;
  };
  const batch = () => state.window.webContents.messages.at(-1)?.payload;
  const choose = async (paths) => {
    dialog.next = { canceled: false, filePaths: paths };
    await api.open();
    return batch();
  };
  const history = () => JSON.parse(fs.readFileSync(historyPath, "utf8")).paths;
  const seed = (paths) => {
    fs.mkdirSync(userData, { recursive: true });
    fs.writeFileSync(historyPath, JSON.stringify({ version: 1, paths }));
  };
  return {
    root,
    userData,
    historyPath,
    ipcMain,
    handlers,
    Menu,
    app,
    dialog,
    state,
    api,
    event,
    send,
    ready,
    read,
    items,
    write,
    batch,
    choose,
    history,
    seed,
  };
}

test("menus stay gated until valid readiness; native platform and editing roles are preserved", async (t) => {
  for (const platform of ["darwin", "win32", "linux"]) {
    const f = fixture(t, { platform });
    assert.equal(f.items()[0].enabled, false);
    await f.items()[0].click();
    assert.equal(f.dialog.calls.length, 0);
    for (const value of [
      null,
      {},
      { language: "fr", persistence: true },
      { language: "en", persistence: 1 },
      { language: "en" },
    ]) {
      f.send("ready", value);
      assert.equal(f.items()[0].enabled, false);
    }
    f.ready();
    assert.equal(f.items()[0].enabled, true);
    assert.equal(f.items()[0].accelerator, "CmdOrCtrl+O");
    assert.equal(
      f.Menu.current.items.find((item) => item.id === "file-menu").label,
      "File",
    );
    assert.equal(f.items()[0].id, "open-file");
    assert.equal(f.items()[1].id, "open-recent");
    assert.equal(f.items()[3].id, "clear-recent");
    assert.equal(f.items()[1].enabled, false);
    assert.deepEqual(f.items()[1].submenu, []);
    assert.equal(f.items()[2].type, "separator");
    assert.equal(f.items()[4].role, "close");
    assert.equal(
      f.Menu.current.items.some((item) => item.role === "appMenu"),
      platform === "darwin",
    );
    const edit = f.Menu.current.items.find((item) => item.label === "Edit");
    for (const role of [
      "undo",
      "redo",
      "cut",
      "copy",
      "paste",
      "delete",
      "selectAll",
    ]) {
      assert.ok(edit.submenu.some((item) => item.role === role));
    }
    assert.equal(
      JSON.stringify(f.Menu.current).includes("toggleDevTools"),
      false,
    );
    await f.items()[0].click();
    assert.equal(f.dialog.calls.length, 1);
    assert.equal(f.dialog.calls[0].window, f.state.window);
    assert.deepEqual(f.dialog.calls[0].options.properties, [
      "openFile",
      "multiSelections",
      "dontAddToRecent",
    ]);
    assert.equal(f.items()[0].enabled, true, "cancel releases native opening");
    f.api.dispose();
  }
});

test("native multi-file selection sends only bounded metadata and a fresh UUID capability", async (t) => {
  const f = fixture(t);
  const first = f.write("one.trace", "first");
  const second = f.write("two.trace", "second");
  f.ready();
  const batch = await f.choose([first, second, first]);
  assert.match(
    batch.token,
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
  );
  assert.deepEqual(Object.keys(batch).sort(), ["files", "token"]);
  assert.deepEqual(
    batch.files,
    [first, second].map((entry) => ({
      name: path.basename(entry),
      size: fs.statSync(entry).size,
      lastModified: Math.trunc(fs.statSync(entry).mtimeMs),
    })),
  );
  assert.equal(
    f.state.window.webContents.messages[0].channel,
    "winscope:files:open",
  );
  assert.equal(JSON.stringify(batch).includes(f.root), false);
  assert.equal(
    fs.existsSync(f.historyPath),
    false,
    "selection is not parse success",
  );
  assert.equal(f.items()[0].enabled, false);
  await f.api.open();
  assert.equal(f.dialog.calls.length, 1, "a pending batch prevents overlap");
  f.send("complete", { token: batch.token, indexes: [1] });
  assert.deepEqual(f.history(), [second]);
  assert.equal(f.items()[0].enabled, true);
  await assert.rejects(
    f.read({ token: batch.token, index: 0, offset: 0 }),
    /File access denied/,
  );
  const next = await f.choose([first]);
  assert.notEqual(next.token, batch.token);
  f.send("complete", { token: next.token, indexes: [] });
  assert.deepEqual(
    f.history(),
    [second],
    "failed parsing cannot add a recent entry",
  );
});

test("reads are Uint8Array chunks of at most 4 MiB with exact offsets and EOF", async (t) => {
  const f = fixture(t);
  const content = Buffer.alloc(chunkBytes + 23, 0x61);
  content.fill(0x62, chunkBytes);
  const file = f.write("large.trace", content);
  f.ready();
  const { token } = await f.choose([file]);
  const first = await f.read({ token, index: 0, offset: 0 });
  assert.equal(first.constructor, Uint8Array);
  assert.equal(first.length, chunkBytes);
  assert.deepEqual(Buffer.from(first), content.subarray(0, chunkBytes));
  const tail = await f.read({ token, index: 0, offset: chunkBytes });
  assert.equal(tail.length, 23);
  assert.deepEqual(Buffer.from(tail), content.subarray(chunkBytes));
  const middle = await f.read({ token, index: 0, offset: 7 });
  assert.deepEqual(Buffer.from(middle), content.subarray(7, 7 + chunkBytes));
  assert.equal(
    (await f.read({ token, index: 0, offset: content.length })).length,
    0,
  );
});

test("read rejects arbitrary capabilities and malformed indexes/offsets without consuming a valid batch", async (t) => {
  const f = fixture(t);
  const file = f.write("authorized.trace", "public");
  const secret = f.write("not-selected.trace", "private");
  f.ready();
  const { token } = await f.choose([file]);
  const base = { token, index: 0, offset: 0 };
  const invalid = [
    null,
    {},
    { ...base, token: "arbitrary" },
    { ...base, token: file },
    { ...base, token: undefined },
  ];
  for (const index of [-1, 1, 0.5, "0", null, NaN, Infinity])
    invalid.push({ ...base, index });
  for (const offset of [
    -1,
    7,
    0.5,
    "0",
    null,
    NaN,
    Infinity,
    Number.MAX_SAFE_INTEGER + 1,
  ]) {
    invalid.push({ ...base, offset });
  }
  for (const request of invalid)
    await assert.rejects(f.read(request), /File access denied/);
  assert.equal(
    Buffer.from(await f.read({ ...base, path: secret })).toString(),
    "public",
  );
  f.send("complete", { token, indexes: [] });
  assert.equal(fs.existsSync(f.historyPath), false);
  await assert.rejects(f.read(base));
});

test("malformed completion cannot persist arbitrary indexes or revoke another batch", async (t) => {
  const f = fixture(t);
  const file = f.write("trace");
  f.ready();
  const { token } = await f.choose([file]);
  for (const value of [
    null,
    {},
    { token: "wrong", indexes: [0] },
    { token, indexes: "0" },
    { token, indexes: [-1] },
    { token, indexes: [1] },
    { token, indexes: ["0"] },
    { token, indexes: [0.5] },
    { token, indexes: [0, 0] },
  ]) {
    f.send("complete", value);
    assert.equal(fs.existsSync(f.historyPath), false);
    assert.equal(f.items()[0].enabled, false);
  }
  assert.equal(
    Buffer.from(await f.read({ token, index: 0, offset: 0 })).toString(),
    "trace",
  );
  f.send("complete", { token, indexes: [0] });
  assert.deepEqual(f.history(), [file]);
  f.send("complete", { token, indexes: [] });
  assert.deepEqual(f.history(), [file]);
});

test("language-only readiness refresh preserves a pending batch and updates translated menus", async (t) => {
  const f = fixture(t);
  const file = f.write("trace");
  f.ready();
  const { token } = await f.choose([file]);
  f.ready({ language: "zh-CN" });
  f.ready({ language: "zh-CN" });
  assert.equal(f.items()[0].label, "打开...");
  assert.equal(f.items()[0].id, "open-file");
  assert.equal(
    f.Menu.current.items.find((item) => item.id === "file-menu").label,
    "文件",
  );
  assert.equal(
    f.items()[0].enabled,
    false,
    "pending batch is not replaced by readiness refresh",
  );
  assert.equal(
    Buffer.from(await f.read({ token, index: 0, offset: 0 })).toString(),
    "trace",
  );
  f.send("complete", { token, indexes: [0] });
  assert.deepEqual(f.history(), [file]);
  assert.equal(f.items()[0].enabled, true);
});

test("language refresh during a native dialog preserves the operation and privacy does not revoke its batch", async (t) => {
  const f = fixture(t);
  const file = f.write("trace");
  const selected = deferred();
  f.ready();
  f.dialog.next = selected.promise;
  const opening = f.api.open();
  f.ready({ language: "zh-CN" });
  selected.resolve({ canceled: false, filePaths: [file] });
  await opening;
  const { token } = f.batch();
  f.ready({ language: "zh-CN", persistence: false });
  assert.equal(
    Buffer.from(await f.read({ token, index: 0, offset: 0 })).toString(),
    "trace",
  );
  f.send("complete", { token, indexes: [0] });
  assert.equal(fs.existsSync(f.historyPath), false);
  assert.equal(f.items()[0].enabled, true);
  assert.deepEqual(f.items()[1].submenu, []);
});

test("original-file MRU persists across restart, deduplicates full paths, and caps at twenty", async (t) => {
  const f = fixture(t);
  const paths = Array.from({ length: 30 }, (_, index) =>
    f.write(`${index}/same.trace`),
  );
  f.ready();
  f.send("remember", paths);
  assert.deepEqual(f.history(), paths.slice(0, 20));
  f.send("remember", [paths[25], paths[8], paths[25]]);
  const expected = [
    paths[25],
    paths[8],
    ...paths.slice(0, 20).filter((p) => p !== paths[8]),
  ].slice(0, 20);
  assert.deepEqual(f.history(), expected);
  assert.equal(f.items()[1].submenu.length, 20);
  assert.deepEqual(
    f.items()[1].submenu.map((entry) => entry.id),
    Array.from({ length: 20 }, (_, index) => `recent-file-${index}`),
  );
  assert.notEqual(f.items()[1].submenu[0].label, f.items()[1].submenu[1].label);
  if (process.platform !== "win32")
    assert.equal(fs.statSync(f.historyPath).mode & 0o777, 0o600);
  assert.deepEqual(fs.readdirSync(f.userData), ["recent-files.json"]);
  f.api.dispose();
  const restarted = fixture(t, { root: f.root });
  assert.deepEqual(
    restarted.items()[1].submenu,
    [],
    "history is lazy before ready",
  );
  restarted.ready();
  assert.deepEqual(
    restarted.items()[1].submenu.map((entry) => entry.label),
    expected,
  );
  await restarted.items()[1].submenu[0].click();
  assert.equal(
    restarted.dialog.calls.length,
    0,
    "recent opens do not invoke the picker",
  );
  assert.equal(
    Buffer.from(
      await restarted.read({
        token: restarted.batch().token,
        index: 0,
        offset: 0,
      }),
    ).toString(),
    "25/same.trace",
  );
  restarted.send("complete", { token: restarted.batch().token, indexes: [0] });
  assert.deepEqual(restarted.history(), expected);
});

test("remember validates the 64-path boundary and skips missing, symlinked, directory, and special files", (t) => {
  const f = fixture(t);
  const file = f.write("regular.trace");
  f.ready();
  for (const value of [
    null,
    {},
    file,
    [null],
    [42],
    ["relative.trace"],
    [file + "\0"],
    ["/" + "a".repeat(4096)],
    ["/" + "\u00e9".repeat(3000)],
    Array(65).fill(file),
  ]) {
    f.send("remember", value);
    assert.equal(fs.existsSync(f.historyPath), false);
  }
  const rejected = [path.join(f.root, "missing"), f.root];
  if (process.platform !== "win32") {
    const link = path.join(f.root, "link");
    fs.symlinkSync(file, link);
    const pipe = path.join(f.root, "pipe");
    execFileSync("mkfifo", [pipe]);
    rejected.push(link, pipe, "/dev/null");
  }
  f.send("remember", rejected);
  assert.equal(fs.existsSync(f.historyPath), false);
  f.send("remember", [...rejected, file]);
  assert.deepEqual(f.history(), [file]);
  const alias = path.join(f.root, "sub", "..", "regular.trace");
  f.send("remember", [alias, file]);
  assert.deepEqual(f.history(), [file]);
  f.send("remember", Array(64).fill(file));
  assert.deepEqual(f.history(), [file]);
});

test("all IPC rejects foreign contents, frames, origins, and destroyed senders", async (t) => {
  const f = fixture(t);
  const file = f.write("trace");
  const good = f.event();
  const frame = good.senderFrame;
  const invalid = [
    null,
    {},
    { ...good, sender: fakeWindow().webContents },
    { ...good, senderFrame: { ...frame } },
  ];
  for (const event of invalid) {
    f.send("ready", { language: "en", persistence: true }, event);
    assert.equal(f.items()[0].enabled, false);
  }
  f.ready();
  const { token } = await f.choose([file]);
  async function rejectAll(event) {
    f.send("ready", { language: "zh-CN", persistence: false }, event);
    f.send("remember", [file], event);
    f.send("complete", { token, indexes: [0] }, event);
    await assert.rejects(f.read({ token, index: 0, offset: 0 }, event));
    assert.equal(fs.existsSync(f.historyPath), false);
    assert.equal(f.items()[0].label, "Open...");
  }
  for (const event of invalid) await rejectAll(event);
  for (const change of [
    { origin: "https://evil.example", url: "https://evil.example/" },
    { url: "http://user:password@127.0.0.1:43127/" },
    { parent: {} },
    { isDestroyed: () => true },
  ]) {
    const saved = { ...frame };
    Object.assign(frame, change);
    await rejectAll(good);
    Object.assign(frame, saved);
  }
  good.sender.destroyed = true;
  await rejectAll(good);
  good.sender.destroyed = false;
  assert.equal(
    Buffer.from(await f.read({ token, index: 0, offset: 0 })).toString(),
    "trace",
  );
  f.send("complete", { token, indexes: [0] });
  assert.deepEqual(f.history(), [file]);
});

test("privacy disables/empties recent actions and performs no history reads or writes", async (t) => {
  const f = fixture(t);
  const saved = f.write("saved.trace");
  const selected = f.write("selected.trace");
  f.seed([saved]);
  const before = fs.readFileSync(f.historyPath);
  const historyCalls = [];
  for (const name of [
    "lstatSync",
    "realpathSync",
    "openSync",
    "mkdirSync",
    "renameSync",
    "writeFileSync",
  ]) {
    const original = fs[name];
    t.mock.method(fs, name, (...args) => {
      if (
        typeof args[0] === "string" &&
        (args[0] === f.userData || args[0].startsWith(f.userData + path.sep))
      ) {
        historyCalls.push({ name, target: args[0] });
      }
      return original(...args);
    });
  }
  assert.deepEqual(historyCalls, []);
  f.ready({ persistence: false });
  assert.deepEqual(historyCalls, []);
  assert.equal(
    f.items()[0].enabled,
    true,
    "private native opening remains usable",
  );
  assert.equal(f.items()[1].enabled, false);
  assert.deepEqual(f.items()[1].submenu, []);
  f.send("remember", [selected]);
  await f.items()[3].click();
  const { token } = await f.choose([selected]);
  assert.equal(
    Buffer.from(await f.read({ token, index: 0, offset: 0 })).toString(),
    "selected.trace",
  );
  f.send("complete", { token, indexes: [0] });
  assert.deepEqual(historyCalls, []);
  assert.deepEqual(fs.readFileSync(f.historyPath), before);
  f.ready({ persistence: true });
  assert.ok(historyCalls.some((call) => call.name === "openSync"));
  assert.equal(f.items()[1].submenu[0].label, saved);
  const staleClick = f.items()[1].submenu[0].click;
  historyCalls.length = 0;
  f.ready({ persistence: false });
  await staleClick();
  await f.items()[3].click();
  f.send("remember", [selected]);
  assert.deepEqual(historyCalls, []);
  assert.deepEqual(f.items()[1].submenu, []);
  assert.deepEqual(fs.readFileSync(f.historyPath), before);
});

test("privacy query permits native opening and reading but overrides requested persistence without history I/O", async (t) => {
  for (const query of [
    "?no-persistence",
    "?no-persistence=",
    "?no-persistence=false",
    "?%6eo-persistence",
  ]) {
    await t.test(query, async (t) => {
      const f = fixture(t);
      const saved = f.write("saved.trace");
      const selected = f.write("selected.trace", "private trace bytes");
      f.seed([saved]);
      const before = fs.readFileSync(f.historyPath);
      const historyCalls = [];
      for (const name of [
        "lstatSync",
        "realpathSync",
        "openSync",
        "readFileSync",
        "mkdirSync",
        "renameSync",
        "writeFileSync",
        "unlinkSync",
      ]) {
        const original = fs[name];
        t.mock.method(fs, name, (...args) => {
          if (
            typeof args[0] === "string" &&
            (args[0] === f.userData ||
              args[0].startsWith(f.userData + path.sep))
          ) {
            historyCalls.push({ name, target: args[0] });
          }
          return original(...args);
        });
      }
      f.state.window.webContents.mainFrame.url = origin + "/" + query;
      f.ready({ persistence: true });
      assert.equal(f.items()[0].enabled, true);
      assert.equal(f.items()[1].enabled, false);
      assert.deepEqual(f.items()[1].submenu, []);
      assert.equal(f.items()[3].enabled, false);
      f.send("remember", [selected]);
      f.items()[3].click();
      f.dialog.next = { canceled: false, filePaths: [selected] };
      await f.items()[0].click();
      const { token } = f.batch();
      assert.equal(
        Buffer.from(await f.read({ token, index: 0, offset: 0 })).toString(),
        "private trace bytes",
      );
      f.ready({ language: "zh-CN", persistence: true });
      assert.equal((await f.read({ token, index: 0, offset: 8 })).length, 11);
      f.send("complete", { token, indexes: [0] });
      await assert.rejects(f.read({ token, index: 0, offset: 0 }));
      assert.equal(f.items()[0].enabled, true);
      assert.deepEqual(f.items()[1].submenu, []);
      assert.deepEqual(
        historyCalls,
        [],
        "private URL must never inspect or update history",
      );
      t.mock.restoreAll();
      assert.deepEqual(fs.readFileSync(f.historyPath), before);
    });
  }
});

test("native readiness and missing-file errors follow the selected language without replacing the trace", async (t) => {
  const f = fixture(t);
  const missing = f.write("gone.trace");
  const retained = f.write("retained.trace");
  f.seed([missing, retained]);
  f.ready({ language: "zh-CN" });
  assert.equal(f.items()[0].label, "打开...");
  assert.equal(f.items()[1].label, "最近打开");
  assert.equal(f.items()[3].label, "清除最近记录");
  assert.equal(f.items()[4].label, "关闭");
  await f.api.open();
  assert.equal(f.dialog.calls[0].options.title, "打开跟踪文件");
  assert.equal(f.dialog.calls[0].options.buttonLabel, "打开...");
  fs.unlinkSync(missing);
  await f.items()[1].submenu[0].click();
  assert.deepEqual(f.history(), [retained]);
  assert.equal(f.state.window.webContents.messages.length, 0);
  assert.equal(f.dialog.errors.length, 1);
  assert.equal(f.dialog.errors[0].options.title, "无法打开跟踪文件");
  assert.match(f.dialog.errors[0].options.detail, /当前跟踪尚未被替换/);
  assert.equal(
    JSON.stringify(f.dialog.errors[0].options).includes(f.root),
    false,
  );
  assert.equal(f.items()[0].enabled, true);
  f.ready({ language: "en" });
  fs.unlinkSync(retained);
  await f.items()[1].submenu[0].click();
  assert.deepEqual(f.history(), []);
  assert.match(
    f.dialog.errors[1].options.detail,
    /current trace has not been replaced/,
  );
});

test("clear recent saves an empty snapshot and cannot be invoked before readiness or in privacy mode", (t) => {
  const f = fixture(t);
  const file = f.write("trace");
  f.seed([file]);
  f.items()[3].click();
  assert.deepEqual(f.history(), [file]);
  f.ready();
  const clear = f.items()[3].click;
  assert.equal(f.items()[3].enabled, true);
  clear();
  assert.deepEqual(f.history(), []);
  assert.equal(f.items()[3].enabled, false);
  f.api.dispose();
  const restarted = fixture(t, { root: f.root });
  restarted.ready();
  assert.deepEqual(restarted.items()[1].submenu, []);
});

test("changed size, mtime, inode, symlink, directory, and missing files revoke read capabilities", async (t) => {
  const cases = [
    ["size", (file) => fs.appendFileSync(file, "changed")],
    [
      "mtime",
      (file) => {
        const info = fs.statSync(file);
        fs.utimesSync(file, info.atime, new Date(info.mtimeMs + 5000));
      },
    ],
    [
      "replacement",
      (file) => {
        const info = fs.statSync(file);
        const replacement = file + ".other";
        fs.writeFileSync(replacement, "trace");
        fs.utimesSync(replacement, info.atime, info.mtime);
        fs.renameSync(replacement, file);
      },
    ],
    [
      "directory",
      (file) => {
        fs.unlinkSync(file);
        fs.mkdirSync(file);
      },
    ],
    ["missing", (file) => fs.unlinkSync(file)],
  ];
  if (process.platform !== "win32")
    cases.push([
      "symlink",
      (file) => {
        const other = file + ".other";
        fs.renameSync(file, other);
        fs.symlinkSync(other, file);
      },
    ]);
  for (const [name, change] of cases) {
    await t.test(name, async (t) => {
      const f = fixture(t);
      const file = f.write("trace", "trace");
      f.ready();
      const { token } = await f.choose([file]);
      change(file);
      await assert.rejects(
        f.read({ token, index: 0, offset: 0 }),
        /File access denied/,
      );
      await assert.rejects(f.read({ token, index: 0, offset: 0 }));
      f.send("complete", { token, indexes: [0] });
      assert.equal(fs.existsSync(f.historyPath), false);
      assert.equal(f.items()[0].enabled, true);
    });
  }
});

test("completion revalidates changed files even if the renderer reports success", async (t) => {
  const f = fixture(t);
  const file = f.write("trace");
  f.ready();
  const { token } = await f.choose([file]);
  fs.appendFileSync(file, "changed");
  f.send("complete", { token, indexes: [0] });
  assert.equal(fs.existsSync(f.historyPath), false);
  assert.equal(f.items()[0].enabled, true);
});

test("navigation revokes capabilities and readiness, ignores child-frame navigation, and accepts fresh readiness", async (t) => {
  const f = fixture(t);
  const file = f.write("trace");
  f.ready();
  const { token } = await f.choose([file]);
  f.state.window.webContents.emit(
    "did-start-navigation",
    {},
    origin + "/iframe",
    false,
    false,
  );
  assert.equal(
    Buffer.from(await f.read({ token, index: 0, offset: 0 })).toString(),
    "trace",
  );
  f.state.window.webContents.emit(
    "did-start-navigation",
    {},
    origin + "/",
    false,
    true,
  );
  assert.equal(f.items()[0].enabled, false);
  await assert.rejects(f.read({ token, index: 0, offset: 0 }));
  f.send("remember", [file]);
  f.send("complete", { token, indexes: [0] });
  await f.api.open();
  assert.equal(fs.existsSync(f.historyPath), false);
  assert.equal(f.dialog.calls.length, 1);
  f.ready();
  assert.equal(f.items()[0].enabled, true);
  await assert.rejects(f.read({ token, index: 0, offset: 0 }));
  f.state.window.webContents.emit("did-start-navigation", {
    isMainFrame: false,
  });
  assert.equal(f.items()[0].enabled, true);
  f.state.window.webContents.emit("did-start-navigation", {
    isMainFrame: true,
  });
  assert.equal(f.items()[0].enabled, false);
});

test("one native picker is allowed, and navigation during it discards its late result", async (t) => {
  const f = fixture(t);
  const file = f.write("trace");
  const selected = deferred();
  f.dialog.next = selected.promise;
  f.ready();
  const opening = f.api.open();
  await f.api.open();
  assert.equal(f.dialog.calls.length, 1);
  assert.equal(f.items()[0].enabled, false);
  f.state.window.webContents.emit(
    "did-start-navigation",
    {},
    origin + "/",
    false,
    true,
  );
  f.ready();
  await f.api.open();
  assert.equal(
    f.dialog.calls.length,
    1,
    "readiness does not overlap the previous native picker",
  );
  selected.resolve({ canceled: false, filePaths: [file] });
  await opening;
  assert.equal(f.state.window.webContents.messages.length, 0);
  assert.equal(f.items()[0].enabled, true);
  await f.choose([file]);
  assert.equal(f.state.window.webContents.messages.length, 1);
});

test("replacement windows must independently initialize and cannot use old tokens or senders", async (t) => {
  const f = fixture(t);
  const file = f.write("trace");
  f.ready();
  const { token } = await f.choose([file]);
  const oldEvent = f.event();
  const oldWindow = f.state.window;
  f.state.window = fakeWindow();
  await f.api.open();
  assert.equal(f.dialog.calls.length, 1);
  f.send("ready", { language: "en", persistence: true }, oldEvent);
  f.send("remember", [file], oldEvent);
  await assert.rejects(f.read({ token, index: 0, offset: 0 }, oldEvent));
  assert.equal(fs.existsSync(f.historyPath), false);
  assert.equal(oldWindow.webContents.listenerCount("did-start-navigation"), 0);
  f.ready();
  await assert.rejects(f.read({ token, index: 0, offset: 0 }));
  await f.choose([file]);
  assert.equal(f.state.window.webContents.messages.length, 1);
  assert.notEqual(f.batch().token, token);
});

test("replacement windows visibly disable actions before their own readiness", async (t) => {
  const f = fixture(t);
  f.ready();
  assert.equal(f.items()[0].enabled, true);
  f.state.window = fakeWindow();
  await f.api.open();
  assert.equal(f.items()[0].enabled, false);
  f.ready();
  assert.equal(f.items()[0].enabled, true);
});

test("disposal cannot attach lifecycle listeners to a later window", async (t) => {
  const f = fixture(t);
  f.api.dispose();
  f.state.window = fakeWindow();
  await f.api.open();
  assert.equal(
    f.state.window.webContents.listenerCount("did-start-navigation"),
    0,
  );
  assert.equal(f.state.window.listenerCount("closed"), 0);
});

test("revocation while the final awaited stat finishes prevents returning file bytes", async (t) => {
  const f = fixture(t);
  const file = f.write("trace");
  f.ready();
  const { token } = await f.choose([file]);
  const original = fs.promises.open;
  let closes = 0;
  t.mock.method(fs.promises, "open", async (...args) => {
    const handle = await original(...args);
    let stats = 0;
    return {
      async stat() {
        const info = await handle.stat();
        if (++stats === 2) f.send("complete", { token, indexes: [] });
        return info;
      },
      read: (...readArgs) => handle.read(...readArgs),
      async close() {
        closes++;
        await handle.close();
      },
    };
  });
  await assert.rejects(
    f.read({ token, index: 0, offset: 0 }),
    /File access denied/,
  );
  assert.equal(closes, 1);
});

test("revocation during awaited handle cleanup also prevents returning bytes", async (t) => {
  const f = fixture(t);
  const file = f.write("trace");
  f.ready();
  const { token } = await f.choose([file]);
  const original = fs.promises.open;
  t.mock.method(fs.promises, "open", async (...args) => {
    const handle = await original(...args);
    return {
      stat: () => handle.stat(),
      read: (...readArgs) => handle.read(...readArgs),
      async close() {
        await handle.close();
        f.send("complete", { token, indexes: [] });
      },
    };
  });
  await assert.rejects(
    f.read({ token, index: 0, offset: 0 }),
    /File access denied/,
  );
});

test("in-flight reads are serialized, recheck revocation, and always close the file handle", async (t) => {
  const f = fixture(t);
  const file = f.write("trace");
  f.ready();
  const { token } = await f.choose([file]);
  const entered = deferred();
  const released = deferred();
  const original = fs.promises.open;
  let closes = 0;
  t.mock.method(fs.promises, "open", async (...args) => {
    const handle = await original(...args);
    return {
      stat: () => handle.stat(),
      async read(...readArgs) {
        entered.resolve();
        await released.promise;
        return handle.read(...readArgs);
      },
      async close() {
        closes++;
        await handle.close();
      },
    };
  });
  const reading = f.read({ token, index: 0, offset: 0 });
  const rejection = assert.rejects(reading, /File access denied/);
  await entered.promise;
  await assert.rejects(f.read({ token, index: 0, offset: 0 }));
  f.send("complete", { token, indexes: [] });
  await f.api.open();
  assert.equal(
    f.dialog.calls.length,
    1,
    "revoked but in-flight reads still prevent overlap",
  );
  released.resolve();
  await rejection;
  assert.equal(closes, 1);
  assert.equal(f.items()[0].enabled, true);
});

test("read failures and files changed during a read close handles and revoke authorization", async (t) => {
  for (const kind of ["throw", "truncate", "navigate"]) {
    await t.test(kind, async (t) => {
      const f = fixture(t);
      const file = f.write("trace");
      f.ready();
      const { token } = await f.choose([file]);
      const original = fs.promises.open;
      let closes = 0;
      t.mock.method(fs.promises, "open", async (...args) => {
        const handle = await original(...args);
        return {
          stat: () => handle.stat(),
          async read(...readArgs) {
            if (kind === "throw")
              throw new Error("sensitive filesystem details");
            if (kind === "truncate") fs.truncateSync(file, 0);
            if (kind === "navigate")
              f.state.window.webContents.emit("did-start-navigation", {
                isMainFrame: true,
              });
            return handle.read(...readArgs);
          },
          async close() {
            closes++;
            await handle.close();
          },
        };
      });
      await assert.rejects(f.read({ token, index: 0, offset: 0 }), {
        message: "File access denied",
      });
      assert.equal(closes, 1);
      await assert.rejects(f.read({ token, index: 0, offset: 0 }));
    });
  }
});

test("malformed, oversized, and unbounded history snapshots fail closed", (t) => {
  const f = fixture(t);
  const file = f.write("trace");
  const snapshots = [
    "{",
    "null",
    "[]",
    JSON.stringify({ version: 2, paths: [file] }),
    JSON.stringify({ version: 1, paths: ["relative"] }),
    JSON.stringify({ version: 1, paths: Array(21).fill(file) }),
    JSON.stringify({ version: 1, paths: ["/" + "a".repeat(4097)] }),
    Buffer.from([0xff]),
    Buffer.alloc(256 * 1024 + 1, 0x20),
  ];
  f.api.dispose();
  for (const snapshot of snapshots) {
    fs.mkdirSync(f.userData, { recursive: true });
    fs.writeFileSync(f.historyPath, snapshot);
    const run = fixture(t, { root: f.root });
    assert.doesNotThrow(() => run.ready());
    assert.deepEqual(run.items()[1].submenu, []);
    assert.deepEqual(fs.readFileSync(f.historyPath), Buffer.from(snapshot));
    run.api.dispose();
  }
});

test("history loads only once per persistence session and deduplicates stored paths", (t) => {
  const f = fixture(t);
  const first = f.write("first");
  const second = f.write("second");
  f.seed([first, first]);
  f.ready();
  assert.equal(f.items()[1].submenu.length, 1);
  f.seed([second]);
  f.ready({ language: "zh-CN" });
  assert.equal(f.items()[1].submenu[0].label, first);
  f.ready({ persistence: false });
  f.ready();
  assert.equal(f.items()[1].submenu[0].label, second);
});

test("history path cannot leave userData or overwrite application preferences", (t) => {
  const f = fixture(t);
  f.api.dispose();
  for (const historyPath of [
    "relative.json",
    path.join(f.root, "outside.json"),
    path.join(f.userData, "sub", "recent.json"),
    path.join(f.userData, "preferences.json"),
    path.join(f.userData, "history.txt"),
    path.join(f.userData, ".hidden.json"),
  ]) {
    assert.throws(
      () =>
        installFileMenu({
          ...f,
          getWindow: () => f.state.window,
          origin,
          historyPath,
        }),
      /dedicated JSON file/,
    );
  }
});

test(
  "symlinked history files and userData directories cannot read or overwrite outside storage",
  { skip: process.platform === "win32" },
  (t) => {
    for (const kind of ["file", "directory"]) {
      const f = fixture(t);
      const file = f.write("trace");
      const outside = path.join(f.root, "outside");
      fs.mkdirSync(outside);
      const target = path.join(outside, "recent-files.json");
      const contents = JSON.stringify({ version: 1, paths: [file] });
      fs.writeFileSync(target, contents);
      if (kind === "file") {
        fs.mkdirSync(f.userData);
        fs.symlinkSync(target, f.historyPath);
      } else fs.symlinkSync(outside, f.userData);
      f.ready();
      assert.deepEqual(f.items()[1].submenu, []);
      f.send("remember", [file]);
      assert.equal(fs.readFileSync(target, "utf8"), contents);
      assert.deepEqual(fs.readdirSync(outside), ["recent-files.json"]);
      assert.equal(
        fs
          .lstatSync(kind === "file" ? f.historyPath : f.userData)
          .isSymbolicLink(),
        true,
      );
    }
  },
);

test("raw os.tmpdir userData persists and reloads across a restart", (t) => {
  const root = fs.mkdtempSync(
    path.join(os.tmpdir(), "winscope-files-raw-temp-"),
  );
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const f = fixture(t, { root });
  const file = f.write("trace");
  f.ready();
  f.send("remember", [file]);
  assert.deepEqual(f.history(), [file]);
  f.api.dispose();
  const restarted = fixture(t, { root });
  restarted.ready();
  assert.equal(restarted.items()[1].submenu[0].label, file);
});

test(
  "trusted ancestor aliases are canonicalized but later redirection cannot escape the pinned root",
  {
    skip: process.platform === "win32",
  },
  (t) => {
    const f = fixture(t);
    f.api.dispose();
    const parent = path.join(f.root, "canonical-parent");
    const outside = path.join(f.root, "outside");
    const alias = path.join(f.root, "ancestor-alias");
    fs.mkdirSync(parent);
    fs.mkdirSync(outside);
    fs.symlinkSync(parent, alias);
    const run = fixture(t, {
      root: f.root,
      userData: path.join(alias, "userData"),
    });
    const file = run.write("trace");
    run.ready();
    run.send("remember", [file]);
    assert.deepEqual(run.history(), [file]);
    run.api.dispose();
    const restarted = fixture(t, {
      root: f.root,
      userData: path.join(alias, "userData"),
    });
    restarted.ready();
    assert.equal(restarted.items()[1].submenu[0].label, file);
    fs.unlinkSync(alias);
    fs.symlinkSync(outside, alias);
    restarted.items()[3].click();
    assert.deepEqual(fs.readdirSync(outside), []);
    assert.deepEqual(
      JSON.parse(
        fs.readFileSync(path.join(parent, "userData", "recent-files.json")),
      ).paths,
      [file],
    );
  },
);

test(
  "a history entry swapped to a symlink after readiness cannot be overwritten",
  {
    skip: process.platform === "win32",
  },
  (t) => {
    const f = fixture(t);
    const file = f.write("trace");
    const target = f.write("outside.json", "outside data");
    f.seed([file]);
    f.ready();
    fs.unlinkSync(f.historyPath);
    fs.symlinkSync(target, f.historyPath);
    f.items()[3].click();
    assert.equal(fs.readFileSync(target, "utf8"), "outside data");
    assert.equal(fs.lstatSync(f.historyPath).isSymbolicLink(), true);
    assert.deepEqual(fs.readdirSync(f.userData), ["recent-files.json"]);
  },
);

test("atomic save failures preserve disk data, clean temporary files, and retain in-memory MRU", (t) => {
  const f = fixture(t);
  const first = f.write("first");
  const second = f.write("second");
  f.seed([first]);
  f.ready();
  t.mock.method(fs, "renameSync", () => {
    throw Object.assign(new Error("denied"), { code: "EACCES" });
  });
  assert.doesNotThrow(() => f.send("remember", [second]));
  assert.deepEqual(f.history(), [first]);
  assert.deepEqual(
    f.items()[1].submenu.map((entry) => entry.label),
    [second, first],
  );
  assert.deepEqual(fs.readdirSync(f.userData), ["recent-files.json"]);
});

test("native invalid selections and picker/send failures leave no capability or recent entry", async (t) => {
  const f = fixture(t);
  const file = f.write("trace");
  f.ready();
  for (const selection of [
    [],
    ["relative"],
    [f.root],
    Array(65).fill(file),
    [file, file + ".missing"],
  ]) {
    await f.choose(selection);
    assert.equal(f.items()[0].enabled, true);
    assert.equal(f.state.window.webContents.messages.length, 0);
    assert.equal(fs.existsSync(f.historyPath), false);
  }
  const errors = f.dialog.errors.length;
  t.mock.method(f.dialog, "showOpenDialog", async () => {
    throw new Error("native failed");
  });
  await f.api.open();
  assert.equal(f.dialog.errors.length, errors + 1);
  assert.equal(f.items()[0].enabled, true);
  t.mock.restoreAll();
  t.mock.method(f.state.window.webContents, "send", () => {
    throw new Error("renderer stopped");
  });
  await f.choose([file]);
  assert.equal(f.items()[0].enabled, true);
  assert.equal(fs.existsSync(f.historyPath), false);
});

test("empty files read safely and disposal removes only owned IPC/listeners/menu", async (t) => {
  const f = fixture(t);
  const file = f.write("empty.trace", "");
  const unrelated = () => {};
  f.ipcMain.on("winscope:files:ready", unrelated);
  f.state.window.webContents.on("did-start-navigation", unrelated);
  f.ready();
  const { token } = await f.choose([file]);
  assert.equal((await f.read({ token, index: 0, offset: 0 })).length, 0);
  const replacementMenu = { items: [] };
  f.Menu.setApplicationMenu(replacementMenu);
  f.api.dispose();
  f.api.dispose();
  assert.equal(f.Menu.current, replacementMenu);
  assert.equal(f.handlers.size, 0);
  assert.deepEqual(f.ipcMain.listeners("winscope:files:ready"), [unrelated]);
  assert.equal(f.ipcMain.listenerCount("winscope:files:remember"), 0);
  assert.equal(f.ipcMain.listenerCount("winscope:files:complete"), 0);
  assert.deepEqual(
    f.state.window.webContents.listeners("did-start-navigation"),
    [unrelated],
  );
  assert.equal(f.state.window.listenerCount("closed"), 0);
  await f.api.open();
  assert.equal(f.dialog.calls.length, 1);
  const own = fixture(t);
  own.api.dispose();
  assert.equal(own.Menu.current, null);
});
