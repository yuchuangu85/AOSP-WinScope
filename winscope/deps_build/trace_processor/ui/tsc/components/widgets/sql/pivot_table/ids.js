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
exports.pivotId = pivotId;
exports.aggregationId = aggregationId;
const sql_column_1 = require("../table/sql_column");
// Unique identifier for a pivot column.
function pivotId(p) {
    return (0, sql_column_1.sqlColumnId)(p.column);
}
// Unique identifier for an aggregation.
function aggregationId(a) {
    // Count doesn't require a column.
    if (a.op === 'count')
        return 'count';
    return `${a.op}(${(0, sql_column_1.sqlColumnId)(a.column.column)})`;
}
//# sourceMappingURL=ids.js.map