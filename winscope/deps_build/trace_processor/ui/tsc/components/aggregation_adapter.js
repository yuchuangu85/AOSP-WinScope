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
exports.selectTracksAndGetDataset = selectTracksAndGetDataset;
exports.createIITable = createIITable;
exports.createAggregationTab = createAggregationTab;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const async_limiter_1 = require("../base/async_limiter");
const time_1 = require("../base/time");
const utils_1 = require("../base/utils");
const selection_1 = require("../public/selection");
const dataset_1 = require("../trace_processor/dataset");
const empty_state_1 = require("../widgets/empty_state");
const spinner_1 = require("../widgets/spinner");
const aggregation_panel_1 = require("./aggregation_panel");
const sql_data_source_1 = require("./widgets/data_grid/sql_data_source");
const sql_utils_1 = require("../trace_processor/sql_utils");
function selectTracksAndGetDataset(tracks, spec, kind) {
    const datasets = tracks
        .filter((t) => kind === undefined || t.tags?.kind === kind)
        .map((t) => t.renderer.getDataset?.())
        .filter(utils_1.exists)
        .filter((d) => d.implements(spec));
    if (datasets.length > 0) {
        // TODO(stevegolton): Avoid typecast in UnionDataset.
        return new dataset_1.UnionDataset(datasets).optimize();
    }
    else {
        return undefined;
    }
}
/**
 * For a given slice-like dataset (ts, dur and id cols), creates a new table
 * that contains the slices intersected with a given interval.
 *
 * @param engine The engine to use to run queries.
 * @param dataset The source dataset.
 * @param start The start of the interval to intersect with.
 * @param end The end of the interval to intersect with.
 * @returns A disposable SQL entity representing the new table.
 */
async function createIITable(engine, dataset, start, end) {
    const env_1 = { stack: [], error: void 0, hasError: false };
    try {
        const duration = time_1.Time.durationBetween(start, end);
        if (duration <= 0n) {
            // Return an empty dataset if the area selection's length is zero or less.
            // II can't handle 0 or negative durations.
            return (0, sql_utils_1.createPerfettoTable)({
                engine,
                as: `
        SELECT * 
        FROM (${dataset.query()})
        LIMIT 0
      `,
            });
        }
        // Materialize the source into a perfetto table first, dropping all incomplete
        // slices.
        //
        // Note: the `ORDER BY id` is absolutely crucial. Removing this significantly
        // worsens aggregation results compared to no materialization at all.
        const tempTable = tslib_1.__addDisposableResource(env_1, await (0, sql_utils_1.createPerfettoTable)({
            engine,
            as: `
      WITH slices AS (${dataset.query()})
      SELECT * FROM slices
      WHERE dur >= 0
      ORDER BY id
    `,
        }), true);
        // Include all columns from the dataset except for `dur` and `ts`, which
        // are replaced with the `dur` and `ts` from the interval intersection.
        const otherCols = Object.keys(dataset.schema).filter((col) => col !== 'dur' && col !== 'ts');
        await engine.query(`INCLUDE PERFETTO MODULE intervals.intersect`);
        return await (0, sql_utils_1.createPerfettoTable)({
            engine,
            as: `
      SELECT
        ${otherCols.map((c) => `slices.${c}`).join()},
        ii.dur AS dur,
        ii.ts AS ts
      FROM _interval_intersect_single!(
        ${start},
        ${duration},
        ${tempTable.name}
      ) AS ii
      JOIN ${tempTable.name} AS slices USING (id)
    `,
        });
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
/**
 * Creates an adapter that adapts an old style aggregation to a new area
 * selection sub-tab.
 */
function createAggregationTab(trace, aggregator, priority = 0) {
    const limiter = new async_limiter_1.AsyncLimiter();
    let currentSelection;
    let aggregation;
    let barChartData;
    let dataSource;
    return {
        id: aggregator.id,
        name: aggregator.getTabName(),
        priority,
        render(selection) {
            if (currentSelection === undefined ||
                !(0, selection_1.areaSelectionsEqual)(selection, currentSelection)) {
                // Every time the selection changes, probe the aggregator to see if it
                // supports this selection.
                currentSelection = selection;
                aggregation = aggregator.probe(selection);
                // Kick off a new load of the data
                limiter.schedule(async () => {
                    // Clear previous data to prevent queries against a stale or partially
                    // updated table/view while `prepareData` is running.
                    dataSource = undefined;
                    barChartData = undefined;
                    if (aggregation) {
                        const data = await aggregation?.prepareData(trace.engine);
                        dataSource = new sql_data_source_1.SQLDataSource(trace.engine, data.tableName);
                        barChartData = data.barChartData;
                    }
                });
            }
            if (!aggregation) {
                // Hides the tab
                return undefined;
            }
            if (!dataSource) {
                return {
                    isLoading: true,
                    content: (0, mithril_1.default)(empty_state_1.EmptyState, {
                        icon: 'mediation',
                        title: 'Computing aggregation ...',
                        className: 'pf-aggregation-loading',
                    }, (0, mithril_1.default)(spinner_1.Spinner, { easing: true })),
                };
            }
            const PanelComponent = aggregator.Panel ?? aggregation_panel_1.AggregationPanel;
            return {
                isLoading: false,
                content: (0, mithril_1.default)(PanelComponent, {
                    key: aggregator.id,
                    dataSource,
                    columns: aggregator.getColumnDefinitions(),
                    sorting: aggregator.getDefaultSorting(),
                    barChartData,
                }),
            };
        },
    };
}
//# sourceMappingURL=aggregation_adapter.js.map