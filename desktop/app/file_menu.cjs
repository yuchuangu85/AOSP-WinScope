"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { randomUUID } = require("node:crypto");
const { isTrustedPreferenceSender } = require("./preferences.cjs");

const MAX_FILES = 64;
const MAX_RECENT = 20;
const MAX_PATH_BYTES = 4096;
const HISTORY_BYTES = 256 * 1024;
const CHUNK_BYTES = 4 * 1024 * 1024;
const READ_FLAGS =
  fs.constants.O_RDONLY |
  (fs.constants.O_NOFOLLOW ?? 0) |
  (fs.constants.O_NONBLOCK ?? 0);
const labels = {
  en: {
    file: "File",
    open: "Open...",
    recent: "Open Recent",
    clear: "Clear Recent",
    close: "Close",
    edit: "Edit",
    view: "View",
    title: "Open Trace Files",
    error: "Unable to open trace files",
    ok: "OK",
    detail:
      "The file may have moved, changed, or become unavailable. The current trace has not been replaced.",
  },
  "zh-CN": {
    file: "文件",
    open: "打开...",
    recent: "最近打开",
    clear: "清除最近记录",
    close: "关闭",
    edit: "编辑",
    view: "视图",
    title: "打开跟踪文件",
    error: "无法打开跟踪文件",
    ok: "确定",
    detail: "文件可能已被移动、修改或无法访问。当前跟踪尚未被替换。",
  },
};

function validPath(value) {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value.length <= MAX_PATH_BYTES &&
    !value.includes("\0") &&
    Buffer.byteLength(value, "utf8") <= MAX_PATH_BYTES &&
    path.isAbsolute(value)
  );
}

function validPaths(value) {
  return (
    Array.isArray(value) && value.length <= MAX_FILES && value.every(validPath)
  );
}

function invalidFile() {
  return Object.assign(new Error("File access denied"), {
    code: "INVALID_FILE",
  });
}

function fileInfo(filePath) {
  const info = fs.lstatSync(filePath);
  if (
    !info.isFile() ||
    !Number.isSafeInteger(info.size) ||
    info.size < 0 ||
    !Number.isFinite(info.mtimeMs)
  )
    throw invalidFile();
  return {
    path: filePath,
    size: info.size,
    mtime: info.mtimeMs,
    dev: info.dev,
    ino: info.ino,
  };
}

function sameFile(info, expected) {
  return (
    info.isFile() &&
    info.size === expected.size &&
    info.mtimeMs === expected.mtime &&
    info.dev === expected.dev &&
    info.ino === expected.ino
  );
}

