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
exports.addDebugSliceTrack = addDebugSliceTrack;
exports.addDebugCounterTrack = addDebugCounterTrack;
const workspace_1 = require("../../public/workspace");
const dataset_1 = require("../../trace_processor/dataset");
const query_result_1 = require("../../trace_processor/query_result");
const sql_utils_1 = require("../../trace_processor/sql_utils");
const dataset_slice_track_1 = require("./dataset_slice_track");
const debug_slice_track_details_panel_1 = require("./debug_slice_track_details_panel");
const query_counter_track_1 = require("./query_counter_track");
let trackCounter = 0; // For reproducible ids.
function getUniqueTrackCounter() {
    return trackCounter++;
}
/**
 * Adds a new debug slice track to the workspace.
 *
 * A debug slice track is a track based on a query which is:
 * - Based on a query.
 * - Uses automatic slice layout.
 * - Automatically added to the top of the current workspace.
 * - Pinned.
 * - Has a close button to remove it.
 *
 * @param args - Args to pass to the trace.
 * @param args.trace - The trace to use.
 * @param args.data.sqlSource - The query to run.
 * @param args.data.columns - Optional: Override columns.
 * @param args.title - Optional: Title for the track. If pivotOn is supplied,
 * this will be used as the root title for each track, but each title will have
 * the value appended.
 * @param args.columns - Optional: The columns names to use for the various
 * essential column names.
 * @param args.argColumns - Optional: A list of columns which are passed to the
 * details panel.
 * @param args.pivotOn - Optional: The name of a column on which to pivot. If
 * provided, we will create N tracks, one for each distinct value of the pivotOn
 * column. Each track will only show the slices which have the corresponding
 * value in their pivotOn column.
 */
async function addDebugSliceTrack(args) {
    const tableId = getUniqueTrackCounter();
    const tableName = `__debug_track_${tableId}`;
    const titleBase = args.title?.trim() || `Debug Slice Track ${tableId}`;
    const uriBase = `debug.track${tableId}`;
    // Create a table for this query before doing anything
    await createTableForSliceTrack(args.trace.engine, tableName, args.data, args.columns, args.argColumns, args.pivotOn, args.argSetIdColumn);
    if (args.pivotOn) {
        await addPivotedSliceTracks(args.trace, tableName, titleBase, uriBase, args.pivotOn);
    }
    else {
        addSingleSliceTrack(args.trace, tableName, titleBase, uriBase, args.argSetIdColumn);
    }
}
async function createTableForSliceTrack(engine, tableName, data, columns = {}, argColumns, pivotCol, argSetIdColumn) {
    const { ts = 'ts', dur = 'dur', name = 'name' } = columns;
    // If the view has clashing names (e.g. "name" coming from joining two
    // different tables, we will see names like "name_1", "name_2", but they
    // won't be addressable from the SQL. So we explicitly name them through a
    // list of columns passed to CTE.
    const dataColumns = data.columns !== undefined ? `(${data.columns.join(', ')})` : '';
    const cols = [
        `${ts} as ts`,
        `ifnull(cast(${dur} as int), -1) as dur`,
        `printf('%s', ${name}) as name`,
        argColumns && argColumns.map((c) => `${c} as ${debug_slice_track_details_panel_1.RAW_PREFIX}${c}`),
        pivotCol && `${pivotCol} as pivot`,
        argSetIdColumn && `${argSetIdColumn} as arg_set_id`,
    ]
        .flat() // Convert to flattened list
        .filter(Boolean) // Remove falsy values
        .join(',');
    const query = `
    with data${dataColumns} as (
      ${data.sqlSource}
    ),
    prepared_data as (
      select ${cols}
      from data
    )
    select
      row_number() over (order by ts) as id,
      *
    from prepared_data
    order by ts
  `;
    return await (0, sql_utils_1.createPerfettoTable)({ engine, name: tableName, as: query });
}
async function addPivotedSliceTracks(trace, tableName, titleBase, uriBase, pivotColName) {
    const result = await trace.engine.query(`
    SELECT DISTINCT pivot
    FROM ${tableName}
    ORDER BY pivot
  `);
    let trackCount = 0;
    for (const iter = result.iter({}); iter.valid(); iter.next()) {
        const uri = `${uriBase}_${trackCount++}`;
        const pivotValue = iter.get('pivot');
        const name = `${titleBase}: ${pivotColName} = ${(0, sql_utils_1.sqlValueToReadableString)(pivotValue)}`;
        trace.tracks.registerTrack({
            uri,
            renderer: new dataset_slice_track_1.DatasetSliceTrack({
                trace,
                uri,
                dataset: new dataset_1.SourceDataset({
                    schema: {
                        id: query_result_1.NUM,
                        ts: query_result_1.LONG,
                        dur: query_result_1.LONG,
                        name: query_result_1.STR,
                    },
                    src: tableName,
                    filter: {
                        col: 'pivot',
                        eq: pivotValue,
                    },
                }),
                detailsPanel: (row) => {
                    return new debug_slice_track_details_panel_1.DebugSliceTrackDetailsPanel(trace, tableName, row.id);
                },
            }),
        });
        const trackNode = new workspace_1.TrackNode({ uri, name, removable: true });
        trace.workspace.pinnedTracksNode.addChildLast(trackNode);
    }
}
function addSingleSliceTrack(trace, tableName, name, uri, argSetIdCol) {
    trace.tracks.registerTrack({
        uri,
        renderer: new dataset_slice_track_1.DatasetSliceTrack({
            trace,
            uri,
            dataset: new dataset_1.SourceDataset({
                schema: {
                    id: query_result_1.NUM,
                    ts: query_result_1.LONG,
                    dur: query_result_1.LONG,
                    name: query_result_1.STR,
                },
                src: tableName,
            }),
            detailsPanel: (row) => {
                return new debug_slice_track_details_panel_1.DebugSliceTrackDetailsPanel(trace, tableName, row.id, argSetIdCol);
            },
        }),
    });
    const trackNode = new workspace_1.TrackNode({ uri, name, removable: true });
    trace.workspace.pinnedTracksNode.addChildLast(trackNode);
}
/**
 * Adds a new debug counter track to the workspace.
 *
 * A debug slice track is a track based on a query which is:
 * - Based on a query.
 * - Automatically added to the top of the current workspace.
 * - Pinned.
 * - Has a close button to remove it.
 *
 * @param args - Args to pass to the trace.
 * @param args.trace - The trace to use.
 * @param args.data.sqlSource - The query to run.
 * @param args.data.columns - Optional: Override columns.
 * @param args.title - Optional: Title for the track. If pivotOn is supplied,
 * this will be used as the root title for each track, but each title will have
 * the value appended.
 * @param args.columns - Optional: The columns names to use for the various
 * essential column names.
 * @param args.pivotOn - Optional: The name of a column on which to pivot. If
 * provided, we will create N tracks, one for each distinct value of the pivotOn
 * column. Each track will only show the slices which have the corresponding
 * value in their pivotOn column.
 */
