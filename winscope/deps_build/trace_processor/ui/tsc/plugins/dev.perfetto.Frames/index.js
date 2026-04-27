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
const aggregation_adapter_1 = require("../../components/aggregation_adapter");
const workspace_1 = require("../../public/workspace");
const query_result_1 = require("../../trace_processor/query_result");
const dev_perfetto_ProcessThreadGroups_1 = tslib_1.__importDefault(require("../dev.perfetto.ProcessThreadGroups"));
const actual_frames_track_1 = require("./actual_frames_track");
const expected_frames_track_1 = require("./expected_frames_track");
const frame_selection_aggregator_1 = require("./frame_selection_aggregator");
// Build a standardized URI for a frames track
function makeUri(upid, kind) {
    return `/process_${upid}/${kind}`;
}
class default_1 {
    static id = 'dev.perfetto.Frames';
    static dependencies = [dev_perfetto_ProcessThreadGroups_1.default];
    async onTraceLoad(ctx) {
        this.addExpectedFrames(ctx);
        this.addActualFrames(ctx);
        ctx.selection.registerAreaSelectionTab((0, aggregation_adapter_1.createAggregationTab)(ctx, new frame_selection_aggregator_1.FrameSelectionAggregator(), 10));
    }
    async addExpectedFrames(ctx) {
        const { engine } = ctx;
        const result = await engine.query(`
      with summary as (
        select
          pt.upid,
          group_concat(id) AS track_ids,
          count() AS track_count
        from process_track pt
        join _slice_track_summary USING (id)
        where pt.type = 'android_expected_frame_timeline'
        group by pt.upid
      )
      select
        t.upid,
        t.track_ids as trackIds,
        __max_layout_depth(t.track_count, t.track_ids) as maxDepth
      from summary t
    `);
        const it = result.iter({
            upid: query_result_1.NUM,
            trackIds: query_result_1.STR,
            maxDepth: query_result_1.NUM,
        });
        for (; it.valid(); it.next()) {
            const upid = it.upid;
            const rawTrackIds = it.trackIds;
            const trackIds = rawTrackIds.split(',').map((v) => Number(v));
            const maxDepth = it.maxDepth;
            const uri = makeUri(upid, 'expected_frames');
            ctx.tracks.registerTrack({
                uri,
                renderer: (0, expected_frames_track_1.createExpectedFramesTrack)(ctx, uri, maxDepth, trackIds),
                tags: {
                    trackIds,
                    upid,
                },
            });
            const group = ctx.plugins
                .getPlugin(dev_perfetto_ProcessThreadGroups_1.default)
                .getGroupForProcess(upid);
            const track = new workspace_1.TrackNode({
                uri,
                name: 'Expected Timeline',
                sortOrder: -50,
            });
            group?.addChildInOrder(track);
        }
    }
    async addActualFrames(ctx) {
        const { engine } = ctx;
        const result = await engine.query(`
      with summary as (
        select
          pt.upid,
          group_concat(id) AS track_ids,
          count() AS track_count
        from process_track pt
        join _slice_track_summary USING (id)
        where pt.type = 'android_actual_frame_timeline'
        group by pt.upid
      )
      select
        t.upid,
        t.track_ids as trackIds,
        __max_layout_depth(t.track_count, t.track_ids) as maxDepth
      from summary t
    `);
        const it = result.iter({
            upid: query_result_1.NUM,
            trackIds: query_result_1.STR,
            maxDepth: query_result_1.NUM,
        });
        for (; it.valid(); it.next()) {
            const upid = it.upid;
            const rawTrackIds = it.trackIds;
            const trackIds = rawTrackIds.split(',').map((v) => Number(v));
            const maxDepth = it.maxDepth;
            const uri = makeUri(upid, 'actual_frames');
            ctx.tracks.registerTrack({
                uri,
                renderer: (0, actual_frames_track_1.createActualFramesTrack)(ctx, uri, maxDepth, trackIds),
                tags: {
                    upid,
                    trackIds,
                    kind: frame_selection_aggregator_1.ACTUAL_FRAMES_SLICE_TRACK_KIND,
                },
            });
            const group = ctx.plugins
                .getPlugin(dev_perfetto_ProcessThreadGroups_1.default)
                .getGroupForProcess(upid);
            const track = new workspace_1.TrackNode({
                uri,
                name: 'Actual Timeline',
                sortOrder: -50,
            });
            group?.addChildInOrder(track);
        }
    }
}
exports.default = default_1;
//# sourceMappingURL=index.js.map