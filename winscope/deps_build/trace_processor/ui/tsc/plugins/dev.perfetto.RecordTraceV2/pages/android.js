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
exports.androidRecordSection = androidRecordSection;
const tslib_1 = require("tslib");
const string_utils_1 = require("../../../base/string_utils");
const protos_1 = tslib_1.__importDefault(require("../../../protos"));
const multiselect_1 = require("./widgets/multiselect");
const slider_1 = require("./widgets/slider");
const textarea_1 = require("./widgets/textarea");
const toggle_1 = require("./widgets/toggle");
function androidRecordSection() {
    return {
        kind: 'PROBES_PAGE',
        id: 'android',
        title: 'Android apps & svcs',
        subtitle: 'Android-specific data sources',
        icon: 'android',
        probes: [
            atrace(),
            logcat(),
            frameTimeline(),
            gameInterventions(),
            netTracing(),
            statsdAtoms(),
        ],
    };
}
function atrace() {
    const settings = {
        categories: new multiselect_1.TypedMultiselect({
            options: new Map(Object.entries(ATRACE_CATEGORIES).map(([id, name]) => [
                `${id}: ${name}`,
                id,
            ])),
        }),
        apps: new textarea_1.Textarea({
            title: 'Process / package names to trace',
            placeholder: 'e.g. system_server\ncom.android.settings',
        }),
        allApps: new toggle_1.Toggle({
            title: 'Record events from all Android apps and services',
            cssClass: '.thin',
            onChange(allAppsEnabled) {
                settings.apps.attrs.disabled = allAppsEnabled;
            },
        }),
    };
    return {
        id: 'atrace',
        title: 'Atrace userspace annotations',
        image: 'rec_atrace.png',
        description: 'Enables C++ / Java codebase annotations (ATRACE_BEGIN() / os.Trace())',
        supportedPlatforms: ['ANDROID'],
        settings,
        genConfig: function (tc) {
            tc.addAtraceCategories(...settings.categories.selectedValues());
            if (settings.allApps.enabled) {
                tc.addAtraceApps('*');
            }
            else {
                for (const line of (0, string_utils_1.splitLinesNonEmpty)(settings.apps.text)) {
                    tc.addAtraceApps(line);
                }
            }
            if (settings.categories.selectedKeys().length > 0 ||
                settings.allApps.enabled) {
                tc.addFtraceEvents('ftrace/print');
            }
        },
    };
}
function logcat() {
    const settings = {
        buffers: new multiselect_1.TypedMultiselect({
            options: new Map(Object.entries({
                'Crash': protos_1.default.AndroidLogId.LID_CRASH,
                'Main': protos_1.default.AndroidLogId.LID_DEFAULT,
                'Binary events': protos_1.default.AndroidLogId.LID_EVENTS,
                'Kernel': protos_1.default.AndroidLogId.LID_KERNEL,
                'Radio': protos_1.default.AndroidLogId.LID_RADIO,
                'Security': protos_1.default.AndroidLogId.LID_SECURITY,
                'Stats': protos_1.default.AndroidLogId.LID_STATS,
                'System': protos_1.default.AndroidLogId.LID_SYSTEM,
            })),
        }),
    };
    return {
        id: 'logcat',
        title: 'Event log (logcat)',
        image: 'rec_logcat.png',
        description: 'Streams the event log into the trace. If no buffer filter is ' +
            'specified, all buffers are selected.',
        supportedPlatforms: ['ANDROID'],
        settings,
        genConfig: function (tc) {
            const logIds = settings.buffers.selectedValues();
            tc.addDataSource('android.log').androidLogConfig = {
                logIds: logIds.length > 0 ? logIds : undefined,
            };
        },
    };
}
function frameTimeline() {
    return {
        id: 'android_frame_timeline',
        title: 'Frame timeline',
        description: 'Records expected/actual frame timings from surface_flinger.' +
            'Requires Android 12 (S) or above.',
        supportedPlatforms: ['ANDROID'],
        docsLink: 'https://perfetto.dev/docs/data-sources/frametimeline',
        genConfig: function (tc) {
            tc.addDataSource('android.surfaceflinger.frametimeline');
        },
    };
}
function gameInterventions() {
    return {
        id: 'android_game_interventions',
        title: 'Game intervention list',
        description: 'List game modes and interventions. Requires Android 13 (T) or above.',
        supportedPlatforms: ['ANDROID'],
        docsLink: 'https://perfetto.dev/docs/data-sources/android-game-intervention-list',
        genConfig: function (tc) {
            tc.addDataSource('android.game_interventions');
        },
    };
}
function netTracing() {
    const settings = { pollMs: new slider_1.Slider(slider_1.POLL_INTERVAL_SLIDER) };
    return {
        id: 'network_tracing',
        title: 'Network Tracing',
        description: 'Records detailed information on network packets. ' +
            'Requires Android 14 (U) or above',
        supportedPlatforms: ['ANDROID'],
        settings,
        genConfig: function (tc) {
            tc.addDataSource('android.network_packets').networkPacketTraceConfig = {
                pollMs: settings.pollMs.value,
            };
            // Allows mapping packet uids to package names.
            tc.addDataSource('android.packages_list');
        },
    };
}
function statsdAtoms() {
    const settings = {
        pushAtoms: new multiselect_1.TypedMultiselect({
            title: 'Push atoms',
            options: new Map(Object.entries(protos_1.default.AtomId)
                .filter(([_, v]) => typeof v === 'number' && v > 2 && v < 9999)
                .map(([k, v]) => [k, v])),
        }),
        rawPushIds: new textarea_1.Textarea({
            placeholder: 'Add raw pushed atoms IDs, one per line, e.g.:\n' + '818\n' + '819',
        }),
        pullAtoms: new multiselect_1.TypedMultiselect({
            title: 'Pull atoms',
            options: new Map(Object.entries(protos_1.default.AtomId)
                .filter(([_, v]) => typeof v === 'number' && v > 10000 && v < 99999)
                .map(([k, v]) => [k, v])),
        }),
        rawPullIds: new textarea_1.Textarea({
            placeholder: 'Add raw pulled atom IDs, one per line, e.g.:\n10063\n10064\n',
        }),
        pullInterval: new slider_1.Slider({ ...slider_1.POLL_INTERVAL_SLIDER, default: 5000 }),
        pullPkg: new textarea_1.Textarea({
            placeholder: 'Add pulled atom packages, one per line, e.g.:\n' +
                'com.android.providers.telephony',
        }),
    };
    return {
        id: 'statsd',
        title: 'Statsd atoms',
        description: 'Record instances of statsd atoms to the Statsd Atoms track.',
        supportedPlatforms: ['ANDROID'],
        docsLink: 'https://cs.android.com/android/platform/superproject/main/+/main:frameworks/proto_logging/stats/atoms.proto',
        settings,
        genConfig: function (tc) {
            const pkg = (0, string_utils_1.splitLinesNonEmpty)(settings.pullPkg.text);
            const pullIds = settings.pullAtoms.selectedValues();
            const rawPullIds = (0, string_utils_1.splitLinesNonEmpty)(settings.rawPullIds.text).map((l) => parseInt(l.trim()));
            const hasPull = pullIds.length > 0 || rawPullIds.length > 0;
            tc.addDataSource('android.statsd').statsdTracingConfig = {
                pushAtomId: settings.pushAtoms.selectedValues(),
                rawPushAtomId: (0, string_utils_1.splitLinesNonEmpty)(settings.rawPushIds.text).map((l) => parseInt(l.trim())),
                pullConfig: hasPull
                    ? [
                        {
                            pullAtomId: pullIds,
                            rawPullAtomId: rawPullIds,
                            pullFrequencyMs: settings.pullInterval.value,
                            packages: pkg.length > 0 ? pkg : undefined,
                        },
                    ]
                    : undefined,
            };
        },
    };
}
const ATRACE_CATEGORIES = {
    adb: 'ADB',
    aidl: 'AIDL calls',
    am: 'Activity Manager',
    audio: 'Audio',
    binder_driver: 'Binder Kernel driver',
    binder_lock: 'Binder global lock trace',
    bionic: 'Bionic C library',
    camera: 'Camera',
    dalvik: 'ART & Dalvik',
    database: 'Database',
    gfx: 'Graphics',
    hal: 'Hardware Modules',
    input: 'Input',
    network: 'Network',
    nnapi: 'Neural Network API',
    pm: 'Package Manager',
    power: 'Power Management',
    res: 'Resource Loading',
    rro: 'Resource Overlay',
    rs: 'RenderScript',
    sm: 'Sync Manager',
    ss: 'System Server',
    vibrator: 'Vibrator',
    video: 'Video',
    view: 'View System',
    webview: 'WebView',
    wm: 'Window Manager',
};
//# sourceMappingURL=android.js.map