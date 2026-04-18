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
exports.createScrollTimelineTrack = createScrollTimelineTrack;
const query_result_1 = require("../../trace_processor/query_result");
const jank_colors_1 = require("./jank_colors");
const colorizer_1 = require("../../components/colorizer");
const color_1 = require("../../base/color");
const scroll_timeline_details_panel_1 = require("./scroll_timeline_details_panel");
const scroll_timeline_model_1 = require("./scroll_timeline_model");
const dataset_slice_track_1 = require("../../components/tracks/dataset_slice_track");
const dataset_1 = require("../../trace_processor/dataset");
const INDIGO = (0, colorizer_1.makeColorScheme)(new color_1.HSLColor([231, 48, 48]));
const GRAY = (0, colorizer_1.makeColorScheme)(new color_1.HSLColor([0, 0, 62]));
const DARK_GREEN = (0, colorizer_1.makeColorScheme)(new color_1.HSLColor([120, 44, 34]));
const TEAL = (0, colorizer_1.makeColorScheme)(new color_1.HSLColor([187, 90, 42]));
function toColorScheme(classification) {
    switch (classification) {
        case scroll_timeline_model_1.ScrollUpdateClassification.DEFAULT:
            return INDIGO;
        case scroll_timeline_model_1.ScrollUpdateClassification.JANKY:
            return jank_colors_1.JANK_COLOR;
        case scroll_timeline_model_1.ScrollUpdateClassification.COALESCED:
            return GRAY;
        case scroll_timeline_model_1.ScrollUpdateClassification.FIRST_SCROLL_UPDATE_IN_FRAME:
            return DARK_GREEN;
        case scroll_timeline_model_1.ScrollUpdateClassification.INERTIAL:
            return TEAL;
        case scroll_timeline_model_1.ScrollUpdateClassification.STEP:
            return undefined;
    }
}
function createScrollTimelineTrack(trace, model) {
    return new dataset_slice_track_1.DatasetSliceTrack({
        trace,
        uri: model.trackUri,
        dataset: new dataset_1.SourceDataset({
            src: model.tableName,
            schema: {
                id: query_result_1.NUM,
                ts: query_result_1.LONG,
                dur: query_result_1.LONG,
                name: query_result_1.STR,
                classification: query_result_1.NUM,
                depth: query_result_1.NUM,
            },
        }),
        colorizer: (row) => {
            return toColorScheme(row.classification) ?? (0, colorizer_1.getColorForSlice)(row.name);
        },
        detailsPanel: (row) => {
            return new scroll_timeline_details_panel_1.ScrollTimelineDetailsPanel(trace, model, row.id);
        },
    });
}
//# sourceMappingURL=scroll_timeline_track.js.map