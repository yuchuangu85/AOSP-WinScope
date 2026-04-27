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
exports.Gate = exports.Passthrough = void 0;
exports.hasChildren = hasChildren;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
// Check if a mithril component vnode has children
function hasChildren({ children }) {
    return (Array.isArray(children) &&
        children.length > 0 &&
        children.some((value) => value));
}
// A component which simply passes through it's children.
// Can be used for having something to attach lifecycle hooks to without having
// to add an extra HTML element to the DOM.
exports.Passthrough = {
    view({ children }) {
        return children;
    },
};
// The gate component is a wrapper which can either be open or closed.
// - When open, children are rendered inside a div where display = contents.
// - When closed, children are rendered inside a div where display = none, and
//   children's view functions are not called.
//
// Use this component when we want to conditionally render certain children, but
// we want to retain their state, such as page and tab views.
class Gate {
    previousChildren;
    wasOpen;
    view({ attrs, children }) {
        return (0, mithril_1.default)('', {
            style: { display: attrs.open ? 'contents' : 'none' },
        }, this.renderChildren(attrs.open, children));
    }
    renderChildren(open, children) {
        // If the gate is open, pass the latest children through, otherwise pass the
        // cached children through. When Mithril sees the same children as in the
        // previous render cycle, it doesn't re-render those children. This is a
        // performance optimization, as children that are not visible typically
        // don't need to be re-rendered.
        //
        // Note: Render the children once more after the gate has been closed, which
        // allows out-of-tree elements like popups to close properly, as the
        // display: none doesn't apply to them.
        if (open || this.wasOpen) {
            this.previousChildren = children;
        }
        this.wasOpen = open;
        return this.previousChildren;
    }
}
exports.Gate = Gate;
//# sourceMappingURL=mithril_utils.js.map