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
const query_flamegraph_1 = require("../../components/query_flamegraph");
const selection_1 = require("../../public/selection");
const track_kinds_1 = require("../../public/track_kinds");
const utils_1 = require("../../public/utils");
const workspace_1 = require("../../public/workspace");
const query_result_1 = require("../../trace_processor/query_result");
const flamegraph_1 = require("../../widgets/flamegraph");
const dev_perfetto_ProcessThreadGroups_1 = tslib_1.__importDefault(require("../dev.perfetto.ProcessThreadGroups"));
const dev_perfetto_StandardGroups_1 = tslib_1.__importDefault(require("../dev.perfetto.StandardGroups"));
const dev_perfetto_TraceProcessorTrack_1 = tslib_1.__importDefault(require("../dev.perfetto.TraceProcessorTrack"));
const trace_processor_counter_track_1 = require("../dev.perfetto.TraceProcessorTrack/trace_processor_counter_track");
const perf_samples_profile_track_1 = require("./perf_samples_profile_track");
function makeUriForProc(upid) {
    return `/process_${upid}/perf_samples_profile`;
}
class default_1 {
    static id = 'dev.perfetto.LinuxPerf';
    static dependencies = [
        dev_perfetto_ProcessThreadGroups_1.default,
        dev_perfetto_StandardGroups_1.default,
        dev_perfetto_TraceProcessorTrack_1.default,
    ];
    async onTraceLoad(trace) {
        await this.addProcessPerfSamplesTracks(trace);
        await this.addThreadPerfSamplesTracks(trace);
        await this.addPerfCounterTracks(trace);
        trace.onTraceReady.addListener(async () => {
            await selectPerfSample(trace);
        });
    }
    async addProcessPerfSamplesTracks(trace) {
        const pResult = await trace.engine.query(`
      select distinct upid
      from perf_sample
      join thread using (utid)
      where callsite_id is not null and upid is not null
    `);
        for (const it = pResult.iter({ upid: query_result_1.NUM }); it.valid(); it.next()) {
            const upid = it.upid;
            const uri = makeUriForProc(upid);
            const title = `Process Callstacks`;
            trace.tracks.registerTrack({
                uri,
                title,
                tags: {
                    kind: track_kinds_1.PERF_SAMPLES_PROFILE_TRACK_KIND,
                    upid,
                },
                track: (0, perf_samples_profile_track_1.createProcessPerfSamplesProfileTrack)(trace, uri, upid),
            });
            const group = trace.plugins
                .getPlugin(dev_perfetto_ProcessThreadGroups_1.default)
                .getGroupForProcess(upid);
            const track = new workspace_1.TrackNode({ uri, title, sortOrder: -40 });
            group?.addChildInOrder(track);
        }
    }
    async addThreadPerfSamplesTracks(trace) {
        const tResult = await trace.engine.query(`
      select distinct
        utid,
        tid,
        thread.name as threadName,
        upid
      from perf_sample
      join thread using (utid)
      where callsite_id is not null
    `);
        for (const it = tResult.iter({
            utid: query_result_1.NUM,
            tid: query_result_1.NUM,
            threadName: query_result_1.STR_NULL,
            upid: query_result_1.NUM_NULL,
        }); it.valid(); it.next()) {
            const { threadName, utid, tid, upid } = it;
            const title = threadName === null
                ? `Thread Callstacks ${tid}`
                : `${threadName} Callstacks ${tid}`;
            const uri = `${(0, utils_1.getThreadUriPrefix)(upid, utid)}_perf_samples_profile`;
            trace.tracks.registerTrack({
                uri,
                title,
                tags: {
                    kind: track_kinds_1.PERF_SAMPLES_PROFILE_TRACK_KIND,
                    utid,
                    upid: upid ?? undefined,
                },
                track: (0, perf_samples_profile_track_1.createThreadPerfSamplesProfileTrack)(trace, uri, utid),
            });
            const group = trace.plugins
                .getPlugin(dev_perfetto_ProcessThreadGroups_1.default)
                .getGroupForThread(utid);
            const track = new workspace_1.TrackNode({ uri, title, sortOrder: -50 });
            group?.addChildInOrder(track);
        }
    }
    async addPerfCounterTracks(trace) {
        const perfCountersGroup = new workspace_1.TrackNode({
            title: 'Perf Counters',
            isSummary: true,
        });
        const result = await trace.engine.query(`
      select
        id,
        name,
        unit,
        extract_arg(dimension_arg_set_id, 'cpu') as cpu
      from counter_track
      where type = 'perf_counter'
      order by name, cpu
    `);
        const it = result.iter({
            id: query_result_1.NUM,
            name: query_result_1.STR_NULL,
            unit: query_result_1.STR_NULL,
            cpu: query_result_1.NUM, // Perf counters always have a cpu dimension
        });
        for (; it.valid(); it.next()) {
            const { id: trackId, name, unit, cpu } = it;
            const uri = `/counter_${trackId}`;
            const title = `Cpu ${cpu} ${name}`;
            trace.tracks.registerTrack({
                uri,
                title,
                tags: {
                    kind: track_kinds_1.COUNTER_TRACK_KIND,
                    trackIds: [trackId],
                    cpu,
                },
                track: new trace_processor_counter_track_1.TraceProcessorCounterTrack(trace, uri, {
                    yMode: 'rate', // Default to rate mode
                    unit: unit ?? undefined,
                }, trackId, title),
            });
            const trackNode = new workspace_1.TrackNode({
                uri,
                title,
            });
            perfCountersGroup.addChildLast(trackNode);
        }
        if (perfCountersGroup.hasChildren) {
            const hardwareGroup = trace.plugins
                .getPlugin(dev_perfetto_StandardGroups_1.default)
                .getOrCreateStandardGroup(trace.workspace, 'HARDWARE');
            hardwareGroup.addChildInOrder(perfCountersGroup);
        }
        trace.selection.registerAreaSelectionTab(createAreaSelectionTab(trace));
    }
}
exports.default = default_1;
async function selectPerfSample(trace) {
    const profile = await (0, logging_1.assertExists)(trace.engine).query(`
    select upid
    from perf_sample
    join thread using (utid)
    where callsite_id is not null
    order by ts desc
    limit 1
  `);
    if (profile.numRows() !== 1)
        return;
    const row = profile.firstRow({ upid: query_result_1.NUM });
    const upid = row.upid;
    // Create an area selection over the first process with a perf samples track
    trace.selection.selectArea({
        start: trace.traceInfo.start,
        end: trace.traceInfo.end,
        trackUris: [makeUriForProc(upid)],
    });
}
function createAreaSelectionTab(trace) {
    let previousSelection;
    let flamegraph;
    return {
        id: 'perf_sample_flamegraph',
        name: 'Perf Sample Flamegraph',
        render(selection) {
            const changed = previousSelection === undefined ||
                !(0, selection_1.areaSelectionsEqual)(previousSelection, selection);
            if (changed) {
                flamegraph = computePerfSampleFlamegraph(trace, selection);
                previousSelection = selection;
            }
            if (flamegraph === undefined) {
                return undefined;
            }
            return { isLoading: false, content: flamegraph.render() };
        },
    };
}
function getUpidsFromPerfSampleAreaSelection(currentSelection) {
    const upids = [];
    for (const trackInfo of currentSelection.tracks) {
        if (trackInfo?.tags?.kind === track_kinds_1.PERF_SAMPLES_PROFILE_TRACK_KIND &&
            trackInfo.tags?.utid === undefined) {
            upids.push((0, logging_1.assertExists)(trackInfo.tags?.upid));
        }
    }
    return upids;
}
function getUtidsFromPerfSampleAreaSelection(currentSelection) {
    const utids = [];
    for (const trackInfo of currentSelection.tracks) {
        if (trackInfo?.tags?.kind === track_kinds_1.PERF_SAMPLES_PROFILE_TRACK_KIND &&
            trackInfo.tags?.utid !== undefined) {
            utids.push(trackInfo.tags?.utid);
        }
    }
    return utids;
}
function computePerfSampleFlamegraph(trace, currentSelection) {
    const upids = getUpidsFromPerfSampleAreaSelection(currentSelection);
    const utids = getUtidsFromPerfSampleAreaSelection(currentSelection);
    if (utids.length === 0 && upids.length === 0) {
        return undefined;
    }
    const metrics = (0, query_flamegraph_1.metricsFromTableOrSubquery)(`
      (
        select id, parent_id as parentId, name, self_count
        from _callstacks_for_callsites!((
          select p.callsite_id
          from perf_sample p
          join thread t using (utid)
          where p.ts >= ${currentSelection.start}
            and p.ts <= ${currentSelection.end}
            and (
              p.utid in (${utids.join(',')})
              or t.upid in (${upids.join(',')})
            )
        ))
      )
    `, [
        {
            name: 'Perf Samples',
            unit: '',
            columnName: 'self_count',
        },
    ], 'include perfetto module linux.perf.samples');
    return new query_flamegraph_1.QueryFlamegraph(trace, metrics, {
        state: flamegraph_1.Flamegraph.createDefaultState(metrics),
    });
}
//# sourceMappingURL=index.js.map