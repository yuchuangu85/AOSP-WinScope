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
exports.Operator = void 0;
exports.createFiltersProto = createFiltersProto;
exports.createGroupByProto = createGroupByProto;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const filter_1 = require("./filter");
const groupy_by_1 = require("./groupy_by");
const protos_1 = tslib_1.__importDefault(require("../../../../protos"));
const section_1 = require("../../../../widgets/section");
class Operator {
    view({ attrs }) {
        return (0, mithril_1.default)('.explore-page__rowish', (0, mithril_1.default)(section_1.Section, { title: 'Filters' }, (0, mithril_1.default)(filter_1.FilterOperation, attrs.filter)), (0, mithril_1.default)(section_1.Section, { title: 'Aggregation' }, (0, mithril_1.default)(groupy_by_1.GroupByOperation, attrs.groupby)));
    }
}
exports.Operator = Operator;
function createFiltersProto(filters) {
    const protos = filters.map((f) => (0, filter_1.FilterToProto)(f));
    return protos.length !== 0 ? protos : undefined;
}
function createGroupByProto(groupByColumns, aggregations) {
    if (!groupByColumns.find((c) => c.checked))
        return;
    const groupByProto = new protos_1.default.PerfettoSqlStructuredQuery.GroupBy();
    groupByProto.columnNames = groupByColumns
        .filter((c) => c.checked)
        .map((c) => c.column.name);
    groupByProto.aggregates = aggregations
        .filter((agg) => agg.column)
        .map(groupy_by_1.GroupByAggregationAttrsToProto);
    return groupByProto;
}
//# sourceMappingURL=operation_component.js.map