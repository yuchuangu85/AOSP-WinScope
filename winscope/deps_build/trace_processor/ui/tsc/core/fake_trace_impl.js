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
exports.initializeAppImplForTesting = initializeAppImplForTesting;
exports.createFakeTraceImpl = createFakeTraceImpl;
const tslib_1 = require("tslib");
const zod_1 = tslib_1.__importDefault(require("zod"));
const time_1 = require("../base/time");
const engine_1 = require("../trace_processor/engine");
const app_impl_1 = require("./app_impl");
const in_memory_storage_1 = require("./in_memory_storage");
const settings_manager_1 = require("./settings_manager");
const trace_impl_1 = require("./trace_impl");
const timeline_1 = require("../public/timeline");
const command_manager_1 = require("./command_manager");
let appImplInitialized = false;
function initializeAppImplForTesting() {
    if (!appImplInitialized) {
        appImplInitialized = true;
        const settingsManager = new settings_manager_1.SettingsManagerImpl(new in_memory_storage_1.InMemoryStorage());
        app_impl_1.AppImpl.initialize({
            initialRouteArgs: {},
            settingsManager,
            timestampFormatSetting: settingsManager.register({
                id: 'timestampFormat',
                name: 'Timestamp Format',
                description: '',
                defaultValue: timeline_1.TimestampFormat.Timecode,
                schema: zod_1.default.nativeEnum(timeline_1.TimestampFormat),
            }),
            durationPrecisionSetting: settingsManager.register({
                id: 'durationPrecision',
                name: 'Duration Precision',
                description: '',
                defaultValue: timeline_1.DurationPrecision.Full,
                schema: zod_1.default.nativeEnum(timeline_1.DurationPrecision),
            }),
            timezoneOverrideSetting: settingsManager.register({
                id: 'timezoneOverride',
                name: 'Timezone Override',
                description: 'What timezone to use for displaying timestamps.',
                schema: zod_1.default.enum(['dummy']),
                defaultValue: 'dummy',
            }),
            analyticsSetting: settingsManager.register({
                id: 'analyticsEnable',
                name: 'Enable UI Telemetry',
                description: '',
                schema: zod_1.default.boolean(),
                defaultValue: true,
            }),
            startupCommandsSetting: settingsManager.register({
                id: 'startupCommands',
                name: 'Startup Commands',
                description: '',
                schema: command_manager_1.commandInvocationArraySchema,
                defaultValue: [],
            }),
            enforceStartupCommandAllowlistSetting: settingsManager.register({
                id: 'enforceStartupCommandAllowlist',
                name: 'Enforce Startup Command Allowlist',
                description: '',
                schema: zod_1.default.boolean(),
                defaultValue: true,
            }),
        });
    }
    return app_impl_1.AppImpl.instance;
}
// For testing purposes only.
function createFakeTraceImpl(args = {}) {
    initializeAppImplForTesting();
    const fakeTraceInfo = {
        source: { type: 'URL', url: '' },
        traceTitle: '',
        traceUrl: '',
        start: time_1.Time.fromSeconds(0),
        end: time_1.Time.fromSeconds(10),
        unixOffset: time_1.Time.ZERO,
        tzOffMin: 0,
        cpus: [],
        importErrors: 0,
        traceType: 'proto',
        hasFtrace: false,
        uuid: '',
        cached: false,
        downloadable: false,
    };
    app_impl_1.AppImpl.instance.closeCurrentTrace();
    const trace = trace_impl_1.TraceImpl.createInstanceForCore(app_impl_1.AppImpl.instance, new FakeEngine(args.allowQueries ?? false), fakeTraceInfo);
    app_impl_1.AppImpl.instance.setActiveTrace(trace);
    return trace;
}
class FakeEngine extends engine_1.EngineBase {
    allowQueries;
    mode = 'WASM';
    id = 'TestEngine';
    constructor(allowQueries) {
        super();
        this.allowQueries = allowQueries;
    }
    rpcSendRequestBytes(_data) {
        if (!this.allowQueries) {
            throw new Error('FakeEngine.query() should never be reached. ' +
                'If this is a unittest, try adding {allowQueries: true} to the ' +
                'createFakeTraceImpl() call.');
        }
    }
    [Symbol.dispose]() { }
}
//# sourceMappingURL=fake_trace_impl.js.map