function installFileMenu({
  app,
  Menu,
  dialog,
  ipcMain,
  getWindow,
  origin,
  historyPath,
  platform = process.platform,
}) {
  const userData = path.resolve(app.getPath("userData"));
  const history = historyPath ?? path.join(userData, "recent-files.json");
  if (
    typeof history !== "string" ||
    !path.isAbsolute(history) ||
    path.dirname(history) !== userData ||
    path.resolve(history) !== history ||
    !/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,120}\.json$/.test(path.basename(history)) ||
    path.basename(history) === "preferences.json"
  ) {
    throw new TypeError(
      "History must be a dedicated JSON file directly in userData",
    );
  }

  let disposed = false;
  let window;
  let ready = false;
  let persistence = false;
  let language = "en";
  let recent = [];
  let loaded = false;
  let pending;
  let opening = false;
  let reading = false;
  let generation = 0;
  let menu;
  let canonicalRoot;
  const windowListeners = [];

  function resolveDirectory(directory) {
    try {
      return fs.realpathSync(directory);
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
      return path.join(
        resolveDirectory(path.dirname(directory)),
        path.basename(directory),
      );
    }
  }

  // Pin the trusted root lazily, allowing OS ancestor aliases such as /var on
  // macOS. Refuse a symlinked root, later redirection, or a symlinked snapshot.
  function historyDirectory(create) {
    try {
      if (!fs.lstatSync(userData).isDirectory()) throw invalidFile();
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
    const resolved = resolveDirectory(userData);
    if (canonicalRoot === undefined) canonicalRoot = resolved;
    if (resolved !== canonicalRoot) throw invalidFile();
    if (create) fs.mkdirSync(canonicalRoot, { recursive: true, mode: 0o700 });
    if (
      !fs.lstatSync(canonicalRoot).isDirectory() ||
      fs.realpathSync(canonicalRoot) !== canonicalRoot
    )
      throw invalidFile();
    return path.join(canonicalRoot, path.basename(history));
  }

  function historyTarget(storage) {
    try {
      if (!fs.lstatSync(storage).isFile()) throw invalidFile();
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }

  function loadHistory() {
    if (loaded || !persistence) return;
    loaded = true;
    let fd;
    try {
      const storage = historyDirectory(false);
      historyTarget(storage);
      fd = fs.openSync(storage, READ_FLAGS);
      const info = fs.fstatSync(fd);
      if (!info.isFile() || info.size > HISTORY_BYTES) throw invalidFile();
      const buffer = Buffer.alloc(HISTORY_BYTES + 1);
      let length = 0;
      while (length < buffer.length) {
        const count = fs.readSync(
          fd,
          buffer,
          length,
          buffer.length - length,
          null,
        );
        if (!count) break;
        length += count;
      }
      if (length > HISTORY_BYTES) throw invalidFile();
      const value = JSON.parse(
        new TextDecoder("utf-8", { fatal: true }).decode(
          buffer.subarray(0, length),
        ),
      );
      if (
        value?.version !== 1 ||
        !Array.isArray(value.paths) ||
        value.paths.length > MAX_RECENT ||
        !value.paths.every(validPath)
      ) {
        throw invalidFile();
      }
      recent = [...new Set(value.paths.map((entry) => path.resolve(entry)))];
    } catch {
      recent = [];
    } finally {
      if (fd !== undefined) {
        try {
          fs.closeSync(fd);
        } catch {
          /* History must not block readiness. */
        }
      }
    }
  }

  function saveHistory() {
    if (!persistence || disposed) return;
    let fd;
    let temporary;
    try {
      const storage = historyDirectory(true);
      historyTarget(storage);
      const payload = JSON.stringify({ version: 1, paths: recent }) + "\n";
      if (Buffer.byteLength(payload) > HISTORY_BYTES) throw invalidFile();
      temporary = `${storage}.${process.pid}.${randomUUID()}.tmp`;
      fd = fs.openSync(temporary, "wx", 0o600);
      fs.writeFileSync(fd, payload, "utf8");
      fs.fsyncSync(fd);
      fs.closeSync(fd);
      fd = undefined;
      historyDirectory(false);
      historyTarget(storage);
      fs.renameSync(temporary, storage);
      temporary = undefined;
    } catch {
      // Disk failures must not interrupt or replace the current trace.
    } finally {
      if (fd !== undefined) {
        try {
          fs.closeSync(fd);
        } catch {
          /* Preserve the save failure. */
        }
      }
      if (temporary !== undefined) {
        try {
          historyDirectory(false);
          fs.unlinkSync(temporary);
        } catch {
          /* Only our own temp file. */
        }
      }
    }
  }

  function remember(paths) {
    if (!ready || !persistence || !validPaths(paths)) return;
    const accepted = [];
    for (const entry of paths) {
      const filePath = path.resolve(entry);
      try {
        fileInfo(filePath);
        accepted.push(filePath);
      } catch {
        /* Ignore missing, special, or symlinked original files. */
      }
    }
    if (!accepted.length) return;
    recent = [...new Set([...accepted, ...recent])].slice(0, MAX_RECENT);
    saveHistory();
    buildMenu();
  }

  function invalidate() {
    ready = false;
    pending = undefined;
    generation++;
    buildMenu();
  }

  function followWindow(current) {
    if (current === window) return;
    for (const [target, name, listener] of windowListeners.splice(0)) {
      target.removeListener(name, listener);
    }
    window = current;
    ready = false;
    pending = undefined;
    generation++;
    if (!window) {
      buildMenu();
      return;
    }
    const listen = (target, name, listener) => {
      target.on(name, listener);
      windowListeners.push([target, name, listener]);
    };
    listen(
      window.webContents,
      "did-start-navigation",
      (details, _url, _inPlace, isMainFrame) => {
        if ((details?.isMainFrame ?? isMainFrame) !== false) invalidate();
      },
    );
    listen(window.webContents, "destroyed", invalidate);
    listen(window.webContents, "render-process-gone", invalidate);
    listen(window, "closed", invalidate);
    buildMenu();
  }

  function currentWindow() {
    if (disposed) return undefined;
    const current = getWindow();
    followWindow(current);
    return !disposed &&
      current &&
      !current.isDestroyed() &&
      !current.webContents.isDestroyed()
      ? current
      : undefined;
  }

  function trusted(event) {
    const current = currentWindow();
    return (
      !!current &&
      isTrustedPreferenceSender(event, current.webContents, origin, true)
    );
  }

  function active(current, epoch) {
    return currentWindow() === current && ready && generation === epoch;
  }

  async function showOpenError(current) {
    const text = labels[language];
    try {
      await dialog.showMessageBox(current, {
        type: "error",
        title: text.error,
        message: text.error,
        detail: text.detail,
        buttons: [text.ok],
        defaultId: 0,
        cancelId: 0,
      });
    } catch {
      /* Window may have been closed while the dialog was opening. */
    }
  }

  async function select(recentPath) {
    const current = currentWindow();
    if (!current || !ready || opening || pending || reading) return;
    if (
      recentPath !== undefined &&
      (!persistence || !recent.includes(recentPath))
    )
      return;
    const epoch = generation;
    opening = true;
    buildMenu();
    try {
      let paths;
      if (recentPath !== undefined) paths = [recentPath];
      else {
        const result = await dialog.showOpenDialog(current, {
          title: labels[language].title,
          buttonLabel: labels[language].open,
          properties: ["openFile", "multiSelections", "dontAddToRecent"],
        });
        if (!active(current, epoch) || result.canceled) return;
        paths = result.filePaths;
      }
      if (!active(current, epoch)) return;
      if (!validPaths(paths) || !paths.length) throw invalidFile();
      const files = [...new Set(paths.map((entry) => path.resolve(entry)))].map(
        fileInfo,
      );
      pending = { token: randomUUID(), files, epoch, window: current };
      current.webContents.send("winscope:files:open", {
        token: pending.token,
        files: files.map((file) => ({
          name: path.basename(file.path),
          size: file.size,
          lastModified: Math.trunc(file.mtime),
        })),
      });
    } catch (error) {
      if (!active(current, epoch)) return;
      pending = undefined;
      if (
        recentPath !== undefined &&
        ["ENOENT", "ENOTDIR", "INVALID_FILE"].includes(error.code)
      ) {
        recent = recent.filter((entry) => entry !== recentPath);
        saveHistory();
      }
      await showOpenError(current);
    } finally {
      opening = false;
      buildMenu();
    }
  }

  function buildMenu() {
    if (disposed) return;
    const text = labels[language];
    const enabled =
      ready &&
      !opening &&
      !pending &&
      !reading &&
      window === getWindow() &&
      !!window &&
      !window.isDestroyed() &&
      !window.webContents.isDestroyed();
    const template = [];
    if (platform === "darwin") template.push({ role: "appMenu" });
    template.push({
      id: "file-menu",
      label: text.file,
      submenu: [
        {
          id: "open-file",
          label: text.open,
          accelerator: "CmdOrCtrl+O",
          enabled,
          click: () => select(),
        },
        {
          id: "open-recent",
          label: text.recent,
          enabled: enabled && persistence && recent.length > 0,
          submenu: persistence
            ? recent.map((entry, index) => ({
                id: `recent-file-${index}`,
                // Full paths distinguish identical basenames; escape Windows mnemonics.
                label: entry
                  .replace(/[\x00-\x1f\x7f]/g, " ")
                  .replace(/&/g, "&&"),
                enabled,
                click: () => select(entry),
              }))
            : [],
        },
        { type: "separator" },
        {
          id: "clear-recent",
          label: text.clear,
          enabled: enabled && persistence && recent.length > 0,
          click: () => {
            if (
              !currentWindow() ||
              !ready ||
              !persistence ||
              opening ||
              pending ||
              reading
            )
              return;
            recent = [];
            saveHistory();
            buildMenu();
          },
        },
        { role: "close", label: text.close },
      ],
    });
    template.push({
      label: text.edit,
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "delete" },
        { type: "separator" },
        { role: "selectAll" },
      ],
    });
    template.push({
      label: text.view,
      submenu: [
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ],
    });
    menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }

  const onReady = (event, value) => {
    if (
      !trusted(event) ||
      !value ||
      !["en", "zh-CN"].includes(value.language) ||
      typeof value.persistence !== "boolean"
    )
      return;
    const nextPersistence =
      value.persistence &&
      !new URL(event.senderFrame.url).searchParams.has("no-persistence");
    if (persistence !== nextPersistence) {
      recent = [];
      loaded = false;
    }
    language = value.language;
    persistence = nextPersistence;
    ready = true;
    loadHistory();
    buildMenu();
  };
  const onRemember = (event, paths) => {
    if (trusted(event)) remember(paths);
  };
  const onComplete = (event, value) => {
    if (
      !trusted(event) ||
      !ready ||
      !pending ||
      value?.token !== pending.token ||
      !Array.isArray(value.indexes) ||
      value.indexes.length > pending.files.length ||
      !value.indexes.every(
        (index) =>
          Number.isSafeInteger(index) &&
          index >= 0 &&
          index < pending.files.length,
      ) ||
      new Set(value.indexes).size !== value.indexes.length
    )
      return;
    const batch = pending;
    pending = undefined;
    const paths = [];
    for (const index of value.indexes) {
      const file = batch.files[index];
      try {
        if (sameFile(fs.lstatSync(file.path), file)) paths.push(file.path);
      } catch {
        /* Changed or missing files must not become recent entries. */
      }
    }
    remember(paths);
    buildMenu();
  };
  const onRead = async (event, value) => {
    if (
      !trusted(event) ||
      !ready ||
      !pending ||
      reading ||
      !value ||
      value.token !== pending.token ||
      !Number.isSafeInteger(value.index) ||
      value.index < 0 ||
      value.index >= pending.files.length ||
      !Number.isSafeInteger(value.offset) ||
      value.offset < 0 ||
      value.offset > pending.files[value.index].size
    )
      throw invalidFile();
    const batch = pending;
    const file = batch.files[value.index];
    const stillAuthorized = () =>
      pending === batch &&
      active(batch.window, batch.epoch) &&
      isTrustedPreferenceSender(event, batch.window.webContents, origin, true);
    let handle;
    let buffer;
    reading = true;
    try {
      try {
        if (!sameFile(fs.lstatSync(file.path), file)) throw invalidFile();
        handle = await fs.promises.open(file.path, READ_FLAGS);
        if (!stillAuthorized() || !sameFile(await handle.stat(), file))
          throw invalidFile();
        buffer = new Uint8Array(
          Math.min(CHUNK_BYTES, file.size - value.offset),
        );
        let length = 0;
        while (length < buffer.length) {
          if (!stillAuthorized()) throw invalidFile();
          const { bytesRead } = await handle.read(
            buffer,
            length,
            buffer.length - length,
            value.offset + length,
          );
          if (!bytesRead) throw invalidFile();
          length += bytesRead;
        }
        if (!sameFile(await handle.stat(), file)) throw invalidFile();
      } finally {
        if (handle) await handle.close();
      }
      if (!sameFile(fs.lstatSync(file.path), file) || !stillAuthorized())
        throw invalidFile();
      return buffer;
    } catch {
      if (pending === batch) pending = undefined;
      throw invalidFile();
    } finally {
      reading = false;
      buildMenu();
    }
  };

  ipcMain.on("winscope:files:ready", onReady);
  ipcMain.on("winscope:files:remember", onRemember);
  ipcMain.on("winscope:files:complete", onComplete);
  ipcMain.handle("winscope:files:read", onRead);
  followWindow(getWindow());
  buildMenu();

  return {
    open: () => select(),
    dispose() {
      if (disposed) return;
      disposed = true;
      ready = false;
      pending = undefined;
      generation++;
      ipcMain.removeListener("winscope:files:ready", onReady);
      ipcMain.removeListener("winscope:files:remember", onRemember);
      ipcMain.removeListener("winscope:files:complete", onComplete);
      ipcMain.removeHandler("winscope:files:read");
      for (const [target, name, listener] of windowListeners.splice(0)) {
        target.removeListener(name, listener);
      }
      if (Menu.getApplicationMenu() === menu) Menu.setApplicationMenu(null);
    },
  };
}

module.exports = { installFileMenu };