async function addDebugCounterTrack(args) {
    const tableId = getUniqueTrackCounter();
    const tableName = `__debug_track_${tableId}`;
    const titleBase = args.title?.trim() || `Debug Slice Track ${tableId}`;
    const uriBase = `debug.track${tableId}`;
    // Create a table for this query before doing anything
    await createTableForCounterTrack(args.trace.engine, tableName, args.data, args.columns, args.pivotOn);
    if (args.pivotOn) {
        await addPivotedCounterTracks(args.trace, tableName, titleBase, uriBase, args.pivotOn);
    }
    else {
        addSingleCounterTrack(args.trace, tableName, titleBase, uriBase);
    }
}
async function createTableForCounterTrack(engine, tableName, data, columnMapping = {}, pivotCol) {
    const { ts = 'ts', value = 'value' } = columnMapping;
    const cols = [
        `${ts} as ts`,
        `${value} as value`,
        pivotCol && `${pivotCol} as pivot`,
    ]
        .flat() // Convert to flattened list
        .filter(Boolean) // Remove falsy values
        .join(',');
    const query = `
    with data as (
      ${data.sqlSource}
    )
    select ${cols}
    from data
    order by ts
  `;
    return await (0, sql_utils_1.createPerfettoTable)({ engine, name: tableName, as: query });
}
async function addPivotedCounterTracks(trace, tableName, titleBase, uriBase, pivotColName) {
    const result = await trace.engine.query(`
    SELECT DISTINCT pivot
    FROM ${tableName}
    ORDER BY pivot
  `);
    let trackCount = 0;
    for (const iter = result.iter({}); iter.valid(); iter.next()) {
        const uri = `${uriBase}_${trackCount++}`;
        const pivotValue = iter.get('pivot');
        const name = `${titleBase}: ${pivotColName} = ${(0, sql_utils_1.sqlValueToReadableString)(pivotValue)}`;
        trace.tracks.registerTrack({
            uri,
            renderer: new query_counter_track_1.SqlTableCounterTrack(trace, uri, `
          SELECT *
          FROM ${tableName}
          WHERE pivot = ${(0, sql_utils_1.sqlValueToSqliteString)(pivotValue)}
        `),
        });
        const trackNode = new workspace_1.TrackNode({ uri, name, removable: true });
        trace.workspace.pinnedTracksNode.addChildLast(trackNode);
    }
}
function addSingleCounterTrack(trace, tableName, name, uri) {
    trace.tracks.registerTrack({
        uri,
        renderer: new query_counter_track_1.SqlTableCounterTrack(trace, uri, tableName),
    });
    const trackNode = new workspace_1.TrackNode({ uri, name, removable: true });
    trace.workspace.pinnedTracksNode.addChildLast(trackNode);
}
//# sourceMappingURL=debug_tracks.js.map