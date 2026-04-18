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
exports.stackSamplingRecordSection = stackSamplingRecordSection;
const tslib_1 = require("tslib");
const string_utils_1 = require("../../../base/string_utils");
const protos_1 = tslib_1.__importDefault(require("../../../protos"));
const slider_1 = require("./widgets/slider");
const textarea_1 = require("./widgets/textarea");
function stackSamplingRecordSection() {
    return {
        kind: 'PROBES_PAGE',
        id: 'stack_sampling',
        title: 'Stack sampling',
        subtitle: 'Lightweight cpu profiling',
        icon: 'full_stacked_bar_chart',
        probes: [tracedPerf()],
    };
}
function tracedPerf() {
    const settings = {
        samplingFreq: new slider_1.Slider({
            title: 'Sampling frequency',
            cssClass: '.thin',
            default: 100,
            values: [1, 10, 50, 100, 250, 500, 1000],
            unit: 'Hz',
        }),
        procs: new textarea_1.Textarea({
            placeholder: 'Filters for processes to profile, one per line e.g.' +
                'com.android.phone\nlmkd\ncom.android.webview:sandboxed_process*',
        }),
    };
    return {
        id: 'traced_perf',
        title: 'Callstack sampling',
        image: 'rec_profiling.png',
        description: 'Periodically records the current callstack (chain of ' +
            'function calls) of processes.',
        supportedPlatforms: ['ANDROID', 'LINUX'],
        settings,
        genConfig: function (tc) {
            const s = settings;
            const pkgs = (0, string_utils_1.splitLinesNonEmpty)(s.procs.text);
            tc.addDataSource('linux.perf').perfEventConfig = {
                timebase: {
                    frequency: s.samplingFreq.value,
                    timestampClock: protos_1.default.PerfEvents.PerfClock.PERF_CLOCK_MONOTONIC,
                },
                callstackSampling: {
                    scope: pkgs.length > 0
                        ? {
                            targetCmdline: pkgs,
                        }
                        : undefined,
                },
            };
        },
    };
}
//# sourceMappingURL=stack_sampling.js.map