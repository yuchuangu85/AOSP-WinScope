"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { randomUUID } = require("node:crypto");

// Keep these limits and the key boundary in sync with the sandboxed preload.
const PREFERENCE_LIMITS = Object.freeze({
  keys: 128,
  keyBytes: 256,
  valueBytes: 64 * 1024,
  totalBytes: 256 * 1024,
});
const unsafeKeys = new Set(["__proto__", "constructor", "prototype"]);

function isAllowedKey(key) {
  return (
    typeof key === "string" &&
    !unsafeKeys.has(key) &&
    key.length <= PREFERENCE_LIMITS.keyBytes &&
    Buffer.byteLength(key, "utf8") <= PREFERENCE_LIMITS.keyBytes &&
    (key === "dark-mode" ||
      key === "theme-mode" ||
      key === "display-scale" ||
      key === "confirm-trace-reset" ||
      key === "language" ||
      key === "savedSearches" ||
      key.endsWith("Options") ||
      key.startsWith("treeView"))
  );
}

function isRecord(value) {
  if (value === null || typeof value !== "object" || Array.isArray(value))
    return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === null || prototype === Object.prototype;
}

function normalize(value) {
  const result = {};
  let bytes = 3; // Braces and the newline written to disk.
  let count = 0;
  for (const key of Object.keys(value).filter(isAllowedKey).sort()) {
    const entry = Object.getOwnPropertyDescriptor(value, key);
    if (!entry || typeof entry.value !== "string") continue;
    const text = entry.value;
    if (
      text.length > PREFERENCE_LIMITS.valueBytes ||
      Buffer.byteLength(text, "utf8") > PREFERENCE_LIMITS.valueBytes
    )
      continue;
    const entryBytes =
      Buffer.byteLength(JSON.stringify(key), "utf8") +
      Buffer.byteLength(JSON.stringify(text), "utf8") +
      1 +
      (count > 0 ? 1 : 0);
    if (bytes + entryBytes > PREFERENCE_LIMITS.totalBytes) continue;
    result[key] = text;
    bytes += entryBytes;
    if (++count === PREFERENCE_LIMITS.keys) break;
  }
  return result;
}

function storageError(code) {
  return Object.assign(new Error("Invalid preference storage"), { code });
}

class PreferenceStore {
  /** filePath must be the explicit, stable userData/preferences.json path. */
  constructor(filePath) {
    if (typeof filePath !== "string" || !path.isAbsolute(filePath))
      throw new TypeError("PreferenceStore requires an absolute file path");
    this.filePath = filePath;
    this.lastError = null;
    this.data = {};
    this.load();
  }

  // Only sanitized operation/code diagnostics stay in the main process.
  recordError(operation, error) {
    const code =
      typeof error?.code === "string" && /^[A-Z0-9_]{1,40}$/.test(error.code)
        ? error.code
        : "PREFERENCES_ERROR";
    this.lastError = Object.freeze({ operation, code });
    console.warn(`WinScope preferences: ${operation} failed (${code}).`);
    return { ok: false, error: this.lastError };
  }

  load() {
    let fd;
    try {
      // Never inspect Chromium storage, siblings, backups, or other origins.
      const info = fs.lstatSync(this.filePath);
      if (!info.isFile()) throw storageError("INVALID_FILE");
      if (info.size > PREFERENCE_LIMITS.totalBytes)
        throw storageError("FILE_TOO_LARGE");
      fd = fs.openSync(
        this.filePath,
        fs.constants.O_RDONLY |
          (fs.constants.O_NOFOLLOW ?? 0) |
          (fs.constants.O_NONBLOCK ?? 0),
      );
      const opened = fs.fstatSync(fd);
      if (!opened.isFile()) throw storageError("INVALID_FILE");
      if (opened.size > PREFERENCE_LIMITS.totalBytes)
        throw storageError("FILE_TOO_LARGE");
      const buffer = Buffer.alloc(PREFERENCE_LIMITS.totalBytes + 1);
      let length = 0;
      while (length < buffer.length) {
        const read = fs.readSync(
          fd,
          buffer,
          length,
          buffer.length - length,
          null,
        );
        if (read === 0) break;
        length += read;
      }
      if (length > PREFERENCE_LIMITS.totalBytes)
        throw storageError("FILE_TOO_LARGE");
      let value;
      try {
        value = JSON.parse(
          new TextDecoder("utf-8", { fatal: true }).decode(
            buffer.subarray(0, length),
          ),
        );
      } catch {
        throw storageError("INVALID_JSON");
      }
      if (!isRecord(value)) throw storageError("INVALID_SNAPSHOT");
      this.data = normalize(value);
      this.lastError = null;
    } catch (error) {
      this.data = {};
      if (error.code !== "ENOENT") this.recordError("load", error);
    } finally {
      if (fd !== undefined) {
        try {
          fs.closeSync(fd);
        } catch (error) {
          this.recordError("load", error);
        }
      }
    }
  }

  /** A detached cached snapshot: no I/O, errors, paths, or other data. */
  snapshot() {
    return { ...this.data };
  }

  /** Replace, not merge. Updates memory even if the atomic disk save fails. */
  set(value) {
    let normalized;
    try {
      if (!isRecord(value)) throw storageError("INVALID_SNAPSHOT");
      normalized = normalize(value);
    } catch (error) {
      return this.recordError("normalize", error);
    }
    const payload = JSON.stringify(normalized) + "\n";
    this.data = normalized;
    let temporary;
    let fd;
    try {
      fs.mkdirSync(path.dirname(this.filePath), {
        recursive: true,
        mode: 0o700,
      });
      temporary = `${this.filePath}.${process.pid}.${randomUUID()}.tmp`;
      fd = fs.openSync(temporary, "wx", 0o600);
      fs.writeFileSync(fd, payload, "utf8");
      fs.fsyncSync(fd);
      fs.closeSync(fd);
      fd = undefined;
      fs.renameSync(temporary, this.filePath);
      temporary = undefined;
      this.lastError = null;
      return { ok: true };
    } catch (error) {
      return this.recordError("save", error);
    } finally {
      if (fd !== undefined) {
        try {
          fs.closeSync(fd);
        } catch {
          // Preserve the original save diagnostic.
        }
      }
      if (temporary !== undefined) {
        try {
          fs.unlinkSync(temporary);
        } catch {
          // No directory scans or broad temporary-file cleanup.
        }
      }
    }
  }
}

function isTrustedPreferenceSender(event, webContents, origin) {
  try {
    if (typeof origin !== "string") return false;
    const match = /^http:\/\/127\.0\.0\.1:([1-9]\d{0,4})$/.exec(origin);
    if (!match || Number(match[1]) > 65535) return false;
    if (
      !event ||
      !webContents ||
      event.sender !== webContents ||
      webContents.isDestroyed() !== false
    )
      return false;
    const frame = event.senderFrame;
    if (
      !frame ||
      frame !== webContents.mainFrame ||
      frame.isDestroyed() !== false ||
      frame.parent !== null ||
      frame.origin !== origin ||
      typeof frame.url !== "string"
    )
      return false;
    const url = new URL(frame.url);
    return (
      url.protocol === "http:" &&
      url.origin === origin &&
      !url.username &&
      !url.password &&
      !url.searchParams.has("no-persistence")
    );
  } catch {
    return false;
  }
}

module.exports = {
  PreferenceStore,
  isTrustedPreferenceSender,
  PREFERENCE_LIMITS,
};
