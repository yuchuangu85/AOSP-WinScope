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
exports.ALL_FILTER_OPS = exports.FilterOperation = void 0;
exports.isFilterDefinitionValid = isFilterDefinitionValid;
exports.createFiltersProto = createFiltersProto;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const button_1 = require("../../../../widgets/button");
const chip_1 = require("../../../../widgets/chip");
const common_1 = require("../../../../widgets/common");
const select_1 = require("../../../../widgets/select");
const text_input_1 = require("../../../../widgets/text_input");
const protos_1 = tslib_1.__importDefault(require("../../../../protos"));
const stack_1 = require("../../../../widgets/stack");
class FilterOperation {
    error;
    uiFilters = [];
    editingFilter;
    oncreate({ attrs }) {
        this.uiFilters = [...attrs.filters];
    }
    onbeforeupdate({ attrs }) {
        // If we are not in editing mode, sync with the parent.
        if (this.editingFilter === undefined) {
            this.uiFilters = [...attrs.filters];
        }
    }
    setFilters(nextFilters, attrs, editing) {
        this.uiFilters = nextFilters;
        this.editingFilter = editing;
        // Only notify the parent of "stable" changes, i.e. when not editing.
        if (this.editingFilter === undefined) {
            attrs.onFiltersChanged?.(this.uiFilters.filter(isFilterDefinitionValid));
        }
        attrs.onchange?.();
        mithril_1.default.redraw();
    }
    view({ attrs }) {
        const { sourceCols } = attrs;
        const editor = this.editingFilter === undefined
            ? undefined
            : (0, mithril_1.default)(FilterEditor, {
                filter: this.editingFilter,
                sourceCols,
                onUpdate: (newFilter) => {
                    const index = this.uiFilters.indexOf(this.editingFilter);
                    const nextFilters = this.uiFilters.map((f, i) => i === index ? newFilter : f);
                    this.setFilters(nextFilters, attrs, newFilter);
                },
                onRemove: () => {
                    const nextFilters = this.uiFilters.filter((f) => f !== this.editingFilter);
                    this.setFilters(nextFilters, attrs, undefined);
                },
                onDone: () => {
                    this.setFilters(this.uiFilters, attrs, undefined);
                },
            });
        return (0, mithril_1.default)('.pf-exp-query-operations', [
            (0, mithril_1.default)('.pf-exp-section', [
                (0, mithril_1.default)('.pf-exp-filters-header', (0, mithril_1.default)('h2.pf-exp-filters-title', 'Filters'), (0, mithril_1.default)(text_input_1.TextInput, {
                    placeholder: 'e.g. ts > 1000',
                    onkeydown: (e) => {
                        const target = e.target;
                        if (e.key === 'Enter') {
                            const text = target.value;
                            if (text.length > 0) {
                                const filter = fromString(text, sourceCols);
                                if (!isFilterDefinitionValid(filter)) {
                                    if (filter.column === undefined) {
                                        this.error = `Column not found in "${text}"`;
                                    }
                                    else if (filter.op === undefined) {
                                        this.error = `Operator not found in "${text}"`;
                                    }
                                    else {
                                        this.error = `Filter value is missing in "${text}"`;
                                    }
                                    mithril_1.default.redraw();
                                    return;
                                }
                                this.error = undefined;
                                this.setFilters([...this.uiFilters, filter], attrs);
                                target.value = '';
                            }
                        }
                    },
                })),
                this.error && (0, mithril_1.default)('.pf-exp-error-message', this.error),
                (0, mithril_1.default)(stack_1.Stack, { orientation: 'horizontal' }, this.uiFilters.map((filter) => {
                    const isComplete = isFilterDefinitionValid(filter);
                    const label = isComplete
                        ? `${filter.column} ${filter.op} ${'value' in filter ? filter.value : ''}`
                        : 'New Filter';
                    return (0, mithril_1.default)(chip_1.Chip, {
                        label,
                        rounded: true,
                        intent: isComplete ? common_1.Intent.Primary : common_1.Intent.None,
                        onclick: () => {
                            // When we start editing a chip, we remove all other invalid
                            // filters from the list.
                            const nextFilters = this.uiFilters.filter((f) => f === filter || isFilterDefinitionValid(f));
                            this.setFilters(nextFilters, attrs, filter);
                        },
                    });
                }), (0, mithril_1.default)(button_1.Button, {
                    icon: 'add',
                    rounded: true,
                    intent: common_1.Intent.Primary,
                    onclick: () => {
                        if (this.editingFilter !== undefined &&
                            !isFilterDefinitionValid(this.editingFilter)) {
                            const nextFilters = this.uiFilters.filter((f) => f !== this.editingFilter);
                            this.setFilters(nextFilters, attrs, undefined);
                        }
                        else {
                            const newFilter = {};
                            const nextFilters = [...this.uiFilters, newFilter];
                            this.setFilters(nextFilters, attrs, newFilter);
                        }
                    },
                })),
                editor && (0, mithril_1.default)('.pf-exp-filter-editor-box', editor),
            ]),
        ]);
    }
}
exports.FilterOperation = FilterOperation;
// A component which allows the user to edit a single filter.
class FilterEditor {
    view({ attrs }) {
        const { filter, sourceCols, onUpdate, onRemove, onDone } = attrs;
        const { column, op } = filter;
        const opObject = exports.ALL_FILTER_OPS.find((o) => o.displayName === op);
        const valueRequired = isValueRequired(opObject);
        const isValid = isFilterDefinitionValid(filter);
        const colOptions = sourceCols
            .filter((c) => c.checked)
            .map(({ name }) => {
            return (0, mithril_1.default)('option', { value: name, selected: name === column }, name);
        });
        const opOptions = exports.ALL_FILTER_OPS.map((op) => {
            return (0, mithril_1.default)('option', {
                value: op.key,
                selected: op.displayName === filter.op,
            }, op.displayName);
        });
        return (0, mithril_1.default)('.pf-exp-filter-editor', { className: isValid ? 'is-valid' : 'is-invalid' }, [
            (0, mithril_1.default)(select_1.Select, {
                onchange: (e) => {
                    const target = e.target;
                    onUpdate({ ...filter, column: target.value });
                },
            }, (0, mithril_1.default)('option', { disabled: true, selected: column === undefined }, 'Column'), colOptions),
            (0, mithril_1.default)(select_1.Select, {
                onchange: (e) => {
                    const target = e.target;
                    const newOp = exports.ALL_FILTER_OPS.find((op) => op.key === target.value);
                    const newFilter = {
                        ...filter,
                        op: newOp?.displayName,
                    };
                    if (newOp && !isValueRequired(newOp)) {
                        delete newFilter.value;
                    }
                    onUpdate(newFilter);
                },
            }, (0, mithril_1.default)('option', { disabled: true, selected: op === undefined }, 'Operator'), opOptions),
            valueRequired &&
                (0, mithril_1.default)(text_input_1.TextInput, {
                    placeholder: 'Value',
                    value: 'value' in filter ? String(filter.value) : '',
                    oninput: (e) => {
                        const target = e.target;
                        const value = parseFilterValue(target.value);
                        const { value: _value, ...rest } = filter;
                        if (value !== undefined) {
                            onUpdate({ ...rest, value });
                        }
                        else {
                            onUpdate(rest);
                        }
                    },
                }),
            (0, mithril_1.default)(button_1.Button, {
                className: 'pf-exp-delete-button',
                icon: 'delete',
                onclick: onRemove,
            }),
            (0, mithril_1.default)(button_1.Button, {
                label: 'Done',
                className: 'is-primary',
                disabled: !isValid,
                onclick: onDone,
            }),
        ]);
    }
}
/**
 * Check if a work-in-progress filter is valid and can be converted to a
 * proper Filter.
 * @param filter The filter to check.
 * @returns True if the filter is valid.
 */
