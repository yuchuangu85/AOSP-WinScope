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
const query_result_1 = require("../../trace_processor/query_result");
const workspace_1 = require("../../public/workspace");
const dataset_slice_track_1 = require("../../components/tracks/dataset_slice_track");
const dataset_1 = require("../../trace_processor/dataset");
const thread_slice_details_tab_1 = require("../../components/details/thread_slice_details_tab");
class default_1 {
    static id = 'dev.perfetto.GpuByProcess';
    async onTraceLoad(ctx) {
        // Find all unique upid values in gpu_slices and join with process table.
        const results = await ctx.engine.query(`
      WITH slice_upids AS (
        SELECT DISTINCT upid FROM gpu_slice
      )
      SELECT upid, pid, name FROM slice_upids JOIN process USING (upid)
    `);
        const it = results.iter({
            upid: query_result_1.NUM_NULL,
            pid: query_result_1.NUM_NULL,
            name: query_result_1.STR_NULL,
        });
        // For each upid, create a GpuPidTrack.
        for (; it.valid(); it.next()) {
            if (it.upid == null) {
                continue;
            }
            const upid = it.upid;
            let processName = 'Unknown';
            if (it.name != null) {
                processName = it.name;
            }
            else if (it.pid != null) {
                processName = `${it.pid}`;
            }
            const uri = `dev.perfetto.GpuByProcess#${upid}`;
            ctx.tracks.registerTrack({
                uri,
                renderer: new dataset_slice_track_1.DatasetSliceTrack({
                    trace: ctx,
                    uri,
                    dataset: new dataset_1.SourceDataset({
                        src: 'gpu_slice',
                        schema: {
                            id: query_result_1.NUM,
                            name: query_result_1.STR,
                            ts: query_result_1.LONG,
                            dur: query_result_1.LONG,
                            depth: query_result_1.NUM,
                            upid: query_result_1.NUM,
                        },
                        filter: {
                            col: 'upid',
                            eq: upid,
                        },
                    }),
                    detailsPanel: () => new thread_slice_details_tab_1.ThreadSliceDetailsPanel(ctx),
                }),
            });
            const track = new workspace_1.TrackNode({
                uri,
                name: `GPU ${processName}`,
            });
            ctx.workspace.addChildInOrder(track);
        }
    }
}
exports.default = default_1;
//# sourceMappingURL=index.js.map