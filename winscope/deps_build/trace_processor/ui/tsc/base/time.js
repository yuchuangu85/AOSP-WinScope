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
exports.timezoneOffsetMap = exports.TimeSpan = exports.Timecode = exports.Duration = exports.Time = void 0;
exports.currentDateHourAndMinute = currentDateHourAndMinute;
exports.formatDate = formatDate;
exports.formatTimezone = formatTimezone;
const bigint_math_1 = require("./bigint_math");
const logging_1 = require("./logging");
// The conversion factor for converting between different time units.
const TIME_UNITS_PER_SEC = 1e9;
const TIME_UNITS_PER_MILLISEC = 1e6;
const TIME_UNITS_PER_MICROSEC = 1e3;
class Time {
    // Negative time is never found in a trace - so -1 is commonly used as a flag
    // to represent a value is undefined or unset, without having to use a
    // nullable or union type.
    static INVALID = Time.fromRaw(-1n);
    // The min and max possible values, considering times cannot be negative.
    static MIN = Time.fromRaw(0n);
    static MAX = Time.fromRaw(bigint_math_1.BigintMath.INT64_MAX);
    static ZERO = Time.fromRaw(0n);
    static fromRaw(v) {
        return v;
    }
    // Convert seconds (number) to a time value.
    // Note: number -> BigInt conversion is relatively slow.
    static fromSeconds(seconds) {
        return Time.fromRaw(BigInt(Math.floor(seconds * TIME_UNITS_PER_SEC)));
    }
    // Convert time value to seconds and return as a number (i.e. float).
    // Warning: This function is lossy, i.e. precision is lost when converting
    // BigInt -> number.
    // Note: BigInt -> number conversion is relatively slow.
    static toSeconds(t) {
        return Number(t) / TIME_UNITS_PER_SEC;
    }
    // Convert milliseconds (number) to a time value.
    // Note: number -> BigInt conversion is relatively slow.
    static fromMillis(millis) {
        return Time.fromRaw(BigInt(Math.floor(millis * TIME_UNITS_PER_MILLISEC)));
    }
    // Convert time value to milliseconds and return as a number (i.e. float).
    // Warning: This function is lossy, i.e. precision is lost when converting
    // BigInt -> number.
    // Note: BigInt -> number conversion is relatively slow.
    static toMillis(t) {
        return Number(t) / TIME_UNITS_PER_MILLISEC;
    }
    // Convert microseconds (number) to a time value.
    // Note: number -> BigInt conversion is relatively slow.
    static fromMicros(millis) {
        return Time.fromRaw(BigInt(Math.floor(millis * TIME_UNITS_PER_MICROSEC)));
    }
    // Convert time value to microseconds and return as a number (i.e. float).
    // Warning: This function is lossy, i.e. precision is lost when converting
    // BigInt -> number.
    // Note: BigInt -> number conversion is relatively slow.
    static toMicros(t) {
        return Number(t) / TIME_UNITS_PER_MICROSEC;
    }
    /**
     * Convert a JavaScript Date to trace time.
     *
     * @param date - The date. Note that Date objects are time zone agnostic, they
     * are a simple wrapper around a unix timestamp. A time zone is applied only
     * when extracting data from it such as printing it to a string.
     * @param unixOffset - This represents the trace time at the unix epoch
     * (usually some large negative number).
     * @returns The time represented in trace time.
     */
    static fromDate(date, unixOffset) {
        const unixTimeMillis = date.getTime();
        const traceTime = Time.add(Time.fromMillis(unixTimeMillis), unixOffset);
        return traceTime;
    }
    // Convert time value to a Date object, given an offset from the unix epoch.
    // Warning: This function is lossy, i.e. precision is lost when converting
    // BigInt -> number.
    // Note: BigInt -> number conversion is relatively slow.
    /**
     * Converts trace time to a JavaScript Date object.
     *
     * @param time - A trace time.
     * @param unixOffset - This represents the trace time at the unix epoch
     * (usually some large negative number).
     * @returns A JavaScript Date object. Remember Date objects don't contain any
     * timezone information, they are a simple wrapper around unix time.
     */
    static toDate(time, unixOffset) {
        const unixTimeMillis = Time.toMillis(Time.sub(time, unixOffset));
        return new Date(unixTimeMillis);
    }
    static add(t, d) {
        return Time.fromRaw(t + d);
    }
    static sub(t, d) {
        return Time.fromRaw(t - d);
    }
    static diff(a, b) {
        return a - b;
    }
    // Similar to Time.diff(), but you put the cardinality of the arguments are
    // swapped.
    // E.g: durationBetween(start, end);
    static durationBetween(a, b) {
        return b - a;
    }
    static min(a, b) {
        return Time.fromRaw(bigint_math_1.BigintMath.min(a, b));
    }
    static max(a, b) {
        return Time.fromRaw(bigint_math_1.BigintMath.max(a, b));
    }
    static quantFloor(a, b) {
        return Time.fromRaw(bigint_math_1.BigintMath.quantFloor(a, b));
    }
    static quantCeil(a, b) {
        return Time.fromRaw(bigint_math_1.BigintMath.quantCeil(a, b));
    }
    static quant(a, b) {
        return Time.fromRaw(bigint_math_1.BigintMath.quant(a, b));
    }
    static formatSeconds(time) {
        return Time.toSeconds(time).toString() + ' s';
    }
    static formatMilliseconds(time) {
        return Time.toMillis(time).toString() + ' ms';
    }
    static formatMicroseconds(time) {
        return Time.toMicros(time).toString() + ' µs';
    }
    static toTimecode(time) {
        return new Timecode(time);
    }
}
exports.Time = Time;
// Format `value` to `n` significant digits.
// Examples: (1234, 2)   -> 1234.
//           (12.34, 2)  -> 12.
//           (0.1234, 2) -> 0.12.
function toSignificantDigits(value, n) {
    const sign = Math.sign(value);
    value = Math.abs(value);
    // For each of (1, 10, 100, ..., 10^n) we need to render an additional digit
    // after comma.
    let pow = 1;
    let digitsAfterComma = 0;
    for (let i = 0; i < n; i++, pow *= 10) {
        if (value < pow) {
            digitsAfterComma++;
        }
    }
    // Print precisely `digitsAfterComma` digits after comma, unless the number is an integer.
    const formatted = value === Math.round(value) ? value : value.toFixed(digitsAfterComma);
    return `${sign < 0 ? '-' : ''}${formatted}`;
}
class Duration {
    // The min and max possible duration values - durations can be negative.
    static MIN = bigint_math_1.BigintMath.INT64_MIN;
    static MAX = bigint_math_1.BigintMath.INT64_MAX;
    static ZERO = 0n;
    static fromRaw(v) {
        return v;
    }
    static min(a, b) {
        return bigint_math_1.BigintMath.min(a, b);
    }
    static max(a, b) {
        return bigint_math_1.BigintMath.max(a, b);
    }
    static fromMillis(millis) {
        return BigInt(Math.floor((millis / 1e3) * TIME_UNITS_PER_SEC));
    }
    // Convert time to seconds as a number.
    // Use this function with caution. It loses precision and is slow.
    static toSeconds(d) {
        return Number(d) / TIME_UNITS_PER_SEC;
    }
    // Convert time to seconds as a number.
    // Use this function with caution. It loses precision and is slow.
    static toMilliseconds(d) {
        return Number(d) / TIME_UNITS_PER_MILLISEC;
    }
    // Convert time to seconds as a number.
    // Use this function with caution. It loses precision and is slow.
    static toMicroSeconds(d) {
        return Number(d) / TIME_UNITS_PER_MICROSEC;
    }
    // Print duration as as human readable string - i.e. to only a handful of
    // significant figues.
    // Use this when readability is more desireable than precision.
    // Examples: 1234 -> 1.234us
    //           123456789 -> 123.5ms
    //           123,123,123,123,123 -> 123123s
    //           1,000,000,000 -> 1s
    //           1,000,000,023 -> 1.000s
    //           1,230,000,023 -> 1.230s
    static humanise(dur) {
        if (dur < 1)
            return '0s';
        const units = ['ns', 'µs', 'ms', 's'];
        let n = Math.abs(Number(dur));
        let u = 0;
        while (n >= 1000 && u + 1 < units.length) {
            n /= 1000;
            ++u;
        }
        return `${toSignificantDigits(Math.sign(Number(dur)) * n, 4)}${units[u]}`;
    }
    // Print duration with absolute precision.
    static format(duration) {
        let result = '';
        if (duration < 1)
            return '0s';
        const unitAndValue = [
            ['y', 31536000000000000n],
            ['d', 86400000000000n],
            ['h', 3600000000000n],
            ['m', 60000000000n],
            ['s', 1000000000n],
            ['ms', 1000000n],
            ['µs', 1000n],
            ['ns', 1n],
        ];
        unitAndValue.forEach(([unit, unitSize]) => {
            if (duration >= unitSize) {
                const unitCount = duration / unitSize;
                result += unitCount.toLocaleString() + unit + ' ';
                duration = duration % unitSize;
            }
        });
        return result.slice(0, -1);
    }
    static formatSeconds(dur) {
        return Duration.toSeconds(dur).toString() + ' s';
    }
    static formatMilliseconds(dur) {
        return Duration.toMilliseconds(dur).toString() + ' ms';
    }
    static formatMicroseconds(dur) {
        return Duration.toMicroSeconds(dur).toString() + ' µs';
    }
}
exports.Duration = Duration;
// This class takes a time and converts it to a set of strings representing a
// time code where each string represents a group of time units formatted with
// an appropriate number of leading zeros.
class Timecode {
    sign;
    days;
    hours;
    minutes;
    seconds;
    millis;
    micros;
    nanos;
    constructor(time) {
        this.sign = time < 0 ? '-' : '';
        const absTime = bigint_math_1.BigintMath.abs(time);
        const days = absTime / 86400000000000n;
        const hours = (absTime / 3600000000000n) % 24n;
        const minutes = (absTime / 60000000000n) % 60n;
        const seconds = (absTime / 1000000000n) % 60n;
        const millis = (absTime / 1000000n) % 1000n;
        const micros = (absTime / 1000n) % 1000n;
        const nanos = absTime % 1000n;
        this.days = days.toString();
        this.hours = hours.toString().padStart(2, '0');
        this.minutes = minutes.toString().padStart(2, '0');
        this.seconds = seconds.toString().padStart(2, '0');
        this.millis = millis.toString().padStart(3, '0');
        this.micros = micros.toString().padStart(3, '0');
        this.nanos = nanos.toString().padStart(3, '0');
    }
    // Get the upper part of the timecode formatted as: [-]DdHH:MM:SS.
    get dhhmmss() {
        const days = this.days === '0' ? '' : `${this.days}d`;
        return `${this.sign}${days}${this.hours}:${this.minutes}:${this.seconds}`;
    }
    // Get the subsecond part of the timecode formatted as: mmm uuu nnn.
    // The "space" char is configurable but defaults to a normal space.
    subsec(spaceChar = ' ') {
        return `${this.millis}${spaceChar}${this.micros}${spaceChar}${this.nanos}`;
    }
    // Formats the entire timecode to a string.
    toString(spaceChar = ' ') {
        return `${this.dhhmmss}.${this.subsec(spaceChar)}`;
    }
}
exports.Timecode = Timecode;
function currentDateHourAndMinute() {
    const date = new Date();
    return `${date
        .toISOString()
        .substr(0, 10)}-${date.getHours()}-${date.getMinutes()}`;
}
class TimeSpan {
    static ZERO = new TimeSpan(Time.ZERO, Time.ZERO);
    start;
    end;
    constructor(start, end) {
        (0, logging_1.assertTrue)(start <= end, `Span start [${start}] cannot be greater than end [${end}]`);
        this.start = start;
        this.end = end;
    }
    static fromTimeAndDuration(start, duration) {
        return new TimeSpan(start, Time.add(start, duration));
    }
    get duration() {
        return this.end - this.start;
    }
    get midpoint() {
        return Time.fromRaw((this.start + this.end) / 2n);
    }
    contains(t) {
        return this.start <= t && t < this.end;
    }
    containsSpan(start, end) {
        return this.start <= start && end <= this.end;
    }
    overlaps(start, end) {
        return !(end <= this.start || start >= this.end);
    }
    equals(span) {
        return this.start === span.start && this.end === span.end;
    }
    translate(x) {
        return new TimeSpan(Time.add(this.start, x), Time.add(this.end, x));
    }
    pad(padding) {
        return new TimeSpan(Time.sub(this.start, padding), Time.add(this.end, padding));
    }
}
exports.TimeSpan = TimeSpan;
/**
 * Formats a Date object (unix timestamp) to a string in a specified timezone.
 *
 * @description
 * The output format is a customizable combination of `YYYY-MM-DD`,
 * `HH:mm:ss.SSS`, and the timezone offset `(±HH:MM)`.
 *
 * @param date The original JavaScript `Date` object to format.
 * @param options An optional configuration object.
 * @param {number} [options.tzOffsetMins] - The timezone offset in minutes from
 * UTC. For example, -420 for UTC-7 or 330 for UTC+5:30. Defaults to 0 (UTC).
 * @param {boolean} [options.printDate] - Whether to include the date part
 * (`YYYY-MM-DD`).
 * @param {boolean} [options.printTime] - Whether to include the time part
 * (`HH:mm:ss.SSS`).
 * @param {boolean} [options.printTimezone] - Whether to include the timezone
 * offset.
 *
 * @returns A formatted string representing the date and time in the specified
 * timezone.
 *
 * @example
 * const myDate = new Date('2025-06-15T10:00:00.000Z');
 *
 * // Format for Indian Standard Time (UTC+5:30)
 * // tzOffsetMins = 5 * 60 + 30 = 330
 * const istString = formatDate(myDate, { tzOffsetMins: 330 });
 * console.log(istString); // "2025-06-15 15:30:00.000 UTC+05:30"
 *
 * // Format for Pacific Daylight Time (UTC-7)
 * // tzOffsetMins = -7 * 60 = -420
 * const pdtString = formatDate(myDate, { tzOffsetMins: -420 });
 * console.log(pdtString); // "2025-06-15 03:00:00.000 UTC-07:00"
 *
 * // Format with only the date and timezone
 * const dateOnly = formatDate(myDate, { tzOffsetMins: -420, printTime: false });
 * console.log(dateOnly); // "2025-06-15 UTC-07:00"
 *
 * // Format as UTC with no timezone part
 * const utcOnly = formatDate(myDate, { printTimezone: false });
 * console.log(utcOnly); // "2025-06-15 10:00:00.000"
 */
