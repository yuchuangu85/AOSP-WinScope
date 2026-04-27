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
const workspace_1 = require("../../public/workspace");
const track_kinds_1 = require("../../public/track_kinds");
const query_result_1 = require("../../trace_processor/query_result");
const trace_processor_counter_track_1 = require("../dev.perfetto.TraceProcessorTrack/trace_processor_counter_track");
const index_1 = tslib_1.__importDefault(require("../dev.perfetto.TraceProcessorTrack/index"));
class default_1 {
    static id = 'dev.perfetto.GpuFreq';
    static dependencies = [index_1.default];
    async onTraceLoad(ctx) {
        const result = await ctx.engine.query(`
      select id, gpu_id as gpuId
      from gpu_counter_track
      join _counter_track_summary using (id)
      where name = 'gpufreq'
    `);
        const it = result.iter({ id: query_result_1.NUM, gpuId: query_result_1.NUM });
        for (; it.valid(); it.next()) {
            const uri = `/gpu_frequency_${it.gpuId}`;
            const name = `Gpu ${it.gpuId} Frequency`;
            ctx.tracks.registerTrack({
                uri,
                tags: {
                    kind: track_kinds_1.COUNTER_TRACK_KIND,
                    trackIds: [it.id],
                },
                renderer: new trace_processor_counter_track_1.TraceProcessorCounterTrack(ctx, uri, {}, it.id, name),
            });
            const track = new workspace_1.TrackNode({ uri, name, sortOrder: -20 });
            ctx.workspace.addChildInOrder(track);
        }
    }
}
exports.default = default_1;
//# sourceMappingURL=index.js.map