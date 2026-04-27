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
exports.TimestampFormatMenuItem = void 0;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const menu_1 = require("../../widgets/menu");
const timeline_1 = require("../../public/timeline");
const time_1 = require("../../base/time");
class TimestampFormatMenuItem {
    view({ attrs }) {
        const timeline = attrs.trace.timeline;
        function renderMenuItem(value, label) {
            return (0, mithril_1.default)(menu_1.MenuItem, {
                label,
                active: value === timeline.timestampFormat,
                onclick: () => {
                    timeline.timestampFormat = value;
                },
            });
        }
        const timeZone = (0, time_1.formatTimezone)(attrs.trace.traceInfo.tzOffMin);
        const TF = timeline_1.TimestampFormat;
        return (0, mithril_1.default)(menu_1.MenuItem, {
            label: 'Time format',
        }, renderMenuItem(TF.Timecode, 'Timecode'), renderMenuItem(TF.UTC, 'Realtime (UTC)'), renderMenuItem(TF.TraceTz, `Realtime (Trace TZ - ${timeZone})`), renderMenuItem(TF.Seconds, 'Seconds'), renderMenuItem(TF.Milliseconds, 'Milliseconds'), renderMenuItem(TF.Microseconds, 'Microseconds'), renderMenuItem(TF.TraceNs, 'Raw'), renderMenuItem(TF.TraceNsLocale, 'Raw (with locale-specific formatting)'), (0, mithril_1.default)(menu_1.MenuItem, {
            label: 'Custom',
            active: TF.CustomTimezone === timeline.timestampFormat,
        }, Object.keys(time_1.timezoneOffsetMap).map((tz) => {
            const customTz = timeline.timezoneOverride;
            return (0, mithril_1.default)(menu_1.MenuItem, {
                label: tz,
                active: tz === customTz.get(),
                onclick: () => {
                    timeline.timestampFormat = TF.CustomTimezone;
                    customTz.set(tz);
                },
            });
        })));
    }
}
exports.TimestampFormatMenuItem = TimestampFormatMenuItem;
//# sourceMappingURL=timestamp_format_menu.js.map