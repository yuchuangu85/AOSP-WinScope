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
exports.adbCmdAndWait = adbCmdAndWait;
const logging_1 = require("../../../../base/logging");
const result_1 = require("../../../../base/result");
const websocket_utils_1 = require("../../websocket/websocket_utils");
/**
 * Sends an ADB command over the websocket and waits for an OKAY or FAIL.
 * If `wantResponse` == true, expects a payload after the OKAY.
 * For all intents and purposes, the websocket here is the moral equivalent of
 * talking directly to ADB on 127.0.0.1:5037.
 * See //packages/modules/adb/docs/dev/services.md .
 */
async function adbCmdAndWait(ws, cmd, wantResponse) {
    ws.send((0, websocket_utils_1.prefixWithHexLen)(cmd));
    const hdr = await ws.waitForString(4);
    if (hdr === 'FAIL' || (hdr === 'OKAY' && wantResponse)) {
        const hexLen = await ws.waitForString(4);
        const len = parseInt(hexLen, 16);
        (0, logging_1.assertTrue)(!isNaN(len));
        const payload = await ws.waitForString(len);
        if (hdr === 'OKAY') {
            return (0, result_1.okResult)(payload);
        }
        else {
            return (0, result_1.errResult)(payload);
        }
    }
    else if (hdr === 'OKAY') {
        return (0, result_1.okResult)('');
    }
    else {
        return (0, result_1.errResult)(`ADB protocol error, hdr ${hdr}`);
    }
}
//# sourceMappingURL=adb_websocket_utils.js.map