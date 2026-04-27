"use strict";
// Copyright (C) 2020 The Android Open Source Project
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
exports.MetricsPage = void 0;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const result_1 = require("../../base/result");
const query_result_1 = require("../../trace_processor/query_result");
const select_1 = require("../../widgets/select");
const spinner_1 = require("../../widgets/spinner");
const vega_view_1 = require("../../components/widgets/vega_view");
const logging_1 = require("../../base/logging");
const segmented_buttons_1 = require("../../widgets/segmented_buttons");
const editor_1 = require("../../widgets/editor");
const button_1 = require("../../widgets/button");
const common_1 = require("../../widgets/common");
const code_snippet_1 = require("../../widgets/code_snippet");
const FORMATS = ['json', 'prototext', 'proto'];
async function getMetrics(engine) {
    const metrics = [];
    const metricsResult = await engine.query('select name from trace_metrics');
    for (const it = metricsResult.iter({ name: query_result_1.STR }); it.valid(); it.next()) {
        metrics.push(it.name);
    }
    return metrics;
}
async function getMetricV1(engine, metric, format) {
    const result = await engine.computeMetric([metric], format);
    if (result instanceof Uint8Array) {
        return `Uint8Array<len=${result.length}>`;
    }
    else {
        return result;
    }
}
async function getMetricV2(engine, metric, format) {
    const result = await engine.summarizeTrace([metric], undefined, undefined, format === 'proto' ? 'proto' : 'prototext');
    if (result.error || result.error.length > 0) {
        throw new Error(result.error);
    }
    switch (format) {
        case 'json':
            if (!result.protoSummary) {
                throw new Error('Error fetching Textproto trace summary');
            }
            return JSON.stringify(result.protoSummary, null, 2);
        case 'prototext':
            if (!result.textprotoSummary) {
                throw new Error('Error fetching Textproto trace summary');
            }
            return result.textprotoSummary;
        case 'proto':
            throw new Error('Proto format not supported');
        default:
            (0, logging_1.assertUnreachable)(format);
    }
}
class MetricsV1Controller {
    trace;
    engine;
    _metrics;
    _selected;
    _result;
    _format;
    _json;
    constructor(trace) {
        this.trace = trace;
        this.engine = trace.engine.getProxy('MetricsPage');
        this._metrics = [];
        this._result = (0, result_1.okResult)('');
        this._json = {};
        this._format = 'json';
        getMetrics(this.engine).then((metrics) => {
            this._metrics = metrics;
        });
    }
    get metrics() {
        return this._metrics;
    }
    get visualisations() {
        return this.trace.plugins
            .metricVisualisations()
            .filter((v) => v.metric === this.selected);
    }
    set selected(metric) {
        if (this._selected === metric) {
            return;
        }
        this._selected = metric;
        this.update();
    }
    get selected() {
        return this._selected;
    }
    set format(format) {
        if (this._format === format) {
            return;
        }
        this._format = format;
        this.update();
    }
    get format() {
        return this._format;
    }
    get result() {
        return this._result;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get resultAsJson() {
        return this._json;
    }
    update() {
        const selected = this._selected;
        const format = this._format;
        if (selected === undefined) {
            this._result = (0, result_1.okResult)('');
            this._json = {};
        }
        else {
            this._result = 'pending';
            this._json = {};
            getMetricV1(this.engine, selected, format)
                .then((result) => {
                if (this._selected === selected && this._format === format) {
                    this._result = (0, result_1.okResult)(result);
                    if (format === 'json') {
                        this._json = JSON.parse(result);
                    }
                }
            })
                .catch((e) => {
                if (this._selected === selected && this._format === format) {
                    this._result = (0, result_1.errResult)(e);
                    this._json = {};
                }
            });
        }
    }
}
function renderResult(result, format) {
    if (result === undefined) {
        return (0, mithril_1.default)('pre.pf-metrics-page__error', 'No metric provided');
    }
    if (result === 'pending') {
        return (0, mithril_1.default)(spinner_1.Spinner);
    }
    if (!result.ok) {
        return (0, mithril_1.default)('pre.pf-metrics-page__error', `${result.error}`);
    }
    return (0, mithril_1.default)(code_snippet_1.CodeSnippet, { language: format, text: result.value });
}
class MetricV1Fetcher {
    view({ attrs }) {
        const { controller } = attrs;
        return (0, mithril_1.default)('.pf-metrics-page-picker', (0, mithril_1.default)(select_1.Select, {
            value: controller.selected,
            oninput: (e) => {
                if (!e.target)
                    return;
                controller.selected = e.target.value;
            },
        }, controller.metrics.map((metric) => (0, mithril_1.default)('option', {
            value: metric,
            key: metric,
        }, metric))), (0, mithril_1.default)(select_1.Select, {
            oninput: (e) => {
                if (!e.target)
                    return;
                controller.format = e.target.value;
            },
        }, FORMATS.map((f) => {
            return (0, mithril_1.default)('option', {
                selected: controller.format === f,
                key: f,
                value: f,
                label: f,
            });
        })));
    }
}
class MetricV2Fetcher {
    text = '';
    view({ attrs }) {
        if (attrs.showExample) {
            this.text = `id: "memory_per_process"
dimensions: "process_name"
value: "avg_rss_and_swap"
query: {
  table: {
    table_name: "memory_rss_and_swap_per_process"
    module_name: "linux.memory.process"
  }
  group_by: {
    column_names: "process_name"
    aggregates: {
      column_name: "rss_and_swap"
      op: DURATION_WEIGHTED_MEAN
      result_column_name: "avg_rss_and_swap"
    }
  }
}`;
        }
        return (0, mithril_1.default)('.pf-metricsv2-page', 'Provide metric v2 spec in prototext format ', (0, mithril_1.default)(editor_1.Editor, {
            text: this.text,
            onExecute: (text) => {
                this.text = text;
                getMetricV2(attrs.engine, `metric_spec: {${text}}`, 'prototext')
                    .then((result) => {
                    attrs.onExecuteRunMetric((0, result_1.okResult)(result));
                })
                    .catch((e) => {
                    attrs.onExecuteRunMetric((0, result_1.errResult)(e));
                });
            },
            onUpdate: (text) => {
                if (text === this.text) {
                    return;
                }
                this.text = text;
                attrs.onUpdateText();
            },
        }));
    }
}
class MetricVizView {
    view({ attrs }) {
        return (0, mithril_1.default)('', (0, mithril_1.default)(vega_view_1.VegaView, {
            spec: attrs.visualisation.spec,
            data: {
                metric: attrs.data,
            },
        }));
    }
}
class MetricsPage {
    v1Controller;
    v2Result;
    showV2MetricExample = false;
    mode = 'V1';
    fetcherGeneration = 0;
    oninit({ attrs }) {
        this.v1Controller = new MetricsV1Controller(attrs.trace);
    }
    view({ attrs }) {
        const v1Controller = (0, logging_1.assertExists)(this.v1Controller);
        const json = v1Controller.resultAsJson;
        return (0, mithril_1.default)('.pf-metrics-page', (0, mithril_1.default)('', (0, mithril_1.default)(segmented_buttons_1.SegmentedButtons, {
            options: [{ label: 'Metric v1' }, { label: 'Metric v2' }],
            selectedOption: this.mode === 'V1' ? 0 : 1,
            onOptionSelected: (num) => {
                if (num === 0) {
                    this.mode = 'V1';
                }
                else {
                    this.mode = 'V2';
                }
            },
        })), this.mode === 'V1' &&
            (0, mithril_1.default)(MetricV1Fetcher, {
                controller: v1Controller,
            }), this.mode === 'V2' && [
            (0, mithril_1.default)(button_1.Button, {
                label: 'Example metric',
                intent: common_1.Intent.Primary,
                onclick: () => {
                    this.showV2MetricExample = true;
                    this.fetcherGeneration++;
                },
            }),
            (0, mithril_1.default)(MetricV2Fetcher, {
                engine: attrs.trace.engine,
                showExample: this.showV2MetricExample,
                editorGeneration: this.fetcherGeneration,
                onExecuteRunMetric: (result) => {
                    this.v2Result = result;
                },
                onUpdateText: () => {
                    this.showV2MetricExample = false;
                    this.fetcherGeneration++;
                },
            }),
        ], v1Controller.format === 'json' &&
            v1Controller.visualisations.map((visualisation) => {
                let data = json;
                for (const p of visualisation.path) {
                    data = data[p] ?? [];
                }
                return (0, mithril_1.default)(MetricVizView, { visualisation, data });
            }), renderResult(this.mode === 'V1' ? v1Controller.result : this.v2Result, v1Controller.format));
    }
}
exports.MetricsPage = MetricsPage;
//# sourceMappingURL=metrics_page.js.map