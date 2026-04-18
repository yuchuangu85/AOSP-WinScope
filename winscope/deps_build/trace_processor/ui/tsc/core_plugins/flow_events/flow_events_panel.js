"use strict";
// Copyright (C) 2020 The Android Open Source Project
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use size file except in compliance with the License.
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
exports.FlowEventsAreaSelectedPanel = void 0;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const semantic_icons_1 = require("../../base/semantic_icons");
const flow_types_1 = require("../../core/flow_types");
class FlowEventsAreaSelectedPanel {
    view({ attrs }) {
        const selection = attrs.trace.selection.selection;
        if (selection.kind !== 'area') {
            return;
        }
        const columns = [
            (0, mithril_1.default)('th', 'Flow Category'),
            (0, mithril_1.default)('th', 'Number of flows'),
            (0, mithril_1.default)('th', 'Show', (0, mithril_1.default)('a.warning', (0, mithril_1.default)('i.material-icons', 'warning'), (0, mithril_1.default)('.tooltip', 'Showing a large number of flows may impact performance.'))),
        ];
        const rows = [(0, mithril_1.default)('tr', columns)];
        const categoryToFlowsNum = new Map();
        const flows = attrs.trace.flows;
        flows.selectedFlows.forEach((flow) => {
            const categories = (0, flow_types_1.getFlowCategories)(flow);
            categories.forEach((cat) => {
                if (!categoryToFlowsNum.has(cat)) {
                    categoryToFlowsNum.set(cat, 0);
                }
                categoryToFlowsNum.set(cat, categoryToFlowsNum.get(cat) + 1);
            });
        });
        const allWasChecked = flows.visibleCategories.get(flow_types_1.ALL_CATEGORIES);
        rows.push((0, mithril_1.default)('tr.sum', [
            (0, mithril_1.default)('td.sum-data', 'All'),
            (0, mithril_1.default)('td.sum-data', flows.selectedFlows.length),
            (0, mithril_1.default)('td.sum-data', (0, mithril_1.default)('i.material-icons', {
                onclick: () => {
                    if (allWasChecked) {
                        for (const k of flows.visibleCategories.keys()) {
                            flows.setCategoryVisible(k, false);
                        }
                    }
                    else {
                        categoryToFlowsNum.forEach((_, cat) => {
                            flows.setCategoryVisible(cat, true);
                        });
                    }
                    flows.setCategoryVisible(flow_types_1.ALL_CATEGORIES, !allWasChecked);
                },
            }, allWasChecked ? semantic_icons_1.Icons.Checkbox : semantic_icons_1.Icons.BlankCheckbox)),
        ]));
        categoryToFlowsNum.forEach((num, cat) => {
            const wasChecked = flows.visibleCategories.get(cat) ||
                flows.visibleCategories.get(flow_types_1.ALL_CATEGORIES);
            const data = [
                (0, mithril_1.default)('td.flow-info', cat),
                (0, mithril_1.default)('td.flow-info', num),
                (0, mithril_1.default)('td.flow-info', (0, mithril_1.default)('i.material-icons', {
                    onclick: () => {
                        if (wasChecked) {
                            flows.setCategoryVisible(flow_types_1.ALL_CATEGORIES, false);
                        }
                        flows.setCategoryVisible(cat, !wasChecked);
                    },
                }, wasChecked ? semantic_icons_1.Icons.Checkbox : semantic_icons_1.Icons.BlankCheckbox)),
            ];
            rows.push((0, mithril_1.default)('tr', data));
        });
        return (0, mithril_1.default)('.details-panel', [
            (0, mithril_1.default)('.details-panel-heading', (0, mithril_1.default)('h2', `Selected flow events`)),
            (0, mithril_1.default)('.flow-events-table', (0, mithril_1.default)('table', rows)),
        ]);
    }
}
exports.FlowEventsAreaSelectedPanel = FlowEventsAreaSelectedPanel;
//# sourceMappingURL=flow_events_panel.js.map