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
exports.parseAdbMsgHdr = parseAdbMsgHdr;
exports.encodeAdbMsg = encodeAdbMsg;
exports.encodeAdbData = encodeAdbData;
exports.adbMsgToString = adbMsgToString;
const logging_1 = require("../../../base/logging");
const object_utils_1 = require("../../../base/object_utils");
const string_utils_1 = require("../../../base/string_utils");
const ADB_MSG_SIZE = 6 * 4; // 6 * int32.
// A brief description of the message can be found here:
// https://android.googlesource.com/platform/system/core/+/main/adb/protocol.txt
//
// struct amessage {
//     uint32_t command;    // command identifier constant
//     uint32_t arg0;       // first argument
//     uint32_t arg1;       // second argument
//     uint32_t data_length;// length of payload (0 is allowed)
//     uint32_t data_check; // checksum of data payload
//     uint32_t magic;      // command ^ 0xffffffff
// };
function parseAdbMsgHdr(dv) {
    (0, logging_1.assertTrue)(dv.byteLength === ADB_MSG_SIZE);
    const cmd = (0, string_utils_1.utf8Decode)(dv.buffer.slice(0, 4));
    const cmdNum = dv.getUint32(0, true);
    const arg0 = dv.getUint32(4, true);
    const arg1 = dv.getUint32(8, true);
    const dataLen = dv.getUint32(12, true);
    const dataChecksum = dv.getUint32(16, true);
    const cmdChecksum = dv.getUint32(20, true);
    const magic = dv.getUint32(20, true);
    (0, logging_1.assertTrue)(magic === (cmdNum ^ 0xffffffff) >>> 0);
    (0, logging_1.assertTrue)(cmdNum === (cmdChecksum ^ 0xffffffff));
    return { cmd, arg0, arg1, dataLen, dataChecksum };
}
function encodeAdbMsg(cmd, arg0, arg1, data, useChecksum = false) {
    const checksum = useChecksum ? generateChecksum(data) : 0;
    const buf = new Uint8Array(ADB_MSG_SIZE);
    const dv = new DataView(buf.buffer);
    for (let i = 0; i < 4; i++) {
        dv.setUint8(i, cmd.charCodeAt(i));
    }
    dv.setUint32(4, arg0, true);
    dv.setUint32(8, arg1, true);
    dv.setUint32(12, data.byteLength, true);
    dv.setUint32(16, checksum, true);
    dv.setUint32(20, dv.getUint32(0, true) ^ 0xffffffff, true);
    return buf;
}
function encodeAdbData(data) {
    if (data === undefined)
        return new Uint8Array([]);
    if ((0, object_utils_1.isString)(data))
        return (0, string_utils_1.utf8Encode)(data + '\0');
    return data;
}
function generateChecksum(data) {
    let res = 0;
    for (let i = 0; i < data.byteLength; i++)
        res += data[i];
    return res & 0xffffffff;
}
function adbMsgToString(msg) {
    return (`cmd=${msg.cmd}, arg0=${msg.arg0}, arg1=${msg.arg1}, ` +
        `cksm=${msg.dataChecksum}, dlen=${msg.dataLen}` +
        ('data' in msg && msg.data !== undefined
            ? `, data=${(0, string_utils_1.binaryEncode)(msg.data)}`
            : ''));
}
//# sourceMappingURL=adb_msg.js.map