"use strict";
// Copyright (C) 2020 The Android Open Source Project
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
exports.CounterSelectionAggregator = void 0;
const time_1 = require("../../base/time");
const track_kinds_1 = require("../../public/track_kinds");
const query_result_1 = require("../../trace_processor/query_result");
class CounterSelectionAggregator {
    id = 'counter_aggregation';
    // This just describes which counters we match, we don't actually use the
    // resulting datasets, but it's a useful too to show what we actually match.
    trackKind = track_kinds_1.COUNTER_TRACK_KIND;
    schema = {
        id: query_result_1.NUM,
        ts: query_result_1.LONG,
        value: query_result_1.NUM,
    };
    async createAggregateView(engine, area) {
        const trackIds = [];
        for (const trackInfo of area.tracks) {
            if (trackInfo?.tags?.kind === track_kinds_1.COUNTER_TRACK_KIND) {
                trackInfo.tags?.trackIds && trackIds.push(...trackInfo.tags.trackIds);
            }
        }
        if (trackIds.length === 0)
            return false;
        const duration = area.end - area.start;
        const durationSec = time_1.Duration.toSeconds(duration);
        await engine.query(`include perfetto module counters.intervals`);
        // TODO(lalitm): Rewrite this query in a way that is both simpler and faster
        let query;
        if (trackIds.length === 1) {
            // Optimized query for the special case where there is only 1 track id.
            query = `CREATE OR REPLACE PERFETTO TABLE ${this.id} AS
      WITH
        res AS (
          select c.*
          from counter_leading_intervals!((
            SELECT counter.*
            FROM counter
            WHERE counter.track_id = ${trackIds[0]}
              AND counter.ts <= ${area.end}
          )) c
          WHERE c.ts + c.dur >= ${area.start}
        ),
        aggregated AS (
          SELECT
            COUNT(1) AS count,
            ROUND(SUM(
              (MIN(ts + dur, ${area.end}) - MAX(ts,${area.start}))*value)/${duration},
              2
            ) AS avg_value,
            value_at_max_ts(ts, value) AS last_value,
            value_at_max_ts(-ts, value) AS first_value,
            MIN(value) AS min_value,
            MAX(value) AS max_value
          FROM res
        )
      SELECT
        (SELECT name FROM counter_track WHERE id = ${trackIds[0]}) AS name,
        *,
        MAX(last_value) - MIN(first_value) AS delta_value,
        ROUND((MAX(last_value) - MIN(first_value))/${durationSec}, 2) AS rate
      FROM aggregated`;
        }
        else {
            // Slower, but general purspose query that can aggregate multiple tracks
            query = `CREATE OR REPLACE PERFETTO TABLE ${this.id} AS
      WITH
        res AS (
          select c.*
          from counter_leading_intervals!((
            SELECT counter.*
            FROM counter
            WHERE counter.track_id in (${trackIds})
              AND counter.ts <= ${area.end}
          )) c
          where c.ts + c.dur >= ${area.start}
        ),
        aggregated AS (
          SELECT track_id,
            COUNT(1) AS count,
            ROUND(SUM(
              (MIN(ts + dur, ${area.end}) - MAX(ts,${area.start}))*value)/${duration},
              2
            ) AS avg_value,
            value_at_max_ts(-ts, value) AS first,
            value_at_max_ts(ts, value) AS last,
            MIN(value) AS min_value,
            MAX(value) AS max_value
          FROM res
          GROUP BY track_id
        )
      SELECT
        name,
        count,
        avg_value,
        last AS last_value,
        first AS first_value,
        last - first AS delta_value,
        ROUND((last - first)/${durationSec}, 2) AS rate,
        min_value,
        max_value
      FROM aggregated JOIN counter_track ON
        track_id = counter_track.id
      GROUP BY track_id`;
        }
        await engine.query(query);
        return true;
    }
    getColumnDefinitions() {
        return [
            {
                title: 'Name',
                kind: 'STRING',
                columnConstructor: Uint16Array,
                columnId: 'name',
            },
            {
                title: 'Delta value',
                kind: 'NUMBER',
                columnConstructor: Float64Array,
                columnId: 'delta_value',
            },
            {
                title: 'Rate /s',
                kind: 'Number',
                columnConstructor: Float64Array,
                columnId: 'rate',
            },
            {
                title: 'Weighted avg value',
                kind: 'Number',
                columnConstructor: Float64Array,
                columnId: 'avg_value',
            },
            {
                title: 'Count',
                kind: 'Number',
                columnConstructor: Float64Array,
                columnId: 'count',
                sum: true,
            },
            {
                title: 'First value',
                kind: 'NUMBER',
                columnConstructor: Float64Array,
                columnId: 'first_value',
            },
            {
                title: 'Last value',
                kind: 'NUMBER',
                columnConstructor: Float64Array,
                columnId: 'last_value',
            },
            {
                title: 'Min value',
                kind: 'NUMBER',
                columnConstructor: Float64Array,
                columnId: 'min_value',
            },
            {
                title: 'Max value',
                kind: 'NUMBER',
                columnConstructor: Float64Array,
                columnId: 'max_value',
            },
        ];
    }
    async getExtra() { }
    getTabName() {
        return 'Counters';
    }
    getDefaultSorting() {
        return { column: 'name', direction: 'DESC' };
    }
}
exports.CounterSelectionAggregator = CounterSelectionAggregator;
//# sourceMappingURL=counter_selection_aggregator.js.map