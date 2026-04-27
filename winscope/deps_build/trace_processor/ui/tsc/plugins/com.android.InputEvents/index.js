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
const query_result_1 = require("../../trace_processor/query_result");
const query_slice_track_1 = require("../../components/tracks/query_slice_track");
const workspace_1 = require("../../public/workspace");
const dev_perfetto_StandardGroups_1 = tslib_1.__importDefault(require("../dev.perfetto.StandardGroups"));
class default_1 {
    static id = 'com.android.InputEvents';
    static dependencies = [dev_perfetto_StandardGroups_1.default];
    async onTraceLoad(ctx) {
        const cnt = await ctx.engine.query(`
      SELECT
        count(*) as cnt
      FROM slice
      WHERE name GLOB 'UnwantedInteractionBlocker::notifyMotion*'
    `);
        if (cnt.firstRow({ cnt: query_result_1.LONG }).cnt == 0n) {
            return;
        }
        const SQL_SOURCE = `
      SELECT
        read_time as ts,
        end_to_end_latency_dur as dur,
        CONCAT(event_type, ' ', event_action, ': ', process_name, ' (', input_event_id, ')') as name
      FROM android_input_events
      WHERE end_to_end_latency_dur IS NOT NULL
      `;
        await ctx.engine.query('INCLUDE PERFETTO MODULE android.input;');
        const uri = 'com.android.InputEvents#InputEventsTrack';
        const track = await (0, query_slice_track_1.createQuerySliceTrack)({
            trace: ctx,
            uri,
            data: {
                sqlSource: SQL_SOURCE,
            },
        });
        ctx.tracks.registerTrack({
            uri,
            renderer: track,
        });
        const node = new workspace_1.TrackNode({ uri, name: 'Input Events' });
        const group = ctx.plugins
            .getPlugin(dev_perfetto_StandardGroups_1.default)
            .getOrCreateStandardGroup(ctx.workspace, 'USER_INTERACTION');
        group.addChildInOrder(node);
    }
}
exports.default = default_1;
//# sourceMappingURL=index.js.map