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
const workspace_1 = require("../../public/workspace");
const dataset_slice_track_1 = require("../../components/tracks/dataset_slice_track");
const query_result_1 = require("../../trace_processor/query_result");
const dataset_1 = require("../../trace_processor/dataset");
const colorizer_1 = require("../../components/colorizer");
const color_1 = require("../../base/color");
class default_1 {
    // TODO(stevegolton): Call this plugins ExampleTracks or something, as it has
    // turned into more of a generic plugin showcasing what you can do with
    // tracks.
    static id = 'com.example.ExampleNestedTracks';
    async onTraceLoad(ctx) {
        const traceStartTime = ctx.traceInfo.start;
        const traceDur = ctx.traceInfo.end - ctx.traceInfo.start;
        await ctx.engine.query(`
      create table example_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        ts INTEGER,
        dur INTEGER,
        arg INTEGER
      );

      insert into example_events (name, ts, dur, arg)
      values
        ('Foo', ${traceStartTime}, ${traceDur}, 'aaa'),
        ('Bar', ${traceStartTime}, ${traceDur / 2n}, 'bbb'),
        ('Baz', ${traceStartTime}, ${traceDur / 3n}, 'aaa'),
        ('Qux', ${traceStartTime + traceDur / 2n}, ${traceDur / 2n}, 'bbb')
      ;
    `);
        const title = 'Test Track';
        const uri = `com.example.ExampleNestedTracks#TestTrack`;
        const track = new dataset_slice_track_1.DatasetSliceTrack({
            trace: ctx,
            uri,
            dataset: new dataset_1.SourceDataset({
                src: 'select *, id as depth from example_events',
                schema: {
                    ts: query_result_1.LONG,
                    name: query_result_1.STR,
                    dur: query_result_1.LONG,
                    id: query_result_1.NUM,
                    arg: query_result_1.STR,
                },
            }),
            colorizer: (row) => {
                // Example usage of colorizer
                return (0, colorizer_1.getColorForSlice)(`${row.arg}`);
            },
        });
        ctx.tracks.registerTrack({
            uri,
            title,
            track,
        });
        this.addNestedTracks(ctx, uri);
        // The following are some examples of dataset tracks with different configurations.
        this.addTrack(ctx, {
            trace: ctx,
            uri: 'Red track',
            dataset: new dataset_1.SourceDataset({
                src: 'example_events',
                schema: {
                    id: query_result_1.NUM,
                    ts: query_result_1.LONG,
                    dur: query_result_1.LONG,
                    name: query_result_1.STR,
                },
            }),
            colorizer: () => (0, colorizer_1.makeColorScheme)(new color_1.HSLColor({ h: 0, s: 50, l: 50 })),
        });
        this.addTrack(ctx, {
            trace: ctx,
            uri: 'Instants',
            dataset: new dataset_1.SourceDataset({
                src: 'example_events',
                schema: {
                    id: query_result_1.NUM,
                    ts: query_result_1.LONG,
                },
            }),
            colorizer: () => (0, colorizer_1.makeColorScheme)(new color_1.HSLColor({ h: 90, s: 50, l: 50 })),
        });
        this.addTrack(ctx, {
            trace: ctx,
            uri: 'Flat',
            dataset: new dataset_1.SourceDataset({
                src: 'select 0 as depth, * from example_events',
                schema: {
                    id: query_result_1.NUM,
                    ts: query_result_1.LONG,
                    dur: query_result_1.LONG,
                    name: query_result_1.STR,
                    depth: query_result_1.NUM,
                },
            }),
            colorizer: () => (0, colorizer_1.makeColorScheme)(new color_1.HSLColor({ h: 180, s: 50, l: 50 })),
        });
    }
    addTrack(ctx, attrs) {
        const title = attrs.uri;
        const uri = attrs.uri;
        const track = new dataset_slice_track_1.DatasetSliceTrack(attrs);
        ctx.tracks.registerTrack({
            uri,
            title,
            track,
        });
        ctx.workspace.addChildInOrder(new workspace_1.TrackNode({ title, uri, sortOrder: -100 }));
    }
    addNestedTracks(ctx, uri) {
        const trackRoot = new workspace_1.TrackNode({ uri, title: 'Root' });
        const track1 = new workspace_1.TrackNode({ uri, title: '1' });
        const track2 = new workspace_1.TrackNode({ uri, title: '2' });
        const track11 = new workspace_1.TrackNode({ uri, title: '1.1' });
        const track12 = new workspace_1.TrackNode({ uri, title: '1.2' });
        const track121 = new workspace_1.TrackNode({ uri, title: '1.2.1' });
        const track21 = new workspace_1.TrackNode({ uri, title: '2.1' });
        ctx.workspace.addChildInOrder(trackRoot);
        trackRoot.addChildLast(track1);
        trackRoot.addChildLast(track2);
        track1.addChildLast(track11);
        track1.addChildLast(track12);
        track12.addChildLast(track121);
        track2.addChildLast(track21);
        ctx.commands.registerCommand({
            id: 'com.example.ExampleNestedTracks#CloneTracksToNewWorkspace',
            name: 'Clone track to new workspace',
            callback: () => {
                const ws = ctx.workspaces.createEmptyWorkspace('New workspace');
                ws.addChildLast(trackRoot.clone());
                ctx.workspaces.switchWorkspace(ws);
            },
        });
        ctx.commands.registerCommand({
            id: 'com.example.ExampleNestedTracks#DeepCloneTracksToNewWorkspace',
            name: 'Clone all tracks to new workspace',
            callback: () => {
                const ws = ctx.workspaces.createEmptyWorkspace('Deep workspace');
                ws.addChildLast(trackRoot.clone(true));
                ctx.workspaces.switchWorkspace(ws);
            },
        });
    }
}
exports.default = default_1;
//# sourceMappingURL=index.js.map