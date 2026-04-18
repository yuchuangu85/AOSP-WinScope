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
exports.basicAggregations = exports.AGGREGATIONS = void 0;
exports.expandAggregations = expandAggregations;
exports.getAggregationValue = getAggregationValue;
const ids_1 = require("./ids");
// Some aggregations (e.g. average) are non-associative, so we need to expand them into basic
// associative aggregations and then compute the result from them.
function expandAggregations(aggregations) {
    const result = [];
    for (const agg of aggregations) {
        if (agg.op === 'average') {
            result.push({ op: 'sum', column: agg.column });
            result.push({ op: 'count', column: agg.column });
        }
        else {
            result.push(agg);
        }
    }
    return result;
}
// 'count' is intentionally excluded here, as it's special aggregation which is not associated
// with a column, so we just always show it, so we don't have to bother with figuring special
// UX for adding it.
exports.AGGREGATIONS = [
    'sum',
    'min',
    'max',
    'average',
];
// We need to perform basic aggregation operations in JS.
exports.basicAggregations = {
    sum: (a, b) => {
        if (a === null)
            return b;
        if (b === null)
            return a;
        if (typeof a === 'number' && typeof b === 'number') {
            return a + b;
        }
        if (typeof a === 'bigint' && typeof b === 'bigint') {
            return a + b;
        }
        return null;
    },
    count: (a, b) => {
        if (a === null)
            return b;
        if (b === null)
            return a;
        if (typeof a === 'number' && typeof b === 'number') {
            return a + b;
        }
        if (typeof a === 'bigint' && typeof b === 'bigint') {
            return a + b;
        }
        return null;
    },
    min: (a, b) => {
        if (a === null)
            return b;
        if (b === null)
            return a;
        if (a > b)
            return b;
        return a;
    },
    max: (a, b) => {
        if (a === null)
            return b;
        if (b === null)
            return a;
        if (a < b)
            return b;
        return a;
    },
};
function sqlValueAsNumber(value) {
    if (typeof value === 'number')
        return value;
    if (typeof value === 'bigint')
        return Number(value);
    return null;
}
function getAggregationValue(agg, row) {
    if (agg.op !== 'average') {
        return row[(0, ids_1.aggregationId)(agg)];
    }
    const sum = sqlValueAsNumber(row[(0, ids_1.aggregationId)({ op: 'sum', column: agg.column })]);
    const count = sqlValueAsNumber(row[(0, ids_1.aggregationId)({ op: 'count', column: agg.column })]);
    if (sum === null || count === null)
        return null;
    return sum / count;
}
//# sourceMappingURL=aggregations.js.map