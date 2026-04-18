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
exports.JANKS_TRACK_URI = exports.EVENT_LATENCY_TRACK_URI = exports.SCROLLS_TRACK_URI = void 0;
exports.renderSliceRef = renderSliceRef;
exports.renderSqlRef = renderSqlRef;
exports.rows = rows;
exports.fromSqlBool = fromSqlBool;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const anchor_1 = require("../../widgets/anchor");
const semantic_icons_1 = require("../../base/semantic_icons");
const sql_ref_1 = require("../../widgets/sql_ref");
const menu_1 = require("../../widgets/menu");
const extensions_1 = require("../../components/extensions");
exports.SCROLLS_TRACK_URI = 'perfetto.ChromeScrollJank#toplevelScrolls';
exports.EVENT_LATENCY_TRACK_URI = 'perfetto.ChromeScrollJank#eventLatency';
exports.JANKS_TRACK_URI = 'perfetto.ChromeScrollJank#scrollJankV3';
function renderSliceRef(args) {
    return (0, mithril_1.default)(anchor_1.Anchor, {
        icon: semantic_icons_1.Icons.UpdateSelection,
        onclick: () => {
            args.trace.selection.selectTrackEvent(args.trackUri, args.id, {
                scrollToSelection: true,
            });
        },
    }, args.title);
}
function renderSqlRef(args) {
    return (0, mithril_1.default)(sql_ref_1.SqlRef, {
        table: args.tableName,
        id: args.id,
        additionalMenuItems: args.tableDescription && [
            (0, mithril_1.default)(menu_1.MenuItem, {
                label: 'Show query results',
                icon: 'table',
                onclick: () => extensions_1.extensions.addLegacySqlTableTab(args.trace, {
                    table: args.tableDescription,
                    filters: [
                        {
                            op: ([columnName]) => `${columnName} = ${args.id}`,
                            columns: ['id'],
                        },
                    ],
                }),
            }),
        ],
    });
}
/**
 * Returns an array of the rows in `queryResult`.
 *
 * Warning: Only use this function in contexts where the number of rows is
 * guaranteed to be small. Prefer doing transformations in SQL where possible.
 */
function rows(queryResult, spec) {
    const results = [];
    for (const it = queryResult.iter(spec); it.valid(); it.next()) {
        const row = {};
        for (const key of Object.keys(spec)) {
            row[key] = it[key];
        }
        results.push(row);
    }
    return results;
}
function fromSqlBool(value) {
    if (value === null) {
        return undefined;
    }
    else {
        return value !== 0;
    }
}
//# sourceMappingURL=utils.js.map