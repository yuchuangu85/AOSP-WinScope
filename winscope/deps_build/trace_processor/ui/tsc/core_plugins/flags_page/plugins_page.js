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
exports.PluginsPage = void 0;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const classnames_1 = require("../../base/classnames");
const logging_1 = require("../../base/logging");
const utils_1 = require("../../base/utils");
const app_impl_1 = require("../../core/app_impl");
const button_1 = require("../../widgets/button");
const card_1 = require("../../widgets/card");
const chip_1 = require("../../widgets/chip");
const common_1 = require("../../widgets/common");
const menu_1 = require("../../widgets/menu");
const settings_page_1 = require("../../widgets/settings_page");
const switch_1 = require("../../widgets/switch");
var SortOrder;
(function (SortOrder) {
    SortOrder["Name"] = "name";
    SortOrder["Slowest"] = "slowest";
    SortOrder["Enabled"] = "enabled";
    SortOrder["Disabled"] = "disabled";
})(SortOrder || (SortOrder = {}));
let sortOrder = SortOrder.Name;
function sortPlugins(registeredPlugins) {
    switch (sortOrder) {
        case SortOrder.Slowest:
            return registeredPlugins.concat([]).sort((a, b) => {
                return ((b.traceContext?.loadTimeMs ?? -1) -
                    (a.traceContext?.loadTimeMs ?? -1));
            });
        case SortOrder.Name:
            return registeredPlugins;
        case SortOrder.Enabled:
            return registeredPlugins.concat([]).sort((a, b) => {
                return (b.enabled ? 1 : 0) - (a.enabled ? 1 : 0);
            });
        case SortOrder.Disabled:
            return registeredPlugins.concat([]).sort((a, b) => {
                return (a.enabled ? 1 : 0) - (b.enabled ? 1 : 0);
            });
        default:
            (0, logging_1.assertUnreachable)(sortOrder);
    }
}
function sortText(sortOrder) {
    switch (sortOrder) {
        case SortOrder.Slowest:
            return 'Startup time (slowest first)';
        case SortOrder.Name:
            return 'Name';
        case SortOrder.Enabled:
            return 'Enabled first';
        case SortOrder.Disabled:
            return 'Disabled first';
        default:
            (0, logging_1.assertUnreachable)(sortOrder);
    }
}
class PluginsPage {
    view() {
        const pluginManager = app_impl_1.AppImpl.instance.plugins;
        const registeredPlugins = pluginManager.getAllPlugins();
        const needsRestart = registeredPlugins.some((p) => {
            return p.enableFlag.get() !== p.enabled;
        });
        const anyNonDefaults = registeredPlugins.some((p) => {
            return p.enableFlag.isOverridden();
        });
        const sorted = sortPlugins(registeredPlugins);
        return (0, mithril_1.default)(settings_page_1.SettingsPage, {
            title: 'Plugins',
            stickyHeaderContent: (0, mithril_1.default)('.pf-plugins-page__topbar', (0, mithril_1.default)(button_1.ButtonBar, (0, mithril_1.default)(button_1.Button, {
                icon: 'restore',
                disabled: !anyNonDefaults,
                label: 'Restore Defaults',
                title: anyNonDefaults
                    ? 'Restore all plugins to their default enabled/disabled state'
                    : 'All plugins are in their default state',
                onclick: () => {
                    for (const plugin of registeredPlugins) {
                        plugin.enableFlag.reset();
                    }
                },
            }), needsRestart && reloadButton()), (0, mithril_1.default)(menu_1.PopupMenu, {
                trigger: (0, mithril_1.default)(button_1.Button, {
                    icon: 'sort',
                    label: `Sort by ${sortText(sortOrder)}`,
                }),
            }, Object.values(SortOrder).map((value) => {
                return (0, mithril_1.default)(menu_1.MenuItem, {
                    label: sortText(value),
                    active: sortOrder === value,
                    onclick: () => (sortOrder = value),
                });
            }))),
        }, (0, mithril_1.default)('.pf-plugins-page', (0, mithril_1.default)(card_1.CardList, sorted.map((plugin) => this.renderPluginCard(plugin)))));
    }
    renderPluginCard(plugin) {
        const loadTime = plugin.traceContext?.loadTimeMs;
        return (0, mithril_1.default)(card_1.Card, {
            borderless: true,
            className: (0, classnames_1.classNames)('pf-plugins-page__card', plugin.active && 'pf-plugins-page__card--active', plugin.enableFlag.get() && 'pf-plugins-page__card--enabled'),
            key: plugin.desc.id,
        }, (0, mithril_1.default)('.pf-plugins-page__details', (0, mithril_1.default)('h1', plugin.desc.id)), (0, mithril_1.default)('.pf-plugins-page__controls', 
        // plugin.enabled !== plugin.enableFlag.get() && reloadButton(),
        (0, utils_1.exists)(loadTime) &&
            (0, mithril_1.default)('span', (0, mithril_1.default)(chip_1.Chip, {
                className: 'pf-plugins-page__chip',
                label: `STARTUP ${loadTime.toFixed(1)} ms`,
            })), (0, mithril_1.default)(switch_1.Switch, {
            checked: plugin.enableFlag.get(),
            onchange: () => {
                if (plugin.enableFlag.isOverridden()) {
                    plugin.enableFlag.reset();
                }
                else {
                    plugin.enableFlag.set(!plugin.enableFlag.get());
                }
            },
        })));
    }
}
exports.PluginsPage = PluginsPage;
function reloadButton() {
    return (0, mithril_1.default)(button_1.Button, {
        icon: 'refresh',
        label: 'Reload required',
        intent: common_1.Intent.Primary,
        title: 'Click here to reload the page',
        onclick: () => location.reload(),
    });
}
//# sourceMappingURL=plugins_page.js.map