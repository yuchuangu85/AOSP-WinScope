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
exports.SliceSelectionAggregator = void 0;
const query_result_1 = require("../../trace_processor/query_result");
class SliceSelectionAggregator {
    id = 'slice_aggregation';
    schema = {
        id: query_result_1.NUM,
        name: query_result_1.STR_NULL,
        ts: query_result_1.LONG,
        dur: query_result_1.LONG,
    };
    async createAggregateView(engine, area, dataset) {
        if (!dataset)
            return false;
        await engine.query(`
      create or replace perfetto table ${this.id} as
      select
        name,
        sum(dur) AS total_dur,
        sum(dur)/count() as avg_dur,
        count() as occurrences
        from (${dataset.query()})
      where
        ts + dur > ${area.start}
        and ts < ${area.end}
      group by name
    `);
        return true;
    }
    getTabName() {
        return 'Slices';
    }
    async getExtra() { }
    getDefaultSorting() {
        return { column: 'total_dur', direction: 'DESC' };
    }
    getColumnDefinitions() {
        return [
            {
                title: 'Name',
                kind: 'STRING',
                columnConstructor: Uint32Array,
                columnId: 'name',
            },
            {
                title: 'Wall duration (ms)',
                kind: 'TIMESTAMP_NS',
                columnConstructor: Float64Array,
                columnId: 'total_dur',
                sum: true,
            },
            {
                title: 'Avg Wall duration (ms)',
                kind: 'TIMESTAMP_NS',
                columnConstructor: Float64Array,
                columnId: 'avg_dur',
            },
            {
                title: 'Occurrences',
                kind: 'NUMBER',
                columnConstructor: Uint32Array,
                columnId: 'occurrences',
                sum: true,
            },
        ];
    }
}
exports.SliceSelectionAggregator = SliceSelectionAggregator;
//# sourceMappingURL=slice_selection_aggregator.js.map