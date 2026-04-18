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
exports.UnionDataset = exports.SourceDataset = void 0;
const logging_1 = require("../base/logging");
const utils_1 = require("../base/utils");
const query_result_1 = require("./query_result");
const sql_utils_1 = require("./sql_utils");
/**
 * Defines a dataset with a source SQL select statement of table name, a
 * schema describing the columns, and an optional filter.
 */
class SourceDataset {
    src;
    schema;
    filter;
    constructor(config) {
        this.src = config.src;
        this.schema = config.schema;
        this.filter = config.filter;
    }
    query(schema) {
        schema = schema ?? this.schema;
        const cols = Object.keys(schema);
        const selectSql = `select ${cols.join(', ')} from (${this.src})`;
        const filterSql = this.filterQuery();
        if (filterSql === undefined) {
            return selectSql;
        }
        return `${selectSql} where ${filterSql}`;
    }
    optimize() {
        // Cannot optimize SourceDataset
        return this;
    }
    implements(required) {
        return Object.entries(required).every(([name, required]) => {
            return name in this.schema && (0, query_result_1.checkExtends)(required, this.schema[name]);
        });
    }
    // Convert filter to a SQL expression (without the where clause), or undefined
    // if we have no filter.
    filterQuery() {
        if (!this.filter)
            return undefined;
        if ('eq' in this.filter) {
            return `${this.filter.col} = ${(0, sql_utils_1.sqlValueToSqliteString)(this.filter.eq)}`;
        }
        else if ('in' in this.filter) {
            return `${this.filter.col} in (${(0, sql_utils_1.sqlValueToSqliteString)(this.filter.in)})`;
        }
        else {
            (0, logging_1.assertUnreachable)(this.filter);
        }
    }
}
exports.SourceDataset = SourceDataset;
/**
 * Maximum number of sub-queries to include in a single union statement
 * to avoid hitting SQLite limits.
 * See: https://www.sqlite.org/limits.html#max_compound_select
 */
const MAX_SUBQUERIES_PER_UNION = 500;
/**
 * A dataset that represents the union of multiple datasets.
 */
class UnionDataset {
    union;
    constructor(union) {
        this.union = union;
    }
    get schema() {
        // Find the minimal set of columns that are supported by all datasets of
        // the union
        let unionSchema = undefined;
        this.union.forEach((ds) => {
            const dsSchema = ds.schema;
            if (unionSchema === undefined) {
                // First time just use this one
                unionSchema = dsSchema;
            }
            else {
                const newSch = {};
                for (const [key, value] of Object.entries(unionSchema)) {
                    if (key in dsSchema) {
                        const commonType = (0, query_result_1.unionTypes)(value, dsSchema[key]);
                        if (commonType !== undefined) {
                            newSch[key] = commonType;
                        }
                    }
                }
                unionSchema = newSch;
            }
        });
        return unionSchema ?? {};
    }
    query(schema) {
        schema = schema ?? this.schema;
        const subQueries = this.union.map((dataset) => dataset.query(schema));
        // If we have a small number of sub-queries, just use a single union all.
        if (subQueries.length <= MAX_SUBQUERIES_PER_UNION) {
            return subQueries.join('\nunion all\n');
        }
        // Handle large number of sub-queries by batching into multiple CTEs.
        let sql = 'with\n';
        const cteNames = [];
        // Create CTEs for batches of sub-queries
        for (let i = 0; i < subQueries.length; i += MAX_SUBQUERIES_PER_UNION) {
            const batch = subQueries.slice(i, i + MAX_SUBQUERIES_PER_UNION);
            const cteName = `union_batch_${Math.floor(i / MAX_SUBQUERIES_PER_UNION)}`;
            cteNames.push(cteName);
            sql += `${cteName} as (\n${batch.join('\nunion all\n')}\n)`;
            // Add comma unless this is the last CTE.
            if (i + MAX_SUBQUERIES_PER_UNION < subQueries.length) {
                sql += ',\n';
            }
        }
        const cols = Object.keys(schema);
        // Union all the CTEs together in the final query.
        sql += '\n';
        sql += cteNames
            .map((name) => `select ${cols.join(',')} from ${name}`)
            .join('\nunion all\n');
        return sql;
    }
    optimize() {
        // Recursively optimize each dataset of this union
        const optimizedUnion = this.union.map((ds) => ds.optimize());
        // Find all source datasets and combine then based on src
        const combinedSrcSets = new Map();
        const otherDatasets = [];
        for (const e of optimizedUnion) {
            if (e instanceof SourceDataset) {
                const set = (0, utils_1.getOrCreate)(combinedSrcSets, e.src, () => []);
                set.push(e);
            }
            else {
                otherDatasets.push(e);
            }
        }
        const mergedSrcSets = Array.from(combinedSrcSets.values()).map((srcGroup) => {
            if (srcGroup.length === 1)
                return srcGroup[0];
            // Combine schema across all members in the union
            const combinedSchema = srcGroup.reduce((acc, e) => {
                Object.assign(acc, e.schema);
                return acc;
            }, {});
            // Merge filters for the same src
            const inFilters = [];
            for (const { filter } of srcGroup) {
                if (filter) {
                    if ('eq' in filter) {
                        inFilters.push({ col: filter.col, in: [filter.eq] });
                    }
                    else {
                        inFilters.push(filter);
                    }
                }
            }
            const mergedFilter = mergeFilters(inFilters);
            return new SourceDataset({
                src: srcGroup[0].src,
                schema: combinedSchema,
                filter: mergedFilter,
            });
        });
        const finalUnion = [...mergedSrcSets, ...otherDatasets];
        if (finalUnion.length === 1) {
            return finalUnion[0];
        }
        else {
            return new UnionDataset(finalUnion);
        }
    }
    implements(required) {
        return Object.entries(required).every(([name, required]) => {
            return name in this.schema && (0, query_result_1.checkExtends)(required, this.schema[name]);
        });
    }
}
exports.UnionDataset = UnionDataset;
function mergeFilters(filters) {
    if (filters.length === 0)
        return undefined;
    const col = filters[0].col;
    const values = new Set(filters.flatMap((filter) => filter.in));
    return { col, in: Array.from(values) };
}
//# sourceMappingURL=dataset.js.map