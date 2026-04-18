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
exports.RECORD_PLUGIN_SCHEMA = exports.SAVED_SESSION_SCHEMA = exports.TARGET_SCHEMA = exports.RECORD_SESSION_SCHEMA = exports.PROBES_SCHEMA = void 0;
const zod_1 = require("zod");
const target_platform_1 = require("./interfaces/target_platform");
// Overall view
// RECORD_PLUGIN_SCHEMA:
//   target: TARGET_SCHEMA
//   lastSession: RECORD_SESSION_SCHEMA
//      probes: PROBES_SCHEMA{}
//   savedSessions: Array<RECORD_SESSION_SCHEMA>
//      probes: PROBES_SCHEMA{}
// Holds the state of the PROBES_PAGE subpages (e.g., Memory).
// We don't define a strongly-typed schema for each probes as they are
// changed frequently. Each probe is modelled as:
// - An enable/disable boolean (the presence of the key)
// - A map of "settings". Each setting widget (Slider, Textarea, Toggle)
//   takes care of its own de/serialization.
exports.PROBES_SCHEMA = zod_1.z
    .record(zod_1.z.string(), // key: the RecordProbe.id (it's globally unique).
zod_1.z.object({
    settings: zod_1.z
        .record(zod_1.z.string(), // key: the key in the RecordProbe.settings map.
    zod_1.z.unknown())
        .default({}),
}))
    .default({});
// The schema that holds the settings for a recording session, that is, the
// state of the probes and the buffer size & type.
// This does NOT include the state of the other recording pages (e.g. the
// Target device selector, the "saved sessions", etc)
exports.RECORD_SESSION_SCHEMA = zod_1.z
    .object({
    mode: zod_1.z
        .enum(['STOP_WHEN_FULL', 'RING_BUFFER', 'LONG_TRACE'])
        .default('STOP_WHEN_FULL'),
    bufSizeKb: zod_1.z.number().default(64 * 1024),
    durationMs: zod_1.z.number().default(10_000),
    maxFileSizeMb: zod_1.z.number().default(500),
    fileWritePeriodMs: zod_1.z.number().default(2500),
    compression: zod_1.z.boolean().default(false),
    probes: exports.PROBES_SCHEMA,
})
    .default({});
// The schema for the target selection page.
exports.TARGET_SCHEMA = zod_1.z
    .object({
    platformId: zod_1.z
        .enum(target_platform_1.TARGET_PLATFORMS.map((p) => p.id))
        .optional(),
    transportId: zod_1.z.string().optional(),
    targetId: zod_1.z.string().optional(),
})
    .default({});
exports.SAVED_SESSION_SCHEMA = zod_1.z.object({
    name: zod_1.z.string(),
    config: exports.RECORD_SESSION_SCHEMA,
});
// The schema for the root object that holds the whole state of the record
// plugin.
exports.RECORD_PLUGIN_SCHEMA = zod_1.z
    .object({
    target: exports.TARGET_SCHEMA,
    autoOpenTrace: zod_1.z.boolean().default(true),
    lastSession: exports.RECORD_SESSION_SCHEMA.default({}),
    savedSessions: zod_1.z.array(exports.SAVED_SESSION_SCHEMA).default([]),
})
    .default({});
//# sourceMappingURL=serialization_schema.js.map