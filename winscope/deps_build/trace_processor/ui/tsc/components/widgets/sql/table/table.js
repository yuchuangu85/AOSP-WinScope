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
exports.SqlTable = void 0;
exports.columnTitle = columnTitle;
exports.getTableManager = getTableManager;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const menu_1 = require("../../../../widgets/menu");
const query_builder_1 = require("./query_builder");
const semantic_icons_1 = require("../../../../base/semantic_icons");
const string_utils_1 = require("../../../../base/string_utils");
const spinner_1 = require("../../../../widgets/spinner");
const grid_1 = require("../../../../widgets/grid");
const render_cell_utils_1 = require("./render_cell_utils");
const form_1 = require("../../../../widgets/form");
const text_input_1 = require("../../../../widgets/text_input");
const table_column_1 = require("./table_column");
const sql_column_1 = require("./sql_column");
const select_column_menu_1 = require("./select_column_menu");
function renderCell(column, row, state) {
    const { columns } = state.getCurrentRequest();
    const sqlValue = row[columns[(0, sql_column_1.sqlColumnId)(column.column)]];
    const additionalValues = {};
    const supportingColumns = column.supportingColumns?.() ?? {};
    for (const [key, col] of Object.entries(supportingColumns)) {
        additionalValues[key] = row[columns[(0, sql_column_1.sqlColumnId)(col)]];
    }
    const result = column.renderCell(sqlValue, getTableManager(state), additionalValues);
    return result;
}
function columnTitle(column) {
    if (column.getTitle !== undefined) {
        const title = column.getTitle();
        if (title !== undefined)
            return title;
    }
    return (0, sql_column_1.sqlColumnId)(column.column);
}
// This is separated into a separate class to store the index of the column to be
// added and increment it when multiple columns are added from the same popup menu.
class AddColumnMenuItem {
    // Index where the new column should be inserted.
    // In the regular case, a click would close the popup (destroying this class) and
    // the `index` would not change during its lifetime.
    // However, for mod-click, we want to keep adding columns to the right of the recently
    // added column, so to achieve that we keep track of the index and increment it for
    // each new column added.
    index;
    constructor({ attrs }) {
        this.index = attrs.index;
    }
    view({ attrs }) {
        return (0, mithril_1.default)(menu_1.MenuItem, { label: 'Add column', icon: semantic_icons_1.Icons.Add }, attrs.table.renderAddColumnOptions((column) => {
            attrs.state.addColumn(column, this.index++);
        }));
    }
}
// Separating out an individual column filter into a class
// so that we can store the raw input value.
class ColumnFilter {
    // Holds the raw string value from the filter text input element
    inputValue;
    constructor() {
        this.inputValue = '';
    }
    view({ attrs }) {
        const { filterOption, columns, state } = attrs;
        const { op, requiresParam } = render_cell_utils_1.LegacySqlTableFilterOptions[filterOption];
        return (0, mithril_1.default)(menu_1.MenuItem, {
            label: filterOption,
            // Filter options that do not need an input value will filter the
            // table directly when clicking on the menu item
            // (ex: IS NULL or IS NOT NULL)
            onclick: !requiresParam
                ? () => {
                    state.filters.addFilter({
                        op: (cols) => `${cols[0]} ${op}`,
                        columns,
                    });
                }
                : undefined,
        }, 
        // All non-null filter options will have a submenu that allows
        // the user to enter a value into textfield and filter using
        // the Filter button.
        requiresParam &&
            (0, mithril_1.default)(form_1.Form, {
                onSubmit: () => {
                    // Convert the string extracted from
                    // the input text field into the correct data type for
                    // filtering. The order in which each data type is
                    // checked matters: string, number (floating), and bigint.
                    if (this.inputValue === '')
                        return;
                    let filterValue;
                    if (Number.isNaN(Number.parseFloat(this.inputValue))) {
                        filterValue = (0, string_utils_1.sqliteString)(this.inputValue);
                    }
                    else if (!Number.isInteger(Number.parseFloat(this.inputValue))) {
                        filterValue = Number(this.inputValue);
                    }
                    else {
                        filterValue = BigInt(this.inputValue);
                    }
                    state.filters.addFilter({
                        op: (cols) => `${cols[0]} ${op} ${filterValue}`,
                        columns,
                    });
                },
                submitLabel: 'Filter',
            }, (0, mithril_1.default)(text_input_1.TextInput, {
                id: 'column_filter_value',
                ref: 'COLUMN_FILTER_VALUE',
                autofocus: true,
                oninput: (e) => {
                    if (!e.target)
                        return;
                    this.inputValue = e.target.value;
                },
            })));
    }
}
class SqlTable {
    table;
    state;
    constructor(vnode) {
        this.state = vnode.attrs.state;
        this.table = this.state.config;
    }
    renderAddColumnOptions(addColumn) {
        // We do not want to add columns which already exist, so we track the
        // columns which we are already showing here.
        // TODO(altimin): Theoretically a single table can have two different
        // arg_set_ids, so we should track (arg_set_id_column, arg_name) pairs here.
        const existingColumnIds = new Set();
        for (const column of this.state.getSelectedColumns()) {
            existingColumnIds.add((0, table_column_1.tableColumnId)(column));
        }
        return (0, mithril_1.default)(select_column_menu_1.SelectColumnMenu, {
            columns: this.table.columns.map((column) => ({
                key: columnTitle(column),
                column,
            })),
            manager: getTableManager(this.state),
            existingColumnIds,
            onColumnSelected: addColumn,
        });
    }
    renderColumnFilterOptions(c) {
        return Object.keys(render_cell_utils_1.LegacySqlTableFilterOptions).map((label) => (0, mithril_1.default)(ColumnFilter, {
            filterOption: label,
            columns: [c.column],
            state: this.state,
        }));
    }
    getAdditionalColumnMenuItems(addColumnMenuItems) {
        if (addColumnMenuItems === undefined)
            return;
        const additionalColumnMenuItems = {};
        this.state.getSelectedColumns().forEach((column) => {
            const columnAlias = this.state.getCurrentRequest().columns[(0, sql_column_1.sqlColumnId)(column.column)];
            additionalColumnMenuItems[columnAlias] = addColumnMenuItems(column, columnAlias);
        });
        return additionalColumnMenuItems;
    }
    view({ attrs }) {
        const rows = this.state.getDisplayedRows();
        const additionalColumnMenuItems = this.getAdditionalColumnMenuItems(attrs.addColumnMenuItems);
        const columns = this.state.getSelectedColumns();
        return [
            (0, mithril_1.default)(grid_1.Grid, {
                className: 'sql-table',
                fillHeight: true,
            }, [
                (0, mithril_1.default)(grid_1.GridHeader, (0, mithril_1.default)(grid_1.GridRow, columns.map((column, i) => {
                    const sorted = this.state.isSortedBy(column);
                    const menuItems = [
                        (0, grid_1.renderSortMenuItems)(sorted, (direction) => this.state.sortBy({ column, direction })),
                        (0, mithril_1.default)(menu_1.MenuDivider),
                        this.state.getSelectedColumns().length > 1 &&
                            (0, mithril_1.default)(menu_1.MenuItem, {
                                label: 'Hide',
                                icon: semantic_icons_1.Icons.Hide,
                                onclick: () => this.state.hideColumnAtIndex(i),
                            }),
                        (0, mithril_1.default)(menu_1.MenuItem, { label: 'Add filter', icon: semantic_icons_1.Icons.Filter }, this.renderColumnFilterOptions(column)),
                        additionalColumnMenuItems &&
                            additionalColumnMenuItems[this.state.getCurrentRequest().columns[(0, sql_column_1.sqlColumnId)(column.column)]],
                        // Menu items before divider apply to selected column
                        (0, mithril_1.default)(menu_1.MenuDivider),
                        // Menu items after divider apply to entire table
                        (0, mithril_1.default)(AddColumnMenuItem, {
                            table: this,
                            state: this.state,
                            index: i,
                        }),
                    ];
                    return (0, mithril_1.default)(grid_1.GridHeaderCell, {
                        key: i,
                        sort: sorted,
                        onSort: (direction) => {
                            this.state.sortBy({ column, direction });
                        },
                        menuItems,
                        reorderable: { handle: 'column' },
                        onReorder: (from, to, position) => {
                            if (typeof from === 'number' && typeof to === 'number') {
                                const toIndex = position === 'before' ? to : to + 1;
                                this.state.moveColumn(from, toIndex);
                            }
                        },
                    }, columnTitle(column));
                }))),
                (0, mithril_1.default)(grid_1.GridBody, rows.map((row) => {
                    return (0, mithril_1.default)(grid_1.GridRow, columns.map((col) => {
                        const { content, menu, isNumerical, isNull } = renderCell(col, row, this.state);
                        return (0, mithril_1.default)(grid_1.GridDataCell, {
                            menuItems: menu,
                            align: isNull ? 'center' : isNumerical ? 'right' : 'left',
                            isMissing: isNull,
                        }, content);
                    }));
                })),
            ]),
            this.state.isLoading() && (0, mithril_1.default)(spinner_1.Spinner),
            this.state.getQueryError() !== undefined &&
                (0, mithril_1.default)('.query-error', this.state.getQueryError()),
        ];
    }
}
exports.SqlTable = SqlTable;
function getTableManager(state) {
    return {
        filters: state.filters,
        trace: state.trace,
        getSqlQuery: (columns) => (0, query_builder_1.buildSqlQuery)({
            table: state.config.name,
            columns,
            filters: state.filters.get(),
            orderBy: state.getOrderedBy(),
        }),
    };
}
//# sourceMappingURL=table.js.map