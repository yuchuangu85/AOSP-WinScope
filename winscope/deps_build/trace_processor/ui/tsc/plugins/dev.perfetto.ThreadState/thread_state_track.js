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
exports.createThreadStateTrack = createThreadStateTrack;
const colorizer_1 = require("../../components/colorizer");
const query_result_1 = require("../../trace_processor/query_result");
const thread_state_1 = require("../../components/sql_utils/thread_state");
const thread_state_details_panel_1 = require("./thread_state_details_panel");
const dataset_1 = require("../../trace_processor/dataset");
const dataset_slice_track_1 = require("../../components/tracks/dataset_slice_track");
function createThreadStateTrack(trace, uri, utid) {
    return new dataset_slice_track_1.DatasetSliceTrack({
        trace,
        uri,
        dataset: new dataset_1.SourceDataset({
            schema: {
                id: query_result_1.NUM,
                ts: query_result_1.LONG,
                dur: query_result_1.LONG,
                cpu: query_result_1.NUM_NULL,
                state: query_result_1.STR,
                io_wait: query_result_1.NUM_NULL,
                utid: query_result_1.NUM,
            },
            src: 'thread_state',
            filter: {
                col: 'utid',
                eq: utid,
            },
        }),
        // Make thread slice tracks a little shorter in height.
        sliceLayout: {
            sliceHeight: 12,
            titleSizePx: 10,
        },
        queryGenerator: (dataset) => {
            // We actually abuse the depth provider here just a little. Instead of
            // providing just a depth value, we also filter out non-sleeping/idle
            // slices. In effect, we're using this function as a little escape hatch
            // to override the query that's used for track rendering.
            //
            // The reason we don't just filter out sleeping/idle slices in the main
            // dataset is because we don't want to filter the dataset exposed via
            // getDataset(), we only want to filter them out at the rendering stage.
            //
            // The reason we don't want to render these slices is slightly nuanced.
            // Essentially, if we render all slices and zoom out, the vast majority of
            // the track is covered by sleeping slices, and the important
            // runnable/running/etc slices are no longer rendered (effectively
            // sleeping slices always 'win' on every bucket) so we lost the important
            // detail. We could get around this if we had some way to tell the
            // algorithm to prioritize some slices over others.
            return `
        select
          0 as depth,
          *
        from (${dataset.query()})
        where state not in ('S', 'I')
      `;
        },
        colorizer: (row) => {
            const title = getState(row);
            return (0, colorizer_1.colorForState)(title);
        },
        sliceName: (row) => {
            return getState(row);
        },
        detailsPanel: (row) => new thread_state_details_panel_1.ThreadStateDetailsPanel(trace, row.id),
        rootTableName: 'thread_state',
    });
}
function getState(row) {
    const ioWait = row.io_wait === null ? undefined : Boolean(row.io_wait);
    return (0, thread_state_1.translateState)(row.state, ioWait);
}
//# sourceMappingURL=thread_state_track.js.map