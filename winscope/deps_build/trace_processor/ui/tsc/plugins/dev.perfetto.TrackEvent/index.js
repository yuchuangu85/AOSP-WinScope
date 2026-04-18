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
const tslib_1 = require("tslib");
const dev_perfetto_ProcessThreadGroups_1 = tslib_1.__importDefault(require("../dev.perfetto.ProcessThreadGroups"));
const dev_perfetto_TraceProcessorTrack_1 = tslib_1.__importDefault(require("../dev.perfetto.TraceProcessorTrack"));
const query_result_1 = require("../../trace_processor/query_result");
const workspace_1 = require("../../public/workspace");
const logging_1 = require("../../base/logging");
const track_kinds_1 = require("../../public/track_kinds");
const trace_processor_slice_track_1 = require("../dev.perfetto.TraceProcessorTrack/trace_processor_slice_track");
const trace_processor_counter_track_1 = require("../dev.perfetto.TraceProcessorTrack/trace_processor_counter_track");
const utils_1 = require("../../public/utils");
class default_1 {
    static id = 'dev.perfetto.TrackEvent';
    static dependencies = [
        dev_perfetto_ProcessThreadGroups_1.default,
        dev_perfetto_TraceProcessorTrack_1.default,
    ];
    parentTrackNodes = new Map();
    async onTraceLoad(ctx) {
        const res = await ctx.engine.query(`
      include perfetto module viz.summary.track_event;
      select
        ifnull(g.upid, t.upid) as upid,
        g.utid,
        g.parent_id as parentId,
        g.is_counter AS isCounter,
        g.name,
        g.unit,
        g.builtin_counter_type as builtinCounterType,
        g.has_data AS hasData,
        g.has_children AS hasChildren,
        g.track_ids as trackIds,
        g.order_id as orderId,
        t.name as threadName,
        t.tid as tid,
        ifnull(p.pid, tp.pid) as pid,
        ifnull(p.name, tp.name) as processName
      from _track_event_tracks_ordered_groups g
      left join process p using (upid)
      left join thread t using (utid)
      left join process tp on tp.upid = t.upid
    `);
        const it = res.iter({
            upid: query_result_1.NUM_NULL,
            utid: query_result_1.NUM_NULL,
            parentId: query_result_1.NUM_NULL,
            isCounter: query_result_1.NUM,
            name: query_result_1.STR_NULL,
            unit: query_result_1.STR_NULL,
            builtinCounterType: query_result_1.STR_NULL,
            hasData: query_result_1.NUM,
            hasChildren: query_result_1.NUM,
            trackIds: query_result_1.STR,
            orderId: query_result_1.NUM,
            threadName: query_result_1.STR_NULL,
            tid: query_result_1.NUM_NULL,
            pid: query_result_1.NUM_NULL,
            processName: query_result_1.STR_NULL,
        });
        const processGroupsPlugin = ctx.plugins.getPlugin(dev_perfetto_ProcessThreadGroups_1.default);
        const trackIdToTrackNode = new Map();
        for (; it.valid(); it.next()) {
            const { upid, utid, parentId, isCounter, name, unit, builtinCounterType, hasData, hasChildren, trackIds: rawTrackIds, orderId, threadName, tid, pid, processName, } = it;
            // Don't add track_event tracks which don't have any data and don't have
            // any children.
            if (!hasData && !hasChildren) {
                continue;
            }
            const kind = isCounter ? track_kinds_1.COUNTER_TRACK_KIND : track_kinds_1.SLICE_TRACK_KIND;
            const trackIds = rawTrackIds.split(',').map((v) => Number(v));
            const title = (0, utils_1.getTrackName)({
                name,
                utid,
                upid,
                kind,
                threadTrack: utid !== null,
                threadName,
                processName,
                tid,
                pid,
            });
            const uri = `/track_event_${trackIds[0]}`;
            if (hasData && isCounter) {
                // Don't show any builtin counter.
                if (builtinCounterType !== null) {
                    continue;
                }
                (0, logging_1.assertTrue)(trackIds.length === 1);
                const trackId = trackIds[0];
                ctx.tracks.registerTrack({
                    uri,
                    title,
                    tags: {
                        kind,
                        trackIds: [trackIds[0]],
                        upid: upid ?? undefined,
                        utid: utid ?? undefined,
                    },
                    track: new trace_processor_counter_track_1.TraceProcessorCounterTrack(ctx, uri, {
                        unit: unit ?? undefined,
                    }, trackId, title),
                });
            }
            else if (hasData) {
                ctx.tracks.registerTrack({
                    uri,
                    title,
                    tags: {
                        kind,
                        trackIds: trackIds,
                        upid: upid ?? undefined,
                        utid: utid ?? undefined,
                    },
                    track: (0, trace_processor_slice_track_1.createTraceProcessorSliceTrack)({ trace: ctx, uri, trackIds }),
                });
            }
            const parent = this.findParentTrackNode(ctx, processGroupsPlugin, trackIdToTrackNode, parentId ?? undefined, upid ?? undefined, utid ?? undefined, hasChildren);
            const node = new workspace_1.TrackNode({
                title,
                sortOrder: orderId,
                isSummary: hasData === 0,
                uri: uri,
            });
            parent.addChildInOrder(node);
            trackIdToTrackNode.set(trackIds[0], node);
        }
    }
    findParentTrackNode(ctx, processGroupsPlugin, trackIdToTrackNode, parentId, upid, utid, hasChildren) {
        if (parentId !== undefined) {
            return (0, logging_1.assertExists)(trackIdToTrackNode.get(parentId));
        }
        if (utid !== undefined) {
            return (0, logging_1.assertExists)(processGroupsPlugin.getGroupForThread(utid));
        }
        if (upid !== undefined) {
            return (0, logging_1.assertExists)(processGroupsPlugin.getGroupForProcess(upid));
        }
        if (hasChildren) {
            return ctx.workspace.tracks;
        }
        const id = `/track_event_root`;
        let node = this.parentTrackNodes.get(id);
        if (node === undefined) {
            node = new workspace_1.TrackNode({
                title: 'Global Track Events',
                isSummary: true,
            });
            ctx.workspace.addChildInOrder(node);
            this.parentTrackNodes.set(id, node);
        }
        return node;
    }
}
exports.default = default_1;
//# sourceMappingURL=index.js.map