"use strict";
// Copyright (C) 2025 The Android Open Source Project
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
exports.SettingsPage = void 0;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const logging_1 = require("../base/logging");
class SettingsPage {
    observer;
    view(vnode) {
        const { title, stickyHeaderContent: headerContent, ...htmlAttrs } = vnode.attrs;
        return (0, mithril_1.default)('.pf-settings-page', htmlAttrs, (0, mithril_1.default)('.pf-settings-page__title', (0, mithril_1.default)('.pf-settings-page__centred', (0, mithril_1.default)('h1', title))), (0, mithril_1.default)('.pf-settings-page__header', (0, mithril_1.default)('.pf-settings-page__centred', headerContent)), (0, mithril_1.default)('.pf-settings-page__content', (0, mithril_1.default)('.pf-settings-page__centred', vnode.children)));
    }
    oncreate(vnode) {
        const canary = (0, logging_1.assertExists)(vnode.dom.querySelector('.pf-settings-page__title'));
        const header = (0, logging_1.assertExists)(vnode.dom.querySelector('.pf-settings-page__header'));
        this.observer = new IntersectionObserver(([entry]) => {
            header.classList.toggle('pf-settings-page__header--stuck', !entry.isIntersecting);
        }, { threshold: [0] });
        this.observer.observe(canary);
    }
    onremove() {
        this.observer?.disconnect();
    }
}
exports.SettingsPage = SettingsPage;
//# sourceMappingURL=settings_page.js.map