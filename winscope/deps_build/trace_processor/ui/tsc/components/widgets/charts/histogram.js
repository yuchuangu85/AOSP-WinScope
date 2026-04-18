"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Histogram = void 0;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const json_utils_1 = require("../../../base/json_utils");
const vega_view_1 = require("../vega_view");
const spinner_1 = require("../../../widgets/spinner");
const logging_1 = require("../../../base/logging");
class Histogram {
    getVegaSpec(attrs) {
        return {
            $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
            width: 'container',
            mark: 'bar',
            data: {
                values: (0, logging_1.assertExists)(attrs.data),
            },
            params: [
                {
                    name: vega_view_1.VegaLiteSelectionTypes.INTERVAL,
                    select: {
                        type: vega_view_1.VegaLiteSelectionTypes.INTERVAL,
                        encodings: ['x'],
                    },
                },
                {
                    name: vega_view_1.VegaLiteSelectionTypes.POINT,
                    select: { type: vega_view_1.VegaLiteSelectionTypes.POINT },
                },
            ],
            encoding: {
                x: {
                    bin: true,
                    field: attrs.columns[0],
                    title: attrs.columns[0],
                    axis: {
                        labelLimit: 500,
                    },
                },
                y: {
                    aggregate: 'count',
                    title: 'Count',
                },
            },
        };
    }
    view({ attrs }) {
        if (this.isLoading(attrs.data)) {
            return (0, mithril_1.default)(spinner_1.Spinner);
        }
        return (0, mithril_1.default)('figure', {
            className: 'chart',
        }, (0, mithril_1.default)(vega_view_1.VegaView, {
            spec: (0, json_utils_1.stringifyJsonWithBigints)(this.getVegaSpec(attrs)),
            data: {},
            onPointSelection: attrs.onPointSelection,
            onIntervalSelection: attrs.onIntervalSelection,
        }));
    }
    isLoading(data) {
        return data === undefined;
    }
}
exports.Histogram = Histogram;
//# sourceMappingURL=histogram.js.map