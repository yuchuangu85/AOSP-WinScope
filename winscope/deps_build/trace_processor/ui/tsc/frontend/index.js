"use strict";
// Copyright (C) 2018 The Android Open Source Project
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
// Keep this import first.
const zod_1 = tslib_1.__importDefault(require("zod"));
require("../base/disposable_polyfill");
require("../base/static_initializers");
const all_plugins_1 = tslib_1.__importDefault(require("../gen/all_plugins"));
const all_core_plugins_1 = tslib_1.__importDefault(require("../gen/all_core_plugins"));
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const deferred_1 = require("../base/deferred");
const logging_1 = require("../base/logging");
const feature_flags_1 = require("../core/feature_flags");
const live_reload_1 = require("../core/live_reload");
const raf_scheduler_1 = require("../core/raf_scheduler");
const wasm_engine_proxy_1 = require("../trace_processor/wasm_engine_proxy");
const ui_main_1 = require("./ui_main");
const debug_1 = require("./debug");
const error_dialog_1 = require("./error_dialog");
const file_drop_handler_1 = require("./file_drop_handler");
const is_internal_user_script_loader_1 = require("./is_internal_user_script_loader");
const home_page_1 = require("./home_page");
const post_message_handler_1 = require("./post_message_handler");
const router_1 = require("../core/router");
const rpc_http_dialog_1 = require("./rpc_http_dialog");
const trace_url_handler_1 = require("./trace_url_handler");
const viewer_page_1 = require("./viewer_page/viewer_page");
const http_rpc_engine_1 = require("../trace_processor/http_rpc_engine");
const modal_1 = require("../widgets/modal");
const idle_detector_1 = require("./idle_detector");
const app_impl_1 = require("../core/app_impl");
const sql_table_tab_1 = require("../components/details/sql_table_tab");
const extensions_1 = require("../components/extensions");
const debug_tracks_1 = require("../components/tracks/debug_tracks");
const visualized_args_tracks_1 = require("../components/tracks/visualized_args_tracks");
const query_result_tab_1 = require("../components/query_table/query_result_tab");
const assets_1 = require("../base/assets");
const settings_manager_1 = require("../core/settings_manager");
const local_storage_1 = require("../core/local_storage");
const timeline_1 = require("../public/timeline");
const time_1 = require("../base/time");
const theme_provider_1 = require("./theme_provider");
const overlay_container_1 = require("../widgets/overlay_container");
const json_settings_editor_1 = require("../components/json_settings_editor");
const command_manager_1 = require("../core/command_manager");
const CSP_WS_PERMISSIVE_PORT = feature_flags_1.featureFlags.register({
    id: 'cspAllowAnyWebsocketPort',
    name: 'Relax Content Security Policy for 127.0.0.1:*',
    description: 'Allows simultaneous usage of several trace_processor_shell ' +
        '-D --http-port 1234 by opening ' +
        'https://ui.perfetto.dev/#!/?rpc_port=1234',
    defaultValue: false,
});
function routeChange(route) {
    raf_scheduler_1.raf.scheduleFullRedraw(() => {
        if (route.fragment) {
            // This needs to happen after the next redraw call. It's not enough
            // to use setTimeout(..., 0); since that may occur before the
            // redraw scheduled above.
            const e = document.getElementById(route.fragment);
            if (e) {
                e.scrollIntoView();
            }
        }
    });
    (0, trace_url_handler_1.maybeOpenTraceFromRoute)(route);
}
function setupContentSecurityPolicy() {
    // Note: self and sha-xxx must be quoted, urls data: and blob: must not.
    let rpcPolicy = [
        'http://127.0.0.1:9001', // For trace_processor_shell --httpd.
        'ws://127.0.0.1:9001', // Ditto, for the websocket RPC.
        'ws://127.0.0.1:9167', // For Web Device Proxy.
    ];
    if (CSP_WS_PERMISSIVE_PORT.get()) {
        const route = router_1.Router.parseUrl(window.location.href);
        if (/^\d+$/.exec(route.args.rpc_port ?? '')) {
            rpcPolicy = [
                `http://127.0.0.1:${route.args.rpc_port}`,
                `ws://127.0.0.1:${route.args.rpc_port}`,
            ];
        }
    }
    const policy = {
        'default-src': [
            `'self'`,
            // Google Tag Manager bootstrap.
            `'sha256-LirUKeorCU4uRNtNzr8tlB11uy8rzrdmqHCX38JSwHY='`,
        ],
        'script-src': [
            `'self'`,
            // TODO(b/201596551): this is required for Wasm after crrev.com/c/3179051
            // and should be replaced with 'wasm-unsafe-eval'.
            `'unsafe-eval'`,
            'https://*.google.com',
            'https://*.googleusercontent.com',
            'https://www.googletagmanager.com',
            'https://*.google-analytics.com',
        ],
        'object-src': ['none'],
        'connect-src': [
            `'self'`,
            'ws://127.0.0.1:8037', // For the adb websocket server.
            'https://*.google-analytics.com',
            'https://*.googleapis.com', // For Google Cloud Storage fetches.
            'blob:',
            'data:',
        ].concat(rpcPolicy),
        'img-src': [
            `'self'`,
            'data:',
            'blob:',
            'https://*.google-analytics.com',
            'https://www.googletagmanager.com',
            'https://*.googleapis.com',
        ],
        'style-src': [`'self'`, `'unsafe-inline'`],
        'navigate-to': ['https://*.perfetto.dev', 'self'],
    };
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    let policyStr = '';
    for (const [key, list] of Object.entries(policy)) {
        policyStr += `${key} ${list.join(' ')}; `;
    }
    meta.content = policyStr;
    document.head.appendChild(meta);
}
function main() {
    // Setup content security policy before anything else.
    setupContentSecurityPolicy();
    (0, assets_1.initAssets)();
    // Create settings Manager
    const settingsManager = new settings_manager_1.SettingsManagerImpl(new local_storage_1.LocalStorage(settings_manager_1.PERFETTO_SETTINGS_STORAGE_KEY));
    // Initialize core settings...
    const timestampFormatSetting = settingsManager.register({
        id: 'timestampFormat',
        name: 'Timestamp format',
        description: 'The format of timestamps throughout Perfetto.',
        schema: zod_1.default.nativeEnum(timeline_1.TimestampFormat),
        defaultValue: timeline_1.TimestampFormat.Timecode,
    });
    const timezoneOverrideSetting = settingsManager.register({
        id: 'timezoneOverride',
        name: 'Timezone Override',
        description: "When 'Timestamp Format' is set to 'CustomTimezone', this setting controls which timezone is used.",
        schema: zod_1.default.enum(Object.keys(time_1.timezoneOffsetMap)),
        defaultValue: '(UTC+00:00) London, Dublin, Lisbon, Casablanca', // UTC by default.
    });
    const durationPrecisionSetting = settingsManager.register({
        id: 'durationPrecision',
        name: 'Duration precision',
        description: 'The precision of durations throughout Perfetto.',
        schema: zod_1.default.nativeEnum(timeline_1.DurationPrecision),
        defaultValue: timeline_1.DurationPrecision.Full,
    });
    const analyticsSetting = settingsManager.register({
        id: 'analyticsEnable',
        name: 'Enable UI telemetry',
        description: `
      This setting controls whether the Perfetto UI logs coarse-grained
      information about your usage of the UI and any errors encountered. This
      information helps us understand how the UI is being used and allows us to
      better prioritise features and fix bugs. If this option is disabled,
      no information will be logged.

      Note: even if this option is enabled, information about the *contents* of
      traces is *not* logged.

      Note: this setting only has an effect on the ui.perfetto.dev and localhost
      origins: all other origins do not log telemetry even if this option is
      enabled.
    `,
        schema: zod_1.default.boolean(),
        defaultValue: true,
        requiresReload: true,
    });
    const startupCommandsEditor = new json_settings_editor_1.JsonSettingsEditor({
        schema: command_manager_1.commandInvocationArraySchema,
    });
    const startupCommandsSetting = settingsManager.register({
        id: 'startupCommands',
        name: 'Startup Commands',
        description: `
      Commands to run automatically after a trace loads and any saved state is
      restored. These commands execute as if a user manually invoked them after
      the trace is fully ready, making them ideal for automating common
      post-load actions like running queries, expanding tracks, or setting up
      custom views.
    `,
        schema: command_manager_1.commandInvocationArraySchema,
        defaultValue: [],
        render: (setting) => startupCommandsEditor.render(setting),
    });
    const enforceStartupCommandAllowlistSetting = settingsManager.register({
        id: 'enforceStartupCommandAllowlist',
        name: 'Enforce Startup Command Allowlist',
        description: `
      When enabled, only commands in the predefined allowlist can be executed
      as startup commands. When disabled, all startup commands will be
      executed without filtering.

      The command allowlist encodes the set of commands which Perfetto UI
      maintainers expect to maintain backwards compatibility for the forseeable\
      future.

      WARNING: if this setting is disabled, any command outside the allowlist
      has *no* backwards compatibility guarantees and is can change without
      warning at any time.
    `,
        schema: zod_1.default.boolean(),
        defaultValue: true,
    });
    app_impl_1.AppImpl.initialize({
        initialRouteArgs: router_1.Router.parseUrl(window.location.href).args,
        settingsManager,
        timestampFormatSetting,
        durationPrecisionSetting,
        timezoneOverrideSetting,
        analyticsSetting,
        startupCommandsSetting,
        enforceStartupCommandAllowlistSetting,
    });
    // Load the css. The load is asynchronous and the CSS is not ready by the time
    // appendChild returns.
    const cssLoadPromise = (0, deferred_1.defer)();
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = (0, assets_1.assetSrc)('perfetto.css');
    css.onload = () => cssLoadPromise.resolve();
    css.onerror = (err) => cssLoadPromise.reject(err);
    const favicon = document.head.querySelector('#favicon');
    if (favicon instanceof HTMLLinkElement) {
        favicon.href = (0, assets_1.assetSrc)('assets/favicon.png');
    }
    document.head.append(css);
    // Load the script to detect if this is a Googler (see comments on globals.ts)
    // and initialize GA after that (or after a timeout if something goes wrong).
    const app = app_impl_1.AppImpl.instance;
    (0, is_internal_user_script_loader_1.tryLoadIsInternalUserScript)(app).then(() => {
        app.analytics.initialize(app.isInternalUser);
    });
    // Route errors to both the UI bugreport dialog and Analytics (if enabled).
    (0, logging_1.addErrorHandler)(error_dialog_1.maybeShowErrorDialog);
    (0, logging_1.addErrorHandler)((e) => app_impl_1.AppImpl.instance.analytics.logError(e));
    // Add Error handlers for JS error and for uncaught exceptions in promises.
    window.addEventListener('error', (e) => (0, logging_1.reportError)(e));
    window.addEventListener('unhandledrejection', (e) => (0, logging_1.reportError)(e));
    (0, wasm_engine_proxy_1.initWasm)();
    app_impl_1.AppImpl.instance.serviceWorkerController.install();
    // Put debug variables in the global scope for better debugging.
    (0, debug_1.registerDebugGlobals)();
    // Prevent pinch zoom.
    document.body.addEventListener('wheel', (e) => {
        if (e.ctrlKey)
            e.preventDefault();
    }, { passive: false });
    cssLoadPromise.then(() => onCssLoaded());
    if (app_impl_1.AppImpl.instance.testingMode) {
        document.body.classList.add('testing');
    }
    window.waitForPerfettoIdle = (ms) => {
        return new idle_detector_1.IdleDetector().waitForPerfettoIdle(ms);
    };
}
function onCssLoaded() {
    // Clear all the contents of the initial page (e.g. the <pre> error message)
    // And replace it with the root <main> element which will be used by mithril.
    document.body.innerHTML = '';
    const pages = app_impl_1.AppImpl.instance.pages;
    pages.registerPage({ route: '/', render: () => (0, mithril_1.default)(home_page_1.HomePage) });
    pages.registerPage({ route: '/viewer', render: () => (0, viewer_page_1.renderViewerPage)() });
    const router = new router_1.Router();
    router.onRouteChanged = routeChange;
    const themeSetting = app_impl_1.AppImpl.instance.settings.register({
        id: 'theme',
        name: '[Experimental] UI Theme',
        description: 'Warning: Dark mode is not fully supported yet.',
        schema: zod_1.default.enum(['dark', 'light']),
        defaultValue: 'light',
    });
    // Add command to toggle the theme.
    app_impl_1.AppImpl.instance.commands.registerCommand({
        id: 'dev.perfetto.ToggleTheme',
        name: '[Experimental] Toggle UI Theme',
        callback: () => {
            const currentTheme = themeSetting.get();
            themeSetting.set(currentTheme === 'dark' ? 'light' : 'dark');
        },
    });
    // Mount the main mithril component. This also forces a sync render pass.
    raf_scheduler_1.raf.mount(document.body, {
        view: () => (0, mithril_1.default)(theme_provider_1.ThemeProvider, { theme: themeSetting.get() }, [
            (0, mithril_1.default)(overlay_container_1.OverlayContainer, { fillParent: true }, [
                (0, mithril_1.default)(ui_main_1.UiMain, { key: themeSetting.get() }),
            ]),
        ]),
    });
    if ((location.origin.startsWith('http://localhost:') ||
        location.origin.startsWith('http://127.0.0.1:')) &&
        !app_impl_1.AppImpl.instance.embeddedMode &&
        !app_impl_1.AppImpl.instance.testingMode) {
        (0, live_reload_1.initLiveReload)();
    }
    // Will update the chip on the sidebar footer that notifies that the RPC is
    // connected. Has no effect on the controller (which will repeat this check
    // before creating a new engine).
    // Don't auto-open any trace URLs until we get a response here because we may
    // accidentially clober the state of an open trace processor instance
    // otherwise.
    maybeChangeRpcPortFromFragment();
    (0, rpc_http_dialog_1.checkHttpRpcConnection)().then(() => {
        const route = router_1.Router.parseUrl(window.location.href);
        if (!app_impl_1.AppImpl.instance.embeddedMode) {
            (0, file_drop_handler_1.installFileDropHandler)();
        }
        // Don't allow postMessage or opening trace from route when the user says
        // that they want to reuse the already loaded trace in trace processor.
        const traceSource = app_impl_1.AppImpl.instance.trace?.traceInfo.source;
        if (traceSource && traceSource.type === 'HTTP_RPC') {
            return;
        }
        // Add support for opening traces from postMessage().
        window.addEventListener('message', post_message_handler_1.postMessageHandler, { passive: true });
        // Handles the initial ?local_cache_key=123 or ?s=permalink or ?url=...
        // cases.
        routeChange(route);
    });
    // Initialize plugins, now that we are ready to go.
    const pluginManager = app_impl_1.AppImpl.instance.plugins;
    all_core_plugins_1.default.forEach((p) => pluginManager.registerPlugin(p));
    all_plugins_1.default.forEach((p) => pluginManager.registerPlugin(p));
    const route = router_1.Router.parseUrl(window.location.href);
    const overrides = (route.args.enablePlugins ?? '').split(',');
    pluginManager.activatePlugins(overrides);
}
// If the URL is /#!?rpc_port=1234, change the default RPC port.
// For security reasons, this requires toggling a flag. Detect this and tell the
// user what to do in this case.
function maybeChangeRpcPortFromFragment() {
    const route = router_1.Router.parseUrl(window.location.href);
    if (route.args.rpc_port !== undefined) {
        if (!CSP_WS_PERMISSIVE_PORT.get()) {
            (0, modal_1.showModal)({
                title: 'Using a different port requires a flag change',
                content: (0, mithril_1.default)('div', (0, mithril_1.default)('span', 'For security reasons before connecting to a non-standard ' +
                    'TraceProcessor port you need to manually enable the flag to ' +
                    'relax the Content Security Policy and restart the UI.')),
                buttons: [
                    {
                        text: 'Take me to the flags page',
                        primary: true,
                        action: () => router_1.Router.navigate('#!/flags/cspAllowAnyWebsocketPort'),
                    },
                ],
            });
        }
        else {
            http_rpc_engine_1.HttpRpcEngine.rpcPort = route.args.rpc_port;
        }
    }
}
// TODO(primiano): this injection is to break a cirular dependency. See
// comment in sql_table_tab_interface.ts. Remove once we add an extension
// point for context menus.
(0, extensions_1.configureExtensions)({
    addDebugCounterTrack: debug_tracks_1.addDebugCounterTrack,
    addDebugSliceTrack: debug_tracks_1.addDebugSliceTrack,
    addVisualizedArgTracks: visualized_args_tracks_1.addVisualizedArgTracks,
    addLegacySqlTableTab: sql_table_tab_1.addLegacyTableTab,
    addQueryResultsTab: query_result_tab_1.addQueryResultsTab,
});
main();
//# sourceMappingURL=index.js.map