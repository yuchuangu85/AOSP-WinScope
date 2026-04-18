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
exports.createAggregationToTabAdaptor = createAggregationToTabAdaptor;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const aggregation_panel_1 = require("./aggregation_panel");
const selection_1 = require("../public/selection");
const selection_aggregation_manager_1 = require("./selection_aggregation_manager");
/**
 * Creates an adapter that adapts an old style aggregation to a new area
 * selection sub-tab.
 */
function createAggregationToTabAdaptor(trace, aggregator) {
    const schemaSpecificity = (aggregator.schema && Object.keys(aggregator.schema).length) ?? 0;
    const kindRating = aggregator.trackKind === undefined ? 0 : 100;
    const priority = kindRating + schemaSpecificity;
    const aggMan = new selection_aggregation_manager_1.SelectionAggregationManager(trace.engine, aggregator);
    let currentSelection;
    return {
        id: aggregator.id,
        name: aggregator.getTabName(),
        priority,
        render(selection) {
            if (currentSelection === undefined ||
                !(0, selection_1.areaSelectionsEqual)(selection, currentSelection)) {
                aggMan.aggregateArea(selection);
                currentSelection = selection;
            }
            const data = aggMan.aggregatedData;
            if (!data) {
                return undefined;
            }
            return {
                isLoading: false,
                content: (0, mithril_1.default)(aggregation_panel_1.AggregationPanel, {
                    data,
                    trace,
                    model: aggMan,
                }),
            };
        },
    };
}
//# sourceMappingURL=aggregation_adapter.js.map