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
exports.TypedMultiselect = void 0;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const multiselect_1 = require("../../../../widgets/multiselect");
class TypedMultiselect {
    attrs;
    _selectedKeys = new Set();
    constructor(attrs) {
        this.attrs = attrs;
    }
    setEnabled(key, enabled) {
        if (enabled) {
            this._selectedKeys.add(key);
        }
        else {
            this._selectedKeys.delete(key);
        }
    }
    selectedKeys() {
        return Array.from(this._selectedKeys);
    }
    selectedValues() {
        const values = [];
        for (const [key, value] of this.attrs.options.entries()) {
            if (this._selectedKeys.has(key)) {
                values.push(value);
            }
        }
        return values;
    }
    serialize() {
        return Array.from(this._selectedKeys);
    }
    deserialize(state) {
        if (Array.isArray(state) && state.every((x) => typeof x === 'string')) {
            this._selectedKeys.clear();
            for (const key of state) {
                this.attrs.options.has(key) && this._selectedKeys.add(key);
            }
        }
    }
    render() {
        return [
            this.attrs.title && (0, mithril_1.default)('header', this.attrs.title),
            (0, mithril_1.default)(multiselect_1.MultiSelect, {
                fixedSize: true,
                options: Array.from(this.attrs.options.keys()).map((key) => ({
                    id: key,
                    name: key,
                    checked: this._selectedKeys.has(key),
                })),
                onChange: (diffs) => {
                    for (const diff of diffs) {
                        this.setEnabled(diff.id, diff.checked);
                    }
                    this.attrs.onChange?.(Array.from(this._selectedKeys.values()));
                },
            }),
        ];
    }
}
exports.TypedMultiselect = TypedMultiselect;
//# sourceMappingURL=multiselect.js.map