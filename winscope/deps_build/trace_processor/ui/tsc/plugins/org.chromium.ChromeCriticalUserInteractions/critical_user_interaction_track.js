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
exports.createCriticalUserInteractionTrack = createCriticalUserInteractionTrack;
const query_result_1 = require("../../trace_processor/query_result");
const dataset_slice_track_1 = require("../../components/tracks/dataset_slice_track");
const page_load_details_panel_1 = require("./page_load_details_panel");
const startup_details_panel_1 = require("./startup_details_panel");
const web_content_interaction_details_panel_1 = require("./web_content_interaction_details_panel");
const generic_slice_details_tab_1 = require("./generic_slice_details_tab");
const dataset_1 = require("../../trace_processor/dataset");
function createCriticalUserInteractionTrack(trace, uri) {
    return new dataset_slice_track_1.DatasetSliceTrack({
        trace,
        uri,
        dataset: new dataset_1.SourceDataset({
            schema: {
                id: query_result_1.NUM,
                ts: query_result_1.LONG,
                dur: query_result_1.LONG,
                name: query_result_1.STR,
                scopedId: query_result_1.NUM,
                type: query_result_1.STR,
            },
            // The scoped_id is not a unique identifier within the table; generate
            // a unique id from type and scoped_id on the fly to use for slice
            // selection.
            src: `
          SELECT
            hash(type, scoped_id) AS id,
            scoped_id AS scopedId,
            name,
            ts,
            dur,
            type
          FROM chrome_interactions
        `,
        }),
        detailsPanel: (row) => {
            switch (row.type) {
                case 'chrome_page_loads':
                    return new page_load_details_panel_1.PageLoadDetailsPanel(trace, row.id);
                case 'chrome_startups':
                    return new startup_details_panel_1.StartupDetailsPanel(trace, row.id);
                case 'chrome_web_content_interactions':
                    return new web_content_interaction_details_panel_1.WebContentInteractionPanel(trace, row.id);
                default:
                    return new generic_slice_details_tab_1.GenericSliceDetailsTab(trace, 'chrome_interactions', row.id, 'Chrome Interaction');
            }
        },
    });
}
//# sourceMappingURL=critical_user_interaction_track.js.map