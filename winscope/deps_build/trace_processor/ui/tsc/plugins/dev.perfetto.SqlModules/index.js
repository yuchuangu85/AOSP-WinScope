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
const assets_1 = require("../../base/assets");
const logging_1 = require("../../base/logging");
const sql_modules_impl_1 = require("./sql_modules_impl");
const extensions_1 = require("../../components/extensions");
class default_1 {
    static id = 'dev.perfetto.SqlModules';
    sqlModules;
    tables;
    async onTraceLoad(ctx) {
        this.loadJson(ctx);
    }
    async loadJson(ctx) {
        const x = await fetch((0, assets_1.assetSrc)('stdlib_docs.json'));
        const json = await x.json();
        const docs = sql_modules_impl_1.SQL_MODULES_DOCS_SCHEMA.parse(json);
        const sqlModules = new sql_modules_impl_1.SqlModulesImpl(docs);
        this.sqlModules = sqlModules;
        this.tables = sqlModules.listTablesNames();
        ctx.commands.registerCommand({
            id: 'perfetto.OpenSqlModulesTable',
            name: 'Open table...',
            callback: async () => {
                const chosenTable = await ctx.omnibox.prompt('Choose a table...', this.tables);
                if (chosenTable === undefined) {
                    return;
                }
                const module = sqlModules.getModuleForTable(chosenTable);
                if (module === undefined) {
                    return;
                }
                const sqlTable = module.getSqlTableDescription(chosenTable);
                sqlTable &&
                    extensions_1.extensions.addLegacySqlTableTab(ctx, {
                        table: sqlTable,
                    });
            },
        });
    }
    getSqlModules() {
        return (0, logging_1.assertExists)(this.sqlModules);
    }
    getSqlTables() {
        return (0, logging_1.assertExists)(this.tables);
    }
}
exports.default = default_1;
//# sourceMappingURL=index.js.map