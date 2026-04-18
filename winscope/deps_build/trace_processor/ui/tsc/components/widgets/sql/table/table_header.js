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
exports.renderColumnIcon = renderColumnIcon;
exports.renderSortMenuItems = renderSortMenuItems;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const semantic_icons_1 = require("../../../../base/semantic_icons");
const menu_1 = require("../../../../widgets/menu");
function renderColumnIcon(sorted) {
    if (sorted === undefined)
        return semantic_icons_1.Icons.ContextMenu;
    if (sorted === 'ASC')
        return semantic_icons_1.Icons.SortedAsc;
    return semantic_icons_1.Icons.SortedDesc;
}
function renderSortMenuItems(sorted, sort) {
    return [
        sorted !== 'DESC' &&
            (0, mithril_1.default)(menu_1.MenuItem, {
                label: 'Sort: highest first',
                icon: semantic_icons_1.Icons.SortedDesc,
                onclick: () => sort('DESC'),
            }),
        sorted !== 'ASC' &&
            (0, mithril_1.default)(menu_1.MenuItem, {
                label: 'Sort: lowest first',
                icon: semantic_icons_1.Icons.SortedAsc,
                onclick: () => sort('ASC'),
            }),
        sorted !== undefined &&
            (0, mithril_1.default)(menu_1.MenuItem, {
                label: 'Unsort',
                icon: semantic_icons_1.Icons.Close,
                onclick: () => sort(undefined),
            }),
    ];
}
//# sourceMappingURL=table_header.js.map