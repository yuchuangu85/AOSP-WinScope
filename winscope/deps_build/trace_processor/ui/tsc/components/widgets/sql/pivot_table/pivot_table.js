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
const select_column_menu_1 = require("../table/select_column_menu");
const query_builder_1 = require("../table/query_builder");
const aggregations_1 = require("./aggregations");
const ids_1 = require("./ids");
const grid_1 = require("../../../../widgets/grid");
class PivotTable {
    view({ attrs }) {
        const state = attrs.state;
        const data = state.getData();
        const pivots = state.getPivots();
        const aggregations = state.getAggregations();
        const extraRowButton = attrs.extraRowButton;
        const headers = [
            ...pivots.map((pivot, index) => {
                const sorted = state.isSortedByPivot(pivot);
                return (0, mithril_1.default)(grid_1.GridHeaderCell, {
                    key: `pivot-${(0, ids_1.pivotId)(pivot)}`,
                    reorderable: { handle: 'pivot' },
                    onReorder: (from, to, position) => {
                        const fromIndex = pivots.findIndex((p) => `pivot-${(0, ids_1.pivotId)(p)}` === from);
                        let toIndex = pivots.findIndex((p) => `pivot-${(0, ids_1.pivotId)(p)}` === to);
                        if (position === 'after') {
                            toIndex++;
                        }
                        state.movePivot(fromIndex, toIndex);
                    },
                    sort: sorted,
                    onSort: (direction) => state.sortByPivot(pivot, direction),
                    menuItems: this.renderPivotColumnMenu(attrs, pivot, index),
                    thickRightBorder: index === pivots.length - 1,
                }, (0, ids_1.pivotId)(pivot));
            }),
            ...aggregations.map((agg, index) => {
                return (0, mithril_1.default)(grid_1.GridHeaderCell, {
                    key: `agg-${(0, ids_1.aggregationId)(agg)}`,
                    reorderable: { handle: 'aggregation' },
                    onReorder: (from, to, position) => {
                        const fromIndex = aggregations.findIndex((a) => `agg-${(0, ids_1.aggregationId)(a)}` === from);
                        let toIndex = aggregations.findIndex((a) => `agg-${(0, ids_1.aggregationId)(a)}` === to);
                        if (position === 'after') {
                            toIndex++;
                        }
                        state.moveAggregation(fromIndex, toIndex);
                    },
                    sort: state.isSortedByAggregation(agg),
                    onSort: (direction) => state.sortByAggregation(agg, direction),
                    menuItems: this.renderAggregationColumnMenu(attrs, agg, index),
                }, (0, ids_1.aggregationId)(agg));
            }),
        ];
        if (extraRowButton) {
            headers.push((0, mithril_1.default)(grid_1.GridHeaderCell, { key: 'action-button' }));
        }
        // Expand the tree to a list of rows to show.
        const nodes = data ? [...data.listDescendants()] : [];
        return [
            (0, mithril_1.default)(grid_1.Grid, {
                fillHeight: true,
                className: 'pf-pivot-table',
            }, [
                (0, mithril_1.default)(grid_1.GridHeader, (0, mithril_1.default)(grid_1.GridRow, headers)),
                (0, mithril_1.default)(grid_1.GridBody, nodes.map((node) => {
                    const pivotCells = node.isRoot()
                        ? [
                            (0, mithril_1.default)(grid_1.GridDataCell, {
                                align: 'right',
                                colspan: pivots.length,
                                thickRightBorder: true,
                            }, (0, mithril_1.default)('.pf-pivot-table__total-values', 'Total values:')),
                        ]
                        : pivots.map((_pivot, index) => {
                            const status = node.getPivotDisplayStatus(index);
                            const value = node.getPivotValue(index);
                            const renderedCell = (function () {
                                if (value === undefined)
                                    return undefined;
                                return state.getPivots()[index].renderCell(value);
                            })();
                            const content = [
                                (status === 'collapsed' || status === 'expanded') &&
                                    (0, mithril_1.default)(button_1.Button, {
                                        icon: status === 'collapsed'
                                            ? 'chevron_right'
                                            : semantic_icons_1.Icons.ExpandDown,
                                        onclick: () => {
                                            node.collapsed = !node.collapsed;
                                            mithril_1.default.redraw();
                                        },
                                        compact: true,
                                    }),
                                // Show a non-clickable indicator that the value is auto-expanded.
                                status === 'auto_expanded' &&
                                    (0, mithril_1.default)(button_1.Button, {
                                        icon: 'chevron_right',
                                        disabled: true,
                                        compact: true,
                                    }),
                                // Indent the expanded values to align them with the parent value
                                // even though they do not have the "expand/collapse" button.
                                status === 'pivoted_value' &&
                                    (0, mithril_1.default)('span.pf-pivot-table__cell--indent'),
                                renderedCell && renderedCell.content,
                                // Show ellipsis for the last pivot if the node is collapsed to
                                // make it clear to the user that there are some values.
                                status === 'hidden_behind_collapsed' && '...',
                            ];
                            return (0, mithril_1.default)(grid_1.GridDataCell, {
                                thickRightBorder: index === pivots.length - 1,
                                align: renderedCell?.isNull
                                    ? 'center'
                                    : renderedCell?.isNumerical
                                        ? 'right'
                                        : 'left',
                                isMissing: renderedCell?.isNull,
                            }, content);
                        });
                    const aggregationCells = aggregations.map((agg, index) => {
                        const renderedCell = agg.column.renderCell(node.getAggregationValue(index));
                        return (0, mithril_1.default)(grid_1.GridDataCell, {
                            align: renderedCell?.isNull
                                ? 'center'
                                : renderedCell?.isNumerical
                                    ? 'right'
                                    : 'left',
                            isMissing: renderedCell?.isNull,
                        }, renderedCell.content);
                    });
                    const cells = [...pivotCells, ...aggregationCells];
                    if (extraRowButton) {
                        cells.push((0, mithril_1.default)(grid_1.GridDataCell, { className: 'action-button' }, extraRowButton(node)));
                    }
                    return (0, mithril_1.default)(grid_1.GridRow, cells);
                })),
            ]),
            data === undefined && (0, mithril_1.default)(spinner_1.Spinner),
        ];
    }
    renderPivotColumnMenu(attrs, pivot, index) {
        const state = attrs.state;
        const sorted = state.isSortedByPivot(pivot);
        const menuItems = [];
        menuItems.push(
        // Sort by pivot.
        (0, grid_1.renderSortMenuItems)(sorted, (direction) => state.sortByPivot(pivot, direction)), (0, mithril_1.default)(menu_1.MenuDivider), (0, mithril_1.default)(menu_1.MenuItem, {
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
        })), (0, mithril_1.default)(menu_1.MenuDivider), 
        // Remove pivot: show only if there is more than one pivot (to avoid
        // removing the last pivot).
        (0, mithril_1.default)(menu_1.MenuItem, {
            disabled: state.getPivots().length === 1,
            label: 'Remove',
            icon: semantic_icons_1.Icons.Delete,
            onclick: () => state.removePivot(index),
        }));
        return menuItems;
    }
    renderAggregationColumnMenu(attrs, agg, index) {
        const state = attrs.state;
        const sorted = state.isSortedByAggregation(agg);
        const menuItems = [];
        menuItems.push(
        // Sort by aggregation.
        (0, grid_1.renderSortMenuItems)(sorted, (direction) => state.sortByAggregation(agg, direction)), 
        // Change aggregation operation, add the same aggregation again, and remove
        // aggregation are not available for the count aggregation.
        agg.op !== 'count' && [
            (0, mithril_1.default)(menu_1.MenuDivider),
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
            (0, mithril_1.default)(menu_1.MenuItem, {
                label: 'Remove',
                icon: semantic_icons_1.Icons.Delete,
                onclick: () => state.removeAggregation(index),
            }),
        ], 
        // End of "per-pivot" menu items. The following menu items are table-level
        // operations (i.e. "add pivot").
        (0, mithril_1.default)(menu_1.MenuDivider), (0, mithril_1.default)(menu_1.MenuItem, {
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
        })));
        return menuItems;
    }
}
exports.PivotTable = PivotTable;
//# sourceMappingURL=pivot_table.js.map