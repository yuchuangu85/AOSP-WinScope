"use strict";
// Copyright (C) 2021 The Android Open Source Project
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
const aggregation_adapter_1 = require("../../components/aggregation_adapter");
const query_flamegraph_1 = require("../../components/query_flamegraph");
const selection_1 = require("../../public/selection");
const track_kinds_1 = require("../../public/track_kinds");
const flamegraph_1 = require("../../widgets/flamegraph");
const counter_selection_aggregator_1 = require("./counter_selection_aggregator");
const pivot_table_tab_1 = require("./pivot_table_tab");
const slice_selection_aggregator_1 = require("./slice_selection_aggregator");
/**
 * This plugin adds the generic aggregations for slice tracks and counter
 * tracks.
 */
class default_1 {
    static id = 'dev.perfetto.GenericAggregations';
    async onTraceLoad(ctx) {
        ctx.selection.registerAreaSelectionTab((0, aggregation_adapter_1.createAggregationToTabAdaptor)(ctx, new counter_selection_aggregator_1.CounterSelectionAggregator()));
        ctx.selection.registerAreaSelectionTab((0, aggregation_adapter_1.createAggregationToTabAdaptor)(ctx, new slice_selection_aggregator_1.SliceSelectionAggregator()));
        ctx.selection.registerAreaSelectionTab(new pivot_table_tab_1.PivotTableTab(ctx));
        ctx.selection.registerAreaSelectionTab(createSliceFlameGraphPanel(ctx));
    }
}
exports.default = default_1;
function createSliceFlameGraphPanel(trace) {
    let previousSelection;
    let sliceFlamegraph;
    return {
        id: 'slice_flamegraph_selection',
        name: 'Slice Flamegraph',
        render(selection) {
            const selectionChanged = previousSelection === undefined ||
                !(0, selection_1.areaSelectionsEqual)(previousSelection, selection);
            previousSelection = selection;
            if (selectionChanged) {
                sliceFlamegraph = computeSliceFlamegraph(trace, selection);
            }
            if (sliceFlamegraph === undefined) {
                return undefined;
            }
            return { isLoading: false, content: sliceFlamegraph.render() };
        },
    };
}
function computeSliceFlamegraph(trace, currentSelection) {
    const trackIds = [];
    for (const trackInfo of currentSelection.tracks) {
        if (trackInfo?.tags?.kind !== track_kinds_1.SLICE_TRACK_KIND) {
            continue;
        }
        if (trackInfo.tags?.trackIds === undefined) {
            continue;
        }
        trackIds.push(...trackInfo.tags.trackIds);
    }
    if (trackIds.length === 0) {
        return undefined;
    }
    const metrics = (0, query_flamegraph_1.metricsFromTableOrSubquery)(`
      (
        select *
        from _viz_slice_ancestor_agg!((
          select s.id, s.dur
          from slice s
          left join slice t on t.parent_id = s.id
          where s.ts >= ${currentSelection.start}
            and s.ts <= ${currentSelection.end}
            and s.track_id in (${trackIds.join(',')})
            and t.id is null
        ))
      )
    `, [
        {
            name: 'Duration',
            unit: 'ns',
            columnName: 'self_dur',
        },
        {
            name: 'Samples',
            unit: '',
            columnName: 'self_count',
        },
    ], 'include perfetto module viz.slices;');
    return new query_flamegraph_1.QueryFlamegraph(trace, metrics, {
        state: flamegraph_1.Flamegraph.createDefaultState(metrics),
    });
}
//# sourceMappingURL=index.js.map