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
exports.createTableColumnFromPerfettoSql = createTableColumnFromPerfettoSql;
const columns_1 = require("../../components/widgets/sql/table/columns");
function createTableColumnFromPerfettoSql(trace, col, tableName) {
    if (col.type.shortName === 'timestamp') {
        return new columns_1.TimestampColumn(trace, col.name);
    }
    if (col.type.shortName === 'duration') {
        return new columns_1.DurationColumn(trace, col.name);
    }
    if (col.type.shortName === 'id') {
        switch (tableName.toLowerCase()) {
            case 'slice':
                return new columns_1.SliceIdColumn(trace, col.name, { type: 'id' });
            case 'thread':
                return new columns_1.ThreadIdColumn(trace, col.name, { type: 'id' });
            case 'process':
                return new columns_1.ProcessIdColumn(trace, col.name, { type: 'id' });
            case 'thread_state':
                return new columns_1.ThreadStateIdColumn(trace, col.name);
            case 'sched':
                return new columns_1.SchedIdColumn(trace, col.name);
        }
        return new columns_1.StandardColumn(col.name);
    }
    if (col.type.shortName === 'joinid') {
        if (col.type.tableAndColumn === undefined) {
            return new columns_1.StandardColumn(col.name);
        }
        switch (col.type.tableAndColumn.table.toLowerCase()) {
            case 'slice':
                return new columns_1.SliceIdColumn(trace, col.name);
            case 'thread':
                return new columns_1.ThreadIdColumn(trace, col.name);
            case 'process':
                return new columns_1.ProcessIdColumn(trace, col.name);
            case 'thread_state':
                return new columns_1.ThreadStateIdColumn(trace, col.name);
            case 'sched':
                return new columns_1.SchedIdColumn(trace, col.name);
        }
    }
    return new columns_1.StandardColumn(col.name);
}
//# sourceMappingURL=sql_modules.js.map