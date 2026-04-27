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
exports.WattsonEstimateSelectionAggregator = void 0;
const utils_1 = require("../../base/utils");
const track_kinds_1 = require("./track_kinds");
const aggregation_panel_1 = require("./aggregation_panel");
class WattsonEstimateSelectionAggregator {
    id = 'wattson_plugin_estimate_aggregation';
    Panel = aggregation_panel_1.WattsonAggregationPanel;
    probe(area) {
        const estimateTracks = [];
        for (const trackInfo of area.tracks) {
            if ((trackInfo?.tags?.kind === track_kinds_1.CPUSS_ESTIMATE_TRACK_KIND ||
                trackInfo?.tags?.kind === track_kinds_1.GPUSS_ESTIMATE_TRACK_KIND) &&
                (0, utils_1.exists)(trackInfo.tags?.wattson)) {
                estimateTracks.push(`${trackInfo.tags.wattson}`);
            }
        }
        if (estimateTracks.length === 0)
            return undefined;
        return {
            prepareData: async (engine) => {
                await engine.query(`drop view if exists ${this.id};`);
                const query = this.getEstimateTracksQuery(area, estimateTracks);
                await engine.query(query);
                return {
                    tableName: this.id,
                };
            },
        };
    }
    getEstimateTracksQuery(area, estimateTracks) {
        const duration = area.end - area.start;
        let query = `
      INCLUDE PERFETTO MODULE wattson.estimates;

      CREATE OR REPLACE PERFETTO TABLE wattson_plugin_ui_selection_window AS
      SELECT
        ${area.start} as ts,
        ${duration} as dur;

      DROP TABLE IF EXISTS wattson_plugin_windowed_subsystems_estimate;
      CREATE VIRTUAL TABLE wattson_plugin_windowed_subsystems_estimate
      USING
        SPAN_JOIN(wattson_plugin_ui_selection_window, _system_state_mw);

      CREATE PERFETTO VIEW ${this.id} AS
    `;
        // Convert average power track to total energy in UI window, then divide by
        // duration of window to get average estimated power of the window
        estimateTracks.forEach((estimateTrack, i) => {
            if (i != 0) {
                query += `UNION ALL `;
            }
            query += `
        SELECT
        '${estimateTrack}' as name,
        ROUND(SUM(${estimateTrack}_mw * dur) / ${duration}, 3) as power_mw,
        ROUND(SUM(${estimateTrack}_mw * dur) / 1000000000, 3) as energy_mws
        FROM wattson_plugin_windowed_subsystems_estimate
      `;
        });
        query += `;`;
        return query;
    }
    getColumnDefinitions() {
        return [
            {
                title: 'Name',
                columnId: 'name',
            },
            {
                title: 'Power (estimated mW)',
                columnId: 'power_mw',
                sum: true,
            },
            {
                title: 'Energy (estimated mWs)',
                columnId: 'energy_mws',
                sum: true,
            },
        ];
    }
    getTabName() {
        return 'Wattson estimates';
    }
    getDefaultSorting() {
        return { column: 'name', direction: 'ASC' };
    }
}
exports.WattsonEstimateSelectionAggregator = WattsonEstimateSelectionAggregator;
//# sourceMappingURL=estimate_aggregator.js.map