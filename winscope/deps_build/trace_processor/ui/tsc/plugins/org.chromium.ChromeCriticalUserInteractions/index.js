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
const workspace_1 = require("../../public/workspace");
const critical_user_interaction_track_1 = require("./critical_user_interaction_track");
class default_1 {
    static id = 'org.chromium.CriticalUserInteraction';
    async onTraceLoad(ctx) {
        await ctx.engine.query('include perfetto module chrome.interactions;');
        const uri = `/critical_user_interactions`;
        ctx.commands.registerCommand({
            id: 'perfetto.CriticalUserInteraction.AddInteractionTrack',
            name: 'Add track: Chrome interactions',
            callback: () => {
                const track = new workspace_1.TrackNode({
                    uri,
                    title: 'Chrome Interactions',
                });
                ctx.workspace.addChildInOrder(track);
                track.pin();
            },
        });
        ctx.tracks.registerTrack({
            uri,
            title: 'Chrome Interactions',
            track: (0, critical_user_interaction_track_1.createCriticalUserInteractionTrack)(ctx, uri),
        });
    }
}
exports.default = default_1;
//# sourceMappingURL=index.js.map