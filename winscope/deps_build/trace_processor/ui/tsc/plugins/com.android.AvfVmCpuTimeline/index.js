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
const dataset_slice_track_1 = require("../../components/tracks/dataset_slice_track");
const workspace_1 = require("../../public/workspace");
const dataset_1 = require("../../trace_processor/dataset");
const query_result_1 = require("../../trace_processor/query_result");
class default_1 {
    static id = 'com.android.AvfVmCpuTimeline';
    validTargets = new Map();
    async onTraceLoad(ctx) {
        this.validTargets.clear();
        await this.findValidTargets(ctx.engine);
        if (this.validTargets.size === 0) {
            alert('The loaded trace does not contain any valid Avf VM targets!');
        }
        else {
            const defaultTargetId = this.validTargets.keys().next().value;
            await this.createTargetVmTrack(ctx, defaultTargetId);
            ctx.commands.registerCommand({
                id: `${ctx.pluginId}#SelectAvfVmUtid`,
                name: 'Select Avf VM utid to add track',
                callback: async () => {
                    if (this.validTargets.size === 0) {
                        alert('Available ValidTargets set exhausted! Do Refresh...');
                    }
                    else {
                        const utid = await this.selectValidTarget();
                        await this.createTargetVmTrack(ctx, utid);
                    }
                },
                defaultHotkey: 'Shift+V',
            });
        }
    }
    async createTargetVmTrack(ctx, targetUtid) {
        const title = `Avf VM CPU Timeline utid:${targetUtid}`;
        const uri = `com.android.AvfVmCpuTimeline#AvfVmCpuTimeline${targetUtid}`;
        this.validTargets.delete(targetUtid);
        const query = `
      SELECT
        sched.id AS id,
        ts,
        dur,
        cpu,
        priority,
        utid,
        name,
        cpu AS depth
      FROM sched
      JOIN thread
        USING (utid)
      WHERE
        utid == ${targetUtid}
    `;
        ctx.tracks.registerTrack({
            uri,
            title,
            track: new dataset_slice_track_1.DatasetSliceTrack({
                trace: ctx,
                uri,
                dataset: new dataset_1.SourceDataset({
                    src: query,
                    schema: {
                        id: query_result_1.NUM,
                        ts: query_result_1.LONG,
                        dur: query_result_1.LONG,
                        cpu: query_result_1.NUM,
                        priority: query_result_1.NUM,
                        utid: query_result_1.NUM,
                        name: query_result_1.STR,
                        depth: query_result_1.NUM,
                    },
                }),
                // Blank details panel - overrides details panel that assumes slices are
                // from the slice table.
                detailsPanel: () => {
                    return {
                        render: () => undefined,
                    };
                },
            }),
        });
        const trackNode = new workspace_1.TrackNode({ uri, title, sortOrder: -90 });
        ctx.workspace.addChildInOrder(trackNode);
    }
    async findValidTargets(engine) {
        const queryResult = await engine.query(`
      SELECT
        sched.id as id,
        utid,
        thread.name as threadName
      FROM sched
      JOIN thread
        USING (utid)
      WHERE threadName LIKE '%vhost%' OR threadName LIKE '%vcpu%'
    `);
        const qRow = queryResult.iter({
            id: query_result_1.NUM,
            utid: query_result_1.NUM,
            threadName: query_result_1.STR,
        });
        while (qRow.valid()) {
            if (!this.validTargets.has(qRow.utid)) {
                // collect unique thread.utid in the available targets map
                this.validTargets.set(qRow.utid, qRow.threadName);
            }
            qRow.next();
        }
    }
    async selectValidTarget() {
        const input = prompt(this.prepareSelectMessage());
        if (input !== null) {
            const checkId = Number(input);
            if (!isNaN(checkId) && this.validTargets.has(checkId)) {
                return checkId;
            }
        }
        const defaultTarget = this.validTargets.keys().next().value;
        alert(`Invalid Target selected! Using default value: ${defaultTarget}`);
        return defaultTarget;
    }
    prepareSelectMessage() {
        let message = 'Available target IDs are:\n';
        this.validTargets.forEach((id, name) => {
            message += `${id} : ${name}\n`;
        });
        message += `\nEnter targetID to add track:`;
        return message;
    }
}
exports.default = default_1;
//# sourceMappingURL=index.js.map