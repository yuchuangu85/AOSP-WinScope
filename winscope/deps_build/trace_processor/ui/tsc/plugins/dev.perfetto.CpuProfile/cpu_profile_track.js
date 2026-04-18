"use strict";
// Copyright (C) 2024 The Android Open Source Project
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
exports.createCpuProfileTrack = createCpuProfileTrack;
const query_result_1 = require("../../trace_processor/query_result");
const cpu_profile_details_panel_1 = require("./cpu_profile_details_panel");
const dataset_slice_track_1 = require("../../components/tracks/dataset_slice_track");
const dataset_1 = require("../../trace_processor/dataset");
const time_1 = require("../../base/time");
const colorizer_1 = require("../../components/colorizer");
function createCpuProfileTrack(trace, uri, utid) {
    return new dataset_slice_track_1.DatasetSliceTrack({
        trace,
        uri,
        dataset: new dataset_1.SourceDataset({
            schema: {
                id: query_result_1.NUM,
                ts: query_result_1.LONG,
                callsite_id: query_result_1.NUM,
            },
            src: `cpu_profile_stack_sample`,
            filter: {
                col: 'utid',
                eq: utid,
            },
        }),
        sliceName: () => 'CPU Sample',
        colorizer: (row) => (0, colorizer_1.getColorForSample)(row.callsite_id),
        detailsPanel: (row) => {
            return new cpu_profile_details_panel_1.CpuProfileSampleFlamegraphDetailsPanel(trace, time_1.Time.fromRaw(row.ts), utid);
        },
    });
}
//# sourceMappingURL=cpu_profile_track.js.map