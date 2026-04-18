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
exports.NodeType = void 0;
exports.createSelectColumnsProto = createSelectColumnsProto;
exports.createFinalColumns = createFinalColumns;
const tslib_1 = require("tslib");
const protos_1 = tslib_1.__importDefault(require("../../protos"));
const column_controller_1 = require("./query_builder/column_controller");
const groupy_by_1 = require("./query_builder/operations/groupy_by");
var NodeType;
(function (NodeType) {
    // Sources
    NodeType[NodeType["kStdlibTable"] = 0] = "kStdlibTable";
    NodeType[NodeType["kSimpleSlices"] = 1] = "kSimpleSlices";
    NodeType[NodeType["kSqlSource"] = 2] = "kSqlSource";
})(NodeType || (exports.NodeType = NodeType = {}));
function createSelectColumnsProto(node) {
    if (node.finalCols.every((c) => c.checked))
        return;
    const selectedColumns = [];
    for (const c of node.finalCols) {
        if (c.checked === false)
            continue;
        const newC = new protos_1.default.PerfettoSqlStructuredQuery.SelectColumn();
        newC.columnName = c.column.name;
        if (c.alias) {
            newC.alias = c.alias;
        }
        selectedColumns.push(newC);
    }
    return selectedColumns;
}
function createFinalColumns(node) {
    if (node.state.groupByColumns.find((c) => c.checked)) {
        const selected = node.state.groupByColumns.filter((c) => c.checked);
        for (const agg of node.state.aggregations) {
            selected.push((0, column_controller_1.columnControllerRowFromName)(agg.newColumnName ?? (0, groupy_by_1.placeholderNewColumnName)(agg)));
        }
        return (0, column_controller_1.newColumnControllerRows)(selected, true);
    }
    return (0, column_controller_1.newColumnControllerRows)(node.sourceCols, true);
}
//# sourceMappingURL=query_node.js.map