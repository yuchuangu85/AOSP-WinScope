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
function createTableColumnFromPerfettoSql(col, tableName) {
    if (col.type.shortName === 'timestamp') {
        return new columns_1.TimestampColumn(col.name);
    }
    if (col.type.shortName === 'duration') {
        return new columns_1.DurationColumn(col.name);
    }
    if (col.type.shortName === 'id') {
        switch (tableName.toLowerCase()) {
            case 'slice':
                return new columns_1.SliceIdColumn(col.name, { type: 'id' });
            case 'thread':
                return new columns_1.ThreadIdColumn(col.name, { type: 'id' });
            case 'process':
                return new columns_1.ProcessIdColumn(col.name, { type: 'id' });
            case 'thread_state':
                return new columns_1.ThreadStateIdColumn(col.name);
            case 'sched':
                return new columns_1.SchedIdColumn(col.name);
        }
        return new columns_1.StandardColumn(col.name);
    }
    if (col.type.shortName === 'joinid') {
        if (col.type.tableAndColumn === undefined) {
            return new columns_1.StandardColumn(col.name);
        }
        switch (col.type.tableAndColumn.table.toLowerCase()) {
            case 'slice':
                return new columns_1.SliceIdColumn(col.name);
            case 'thread':
                return new columns_1.ThreadIdColumn(col.name);
            case 'process':
                return new columns_1.ProcessIdColumn(col.name);
            case 'thread_state':
                return new columns_1.ThreadStateIdColumn(col.name);
            case 'sched':
                return new columns_1.SchedIdColumn(col.name);
        }
    }
    return new columns_1.StandardColumn(col.name);
}
//# sourceMappingURL=sql_modules.js.map