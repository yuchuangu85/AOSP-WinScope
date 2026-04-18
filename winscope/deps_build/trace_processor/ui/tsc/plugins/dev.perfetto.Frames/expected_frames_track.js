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
exports.createExpectedFramesTrack = createExpectedFramesTrack;
const color_1 = require("../../base/color");
const colorizer_1 = require("../../components/colorizer");
const dataset_1 = require("../../trace_processor/dataset");
const query_result_1 = require("../../trace_processor/query_result");
const dataset_slice_track_1 = require("../../components/tracks/dataset_slice_track");
const thread_slice_details_tab_1 = require("../../components/details/thread_slice_details_tab");
const GREEN = (0, colorizer_1.makeColorScheme)(new color_1.HSLColor('#4CAF50')); // Green 500
function createExpectedFramesTrack(trace, uri, maxDepth, trackIds) {
    return new dataset_slice_track_1.DatasetSliceTrack({
        trace,
        uri,
        initialMaxDepth: maxDepth,
        rootTableName: 'slice',
        dataset: new dataset_1.SourceDataset({
            src: 'expected_frame_timeline_slice',
            schema: {
                ts: query_result_1.LONG,
                dur: query_result_1.LONG,
                name: query_result_1.STR,
                id: query_result_1.NUM,
            },
            filter: {
                col: 'track_id',
                in: trackIds,
            },
        }),
        colorizer: () => GREEN,
        detailsPanel: () => new thread_slice_details_tab_1.ThreadSliceDetailsPanel(trace),
    });
}
//# sourceMappingURL=expected_frames_track.js.map