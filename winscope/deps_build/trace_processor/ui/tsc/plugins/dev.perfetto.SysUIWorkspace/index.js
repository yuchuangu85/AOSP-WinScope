"use strict";
// Copyright (C) 2025 The Android Open Source Project
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
const query_result_1 = require("../../trace_processor/query_result");
const workspace_1 = require("../../public/workspace");
const TRACKS_TO_COPY = [
    'L<',
    'UI Events',
    'IKeyguardService',
    'Transition:',
];
const SYSTEM_UI_PROCESS = 'com.android.systemui';
// Plugin that creates an opinionated Workspace specific for SysUI
class default_1 {
    static id = 'dev.perfetto.SysUIWorkspace';
    async onTraceLoad(ctx) {
        ctx.commands.registerCommand({
            id: 'dev.perfetto.SysUIWorkspace#CreateSysUIWorkspace',
            name: 'Create System UI workspace',
            callback: () => ProcessWorkspaceFactory.create(ctx, SYSTEM_UI_PROCESS, 'System UI', TRACKS_TO_COPY),
        });
    }
}
exports.default = default_1;
/**
 *  Creates a workspace for a process with the following tracks:
 *  - timelines
 *  - main thread and render thread
 *  - All other ui threads in a group
 *  - List of tracks having name manually provided to this class constructor
 *  - groups tracks having the "/(?<groupName>.*)##(?<trackName>.*)/" format
 *    (e.g. "notifications##visible" will create a "visible" track inside the
 *    "notification" group)
 *
 *  This is useful to reduce the clutter when focusing on a single process, and
 *  organizing tracks related to the same area in groups.
 */
