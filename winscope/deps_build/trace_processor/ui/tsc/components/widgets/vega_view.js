"use strict";
// Copyright (C) 2023 The Android Open Source Project
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
exports.VegaView = exports.VegaLiteSelectionTypes = void 0;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const vega = tslib_1.__importStar(require("vega"));
const vegaLite = tslib_1.__importStar(require("vega-lite"));
const errors_1 = require("../../base/errors");
const object_utils_1 = require("../../base/object_utils");
const resize_observer_1 = require("../../base/resize_observer");
const query_result_1 = require("../../trace_processor/query_result");
const spinner_1 = require("../../widgets/spinner");
function isVegaLite(spec) {
    if (typeof spec === 'object') {
        const schema = spec['$schema'];
        if (schema !== undefined && (0, object_utils_1.isString)(schema)) {
            // If the schema is available use that:
            return schema.includes('vega-lite');
        }
    }
    // Otherwise assume vega-lite:
    return true;
}
// Vega-Lite specific interactions
// types (https://vega.github.io/vega-lite/docs/selection.html#select)
var VegaLiteSelectionTypes;
(function (VegaLiteSelectionTypes) {
    VegaLiteSelectionTypes["INTERVAL"] = "interval";
    VegaLiteSelectionTypes["POINT"] = "point";
})(VegaLiteSelectionTypes || (exports.VegaLiteSelectionTypes = VegaLiteSelectionTypes = {}));
// VegaWrapper is in exactly one of these states:
var Status;
(function (Status) {
    // Has not visualisation to render.
    Status[Status["Empty"] = 0] = "Empty";
    // Currently loading the visualisation.
    Status[Status["Loading"] = 1] = "Loading";
    // Failed to load or render the visualisation. The reason is
    // retrievable via |error|.
    Status[Status["Error"] = 2] = "Error";
    // Displaying a visualisation:
    Status[Status["Done"] = 3] = "Done";
})(Status || (Status = {}));
class EngineLoader {
    engine;
    loader;
    constructor(engine) {
        this.engine = engine;
        this.loader = vega.loader();
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async load(uri, _options) {
        if (this.engine === undefined) {
            return '';
        }
        try {
            const result = await this.engine.query(uri);
            const columns = result.columns();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const rows = [];
            for (const it = result.iter({}); it.valid(); it.next()) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const row = {};
                for (const name of columns) {
                    let value = it.get(name);
                    if (typeof value === 'bigint') {
                        value = Number(value);
                    }
                    row[name] = value;
                }
                rows.push(row);
            }
            return JSON.stringify(rows);
        }
        catch (e) {
            if (e instanceof query_result_1.QueryError) {
                console.error(e);
                return '';
            }
            else {
                throw e;
            }
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sanitize(uri, options) {
        return this.loader.sanitize(uri, options);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    http(uri, options) {
        return this.loader.http(uri, options);
    }
    file(filename) {
        return this.loader.file(filename);
    }
}
class VegaWrapper {
    dom;
    _spec;
    _data;
    view;
    pending;
    _status;
    _error;
    _engine;
    _onPointSelection;
    _onIntervalSelection;
    constructor(dom) {
        this.dom = dom;
        this._status = Status.Empty;
    }
    get status() {
        return this._status;
    }
    get error() {
        return this._error ?? '';
    }
    set spec(value) {
        if (this._spec !== value) {
            this._spec = value;
            this.updateView();
        }
    }
    set data(value) {
        if (this._data === value || (0, object_utils_1.shallowEquals)(this._data, value)) {
            return;
        }
        this._data = value;
        this.updateView();
    }
    set engine(engine) {
        this._engine = engine;
    }
    set onPointSelection(cb) {
        this._onPointSelection = cb;
    }
    set onIntervalSelection(cb) {
        this._onIntervalSelection = cb;
    }
    onResize() {
        if (this.view) {
            this.view.resize();
        }
    }
    updateView() {
        this._status = Status.Empty;
        this._error = undefined;
        // We no longer care about inflight renders:
        if (this.pending) {
            this.pending = undefined;
        }
        // Destroy existing view if needed:
        if (this.view) {
            this.view.finalize();
            this.view = undefined;
        }
        // If the spec and data are both available then create a new view:
        if (this._spec !== undefined && this._data !== undefined) {
            let spec;
            try {
                spec = JSON.parse(this._spec);
            }
            catch (e) {
                this.setError(e);
                return;
            }
            if (isVegaLite(spec)) {
                try {
                    spec = vegaLite.compile(spec, {}).spec;
                }
                catch (e) {
                    this.setError(e);
                    return;
                }
            }
            // Create the runtime and view the bind the host DOM element
            // and any data.
            const runtime = vega.parse(spec);
            this.view = new vega.View(runtime, {
                loader: new EngineLoader(this._engine),
            });
            this.view.initialize(this.dom);
            for (const [key, value] of Object.entries(this._data)) {
                this.view.data(key, value);
            }
            // Attaching event listeners for Vega-Lite
            // selection interactions only (interval and point selection)
            // Both will trigger a pointerup event
            if (isVegaLite(this._spec)) {
                this.view.addEventListener('pointerup', (_, item) => {
                    if (item) {
                        if (this.view?.signal(VegaLiteSelectionTypes.INTERVAL) !==
                            undefined &&
                            Object.values(this.view?.signal(VegaLiteSelectionTypes.INTERVAL))
                                .length > 0) {
                            this._onIntervalSelection?.(this.view?.signal(VegaLiteSelectionTypes.INTERVAL));
                        }
                        else {
                            this._onPointSelection?.(item);
                        }
                    }
                });
            }
            const pending = this.view.runAsync();
            pending
                .then(() => {
                this.handleComplete(pending);
            })
                .catch((err) => {
                this.handleError(pending, err);
            });
            this.pending = pending;
            this._status = Status.Loading;
        }
    }
    handleComplete(pending) {
        if (this.pending !== pending) {
            return;
        }
        this._status = Status.Done;
        this.pending = undefined;
        mithril_1.default.redraw();
    }
    handleError(pending, err) {
        if (this.pending !== pending) {
            return;
        }
        this.pending = undefined;
        this.setError(err);
    }
    setError(err) {
        this._status = Status.Error;
        this._error = (0, errors_1.getErrorMessage)(err);
        mithril_1.default.redraw();
    }
    [Symbol.dispose]() {
        this._data = undefined;
        this._spec = undefined;
        this.updateView();
    }
}
class VegaView {
    wrapper;
    resize;
    oncreate({ dom, attrs }) {
        const wrapper = new VegaWrapper(dom.firstElementChild);
        wrapper.spec = attrs.spec;
        wrapper.data = attrs.data;
        wrapper.engine = attrs.engine;
        // Chart interactivity handlers
        wrapper.onPointSelection = attrs.onPointSelection;
        wrapper.onIntervalSelection = attrs.onIntervalSelection;
        this.wrapper = wrapper;
        this.resize = new resize_observer_1.SimpleResizeObserver(dom, () => {
            wrapper.onResize();
        });
    }
    onupdate({ attrs }) {
        if (this.wrapper) {
            this.wrapper.spec = attrs.spec;
            this.wrapper.data = attrs.data;
            this.wrapper.engine = attrs.engine;
        }
    }
    onremove() {
        if (this.resize) {
            this.resize[Symbol.dispose]();
            this.resize = undefined;
        }
        if (this.wrapper) {
            this.wrapper[Symbol.dispose]();
            this.wrapper = undefined;
        }
    }
    view(_) {
        return (0, mithril_1.default)('.pf-vega-view', (0, mithril_1.default)(''), this.wrapper?.status === Status.Loading &&
            (0, mithril_1.default)('.pf-vega-view-status', (0, mithril_1.default)(spinner_1.Spinner)), this.wrapper?.status === Status.Error &&
            (0, mithril_1.default)('.pf-vega-view-status', this.wrapper?.error ?? 'Error'));
    }
}
exports.VegaView = VegaView;
//# sourceMappingURL=vega_view.js.map