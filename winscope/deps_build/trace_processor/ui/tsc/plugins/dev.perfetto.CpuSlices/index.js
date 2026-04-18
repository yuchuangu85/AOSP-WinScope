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
const cpu_slice_track_1 = require("./cpu_slice_track");
const workspace_1 = require("../../public/workspace");
const cpu_slice_selection_aggregator_1 = require("./cpu_slice_selection_aggregator");
const cpu_slice_by_process_selection_aggregator_1 = require("./cpu_slice_by_process_selection_aggregator");
const dev_perfetto_Thread_1 = tslib_1.__importDefault(require("../dev.perfetto.Thread"));
const aggregation_adapter_1 = require("../../components/aggregation_adapter");
function uriForSchedTrack(cpu) {
    return `/sched_cpu${cpu}`;
}
class default_1 {
    static id = 'dev.perfetto.CpuSlices';
    static dependencies = [dev_perfetto_Thread_1.default];
    async onTraceLoad(ctx) {
        ctx.selection.registerAreaSelectionTab((0, aggregation_adapter_1.createAggregationToTabAdaptor)(ctx, new cpu_slice_selection_aggregator_1.CpuSliceSelectionAggregator()));
        ctx.selection.registerAreaSelectionTab((0, aggregation_adapter_1.createAggregationToTabAdaptor)(ctx, new cpu_slice_by_process_selection_aggregator_1.CpuSliceByProcessSelectionAggregator()));
        // ctx.traceInfo.cpus contains all cpus seen from all events. Filter the set
        // if it's seen in sched slices.
        const queryRes = await ctx.engine.query(`select distinct ucpu from sched order by ucpu;`);
        const ucpus = new Set();
        for (const it = queryRes.iter({ ucpu: query_result_1.NUM }); it.valid(); it.next()) {
            ucpus.add(it.ucpu);
        }
        const cpus = ctx.traceInfo.cpus.filter((cpu) => ucpus.has(cpu.ucpu));
        const cpuToClusterType = await this.getAndroidCpuClusterTypes(ctx.engine);
        for (const cpu of cpus) {
            const uri = uriForSchedTrack(cpu.ucpu);
            const size = cpuToClusterType.get(cpu.cpu);
            const sizeStr = size === undefined ? `` : ` (${size})`;
            const name = `Cpu ${cpu.cpu}${sizeStr}${cpu.maybeMachineLabel()}`;
            const threads = ctx.plugins.getPlugin(dev_perfetto_Thread_1.default).getThreadMap();
            ctx.tracks.registerTrack({
                uri,
                title: name,
                tags: {
                    kind: track_kinds_1.CPU_SLICE_TRACK_KIND,
                    cpu: cpu.ucpu,
                },
                track: new cpu_slice_track_1.CpuSliceTrack(ctx, uri, cpu, threads),
            });
            const trackNode = new workspace_1.TrackNode({ uri, title: name, sortOrder: -50 });
            ctx.workspace.addChildInOrder(trackNode);
        }
    }
    async getAndroidCpuClusterTypes(engine) {
        const cpuToClusterType = new Map();
        await engine.query(`
      include perfetto module android.cpu.cluster_type;
    `);
        const result = await engine.query(`
      select cpu, cluster_type as clusterType
      from android_cpu_cluster_mapping
    `);
        const it = result.iter({
            cpu: query_result_1.NUM,
            clusterType: query_result_1.STR_NULL,
        });
        for (; it.valid(); it.next()) {
            const clusterType = it.clusterType;
            if (clusterType !== null) {
                cpuToClusterType.set(it.cpu, clusterType);
            }
        }
        return cpuToClusterType;
    }
}
exports.default = default_1;
//# sourceMappingURL=index.js.map