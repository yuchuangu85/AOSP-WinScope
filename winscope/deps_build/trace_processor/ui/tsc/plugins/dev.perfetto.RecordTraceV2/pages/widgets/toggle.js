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
exports.Toggle = void 0;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const switch_1 = require("../../../../widgets/switch");
class Toggle {
    attrs;
    _enabled;
    constructor(attrs) {
        this.attrs = attrs;
        this._enabled = this.setEnabled(undefined);
    }
    setEnabled(enabled) {
        this._enabled = enabled ?? this.attrs.default ?? false;
        return this._enabled;
    }
    get enabled() {
        return this._enabled;
    }
    serialize() {
        return this._enabled;
    }
    deserialize(state) {
        if (state === true || state === false) {
            this._enabled = state;
        }
    }
    render() {
        return (0, mithril_1.default)('.pf-toggle', { className: this.attrs.cssClass }, [
            (0, mithril_1.default)(switch_1.Switch, {
                className: 'pf-toggle__switch',
                checked: this._enabled,
                oninput: (e) => {
                    this.setEnabled(e.target.checked);
                    this.attrs.onChange?.(this._enabled);
                },
                label: this.attrs.title,
            }),
            (0, mithril_1.default)('.pf-toggle__desc', this.attrs.descr),
        ]);
        return (0, mithril_1.default)(`.toggle${this._enabled ? '.enabled' : ''}${this.attrs.cssClass ?? ''}`, (0, mithril_1.default)('label', (0, mithril_1.default)(`input[type=checkbox]`, {
            checked: this._enabled,
            oninput: (e) => {
                this.setEnabled(e.target.checked);
                this.attrs.onChange?.(this._enabled);
            },
        }), (0, mithril_1.default)('span', this.attrs.title)), (0, mithril_1.default)('.descr', this.attrs.descr));
    }
}
exports.Toggle = Toggle;
//# sourceMappingURL=toggle.js.map