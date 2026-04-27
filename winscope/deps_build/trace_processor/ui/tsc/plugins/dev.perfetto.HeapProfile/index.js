"use strict";
// Copyright (C) 2021 The Android Open Source Project
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
const tslib_1 = require("tslib");
const track_kinds_1 = require("../../public/track_kinds");
const query_result_1 = require("../../trace_processor/query_result");
const heap_profile_track_1 = require("./heap_profile_track");
const workspace_1 = require("../../public/workspace");
const sql_utils_1 = require("../../trace_processor/sql_utils");
const dev_perfetto_ProcessThreadGroups_1 = tslib_1.__importDefault(require("../dev.perfetto.ProcessThreadGroups"));
const EVENT_TABLE_NAME = 'heap_profile_events';
class default_1 {
    static id = 'dev.perfetto.HeapProfile';
    static dependencies = [dev_perfetto_ProcessThreadGroups_1.default];
    trackMap = new Map();
    async onTraceLoad(trace) {
        await this.createHeapProfileTable(trace);
        await this.addProcessTracks(trace);
        trace.onTraceReady.addListener(async () => {
            await this.selectFirstHeapProfile(trace);
        });
    }
    async createHeapProfileTable(trace) {
        await (0, sql_utils_1.createPerfettoTable)({
            engine: trace.engine,
            name: EVENT_TABLE_NAME,
            as: `
        SELECT
          MIN(id) as id,
          graph_sample_ts AS ts,
          upid,
          0 AS dur,
          0 AS depth,
          'graph' AS type
        FROM heap_graph_object
        GROUP BY graph_sample_ts, upid

        UNION ALL

        SELECT
          MIN(id) as id,
          ts,
          upid,
          0 AS dur,
          0 AS depth,
          'heap_profile:' || GROUP_CONCAT(DISTINCT heap_name) AS type
        FROM heap_profile_allocation
        GROUP BY ts, upid
      `,
        });
    }
    async addProcessTracks(trace) {
        const trackGroupsPlugin = trace.plugins.getPlugin(dev_perfetto_ProcessThreadGroups_1.default);
        const incomplete = await this.getIncomplete(trace);
        const result = await trace.engine.query(`
      SELECT DISTINCT 
        upid
      FROM ${EVENT_TABLE_NAME}
    `);
        for (const it = result.iter({ upid: query_result_1.NUM }); it.valid(); it.next()) {
            const upid = it.upid;
            const uri = `/process_${upid}/heap_profile`;
            const track = {
                uri,
                tags: {
                    kind: track_kinds_1.HEAP_PROFILE_TRACK_KIND,
                    upid,
                },
                renderer: (0, heap_profile_track_1.createHeapProfileTrack)(trace, uri, EVENT_TABLE_NAME, upid, incomplete),
            };
            trace.tracks.registerTrack(track);
            this.trackMap.set(upid, track);
            const group = trackGroupsPlugin.getGroupForProcess(upid);
            const trackNode = new workspace_1.TrackNode({
                uri,
                name: 'Heap Profile',
                sortOrder: -30,
            });
            group?.addChildInOrder(trackNode);
        }
    }
    async getIncomplete(trace) {
        const it = await trace.engine.query(`
      SELECT value
      FROM stats
      WHERE name = 'heap_graph_non_finalized_graph'
    `);
        const incomplete = it.firstRow({ value: query_result_1.NUM }).value > 0;
        return incomplete;
    }
    async selectFirstHeapProfile(ctx) {
        // Select the first sample from each track
        const result = await ctx.engine.query(`
        SELECT
          id,
          upid
        FROM ${EVENT_TABLE_NAME}
        ORDER BY ts
        LIMIT 1
      `);
        const iter = result.maybeFirstRow({ id: query_result_1.NUM, upid: query_result_1.NUM });
        if (!iter)
            return;
        const track = this.trackMap.get(iter.upid);
        if (!track)
            return;
        ctx.selection.selectTrackEvent(track.uri, iter.id);
    }
}
exports.default = default_1;
//# sourceMappingURL=index.js.map