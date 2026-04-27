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
exports.ExplorePage = void 0;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const builder_1 = require("./query_builder/builder");
const table_source_1 = require("./query_builder/nodes/sources/table_source");
const slices_source_1 = require("./query_builder/nodes/sources/slices_source");
const sql_source_1 = require("./query_builder/nodes/sources/sql_source");
const aggregation_node_1 = require("./query_builder/nodes/aggregation_node");
const interval_intersect_node_1 = require("./query_builder/nodes/interval_intersect_node");
class ExplorePage {
    addNode(state, newNode, prevNode) {
        if (prevNode) {
            prevNode.nextNodes.push(newNode);
        }
        else {
            state.rootNodes.push(newNode);
        }
        this.selectNode(state, newNode);
        mithril_1.default.redraw();
    }
    selectNode(state, node) {
        state.selectedNode = node;
    }
    deselectNode(state) {
        state.selectedNode = undefined;
    }
    async handleAddStdlibTableSource(attrs) {
        const { trace, state } = attrs;
        const sqlModules = attrs.sqlModulesPlugin.getSqlModules();
        if (!sqlModules) {
            return;
        }
        const selection = await (0, table_source_1.modalForTableSelection)(sqlModules);
        if (selection) {
            this.addNode(state, new table_source_1.TableSourceNode({
                trace,
                sqlModules,
                sqlTable: selection.sqlTable,
                filters: [],
            }));
        }
    }
    handleAddAggregation(state, node) {
        const newNode = new aggregation_node_1.AggregationNode({
            prevNodes: [node],
            groupByColumns: [],
            aggregations: [],
            filters: [],
        });
        this.addNode(state, newNode, node);
    }
    handleAddIntervalIntersect(state, node) {
        const newNode = new interval_intersect_node_1.IntervalIntersectNode({
            prevNodes: [node],
            allNodes: state.rootNodes,
            intervalNodes: [],
            filters: [],
        });
        this.addNode(state, newNode, node);
    }
    handleAddSlicesSource(state) {
        this.addNode(state, new slices_source_1.SlicesSourceNode({
            filters: [],
        }));
    }
    handleAddSqlSource(attrs) {
        this.addNode(attrs.state, new sql_source_1.SqlSourceNode({
            trace: attrs.trace,
            filters: [],
        }));
    }
    handleClearAllNodes(state) {
        state.rootNodes = [];
        this.deselectNode(state);
    }
    handleDuplicateNode(state, node) {
        state.rootNodes.push(node.clone());
    }
    handleDeleteNode(state, node) {
        // If the node is a root node, remove it from the root nodes array.
        const rootIdx = state.rootNodes.indexOf(node);
        if (rootIdx !== -1) {
            state.rootNodes.splice(rootIdx, 1);
        }
        // If the node is a child of another node, remove it from the parent's
        // nextNodes array.
        if (node.prevNodes) {
            for (const prevNode of node.prevNodes) {
                const childIdx = prevNode.nextNodes.indexOf(node);
                if (childIdx !== -1) {
                    prevNode.nextNodes.splice(childIdx, 1);
                }
            }
        }
        // If the deleted node was selected, deselect it.
        if (state.selectedNode === node) {
            this.deselectNode(state);
        }
    }
    handleKeyDown(event, attrs) {
        const { state } = attrs;
        if (state.selectedNode !== undefined) {
            return;
        }
        // Do not interfere with text inputs
        if (event.target instanceof HTMLInputElement ||
            event.target instanceof HTMLTextAreaElement) {
            return;
        }
        switch (event.key) {
            case 'q':
                this.handleAddSqlSource(attrs);
                break;
            case 't':
                this.handleAddStdlibTableSource(attrs);
                break;
            case 's':
                this.handleAddSlicesSource(attrs.state);
                break;
        }
    }
    view({ attrs }) {
        const { trace, state } = attrs;
        const sqlModules = attrs.sqlModulesPlugin.getSqlModules();
        if (!sqlModules) {
            return (0, mithril_1.default)('.pf-explore-page', (0, mithril_1.default)('.pf-explore-page__header', (0, mithril_1.default)('h1', 'Loading SQL Modules, please wait...')));
        }
        return (0, mithril_1.default)('.pf-explore-page', {
            onkeydown: (e) => this.handleKeyDown(e, attrs),
            oncreate: (vnode) => {
                vnode.dom.focus();
            },
            tabindex: 0,
        }, (0, mithril_1.default)(builder_1.Builder, {
            trace,
            sqlModules,
            rootNodes: state.rootNodes,
            selectedNode: state.selectedNode,
            nodeLayouts: state.nodeLayouts,
            onRootNodeCreated: (node) => this.addNode(state, node),
            onNodeSelected: (node) => (state.selectedNode = node),
            onDeselect: () => this.deselectNode(state),
            onNodeLayoutChange: (nodeId, layout) => {
                state.nodeLayouts.set(nodeId, layout);
            },
            onAddStdlibTableSource: () => this.handleAddStdlibTableSource(attrs),
            onAddSlicesSource: () => this.handleAddSlicesSource(state),
            onAddSqlSource: () => this.handleAddSqlSource(attrs),
            onClearAllNodes: () => this.handleClearAllNodes(state),
            onDuplicateNode: (node) => this.handleDuplicateNode(state, node),
            onDeleteNode: (node) => this.handleDeleteNode(state, node),
            onAddAggregationNode: (node) => this.handleAddAggregation(state, node),
            onAddIntervalIntersectNode: (node) => this.handleAddIntervalIntersect(state, node),
        }));
    }
}
exports.ExplorePage = ExplorePage;
//# sourceMappingURL=explore_page.js.map