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
const anchor_1 = require("../../widgets/anchor");
const button_1 = require("../../widgets/button");
const callout_1 = require("../../widgets/callout");
const details_shell_1 = require("../../widgets/details_shell");
const download_utils_1 = require("../../base/download_utils");
const router_1 = require("../../core/router");
const app_impl_1 = require("../../core/app_impl");
const menu_1 = require("../../widgets/menu");
const semantic_icons_1 = require("../../base/semantic_icons");
// Controls how many rows we see per page when showing paginated results.
const ROWS_PER_PAGE = 50;
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
class QueryTableRow {
    trace;
    constructor({ attrs }) {
        this.trace = attrs.trace;
    }
    view(vnode) {
        const { row, columns } = vnode.attrs;
        const cells = columns.map((col) => this.renderCell(col, row[col]));
        // TODO(dproy): Make click handler work from analyze page.
        if (router_1.Router.parseUrl(window.location.href).page === '/viewer' &&
            isSliceish(row)) {
            return (0, mithril_1.default)('tr', {
                onclick: () => this.selectAndRevealSlice(row, false),
                // TODO(altimin): Consider improving the logic here (e.g. delay?) to
                // account for cases when dblclick fires late.
                ondblclick: () => this.selectAndRevealSlice(row, true),
                clickable: true,
                title: 'Go to slice',
            }, cells);
        }
        else {
            return (0, mithril_1.default)('tr', cells);
        }
    }
    renderCell(name, value) {
        if (value instanceof Uint8Array) {
            return (0, mithril_1.default)('td', this.renderBlob(name, value));
        }
        else {
            return (0, mithril_1.default)('td', `${value}`);
        }
    }
    renderBlob(name, value) {
        return (0, mithril_1.default)(anchor_1.Anchor, {
            onclick: () => (0, download_utils_1.downloadData)(`${name}.blob`, value),
        }, `Blob (${value.length} bytes)`);
    }
    selectAndRevealSlice(row, switchToCurrentSelectionTab) {
        const sliceId = getSliceId(row);
        if (sliceId === undefined) {
            return;
        }
        this.trace.selection.selectSqlEvent('slice', sliceId, {
            switchToCurrentSelectionTab,
            scrollToSelection: true,
        });
    }
}
class QueryTableContent {
    view({ attrs }) {
        const cols = [];
        for (const col of attrs.columns) {
            cols.push((0, mithril_1.default)('td', col));
        }
        const tableHeader = (0, mithril_1.default)('tr', cols);
        const rows = attrs.rows.map((row) => {
            return (0, mithril_1.default)(QueryTableRow, {
                trace: attrs.trace,
                row,
                columns: attrs.columns,
            });
        });
        return (0, mithril_1.default)('table.pf-query-table', (0, mithril_1.default)('thead', tableHeader), (0, mithril_1.default)('tbody', rows));
    }
}
class QueryTable {
    trace;
    pageNumber = 0;
    constructor({ attrs }) {
        this.trace = attrs.trace;
    }
    view({ attrs }) {
        const { resp, query, contextButtons = [], fillParent } = attrs;
        // Clamp the page number to ensure the page count doesn't exceed the number
        // of rows in the results.
        if (resp) {
            const pageCount = this.getPageCount(resp.rows.length);
            if (this.pageNumber >= pageCount) {
                this.pageNumber = Math.max(0, pageCount - 1);
            }
        }
        else {
            this.pageNumber = 0;
        }
        return (0, mithril_1.default)(details_shell_1.DetailsShell, {
            title: this.renderTitle(resp),
            description: query,
            buttons: this.renderButtons(query, contextButtons, resp),
            fillParent,
        }, resp && this.renderTableContent(resp));
    }
    getPageCount(rowCount) {
        return Math.floor((rowCount - 1) / ROWS_PER_PAGE) + 1;
    }
    getFirstRowInPage() {
        return this.pageNumber * ROWS_PER_PAGE;
    }
    getCountOfRowsInPage(totalRows) {
        const firstRow = this.getFirstRowInPage();
        const endStop = Math.min(firstRow + ROWS_PER_PAGE, totalRows);
        return endStop - firstRow;
    }
    renderTitle(resp) {
        if (!resp) {
            return 'Query - running';
        }
        const result = resp.error ? 'error' : `${resp.rows.length} rows`;
        if (app_impl_1.AppImpl.instance.testingMode) {
            // Omit the duration in tests, they cause screenshot diff failures.
            return `Query result (${result})`;
        }
        return `Query result (${result}) - ${resp.durationMs.toLocaleString()}ms`;
    }
    renderButtons(query, contextButtons, resp) {
        return [
            resp && this.renderPrevNextButtons(resp),
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
                    onclick: () => queryResponseAsTsvToClipboard(resp),
                }),
                (0, mithril_1.default)(menu_1.MenuItem, {
                    label: 'Result (.md)',
                    onclick: () => queryResponseAsMarkdownToClipboard(resp),
                }),
            ]),
        ];
    }
    renderPrevNextButtons(resp) {
        const from = this.getFirstRowInPage();
        const to = Math.min(from + this.getCountOfRowsInPage(resp.rows.length)) - 1;
        const pageCount = this.getPageCount(resp.rows.length);
        return [
            `Showing rows ${from + 1} to ${to + 1} of ${resp.rows.length}`,
            (0, mithril_1.default)(button_1.Button, {
                label: 'Prev',
                icon: 'skip_previous',
                title: 'Go to previous page of results',
                disabled: this.pageNumber === 0,
                onclick: () => {
                    this.pageNumber = Math.max(0, this.pageNumber - 1);
                },
            }),
            (0, mithril_1.default)(button_1.Button, {
                label: 'Next',
                icon: 'skip_next',
                title: 'Go to next page of results',
                disabled: this.pageNumber >= pageCount - 1,
                onclick: () => {
                    this.pageNumber = Math.min(pageCount - 1, this.pageNumber + 1);
                },
            }),
        ];
    }
    renderTableContent(resp) {
        return (0, mithril_1.default)('.pf-query-panel', resp.statementWithOutputCount > 1 &&
            (0, mithril_1.default)('.pf-query-warning', (0, mithril_1.default)(callout_1.Callout, { icon: 'warning' }, `${resp.statementWithOutputCount} out of ${resp.statementCount} `, 'statements returned a result. ', 'Only the results for the last statement are displayed.')), this.renderContent(resp));
    }
    renderContent(resp) {
        if (resp.error) {
            return (0, mithril_1.default)('.query-error', `SQL error: ${resp.error}`);
        }
        // Pick out only the rows in this page.
        const rowOffset = this.getFirstRowInPage();
        const totalRows = this.getCountOfRowsInPage(resp.rows.length);
        const rowsInPage = [];
        for (let rowIndex = rowOffset; rowIndex < rowOffset + totalRows; ++rowIndex) {
            rowsInPage.push(resp.rows[rowIndex]);
        }
        return (0, mithril_1.default)(QueryTableContent, {
            trace: this.trace,
            columns: resp.columns,
            rows: rowsInPage,
        });
    }
}
exports.QueryTable = QueryTable;
async function queryResponseAsTsvToClipboard(resp) {
    const lines = [];
    lines.push(resp.columns);
    for (const row of resp.rows) {
        const line = [];
        for (const col of resp.columns) {
            const value = row[col];
            line.push(value === null ? 'NULL' : `${value}`);
        }
        lines.push(line);
    }
    await (0, clipboard_1.copyToClipboard)(lines.map((line) => line.join('\t')).join('\n'));
}
async function queryResponseAsMarkdownToClipboard(resp) {
    // Convert all values to strings.
    // rows = [header, separators, ...body]
    const rows = [];
    rows.push(resp.columns);
    rows.push(resp.columns.map((_) => '---'));
    for (const responseRow of resp.rows) {
        rows.push(resp.columns.map((responseCol) => {
            const value = responseRow[responseCol];
            return value === null ? 'NULL' : `${value}`;
        }));
    }
    // Find the maximum width of each column.
    const maxWidths = Array(resp.columns.length).fill(0);
    for (const row of rows) {
        for (let i = 0; i < resp.columns.length; i++) {
            if (row[i].length > maxWidths[i]) {
                maxWidths[i] = row[i].length;
            }
        }
    }
    const text = rows
        .map((row, rowIndex) => {
        // Pad each column to the maximum width with hyphens (separator row) or
        // spaces (all other rows).
        const expansionChar = rowIndex === 1 ? '-' : ' ';
        const line = row.map((str, colIndex) => str + expansionChar.repeat(maxWidths[colIndex] - str.length));
        return `| ${line.join(' | ')} |`;
    })
        .join('\n');
    await (0, clipboard_1.copyToClipboard)(text);
}
//# sourceMappingURL=query_table.js.map