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
exports.createTopLevelScrollTrack = createTopLevelScrollTrack;
const dataset_slice_track_1 = require("../../components/tracks/dataset_slice_track");
const dataset_1 = require("../../trace_processor/dataset");
const query_result_1 = require("../../trace_processor/query_result");
const scroll_details_panel_1 = require("./scroll_details_panel");
function createTopLevelScrollTrack(trace, uri) {
    return new dataset_slice_track_1.DatasetSliceTrack({
        trace,
        uri,
        dataset: new dataset_1.SourceDataset({
            schema: {
                id: query_result_1.NUM,
                rawId: query_result_1.LONG,
                ts: query_result_1.LONG,
                dur: query_result_1.LONG,
                name: query_result_1.STR,
            },
            src: `
        SELECT
          ROW_NUMBER() OVER (ORDER BY ts) as id,
          id as rawId,
          printf("Scroll %s", CAST(id AS STRING)) AS name,
          ts,
          dur
        FROM chrome_scrolls
        -- If the scroll has started before the trace started, we won't have
        -- an id for it, so skip it to ensure that we can show the remaining
        -- traces.
        WHERE id IS NOT NULL
      `,
        }),
        detailsPanel: (row) => new scroll_details_panel_1.ScrollDetailsPanel(trace, row.rawId),
    });
}
//# sourceMappingURL=scroll_track.js.map