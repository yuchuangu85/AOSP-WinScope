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
exports.WDP_TRACK_DEVICES_SCHEMA = void 0;
const zod_1 = require("zod");
// This file defines the JSON schema of the responses to the /track-devices-json
// websocket endpoint. See google's internal web_device_proxy.proto for the
// source of truth.
const WDP_DEVICE_SCHEMA = zod_1.z
    .object({
    serialNumber: zod_1.z.string(),
})
    .and(zod_1.z.union([
    zod_1.z.object({
        proxyStatus: zod_1.z.literal('ADB'),
        adbStatus: zod_1.z.string(),
        adbProps: zod_1.z.record(zod_1.z.string(), zod_1.z.string()).optional(),
    }),
    zod_1.z.object({
        proxyStatus: zod_1.z.literal('PROXY_UNAUTHORIZED'),
        adbStatus: zod_1.z.string(),
        approveUrl: zod_1.z.string(),
    }),
]));
exports.WDP_TRACK_DEVICES_SCHEMA = zod_1.z.object({
    error: zod_1.z
        .object({
        type: zod_1.z.string(), // ORIGIN_NOT_ALLOWLISTED, or others
        message: zod_1.z.string(),
        approveUrl: zod_1.z.string().optional(),
    })
        .optional(),
    device: WDP_DEVICE_SCHEMA.array().optional(),
    version: zod_1.z.string().optional(),
});
//# sourceMappingURL=wdp_schema.js.map