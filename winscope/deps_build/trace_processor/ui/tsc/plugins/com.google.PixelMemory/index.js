"use strict";
// Copyright (C) 2024 The Android Open Source Project
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const debug_tracks_1 = require("../../components/tracks/debug_tracks");
const time_1 = require("../../base/time");
const query_result_1 = require("../../trace_processor/query_result");
const colorizer_1 = require("../../components/colorizer");
const sql_utils_1 = require("../../trace_processor/sql_utils");
const disposable_stack_1 = require("../../base/disposable_stack");
const CREATE_BREAKDOWN_TABLE_SQL = `
  DROP TABLE IF EXISTS process_memory_breakdown;
  CREATE VIRTUAL TABLE process_memory_breakdown
  USING
    SPAN_OUTER_JOIN(
      android_gpu_memory_per_process PARTITIONED upid,
      memory_rss_and_swap_per_process PARTITIONED upid
    );
`;
const MAX_AGGREGATED_PIDS = 5;
class default_1 {
    static id = 'com.google.PixelMemory';
    tablesInitialized = false;
    // Helper to set up the breakdown tables idempotently.
    async setupTables(ctx) {
        if (this.tablesInitialized) {
            return;
        }
        await ctx.engine.query('INCLUDE PERFETTO MODULE android.gpu.memory;');
        await ctx.engine.query('INCLUDE PERFETTO MODULE linux.memory.process;');
        await ctx.engine.query(CREATE_BREAKDOWN_TABLE_SQL);
        this.tablesInitialized = true;
    }
    // Helper to find the max value from a SQL query and add a note to the
    // timeline.
    async addMaxMemoryAnnotation(ctx, findMaxSql, noteTarget) {
        try {
            const maxResult = await ctx.engine.query(findMaxSql);
            // Using .firstRow() as LIMIT 1 is in the SQL
            if (maxResult.numRows() > 0) {
                const maxRow = maxResult.firstRow({ ts: query_result_1.NUM, value: query_result_1.NUM });
                const maxTs = BigInt(maxRow.ts);
                const maxValueInBytes = maxRow.value;
                const maxValueInKib = (maxValueInBytes / 1024.0).toFixed(2);
                const noteText = `${maxValueInKib} KiB : Max PID (${noteTarget})`;
                const color = (0, colorizer_1.randomColor)();
                ctx.notes.addNote({
                    timestamp: time_1.Time.fromRaw(maxTs),
                    text: noteText,
                    color,
                });
            }
        }
        catch (e) {
            console.error('Failed to add max memory annotation:', e);
        }
    }
    // Helper function to handle the aggregation logic for multiple PIDs.
    async createAggregatedTrackAndGetTable(ctx, id, pidList, sqlValueExpr, titleSuffix, pidsIdentifier, trash) {
        const runId = id.replace(/[#\.]/g, '_');
        const valueColNames = pidList.map((pid) => `value_${pid}`);
        const aggTableName = `__agg_${runId}`;
        // 1. Create a separate VIEW for each PID's memory data.
        const pidViews = [];
        for (let i = 0; i < pidList.length; i++) {
            const pid = pidList[i];
            const viewName = `__view_${runId}_${pid}`;
            const createViewAs = `
        SELECT
            ts,
            dur,
            (${sqlValueExpr}) AS ${valueColNames[i]}
        FROM process_memory_breakdown
        WHERE pid = ${pid};
      `;
            const view = await (0, sql_utils_1.createView)({
                engine: ctx.engine,
                name: viewName,
                as: createViewAs,
            });
            pidViews.push(view);
            trash.use(view);
        }
        const viewNames = pidViews.map((v) => v.name);
        // 2. Iteratively SPAN_OUTER_JOIN the views together.
        let previousTableName = viewNames[0];
        for (let i = 1; i < pidList.length; i++) {
            const newJoinedTableName = `__joined_${runId}_${i}`;
            const joinUsing = `SPAN_OUTER_JOIN(${previousTableName}, ${viewNames[i]})`;
            const joinedTable = await (0, sql_utils_1.createVirtualTable)({
                engine: ctx.engine,
                name: newJoinedTableName,
                using: joinUsing,
            });
            trash.use(joinedTable);
            previousTableName = joinedTable.name;
        }
        const finalSelectTable = previousTableName;
        const sumOfValues = valueColNames
            .map((col) => `IFNULL(${col}, 0)`)
            .join(' + ');
        // 3. Materialize the aggregated sum into a PERFETTO table
        const createAggTableAs = `
      SELECT
        CAST(ts AS BIGINT) AS ts,
        (${sumOfValues}) AS value
      FROM ${finalSelectTable}
      WHERE ts IS NOT NULL;
    `;
        const aggTable = await (0, sql_utils_1.createPerfettoTable)({
            engine: ctx.engine,
            name: aggTableName,
            as: createAggTableAs,
        });
        trash.use(aggTable);
        // 4. Add the debug track using the materialized aggregate table
        await (0, debug_tracks_1.addDebugCounterTrack)({
            trace: ctx,
            data: {
                sqlSource: `SELECT ts, value FROM ${aggTableName} ORDER BY ts`,
                columns: ['ts', 'value'],
            },
            title: `${pidsIdentifier}${titleSuffix}`,
        });
        // 5. Return the aggregate table name
        return aggTableName;
    }
    // Prepares the SQL and target name for the max memory annotation.
    async prepareAnnotationData(ctx, id, pidList, sqlValueExpr, titleSuffix, trash) {
        if (pidList.length > 1) {
            const pidsIdentifierForTracks = pidList.join('_');
            const noteTarget = pidList.join('+');
            const aggTableName = await this.createAggregatedTrackAndGetTable(ctx, id, pidList, sqlValueExpr, titleSuffix, pidsIdentifierForTracks, trash);
            const findMaxSql = `
        SELECT ts, value
        FROM ${aggTableName}
        WHERE value IS NOT NULL
        ORDER BY value DESC, ts ASC
        LIMIT 1
      `;
            return { findMaxSql, noteTarget };
        }
        else {
            // pidList.length === 1
            const noteTarget = pidList[0];
            const findMaxSql = `
        SELECT
          ts,
          (${sqlValueExpr}) AS value
        FROM process_memory_breakdown
        WHERE pid = ${pidList[0]} AND value IS NOT NULL
        ORDER BY value DESC, ts ASC
        LIMIT 1
      `;
            return { findMaxSql, noteTarget };
        }
    }
    // Helper to register a command that adds a memory counter track.
    registerMemoryCommand(ctx, id, name, sqlValueExpr, titleSuffix) {
        ctx.commands.registerCommand({
            id,
            name,
            callback: async (pids) => {
                const env_1 = { stack: [], error: void 0, hasError: false };
                try {
                    if (pids === undefined) {
                        const rawPids = await ctx.omnibox.prompt(`Enter up to ${MAX_AGGREGATED_PIDS} process pids, separated by commas (e.g. 1234, 5678)`);
                        if (rawPids === undefined)
                            return;
                        pids = rawPids;
                    }
                    const pidList = pids
                        .split(',')
                        .map((pid) => pid.trim())
                        .filter((pid) => pid);
                    if (pidList.length === 0) {
                        return;
                    }
                    if (pidList.length > MAX_AGGREGATED_PIDS) {
                        alert(`Please enter at most ${MAX_AGGREGATED_PIDS} PIDs. You entered ${pidList.length}.`);
                        return;
                    }
                    const trash = new disposable_stack_1.AsyncDisposableStack();
                    const _disposer = tslib_1.__addDisposableResource(env_1, trash, true);
                    try {
                        await this.setupTables(ctx);
                        // Add individual tracks for each PID.
                        for (const pid of pidList) {
                            await (0, debug_tracks_1.addDebugCounterTrack)({
                                trace: ctx,
                                data: {
                                    sqlSource: `
                  SELECT
                    ts,
                    (${sqlValueExpr}) AS value
                  FROM process_memory_breakdown
                  WHERE pid = ${pid}
                `,
                                    columns: ['ts', 'value'],
                                },
                                title: `${pid}${titleSuffix}`,
                            });
                        }
                        const { findMaxSql, noteTarget } = await this.prepareAnnotationData(ctx, id, pidList, sqlValueExpr, titleSuffix, trash);
                        await this.addMaxMemoryAnnotation(ctx, findMaxSql, noteTarget);
                    }
                    catch (e) {
                        console.error(`PixelMemory Plugin: Error in command ${id}:`, e);
                        alert(`PixelMemory Plugin Error: ${e instanceof Error ? e.message : e}`);
                    }
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
            },
        });
    }
    async onTraceLoad(ctx) {
        this.registerMemoryCommand(ctx, 'com.google.ShowPixelTotalMemory', 'Add tracks: show process total memory', 'COALESCE(rss_and_swap, 0) + COALESCE(gpu_memory, 0)', '_rss_anon_file_swap_shmem_gpu');
        this.registerMemoryCommand(ctx, 'com.google.ShowPixelRssAnonShmemSwapGpuMemory', 'Add tracks: show process total memory (excluding file RSS)', 'COALESCE(anon_rss_and_swap, 0) + COALESCE(shmem_rss, 0) + ' +
            'COALESCE(gpu_memory, 0)', '_rss_anon_shmem_swap_gpu');
    }
}
exports.default = default_1;
//# sourceMappingURL=index.js.map