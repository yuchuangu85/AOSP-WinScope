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
exports.HotkeyContext = void 0;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const hotkeys_1 = require("../base/hotkeys");
class HotkeyContext {
    hotkeys;
    view(vnode) {
        return vnode.children;
    }
    oncreate(vnode) {
        document.addEventListener('keydown', this.onKeyDown);
        this.hotkeys = vnode.attrs.hotkeys;
    }
    onupdate(vnode) {
        this.hotkeys = vnode.attrs.hotkeys;
    }
    onremove(_vnode) {
        document.removeEventListener('keydown', this.onKeyDown);
        this.hotkeys = undefined;
    }
    // Due to a bug in chrome, we get onKeyDown events fired where the payload is
    // not a KeyboardEvent when selecting an item from an autocomplete suggestion.
    // See https://issues.chromium.org/issues/41425904
    // Thus, we can't assume we get an KeyboardEvent and must check manually.
    onKeyDown = (e) => {
        // Find out whether the event has already been handled further up the chain.
        if (e.defaultPrevented)
            return;
        if (e instanceof KeyboardEvent) {
            this.hotkeys?.forEach(({ callback, hotkey }) => {
                if ((0, hotkeys_1.checkHotkey)(hotkey, e)) {
                    e.preventDefault();
                    callback();
                    mithril_1.default.redraw();
                }
            });
        }
    };
}
exports.HotkeyContext = HotkeyContext;
//# sourceMappingURL=hotkey_context.js.map