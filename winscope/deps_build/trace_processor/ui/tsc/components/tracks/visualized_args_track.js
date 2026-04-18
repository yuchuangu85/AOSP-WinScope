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
exports.createVisualizedArgsTrack = createVisualizedArgsTrack;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const button_1 = require("../../widgets/button");
const semantic_icons_1 = require("../../base/semantic_icons");
const uuid_1 = require("../../base/uuid");
const sql_utils_1 = require("../../trace_processor/sql_utils");
const dataset_slice_track_1 = require("./dataset_slice_track");
const dataset_1 = require("../../trace_processor/dataset");
const query_result_1 = require("../../trace_processor/query_result");
const thread_slice_details_tab_1 = require("../details/thread_slice_details_tab");
const bigint_math_1 = require("../../base/bigint_math");
const math_utils_1 = require("../../base/math_utils");
async function createVisualizedArgsTrack({ uri, trace, trackId, maxDepth, argName, onClose, }) {
    const uuid = (0, uuid_1.uuidv4Sql)();
    const escapedArgName = argName.replace(/[^a-zA-Z]/g, '_');
    const viewName = `__arg_visualisation_helper_${escapedArgName}_${uuid}_slice`;
    await (0, sql_utils_1.createView)(trace.engine, viewName, `
      with slice_with_arg as (
        select
          slice.id,
          slice.track_id,
          slice.ts,
          slice.dur,
          slice.thread_dur,
          NULL as cat,
          args.display_value as name
        from slice
        join args using (arg_set_id)
        where args.key='${argName}'
      )
      select
        *,
        (select count()
        from ancestor_slice(s1.id) s2
        join slice_with_arg s3 on s2.id=s3.id
        ) as depth
      from slice_with_arg s1
      order by id
    `);
    return new dataset_slice_track_1.DatasetSliceTrack({
        trace,
        uri,
        dataset: new dataset_1.SourceDataset({
            schema: {
                id: query_result_1.NUM,
                ts: query_result_1.LONG,
                dur: query_result_1.LONG,
                depth: query_result_1.NUM,
                name: query_result_1.STR,
                thread_dur: query_result_1.LONG_NULL,
            },
            src: viewName,
            filter: {
                col: 'track_id',
                eq: trackId,
            },
        }),
        initialMaxDepth: maxDepth,
        detailsPanel: () => new thread_slice_details_tab_1.ThreadSliceDetailsPanel(trace),
        fillRatio: (row) => {
            if (row.dur > 0n && row.thread_dur !== null) {
                return (0, math_utils_1.clamp)(bigint_math_1.BigintMath.ratio(row.thread_dur, row.dur), 0, 1);
            }
            else {
                return 1;
            }
        },
        shellButtons: () => {
            return (0, mithril_1.default)(button_1.Button, {
                onclick: onClose,
                icon: semantic_icons_1.Icons.Close,
                title: 'Close all visualised args tracks for this arg',
                compact: true,
            });
        },
    });
}
//# sourceMappingURL=visualized_args_track.js.map