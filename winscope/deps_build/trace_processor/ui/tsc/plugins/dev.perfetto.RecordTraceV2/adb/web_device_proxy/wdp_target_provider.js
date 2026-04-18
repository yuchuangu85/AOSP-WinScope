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
exports.WebDeviceProxyTargetProvider = void 0;
const result_1 = require("../../../../base/result");
const async_websocket_1 = require("../../websocket/async_websocket");
const events_1 = require("../../../../base/events");
const wdp_target_1 = require("./wdp_target");
const popup_window_1 = require("../../../../base/popup_window");
const wdp_schema_1 = require("./wdp_schema");
const websocket_utils_1 = require("../../websocket/websocket_utils");
const async_lazy_1 = require("../../../../base/async_lazy");
const WDP_URL = 'https://tools.google.com/dlpage/android_web_device_proxy';
// WDP = Web Device Proxy (go/external-web-device-proxy). This works very
// similarly to our websocket_bridge, with few differences in the handshake.
class WebDeviceProxyTargetProvider {
    id = 'adb_wdp';
    name = 'ADB + WebDeviceProxy';
    description = 'This option uses the adbd server and can co-exist ' +
        'with other adb-based tools. Requires ' +
        WDP_URL +
        '\nGoogle employees: see go/web-device-proxy';
    icon = 'corporate_fare';
    supportedPlatforms = ['ANDROID'];
    onTargetsChanged = new events_1.EvtSource();
    targets = new Map();
    // Wraps the websocket listening for device changes on /track-devices.json.
    trackDevicesConn = new async_lazy_1.AsyncLazy();
    async *runPreflightChecks() {
        const trackDevConn = await this.connectIfNeeded();
        yield {
            name: 'Web Device Proxy',
            status: trackDevConn.ok
                ? (0, result_1.okResult)(`${trackDevConn.value.wdpVersion}`)
                : trackDevConn,
        };
        if (!trackDevConn.ok)
            return;
        yield {
            name: 'List devices',
            status: (0, result_1.okResult)(`${this.targets.size} devices found`),
        };
    }
    async listTargets() {
        await this.connectIfNeeded();
        return Array.from(this.targets.values());
    }
    // Returns the version of WDP (e.g. "androidbuild_web_device_proxy_linux_1.2")
    // if the connection succeeds (and populates this.targets). Otherwise returns
    // an actionable error.
    connectIfNeeded() {
        return this.trackDevicesConn.getOrCreate(async () => {
            const wsUrl = 'ws://127.0.0.1:9167/track-devices-json';
            let aws;
            for (let attempt = 0; attempt < 2; attempt++) {
                aws = await async_websocket_1.AsyncWebsocket.connect(wsUrl);
                if (aws === undefined) {
                    return (0, result_1.errResult)(`Failed to connect to ${wsUrl}. WDP doesn't seem to be running.` +
                        `Follow the instructions on go/web-device-proxy`);
                }
                const respStr = await aws.waitForString();
                const respJson = JSON.parse(respStr);
                const respSchema = wdp_schema_1.WDP_TRACK_DEVICES_SCHEMA.safeParse(respJson);
                if (!respSchema.success) {
                    return (0, result_1.errResult)(`Failed to parse ${respStr}: ${respSchema.error}`);
                }
                const resp = respSchema.data;
                if (resp.error?.type === 'ORIGIN_NOT_ALLOWLISTED' &&
                    resp.error.approveUrl !== undefined) {
                    // This happens the very first time we use WDP. It just tells us we
                    // need to show a popup to let the user allow us to talk to WDP.
                    const popup = await (0, popup_window_1.showPopupWindow)({ url: resp.error.approveUrl });
                    if (popup === false) {
                        return (0, result_1.errResult)('You need to enable popups and try again');
                    }
                    continue; // Do another attempt now that the user allowed the origin.
                }
                else if (resp.error !== undefined) {
                    return (0, result_1.errResult)(resp.error.message ?? 'Unknown WDP Error');
                }
                // No error, we got a valid connection with some deviceInfo.
                // We want to parse the first response we got and also keep listening
                // for updates that will come in future.
                const ws = aws.release();
                ws.onclose = () => this.destroyTrackDevicesConnection();
                ws.onerror = () => this.destroyTrackDevicesConnection();
                ws.onmessage = (e) => {
                    const resp = wdp_schema_1.WDP_TRACK_DEVICES_SCHEMA.safeParse(JSON.parse(e.data));
                    if (resp.success) {
                        this.onTrackDevicesResponse(resp.data);
                    }
                    else {
                        console.error(`Invalid WDP response ${e.data} : ${resp.error}`);
                    }
                };
                const connResult = {
                    wdpVersion: resp.version ?? 'N/A',
                    ws,
                };
                this.onTrackDevicesResponse(resp);
                return (0, result_1.okResult)(connResult);
            } // for(attempt)
            return (0, result_1.errResult)('Failed all attempts to authenticate on WDP.' +
                'You must click allow on the popup to use WDP.');
        });
    }
    destroyTrackDevicesConnection() {
        const ws = this.trackDevicesConn.value?.ws;
        this.trackDevicesConn.reset();
        ws && (0, websocket_utils_1.disposeWebsocket)(ws);
    }
    // This function is called every time /track-devices-json sends a new message,
    // typically every time there is a device {dis,}connection.
    onTrackDevicesResponse(resp) {
        if (resp.error !== undefined) {
            this.destroyTrackDevicesConnection();
            return;
        }
        // Build a map (serial -> device) from the response array.
        const curDevs = new Map((resp.device ?? []).map((d) => [d.serialNumber, d]));
        // Identify and disconnected devices that are no longer connected.
        for (const [serial, target] of this.targets.entries()) {
            if (!curDevs.has(serial)) {
                target.disconnect();
                this.targets.delete(serial);
            }
        }
        // Identify new devices.
        for (const [serial, devJson] of curDevs.entries()) {
            const existingDevice = this.targets.get(serial);
            if (existingDevice !== undefined) {
                // We saw the device already and have created a WdpDeviceProxyTarget.
                // The only thing we need to do is to update its descriptor, as the
                // device might transition between UNAUTHORIZED <> OFFLINE <> DEVICE.
                existingDevice.updateWdpState(devJson);
            }
            else {
                const wsUrl = 'ws://127.0.0.1:9167/adb-json';
                const newTarget = new wdp_target_1.WebDeviceProxyTarget(wsUrl, devJson);
                this.targets.set(serial, newTarget);
            }
        }
        this.onTargetsChanged.notify();
    }
}
exports.WebDeviceProxyTargetProvider = WebDeviceProxyTargetProvider;
//# sourceMappingURL=wdp_target_provider.js.map