"use strict";
// Copyright (C) 2024 The Android Open Source Project
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
exports.TraceImpl = exports.TraceContext = void 0;
const disposable_stack_1 = require("../base/disposable_stack");
const store_1 = require("../base/store");
const timeline_1 = require("./timeline");
const command_manager_1 = require("./command_manager");
const note_manager_1 = require("./note_manager");
const omnibox_manager_1 = require("./omnibox_manager");
const search_manager_1 = require("./search_manager");
const selection_manager_1 = require("./selection_manager");
const tab_manager_1 = require("./tab_manager");
const track_manager_1 = require("./track_manager");
const workspace_manager_1 = require("./workspace_manager");
const scroll_helper_1 = require("./scroll_helper");
const flow_manager_1 = require("./flow_manager");
const plugin_manager_1 = require("./plugin_manager");
const utils_1 = require("../base/utils");
const http_utils_1 = require("../base/http_utils");
const utils_2 = require("../base/utils");
const feature_flags_1 = require("./feature_flags");
const events_1 = require("../base/events");
const statusbar_manager_1 = require("./statusbar_manager");
const minimap_manager_1 = require("./minimap_manager");
const startup_command_allowlist_1 = require("./startup_command_allowlist");
/**
 * Handles the per-trace state of the UI
 * There is an instance of this class per each trace loaded, and typically
 * between 0 and 1 instances in total (% brief moments while we swap traces).
 * 90% of the app state live here, including the Engine.
 * This is the underlying storage for AppImpl, which instead has one instance
 * per trace per plugin.
 */
class TraceContext {
    pluginInstances = new Map();
    appCtx;
    engine;
    omniboxMgr = new omnibox_manager_1.OmniboxManagerImpl();
    searchMgr;
    selectionMgr;
    tabMgr = new tab_manager_1.TabManagerImpl();
    timeline;
    traceInfo;
    trackMgr = new track_manager_1.TrackManagerImpl();
    workspaceMgr = new workspace_manager_1.WorkspaceManagerImpl();
    noteMgr = new note_manager_1.NoteManagerImpl();
    flowMgr;
    pluginSerializableState = (0, store_1.createStore)({});
    scrollHelper;
    trash = new disposable_stack_1.DisposableStack();
    onTraceReady = new events_1.EvtSource();
    statusbarMgr = new statusbar_manager_1.StatusbarManagerImpl();
    minimapManager = new minimap_manager_1.MinimapManagerImpl();
    // List of errors that were encountered while loading the trace by the TS
    // code. These are on top of traceInfo.importErrors, which is a summary of
    // what TraceProcessor reports on the stats table at import time.
    loadingErrors = [];
    constructor(gctx, engine, traceInfo) {
        this.appCtx = gctx;
        this.engine = engine;
        this.trash.use(engine);
        this.traceInfo = traceInfo;
        this.timeline = new timeline_1.TimelineImpl(traceInfo, this.appCtx.timestampFormat, this.appCtx.durationPrecision, this.appCtx.timezoneOverride);
        this.scrollHelper = new scroll_helper_1.ScrollHelper(this.traceInfo, this.timeline, this.workspaceMgr.currentWorkspace, this.trackMgr);
        this.selectionMgr = new selection_manager_1.SelectionManagerImpl(this.engine, this.timeline, this.trackMgr, this.noteMgr, this.scrollHelper, this.onSelectionChange.bind(this));
        this.noteMgr.onNoteDeleted = (noteId) => {
            if (this.selectionMgr.selection.kind === 'note' &&
                this.selectionMgr.selection.id === noteId) {
                this.selectionMgr.clearSelection();
            }
        };
        this.flowMgr = new flow_manager_1.FlowManager(engine.getProxy('FlowManager'), this.trackMgr, this.selectionMgr);
        this.searchMgr = new search_manager_1.SearchManagerImpl({
            timeline: this.timeline,
            trackManager: this.trackMgr,
            engine: this.engine,
            workspace: this.workspaceMgr.currentWorkspace,
            onResultStep: this.onResultStep.bind(this),
        });
    }
    // This method wires up changes to selection to side effects on search and
    // tabs. This is to avoid entangling too many dependencies between managers.
    onSelectionChange(selection, opts) {
        const { clearSearch = true, switchToCurrentSelectionTab = true } = opts;
        if (clearSearch) {
            this.searchMgr.reset();
        }
        if (switchToCurrentSelectionTab && selection.kind !== 'empty') {
            this.tabMgr.showCurrentSelectionTab();
        }
        this.flowMgr.updateFlows(selection);
    }
    onResultStep(searchResult) {
        this.selectionMgr.selectSearchResult(searchResult);
    }
    // Gets or creates an instance of TraceImpl backed by the current TraceContext
    // for the given plugin.
    forPlugin(pluginId) {
        return (0, utils_1.getOrCreate)(this.pluginInstances, pluginId, () => {
            const appForPlugin = this.appCtx.forPlugin(pluginId);
            return new TraceImpl(appForPlugin, this);
        });
    }
    // Called by AppContext.closeCurrentTrace().
    [Symbol.dispose]() {
        this.trash.dispose();
    }
}
exports.TraceContext = TraceContext;
/**
 * This implementation provides the plugin access to trace related resources,
 * such as the engine and the store. This exists for the whole duration a plugin
 * is active AND a trace is loaded.
 * There are N+1 instances of this for each trace, one for each plugin plus one
 * for the core.
 */
