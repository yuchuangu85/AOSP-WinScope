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
exports.HeapProfileFlamegraphDetailsPanel = exports.ProfileType = void 0;
exports.profileType = profileType;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const logging_1 = require("../../base/logging");
const sql_utils_1 = require("../../trace_processor/sql_utils");
const extensions_1 = require("../../components/extensions");
const uuid_1 = require("../../base/uuid");
const query_flamegraph_1 = require("../../components/query_flamegraph");
const trace_converter_1 = require("../../frontend/trace_converter");
const timestamp_1 = require("../../components/widgets/timestamp");
const query_result_1 = require("../../trace_processor/query_result");
const button_1 = require("../../widgets/button");
const common_1 = require("../../widgets/common");
const details_shell_1 = require("../../widgets/details_shell");
const icon_1 = require("../../widgets/icon");
const modal_1 = require("../../widgets/modal");
const flamegraph_1 = require("../../widgets/flamegraph");
const columns_1 = require("../../components/widgets/sql/table/columns");
const stack_1 = require("../../widgets/stack");
const tooltip_1 = require("../../widgets/tooltip");
var ProfileType;
(function (ProfileType) {
    ProfileType["HEAP_PROFILE"] = "heap_profile";
    ProfileType["MIXED_HEAP_PROFILE"] = "heap_profile:com.android.art,libc.malloc";
    ProfileType["NATIVE_HEAP_PROFILE"] = "heap_profile:libc.malloc";
    ProfileType["JAVA_HEAP_SAMPLES"] = "heap_profile:com.android.art";
    ProfileType["JAVA_HEAP_GRAPH"] = "graph";
    ProfileType["PERF_SAMPLE"] = "perf";
    ProfileType["INSTRUMENTS_SAMPLE"] = "instruments";
})(ProfileType || (exports.ProfileType = ProfileType = {}));
function profileType(s) {
    if (s === 'heap_profile:libc.malloc,com.android.art') {
        s = 'heap_profile:com.android.art,libc.malloc';
    }
    if (Object.values(ProfileType).includes(s)) {
        return s;
    }
    if (s.startsWith('heap_profile')) {
        return ProfileType.HEAP_PROFILE;
    }
    throw new Error('Unknown type ${s}');
}
class HeapProfileFlamegraphDetailsPanel {
    trace;
    heapGraphIncomplete;
    upid;
    flamegraph;
    props;
    flamegraphModalDismissed = false;
    serialization;
    constructor(trace, heapGraphIncomplete, upid, profileType, ts) {
        this.trace = trace;
        this.heapGraphIncomplete = heapGraphIncomplete;
        this.upid = upid;
        const metrics = flamegraphMetrics(trace, profileType, ts, upid);
        this.serialization = {
            schema: flamegraph_1.FLAMEGRAPH_STATE_SCHEMA,
            state: flamegraph_1.Flamegraph.createDefaultState(metrics),
        };
        this.flamegraph = new query_flamegraph_1.QueryFlamegraph(trace, metrics, this.serialization);
        this.props = { ts, type: profileType };
    }
    render() {
        const { type, ts } = this.props;
        return (0, mithril_1.default)('.pf-flamegraph-profile', this.maybeShowModal(this.trace, type, this.heapGraphIncomplete), (0, mithril_1.default)(details_shell_1.DetailsShell, {
            fillParent: true,
            title: (0, mithril_1.default)('span', getFlamegraphTitle(type), type === ProfileType.MIXED_HEAP_PROFILE && [
                ' ', // Some space between title and icon
                (0, mithril_1.default)(tooltip_1.Tooltip, {
                    trigger: (0, mithril_1.default)(icon_1.Icon, { icon: 'warning', intent: common_1.Intent.Warning }),
                }, (0, mithril_1.default)('', 'This is a mixed java/native heap profile, free()s are not visualized. To visualize free()s, remove "all_heaps: true" from the config.')),
            ]),
            buttons: (0, mithril_1.default)(stack_1.Stack, { orientation: 'horizontal', spacing: 'large' }, [
                (0, mithril_1.default)('span', `Snapshot time: `, (0, mithril_1.default)(timestamp_1.Timestamp, { trace: this.trace, ts })),
                (type === ProfileType.NATIVE_HEAP_PROFILE ||
                    type === ProfileType.JAVA_HEAP_SAMPLES) &&
                    (0, mithril_1.default)(button_1.Button, {
                        icon: 'file_download',
                        intent: common_1.Intent.Primary,
                        variant: button_1.ButtonVariant.Filled,
                        onclick: () => {
                            downloadPprof(this.trace, this.upid, ts);
                        },
                    }),
            ]),
        }, (0, logging_1.assertExists)(this.flamegraph).render()));
    }
    maybeShowModal(trace, type, heapGraphIncomplete) {
        if (type !== ProfileType.JAVA_HEAP_GRAPH || !heapGraphIncomplete) {
            return undefined;
        }
        if (this.flamegraphModalDismissed) {
            return undefined;
        }
        return (0, mithril_1.default)(modal_1.Modal, {
            title: 'The flamegraph is incomplete',
            vAlign: 'TOP',
            content: (0, mithril_1.default)('div', 'The current trace does not have a fully formed flamegraph'),
            buttons: [
                {
                    text: 'Show the errors',
                    primary: true,
                    action: () => trace.navigate('#!/info'),
                },
                {
                    text: 'Skip',
                    action: () => {
                        this.flamegraphModalDismissed = true;
                    },
                },
            ],
        });
    }
}
exports.HeapProfileFlamegraphDetailsPanel = HeapProfileFlamegraphDetailsPanel;
function flamegraphMetrics(trace, type, ts, upid) {
    switch (type) {
        case ProfileType.NATIVE_HEAP_PROFILE:
            return flamegraphMetricsForHeapProfile(ts, upid, [
                {
                    name: 'Unreleased Malloc Size',
                    unit: 'B',
                    columnName: 'self_size',
                },
                {
                    name: 'Unreleased Malloc Count',
                    unit: '',
                    columnName: 'self_count',
                },
                {
                    name: 'Total Malloc Size',
                    unit: 'B',
                    columnName: 'self_alloc_size',
                },
                {
                    name: 'Total Malloc Count',
                    unit: '',
                    columnName: 'self_alloc_count',
                },
            ]);
        case ProfileType.HEAP_PROFILE:
            return flamegraphMetricsForHeapProfile(ts, upid, [
                {
                    name: 'Unreleased Size',
                    unit: 'B',
                    columnName: 'self_size',
                },
                {
                    name: 'Unreleased Count',
                    unit: '',
                    columnName: 'self_count',
                },
                {
                    name: 'Total Size',
                    unit: 'B',
                    columnName: 'self_alloc_size',
                },
                {
                    name: 'Total Count',
                    unit: '',
                    columnName: 'self_alloc_count',
                },
            ]);
        case ProfileType.JAVA_HEAP_SAMPLES:
            return flamegraphMetricsForHeapProfile(ts, upid, [
                {
                    name: 'Total Allocation Size',
                    unit: 'B',
                    columnName: 'self_size',
                },
                {
                    name: 'Total Allocation Count',
                    unit: '',
                    columnName: 'self_count',
                },
            ]);
        case ProfileType.MIXED_HEAP_PROFILE:
            return flamegraphMetricsForHeapProfile(ts, upid, [
                {
                    name: 'Allocation Size (malloc + java)',
                    unit: 'B',
                    columnName: 'self_size',
                },
                {
                    name: 'Allocation Count (malloc + java)',
                    unit: '',
                    columnName: 'self_count',
                },
            ]);
        case ProfileType.JAVA_HEAP_GRAPH:
            return [
                {
                    name: 'Object Size',
                    unit: 'B',
                    dependencySql: 'include perfetto module android.memory.heap_graph.class_tree;',
                    statement: `
            select
              id,
              parent_id as parentId,
              ifnull(name, '[Unknown]') as name,
              root_type,
              heap_type,
              self_size as value,
              self_count,
              path_hash_stable
            from _heap_graph_class_tree
            where graph_sample_ts = ${ts} and upid = ${upid}
          `,
                    unaggregatableProperties: [
                        { name: 'root_type', displayName: 'Root Type' },
                        { name: 'heap_type', displayName: 'Heap Type' },
                    ],
                    aggregatableProperties: [
                        {
                            name: 'self_count',
                            displayName: 'Self Count',
                            mergeAggregation: 'SUM',
                        },
                        {
                            name: 'path_hash_stable',
                            displayName: 'Path Hash',
                            mergeAggregation: 'CONCAT_WITH_COMMA',
                            isVisible: false,
                        },
                    ],
                    optionalNodeActions: getHeapGraphNodeOptionalActions(trace, false),
                    optionalRootActions: getHeapGraphRootOptionalActions(trace, false),
                },
                {
                    name: 'Object Count',
                    unit: '',
                    dependencySql: 'include perfetto module android.memory.heap_graph.class_tree;',
                    statement: `
            select
              id,
              parent_id as parentId,
              ifnull(name, '[Unknown]') as name,
              root_type,
              heap_type,
              self_size,
              self_count as value,
              path_hash_stable
            from _heap_graph_class_tree
            where graph_sample_ts = ${ts} and upid = ${upid}
          `,
                    unaggregatableProperties: [
                        { name: 'root_type', displayName: 'Root Type' },
                        { name: 'heap_type', displayName: 'Heap Type' },
                    ],
                    aggregatableProperties: [
                        {
                            name: 'path_hash_stable',
                            displayName: 'Path Hash',
                            mergeAggregation: 'CONCAT_WITH_COMMA',
                            isVisible: false,
                        },
                    ],
                    optionalNodeActions: getHeapGraphNodeOptionalActions(trace, false),
                    optionalRootActions: getHeapGraphRootOptionalActions(trace, false),
                },
                {
                    name: 'Dominated Object Size',
                    unit: 'B',
                    dependencySql: 'include perfetto module android.memory.heap_graph.dominator_class_tree;',
                    statement: `
            select
              id,
              parent_id as parentId,
              ifnull(name, '[Unknown]') as name,
              root_type,
              heap_type,
              self_size as value,
              self_count,
              path_hash_stable
            from _heap_graph_dominator_class_tree
            where graph_sample_ts = ${ts} and upid = ${upid}
          `,
                    unaggregatableProperties: [
                        { name: 'root_type', displayName: 'Root Type' },
                        { name: 'heap_type', displayName: 'Heap Type' },
                    ],
                    aggregatableProperties: [
                        {
                            name: 'self_count',
                            displayName: 'Self Count',
                            mergeAggregation: 'SUM',
                        },
                        {
                            name: 'path_hash_stable',
                            displayName: 'Path Hash',
                            mergeAggregation: 'CONCAT_WITH_COMMA',
                            isVisible: false,
                        },
                    ],
                    optionalNodeActions: getHeapGraphNodeOptionalActions(trace, true),
                    optionalRootActions: getHeapGraphRootOptionalActions(trace, true),
                },
                {
                    name: 'Dominated Object Count',
                    unit: '',
                    dependencySql: 'include perfetto module android.memory.heap_graph.dominator_class_tree;',
                    statement: `
            select
              id,
              parent_id as parentId,
              ifnull(name, '[Unknown]') as name,
              root_type,
              heap_type,
              self_size,
              self_count as value,
              path_hash_stable
            from _heap_graph_dominator_class_tree
            where graph_sample_ts = ${ts} and upid = ${upid}
          `,
                    unaggregatableProperties: [
                        { name: 'root_type', displayName: 'Root Type' },
                        { name: 'heap_type', displayName: 'Heap Type' },
                    ],
                    aggregatableProperties: [
                        {
                            name: 'path_hash_stable',
                            displayName: 'Path Hash',
                            mergeAggregation: 'CONCAT_WITH_COMMA',
                            isVisible: false,
                        },
                    ],
                    optionalNodeActions: getHeapGraphNodeOptionalActions(trace, true),
                    optionalRootActions: getHeapGraphRootOptionalActions(trace, true),
                },
            ];
        case ProfileType.PERF_SAMPLE:
            throw new Error('Perf sample not supported');
        case ProfileType.INSTRUMENTS_SAMPLE:
            throw new Error('Instruments sample not supported');
    }
}
function flamegraphMetricsForHeapProfile(ts, upid, metrics) {
    return (0, query_flamegraph_1.metricsFromTableOrSubquery)(`
      (
        select
          id,
          parent_id as parentId,
          name,
          mapping_name,
          source_file || ':' || line_number as source_location,
          self_size,
          self_count,
          self_alloc_size,
          self_alloc_count
        from _android_heap_profile_callstacks_for_allocations!((
          select
            callsite_id,
            size,
            count,
            max(size, 0) as alloc_size,
            max(count, 0) as alloc_count
          from heap_profile_allocation a
          where a.ts <= ${ts} and a.upid = ${upid}
        ))
      )
    `, metrics, 'include perfetto module android.memory.heap_profile.callstacks', [{ name: 'mapping_name', displayName: 'Mapping' }], [
        {
            name: 'source_location',
            displayName: 'Source Location',
            mergeAggregation: 'ONE_OR_SUMMARY',
        },
    ]);
}
function getFlamegraphTitle(type) {
    switch (type) {
        case ProfileType.HEAP_PROFILE:
            return 'Heap profile';
        case ProfileType.JAVA_HEAP_GRAPH:
            return 'Java heap graph';
        case ProfileType.JAVA_HEAP_SAMPLES:
            return 'Java heap samples';
        case ProfileType.MIXED_HEAP_PROFILE:
            return 'Mixed heap profile';
        case ProfileType.NATIVE_HEAP_PROFILE:
            return 'Native heap profile';
        case ProfileType.PERF_SAMPLE:
            (0, logging_1.assertFalse)(false, 'Perf sample not supported');
            return 'Impossible';
        case ProfileType.INSTRUMENTS_SAMPLE:
            (0, logging_1.assertFalse)(false, 'Instruments sample not supported');
            return 'Impossible';
    }
}
async function downloadPprof(trace, upid, ts) {
    const pid = await trace.engine.query(`select pid from process where upid = ${upid}`);
    if (!trace.traceInfo.downloadable) {
        (0, modal_1.showModal)({
            title: 'Download not supported',
            content: (0, mithril_1.default)('div', 'This trace file does not support downloads'),
        });
        return;
    }
    const blob = await trace.getTraceFile();
    (0, trace_converter_1.convertTraceToPprofAndDownload)(blob, pid.firstRow({ pid: query_result_1.NUM }).pid, ts);
}
function getHeapGraphObjectReferencesView(isDominator) {
    return {
        name: `_heap_graph${tableModifier(isDominator)}object_references`,
        columns: [
            new columns_1.StandardColumn('path_hash'),
            new columns_1.StandardColumn('outgoing_reference_count'),
            new columns_1.StandardColumn('class_name'),
            new columns_1.StandardColumn('self_size'),
            new columns_1.StandardColumn('native_size'),
            new columns_1.StandardColumn('heap_type'),
            new columns_1.StandardColumn('root_type'),
            new columns_1.StandardColumn('reachable'),
        ],
    };
}
function getHeapGraphIncomingReferencesView(isDominator) {
    return {
        name: `_heap_graph${tableModifier(isDominator)}incoming_references`,
        columns: [
            new columns_1.StandardColumn('path_hash'),
            new columns_1.StandardColumn('class_name'),
            new columns_1.StandardColumn('field_name'),
            new columns_1.StandardColumn('field_type_name'),
            new columns_1.StandardColumn('self_size'),
            new columns_1.StandardColumn('native_size'),
            new columns_1.StandardColumn('heap_type'),
            new columns_1.StandardColumn('root_type'),
            new columns_1.StandardColumn('reachable'),
        ],
    };
}
function getHeapGraphOutgoingReferencesView(isDominator) {
    return {
        name: `_heap_graph${tableModifier(isDominator)}outgoing_references`,
        columns: [
            new columns_1.StandardColumn('path_hash'),
            new columns_1.StandardColumn('class_name'),
            new columns_1.StandardColumn('field_name'),
            new columns_1.StandardColumn('field_type_name'),
            new columns_1.StandardColumn('self_size'),
            new columns_1.StandardColumn('native_size'),
            new columns_1.StandardColumn('heap_type'),
            new columns_1.StandardColumn('root_type'),
            new columns_1.StandardColumn('reachable'),
        ],
    };
}
function getHeapGraphRetainingObjectCountsView(isDominator) {
    return {
        name: `_heap_graph${tableModifier(isDominator)}retaining_object_counts`,
        columns: [
            new columns_1.StandardColumn('class_name'),
            new columns_1.StandardColumn('count'),
            new columns_1.StandardColumn('total_size'),
            new columns_1.StandardColumn('total_native_size'),
            new columns_1.StandardColumn('heap_type'),
            new columns_1.StandardColumn('root_type'),
            new columns_1.StandardColumn('reachable'),
        ],
    };
}
function getHeapGraphRetainedObjectCountsView(isDominator) {
    return {
        name: `_heap_graph${tableModifier(isDominator)}retained_object_counts`,
        columns: [
            new columns_1.StandardColumn('class_name'),
            new columns_1.StandardColumn('count'),
            new columns_1.StandardColumn('total_size'),
            new columns_1.StandardColumn('total_native_size'),
            new columns_1.StandardColumn('heap_type'),
            new columns_1.StandardColumn('root_type'),
            new columns_1.StandardColumn('reachable'),
        ],
    };
}
function getHeapGraphDuplicateObjectsView(isDominator) {
    return {
        name: `_heap_graph${tableModifier(isDominator)}duplicate_objects`,
        columns: [
            new columns_1.StandardColumn('class_name'),
            new columns_1.StandardColumn('path_count'),
            new columns_1.StandardColumn('object_count'),
            new columns_1.StandardColumn('total_size'),
            new columns_1.StandardColumn('total_native_size'),
        ],
    };
}
function getHeapGraphNodeOptionalActions(trace, isDominator) {
    return [
        {
            name: 'Objects',
            execute: async (kv) => {
                const value = kv.get('path_hash_stable');
                if (value !== undefined) {
                    const uuid = (0, uuid_1.uuidv4Sql)();
                    const pathHashTableName = `_heap_graph_filtered_path_hashes_${uuid}`;
                    await (0, sql_utils_1.createPerfettoTable)({
                        engine: trace.engine,
                        name: pathHashTableName,
                        as: pathHashesToTableStatement(value),
                    });
                    const tableName = `_heap_graph${tableModifier(isDominator)}object_references`;
                    const macroArgs = `_heap_graph${tableModifier(isDominator)}path_hashes, ${pathHashTableName}`;
                    const macroExpr = `_heap_graph_object_references_agg!(${macroArgs})`;
                    const statement = `CREATE OR REPLACE PERFETTO TABLE ${tableName} AS SELECT * FROM ${macroExpr};`;
                    // Create view to be returned
                    await trace.engine.query(statement);
                    extensions_1.extensions.addLegacySqlTableTab(trace, {
                        table: getHeapGraphObjectReferencesView(isDominator),
                    });
                }
            },
        },
        // Group for Direct References
        {
            name: 'Direct References',
            // No execute function for parent menu items
            subActions: [
                {
                    name: 'Incoming references',
                    execute: async (kv) => {
                        const value = kv.get('path_hash_stable');
                        if (value !== undefined) {
                            const uuid = (0, uuid_1.uuidv4Sql)();
                            const pathHashTableName = `_heap_graph_filtered_path_hashes_${uuid}`;
                            await (0, sql_utils_1.createPerfettoTable)({
                                engine: trace.engine,
                                name: pathHashTableName,
                                as: pathHashesToTableStatement(value),
                            });
                            const tableName = `_heap_graph${tableModifier(isDominator)}incoming_references`;
                            const macroArgs = `_heap_graph${tableModifier(isDominator)}path_hashes, ${pathHashTableName}`;
                            const macroExpr = `_heap_graph_incoming_references_agg!(${macroArgs})`;
                            const statement = `CREATE OR REPLACE PERFETTO TABLE ${tableName} AS SELECT * FROM ${macroExpr};`;
                            // Create view to be returned
                            await trace.engine.query(statement);
                            extensions_1.extensions.addLegacySqlTableTab(trace, {
                                table: getHeapGraphIncomingReferencesView(isDominator),
                            });
                        }
                    },
                },
                {
                    name: 'Outgoing references',
                    execute: async (kv) => {
                        const value = kv.get('path_hash_stable');
                        if (value !== undefined) {
                            const uuid = (0, uuid_1.uuidv4Sql)();
                            const pathHashTableName = `_heap_graph_filtered_path_hashes_${uuid}`;
                            await (0, sql_utils_1.createPerfettoTable)({
                                engine: trace.engine,
                                name: pathHashTableName,
                                as: pathHashesToTableStatement(value),
                            });
                            const tableName = `_heap_graph${tableModifier(isDominator)}outgoing_references`;
                            const macroArgs = `_heap_graph${tableModifier(isDominator)}path_hashes, ${pathHashTableName}`;
                            const macroExpr = `_heap_graph_outgoing_references_agg!(${macroArgs})`;
                            const statement = `CREATE OR REPLACE PERFETTO TABLE ${tableName} AS SELECT * FROM ${macroExpr};`;
                            // Create view to be returned
                            await trace.engine.query(statement);
                            extensions_1.extensions.addLegacySqlTableTab(trace, {
                                table: getHeapGraphOutgoingReferencesView(isDominator),
                            });
                        }
                    },
                },
            ],
        },
        // Group for Indirect References
        {
            name: 'Indirect References',
            // No execute function for parent menu items
            subActions: [
                {
                    name: 'Retained objects',
                    execute: async (kv) => {
                        const value = kv.get('path_hash_stable');
                        if (value !== undefined) {
                            const uuid = (0, uuid_1.uuidv4Sql)();
                            const pathHashTableName = `_heap_graph_filtered_path_hashes_${uuid}`;
                            await (0, sql_utils_1.createPerfettoTable)({
                                engine: trace.engine,
                                name: pathHashTableName,
                                as: pathHashesToTableStatement(value),
                            });
                            const tableName = `_heap_graph${tableModifier(isDominator)}retained_object_counts`;
                            const macroArgs = `_heap_graph${tableModifier(isDominator)}path_hashes, ${pathHashTableName}`;
                            const macroExpr = `_heap_graph_retained_object_count_agg!(${macroArgs})`;
                            const statement = `CREATE OR REPLACE PERFETTO TABLE ${tableName} AS SELECT * FROM ${macroExpr};`;
                            // Create view to be returned
                            await trace.engine.query(statement);
                            extensions_1.extensions.addLegacySqlTableTab(trace, {
                                table: getHeapGraphRetainedObjectCountsView(isDominator),
                            });
                        }
                    },
                },
                {
                    name: 'Retaining objects',
                    execute: async (kv) => {
                        const value = kv.get('path_hash_stable');
                        if (value !== undefined) {
                            const uuid = (0, uuid_1.uuidv4Sql)();
                            const pathHashTableName = `_heap_graph_filtered_path_hashes_${uuid}`;
                            await (0, sql_utils_1.createPerfettoTable)({
                                engine: trace.engine,
                                name: pathHashTableName,
                                as: pathHashesToTableStatement(value),
                            });
                            const tableName = `_heap_graph${tableModifier(isDominator)}retaining_object_counts`;
                            const macroArgs = `_heap_graph${tableModifier(isDominator)}path_hashes, ${pathHashTableName}`;
                            const macroExpr = `_heap_graph_retaining_object_count_agg!(${macroArgs})`;
                            const statement = `CREATE OR REPLACE PERFETTO TABLE ${tableName} AS SELECT * FROM ${macroExpr};`;
                            // Create view to be returned
                            await trace.engine.query(statement);
                            extensions_1.extensions.addLegacySqlTableTab(trace, {
                                table: getHeapGraphRetainingObjectCountsView(isDominator),
                            });
                        }
                    },
                },
            ],
        },
    ];
}
function getHeapGraphRootOptionalActions(trace, isDominator) {
    return [
        {
            name: 'Reference paths by class',
            execute: async (_kv) => {
                const viewName = `_heap_graph${tableModifier(isDominator)}duplicate_objects`;
                const macroArgs = `_heap_graph${tableModifier(isDominator)}path_hashes`;
                const macroExpr = `_heap_graph_duplicate_objects_agg!(${macroArgs})`;
                const statement = `CREATE OR REPLACE PERFETTO VIEW ${viewName} AS SELECT * FROM ${macroExpr};`;
                // Create view to be returned
                await trace.engine.query(statement);
                extensions_1.extensions.addLegacySqlTableTab(trace, {
                    table: getHeapGraphDuplicateObjectsView(isDominator),
                });
            },
        },
    ];
}
function tableModifier(isDominator) {
    return isDominator ? '_dominator_' : '_';
}
function pathHashesToTableStatement(commaSeparatedValues) {
    // Split the string by commas and trim whitespace
    const individualValues = commaSeparatedValues.split(',').map((v) => v.trim());
    // Wrap each value with parentheses
    const wrappedValues = individualValues.map((value) => `(${value})`);
    // Join with commas and create the complete WITH clause
    const valuesClause = `values${wrappedValues.join(', ')}`;
    return `WITH temp_table(path_hash) AS (${valuesClause}) SELECT * FROM temp_table`;
}
//# sourceMappingURL=heap_profile_details_panel.js.map