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
exports.QueryPage = void 0;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const dom_utils_1 = require("../../base/dom_utils");
const download_utils_1 = require("../../base/download_utils");
const json_utils_1 = require("../../base/json_utils");
const logging_1 = require("../../base/logging");
const semantic_icons_1 = require("../../base/semantic_icons");
const queries_1 = require("../../components/query_table/queries");
const data_grid_1 = require("../../components/widgets/data_grid/data_grid");
const in_memory_data_source_1 = require("../../components/widgets/data_grid/in_memory_data_source");
const query_history_1 = require("../../components/widgets/query_history");
const box_1 = require("../../widgets/box");
const button_1 = require("../../widgets/button");
const callout_1 = require("../../widgets/callout");
const common_1 = require("../../widgets/common");
const editor_1 = require("../../widgets/editor");
const hotkey_glyphs_1 = require("../../widgets/hotkey_glyphs");
const menu_1 = require("../../widgets/menu");
const resize_handle_1 = require("../../widgets/resize_handle");
const stack_1 = require("../../widgets/stack");
const icon_1 = require("../../widgets/icon");
const copy_to_clipboard_button_1 = require("../../widgets/copy_to_clipboard_button");
const anchor_1 = require("../../widgets/anchor");
const HIDE_PERFETTO_SQL_AGENT_BANNER_KEY = 'hidePerfettoSqlAgentBanner';
class QueryPage {
    dataSource;
    editorHeight = 0;
    editorElement;
    dataGridCopyHelper = new copy_to_clipboard_button_1.CopyHelper();
    oncreate({ dom }) {
        this.editorElement = (0, dom_utils_1.toHTMLElement)((0, logging_1.assertExists)((0, dom_utils_1.findRef)(dom, 'editor')));
        this.editorElement.style.height = '200px';
    }
    onbeforeupdate(vnode, oldVnode) {
        // Update the datasource if present
        if (vnode.attrs.queryResult !== oldVnode.attrs.queryResult) {
            if (vnode.attrs.queryResult) {
                this.dataSource = new in_memory_data_source_1.InMemoryDataSource(vnode.attrs.queryResult.rows);
            }
            else {
                this.dataSource = undefined;
            }
        }
    }
    view({ attrs }) {
        return (0, mithril_1.default)('.pf-query-page', (0, mithril_1.default)(box_1.Box, { className: 'pf-query-page__toolbar' }, [
            (0, mithril_1.default)(stack_1.Stack, { orientation: 'horizontal' }, [
                (0, mithril_1.default)(button_1.Button, {
                    label: 'Run Query',
                    icon: 'play_arrow',
                    intent: common_1.Intent.Primary,
                    variant: button_1.ButtonVariant.Filled,
                    onclick: () => {
                        attrs.onExecute?.(attrs.editorText);
                    },
                }),
                (0, mithril_1.default)(stack_1.Stack, {
                    orientation: 'horizontal',
                    className: 'pf-query-page__hotkeys',
                }, 'or press', (0, mithril_1.default)(hotkey_glyphs_1.HotkeyGlyphs, { hotkey: 'Mod+Enter' })),
                (0, mithril_1.default)(stack_1.StackAuto), // The spacer pushes the following buttons to the right.
                attrs.trace.isInternalUser &&
                    (0, mithril_1.default)(button_1.Button, {
                        icon: 'wand_stars',
                        title: 'Generate SQL queries with the Perfetto SQL Agent! Give feedback: go/perfetto-llm-bug',
                        label: 'Generate SQL Queries with AI',
                        onclick: () => {
                            window.open('http://go/perfetto-sql-agent', '_blank');
                        },
                    }),
                (0, mithril_1.default)(copy_to_clipboard_button_1.CopyToClipboardButton, {
                    textToCopy: attrs.editorText,
                    title: 'Copy query to clipboard',
                    label: 'Copy Query',
                }),
            ]),
        ]), this.shouldDisplayPerfettoSqlAgentBanner(attrs) &&
            (0, mithril_1.default)(box_1.Box, (0, mithril_1.default)(callout_1.Callout, {
                icon: 'wand_stars',
                dismissable: true,
                onDismiss: () => {
                    this.hidePerfettoSqlAgentBanner();
                },
            }, [
                'Try out the ',
                (0, mithril_1.default)(anchor_1.Anchor, {
                    href: 'http://go/perfetto-sql-agent',
                    target: '_blank',
                    icon: semantic_icons_1.Icons.ExternalLink,
                }, 'Perfetto SQL Agent'),
                ' to generate SQL queries and ',
                (0, mithril_1.default)(anchor_1.Anchor, {
                    href: 'http://go/perfetto-llm-user-guide#report-issues',
                    target: '_blank',
                    icon: semantic_icons_1.Icons.ExternalLink,
                }, 'give feedback'),
                '!',
            ])), attrs.editorText.includes('"') &&
            (0, mithril_1.default)(box_1.Box, (0, mithril_1.default)(callout_1.Callout, { icon: 'warning', intent: common_1.Intent.None }, `" (double quote) character observed in query; if this is being used to ` +
                `define a string, please use ' (single quote) instead. Using double quotes ` +
                `can cause subtle problems which are very hard to debug.`)), (0, mithril_1.default)(editor_1.Editor, {
            ref: 'editor',
            language: 'perfetto-sql',
            text: attrs.editorText,
            onUpdate: attrs.onEditorContentUpdate,
            onExecute: attrs.onExecute,
        }), (0, mithril_1.default)(resize_handle_1.ResizeHandle, {
            onResize: (deltaPx) => {
                this.editorHeight += deltaPx;
                this.editorElement.style.height = `${this.editorHeight}px`;
            },
            onResizeStart: () => {
                this.editorHeight = this.editorElement.clientHeight;
            },
        }), this.dataSource &&
            attrs.queryResult &&
            this.renderQueryResult(attrs.queryResult, this.dataSource), (0, mithril_1.default)(query_history_1.QueryHistoryComponent, {
            className: 'pf-query-page__history',
            trace: attrs.trace,
            runQuery: (query) => {
                attrs.onExecute?.(query);
            },
            setQuery: (query) => {
                attrs.onEditorContentUpdate?.(query);
            },
        }));
    }
    renderQueryResult(queryResult, dataSource) {
        const queryTimeString = `${queryResult.durationMs.toFixed(1)} ms`;
        if (queryResult.error) {
            return (0, mithril_1.default)('.pf-query-page__query-error', `SQL error: ${queryResult.error}`);
        }
        else {
            return [
                queryResult.statementWithOutputCount > 1 &&
                    (0, mithril_1.default)(box_1.Box, [
                        (0, mithril_1.default)(callout_1.Callout, { icon: 'warning', intent: common_1.Intent.None }, [
                            `${queryResult.statementWithOutputCount} out of ${queryResult.statementCount} `,
                            'statements returned a result. ',
                            'Only the results for the last statement are displayed.',
                        ]),
                    ]),
                (0, mithril_1.default)(data_grid_1.DataGrid, {
                    className: 'pf-query-page__results',
                    data: dataSource,
                    columns: queryResult.columns.map((c) => ({ name: c })),
                    toolbarItemsLeft: (0, mithril_1.default)('span.pf-query-page__elapsed-time', { title: `This query returned in ${queryTimeString}` }, [(0, mithril_1.default)(icon_1.Icon, { icon: 'timer' }), ' ', queryTimeString]),
                    toolbarItemsRight: [
                        this.renderCopyButton(queryResult),
                        this.renderDownloadButton(queryResult),
                    ],
                }),
            ];
        }
    }
    renderCopyButton(resp) {
        const helper = this.dataGridCopyHelper;
        const label = helper.copied ? 'Copied' : 'Copy';
        const icon = helper.copied ? semantic_icons_1.Icons.Check : semantic_icons_1.Icons.Copy;
        const intent = helper.copied ? common_1.Intent.Success : common_1.Intent.None;
        return (0, mithril_1.default)(menu_1.PopupMenu, {
            trigger: (0, mithril_1.default)(button_1.Button, {
                icon,
                intent,
                title: 'Copy results to clipboard',
                label,
            }),
        }, [
            (0, mithril_1.default)(menu_1.MenuItem, {
                label: 'TSV',
                onclick: async () => {
                    const content = (0, queries_1.formatAsDelimited)(resp);
                    await helper.copy(content);
                },
            }),
            (0, mithril_1.default)(menu_1.MenuItem, {
                label: 'Markdown',
                onclick: async () => {
                    const content = (0, queries_1.formatAsMarkdownTable)(resp);
                    await helper.copy(content);
                },
            }),
            (0, mithril_1.default)(menu_1.MenuItem, {
                label: 'JSON',
                onclick: async () => {
                    const content = (0, json_utils_1.stringifyJsonWithBigints)(resp.rows);
                    await helper.copy(content);
                },
            }),
        ]);
    }
    renderDownloadButton(resp) {
        return (0, mithril_1.default)(menu_1.PopupMenu, {
            trigger: (0, mithril_1.default)(button_1.Button, {
                icon: semantic_icons_1.Icons.Download,
                title: 'Download data',
                label: 'Download',
            }),
        }, [
            (0, mithril_1.default)(menu_1.MenuItem, {
                label: 'TSV',
                onclick: () => {
                    const content = (0, queries_1.formatAsDelimited)(resp);
                    (0, download_utils_1.download)({
                        content,
                        mimeType: 'text/tab-separated-values',
                        fileName: 'query_result.tsv',
                    });
                },
            }),
            (0, mithril_1.default)(menu_1.MenuItem, {
                label: 'Markdown',
                onclick: () => {
                    const content = (0, queries_1.formatAsMarkdownTable)(resp);
                    (0, download_utils_1.download)({
                        content,
                        mimeType: 'text/markdown',
                        fileName: 'query_result.md',
                    });
                },
            }),
            (0, mithril_1.default)(menu_1.MenuItem, {
                label: 'JSON',
                onclick: () => {
                    const content = (0, json_utils_1.stringifyJsonWithBigints)(resp.rows, 2);
                    (0, download_utils_1.download)({
                        content,
                        mimeType: 'text/json',
                        fileName: 'query_result.json',
                    });
                },
            }),
        ]);
    }
    shouldDisplayPerfettoSqlAgentBanner(attrs) {
        return (attrs.trace.isInternalUser &&
            localStorage.getItem(HIDE_PERFETTO_SQL_AGENT_BANNER_KEY) !== 'true');
    }
    hidePerfettoSqlAgentBanner() {
        localStorage.setItem(HIDE_PERFETTO_SQL_AGENT_BANNER_KEY, 'true');
    }
}
exports.QueryPage = QueryPage;
//# sourceMappingURL=query_page.js.map