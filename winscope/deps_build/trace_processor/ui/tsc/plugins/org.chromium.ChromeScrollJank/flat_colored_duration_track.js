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
exports.createFlatColoredDurationTrack = createFlatColoredDurationTrack;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const color_1 = require("../../base/color");
const math_utils_1 = require("../../base/math_utils");
const colorizer_1 = require("../../components/colorizer");
const section_1 = require("../../widgets/section");
const tree_1 = require("../../widgets/tree");
const duration_1 = require("../../components/widgets/duration");
const timestamp_1 = require("../../components/widgets/timestamp");
const query_result_1 = require("../../trace_processor/query_result");
const dataset_1 = require("../../trace_processor/dataset");
const dataset_slice_track_1 = require("../../components/tracks/dataset_slice_track");
const time_1 = require("../../base/time");
/*
  This is a custom track which displays the intervals between uniform events
  and colors the durations based on the duration of the interval, focusing
  on the [4ms, 32ms] range.
*/
function createFlatColoredDurationTrack(trace, uri, sqlSrc) {
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
            src: `
        SELECT
          id,
          ts,
          dur,
          printf('%.3fms', dur / 1e6) AS name,
          0 as depth
        FROM (${sqlSrc})
      `,
        }),
        colorizer: (row) => {
            // Use the log2 of the duration in ms as the value, as we want to focus on
            // differentiating between 4ms, 8ms, 16ms and 32ms values.
            const rawValue = Math.log2(Math.max(Number(row.dur) / 1e6, 1));
            // Normalise this to [0, 5] range.
            const value = (0, math_utils_1.clamp)(rawValue, 1, 6) - 1;
            // 60 offset in hue forces the colors to be visually distinct.
            return (0, colorizer_1.makeColorScheme)(new color_1.HSLColor([60 * value, 80, 70]));
        },
        detailsPanel: (row) => {
            return {
                render() {
                    return (0, mithril_1.default)(section_1.Section, { title: 'Details' }, (0, mithril_1.default)(tree_1.Tree, (0, mithril_1.default)(tree_1.TreeNode, {
                        left: 'ID',
                        right: row.id,
                    }), (0, mithril_1.default)(tree_1.TreeNode, {
                        left: 'Timestamp',
                        right: (0, mithril_1.default)(timestamp_1.Timestamp, { ts: time_1.Time.fromRaw(row.ts) }),
                    }), (0, mithril_1.default)(tree_1.TreeNode, {
                        left: 'Duration',
                        right: (0, mithril_1.default)(duration_1.DurationWidget, { dur: row.dur }),
                    })));
                },
            };
        },
    });
}
//# sourceMappingURL=flat_colored_duration_track.js.map