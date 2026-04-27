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
exports.createTraceProcessorSliceTrack = createTraceProcessorSliceTrack;
const tslib_1 = require("tslib");
const bigint_math_1 = require("../../base/bigint_math");
const logging_1 = require("../../base/logging");
const math_utils_1 = require("../../base/math_utils");
const utils_1 = require("../../base/utils");
const colorizer_1 = require("../../components/colorizer");
const thread_slice_details_tab_1 = require("../../components/details/thread_slice_details_tab");
const dataset_slice_track_1 = require("../../components/tracks/dataset_slice_track");
const dataset_1 = require("../../trace_processor/dataset");
const query_result_1 = require("../../trace_processor/query_result");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const schema = {
    id: query_result_1.NUM,
    ts: query_result_1.LONG,
    dur: query_result_1.LONG,
    name: query_result_1.STR_NULL,
    depth: query_result_1.NUM,
    thread_dur: query_result_1.LONG_NULL,
    category: query_result_1.STR_NULL,
    correlation_id: query_result_1.STR_NULL,
    arg_set_id: query_result_1.NUM_NULL,
};
async function createTraceProcessorSliceTrack({ trace, uri, maxDepth, trackIds, detailsPanel, }) {
    return new dataset_slice_track_1.DatasetSliceTrack({
        trace,
        uri,
        dataset: await getDataset(trace.engine, trackIds),
        sliceName: (row) => (row.name === null ? '[null]' : row.name),
        initialMaxDepth: maxDepth,
        rootTableName: 'slice',
        fillRatio: (row) => {
            if (row.dur > 0n && row.thread_dur !== null) {
                return (0, math_utils_1.clamp)(bigint_math_1.BigintMath.ratio(row.thread_dur, row.dur), 0, 1);
            }
            else {
                return 1;
            }
        },
        tooltip: (slice) => {
            return (0, dataset_slice_track_1.renderTooltip)(trace, slice, {
                title: slice.title,
                extras: (0, utils_1.exists)(slice.row.category) && (0, mithril_1.default)('', 'Category: ', slice.row.category),
            });
        },
        detailsPanel: detailsPanel
            ? (row) => detailsPanel(row)
            : () => new thread_slice_details_tab_1.ThreadSliceDetailsPanel(trace),
        colorizer: (row) => {
            if (row.correlation_id) {
                return (0, colorizer_1.getColorForSlice)(row.correlation_id, {
                    stripTrailingDigits: false,
                });
            }
            if (row.name) {
                return (0, colorizer_1.getColorForSlice)(row.name);
            }
            return (0, colorizer_1.getColorForSlice)(`${row.id}`);
        },
    });
}
async function getDataset(engine, trackIds) {
    (0, logging_1.assertTrue)(trackIds.length > 0);
    if (trackIds.length === 1) {
        return new dataset_1.SourceDataset({
            schema,
            src: `
        select
          slice.id,
          ts,
          dur,
          depth,
          name,
          thread_dur,
          track_id,
          category,
          extract_arg(arg_set_id, 'correlation_id') as correlation_id,
          arg_set_id
        from slice
      `,
            filter: {
                col: 'track_id',
                in: trackIds,
            },
        });
    }
    else {
        // If we have more than one trackId, we must use experimental_slice_layout
        // to work out the depths. However, just using this as the dataset can be
        // extremely slow. So we cache the depths up front in a new table for this
        // track.
        const tableName = `__async_slice_depth_${trackIds[0]}`;
        await engine.query(`
      create perfetto table ${tableName} as
      select
        id,
        layout_depth as depth
      from experimental_slice_layout('${trackIds.join(',')}')
    `);
        // The (inner) join acts as a filter as well as providing the depth.
        return new dataset_1.SourceDataset({
            schema,
            src: `
        select
          slice.id,
          ts,
          dur,
          d.depth as depth,
          name,
          thread_dur,
          track_id,
          category,
          extract_arg(arg_set_id, 'correlation_id') as correlation_id,
          arg_set_id
        from slice
        join ${tableName} d using (id)
      `,
        });
    }
}
//# sourceMappingURL=trace_processor_slice_track.js.map