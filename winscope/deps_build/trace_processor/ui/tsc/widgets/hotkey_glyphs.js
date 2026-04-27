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
exports.Keycap = exports.KeycapGlyph = exports.HotkeyGlyphs = void 0;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const hotkeys_1 = require("../base/hotkeys");
const icon_1 = require("./icon");
const common_1 = require("./common");
const classnames_1 = require("../base/classnames");
// Renders a hotkey as a series of little keycaps.
class HotkeyGlyphs {
    view({ attrs }) {
        const { hotkey, spoof, spacing } = attrs;
        const platform = spoof || (0, hotkeys_1.getPlatform)();
        const result = (0, hotkeys_1.parseHotkey)(hotkey);
        if (result) {
            const { key, modifier } = result;
            const hasMod = modifier.includes('Mod');
            const hasCtrl = modifier.includes('Ctrl');
            const hasAlt = modifier.includes('Alt');
            const hasShift = modifier.includes('Shift');
            return (0, mithril_1.default)('span.pf-hotkey', hasMod && (0, mithril_1.default)(Keycap, { spacing }, glyphForMod(platform)), hasCtrl && (0, mithril_1.default)(Keycap, { spacing }, glyphForCtrl(platform)), hasAlt && (0, mithril_1.default)(Keycap, { spacing }, glyphForAlt(platform)), hasShift && (0, mithril_1.default)(Keycap, { spacing }, glyphForShift()), (0, mithril_1.default)(Keycap, { spacing }, glyphForKey(key, platform)));
        }
        else {
            return (0, mithril_1.default)(Keycap, { spacing }, '???');
        }
    }
}
exports.HotkeyGlyphs = HotkeyGlyphs;
// Renders a single keycap.
class KeycapGlyph {
    view({ attrs }) {
        const { keyValue, spoof, spacing } = attrs;
        const platform = spoof || (0, hotkeys_1.getPlatform)();
        return (0, mithril_1.default)(Keycap, { spacing }, glyphForKey(keyValue, platform));
    }
}
exports.KeycapGlyph = KeycapGlyph;
class Keycap {
    view({ attrs, children }) {
        const { spacing = 'medium' } = attrs;
        return (0, mithril_1.default)('span.pf-keycap', { className: (0, classnames_1.classNames)((0, common_1.classForSpacing)(spacing)), ...attrs }, children);
    }
}
exports.Keycap = Keycap;
function glyphForKey(key, platform) {
    if (key === 'Enter') {
        return (0, mithril_1.default)(icon_1.Icon, { icon: 'keyboard_return' });
    }
    else if (key === 'ArrowUp') {
        return (0, mithril_1.default)(icon_1.Icon, { icon: 'arrow_upward' });
    }
    else if (key === 'ArrowDown') {
        return (0, mithril_1.default)(icon_1.Icon, { icon: 'arrow_downward' });
    }
    else if (key === 'Space') {
        return (0, mithril_1.default)(icon_1.Icon, { icon: 'space_bar' });
    }
    else if (key === 'Escape') {
        if (platform === 'Mac') {
            return 'esc';
        }
        else {
            return 'Esc';
        }
    }
    else {
        return key;
    }
}
function glyphForMod(platform) {
    if (platform === 'Mac') {
        return (0, mithril_1.default)(icon_1.Icon, { icon: 'keyboard_command_key' });
    }
    else {
        return 'Ctrl';
    }
}
function glyphForShift() {
    return (0, mithril_1.default)(icon_1.Icon, { icon: 'shift' });
}
function glyphForCtrl(platform) {
    if (platform === 'Mac') {
        return (0, mithril_1.default)(icon_1.Icon, { icon: 'keyboard_control_key' });
    }
    else {
        return 'Ctrl';
    }
}
function glyphForAlt(platform) {
    if (platform === 'Mac') {
        return (0, mithril_1.default)(icon_1.Icon, { icon: 'keyboard_option_key' });
    }
    else {
        return 'Alt';
    }
}
//# sourceMappingURL=hotkey_glyphs.js.map