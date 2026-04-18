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
exports.VisViewSource = void 0;
const async_limiter_1 = require("../../../base/async_limiter");
const queries_1 = require("../../../components/query_table/queries");
const state_1 = require("../../../components/widgets/sql/table/state");
const sql_modules_1 = require("../../dev.perfetto.SqlModules/sql_modules");
const data_source_viewer_1 = require("../query_builder/data_source_viewer");
const filters_1 = require("../../../components/widgets/sql/table/filters");
const query_builder_1 = require("../../../components/widgets/sql/table/query_builder");
class VisViewSource {
    trace;
    queryNode;
    filters = new filters_1.Filters();
    asyncLimiter = new async_limiter_1.AsyncLimiter();
    sqlAsyncLimiter = new async_limiter_1.AsyncLimiter();
    _baseQuery; // Holds original data source query only
    _fullQuery = ''; // Holds query with filter clauses
    _data;
    _visViews;
    _columns;
    constructor(trace, queryNode) {
        this.trace = trace;
        this.queryNode = queryNode;
        this.filters.addObserver(() => this.loadData());
        this.loadBaseQuery();
    }
    get visViews() {
        return this._visViews;
    }
    get data() {
        return this._data;
    }
    get columns() {
        return this._columns;
    }
    addChart(vis) {
        return this._visViews?.charts.add(vis);
    }
    removeChart(vis) {
        return this._visViews?.charts.delete(vis);
    }
    async loadData() {
        const baseSql = this._baseQuery?.sql;
        if (baseSql === undefined)
            return;
        const columns = Object.fromEntries(this.queryNode.sourceCols.map((col) => [
            col.column.name,
            col.column.name,
        ]));
        const query = (0, query_builder_1.buildSqlQuery)({
            prefix: `WITH __data AS (${baseSql})`,
            table: '__data',
            columns: columns,
            filters: this.filters.get(),
        });
        if (query === this._fullQuery)
            return;
        this._fullQuery = query;
        this.asyncLimiter.schedule(async () => {
            if (this._fullQuery === undefined) {
                return;
            }
            const queryRes = await (0, queries_1.runQueryForQueryTable)(this._fullQuery, this.trace.engine);
            this._data = queryRes.rows;
            this._columns = queryRes.columns;
            this.updateViews(this._data, this._columns);
        });
    }
    async loadBaseQuery() {
        this.sqlAsyncLimiter.schedule(async () => {
            const sql = await (0, data_source_viewer_1.analyzeNode)(this.queryNode, this.trace.engine);
            if (sql === undefined) {
                throw Error(`Couldn't fetch the SQL`);
            }
            this._baseQuery = sql;
            this.loadData();
        });
    }
    updateViews(data, columns) {
        const queryNodeColumns = this.queryNode.sourceCols;
        if (data === undefined ||
            columns === undefined ||
            queryNodeColumns === undefined ||
            this._baseQuery === undefined) {
            return;
        }
        let newChartAttrs;
        if (this._visViews !== undefined) {
            newChartAttrs = Array.from(this._visViews.charts.values()).map((chartAttr) => {
                const newChartAttr = {
                    ...chartAttr,
                };
                newChartAttr.data = data;
                return newChartAttr;
            });
        }
        let sqlTableState = this.visViews?.sqlTableState;
        if (sqlTableState === undefined) {
            sqlTableState = new state_1.SqlTableState(this.trace, {
                imports: this._baseQuery.modules,
                prefix: `WITH __data AS (${this._baseQuery.sql})`,
                name: '__data',
                columns: queryNodeColumns.map((col) => 
                // TODO: Figure out how to not require table name here.
                (0, sql_modules_1.createTableColumnFromPerfettoSql)(col.column, '')),
            }, {
                filters: this.filters,
            });
        }
        const newVisViews = {
            charts: new Set(newChartAttrs),
            sqlTableState,
        };
        this._visViews = newVisViews;
        this.trace.raf.scheduleFullRedraw();
    }
}
exports.VisViewSource = VisViewSource;
//# sourceMappingURL=view_source.js.map