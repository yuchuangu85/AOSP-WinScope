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
exports.createAndroidLogTrack = createAndroidLogTrack;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const query_result_1 = require("../../trace_processor/query_result");
const dataset_slice_track_1 = require("../../components/tracks/dataset_slice_track");
const dataset_1 = require("../../trace_processor/dataset");
const colorizer_1 = require("../../components/colorizer");
const color_1 = require("../../base/color");
const section_1 = require("../../widgets/section");
const tree_1 = require("../../widgets/tree");
const timestamp_1 = require("../../components/widgets/timestamp");
const time_1 = require("../../base/time");
const details_shell_1 = require("../../widgets/details_shell");
const grid_layout_1 = require("../../widgets/grid_layout");
const spinner_1 = require("../../widgets/spinner");
const DEPTH_TO_COLOR = [
    (0, colorizer_1.makeColorScheme)(new color_1.HSLColor({ h: 122, s: 39, l: 49 })),
    (0, colorizer_1.makeColorScheme)(new color_1.HSLColor({ h: 0, s: 0, l: 70 })),
    (0, colorizer_1.makeColorScheme)(new color_1.HSLColor({ h: 45, s: 100, l: 51 })),
    (0, colorizer_1.makeColorScheme)(new color_1.HSLColor({ h: 4, s: 90, l: 58 })),
    (0, colorizer_1.makeColorScheme)(new color_1.HSLColor({ h: 291, s: 64, l: 42 })),
];
const EVT_PX = 6; // Width of an event tick in pixels.
function createAndroidLogTrack(trace, uri) {
    return new dataset_slice_track_1.DatasetSliceTrack({
        trace,
        uri,
        rootTableName: 'android_logs',
        dataset: new dataset_1.SourceDataset({
            src: `
        select
          id,
          ts,
          prio,
          utid,
          tag,
          CASE
            WHEN prio <= 3 THEN 0
            WHEN prio = 4 THEN 1
            WHEN prio = 5 THEN 2
            WHEN prio = 6 THEN 3
            WHEN prio = 7 THEN 4
            ELSE -1
          END as depth
        from android_logs
        order by ts
        -- android_logs aren't guaranteed to be ordered by ts, but this is a
        -- requirements for DatasetSliceTrack's mipmap operator to work 
        -- correctly, so we must explicitly sort them above.
      `,
            schema: {
                id: query_result_1.NUM,
                ts: query_result_1.LONG,
                prio: query_result_1.NUM,
                utid: query_result_1.NUM,
                depth: query_result_1.NUM,
                tag: query_result_1.STR,
            },
        }),
        initialMaxDepth: 4,
        colorizer: (row) => DEPTH_TO_COLOR[row.depth],
        // It would be nice to show the message on the tooltip too, but loading a
        // message for each event may balloon memory, so we just show the tag.
        tooltip: (row) => [row.tag],
        // All log events are instant events, render them as a little box rather
        // than the default chevron.
        instantStyle: {
            width: EVT_PX,
            render: (ctx, r) => ctx.fillRect(r.x, r.y, r.width, r.height),
        },
        // Make rows a little more compact.
        sliceLayout: {
            padding: 2,
            sliceHeight: 7,
        },
        detailsPanel: (row) => {
            // The msg is initially undefined, it'll be filled in when it loads
            let msg;
            // Quickly load the log message
            trace.engine
                .query(`select msg from android_logs where id = ${row.id}`)
                .then((result) => {
                const resultRow = result.maybeFirstRow({ msg: query_result_1.STR });
                msg = resultRow?.msg;
            });
            return {
                render() {
                    return (0, mithril_1.default)(details_shell_1.DetailsShell, {
                        title: `Android Log`,
                    }, (0, mithril_1.default)(grid_layout_1.GridLayout, (0, mithril_1.default)(grid_layout_1.GridLayoutColumn, (0, mithril_1.default)(section_1.Section, { title: 'Details' }, (0, mithril_1.default)(tree_1.Tree, (0, mithril_1.default)(tree_1.TreeNode, {
                        left: 'ID',
                        right: row.id,
                    }), (0, mithril_1.default)(tree_1.TreeNode, {
                        left: 'Timestamp',
                        right: (0, mithril_1.default)(timestamp_1.Timestamp, { ts: time_1.Time.fromRaw(row.ts) }),
                    }), (0, mithril_1.default)(tree_1.TreeNode, {
                        left: 'Priority',
                        right: row.prio,
                    }), (0, mithril_1.default)(tree_1.TreeNode, {
                        left: 'Tag',
                        right: row.tag,
                    }), (0, mithril_1.default)(tree_1.TreeNode, {
                        left: 'Utid',
                        right: row.utid,
                    }), (0, mithril_1.default)(tree_1.TreeNode, {
                        left: 'Message',
                        right: msg ? msg : (0, mithril_1.default)(spinner_1.Spinner),
                    }))))));
                },
            };
        },
    });
}
//# sourceMappingURL=logs_track.js.map