"use strict";
// Copyright (C) 2020 The Android Open Source Project
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
exports.QueryTable = void 0;
exports.isSliceish = isSliceish;
exports.getSliceId = getSliceId;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const clipboard_1 = require("../../base/clipboard");
const queries_1 = require("./queries");
const button_1 = require("../../widgets/button");
const callout_1 = require("../../widgets/callout");
const details_shell_1 = require("../../widgets/details_shell");
const router_1 = require("../../core/router");
const menu_1 = require("../../widgets/menu");
const semantic_icons_1 = require("../../base/semantic_icons");
const data_grid_1 = require("../widgets/data_grid/data_grid");
const in_memory_data_source_1 = require("../widgets/data_grid/in_memory_data_source");
const anchor_1 = require("../../widgets/anchor");
const box_1 = require("../../widgets/box");
function isIntegral(x) {
    return (typeof x === 'bigint' || (typeof x === 'number' && Number.isInteger(x)));
}
function hasTs(row) {
    return 'ts' in row && isIntegral(row.ts);
}
function hasDur(row) {
    return 'dur' in row && isIntegral(row.dur);
}
function hasTrackId(row) {
    return 'track_id' in row && isIntegral(row.track_id);
}
function hasSliceId(row) {
    return 'slice_id' in row && isIntegral(row.slice_id);
}
function isSliceish(row) {
    return hasTs(row) && hasDur(row) && hasTrackId(row);
}
// Attempts to extract a slice ID from a row, or undefined if none can be found
function getSliceId(row) {
    if (hasSliceId(row)) {
        return Number(row.slice_id);
    }
    return undefined;
}
class QueryTable {
    trace;
    dataSource;
    constructor({ attrs }) {
        this.trace = attrs.trace;
        if (attrs.resp) {
            this.dataSource = new in_memory_data_source_1.InMemoryDataSource(attrs.resp.rows);
        }
    }
    onbeforeupdate(vnode, old) {
        if (vnode.attrs.resp !== old.attrs.resp) {
            if (vnode.attrs.resp) {
                this.dataSource = new in_memory_data_source_1.InMemoryDataSource(vnode.attrs.resp.rows);
            }
            else {
                this.dataSource = undefined;
            }
        }
    }
    view({ attrs }) {
        const { resp, query, contextButtons = [], fillParent } = attrs;
        return (0, mithril_1.default)(details_shell_1.DetailsShell, {
            className: 'pf-query-table',
            title: this.renderTitle(resp),
            description: query,
            buttons: this.renderButtons(query, contextButtons, resp),
            fillParent,
        }, resp && this.dataSource && this.renderTableContent(resp, this.dataSource));
    }
    renderTitle(resp) {
        if (!resp) {
            return 'Query - running';
        }
        const result = resp.error ? 'error' : `${resp.rows.length} rows`;
        return `Query result (${result}) - ${resp.durationMs.toLocaleString()}ms`;
    }
    renderButtons(query, contextButtons, resp) {
        return [
            contextButtons,
            (0, mithril_1.default)(menu_1.PopupMenu, {
                trigger: (0, mithril_1.default)(button_1.Button, {
                    label: 'Copy',
                    rightIcon: semantic_icons_1.Icons.ContextMenu,
                }),
            }, (0, mithril_1.default)(menu_1.MenuItem, {
                label: 'Query',
                onclick: () => (0, clipboard_1.copyToClipboard)(query),
            }), resp &&
                resp.error === undefined && [
                (0, mithril_1.default)(menu_1.MenuItem, {
                    label: 'Result (.tsv)',
                    onclick: async () => {
                        const tsv = (0, queries_1.formatAsDelimited)(resp);
                        await (0, clipboard_1.copyToClipboard)(tsv);
                    },
                }),
                (0, mithril_1.default)(menu_1.MenuItem, {
                    label: 'Result (.md)',
                    onclick: async () => {
                        const markdown = (0, queries_1.formatAsMarkdownTable)(resp);
                        await (0, clipboard_1.copyToClipboard)(markdown);
                    },
                }),
            ]),
        ];
    }
    renderTableContent(resp, dataSource) {
        return (0, mithril_1.default)('.pf-query-panel', resp.statementWithOutputCount > 1 &&
            (0, mithril_1.default)(box_1.Box, [
                (0, mithril_1.default)(callout_1.Callout, { icon: 'warning' }, [
                    `${resp.statementWithOutputCount} out of ${resp.statementCount} `,
                    'statements returned a result. ',
                    'Only the results for the last statement are displayed.',
                ]),
            ]), this.renderContent(resp, dataSource));
    }
    renderContent(resp, dataSource) {
        if (resp.error) {
            return (0, mithril_1.default)('.pf-query-panel__query-error', `SQL error: ${resp.error}`);
        }
        const onViewerPage = router_1.Router.parseUrl(window.location.href).page === '/viewer';
        return (0, mithril_1.default)(data_grid_1.DataGrid, {
            // If filters are defined by no onFilterChanged handler, the grid operates
            // in filter read only mode.
            fillHeight: true,
            filters: [],
            columns: resp.columns.map((c) => ({ name: c })),
            data: dataSource,
            cellRenderer: (value, name, row) => {
                const sliceId = getSliceId(row);
                const cell = (0, data_grid_1.renderCell)(value, name);
                if (name === 'id' &&
                    sliceId !== undefined &&
                    onViewerPage &&
                    isSliceish(row)) {
                    return (0, mithril_1.default)(anchor_1.Anchor, {
                        title: 'Go to slice',
                        icon: semantic_icons_1.Icons.UpdateSelection,
                        onclick: () => this.goToSlice(sliceId, false),
                        ondblclick: () => this.goToSlice(sliceId, true),
                    }, cell);
                }
                else {
                    return cell;
                }
            },
        });
    }
    goToSlice(sliceId, switchToCurrentSelectionTab) {
        this.trace.selection.selectSqlEvent('slice', sliceId, {
            switchToCurrentSelectionTab,
            scrollToSelection: true,
        });
    }
}
exports.QueryTable = QueryTable;
//# sourceMappingURL=query_table.js.map