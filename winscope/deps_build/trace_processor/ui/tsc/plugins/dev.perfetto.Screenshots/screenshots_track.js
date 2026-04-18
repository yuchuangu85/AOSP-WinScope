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
exports.createScreenshotsTrack = createScreenshotsTrack;
const dataset_slice_track_1 = require("../../components/tracks/dataset_slice_track");
const dataset_1 = require("../../trace_processor/dataset");
const query_result_1 = require("../../trace_processor/query_result");
const screenshot_panel_1 = require("./screenshot_panel");
function createScreenshotsTrack(trace, uri) {
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
            src: 'android_screenshots',
        }),
        detailsPanel: () => {
            return new screenshot_panel_1.ScreenshotDetailsPanel(trace.engine);
        },
    });
}
//# sourceMappingURL=screenshots_track.js.map