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
exports.createFtraceTrack = createFtraceTrack;
const colorizer_1 = require("../../components/colorizer");
const dataset_slice_track_1 = require("../../components/tracks/dataset_slice_track");
const dataset_1 = require("../../trace_processor/dataset");
const query_result_1 = require("../../trace_processor/query_result");
const ftrace_details_panel_1 = require("./ftrace_details_panel");
const FTRACE_INSTANT_WIDTH_PX = 8;
function createFtraceTrack(trace, uri, cpu, store) {
    return new dataset_slice_track_1.DatasetSliceTrack({
        trace,
        uri,
        dataset: () => {
            // This dataset can change depending on the filter settings, so we pass a
            // function in here instead of a static dataset. This function is called
            // every render cycle by the track to see if the dataset has changed.
            const excludeList = store.state.excludeList;
            return new dataset_1.SourceDataset({
                src: `
          SELECT *
          FROM ftrace_event
          WHERE
            name NOT IN (${excludeList.map((x) => `'${x}'`).join(', ')})
        `,
                schema: {
                    id: query_result_1.NUM,
                    ts: query_result_1.LONG,
                    name: query_result_1.STR,
                    cpu: query_result_1.NUM,
                },
                filter: {
                    col: 'ucpu',
                    eq: cpu.ucpu,
                },
            });
        },
        colorizer: (row) => (0, colorizer_1.materialColorScheme)(row.name),
        instantStyle: {
            width: FTRACE_INSTANT_WIDTH_PX,
            render: (ctx, r) => ctx.fillRect(r.x, r.y, r.width, r.height),
        },
        forceTsRenderOrder: true,
        tooltip: (row) => row.row.name,
        detailsPanel: (row) => {
            return new ftrace_details_panel_1.FtraceEventDetailsPanel(trace, row);
        },
    });
}
//# sourceMappingURL=ftrace_track.js.map