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
exports.savedConfigsPage = savedConfigsPage;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const logging_1 = require("../../../base/logging");
const config_sharing_1 = require("../config/config_sharing");
function savedConfigsPage(recMgr) {
    const savedConfigs = new Array();
    return {
        kind: 'GLOBAL_PAGE',
        id: 'configs',
        icon: 'save',
        title: 'Saved configs',
        subtitle: 'Save, restore and export configs',
        render() {
            return (0, mithril_1.default)(SavedConfigsPage, { recMgr, savedConfigs });
        },
        serialize(state) {
            state.savedSessions = [...savedConfigs];
        },
        deserialize(state) {
            savedConfigs.splice(0);
            savedConfigs.push(...state.savedSessions);
        },
    };
}
class SavedConfigsPage {
    newConfigName = '';
    recMgr;
    savedConfigs;
    constructor({ attrs }) {
        this.recMgr = attrs.recMgr;
        this.savedConfigs = attrs.savedConfigs;
    }
    view() {
        const canSave = this.newConfigName.length > 0 &&
            this.savedConfigs.every((s) => s.name !== this.newConfigName);
        return [
            (0, mithril_1.default)('header', 'Save and load configurations'),
            (0, mithril_1.default)('.input-config', [
                (0, mithril_1.default)('input', {
                    value: this.newConfigName,
                    placeholder: 'Title for config',
                    oninput: (e) => {
                        this.newConfigName = e.target.value;
                    },
                }),
                (0, mithril_1.default)('button', {
                    class: 'config-button',
                    disabled: !canSave,
                    title: canSave
                        ? 'Save current config'
                        : 'Duplicate name, saving disabled',
                    onclick: () => {
                        this.savedConfigs.push({
                            name: this.newConfigName,
                            config: this.recMgr.serializeSession(),
                        });
                        this.newConfigName = '';
                    },
                }, (0, mithril_1.default)('i.material-icons', 'save')),
            ]),
            this.savedConfigs.map((s) => this.renderSavedSessions(s)),
        ];
    }
    renderSavedSessions(item) {
        const self = this;
        return (0, mithril_1.default)('.config', [
            (0, mithril_1.default)('span.title-config', item.name),
            (0, mithril_1.default)('button', {
                class: 'config-button',
                title: 'Apply configuration settings',
                onclick: () => {
                    this.recMgr.loadSession(item.config);
                },
            }, (0, mithril_1.default)('i.material-icons', 'file_upload')),
            (0, mithril_1.default)('button', {
                class: 'config-button',
                title: 'Overwrite configuration with current settings',
                onclick: () => {
                    const msg = `Overwrite config "${item.name}" with current settings?`;
                    if (!confirm(msg))
                        return;
                    const savedCfg = (0, logging_1.assertExists)(this.savedConfigs.find((s) => s.name === item.name));
                    savedCfg.config = this.recMgr.serializeSession();
                },
            }, (0, mithril_1.default)('i.material-icons', 'save')),
            (0, mithril_1.default)('button', {
                class: 'config-button',
                title: 'Generate a shareable URL for the saved config',
                onclick: () => (0, config_sharing_1.shareRecordConfig)(item.config),
            }, (0, mithril_1.default)('i.material-icons', 'share')),
            (0, mithril_1.default)('button', {
                class: 'config-button',
                title: 'Remove configuration',
                onclick: () => {
                    const idx = this.savedConfigs.findIndex((s) => s.name === item.name);
                    if (idx < 0)
                        return;
                    self.savedConfigs.splice(idx, 1);
                },
            }, (0, mithril_1.default)('i.material-icons', 'delete')),
        ]);
    }
}
//# sourceMappingURL=saved_configs.js.map