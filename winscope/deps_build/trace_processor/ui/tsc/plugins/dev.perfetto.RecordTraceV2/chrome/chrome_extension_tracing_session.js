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
exports.ChromeExtensionTracingSession = void 0;
const tslib_1 = require("tslib");
const protos_1 = tslib_1.__importDefault(require("../../../protos"));
const events_1 = require("../../../base/events");
const resizable_array_buffer_1 = require("../../../base/resizable_array_buffer");
const string_utils_1 = require("../../../base/string_utils");
const deferred_1 = require("../../../base/deferred");
class ChromeExtensionTracingSession {
    target;
    _state = 'RECORDING';
    logs = new Array();
    traceBuf = new resizable_array_buffer_1.ResizableArrayBuffer(64 * 1024);
    onSessionUpdate = new events_1.EvtSource();
    pendingBufferUsage = new Array();
    constructor(target, traceConfig) {
        this.target = target;
        this.start(traceConfig);
    }
    async start(traceConfig) {
        const requestData = protos_1.default.EnableTracingRequest.encode({
            traceConfig,
        }).finish();
        this.target.invokeExtensionMethod('EnableTracing', requestData);
    }
    async stop() {
        this.target.invokeExtensionMethod('DisableTracing');
        this.setState('STOPPING');
    }
    async cancel() {
        this.target.invokeExtensionMethod('FreeBuffers');
        this.setState('STOPPING');
    }
    async getBufferUsagePct() {
        if (this._state !== 'RECORDING')
            return undefined;
        const promise = (0, deferred_1.defer)();
        this.pendingBufferUsage.push(promise);
        this.target.invokeExtensionMethod('GetTraceStats');
        return promise;
    }
    getTraceData() {
        if (this._state !== 'FINISHED')
            return undefined;
        const buf = this.traceBuf.get();
        return buf;
    }
    onExtensionMessage(msgType, msg) {
        switch (msgType) {
            case 'ChromeExtensionError':
                const err = msg.error;
                this.log(`Tracing failed: ${err}`, /* isError */ true);
                if (this._state !== 'FINISHED') {
                    // Ignore spurious errors that arrive after the session finishes.
                    this.setState('ERRORED');
                    this.target.disconnect();
                }
                break;
            case 'ChromeExtensionStatus':
                const status = msg.status;
                this.log(status);
                break;
            case 'EnableTracingResponse':
                this.target.invokeExtensionMethod('ReadBuffers');
                this.setState('STOPPING');
                break;
            case 'GetTraceStatsResponse':
                const statResp = msg;
                let totSize = 0;
                let usedSize = 0;
                for (const buf of statResp.traceStats?.bufferStats ?? []) {
                    totSize += buf.bufferSize ?? 0;
                    // bytesWritten can be >> bufferSize for ring buffer traces.
                    usedSize += Math.min(buf.bytesWritten ?? 0, buf.bufferSize ?? 0);
                }
                const pct = Math.min(Math.round((100 * usedSize) / totSize), 100);
                for (const promise of this.pendingBufferUsage.splice(0)) {
                    promise.resolve(pct);
                }
                break;
            case 'ReadBuffersResponse':
                // The extension is really misusing the ReadBuffersResponse:
                // - Data is a binary string, not a Uint8Array
                // - The field 'lastSliceForPacket' is really 'lastPacketInTrace'.
                // - Slices are really packets and don't need preambles.
                // See http://shortn/_53WB8A1aIr.
                const resp = msg;
                let eof = false;
                for (const slice of resp.slices ?? []) {
                    const data = (0, string_utils_1.binaryDecode)(slice.data);
                    this.traceBuf.append(data);
                    eof = Boolean(slice.lastSliceForPacket);
                    if (eof) {
                        this.setState('FINISHED');
                        this.target.invokeExtensionMethod('FreeBuffers');
                        break;
                    }
                }
                break;
        }
    }
    get state() {
        return this._state;
    }
    setState(newState) {
        this._state = newState;
        this.onSessionUpdate.notify();
    }
    log(message, isError = false) {
        this.logs.push({
            message,
            timestamp: new Date(),
            isError,
        });
        this.onSessionUpdate.notify();
    }
}
exports.ChromeExtensionTracingSession = ChromeExtensionTracingSession;
//# sourceMappingURL=chrome_extension_tracing_session.js.map