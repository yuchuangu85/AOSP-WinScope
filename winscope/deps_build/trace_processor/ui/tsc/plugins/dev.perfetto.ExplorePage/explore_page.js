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
exports.ExplorePage = exports.ExplorePageModeToLabel = exports.ExplorePageModes = void 0;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const data_visualiser_1 = require("./data_visualiser/data_visualiser");
const builder_1 = require("./query_builder/builder");
const button_1 = require("../../widgets/button");
const common_1 = require("../../widgets/common");
const query_node_1 = require("./query_node");
const menu_1 = require("../../widgets/menu");
const semantic_icons_1 = require("../../base/semantic_icons");
const menu_2 = require("../../widgets/menu");
const builder_2 = require("./query_builder/builder");
const stdlib_table_1 = require("./query_builder/sources/stdlib_table");
const slices_source_1 = require("./query_builder/sources/slices_source");
const sql_source_1 = require("./query_builder/sources/sql_source");
var ExplorePageModes;
(function (ExplorePageModes) {
    ExplorePageModes[ExplorePageModes["QUERY_BUILDER"] = 0] = "QUERY_BUILDER";
    ExplorePageModes[ExplorePageModes["DATA_VISUALISER"] = 1] = "DATA_VISUALISER";
})(ExplorePageModes || (exports.ExplorePageModes = ExplorePageModes = {}));
exports.ExplorePageModeToLabel = {
    [ExplorePageModes.QUERY_BUILDER]: 'Query Builder',
    [ExplorePageModes.DATA_VISUALISER]: 'Visualise Data',
};
class ExplorePage {
    renderNodeActionsMenuItems(node, state) {
        // TODO: Split into operations on graph (like delete or duplicate) and
        // operations on node (like edit).
        return [
            (0, mithril_1.default)(menu_1.MenuItem, {
                label: 'Visualise Data',
                icon: semantic_icons_1.Icons.Chart,
                onclick: () => {
                    state.selectedNode = node;
                    state.mode = ExplorePageModes.DATA_VISUALISER;
                },
            }),
            (0, mithril_1.default)(menu_1.MenuItem, {
                label: 'Edit',
                onclick: async () => {
                    const attrsCopy = node.getState();
                    switch (node.type) {
                        case query_node_1.NodeType.kStdlibTable:
                            (0, builder_2.createModal)('Standard library table', () => (0, mithril_1.default)(stdlib_table_1.StdlibTableSource, attrsCopy), () => {
                                // TODO: Support editing non root nodes.
                                state.rootNodes[state.rootNodes.indexOf(node)] =
                                    new stdlib_table_1.StdlibTableNode(attrsCopy);
                                state.selectedNode = node;
                            });
                            node = new stdlib_table_1.StdlibTableNode(attrsCopy);
                            break;
                        case query_node_1.NodeType.kSimpleSlices:
                            (0, builder_2.createModal)('Slices', () => (0, mithril_1.default)(slices_source_1.SlicesSource, attrsCopy), () => {
                                // TODO: Support editing non root nodes.
                                state.rootNodes[state.rootNodes.indexOf(node)] =
                                    new slices_source_1.SlicesSourceNode(attrsCopy);
                                state.selectedNode = node;
                            });
                            break;
                        case query_node_1.NodeType.kSqlSource:
                            (0, builder_2.createModal)('SQL', () => (0, mithril_1.default)(sql_source_1.SqlSource, attrsCopy), () => {
                                // TODO: Support editing non root nodes.
                                state.rootNodes[state.rootNodes.indexOf(node)] =
                                    new sql_source_1.SqlSourceNode(attrsCopy);
                                state.selectedNode = node;
                            });
                    }
                },
            }),
            (0, mithril_1.default)(menu_1.MenuItem, {
                label: 'Duplicate',
                onclick: async () => {
                    state.rootNodes.push(cloneQueryNode(node));
                },
            }),
            (0, mithril_1.default)(menu_1.MenuItem, {
                label: 'Delete',
                onclick: async () => {
                    const idx = state.rootNodes.indexOf(node);
                    if (idx !== -1) {
                        state.rootNodes.splice(idx, 1);
                        state.selectedNode = node;
                    }
                },
            }),
        ];
    }
    view({ attrs }) {
        const { trace, state } = attrs;
        return (0, mithril_1.default)('.page.explore-page', (0, mithril_1.default)('.explore-page__header', (0, mithril_1.default)('h1', `${exports.ExplorePageModeToLabel[state.mode]}`), (0, mithril_1.default)('span', { style: { flexGrow: 1 } }), state.mode === ExplorePageModes.QUERY_BUILDER
            ? (0, mithril_1.default)('', (0, mithril_1.default)(menu_2.PopupMenu, {
                trigger: (0, mithril_1.default)(button_1.Button, {
                    label: 'Add new node',
                    icon: semantic_icons_1.Icons.Add,
                    intent: common_1.Intent.Primary,
                }),
            }, addSourcePopupMenu(attrs)), (0, mithril_1.default)(button_1.Button, {
                label: 'Clear All Query Nodes',
                intent: common_1.Intent.Primary,
                onclick: () => {
                    state.rootNodes = [];
                    state.selectedNode = undefined;
                },
                style: { marginLeft: '10px' },
            }))
            : (0, mithril_1.default)(button_1.Button, {
                label: 'Back to Query Builder',
                intent: common_1.Intent.Primary,
                onclick: () => {
                    state.mode = ExplorePageModes.QUERY_BUILDER;
                },
            })), state.mode === ExplorePageModes.QUERY_BUILDER &&
            (0, mithril_1.default)(builder_1.QueryBuilder, {
                trace,
                sqlModules: attrs.sqlModulesPlugin.getSqlModules(),
                onRootNodeCreated(arg) {
                    state.rootNodes.push(arg);
                    state.selectedNode = arg;
                },
                onNodeSelected(arg) {
                    state.selectedNode = arg;
                },
                renderNodeActionsMenuItems: (node) => this.renderNodeActionsMenuItems(node, state),
                rootNodes: state.rootNodes,
                selectedNode: state.selectedNode,
                addSourcePopupMenu: () => addSourcePopupMenu(attrs),
            }), state.mode === ExplorePageModes.DATA_VISUALISER &&
            state.rootNodes.length !== 0 &&
            (0, mithril_1.default)(data_visualiser_1.DataVisualiser, {
                trace,
                state,
            }));
    }
}
exports.ExplorePage = ExplorePage;
function addSourcePopupMenu(attrs) {
    const { trace, state } = attrs;
    const sqlModules = attrs.sqlModulesPlugin.getSqlModules();
    return [
        (0, mithril_1.default)(menu_1.MenuItem, {
            label: 'Standard library table',
            onclick: async () => {
                const stdlibTableAttrs = {
                    filters: [],
                    sourceCols: [],
                    groupByColumns: [],
                    aggregations: [],
                    trace,
                    sqlModules,
                    modal: () => (0, builder_2.createModal)('Standard library table', () => (0, mithril_1.default)(stdlib_table_1.StdlibTableSource, stdlibTableAttrs), () => {
                        const newNode = new stdlib_table_1.StdlibTableNode(stdlibTableAttrs);
                        state.rootNodes.push(newNode);
                        state.selectedNode = newNode;
                    }),
                };
                // Adding trivial modal to open the table selection.
                (0, builder_2.createModal)('Standard library table', () => (0, mithril_1.default)(stdlib_table_1.StdlibTableSource, stdlibTableAttrs), () => { });
            },
        }),
        (0, mithril_1.default)(menu_1.MenuItem, {
            label: 'Custom slices',
            onclick: () => {
                const newSimpleSlicesAttrs = {
                    sourceCols: [],
                    filters: [],
                    groupByColumns: [],
                    aggregations: [],
                };
                (0, builder_2.createModal)('Slices', () => (0, mithril_1.default)(slices_source_1.SlicesSource, newSimpleSlicesAttrs), () => {
                    const newNode = new slices_source_1.SlicesSourceNode(newSimpleSlicesAttrs);
                    state.rootNodes.push(newNode);
                    state.selectedNode = newNode;
                });
            },
        }),
        (0, mithril_1.default)(menu_1.MenuItem, {
            label: 'Custom SQL',
            onclick: () => {
                const newSqlSourceAttrs = {
                    sourceCols: [],
                    filters: [],
                    groupByColumns: [],
                    aggregations: [],
                };
                (0, builder_2.createModal)('SQL', () => (0, mithril_1.default)(sql_source_1.SqlSource, newSqlSourceAttrs), () => {
                    const newNode = new sql_source_1.SqlSourceNode(newSqlSourceAttrs);
                    state.rootNodes.push(newNode);
                    state.selectedNode = newNode;
                });
            },
        }),
    ];
}
function cloneQueryNode(node) {
    const attrsCopy = node.getState();
    switch (node.type) {
        case query_node_1.NodeType.kStdlibTable:
            return new stdlib_table_1.StdlibTableNode(attrsCopy);
        case query_node_1.NodeType.kSimpleSlices:
            return new slices_source_1.SlicesSourceNode(attrsCopy);
        case query_node_1.NodeType.kSqlSource:
            return new sql_source_1.SqlSourceNode(attrsCopy);
    }
}
//# sourceMappingURL=explore_page.js.map