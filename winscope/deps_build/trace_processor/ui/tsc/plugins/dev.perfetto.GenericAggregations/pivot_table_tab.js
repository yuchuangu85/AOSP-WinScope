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
exports.PivotTableTab = void 0;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const logging_1 = require("../../base/logging");
const semantic_icons_1 = require("../../base/semantic_icons");
const pivot_table_1 = require("../../components/widgets/sql/pivot_table/pivot_table");
const pivot_table_state_1 = require("../../components/widgets/sql/pivot_table/pivot_table_state");
const sql_table_registry_1 = require("../../components/widgets/sql/table/sql_table_registry");
const selection_1 = require("../../public/selection");
const track_kinds_1 = require("../../public/track_kinds");
const button_1 = require("../../widgets/button");
const extensions_1 = require("../../components/extensions");
class PivotTableTab {
    trace;
    id = 'pivot_table';
    name = 'Pivot Table';
    state;
    previousSelection;
    trackIds = [];
    constructor(trace) {
        this.trace = trace;
    }
    render(selection) {
        if (this.previousSelection === undefined ||
            !(0, selection_1.areaSelectionsEqual)(this.previousSelection, selection)) {
            this.previousSelection = selection;
            this.trackIds = selection.tracks
                .filter((track) => track.tags?.kind == track_kinds_1.SLICE_TRACK_KIND)
                .flatMap((track) => track.tags?.trackIds ?? []);
            this.getOrCreateState().filters.setFilters([
                {
                    op: (cols) => `${cols[0]} + ${cols[1]} > ${selection.start}`,
                    columns: ['ts', 'dur'],
                },
                { op: (cols) => `${cols[0]} < ${selection.end}`, columns: ['ts'] },
                {
                    op: (cols) => `${cols[0]} in (${this.trackIds.join(', ')})`,
                    columns: ['track_id'],
                },
            ]);
        }
        if (this.trackIds.length === 0)
            return undefined;
        const state = this.getOrCreateState();
        return {
            isLoading: state?.getData() === undefined,
            content: (0, mithril_1.default)(pivot_table_1.PivotTable, {
                state,
                extraRowButton: (node) => (0, mithril_1.default)(button_1.Button, {
                    icon: semantic_icons_1.Icons.GoTo,
                    onclick: () => {
                        extensions_1.extensions.addLegacySqlTableTab(this.trace, {
                            table: (0, logging_1.assertExists)((0, sql_table_registry_1.getSqlTableDescription)('slice')),
                            filters: [
                                ...(state?.filters.get() ?? []),
                                ...node.getFilters(),
                            ],
                        });
                    },
                }),
            }),
        };
    }
    getOrCreateState() {
        if (this.state !== undefined)
            return this.state;
        const sliceTable = (0, logging_1.assertExists)((0, sql_table_registry_1.getSqlTableDescription)('slice'));
        const name = (0, logging_1.assertExists)(sliceTable.columns.find((c) => c.column === 'name'));
        const dur = (0, logging_1.assertExists)(sliceTable.columns.find((c) => c.column === 'dur'));
        this.state = new pivot_table_state_1.PivotTableState({
            trace: this.trace,
            table: sliceTable,
            pivots: [name],
            aggregations: [
                {
                    column: dur,
                    op: 'sum',
                },
            ],
        });
        return this.state;
    }
}
exports.PivotTableTab = PivotTableTab;
//# sourceMappingURL=pivot_table_tab.js.map