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
exports.buildSqlQuery = buildSqlQuery;
const sql_column_1 = require("./sql_column");
// Checks whether two normalised columns are equivalent.
function normalisedSqlColumnsEqual(a, b) {
    if (a === undefined)
        return false;
    if (b === undefined)
        return false;
    if (a.kind === 'table_column') {
        if (b.kind !== 'table_column')
            return false;
        return a.column === b.column && a.sourceTableId === b.sourceTableId;
    }
    else {
        if (b.kind !== 'expression')
            return false;
        // For expressions, first check that the underlying columns are equal.
        if (a.columns.length !== b.columns.length)
            return false;
        for (let i = 0; i < a.columns.length; ++i) {
            if (!normalisedSqlColumnsEqual(a.columns[i], b.columns[i]))
                return false;
        }
        // Subsitute the columns with dummy values to check if the expressions are equal.
        const cols = Array.from({ length: a.columns.length }, (_, i) => `__$${i}`);
        return a.op(cols) === b.op(cols);
    }
}
// Checks whether two join constraints are equal to allow deduplication of joins.
function areJoinConstraintsEqual(a, b) {
    if (Object.keys(a).length !== Object.keys(b).length) {
        return false;
    }
    for (const key of Object.keys(a)) {
        const aValue = a[key];
        const bValue = b[key];
        if (!normalisedSqlColumnsEqual(aValue, bValue))
            return false;
    }
    return true;
}
// Class responsible for building a query and maintaing a list of normalised join tables.
class QueryBuilder {
    tables = [];
    tableAlias;
    expressionIndex = 0;
    constructor(tableName) {
        this.tableAlias = `${tableName}_0`;
    }
    // Normalises a column, including adding if necessary the joins to the list of tables.
    normalise(column) {
        // Simple columns do not require any normalisation.
        if (typeof column === 'string') {
            return {
                kind: 'table_column',
                column: column,
            };
        }
        // Expressions require normalisation of the underlying columns.
        if (column instanceof sql_column_1.SqlExpression) {
            return {
                kind: 'expression',
                index: this.expressionIndex++,
                op: column.op,
                columns: column.columns.map((column) => this.normalise(column)),
            };
        }
        // Otherwise, normalise join constraints.
        const normalisedJoinOn = Object.fromEntries(Object.entries(column.source.joinOn).map(([key, value]) => [
            key,
            this.normalise(value),
        ]));
        // Check if this join is already present.
        for (let i = 0; i < this.tables.length; ++i) {
            const table = this.tables[i];
            if (table.table === column.source.table &&
                table.innerJoin === (column.source.innerJoin ?? false) &&
                areJoinConstraintsEqual(table.joinOn, normalisedJoinOn)) {
                return {
                    kind: 'table_column',
                    column: column.column,
                    sourceTableId: i,
                };
            }
        }
        // Otherwise, add a new join.
        this.tables.push({
            table: column.source.table,
            joinOn: normalisedJoinOn,
            innerJoin: column.source.innerJoin ?? false,
        });
        return {
            kind: 'table_column',
            column: column.column,
            sourceTableId: this.tables.length - 1,
        };
    }
    // Prints a reference to a column, including properly disambiguated table alias.
    printReference(column) {
        if (column.kind === 'expression') {
            return column.op(column.columns.map((column) => this.printReference(column)));
        }
        if (column.sourceTableId === undefined) {
            if (!/^[A-Za-z0-9_]*$/.test(column.column)) {
                // If this is an expression, don't prefix it with the table name.
                return column.column;
            }
            return `${this.tableAlias}.${column.column}`;
        }
        const table = this.tables[column.sourceTableId];
        // Dependent tables are 0-indexed, but we want to display them as 1-indexed to reserve 0 for the primary table.
        return `${table.table}_${column.sourceTableId + 1}.${column.column}`;
    }
    printJoin(joinIndex) {
        const join = this.tables[joinIndex];
        const alias = `${join.table}_${joinIndex + 1}`;
        const clauses = Object.entries(join.joinOn).map(([key, value]) => `${alias}.${key} = ${this.printReference(value)}`);
        // Join IDs are 0-indexed, but we want to display them as 1-indexed to reserve 0 for the primary table.
        return `${join.innerJoin ? '' : 'LEFT '}JOIN ${join.table} AS ${alias} ON ${clauses.join(' AND ')}`;
    }
}
// Returns a query fetching the columns from the table, with the specified filters and order by clauses.
// keys of the `columns` object are the names of the columns in the result set.
function buildSqlQuery(args) {
    const builder = new QueryBuilder(args.table);
    const normalisedColumns = Object.fromEntries(Object.entries(args.columns).map(([key, value]) => [
        key,
        builder.normalise(value),
    ]));
    const normalisedFilters = (args.filters || []).map((filter) => ({
        op: filter.op,
        columns: filter.columns.map((column) => builder.normalise(column)),
    }));
    const normalisedOrderBy = (args.orderBy || []).map((orderBy) => ({
        order: orderBy.direction,
        column: builder.normalise(orderBy.column),
    }));
    const normalisedGroupBy = (args.groupBy || []).map((column) => builder.normalise(column));
    const formatFilter = (filter) => {
        return filter.op(filter.columns.map((column) => builder.printReference(column)));
    };
    const filterClause = normalisedFilters.length === 0
        ? ''
        : `WHERE\n ${normalisedFilters.map(formatFilter).join('\n  AND ')}`;
    const joinClause = builder.tables
        .map((_, index) => builder.printJoin(index))
        .join('\n');
    const groupBys = normalisedGroupBy.map((column) => builder.printReference(column));
    const groupByClause = args.groupBy === undefined ? '' : `GROUP BY\n  ${groupBys.join(', ')}`;
    const orderBys = normalisedOrderBy.map((orderBy) => `${builder.printReference(orderBy.column)} ${orderBy.order}`);
    const orderByClause = normalisedOrderBy.length === 0 ? '' : `ORDER BY\n  ${orderBys.join(',  ')}`;
    return `
    ${args.prefix === undefined ? '' : args.prefix}
    SELECT
      ${Object.entries(normalisedColumns)
        .map(([key, value]) => `${builder.printReference(value)} AS ${key}`)
        .join(',\n  ')}
    FROM ${args.table} AS ${builder.tableAlias}
    ${joinClause}
    ${filterClause}
    ${groupByClause}
    ${orderByClause}
  `;
}
//# sourceMappingURL=query_builder.js.map