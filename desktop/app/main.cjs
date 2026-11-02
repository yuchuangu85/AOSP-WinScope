"use strict";

const {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  Menu,
  nativeTheme,
  session,
  shell,
  utilityProcess,
} = require("electron");
const path = require("node:path");
const os = require("node:os");
const { mkdirSync } = require("node:fs");
const {
  verifyRuntime,
  isAppUrl,
  isRendererResource,
  isExternalDocumentation,
  secureWebPreferences,
} = require("./security.cjs");
const { startServices } = require("./services.cjs");
const {
  windowChromeOptions,
  updateWindowTheme,
  installWindowShortcuts,
} = require("./window_chrome.cjs");
const {
  PreferenceStore,
  isTrustedPreferenceSender,
} = require("./preferences.cjs");

app.setName("AOSP-WinScope");
if (process.env.WINSCOPE_DESKTOP_USER_DATA) {
  // Used only by source development and installed-binary acceptance tests.
  const directory = path.resolve(process.env.WINSCOPE_DESKTOP_USER_DATA);
  mkdirSync(directory, { recursive: true });
  app.setPath("userData", directory);
}
app.enableSandbox();

let window;
let services;
let startingServices;
let quitting = false;
let finished = false;
let prefs;
let exitCode = 0;
let closingForQuit = false;

async function fail(error) {
  if (quitting) return;
  exitCode = 1;
  console.error(error.message);
  if (!process.env.WINSCOPE_DESKTOP_SMOKE) {
    dialog.showErrorBox(
      "AOSP-WinScope",
      `${error.message}\n\nReinstall the application if its bundled runtime is incomplete.`,
    );
  }
  app.quit();
}

function openDocumentation(url) {
  if (isExternalDocumentation(url)) void shell.openExternal(url);
}

function configureSession(current, origin) {
  current.setPermissionRequestHandler(
    (requester, permission, callback, details) => {
      callback(
        permission === "clipboard-sanitized-write" &&
          requester === window?.webContents &&
          details.isMainFrame &&
          isAppUrl(details.requestingUrl, origin),
      );
    },
  );
  current.setPermissionCheckHandler(
    (requester, permission, requestingOrigin, details) =>
      permission === "clipboard-sanitized-write" &&
      requester === window?.webContents &&
      details.isMainFrame &&
      requestingOrigin === origin,
  );
  current.removeAllListeners("will-download");
  current.on("will-download", (_event, item) => {
    if (
      !isAppUrl(item.getURL(), origin) &&
      !item.getURL().startsWith(`blob:${origin}/`)
    )
      item.cancel();
  });
  current.webRequest.onBeforeRequest((details, callback) => {
    callback({ cancel: !isRendererResource(details.url, origin) });
  });
}

