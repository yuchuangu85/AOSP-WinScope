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
exports.createScrollJankV3Track = createScrollJankV3Track;
const dataset_slice_track_1 = require("../../components/tracks/dataset_slice_track");
const jank_colors_1 = require("./jank_colors");
const colorizer_1 = require("../../components/colorizer");
const scroll_jank_v3_details_panel_1 = require("./scroll_jank_v3_details_panel");
const dataset_1 = require("../../trace_processor/dataset");
const query_result_1 = require("../../trace_processor/query_result");
const UNKNOWN_SLICE_NAME = 'Unknown';
const JANK_SLICE_NAME = ' Jank';
function createScrollJankV3Track(trace, uri) {
    return new dataset_slice_track_1.DatasetSliceTrack({
        trace,
        uri,
        dataset: new dataset_1.SourceDataset({
            schema: {
                id: query_result_1.NUM,
                ts: query_result_1.LONG,
                dur: query_result_1.LONG,
                name: query_result_1.STR,
            },
            src: `
        SELECT
          IIF(
            cause_of_jank IS NOT NULL,
            cause_of_jank || IIF(
              sub_cause_of_jank IS NOT NULL, "::" || sub_cause_of_jank, ""
              ), "${UNKNOWN_SLICE_NAME}") || "${JANK_SLICE_NAME}" AS name,
          id,
          ts,
          dur,
          event_latency_id
        FROM chrome_janky_frame_presentation_intervals
      `,
        }),
        colorizer: (row) => {
            let stage = row.name.substring(0, row.name.indexOf(JANK_SLICE_NAME));
            // Stage may include substage, in which case we use the substage for
            // color selection.
            const separator = '::';
            if (stage.indexOf(separator) != -1) {
                stage = stage.substring(stage.indexOf(separator) + separator.length);
            }
            if (stage == UNKNOWN_SLICE_NAME) {
                return jank_colors_1.JANK_COLOR;
            }
            else {
                return (0, colorizer_1.getColorForSlice)(stage);
            }
        },
        detailsPanel: (row) => new scroll_jank_v3_details_panel_1.ScrollJankV3DetailsPanel(trace, row.id),
    });
}
//# sourceMappingURL=scroll_jank_v3_track.js.map