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
exports.Builder = void 0;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const classnames_1 = require("../../../base/classnames");
const query_node_1 = require("../query_node");
const help_1 = require("./help");
const node_explorer_1 = require("./node_explorer");
const graph_1 = require("./graph");
const data_explorer_1 = require("./data_explorer");
const in_memory_data_source_1 = require("../../../components/widgets/data_grid/in_memory_data_source");
const table_source_1 = require("./nodes/sources/table_source");
const sql_source_1 = require("./nodes/sources/sql_source");
const query_service_1 = require("./query_service");
const query_builder_utils_1 = require("./query_builder_utils");
const node_issues_1 = require("./node_issues");
class Builder {
    queryService;
    query;
    queryExecuted = false;
    tablePosition = 'bottom';
    previousSelectedNode;
    isNodeDataViewerFullScreen = false;
    response;
    dataSource;
    constructor({ attrs }) {
        this.queryService = new query_service_1.QueryService(attrs.trace.engine);
    }
    view({ attrs }) {
        const { trace, rootNodes, onNodeSelected, selectedNode, onAddStdlibTableSource, onAddSlicesSource, onAddSqlSource, onClearAllNodes, sqlModules, } = attrs;
        if (selectedNode && selectedNode !== this.previousSelectedNode) {
            if (selectedNode instanceof sql_source_1.SqlSourceNode) {
                this.tablePosition = 'left';
            }
            else {
                this.tablePosition = 'bottom';
            }
            this.response = undefined;
            this.dataSource = undefined;
        }
        this.previousSelectedNode = selectedNode;
        const layoutClasses = (0, classnames_1.classNames)('pf-query-builder-layout', selectedNode ? 'selection' : 'no-selection', selectedNode && `selection-${this.tablePosition}`, this.isNodeDataViewerFullScreen && 'full-page') || '';
        const explorer = selectedNode
            ? (0, mithril_1.default)(node_explorer_1.NodeExplorer, {
                // The key to force mithril to re-create the component when the
                // selected node changes, preventing state from leaking between
                // different nodes.
                key: selectedNode.nodeId,
                trace,
                node: selectedNode,
                resolveNode: (nodeId) => this.resolveNode(nodeId, rootNodes),
                onQueryAnalyzed: (query, reexecute = selectedNode.type !== query_node_1.NodeType.kSqlSource &&
                    selectedNode.type !== query_node_1.NodeType.kIntervalIntersect) => {
                    this.query = query;
                    if ((0, query_node_1.isAQuery)(this.query) && reexecute) {
                        this.queryExecuted = false;
                        this.runQuery(selectedNode);
                    }
                },
                onExecute: () => {
                    console.log('Executing');
                    this.queryExecuted = false;
                    this.runQuery(selectedNode);
                    mithril_1.default.redraw();
                },
                onchange: () => { },
            })
            : (0, mithril_1.default)(help_1.ExplorePageHelp, {
                sqlModules,
                onTableClick: (tableName) => {
                    const { onRootNodeCreated } = attrs;
                    const sqlTable = sqlModules.getTable(tableName);
                    if (!sqlTable)
                        return;
                    onRootNodeCreated(new table_source_1.TableSourceNode({
                        trace,
                        sqlModules,
                        sqlTable,
                        filters: [],
                    }));
                },
            });
        return (0, mithril_1.default)(`.${layoutClasses.split(' ').join('.')}`, (0, mithril_1.default)('.pf-qb-node-graph', (0, mithril_1.default)(graph_1.Graph, {
            rootNodes,
            selectedNode,
            onNodeSelected,
            nodeLayouts: attrs.nodeLayouts,
            onNodeLayoutChange: attrs.onNodeLayoutChange,
            onDeselect: attrs.onDeselect,
            onAddStdlibTableSource,
            onAddSlicesSource,
            onAddSqlSource,
            onClearAllNodes,
            onDuplicateNode: attrs.onDuplicateNode,
            onAddAggregation: attrs.onAddAggregationNode,
            onAddIntervalIntersect: attrs.onAddIntervalIntersectNode,
            onDeleteNode: (node) => {
                if (node.isMaterialised()) {
                    trace.engine.query(`DROP TABLE IF EXISTS ${node.meterialisedAs}`);
                }
                attrs.onDeleteNode(node);
            },
        })), (0, mithril_1.default)('.pf-qb-explorer', explorer), selectedNode &&
            (0, mithril_1.default)('.pf-qb-viewer', (0, mithril_1.default)(data_explorer_1.DataExplorer, {
                queryService: this.queryService,
                query: this.query,
                node: selectedNode,
                executeQuery: !this.queryExecuted,
                response: this.response,
                dataSource: this.dataSource,
                onchange: () => { },
                onQueryExecuted: ({ columns, error, warning, noDataWarning, }) => {
                    this.queryExecuted = true;
                    if (error || warning || noDataWarning) {
                        if (!selectedNode.state.issues) {
                            selectedNode.state.issues = new node_issues_1.NodeIssues();
                        }
                        selectedNode.state.issues.queryError = error;
                        selectedNode.state.issues.responseError = warning;
                        selectedNode.state.issues.dataError = noDataWarning;
                    }
                    else {
                        selectedNode.state.issues = undefined;
                    }
                    if (selectedNode instanceof sql_source_1.SqlSourceNode) {
                        selectedNode.onQueryExecuted(columns);
                    }
                },
                onPositionChange: (pos) => {
                    this.tablePosition = pos;
                },
                isFullScreen: this.isNodeDataViewerFullScreen,
                onFullScreenToggle: () => {
                    this.isNodeDataViewerFullScreen =
                        !this.isNodeDataViewerFullScreen;
                },
            })));
    }
    resolveNode(nodeId, rootNodes) {
        const queue = [...rootNodes];
        const visited = new Set();
        while (queue.length > 0) {
            const current = queue.shift();
            if (visited.has(current.nodeId)) {
                continue;
            }
            visited.add(current.nodeId);
            if (current.nodeId === nodeId) {
                return current;
            }
            queue.push(...current.nextNodes);
        }
        return undefined;
    }
    runQuery(node) {
        if (this.query === undefined ||
            this.query instanceof Error ||
            this.queryExecuted) {
            return;
        }
        this.queryService.runQuery((0, query_node_1.queryToRun)(this.query)).then((response) => {
            this.response = response;
            const ds = new in_memory_data_source_1.InMemoryDataSource(this.response.rows);
            this.dataSource = {
                get rows() {
                    return ds.rows;
                },
                notifyUpdate(model) {
                    // We override the notifyUpdate method to ignore filters, as the data is
                    // assumed to be pre-filtered. We still apply sorting and aggregations.
                    const newModel = {
                        ...model,
                        filters: [], // Always pass an empty array of filters.
                    };
                    ds.notifyUpdate(newModel);
                },
            };
            const error = (0, query_builder_utils_1.findErrors)(this.query, this.response);
            const warning = (0, query_builder_utils_1.findWarnings)(this.response, node);
            const noDataWarning = this.response?.totalRowCount === 0
                ? new Error('Query returned no rows')
                : undefined;
            this.queryExecuted = true;
            if (error || warning || noDataWarning) {
                if (!node.state.issues) {
                    node.state.issues = new node_issues_1.NodeIssues();
                }
                node.state.issues.queryError = error;
                node.state.issues.responseError = warning;
                node.state.issues.dataError = noDataWarning;
            }
            else {
                node.state.issues = undefined;
            }
            if (node instanceof sql_source_1.SqlSourceNode) {
                node.onQueryExecuted(this.response.columns);
            }
            mithril_1.default.redraw();
        });
    }
}
exports.Builder = Builder;
//# sourceMappingURL=builder.js.map