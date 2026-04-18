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
exports.SqlExpression = void 0;
exports.sqlColumnId = sqlColumnId;
exports.isSqlColumnEqual = isSqlColumnEqual;
const array_utils_1 = require("../../../../base/array_utils");
// A class representing a SQL column which is computed based on other columns.
class SqlExpression {
    op;
    columns;
    id;
    // op: Operation, which takes the expressions for columns and returns a valid SQL expression.
    // columns: List of columns that the operation references.
    // id: optional unique id for this column, which will be shown to the user (e.g. in column header and filters).
    constructor(op, columns, id) {
        this.op = op;
        this.columns = columns;
        this.id = id;
        this.op = op;
    }
}
exports.SqlExpression = SqlExpression;
// A unique identifier for the SQL column.
function sqlColumnId(column) {
    // For table columns, use the column name as an id.
    if (typeof column === 'string') {
        return column;
    }
    // For expressions, use the specified id, or plug the ids of the columns into the expression.
    if (column instanceof SqlExpression) {
        if (column.id !== undefined)
            return column.id;
        return `${column.op(column.columns.map(sqlColumnId))}`;
    }
    // Special case: If the join is performed on a single column `id`, we can use a simpler representation (i.e. `table[id].column`).
    if ((0, array_utils_1.arrayEquals)(Object.keys(column.source.joinOn), ['id'])) {
        return `${column.source.table}[${sqlColumnId(Object.values(column.source.joinOn)[0])}].${column.column}`;
    }
    // Otherwise, we need to list all the join constraints.
    const lookup = Object.entries(column.source.joinOn)
        .map(([key, value]) => {
        const valueStr = sqlColumnId(value);
        if (key === valueStr)
            return key;
        return `${key}=${sqlColumnId(value)}`;
    })
        .join(', ');
    return `${column.source.table}[${lookup}].${column.column}`;
}
function isSqlColumnEqual(a, b) {
    return sqlColumnId(a) === sqlColumnId(b);
}
//# sourceMappingURL=sql_column.js.map