function formatDate(date, { tzOffsetMins = 0, printDate = true, printTime = true, printTimezone = true, } = {}) {
    const originalTimestamp = date.getTime();
    const timezoneOffsetInMilliseconds = tzOffsetMins * 60 * 1000;
    const dateInTimezone = new Date(originalTimestamp + timezoneOffsetInMilliseconds);
    const dateStringParts = [];
    if (printDate) {
        const year = dateInTimezone.getUTCFullYear();
        const month = String(dateInTimezone.getUTCMonth() + 1).padStart(2, '0');
        const day = String(dateInTimezone.getUTCDate()).padStart(2, '0');
        dateStringParts.push(`${year}-${month}-${day}`);
    }
    if (printTime) {
        const hours = String(dateInTimezone.getUTCHours()).padStart(2, '0');
        const mins = String(dateInTimezone.getUTCMinutes()).padStart(2, '0');
        const sec = String(dateInTimezone.getUTCSeconds()).padStart(2, '0');
        const ms = String(dateInTimezone.getUTCMilliseconds()).padStart(3, '0');
        dateStringParts.push(`${hours}:${mins}:${sec}.${ms}`);
    }
    if (printTimezone) {
        dateStringParts.push(formatTimezone(tzOffsetMins));
    }
    return dateStringParts.join(' ');
}
/**
 * Given a timezone as an offset from UTC in minutes, format it in the usual ISO
 * standard way. E.g.: UTC+01:00
 *
 * @param tzOffsetMins - The timezone offset in minutes.
 * @returns A string representing the timezone in ISO format.
 */
