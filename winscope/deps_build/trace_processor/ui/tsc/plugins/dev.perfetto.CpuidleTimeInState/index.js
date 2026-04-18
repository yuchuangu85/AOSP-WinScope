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
const tslib_1 = require("tslib");
const workspace_1 = require("../../public/workspace");
const query_counter_track_1 = require("../../components/tracks/query_counter_track");
const dev_perfetto_StandardGroups_1 = tslib_1.__importDefault(require("../dev.perfetto.StandardGroups"));
const query_result_1 = require("../../trace_processor/query_result");
class default_1 {
    static id = 'dev.perfetto.CpuidleTimeInState';
    static dependencies = [dev_perfetto_StandardGroups_1.default];
    async addCounterTrack(ctx, name, query, group, options) {
        const uri = `/cpuidle_time_in_state_${name}`;
        const track = await (0, query_counter_track_1.createQueryCounterTrack)({
            trace: ctx,
            uri,
            data: {
                sqlSource: query,
                columns: ['ts', 'value'],
            },
            columns: { ts: 'ts', value: 'value' },
            options,
        });
        ctx.tracks.registerTrack({
            uri,
            title: name,
            track,
        });
        const node = new workspace_1.TrackNode({ uri, title: name });
        group.addChildInOrder(node);
    }
    async addIdleStateTrack(ctx, state, group) {
        await this.addCounterTrack(ctx, `cpuidle.${state}`, `
        select
          ts,
          idle_percentage as value
        from linux_cpu_idle_time_in_state_counters
        where state = '${state}'
      `, group, { unit: 'percent', yOverrideMaximum: 100, yOverrideMinimum: 0 });
    }
    async addPerCpuIdleStateTrack(ctx, state, cpu, group) {
        await this.addCounterTrack(ctx, `cpuidle.cpu${cpu}.${state} Residency`, `
        select
          ts,
          idle_percentage as value
        from linux_per_cpu_idle_time_in_state_counters
        where state = '${state}' AND cpu = ${cpu}
      `, group, { unit: 'percent', yOverrideMaximum: 100, yOverrideMinimum: 0 });
    }
    async onTraceLoad(ctx) {
        const group = new workspace_1.TrackNode({
            title: 'CPU Idle Time In State',
            isSummary: true,
        });
        const e = ctx.engine;
        await e.query(`INCLUDE PERFETTO MODULE linux.cpu.idle_time_in_state;`);
        const states = await e.query(`select distinct state from linux_cpu_idle_time_in_state_counters`);
        const it = states.iter({ state: query_result_1.STR });
        for (; it.valid(); it.next()) {
            await this.addIdleStateTrack(ctx, it.state, group);
        }
        if (group.hasChildren) {
            const cpuGroup = ctx.plugins
                .getPlugin(dev_perfetto_StandardGroups_1.default)
                .getOrCreateStandardGroup(ctx.workspace, 'CPU');
            cpuGroup.addChildInOrder(group);
        }
        const perCpuGroup = new workspace_1.TrackNode({
            title: 'CPU Idle Per Cpu Time In State',
            isSummary: true,
        });
        const perCpuStates = await e.query(`select distinct state, cpu from linux_per_cpu_idle_time_in_state_counters`);
        const pIt = perCpuStates.iter({ state: query_result_1.STR, cpu: query_result_1.NUM });
        for (; pIt.valid(); pIt.next()) {
            await this.addPerCpuIdleStateTrack(ctx, pIt.state, pIt.cpu, perCpuGroup);
        }
        if (perCpuGroup.hasChildren) {
            const cpuGroup = ctx.plugins
                .getPlugin(dev_perfetto_StandardGroups_1.default)
                .getOrCreateStandardGroup(ctx.workspace, 'CPU');
            cpuGroup.addChildInOrder(perCpuGroup);
        }
    }
}
exports.default = default_1;
//# sourceMappingURL=index.js.map