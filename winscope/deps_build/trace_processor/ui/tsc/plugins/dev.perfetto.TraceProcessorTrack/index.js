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
const logging_1 = require("../../base/logging");
const track_kinds_1 = require("../../public/track_kinds");
const utils_1 = require("../../public/utils");
const workspace_1 = require("../../public/workspace");
const query_result_1 = require("../../trace_processor/query_result");
const dev_perfetto_ProcessThreadGroups_1 = tslib_1.__importDefault(require("../dev.perfetto.ProcessThreadGroups"));
const dev_perfetto_StandardGroups_1 = tslib_1.__importDefault(require("../dev.perfetto.StandardGroups"));
const slice_tracks_1 = require("./slice_tracks");
const trace_processor_counter_track_1 = require("./trace_processor_counter_track");
const counter_tracks_1 = require("./counter_tracks");
const trace_processor_slice_track_1 = require("./trace_processor_slice_track");
const array_utils_1 = require("../../base/array_utils");
class default_1 {
    static id = 'dev.perfetto.TraceProcessorTrack';
    static dependencies = [
        dev_perfetto_ProcessThreadGroups_1.default,
        dev_perfetto_StandardGroups_1.default,
    ];
    groups = new Map();
    async onTraceLoad(ctx) {
        await this.addCounters(ctx);
        await this.addSlices(ctx);
    }
    async addCounters(ctx) {
        const result = await ctx.engine.query(`
      include perfetto module viz.threads;

      with tracks_summary as (
        select
          ct.type,
          ct.name,
          ct.id,
          ct.unit,
          extract_arg(ct.dimension_arg_set_id, 'utid') as utid,
          extract_arg(ct.dimension_arg_set_id, 'upid') as upid
        from counter_track ct
        join _counter_track_summary using (id)
        order by ct.name
      )
      select
        s.*,
        thread.tid,
        thread.name as threadName,
        ifnull(p.pid, tp.pid) as pid,
        ifnull(p.name, tp.name) as processName,
        ifnull(thread.is_main_thread, 0) as isMainThread,
        ifnull(k.is_kernel_thread, 0) AS isKernelThread
      from tracks_summary s
      left join process p on s.upid = p.upid
      left join thread using (utid)
      left join _threads_with_kernel_flag k using (utid)
      left join process tp on thread.upid = tp.upid
      order by lower(s.name)
    `);
        const schemas = new Map(counter_tracks_1.COUNTER_TRACK_SCHEMAS.map((x) => [x.type, x]));
        const it = result.iter({
            id: query_result_1.NUM,
            type: query_result_1.STR,
            name: query_result_1.STR_NULL,
            unit: query_result_1.STR_NULL,
            utid: query_result_1.NUM_NULL,
            upid: query_result_1.NUM_NULL,
            threadName: query_result_1.STR_NULL,
            processName: query_result_1.STR_NULL,
            tid: query_result_1.NUM_NULL,
            pid: query_result_1.NUM_NULL,
            isMainThread: query_result_1.NUM,
            isKernelThread: query_result_1.NUM,
        });
        for (; it.valid(); it.next()) {
            const { type, id: trackId, name, unit, utid, upid, threadName, processName, tid, pid, isMainThread, isKernelThread, } = it;
            const schema = schemas.get(type);
            if (schema === undefined) {
                continue;
            }
            const { group, topLevelGroup } = schema;
            const title = (0, utils_1.getTrackName)({
                name,
                tid,
                threadName,
                pid,
                processName,
                upid,
                utid,
                kind: track_kinds_1.COUNTER_TRACK_KIND,
                threadTrack: utid !== undefined,
            });
            const uri = `/counter_${trackId}`;
            ctx.tracks.registerTrack({
                uri,
                title,
                tags: {
                    kind: track_kinds_1.COUNTER_TRACK_KIND,
                    trackIds: [trackId],
                    upid: upid ?? undefined,
                    utid: utid ?? undefined,
                    ...(isKernelThread === 1 && { kernelThread: true }),
                },
                chips: (0, array_utils_1.removeFalsyValues)([
                    isKernelThread === 0 && isMainThread === 1 && 'main thread',
                ]),
                track: new trace_processor_counter_track_1.TraceProcessorCounterTrack(ctx, uri, {
                    yMode: schema.mode,
                    yRangeSharingKey: schema.shareYAxis ? it.type : undefined,
                    unit: unit ?? undefined,
                }, trackId, title),
            });
            this.addTrack(ctx, topLevelGroup, group, upid, utid, new workspace_1.TrackNode({
                uri,
                title,
                sortOrder: utid !== undefined || upid !== undefined ? 30 : 0,
            }));
        }
    }
    async addSlices(ctx) {
        const result = await ctx.engine.query(`
      include perfetto module viz.threads;

      with grouped as materialized (
        select
          t.type,
          t.name,
          extract_arg(t.dimension_arg_set_id, 'utid') as utid,
          extract_arg(t.dimension_arg_set_id, 'upid') as upid,
          group_concat(t.id) as trackIds,
          count() as trackCount
        from _slice_track_summary s
        join track t using (id)
        group by type, upid, utid, name
      )
      select
        s.type,
        s.name,
        s.utid,
        ifnull(s.upid, tp.upid) as upid,
        s.trackIds as trackIds,
        __max_layout_depth(s.trackCount, s.trackIds) as maxDepth,
        thread.tid,
        thread.name as threadName,
        ifnull(p.pid, tp.pid) as pid,
        ifnull(p.name, tp.name) as processName,
        ifnull(thread.is_main_thread, 0) as isMainThread,
        ifnull(k.is_kernel_thread, 0) AS isKernelThread
      from grouped s
      left join process p on s.upid = p.upid
      left join thread using (utid)
      left join _threads_with_kernel_flag k using (utid)
      left join process tp on thread.upid = tp.upid
      order by lower(s.name)
    `);
        const schemas = new Map(slice_tracks_1.SLICE_TRACK_SCHEMAS.map((x) => [x.type, x]));
        const it = result.iter({
            type: query_result_1.STR,
            name: query_result_1.STR_NULL,
            utid: query_result_1.NUM_NULL,
            upid: query_result_1.NUM_NULL,
            trackIds: query_result_1.STR,
            maxDepth: query_result_1.NUM,
            tid: query_result_1.NUM_NULL,
            threadName: query_result_1.STR_NULL,
            pid: query_result_1.NUM_NULL,
            processName: query_result_1.STR_NULL,
            isMainThread: query_result_1.NUM,
            isKernelThread: query_result_1.NUM,
        });
        for (; it.valid(); it.next()) {
            const { trackIds: rawTrackIds, type, name, maxDepth, utid, upid, threadName, processName, tid, pid, isMainThread, isKernelThread, } = it;
            const schema = schemas.get(type);
            if (schema === undefined) {
                continue;
            }
            const trackIds = rawTrackIds.split(',').map((v) => Number(v));
            const { group, topLevelGroup } = schema;
            const title = (0, utils_1.getTrackName)({
                name,
                tid,
                threadName,
                pid,
                processName,
                upid,
                utid,
                kind: track_kinds_1.SLICE_TRACK_KIND,
                threadTrack: utid !== undefined,
            });
            const uri = `/slice_${trackIds[0]}`;
            ctx.tracks.registerTrack({
                uri,
                title,
                tags: {
                    kind: track_kinds_1.SLICE_TRACK_KIND,
                    trackIds: trackIds,
                    upid: upid ?? undefined,
                    utid: utid ?? undefined,
                    ...(isKernelThread === 1 && { kernelThread: true }),
                },
                chips: (0, array_utils_1.removeFalsyValues)([
                    isKernelThread === 0 && isMainThread === 1 && 'main thread',
                ]),
                track: (0, trace_processor_slice_track_1.createTraceProcessorSliceTrack)({
                    trace: ctx,
                    uri,
                    maxDepth,
                    trackIds,
                }),
            });
            this.addTrack(ctx, topLevelGroup, group, upid, utid, new workspace_1.TrackNode({
                uri,
                title,
                sortOrder: utid !== undefined || upid !== undefined ? 20 : 0,
            }));
        }
    }
    addTrack(ctx, topLevelGroup, group, upid, utid, track) {
        switch (topLevelGroup) {
            case 'PROCESS': {
                const process = (0, logging_1.assertExists)(ctx.plugins
                    .getPlugin(dev_perfetto_ProcessThreadGroups_1.default)
                    .getGroupForProcess((0, logging_1.assertExists)(upid)));
                this.getGroupByName(process, group, upid).addChildInOrder(track);
                break;
            }
            case 'THREAD': {
                const thread = (0, logging_1.assertExists)(ctx.plugins
                    .getPlugin(dev_perfetto_ProcessThreadGroups_1.default)
                    .getGroupForThread((0, logging_1.assertExists)(utid)));
                this.getGroupByName(thread, group, utid).addChildInOrder(track);
                break;
            }
            case undefined: {
                this.getGroupByName(ctx.workspace.tracks, group, upid).addChildInOrder(track);
                break;
            }
            default: {
                const standardGroup = ctx.plugins
                    .getPlugin(dev_perfetto_StandardGroups_1.default)
                    .getOrCreateStandardGroup(ctx.workspace, topLevelGroup);
                this.getGroupByName(standardGroup, group, null).addChildInOrder(track);
                break;
            }
        }
    }
    getGroupByName(node, group, scopeId) {
        if (group === undefined) {
            return node;
        }
        // This is potentially dangerous - ids MUST be unique within the entire
        // workspace - this seems to indicate that we could end up duplicating ids in
        // different nodes.
        const name = typeof group === 'string' ? group : group.name;
        const expanded = typeof group === 'string' ? false : group.expanded ?? false;
        const groupId = `tp_group_${scopeId}_${name.toLowerCase().replace(' ', '_')}`;
        const groupNode = this.groups.get(groupId);
        if (groupNode) {
            return groupNode;
        }
        const newGroup = new workspace_1.TrackNode({
            uri: `/${group}`,
            isSummary: true,
            title: name,
            collapsed: !expanded,
        });
        node.addChildInOrder(newGroup);
        this.groups.set(groupId, newGroup);
        return newGroup;
    }
}
exports.default = default_1;
//# sourceMappingURL=index.js.map