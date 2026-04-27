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
exports.constraintsToQuerySuffix = constraintsToQuerySuffix;
exports.fromNumNull = fromNumNull;
exports.sqlValueToReadableString = sqlValueToReadableString;
exports.sqlValueToSqliteString = sqlValueToSqliteString;
exports.createPerfettoTable = createPerfettoTable;
exports.createTable = createTable;
exports.createPerfettoView = createPerfettoView;
exports.createView = createView;
exports.createPerfettoIndex = createPerfettoIndex;
exports.createIndex = createIndex;
exports.createVirtualTable = createVirtualTable;
const object_utils_1 = require("../base/object_utils");
const string_utils_1 = require("../base/string_utils");
function isDefined(t) {
    return t !== undefined;
}
// Formatting given constraints into a string which can be injected into
// SQL query.
function constraintsToQuerySuffix(c) {
    const result = [];
    const joins = (c.joins ?? []).filter(isDefined);
    if (joins.length > 0) {
        result.push(...joins);
    }
    const filters = (c.filters ?? []).filter(isDefined);
    if (filters.length > 0) {
        result.push(`WHERE ${filters.join(' and ')}`);
    }
    const groupBy = (c.groupBy ?? []).filter(isDefined);
    if (groupBy.length > 0) {
        const groups = groupBy.join(', ');
        result.push(`GROUP BY ${groups}`);
    }
    const orderBy = (c.orderBy ?? []).filter(isDefined);
    if (orderBy.length > 0) {
        const orderBys = orderBy.map((clause) => {
            if ((0, object_utils_1.isString)(clause)) {
                return clause;
            }
            else {
                const direction = clause.direction ? ` ${clause.direction}` : '';
                return `${clause.fieldName}${direction}`;
            }
        });
        result.push(`ORDER BY ${orderBys.join(', ')}`);
    }
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (c.limit) {
        result.push(`LIMIT ${c.limit}`);
    }
    return result.join('\n');
}
// Trace Processor returns number | null for NUM_NULL, while most of the UI
// code uses number | undefined. This functions provides a short-hand
// conversion.
// TODO(altimin): Support NUM_UNDEFINED as a first-class citizen.
function fromNumNull(n) {
    if (n === null) {
        return undefined;
    }
    return n;
}
function sqlValueToReadableString(val) {
    if (val === undefined)
        return undefined;
    if (val instanceof Uint8Array) {
        return `<blob length=${val.length}>`;
    }
    if (val === null) {
        return 'NULL';
    }
    return val.toString();
}
// Given a SqlValue, return a string representation (properly escaped, if
// necessary) of it to be used in a SQL query.
function sqlValueToSqliteString(val) {
    if (Array.isArray(val)) {
        return val.map((v) => sqlValueToSqliteString(v)).join(',');
    }
    if (val instanceof Uint8Array) {
        throw new Error("Can't pass blob back to trace processor as value");
    }
    if (val === null) {
        return 'NULL';
    }
    if (typeof val === 'string') {
        return (0, string_utils_1.sqliteString)(val);
    }
    return `${val}`;
}
function makeTempName() {
    // Generate a temporary name for a sql entity, which is guaranteed to be unique
    // within the current trace.
    return `__temp_${Math.random().toString(36).substring(2, 15)}`;
}
async function createDisposableSqlEntity(engine, name, entityType) {
    return {
        name,
        [Symbol.asyncDispose]: async () => {
            await engine.tryQuery(`DROP ${entityType} IF EXISTS ${name}`);
        },
    };
}
/**
 * Asynchronously creates a "perfetto" SQL table using the given engine and
 * returns a disposable object to handle its cleanup.
 *
 * @param args The arguments for creating the table.
 * @param args.engine The database engine to execute the query.
 * @param args.as The SQL expression to define the table.
 * @param args.name The name of the table to be created.
 * @returns An AsyncDisposable which drops the created table when disposed.
 */