function formatTimezone(tzOffsetMins) {
    const sign = tzOffsetMins >= 0 ? '+' : '-';
    const absMins = Math.abs(tzOffsetMins);
    const hours = Math.floor(absMins / 60);
    const mins = absMins % 60;
    const hoursStr = String(hours).padStart(2, '0');
    const minsStr = String(mins).padStart(2, '0');
    return `UTC${sign}${hoursStr}:${minsStr}`;
}
/**
 * A TypeScript Map that pairs user-friendly timezone descriptions
 * with their corresponding UTC offset in minutes.
 */
exports.timezoneOffsetMap = {
    '(UTC-12:00) International Date Line West': -720,
    '(UTC-11:00) Coordinated Universal Time-11': -660,
    '(UTC-10:00) Hawaii': -600,
    '(UTC-09:30) Marquesas Islands': -570,
    '(UTC-09:00) Alaska': -540,
    '(UTC-08:00) Pacific Time (US & Canada)': -480,
    '(UTC-07:00) Mountain Time (US & Canada)': -420,
    '(UTC-06:00) Central Time (US & Canada), Mexico City': -360,
    '(UTC-05:00) Eastern Time (US & Canada), Bogota, Lima': -300,
    '(UTC-04:00) Atlantic Time (Canada), La Paz': -240,
    '(UTC-03:30) Newfoundland': -210,
    '(UTC-03:00) Buenos Aires, São Paulo': -180,
    '(UTC-02:00) Coordinated Universal Time-02': -120,
    '(UTC-01:00) Azores, Cape Verde Is.': -60,
    '(UTC+00:00) London, Dublin, Lisbon, Casablanca': 0,
    '(UTC+01:00) Amsterdam, Berlin, Paris, Rome, Madrid': 60,
    '(UTC+02:00) Athens, Cairo, Johannesburg, Helsinki': 120,
    '(UTC+03:00) Moscow, Istanbul, Riyadh, Nairobi': 180,
    '(UTC+03:30) Tehran': 210,
    '(UTC+04:00) Dubai, Abu Dhabi, Muscat, Baku': 240,
    '(UTC+04:30) Kabul': 270,
    '(UTC+05:00) Karachi, Tashkent': 300,
    '(UTC+05:30) Mumbai, New Delhi, Kolkata, Colombo': 330,
    '(UTC+05:45) Kathmandu': 345,
    '(UTC+06:00) Almaty, Dhaka': 360,
    '(UTC+06:30) Yangon (Rangoon)': 390,
    '(UTC+07:00) Bangkok, Hanoi, Jakarta': 420,
    '(UTC+08:00) Beijing, Hong Kong, Singapore, Taipei, Perth': 480,
    '(UTC+08:45) Eucla': 525,
    '(UTC+09:00) Tokyo, Seoul, Osaka, Sapporo': 540,
    '(UTC+09:30) Adelaide, Darwin': 570,
    '(UTC+10:00) Sydney, Melbourne, Brisbane, Guam': 600,
    '(UTC+10:30) Lord Howe Island': 630,
    '(UTC+11:00) Solomon Is., New Caledonia': 660,
    '(UTC+12:00) Auckland, Wellington, Fiji': 720,
    '(UTC+12:45) Chatham Islands': 765,
    "(UTC+13:00) Nuku'alofa": 780,
    '(UTC+14:00) Kiritimati': 840,
};
//# sourceMappingURL=time.js.map