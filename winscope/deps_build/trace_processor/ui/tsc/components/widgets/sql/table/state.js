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
exports.SqlTableState = void 0;
const query_result_1 = require("../../../../trace_processor/query_result");
const sql_column_1 = require("./sql_column");
const query_builder_1 = require("./query_builder");
const raf_scheduler_1 = require("../../../../core/raf_scheduler");
const logging_1 = require("../../../../base/logging");
const queries_1 = require("../../../query_table/queries");
const async_limiter_1 = require("../../../../base/async_limiter");
const filters_1 = require("./filters");
const table_column_1 = require("./table_column");
const array_utils_1 = require("../../../../base/array_utils");
const ROW_LIMIT = 100;
class SqlTableState {
    trace;
    config;
    args;
    filters;
    additionalImports;
    asyncLimiter = new async_limiter_1.AsyncLimiter();
    // Columns currently displayed to the user. All potential columns can be found `this.table.columns`.
    columns;
    orderBy;
    offset = 0;
    request;
    data;
    rowCount;
    _nonPaginatedData;
    constructor(trace, config, args) {
        this.trace = trace;
        this.config = config;
        this.args = args;
        this.additionalImports = args?.imports || [];
        this.filters = args?.filters || new filters_1.Filters();
        this.filters.addObserver(() => this.reload());
        this.columns = [];
        if (args?.initialColumns !== undefined) {
            (0, logging_1.assertTrue)(args?.additionalColumns === undefined, 'Only one of `initialColumns` and `additionalColumns` can be set');
            this.columns.push(...args.initialColumns);
        }
        else {
            for (const column of this.config.columns) {
                const columns = column.initialColumns?.() ?? [column];
                this.columns.push(...columns);
            }
            if (args?.additionalColumns !== undefined) {
                this.columns.push(...args.additionalColumns);
            }
        }
        this.orderBy = args?.orderBy ?? [];
        this.request = this.buildRequest();
        this.reload();
    }
    get nonPaginatedData() {
        if (this._nonPaginatedData === undefined) {
            this.getNonPaginatedData();
        }
        return this._nonPaginatedData;
    }
    clone() {
        return new SqlTableState(this.trace, this.config, {
            initialColumns: this.columns,
            imports: this.args?.imports,
            filters: new filters_1.Filters(this.filters.get()),
            orderBy: this.orderBy,
        });
    }
    getSQLImports() {
        const tableImports = this.config.imports || [];
        return [...tableImports, ...this.additionalImports]
            .map((i) => `INCLUDE PERFETTO MODULE ${i};`)
            .join('\n');
    }
    getCountRowsSQLQuery() {
        return `
      ${this.getSQLImports()}

      ${this.getSqlQuery({ count: 'COUNT()' })}
    `;
    }
    // Return a query which selects the given columns, applying the filters and ordering currently in effect.
    getSqlQuery(columns) {
        return (0, query_builder_1.buildSqlQuery)({
            table: this.config.name,
            columns,
            prefix: this.config.prefix,
            filters: this.filters.get(),
            orderBy: this.getOrderedBy(),
        });
    }
    // We need column names to pass to the debug track creation logic.
    buildSqlSelectStatement() {
        const columns = {};
        // A set of columnIds for quick lookup.
        const sqlColumnIds = new Set();
        // We want to use the shortest posible name for each column, but we also need to mindful of potential collisions.
        // To avoid collisions, we append a number to the column name if there are multiple columns with the same name.
        const columnNameCount = {};
        const tableColumns = [];
        for (const column of this.columns) {
            // If TableColumn has an alias, use it. Otherwise, use the column name.
            const name = (0, table_column_1.tableColumnAlias)(column);
            if (!(name in columnNameCount)) {
                columnNameCount[name] = 0;
            }
            // Note: this can break if the user specifies a column which ends with `__<number>`.
            // We intentionally use two underscores to avoid collisions and will fix it down the line if it turns out to be a problem.
            const alias = `${name}__${++columnNameCount[name]}`;
            tableColumns.push({ column: column.column, name, alias });
        }
        for (const column of tableColumns) {
            const sqlColumn = column.column;
            // If we have only one column with this name, we don't need to disambiguate it.
            if (columnNameCount[column.name] === 1) {
                columns[column.name] = sqlColumn;
            }
            else {
                columns[column.alias] = sqlColumn;
            }
            sqlColumnIds.add((0, sql_column_1.sqlColumnId)(sqlColumn));
        }
        return {
            selectStatement: this.getSqlQuery(columns),
            columns: Object.fromEntries(Object.entries(columns).map(([key, value]) => [
                (0, sql_column_1.sqlColumnId)(value),
                key,
            ])),
        };
    }
    getNonPaginatedSQLQuery() {
        return `
      ${this.getSQLImports()}

      ${this.buildSqlSelectStatement().selectStatement}
    `;
    }
    getPaginatedSQLQuery() {
        return this.request;
    }
    canGoForward() {
        if (this.data === undefined)
            return false;
        return this.data.rows.length > ROW_LIMIT;
    }
    canGoBack() {
        if (this.data === undefined)
            return false;
        return this.offset > 0;
    }
    goForward() {
        if (!this.canGoForward())
            return;
        this.offset += ROW_LIMIT;
        this.reload({ offset: 'keep' });
    }
    goBack() {
        if (!this.canGoBack())
            return;
        this.offset -= ROW_LIMIT;
        this.reload({ offset: 'keep' });
    }
    getDisplayedRange() {
        if (this.data === undefined)
            return undefined;
        return {
            from: this.offset + 1,
            to: this.offset + Math.min(this.data.rows.length, ROW_LIMIT),
        };
    }
    async loadRowCount() {
        const filters = Array.from(this.filters.get());
        const res = await this.trace.engine.query(this.getCountRowsSQLQuery());
        if (res.error() !== undefined)
            return undefined;
        return {
            count: res.firstRow({ count: query_result_1.NUM }).count,
            filters: filters,
        };
    }
    buildRequest() {
        const { selectStatement, columns } = this.buildSqlSelectStatement();
        // We fetch one more row to determine if we can go forward.
        const query = `
      ${this.getSQLImports()}
      ${selectStatement}
      LIMIT ${ROW_LIMIT + 1}
      OFFSET ${this.offset}
    `;
        return { selectStatement, query, columns };
    }
    async loadData() {
        const queryRes = await this.trace.engine.query(this.request.query);
        const rows = [];
        for (const it = queryRes.iter({}); it.valid(); it.next()) {
            const row = {};
            for (const column of queryRes.columns()) {
                row[column] = it.get(column);
            }
            rows.push(row);
        }
        return {
            rows,
            error: queryRes.error(),
        };
    }
    async reload(params) {
        if ((params?.offset ?? 'reset') === 'reset') {
            this.offset = 0;
        }
        const newFilters = this.rowCount?.filters;
        const filtersMatch = newFilters && (0, filters_1.areFiltersEqual)(newFilters, this.filters.get());
        this.data = undefined;
        const request = this.buildRequest();
        this.request = request;
        if (!filtersMatch) {
            this.rowCount = undefined;
        }
        // Schedule a full redraw to happen after a short delay (50 ms).
        // This is done to prevent flickering / visual noise and allow the UI to fetch
        // the initial data from the Trace Processor.
        // There is a chance that someone else schedules a full redraw in the
        // meantime, forcing the flicker, but in practice it works quite well and
        // avoids a lot of complexity for the callers.
        // 50ms is half of the responsiveness threshold (100ms):
        // https://web.dev/rail/#response-process-events-in-under-50ms
        setTimeout(() => raf_scheduler_1.raf.scheduleFullRedraw(), 50);
        if (!filtersMatch) {
            this.rowCount = await this.loadRowCount();
        }
        const data = await this.loadData();
        // If the request has changed since we started loading the data, do not update the state.
        if (this.request !== request)
            return;
        this.data = data;
        raf_scheduler_1.raf.scheduleFullRedraw();
    }
    async getNonPaginatedData() {
        this.asyncLimiter.schedule(async () => {
            const queryRes = await (0, queries_1.runQueryForQueryTable)(this.getNonPaginatedSQLQuery(), this.trace.engine);
            this._nonPaginatedData = {
                rows: queryRes.rows,
                error: queryRes.error,
            };
            raf_scheduler_1.raf.scheduleFullRedraw();
        });
    }
    getTotalRowCount() {
        return this.rowCount?.count;
    }
    getCurrentRequest() {
        return this.request;
    }
    getDisplayedRows() {
        return this.data?.rows || [];
    }
    getQueryError() {
        return this.data?.error;
    }
    isLoading() {
        return this.data === undefined;
    }
    sortBy(clause) {
        // Remove previous sort by the same column.
        this.orderBy = this.orderBy.filter((c) => (0, table_column_1.tableColumnId)(c.column) != (0, table_column_1.tableColumnId)(clause.column));
        if (clause.direction === undefined)
            return;
        // Add the new sort clause to the front, so we effectively stable-sort the
        // data currently displayed to the user.
        this.orderBy.unshift({ column: clause.column, direction: clause.direction });
        this.reload();
    }
    isSortedBy(column) {
        if (this.orderBy.length === 0)
            return undefined;
        if ((0, table_column_1.tableColumnId)(this.orderBy[0].column) !== (0, table_column_1.tableColumnId)(column)) {
            return undefined;
        }
        return this.orderBy[0].direction;
    }
    getOrderedBy() {
        const result = [];
        for (const orderBy of this.orderBy) {
            result.push({
                column: orderBy.column.column,
                direction: orderBy.direction,
            });
        }
        return result;
    }
    addColumn(column, index) {
        this.columns.splice(index + 1, 0, column);
        this.reload({ offset: 'keep' });
    }
    hideColumnAtIndex(index) {
        const column = this.columns[index];
        this.columns.splice(index, 1);
        // We can only filter by the visibile columns to avoid confusing the user,
        // so we remove order by clauses that refer to the hidden column.
        this.orderBy = this.orderBy.filter((c) => (0, table_column_1.tableColumnId)(c.column) !== (0, table_column_1.tableColumnId)(column));
        // TODO(altimin): we can avoid the fetch here if the orderBy hasn't changed.
        this.reload({ offset: 'keep' });
    }
    moveColumn(fromIndex, toIndex) {
        (0, array_utils_1.moveArrayItem)(this.columns, fromIndex, toIndex);
    }
    getSelectedColumns() {
        return this.columns;
    }
}
exports.SqlTableState = SqlTableState;
//# sourceMappingURL=state.js.map