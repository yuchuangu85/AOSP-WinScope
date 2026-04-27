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
exports.BreakdownTracks = exports.BreakdownTrackAggType = void 0;
const string_utils_1 = require("../../base/string_utils");
const uuid_1 = require("../../base/uuid");
const query_counter_track_1 = require("../../components/tracks/query_counter_track");
const query_slice_track_1 = require("../../components/tracks/query_slice_track");
const workspace_1 = require("../../public/workspace");
const query_result_1 = require("../../trace_processor/query_result");
/**
 * Aggregation types for the BreakdownTracks.
 * These aggregations will be displayed in a set of counter tracks.
 */
var BreakdownTrackAggType;
(function (BreakdownTrackAggType) {
    BreakdownTrackAggType["COUNT"] = "COUNT";
    BreakdownTrackAggType["MAX"] = "MAX";
    BreakdownTrackAggType["SUM"] = "SUM";
})(BreakdownTrackAggType || (exports.BreakdownTrackAggType = BreakdownTrackAggType = {}));
/**
 * Breakdown Tracks will always be shown first as
 * a counter track with the aggregation.
 *
 * Slice and pivot tracks will be slice tracks.
 */
var BreakdownTrackType;
(function (BreakdownTrackType) {
    BreakdownTrackType[BreakdownTrackType["AGGREGATION"] = 0] = "AGGREGATION";
    BreakdownTrackType[BreakdownTrackType["SLICE"] = 1] = "SLICE";
    BreakdownTrackType[BreakdownTrackType["PIVOT"] = 2] = "PIVOT";
})(BreakdownTrackType || (BreakdownTrackType = {}));
class BreakdownTracks {
    props;
    uri;
    modulesClause;
    sliceJoinClause;
    pivotJoinClause;
    constructor(props) {
        this.props = props;
        this.uri = `/breakdown_tracks_${this.props.aggregation.tableName}`;
        this.modulesClause = props.modules
            ? props.modules.map((m) => `INCLUDE PERFETTO MODULE ${m};`).join('\n')
            : '';
        if (this.props.aggregationType === BreakdownTrackAggType.COUNT) {
            this.modulesClause += `\nINCLUDE PERFETTO MODULE intervals.overlap;`;
        }
        if (this.props.slice?.joins !== undefined) {
            this.sliceJoinClause = this.getJoinClause(this.props.slice.joins);
        }
        if (this.props.pivots?.joins !== undefined) {
            this.pivotJoinClause = this.getJoinClause(this.props.pivots.joins);
        }
    }
    getAggregationQuery(filtersClause) {
        if (this.props.aggregationType === BreakdownTrackAggType.COUNT) {
            return `
        intervals_overlap_count
        !((
            SELECT ${this.props.aggregation.tsCol} AS ts,
            ${this.props.aggregation.durCol} AS dur
            FROM ${this.props.aggregation.tableName}
            ${filtersClause}
        ), ts, dur)
      `;
        }
        return `
      SELECT
      ${this.props.aggregation.tsCol} AS ts,
      ${this.props.aggregation.durCol} dur,
      ${this.props.aggregationType}(${this.props.aggregation.valueCol}) AS value
      FROM _ui_dev_perfetto_breakdown_tracks_intervals
      ${filtersClause}
      GROUP BY ${this.props.aggregation.tsCol}
    `;
    }
    // TODO: Modify this to use self_interval_intersect when it is available.
    getIntervals() {
        const { tsCol, durCol, valueCol, columns, tableName } = this.props.aggregation;
        return `
      CREATE OR REPLACE PERFETTO TABLE _ui_dev_perfetto_breakdown_tracks_intervals
      AS
      WITH
        x AS (
          SELECT overlap.*,
          lead(${tsCol}) OVER (PARTITION BY group_name ORDER BY ${tsCol}) - ${tsCol} AS dur
          FROM intervals_overlap_count_by_group!(${tableName}, ${tsCol}, ${durCol}, ${columns[columns.length - 1]}) overlap
        )
      SELECT x.ts, x.dur,
        ${columns.map((col) => `${tableName}.${col}`).join(', ')},
        ${tableName}.${valueCol}
      FROM x
      JOIN ${tableName}
        ON
          ${tableName}.${columns[columns.length - 1]} = x.group_name
          AND _ui_dev_perfetto_breakdown_tracks_is_spans_overlapping(x.ts, x.ts + x.dur, ${tableName}.${tsCol}, ${tableName}.${tsCol} + ${tableName}.${durCol});
    `;
    }
    getJoinClause(joins) {
        return joins
            .map(({ joinTableName, joinColumns }) => `JOIN ${joinTableName} USING(${joinColumns.join(', ')})`)
            .join('\n');
    }
    async createTracks() {
        if (this.modulesClause !== '') {
            await this.props.trace.engine.query(this.modulesClause);
        }
        if (this.props.aggregationType !== BreakdownTrackAggType.COUNT) {
            await this.props.trace.engine.query(`
        CREATE OR REPLACE PERFETTO FUNCTION _ui_dev_perfetto_breakdown_tracks_is_spans_overlapping(
          ts1 LONG,
          ts_end1 LONG,
          ts2 LONG,
          ts_end2 LONG)
        RETURNS BOOL
        AS
        SELECT (IIF($ts1 < $ts2, $ts2, $ts1) < IIF($ts_end1 < $ts_end2, $ts_end1, $ts_end2));

        ${this.getIntervals()}
      `);
        }
        const rootTrackNode = await this.createCounterTrackNode(`${this.props.trackTitle}`, []);
        this.createBreakdownHierarchy([], rootTrackNode, this.props.aggregation, 0, BreakdownTrackType.AGGREGATION);
        return rootTrackNode;
    }
    async createBreakdownHierarchy(filters, parent, sqlInfo, colIndex, trackType) {
        const { columns } = sqlInfo;
        if (colIndex === columns.length) {
            return;
        }
        const currColName = columns[colIndex];
        const joinClause = this.getTrackSpecificJoinClause(trackType);
        const query = `
      ${this.modulesClause}

      SELECT DISTINCT ${currColName}
      FROM ${this.props.aggregation.tableName}
      ${joinClause !== undefined ? joinClause : ''}
      ${filters.length > 0 ? `WHERE ${buildFilterSqlClause(filters)}` : ''}
    `;
        const res = await this.props.trace.engine.query(query);
        for (const iter = res.iter({}); iter.valid(); iter.next()) {
            const colRaw = iter.get(currColName);
            const colValue = colRaw === null ? 'NULL' : colRaw.toString();
            const name = colValue;
            const newFilters = [
                ...filters,
                {
                    columnName: currColName,
                    value: colValue,
                },
            ];
            let currNode;
            let nextTrackType = trackType;
            let nextColIndex = colIndex + 1;
            let nextSqlInfo = sqlInfo;
            switch (trackType) {
                case BreakdownTrackType.AGGREGATION:
                    currNode = await this.createCounterTrackNode(name, newFilters);
                    if (this.props.slice && colIndex === columns.length - 1) {
                        nextTrackType = BreakdownTrackType.SLICE;
                        nextColIndex = 0;
                        nextSqlInfo = this.props.slice;
                    }
                    break;
                case BreakdownTrackType.SLICE:
                    currNode = await this.createSliceTrackNode(name, newFilters, colIndex, sqlInfo, trackType);
                    if (this.props.pivots && colIndex === columns.length - 1) {
                        nextTrackType = BreakdownTrackType.PIVOT;
                        nextColIndex = 0;
                        nextSqlInfo = this.props.pivots;
                    }
                    break;
                default:
                    currNode = await this.createSliceTrackNode(name, newFilters, colIndex, sqlInfo, trackType);
            }
            parent.addChildInOrder(currNode);
            this.createBreakdownHierarchy(newFilters, currNode, nextSqlInfo, nextColIndex, nextTrackType);
        }
    }
    getTrackSpecificJoinClause(trackType) {
        switch (trackType) {
            case BreakdownTrackType.SLICE:
                return this.sliceJoinClause;
            case BreakdownTrackType.PIVOT:
                return this.pivotJoinClause;
            default:
                return undefined;
        }
    }
    async createSliceTrackNode(title, newFilters, columnIndex, sqlInfo, trackType) {
        let joinClause = '';
        if (this.sliceJoinClause && trackType === BreakdownTrackType.SLICE) {
            joinClause = this.sliceJoinClause;
        }
        else if (this.pivotJoinClause && trackType === BreakdownTrackType.PIVOT) {
            joinClause = this.pivotJoinClause;
        }
        return await this.createTrackNode(title, newFilters, (uri, filtersClause) => {
            return (0, query_slice_track_1.createQuerySliceTrack)({
                trace: this.props.trace,
                uri,
                data: {
                    sqlSource: `
            SELECT ${sqlInfo.tsCol} AS ts,
              ${sqlInfo.durCol} AS dur,
              ${sqlInfo.columns[columnIndex]} AS name
            FROM ${this.props.aggregation.tableName}
            ${joinClause}
            ${filtersClause}
          `,
                    columns: ['ts', 'dur', 'name'],
                },
            });
        });
    }
    async getCounterTrackSortOrder(filtersClause) {
        const aggregationQuery = this.getAggregationQuery(filtersClause);
        const result = await this.props.trace.engine.query(`
      SELECT MAX(value) as max_value FROM (${aggregationQuery})
    `);
        const maxValue = result.firstRow({ max_value: query_result_1.NUM_NULL }).max_value;
        return maxValue === null ? 0 : maxValue;
    }
    async createCounterTrackNode(name, newFilters) {
        return await this.createTrackNode(name, newFilters, (uri, filtersClause) => {
            return (0, query_counter_track_1.createQueryCounterTrack)({
                trace: this.props.trace,
                uri,
                data: {
                    sqlSource: `
              SELECT ts, value FROM
              (${this.getAggregationQuery(filtersClause)})
            `,
                },
                columns: {
                    ts: 'ts',
                    value: 'value',
                },
            });
        }, (filterClause) => this.getCounterTrackSortOrder(filterClause));
    }
    async createTrackNode(name, filters, createTrack, getSortOrder) {
        const filtersClause = filters.length > 0 ? `\nWHERE ${buildFilterSqlClause(filters)}` : '';
        const uri = `${this.uri}_${(0, uuid_1.uuidv4)()}`;
        const renderer = await createTrack(uri, filtersClause);
        this.props.trace.tracks.registerTrack({
            uri,
            renderer,
        });
        const sortOrder = await getSortOrder?.(filtersClause);
        return new workspace_1.TrackNode({
            name,
            uri,
            sortOrder: sortOrder !== undefined ? -sortOrder : undefined,
        });
    }
}
exports.BreakdownTracks = BreakdownTracks;
function buildFilterSqlClause(filters) {
    return filters.map((filter) => `${filterToSql(filter)}`).join(' AND ');
}
function filterToSql(filter) {
    const { columnName, value } = filter;
    const filterValue = toSqlValue(value);
    return `${columnName} = ${filterValue === undefined ? '' : filterValue}`;
}
function toSqlValue(input) {
    if (input === undefined || !input.trim()) {
        return '';
    }
    const num = Number(input);
    if (!isNaN(num) && String(num) == input.trim()) {
        return num;
    }
    try {
        return BigInt(input);
    }
    catch {
        return (0, string_utils_1.sqliteString)(input);
    }
}
//# sourceMappingURL=breakdown_tracks.js.map