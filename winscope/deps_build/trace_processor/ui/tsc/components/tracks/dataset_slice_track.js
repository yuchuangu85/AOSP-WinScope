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
exports.renderTooltip = renderTooltip;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const time_1 = require("../../base/time");
const query_result_1 = require("../../trace_processor/query_result");
const colorizer_1 = require("../colorizer");
const time_utils_1 = require("../time_utils");
const base_slice_track_1 = require("./base_slice_track");
const utils_1 = require("../../base/utils");
const array_utils_1 = require("../../base/array_utils");
const rowSchema = {
    id: query_result_1.NUM,
    ts: query_result_1.LONG,
};
function getDataset(attrs) {
    const dataset = attrs.dataset;
    return typeof dataset === 'function' ? dataset() : dataset;
}
class DatasetSliceTrack extends base_slice_track_1.BaseSliceTrack {
    attrs;
    rootTableName;
    constructor(attrs) {
        const dataset = getDataset(attrs);
        super(attrs.trace, attrs.uri, { ...base_slice_track_1.BASE_ROW, ...dataset.schema }, attrs.sliceLayout, attrs.initialMaxDepth, attrs.instantStyle?.width, attrs.forceTsRenderOrder ?? false);
        this.attrs = attrs;
        this.rootTableName = attrs.rootTableName;
    }
    rowToSlice(row) {
        const slice = this.rowToSliceBase(row);
        const title = this.getTitle(row);
        const color = this.getColor(row, title);
        const dataset = getDataset(this.attrs);
        // Take a copy of the row, only copying the keys listed in the schema.
        const cols = Object.keys(dataset.schema);
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
        const hasLayer = dataset.implements({ layer: query_result_1.NUM });
        const hasDepth = dataset.implements({ depth: query_result_1.NUM });
        const hasDur = dataset.implements({ dur: query_result_1.LONG });
        const cols = (0, array_utils_1.removeFalsyValues)([
            // If we have no layer, assume flat layering.
            !hasLayer && '0 as layer',
            // If we have dur but no depth, automatically calculate layout.
            !hasDepth &&
                hasDur &&
                `
          internal_layout(ts, dur) OVER (
            ORDER BY ts ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
          ) AS depth
        `,
            // If we have no dur or depth, use a flat layout.
            !hasDepth && !hasDur && '0 as depth',
            // If no dur, assume instant slices.
            !hasDur && '0 as dur',
        ]);
        if (cols.length === 0) {
            return dataset.query();
        }
        else {
            return `select ${cols.join(', ')}, * from (${dataset.query()})`;
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
        const dataset = typeof this.attrs.dataset === 'function'
            ? this.attrs.dataset()
            : this.attrs.dataset;
        return this.generateRenderQuery(dataset);
    }
    getDataset() {
        return getDataset(this.attrs);
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
        const { trace } = this.attrs;
        const dataset = getDataset(this.attrs);
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
    renderTooltipForSlice(slice) {
        return this.attrs.tooltip?.(slice) ?? renderTooltip(this.trace, slice);
    }
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
// Most tooltips follow a predictable formula. This function extracts the
// duration and title from the slice and formats them in a standard way,
// allowing some optional overrides to be passed.
function renderTooltip(trace, slice, opts = {}) {
    const durationFormatted = formatDurationForTooltip(trace, slice);
    const { title = slice.title, extras } = opts;
    return [
        (0, mithril_1.default)('', (0, utils_1.exists)(durationFormatted) && (0, mithril_1.default)('b', durationFormatted), ' ', title),
        extras,
        slice.count > 1 && (0, mithril_1.default)('div', `and ${slice.count - 1} other events`),
    ];
}
// Given a slice, format the duration of the slice for a tooltip.
function formatDurationForTooltip(trace, slice) {
    const { dur, flags } = slice;
    if (flags & base_slice_track_1.SLICE_FLAGS_INCOMPLETE) {
        return '[Incomplete]';
    }
    else if (flags & base_slice_track_1.SLICE_FLAGS_INSTANT) {
        return undefined;
    }
    else {
        return (0, time_utils_1.formatDuration)(trace, dur);
    }
}
//# sourceMappingURL=dataset_slice_track.js.map