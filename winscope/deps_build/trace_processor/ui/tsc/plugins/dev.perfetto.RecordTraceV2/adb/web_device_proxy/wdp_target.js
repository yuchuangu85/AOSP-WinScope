"use strict";
// Copyright (C) 2025 The Android Open Source Project
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
exports.WebDeviceProxyTarget = void 0;
const result_1 = require("../../../../base/result");
const adb_platform_checks_1 = require("../adb_platform_checks");
const adb_tracing_session_1 = require("../adb_tracing_session");
const adb_websocket_device_1 = require("../websocket/adb_websocket_device");
const async_lazy_1 = require("../../../../base/async_lazy");
const popup_window_1 = require("../../../../base/popup_window");
const deferred_1 = require("../../../../base/deferred");
class WebDeviceProxyTarget {
    wsUrl;
    devJson;
    kind = 'LIVE_RECORDING';
    platform = 'ANDROID';
    adbDevice = new async_lazy_1.AsyncLazy();
    id;
    constructor(wsUrl, devJson) {
        this.wsUrl = wsUrl;
        this.devJson = devJson;
        this.id = this.devJson.serialNumber;
        this.updateWdpState(devJson);
    }
    // This is called by WdpTragetProvider every time a state change is received.
    // The challenge here is that we have two websockets: a global one to list
    // devices via /track-devices-json owned by WdpTargetProvider; a per-device
    // one to /adb-json owned by us. Unfortunately the status updates are sent via
    // the former, so we need WdpTargetProvider to inform us about state changes.
    updateWdpState(devJson) {
        this.devJson = devJson;
    }
    // Returns a successful Result if the device is ready to trace, or an error
    // Result if the device is in a state we don't recognize.
    deviceReady() {
        // The return string is the same both in case of success or failure.
        const status = `proxyStatus=${this.devJson.proxyStatus} ` +
            ` adbStatus=${this.devJson.adbStatus}`;
        if (this.devJson.proxyStatus === 'ADB' &&
            this.devJson.adbStatus === 'DEVICE') {
            return (0, result_1.okResult)(status);
        }
        return (0, result_1.errResult)(status);
    }
    get name() {
        if (this.devJson.proxyStatus === 'ADB') {
            if (this.devJson.adbStatus === 'DEVICE') {
                return `${this.devJson.adbProps?.model ?? '?'} [${this.id}]`;
            }
            return `${this.devJson.adbStatus} [${this.id}]`;
        }
        return `${this.devJson.proxyStatus} [${this.id}]`;
    }
    get connected() {
        return this.adbDevice.value?.connected ?? false;
    }
    async *runPreflightChecks() {
        await this.connectIfNeeded();
        yield {
            name: 'Web Device Proxy',
            status: this.deviceReady(),
        };
        if (this.adbDevice.value === undefined)
            return;
        yield* (0, adb_platform_checks_1.checkAndroidTarget)(this.adbDevice.value);
    }
    async connectIfNeeded() {
        return this.adbDevice.getOrCreate(async () => {
            for (let attempt = 0; attempt < 2; attempt++) {
                if (this.devJson.proxyStatus === 'PROXY_UNAUTHORIZED') {
                    const res = await (0, popup_window_1.showPopupWindow)({ url: this.devJson.approveUrl });
                    if (!res) {
                        return (0, result_1.errResult)('Enable popups and try again');
                    }
                    // At this point either the device transitions into the authorized
                    // state or some error state. Give some time for the WDP to reach the
                    // final state, whatever it is. If we remove this delay we'll see a
                    // device in a 'AUTHORIZING' state and won't be able to progress.
                    // If this time is not enough, the user will have to manually press
                    // on the refresh button to re-run the pre-flight checks and get the
                    // most up-to-date state.
                    const wait = (0, deferred_1.defer)();
                    setTimeout(() => wait.resolve(), 250);
                    await wait;
                }
                const ready = this.deviceReady();
                if (!ready.ok)
                    return ready;
                return adb_websocket_device_1.AdbWebsocketDevice.connect(this.wsUrl, this.id, 'WEB_DEVICE_PROXY');
            } // for(attempt)
            return (0, result_1.errResult)('WDP authorization failed. Follow the WDP popup, ' +
                'authorize access and try again');
        });
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
exports.WebDeviceProxyTarget = WebDeviceProxyTarget;
//# sourceMappingURL=wdp_target.js.map