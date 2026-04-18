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
const track_kinds_1 = require("../../public/track_kinds");
const query_result_1 = require("../../trace_processor/query_result");
const logging_1 = require("../../base/logging");
const instruments_samples_profile_track_1 = require("./instruments_samples_profile_track");
const utils_1 = require("../../public/utils");
const workspace_1 = require("../../public/workspace");
const dev_perfetto_ProcessThreadGroups_1 = tslib_1.__importDefault(require("../dev.perfetto.ProcessThreadGroups"));
const selection_1 = require("../../public/selection");
const query_flamegraph_1 = require("../../components/query_flamegraph");
const flamegraph_1 = require("../../widgets/flamegraph");
function makeUriForProc(upid) {
    return `/process_${upid}/instruments_samples_profile`;
}
class default_1 {
    static id = 'dev.perfetto.InstrumentsSamplesProfile';
    static dependencies = [dev_perfetto_ProcessThreadGroups_1.default];
    async onTraceLoad(ctx) {
        const pResult = await ctx.engine.query(`
      select distinct upid
      from instruments_sample
      join thread using (utid)
      where callsite_id is not null and upid is not null
    `);
        for (const it = pResult.iter({ upid: query_result_1.NUM }); it.valid(); it.next()) {
            const upid = it.upid;
            const uri = makeUriForProc(upid);
            const title = `Process Callstacks`;
            ctx.tracks.registerTrack({
                uri,
                title,
                tags: {
                    kind: track_kinds_1.INSTRUMENTS_SAMPLES_PROFILE_TRACK_KIND,
                    upid,
                },
                track: (0, instruments_samples_profile_track_1.createProcessInstrumentsSamplesProfileTrack)(ctx, uri, upid),
            });
            const group = ctx.plugins
                .getPlugin(dev_perfetto_ProcessThreadGroups_1.default)
                .getGroupForProcess(upid);
            const track = new workspace_1.TrackNode({ uri, title, sortOrder: -40 });
            group?.addChildInOrder(track);
        }
        const tResult = await ctx.engine.query(`
      select distinct
        utid,
        tid,
        thread.name as threadName,
        upid
      from instruments_sample
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
            const uri = `${(0, utils_1.getThreadUriPrefix)(upid, utid)}_instruments_samples_profile`;
            ctx.tracks.registerTrack({
                uri,
                title,
                tags: {
                    kind: track_kinds_1.INSTRUMENTS_SAMPLES_PROFILE_TRACK_KIND,
                    utid,
                    upid: upid ?? undefined,
                },
                track: (0, instruments_samples_profile_track_1.createThreadInstrumentsSamplesProfileTrack)(ctx, uri, utid),
            });
            const group = ctx.plugins
                .getPlugin(dev_perfetto_ProcessThreadGroups_1.default)
                .getGroupForThread(utid);
            const track = new workspace_1.TrackNode({ uri, title, sortOrder: -50 });
            group?.addChildInOrder(track);
        }
        ctx.onTraceReady.addListener(async () => {
            await selectInstrumentsSample(ctx);
        });
        ctx.selection.registerAreaSelectionTab(createAreaSelectionTab(ctx));
    }
}
exports.default = default_1;
async function selectInstrumentsSample(ctx) {
    const profile = await (0, logging_1.assertExists)(ctx.engine).query(`
    select upid
    from instruments_sample
    join thread using (utid)
    where callsite_id is not null
    order by ts desc
    limit 1
  `);
    if (profile.numRows() !== 1)
        return;
    const row = profile.firstRow({ upid: query_result_1.NUM });
    const upid = row.upid;
    // Create an area selection over the first process with a instruments samples track
    ctx.selection.selectArea({
        start: ctx.traceInfo.start,
        end: ctx.traceInfo.end,
        trackUris: [makeUriForProc(upid)],
    });
}
function createAreaSelectionTab(trace) {
    let previousSelection;
    let flamegraph;
    return {
        id: 'instruments_sample_flamegraph',
        name: 'Instruments Sample Flamegraph',
        render(selection) {
            const changed = previousSelection === undefined ||
                !(0, selection_1.areaSelectionsEqual)(previousSelection, selection);
            if (changed) {
                flamegraph = computeInstrumentsSampleFlamegraph(trace, selection);
                previousSelection = selection;
            }
            if (flamegraph === undefined) {
                return undefined;
            }
            return { isLoading: false, content: flamegraph.render() };
        },
    };
}
function computeInstrumentsSampleFlamegraph(trace, currentSelection) {
    const upids = getUpidsFromInstrumentsSampleAreaSelection(currentSelection);
    const utids = getUtidsFromInstrumentsSampleAreaSelection(currentSelection);
    if (utids.length === 0 && upids.length === 0) {
        return undefined;
    }
    const metrics = (0, query_flamegraph_1.metricsFromTableOrSubquery)(`
      (
        select id, parent_id as parentId, name, self_count
        from _callstacks_for_callsites!((
          select p.callsite_id
          from instruments_sample p
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
            name: 'Instruments Samples',
            unit: '',
            columnName: 'self_count',
        },
    ], 'include perfetto module appleos.instruments.samples');
    return new query_flamegraph_1.QueryFlamegraph(trace, metrics, {
        state: flamegraph_1.Flamegraph.createDefaultState(metrics),
    });
}
function getUpidsFromInstrumentsSampleAreaSelection(currentSelection) {
    const upids = [];
    for (const trackInfo of currentSelection.tracks) {
        if (trackInfo?.tags?.kind === track_kinds_1.INSTRUMENTS_SAMPLES_PROFILE_TRACK_KIND &&
            trackInfo.tags?.utid === undefined) {
            upids.push((0, logging_1.assertExists)(trackInfo.tags?.upid));
        }
    }
    return upids;
}
function getUtidsFromInstrumentsSampleAreaSelection(currentSelection) {
    const utids = [];
    for (const trackInfo of currentSelection.tracks) {
        if (trackInfo?.tags?.kind === track_kinds_1.INSTRUMENTS_SAMPLES_PROFILE_TRACK_KIND &&
            trackInfo.tags?.utid !== undefined) {
            utids.push(trackInfo.tags?.utid);
        }
    }
    return utids;
}
//# sourceMappingURL=index.js.map