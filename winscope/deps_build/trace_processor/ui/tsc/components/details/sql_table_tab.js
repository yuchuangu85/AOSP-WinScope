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
exports.addLegacyTableTab = addLegacyTableTab;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const clipboard_1 = require("../../base/clipboard");
const semantic_icons_1 = require("../../base/semantic_icons");
const utils_1 = require("../../base/utils");
const button_1 = require("../../widgets/button");
const details_shell_1 = require("../../widgets/details_shell");
const popup_1 = require("../../widgets/popup");
const add_debug_track_menu_1 = require("../tracks/add_debug_track_menu");
const state_1 = require("../widgets/sql/table/state");
const table_1 = require("../widgets/sql/table/table");
const menu_1 = require("../../widgets/menu");
const add_ephemeral_tab_1 = require("./add_ephemeral_tab");
const chart_tab_1 = require("../widgets/charts/chart_tab");
const chart_1 = require("../widgets/charts/chart");
const add_chart_menu_1 = require("../widgets/charts/add_chart_menu");
const filters_1 = require("../widgets/sql/table/filters");
const pivot_table_state_1 = require("../widgets/sql/pivot_table/pivot_table_state");
const pivot_table_1 = require("../widgets/sql/pivot_table/pivot_table");
const ids_1 = require("../widgets/sql/pivot_table/ids");
const sql_bar_chart_1 = require("../widgets/charts/sql_bar_chart");
const sql_column_1 = require("../widgets/sql/table/sql_column");
const stack_1 = require("../../widgets/stack");
function addLegacyTableTab(trace, config) {
    addSqlTableTabWithState(trace, new state_1.SqlTableState(trace, config.table, {
        filters: new filters_1.Filters(config.filters),
        imports: config.imports,
    }));
}
function addSqlTableTabWithState(trace, state) {
    (0, add_ephemeral_tab_1.addEphemeralTab)(trace, 'sqlTable', new LegacySqlTableTab(state));
}
class LegacySqlTableTab {
    state;
    constructor(state) {
        this.state = state;
        this.selected = {
            kind: 'table',
            state,
        };
    }
    selected;
    pivots = [];
    bar_charts = [];
    getTableButtons() {
        const range = this.state.getDisplayedRange();
        const rowCount = this.state.getTotalRowCount();
        const navigation = [
            (0, utils_1.exists)(range) &&
                (0, utils_1.exists)(rowCount) &&
                `Showing rows ${range.from}-${range.to} of ${rowCount}`,
            (0, mithril_1.default)(button_1.Button, {
                icon: semantic_icons_1.Icons.GoBack,
                disabled: !this.state.canGoBack(),
                onclick: () => this.state.goBack(),
            }),
            (0, mithril_1.default)(button_1.Button, {
                icon: semantic_icons_1.Icons.GoForward,
                disabled: !this.state.canGoForward(),
                onclick: () => this.state.goForward(),
            }),
        ];
        const { selectStatement, columns } = this.state.getCurrentRequest();
        const debugTrackColumns = Object.values(columns).filter((c) => !c.startsWith('__'));
        const addDebugTrack = (0, mithril_1.default)(popup_1.Popup, {
            trigger: (0, mithril_1.default)(button_1.Button, { label: 'Show debug track' }),
            position: popup_1.PopupPosition.Top,
        }, (0, mithril_1.default)(add_debug_track_menu_1.AddDebugTrackMenu, {
            trace: this.state.trace,
            query: `SELECT ${debugTrackColumns.join(', ')} FROM (${selectStatement})`,
            availableColumns: debugTrackColumns,
        }));
        return [
            ...navigation,
            addDebugTrack,
            (0, mithril_1.default)(menu_1.PopupMenu, {
                trigger: (0, mithril_1.default)(button_1.Button, {
                    icon: semantic_icons_1.Icons.Menu,
                }),
            }, (0, mithril_1.default)(menu_1.MenuItem, {
                label: 'Duplicate',
                icon: 'tab_duplicate',
                onclick: () => addSqlTableTabWithState(this.state.trace, this.state.clone()),
            }), (0, mithril_1.default)(menu_1.MenuItem, {
                label: 'Copy SQL query',
                icon: semantic_icons_1.Icons.Copy,
                onclick: () => (0, clipboard_1.copyToClipboard)(this.state.getNonPaginatedSQLQuery()),
            })),
        ];
    }
    tableMenuItems(column, alias) {
        const chartAttrs = {
            data: this.state.nonPaginatedData?.rows,
            columns: [alias],
        };
        return [
            (0, mithril_1.default)(add_chart_menu_1.AddChartMenuItem, {
                chartOptions: [
                    {
                        chartType: chart_1.ChartType.BAR_CHART,
                        ...chartAttrs,
                    },
                    {
                        chartType: chart_1.ChartType.HISTOGRAM,
                        ...chartAttrs,
                    },
                ],
                addChart: (chart) => (0, chart_tab_1.addChartTab)(this.state.trace, chart),
            }),
            (0, mithril_1.default)(menu_1.MenuItem, {
                label: 'Pivot',
                onclick: () => {
                    const state = new pivot_table_state_1.PivotTableState({
                        pivots: [column],
                        table: this.state.config,
                        trace: this.state.trace,
                        filters: this.state.filters,
                    });
                    this.selected = {
                        kind: 'pivot',
                        state,
                    };
                    this.pivots.push(state);
                },
            }),
            (0, mithril_1.default)(menu_1.MenuItem, {
                label: 'Add bar chart',
                onclick: () => {
                    const state = new sql_bar_chart_1.SqlBarChartState({
                        trace: this.state.trace,
                        sqlSource: this.state.config.name,
                        column: column.column,
                        filters: this.state.filters,
                    });
                    this.selected = {
                        kind: 'bar_chart',
                        state,
                    };
                    this.bar_charts.push(state);
                },
            }),
        ];
    }
    render() {
        const showViewButtons = this.pivots.length > 0 || this.bar_charts.length > 0;
        const hasFilters = this.state.filters.get().length > 0;
        return (0, mithril_1.default)(details_shell_1.DetailsShell, {
            title: 'Table',
            description: this.getDisplayName(),
            buttons: this.getTableButtons(),
            fillParent: true,
        }, (0, mithril_1.default)('.pf-sql-table', [
            (hasFilters || showViewButtons) &&
                (0, mithril_1.default)('.pf-sql-table__toolbar', [
                    hasFilters && (0, filters_1.renderFilters)(this.state.filters),
                    showViewButtons &&
                        (0, mithril_1.default)(stack_1.Stack, { orientation: 'horizontal' }, [
                            (0, mithril_1.default)(button_1.Button, {
                                label: 'Table',
                                active: this.selected.state === this.state,
                                onclick: () => {
                                    this.selected = {
                                        kind: 'table',
                                        state: this.state,
                                    };
                                },
                            }),
                            this.pivots.map((pivot) => (0, mithril_1.default)(button_1.Button, {
                                label: `Pivot: ${pivot.getPivots().map(ids_1.pivotId).join(', ')}`,
                                active: this.selected.state === pivot,
                                onclick: () => {
                                    this.selected = {
                                        kind: 'pivot',
                                        state: pivot,
                                    };
                                },
                            })),
                            this.bar_charts.map((chart) => (0, mithril_1.default)(button_1.Button, {
                                label: `Bar chart: ${(0, sql_column_1.sqlColumnId)(chart.args.column)}`,
                                active: this.selected.state === chart,
                                onclick: () => {
                                    this.selected = {
                                        kind: 'bar_chart',
                                        state: chart,
                                    };
                                },
                            })),
                        ]),
                ]),
            (0, mithril_1.default)('.pf-sql-table__table', [
                this.selected.kind === 'table' &&
                    (0, mithril_1.default)(table_1.SqlTable, {
                        state: this.selected.state,
                        addColumnMenuItems: this.tableMenuItems.bind(this),
                    }),
                this.selected.kind === 'pivot' &&
                    (0, mithril_1.default)(pivot_table_1.PivotTable, {
                        state: this.selected.state,
                        extraRowButton: (node) => 
                        // Do not show any buttons for root as it doesn't have any filters anyway.
                        !node.isRoot() &&
                            (0, mithril_1.default)(menu_1.PopupMenu, {
                                trigger: (0, mithril_1.default)(button_1.Button, {
                                    icon: semantic_icons_1.Icons.GoTo,
                                }),
                            }, (0, mithril_1.default)(menu_1.MenuItem, {
                                label: 'Add filters',
                                onclick: () => {
                                    this.state.filters.addFilters(node.getFilters());
                                },
                            }), (0, mithril_1.default)(menu_1.MenuItem, {
                                label: 'Open tab with filters',
                                onclick: () => {
                                    const newState = this.state.clone();
                                    newState.filters.addFilters(node.getFilters());
                                    addSqlTableTabWithState(this.state.trace, newState);
                                },
                            })),
                    }),
                this.selected.kind === 'bar_chart' &&
                    (0, mithril_1.default)(sql_bar_chart_1.SqlBarChart, { state: this.selected.state }),
            ]),
        ]));
    }
    getTitle() {
        const rowCount = this.state.getTotalRowCount();
        const rows = rowCount === undefined ? '' : ` (${rowCount})`;
        return `Table ${this.getDisplayName()}${rows}`;
    }
    getDisplayName() {
        return this.state.config.displayName ?? this.state.config.name;
    }
    isLoading() {
        return this.state.isLoading();
    }
}
//# sourceMappingURL=sql_table_tab.js.map