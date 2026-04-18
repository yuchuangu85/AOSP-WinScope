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
exports.AdbDevice = void 0;
const deferred_1 = require("../../../base/deferred");
const resizable_array_buffer_1 = require("../../../base/resizable_array_buffer");
const result_1 = require("../../../base/result");
const string_utils_1 = require("../../../base/string_utils");
/**
 * A base abstraction that represents an Android ADB device, allowing to shell
 * commands and create streams (e.g. connecting to a UNIX-socket).
 * This abstraction exists so that AdbTracingSession can drive a tracing session
 * regardless of the underlying Webusb Websocket connection.
 * AdbWebusbDevice and AdbWebsocketDevice implement this.
 * @see @class AdbWebusbDevice
 * @see @class AdbWebsocketDevice
 */
class AdbDevice {
    /** Invoke a command and return its stdout+err. */
    async shell(cmd) {
        const cmdOut = new resizable_array_buffer_1.ResizableArrayBuffer();
        const streamEndedPromise = (0, deferred_1.defer)();
        const status = await this.createStream(`shell:${cmd}`);
        if (!status.ok)
            return status;
        const stream = status.value;
        stream.onData = (data) => cmdOut.append(data);
        stream.onClose = () => {
            streamEndedPromise.resolve((0, string_utils_1.utf8Decode)(cmdOut.get()));
        };
        const outTxt = (await streamEndedPromise).trimEnd();
        return (0, result_1.okResult)(outTxt);
    }
}
exports.AdbDevice = AdbDevice;
//# sourceMappingURL=adb_device.js.map