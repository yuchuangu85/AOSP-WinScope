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
const classnames_1 = require("../../../base/classnames");
const anchor_1 = require("../../../widgets/anchor");
const semantic_icons_1 = require("../../../base/semantic_icons");
const switch_1 = require("../../../widgets/switch");
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
        return (0, mithril_1.default)('.pf-probe', {
            className: (0, classnames_1.classNames)(enabled && 'enabled', compact && 'compact'),
        }, probe.image &&
            (0, mithril_1.default)('img', {
                src: (0, assets_1.assetSrc)(`assets/${probe.image}`),
                onclick: () => onToggle(!enabled),
            }), (0, mithril_1.default)(switch_1.Switch, {
            className: 'pf-probe__switch',
            checked: enabled,
            disabled: forceEnabledDeps.length > 0,
            title: forceEnabledDeps.length > 0
                ? 'Force-enabled due to ' + forceEnabledDeps.join(',')
                : '',
            oninput: (e) => {
                onToggle(e.target.checked);
            },
            label: probe.title,
        }), compact
            ? ''
            : (0, mithril_1.default)(`div${probe.image ? '' : '.extended-desc'}`, probe.description &&
                (0, mithril_1.default)('.pf-probe__descr', formatDescription(probe.description), probe.docsLink &&
                    (0, mithril_1.default)(anchor_1.Anchor, { icon: semantic_icons_1.Icons.ExternalLink, href: probe.docsLink }, 'Docs')), (0, mithril_1.default)('.probe-config', Object.values(attrs.probe.settings ?? {}).map((widget) => widget.render()))));
    }
}
exports.Probe = Probe;
/** Formats the probe.description turning ``` blocks into code snippets */
function formatDescription(input) {
    if (input === undefined)
        return [];
    const result = [];
    const regex = /```(.*?)```/gs;
    let lastIndex = 0;
    for (const match of input.matchAll(regex)) {
        const [fullMatch, codeContent] = match;
        const matchStart = match.index ?? 0;
        // Add preceding plain text
        if (matchStart > lastIndex) {
            const text = input.slice(lastIndex, matchStart);
            result.push((0, mithril_1.default)('div', text));
        }
        // Add code block
        result.push((0, mithril_1.default)('code', codeContent));
        lastIndex = matchStart + fullMatch.length;
    }
    // Add remaining text after last match
    if (lastIndex < input.length) {
        result.push((0, mithril_1.default)('div', input.slice(lastIndex)));
    }
    return result;
}
//# sourceMappingURL=probe_renderer.js.map