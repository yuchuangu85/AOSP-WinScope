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
exports.createProcessPerfSamplesProfileTrack = createProcessPerfSamplesProfileTrack;
exports.createThreadPerfSamplesProfileTrack = createThreadPerfSamplesProfileTrack;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const query_result_1 = require("../../trace_processor/query_result");
const colorizer_1 = require("../../components/colorizer");
const query_flamegraph_1 = require("../../components/query_flamegraph");
const details_shell_1 = require("../../widgets/details_shell");
const timestamp_1 = require("../../components/widgets/timestamp");
const time_1 = require("../../base/time");
const flamegraph_1 = require("../../widgets/flamegraph");
const dataset_slice_track_1 = require("../../components/tracks/dataset_slice_track");
const dataset_1 = require("../../trace_processor/dataset");
// TODO(stevegolton): Dedupe this file with instrument_samples_profile_track.ts
function createProcessPerfSamplesProfileTrack(trace, uri, upid) {
    return new dataset_slice_track_1.DatasetSliceTrack({
        trace,
        uri,
        dataset: new dataset_1.SourceDataset({
            schema: {
                id: query_result_1.NUM,
                ts: query_result_1.LONG,
                callsiteId: query_result_1.NUM,
            },
            src: `
       SELECT
          p.id,
          ts,
          callsite_id as callsiteId,
          upid
        FROM perf_sample p
        JOIN thread using (utid)
        WHERE callsite_id IS NOT NULL
        ORDER BY ts
      `,
            filter: {
                col: 'upid',
                eq: upid,
            },
        }),
        sliceName: () => 'Perf Sample',
        colorizer: (row) => (0, colorizer_1.getColorForSample)(row.callsiteId),
        detailsPanel: (row) => {
            const metrics = (0, query_flamegraph_1.metricsFromTableOrSubquery)(`
          (
            select
              id,
              parent_id as parentId,
              name,
              mapping_name,
              source_file,
              cast(line_number AS text) as line_number,
              self_count
            from _callstacks_for_callsites!((
              select p.callsite_id
              from perf_sample p
              join thread t using (utid)
              where p.ts >= ${row.ts}
                and p.ts <= ${row.ts}
                and t.upid = ${upid}
            ))
          )
        `, [
                {
                    name: 'Perf Samples',
                    unit: '',
                    columnName: 'self_count',
                },
            ], 'include perfetto module linux.perf.samples', [{ name: 'mapping_name', displayName: 'Mapping' }], [
                {
                    name: 'source_file',
                    displayName: 'Source File',
                    mergeAggregation: 'ONE_OR_NULL',
                },
                {
                    name: 'line_number',
                    displayName: 'Line Number',
                    mergeAggregation: 'ONE_OR_NULL',
                },
            ]);
            const serialization = {
                schema: flamegraph_1.FLAMEGRAPH_STATE_SCHEMA,
                state: flamegraph_1.Flamegraph.createDefaultState(metrics),
            };
            const flamegraph = new query_flamegraph_1.QueryFlamegraph(trace, metrics, serialization);
            return {
                render: () => renderDetailsPanel(flamegraph, time_1.Time.fromRaw(row.ts)),
                serialization,
            };
        },
    });
}
function createThreadPerfSamplesProfileTrack(trace, uri, utid) {
    return new dataset_slice_track_1.DatasetSliceTrack({
        trace,
        uri,
        dataset: new dataset_1.SourceDataset({
            schema: {
                id: query_result_1.NUM,
                ts: query_result_1.LONG,
                callsiteId: query_result_1.NUM,
            },
            src: `
        SELECT
          p.id,
          ts,
          callsite_id as callsiteId,
          utid
        FROM perf_sample p
        WHERE callsite_id IS NOT NULL
        ORDER BY ts
      `,
            filter: {
                col: 'utid',
                eq: utid,
            },
        }),
        sliceName: () => 'Perf Sample',
        colorizer: (row) => (0, colorizer_1.getColorForSample)(row.callsiteId),
        detailsPanel: (row) => {
            const metrics = (0, query_flamegraph_1.metricsFromTableOrSubquery)(`
          (
            select
              id,
              parent_id as parentId,
              name,
              mapping_name,
              source_file,
              cast(line_number AS text) as line_number,
              self_count
            from _callstacks_for_callsites!((
              select p.callsite_id
              from perf_sample p
              where p.ts >= ${row.ts}
                and p.ts <= ${row.ts}
                and p.utid = ${utid}
            ))
          )
        `, [
                {
                    name: 'Perf Samples',
                    unit: '',
                    columnName: 'self_count',
                },
            ], 'include perfetto module linux.perf.samples', [{ name: 'mapping_name', displayName: 'Mapping' }], [
                {
                    name: 'source_file',
                    displayName: 'Source File',
                    mergeAggregation: 'ONE_OR_NULL',
                },
                {
                    name: 'line_number',
                    displayName: 'Line Number',
                    mergeAggregation: 'ONE_OR_NULL',
                },
            ]);
            const serialization = {
                schema: flamegraph_1.FLAMEGRAPH_STATE_SCHEMA,
                state: flamegraph_1.Flamegraph.createDefaultState(metrics),
            };
            const flamegraph = new query_flamegraph_1.QueryFlamegraph(trace, metrics, serialization);
            return {
                render: () => renderDetailsPanel(flamegraph, time_1.Time.fromRaw(row.ts)),
                serialization,
            };
        },
    });
}
function renderDetailsPanel(flamegraph, ts) {
    return (0, mithril_1.default)('.flamegraph-profile', (0, mithril_1.default)(details_shell_1.DetailsShell, {
        fillParent: true,
        title: (0, mithril_1.default)('.title', 'Perf Samples'),
        description: [],
        buttons: [
            (0, mithril_1.default)('div.time', `First timestamp: `, (0, mithril_1.default)(timestamp_1.Timestamp, {
                ts,
            })),
            (0, mithril_1.default)('div.time', `Last timestamp: `, (0, mithril_1.default)(timestamp_1.Timestamp, {
                ts,
            })),
        ],
    }, flamegraph.render()));
}
//# sourceMappingURL=perf_samples_profile_track.js.map