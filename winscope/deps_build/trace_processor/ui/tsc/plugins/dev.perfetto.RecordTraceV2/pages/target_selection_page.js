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
exports.ObjToId = void 0;
exports.targetSelectionPage = targetSelectionPage;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const segmented_buttons_1 = require("../../../widgets/segmented_buttons");
const target_platform_1 = require("../interfaces/target_platform");
const icon_1 = require("../../../widgets/icon");
const button_1 = require("../../../widgets/button");
const common_1 = require("../../../widgets/common");
const utils_1 = require("../../../base/utils");
const preflight_check_renderer_1 = require("./preflight_check_renderer");
const select_1 = require("../../../widgets/select");
const disposable_stack_1 = require("../../../base/disposable_stack");
const download_utils_1 = require("../../../base/download_utils");
const checkbox_1 = require("../../../widgets/checkbox");
const anchor_1 = require("../../../widgets/anchor");
function targetSelectionPage(recMgr) {
    return {
        kind: 'GLOBAL_PAGE',
        id: 'target',
        icon: 'cable',
        title: 'Target device',
        subtitle: 'Live recording via USB/WebSocket',
        render() {
            return (0, mithril_1.default)(TargetSelectionPage, { recMgr });
        },
        serialize(state) {
            state.target = {
                platformId: recMgr.currentPlatform,
                transportId: recMgr.currentProvider?.id,
                targetId: recMgr.currentTarget?.id,
            };
            state.autoOpenTrace = recMgr.autoOpenTraceWhenTracingEnds;
        },
        async deserialize(state) {
            recMgr.autoOpenTraceWhenTracingEnds = state.autoOpenTrace;
            if (state.target.platformId === undefined)
                return;
            recMgr.setPlatform(state.target.platformId);
            const prov = recMgr.getProvider(state.target.transportId ?? '');
            if (prov === undefined)
                return;
            await recMgr.setProvider(prov);
            if (state.target.targetId === undefined)
                return;
            for (const target of await recMgr.listTargets()) {
                if (target.id === state.target.targetId) {
                    await recMgr.setTarget(target);
                }
            }
        },
    };
}
class TargetSelectionPage {
    view({ attrs }) {
        return [
            (0, mithril_1.default)('header', 'Select platform'),
            (0, mithril_1.default)(segmented_buttons_1.SegmentedButtons, {
                className: 'platform-selector',
                options: target_platform_1.TARGET_PLATFORMS.map((p) => ({ label: p.name, icon: p.icon })),
                selectedOption: target_platform_1.TARGET_PLATFORMS.findIndex((p) => p.id === attrs.recMgr.currentPlatform),
                onOptionSelected: (num) => {
                    attrs.recMgr.setPlatform(target_platform_1.TARGET_PLATFORMS[num].id);
                    // m.redraw();
                },
            }),
            [
                (0, mithril_1.default)(TransportSelector, {
                    recMgr: attrs.recMgr,
                    key: attrs.recMgr.currentPlatform,
                }),
            ],
        ];
    }
}
class TransportSelector {
    transportKeys = new ObjToId();
    view({ attrs }) {
        const options = [];
        for (const provider of attrs.recMgr.listProvidersForCurrentPlatform()) {
            const id = this.transportKeys.getKey(provider);
            options.push([
                (0, mithril_1.default)(`input[type=radio][name=recordingProvider][id=${id}]`, {
                    onchange: async () => {
                        await attrs.recMgr.setProvider(provider);
                        mithril_1.default.redraw();
                    },
                    checked: attrs.recMgr.currentProvider === provider,
                }),
                (0, mithril_1.default)(`label[for=${id}]`, (0, mithril_1.default)(icon_1.Icon, { icon: provider.icon }), (0, mithril_1.default)('.title', provider.name), (0, mithril_1.default)('.description', (0, anchor_1.linkify)(provider.description))),
            ]);
        }
        return [
            (0, mithril_1.default)('header', 'Select transport'),
            (0, mithril_1.default)('fieldset.record-transports', ...options),
            attrs.recMgr.currentProvider && [
                (0, mithril_1.default)(TargetSelector, {
                    recMgr: attrs.recMgr,
                    provider: attrs.recMgr.currentProvider,
                    key: this.transportKeys.getKey(attrs.recMgr.currentProvider),
                }),
            ],
        ];
    }
}
class TargetSelector {
    targetIdMap = new ObjToId();
    checksRenderer;
    trash = new disposable_stack_1.DisposableStack();
    targets = [];
    provider;
    recMgr;
    constructor({ attrs }) {
        this.recMgr = attrs.recMgr;
        this.provider = attrs.provider;
        this.checksRenderer = new preflight_check_renderer_1.PreflightCheckRenderer(attrs.provider);
        this.trash.use(attrs.provider.onTargetsChanged.addListener(() => this.refreshTargets()));
        this.checksRenderer
            .runPreflightChecks() //
            .then(() => this.refreshTargets());
        this.recMgr.listTargets().then((targets) => {
            this.targets = targets;
            mithril_1.default.redraw();
        });
    }
    view({ attrs }) {
        const recMgr = attrs.recMgr;
        return [
            this.checksRenderer.renderTable(),
            (0, mithril_1.default)('header', 'Select target device'),
            (0, mithril_1.default)('.record-targets', (0, mithril_1.default)(select_1.Select, {
                onchange: (e) => {
                    const idx = e.target.selectedIndex;
                    recMgr.setTarget(this.targets[idx]);
                    // m.redraw();
                },
            }, ...this.targets.map((target) => (0, mithril_1.default)('option', { selected: recMgr.currentTarget === target }, target.name))), (0, mithril_1.default)(button_1.Button, {
                icon: 'refresh',
                title: 'Refresh devices',
                onclick: () => {
                    // This forces the TargetDetails component to be re-initialized,
                    // in turn causing the pre-flight checks to be repeated. UX-wise
                    // we want the refresh button to both reload the target list and
                    // also reload the current target.
                    this.targetIdMap.clear();
                    this.refreshTargets();
                },
            }), recMgr.currentTarget &&
                (0, mithril_1.default)(button_1.Button, {
                    icon: recMgr.currentTarget.connected ? 'cancel' : 'power_off',
                    iconFilled: true,
                    disabled: !recMgr.currentTarget.connected,
                    title: recMgr.currentTarget.connected
                        ? 'Disconnect the current device'
                        : 'Device disconnected',
                    onclick: () => recMgr.currentTarget?.disconnect(),
                }), attrs.provider.pairNewTarget &&
                (0, mithril_1.default)(button_1.Button, {
                    label: 'Connect new device',
                    icon: 'add',
                    intent: common_1.Intent.Primary,
                    variant: button_1.ButtonVariant.Filled,
                    onclick: async () => {
                        const target = await attrs.provider.pairNewTarget();
                        target && recMgr.setTarget(target);
                        await this.refreshTargets();
                    },
                })),
            recMgr.currentTarget && [
                (0, mithril_1.default)(TargetDetails, {
                    recMgr: attrs.recMgr,
                    target: recMgr.currentTarget,
                    key: this.targetIdMap.getKey(recMgr.currentTarget),
                }),
            ],
        ];
    }
    onremove() {
        this.trash.dispose();
    }
    async refreshTargets() {
        // Re-triggers refresh and auto-select first valid target.
        this.recMgr.setProvider(this.provider);
        this.targets = await this.recMgr.listTargets();
        mithril_1.default.redraw();
    }
}
class TargetDetails {
    checksRenderer;
    constructor({ attrs }) {
        this.checksRenderer = new preflight_check_renderer_1.PreflightCheckRenderer(attrs.target);
        this.checksRenderer.runPreflightChecks();
    }
    view({ attrs }) {
        return [
            this.checksRenderer?.renderTable(),
            (0, mithril_1.default)(SessionMgmtRenderer, { recMgr: attrs.recMgr, target: attrs.target }),
        ];
    }
}
class SessionMgmtRenderer {
    view({ attrs }) {
        const session = attrs.recMgr.currentSession;
        const isValid = attrs.recMgr.recordConfig.traceConfig.mode !== 'LONG_TRACE';
        const isRecording = session?.state === 'RECORDING';
        return [
            (0, mithril_1.default)('header', 'Tracing session'),
            (0, mithril_1.default)(button_1.ButtonBar, (0, mithril_1.default)(button_1.Button, {
                label: 'Start tracing',
                icon: 'not_started',
                iconFilled: true,
                className: 'start',
                disabled: isRecording || !isValid,
                onclick: () => attrs.recMgr.startTracing().then(() => mithril_1.default.redraw()),
            }), (0, mithril_1.default)(button_1.Button, {
                label: 'Stop',
                icon: 'stop',
                className: 'stop',
                iconFilled: true,
                disabled: !isRecording || !isValid,
                onclick: () => session?.session?.stop().then(() => mithril_1.default.redraw()),
            }), (0, mithril_1.default)(button_1.Button, {
                label: 'Cancel',
                icon: 'cancel',
                className: 'cancel',
                iconFilled: true,
                disabled: !isRecording || !isValid,
                onclick: () => session?.session?.cancel().then(() => mithril_1.default.redraw()),
            }), (0, mithril_1.default)(checkbox_1.Checkbox, {
                label: 'Open trace when done',
                checked: attrs.recMgr.autoOpenTraceWhenTracingEnds,
                onchange: (e) => {
                    attrs.recMgr.autoOpenTraceWhenTracingEnds = Boolean(e.target.checked);
                },
            })),
            session?.error && (0, mithril_1.default)('div', session.error),
            session && [
                (0, mithril_1.default)(SessionStateRenderer, {
                    session,
                    key: session.uuid,
                }),
            ],
        ];
    }
}
class SessionStateRenderer {
    session;
    trash = new disposable_stack_1.DisposableStack();
    bufferUsagePct = 'N/A';
    constructor({ attrs }) {
        this.session = attrs.session;
        this.trash.use(this.pollBufferState());
    }
    pollBufferState() {
        const timerId = window.setInterval(async () => {
            const bufferUsagePct = await this.session.session?.getBufferUsagePct();
            if (bufferUsagePct !== undefined) {
                // Retain the last valid buffer usage in the dialog, so the user can
                // get a sense of overruns even after the trace ends.
                this.bufferUsagePct = `${bufferUsagePct} %`;
            }
            mithril_1.default.redraw();
        }, 1000);
        return {
            [Symbol.dispose]() {
                window.clearInterval(timerId);
            },
        };
    }
    view() {
        const traceData = this.session.isCompleted
            ? this.session.session?.getTraceData()
            : undefined;
        const logs = this.getLogs();
        const eta = this.session.eta;
        return (0, mithril_1.default)('table.session-status', (0, mithril_1.default)('tr', (0, mithril_1.default)('td', 'State'), (0, mithril_1.default)('td', this.session.state)), (0, mithril_1.default)('tr', (0, mithril_1.default)('td', 'Buffer usage'), (0, mithril_1.default)('td', this.bufferUsagePct)), eta && (0, mithril_1.default)('tr', (0, mithril_1.default)('td', 'ETA'), (0, mithril_1.default)('td', eta)), traceData &&
            (0, mithril_1.default)('tr', (0, mithril_1.default)('td', 'Trace file'), (0, mithril_1.default)('td', `${Math.round(traceData.length / 1e3).toLocaleString()} KB`, this.session.isCompressed && ' (compressed)', (0, mithril_1.default)(button_1.Button, {
                label: 'Open',
                icon: 'file_open',
                onclick: () => this.session.openTrace(),
            }), (0, mithril_1.default)(button_1.Button, {
                label: 'Download',
                icon: 'download',
                onclick: () => (0, download_utils_1.download)({
                    fileName: this.session.fileName,
                    content: traceData,
                }),
            }))), logs != '' && (0, mithril_1.default)('tr', (0, mithril_1.default)('td', 'Logs'), (0, mithril_1.default)('td', (0, mithril_1.default)('pre.logs', logs))));
    }
    onremove() {
        this.trash.dispose();
    }
    getLogs() {
        let log = '';
        for (const l of this.session.session?.logs ?? []) {
            const timestamp = l.timestamp.toTimeString().substring(0, 8);
            log += `${timestamp}: ${l.message}\n`;
        }
        return log;
    }
}
/**
 * A utility class to assign unique string IDs to object instances.
 * This is used to generate the key: attr for mithril, for components that take
 * an object instance as attr, to ensure that mithril instantiates a new
 * component when the input object changes.
 * Example:
 * let obj = new MyFoo();
 * const map = new ObjId();
 * console.log(map.getKey(obj));  // Prints 'obj_1'.
 * console.log(map.getKey(obj));  // Prints 'obj_1'.
 * obj = new MyFoo();
 * console.log(map.getKey(obj));  // Prints 'obj_2'.
 */
class ObjToId {
    map = new WeakMap();
    lastId = 0;
    getKey(obj) {
        return (0, utils_1.getOrCreate)(this.map, obj, () => `obj_${++this.lastId}`);
    }
    clear() {
        this.map = new WeakMap();
    }
}
exports.ObjToId = ObjToId;
//# sourceMappingURL=target_selection_page.js.map