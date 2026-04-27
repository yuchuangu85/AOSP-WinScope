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
const cpu_profile_track_1 = require("./cpu_profile_track");
const utils_1 = require("../../public/utils");
const utils_2 = require("../../base/utils");
const workspace_1 = require("../../public/workspace");
const dev_perfetto_ProcessThreadGroups_1 = tslib_1.__importDefault(require("../dev.perfetto.ProcessThreadGroups"));
const selection_1 = require("../../public/selection");
const query_flamegraph_1 = require("../../components/query_flamegraph");
const flamegraph_1 = require("../../widgets/flamegraph");
const logging_1 = require("../../base/logging");
class default_1 {
    static id = 'dev.perfetto.CpuProfile';
    static dependencies = [dev_perfetto_ProcessThreadGroups_1.default];
    async onTraceLoad(ctx) {
        const result = await ctx.engine.query(`
      with thread_cpu_sample as (
        select distinct utid
        from cpu_profile_stack_sample
      )
      select
        utid,
        tid,
        upid,
        thread.name as threadName
      from thread_cpu_sample
      join thread using(utid)
      where not is_idle
    `);
        const it = result.iter({
            utid: query_result_1.NUM,
            upid: query_result_1.NUM_NULL,
            tid: query_result_1.NUM_NULL,
            threadName: query_result_1.STR_NULL,
        });
        for (; it.valid(); it.next()) {
            const utid = it.utid;
            const upid = it.upid;
            const threadName = it.threadName;
            const uri = `${(0, utils_1.getThreadUriPrefix)(upid, utid)}_cpu_samples`;
            ctx.tracks.registerTrack({
                uri,
                tags: {
                    kind: track_kinds_1.CPU_PROFILE_TRACK_KIND,
                    utid,
                    ...((0, utils_2.exists)(upid) && { upid }),
                },
                renderer: (0, cpu_profile_track_1.createCpuProfileTrack)(ctx, uri, utid),
            });
            const group = ctx.plugins
                .getPlugin(dev_perfetto_ProcessThreadGroups_1.default)
                .getGroupForThread(utid);
            const track = new workspace_1.TrackNode({
                uri,
                name: `${threadName} (CPU Stack Samples)`,
                sortOrder: -40,
            });
            group?.addChildInOrder(track);
        }
        ctx.selection.registerAreaSelectionTab(createAreaSelectionTab(ctx));
        ctx.onTraceReady.addListener(async () => {
            await selectCpuProfileCallsite(ctx);
        });
    }
}
exports.default = default_1;
function createAreaSelectionTab(trace) {
    let previousSelection;
    let flamegraph;
    return {
        id: 'cpu_profile_flamegraph',
        name: 'CPU Profile Sample Flamegraph',
        render(selection) {
            const changed = previousSelection === undefined ||
                !(0, selection_1.areaSelectionsEqual)(previousSelection, selection);
            if (changed) {
                flamegraph = computeCpuProfileFlamegraph(trace, selection);
                previousSelection = selection;
            }
            if (flamegraph === undefined) {
                return undefined;
            }
            return { isLoading: false, content: flamegraph.render() };
        },
    };
}
function computeCpuProfileFlamegraph(trace, selection) {
    const utids = [];
    for (const trackInfo of selection.tracks) {
        if (trackInfo?.tags?.kind === track_kinds_1.CPU_PROFILE_TRACK_KIND) {
            utids.push(trackInfo.tags?.utid);
        }
    }
    if (utids.length === 0) {
        return undefined;
    }
    const metrics = (0, query_flamegraph_1.metricsFromTableOrSubquery)(`
      (
        select
          id,
          parent_id as parentId,
          name,
          mapping_name,
          source_file || ':' || line_number as source_location,
          self_count
        from _callstacks_for_callsites!((
          select p.callsite_id
          from cpu_profile_stack_sample p
          where p.ts >= ${selection.start}
            and p.ts <= ${selection.end}
            and p.utid in (${utids.join(',')})
        ))
      )
    `, [
        {
            name: 'CPU Profile Samples',
            unit: '',
            columnName: 'self_count',
        },
    ], 'include perfetto module callstacks.stack_profile', [{ name: 'mapping_name', displayName: 'Mapping' }], [
        {
            name: 'source_location',
            displayName: 'Source Location',
            mergeAggregation: 'ONE_OR_SUMMARY',
        },
    ]);
    return new query_flamegraph_1.QueryFlamegraph(trace, metrics, {
        state: flamegraph_1.Flamegraph.createDefaultState(metrics),
    });
}
async function selectCpuProfileCallsite(trace) {
    const profile = await (0, logging_1.assertExists)(trace.engine).query(`
    select utid, upid
    from cpu_profile_stack_sample
    join thread using(utid)
    where callsite_id is not null and not is_idle
    order by ts desc
    limit 1
  `);
    if (profile.numRows() !== 1)
        return;
    const { utid, upid } = profile.firstRow({ utid: query_result_1.NUM, upid: query_result_1.NUM_NULL });
    // Create an area selection over the first process with a perf samples track
    trace.selection.selectArea({
        start: trace.traceInfo.start,
        end: trace.traceInfo.end,
        trackUris: [`${(0, utils_1.getThreadUriPrefix)(upid, utid)}_cpu_samples`],
    });
}
//# sourceMappingURL=index.js.map