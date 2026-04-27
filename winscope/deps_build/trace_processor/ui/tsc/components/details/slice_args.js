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
exports.renderSliceArguments = renderSliceArguments;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const menu_1 = require("../../widgets/menu");
const args_1 = require("./args");
const extensions_1 = require("../extensions");
const logging_1 = require("../../base/logging");
const sql_table_registry_1 = require("../widgets/sql/table/sql_table_registry");
const string_utils_1 = require("../../base/string_utils");
// Renders slice arguments (key/value pairs) as a subtree.
function renderSliceArguments(trace, args) {
    return (0, args_1.renderArguments)(trace, args, (arg) => {
        return [
            (0, mithril_1.default)(menu_1.MenuItem, {
                label: 'Find slices with same arg value',
                icon: 'search',
                onclick: () => {
                    extensions_1.extensions.addLegacySqlTableTab(trace, {
                        table: (0, logging_1.assertExists)((0, sql_table_registry_1.getSqlTableDescription)(trace, 'slice')),
                        filters: [
                            {
                                op: (cols) => `${cols[0]} = ${(0, string_utils_1.sqliteString)(arg.displayValue)}`,
                                columns: [
                                    {
                                        column: 'display_value',
                                        source: {
                                            table: 'args',
                                            joinOn: {
                                                arg_set_id: 'arg_set_id',
                                                key: (0, string_utils_1.sqliteString)(arg.flatKey),
                                            },
                                        },
                                    },
                                ],
                            },
                        ],
                    });
                },
            }),
            (0, mithril_1.default)(menu_1.MenuItem, {
                label: 'Visualize argument values',
                icon: 'query_stats',
                onclick: () => {
                    extensions_1.extensions.addVisualizedArgTracks(trace, arg.flatKey);
                },
            }),
        ];
    });
}
//# sourceMappingURL=slice_args.js.map