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
const tslib_1 = require("tslib");
const query_counter_track_1 = require("../../components/tracks/query_counter_track");
const track_kinds_1 = require("../../public/track_kinds");
const workspace_1 = require("../../public/workspace");
const query_result_1 = require("../../trace_processor/query_result");
const dev_perfetto_ProcessThreadGroups_1 = tslib_1.__importDefault(require("../dev.perfetto.ProcessThreadGroups"));
const dev_perfetto_StandardGroups_1 = tslib_1.__importDefault(require("../dev.perfetto.StandardGroups"));
const dev_perfetto_TraceProcessorTrack_1 = tslib_1.__importDefault(require("../dev.perfetto.TraceProcessorTrack"));
const trace_processor_counter_track_1 = require("../dev.perfetto.TraceProcessorTrack/trace_processor_counter_track");
const trace_processor_slice_track_1 = require("../dev.perfetto.TraceProcessorTrack/trace_processor_slice_track");
async function registerAllocsTrack(ctx, uri, dataSource) {
    const track = await (0, query_counter_track_1.createQueryCounterTrack)({
        trace: ctx,
        uri,
        data: dataSource,
    });
    ctx.tracks.registerTrack({
        uri,
        title: `dmabuf allocs`,
        track: track,
    });
}
class default_1 {
    static id = 'dev.perfetto.AndroidDmabuf';
    static dependencies = [
        dev_perfetto_ProcessThreadGroups_1.default,
        dev_perfetto_StandardGroups_1.default,
        dev_perfetto_TraceProcessorTrack_1.default,
    ];
    async onTraceLoad(ctx) {
        const e = ctx.engine;
        await e.query(`INCLUDE PERFETTO MODULE android.memory.dmabuf`);
        await e.query(`
      CREATE PERFETTO TABLE _android_memory_cumulative_dmabuf AS
      SELECT
        upid, utid, ts,
        SUM(buf_size) OVER(PARTITION BY COALESCE(upid, utid) ORDER BY ts) AS value
      FROM android_dmabuf_allocs;`);
        const pids = await e.query(`SELECT DISTINCT upid, IIF(upid IS NULL, utid, NULL) AS utid FROM _android_memory_cumulative_dmabuf`);
        const it = pids.iter({ upid: query_result_1.NUM_NULL, utid: query_result_1.NUM_NULL });
        for (; it.valid(); it.next()) {
            if (it.upid != null) {
                const uri = `/android_process_dmabuf_upid_${it.upid}`;
                const config = {
                    sqlSource: `SELECT ts, value FROM _android_memory_cumulative_dmabuf
                 WHERE upid = ${it.upid}`,
                };
                await registerAllocsTrack(ctx, uri, config);
                ctx.plugins
                    .getPlugin(dev_perfetto_ProcessThreadGroups_1.default)
                    .getGroupForProcess(it.upid)
                    ?.addChildInOrder(new workspace_1.TrackNode({ uri, title: 'dmabuf allocs' }));
            }
            else if (it.utid != null) {
                const uri = `/android_process_dmabuf_utid_${it.utid}`;
                const config = {
                    sqlSource: `SELECT ts, value FROM _android_memory_cumulative_dmabuf
                 WHERE utid = ${it.utid}`,
                };
                await registerAllocsTrack(ctx, uri, config);
                ctx.plugins
                    .getPlugin(dev_perfetto_ProcessThreadGroups_1.default)
                    .getGroupForThread(it.utid)
                    ?.addChildInOrder(new workspace_1.TrackNode({ uri, title: 'dmabuf allocs' }));
            }
        }
        const memoryGroupFn = () => {
            return ctx.plugins
                .getPlugin(dev_perfetto_StandardGroups_1.default)
                .getOrCreateStandardGroup(ctx.workspace, 'MEMORY');
        };
        const node = await addGlobalCounter(ctx, memoryGroupFn);
        await addGlobalAllocs(ctx, () => {
            return node ?? memoryGroupFn();
        });
    }
}
exports.default = default_1;
async function addGlobalCounter(ctx, parent) {
    const track = await ctx.engine.query(`
    select id, name
    from track
    where type = 'android_dma_heap'
  `);
    const it = track.maybeFirstRow({ id: query_result_1.NUM, name: query_result_1.STR });
    if (!it) {
        return undefined;
    }
    const { id, name: title } = it;
    const uri = `/android_dmabuf_counter`;
    ctx.tracks.registerTrack({
        uri,
        title,
        tags: {
            kind: track_kinds_1.COUNTER_TRACK_KIND,
            trackIds: [id],
        },
        track: new trace_processor_counter_track_1.TraceProcessorCounterTrack(ctx, uri, {}, id, title),
    });
    const node = new workspace_1.TrackNode({
        uri,
        title,
    });
    parent().addChildInOrder(node);
    return node;
}
async function addGlobalAllocs(ctx, parent) {
    const track = await ctx.engine.query(`
    select name, group_concat(id) as trackIds
    from track
    where type = 'android_dma_allocations'
    group by name
  `);
    const it = track.maybeFirstRow({ trackIds: query_result_1.STR, name: query_result_1.STR });
    if (!it) {
        return undefined;
    }
    const { trackIds, name: title } = it;
    const uri = `/android_dmabuf_allocs`;
    const ids = trackIds.split(',').map((x) => Number(x));
    ctx.tracks.registerTrack({
        uri,
        title,
        tags: {
            kind: track_kinds_1.SLICE_TRACK_KIND,
            trackIds: ids,
        },
        track: (0, trace_processor_slice_track_1.createTraceProcessorSliceTrack)({ trace: ctx, uri, trackIds: ids }),
    });
    const node = new workspace_1.TrackNode({
        uri,
        title,
    });
    parent().addChildInOrder(node);
}
//# sourceMappingURL=index.js.map