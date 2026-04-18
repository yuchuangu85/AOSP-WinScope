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
exports.TraceConfigBuilder = exports.DEFAULT_BUFFER_ID = exports.FTRACE_DS = void 0;
const tslib_1 = require("tslib");
const logging_1 = require("../../../base/logging");
const utils_1 = require("../../../base/utils");
const protos_1 = tslib_1.__importDefault(require("../../../protos"));
exports.FTRACE_DS = 'linux.ftrace';
exports.DEFAULT_BUFFER_ID = 'default';
class TraceConfigBuilder {
    buffers = new Map();
    dataSources = new Map();
    // The default values here don't matter, they exist only to make the TS
    // compiler happy. The actual defaults are defined by serialization_schema.ts.
    mode = 'STOP_WHEN_FULL';
    durationMs = 10_000;
    maxFileSizeMb = 0;
    fileWritePeriodMs = 0;
    compression = false;
    constructor() {
        this.buffers.set(exports.DEFAULT_BUFFER_ID, { sizeKb: 64 * 1024 });
    }
    get defaultBuffer() {
        return (0, logging_1.assertExists)(this.buffers.get(exports.DEFAULT_BUFFER_ID));
    }
    // It has get-or-create semantics.
    addDataSource(name, targetBufId) {
        return (0, utils_1.getOrCreate)(this.dataSources, name, () => ({
            targetBufId,
            config: { name },
        })).config;
    }
    addBuffer(id, sizeKb, mode) {
        (0, logging_1.assertFalse)(this.buffers.has(id));
        this.buffers.set(id, { sizeKb, mode });
    }
    addFtraceEvents(...ftraceEvents) {
        const cfg = this.addDataSource('linux.ftrace');
        cfg.ftraceConfig ??= {};
        cfg.ftraceConfig.ftraceEvents ??= [];
        cfg.ftraceConfig.ftraceEvents.push(...ftraceEvents);
    }
    addAtraceApps(...apps) {
        const cfg = this.addDataSource('linux.ftrace');
        cfg.ftraceConfig ??= {};
        cfg.ftraceConfig.atraceApps ??= [];
        cfg.ftraceConfig.atraceApps.push(...apps);
    }
    addAtraceCategories(...cats) {
        const cfg = this.addDataSource('linux.ftrace');
        cfg.ftraceConfig ??= {};
        cfg.ftraceConfig.atraceCategories ??= [];
        cfg.ftraceConfig.atraceCategories.push(...cats);
    }
    toTraceConfig() {
        const traceCfg = new protos_1.default.TraceConfig();
        traceCfg.durationMs = this.durationMs;
        if (this.mode === 'LONG_TRACE') {
            traceCfg.writeIntoFile = true;
            traceCfg.fileWritePeriodMs = this.fileWritePeriodMs;
            traceCfg.maxFileSizeBytes = this.maxFileSizeMb * 1_000_000;
        }
        if (this.compression) {
            traceCfg.compressionType =
                protos_1.default.TraceConfig.CompressionType.COMPRESSION_TYPE_DEFLATE;
        }
        const orderedBufIds = [];
        for (const [id, buf] of this.buffers.entries()) {
            const fillPolicy = buf.mode === 'DISCARD' ||
                (buf.mode === undefined && this.mode === 'STOP_WHEN_FULL')
                ? protos_1.default.TraceConfig.BufferConfig.FillPolicy.DISCARD
                : protos_1.default.TraceConfig.BufferConfig.FillPolicy.RING_BUFFER;
            traceCfg.buffers.push({ sizeKb: buf.sizeKb, fillPolicy });
            orderedBufIds.push(id);
        }
        for (const ds of this.dataSources.values()) {
            let targetBuffer = undefined;
            if (ds.targetBufId !== undefined) {
                targetBuffer = orderedBufIds.indexOf(ds.targetBufId);
                if (targetBuffer < 0) {
                    throw new Error(`DataSource ${ds.config.name} specified buffer id ` +
                        `${ds.targetBufId} but it doesn't exist. ` +
                        `Buffers: [${orderedBufIds.join(',')}]`);
                }
            }
            traceCfg.dataSources.push({ config: { ...ds.config, targetBuffer } });
        }
        return traceCfg;
    }
}
exports.TraceConfigBuilder = TraceConfigBuilder;
//# sourceMappingURL=trace_config_builder.js.map