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
exports.JANKY_LATENCY_NAME = void 0;
exports.createEventLatencyTrack = createEventLatencyTrack;
const dataset_slice_track_1 = require("../../components/tracks/dataset_slice_track");
const jank_colors_1 = require("./jank_colors");
const event_latency_details_panel_1 = require("./event_latency_details_panel");
const dataset_1 = require("../../trace_processor/dataset");
const query_result_1 = require("../../trace_processor/query_result");
const colorizer_1 = require("../../components/colorizer");
exports.JANKY_LATENCY_NAME = 'Janky EventLatency';
function createEventLatencyTrack(trace, uri, baseTable) {
    return new dataset_slice_track_1.DatasetSliceTrack({
        trace,
        uri,
        dataset: new dataset_1.SourceDataset({
            schema: {
                id: query_result_1.NUM,
                ts: query_result_1.LONG,
                dur: query_result_1.LONG,
                name: query_result_1.STR,
                depth: query_result_1.NUM,
            },
            src: baseTable,
        }),
        colorizer: (row) => {
            return row.name === exports.JANKY_LATENCY_NAME
                ? jank_colors_1.JANK_COLOR
                : (0, colorizer_1.getColorForSlice)(row.name);
        },
        detailsPanel: (row) => new event_latency_details_panel_1.EventLatencySliceDetailsPanel(trace, row.id),
    });
}
//# sourceMappingURL=event_latency_track.js.map