"use strict";
// Copyright (C) 2018 The Android Open Source Project
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
exports.TimelineImpl = void 0;
const logging_1 = require("../base/logging");
const time_1 = require("../base/time");
const high_precision_time_span_1 = require("../base/high_precision_time_span");
const raf_scheduler_1 = require("./raf_scheduler");
const high_precision_time_1 = require("../base/high_precision_time");
const timeline_1 = require("../public/timeline");
const MIN_DURATION = 10;
/**
 * State that is shared between several frontend components, but not the
 * controller. This state is updated at 60fps.
 */
class TimelineImpl {
    traceInfo;
    _timestampFormat;
    _durationPrecision;
    timezoneOverride;
    _visibleWindow;
    _hoverCursorTimestamp;
    _highlightedSliceId;
    _hoveredNoteTimestamp;
    // TODO(stevegolton): These are currently only referenced by the cpu slice
    // tracks and the process summary tracks. We should just make this a local
    // property of the cpu slice tracks and ignore them in the process tracks.
    _hoveredUtid;
    _hoveredPid;
    // This is used to mark the timeline of the area that is currently being
    // selected.
    //
    // TODO(stevegolton): This shouldn't really be in the global timeline state,
    // it's really only a concept of the viewer page and should be moved there
    // instead.
    selectedSpan;
    get highlightedSliceId() {
        return this._highlightedSliceId;
    }
    set highlightedSliceId(x) {
        this._highlightedSliceId = x;
        raf_scheduler_1.raf.scheduleCanvasRedraw();
    }
    get hoveredNoteTimestamp() {
        return this._hoveredNoteTimestamp;
    }
    set hoveredNoteTimestamp(x) {
        this._hoveredNoteTimestamp = x;
        raf_scheduler_1.raf.scheduleCanvasRedraw();
    }
    get hoveredUtid() {
        return this._hoveredUtid;
    }
    set hoveredUtid(x) {
        this._hoveredUtid = x;
        raf_scheduler_1.raf.scheduleCanvasRedraw();
    }
    get hoveredPid() {
        return this._hoveredPid;
    }
    set hoveredPid(x) {
        this._hoveredPid = x;
        raf_scheduler_1.raf.scheduleCanvasRedraw();
    }
    constructor(traceInfo, _timestampFormat, _durationPrecision, timezoneOverride) {
        this.traceInfo = traceInfo;
        this._timestampFormat = _timestampFormat;
        this._durationPrecision = _durationPrecision;
        this.timezoneOverride = timezoneOverride;
        this._visibleWindow = high_precision_time_span_1.HighPrecisionTimeSpan.fromTime(traceInfo.start, traceInfo.end);
    }
    // TODO: there is some redundancy in the fact that both |visibleWindowTime|
    // and a |timeScale| have a notion of time range. That should live in one
    // place only.
    zoomVisibleWindow(ratio, centerPoint) {
        this._visibleWindow = this._visibleWindow
            .scale(ratio, centerPoint, MIN_DURATION)
            .fitWithin(this.traceInfo.start, this.traceInfo.end);
        raf_scheduler_1.raf.scheduleCanvasRedraw();
    }
    panVisibleWindow(delta) {
        this._visibleWindow = this._visibleWindow
            .translate(delta)
            .fitWithin(this.traceInfo.start, this.traceInfo.end);
        raf_scheduler_1.raf.scheduleCanvasRedraw();
    }
    // Given a timestamp, if |ts| is not currently in view move the view to
    // center |ts|, keeping the same zoom level.
    panToTimestamp(ts) {
        if (this._visibleWindow.contains(ts))
            return;
        // TODO(hjd): This is an ugly jump, we should do a smooth pan instead.
        const halfDuration = this.visibleWindow.duration / 2;
        const newStart = new high_precision_time_1.HighPrecisionTime(ts).subNumber(halfDuration);
        const newWindow = new high_precision_time_span_1.HighPrecisionTimeSpan(newStart, this._visibleWindow.duration);
        this.updateVisibleTimeHP(newWindow);
    }
    // Set visible window using an integer time span
    updateVisibleTime(ts) {
        this.updateVisibleTimeHP(high_precision_time_span_1.HighPrecisionTimeSpan.fromTime(ts.start, ts.end));
    }
    // TODO(primiano): we ended up with two entry-points for the same function,
    // unify them.
    setViewportTime(start, end) {
        this.updateVisibleTime(new time_1.TimeSpan(start, end));
    }
    moveStart(delta) {
        this.updateVisibleTimeHP(new high_precision_time_span_1.HighPrecisionTimeSpan(this._visibleWindow.start.addNumber(delta), this.visibleWindow.duration - delta));
    }
    moveEnd(delta) {
        this.updateVisibleTimeHP(new high_precision_time_span_1.HighPrecisionTimeSpan(this._visibleWindow.start, this.visibleWindow.duration + delta));
    }
    // Set visible window using a high precision time span
    updateVisibleTimeHP(ts) {
        this._visibleWindow = ts
            .clampDuration(MIN_DURATION)
            .fitWithin(this.traceInfo.start, this.traceInfo.end);
        raf_scheduler_1.raf.scheduleCanvasRedraw();
    }
    // Get the bounds of the visible window as a high-precision time span
    get visibleWindow() {
        return this._visibleWindow;
    }
    get hoverCursorTimestamp() {
        return this._hoverCursorTimestamp;
    }
    set hoverCursorTimestamp(t) {
        this._hoverCursorTimestamp = t;
        raf_scheduler_1.raf.scheduleCanvasRedraw();
    }
    /**
     * The trace time value where the timeline is considered to actually start.
     * E.g.
     *  - Raw: offset = 0
     *  - Trace: offset = trace.start
     *  - Realtime: offset = previous midnight before trace.start
     */
    getTimeAxisOrigin() {
        const fmt = this.timestampFormat;
        switch (fmt) {
            case timeline_1.TimestampFormat.Timecode:
            case timeline_1.TimestampFormat.Seconds:
            case timeline_1.TimestampFormat.Milliseconds:
            case timeline_1.TimestampFormat.Microseconds:
                return this.traceInfo.start;
            case timeline_1.TimestampFormat.TraceNs:
            case timeline_1.TimestampFormat.TraceNsLocale:
                return time_1.Time.ZERO;
            case timeline_1.TimestampFormat.UTC:
                return getTraceMidnightInTimezone(this.traceInfo.start, this.traceInfo.unixOffset, 0);
            case timeline_1.TimestampFormat.CustomTimezone:
                return getTraceMidnightInTimezone(this.traceInfo.start, this.traceInfo.unixOffset, time_1.timezoneOffsetMap[this.timezoneOverride.get()]);
            case timeline_1.TimestampFormat.TraceTz:
                return getTraceMidnightInTimezone(this.traceInfo.start, this.traceInfo.unixOffset, this.traceInfo.tzOffMin);
            default:
                (0, logging_1.assertUnreachable)(fmt);
        }
    }
    // Convert absolute time to domain time.
    toDomainTime(ts) {
        return time_1.Time.sub(ts, this.getTimeAxisOrigin());
    }
    get timestampFormat() {
        return this._timestampFormat.get();
    }
    set timestampFormat(format) {
        this._timestampFormat.set(format);
    }
    get durationPrecision() {
        return this._durationPrecision.get();
    }
    set durationPrecision(precision) {
        this._durationPrecision.set(precision);
    }
    get customTimezoneOffset() {
        return time_1.timezoneOffsetMap[this.timezoneOverride.get()];
    }
}
exports.TimelineImpl = TimelineImpl;
/**
 * Returns the timestamp of the midnight before the trace starts in trace time
 * units.
 *
 * @param traceStart - The trace-time timestamp of the start of the trace.
 * @param unixOffset - The offset between the timestamp and the unix epoch.
 * @param tzOffsetMins - The configured timezone offset in minutes.
 * @returns The trace-time timestamp at the first midnight before the trace
 * starts.
 */
