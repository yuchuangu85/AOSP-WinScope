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
exports.AdbWebsocketTargetProvider = void 0;
const tslib_1 = require("tslib");
const result_1 = require("../../../../base/result");
const utils_1 = require("../../../../base/utils");
const async_websocket_1 = require("../../websocket/async_websocket");
const adb_websocket_target_1 = require("./adb_websocket_target");
const adb_websocket_utils_1 = require("./adb_websocket_utils");
const events_1 = require("../../../../base/events");
const websocket_utils_1 = require("../../websocket/websocket_utils");
class AdbWebsocketTargetProvider {
    id = 'adb_websocket';
    name = 'ADB + WebSocket';
    description = 'This option uses the adbd server and can co-exist with other ' +
        'adb-based tools. Requires launching the websocket_bridge on the host.';
    icon = 'lan';
    supportedPlatforms = ['ANDROID'];
    wsHost = '127.0.0.1:8037';
    onTargetsChanged = new events_1.EvtSource();
    targets = new Map();
    async *runPreflightChecks() {
        yield {
            name: 'WebSocket connection',
            status: await (async () => {
                const env_1 = { stack: [], error: void 0, hasError: false };
                try {
                    const sock = tslib_1.__addDisposableResource(env_1, await async_websocket_1.AsyncWebsocket.connect(this.wsUrl), false);
                    return sock
                        ? (0, result_1.okResult)('Connected')
                        : (0, result_1.errResult)(`Failed to connect ${this.wsUrl}. ` +
                            (0, websocket_utils_1.websocketInstructions)('ANDROID'));
                }
                catch (e_1) {
                    env_1.error = e_1;
                    env_1.hasError = true;
                }
                finally {
                    tslib_1.__disposeResources(env_1);
                }
            })(),
        };
    }
    async listTargets() {
        await this.refreshTargets();
        return Array.from(this.targets.values());
    }
    async refreshTargets() {
        const adbDevices = await this.listAdbdDevices();
        // Find and disconnected devices.
        for (const [serial, target] of this.targets.entries()) {
            if (!adbDevices.has(serial)) {
                target.disconnect();
                this.targets.delete(serial);
            }
        }
        // Find new devices.
        for (const [serial, model] of adbDevices.entries()) {
            if (this.targets.has(serial))
                continue; // We already have a target.
            const newTarget = new adb_websocket_target_1.AdbWebsocketTarget(this.wsUrl, serial, model);
            this.targets.set(serial, newTarget);
        }
    }
    // Returns a map of device serial -> product.
    async listAdbdDevices() {
        const env_2 = { stack: [], error: void 0, hasError: false };
        try {
            const devices = new Map();
            const sock = tslib_1.__addDisposableResource(env_2, await async_websocket_1.AsyncWebsocket.connect(this.wsUrl), false);
            if (!sock)
                return devices;
            const status = await (0, adb_websocket_utils_1.adbCmdAndWait)(sock, 'host:devices-l', true);
            if (!status.ok)
                return devices;
            for (const line of status.value.trimEnd().split('\n')) {
                if (line === '')
                    continue;
                const m = line.match(/^([^\s]+)\s+.*model:([^ ]+)/);
                if (!(0, utils_1.exists)(m)) {
                    console.warn('Could not parse ADB device', line);
                    continue;
                }
                const serial = m[1];
                const model = m[2];
                devices.set(serial, model);
            }
            return devices;
        }
        catch (e_2) {
            env_2.error = e_2;
            env_2.hasError = true;
        }
        finally {
            tslib_1.__disposeResources(env_2);
        }
    }
    get wsUrl() {
        return `ws://${this.wsHost}/adb`;
    }
}
exports.AdbWebsocketTargetProvider = AdbWebsocketTargetProvider;
//# sourceMappingURL=adb_websocket_target_provider.js.map