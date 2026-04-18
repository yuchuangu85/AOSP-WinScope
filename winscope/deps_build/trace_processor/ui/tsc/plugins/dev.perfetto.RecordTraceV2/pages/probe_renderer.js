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
exports.Probe = void 0;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const assets_1 = require("../../../base/assets");
const utils_1 = require("../../../base/utils");
const docs_chip_1 = require("./widgets/docs_chip");
const classnames_1 = require("../../../base/classnames");
class Probe {
    view({ attrs }) {
        const onToggle = (enabled) => {
            attrs.cfgMgr.setProbeEnabled(attrs.probe.id, enabled);
        };
        const probe = attrs.probe;
        const forceEnabledDeps = attrs.cfgMgr.getProbeEnableDependants(attrs.probe.id);
        const enabled = attrs.cfgMgr.isProbeEnabled(attrs.probe.id);
        const compact = !(0, utils_1.exists)(probe.description) &&
            !(0, utils_1.exists)(probe.image) &&
            (probe.settings ?? []).length === 0;
        return (0, mithril_1.default)('.probe', {
            className: (0, classnames_1.classNames)(enabled && 'enabled', compact && 'compact'),
        }, probe.image &&
            (0, mithril_1.default)('img', {
                src: (0, assets_1.assetSrc)(`assets/${probe.image}`),
                onclick: () => onToggle(!enabled),
            }), (0, mithril_1.default)('label', (0, mithril_1.default)(`input[type=checkbox]`, {
            checked: enabled,
            disabled: forceEnabledDeps.length > 0,
            title: forceEnabledDeps.length > 0
                ? 'Force-enabled due to ' + forceEnabledDeps.join(',')
                : '',
            oninput: (e) => {
                onToggle(e.target.checked);
            },
        }), (0, mithril_1.default)('span', probe.title)), compact
            ? ''
            : (0, mithril_1.default)(`div${probe.image ? '' : '.extended-desc'}`, (0, mithril_1.default)('div', probe.description, probe.docsLink && (0, mithril_1.default)(docs_chip_1.DocsChip, { href: probe.docsLink })), (0, mithril_1.default)('.probe-config', Object.values(attrs.probe.settings ?? {}).map((widget) => widget.render()))));
    }
}
exports.Probe = Probe;
//# sourceMappingURL=probe_renderer.js.map