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
exports.ArgSetIdColumn = exports.ProcessIdColumn = exports.ThreadIdColumn = exports.ThreadStateIdColumn = exports.SchedIdColumn = exports.SliceIdColumn = exports.DurationColumn = exports.TimestampColumn = exports.StandardColumn = void 0;
exports.argTableColumn = argTableColumn;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const string_utils_1 = require("../../../../base/string_utils");
const time_1 = require("../../../../base/time");
const query_result_1 = require("../../../../trace_processor/query_result");
const core_types_1 = require("../../../sql_utils/core_types");
const error_1 = require("../../../../widgets/error");
const duration_1 = require("../../duration");
const process_1 = require("../../process");
const sched_1 = require("../../sched");
const slice_1 = require("../../slice");
const thread_1 = require("../../thread");
const thread_state_1 = require("../../thread_state");
const timestamp_1 = require("../../timestamp");
const render_cell_utils_1 = require("./render_cell_utils");
const sql_column_1 = require("./sql_column");
function wrongTypeError(type, name, value) {
    return (0, error_1.renderError)(`Wrong type for ${type} column ${(0, sql_column_1.sqlColumnId)(name)}: bigint expected, ${typeof value} found`);
}
class StandardColumn {
    column;
    params;
    constructor(column, params) {
        this.column = column;
        this.params = params;
    }
    renderCell(value, tableManager) {
        return (0, render_cell_utils_1.renderStandardCell)(value, this.column, tableManager);
    }
    initialColumns() {
        return this.params?.startsHidden ? [] : [this];
    }
}
exports.StandardColumn = StandardColumn;
class TimestampColumn {
    trace;
    column;
    constructor(trace, column) {
        this.trace = trace;
        this.column = column;
    }
    renderCell(value, tableManager) {
        if (typeof value === 'number') {
            value = BigInt(Math.round(value));
        }
        if (typeof value !== 'bigint') {
            return (0, render_cell_utils_1.renderStandardCell)(value, this.column, tableManager);
        }
        return {
            content: (0, mithril_1.default)(timestamp_1.Timestamp, {
                trace: this.trace,
                ts: time_1.Time.fromRaw(value),
            }),
            menu: [
                tableManager &&
                    (0, render_cell_utils_1.getStandardContextMenuItems)(value, this.column, tableManager),
            ],
            isNumerical: true,
        };
    }
}
exports.TimestampColumn = TimestampColumn;
class DurationColumn {
    trace;
    column;
    constructor(trace, column) {
        this.trace = trace;
        this.column = column;
    }
    renderCell(value, tableManager) {
        if (typeof value === 'number') {
            value = BigInt(Math.round(value));
        }
        if (typeof value !== 'bigint') {
            return (0, render_cell_utils_1.renderStandardCell)(value, this.column, tableManager);
        }
        return {
            content: (0, mithril_1.default)(duration_1.DurationWidget, {
                trace: this.trace,
                dur: time_1.Duration.fromRaw(value),
            }),
            menu: [
                tableManager &&
                    (0, render_cell_utils_1.getStandardContextMenuItems)(value, this.column, tableManager),
            ],
            isNumerical: true,
        };
    }
}
exports.DurationColumn = DurationColumn;
class SliceIdColumn {
    trace;
    column;
    params;
    constructor(trace, column, params) {
        this.trace = trace;
        this.column = column;
        this.params = params;
    }
    renderCell(value, manager) {
        const id = value;
        if (!manager || id === null) {
            return (0, render_cell_utils_1.renderStandardCell)(id, this.column, manager);
        }
        return {
            content: (0, mithril_1.default)(slice_1.SliceRef, {
                trace: this.trace,
                id: (0, core_types_1.asSliceSqlId)(Number(id)),
                name: `${id}`,
                switchToCurrentSelectionTab: false,
            }),
            menu: (0, render_cell_utils_1.getStandardContextMenuItems)(id, this.column, manager),
            isNumerical: true,
        };
    }
    listDerivedColumns() {
        if (this.params?.type === 'id')
            return undefined;
        return async () => new Map([
            ['ts', new TimestampColumn(this.trace, this.getChildColumn('ts'))],
            ['dur', new DurationColumn(this.trace, this.getChildColumn('dur'))],
            ['name', new StandardColumn(this.getChildColumn('name'))],
            [
                'parent_id',
                new SliceIdColumn(this.trace, this.getChildColumn('parent_id')),
            ],
        ]);
    }
    getChildColumn(name) {
        return {
            column: name,
            source: {
                table: 'slice',
                joinOn: { id: this.column },
            },
        };
    }
}
exports.SliceIdColumn = SliceIdColumn;
class SchedIdColumn {
    trace;
    column;
    constructor(trace, column) {
        this.trace = trace;
        this.column = column;
    }
    renderCell(value, manager) {
        const id = value;
        if (!manager || id === null) {
            return (0, render_cell_utils_1.renderStandardCell)(id, this.column, manager);
        }
        if (typeof id !== 'bigint') {
            return { content: wrongTypeError('id', this.column, id) };
        }
        return {
            content: (0, mithril_1.default)(sched_1.SchedRef, {
                trace: this.trace,
                id: (0, core_types_1.asSchedSqlId)(Number(id)),
                name: `${id}`,
                switchToCurrentSelectionTab: false,
            }),
            menu: (0, render_cell_utils_1.getStandardContextMenuItems)(id, this.column, manager),
            isNumerical: true,
        };
    }
}
exports.SchedIdColumn = SchedIdColumn;
class ThreadStateIdColumn {
    trace;
    column;
    constructor(trace, column) {
        this.trace = trace;
        this.column = column;
    }
    renderCell(value, manager) {
        const id = value;
        if (!manager || id === null) {
            return (0, render_cell_utils_1.renderStandardCell)(id, this.column, manager);
        }
        if (typeof id !== 'bigint') {
            return { content: wrongTypeError('id', this.column, id) };
        }
        return {
            content: (0, mithril_1.default)(thread_state_1.ThreadStateRef, {
                trace: this.trace,
                id: (0, core_types_1.asThreadStateSqlId)(Number(id)),
                name: `${id}`,
                switchToCurrentSelectionTab: false,
            }),
            menu: (0, render_cell_utils_1.getStandardContextMenuItems)(id, this.column, manager),
            isNumerical: true,
        };
    }
}
exports.ThreadStateIdColumn = ThreadStateIdColumn;
class ThreadIdColumn {
    trace;
    column;
    params;
    constructor(trace, column, params) {
        this.trace = trace;
        this.column = column;
        this.params = params;
    }
    renderCell(value, manager) {
        const utid = value;
        if (!manager || utid === null) {
            return (0, render_cell_utils_1.renderStandardCell)(utid, this.column, manager);
        }
        if (typeof utid !== 'bigint') {
            throw new Error(`thread.utid is expected to be bigint, got ${typeof utid}`);
        }
        return {
            content: `${utid}`,
            menu: [
                (0, thread_1.showThreadDetailsMenuItem)(this.trace, (0, core_types_1.asUtid)(Number(utid))),
                (0, render_cell_utils_1.getStandardContextMenuItems)(utid, this.column, manager),
            ],
            isNumerical: true,
        };
    }
    listDerivedColumns() {
        if (this.params?.type === 'id')
            return undefined;
        return async () => new Map([
            ['tid', new StandardColumn(this.getChildColumn('tid'))],
            ['name', new StandardColumn(this.getChildColumn('name'))],
            [
                'start_ts',
                new TimestampColumn(this.trace, this.getChildColumn('start_ts')),
            ],
            [
                'end_ts',
                new TimestampColumn(this.trace, this.getChildColumn('end_ts')),
            ],
            ['upid', new ProcessIdColumn(this.trace, this.getChildColumn('upid'))],
            [
                'is_main_thread',
                new StandardColumn(this.getChildColumn('is_main_thread')),
            ],
        ]);
    }
    initialColumns() {
        return [
            this,
            new StandardColumn(this.getChildColumn('tid')),
            new StandardColumn(this.getChildColumn('name')),
        ];
    }
    getChildColumn(name) {
        return {
            column: name,
            source: {
                table: 'thread',
                joinOn: { id: this.column },
                // If the column is guaranteed not to have null values, we can use an INNER JOIN.
                innerJoin: this.params?.notNull === true,
            },
        };
    }
}
exports.ThreadIdColumn = ThreadIdColumn;
class ProcessIdColumn {
    trace;
    column;
    params;
    constructor(trace, column, params) {
        this.trace = trace;
        this.column = column;
        this.params = params;
    }
    renderCell(value, manager) {
        const upid = value;
        if (!manager || upid === null) {
            return (0, render_cell_utils_1.renderStandardCell)(upid, this.column, manager);
        }
        if (typeof upid !== 'bigint') {
            throw new Error(`thread.upid is expected to be bigint, got ${typeof upid}`);
        }
        return {
            content: `${upid}`,
            menu: [
                (0, process_1.showProcessDetailsMenuItem)(this.trace, (0, core_types_1.asUpid)(Number(upid))),
                (0, render_cell_utils_1.getStandardContextMenuItems)(upid, this.column, manager),
            ],
            isNumerical: true,
        };
    }
    listDerivedColumns() {
        if (this.params?.type === 'id')
            return undefined;
        return async () => new Map([
            ['pid', new StandardColumn(this.getChildColumn('pid'))],
            ['name', new StandardColumn(this.getChildColumn('name'))],
            [
                'start_ts',
                new TimestampColumn(this.trace, this.getChildColumn('start_ts')),
            ],
            [
                'end_ts',
                new TimestampColumn(this.trace, this.getChildColumn('end_ts')),
            ],
            [
                'parent_upid',
                new ProcessIdColumn(this.trace, this.getChildColumn('parent_upid')),
            ],
            [
                'is_main_thread',
                new StandardColumn(this.getChildColumn('is_main_thread')),
            ],
        ]);
    }
    initialColumns() {
        return [
            this,
            new StandardColumn(this.getChildColumn('pid')),
            new StandardColumn(this.getChildColumn('name')),
        ];
    }
    getChildColumn(name) {
        return {
            column: name,
            source: {
                table: 'process',
                joinOn: { id: this.column },
                // If the column is guaranteed not to have null values, we can use an INNER JOIN.
                innerJoin: this.params?.notNull === true,
            },
        };
    }
}
exports.ProcessIdColumn = ProcessIdColumn;
class ArgColumn {
    argSetId;
    key;
    column;
    id;
    constructor(argSetId, key) {
        this.argSetId = argSetId;
        this.key = key;
        this.id = `${(0, sql_column_1.sqlColumnId)(this.argSetId)}[${this.key}]`;
        this.column = new sql_column_1.SqlExpression((cols) => `COALESCE(${cols[0]}, ${cols[1]}, ${cols[2]})`, [
            this.getRawColumn('string_value'),
            this.getRawColumn('int_value'),
            this.getRawColumn('real_value'),
        ], this.id);
    }
    supportingColumns() {
        return { type: this.getRawColumn('value_type') };
    }
    getRawColumn(type) {
        return {
            column: type,
            source: {
                table: 'args',
                joinOn: {
                    arg_set_id: this.argSetId,
                    key: `${(0, string_utils_1.sqliteString)(this.key)}`,
                },
            },
            id: `${this.id}.${type.replace(/_value$/g, '')}`,
        };
    }
    renderCell(value, tableManager, values) {
        // If the value is NULL, then filters can check for id column for better performance.
        if (value === null) {
            return (0, render_cell_utils_1.renderStandardCell)(value, this.getRawColumn('value_type'), tableManager);
        }
        if (values?.type === 'int') {
            return (0, render_cell_utils_1.renderStandardCell)(value, this.getRawColumn('int_value'), tableManager);
        }
        if (values?.type === 'string') {
            return (0, render_cell_utils_1.renderStandardCell)(value, this.getRawColumn('string_value'), tableManager);
        }
        if (values?.type === 'real') {
            return (0, render_cell_utils_1.renderStandardCell)(value, this.getRawColumn('real_value'), tableManager);
        }
        return (0, render_cell_utils_1.renderStandardCell)(value, this.column, tableManager);
    }
}
class ArgSetIdColumn {
    column;
    constructor(column) {
        this.column = column;
    }
    renderCell(value, tableManager) {
        return (0, render_cell_utils_1.renderStandardCell)(value, this.column, tableManager);
    }
    listDerivedColumns(manager) {
        return async () => {
            const queryResult = await manager.trace.engine.query(`
        SELECT
          DISTINCT args.key
        FROM (${manager.getSqlQuery({ arg_set_id: this.column })}) data
        JOIN args USING (arg_set_id)
      `);
            const result = new Map();
            const it = queryResult.iter({ key: query_result_1.STR });
            for (; it.valid(); it.next()) {
                result.set(it.key, argTableColumn(this.column, it.key));
            }
            return result;
        };
    }
    initialColumns() {
        return [];
    }
}
exports.ArgSetIdColumn = ArgSetIdColumn;
function argTableColumn(argSetId, key) {
    return new ArgColumn(argSetId, key);
}
//# sourceMappingURL=columns.js.map