"use strict";
// Copyright (C) 2023 The Android Open Source Project
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
exports.DatasetSliceTrack = void 0;
const logging_1 = require("../../base/logging");
const time_1 = require("../../base/time");
const query_result_1 = require("../../trace_processor/query_result");
const colorizer_1 = require("../colorizer");
const layout_1 = require("../sql_utils/layout");
const time_utils_1 = require("../time_utils");
const base_slice_track_1 = require("./base_slice_track");
const rowSchema = {
    id: query_result_1.NUM,
    ts: query_result_1.LONG,
};
class DatasetSliceTrack extends base_slice_track_1.BaseSliceTrack {
    attrs;
    sqlSource;
    rootTableName;
    constructor(attrs) {
        super(attrs.trace, attrs.uri, { ...base_slice_track_1.BASE_ROW, ...attrs.dataset.schema }, attrs.sliceLayout, attrs.initialMaxDepth, attrs.instantStyle?.width);
        this.attrs = attrs;
        const { dataset, queryGenerator } = attrs;
        // This is the minimum viable implementation that the source dataset must
        // implement for the track to work properly. Typescript should enforce this
        // now, but typescript can be worked around, and checking it is cheap.
        // Better to error out early.
        (0, logging_1.assertTrue)(this.attrs.dataset.implements(rowSchema));
        this.sqlSource =
            queryGenerator?.(dataset) ?? this.generateRenderQuery(dataset);
        this.rootTableName = attrs.rootTableName;
    }
    rowToSlice(row) {
        const slice = this.rowToSliceBase(row);
        const title = this.getTitle(row);
        const color = this.getColor(row, title);
        // Take a copy of the row, only copying the keys listed in the schema.
        const cols = Object.keys(this.attrs.dataset.schema);
        const clonedRow = Object.fromEntries(Object.entries(row).filter(([key]) => cols.includes(key)));
        return {
            ...slice,
            title,
            colorScheme: color,
            fillRatio: this.attrs.fillRatio?.(row) ?? slice.fillRatio,
            row: clonedRow,
        };
    }
    // Generate a query to use for generating slices to be rendered
    generateRenderQuery(dataset) {
        if (dataset.implements({ dur: query_result_1.LONG, depth: query_result_1.NUM })) {
            // Both depth and dur provided, we can use the dataset as-is.
            return dataset.query();
        }
        else if (dataset.implements({ depth: query_result_1.NUM })) {
            // Depth provided but no dur, assume each event is an instant event by
            // hard coding dur to 0.
            return `select 0 as dur, * from (${dataset.query()})`;
        }
        else if (dataset.implements({ dur: query_result_1.LONG })) {
            // Dur provided but no depth, automatically calculate the depth using
            // internal_layout().
            return (0, layout_1.generateSqlWithInternalLayout)({
                columns: ['*'],
                source: dataset.query(),
                ts: 'ts',
                dur: 'dur',
                orderByClause: 'ts',
            });
        }
        else {
            // No depth nor dur provided, use 0 for both.
            return `select 0 as dur, 0 as depth, * from (${dataset.query()})`;
        }
    }
    getTitle(row) {
        if (this.attrs.sliceName)
            return this.attrs.sliceName(row);
        if ('name' in row && typeof row.name === 'string')
            return row.name;
        return undefined;
    }
    getColor(row, title) {
        if (this.attrs.colorizer)
            return this.attrs.colorizer(row);
        if (title)
            return (0, colorizer_1.getColorForSlice)(title);
        return (0, colorizer_1.getColorForSlice)(`${row.id}`);
    }
    getSqlSource() {
        return this.sqlSource;
    }
    getJoinSqlSource() {
        // This is a little performance optimization. Internally BST joins the
        // results of the mipmap table query with the sqlSource in order to get the
        // original ts, dur and id. However this sqlSource can sometimes be a
        // contrived, slow query, usually to calculate the depth (e.g. something
        // based on experimental_slice_layout).
        //
        // We don't actually need a depth value at this point, so calculating it is
        // worthless. We only need ts, id, and dur. We don't even need this query to
        // be correctly filtered, as we are merely joining on this table. We do
        // however need it to be fast.
        //
        // In conclusion, if the dataset source has a dur column present (ts, and id
        // are mandatory), then we can take a shortcut and just use this much
        // simpler query to join on.
        if (this.attrs.dataset.implements({ dur: query_result_1.LONG })) {
            return this.attrs.dataset.src;
        }
        else {
            return this.sqlSource;
        }
    }
    getDataset() {
        return this.attrs.dataset;
    }
    detailsPanel(sel) {
        if (this.attrs.detailsPanel) {
            // This type assertion is required as a temporary patch while the
            // specifics of selection details are being worked out. Eventually we will
            // change the selection details to be purely based on dataset, but there
            // are currently some use cases preventing us from doing so. For now, this
            // type assertion is safe as we know we just returned the entire row from
            // from getSelectionDetails() so we know it must at least implement the
            // row's type `T`.
            return this.attrs.detailsPanel(sel);
        }
        else {
            return undefined;
        }
    }
    async getSelectionDetails(id) {
        const { trace, dataset } = this.attrs;
        const result = await trace.engine.query(`
      SELECT *
      FROM (${dataset.query()})
      WHERE id = ${id}
    `);
        const row = result.iter(dataset.schema);
        if (!row.valid())
            return undefined;
        // Pull the fields out from the results
        const data = {};
        for (const col of result.columns()) {
            data[col] = row.get(col);
        }
        return {
            ...data,
            ts: time_1.Time.fromRaw(row.ts),
        };
    }
    onUpdatedSlices(slices) {
        for (const slice of slices) {
            slice.isHighlighted = slice === this.hoveredSlice;
        }
    }
    getTrackShellButtons() {
        return this.attrs.shellButtons?.();
    }
    onSliceOver(args) {
        const { title, dur, flags } = args.slice;
        let duration;
        if (flags & base_slice_track_1.SLICE_FLAGS_INCOMPLETE) {
            duration = 'Incomplete';
        }
        else if (flags & base_slice_track_1.SLICE_FLAGS_INSTANT) {
            duration = 'Instant';
        }
        else {
            duration = (0, time_utils_1.formatDuration)(this.trace, dur);
        }
        if (title) {
            args.tooltip = [`${title} - [${duration}]`];
        }
        else {
            args.tooltip = [`[${duration}]`];
        }
        args.tooltip = this.attrs.tooltip?.(args.slice.row) ?? args.tooltip;
    }
    // Override the drawChevron function.
    drawChevron(ctx, x, y, h) {
        if (this.attrs.instantStyle?.render) {
            this.attrs.instantStyle.render(ctx, {
                x,
                y,
                height: h,
                width: this.attrs.instantStyle.width,
            });
        }
        else {
            super.drawChevron(ctx, x, y, h);
        }
    }
}
exports.DatasetSliceTrack = DatasetSliceTrack;
//# sourceMappingURL=dataset_slice_track.js.map