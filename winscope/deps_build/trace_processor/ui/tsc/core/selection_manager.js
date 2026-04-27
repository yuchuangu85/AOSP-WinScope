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
exports.SelectionManagerImpl = void 0;
const tslib_1 = require("tslib");
const logging_1 = require("../base/logging");
const time_1 = require("../base/time");
const raf_scheduler_1 = require("./raf_scheduler");
const utils_1 = require("../base/utils");
const async_limiter_1 = require("../base/async_limiter");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const modal_1 = require("../widgets/modal");
const query_result_1 = require("../trace_processor/query_result");
const dataset_1 = require("../trace_processor/dataset");
const high_precision_time_1 = require("../base/high_precision_time");
// There are two selection-related states in this class.
// 1. _selection: This is the "input" / locator of the selection, what other
//    parts of the codebase specify (e.g., a tuple of trackUri + eventId) to say
//    "please select this object if it exists".
// 2. _selected{Slice,ThreadState}: This is the resolved selection, that is, the
//    rich details about the object that has been selected. If the input
//    `_selection` is valid, this is filled in the near future. Doing so
//    requires querying the SQL engine, which is an async operation.
class SelectionManagerImpl {
    engine;
    timeline;
    trackManager;
    noteManager;
    scrollHelper;
    onSelectionChange;
    detailsPanelLimiter = new async_limiter_1.AsyncLimiter();
    _selection = { kind: 'empty' };
    detailsPanels = new WeakMap();
    areaSelectionTabs = [];
    constructor(engine, timeline, trackManager, noteManager, scrollHelper, onSelectionChange) {
        this.engine = engine;
        this.timeline = timeline;
        this.trackManager = trackManager;
        this.noteManager = noteManager;
        this.scrollHelper = scrollHelper;
        this.onSelectionChange = onSelectionChange;
    }
    clearSelection() {
        this.setSelection({ kind: 'empty' });
    }
    async selectTrackEvent(trackUri, eventId, opts) {
        this.selectTrackEventInternal(trackUri, eventId, opts);
    }
    selectTrack(uri, opts) {
        this.setSelection({ kind: 'track', trackUri: uri }, opts);
    }
    selectNote(args, opts) {
        this.setSelection({
            kind: 'note',
            id: args.id,
        }, opts);
    }
    selectArea(area, opts) {
        const { start, end } = area;
        (0, logging_1.assertTrue)(start <= end);
        // In the case of area selection, the caller provides a list of trackUris.
        // However, all the consumers want to access the resolved Tracks. Rather
        // than delegating this to the various consumers, we resolve them now once
        // and for all and place them in the selection object.
        const tracks = [];
        for (const uri of area.trackUris) {
            const trackDescr = this.trackManager.getTrack(uri);
            if (trackDescr === undefined)
                continue;
            tracks.push(trackDescr);
        }
        this.setSelection({
            ...area,
            kind: 'area',
            tracks,
        }, opts);
    }
    deserialize(serialized) {
        if (serialized === undefined) {
            return;
        }
        this.deserializeInternal(serialized);
    }
    async deserializeInternal(serialized) {
        try {
            switch (serialized.kind) {
                case 'TRACK_EVENT':
                    await this.selectTrackEventInternal(serialized.trackKey, parseInt(serialized.eventId), undefined, serialized.detailsPanel);
                    break;
                case 'AREA':
                    this.selectArea({
                        start: serialized.start,
                        end: serialized.end,
                        trackUris: serialized.trackUris,
                    });
            }
        }
        catch (ex) {
            (0, modal_1.showModal)({
                title: 'Failed to restore the selected event',
                content: (0, mithril_1.default)('div', (0, mithril_1.default)('p', `Due to a version skew between the version of the UI the trace was
             shared with and the version of the UI you are using, we were
             unable to restore the selected event.`), (0, mithril_1.default)('p', `These backwards incompatible changes are very rare but is in some
             cases unavoidable. We apologise for the inconvenience.`)),
                buttons: [
                    {
                        text: 'Continue',
                        primary: true,
                    },
                ],
            });
        }
    }
    toggleTrackAreaSelection(trackUri) {
        const curSelection = this._selection;
        if (curSelection.kind !== 'area')
            return;
        let trackUris = curSelection.trackUris.slice();
        if (!trackUris.includes(trackUri)) {
            trackUris.push(trackUri);
        }
        else {
            trackUris = trackUris.filter((t) => t !== trackUri);
        }
        this.selectArea({
            ...curSelection,
            trackUris,
        });
    }
    toggleGroupAreaSelection(trackUris) {
        const curSelection = this._selection;
        if (curSelection.kind !== 'area')
            return;
        const allTracksSelected = trackUris.every((t) => curSelection.trackUris.includes(t));
        let newTrackUris;
        if (allTracksSelected) {
            // Deselect all tracks in the list
            newTrackUris = curSelection.trackUris.filter((t) => !trackUris.includes(t));
        }
        else {
            newTrackUris = curSelection.trackUris.slice();
            trackUris.forEach((t) => {
                if (!newTrackUris.includes(t)) {
                    newTrackUris.push(t);
                }
            });
        }
        this.selectArea({
            ...curSelection,
            trackUris: newTrackUris,
        });
    }
    get selection() {
        return this._selection;
    }
    getDetailsPanelForSelection() {
        return this.detailsPanels.get(this._selection);
    }
    async resolveSqlEvent(sqlTableName, id) {
        // This function:
        // 1. Find the list of tracks whose rootTableName is the same as the one we
        //    are looking for
        // 2. Groups them by their filter column - i.e. utid, cpu, or track_id.
        // 3. Builds a map of which of these column values match which track.
        // 4. Run one query per group, reading out the filter column value, and
        //    looking up the originating track in the map.
        // One flaw of this approach is that.
        const groups = new Map();
        const tracksWithNoFilter = [];
        this.trackManager
            .getAllTracks()
            .filter((track) => track.renderer.rootTableName === sqlTableName)
            .map((track) => {
            const dataset = track.renderer.getDataset?.();
            if (!dataset)
                return undefined;
            return [dataset, track];
        })
            .filter(utils_1.exists)
            .filter(([dataset]) => dataset.implements({ id: query_result_1.NUM }))
            .forEach(([dataset, track]) => {
            const col = dataset.filter?.col;
            if (col) {
                const existingGroup = (0, utils_1.getOrCreate)(groups, col, () => []);
                existingGroup.push([dataset, track]);
            }
            else {
                tracksWithNoFilter.push([dataset, track]);
            }
        });
        // Run one query per no-filter track. This is the only way we can reliably
        // keep track of which track the event belonged to.
        for (const [dataset, track] of tracksWithNoFilter) {
            const query = `select id from (${dataset.query()}) where id = ${id}`;
            const result = await this.engine.query(query);
            if (result.numRows() > 0) {
                return { eventId: id, trackUri: track.uri };
            }
        }
        for (const [colName, values] of groups) {
            // Build a map of the values -> track uri
            const map = new Map();
            values.forEach(([dataset, track]) => {
                const filter = dataset.filter;
                if (filter) {
                    if ('eq' in filter)
                        map.set(filter.eq, track.uri);
                    if ('in' in filter)
                        filter.in.forEach((v) => map.set(v, track.uri));
                }
            });
            const datasets = values.map(([dataset]) => dataset);
            const union = new dataset_1.UnionDataset(datasets).optimize();
            // Make sure to include the filter value in the schema.
            const schema = { ...union.schema, [colName]: query_result_1.UNKNOWN };
            const query = `select * from (${union.query(schema)}) where id = ${id}`;
            const result = await this.engine.query(query);
            const row = result.iter(schema);
            const value = row.get(colName);
            let trackUri = map.get(value);
            // If that didn't work, try converting the value to a number if it's a
            // bigint. Unless specified as a NUM type, any integers on the wire will
            // be parsed as a bigint to avoid losing precision.
            if (trackUri === undefined && typeof value === 'bigint') {
                trackUri = map.get(Number(value));
            }
            if (trackUri) {
                return { eventId: id, trackUri };
            }
        }
        return undefined;
    }
    selectSqlEvent(sqlTableName, id, opts) {
        this.resolveSqlEvent(sqlTableName, id).then((selection) => {
            selection &&
                this.selectTrackEvent(selection.trackUri, selection.eventId, opts);
        });
    }
    setSelection(selection, opts) {
        this._selection = selection;
        this.onSelectionChange(selection, opts ?? {});
        if (opts?.scrollToSelection) {
            this.scrollToSelection();
        }
    }
    selectSearchResult(searchResult) {
        const { source, eventId, trackUri } = searchResult;
        if (eventId === undefined) {
            return;
        }
        switch (source) {
            case 'track':
                this.selectTrack(trackUri, {
                    clearSearch: false,
                    scrollToSelection: true,
                });
                break;
            case 'cpu':
                this.selectSqlEvent('sched_slice', eventId, {
                    clearSearch: false,
                    scrollToSelection: true,
                    switchToCurrentSelectionTab: true,
                });
                break;
            case 'log':
                this.selectSqlEvent('android_logs', eventId, {
                    clearSearch: false,
                    scrollToSelection: true,
                    switchToCurrentSelectionTab: true,
                });
                break;
            case 'slice':
                // Search results only include slices from the slice table for now.
                // When we include annotations we need to pass the correct table.
                this.selectSqlEvent('slice', eventId, {
                    clearSearch: false,
                    scrollToSelection: true,
                    switchToCurrentSelectionTab: true,
                });
                break;
            case 'event':
                this.selectTrackEvent(trackUri, eventId, {
                    clearSearch: false,
                    scrollToSelection: true,
                    switchToCurrentSelectionTab: true,
                });
                break;
            default:
                (0, logging_1.assertUnreachable)(source);
        }
    }
    scrollToSelection() {
        const uri = (() => {
            switch (this.selection.kind) {
                case 'track_event':
                case 'track':
                    return this.selection.trackUri;
                // TODO(stevegolton): Handle scrolling to area and note selections.
                default:
                    return undefined;
            }
        })();
        const range = this.getTimeSpanOfSelection();
        this.scrollHelper.scrollTo({
            time: range ? { ...range } : undefined,
            track: uri ? { uri, expandGroup: true } : undefined,
        });
    }
    zoomOnSelection() {
        const uri = (() => {
            switch (this.selection.kind) {
                case 'track_event':
                case 'track':
                    return this.selection.trackUri;
                // TODO(stevegolton): Handle scrolling to area and note selections.
                default:
                    return undefined;
            }
        })();
        const range = this.getTimeSpanOfSelection();
        if (!range) {
            // If there is no range, we cannot zoom to selection.
            // This can happen if the selection is empty or if it is a note without
            // a time span.
            return;
        }
        const newDuration = this.timeline.visibleWindow.duration / 100;
        const halfDuration = newDuration / 2;
        const midEvent = time_1.Time.fromRaw(range.start + range.duration / 2n);
        const newStart = new high_precision_time_1.HighPrecisionTime(midEvent).subNumber(halfDuration);
        this.scrollHelper.scrollTo({
            time: {
                start: newStart.toTime(),
                end: newStart.addNumber(newDuration).toTime(),
            },
            track: uri ? { uri, expandGroup: true } : undefined,
        });
    }
    async selectTrackEventInternal(trackUri, eventId, opts, serializedDetailsPanel) {
        const track = this.trackManager.getTrack(trackUri);
        if (!track) {
            throw new Error(`Unable to resolve selection details: Track ${trackUri} not found`);
        }
        const trackRenderer = track.renderer;
        if (!trackRenderer.getSelectionDetails) {
            throw new Error(`Unable to resolve selection details: Track ${trackUri} does not support selection details`);
        }
        const details = await trackRenderer.getSelectionDetails(eventId);
        if (!(0, utils_1.exists)(details)) {
            throw new Error(`Unable to resolve selection details: Track ${trackUri} returned no details for event ${eventId}`);
        }
        const selection = {
            ...details,
            kind: 'track_event',
            trackUri,
            eventId,
        };
        this.createTrackEventDetailsPanel(selection, serializedDetailsPanel);
        this.setSelection(selection, opts);
    }
    createTrackEventDetailsPanel(selection, serializedState) {
        const td = this.trackManager.getTrack(selection.trackUri);
        if (!td) {
            return;
        }
        const panel = td.renderer.detailsPanel?.(selection);
        if (!panel) {
            return;
        }
        if (panel.serialization && serializedState !== undefined) {
            const res = panel.serialization.schema.safeParse(serializedState);
            if (res.success) {
                panel.serialization.state = res.data;
            }
        }
        const detailsPanel = {
            render: () => panel.render(),
            serializatonState: () => panel.serialization?.state,
            isLoading: true,
        };
        // Associate this details panel with this selection object
        this.detailsPanels.set(selection, detailsPanel);
        this.detailsPanelLimiter.schedule(async () => {
            await panel?.load?.(selection);
            detailsPanel.isLoading = false;
            raf_scheduler_1.raf.scheduleFullRedraw();
        });
    }
    getTimeSpanOfSelection() {
        const sel = this.selection;
        if (sel.kind === 'area') {
            return new time_1.TimeSpan(sel.start, sel.end);
        }
        else if (sel.kind === 'note') {
            const selectedNote = this.noteManager.getNote(sel.id);
            if (selectedNote !== undefined) {
                const kind = selectedNote.noteType;
                switch (kind) {
                    case 'SPAN':
                        return new time_1.TimeSpan(selectedNote.start, selectedNote.end);
                    case 'DEFAULT':
                        // A TimeSpan where start === end is treated as an instant event.
                        return new time_1.TimeSpan(selectedNote.timestamp, selectedNote.timestamp);
                    default:
                        (0, logging_1.assertUnreachable)(kind);
                }
            }
        }
        else if (sel.kind === 'track_event') {
            switch (sel.dur) {
                case undefined:
                case -1n:
                    // Events without a duration or with duration -1 (DNF) slices are just
                    // treated as if they were instant events.
                    return time_1.TimeSpan.fromTimeAndDuration(sel.ts, 0n);
                default:
                    return time_1.TimeSpan.fromTimeAndDuration(sel.ts, sel.dur);
            }
        }
        return undefined;
    }
    registerAreaSelectionTab(tab) {
        this.areaSelectionTabs.push(tab);
    }
}
exports.SelectionManagerImpl = SelectionManagerImpl;
//# sourceMappingURL=selection_manager.js.map