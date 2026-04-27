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
exports.Textarea = void 0;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const anchor_1 = require("../../../../widgets/anchor");
const semantic_icons_1 = require("../../../../base/semantic_icons");
class Textarea {
    attrs;
    _text;
    constructor(attrs) {
        this.attrs = attrs;
        this._text = this.setText(attrs.default); // re-assignment to make tsc happy.
    }
    setText(text) {
        this._text = text ?? '';
        return this._text;
    }
    get text() {
        return this._text;
    }
    serialize() {
        return this._text;
    }
    deserialize(state) {
        if (typeof state === 'string') {
            this._text = state;
        }
    }
    render() {
        return (0, mithril_1.default)('.textarea-holder', (0, mithril_1.default)('header', this.attrs.title, this.attrs.docsLink && [
            ' ',
            (0, mithril_1.default)(anchor_1.Anchor, { icon: semantic_icons_1.Icons.ExternalLink, href: this.attrs.docsLink }, 'Docs'),
        ]), (0, mithril_1.default)(`textarea.extra-input${this.attrs.cssClass ?? ''}`, {
            onchange: (e) => {
                this.setText(e.target.value);
                this.attrs.onChange?.(this._text);
            },
            disabled: this.attrs.disabled,
            placeholder: this.attrs.placeholder,
            value: this._text,
        }));
    }
}
exports.Textarea = Textarea;
//# sourceMappingURL=textarea.js.map