class ProcessWorkspaceFactory {
    trace;
    process;
    workspaceName;
    topLevelTracksToPin;
    ws;
    processTracks;
    constructor(trace, process, workspaceName, topLevelTracksToPin = []) {
        this.trace = trace;
        this.process = process;
        this.workspaceName = workspaceName;
        this.topLevelTracksToPin = topLevelTracksToPin;
        // We're going to iterate them often: let's filter the process ones.
        this.processTracks = this.findProcessTracks();
        this.ws = this.trace.workspaces.createEmptyWorkspace(this.workspaceName);
    }
    /**
     * Creates a new workspace for a specific process in a trace.
     *
     * No workspace is created if it was there already.
     * This is expected to be called from the default workspace.
     *
     * @param trace
     * @param packageName Name of the Android package to create the workspace for.
     * @param workspaceName Desired name for the new workspace.
     * @param tracksToCopy - An optional list of track names to be added to
     *                              the new workspace
     * @returns A `Promise` that resolves when the workspace has been created.
     */
    static async create(trace, packageName, workspaceName, tracksToCopy = []) {
        const exists = trace.workspaces.all.find((ws) => ws.title === workspaceName);
        if (exists)
            return;
        const process = await getProcessInfo(trace, packageName);
        if (!process)
            return;
        const factory = new ProcessWorkspaceFactory(trace, process, workspaceName, tracksToCopy);
        await factory.createWorkspace();
    }
    async createWorkspace() {
        this.pinTracksContaining('Actual Timeline', 'Expected Timeline');
        this.pinMainThread();
        this.pinFirstRenderThread();
        await this.pinUiThreads();
        this.topLevelTracksToPin.forEach((s) => this.pinTracksContainingInGroupIfNeeded(s));
        this.createGroups();
        this.trace.workspaces.switchWorkspace(this.ws);
    }
    findProcessTracks() {
        return this.trace.workspace.flatTracks.filter((track) => {
            if (!track.uri)
                return false;
            const descriptor = this.trace.tracks.getTrack(track.uri);
            return descriptor?.tags?.upid === this.process.upid;
        });
    }
    pinTracksContaining(...args) {
        args.forEach((s) => this.pinTrackContaining(s));
    }
    pinTrackContaining(titleSubstring) {
        this.getTracksContaining(titleSubstring).forEach((track) => this.ws.addChildLast(track.clone()));
    }
    pinTracksContainingInGroupIfNeeded(titleSubstring, minSizeToGroup = 2) {
        const tracks = this.getTracksContaining(titleSubstring);
        if (tracks.length == 0)
            return;
        if (tracks.length >= minSizeToGroup) {
            const newGroup = new workspace_1.TrackNode({ title: titleSubstring, isSummary: true });
            this.ws.addChildLast(newGroup);
            tracks.forEach((track) => newGroup.addChildLast(track.clone()));
        }
        else {
            tracks.forEach((track) => this.ws.addChildLast(track.clone()));
        }
    }
    getTracksContaining(titleSubstring) {
        return this.processTracks.filter((track) => track.title.includes(titleSubstring));
    }
    pinMainThread() {
        const tracks = this.processTracks.filter((track) => {
            return this.getTrackUtid(track) == this.process.upid;
        });
        tracks.forEach((track) => this.ws.addChildLast(track.clone()));
    }
    // In traces there might be many short-lived threads called "render thread"
    // used to allocate stuff. We don't care about them, but only of the first one
    // (that has lower thread id)
    pinFirstRenderThread() {
        const tracks = this.getTracksContaining('RenderThread');
        const utids = tracks
            .map((t) => this.getTrackUtid(t))
            .filter((utid) => utid !== undefined);
        const minUtid = Math.min(...utids);
        const toPin = tracks.filter((track) => this.getTrackUtid(track) == minUtid);
        toPin.forEach((track) => this.ws.addChildLast(track.clone()));
    }
    async pinUiThreads() {
        const result = await this.trace.engine.query(`
      INCLUDE PERFETTO MODULE slices.with_context;
      SELECT DISTINCT utid FROM thread_or_process_slice
      WHERE upid = ${this.process.upid}
       AND upid != utid -- main thread excluded
       AND name GLOB "Choreographer#doFrame*"
    `);
        if (result.numRows() === 0) {
            return;
        }
        const uiThreadUtidsSet = new Set();
        const it = result.iter({ utid: query_result_1.NUM });
        for (; it.valid(); it.next()) {
            uiThreadUtidsSet.add(it.utid);
        }
        const toPin = this.processTracks.filter((track) => {
            const utid = this.getTrackUtid(track);
            return utid != undefined && uiThreadUtidsSet.has(utid);
        });
        toPin.sort((a, b) => {
            return a.title.localeCompare(b.title);
        });
        const uiThreadTrack = new workspace_1.TrackNode({ title: 'UI Threads', isSummary: true });
        this.ws.addChildLast(uiThreadTrack);
        toPin.forEach((track) => uiThreadTrack.addChildLast(track.clone()));
    }
    getTrackUtid(node) {
        return this.trace.tracks.getTrack(node.uri)?.tags?.utid;
    }
    createGroups() {
        const groupRegex = /(?<groupName>.*)##(?<trackName>.*)/;
        const trackGroups = new Map();
        this.processTracks.forEach((track) => {
            const match = track.title.match(groupRegex);
            if (!match?.groups)
                return;
            const { groupName, trackName } = match.groups;
            const newTrack = track.clone();
            newTrack.title = trackName;
            if (!trackGroups.has(groupName)) {
                const newGroup = new workspace_1.TrackNode({ title: groupName, isSummary: true });
                this.ws.addChildLast(newGroup);
                trackGroups.set(groupName, newGroup);
            }
            trackGroups.get(groupName).addChildLast(newTrack);
        });
    }
}
async function getProcessInfo(ctx, processName) {
    const result = await ctx.engine.query(`
      INCLUDE PERFETTO MODULE android.process_metadata;
      select
        _process_available_info_summary.upid,
        process.name
      from _process_available_info_summary
      join process using(upid)
      where process.name = '${processName}';
    `);
    if (result.numRows() === 0) {
        return undefined;
    }
    return result.firstRow({
        upid: query_result_1.NUM,
        name: query_result_1.STR,
    });
}
//# sourceMappingURL=index.js.map