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
exports.getThreadTable = getThreadTable;
exports.getProcessTable = getProcessTable;
exports.getSliceTable = getSliceTable;
exports.getAndroidLogsTable = getAndroidLogsTable;
exports.getSchedTable = getSchedTable;
exports.getThreadStateTable = getThreadStateTable;
const columns_1 = require("../../components/widgets/sql/table/columns");
function getThreadTable() {
    return {
        name: 'thread',
        columns: [
            new columns_1.ThreadIdColumn('utid', { type: 'id' }),
            new columns_1.StandardColumn('tid'),
            new columns_1.StandardColumn('name'),
            new columns_1.TimestampColumn('start_ts'),
            new columns_1.TimestampColumn('end_ts'),
            new columns_1.ProcessIdColumn('upid', { notNull: true }),
            new columns_1.StandardColumn('is_main_thread'),
        ],
    };
}
function getProcessTable() {
    return {
        name: 'process',
        columns: [
            new columns_1.ProcessIdColumn('upid', { type: 'id' }),
            new columns_1.StandardColumn('pid'),
            new columns_1.StandardColumn('name'),
            new columns_1.TimestampColumn('start_ts'),
            new columns_1.TimestampColumn('end_ts'),
            new columns_1.ProcessIdColumn('parent_upid'),
            new columns_1.StandardColumn('uid'),
            new columns_1.StandardColumn('android_appid'),
            new columns_1.StandardColumn('cmdline', { startsHidden: true }),
            new columns_1.StandardColumn('machine_id'),
            new columns_1.ArgSetIdColumn('arg_set_id'),
        ],
    };
}
function getSliceTable() {
    return {
        imports: ['slices.with_context'],
        name: 'thread_or_process_slice',
        displayName: 'thread_or_process_slice',
        columns: [
            new columns_1.SliceIdColumn('id', { notNull: true, type: 'id' }),
            new columns_1.TimestampColumn('ts'),
            new columns_1.DurationColumn('dur'),
            new columns_1.StandardColumn('category'),
            new columns_1.StandardColumn('name'),
            new columns_1.StandardColumn('track_id', { startsHidden: true }),
            new columns_1.ThreadIdColumn('utid'),
            new columns_1.ProcessIdColumn('upid'),
            new columns_1.StandardColumn('depth', { startsHidden: true }),
            new columns_1.SliceIdColumn('parent_id'),
            new columns_1.ArgSetIdColumn('arg_set_id'),
        ],
    };
}
function getAndroidLogsTable() {
    return {
        name: 'android_logs',
        columns: [
            new columns_1.StandardColumn('id'),
            new columns_1.TimestampColumn('ts'),
            new columns_1.StandardColumn('tag'),
            new columns_1.StandardColumn('prio'),
            new columns_1.ThreadIdColumn('utid'),
            new columns_1.ProcessIdColumn({
                column: 'upid',
                source: {
                    table: 'thread',
                    joinOn: { utid: 'utid' },
                },
            }),
            new columns_1.StandardColumn('msg'),
        ],
    };
}
function getSchedTable() {
    return {
        name: 'sched',
        columns: [
            new columns_1.SchedIdColumn('id'),
            new columns_1.TimestampColumn('ts'),
            new columns_1.DurationColumn('dur'),
            new columns_1.StandardColumn('cpu'),
            new columns_1.StandardColumn('priority'),
            new columns_1.ThreadIdColumn('utid'),
            new columns_1.ProcessIdColumn({
                column: 'upid',
                source: {
                    table: 'thread',
                    joinOn: { utid: 'utid' },
                },
            }),
            new columns_1.StandardColumn('end_state'),
            new columns_1.StandardColumn('ucpu', { startsHidden: true }),
        ],
    };
}
function getThreadStateTable() {
    return {
        name: 'thread_state',
        columns: [
            new columns_1.ThreadStateIdColumn('id'),
            new columns_1.TimestampColumn('ts'),
            new columns_1.DurationColumn('dur'),
            new columns_1.StandardColumn('state'),
            new columns_1.StandardColumn('cpu'),
            new columns_1.ThreadIdColumn('utid'),
            new columns_1.ProcessIdColumn({
                column: 'upid',
                source: {
                    table: 'thread',
                    joinOn: { utid: 'utid' },
                },
            }),
            new columns_1.StandardColumn('io_wait'),
            new columns_1.StandardColumn('blocked_function'),
            new columns_1.ThreadIdColumn('waker_utid'),
            new columns_1.ThreadStateIdColumn('waker_id'),
            new columns_1.StandardColumn('irq_context'),
            new columns_1.StandardColumn('ucpu', { startsHidden: true }),
        ],
    };
}
//# sourceMappingURL=tables.js.map