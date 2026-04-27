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
const queries_1 = require("../../components/query_table/queries");
const query_table_1 = require("../../components/query_table/query_table");
const editor_1 = require("../../widgets/editor");
const query_page_1 = require("./query_page");
const query_history_1 = require("../../components/widgets/query_history");
const resize_handle_1 = require("../../widgets/resize_handle");
const dom_utils_1 = require("../../base/dom_utils");
const logging_1 = require("../../base/logging");
const query_result_tab_1 = require("../../components/query_table/query_result_tab");
class QueryPagePlugin {
    static id = 'dev.perfetto.QueryPage';
    static addQueryPageMiniFlag;
    static onActivate(app) {
        QueryPagePlugin.addQueryPageMiniFlag = app.featureFlags.register({
            id: 'dev.perfetto.QueryPage',
            name: 'Enable mini query page tab',
            defaultValue: false,
            description: 'Enables a tab version of the query page that allows query tab - like functionality in the tab drawer',
        });
    }
    async onTraceLoad(trace) {
        // The query page and tab share the same query data.
        let executedQuery;
        let queryResult;
        let editorText = '';
        const onExecute = async (text) => {
            if (!text) {
                return;
            }
            query_history_1.queryHistoryStorage.saveQuery(text);
            executedQuery = text;
            queryResult = undefined;
            queryResult = await (0, queries_1.runQueryForQueryTable)(text, trace.engine);
            // TODO(stevegolton): Just show the mini query page instead of adding an
            // ephemeral tab.
            // if (QueryPagePlugin.addQueryPageMiniFlag.get()) {
            //   trace.tabs.showTab('dev.perfetto.QueryPage');
            // }
            (0, query_result_tab_1.addQueryResultsTab)(trace, {
                query: executedQuery,
                title: 'Standalone Query',
                prefetchedResponse: queryResult,
            }, 'analyze_page_query');
        };
        trace.pages.registerPage({
            route: '/query',
            render: () => (0, mithril_1.default)(query_page_1.QueryPage, {
                trace,
                editorText,
                executedQuery,
                queryResult,
                onEditorContentUpdate: (text) => (editorText = text),
                onExecute,
            }),
        });
        trace.sidebar.addMenuItem({
            section: 'current_trace',
            text: 'Query (SQL)',
            href: '#!/query',
            icon: 'database',
            sortOrder: 1,
        });
        if (QueryPagePlugin.addQueryPageMiniFlag.get()) {
            trace.tabs.registerTab({
                uri: 'dev.perfetto.QueryPage',
                isEphemeral: false,
                content: {
                    render() {
                        return (0, mithril_1.default)(QueryPageMini, {
                            trace,
                            editorText,
                            executedQuery,
                            queryResult,
                            onEditorContentUpdate: (text) => (editorText = text),
                            onExecute,
                        });
                    },
                    getTitle() {
                        return 'QueryPage Mini';
                    },
                },
            });
        }
    }
}
exports.default = QueryPagePlugin;
class QueryPageMini {
    editorHeight = 0;
    editorElement;
    oncreate({ dom }) {
        this.editorElement = (0, dom_utils_1.toHTMLElement)((0, logging_1.assertExists)((0, dom_utils_1.findRef)(dom, 'editor')));
        this.editorElement.style.height = '200px';
    }
    view({ attrs }) {
        return (0, mithril_1.default)('.pf-query-page-mini', (0, mithril_1.default)(editor_1.Editor, {
            ref: 'editor',
            language: 'perfetto-sql',
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
        }), attrs.executedQuery === undefined
            ? null
            : (0, mithril_1.default)(query_table_1.QueryTable, {
                trace: attrs.trace,
                query: attrs.executedQuery,
                resp: attrs.queryResult,
                fillParent: false,
            }));
    }
}
//# sourceMappingURL=index.js.map