"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataVisualiser = void 0;
const tslib_1 = require("tslib");
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
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const chart_1 = require("../../../components/widgets/charts/chart");
const button_1 = require("../../../widgets/button");
const semantic_icons_1 = require("../../../base/semantic_icons");
const split_panel_1 = require("../../../widgets/split_panel");
const view_source_1 = require("./view_source");
const add_chart_menu_1 = require("../../../components/widgets/charts/add_chart_menu");
const utils_1 = require("../../../base/utils");
const details_shell_1 = require("../../../widgets/details_shell");
const table_1 = require("../../../components/widgets/sql/table/table");
const sql_utils_1 = require("../../../trace_processor/sql_utils");
const filters_1 = require("../../../components/widgets/sql/table/filters");
class DataVisualiser {
    visibility = split_panel_1.SplitPanelDrawerVisibility.VISIBLE;
    constructor({ attrs }) {
        if (attrs.state.selectedNode === undefined)
            return;
        attrs.state.activeViewSource = new view_source_1.VisViewSource(attrs.trace, attrs.state.selectedNode);
    }
    renderSqlTable(state) {
        const sqlTableViewState = state.activeViewSource?.visViews?.sqlTableState;
        if (sqlTableViewState === undefined)
            return;
        const range = sqlTableViewState.getDisplayedRange();
        const rowCount = sqlTableViewState.getTotalRowCount();
        const navigation = [
            (0, utils_1.exists)(range) &&
                (0, utils_1.exists)(rowCount) &&
                `Showing rows ${range.from}-${range.to} of ${rowCount}`,
            (0, mithril_1.default)(button_1.Button, {
                icon: semantic_icons_1.Icons.GoBack,
                disabled: !sqlTableViewState.canGoBack(),
                onclick: () => sqlTableViewState.goBack(),
            }),
            (0, mithril_1.default)(button_1.Button, {
                icon: semantic_icons_1.Icons.GoForward,
                disabled: !sqlTableViewState.canGoForward(),
                onclick: () => sqlTableViewState.goForward(),
            }),
        ];
        return (0, mithril_1.default)(details_shell_1.DetailsShell, {
            title: 'Explore Table',
            buttons: navigation,
            fillParent: false,
        }, (0, mithril_1.default)('div', (0, filters_1.renderFilters)(sqlTableViewState.filters)), (0, mithril_1.default)(table_1.SqlTable, {
            state: sqlTableViewState,
            addColumnMenuItems: (_, columnAlias) => {
                const chartAttrs = {
                    data: state.activeViewSource?.data,
                    columns: [columnAlias],
                };
                return (0, mithril_1.default)(add_chart_menu_1.AddChartMenuItem, {
                    chartOptions: [
                        {
                            chartType: chart_1.ChartType.BAR_CHART,
                            ...chartAttrs,
                            onIntervalSelection: (value) => {
                                const range = `(${value[columnAlias].map(sql_utils_1.sqlValueToSqliteString).join(', ')})`;
                                state.activeViewSource?.filters.addFilter({
                                    op: (cols) => `${cols[0]} IN ${range}`,
                                    columns: [columnAlias],
                                });
                            },
                            onPointSelection: (item) => {
                                const value = (0, sql_utils_1.sqlValueToSqliteString)(item.datum[columnAlias]);
                                state.activeViewSource?.filters.addFilter({
                                    op: (cols) => `${cols[0]} = ${value}`,
                                    columns: [columnAlias],
                                });
                            },
                        },
                        {
                            chartType: chart_1.ChartType.HISTOGRAM,
                            ...chartAttrs,
                            onIntervalSelection: (value) => {
                                const range = `${value[columnAlias][0]} AND ${value[columnAlias][1]}`;
                                state.activeViewSource?.filters.addFilter({
                                    op: (cols) => `${cols[0]} BETWEEN ${range}`,
                                    columns: [columnAlias],
                                });
                            },
                            onPointSelection: (item) => {
                                const minValue = item.datum[`bin_maxbins_10_${columnAlias}`];
                                const maxValue = item.datum[`bin_maxbins_10_${columnAlias}_end`];
                                state.activeViewSource?.filters.addFilter({
                                    op: (cols) => `${cols[0]} BETWEEN ${minValue} AND ${maxValue}`,
                                    columns: [columnAlias],
                                });
                            },
                        },
                    ],
                    addChart: (chart) => state.activeViewSource?.addChart(chart),
                });
            },
        }));
    }
    renderRemovableChart(chart, state) {
        return (0, mithril_1.default)('.pf-chart-card', {
            key: `${chart.chartType}-${chart.columns[0]}`,
        }, (0, mithril_1.default)(button_1.Button, {
            className: 'pf-chart-card__button',
            icon: semantic_icons_1.Icons.Close,
            onclick: () => {
                state.activeViewSource?.removeChart(chart);
            },
        }), (0, mithril_1.default)('.pf-chart-card__chart', (0, chart_1.renderChart)(chart)));
    }
    view({ attrs }) {
        const { state } = attrs;
        return (0, mithril_1.default)(split_panel_1.SplitPanel, {
            visibility: this.visibility,
            onVisibilityChange: (visibility) => {
                this.visibility = visibility;
            },
            drawerContent: (0, mithril_1.default)('.pf-chart-container', state.activeViewSource?.visViews !== undefined &&
                Array.from(state.activeViewSource?.visViews.charts.values()).map((chart) => this.renderRemovableChart(chart, state))),
        }, (0, mithril_1.default)('.pf-chart-card', this.renderSqlTable(state)));
    }
}
exports.DataVisualiser = DataVisualiser;
//# sourceMappingURL=data_visualiser.js.map