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
exports.PivotTable = void 0;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const spinner_1 = require("../../../../widgets/spinner");
const button_1 = require("../../../../widgets/button");
const semantic_icons_1 = require("../../../../base/semantic_icons");
const table_column_1 = require("../table/table_column");
const menu_1 = require("../../../../widgets/menu");
const anchor_1 = require("../../../../widgets/anchor");
const table_header_1 = require("../table/table_header");
const select_column_menu_1 = require("../table/select_column_menu");
const query_builder_1 = require("../table/query_builder");
const aggregations_1 = require("./aggregations");
const ids_1 = require("./ids");
const custom_table_1 = require("../../../../widgets/custom_table");
class PivotTable {
    view({ attrs }) {
        const state = attrs.state;
        const data = state.getData();
        const pivotColumns = state
            .getPivots()
            .map((pivot, index) => ({
            title: this.renderPivotColumnHeader(attrs, pivot, index),
            render: (node) => {
                if (node.isRoot()) {
                    return {
                        cell: 'Total values:',
                        className: 'total-values',
                        colspan: state.getPivots().length,
                    };
                }
                const status = node.getPivotDisplayStatus(index);
                const value = node.getPivotValue(index);
                return {
                    cell: [
                        (status === 'collapsed' || status === 'expanded') &&
                            (0, mithril_1.default)(button_1.Button, {
                                icon: status === 'collapsed' ? semantic_icons_1.Icons.ExpandDown : semantic_icons_1.Icons.ExpandUp,
                                onclick: () => (node.collapsed = !node.collapsed),
                            }),
                        // Show a non-clickable indicator that the value is auto-expanded.
                        status === 'auto_expanded' &&
                            (0, mithril_1.default)(button_1.Button, {
                                icon: 'chevron_right',
                                disabled: true,
                            }),
                        // Indent the expanded values to align them with the parent value
                        // even though they do not have the "expand/collapse" button.
                        status === 'pivoted_value' && (0, mithril_1.default)('span.indent'),
                        value !== undefined && state.getPivots()[index].renderCell(value),
                        // Show ellipsis for the last pivot if the node is collapsed to
                        // make it clear to the user that there are some values.
                        status === 'hidden_behind_collapsed' && '...',
                    ],
                };
            },
        }));
        const aggregationColumns = state
            .getAggregations()
            .map((agg, index) => ({
            title: this.renderAggregationColumnHeader(attrs, agg, index),
            render: (node) => ({
                cell: agg.column.renderCell(node.getAggregationValue(index)),
            }),
        }));
        const extraRowButton = attrs.extraRowButton;
        const extraButtonColumn = extraRowButton && {
            columns: [
                {
                    title: undefined,
                    render: (node) => ({
                        cell: extraRowButton(node),
                        className: 'action-button',
                    }),
                },
            ],
            hasLeftBorder: false,
        };
        // Expand the tree to a list of rows to show.
        const nodes = data ? [...data.listDescendants()] : [];
        return [
            (0, mithril_1.default)((custom_table_1.CustomTable), {
                className: 'pivot-table',
                data: nodes,
                columns: [
                    {
                        columns: pivotColumns,
                        reorder: (from, to) => state.movePivot(from, to),
                    },
                    {
                        columns: aggregationColumns,
                        reorder: (from, to) => state.moveAggregation(from, to),
                    },
                    extraButtonColumn,
                ],
            }),
            data === undefined && (0, mithril_1.default)(spinner_1.Spinner),
        ];
    }
    renderPivotColumnHeader(attrs, pivot, index) {
        const state = attrs.state;
        const sorted = state.isSortedByPivot(pivot);
        return (0, mithril_1.default)(menu_1.PopupMenu, {
            trigger: (0, mithril_1.default)(anchor_1.Anchor, { icon: (0, table_header_1.renderColumnIcon)(sorted) }, (0, ids_1.pivotId)(pivot)),
        }, [
            // Sort by pivot.
            (0, table_header_1.renderSortMenuItems)(sorted, (direction) => state.sortByPivot(pivot, direction)),
            // Remove pivot: show only if there is more than one pivot (to avoid
            // removing the last pivot).
            state.getPivots().length > 1 &&
                (0, mithril_1.default)(menu_1.MenuItem, {
                    label: 'Remove',
                    icon: semantic_icons_1.Icons.Delete,
                    onclick: () => state.removePivot(index),
                }),
            // End of "per-pivot" menu items. The following menu items are table-level
            // operations (i.e. "add pivot").
            (0, mithril_1.default)(menu_1.MenuDivider),
            (0, mithril_1.default)(menu_1.MenuItem, {
                label: 'Add pivot',
                icon: semantic_icons_1.Icons.Add,
            }, (0, mithril_1.default)(select_column_menu_1.SelectColumnMenu, {
                columns: state.table.columns.map((column) => ({
                    key: (0, table_column_1.tableColumnId)(column),
                    column,
                })),
                manager: {
                    filters: state.filters,
                    trace: state.trace,
                    getSqlQuery: (columns) => (0, query_builder_1.buildSqlQuery)({
                        table: state.table.name,
                        columns,
                        filters: state.filters.get(),
                    }),
                },
                existingColumnIds: new Set(state.getPivots().map(ids_1.pivotId)),
                onColumnSelected: (column) => state.addPivot(column, index),
            })),
        ]);
    }
    renderAggregationColumnHeader(attrs, agg, index) {
        const state = attrs.state;
        const sorted = state.isSortedByAggregation(agg);
        return (0, mithril_1.default)(menu_1.PopupMenu, {
            trigger: (0, mithril_1.default)(anchor_1.Anchor, { icon: (0, table_header_1.renderColumnIcon)(sorted) }, (0, ids_1.aggregationId)(agg)),
        }, [
            // Sort by aggregation.
            (0, table_header_1.renderSortMenuItems)(sorted, (direction) => state.sortByAggregation(agg, direction)),
            // Remove aggregation.
            // Do not remove count aggregation to ensure that there is always at least one aggregation.
            agg.op !== 'count' &&
                (0, mithril_1.default)(menu_1.MenuItem, {
                    label: 'Remove',
                    icon: semantic_icons_1.Icons.Delete,
                    onclick: () => state.removeAggregation(index),
                }),
            // Change aggregation operation.
            // Do not change aggregation for count (as it's the only one which doesn't require a column).
            agg.op !== 'count' &&
                (0, mithril_1.default)(menu_1.MenuItem, {
                    label: 'Change aggregation',
                    icon: semantic_icons_1.Icons.Change,
                }, aggregations_1.AGGREGATIONS.filter((a) => a !== agg.op).map((a) => (0, mithril_1.default)(menu_1.MenuItem, {
                    label: a,
                    onclick: () => state.replaceAggregation(index, {
                        op: a,
                        column: agg.column,
                    }),
                }))),
            // Add the same aggregation again.
            // Designed to be used together with "change aggregation" to allow the user to add multiple
            // aggregations on the same column (e.g. MIN / MAX).
            (0, mithril_1.default)(menu_1.MenuItem, {
                label: 'Duplicate',
                icon: semantic_icons_1.Icons.Copy,
                onclick: () => state.addAggregation(agg, index + 1),
            }),
            // End of "per-pivot" menu items. The following menu items are table-level
            // operations (i.e. "add pivot").
            (0, mithril_1.default)(menu_1.MenuDivider),
            (0, mithril_1.default)(menu_1.MenuItem, {
                label: 'Add aggregation',
                icon: semantic_icons_1.Icons.Add,
            }, (0, mithril_1.default)(select_column_menu_1.SelectColumnMenu, {
                columns: state.table.columns.map((column) => ({
                    key: (0, table_column_1.tableColumnId)(column),
                    column,
                })),
                manager: {
                    filters: state.filters,
                    trace: state.trace,
                    getSqlQuery: (columns) => (0, query_builder_1.buildSqlQuery)({
                        table: state.table.name,
                        columns,
                        filters: state.filters.get(),
                    }),
                },
                columnMenu: (column) => ({
                    rightIcon: '',
                    children: aggregations_1.AGGREGATIONS.map((agg) => (0, mithril_1.default)(menu_1.MenuItem, {
                        label: agg,
                        onclick: () => state.addAggregation({ op: agg, column }, index),
                    })),
                }),
            })),
        ]);
    }
}
exports.PivotTable = PivotTable;
//# sourceMappingURL=pivot_table.js.map