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
const query_counter_track_1 = require("../../components/tracks/query_counter_track");
const workspace_1 = require("../../public/workspace");
class default_1 {
    static id = 'dev.perfetto.AndroidCounterTracks';
    async onTraceLoad(ctx) {
        const { engine } = ctx;
        await engine.query(`include perfetto module android.binder;`);
        const counterTrackSource = `
      select client_ts as ts, count(*) value
      from android_binder_txns
      group by ts
    `;
        const trackNode = await this.loadCounterTrack(ctx, counterTrackSource, '/android_counter_track', 'Android Counter Track');
        ctx.workspace.addChildFirst(trackNode);
    }
    async loadCounterTrack(ctx, sqlSource, uri, title) {
        const track = await (0, query_counter_track_1.createQueryCounterTrack)({
            trace: ctx,
            uri,
            data: {
                sqlSource,
                columns: ['ts', 'value'],
            },
        });
        ctx.tracks.registerTrack({
            uri,
            title,
            track,
        });
        return new workspace_1.TrackNode({ title, uri, sortOrder: -7 });
    }
}
exports.default = default_1;
//# sourceMappingURL=index.js.map