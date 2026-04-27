"use strict";
// Copyright (C) 2019 The Android Open Source Project
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use size file except in compliance with the License.
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
exports.AggregationPanel = void 0;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const time_1 = require("../base/time");
const box_1 = require("../widgets/box");
const stack_1 = require("../widgets/stack");
const data_grid_1 = require("./widgets/data_grid/data_grid");
class AggregationPanel {
    view({ attrs }) {
        const { dataSource, sorting, columns, barChartData } = attrs;
        return (0, mithril_1.default)(stack_1.Stack, { fillHeight: true, spacing: 'none' }, [
            barChartData && (0, mithril_1.default)(stack_1.StackFixed, (0, mithril_1.default)(box_1.Box, this.renderBarChart(barChartData))),
            (0, mithril_1.default)(stack_1.StackAuto, this.renderTable(dataSource, sorting, columns)),
        ]);
    }
    renderTable(dataSource, sorting, columns) {
        const columnsById = new Map(columns.map((c) => [c.columnId, c]));
        return (0, mithril_1.default)(data_grid_1.DataGrid, {
            fillHeight: true,
            showResetButton: false,
            columns: columns.map((c) => {
                return {
                    name: c.columnId,
                    title: c.title,
                    aggregation: c.sum ? 'SUM' : undefined,
                };
            }),
            data: dataSource,
            initialSorting: sorting,
            cellRenderer: (value, columnName) => {
                const formatHint = columnsById.get(columnName)?.formatHint;
                return this.renderCell(value, columnName, formatHint);
            },
        });
    }
    renderBarChart(data) {
        const summedValues = data.reduce((sum, item) => sum + item.value, 0);
        return (0, mithril_1.default)('.pf-aggregation-panel__bar-chart', data.map((d) => {
            const width = (d.value / summedValues) * 100;
            return (0, mithril_1.default)('.pf-aggregation-panel__bar-chart-bar', {
                style: {
                    background: d.color.base.cssString,
                    color: d.color.textBase.cssString,
                    borderColor: d.color.variant.cssString,
                    width: `${width}%`,
                },
            }, d.title);
        }));
    }
    renderCell(value, colName, formatHint) {
        if (formatHint === 'DURATION_NS' && typeof value === 'bigint') {
            return (0, mithril_1.default)('span.pf-data-grid__cell--number', time_1.Duration.humanise(value));
        }
        else if (formatHint === 'PERCENT' && typeof value === 'number') {
            return (0, mithril_1.default)('span.pf-data-grid__cell--number', `${(value * 100).toFixed(2)}%`);
        }
        else {
            return (0, data_grid_1.renderCell)(value, colName);
        }
    }
}
exports.AggregationPanel = AggregationPanel;
//# sourceMappingURL=aggregation_panel.js.map