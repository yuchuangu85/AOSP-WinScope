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
class AddDebugTrackMenu {
    columns;
    name = '';
    trackType = 'slice';
    // Names of columns which will be used as data sources for rendering.
    // We store the config for all possible columns used for rendering (i.e.
    // 'value' for slice and 'name' for counter) and then just don't the values
    // which don't match the currently selected track type (so changing track type
    // from A to B and back to A is a no-op).
    renderParams;
    constructor(vnode) {
        this.columns = [...vnode.attrs.dataSource.columns];
        const chooseDefaultOption = (name) => {
            for (const column of this.columns) {
                if (column === name)
                    return column;
            }
            for (const column of this.columns) {
                if (column.endsWith(`_${name}`))
                    return column;
            }
            // Debug tracks support data without dur, in which case it's treated as
            // 0.
            if (name === 'dur') {
                return '0';
            }
            return this.columns[0];
        };
        this.renderParams = {
            ts: chooseDefaultOption('ts'),
            dur: chooseDefaultOption('dur'),
            name: chooseDefaultOption('name'),
            value: chooseDefaultOption('value'),
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
    renderTrackTypeSelect() {
        const options = [];
        for (const type of ['slice', 'counter']) {
            options.push((0, mithril_1.default)('option', {
                value: type,
                selected: this.trackType === type ? true : undefined,
            }, type));
        }
        return (0, mithril_1.default)(select_1.Select, {
            id: 'track_type',
            oninput: (e) => {
                if (!e.target)
                    return;
                this.trackType = e.target.value;
            },
        }, options);
    }
    view(vnode) {
        const renderSelect = (name) => {
            const options = [];
            if (name === 'pivot') {
                options.push((0, mithril_1.default)('option', { selected: this.renderParams[name] === '' ? true : undefined }, (0, mithril_1.default)('i', '')));
            }
            for (const column of this.columns) {
                options.push((0, mithril_1.default)('option', { selected: this.renderParams[name] === column ? true : undefined }, column));
            }
            if (name === 'dur') {
                options.push((0, mithril_1.default)('option', { selected: this.renderParams[name] === '0' ? true : undefined }, (0, mithril_1.default)('i', '0')));
            }
            return [
                (0, mithril_1.default)(form_1.FormLabel, { for: name }, name),
                (0, mithril_1.default)(select_1.Select, {
                    id: name,
                    oninput: (e) => {
                        if (!e.target)
                            return;
                        this.renderParams[name] = e.target.value;
                    },
                }, options),
            ];
        };
        return (0, mithril_1.default)(form_1.Form, {
            onSubmit: () => this.createDebugTracks(vnode.attrs),
            submitLabel: 'Show',
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
                this.name = e.target.value;
            },
        }), (0, mithril_1.default)(form_1.FormLabel, { for: 'track_type' }, 'Track type'), this.renderTrackTypeSelect(), renderSelect('ts'), this.trackType === 'slice' && renderSelect('dur'), this.trackType === 'slice' && renderSelect('name'), this.trackType === 'counter' && renderSelect('value'), renderSelect('pivot'));
    }
    createDebugTracks(attrs) {
        switch (this.trackType) {
            case 'slice':
                (0, debug_tracks_1.addDebugSliceTrack)({
                    trace: attrs.trace,
                    data: attrs.dataSource,
                    title: this.name,
                    columns: {
                        ts: this.renderParams.ts,
                        dur: this.renderParams.dur,
                        name: this.renderParams.name,
                    },
                    argColumns: this.columns,
                    pivotOn: this.renderParams.pivot,
                });
                break;
            case 'counter':
                (0, debug_tracks_1.addDebugCounterTrack)({
                    trace: attrs.trace,
                    data: attrs.dataSource,
                    title: this.name,
                    columns: {
                        ts: this.renderParams.ts,
                        value: this.renderParams.value,
                    },
                    pivotOn: this.renderParams.pivot,
                });
                break;
            default:
                (0, logging_1.assertUnreachable)(this.trackType);
        }
    }
}
exports.AddDebugTrackMenu = AddDebugTrackMenu;
//# sourceMappingURL=add_debug_track_menu.js.map