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
exports.AdbWebsocketDevice = void 0;
const result_1 = require("../../../../base/result");
const websocket_stream_1 = require("../../websocket/websocket_stream");
const adb_device_1 = require("../adb_device");
const adb_websocket_utils_1 = require("./adb_websocket_utils");
const async_websocket_1 = require("../../websocket/async_websocket");
/**
 * This class implements the state machine required to communicate with an ADB
 * device over WebSocket using either the Perfetto websocket_bridge or the
 * Google Web Device Proxy. The two are almost identical with the exception of
 * the initial handshake.
 * It takes a websocket url as input (which behind the scenes is a plain
 * bridge to adbd TCP on 127.0.0.1:5037) and a device serial and returns an
 * object suitable to run shell commands and create streams on it.
 */
class AdbWebsocketDevice extends adb_device_1.AdbDevice {
    wsUrl;
    deviceSerial;
    transportSock;
    mode;
    streams = new Array();
    constructor(wsUrl, deviceSerial, 
    // This socket is only used to tell if we are still connected or not.
    // Each stream needs a new websocket because of the way the ADB TCP protocol
    // works.
    transportSock, mode) {
        super();
        this.wsUrl = wsUrl;
        this.deviceSerial = deviceSerial;
        this.transportSock = transportSock;
        this.mode = mode;
    }
    static async connect(wsUrl, deviceSerial, mode) {
        const status = await this.connectToTransport(wsUrl, deviceSerial, mode);
        if (!status.ok)
            return status;
        const sock = status.value;
        return (0, result_1.okResult)(new AdbWebsocketDevice(wsUrl, deviceSerial, sock, mode));
    }
    static async connectToTransport(wsUrl, deviceSerial, mode) {
        const sock = await async_websocket_1.AsyncWebsocket.connect(wsUrl);
        if (sock === undefined) {
            return (0, result_1.errResult)(`Connection to ${wsUrl} failed`);
        }
        if (mode === 'WEBSOCKET_BRIDGE') {
            const transport = `host:transport:${deviceSerial}`;
            const status = await (0, adb_websocket_utils_1.adbCmdAndWait)(sock, transport, false);
            if (!status.ok)
                return status;
        }
        return (0, result_1.okResult)(sock);
    }
    async createStream(svc) {
        const connRes = await AdbWebsocketDevice.connectToTransport(this.wsUrl, this.deviceSerial, this.mode);
        if (!connRes.ok)
            return connRes;
        const sock = connRes.value;
        if (this.mode === 'WEBSOCKET_BRIDGE') {
            const status = await (0, adb_websocket_utils_1.adbCmdAndWait)(sock, svc, false);
            if (!status.ok)
                return status;
        }
        else if (this.mode === 'WEB_DEVICE_PROXY') {
            sock.send(JSON.stringify({
                header: {
                    serialNumber: this.deviceSerial,
                    command: svc,
                },
            }));
        }
        const stream = new websocket_stream_1.WebSocketStream(sock.release());
        this.streams.push(stream);
        return (0, result_1.okResult)(stream);
    }
    get connected() {
        return this.transportSock.connected;
    }
    close() {
        this.transportSock.close();
        this.streams.forEach((s) => s.close());
        this.streams.splice(0);
    }
}
exports.AdbWebsocketDevice = AdbWebsocketDevice;
//# sourceMappingURL=adb_websocket_device.js.map