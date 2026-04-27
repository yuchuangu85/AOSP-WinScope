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
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const array_utils_1 = require("../../base/array_utils");
const semantic_icons_1 = require("../../base/semantic_icons");
const time_1 = require("../../base/time");
const aggregation_adapter_1 = require("../../components/aggregation_adapter");
const track_kinds_1 = require("../../public/track_kinds");
const utils_1 = require("../../public/utils");
const workspace_1 = require("../../public/workspace");
const query_result_1 = require("../../trace_processor/query_result");
const query_utils_1 = require("../../trace_processor/query_utils");
const sql_utils_1 = require("../../trace_processor/sql_utils");
const anchor_1 = require("../../widgets/anchor");
const dev_perfetto_ProcessThreadGroups_1 = tslib_1.__importDefault(require("../dev.perfetto.ProcessThreadGroups"));
const dev_perfetto_Thread_1 = tslib_1.__importDefault(require("../dev.perfetto.Thread"));
const active_cpu_count_1 = require("./active_cpu_count");
const common_1 = require("./common");
const cpu_slice_by_process_selection_aggregator_1 = require("./cpu_slice_by_process_selection_aggregator");
const cpu_slice_selection_aggregator_1 = require("./cpu_slice_selection_aggregator");
const cpu_slice_track_1 = require("./cpu_slice_track");
const thread_count_1 = require("./thread_count");
const thread_state_selection_aggregator_1 = require("./thread_state_selection_aggregator");
const thread_state_track_1 = require("./thread_state_track");
const waker_overlay_1 = require("./waker_overlay");
function uriForThreadStateTrack(upid, utid) {
    return `${(0, utils_1.getThreadUriPrefix)(upid, utid)}_state`;
}
function uriForActiveCPUCountTrack(cpuType) {
    const prefix = `/active_cpus`;
    if (cpuType !== undefined) {
        return `${prefix}_${cpuType}`;
    }
    else {
        return prefix;
    }
}
class default_1 {
    static id = 'dev.perfetto.Sched';
    static dependencies = [dev_perfetto_ProcessThreadGroups_1.default, dev_perfetto_Thread_1.default];
    async onTraceLoad(ctx) {
        const hasSched = await this.hasSched(ctx.engine);
        if (!hasSched) {
            return;
        }
        await this.addCpuSliceTracks(ctx);
        await this.addThreadStateTracks(ctx);
        await this.addMinimapProvider(ctx);
        this.addSchedulingSummaryTracks(ctx);
        ctx.commands.registerCommand({
            id: 'dev.perfetto.SelectAllThreadStateTracks',
            name: 'Select all thread state tracks',
            callback: () => {
                const tracks = ctx.tracks
                    .getAllTracks()
                    .filter((t) => t.tags?.kind === track_kinds_1.THREAD_STATE_TRACK_KIND);
                ctx.selection.selectArea({
                    trackUris: tracks.map((t) => t.uri),
                    start: ctx.traceInfo.start,
                    end: ctx.traceInfo.end,
                });
            },
        });
        ctx.search.registerSearchProvider({
            name: 'Sched Slices',
            selectTracks(tracks) {
                return tracks
                    .filter((t) => t.tags?.kind === track_kinds_1.CPU_SLICE_TRACK_KIND)
                    .filter((track) => track.renderer.getDataset?.()?.implements({ utid: query_result_1.NUM_NULL }));
            },
            async getSearchFilter(searchTerm) {
                // Look up all the utids of threads and processes that match the search
                // term, and return a filter on those utids.
                const searchLiteral = (0, query_utils_1.escapeSearchQuery)(searchTerm);
                const utidRes = await ctx.engine.query(`
          SELECT utid
          FROM thread
          JOIN process USING(upid)
          WHERE
            thread.name GLOB ${searchLiteral} OR
            process.name GLOB ${searchLiteral}
        `);
                const utids = [];
                for (const it = utidRes.iter({ utid: query_result_1.NUM }); it.valid(); it.next()) {
                    utids.push(it.utid);
                }
                return {
                    where: `utid IN (${utids.join()})`,
                };
            },
        });
    }
    async addCpuSliceTracks(ctx) {
        ctx.selection.registerAreaSelectionTab((0, aggregation_adapter_1.createAggregationTab)(ctx, new cpu_slice_selection_aggregator_1.CpuSliceSelectionAggregator()));
        ctx.selection.registerAreaSelectionTab((0, aggregation_adapter_1.createAggregationTab)(ctx, new cpu_slice_by_process_selection_aggregator_1.CpuSliceByProcessSelectionAggregator()));
        // ctx.traceInfo.cpus contains all cpus seen from all events. Filter the set
        // if it's seen in sched slices.
        const queryRes = await ctx.engine.query(`select distinct ucpu from sched order by ucpu;`);
        const ucpus = new Set();
        for (const it = queryRes.iter({ ucpu: query_result_1.NUM }); it.valid(); it.next()) {
            ucpus.add(it.ucpu);
        }
        const cpus = ctx.traceInfo.cpus.filter((cpu) => ucpus.has(cpu.ucpu));
        const cpuToClusterType = await this.getAndroidCpuClusterTypes(ctx.engine);
        const group = new workspace_1.TrackNode({
            name: 'CPU Scheduling',
            sortOrder: -50,
            isSummary: true,
            collapsed: false,
        });
        for (const cpu of cpus) {
            const uri = (0, common_1.uriForSchedTrack)(cpu.ucpu);
            const size = cpuToClusterType.get(cpu.cpu);
            const sizeStr = size === undefined ? `` : ` (${size})`;
            const name = `CPU ${cpu.cpu} Scheduling${sizeStr}${cpu.maybeMachineLabel()}`;
            const threads = ctx.plugins.getPlugin(dev_perfetto_Thread_1.default).getThreadMap();
            ctx.tracks.registerTrack({
                description: () => {
                    return (0, mithril_1.default)('', [
                        `Shows which threads were running on CPU ${cpu.toString()} over time.`,
                        (0, mithril_1.default)('br'),
                        (0, mithril_1.default)(anchor_1.Anchor, {
                            href: 'https://perfetto.dev/docs/data-sources/cpu-scheduling',
                            target: '_blank',
                            icon: semantic_icons_1.Icons.ExternalLink,
                        }, 'Documentation'),
                    ]);
                },
                uri,
                tags: {
                    kind: track_kinds_1.CPU_SLICE_TRACK_KIND,
                    cpu: cpu.ucpu,
                },
                renderer: new cpu_slice_track_1.CpuSliceTrack(ctx, uri, cpu, threads),
            });
            group.addChildInOrder(new workspace_1.TrackNode({ name, uri }));
        }
        if (group.children.length > 0) {
            ctx.workspace.addChildInOrder(group);
        }
        ctx.tracks.registerOverlay(new waker_overlay_1.WakerOverlay(ctx));
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
    async getCpus(engine) {
        const result = await engine.query(`
      SELECT DISTINCT
        ucpu
      FROM sched
    `);
        const it = result.iter({ ucpu: query_result_1.NUM });
        const cpus = [];
        for (; it.valid(); it.next()) {
            cpus.push(it.ucpu);
        }
        return cpus;
    }
    async addThreadStateTracks(ctx) {
        const { engine } = ctx;
        ctx.selection.registerAreaSelectionTab((0, aggregation_adapter_1.createAggregationTab)(ctx, new thread_state_selection_aggregator_1.ThreadStateSelectionAggregator()));
        const result = await engine.query(`
      include perfetto module viz.threads;
      include perfetto module viz.summary.threads;
      include perfetto module sched.states;

      select
        utid,
        t.upid,
        tid,
        t.name as threadName,
        is_main_thread as isMainThread,
        is_kernel_thread as isKernelThread
      from _threads_with_kernel_flag t
      join _sched_summary using (utid)
    `);
        const it = result.iter({
            utid: query_result_1.NUM,
            upid: query_result_1.NUM_NULL,
            tid: query_result_1.NUM_NULL,
            threadName: query_result_1.STR_NULL,
            isMainThread: query_result_1.NUM_NULL,
            isKernelThread: query_result_1.NUM,
        });
        for (; it.valid(); it.next()) {
            const { utid, upid, tid, threadName, isMainThread, isKernelThread } = it;
            const title = (0, utils_1.getTrackName)({
                utid,
                tid,
                threadName,
                kind: track_kinds_1.THREAD_STATE_TRACK_KIND,
            });
            const uri = uriForThreadStateTrack(upid, utid);
            ctx.tracks.registerTrack({
                uri,
                description: () => {
                    return (0, mithril_1.default)('', [
                        `Shows the scheduling state of the thread over time, e.g. Running, Runnable, Sleeping.`,
                        (0, mithril_1.default)('br'),
                        (0, mithril_1.default)(anchor_1.Anchor, {
                            href: 'https://perfetto.dev/docs/data-sources/cpu-scheduling',
                            target: '_blank',
                            icon: semantic_icons_1.Icons.ExternalLink,
                        }, 'Documentation'),
                    ]);
                },
                tags: {
                    kind: track_kinds_1.THREAD_STATE_TRACK_KIND,
                    utid,
                    upid: upid ?? undefined,
                    ...(isKernelThread === 1 && { kernelThread: true }),
                },
                chips: (0, array_utils_1.removeFalsyValues)([
                    isKernelThread === 0 && isMainThread === 1 && 'main thread',
                ]),
                renderer: (0, thread_state_track_1.createThreadStateTrack)(ctx, uri, utid),
            });
            const group = ctx.plugins
                .getPlugin(dev_perfetto_ProcessThreadGroups_1.default)
                .getGroupForThread(utid);
            const track = new workspace_1.TrackNode({ uri, name: title, sortOrder: 10 });
            group?.addChildInOrder(track);
        }
    }
    async addMinimapProvider(trace) {
        trace.minimap.registerContentProvider({
            priority: 2, // Higher priority than the default slices minimap
            getData: async (_, resolution) => {
                const start = trace.traceInfo.start;
                const end = trace.traceInfo.end;
                const cpus = await this.getCpus(trace.engine);
                const rows = [];
                const intervals = [];
                for (let i = start; i < end; i += resolution) {
                    intervals.push(i);
                }
                const values = intervals
                    .map((ts, index) => `(${index}, ${ts}, ${resolution})`)
                    .join();
                const intervalsTableName = '__minimap_sched_intervals';
                await trace.engine.query(`
          CREATE TABLE ${intervalsTableName} (
            id INTEGER PRIMARY KEY,
            ts INTEGER,
            dur INTEGER
          );

          INSERT INTO ${intervalsTableName} (id, ts, dur)
          values ${values}
        `);
                for (const cpu of cpus) {
                    const env_1 = { stack: [], error: void 0, hasError: false };
                    try {
                        // TODO(stevegolton): Obtain source data from the track's datasets
                        // instead of repeating it here?
                        const schedTableName = '__sched_per_cpu';
                        const _schedTable = tslib_1.__addDisposableResource(env_1, await (0, sql_utils_1.createPerfettoTable)({
                            engine: trace.engine,
                            name: schedTableName,
                            as: `
              SELECT
                *
              FROM sched
              WHERE
                dur > 0 AND
                ucpu = ${cpu} AND
                NOT utid IN (SELECT utid FROM thread WHERE is_idle)
            `,
                        }), true);
                        const entireQuery = `
            SELECT
              id_1 AS bucketId,
              CAST(SUM(ii.dur) AS FLOAT)/${resolution} AS load,
              intervals.ts AS ts,
              intervals.dur AS dur
            FROM _interval_intersect!((${schedTableName}, ${intervalsTableName}), ()) ii
            JOIN ${intervalsTableName} intervals ON (id_1 = intervals.id)
            GROUP BY id_1;
          `;
                        const results = await trace.engine.query(entireQuery);
                        const iter = results.iter({
                            load: query_result_1.NUM,
                            ts: query_result_1.LONG,
                            dur: query_result_1.LONG,
                        });
                        const loads = [];
                        for (; iter.valid(); iter.next()) {
                            loads.push({
                                load: iter.load,
                                ts: time_1.Time.fromRaw(iter.ts),
                                dur: iter.dur,
                            });
                        }
                        rows.push(loads);
                    }
                    catch (e_1) {
                        env_1.error = e_1;
                        env_1.hasError = true;
                    }
                    finally {
                        const result_1 = tslib_1.__disposeResources(env_1);
                        if (result_1)
                            await result_1;
                    }
                }
                return rows;
            },
        });
    }
    async hasSched(engine) {
        const result = await engine.query(`SELECT ts FROM sched LIMIT 1`);
        return result.numRows() > 0;
    }
    addSchedulingSummaryTracks(ctx) {
        const summaryGroup = new workspace_1.TrackNode({ name: 'Scheduler', isSummary: true });
        ctx.workspace.addChildInOrder(summaryGroup);
        const runnableThreadCountTitle = 'Runnable thread count';
        const runnableThreadCountUri = `/runnable_thread_count`;
        ctx.tracks.registerTrack({
            uri: runnableThreadCountUri,
            renderer: new thread_count_1.RunnableThreadCountTrack(ctx, runnableThreadCountUri),
        });
        const runnableThreadCountTrackNode = new workspace_1.TrackNode({
            name: runnableThreadCountTitle,
            uri: runnableThreadCountUri,
        });
        summaryGroup.addChildLast(runnableThreadCountTrackNode);
        // This command only pins the track but the name remains for legacy reasons
        ctx.commands.registerCommand({
            id: 'dev.perfetto.Sched.AddRunnableThreadCountTrackCommand',
            name: `Add track: ${runnableThreadCountTitle.toLowerCase()}`,
            callback: () => runnableThreadCountTrackNode.pin(),
        });
        const uninterruptibleSleepThreadCountUri = '/uninterruptible_sleep_thread_count';
        const uninterruptibleSleepThreadCountTitle = 'Uninterruptible Sleep thread count';
        ctx.tracks.registerTrack({
            uri: uninterruptibleSleepThreadCountUri,
            renderer: new thread_count_1.UninterruptibleSleepThreadCountTrack(ctx, uninterruptibleSleepThreadCountUri),
        });
        const uninterruptibleSleepThreadCountTrackNode = new workspace_1.TrackNode({
            name: uninterruptibleSleepThreadCountTitle,
            uri: uninterruptibleSleepThreadCountUri,
        });
        summaryGroup.addChildLast(uninterruptibleSleepThreadCountTrackNode);
        ctx.commands.registerCommand({
            id: 'dev.perfetto.Sched.AddUninterruptibleSleepThreadCountTrackCommand',
            name: 'Add track: uninterruptible sleep thread count',
            callback: () => uninterruptibleSleepThreadCountTrackNode.pin(),
        });
        const activeCpuCountUri = uriForActiveCPUCountTrack();
        const activeCpuCountTitle = 'Active CPU count';
        ctx.tracks.registerTrack({
            uri: activeCpuCountUri,
            renderer: new active_cpu_count_1.ActiveCPUCountTrack({ trackUri: activeCpuCountUri }, ctx),
        });
        const activeCpuCountTrackNode = new workspace_1.TrackNode({
            name: activeCpuCountTitle,
            uri: activeCpuCountUri,
        });
        summaryGroup.addChildLast(activeCpuCountTrackNode);
        ctx.commands.registerCommand({
            id: 'dev.perfetto.Sched.AddActiveCPUCountTrackCommand',
            name: 'Add track: active CPU count',
            callback: () => activeCpuCountTrackNode.pin(),
        });
        for (const cpuType of Object.values(active_cpu_count_1.CPUType)) {
            const activeCpuTypeCountUri = uriForActiveCPUCountTrack(cpuType);
            const activeCpuTypeCountTitle = `Active CPU count: ${cpuType}`;
            ctx.tracks.registerTrack({
                uri: activeCpuTypeCountUri,
                renderer: new active_cpu_count_1.ActiveCPUCountTrack({ trackUri: activeCpuTypeCountUri }, ctx, cpuType),
            });
            const activeCpuTypeCountTrackNode = new workspace_1.TrackNode({
                name: activeCpuTypeCountTitle,
                uri: activeCpuTypeCountUri,
            });
            activeCpuCountTrackNode.addChildLast(activeCpuTypeCountTrackNode);
            ctx.commands.registerCommand({
                id: `dev.perfetto.Sched.AddActiveCPUCountTrackCommand.${cpuType}`,
                name: `Add track: active ${cpuType} CPU count`,
                callback: () => activeCpuTypeCountTrackNode.pin(),
            });
        }
    }
}
exports.default = default_1;
//# sourceMappingURL=index.js.map