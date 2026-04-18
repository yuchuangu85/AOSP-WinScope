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
exports.TracedWebsocketTarget = void 0;
const tslib_1 = require("tslib");
const protos_1 = tslib_1.__importDefault(require("../../../protos"));
const result_1 = require("../../../base/result");
const async_websocket_1 = require("../websocket/async_websocket");
const websocket_utils_1 = require("../websocket/websocket_utils");
const consumer_ipc_tracing_session_1 = require("../tracing_protocol/consumer_ipc_tracing_session");
const websocket_stream_1 = require("../websocket/websocket_stream");
const tracing_protocol_1 = require("../tracing_protocol/tracing_protocol");
const utils_1 = require("../../../base/utils");
const async_lazy_1 = require("../../../base/async_lazy");
class TracedWebsocketTarget {
    wsUrl;
    kind = 'LIVE_RECORDING';
    platform = 'LINUX';
    transportType = 'WebSocket';
    // This Consumer connection is only used to detect the connection state and
    // to query servce state. each new tracing session creates a new instance,
    // because consumer connections in traced are single-use.
    mgmtConsumer = new async_lazy_1.AsyncLazy();
    /**
     * @param wsUrl 'ws://127.0.0.1:8037/traced'
     */
    constructor(wsUrl) {
        this.wsUrl = wsUrl;
    }
    get id() {
        return this.wsUrl;
    }
    get name() {
        return this.wsUrl;
    }
    get connected() {
        return this.mgmtConsumer.value?.connected ?? false;
    }
    async *runPreflightChecks() {
        const status = await this.connectIfNeeded();
        yield {
            name: 'WebSocket connection',
            status: (() => {
                if (!status.ok)
                    return status;
                return (0, result_1.okResult)('Connected');
            })(),
        };
        if (!this.connected)
            return;
        const svcStatus = await this.getServiceState();
        yield {
            name: 'Traced version',
            status: (() => {
                if (!svcStatus.ok)
                    return svcStatus;
                return (0, result_1.okResult)(svcStatus.value.tracingServiceVersion ?? 'N/A');
            })(),
        };
        if (svcStatus === undefined)
            return;
        yield {
            name: 'Traced state',
            status: (() => {
                if (!svcStatus.ok)
                    return svcStatus;
                const tss = svcStatus.value;
                return (0, result_1.okResult)(`#producers: ${tss.producers?.length ?? 'N/A'}, ` +
                    `#datasources: ${tss.dataSources?.length ?? 'N/A'}, ` +
                    `#sessions: ${tss.numSessionsStarted ?? 'N/A'}`);
            })(),
        };
    }
    async connectIfNeeded() {
        return this.mgmtConsumer.getOrCreate(() => this.createConsumerIpcChannel());
    }
    disconnect() {
        this.mgmtConsumer.value?.close();
        this.mgmtConsumer.reset();
    }
    async getServiceState() {
        const ipcStatus = await this.connectIfNeeded();
        if (!ipcStatus.ok)
            return ipcStatus;
        const consumerIpc = ipcStatus.value;
        const req = new protos_1.default.QueryServiceStateRequest({});
        const rpcCall = consumerIpc.invokeStreaming('QueryServiceState', req);
        const resp = await rpcCall.promise;
        if (!(0, utils_1.exists)(resp.serviceState)) {
            return (0, result_1.errResult)('Failed to decode QueryServiceStateResponse');
        }
        return (0, result_1.okResult)(resp.serviceState);
    }
    async startTracing(traceConfig) {
        const ipcStatus = await this.createConsumerIpcChannel();
        if (!ipcStatus.ok)
            return ipcStatus;
        const consumerIpc = ipcStatus.value;
        const session = new consumer_ipc_tracing_session_1.ConsumerIpcTracingSession(consumerIpc, traceConfig);
        return (0, result_1.okResult)(session);
    }
    async createConsumerIpcChannel() {
        const maybeSock = await async_websocket_1.AsyncWebsocket.connect(this.wsUrl);
        if (maybeSock == undefined) {
            return (0, result_1.errResult)(`Failed to connect ${this.wsUrl}. ${(0, websocket_utils_1.websocketInstructions)()}`);
        }
        const stream = new websocket_stream_1.WebSocketStream(maybeSock.release());
        const consumerIpc = await tracing_protocol_1.TracingProtocol.create(stream);
        return (0, result_1.okResult)(consumerIpc);
    }
}
exports.TracedWebsocketTarget = TracedWebsocketTarget;
//# sourceMappingURL=traced_websocket_target.js.map