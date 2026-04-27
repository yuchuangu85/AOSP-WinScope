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
exports.FrameSelectionAggregator = exports.ACTUAL_FRAMES_SLICE_TRACK_KIND = void 0;
const tslib_1 = require("tslib");
const aggregation_adapter_1 = require("../../components/aggregation_adapter");
const query_result_1 = require("../../trace_processor/query_result");
exports.ACTUAL_FRAMES_SLICE_TRACK_KIND = 'ActualFramesSliceTrack';
class FrameSelectionAggregator {
    id = 'frame_aggregation';
    probe(area) {
        const dataset = (0, aggregation_adapter_1.selectTracksAndGetDataset)(area.tracks, {
            id: query_result_1.NUM,
            ts: query_result_1.LONG,
            dur: query_result_1.LONG,
            jank_type: query_result_1.STR,
        }, exports.ACTUAL_FRAMES_SLICE_TRACK_KIND);
        if (!dataset)
            return undefined;
        return {
            prepareData: async (engine) => {
                const env_1 = { stack: [], error: void 0, hasError: false };
                try {
                    const iiTable = tslib_1.__addDisposableResource(env_1, await (0, aggregation_adapter_1.createIITable)(engine, dataset, area.start, area.end), true);
                    await engine.query(`
          create or replace perfetto table ${this.id} as
          select
            jank_type,
            count(1) as occurrences,
            min(dur) as minDur,
            avg(dur) as meanDur,
            max(dur) as maxDur
          from (${iiTable.name})
          group by jank_type
        `);
                    return {
                        tableName: this.id,
                    };
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
        };
    }
    getTabName() {
        return 'Frames';
    }
    getDefaultSorting() {
        return { column: 'occurrences', direction: 'DESC' };
    }
    getColumnDefinitions() {
        return [
            {
                title: 'Jank Type',
                columnId: 'jank_type',
            },
            {
                title: 'Min duration',
                formatHint: 'DURATION_NS',
                columnId: 'minDur',
            },
            {
                title: 'Max duration',
                formatHint: 'DURATION_NS',
                columnId: 'maxDur',
            },
            {
                title: 'Mean duration',
                formatHint: 'DURATION_NS',
                columnId: 'meanDur',
            },
            {
                title: 'Occurrences',
                columnId: 'occurrences',
                sum: true,
            },
        ];
    }
}
exports.FrameSelectionAggregator = FrameSelectionAggregator;
//# sourceMappingURL=frame_selection_aggregator.js.map