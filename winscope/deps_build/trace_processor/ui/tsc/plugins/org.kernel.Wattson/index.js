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
const aggregation_adapter_1 = require("../../components/aggregation_adapter");
const base_counter_track_1 = require("../../components/tracks/base_counter_track");
const query_slice_track_1 = require("../../components/tracks/query_slice_track");
const track_kinds_1 = require("../../public/track_kinds");
const workspace_1 = require("../../public/workspace");
const query_result_1 = require("../../trace_processor/query_result");
const estimate_aggregator_1 = require("./estimate_aggregator");
const package_aggregator_1 = require("./package_aggregator");
const process_aggregator_1 = require("./process_aggregator");
const thread_aggregator_1 = require("./thread_aggregator");
const track_kinds_2 = require("./track_kinds");
class default_1 {
    static id = `org.kernel.Wattson`;
    async onTraceLoad(ctx) {
        const markersSupported = await hasWattsonMarkersSupport(ctx.engine);
        const cpuSupported = await hasWattsonCpuSupport(ctx.engine);
        const gpuSupported = await hasWattsonGpuSupport(ctx.engine);
        // Short circuit if Wattson is not supported for this Perfetto trace
        if (!(markersSupported || cpuSupported || gpuSupported))
            return;
        const group = new workspace_1.TrackNode({ name: 'Wattson', isSummary: true });
        ctx.workspace.addChildInOrder(group);
        if (markersSupported) {
            await addWattsonMarkersElements(ctx, group);
        }
        if (cpuSupported) {
            await addWattsonCpuElements(ctx, group);
        }
        if (gpuSupported) {
            await addWattsonGpuElements(ctx, group);
        }
    }
}
exports.default = default_1;
class WattsonSubsystemEstimateTrack extends base_counter_track_1.BaseCounterTrack {
    queryKey;
    yRangeKey;
    constructor(trace, uri, queryKey, yRangeKey) {
        super(trace, uri);
        this.queryKey = queryKey;
        this.yRangeKey = yRangeKey;
    }
    async onInit() {
        await this.engine.query(`INCLUDE PERFETTO MODULE wattson.ui.continuous_estimates;`);
    }
    getDefaultCounterOptions() {
        const options = super.getDefaultCounterOptions();
        options.yRangeSharingKey = this.yRangeKey;
        options.unit = `mW`;
        return options;
    }
    getSqlSource() {
        return `
      SELECT ts, ${this.queryKey} AS value
      FROM _system_state_${this.queryKey}
    `;
    }
}
async function hasWattsonMarkersSupport(engine) {
    const checkValue = await engine.query(`
      INCLUDE PERFETTO MODULE wattson.utils;
      SELECT COUNT(*) as numRows from _wattson_markers_window
  `);
    return checkValue.firstRow({ numRows: query_result_1.NUM }).numRows > 0;
}
async function hasWattsonCpuSupport(engine) {
    // These tables are hard requirements and are the bare minimum needed for
    // Wattson to run, so check that these tables are populated
    const queryChecks = [
        `
    INCLUDE PERFETTO MODULE wattson.device_infos;
    SELECT COUNT(*) as numRows FROM _wattson_device
    `,
        `
    INCLUDE PERFETTO MODULE linux.cpu.frequency;
    SELECT COUNT(*) as numRows FROM cpu_frequency_counters
    `,
        `
    INCLUDE PERFETTO MODULE linux.cpu.idle;
    SELECT COUNT(*) as numRows FROM cpu_idle_counters
    `,
    ];
    for (const queryCheck of queryChecks) {
        const checkValue = await engine.query(queryCheck);
        if (checkValue.firstRow({ numRows: query_result_1.NUM }).numRows === 0)
            return false;
    }
    return true;
}
async function hasWattsonGpuSupport(engine) {
    // These tables are hard requirements and are the bare minimum needed for
    // Wattson to run, so check that these tables are populated
    const queryChecks = [
        `
    INCLUDE PERFETTO MODULE android.gpu.frequency;
    SELECT COUNT(*) as numRows FROM android_gpu_frequency
    `,
        `
    INCLUDE PERFETTO MODULE android.gpu.mali_power_state;
    SELECT COUNT(*) as numRows FROM android_mali_gpu_power_state
    `,
    ];
    for (const queryCheck of queryChecks) {
        const checkValue = await engine.query(queryCheck);
        if (checkValue.firstRow({ numRows: query_result_1.NUM }).numRows === 0)
            return false;
    }
    return true;
}
async function addWattsonMarkersElements(ctx, group) {
    const uri = `/wattson/markers_window`;
    const track = await (0, query_slice_track_1.createQuerySliceTrack)({
        trace: ctx,
        uri,
        data: {
            sqlSource: `SELECT ts, dur, name FROM _wattson_markers_window`,
        },
    });
    ctx.tracks.registerTrack({
        uri,
        tags: {
            kind: track_kinds_1.SLICE_TRACK_KIND,
        },
        renderer: track,
    });
    group.addChildInOrder(new workspace_1.TrackNode({ uri, name: 'Wattson markers window' }));
}
async function addWattsonCpuElements(ctx, group) {
    // ctx.traceInfo.cpus contains all cpus seen from all events. Filter the set
    // if it's seen in sched slices.
    const queryRes = await ctx.engine.query(`select distinct ucpu from sched order by ucpu;`);
    const ucpus = new Set();
    for (const it = queryRes.iter({ ucpu: query_result_1.NUM }); it.valid(); it.next()) {
        ucpus.add(it.ucpu);
    }
    // CPUs estimate as part of CPU subsystem
    const cpus = ctx.traceInfo.cpus.filter((cpu) => ucpus.has(cpu.ucpu));
    for (const cpu of cpus) {
        const queryKey = `cpu${cpu.ucpu}_mw`;
        const uri = `/wattson/cpu_subsystem_estimate_cpu${cpu.ucpu}`;
        ctx.tracks.registerTrack({
            uri,
            renderer: new WattsonSubsystemEstimateTrack(ctx, uri, queryKey, `CpuSubsystem`),
            tags: {
                kind: track_kinds_2.CPUSS_ESTIMATE_TRACK_KIND,
                wattson: `CPU${cpu.ucpu}`,
                groupName: `Wattson`,
            },
        });
        group.addChildInOrder(new workspace_1.TrackNode({
            uri,
            name: `Cpu${cpu.toString()} Estimate`,
        }));
    }
    const uri = `/wattson/cpu_subsystem_estimate_dsu_scu`;
    const title = `DSU/SCU Estimate`;
    ctx.tracks.registerTrack({
        uri,
        renderer: new WattsonSubsystemEstimateTrack(ctx, uri, `dsu_scu_mw`, `CpuSubsystem`),
        tags: {
            kind: track_kinds_2.CPUSS_ESTIMATE_TRACK_KIND,
            wattson: 'Dsu_Scu',
            groupName: `Wattson`,
        },
    });
    group.addChildInOrder(new workspace_1.TrackNode({ uri, name: title }));
    // Register selection aggregators.
    // NOTE: the registration order matters because the laste two aggregators
    // depend on views created by the first two.
    ctx.selection.registerAreaSelectionTab((0, aggregation_adapter_1.createAggregationTab)(ctx, new estimate_aggregator_1.WattsonEstimateSelectionAggregator()));
    ctx.selection.registerAreaSelectionTab((0, aggregation_adapter_1.createAggregationTab)(ctx, new thread_aggregator_1.WattsonThreadSelectionAggregator()));
    ctx.selection.registerAreaSelectionTab((0, aggregation_adapter_1.createAggregationTab)(ctx, new process_aggregator_1.WattsonProcessSelectionAggregator()));
    if (await isProcessMetadataPresent(ctx.engine)) {
        ctx.selection.registerAreaSelectionTab((0, aggregation_adapter_1.createAggregationTab)(ctx, new package_aggregator_1.WattsonPackageSelectionAggregator()));
    }
}
async function isProcessMetadataPresent(engine) {
    const packageInfo = await engine.query(`
    INCLUDE PERFETTO MODULE android.process_metadata;
    SELECT COUNT(*) as count FROM android_process_metadata
    WHERE package_name IS NOT NULL
  `);
    return packageInfo.firstRow({ count: query_result_1.NUM }).count > 0;
}
async function addWattsonGpuElements(ctx, group) {
    const id = `/wattson/gpu_subsystem_estimate`;
    ctx.tracks.registerTrack({
        uri: id,
        renderer: new WattsonSubsystemEstimateTrack(ctx, id, `gpu_mw`, `GpuSubsystem`),
        tags: {
            kind: track_kinds_2.GPUSS_ESTIMATE_TRACK_KIND,
            wattson: 'Gpu',
            groupName: `Wattson`,
        },
    });
    group.addChildInOrder(new workspace_1.TrackNode({ uri: id, name: `GPU Estimate` }));
}
//# sourceMappingURL=index.js.map