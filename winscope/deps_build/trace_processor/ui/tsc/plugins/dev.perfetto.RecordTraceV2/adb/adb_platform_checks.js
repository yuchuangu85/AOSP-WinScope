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
exports.checkAndroidTarget = checkAndroidTarget;
const result_1 = require("../../../base/result");
const adb_tracing_session_1 = require("./adb_tracing_session");
/**
 * Common pre-flight checks for Android targets. This function is used by
 * both the AdbWebusbTarget and AdbWebsocketTarget. In both cases we want to
 * perform the same types of checks regardless of the transport.
 * @yields a sequence of pre-flight checks.
 */
async function* checkAndroidTarget(adbDevice) {
    yield {
        name: 'Android version',
        status: await (async () => {
            const status = await adbDevice.shell('getprop ro.build.version.sdk');
            if (!status.ok)
                return status;
            const sdkVer = parseInt(status.value);
            const minApi = 29;
            if (sdkVer < minApi) {
                return (0, result_1.errResult)(`Android API level ${minApi}+ (Q+) required`);
            }
            return (0, result_1.okResult)(`API level ${sdkVer} >= ${minApi}`);
        })(),
    };
    yield {
        name: 'traced running?',
        status: await (async () => {
            const status = await adbDevice.shell('pidof traced');
            if (!status.ok)
                return status;
            if (isFinite(parseInt(status.value))) {
                return (0, result_1.okResult)(`pid = ${status.value}`);
            }
            return (0, result_1.errResult)('Not running. Try `adb shell setprop persist.traced.enable 1`');
        })(),
    };
    const svcStatus = await (0, adb_tracing_session_1.getAdbTracingServiceState)(adbDevice);
    yield {
        name: 'Traced version',
        status: await (async () => {
            if (!svcStatus.ok)
                return svcStatus;
            return (0, result_1.okResult)(svcStatus.value.tracingServiceVersion ?? 'N/A');
        })(),
    };
    if (svcStatus === undefined)
        return;
    yield {
        name: 'Traced state',
        status: await (async () => {
            if (!svcStatus.ok)
                return svcStatus;
            const tss = svcStatus.value;
            return (0, result_1.okResult)(`#producers: ${tss.producers?.length ?? 'N/A'}, ` +
                `#datasources: ${tss.dataSources?.length ?? 'N/A'}, ` +
                `#sessions: ${tss.numSessionsStarted ?? 'N/A'}`);
        })(),
    };
}
//# sourceMappingURL=adb_platform_checks.js.map