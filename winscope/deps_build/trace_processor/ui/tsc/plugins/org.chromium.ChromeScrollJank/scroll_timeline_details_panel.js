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
exports.ScrollTimelineDetailsPanel = void 0;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const query_result_1 = require("../../trace_processor/query_result");
const details_shell_1 = require("../../widgets/details_shell");
const grid_layout_1 = require("../../widgets/grid_layout");
const time_1 = require("../../base/time");
const logging_1 = require("../../base/logging");
const section_1 = require("../../widgets/section");
const tree_1 = require("../../widgets/tree");
const timestamp_1 = require("../../components/widgets/timestamp");
const duration_1 = require("../../components/widgets/duration");
const utils_1 = require("./utils");
const dev_perfetto_SqlModules_1 = tslib_1.__importDefault(require("../dev.perfetto.SqlModules"));
const render_cell_utils_1 = require("../../components/widgets/sql/table/render_cell_utils");
const columns_1 = require("../../components/widgets/sql/table/columns");
function createPluginSliceIdColumn(trace, trackUri, name) {
    const col = new columns_1.StandardColumn(name);
    col.renderCell = (value, tableManager) => {
        if (value === null || typeof value !== 'bigint') {
            return (0, render_cell_utils_1.renderStandardCell)(value, name, tableManager);
        }
        return (0, utils_1.renderSliceRef)({
            trace: trace,
            id: Number(value),
            trackUri: trackUri,
            title: `${value}`,
        });
    };
    return col;
}
function createScrollTimelineTableColumns(trace, trackUri) {
    return [
        createPluginSliceIdColumn(trace, trackUri, 'id'),
        new columns_1.StandardColumn('scroll_update_id'),
        new columns_1.TimestampColumn('ts'),
        new columns_1.DurationColumn('dur'),
        new columns_1.StandardColumn('name'),
        new columns_1.StandardColumn('classification'),
    ];
}
class ScrollTimelineDetailsPanel {
    trace;
    model;
    id;
    // Information about the scroll update *slice*, which was emitted by
    // ScrollTimelineTrack.
    // Source: this.tableName[id=this.id]
    sliceData;
    // Information about the scroll *update*, which comes from the Chrome tracing
    // stdlib.
    // Source: chrome_scroll_update_info[id=this.sliceData.scrollUpdateId]
    scrollData;
    constructor(trace, model, 
    // ID of the slice in tableName.
    id) {
        this.trace = trace;
        this.model = model;
        this.id = id;
    }
    async load() {
        await this.querySliceData();
        await this.queryScrollData();
    }
    async querySliceData() {
        (0, logging_1.assertTrue)(this.sliceData === undefined);
        const queryResult = await this.trace.engine.query(`
      SELECT
        name,
        ts,
        dur,
        scroll_update_id
      FROM ${this.model.tableName}
      WHERE id = ${this.id}`);
        const row = queryResult.firstRow({
            name: query_result_1.STR,
            ts: query_result_1.LONG,
            dur: query_result_1.LONG,
            scroll_update_id: query_result_1.LONG,
        });
        this.sliceData = {
            name: row.name,
            ts: time_1.Time.fromRaw(row.ts),
            dur: time_1.Duration.fromRaw(row.dur),
            scrollUpdateId: row.scroll_update_id,
        };
    }
    async queryScrollData() {
        (0, logging_1.assertExists)(this.sliceData);
        (0, logging_1.assertTrue)(this.scrollData === undefined);
        const queryResult = await this.trace.engine.query(`
      INCLUDE PERFETTO MODULE chrome.chrome_scrolls;
      SELECT
        vsync_interval_ms,
        is_presented,
        is_janky,
        is_inertial,
        is_first_scroll_update_in_scroll,
        is_first_scroll_update_in_frame
      FROM chrome_scroll_update_info
      WHERE id = ${this.sliceData.scrollUpdateId}`);
        const row = queryResult.firstRow({
            vsync_interval_ms: query_result_1.NUM_NULL,
            is_presented: query_result_1.NUM_NULL,
            is_janky: query_result_1.NUM_NULL,
            is_inertial: query_result_1.NUM_NULL,
            is_first_scroll_update_in_scroll: query_result_1.NUM_NULL,
            is_first_scroll_update_in_frame: query_result_1.NUM_NULL,
        });
        this.scrollData = {
            vsyncInterval: row.vsync_interval_ms === null
                ? undefined
                : time_1.Duration.fromMillis?.(row.vsync_interval_ms),
            isPresented: (0, utils_1.fromSqlBool)(row.is_presented),
            isJanky: (0, utils_1.fromSqlBool)(row.is_janky),
            isInertial: (0, utils_1.fromSqlBool)(row.is_inertial),
            isFirstScrollUpdateInScroll: (0, utils_1.fromSqlBool)(row.is_first_scroll_update_in_scroll),
            isFirstScrollUpdateInFrame: (0, utils_1.fromSqlBool)(row.is_first_scroll_update_in_frame),
        };
    }
    render() {
        return (0, mithril_1.default)(details_shell_1.DetailsShell, {
            title: 'Slice',
            description: this.sliceData?.name ?? 'Loading...',
        }, (0, mithril_1.default)(grid_layout_1.GridLayout, (0, mithril_1.default)(grid_layout_1.GridLayoutColumn, this.renderSliceDetails()), (0, mithril_1.default)(grid_layout_1.GridLayoutColumn, this.renderScrollDetails())));
    }
    renderSliceDetails() {
        let child;
        if (this.sliceData === undefined) {
            child = 'Loading...';
        }
        else {
            child = (0, mithril_1.default)(tree_1.Tree, (0, mithril_1.default)(tree_1.TreeNode, {
                left: 'Name',
                right: this.sliceData.name,
            }), (0, mithril_1.default)(tree_1.TreeNode, {
                left: 'Start time',
                right: (0, mithril_1.default)(timestamp_1.Timestamp, { ts: this.sliceData.ts }),
            }), (0, mithril_1.default)(tree_1.TreeNode, {
                left: 'Duration',
                right: (0, mithril_1.default)(duration_1.DurationWidget, { dur: this.sliceData.dur }),
            }), (0, mithril_1.default)(tree_1.TreeNode, {
                left: 'SQL ID',
                right: (0, utils_1.renderSqlRef)({
                    trace: this.trace,
                    tableName: this.model.tableName,
                    tableDescription: {
                        name: this.model.tableName,
                        columns: createScrollTimelineTableColumns(this.trace, this.model.trackUri),
                    },
                    id: this.id,
                }),
            }));
        }
        return (0, mithril_1.default)(section_1.Section, { title: 'Slice details' }, child);
    }
    renderScrollDetails() {
        let child;
        if (this.sliceData === undefined || this.scrollData === undefined) {
            child = 'Loading...';
        }
        else {
            const scrollTableDescription = this.trace.plugins
                .getPlugin(dev_perfetto_SqlModules_1.default)
                .getSqlModules()
                .getModuleForTable('chrome_scroll_update_info')
                ?.getSqlTableDescription('chrome_scroll_update_info');
            child = (0, mithril_1.default)(tree_1.Tree, (0, mithril_1.default)(tree_1.TreeNode, {
                left: 'Vsync interval',
                right: this.scrollData.vsyncInterval === undefined
                    ? `${this.scrollData.vsyncInterval}`
                    : (0, mithril_1.default)(duration_1.DurationWidget, { dur: this.scrollData.vsyncInterval }),
            }), (0, mithril_1.default)(tree_1.TreeNode, {
                left: 'Is presented',
                right: `${this.scrollData.isPresented}`,
            }), (0, mithril_1.default)(tree_1.TreeNode, {
                left: 'Is janky',
                right: `${this.scrollData.isJanky}`,
            }), (0, mithril_1.default)(tree_1.TreeNode, {
                left: 'Is inertial',
                right: `${this.scrollData.isInertial}`,
            }), (0, mithril_1.default)(tree_1.TreeNode, {
                left: 'Is first scroll update in scroll',
                right: `${this.scrollData.isFirstScrollUpdateInScroll}`,
            }), (0, mithril_1.default)(tree_1.TreeNode, {
                left: 'Is first scroll update in frame',
                right: `${this.scrollData.isFirstScrollUpdateInFrame}`,
            }), (0, mithril_1.default)(tree_1.TreeNode, {
                left: 'SQL ID',
                right: (0, utils_1.renderSqlRef)({
                    trace: this.trace,
                    tableName: 'chrome_scroll_update_info',
                    id: this.sliceData.scrollUpdateId,
                    tableDescription: scrollTableDescription,
                }),
            }));
        }
        return (0, mithril_1.default)(section_1.Section, { title: 'Scroll details' }, child);
    }
}
exports.ScrollTimelineDetailsPanel = ScrollTimelineDetailsPanel;
//# sourceMappingURL=scroll_timeline_details_panel.js.map