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
const bigint_math_1 = require("../../base/bigint_math");
const math_utils_1 = require("../../base/math_utils");
const thread_slice_details_tab_1 = require("../../components/details/thread_slice_details_tab");
const dataset_slice_track_1 = require("../../components/tracks/dataset_slice_track");
const dataset_1 = require("../../trace_processor/dataset");
const query_result_1 = require("../../trace_processor/query_result");
function createTraceProcessorSliceTrack({ trace, uri, maxDepth, trackIds, detailsPanel, }) {
    return new dataset_slice_track_1.DatasetSliceTrack({
        trace,
        uri,
        dataset: new dataset_1.SourceDataset({
            schema: {
                id: query_result_1.NUM,
                ts: query_result_1.LONG,
                dur: query_result_1.LONG,
                name: query_result_1.STR_NULL,
                depth: query_result_1.NUM,
                thread_dur: query_result_1.LONG_NULL,
            },
            src: 'slice',
            filter: {
                col: 'track_id',
                in: trackIds,
            },
        }),
        sliceName: (row) => (row.name === null ? '[null]' : row.name),
        initialMaxDepth: maxDepth,
        rootTableName: 'slice',
        queryGenerator: getDepthProvider(trackIds),
        fillRatio: (row) => {
            if (row.dur > 0n && row.thread_dur !== null) {
                return (0, math_utils_1.clamp)(bigint_math_1.BigintMath.ratio(row.thread_dur, row.dur), 0, 1);
            }
            else {
                return 1;
            }
        },
        detailsPanel: detailsPanel
            ? (row) => detailsPanel(row)
            : () => new thread_slice_details_tab_1.ThreadSliceDetailsPanel(trace),
    });
}
function getDepthProvider(trackIds) {
    // If we have more than one track we basically just need to replace the query
    // used for rendering tracks with this one which uses
    // experimental_slice_layout. The reason we don't just put this query in the
    // dataset is that the dataset is shared with the outside world and we don't
    // want to force everyone else to use experimental_slice_track.
    // TODO(stevegolton): Let's teach internal_layout how to mimic this behaviour.
    if (trackIds.length > 1) {
        return () => `
      select
        id,
        ts,
        dur,
        layout_depth as depth,
        name,
        thread_dur
      from experimental_slice_layout
      where filter_track_ids = '${trackIds.join(',')}'
    `;
    }
    else {
        return undefined;
    }
}
//# sourceMappingURL=trace_processor_slice_track.js.map