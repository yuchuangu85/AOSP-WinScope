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
exports.SQL_MODULES_DOCS_SCHEMA = exports.TableAndColumnImpl = exports.StdlibModuleImpl = exports.StdlibPackageImpl = exports.SqlModulesImpl = void 0;
const zod_1 = require("zod");
const sql_modules_1 = require("./sql_modules");
class SqlModulesImpl {
    packages;
    constructor(trace, docs) {
        this.packages = docs.map((json) => new StdlibPackageImpl(trace, json));
    }
    findAllTablesWithLinkedId(tableAndColumn) {
        const linkedIdTables = [];
        for (const t of this.listTables()) {
            const allLinkedCols = t.linkedIdColumns;
            if (allLinkedCols.find((c) => c.type.tableAndColumn &&
                c.type.tableAndColumn.isEqual(tableAndColumn))) {
                linkedIdTables.push(t);
            }
        }
        return linkedIdTables;
    }
    getTable(tableName) {
        for (const p of this.packages) {
            const t = p.getTable(tableName);
            if (t !== undefined) {
                return t;
            }
        }
        return;
    }
    listTables() {
        return this.packages.flatMap((p) => p.listTables());
    }
    listTablesNames() {
        return this.packages.flatMap((p) => p.listTablesNames());
    }
    getModuleForTable(tableName) {
        for (const stdlibPackage of this.packages) {
            const maybeTable = stdlibPackage.getModuleForTable(tableName);
            if (maybeTable) {
                return maybeTable;
            }
        }
        return undefined;
    }
    listModules() {
        return this.packages.flatMap((p) => p.modules);
    }
}
exports.SqlModulesImpl = SqlModulesImpl;
class StdlibPackageImpl {
    name;
    modules;
    constructor(trace, docs) {
        this.name = docs.name;
        this.modules = [];
        for (const moduleJson of docs.modules) {
            this.modules.push(new StdlibModuleImpl(trace, moduleJson));
        }
    }
    getTable(tableName) {
        for (const module of this.modules) {
            for (const t of module.tables) {
                if (t.name == tableName) {
                    return t;
                }
            }
        }
        return undefined;
    }
    listTables() {
        return this.modules.flatMap((module) => module.tables);
    }
    listTablesNames() {
        return this.listTables().map((t) => t.name);
    }
    getModuleForTable(tableName) {
        for (const module of this.modules) {
            for (const t of module.tables) {
                if (t.name == tableName) {
                    return module;
                }
            }
        }
        return undefined;
    }
    getSqlTableDescription(tableName) {
        for (const module of this.modules) {
            for (const t of module.tables) {
                if (t.name == tableName) {
                    return module.getSqlTableDescription(tableName);
                }
            }
        }
        return undefined;
    }
}
exports.StdlibPackageImpl = StdlibPackageImpl;
class StdlibModuleImpl {
    includeKey;
    tables;
    functions;
    tableFunctions;
    macros;
    constructor(trace, docs) {
        this.includeKey = docs.module_name;
        const neededInclude = this.includeKey.startsWith('prelude')
            ? undefined
            : this.includeKey;
        this.tables = docs.data_objects.map((json) => new SqlTableImpl(trace, json, neededInclude));
        this.functions = docs.functions.map((json) => new StdlibFunctionImpl(json));
        this.tableFunctions = docs.table_functions.map((json) => new StdlibTableFunctionImpl(json));
        this.macros = docs.macros.map((json) => new StdlibMacroImpl(json));
    }
    getTable(tableName) {
        for (const t of this.tables) {
            if (t.name == tableName) {
                return t;
            }
        }
        return undefined;
    }
    getSqlTableDescription(tableName) {
        const sqlTable = this.getTable(tableName);
        if (sqlTable === undefined) {
            return undefined;
        }
        return {
            imports: [this.includeKey],
            name: sqlTable.name,
            columns: sqlTable.getTableColumns(),
        };
    }
}
exports.StdlibModuleImpl = StdlibModuleImpl;
class StdlibMacroImpl {
    name;
    summaryDesc;
    description;
    args;
    returnType;
    constructor(docs) {
        this.name = docs.name;
        this.summaryDesc = docs.summary_desc;
        this.description = docs.desc;
        this.returnType = docs.return_type;
        this.args = [];
        this.args = docs.args.map((json) => new StdlibFunctionArgImpl(json));
    }
}
class StdlibTableFunctionImpl {
    name;
    summaryDesc;
    description;
    args;
    returnCols;
    constructor(docs) {
        this.name = docs.name;
        this.summaryDesc = docs.summary_desc;
        this.description = docs.desc;
        this.args = docs.args.map((json) => new StdlibFunctionArgImpl(json));
        this.returnCols = docs.cols.map((json) => new StdlibColumnImpl(json));
    }
}
class StdlibFunctionImpl {
    name;
    summaryDesc;
    description;
    args;
    returnType;
    returnDesc;
    constructor(docs) {
        this.name = docs.name;
        this.summaryDesc = docs.summary_desc;
        this.description = docs.desc;
        this.returnType = docs.return_type;
        this.returnDesc = docs.return_desc;
        this.args = docs.args.map((json) => new StdlibFunctionArgImpl(json));
    }
}
class SqlTableImpl {
    trace;
    name;
    includeKey;
    description;
    type;
    columns;
    idColumn;
    linkedIdColumns;
    joinIdColumns;
    constructor(trace, docs, includeKey) {
        this.trace = trace;
        this.name = docs.name;
        this.includeKey = includeKey;
        this.description = docs.desc;
        this.type = docs.type;
        this.columns = docs.cols.map((json) => new StdlibColumnImpl(json));
        this.linkedIdColumns = [];
        this.joinIdColumns = [];
        for (const c of this.columns) {
            if (c.type.name === 'id') {
                this.idColumn = c;
                continue;
            }
            if (c.type.shortName === 'id') {
                this.linkedIdColumns.push(c);
                continue;
            }
            if (c.type.shortName === 'joinid') {
                this.joinIdColumns.push(c);
                continue;
            }
        }
    }
    getIdColumns() {
        return this.columns.filter((c) => c.type.shortName === 'id');
    }
    getJoinIdColumns() {
        return this.columns.filter((c) => c.type.shortName === 'joinid');
    }
    getIdTables() {
        return this.getIdColumns()
            .map((c) => c.type.tableAndColumn)
            .filter((tAndC) => tAndC !== undefined);
    }
    getJoinIdTables() {
        return this.getJoinIdColumns()
            .map((c) => c.type.tableAndColumn)
            .filter((tAndC) => tAndC !== undefined);
    }
    getTableColumns() {
        return this.columns.map((col) => (0, sql_modules_1.createTableColumnFromPerfettoSql)(this.trace, col, this.name));
    }
}
class StdlibColumnImpl {
    name;
    type;
    description;
    constructor(docs) {
        this.type = {
            name: docs.type.toLowerCase(),
            shortName: docs.type.split('(')[0].toLowerCase(),
            tableAndColumn: docs.table && docs.column
                ? new TableAndColumnImpl(docs.table.toLowerCase(), docs.column.toLowerCase())
                : undefined,
        };
        this.description = docs.desc;
        this.name = docs.name;
    }
}
class StdlibFunctionArgImpl {
    name;
    description;
    type;
    constructor(docs) {
        this.type = docs.type;
        this.description = docs.desc;
        this.name = docs.name;
    }
}
class TableAndColumnImpl {
    table;
    column;
    constructor(table, column) {
        this.table = table;
        this.column = column;
    }
    isEqual(o) {
        return o.table === this.table && o.column === this.column;
    }
}
exports.TableAndColumnImpl = TableAndColumnImpl;
const ARG_OR_COL_SCHEMA = zod_1.z.object({
    name: zod_1.z.string(),
    type: zod_1.z.string(),
    desc: zod_1.z.string(),
    table: zod_1.z.string().nullable(),
    column: zod_1.z.string().nullable(),
});
const DATA_OBJECT_SCHEMA = zod_1.z.object({
    name: zod_1.z.string(),
    desc: zod_1.z.string(),
    summary_desc: zod_1.z.string(),
    type: zod_1.z.string(),
    cols: zod_1.z.array(ARG_OR_COL_SCHEMA),
});
const FUNCTION_SCHEMA = zod_1.z.object({
    name: zod_1.z.string(),
    desc: zod_1.z.string(),
    summary_desc: zod_1.z.string(),
    args: zod_1.z.array(ARG_OR_COL_SCHEMA),
    return_type: zod_1.z.string(),
    return_desc: zod_1.z.string(),
});
const TABLE_FUNCTION_SCHEMA = zod_1.z.object({
    name: zod_1.z.string(),
    desc: zod_1.z.string(),
    summary_desc: zod_1.z.string(),
    args: zod_1.z.array(ARG_OR_COL_SCHEMA),
    cols: zod_1.z.array(ARG_OR_COL_SCHEMA),
});
const MACRO_SCHEMA = zod_1.z.object({
    name: zod_1.z.string(),
    desc: zod_1.z.string(),
    summary_desc: zod_1.z.string(),
    return_desc: zod_1.z.string(),
    return_type: zod_1.z.string(),
    args: zod_1.z.array(ARG_OR_COL_SCHEMA),
});
const MODULE_SCHEMA = zod_1.z.object({
    module_name: zod_1.z.string(),
    data_objects: zod_1.z.array(DATA_OBJECT_SCHEMA),
    functions: zod_1.z.array(FUNCTION_SCHEMA),
    table_functions: zod_1.z.array(TABLE_FUNCTION_SCHEMA),
    macros: zod_1.z.array(MACRO_SCHEMA),
});
const PACKAGE_SCHEMA = zod_1.z.object({
    name: zod_1.z.string(),
    modules: zod_1.z.array(MODULE_SCHEMA),
});
exports.SQL_MODULES_DOCS_SCHEMA = zod_1.z.array(PACKAGE_SCHEMA);
//# sourceMappingURL=sql_modules_impl.js.map