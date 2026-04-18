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
exports.FilterOperation = void 0;
exports.FilterToProto = FilterToProto;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const button_1 = require("../../../../widgets/button");
const select_1 = require("../../../../widgets/select");
const text_input_1 = require("../../../../widgets/text_input");
const section_1 = require("../../../../widgets/section");
const protos_1 = tslib_1.__importDefault(require("../../../../protos"));
class FilterOperation {
    defaultOp = 'EQUAL';
    availableOperators = [
        'EQUAL',
        'NOT_EQUAL',
        'LESS_THAN',
        'LESS_THAN_EQUAL',
        'GREATER_THAN',
        'GREATER_THAN_EQUAL',
        'IS_NULL',
        'IS_NOT_NULL',
        'GLOB',
    ];
    view({ attrs }) {
        const onAddFilter = () => {
            if (attrs.filters === undefined) {
                attrs.filters = [];
            }
            const firstCheckedColumn = attrs.sourceCols?.find((c) => c.checked);
            if (!firstCheckedColumn) {
                return;
            }
            attrs.filters?.push({
                filterOp: this.defaultOp,
                columnName: firstCheckedColumn,
                stringsRhs: [],
                doubleRhs: [],
                intRhs: [],
            });
        };
        const onFilterRemoved = (index) => {
            attrs.filters?.splice(index, 1);
        };
        const filterWidgets = attrs.filters?.map((filter, index) => {
            const columnOptions = (attrs.sourceCols ?? [])
                .filter((c) => c.checked)
                .map((col) => {
                return (0, mithril_1.default)('option', {
                    value: col.id,
                    selected: col.id === filter.columnName.id,
                }, col.id);
            });
            const operatorOptions = this.availableOperators.map((op) => {
                return (0, mithril_1.default)('option', {
                    value: op,
                    selected: op === filter.filterOp,
                }, op);
            });
            return (0, mithril_1.default)(section_1.Section, { title: `Filter ${index}` }, (0, mithril_1.default)(button_1.Button, {
                label: 'Remove filter',
                onclick: () => onFilterRemoved(index),
            }), (0, mithril_1.default)('', ' Column: ', (0, mithril_1.default)(select_1.Select, {
                onchange: (e) => {
                    const target = e.target;
                    const selectedColumn = attrs.sourceCols?.find((c) => c.id === target.value);
                    if (selectedColumn) {
                        filter.columnName = selectedColumn;
                    }
                },
            }, columnOptions)), (0, mithril_1.default)('', ' Operator: ', (0, mithril_1.default)(select_1.Select, {
                onchange: (e) => {
                    const target = e.target;
                    filter.filterOp = target.value;
                },
            }, operatorOptions)), (0, mithril_1.default)(text_input_1.TextInput, {
                placeholder: 'Enter values separated by commas',
                onchange: (e) => {
                    const target = e.target;
                    const values = target.value
                        .split(',')
                        .map((s) => s.trim())
                        .filter((s) => s !== '');
                    filter.stringsRhs = [];
                    filter.doubleRhs = [];
                    filter.intRhs = [];
                    if (values.every((v) => !isNaN(Number(v)))) {
                        if (values.every((v) => Number(v) === Math.floor(Number(v)))) {
                            filter.intRhs = values.map(Number);
                        }
                        else {
                            filter.doubleRhs = values.map(Number);
                        }
                    }
                    else {
                        filter.stringsRhs = values;
                    }
                },
            }));
        });
        return (0, mithril_1.default)('', (0, mithril_1.default)(button_1.Button, {
            label: 'Add Filter',
            onclick: onAddFilter,
        }), filterWidgets);
    }
}
exports.FilterOperation = FilterOperation;
function StringToFilterOp(s) {
    switch (s) {
        case 'EQUAL':
            return protos_1.default.PerfettoSqlStructuredQuery.Filter.Operator.EQUAL;
        case 'NOT_EQUAL':
            return protos_1.default.PerfettoSqlStructuredQuery.Filter.Operator.NOT_EQUAL;
        case 'GREATER_THAN':
            return protos_1.default.PerfettoSqlStructuredQuery.Filter.Operator.GREATER_THAN;
        case 'GREATER_THAN_EQUAL':
            return protos_1.default.PerfettoSqlStructuredQuery.Filter.Operator
                .GREATER_THAN_EQUAL;
        case 'LESS_THAN':
            return protos_1.default.PerfettoSqlStructuredQuery.Filter.Operator.LESS_THAN;
        case 'LESS_THAN_EQUAL':
            return protos_1.default.PerfettoSqlStructuredQuery.Filter.Operator.LESS_THAN_EQUAL;
        case 'IS_NULL':
            return protos_1.default.PerfettoSqlStructuredQuery.Filter.Operator.IS_NULL;
        case 'IS_NOT_NULL':
            return protos_1.default.PerfettoSqlStructuredQuery.Filter.Operator.IS_NOT_NULL;
        case 'GLOB':
            return protos_1.default.PerfettoSqlStructuredQuery.Filter.Operator.GLOB;
        default:
            throw new Error(`Invalid filter operation '${s}'`);
    }
}
function FilterToProto(filter) {
    const newFilter = new protos_1.default.PerfettoSqlStructuredQuery.Filter();
    newFilter.columnName = filter.columnName.id;
    newFilter.op = StringToFilterOp(filter.filterOp);
    newFilter.doubleRhs = filter.doubleRhs;
    newFilter.int64Rhs = filter.intRhs;
    newFilter.stringRhs = filter.stringsRhs;
    return newFilter;
}
//# sourceMappingURL=filter.js.map