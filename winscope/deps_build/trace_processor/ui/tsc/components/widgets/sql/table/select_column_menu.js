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
exports.SelectColumnMenu = void 0;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const table_column_1 = require("./table_column");
const menu_1 = require("../../../../widgets/menu");
const raf_scheduler_1 = require("../../../../core/raf_scheduler");
const uuid_1 = require("../../../../base/uuid");
const hotkeys_1 = require("../../../../base/hotkeys");
const text_input_1 = require("../../../../widgets/text_input");
const spinner_1 = require("../../../../widgets/spinner");
function onColumnSelectedClickHandler(column, onColumnSelected) {
    if (onColumnSelected === undefined)
        return undefined;
    return (event) => {
        onColumnSelected(column);
        // For Control-Click, we don't want to close the menu to allow the user
        // to select multiple items in one go.
        if ((0, hotkeys_1.hasModKey)(event)) {
            event.stopPropagation();
        }
        // Otherwise this popup will be closed.
    };
}
// Core implementation of the selectable column list.
class SelectColumnMenuImpl {
    // When the menu elements are updated (e.g. when filtering), the popup
    // can flicker a lot. To prevent that, we fix the size of the popup
    // after the first layout.
    size;
    oncreate(vnode) {
        this.size = {
            width: vnode.dom.clientWidth,
            height: vnode.dom.clientHeight,
        };
    }
    view({ attrs }) {
        return (0, mithril_1.default)('.pf-sql-table__select-column-menu', {
            style: {
                minWidth: this.size && `${this.size.width}px`,
                minHeight: this.size && `${this.size.height}px`,
            },
        }, attrs.columns.map(({ key, column }, index) => {
            const derivedColumns = column.listDerivedColumns?.(attrs.manager);
            const columnMenu = derivedColumns === undefined ? attrs.columnMenu?.(column) : undefined;
            return (0, mithril_1.default)(menu_1.MenuItem, {
                id: index === 0 ? attrs.firstButtonUuid : undefined,
                label: key,
                rightIcon: columnMenu?.rightIcon,
                onclick: derivedColumns === undefined
                    ? onColumnSelectedClickHandler(column, attrs.onColumnSelected)
                    : undefined,
            }, derivedColumns !== undefined &&
                (0, mithril_1.default)(SelectColumnMenu, {
                    primaryColumn: { key, column },
                    existingColumnIds: attrs.existingColumnIds,
                    onColumnSelected: attrs.onColumnSelected,
                    columnMenu: attrs.columnMenu,
                    manager: attrs.manager,
                    columns: async () => {
                        const cols = await derivedColumns();
                        return [...cols.entries()].map(([key, column]) => ({
                            key,
                            column,
                        }));
                    },
                }), columnMenu?.children);
        }));
    }
}
class SelectColumnMenu {
    searchText = '';
    columns;
    constructor(vnode) {
        if (Array.isArray(vnode.attrs.columns)) {
            this.columns = vnode.attrs.columns;
        }
        else {
            vnode.attrs.columns().then((columns) => {
                this.columns = columns;
                raf_scheduler_1.raf.scheduleFullRedraw();
            });
        }
    }
    view(vnode) {
        const columns = this.columns || [];
        const { attrs } = vnode;
        // Candidates are the columns which have not been selected yet.
        const candidates = [...columns].filter(({ column }) => !attrs.existingColumnIds?.has((0, table_column_1.tableColumnId)(column)) ||
            column.listDerivedColumns?.(attrs.manager) !== undefined);
        const filterable = attrs.filterable === 'on' ||
            (attrs.filterable === undefined && candidates.length > 10);
        // Filter the candidates based on the search text.
        const filtered = candidates.filter(({ key }) => {
            return key.toLowerCase().includes(this.searchText.toLowerCase());
        });
        const primaryColumn = attrs.primaryColumn;
        const primaryColumnMenu = primaryColumn === undefined
            ? undefined
            : attrs.columnMenu?.(primaryColumn?.column);
        const firstButtonUuid = (0, uuid_1.uuidv4)();
        return [
            primaryColumn &&
                (0, mithril_1.default)(menu_1.MenuItem, {
                    label: primaryColumn.key,
                    disabled: attrs.existingColumnIds?.has((0, table_column_1.tableColumnId)(primaryColumn.column)),
                    onclick: onColumnSelectedClickHandler(primaryColumn.column, attrs.onColumnSelected),
                    rightIcon: primaryColumnMenu?.rightIcon,
                }, primaryColumnMenu?.children),
            primaryColumn && (0, mithril_1.default)(menu_1.MenuDivider),
            filterable &&
                (0, mithril_1.default)(text_input_1.TextInput, {
                    autofocus: true,
                    oninput: (event) => {
                        const eventTarget = event.target;
                        this.searchText = eventTarget.value;
                    },
                    onkeydown: (event) => {
                        if (filtered.length === 0)
                            return;
                        if (event.key === 'Enter') {
                            // If there is only one item or Mod-Enter was pressed, select the first element.
                            if (filtered.length === 1 || (0, hotkeys_1.hasModKey)(event)) {
                                const params = { bubbles: true };
                                if ((0, hotkeys_1.hasModKey)(event)) {
                                    Object.assign(params, (0, hotkeys_1.modKey)());
                                }
                                const pointerEvent = new PointerEvent('click', params);
                                document.getElementById(firstButtonUuid)?.dispatchEvent(pointerEvent);
                            }
                        }
                    },
                    value: this.searchText,
                    placeholder: 'Filter...',
                    className: 'pf-sql-table__column-filter',
                }),
            filterable && (0, mithril_1.default)(menu_1.MenuDivider),
            this.columns === undefined && (0, mithril_1.default)(spinner_1.Spinner),
            this.columns !== undefined &&
                (0, mithril_1.default)(SelectColumnMenuImpl, {
                    columns: filtered,
                    manager: attrs.manager,
                    existingColumnIds: attrs.existingColumnIds,
                    onColumnSelected: attrs.onColumnSelected,
                    columnMenu: attrs.columnMenu,
                    firstButtonUuid,
                }),
        ];
    }
}
exports.SelectColumnMenu = SelectColumnMenu;
//# sourceMappingURL=select_column_menu.js.map