function isFilterDefinitionValid(filter) {
    const { column, op } = filter;
    if (column === undefined || op === undefined) {
        return false;
    }
    const opObject = exports.ALL_FILTER_OPS.find((o) => o.displayName === op);
    if (opObject === undefined) {
        return false;
    }
    if (isValueRequired(opObject)) {
        if (!('value' in filter) || filter.value === undefined) {
            return false;
        }
    }
    return true;
}
// Tries to parse a filter from a raw string. This is a best-effort parser
// for simple filters and does not support complex values with spaces or quotes.
// TODO(mayzner): Improve this parser to handle more complex cases, such as
// quoted strings, escaped characters, or operators within values.
function fromString(text, sourceCols) {
    // Sort operators by length descending to match "is not null" before "is
    // null".
    const ops = exports.ALL_FILTER_OPS.slice().sort((a, b) => b.displayName.length - a.displayName.length);
    const opRegex = ops
        .map((op) => op.displayName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        .join('|');
    // A regex to capture the column, operator and value.
    // The value can be a quoted string or a single word.
    const regex = new RegExp(`^(\\S+)\\s+(${opRegex})(?:\\s+(".*?"|'.*?'|\\S+))?$`, 'i');
    const match = text.trim().match(regex);
    if (!match) {
        // If regex doesn't match, maybe it's just a column name.
        const col = sourceCols.find((c) => c.name.toLowerCase() === text.trim().toLowerCase());
        if (col) {
            return { column: col.name };
        }
        return {};
    }
    const [, colName, opName, valueText] = match;
    const col = sourceCols.find((c) => c.name.toLowerCase() === colName.toLowerCase());
    if (col === undefined) {
        return {};
    }
    // Find the exact operator object. We need to do a case-insensitive search.
    const op = exports.ALL_FILTER_OPS.find((o) => o.displayName.toLowerCase() === opName.toLowerCase());
    if (op === undefined) {
        throw new Error('Internal error: operator not found despite regex match');
    }
    const value = isValueRequired(op)
        ? parseFilterValue(valueText || '')
        : undefined;
    if (isValueRequired(op) && value === undefined) {
        // Value is required but not found or empty
        return {
            column: col.name,
            op: op.displayName,
        };
    }
    const result = {
        column: col.name,
        op: op.displayName,
    };
    if (value !== undefined) {
        result.value = value;
    }
    return result;
}
function op(key, displayName, proto) {
    return {
        key,
        displayName,
        proto,
    };
}
function isValueRequired(op) {
    return op !== undefined && op.key !== 'IS_NULL' && op.key !== 'IS_NOT_NULL';
}
// Parses a comma-separated string of values into an array of strings or
// numbers.
// If all values can be parsed as numbers, it returns a number array.
// Otherwise, it returns a string array.
function parseFilterValue(text) {
    const value = text.trim();
    if (value === '')
        return undefined;
    // If the value is quoted, remove the quotes.
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
        return value.slice(1, -1);
    }
    if (value !== '' && !isNaN(Number(value))) {
        return Number(value);
    }
    else {
        return value;
    }
}
/**
 * All available filter operations.
 */
