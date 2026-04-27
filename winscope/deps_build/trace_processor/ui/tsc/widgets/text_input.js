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
exports.TextInput = void 0;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const icon_1 = require("./icon"); // Import Icon component
class TextInput {
    oncreate(vnode) {
        if (vnode.attrs.autofocus) {
            // Focus the actual input element inside the wrapper
            const inputElement = vnode.dom.querySelector('input');
            if (inputElement) {
                inputElement.focus();
            }
        }
    }
    view({ attrs }) {
        const { leftIcon, className, ...inputAttrs } = attrs; // Destructure icon from other attrs
        return (0, mithril_1.default)('.pf-text-input', // Add a wrapper div
        {
            className,
        }, leftIcon &&
            (0, mithril_1.default)(icon_1.Icon, { icon: leftIcon, className: 'pf-text-input__left-icon' }), // Conditionally render icon
        (0, mithril_1.default)('input.pf-text-input__input', {
            ...inputAttrs, // Pass remaining attrs to the input
        }));
    }
}
exports.TextInput = TextInput;
//# sourceMappingURL=text_input.js.map