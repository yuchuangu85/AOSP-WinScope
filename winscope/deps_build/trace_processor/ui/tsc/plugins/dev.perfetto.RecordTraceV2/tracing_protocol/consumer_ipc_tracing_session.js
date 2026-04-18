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
exports.ConsumerIpcTracingSession = void 0;
const tslib_1 = require("tslib");
const protos_1 = tslib_1.__importDefault(require("../../../protos"));
const events_1 = require("../../../base/events");
const resizable_array_buffer_1 = require("../../../base/resizable_array_buffer");
/**
 * A concrete implementation of {@link TracingSession} over a
 * Perfetto IPC Tracing Procol. This class is suitable for all cases where we
 * are able to obtain, in a way or another, a byte stream to talk to the traced
 * consumer socket.
 */
class ConsumerIpcTracingSession {
    consumerIpc;
    _state = 'RECORDING';
    logs = new Array();
    traceBuf = new resizable_array_buffer_1.ResizableArrayBuffer(64 * 1024);
    onSessionUpdate = new events_1.EvtSource();
    constructor(consumerIpc, traceConfig) {
        this.consumerIpc = consumerIpc;
        this.consumerIpc.onClose = this.onProtocolClose.bind(this);
        this.start(traceConfig);
    }
    get state() {
        return this._state;
    }
    async start(traceConfig) {
        const req = new protos_1.default.EnableTracingRequest({ traceConfig });
        this.log(`Starting trace, durationMs: ${traceConfig.durationMs}`);
        const resp = await this.consumerIpc.invoke('EnableTracing', req);
        this.onTraceStopped(resp.error);
    }
    async stop() {
        if (this._state !== 'RECORDING')
            return;
        this.setState('STOPPING');
        // Initiator=kPerfettoCmd, Reason=kTraceStop. See flush_flags.h.
        const flags = (2 << 4) | 2;
        this.log('Flushing data sources');
        await this.consumerIpc.invoke('Flush', new protos_1.default.FlushRequest({ flags }));
        this.log('Flush complete, stopping trace');
        const disReq = new protos_1.default.DisableTracingRequest({});
        await this.consumerIpc.invoke('DisableTracing', disReq);
    }
    async cancel() {
        if (!['RECORDING', 'STOPPING'].includes(this._state))
            return;
        const req = new protos_1.default.FreeBuffersRequest({});
        await this.consumerIpc.invoke('FreeBuffers', req);
        this.fail('Trace cancelled');
    }
    async getBufferUsagePct() {
        if (this._state !== 'RECORDING')
            return undefined;
        const req = new protos_1.default.GetTraceStatsRequest({});
        const resp = await this.consumerIpc.invoke('GetTraceStats', req);
        let totSize = 0;
        let usedSize = 0;
        for (const buf of resp.traceStats?.bufferStats ?? []) {
            totSize += buf.bufferSize ?? 0;
            // bytesWritten can be >> bufferSize for ring buffer traces.
            usedSize += Math.min(buf.bytesWritten ?? 0, buf.bufferSize ?? 0);
        }
        return Math.min(Math.round((100 * usedSize) / totSize), 100);
    }
    onTraceStopped(error) {
        if (error !== '') {
            this.fail(error);
            return;
        }
        if (this.consumerIpc === undefined) {
            return; // Spurious event after we failed.
        }
        // There is nothing more to do if we arrive here via cancel() or an error.
        if (!['STOPPING', 'RECORDING'].includes(this._state))
            return;
        // We reach this point either:
        // 1. In state == 'RECORDING', if the durationMs expired and the
        //    EnableTracing request is resolved.
        // 2. In state == 'STOPPING', if the user has pressed stop().
        this.setState('STOPPING');
        this.log('Tracing stopped. Reading back data');
        const rbreq = new protos_1.default.ReadBuffersRequest({});
        const stream = this.consumerIpc.invokeStreaming('ReadBuffers', rbreq);
        stream.onTraceData = this.onTraceData.bind(this);
    }
    getTraceData() {
        if (this._state !== 'FINISHED')
            return undefined;
        const buf = this.traceBuf.get();
        return buf;
    }
    onTraceData(packets, hasMore) {
        this.traceBuf.append(packets);
        if (hasMore)
            return;
        this.setState('FINISHED');
        this.consumerIpc?.close();
    }
    onProtocolClose() {
        if (this._state === 'RECORDING') {
            this.setState('ERRORED');
            this.fail('Protocol disconnected');
        }
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
    fail(error) {
        this.log(`Tracing failed: ${error}`, /* isError */ true);
        this.setState('ERRORED');
        this.consumerIpc.close();
    }
}
exports.ConsumerIpcTracingSession = ConsumerIpcTracingSession;
//# sourceMappingURL=consumer_ipc_tracing_session.js.map