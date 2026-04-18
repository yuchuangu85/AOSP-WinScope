"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartType = void 0;
exports.toTitleCase = toTitleCase;
exports.renderChart = renderChart;
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
const histogram_1 = require("./histogram");
const bar_chart_1 = require("./bar_chart");
// Holds the various chart types and human readable string
var ChartType;
(function (ChartType) {
    ChartType["BAR_CHART"] = "bar chart";
    ChartType["HISTOGRAM"] = "histogram";
})(ChartType || (exports.ChartType = ChartType = {}));
function toTitleCase(s) {
    const words = s.split(/\s/);
    for (let i = 0; i < words.length; ++i) {
        words[i] = words[i][0].toUpperCase() + words[i].substring(1);
    }
    return words.join(' ');
}
// Takes a chart option and config and map
// to the corresponding chart class component.
function renderChart(chart) {
    switch (chart.chartType) {
        case ChartType.BAR_CHART:
            return (0, mithril_1.default)(bar_chart_1.BarChart, chart);
        case ChartType.HISTOGRAM:
            return (0, mithril_1.default)(histogram_1.Histogram, chart);
        default:
            return;
    }
}
//# sourceMappingURL=chart.js.map