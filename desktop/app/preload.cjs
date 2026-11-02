"use strict";

(() => {
  // Sandbox preloads cannot require local helpers. Match preferences.cjs exactly.
  const LIMITS = {
    keys: 128,
    keyBytes: 256,
    valueBytes: 64 * 1024,
    totalBytes: 256 * 1024,
  };
  const unsafeKeys = new Set(["__proto__", "constructor", "prototype"]);
  const encoder = new TextEncoder();
  const byteLength = (text) => encoder.encode(text).length;

  function isAllowedKey(key) {
    return (
      typeof key === "string" &&
      !unsafeKeys.has(key) &&
      key.length <= LIMITS.keyBytes &&
      byteLength(key) <= LIMITS.keyBytes &&
      (key === "dark-mode" ||
        key === "theme-mode" ||
        key === "display-scale" ||
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
    let bytes = 3;
    let count = 0;
    for (const key of Object.keys(value).filter(isAllowedKey).sort()) {
      const entry = Object.getOwnPropertyDescriptor(value, key);
      if (!entry || typeof entry.value !== "string") continue;
      const text = entry.value;
      if (
        text.length > LIMITS.valueBytes ||
        byteLength(text) > LIMITS.valueBytes
      )
        continue;
      const entryBytes =
        byteLength(JSON.stringify(key)) +
        byteLength(JSON.stringify(text)) +
        1 +
        (count > 0 ? 1 : 0);
      if (bytes + entryBytes > LIMITS.totalBytes) continue;
      result[key] = text;
      bytes += entryBytes;
      if (++count === LIMITS.keys) break;
    }
    return result;
  }

  function activeUrl(allowPrivate = false) {
    const url = new URL(window.location.href);
    const match = /^http:\/\/127\.0\.0\.1:([1-9]\d{0,4})$/.exec(url.origin);
    if (
      window.top !== window ||
      url.protocol !== "http:" ||
      !match ||
      Number(match[1]) > 65535 ||
      url.username ||
      url.password ||
      (!allowPrivate && url.searchParams.has("no-persistence"))
    )
      return null;
    return url;
  }

  function allowedStorageKeys(storage) {
    const keys = [];
    const length = storage.length;
    for (let index = 0; index < length; ++index) {
      const key = storage.key(index);
      if (isAllowedKey(key)) keys.push(key);
    }
    return keys;
  }

  try {
    const platform =
      typeof process === "undefined" ? undefined : process.platform;
    if (
      typeof process !== "undefined" &&
      process.versions?.electron &&
      ["darwin", "win32", "linux"].includes(platform) &&
      activeUrl(true)
    ) {
      const { ipcRenderer } = require("electron");
      let observedBody;
      let previousDark;
      const updateTheme = () => {
        if (!document.body || !activeUrl(true)) return;
        const dark = document.body.classList.contains("dark-mode");
        if (dark !== previousDark) {
          ipcRenderer.send("winscope:window-theme", dark);
          previousDark = dark;
        }
      };
      const attach = () => {
        if (document.documentElement)
          document.documentElement.dataset.winscopeDesktop = platform;
        if (document.body && observedBody !== document.body) {
          observedBody = document.body;
          new MutationObserver(updateTheme).observe(observedBody, {
            attributes: true,
            attributeFilter: ["class"],
          });
          updateTheme();
        }
      };
      attach();
      if (!document.documentElement || !document.body) {
        const observer = new MutationObserver(() => {
          attach();
          if (document.documentElement && document.body) observer.disconnect();
        });
        observer.observe(document, { childList: true, subtree: true });
      }
      document.addEventListener("DOMContentLoaded", attach, { once: true });
    }
  } catch {
    // Window styling must remain independent of blocked preference storage.
  }

  try {
    const url = activeUrl();
    if (!url) return;
    const storage = window.localStorage;
    const staleKeys = allowedStorageKeys(storage);
    const { ipcRenderer } = require("electron");
    const reply = ipcRenderer.sendSync("winscope:preferences:read");
    // A malformed/failed read must not overwrite the saved snapshot later.
    if (!isRecord(reply)) return;
    const snapshot = normalize(reply);
    for (const key of staleKeys) {
      if (!Object.hasOwn(snapshot, key)) storage.removeItem(key);
    }
    for (const key of Object.keys(snapshot))
      storage.setItem(key, snapshot[key]);
    let previous = JSON.stringify(snapshot);

    function persist() {
      try {
        if (activeUrl()?.origin !== url.origin) return;
        const values = {};
        for (const key of allowedStorageKeys(storage)) {
          // Never read non-preference values (AI, trace, auth, sessions, tokens).
          const value = storage.getItem(key);
          if (typeof value === "string") values[key] = value;
        }
        const current = normalize(values);
        const serialized = JSON.stringify(current);
        if (serialized === previous) return;
        ipcRenderer.send("winscope:preferences:write", current);
        previous = serialized;
      } catch {
        // Unavailable storage or IPC must not interrupt the page or erase prefs.
      }
    }

    // Runs synchronously before page scripts, then captures only changed prefs.
    window.setInterval(persist, 750);
    window.addEventListener("beforeunload", persist);
  } catch {
    // A blocked store, failed IPC read, or quota failure disables this preload.
  }
})();
