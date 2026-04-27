"use strict";
// Copyright (C) 2021 The Android Open Source Project
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
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const track_kinds_1 = require("../../public/track_kinds");
const workspace_1 = require("../../public/workspace");
const query_result_1 = require("../../trace_processor/query_result");
const cpu_freq_track_1 = require("./cpu_freq_track");
const anchor_1 = require("../../widgets/anchor");
const semantic_icons_1 = require("../../base/semantic_icons");
class default_1 {
    static id = 'dev.perfetto.CpuFreq';
    async onTraceLoad(ctx) {
        const { engine } = ctx;
        // ctx.traceInfo.cpus contains all cpus seen from all events. Filter the set
        // if it's seen in cpu_counter_track.
        const queryRes = await ctx.engine.query(`select distinct cpu, ifnull(machine_id, 0) as machine
       from cpu_counter_track`);
        const cpuAndMachine = new Set();
        for (const it = queryRes.iter({ cpu: query_result_1.NUM, machine: query_result_1.NUM }); it.valid(); it.next()) {
            cpuAndMachine.add([it.cpu, it.machine].toString());
        }
        const cpus = ctx.traceInfo.cpus.filter((cpu) => cpuAndMachine.has([cpu.cpu, cpu.machine].toString()));
        const maxCpuFreqResult = await engine.query(`
      select ifnull(max(value), 0) as freq
      from counter c
      join cpu_counter_track t on c.track_id = t.id
      join _counter_track_summary s on t.id = s.id
      where t.type = 'cpu_frequency';
    `);
        const maxCpuFreq = maxCpuFreqResult.firstRow({ freq: query_result_1.NUM }).freq;
        const group = new workspace_1.TrackNode({
            name: 'CPU Frequency',
            sortOrder: -40,
            isSummary: true,
            collapsed: false,
        });
        for (const cpu of cpus) {
            // Only add a cpu freq track if we have cpu freq data.
            const cpuFreqIdleResult = await engine.query(`
        select
          id as cpuFreqId,
          (
            select id
            from cpu_counter_track t
            where t.type = 'cpu_idle'
            and t.cpu = ${cpu.cpu} and ifnull(t.machine_id, 0) = ${cpu.machine}
            limit 1
          ) as cpuIdleId
        from cpu_counter_track t
        join _counter_track_summary using (id)
        where t.type = 'cpu_frequency'
        and t.cpu = ${cpu.cpu} and ifnull(t.machine_id, 0) = ${cpu.machine}
        limit 1;
      `);
            if (cpuFreqIdleResult.numRows() > 0) {
                const row = cpuFreqIdleResult.firstRow({
                    cpuFreqId: query_result_1.NUM,
                    cpuIdleId: query_result_1.NUM_NULL,
                });
                const freqTrackId = row.cpuFreqId;
                const idleTrackId = row.cpuIdleId === null ? undefined : row.cpuIdleId;
                const config = {
                    // Coloring based Cpu number, same for all machines.
                    cpu: cpu.cpu,
                    maximumValue: maxCpuFreq,
                    freqTrackId,
                    idleTrackId,
                };
                const uri = `/cpu_freq_cpu${cpu.ucpu}`;
                ctx.tracks.registerTrack({
                    uri,
                    tags: {
                        kind: track_kinds_1.CPU_FREQ_TRACK_KIND,
                        cpu: cpu.ucpu,
                    },
                    renderer: new cpu_freq_track_1.CpuFreqTrack(config, ctx),
                    description: () => {
                        return (0, mithril_1.default)('', [
                            `Shows the CPU frequency ${cpu.toString()} over time.`,
                            (0, mithril_1.default)('br'),
                            (0, mithril_1.default)(anchor_1.Anchor, {
                                href: 'https://perfetto.dev/docs/data-sources/cpu-freq',
                                target: '_blank',
                                icon: semantic_icons_1.Icons.ExternalLink,
                            }, 'Documentation'),
                        ]);
                    },
                });
                const trackNode = new workspace_1.TrackNode({
                    uri,
                    name: `CPU ${cpu.toString()} Frequency`,
                });
                group.addChildInOrder(trackNode);
            }
        }
        if (group.children.length > 0) {
            ctx.workspace.addChildInOrder(group);
        }
    }
}
exports.default = default_1;
//# sourceMappingURL=index.js.map