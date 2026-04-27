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
exports.ButtonGroup = exports.ButtonBar = exports.Button = exports.ButtonVariant = void 0;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const classnames_1 = require("../base/classnames");
const common_1 = require("./common");
const icon_1 = require("./icon");
const popup_1 = require("./popup");
const spinner_1 = require("./spinner");
const logging_1 = require("../base/logging");
var ButtonVariant;
(function (ButtonVariant) {
    ButtonVariant["Filled"] = "Filled";
    ButtonVariant["Outlined"] = "Outlined";
    ButtonVariant["Minimal"] = "Minimal";
})(ButtonVariant || (exports.ButtonVariant = ButtonVariant = {}));
class Button {
    view({ attrs }) {
        const { icon, active, compact, rightIcon, className, dismissPopup, iconFilled, intent = common_1.Intent.None, variant = ButtonVariant.Minimal, rounded, shrink, ...htmlAttrs } = attrs;
        const label = 'label' in attrs ? attrs.label : undefined;
        const iconOnly = Boolean(icon && !label);
        const classes = (0, classnames_1.classNames)(active && 'pf-active', compact && 'pf-compact', classForVariant(variant), (0, common_1.classForIntent)(intent), iconOnly && 'pf-icon-only', dismissPopup && popup_1.Popup.DISMISS_POPUP_GROUP_CLASS, rounded && 'pf-button--rounded', shrink && 'pf-button--shrink', className);
        return (0, mithril_1.default)('button.pf-button', {
            ...htmlAttrs,
            className: classes,
        }, this.renderIcon(attrs), (0, mithril_1.default)('span', { className: 'pf-button__label' }, label), rightIcon &&
            (0, mithril_1.default)(icon_1.Icon, {
                className: 'pf-right-icon',
                icon: rightIcon,
                filled: iconFilled,
            }));
    }
    renderIcon(attrs) {
        const { icon, iconFilled } = attrs;
        const className = 'pf-left-icon';
        if (attrs.loading) {
            return (0, mithril_1.default)(spinner_1.Spinner, { className });
        }
        else if (icon) {
            return (0, mithril_1.default)(icon_1.Icon, { className, icon, filled: iconFilled });
        }
        else {
            return undefined;
        }
    }
}
exports.Button = Button;
function classForVariant(variant) {
    switch (variant) {
        case ButtonVariant.Filled:
            return 'pf-button--filled';
        case ButtonVariant.Outlined:
            return 'pf-button--outlined';
        case ButtonVariant.Minimal:
            return 'pf-button--minimal';
        default:
            (0, logging_1.assertUnreachable)(variant);
    }
}
/**
 * Space buttons out with a little gap between each one.
 */
class ButtonBar {
    view({ attrs, children }) {
        return (0, mithril_1.default)('.pf-button-bar', attrs, children);
    }
}
exports.ButtonBar = ButtonBar;
/**
 * A set of buttons that are visually grouped together into one super-widget.
 * The inside borders are de-duplicated, and the inside rounded corners removed.
 *
 * This is useful for when you have a set of radio buttons, or a button with an
 * additional dropdown button to allow for additional actions to be selected.
 *
 * Very similar to the SegmentedButtons widget, but offers more control over the
 * individual buttons.
 */
class ButtonGroup {
    view({ attrs, children }) {
        return (0, mithril_1.default)('.pf-button-group', attrs, children);
    }
}
exports.ButtonGroup = ButtonGroup;
//# sourceMappingURL=button.js.map