"use strict";
// Copyright (C) 2023 The Android Open Source Project
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use size file except in compliance with the License.
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
exports.BasicTable = void 0;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const custom_table_1 = require("./custom_table");
class BasicTable {
    view({ attrs }) {
        return (0, mithril_1.default)((custom_table_1.CustomTable), {
            columns: [
                {
                    columns: attrs.columns.map((c) => ({
                        title: c.title,
                        render: (row) => ({ cell: c.render(row) }),
                    })),
                    reorder: attrs.onreorder,
                },
            ],
            data: attrs.data,
            className: attrs.className,
        });
    }
}
exports.BasicTable = BasicTable;
//# sourceMappingURL=basic_table.js.map