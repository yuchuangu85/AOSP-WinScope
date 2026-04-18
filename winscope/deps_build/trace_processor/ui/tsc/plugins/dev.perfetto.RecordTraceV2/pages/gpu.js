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
exports.gpuRecordSection = gpuRecordSection;
function gpuRecordSection() {
    return {
        kind: 'PROBES_PAGE',
        id: 'gpu',
        title: 'GPU',
        subtitle: 'GPU Frequency, memory',
        icon: 'aspect_ratio',
        probes: [gpuFreq(), gpuMemory(), gpuWorkPeriod()],
    };
}
function gpuFreq() {
    return {
        id: 'gpu_frequency',
        image: 'rec_cpu_freq.png',
        title: 'GPU frequency',
        description: 'Records gpu frequency via ftrace',
        supportedPlatforms: ['ANDROID', 'LINUX', 'CHROME_OS'],
        genConfig: function (tc) {
            tc.addFtraceEvents('power/gpu_frequency');
        },
    };
}
function gpuMemory() {
    return {
        id: 'gpu_memory',
        image: 'rec_gpu_mem_total.png',
        title: 'GPU memory',
        description: 'Allows to track per process and global total GPU memory usages. ' +
            '(Available on recent Android 12+ kernels)',
        supportedPlatforms: ['ANDROID'],
        genConfig: function (tc) {
            tc.addDataSource('android.gpu.memory');
            tc.addFtraceEvents('gpu_mem/gpu_mem_total');
        },
    };
}
function gpuWorkPeriod() {
    return {
        id: 'gpu_work_period',
        title: 'GPU work period',
        description: 'Allows to track per package GPU work.' +
            '(Available on recent Android 14+ kernels)',
        supportedPlatforms: ['ANDROID'],
        genConfig: function (tc) {
            tc.addFtraceEvents('power/gpu_work_period');
        },
    };
}
//# sourceMappingURL=gpu.js.map