exports.ALL_FILTER_OPS = [
    op('EQUAL', '=', protos_1.default.PerfettoSqlStructuredQuery.Filter.Operator.EQUAL),
    op('NOT_EQUAL', '!=', protos_1.default.PerfettoSqlStructuredQuery.Filter.Operator.NOT_EQUAL),
    op('LESS_THAN', '<', protos_1.default.PerfettoSqlStructuredQuery.Filter.Operator.LESS_THAN),
    op('LESS_THAN_EQUAL', '<=', protos_1.default.PerfettoSqlStructuredQuery.Filter.Operator.LESS_THAN_EQUAL),
    op('GREATER_THAN', '>', protos_1.default.PerfettoSqlStructuredQuery.Filter.Operator.GREATER_THAN),
    op('GREATER_THAN_EQUAL', '>=', protos_1.default.PerfettoSqlStructuredQuery.Filter.Operator.GREATER_THAN_EQUAL),
    op('IS_NULL', 'is null', protos_1.default.PerfettoSqlStructuredQuery.Filter.Operator.IS_NULL),
    op('IS_NOT_NULL', 'is not null', protos_1.default.PerfettoSqlStructuredQuery.Filter.Operator.IS_NOT_NULL),
    op('GLOB', 'glob', protos_1.default.PerfettoSqlStructuredQuery.Filter.Operator.GLOB),
];
function createFiltersProto(filters, sourceCols) {
    if (filters.length === 0) {
        return undefined;
    }
    const protoFilters = filters.map((f) => {
        const result = new protos_1.default.PerfettoSqlStructuredQuery.Filter();
        result.columnName = f.column;
        const op = exports.ALL_FILTER_OPS.find((o) => o.displayName === f.op);
        if (op === undefined) {
            // Should be handled by validation before this.
            throw new Error(`Unknown filter operator: ${f.op}`);
        }
        result.op = op.proto;
        if ('value' in f) {
            const value = f.value;
            const col = sourceCols.find((c) => c.name === f.column);
            if (typeof value === 'string') {
                result.stringRhs = [value];
            }
            else if (typeof value === 'number' || typeof value === 'bigint') {
                if (col && (col.type === 'long' || col.type === 'int')) {
                    result.int64Rhs = [Number(value)];
                }
                else {
                    result.doubleRhs = [Number(value)];
                }
            }
            // Not handling Uint8Array here. The original FilterToProto also didn't seem to.
        }
        return result;
    });
    return protoFilters;
}
//# sourceMappingURL=filter.js.map