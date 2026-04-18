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
exports.createModal = exports.QueryBuilder = void 0;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const button_1 = require("../../../widgets/button");
const modal_1 = require("../../../widgets/modal");
const data_source_viewer_1 = require("./data_source_viewer");
const menu_1 = require("../../../widgets/menu");
const semantic_icons_1 = require("../../../base/semantic_icons");
const common_1 = require("../../../widgets/common");
class NodeBox {
    view({ attrs }) {
        const { node, isSelected, onNodeSelected } = attrs;
        return (0, mithril_1.default)('.node-box', {
            style: {
                border: isSelected ? '2px solid yellow' : '2px solid blue',
                borderRadius: '5px',
                padding: '10px',
                cursor: 'pointer',
                backgroundColor: 'lightblue',
            },
            onclick: () => onNodeSelected(node),
        }, node.getTitle(), (0, mithril_1.default)(menu_1.PopupMenu, {
            trigger: (0, mithril_1.default)(button_1.Button, {
                iconFilled: true,
                icon: semantic_icons_1.Icons.MoreVert,
            }),
        }, attrs.renderNodeActionsMenuItems(node)));
    }
}
class QueryBuilder {
    view({ attrs }) {
        const { trace, rootNodes, onNodeSelected, selectedNode, renderNodeActionsMenuItems, } = attrs;
        const renderNodesPanel = () => {
            const nodes = [];
            const numRoots = rootNodes.length;
            if (numRoots === 0) {
                nodes.push((0, mithril_1.default)('', { style: { gridColumn: 3, gridRow: 2 } }, (0, mithril_1.default)(menu_1.PopupMenu, {
                    trigger: (0, mithril_1.default)(button_1.Button, {
                        icon: semantic_icons_1.Icons.Add,
                        intent: common_1.Intent.Primary,
                        style: {
                            height: '100px',
                            width: '100px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: '48px',
                        },
                    }),
                }, attrs.addSourcePopupMenu())));
            }
            else {
                let col = 1;
                rootNodes.forEach((rootNode) => {
                    let row = 1;
                    let curNode = rootNode;
                    while (curNode) {
                        const localCurNode = curNode;
                        nodes.push((0, mithril_1.default)('', { style: { display: 'flex', gridColumn: col, gridRow: row } }, (0, mithril_1.default)(NodeBox, {
                            node: localCurNode,
                            isSelected: selectedNode === localCurNode,
                            onNodeSelected,
                            renderNodeActionsMenuItems,
                        })));
                        row++;
                        curNode = curNode.nextNode;
                    }
                    col += 1;
                });
            }
            return (0, mithril_1.default)('', {
                style: {
                    display: 'grid',
                    gridTemplateColumns: `repeat(${numRoots} - 1, 1fr)`,
                    gridTemplateRows: 'repeat(3, 1fr)',
                    gap: '10px',
                },
            }, nodes);
        };
        const renderDataSourceViewer = () => {
            return attrs.selectedNode
                ? (0, mithril_1.default)(data_source_viewer_1.DataSourceViewer, { trace, queryNode: attrs.selectedNode })
                : undefined;
        };
        return (0, mithril_1.default)('', {
            style: {
                display: 'grid',
                gridTemplateColumns: '50% 50%',
                gridTemplateRows: '50% 50%',
                gap: '10px',
            },
        }, (0, mithril_1.default)('', { style: { gridColumn: 1 } }, renderNodesPanel()), (0, mithril_1.default)('', { style: { gridColumn: 2 } }, renderDataSourceViewer()));
    }
}
exports.QueryBuilder = QueryBuilder;
const createModal = (title, content, onAdd) => {
    (0, modal_1.showModal)({
        title,
        buttons: [{ text: 'Add node', action: onAdd }],
        content,
    });
};
exports.createModal = createModal;
//# sourceMappingURL=builder.js.map