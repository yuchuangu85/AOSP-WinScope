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
exports.Anchor = void 0;
exports.linkify = linkify;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const icon_1 = require("./icon");
class Anchor {
    view({ attrs, children }) {
        const { icon, ...htmlAttrs } = attrs;
        return (0, mithril_1.default)('a.pf-anchor', htmlAttrs, children, icon && (0, mithril_1.default)(icon_1.Icon, { icon }));
    }
}
exports.Anchor = Anchor;
/**
 * Converts a string input in a <span>, extracts URLs and converts them into
 * clickable links.
 * @param text the input string, e.g., "See https://example.org for details".
 * @returns a Mithril vnode, e.g.
 *    <span>See <a href="https://example.org">example.org<a> for more details.
 */
function linkify(text) {
    const urlPattern = /(https?:\/\/[^\s]+)|(go\/[^\s]+)/g;
    const parts = text.split(urlPattern);
    return (0, mithril_1.default)('span', parts.map((part) => {
        if (/^(https?:\/\/[^\s]+)$/.test(part)) {
            return (0, mithril_1.default)(Anchor, { href: part, target: '_blank' }, part.split('://')[1]);
        }
        else if (/^(go\/[^\s]+)$/.test(part)) {
            return (0, mithril_1.default)(Anchor, { href: `http://${part}`, target: '_blank' }, part);
        }
        else {
            return part;
        }
    }));
}
//# sourceMappingURL=anchor.js.map