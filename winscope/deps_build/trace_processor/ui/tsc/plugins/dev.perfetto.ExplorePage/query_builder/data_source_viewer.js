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
exports.DataSourceViewer = void 0;
exports.queryToRun = queryToRun;
exports.analyzeNode = analyzeNode;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const text_paragraph_1 = require("../../../widgets/text_paragraph");
const query_table_1 = require("../../../components/query_table/query_table");
const queries_1 = require("../../../components/query_table/queries");
const async_limiter_1 = require("../../../base/async_limiter");
const segmented_buttons_1 = require("../../../widgets/segmented_buttons");
const query_node_1 = require("../query_node");
const column_controller_1 = require("./column_controller");
const section_1 = require("../../../widgets/section");
const clipboard_1 = require("../../../base/clipboard");
const button_1 = require("../../../widgets/button");
const semantic_icons_1 = require("../../../base/semantic_icons");
var SelectedView;
(function (SelectedView) {
    SelectedView[SelectedView["COLUMNS"] = 0] = "COLUMNS";
    SelectedView[SelectedView["SQL"] = 1] = "SQL";
    SelectedView[SelectedView["PROTO"] = 2] = "PROTO";
})(SelectedView || (SelectedView = {}));
class DataSourceViewer {
    tableAsyncLimiter = new async_limiter_1.AsyncLimiter();
    queryResult;
    showDataSourceInfoPanel = 0;
    prevSqString;
    curSqString;
    currentSql;
    view({ attrs }) {
        function renderPickColumns(node) {
            return (0, mithril_1.default)(column_controller_1.ColumnController, {
                options: node.finalCols,
                onChange: (diffs) => {
                    diffs.forEach(({ id, checked, alias }) => {
                        if (node.finalCols === undefined) {
                            return;
                        }
                        for (const option of node.finalCols) {
                            if (option.id === id) {
                                option.checked = checked;
                                option.alias = alias;
                            }
                        }
                    });
                },
            });
        }
        const renderTable = () => {
            if (this.queryResult === undefined) {
                return;
            }
            if (this.queryResult.error !== undefined) {
                return (0, mithril_1.default)(text_paragraph_1.TextParagraph, { text: `Error: ${this.queryResult.error}` });
            }
            return (this.currentSql &&
                (0, mithril_1.default)(query_table_1.QueryTable, {
                    trace: attrs.trace,
                    query: queryToRun(this.currentSql),
                    resp: this.queryResult,
                    fillParent: false,
                }));
        };
        const renderButtons = () => {
            return (0, mithril_1.default)(segmented_buttons_1.SegmentedButtons, {
                ...attrs,
                options: [
                    { label: 'Show columns' },
                    { label: 'Show SQL' },
                    { label: 'Show proto' },
                ],
                selectedOption: this.showDataSourceInfoPanel,
                onOptionSelected: (num) => {
                    this.showDataSourceInfoPanel = num;
                },
            });
        };
        const sq = attrs.queryNode.getStructuredQuery();
        if (sq === undefined)
            return;
        this.curSqString = JSON.stringify(sq.toJSON(), null, 2);
        if (this.curSqString !== this.prevSqString) {
            this.tableAsyncLimiter.schedule(async () => {
                this.currentSql = await analyzeNode(attrs.queryNode, attrs.trace.engine);
                if (this.currentSql === undefined) {
                    return;
                }
                this.queryResult = await (0, queries_1.runQueryForQueryTable)(attrs.queryNode.type === query_node_1.NodeType.kSqlSource
                    ? queryToRun(this.currentSql)
                    : `${queryToRun(this.currentSql)} LIMIT 50`, attrs.trace.engine);
                this.prevSqString = this.curSqString;
            });
        }
        if (this.currentSql === undefined)
            return;
        const sql = queryToRun(this.currentSql);
        return [
            (0, mithril_1.default)(section_1.Section, { title: attrs.queryNode.getTitle() }, attrs.queryNode.getDetails(), renderButtons(), this.showDataSourceInfoPanel === SelectedView.SQL &&
                (0, mithril_1.default)('.code-snippet', (0, mithril_1.default)(button_1.Button, {
                    title: 'Copy to clipboard',
                    onclick: () => (0, clipboard_1.copyToClipboard)(sql ?? ''),
                    icon: semantic_icons_1.Icons.Copy,
                }), (0, mithril_1.default)('code', sql)), this.showDataSourceInfoPanel === SelectedView.COLUMNS &&
                renderPickColumns(attrs.queryNode), this.showDataSourceInfoPanel === SelectedView.PROTO &&
                (0, mithril_1.default)('.code-snippet', (0, mithril_1.default)(button_1.Button, {
                    title: 'Copy to clipboard',
                    onclick: () => (0, clipboard_1.copyToClipboard)(this.currentSql?.textproto ?? ''),
                    icon: semantic_icons_1.Icons.Copy,
                }), (0, mithril_1.default)('code', this.currentSql.textproto))),
            (0, mithril_1.default)(section_1.Section, { title: 'Sample data' }, renderTable()),
        ];
    }
}
exports.DataSourceViewer = DataSourceViewer;
function getStructuredQueries(finalNode) {
    if (finalNode.finalCols === undefined) {
        return;
    }
    const revStructuredQueries = [];
    let curNode = finalNode;
    while (curNode) {
        const curSq = curNode.getStructuredQuery();
        if (curSq === undefined) {
            return;
        }
        revStructuredQueries.push(curSq);
        if (curNode.prevNode && !curNode.prevNode.validate()) {
            return;
        }
        curNode = curNode.prevNode;
    }
    return revStructuredQueries.reverse();
}
function queryToRun(sql) {
    const includes = sql.modules.map((c) => `INCLUDE PERFETTO MODULE ${c};\n`);
    return includes + sql.sql;
}
async function analyzeNode(node, engine) {
    const structuredQueries = getStructuredQueries(node);
    if (structuredQueries === undefined)
        return;
    const res = await engine.analyzeStructuredQuery(structuredQueries);
    if (res.error)
        throw Error(res.error);
    if (res.results.length === 0)
        throw Error('No structured query results');
    if (res.results.length !== structuredQueries.length) {
        throw Error(`Wrong structured query results. Asked for ${structuredQueries.length}, received ${res.results.length}`);
    }
    const lastRes = res.results[res.results.length - 1];
    if (lastRes.sql === null || lastRes.sql === undefined) {
        return;
    }
    if (!lastRes.textproto) {
        throw Error('No textproto in structured query results');
    }
    const sql = {
        sql: lastRes.sql,
        textproto: lastRes.textproto ?? '',
        modules: lastRes.modules ?? [],
        preambles: lastRes.preambles ?? [],
    };
    return sql;
}
//# sourceMappingURL=data_source_viewer.js.map