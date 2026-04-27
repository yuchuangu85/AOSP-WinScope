"use strict";
// Copyright (C) 2023 The Android Open Source Project
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
exports.UiMainPerTrace = exports.UiMain = void 0;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const disposable_stack_1 = require("../base/disposable_stack");
const dom_utils_1 = require("../base/dom_utils");
const fuzzy_1 = require("../base/fuzzy");
const logging_1 = require("../base/logging");
const semantic_icons_1 = require("../base/semantic_icons");
const string_utils_1 = require("../base/string_utils");
const query_result_tab_1 = require("../components/query_table/query_result_tab");
const app_impl_1 = require("../core/app_impl");
const cookie_consent_1 = require("../core/cookie_consent");
const feature_flags_1 = require("../core/feature_flags");
const omnibox_manager_1 = require("../core/omnibox_manager");
const anchor_1 = require("../widgets/anchor");
const button_1 = require("../widgets/button");
const hotkey_context_1 = require("../widgets/hotkey_context");
const hotkey_glyphs_1 = require("../widgets/hotkey_glyphs");
const linear_progress_1 = require("../widgets/linear_progress");
const modal_1 = require("../widgets/modal");
const spinner_1 = require("../widgets/spinner");
const css_constants_1 = require("./css_constants");
const help_modal_1 = require("./help_modal");
const omnibox_1 = require("./omnibox");
const sidebar_1 = require("./sidebar");
const statusbar_1 = require("./statusbar");
const task_tracker_1 = require("./task_tracker");
const topbar_1 = require("./topbar");
const showStatusBarFlag = feature_flags_1.featureFlags.register({
    id: 'Enable status bar',
    description: 'Enable status bar at the bottom of the window',
    defaultValue: true,
});
const OMNIBOX_INPUT_REF = 'omnibox';
// This wrapper creates a new instance of UiMainPerTrace for each new trace
// loaded (including the case of no trace at the beginning).
class UiMain {
    oncreate({ dom }) {
        (0, css_constants_1.initCssConstants)(dom);
    }
    view() {
        const currentTraceId = app_impl_1.AppImpl.instance.trace?.engine.engineId ?? '';
        return [(0, mithril_1.default)(UiMainPerTrace, { key: currentTraceId })];
    }
}
exports.UiMain = UiMain;
// This components gets destroyed and recreated every time the current trace
// changes. Note that in the beginning the current trace is undefined.
class UiMainPerTrace {
    // NOTE: this should NOT need to be an AsyncDisposableStack. If you feel the
    // need of making it async because you want to clean up SQL resources, that
    // will cause bugs (see comments in oncreate()).
    trash = new disposable_stack_1.DisposableStack();
    omniboxInputEl;
    recentCommands = [];
    trace;
    // This function is invoked once per trace.
    constructor() {
        const app = app_impl_1.AppImpl.instance;
        const trace = app.trace;
        this.trace = trace;
        // Register global commands (commands that are useful even without a trace
        // loaded).
        const globalCmds = [
            {
                id: 'dev.perfetto.OpenCommandPalette',
                name: 'Open command palette',
                callback: () => app.omnibox.setMode(omnibox_manager_1.OmniboxMode.Command),
                defaultHotkey: '!Mod+Shift+P',
            },
            {
                id: 'dev.perfetto.ShowHelp',
                name: 'Show help',
                callback: () => (0, help_modal_1.toggleHelp)(),
                defaultHotkey: '?',
            },
        ];
        globalCmds.forEach((cmd) => {
            this.trash.use(app.commands.registerCommand(cmd));
        });
        // When the UI loads there is no trace. There is no point registering
        // commands or anything in this state as they will be useless.
        if (trace === undefined)
            return;
        document.title = `${trace.traceInfo.traceTitle || 'Trace'} - Perfetto UI`;
        this.maybeShowJsonWarning();
    }
    renderOmnibox() {
        const omnibox = app_impl_1.AppImpl.instance.omnibox;
        const omniboxMode = omnibox.mode;
        const statusMessage = omnibox.statusMessage;
        if (statusMessage !== undefined) {
            return (0, mithril_1.default)(`.pf-omnibox.pf-omnibox--message-mode`, (0, mithril_1.default)(`input[readonly][disabled][ref=omnibox]`, {
                value: '',
                placeholder: statusMessage,
            }));
        }
        else if (omniboxMode === omnibox_manager_1.OmniboxMode.Command) {
            return this.renderCommandOmnibox();
        }
        else if (omniboxMode === omnibox_manager_1.OmniboxMode.Prompt) {
            return this.renderPromptOmnibox();
        }
        else if (omniboxMode === omnibox_manager_1.OmniboxMode.Query) {
            return this.renderQueryOmnibox();
        }
        else if (omniboxMode === omnibox_manager_1.OmniboxMode.Search) {
            return this.renderSearchOmnibox();
        }
        else {
            (0, logging_1.assertUnreachable)(omniboxMode);
        }
    }
    renderPromptOmnibox() {
        const omnibox = app_impl_1.AppImpl.instance.omnibox;
        const prompt = (0, logging_1.assertExists)(omnibox.pendingPrompt);
        let options = undefined;
        if (prompt.options) {
            const fuzzy = new fuzzy_1.FuzzyFinder(prompt.options, ({ displayName }) => displayName);
            const result = fuzzy.find(omnibox.text);
            options = result.map((result) => {
                return {
                    key: result.item.key,
                    displayName: result.segments,
                };
            });
        }
        return (0, mithril_1.default)(omnibox_1.Omnibox, {
            value: omnibox.text,
            placeholder: prompt.text,
            inputRef: OMNIBOX_INPUT_REF,
            extraClasses: 'pf-omnibox--prompt-mode',
            closeOnOutsideClick: true,
            options,
            selectedOptionIndex: omnibox.selectionIndex,
            onSelectedOptionChanged: (index) => {
                omnibox.setSelectionIndex(index);
            },
            onInput: (value) => {
                omnibox.setText(value);
                omnibox.setSelectionIndex(0);
            },
            onSubmit: (value, _alt) => {
                omnibox.resolvePrompt(value);
            },
            onClose: () => {
                omnibox.rejectPrompt();
            },
        });
    }
    renderCommandOmnibox() {
        // Fuzzy-filter commands by the filter string.
        const { commands, omnibox } = app_impl_1.AppImpl.instance;
        const filteredCmds = commands.fuzzyFilterCommands(omnibox.text);
        // Create an array of commands with attached heuristics from the recent
        // command register.
        const commandsWithHeuristics = filteredCmds.map((cmd) => {
            return {
                recentsIndex: this.recentCommands.findIndex((id) => id === cmd.id),
                cmd,
            };
        });
        // Sort recentsIndex first
        const sorted = commandsWithHeuristics.sort((a, b) => {
            if (b.recentsIndex === a.recentsIndex) {
                // If recentsIndex is the same, retain original sort order
                return 0;
            }
            else {
                return b.recentsIndex - a.recentsIndex;
            }
        });
        const options = sorted.map(({ recentsIndex, cmd }) => {
            const { segments, id, defaultHotkey } = cmd;
            return {
                key: id,
                displayName: segments,
                tag: recentsIndex !== -1 ? 'recently used' : undefined,
                rightContent: defaultHotkey && (0, mithril_1.default)(hotkey_glyphs_1.HotkeyGlyphs, { hotkey: defaultHotkey }),
            };
        });
        return (0, mithril_1.default)(omnibox_1.Omnibox, {
            value: omnibox.text,
            placeholder: 'Filter commands...',
            inputRef: OMNIBOX_INPUT_REF,
            extraClasses: 'pf-omnibox--command-mode',
            options,
            closeOnSubmit: true,
            closeOnOutsideClick: true,
            selectedOptionIndex: omnibox.selectionIndex,
            onSelectedOptionChanged: (index) => {
                omnibox.setSelectionIndex(index);
            },
            onInput: (value) => {
                omnibox.setText(value);
                omnibox.setSelectionIndex(0);
            },
            onClose: () => {
                if (this.omniboxInputEl) {
                    this.omniboxInputEl.blur();
                }
                omnibox.reset();
            },
            onSubmit: (key) => {
                this.addRecentCommand(key);
                commands.runCommand(key);
            },
            onGoBack: () => {
                omnibox.reset();
            },
        });
    }
    addRecentCommand(id) {
        this.recentCommands = this.recentCommands.filter((x) => x !== id);
        this.recentCommands.push(id);
        while (this.recentCommands.length > 6) {
            this.recentCommands.shift();
        }
    }
    renderQueryOmnibox() {
        const ph = 'e.g. select * from sched left join thread using(utid) limit 10';
        return (0, mithril_1.default)(omnibox_1.Omnibox, {
            value: app_impl_1.AppImpl.instance.omnibox.text,
            placeholder: ph,
            inputRef: OMNIBOX_INPUT_REF,
            extraClasses: 'pf-omnibox--query-mode',
            onInput: (value) => {
                app_impl_1.AppImpl.instance.omnibox.setText(value);
            },
            onSubmit: (query, alt) => {
                const config = {
                    query: (0, string_utils_1.undoCommonChatAppReplacements)(query),
                    title: alt ? 'Pinned query' : 'Omnibox query',
                };
                const tag = alt ? undefined : 'omnibox_query';
                if (this.trace === undefined)
                    return; // No trace loaded
                (0, query_result_tab_1.addQueryResultsTab)(this.trace, config, tag);
            },
            onClose: () => {
                app_impl_1.AppImpl.instance.omnibox.setText('');
                if (this.omniboxInputEl) {
                    this.omniboxInputEl.blur();
                }
                app_impl_1.AppImpl.instance.omnibox.reset();
            },
            onGoBack: () => {
                app_impl_1.AppImpl.instance.omnibox.reset();
            },
        });
    }
    renderSearchOmnibox() {
        return (0, mithril_1.default)(omnibox_1.Omnibox, {
            value: app_impl_1.AppImpl.instance.omnibox.text,
            placeholder: "Search or type '>' for commands or ':' for SQL mode",
            inputRef: OMNIBOX_INPUT_REF,
            onInput: (value, _prev) => {
                if (value === '>') {
                    app_impl_1.AppImpl.instance.omnibox.setMode(omnibox_manager_1.OmniboxMode.Command);
                    return;
                }
                else if (value === ':') {
                    app_impl_1.AppImpl.instance.omnibox.setMode(omnibox_manager_1.OmniboxMode.Query);
                    return;
                }
                app_impl_1.AppImpl.instance.omnibox.setText(value);
                if (this.trace === undefined)
                    return; // No trace loaded.
                if (value.length >= 4) {
                    this.trace.search.search(value);
                }
                else {
                    this.trace.search.reset();
                }
            },
            onClose: () => {
                if (this.omniboxInputEl) {
                    this.omniboxInputEl.blur();
                }
            },
            onSubmit: (value, _mod, shift) => {
                if (this.trace === undefined)
                    return; // No trace loaded.
                this.trace.search.search(value);
                if (shift) {
                    this.trace.search.stepBackwards();
                }
                else {
                    this.trace.search.stepForward();
                }
                if (this.omniboxInputEl) {
                    this.omniboxInputEl.blur();
                }
            },
            rightContent: this.renderStepThrough(),
        });
    }
    renderStepThrough() {
        const children = [];
        const results = this.trace?.search.searchResults;
        if (this.trace?.search.searchInProgress) {
            children.push((0, mithril_1.default)('.pf-omnibox__stepthrough-current', (0, mithril_1.default)(spinner_1.Spinner)));
        }
        else if (results !== undefined) {
            const searchMgr = (0, logging_1.assertExists)(this.trace).search;
            const index = searchMgr.resultIndex;
            const total = results.totalResults ?? 0;
            children.push((0, mithril_1.default)('.pf-omnibox__stepthrough-current', `${total === 0 ? '0 / 0' : `${index + 1} / ${total}`}`), (0, mithril_1.default)(button_1.Button, {
                onclick: () => searchMgr.stepBackwards(),
                icon: 'keyboard_arrow_left',
            }), (0, mithril_1.default)(button_1.Button, {
                onclick: () => searchMgr.stepForward(),
                icon: 'keyboard_arrow_right',
            }));
        }
        return (0, mithril_1.default)('.pf-omnibox__stepthrough', children);
    }
    oncreate(vnode) {
        this.updateOmniboxInputRef(vnode.dom);
        this.maybeFocusOmnibar();
    }
    view() {
        const app = app_impl_1.AppImpl.instance;
        const hotkeys = [];
        for (const { id, defaultHotkey } of app.commands.commands) {
            if (defaultHotkey) {
                hotkeys.push({
                    callback: () => app.commands.runCommand(id),
                    hotkey: defaultHotkey,
                });
            }
        }
        const isSomethingLoading = app_impl_1.AppImpl.instance.isLoadingTrace ||
            (this.trace?.engine.numRequestsPending ?? 0) > 0 ||
            task_tracker_1.taskTracker.hasPendingTasks();
        return (0, mithril_1.default)(hotkey_context_1.HotkeyContext, { hotkeys }, (0, mithril_1.default)('main.pf-ui-main', (0, mithril_1.default)(sidebar_1.Sidebar, { trace: this.trace }), (0, mithril_1.default)(topbar_1.Topbar, {
            omnibox: this.renderOmnibox(),
            trace: this.trace,
        }), (0, mithril_1.default)(linear_progress_1.LinearProgress, {
            className: 'pf-ui-main__loading',
            state: isSomethingLoading ? 'indeterminate' : 'none',
        }), (0, mithril_1.default)('.pf-ui-main__page-container', app.pages.renderPageForCurrentRoute()), (0, mithril_1.default)(cookie_consent_1.CookieConsent), (0, modal_1.maybeRenderFullscreenModalDialog)(), showStatusBarFlag.get() && (0, statusbar_1.renderStatusBar)(app.trace), app.perfDebugging.renderPerfStats()));
    }
    onupdate({ dom }) {
        this.updateOmniboxInputRef(dom);
        this.maybeFocusOmnibar();
    }
    onremove(_) {
        this.omniboxInputEl = undefined;
        // NOTE: if this becomes ever an asyncDispose(), then the promise needs to
        // be returned to onbeforeremove, so mithril delays the removal until
        // the promise is resolved, but then also the UiMain wrapper needs to be
        // more complex to linearize the destruction of the old instane with the
        // creation of the new one, without overlaps.
        // However, we should not add disposables that issue cleanup queries on the
        // Engine. Doing so is: (1) useless: we throw away the whole wasm instance
        // on each trace load, so what's the point of deleting tables from a TP
        // instance that is going to be destroyed?; (2) harmful: we don't have
        // precise linearization with the wasm teardown, so we might end up awaiting
        // forever for the asyncDispose() because the query will never run.
        this.trash.dispose();
    }
    updateOmniboxInputRef(dom) {
        const el = (0, dom_utils_1.findRef)(dom, OMNIBOX_INPUT_REF);
        if (el && el instanceof HTMLInputElement) {
            this.omniboxInputEl = el;
        }
    }
    maybeFocusOmnibar() {
        if (app_impl_1.AppImpl.instance.omnibox.focusOmniboxNextRender) {
            const omniboxEl = this.omniboxInputEl;
            if (omniboxEl) {
                omniboxEl.focus();
                if (app_impl_1.AppImpl.instance.omnibox.pendingCursorPlacement === undefined) {
                    omniboxEl.select();
                }
                else {
                    omniboxEl.setSelectionRange(app_impl_1.AppImpl.instance.omnibox.pendingCursorPlacement, app_impl_1.AppImpl.instance.omnibox.pendingCursorPlacement);
                }
            }
            app_impl_1.AppImpl.instance.omnibox.clearFocusFlag();
        }
    }
    async maybeShowJsonWarning() {
        // Show warning if the trace is in JSON format.
        const isJsonTrace = this.trace?.traceInfo.traceType === 'json';
        const SHOWN_JSON_WARNING_KEY = 'shownJsonWarning';
        if (!isJsonTrace ||
            window.localStorage.getItem(SHOWN_JSON_WARNING_KEY) === 'true' ||
            app_impl_1.AppImpl.instance.embeddedMode) {
            // When in embedded mode, the host app will control which trace format
            // it passes to Perfetto, so we don't need to show this warning.
            return;
        }
        // Save that the warning has been shown. Value is irrelevant since only
        // the presence of key is going to be checked.
        window.localStorage.setItem(SHOWN_JSON_WARNING_KEY, 'true');
        (0, modal_1.showModal)({
            title: 'Warning',
            content: (0, mithril_1.default)('div', (0, mithril_1.default)('span', 'Perfetto UI features are limited for JSON traces. ', 'We recommend recording ', (0, mithril_1.default)(anchor_1.Anchor, {
                href: 'https://perfetto.dev/docs/quickstart/chrome-tracing',
                icon: semantic_icons_1.Icons.ExternalLink,
            }, 'proto-format traces'), ' from Chrome.'), (0, mithril_1.default)('br')),
        });
    }
}
exports.UiMainPerTrace = UiMainPerTrace;
//# sourceMappingURL=ui_main.js.map