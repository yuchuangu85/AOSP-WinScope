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
exports.AdbWebusbTarget = void 0;
const adb_tracing_session_1 = require("../adb_tracing_session");
const adb_webusb_device_1 = require("./adb_webusb_device");
const adb_webusb_utils_1 = require("./adb_webusb_utils");
const result_1 = require("../../../../base/result");
const adb_platform_checks_1 = require("../adb_platform_checks");
const async_lazy_1 = require("../../../../base/async_lazy");
class AdbWebusbTarget {
    usbiface;
    adbKeyMgr;
    kind = 'LIVE_RECORDING';
    platform = 'ANDROID';
    transportType = 'WebUSB';
    adbDevice = new async_lazy_1.AsyncLazy();
    constructor(usbiface, adbKeyMgr) {
        this.usbiface = usbiface;
        this.adbKeyMgr = adbKeyMgr;
    }
    async *runPreflightChecks() {
        const status = await this.connectIfNeeded();
        yield {
            name: 'WebUSB connection',
            status: await (async () => {
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
        return this.adbDevice.getOrCreate(() => adb_webusb_device_1.AdbWebusbDevice.connect(this.usbiface.dev, this.adbKeyMgr));
    }
    get connected() {
        return this.adbDevice.value?.connected ?? false;
    }
    get id() {
        return (0, adb_webusb_utils_1.usbDeviceToStr)(this.usbiface.dev);
    }
    get name() {
        const dev = this.usbiface.dev;
        return `${dev.productName} [${dev.serialNumber}]`;
    }
    async getServiceState() {
        if (this.adbDevice.value === undefined) {
            return (0, result_1.errResult)('WebUSB transport disconnected');
        }
        return (0, adb_tracing_session_1.getAdbTracingServiceState)(this.adbDevice.value);
    }
    async startTracing(traceConfig) {
        const adbDeviceStatus = await this.connectIfNeeded();
        if (!adbDeviceStatus.ok)
            return adbDeviceStatus;
        return await (0, adb_tracing_session_1.createAdbTracingSession)(adbDeviceStatus.value, traceConfig);
    }
    disconnect() {
        this.adbDevice.value?.close();
        this.adbDevice.reset();
    }
}
exports.AdbWebusbTarget = AdbWebusbTarget;
//# sourceMappingURL=adb_webusb_target.js.map