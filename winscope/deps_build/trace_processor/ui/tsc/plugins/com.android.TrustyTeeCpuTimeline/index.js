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
const dataset_slice_track_1 = require("../../components/tracks/dataset_slice_track");
const workspace_1 = require("../../public/workspace");
const dataset_1 = require("../../trace_processor/dataset");
const query_result_1 = require("../../trace_processor/query_result");
class default_1 {
    static id = 'com.android.TrustyTeeCpuTimeline';
    async onTraceLoad(ctx) {
        const title = 'Trusty Tee CPU Timeline';
        const uri = `com.android.TrustyTeeCpuTimeline#TrustyTeeCpuTimeline`;
        const query = `
      SELECT
        sched.id AS id,
        ts,
        dur,
        cpu,
        priority,
        name,
        utid,
        thread.name AS threadName,
        cpu AS depth
      FROM sched
      JOIN thread
        USING (utid)
      WHERE threadName GLOB 'trusty-nop*'
    `;
        ctx.tracks.registerTrack({
            uri,
            title,
            track: new dataset_slice_track_1.DatasetSliceTrack({
                trace: ctx,
                uri,
                dataset: new dataset_1.SourceDataset({
                    src: query,
                    schema: {
                        id: query_result_1.NUM,
                        ts: query_result_1.LONG,
                        dur: query_result_1.LONG,
                        name: query_result_1.STR,
                        depth: query_result_1.NUM,
                    },
                }),
                // Blank details panel - overrides details panel that assumes slices are
                // from the slice table.
                detailsPanel: () => {
                    return {
                        render: () => undefined,
                    };
                },
            }),
        });
        const trackNode = new workspace_1.TrackNode({ uri, title, sortOrder: -100 });
        ctx.workspace.addChildInOrder(trackNode);
    }
}
exports.default = default_1;
//# sourceMappingURL=index.js.map