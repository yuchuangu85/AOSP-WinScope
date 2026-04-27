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
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const time_1 = require("../../base/time");
const dataset_slice_track_1 = require("../../components/tracks/dataset_slice_track");
const timestamp_1 = require("../../components/widgets/timestamp");
const workspace_1 = require("../../public/workspace");
const dataset_1 = require("../../trace_processor/dataset");
const query_result_1 = require("../../trace_processor/query_result");
const details_shell_1 = require("../../widgets/details_shell");
const grid_layout_1 = require("../../widgets/grid_layout");
const section_1 = require("../../widgets/section");
const tree_1 = require("../../widgets/tree");
const dev_perfetto_StandardGroups_1 = tslib_1.__importDefault(require("../dev.perfetto.StandardGroups"));
class default_1 {
    static id = 'dev.perfetto.TraceMetadata';
    static dependencies = [dev_perfetto_StandardGroups_1.default];
    async onTraceLoad(trace) {
        const res = await trace.engine.query(`
      select count() as cnt from (select 1 from clock_snapshot limit 1)
    `);
        const row = res.firstRow({ cnt: query_result_1.NUM });
        if (row.cnt === 0) {
            return;
        }
        const uri = `/clock_snapshots`;
        const track = new dataset_slice_track_1.DatasetSliceTrack({
            trace,
            uri,
            dataset: new dataset_1.SourceDataset({
                src: `
          SELECT
            id,
            ts,
            'Snapshot' as name,
            clock_id,
            clock_name,
            clock_value,
            snapshot_id,
            machine_id,
            0 as dur
          FROM clock_snapshot
        `,
                schema: {
                    id: query_result_1.NUM,
                    ts: query_result_1.LONG,
                    dur: query_result_1.LONG,
                    name: query_result_1.STR,
                    clock_id: query_result_1.NUM,
                    clock_name: query_result_1.STR_NULL,
                    clock_value: query_result_1.LONG,
                    snapshot_id: query_result_1.NUM,
                    machine_id: query_result_1.NUM_NULL,
                },
            }),
            detailsPanel: (row) => {
                return {
                    render() {
                        return (0, mithril_1.default)(details_shell_1.DetailsShell, {
                            title: 'Clock Snapshot',
                        }, (0, mithril_1.default)(grid_layout_1.GridLayout, (0, mithril_1.default)(grid_layout_1.GridLayoutColumn, (0, mithril_1.default)(section_1.Section, { title: 'Details' }, (0, mithril_1.default)(tree_1.Tree, (0, mithril_1.default)(tree_1.TreeNode, {
                            left: 'ID',
                            right: row.id,
                        }), (0, mithril_1.default)(tree_1.TreeNode, {
                            left: 'Timestamp',
                            right: (0, mithril_1.default)(timestamp_1.Timestamp, { trace, ts: time_1.Time.fromRaw(row.ts) }),
                        }), (0, mithril_1.default)(tree_1.TreeNode, {
                            left: 'clock_id',
                            right: row.clock_id,
                        }), (0, mithril_1.default)(tree_1.TreeNode, {
                            left: 'clock_name',
                            right: row.clock_name ?? 'NULL',
                        }), (0, mithril_1.default)(tree_1.TreeNode, {
                            left: 'clock_value',
                            right: row.clock_value.toLocaleString(),
                        }), (0, mithril_1.default)(tree_1.TreeNode, {
                            left: 'snapshot_id',
                            right: row.snapshot_id,
                        }), (0, mithril_1.default)(tree_1.TreeNode, {
                            left: 'machine_id ',
                            right: row.machine_id ?? 'NULL',
                        }))))));
                    },
                };
            },
        });
        trace.tracks.registerTrack({
            uri,
            renderer: track,
        });
        const trackNode = new workspace_1.TrackNode({ uri, name: 'Clock Snapshots' });
        const group = trace.plugins
            .getPlugin(dev_perfetto_StandardGroups_1.default)
            .getOrCreateStandardGroup(trace.workspace, 'SYSTEM');
        group.addChildInOrder(trackNode);
    }
}
exports.default = default_1;
//# sourceMappingURL=index.js.map