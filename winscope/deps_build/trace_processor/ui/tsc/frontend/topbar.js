"use strict";
// Copyright (C) 2018 The Android Open Source Project
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
exports.Topbar = void 0;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const popup_1 = require("../widgets/popup");
const logging_1 = require("../base/logging");
const omnibox_manager_1 = require("../core/omnibox_manager");
const app_impl_1 = require("../core/app_impl");
const classnames_1 = require("../base/classnames");
const button_1 = require("../widgets/button");
const router_1 = require("../core/router");
const common_1 = require("../widgets/common");
class TraceErrorIcon {
    tracePopupErrorDismissed = false;
    view({ attrs }) {
        const trace = attrs.trace;
        if (app_impl_1.AppImpl.instance.embeddedMode)
            return;
        const mode = app_impl_1.AppImpl.instance.omnibox.mode;
        const totErrors = trace.traceInfo.importErrors + trace.loadingErrors.length;
        if (totErrors === 0 || mode === omnibox_manager_1.OmniboxMode.Command) {
            return;
        }
        const message = Boolean(totErrors)
            ? `${totErrors} import or data loss errors detected.`
            : `Metric error detected.`;
        return (0, mithril_1.default)('.pf-topbar__error-box', (0, mithril_1.default)(popup_1.Popup, {
            trigger: (0, mithril_1.default)('span'),
            isOpen: !this.tracePopupErrorDismissed,
            position: popup_1.PopupPosition.Left,
            onChange: (shouldOpen) => {
                (0, logging_1.assertFalse)(shouldOpen);
                this.tracePopupErrorDismissed = true;
            },
        }, (0, mithril_1.default)('.pf-topbar__error-popup', 'Data-loss/import error. Click for more info.')), (0, mithril_1.default)(button_1.Button, {
            icon: 'announcement',
            title: message + ` Click for more info.`,
            intent: common_1.Intent.Danger,
            onclick: () => {
                // Navigate to the info page when the button is clicked.
                router_1.Router.navigate('#!/info');
            },
        }));
    }
}
class Topbar {
    view({ attrs }) {
        const { omnibox, trace } = attrs;
        return (0, mithril_1.default)('.pf-topbar', {
            className: (0, classnames_1.classNames)(!app_impl_1.AppImpl.instance.sidebar.visible && 'pf-topbar--hide-sidebar'),
        }, omnibox, trace && (0, mithril_1.default)(TraceErrorIcon, { trace }));
    }
}
exports.Topbar = Topbar;
//# sourceMappingURL=topbar.js.map