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
exports.PivotTableState = void 0;
const async_limiter_1 = require("../../../../base/async_limiter");
const filters_1 = require("../table/filters");
const query_builder_1 = require("../table/query_builder");
const simple_column_1 = require("../table/simple_column");
const sql_column_1 = require("../table/sql_column");
const array_utils_1 = require("../../../../base/array_utils");
const logging_1 = require("../../../../base/logging");
const aggregations_1 = require("./aggregations");
const pivot_tree_node_1 = require("./pivot_tree_node");
const ids_1 = require("./ids");
// Pivot and aggregation ids are human-readable, but are not valid SQLite identifiers,
// so we need to generate valid aliases for them. We map the values back to be keyed
// by the ids as soon as we get the data back from the trace processor.
function pivotSqliteAlias(p) {
    return (0, ids_1.pivotId)(p).replace(/[^a-zA-Z0-9_]/g, '__');
}
function aggregationSqliteAlias(a) {
    return `__${(0, sql_column_1.sqlColumnId)(a.column.column).replace(/[^a-zA-Z0-9_]/g, '__')}__${a.op}`;
}
// State for a pivot table widget.
// Serves as the source-of-truth for: pivots, aggregations, and which parts of the tree are expanded.
// Has a reference to a shared `Filters` object and listens for updates.
// Responsible for generating a query to fetch the data as needed when any of the above change.
class PivotTableState {
    args;
    table;
    trace;
    filters;
    pivots = [];
    aggregations = [];
    orderBy;
    limiter = new async_limiter_1.AsyncLimiter();
    data;
    // Used to keep track of the tree before a reload, so we can keep the same nodes expanded.
    oldTree;
    constructor(args) {
        this.args = args;
        this.table = args.table;
        this.trace = args.trace;
        this.pivots = [...args.pivots];
        this.aggregations =
            args.aggregations !== undefined ? [...args.aggregations] : [];
        const count = {
            op: 'count',
            column: new simple_column_1.SimpleColumn(new sql_column_1.SqlExpression(() => '1', [])),
        };
        this.aggregations.push(count);
        this.orderBy = [
            { type: 'aggregation', id: (0, ids_1.aggregationId)(count), direction: 'DESC' },
        ];
        this.filters = args?.filters ?? new filters_1.Filters();
        this.filters.addObserver(() => this.reload());
        this.data = {
            columnIds: new Set(),
            filters: [],
            query: '',
        };
        this.reload();
    }
    getData() {
        return this.data.result?.tree;
    }
    getPivots() {
        return this.pivots;
    }
    getAggregations() {
        return this.aggregations;
    }
    addPivot(pivot, index) {
        this.pivots.splice(index + 1, 0, pivot);
        this.reload();
    }
    addAggregation(agg, index) {
        this.aggregations.splice(index + 1, 0, agg);
        this.reload();
    }
    removePivot(index) {
        this.sortByPivot(this.pivots[index], undefined);
        this.pivots.splice(index, 1);
        this.reload();
    }
    removeAggregation(index) {
        this.sortByAggregation(this.aggregations[index], undefined);
        this.aggregations.splice(index, 1);
        this.reload();
    }
    movePivot(from, to) {
        (0, array_utils_1.moveArrayItem)(this.pivots, from, to);
        this.reload();
    }
    moveAggregation(from, to) {
        (0, array_utils_1.moveArrayItem)(this.aggregations, from, to);
        this.reload();
    }
    replaceAggregation(index, agg) {
        this.aggregations[index] = agg;
        this.reload();
    }
    sortByPivot(pivot, direction) {
        const id = (0, ids_1.pivotId)(pivot);
        // Remove any existing sort by this pivot.
        this.orderBy = this.orderBy.filter((c) => !(c.type === 'pivot' && c.id === id));
        if (direction === undefined)
            return;
        this.orderBy.unshift({
            type: 'pivot',
            id,
            direction,
        });
        this.data.result?.tree.sort(this.orderBy);
    }
    sortByAggregation(agg, direction) {
        const id = (0, ids_1.aggregationId)(agg);
        // Remove any existing sort by this aggregation.
        this.orderBy = this.orderBy.filter((c) => !(c.type === 'aggregation' && c.id === id));
        if (direction === undefined)
            return;
        this.orderBy.unshift({
            type: 'aggregation',
            id,
            direction,
        });
        this.data.result?.tree.sort(this.orderBy);
    }
    clearPivotSort(pivot) {
        const id = (0, ids_1.pivotId)(pivot);
        this.orderBy = this.orderBy.filter((c) => !(c.type === 'pivot' && c.id === id));
        this.data.result?.tree.sort(this.orderBy);
    }
    clearAggregationSort(agg) {
        const id = (0, ids_1.aggregationId)(agg);
        this.orderBy = this.orderBy.filter((c) => !(c.type === 'aggregation' && c.id === id));
        this.data.result?.tree.sort(this.orderBy);
    }
    isSortedByPivot(pivot) {
        if (this.orderBy.length === 0)
            return undefined;
        const id = (0, ids_1.pivotId)(pivot);
        const head = this.orderBy[0];
        if (head.type === 'pivot' && head.id === id)
            return head.direction;
        return undefined;
    }
    isSortedByAggregation(agg) {
        if (this.orderBy.length === 0)
            return undefined;
        const id = (0, ids_1.aggregationId)(agg);
        const head = this.orderBy[0];
        if (head.type === 'aggregation' && head.id === id)
            return head.direction;
        return undefined;
    }
    async reload() {
        this.oldTree = this.data.result?.tree ?? this.oldTree;
        this.limiter.schedule(async () => {
            const { query, columnIds, aliasToIds } = this.buildQuery();
            // Check if we already have all of the columns (and the filters are the same): in that case
            // we don't need to reload.
            // Note that comparing the queries directly is too sensitive for us: e.g. we don't care about
            // the column ordering, as well as having extra aggregations.
            const needsReload = this.data.error !== undefined ||
                !(0, filters_1.areFiltersEqual)(this.filters.get(), this.data.filters) ||
                ![...columnIds].every((id) => this.data.columnIds.has(id));
            // If we don't need to reload, we can keep the old rows.
            let rows = needsReload ? undefined : this.data.result?.rows;
            this.data = {
                columnIds: new Set(aliasToIds.values()),
                filters: [...this.filters.get()],
                query,
            };
            // If we need to reload, fetch the data from the trace processor.
            if (rows === undefined) {
                const queryResult = await this.loadData(query, aliasToIds);
                this.data.error = queryResult.error;
                rows = queryResult.rows;
            }
            if (this.data.error === undefined) {
                // Build the pivot tree from the rows.
                const tree = pivot_tree_node_1.PivotTreeNode.buildTree(rows, {
                    pivots: this.getPivots(),
                    aggregations: this.getAggregations(),
                });
                // If we have an old tree, copy the expanded state from it.
                tree.copyExpandedState(this.oldTree);
                this.oldTree = undefined;
                tree.sort(this.orderBy);
                this.data.result = {
                    rows,
                    tree,
                };
            }
        });
    }
    // Generate SQL query to fetch the necessary data.
    // We group by all pivots and apply all aggregations.
    // As ids are not valid sqlite identifiers, we also remember the mapping from alias to id.
    buildQuery() {
        const columns = {};
        const columnIds = new Set();
        const aliasToIds = new Map();
        const groupBy = [];
        for (const pivot of this.pivots) {
            const alias = pivotSqliteAlias(pivot);
            columns[alias] = pivot.column;
            columnIds.add((0, ids_1.pivotId)(pivot));
            aliasToIds.set(alias, (0, ids_1.pivotId)(pivot));
            groupBy.push(pivot.column);
        }
        // Expand non-assocative aggregations (average) into basic associative aggregations which
        // can be pushed down to SQL.
        for (const agg of (0, aggregations_1.expandAggregations)(this.aggregations)) {
            const alias = aggregationSqliteAlias(agg);
            columns[alias] = new sql_column_1.SqlExpression((cols) => `${agg.op}(${cols[0]})`, [agg.column.column]);
            columnIds.add((0, ids_1.aggregationId)(agg));
            aliasToIds.set(alias, (0, ids_1.aggregationId)(agg));
        }
        const query = (0, query_builder_1.buildSqlQuery)({
            table: this.args.table.name,
            columns,
            groupBy,
            filters: this.filters.get(),
        });
        const importStatement = (this.table.imports ?? [])
            .map((i) => `INCLUDE PERFETTO MODULE ${i};\n`)
            .join('');
        return {
            query: `${importStatement}${query}`,
            columnIds,
            aliasToIds,
        };
    }
    // Fetch the data from the trace processor for the given query.
    // To simplify the rest of the code, which uses pivotId / aggregationId as the primary identifiers,
    // we map the data back from the sqlite alises to these ids before returning the data.
    async loadData(query, aliasToIds) {
        const res = await this.args.trace.engine.query(query);
        if (res.error() !== undefined) {
            return { rows: [], error: res.error() };
        }
        const rows = [];
        for (const it = res.iter({}); it.valid(); it.next()) {
            const row = {};
            for (const column of res.columns()) {
                row[(0, logging_1.assertExists)(aliasToIds.get(column))] = it.get(column);
            }
            rows.push(row);
        }
        return { rows };
    }
}
exports.PivotTableState = PivotTableState;
//# sourceMappingURL=pivot_table_state.js.map