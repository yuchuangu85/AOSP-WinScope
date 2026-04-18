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
exports.GroupByOperation = void 0;
exports.GroupByAggregationAttrsToProto = GroupByAggregationAttrsToProto;
exports.placeholderNewColumnName = placeholderNewColumnName;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const column_controller_1 = require("../column_controller");
const section_1 = require("../../../../widgets/section");
const select_1 = require("../../../../widgets/select");
const text_input_1 = require("../../../../widgets/text_input");
const button_1 = require("../../../../widgets/button");
const protos_1 = tslib_1.__importDefault(require("../../../../protos"));
const AGGREGATION_OPS = [
    'COUNT',
    'SUM',
    'MIN',
    'MAX',
    'MEAN',
    'DURATION_WEIGHTED_MEAN',
];
class GroupByOperation {
    view({ attrs }) {
        if (attrs.groupByColumns.length === 0) {
            return;
        }
        const selectGroupByColumns = () => {
            return (0, mithril_1.default)(column_controller_1.ColumnController, {
                options: attrs.groupByColumns,
                allowAlias: false,
                onChange: (diffs) => {
                    for (const diff of diffs) {
                        const column = attrs.groupByColumns.find((c) => c.id === diff.id);
                        if (column) {
                            column.checked = diff.checked;
                            if (!diff.checked) {
                                attrs.aggregations = attrs.aggregations?.filter((agg) => agg.column?.id !== diff.id);
                            }
                        }
                    }
                },
            });
        };
        const selectAggregationForColumn = (agg, index) => {
            const columnOptions = attrs.groupByColumns.map((col) => (0, mithril_1.default)('option', {
                value: col.id,
                selected: agg.column?.id === col.id,
            }, col.id));
            return (0, mithril_1.default)(section_1.Section, {
                title: `Aggregation ${index + 1}`,
                key: index,
            }, (0, mithril_1.default)(button_1.Button, {
                label: 'X',
                onclick: () => {
                    attrs.aggregations?.splice(index, 1);
                },
            }), (0, mithril_1.default)('Column:', (0, mithril_1.default)(select_1.Select, {
                onchange: (e) => {
                    const target = e.target;
                    const selectedColumn = attrs.groupByColumns.find((c) => c.id === target.value);
                    agg.column = selectedColumn;
                },
            }, (0, mithril_1.default)('option', { disabled: true, selected: !agg.column }, 'Select a column'), columnOptions)), (0, mithril_1.default)(select_1.Select, {
                title: 'Aggregation type: ',
                onchange: (e) => {
                    agg.aggregationOp = e.target.value;
                },
            }, AGGREGATION_OPS.map((op) => (0, mithril_1.default)('option', {
                value: op,
                selected: op === agg.aggregationOp,
            }, op))), (0, mithril_1.default)(text_input_1.TextInput, {
                title: 'New column name',
                placeholder: agg.column
                    ? placeholderNewColumnName(agg)
                    : 'Enter column name',
                onchange: (e) => {
                    agg.newColumnName = e.target.value.trim();
                },
                value: agg.newColumnName,
            }));
        };
        const onAddAggregation = () => {
            attrs.aggregations.push({
                aggregationOp: AGGREGATION_OPS[0],
                column: undefined,
                newColumnName: undefined,
            });
        };
        const selectAggregations = () => {
            return (0, mithril_1.default)('', attrs.aggregations.map((agg, index) => selectAggregationForColumn(agg, index)), (0, mithril_1.default)(button_1.Button, {
                label: 'Add Aggregation',
                onclick: onAddAggregation,
            }));
        };
        return (0, mithril_1.default)('', (0, mithril_1.default)(section_1.Section, { title: 'Columns for group by' }, selectGroupByColumns()), (0, mithril_1.default)(section_1.Section, { title: 'Aggregations' }, selectAggregations()));
    }
}
exports.GroupByOperation = GroupByOperation;
function stringToAggregateOp(s) {
    if (AGGREGATION_OPS.includes(s)) {
        return protos_1.default.PerfettoSqlStructuredQuery.GroupBy.Aggregate.Op[s];
    }
    throw new Error(`Invalid AggregateOp '${s}'`);
}
function GroupByAggregationAttrsToProto(agg) {
    const newAgg = new protos_1.default.PerfettoSqlStructuredQuery.GroupBy.Aggregate();
    newAgg.columnName = agg.column.column.name;
    newAgg.op = stringToAggregateOp(agg.aggregationOp);
    newAgg.resultColumnName = agg.newColumnName ?? placeholderNewColumnName(agg);
    return newAgg;
}
function placeholderNewColumnName(agg) {
    return agg.column
        ? `${agg.column.id}_${agg.aggregationOp}`
        : `agg_${agg.aggregationOp}`;
}
//# sourceMappingURL=groupy_by.js.map