"use strict";

const { isAppUrl } = require("./security.cjs");

const TITLE_BAR_HEIGHT = 32;

function overlay(dark) {
  return {
    height: TITLE_BAR_HEIGHT,
    color: "#00000000",
    symbolColor: dark ? "#ffffff" : "#222222",
  };
}

function windowChromeOptions(platform = process.platform, dark = false) {
  if (platform === "darwin") {
    return { titleBarStyle: "hidden", trafficLightPosition: { x: 12, y: 9 } };
  }
  if (platform === "win32" || platform === "linux") {
    return { titleBarStyle: "hidden", titleBarOverlay: overlay(dark) };
  }
  throw new Error(`Unsupported desktop window platform: ${platform}`);
}

function updateWindowTheme(
  event,
  win,
  origin,
  dark,
  platform = process.platform,
) {
  if (
    typeof dark !== "boolean" ||
    (platform !== "win32" && platform !== "linux")
  )
    return false;
  const authority = /^http:\/\/127\.0\.0\.1:([1-9]\d{0,4})$/.exec(origin);
  if (!authority || Number(authority[1]) > 65535) return false;
  try {
    const contents = win?.webContents;
    const frame = event.senderFrame;
    if (
      !contents ||
      win.isDestroyed() ||
      contents.isDestroyed() ||
      event.sender !== contents ||
      !frame ||
      frame !== contents.mainFrame ||
      frame.isDestroyed() ||
      frame.parent !== null ||
      frame.origin !== origin ||
      !isAppUrl(frame.url, origin)
    )
      return false;
    win.setTitleBarOverlay(overlay(dark));
    return true;
  } catch {
    return false;
  }
}

function installWindowShortcuts(
  win,
  { platform = process.platform, quit, openTrace },
) {
  const contents = win.webContents;
  const handler = (event, input) => {
    if (
      input.type !== "keyDown" ||
      typeof input.key !== "string" ||
      input.isComposing ||
      input.alt ||
      !(platform === "darwin" ? input.meta : input.control)
    )
      return;
    const key = input.key.toLowerCase();
    const actions = {
      q: quit,
      w: () => win.close(),
      o: openTrace,
      r: () => contents.reload(),
      c: () => contents.copy(),
      x: () => contents.cut(),
      v: () => (input.shift ? contents.pasteAndMatchStyle() : contents.paste()),
      a: () => contents.selectAll(),
      z: () => (input.shift ? contents.redo() : contents.undo()),
      0: () => contents.setZoomLevel(0),
      "=": () =>
        contents.setZoomLevel(Math.min(5, contents.getZoomLevel() + 0.5)),
      "+": () =>
        contents.setZoomLevel(Math.min(5, contents.getZoomLevel() + 0.5)),
      "-": () =>
        contents.setZoomLevel(Math.max(-5, contents.getZoomLevel() - 0.5)),
    };
    if (platform !== "darwin") actions.y = () => contents.redo();
    const action = Object.hasOwn(actions, key) ? actions[key] : undefined;
    if (typeof action !== "function") return;
    event.preventDefault();
    action();
  };
  contents.on("before-input-event", handler);
  return () => contents.off("before-input-event", handler);
}

module.exports = {
  TITLE_BAR_HEIGHT,
  windowChromeOptions,
  updateWindowTheme,
  installWindowShortcuts,
};
