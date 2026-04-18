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
exports.bufferConfigPage = bufferConfigPage;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const assets_1 = require("../../../base/assets");
const slider_1 = require("./widgets/slider");
const toggle_1 = require("./widgets/toggle");
function bufferConfigPage(recMgr) {
    return {
        kind: 'SESSION_PAGE',
        id: 'config',
        icon: 'tune',
        title: 'Buffers and duration',
        subtitle: 'Buffer mode, size and duration',
        render() {
            return (0, mithril_1.default)(BufferConfigPage, { recMgr });
        },
        serialize(state) {
            const tc = recMgr.recordConfig.traceConfig;
            state.mode = tc.mode;
            state.bufSizeKb = tc.defaultBuffer.sizeKb;
            state.durationMs = tc.durationMs;
            state.maxFileSizeMb = tc.maxFileSizeMb;
            state.fileWritePeriodMs = tc.fileWritePeriodMs;
            state.compression = tc.compression;
        },
        async deserialize(state) {
            const tc = recMgr.recordConfig.traceConfig;
            tc.mode = state.mode;
            tc.defaultBuffer.sizeKb = state.bufSizeKb;
            tc.durationMs = state.durationMs;
            tc.maxFileSizeMb = state.maxFileSizeMb;
            tc.fileWritePeriodMs = state.fileWritePeriodMs;
            tc.compression = state.compression;
        },
    };
}
class BufferConfigPage {
    bufSize;
    maxDuration;
    maxFileSize;
    flushPeriod;
    compress;
    constructor({ attrs }) {
        const traceCfg = attrs.recMgr.recordConfig.traceConfig;
        this.bufSize = new slider_1.Slider({
            title: 'In-memory buffer size',
            icon: '360',
            values: [4, 8, 16, 32, 64, 128, 256, 512],
            default: traceCfg.defaultBuffer.sizeKb / 1024,
            unit: 'MB',
            onChange: (v) => (traceCfg.defaultBuffer.sizeKb = v * 1024),
        });
        this.maxDuration = new slider_1.Slider({
            title: 'Max duration',
            icon: 'timer',
            values: [S(10), S(15), S(30), S(60), M(5), M(30), H(1), H(6), H(12)],
            default: traceCfg.durationMs,
            isTime: true,
            unit: 'h:m:s',
            onChange: (value) => (traceCfg.durationMs = value),
        });
        this.maxFileSize = new slider_1.Slider({
            title: 'Max file size',
            icon: 'save',
            values: [5, 25, 50, 100, 500, 1000, 1000 * 5, 1000 * 10],
            default: traceCfg.maxFileSizeMb,
            unit: 'MB',
            onChange: (value) => (traceCfg.maxFileSizeMb = value),
        });
        this.flushPeriod = new slider_1.Slider({
            title: 'Flush on disk every',
            icon: 'av_timer',
            values: [100, 250, 500, 1000, 2500, 5000],
            default: traceCfg.fileWritePeriodMs,
            unit: 'ms',
            onChange: (value) => (traceCfg.fileWritePeriodMs = value),
        });
        if (!attrs.recMgr.currentTarget?.emitsCompressedtrace) {
            this.compress = new toggle_1.Toggle({
                title: 'Deflate (gzip) compression ',
                descr: 'Generates smaller trace files at the cost of extra CPU cycles ' +
                    'when stopping the trace. Compression happens only after the end of ' +
                    'the trace and does not improve the ring-buffer efficiency.',
                default: traceCfg.compression,
                onChange: (enabled) => (traceCfg.compression = enabled),
            });
        }
    }
    view({ attrs }) {
        const recCfg = attrs.recMgr.recordConfig;
        return [
            (0, mithril_1.default)('header', 'Recording mode'),
            (0, mithril_1.default)('.record-mode', this.recButton(recCfg, 'STOP_WHEN_FULL', 'Stop when full', 'rec_one_shot.png'), this.recButton(recCfg, 'RING_BUFFER', 'Ring buffer', 'rec_ring_buf.png'), this.recButton(recCfg, 'LONG_TRACE', 'Long trace', 'rec_long_trace.png')),
            this.bufSize.render(),
            this.maxDuration.render(),
            recCfg.traceConfig.mode === 'LONG_TRACE' && this.maxFileSize.render(),
            recCfg.traceConfig.mode === 'LONG_TRACE' && this.flushPeriod.render(),
            this.compress?.render(),
        ];
    }
    recButton(recCfg, mode, title, img) {
        const checkboxArgs = {
            checked: recCfg.traceConfig.mode === mode,
            onchange: (e) => {
                const checked = e.target.checked;
                if (!checked)
                    return;
                recCfg.traceConfig.mode = mode;
                if (mode === 'LONG_TRACE' &&
                    this.maxDuration.value === this.maxDuration.attrs.default) {
                    this.maxDuration.setValue(H(6));
                }
            },
        };
        return (0, mithril_1.default)(`label${recCfg.traceConfig.mode === mode ? '.selected' : ''}`, (0, mithril_1.default)(`input[type=radio][name=rec_mode]`, checkboxArgs), (0, mithril_1.default)(`img[src=${(0, assets_1.assetSrc)(`assets/${img}`)}]`), (0, mithril_1.default)('span', title));
    }
}
const S = (x) => x * 1000;
const M = (x) => x * 1000 * 60;
const H = (x) => x * 1000 * 60 * 60;
//# sourceMappingURL=buffer_config_page.js.map