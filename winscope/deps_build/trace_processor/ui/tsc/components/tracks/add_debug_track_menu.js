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
exports.AddDebugTrackMenu = void 0;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const dom_utils_1 = require("../../base/dom_utils");
const logging_1 = require("../../base/logging");
const form_1 = require("../../widgets/form");
const select_1 = require("../../widgets/select");
const text_input_1 = require("../../widgets/text_input");
const debug_tracks_1 = require("./debug_tracks");
const TRACK_NAME_FIELD_REF = 'TRACK_NAME_FIELD';
function chooseDefaultColumn(columns, name) {
    // Search for exact match
    const exactMatch = columns.find((col) => col === name);
    if (exactMatch)
        return exactMatch;
    // Search for partial match
    const partialMatch = columns.find((col) => col.endsWith(`_${name}`));
    if (partialMatch)
        return partialMatch;
    // Debug tracks support data without dur, in which case it's treated as 0.
    if (name === 'dur') {
        return '0';
    }
    return '';
}
const trackTypes = ['slice', 'counter'];
class AddDebugTrackMenu {
    trackName = '';
    trackType = 'slice';
    options;
    constructor({ attrs }) {
        const columns = attrs.availableColumns;
        // Initialize the settings to some sensible defaults.
        this.options = {
            ts: chooseDefaultColumn(columns, 'ts'),
            dur: chooseDefaultColumn(columns, 'dur'),
            name: chooseDefaultColumn(columns, 'name'),
            value: chooseDefaultColumn(columns, 'value'),
            argSetId: chooseDefaultColumn(columns, 'arg_set_id'),
            pivot: '',
        };
    }
    oncreate({ dom }) {
        this.focusTrackNameField(dom);
    }
    focusTrackNameField(dom) {
        const element = (0, dom_utils_1.findRef)(dom, TRACK_NAME_FIELD_REF);
        if (element) {
            if (element instanceof HTMLInputElement) {
                element.focus();
            }
        }
    }
    view({ attrs }) {
        return (0, mithril_1.default)(form_1.Form, {
            onSubmit: () => this.createTracks(attrs),
            submitLabel: 'Add Track',
        }, (0, mithril_1.default)(form_1.FormLabel, { for: 'track_name' }, 'Track name'), (0, mithril_1.default)(text_input_1.TextInput, {
            id: 'track_name',
            ref: TRACK_NAME_FIELD_REF,
            onkeydown: (e) => {
                // Allow Esc to close popup.
                if (e.key === 'Escape')
                    return;
            },
            oninput: (e) => {
                if (!e.target)
                    return;
                this.trackName = e.target.value;
            },
        }, this.trackName), (0, mithril_1.default)(form_1.FormLabel, { for: 'track_type' }, 'Track type'), this.renderTrackTypeSelect(), this.renderOptions(attrs.availableColumns));
    }
    renderTrackTypeSelect() {
        return (0, mithril_1.default)(select_1.Select, {
            id: 'track_type',
            oninput: (e) => {
                if (!e.target)
                    return;
                this.trackType = e.target.value;
            },
        }, trackTypes.map((value) => (0, mithril_1.default)('option', {
            value: value,
            selected: this.trackType === value,
        }, value)));
    }
    renderOptions(availableColumns) {
        switch (this.trackType) {
            case 'slice':
                return this.renderSliceOptions(availableColumns);
            case 'counter':
                return this.renderCounterTrackOptions(availableColumns);
            default:
                (0, logging_1.assertUnreachable)(this.trackType);
        }
    }
    renderSliceOptions(availableColumns) {
        return [
            this.renderFormSelectInput('ts', 'ts', availableColumns),
            this.renderFormSelectInput('dur', 'dur', ['0', ...availableColumns]),
            this.renderFormSelectInput('name', 'name', availableColumns),
            this.renderFormSelectInput('arg_set_id', 'argSetId', [
                '',
                ...availableColumns,
            ]),
            this.renderFormSelectInput('pivot', 'pivot', ['', ...availableColumns]),
        ];
    }
    renderCounterTrackOptions(availableColumns) {
        return [
            this.renderFormSelectInput('ts', 'ts', availableColumns),
            this.renderFormSelectInput('value', 'value', availableColumns),
            this.renderFormSelectInput('pivot', 'pivot', ['', ...availableColumns]),
        ];
    }
    renderFormSelectInput(name, optionKey, options) {
        return [
            (0, mithril_1.default)(form_1.FormLabel, { for: name }, name),
            (0, mithril_1.default)(select_1.Select, {
                id: name,
                oninput: (e) => {
                    if (!e.target)
                        return;
                    this.options[optionKey] = e.target.value;
                },
                value: this.options[optionKey],
            }, options.map((opt) => (0, mithril_1.default)('option', { selected: this.options[optionKey] === opt }, opt))),
        ];
    }
    createTracks(attrs) {
        switch (this.trackType) {
            case 'slice':
                (0, debug_tracks_1.addDebugSliceTrack)({
                    trace: attrs.trace,
                    data: {
                        sqlSource: attrs.query,
                        columns: attrs.availableColumns,
                    },
                    title: this.trackName,
                    columns: {
                        ts: this.options.ts,
                        dur: this.options.dur,
                        name: this.options.name,
                    },
                    argSetIdColumn: this.options.argSetId,
                    argColumns: attrs.availableColumns,
                    pivotOn: this.options.pivot,
                });
                break;
            case 'counter':
                (0, debug_tracks_1.addDebugCounterTrack)({
                    trace: attrs.trace,
                    data: {
                        sqlSource: attrs.query,
                        columns: attrs.availableColumns,
                    },
                    title: this.trackName,
                    columns: {
                        ts: this.options.ts,
                        value: this.options.value,
                    },
                    pivotOn: this.options.pivot,
                });
                break;
            default:
                (0, logging_1.assertUnreachable)(this.trackType);
        }
    }
}
exports.AddDebugTrackMenu = AddDebugTrackMenu;
//# sourceMappingURL=add_debug_track_menu.js.map