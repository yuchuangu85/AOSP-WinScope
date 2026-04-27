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
exports.nextNodeId = nextNodeId;
exports.createSelectColumnsProto = createSelectColumnsProto;
exports.createFinalColumns = createFinalColumns;
exports.queryToRun = queryToRun;
exports.analyzeNode = analyzeNode;
exports.setOperationChanged = setOperationChanged;
exports.isAQuery = isAQuery;
const tslib_1 = require("tslib");
const protos_1 = tslib_1.__importDefault(require("../../protos"));
const column_info_1 = require("./query_builder/column_info");
let nodeCounter = 0;
function nextNodeId() {
    return (nodeCounter++).toString();
}
var NodeType;
(function (NodeType) {
    // Sources
    NodeType[NodeType["kTable"] = 0] = "kTable";
    NodeType[NodeType["kSimpleSlices"] = 1] = "kSimpleSlices";
    NodeType[NodeType["kSqlSource"] = 2] = "kSqlSource";
    // Single node operations
    NodeType[NodeType["kSubQuery"] = 3] = "kSubQuery";
    NodeType[NodeType["kAggregation"] = 4] = "kAggregation";
    NodeType[NodeType["kIntervalIntersect"] = 5] = "kIntervalIntersect";
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
    return (0, column_info_1.newColumnInfoList)(node.sourceCols, true);
}
function getStructuredQueries(finalNode) {
    if (finalNode.finalCols === undefined) {
        return;
    }
    const revStructuredQueries = [];
    let curNode = finalNode;
    while (curNode) {
        const curSq = curNode.getStructuredQuery();
        if (curSq === undefined) {
            return;
        }
        revStructuredQueries.push(curSq);
        if (curNode.prevNodes?.[0]) {
            if (!curNode.prevNodes[0].validate()) {
                return;
            }
            curNode = curNode.prevNodes[0];
        }
        else {
            curNode = undefined;
        }
    }
    return revStructuredQueries.reverse();
}
function queryToRun(query) {
    if (query === undefined)
        return 'N/A';
    const includes = query.modules.map((c) => `INCLUDE PERFETTO MODULE ${c};`);
    return includes.join('\n') + query.preambles.join('\n') + query.sql;
}
async function analyzeNode(node, engine) {
    if (node.state.isExecuted &&
        !node.state.hasOperationChanged &&
        node.type !== NodeType.kSqlSource) {
        const sql = {
            sql: `SELECT * FROM ${node.meterialisedAs ?? ''}`,
            textproto: '',
            modules: [],
            preambles: [],
            columns: [],
        };
        return sql;
    }
    const structuredQueries = getStructuredQueries(node);
    if (structuredQueries === undefined)
        return;
    const res = await engine.analyzeStructuredQuery(structuredQueries);
    if (res.error)
        return Error(res.error);
    if (res.results.length === 0)
        return Error('No structured query results');
    if (res.results.length !== structuredQueries.length) {
        return Error(`Wrong structured query results. Asked for ${structuredQueries.length}, received ${res.results.length}`);
    }
    const lastRes = res.results[res.results.length - 1];
    if (lastRes.sql === null || lastRes.sql === undefined) {
        return;
    }
    if (!lastRes.textproto) {
        return Error('No textproto in structured query results');
    }
    let finalSql = lastRes.sql;
    if (materialise(node)) {
        if (!node.meterialisedAs) {
            node.meterialisedAs = `exp_${node.nodeId}`;
        }
        const createTableSql = `CREATE OR REPLACE PERFETTO TABLE ${node.meterialisedAs ?? `exp_${node.nodeId}`} AS \n${lastRes.sql}`;
        const selectSql = `SELECT * FROM ${node.meterialisedAs ?? `exp_${node.nodeId}`}`;
        finalSql = `${createTableSql};\n${selectSql}`;
    }
    const sql = {
        sql: finalSql,
        textproto: lastRes.textproto ?? '',
        modules: lastRes.modules ?? [],
        preambles: lastRes.preambles ?? [],
        columns: lastRes.columns ?? [],
    };
    return sql;
}
function setOperationChanged(node) {
    let curr = node;
    while (curr) {
        if (curr.state.hasOperationChanged) {
            // Already marked as changed, and so are the children.
            break;
        }
        curr.state.hasOperationChanged = true;
        const queue = [];
        curr.nextNodes.forEach((child) => {
            queue.push(child);
        });
        curr = queue.shift();
    }
}
function isAQuery(maybeQuery) {
    return (maybeQuery !== undefined &&
        !(maybeQuery instanceof Error) &&
        maybeQuery.sql !== undefined);
}
function materialise(node) {
    return (node.type !== NodeType.kSqlSource &&
        node.type != NodeType.kIntervalIntersect);
}
//# sourceMappingURL=query_node.js.map