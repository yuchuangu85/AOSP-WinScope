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
exports.tableColumnId = tableColumnId;
exports.tableColumnAlias = tableColumnAlias;
exports.columnTitle = columnTitle;
const sql_column_1 = require("./sql_column");
// Returns a unique identifier for the table column.
function tableColumnId(column) {
    return (0, sql_column_1.sqlColumnId)(column.column);
}
function tableColumnAlias(column) {
    return tableColumnId(column).replace(/[^a-zA-Z0-9_]/g, '__');
}
function columnTitle(column) {
    if (column.getTitle !== undefined) {
        const title = column.getTitle();
        if (title !== undefined)
            return title;
    }
    return (0, sql_column_1.sqlColumnId)(column.column);
}
//# sourceMappingURL=table_column.js.map