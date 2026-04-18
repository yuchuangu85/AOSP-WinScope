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
exports.PopupColumnController = exports.ColumnController = void 0;
exports.columnControllerRowFromSqlColumn = columnControllerRowFromSqlColumn;
exports.columnControllerRowFromName = columnControllerRowFromName;
exports.newColumnControllerRow = newColumnControllerRow;
exports.newColumnControllerRows = newColumnControllerRows;
exports.hasDuplicateColumnsSelected = hasDuplicateColumnsSelected;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const popup_1 = require("../../../widgets/popup");
const empty_state_1 = require("../../../widgets/empty_state");
const button_1 = require("../../../widgets/button");
const semantic_icons_1 = require("../../../base/semantic_icons");
const checkbox_1 = require("../../../widgets/checkbox");
const text_input_1 = require("../../../widgets/text_input");
function columnControllerRowFromSqlColumn(column, checked = false) {
    return {
        id: column.name,
        checked,
        column: column,
    };
}
function columnControllerRowFromName(name, checked = false) {
    return {
        id: name,
        checked,
        column: { name: name, type: { name: 'NA', shortName: 'NA' } },
    };
}
function newColumnControllerRow(oldCol, checked) {
    return {
        id: oldCol.alias ?? oldCol.column.name,
        column: oldCol.column,
        alias: undefined,
        checked: checked ?? oldCol.checked,
    };
}
function newColumnControllerRows(oldCols, checked) {
    return oldCols.map((col) => newColumnControllerRow(col, checked));
}
class ColumnController {
    view({ attrs }) {
        const { options, fixedSize = false, allowAlias = true } = attrs;
        const filteredItems = options;
        return (0, mithril_1.default)(fixedSize
            ? '.pf-column-controller-panel.pf-column-controller-fixed-size'
            : '.pf-column-controller-panel', this.renderListOfItems(attrs, filteredItems, allowAlias));
    }
    renderListOfItems(attrs, options, allowAlias) {
        const { onChange = () => { } } = attrs;
        const allChecked = options.every(({ checked }) => checked);
        const anyChecked = options.some(({ checked }) => checked);
        if (options.length === 0) {
            return (0, mithril_1.default)(empty_state_1.EmptyState, {
                title: `No results.'`,
            });
        }
        else {
            return [
                (0, mithril_1.default)('.pf-list', (0, mithril_1.default)('.pf-column-controller-container', (0, mithril_1.default)('.pf-column-controller-header', (0, mithril_1.default)(button_1.Button, {
                    label: 'Select All',
                    icon: semantic_icons_1.Icons.SelectAll,
                    compact: true,
                    onclick: () => {
                        const diffs = options
                            .filter(({ checked }) => !checked)
                            .map(({ id, alias }) => ({ id, checked: true, alias: alias }));
                        onChange(diffs);
                    },
                    disabled: allChecked,
                }), (0, mithril_1.default)(button_1.Button, {
                    label: 'Clear All',
                    icon: semantic_icons_1.Icons.Deselect,
                    compact: true,
                    onclick: () => {
                        const diffs = options
                            .filter(({ checked }) => checked)
                            .map(({ id, alias }) => ({ id, checked: false, alias: alias }));
                        onChange(diffs);
                    },
                    disabled: !anyChecked,
                })), this.renderColumnRows(attrs, options, allowAlias))),
            ];
        }
    }
    renderColumnRows(attrs, options, allowAlias) {
        const { onChange = () => { } } = attrs;
        return options.map((item) => {
            const { id, checked, column, alias } = item;
            return (0, mithril_1.default)('', { key: id }, (0, mithril_1.default)(checkbox_1.Checkbox, {
                label: column.name,
                checked,
                className: 'pf-column-controller-item',
                onchange: () => {
                    onChange([{ id, alias, checked: !checked }]);
                },
            }), allowAlias && [
                ' as ',
                (0, mithril_1.default)(text_input_1.TextInput, {
                    placeholder: item.alias ? item.alias : column.name,
                    type: 'string',
                    oninput: (e) => {
                        if (!e.target)
                            return;
                        onChange([
                            {
                                id,
                                checked,
                                alias: e.target.value.trim(),
                            },
                        ]);
                    },
                }),
            ]);
        });
    }
}
exports.ColumnController = ColumnController;
// The same multi-select component that functions as a drop-down instead of
// a list.
class PopupColumnController {
    view({ attrs }) {
        const { icon, popupPosition = popup_1.PopupPosition.Auto, intent, compact } = attrs;
        return (0, mithril_1.default)(popup_1.Popup, {
            trigger: (0, mithril_1.default)(button_1.Button, {
                label: this.labelText(attrs),
                icon,
                intent,
                compact,
            }),
            position: popupPosition,
        }, (0, mithril_1.default)(ColumnController, attrs));
    }
    labelText(attrs) {
        const { label } = attrs;
        return label;
    }
}
exports.PopupColumnController = PopupColumnController;
function hasDuplicateColumnsSelected(cols) {
    const seenNames = {};
    const duplicates = [];
    for (const col of cols) {
        const name = col.alias || col.column.name;
        if (seenNames[name] && col.checked) {
            duplicates.push(name);
        }
        else {
            seenNames[name] = true;
        }
    }
    return duplicates;
}
//# sourceMappingURL=column_controller.js.map