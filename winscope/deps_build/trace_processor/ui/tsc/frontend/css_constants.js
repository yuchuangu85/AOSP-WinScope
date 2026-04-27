"use strict";
// Copyright (C) 2019 The Android Open Source Project
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
exports.COLOR_NEUTRAL = exports.COLOR_TEXT_MUTED = exports.COLOR_TEXT = exports.COLOR_BACKGROUND = exports.COLOR_ACCENT = exports.COLOR_BACKGROUND_SECONDARY = exports.COLOR_BORDER_SECONDARY = exports.COLOR_BORDER = exports.FONT_COMPACT = exports.DEFAULT_DETAILS_CONTENT_HEIGHT = exports.TRACK_SHELL_WIDTH = void 0;
exports.initCssConstants = initCssConstants;
// This code can be used in unittests where we can't read CSS variables.
// Also we cannot have global constructors because when the javascript is
// loaded, the CSS might not be ready yet.
exports.TRACK_SHELL_WIDTH = 100;
exports.DEFAULT_DETAILS_CONTENT_HEIGHT = 308;
exports.FONT_COMPACT = '"Roboto Condensed", sans-serif';
exports.COLOR_BORDER = 'hotpink';
exports.COLOR_BORDER_SECONDARY = 'hotpink';
exports.COLOR_BACKGROUND_SECONDARY = 'hotpink';
exports.COLOR_ACCENT = 'hotpink';
exports.COLOR_BACKGROUND = 'hotpink';
exports.COLOR_TEXT = 'hotpink';
exports.COLOR_TEXT_MUTED = 'hotpink';
exports.COLOR_NEUTRAL = 'hotpink';
function initCssConstants(element) {
    function getCssStr(prop) {
        if (typeof window === 'undefined')
            return undefined;
        const searchElement = element ?? window.document.body;
        const value = window.getComputedStyle(searchElement).getPropertyValue(prop);
        // Note: getPropertyValue() returns an empty string if not set
        // https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration/getPropertyValue#return_value
        return value === '' ? undefined : value;
    }
    function getCssNum(prop) {
        const str = getCssStr(prop);
        if (str === undefined)
            return undefined;
        const match = str.match(/^\W*(\d+)px(|\!important')$/);
        if (!match) {
            throw Error(`Could not parse CSS property "${str}" as a number`);
        }
        return Number(match[1]);
    }
    exports.TRACK_SHELL_WIDTH = getCssNum('--track-shell-width') ?? exports.TRACK_SHELL_WIDTH;
    exports.COLOR_BORDER = getCssStr('--pf-color-border') ?? exports.COLOR_BORDER;
    exports.COLOR_BORDER_SECONDARY =
        getCssStr('--pf-color-border-secondary') ?? exports.COLOR_BORDER_SECONDARY;
    exports.COLOR_BACKGROUND_SECONDARY =
        getCssStr('--pf-color-background-secondary') ?? exports.COLOR_BACKGROUND_SECONDARY;
    exports.COLOR_ACCENT = getCssStr('--pf-color-accent') ?? exports.COLOR_ACCENT;
    exports.DEFAULT_DETAILS_CONTENT_HEIGHT =
        getCssNum('--details-content-height') ?? exports.DEFAULT_DETAILS_CONTENT_HEIGHT;
    exports.COLOR_BACKGROUND = getCssStr('--pf-color-background') ?? exports.COLOR_BACKGROUND;
    exports.COLOR_TEXT = getCssStr('--pf-color-text') ?? exports.COLOR_TEXT;
    exports.FONT_COMPACT = getCssStr('--pf-font-compact') ?? exports.FONT_COMPACT;
    exports.COLOR_TEXT_MUTED = getCssStr('--pf-color-text-muted') ?? exports.COLOR_TEXT_MUTED;
    exports.COLOR_NEUTRAL = getCssStr('--pf-color-neutral') ?? exports.COLOR_NEUTRAL;
}
//# sourceMappingURL=css_constants.js.map