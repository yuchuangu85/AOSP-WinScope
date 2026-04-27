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
exports.StandardFilters = exports.Filters = void 0;
exports.formatFilter = formatFilter;
exports.filterTitle = filterTitle;
exports.isFilterEqual = isFilterEqual;
exports.areFiltersEqual = areFiltersEqual;
exports.renderFilters = renderFilters;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const sql_column_1 = require("./sql_column");
const sql_utils_1 = require("../../../../trace_processor/sql_utils");
const chip_1 = require("../../../../widgets/chip");
const stack_1 = require("../../../../widgets/stack");
// A class representing a set of filters. As it's common for multiple components to share the same set of filters (e.g.
// table viewer and associated charts), this class allows sharing the same set of filters between multiple components
// and them being notified when the filters change.
class Filters {
    filters = [];
    // Use WeakRef to allow observers to be reclaimed.
    observers = [];
    constructor(filters = []) {
        this.filters = [...filters];
    }
    addFilter(filter) {
        this.filters.push(filter);
        this.notify();
    }
    addFilters(filter) {
        this.filters.push(...filter);
        this.notify();
    }
    removeFilter(filter) {
        const idx = this.filters.findIndex((f) => isFilterEqual(f, filter));
        if (idx === -1)
            throw new Error('Filter not found');
        this.filters.splice(idx, 1);
        this.notify();
    }
    setFilters(filters) {
        this.filters = [...filters];
        this.notify();
    }
    clear() {
        this.setFilters([]);
    }
    get() {
        return this.filters;
    }
    addObserver(observer) {
        this.observers.push(observer);
    }
    notify() {
        this.observers.forEach((observer) => observer());
    }
}
exports.Filters = Filters;
// Returns a default string representation of the filter.
function formatFilter(filter) {
    return filter.op(filter.columns.map((c) => (0, sql_column_1.sqlColumnId)(c)));
}
// Returns a human-readable title for the filter.
function filterTitle(filter) {
    if (filter.getTitle !== undefined) {
        return filter.getTitle();
    }
    return formatFilter(filter);
}
function isFilterEqual(a, b) {
    return (a.op === b.op &&
        a.columns.length === b.columns.length &&
        a.columns.every((c, i) => (0, sql_column_1.isSqlColumnEqual)(c, b.columns[i])));
}
function areFiltersEqual(a, b) {
    if (a.length !== b.length)
        return false;
    return a.every((f, i) => isFilterEqual(f, b[i]));
}
function renderFilters(filters) {
    return (0, mithril_1.default)(stack_1.Stack, { orientation: 'horizontal' }, [
        filters.get().map((filter) => (0, mithril_1.default)(chip_1.Chip, {
            label: filterTitle(filter),
            removable: true,
            onRemove: () => filters.removeFilter(filter),
        })),
    ]);
}
class StandardFilters {
    static valueEquals(col, value) {
        if (value === null) {
            return {
                columns: [col],
                op: (cols) => `${cols[0]} IS NULL`,
            };
        }
        return {
            columns: [col],
            op: (cols) => `${cols[0]} = ${(0, sql_utils_1.sqlValueToSqliteString)(value)}`,
        };
    }
    static valueNotEquals(col, value) {
        if (value === null) {
            return {
                columns: [col],
                op: (cols) => `${cols[0]} IS NOT NULL`,
            };
        }
        return {
            columns: [col],
            op: (cols) => `${cols[0]} != ${(0, sql_utils_1.sqlValueToSqliteString)(value)}`,
        };
    }
    static valueIsOneOf(col, values) {
        if (values.length === 1)
            return StandardFilters.valueEquals(col, values[0]);
        if (values.length === 0) {
            return {
                columns: [],
                op: () => 'FALSE',
            };
        }
        return {
            op: (cols) => `${cols[0]} IN (${values.map(sql_utils_1.sqlValueToSqliteString).join(', ')})`,
            columns: [col],
        };
    }
}
exports.StandardFilters = StandardFilters;
//# sourceMappingURL=filters.js.map