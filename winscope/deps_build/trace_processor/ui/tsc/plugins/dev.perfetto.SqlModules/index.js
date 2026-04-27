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
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const assets_1 = require("../../base/assets");
const deferred_1 = require("../../base/deferred");
const extensions_1 = require("../../components/extensions");
const sql_modules_impl_1 = require("./sql_modules_impl");
const docs = (0, deferred_1.defer)();
class default_1 {
    static id = 'dev.perfetto.SqlModules';
    sqlModules;
    static onActivate(_) {
        // Load the SQL modules JSON file when the plugin when the app starts up,
        // rather than waiting until trace load.
        loadJson().then(docs.resolve.bind(docs));
    }
    async onTraceLoad(trace) {
        docs.then((resolvedDocs) => {
            this.sqlModules = new sql_modules_impl_1.SqlModulesImpl(trace, resolvedDocs);
            mithril_1.default.redraw();
        });
        trace.commands.registerCommand({
            id: 'dev.perfetto.OpenSqlModulesTable',
            name: 'Open table...',
            callback: async () => {
                if (!this.sqlModules) {
                    window.alert('Sql modules are still loading... Please wait.');
                    return;
                }
                const tables = this.sqlModules.listTablesNames();
                const chosenTable = await trace.omnibox.prompt('Choose a table...', tables);
                if (chosenTable === undefined) {
                    return;
                }
                const module = this.sqlModules.getModuleForTable(chosenTable);
                if (module === undefined) {
                    return;
                }
                const sqlTable = module.getSqlTableDescription(chosenTable);
                sqlTable &&
                    extensions_1.extensions.addLegacySqlTableTab(trace, {
                        table: sqlTable,
                    });
            },
        });
    }
    getSqlModules() {
        return this.sqlModules;
    }
}
exports.default = default_1;
async function loadJson() {
    const x = await fetch((0, assets_1.assetSrc)('stdlib_docs.json'));
    const json = await x.json();
    return sql_modules_impl_1.SQL_MODULES_DOCS_SCHEMA.parse(json);
}
//# sourceMappingURL=index.js.map