function getTraceMidnightInTimezone(traceStart, unixOffset, tzOffsetMins) {
    const unixTime = time_1.Time.toDate(traceStart, unixOffset);
    // Remove the time component of the date, viewed in the specific
    // timezone we're looking for.
    const midnight = dateOnly(unixTime, tzOffsetMins);
    // Convert back to trace time
    return time_1.Time.fromDate(midnight, unixOffset);
}
function dateOnly(date, tzOffsetMins) {
    // 1. Get the timestamp in milliseconds from the original date.
    const originalTimestamp = date.getTime();
    // 2. Calculate the timezone offset in milliseconds.
    const timezoneOffsetInMilliseconds = tzOffsetMins * 60 * 1000;
    // 3. Create a new Date object representing the time in the target timezone.
    //    We do this by adding our offset to the UTC time.
    const dateInTargetTimezone = new Date(originalTimestamp + timezoneOffsetInMilliseconds);
    // 4. Now, working with this new Date object in the UTC frame,
    //    we can simply set its time components to the start of the day (midnight).
    dateInTargetTimezone.setUTCHours(0, 0, 0, 0);
    // 5. Finally, we convert this back to a timestamp and create a new Date object.
    //    This gives us the UTC timestamp of the midnight in the target timezone.
    return new Date(dateInTargetTimezone.getTime() - timezoneOffsetInMilliseconds);
}
//# sourceMappingURL=timeline.js.map