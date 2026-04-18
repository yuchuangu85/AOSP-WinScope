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
exports.AdbWebsocketTarget = void 0;
const result_1 = require("../../../../base/result");
const adb_platform_checks_1 = require("../adb_platform_checks");
const adb_tracing_session_1 = require("../adb_tracing_session");
const adb_websocket_device_1 = require("./adb_websocket_device");
const async_lazy_1 = require("../../../../base/async_lazy");
class AdbWebsocketTarget {
    wsUrl;
    serial;
    model;
    kind = 'LIVE_RECORDING';
    platform = 'ANDROID';
    transportType = 'WebSocket';
    adbDevice = new async_lazy_1.AsyncLazy();
    constructor(wsUrl, serial, model) {
        this.wsUrl = wsUrl;
        this.serial = serial;
        this.model = model;
    }
    get id() {
        return this.serial;
    }
    get name() {
        return `${this.model} [${this.serial}]`;
    }
    get connected() {
        return this.adbDevice.value?.connected ?? false;
    }
    async *runPreflightChecks() {
        yield {
            name: 'WebSocket connection',
            status: await (async () => {
                const status = await this.connectIfNeeded();
                if (!status.ok)
                    return status;
                return (0, result_1.okResult)('connected');
            })(),
        };
        if (this.adbDevice.value === undefined)
            return;
        yield* (0, adb_platform_checks_1.checkAndroidTarget)(this.adbDevice.value);
    }
    async connectIfNeeded() {
        return this.adbDevice.getOrCreate(() => adb_websocket_device_1.AdbWebsocketDevice.connect(this.wsUrl, this.serial, 'WEBSOCKET_BRIDGE'));
    }
    disconnect() {
        // There isn't much to do in this case. If the device is disconnected,
        // the per-stream sockets will be naturally closed by adb. In turn,
        // websocket_bridge will propagate that as a closure of the per-stream
        // WebSockets.
        this.adbDevice.value?.close();
        this.adbDevice.reset();
    }
    async getServiceState() {
        if (this.adbDevice.value === undefined) {
            return (0, result_1.errResult)('WebSocket transport disconnected');
        }
        return (0, adb_tracing_session_1.getAdbTracingServiceState)(this.adbDevice.value);
    }
    async startTracing(traceConfig) {
        const adbDeviceStatus = await this.connectIfNeeded();
        if (!adbDeviceStatus.ok)
            return adbDeviceStatus;
        return await (0, adb_tracing_session_1.createAdbTracingSession)(adbDeviceStatus.value, traceConfig);
    }
}
exports.AdbWebsocketTarget = AdbWebsocketTarget;
//# sourceMappingURL=adb_websocket_target.js.map