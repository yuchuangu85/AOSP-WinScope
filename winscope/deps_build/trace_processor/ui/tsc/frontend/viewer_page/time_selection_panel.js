"use strict";
// Copyright (C) 2019 The Android Open Source Project
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use size file except in compliance with the License.
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
exports.TimeSelectionPanel = void 0;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const canvas_utils_1 = require("../../base/canvas_utils");
const logging_1 = require("../../base/logging");
const time_1 = require("../../base/time");
const time_scale_1 = require("../../base/time_scale");
const time_utils_1 = require("../../components/time_utils");
const timeline_1 = require("../../public/timeline");
const css_constants_1 = require("../css_constants");
const gridline_helper_1 = require("./gridline_helper");
// Draws a vertical line with two horizontal tails at the left and right and
// a label in the middle. It looks a bit like a stretched H:
// |--- Label ---|
// The |target| bounding box determines where to draw the H.
// The |bounds| bounding box gives the visible region, this is used to adjust
// the positioning of the label to ensure it is on screen.
function drawHBar(ctx, target, bounds, label) {
    ctx.fillStyle = css_constants_1.COLOR_TEXT_MUTED;
    const xLeft = Math.floor(target.x);
    const xRight = Math.floor(target.x + target.width);
    const yMid = Math.floor(target.height / 2 + target.y);
    const xWidth = xRight - xLeft;
    // Don't draw in the track shell.
    ctx.beginPath();
    ctx.rect(bounds.x, bounds.y, bounds.width, bounds.height);
    ctx.clip();
    // Draw horizontal bar of the H.
    ctx.fillRect(xLeft, yMid, xWidth, 1);
    // Draw left vertical bar of the H.
    ctx.fillRect(xLeft, target.y, 1, target.height);
    // Draw right vertical bar of the H.
    ctx.fillRect(xRight, target.y, 1, target.height);
    const labelWidth = ctx.measureText(label).width;
    // Find a good position for the label:
    // By default put the label in the middle of the visible portion of the H.
    const visibleLeft = Math.max(xLeft, bounds.x);
    const visibleRight = Math.min(xRight, bounds.x + bounds.width);
    const visibleCenter = Math.floor((visibleLeft + visibleRight) / 2);
    let labelXLeft = Math.floor(visibleCenter - labelWidth / 2);
    if (labelWidth > target.width ||
        labelXLeft < bounds.x ||
        labelXLeft + labelWidth > bounds.x + bounds.width) {
        // It won't fit in the middle or would be at least partly out of bounds
        // so put it either to the left or right:
        if (xRight > bounds.x + bounds.width) {
            // If the H extends off the right side of the screen the label
            // goes on the left of the H.
            labelXLeft = xLeft - labelWidth - 3;
        }
        else {
            // Otherwise the label goes on the right of the H.
            labelXLeft = xRight + 3;
        }
    }
    ctx.fillStyle = css_constants_1.COLOR_BACKGROUND;
    ctx.fillRect(labelXLeft - 1, 0, labelWidth + 1, target.height);
    ctx.textBaseline = 'middle';
    ctx.fillStyle = css_constants_1.COLOR_TEXT_MUTED;
    ctx.font = `10px ${css_constants_1.FONT_COMPACT}`;
    ctx.fillText(label, labelXLeft, yMid);
}
function drawIBar(ctx, xPos, bounds, label) {
    if (xPos < bounds.x)
        return;
    ctx.fillStyle = css_constants_1.COLOR_TEXT_MUTED;
    ctx.fillRect(xPos, 0, 1, bounds.width);
    const yMid = Math.floor(bounds.height / 2 + bounds.y);
    const labelWidth = ctx.measureText(label).width;
    const padding = 3;
    let xPosLabel;
    if (xPos + padding + labelWidth > bounds.width) {
        xPosLabel = xPos - padding;
        ctx.textAlign = 'right';
    }
    else {
        xPosLabel = xPos + padding;
        ctx.textAlign = 'left';
    }
    ctx.fillStyle = css_constants_1.COLOR_BACKGROUND;
    ctx.fillRect(xPosLabel - 1, 0, labelWidth + 2, bounds.height);
    ctx.textBaseline = 'middle';
    ctx.fillStyle = css_constants_1.COLOR_TEXT_MUTED;
    ctx.font = `10px ${css_constants_1.FONT_COMPACT}`;
    ctx.fillText(label, xPosLabel, yMid);
}
// Draws a marker: triangle pointing down.
function drawMarker(ctx, target, bounds) {
    const xPos = Math.floor(target.x);
    if (xPos < bounds.x || xPos > bounds.x + bounds.width)
        return;
    ctx.fillStyle = css_constants_1.COLOR_TEXT;
    const yMid = Math.floor(target.height / 2 + target.y);
    const size = 4;
    // Don't draw in the track shell.
    ctx.beginPath();
    ctx.rect(bounds.x, bounds.y, bounds.width, bounds.height);
    ctx.clip();
    // Draw triangle pointing down. Offset it down a bit to balance triange being top-heavy.
    const yCenter = yMid + 1;
    ctx.beginPath();
    ctx.moveTo(xPos - size, yCenter - size);
    ctx.lineTo(xPos + size, yCenter - size);
    ctx.lineTo(xPos, yCenter + size);
    ctx.closePath();
    ctx.fill();
}
class TimeSelectionPanel {
    trace;
    height = 10;
    constructor(trace) {
        this.trace = trace;
    }
    render() {
        return (0, mithril_1.default)('', { style: { height: `${this.height}px` } });
    }
    renderCanvas(ctx, size) {
        ctx.fillStyle = css_constants_1.COLOR_BORDER;
        ctx.fillRect(css_constants_1.TRACK_SHELL_WIDTH - 1, 0, 1, size.height);
        const trackSize = { ...size, width: size.width - css_constants_1.TRACK_SHELL_WIDTH };
        ctx.save();
        ctx.translate(css_constants_1.TRACK_SHELL_WIDTH, 0);
        (0, canvas_utils_1.canvasClip)(ctx, 0, 0, trackSize.width, trackSize.height);
        this.renderPanel(ctx, trackSize);
        ctx.restore();
    }
    renderPanel(ctx, size) {
        const visibleWindow = this.trace.timeline.visibleWindow;
        const timescale = new time_scale_1.TimeScale(visibleWindow, {
            left: 0,
            right: size.width,
        });
        const timespan = visibleWindow.toTimeSpan();
        if (size.width > 0 && timespan.duration > 0n) {
            const maxMajorTicks = (0, gridline_helper_1.getMaxMajorTicks)(size.width);
            const offset = this.trace.timeline.getTimeAxisOrigin();
            const tickGen = (0, gridline_helper_1.generateTicks)(timespan, maxMajorTicks, offset);
            for (const { type, time } of tickGen) {
                const px = Math.floor(timescale.timeToPx(time));
                if (type === gridline_helper_1.TickType.MAJOR) {
                    ctx.fillRect(px, 0, 1, size.height);
                }
            }
        }
        const localSpan = this.trace.timeline.selectedSpan;
        const selection = this.trace.selection.selection;
        if (localSpan !== undefined) {
            const start = time_1.Time.min(localSpan.start, localSpan.end);
            const end = time_1.Time.max(localSpan.start, localSpan.end);
            this.renderSpan(ctx, timescale, size, start, end);
        }
        else {
            if (selection.kind === 'area') {
                const start = time_1.Time.min(selection.start, selection.end);
                const end = time_1.Time.max(selection.start, selection.end);
                this.renderSpan(ctx, timescale, size, start, end);
            }
            else if (selection.kind === 'track_event' &&
                selection.dur !== undefined) {
                const start = selection.ts;
                const end = time_1.Time.add(selection.ts, selection.dur);
                if (selection.dur === 0n) {
                    this.renderInstantEvent(ctx, timescale, size, selection.ts);
                }
                else if (end > start) {
                    this.renderSpan(ctx, timescale, size, start, end);
                }
            }
        }
        if (this.trace.timeline.hoverCursorTimestamp !== undefined) {
            this.renderHover(ctx, timescale, size, this.trace.timeline.hoverCursorTimestamp);
        }
        for (const note of this.trace.notes.notes.values()) {
            const noteIsSelected = selection.kind === 'note' && selection.id === note.id;
            if (note.noteType === 'SPAN' && noteIsSelected) {
                this.renderSpan(ctx, timescale, size, note.start, note.end);
            }
        }
        ctx.restore();
    }
    renderHover(ctx, timescale, size, ts) {
        const xPos = Math.floor(timescale.timeToPx(ts));
        const bounds = this.getBBoxFromSize(size);
        const hoverVisible = bounds.x <= xPos && xPos <= bounds.x + bounds.width;
        if (hoverVisible) {
            const domainTime = this.trace.timeline.toDomainTime(ts);
            const label = this.stringifyTimestamp(domainTime);
            drawIBar(ctx, xPos, bounds, label);
            return;
        }
        ctx.save();
        ctx.font = `10px ${css_constants_1.FONT_COMPACT}`;
        ctx.textBaseline = 'middle';
        const yMid = Math.floor(bounds.height / 2);
        const { label, labelWidth, textX } = (() => {
            if (xPos < bounds.x) {
                const distance = time_1.Time.sub(timescale.timeSpan.start.toTime(), ts);
                const label = `← ${(0, time_utils_1.formatDuration)(this.trace, distance)}`;
                const labelWidth = ctx.measureText(label).width;
                return {
                    textX: bounds.x,
                    label,
                    labelWidth,
                };
            }
            else {
                const distance = time_1.Time.sub(ts, timescale.timeSpan.end.toTime());
                const label = `${(0, time_utils_1.formatDuration)(this.trace, distance)} →`;
                const labelWidth = ctx.measureText(label).width;
                return {
                    label,
                    labelWidth,
                    textX: bounds.x + bounds.width - labelWidth,
                };
            }
        })();
        ctx.fillStyle = css_constants_1.COLOR_BACKGROUND;
        ctx.fillRect(textX - 1, 0, labelWidth + 2, bounds.height);
        ctx.fillStyle = css_constants_1.COLOR_TEXT;
        ctx.fillText(label, textX, yMid);
        ctx.restore();
    }
    renderSpan(ctx, timescale, trackSize, start, end) {
        const xLeft = timescale.timeToPx(start);
        const xRight = timescale.timeToPx(end);
        const label = (0, time_utils_1.formatDuration)(this.trace, end - start);
        drawHBar(ctx, {
            x: xLeft,
            y: 0,
            width: xRight - xLeft,
            height: trackSize.height,
        }, this.getBBoxFromSize(trackSize), label);
    }
    renderInstantEvent(ctx, timescale, trackSize, ts) {
        const xPos = timescale.timeToPx(ts);
        drawMarker(ctx, {
            x: xPos,
            y: 0,
            width: 0,
            height: trackSize.height,
        }, this.getBBoxFromSize(trackSize));
    }
    getBBoxFromSize(size) {
        return {
            x: 0,
            y: 0,
            width: size.width,
            height: size.height,
        };
    }
    stringifyTimestamp(time) {
        const fmt = this.trace.timeline.timestampFormat;
        switch (fmt) {
            case timeline_1.TimestampFormat.UTC:
            case timeline_1.TimestampFormat.CustomTimezone:
            case timeline_1.TimestampFormat.TraceTz:
            case timeline_1.TimestampFormat.Timecode:
                const THIN_SPACE = '\u2009';
                return time_1.Time.toTimecode(time).toString(THIN_SPACE);
            case timeline_1.TimestampFormat.TraceNs:
                return time.toString();
            case timeline_1.TimestampFormat.TraceNsLocale:
                return time.toLocaleString();
            case timeline_1.TimestampFormat.Seconds:
                return time_1.Time.formatSeconds(time);
            case timeline_1.TimestampFormat.Milliseconds:
                return time_1.Time.formatMilliseconds(time);
            case timeline_1.TimestampFormat.Microseconds:
                return time_1.Time.formatMicroseconds(time);
            default:
                (0, logging_1.assertUnreachable)(fmt);
        }
    }
}
exports.TimeSelectionPanel = TimeSelectionPanel;
//# sourceMappingURL=time_selection_panel.js.map