class TraceImpl {
    appImpl;
    traceCtx;
    // This is not the original Engine base, rather an EngineProxy based on the
    // same engineBase.
    engineProxy;
    trackMgrProxy;
    commandMgrProxy;
    sidebarProxy;
    pageMgrProxy;
    settingsProxy;
    // This is called by TraceController when loading a new trace, soon after the
    // engine has been set up. It obtains a new TraceImpl for the core. From that
    // we can fork sibling instances (i.e. bound to the same TraceContext) for
    // the various plugins.
    static createInstanceForCore(appImpl, engine, traceInfo) {
        const traceCtx = new TraceContext(appImpl.__appCtxForTrace, engine, traceInfo);
        return traceCtx.forPlugin(plugin_manager_1.CORE_PLUGIN_ID);
    }
    // Only called by TraceContext.forPlugin().
    constructor(appImpl, ctx) {
        const pluginId = appImpl.pluginId;
        this.appImpl = appImpl;
        this.traceCtx = ctx;
        const traceUnloadTrash = ctx.trash;
        // Invalidate all the engine proxies when the TraceContext is destroyed.
        this.engineProxy = ctx.engine.getProxy(pluginId);
        traceUnloadTrash.use(this.engineProxy);
        // Intercept the registerTrack() method to inject the pluginId into tracks.
        this.trackMgrProxy = (0, utils_2.createProxy)(ctx.trackMgr, {
            registerTrack(trackDesc) {
                return ctx.trackMgr.registerTrack({ ...trackDesc, pluginId });
            },
        });
        // CRITICAL ORDER: URL commands MUST execute before settings commands!
        // This ordering has subtle but important implications:
        // - URL commands are trace-specific and should establish initial state
        // - Settings commands are user preferences that should override URL defaults
        // - Changing this order could break trace sharing and user customization
        // DO NOT REORDER without understanding the full impact!
        const urlCommands = (0, command_manager_1.parseUrlCommands)(ctx.appCtx.initialRouteArgs.startupCommands) ?? [];
        const settingsCommands = ctx.appCtx.startupCommandsSetting.get();
        // Filter commands through the allowlist if enforcement is enabled
        const unfilteredCommands = [...urlCommands, ...settingsCommands];
        const enforceAllowlist = ctx.appCtx.enforceStartupCommandAllowlistSetting.get();
        const allStartupCommands = enforceAllowlist
            ? unfilteredCommands.filter((cmd) => (0, startup_command_allowlist_1.isStartupCommandAllowed)(cmd.id))
            : unfilteredCommands;
        // Log any filtered commands for debugging when enforcement is enabled
        if (enforceAllowlist) {
            const filteredOut = unfilteredCommands.filter((cmd) => !(0, startup_command_allowlist_1.isStartupCommandAllowed)(cmd.id));
            if (filteredOut.length > 0) {
                console.warn('The following startup commands were filtered out (not in allowlist):', filteredOut.map((cmd) => `${cmd.id}(${cmd.args.join(', ')})`));
            }
        }
        // CommandManager is global. Here we intercept the registerCommand() because
        // we want any commands registered via the Trace interface to be
        // unregistered when the trace unloads (before a new trace is loaded) to
        // avoid ending up with duplicate commands.
        this.commandMgrProxy = (0, utils_2.createProxy)(ctx.appCtx.commandMgr, {
            registerCommand(cmd) {
                const disposable = appImpl.commands.registerCommand(cmd);
                traceUnloadTrash.use(disposable);
                return disposable;
            },
            hasStartupCommands() {
                return allStartupCommands.length > 0;
            },
            async runStartupCommands() {
                // Execute startup commands in trace context after everything is ready.
                // This simulates user actions taken after trace load is complete,
                // including any saved app state restoration. At this point:
                // - All plugins have loaded and registered their commands
                // - Trace data is fully accessible
                // - UI state has been restored from any saved workspace
                // - Commands can safely query trace data and modify UI state
                for (const command of allStartupCommands) {
                    try {
                        // Execute through proxy to access both global and trace-specific
                        // commands.
                        await ctx.appCtx.commandMgr.runCommand(command.id, ...command.args);
                    }
                    catch (error) {
                        // TODO(stevegolton): Add a mechanism to notify users of startup
                        // command errors. This will involve creating a notification UX
                        // similar to VSCode where there are popups on the bottom right
                        // of the UI.
                        console.warn(`Startup command ${command.id} failed:`, error);
                    }
                }
            },
        });
        // Likewise, remove all trace-scoped sidebar entries when the trace unloads.
        this.sidebarProxy = (0, utils_2.createProxy)(ctx.appCtx.sidebarMgr, {
            addMenuItem(menuItem) {
                const disposable = appImpl.sidebar.addMenuItem(menuItem);
                traceUnloadTrash.use(disposable);
                return disposable;
            },
        });
        this.pageMgrProxy = (0, utils_2.createProxy)(ctx.appCtx.pageMgr, {
            registerPage(pageHandler) {
                const disposable = appImpl.pages.registerPage({
                    ...pageHandler,
                    pluginId: appImpl.pluginId,
                });
                traceUnloadTrash.use(disposable);
                return disposable;
            },
        });
        this.settingsProxy = (0, utils_2.createProxy)(ctx.appCtx.settingsManager, {
            register(setting) {
                const settingInstance = ctx.appCtx.settingsManager.register(setting);
                traceUnloadTrash.use(settingInstance);
                return settingInstance;
            },
        });
    }
    scrollTo(where) {
        this.traceCtx.scrollHelper.scrollTo(where);
    }
    // Creates an instance of TraceImpl backed by the same TraceContext for
    // another plugin. This is effectively a way to "fork" the core instance and
    // create the N instances for plugins.
    forkForPlugin(pluginId) {
        return this.traceCtx.forPlugin(pluginId);
    }
    mountStore(migrate) {
        return this.traceCtx.pluginSerializableState.createSubStore([this.pluginId], migrate);
    }
    getPluginStoreForSerialization() {
        return this.traceCtx.pluginSerializableState;
    }
    async getTraceFile() {
        const src = this.traceInfo.source;
        if (this.traceInfo.downloadable) {
            if (src.type === 'ARRAY_BUFFER') {
                return new Blob([src.buffer]);
            }
            else if (src.type === 'FILE') {
                return src.file;
            }
            else if (src.type === 'URL') {
                return await (0, http_utils_1.fetchWithProgress)(src.url, (progressPercent) => this.omnibox.showStatusMessage(`Downloading trace ${progressPercent}%`));
            }
        }
        // Not available in HTTP+RPC mode. Rather than propagating an undefined,
        // show a graceful error (the ERR:trace_src will be intercepted by
        // error_dialog.ts). We expect all users of this feature to not be able to
        // do anything useful if we returned undefined (other than showing the same
        // dialog).
        // The caller was supposed to check that traceInfo.downloadable === true
        // before calling this. Throwing while downloadable is true is a bug.
        throw new Error(`Cannot getTraceFile(${src.type})`);
    }
    get openerPluginArgs() {
        const traceSource = this.traceCtx.traceInfo.source;
        if (traceSource.type !== 'ARRAY_BUFFER') {
            return undefined;
        }
        const pluginArgs = traceSource.pluginArgs;
        return (pluginArgs ?? {})[this.pluginId];
    }
    get trace() {
        return this;
    }
    get minimap() {
        return this.traceCtx.minimapManager;
    }
    get engine() {
        return this.engineProxy;
    }
    get timeline() {
        return this.traceCtx.timeline;
    }
    get tracks() {
        return this.trackMgrProxy;
    }
    get tabs() {
        return this.traceCtx.tabMgr;
    }
    get workspace() {
        return this.traceCtx.workspaceMgr.currentWorkspace;
    }
    get workspaces() {
        return this.traceCtx.workspaceMgr;
    }
    get search() {
        return this.traceCtx.searchMgr;
    }
    get selection() {
        return this.traceCtx.selectionMgr;
    }
    get traceInfo() {
        return this.traceCtx.traceInfo;
    }
    get statusbar() {
        return this.traceCtx.statusbarMgr;
    }
    get notes() {
        return this.traceCtx.noteMgr;
    }
    get flows() {
        return this.traceCtx.flowMgr;
    }
    get loadingErrors() {
        return this.traceCtx.loadingErrors;
    }
    addLoadingError(err) {
        this.traceCtx.loadingErrors.push(err);
    }
    // App interface implementation.
    get pluginId() {
        return this.appImpl.pluginId;
    }
    get commands() {
        return this.commandMgrProxy;
    }
    get sidebar() {
        return this.sidebarProxy;
    }
    get pages() {
        return this.pageMgrProxy;
    }
    get omnibox() {
        return this.appImpl.omnibox;
    }
    get plugins() {
        return this.appImpl.plugins;
    }
    get analytics() {
        return this.appImpl.analytics;
    }
    get initialRouteArgs() {
        return this.appImpl.initialRouteArgs;
    }
    get initialPluginRouteArgs() {
        return this.appImpl.initialPluginRouteArgs;
    }
    get featureFlags() {
        return {
            register: (settings) => feature_flags_1.featureFlags.register(settings),
        };
    }
    get raf() {
        return this.appImpl.raf;
    }
    navigate(newHash) {
        this.appImpl.navigate(newHash);
    }
    openTraceFromFile(file) {
        this.appImpl.openTraceFromFile(file);
    }
    openTraceFromUrl(url, serializedAppState) {
        this.appImpl.openTraceFromUrl(url, serializedAppState);
    }
    openTraceFromBuffer(args, serializedAppState) {
        this.appImpl.openTraceFromBuffer(args, serializedAppState);
    }
    closeCurrentTrace() {
        this.appImpl.closeCurrentTrace();
    }
    get onTraceReady() {
        return this.traceCtx.onTraceReady;
    }
    get perfDebugging() {
        return this.appImpl.perfDebugging;
    }
    get trash() {
        return this.traceCtx.trash;
    }
    // Nothing other than AppImpl should ever refer to this, hence the __ name.
    get __traceCtxForApp() {
        return this.traceCtx;
    }
    get settings() {
        return this.settingsProxy;
    }
    get isInternalUser() {
        return this.appImpl.isInternalUser;
    }
}
exports.TraceImpl = TraceImpl;
//# sourceMappingURL=trace_impl.js.map