function createWindow() {
  if (!services || quitting) return;
  const currentSession = session.fromPartition("persist:winscope-desktop");
  configureSession(currentSession, services.origin);
  window = new BrowserWindow({
    width: 1440,
    height: 960,
    minWidth: 800,
    minHeight: 600,
    title: "AOSP-WinScope",
    show: false,
    backgroundColor: "#303030",
    autoHideMenuBar: true,
    ...windowChromeOptions(process.platform, nativeTheme.shouldUseDarkColors),
    webPreferences: {
      ...secureWebPreferences,
      session: currentSession,
      preload: path.join(__dirname, "preload.cjs"),
    },
  });
  const currentWindow = window;
  const contents = currentWindow.webContents;
  const removeShortcuts = installWindowShortcuts(currentWindow, {
    quit: () => app.quit(),
    openTrace: () => {
      void contents.executeJavaScript(
        `(() => {
        const input = document.querySelector('#fileDropRef');
        if (input) input.click();
        else {
          document.querySelector('.upload-new')?.click();
          requestAnimationFrame(() => document.querySelector('#fileDropRef')?.click());
        }
      })()`,
        true,
      );
    },
  });
  contents.setWindowOpenHandler(({ url }) => {
    openDocumentation(url);
    return { action: "deny" };
  });
  for (const event of ["will-navigate", "will-redirect"]) {
    contents.on(event, (navigation, url) => {
      if (!isAppUrl(url, services.origin)) {
        navigation.preventDefault();
        openDocumentation(url);
      }
    });
  }
  contents.on("will-attach-webview", (event) => event.preventDefault());
  contents.on("will-prevent-unload", (event) => {
    if (process.env.WINSCOPE_DESKTOP_SMOKE || exitCode !== 0) {
      event.preventDefault();
      return;
    }
    const leave = dialog.showMessageBoxSync(currentWindow, {
      type: "question",
      buttons: ["Stay", "Leave"],
      defaultId: 0,
      cancelId: 0,
      title: "AOSP-WinScope",
      message: "Close the current trace?",
      detail:
        "The current trace view will be closed. Original trace files are not changed.",
    });
    if (leave === 1) event.preventDefault();
    else closingForQuit = false;
  });
  contents.on(
    "render-process-gone",
    () => void fail(new Error("The WinScope renderer stopped unexpectedly")),
  );
  currentWindow.once("ready-to-show", () => currentWindow.show());
  currentWindow.on("closed", () => {
    removeShortcuts();
    if (window === currentWindow) window = undefined;
    if (closingForQuit) {
      closingForQuit = false;
      app.quit();
    }
  });
  void currentWindow
    .loadURL(services.origin + "/")
    .catch((error) => void fail(error));
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (!window) createWindow();
    if (window?.isMinimized()) window.restore();
    window?.focus();
  });
  app.on("activate", () => {
    if (!window && services) createWindow();
  });
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });
  app.on("before-quit", (event) => {
    if (finished) return;
    event.preventDefault();
    if (quitting) return;
    if (window && !window.isDestroyed()) {
      if (!closingForQuit) {
        closingForQuit = true;
        window.close();
      }
      return;
    }
    quitting = true;
    Promise.resolve(startingServices)
      .then((owner) => owner?.stop())
      .catch(() => {
        exitCode = 1;
      })
      .finally(() => {
        finished = true;
        app.exit(exitCode);
      });
  });
  process.on("SIGTERM", () => app.quit());
  process.on("SIGINT", () => app.quit());
  app
    .whenReady()
    .then(async () => {
      const runtimeRoot = app.isPackaged
        ? path.join(process.resourcesPath, "runtime")
        : path.resolve(
            __dirname,
            "../../dist/desktop/runtime",
            `${process.platform}-${process.arch}`,
          );
      await verifyRuntime(runtimeRoot);
      if (quitting) return;
      const paths = [
        path.join(os.homedir(), ".local", "bin"),
        "/opt/homebrew/bin",
        "/usr/local/bin",
      ];
      const environment = {
        ...process.env,
        PATH: [process.env.PATH ?? "", ...paths].join(path.delimiter),
      };
      startingServices = startServices({
        runtimeRoot,
        utilityProcess,
        environment,
        onFailure: (error) => void fail(error),
      });
      services = await startingServices;
      if (quitting) {
        await services.stop();
        return;
      }
      prefs = new PreferenceStore(
        path.join(app.getPath("userData"), "preferences.json"),
      );
      ipcMain.on("winscope:preferences:read", (event) => {
        event.returnValue = isTrustedPreferenceSender(
          event,
          window?.webContents,
          services.origin,
        )
          ? prefs.snapshot()
          : {};
      });
      ipcMain.on("winscope:preferences:write", (event, value) => {
        if (
          isTrustedPreferenceSender(event, window?.webContents, services.origin)
        )
          prefs.set(value);
      });
      ipcMain.on("winscope:window-theme", (event, dark) => {
        updateWindowTheme(event, window, services.origin, dark);
      });
      Menu.setApplicationMenu(null);
      createWindow();
      if (process.env.WINSCOPE_DESKTOP_SMOKE) {
        await require("./smoke-probe.cjs").run({
          app,
          getWindow: () => window,
          services,
        });
        app.quit();
      }
    })
    .catch((error) => void fail(error));
}