async function createPerfettoTable(args) {
    const { engine, as, name = makeTempName() } = args;
    await engine.query(`CREATE PERFETTO TABLE ${name} AS ${as}`);
    return createDisposableSqlEntity(engine, name, 'TABLE');
}
/**
 * Asynchronously creates a standard SQL table using the given engine and
 * returns a disposable object to handle its cleanup.
 *
 * @param args The arguments for creating the table.
 * @param args.engine The database engine to execute the query.
 * @param args.as The SQL expression to define the table.
 * @param args.name The name of the table to be created.
 * @returns An AsyncDisposable which drops the created table when disposed.
 */
async function createTable(args) {
    const { engine, as, name = makeTempName() } = args;
    await engine.query(`CREATE TABLE ${name} AS ${as}`);
    return createDisposableSqlEntity(engine, name, 'TABLE');
}
/**
 * Asynchronously creates a "perfetto" SQL view using the given engine and
 * returns a disposable object to handle its cleanup.
 *
 * @param args The arguments for creating the view.
 * @param args.engine The database engine to execute the query.
 * @param args.as The SQL expression to define the view.
 * @param args.name The name of the view to be created.
 * @returns An AsyncDisposable which drops the created view when disposed.
 */
async function createPerfettoView(args) {
    const { engine, as, name = makeTempName() } = args;
    await engine.query(`CREATE PERFETTO VIEW ${name} AS ${as}`);
    return createDisposableSqlEntity(engine, name, 'VIEW');
}
/**
 * Asynchronously creates a standard SQL view using the given engine and
 * returns a disposable object to handle its cleanup.
 *
 * @param args The arguments for creating the view.
 * @param args.engine The database engine to execute the query.
 * @param args.as The SQL expression to define the view.
 * @param args.name The name of the view to be created.
 * @returns An AsyncDisposable which drops the created view when disposed.
 */
async function createView(args) {
    const { engine, as, name = makeTempName() } = args;
    await engine.query(`CREATE VIEW ${name} AS ${as}`);
    return createDisposableSqlEntity(engine, name, 'VIEW');
}
/**
 * Asynchronously creates a "perfetto" SQL index using the given engine and
 * returns a disposable object to handle its cleanup.
 *
 * @param args The arguments for creating the index.
 * @param args.engine The database engine to execute the query.
 * @param args.on The table and columns to create the index on.
 * @param args.name The name of the index to be created.
 * @returns An AsyncDisposable which drops the created index when disposed.
 */
async function createPerfettoIndex(args) {
    const { engine, on, name = makeTempName() } = args;
    await engine.query(`CREATE PERFETTO INDEX ${name} ON ${on}`);
    return createDisposableSqlEntity(engine, name, 'INDEX');
}
/**
 * Asynchronously creates a standard SQL index using the given engine and
 * returns a disposable object to handle its cleanup.
 *
 * @param args The arguments for creating the index.
 * @param args.engine The database engine to execute the query.
 * @param args.on The table and columns to create the index on.
 * @param args.name The name of the index to be created.
 * @returns An AsyncDisposable which drops the created index when disposed.
 */
async function createIndex(args) {
    const { engine, on, name = makeTempName() } = args;
    await engine.query(`CREATE INDEX ${name} ON ${on}`);
    return createDisposableSqlEntity(engine, name, 'INDEX');
}
/**
 * Asynchronously creates a virtual SQL table using the given engine and returns
 * a disposable object to handle its cleanup.
 *
 * @param args The arguments for creating the virtual table.
 * @param args.engine The database engine to execute the query.
 * @param args.using The module to use for the virtual table.
 * @param args.name The name of the table to be created.
 * @returns An AsyncDisposable which drops the created table when disposed.
 *
 * @example
 * await using table = await createVirtualTable({
 *   engine,
 *   name: 'my_virtual_table',
 *   using: 'some_module',
 * });
 */
async function createVirtualTable(args) {
    const { engine, using, name = makeTempName() } = args;
    await engine.query(`CREATE VIRTUAL TABLE ${name} USING ${using}`);
    return {
        name,
        [Symbol.asyncDispose]: async () => {
            await engine.tryQuery(`DROP TABLE IF EXISTS ${name}`);
        },
    };
}
//# sourceMappingURL=sql_utils.js.map