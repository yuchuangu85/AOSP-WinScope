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
exports.CONSUMER_SOCKET = void 0;
exports.createAdbTracingSession = createAdbTracingSession;
exports.getAdbTracingServiceState = getAdbTracingServiceState;
const tslib_1 = require("tslib");
const protos_1 = tslib_1.__importDefault(require("../../../protos"));
const tracing_protocol_1 = require("../tracing_protocol/tracing_protocol");
const result_1 = require("../../../base/result");
const utils_1 = require("../../../base/utils");
const consumer_ipc_tracing_session_1 = require("../tracing_protocol/consumer_ipc_tracing_session");
exports.CONSUMER_SOCKET = '/dev/socket/traced_consumer';
async function createAdbTracingSession(adbDevice, traceConfig) {
    const streamStatus = await adbDevice.createStream(`localfilesystem:${exports.CONSUMER_SOCKET}`);
    if (!streamStatus.ok)
        return streamStatus;
    const stream = streamStatus.value;
    const consumerIpc = await tracing_protocol_1.TracingProtocol.create(stream);
    const session = new consumer_ipc_tracing_session_1.ConsumerIpcTracingSession(consumerIpc, traceConfig);
    return (0, result_1.okResult)(session);
}
async function getAdbTracingServiceState(adbDevice) {
    const env_1 = { stack: [], error: void 0, hasError: false };
    try {
        const sock = exports.CONSUMER_SOCKET;
        const status = await adbDevice.createStream(`localfilesystem:${sock}`);
        if (!status.ok) {
            return (0, result_1.errResult)(`Failed to connect to ${sock}: ${status.error}`);
        }
        const stream = status.value;
        const consumerPort = tslib_1.__addDisposableResource(env_1, await tracing_protocol_1.TracingProtocol.create(stream), false);
        const req = new protos_1.default.QueryServiceStateRequest({});
        const rpcCall = consumerPort.invokeStreaming('QueryServiceState', req);
        const resp = await rpcCall.promise;
        if (!(0, utils_1.exists)(resp.serviceState)) {
            return (0, result_1.errResult)('Failed to decode QueryServiceStateResponse');
        }
        return (0, result_1.okResult)(resp.serviceState);
    }
    catch (e_1) {
        env_1.error = e_1;
        env_1.hasError = true;
    }
    finally {
        tslib_1.__disposeResources(env_1);
    }
}
//# sourceMappingURL=adb_tracing_session.js.map