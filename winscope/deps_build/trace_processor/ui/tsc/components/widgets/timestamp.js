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
exports.Timestamp = void 0;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const clipboard_1 = require("../../base/clipboard");
const semantic_icons_1 = require("../../base/semantic_icons");
const time_1 = require("../../base/time");
const anchor_1 = require("../../widgets/anchor");
const menu_1 = require("../../widgets/menu");
const timestamp_format_menu_1 = require("./timestamp_format_menu");
const time_utils_1 = require("../time_utils");
const timeline_1 = require("../../public/timeline");
class Timestamp {
    view({ attrs }) {
        const { trace, ts } = attrs;
        const timeline = trace.timeline;
        return (0, mithril_1.default)(menu_1.PopupMenu, {
            trigger: (0, mithril_1.default)(anchor_1.Anchor, {
                onmouseover: () => (timeline.hoverCursorTimestamp = ts),
                onmouseout: () => (timeline.hoverCursorTimestamp = undefined),
            }, attrs.display ??
                this.formatTimestamp(trace, timeline.toDomainTime(ts))),
        }, (0, mithril_1.default)(menu_1.MenuItem, {
            icon: semantic_icons_1.Icons.Copy,
            label: `Copy raw value`,
            onclick: () => {
                (0, clipboard_1.copyToClipboard)(ts.toString());
            },
        }), (0, mithril_1.default)(timestamp_format_menu_1.TimestampFormatMenuItem, { trace }), attrs.extraMenuItems ? [(0, mithril_1.default)(menu_1.MenuDivider), attrs.extraMenuItems] : null);
    }
    formatTimestamp(trace, time) {
        const fmt = trace.timeline.timestampFormat;
        switch (fmt) {
            case timeline_1.TimestampFormat.UTC:
            case timeline_1.TimestampFormat.TraceTz:
            case timeline_1.TimestampFormat.Timecode:
            case timeline_1.TimestampFormat.CustomTimezone:
                return (0, time_utils_1.renderTimecode)(time);
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
                const x = fmt;
                throw new Error(`Invalid timestamp ${x}`);
        }
    }
}
exports.Timestamp = Timestamp;
//# sourceMappingURL=timestamp.js.map