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
exports.POLL_INTERVAL_SLIDER = exports.Slider = void 0;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const logging_1 = require("../../../../base/logging");
const utils_1 = require("../../../../base/utils");
class Slider {
    attrs;
    _value;
    constructor(attrs) {
        this.attrs = attrs;
        (0, logging_1.assertTrue)(attrs.values.length > 0);
        this._value = this.setValue(undefined);
    }
    serialize() {
        return this._value;
    }
    deserialize(state) {
        if (typeof state === 'number') {
            this._value = state;
        }
    }
    get value() {
        return this._value;
    }
    setValue(value) {
        // Logic if value is null/undefined: try first the .default, if provided,
        // otherwise fall back on the first value of the fixed range... otherwise 0.
        this._value = (0, utils_1.exists)(value)
            ? value
            : this.attrs.default ?? this.attrs.values[0] ?? 0;
        return this._value;
    }
    onValueChange(newVal) {
        this._value = newVal;
        this.attrs.onChange?.(newVal);
    }
    onTimeValueChange(hms) {
        try {
            const date = new Date(`1970-01-01T${hms}.000Z`);
            if (isNaN(date.getTime()))
                return;
            this.onValueChange(date.getTime());
        }
        catch { }
    }
    onSliderChange(newIdx) {
        this.onValueChange(this.attrs.values[newIdx]);
    }
    render() {
        const attrs = this.attrs;
        const id = attrs.title.replace(/[^a-z0-9]/gim, '_').toLowerCase();
        const maxIdx = attrs.values.length - 1;
        const val = this._value;
        let min = attrs.min ?? 1;
        if (attrs.zeroIsDefault) {
            min = Math.min(0, min);
        }
        const description = attrs.description;
        const disabled = attrs.disabled;
        // Find the index of the closest value in the slider.
        let idx = 0;
        for (; idx < attrs.values.length && attrs.values[idx] < val; idx++) { }
        let spinnerCfg = {};
        if (attrs.isTime) {
            spinnerCfg = {
                type: 'text',
                pattern: '(0[0-9]|1[0-9]|2[0-3])(:[0-5][0-9]){2}', // hh:mm:ss
                value: new Date(val).toISOString().substring(11, 11 + 8),
                oninput: (e) => {
                    this.onTimeValueChange(e.target.value);
                },
            };
        }
        else {
            const isDefault = attrs.zeroIsDefault && val === 0;
            spinnerCfg = {
                type: 'number',
                value: isDefault ? '' : val,
                placeholder: isDefault ? '(default)' : '',
                oninput: (e) => {
                    this.onValueChange(+e.target.value);
                },
            };
        }
        return (0, mithril_1.default)('.slider' + (attrs.cssClass ?? ''), (0, mithril_1.default)('header', attrs.title), description ? (0, mithril_1.default)('header.descr', attrs.description) : '', attrs.icon !== undefined ? (0, mithril_1.default)('i.material-icons', attrs.icon) : [], (0, mithril_1.default)(`input[id="${id}"][type=range][min=0][max=${maxIdx}][value=${idx}]`, {
            disabled,
            oninput: (e) => {
                this.onSliderChange(+e.target.value);
            },
        }), (0, mithril_1.default)(`input.spinner[min=${min}][for=${id}]`, spinnerCfg), (0, mithril_1.default)('.unit', attrs.unit));
    }
}
exports.Slider = Slider;
exports.POLL_INTERVAL_SLIDER = {
    title: 'Poll interval',
    values: [250, 500, 1000, 2500, 5000, 30000, 60000],
    cssClass: '.thin',
    unit: 'ms',
};
//# sourceMappingURL=slider.js.map