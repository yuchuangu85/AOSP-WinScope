"use strict";
// Copyright (C) 2025 The Android Open Source Project
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.StdlibTableSource = exports.StdlibTableNode = void 0;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const query_node_1 = require("../../query_node");
const column_controller_1 = require("../column_controller");
const protos_1 = tslib_1.__importDefault(require("../../../../protos"));
const text_paragraph_1 = require("../../../../widgets/text_paragraph");
const button_1 = require("../../../../widgets/button");
const modal_1 = require("../../../../widgets/modal");
const operation_component_1 = require("../operations/operation_component");
const common_1 = require("../../../../widgets/common");
class StdlibTableNode {
    type = query_node_1.NodeType.kStdlibTable;
    prevNode = undefined;
    nextNode;
    sourceCols;
    finalCols;
    state;
    sqlTable;
    constructor(attrs) {
        this.state = attrs;
        if (!attrs.sqlTable)
            throw new Error('No sqlTable provided');
        this.sourceCols = attrs.sqlTable.columns.map((c) => (0, column_controller_1.columnControllerRowFromSqlColumn)(c, true));
        this.finalCols = (0, query_node_1.createFinalColumns)(this);
        this.sqlTable = attrs.sqlTable;
    }
    getState() {
        const newState = {
            trace: this.state.trace,
            sqlModules: this.state.sqlModules,
            modal: this.state.modal,
            sqlTable: this.sqlTable,
            sourceCols: (0, column_controller_1.newColumnControllerRows)(this.sourceCols),
            groupByColumns: (0, column_controller_1.newColumnControllerRows)(this.state.groupByColumns),
            filters: this.state.filters.map((f) => ({ ...f })),
            aggregations: this.state.aggregations.map((a) => ({ ...a })),
        };
        return newState;
    }
    getDetails() {
        return (0, mithril_1.default)(text_paragraph_1.TextParagraph, {
            text: `
    Table '${this.sqlTable.name}' from module
    '${this.sqlTable.includeKey ?? 'prelude'}'.`,
        });
    }
    validate() {
        return true;
    }
    getTitle() {
        return `Table ${this.sqlTable.name}`;
    }
    getStructuredQuery() {
        if (!this.validate())
            return;
        const sq = new protos_1.default.PerfettoSqlStructuredQuery();
        sq.id = `table_source_${this.sqlTable.name}`;
        sq.table = new protos_1.default.PerfettoSqlStructuredQuery.Table();
        sq.table.tableName = this.sqlTable.name;
        sq.table.moduleName = this.sqlTable.includeKey
            ? this.sqlTable.includeKey
            : undefined;
        sq.table.columnNames = this.sourceCols
            .filter((c) => c.checked)
            .map((c) => c.column.name);
        const filtersProto = (0, operation_component_1.createFiltersProto)(this.state.filters);
        if (filtersProto)
            sq.filters = filtersProto;
        const groupByProto = (0, operation_component_1.createGroupByProto)(this.state.groupByColumns, this.state.aggregations);
        if (groupByProto)
            sq.groupBy = groupByProto;
        const selectedColumns = (0, query_node_1.createSelectColumnsProto)(this);
        if (selectedColumns)
            sq.selectColumns = selectedColumns;
        return sq;
    }
}
exports.StdlibTableNode = StdlibTableNode;
class StdlibTableSource {
    async onTableSelect(attrs) {
        (0, modal_1.closeModal)();
        const tableName = await attrs.trace.omnibox.prompt('Choose a table...', attrs.sqlModules.listTablesNames());
        if (!tableName)
            return;
        const sqlTable = attrs.sqlModules.getTable(tableName);
        if (!sqlTable)
            return;
        attrs.sqlTable = sqlTable;
        attrs.sourceCols = sqlTable.columns.map((c) => (0, column_controller_1.columnControllerRowFromSqlColumn)(c, true));
        attrs.modal();
        attrs.filters = [];
        attrs.groupByColumns = (0, column_controller_1.newColumnControllerRows)(attrs.sourceCols, false);
    }
    view({ attrs }) {
        const tableInfoStr = attrs.sqlTable
            ? `Selected table: ${attrs.sqlTable.name}`
            : 'No table selected';
        const tableInfo = (0, mithril_1.default)(text_paragraph_1.TextParagraph, { text: tableInfoStr });
        return (0, mithril_1.default)('', (0, mithril_1.default)(button_1.Button, {
            label: attrs.sqlTable ? 'Change table' : 'Select table',
            intent: common_1.Intent.Primary,
            onclick: async () => {
                this.onTableSelect(attrs);
            },
        }), attrs.sqlTable && [
            tableInfo,
            (0, mithril_1.default)(operation_component_1.Operator, {
                filter: { sourceCols: attrs.sourceCols, filters: attrs.filters },
                groupby: {
                    groupByColumns: attrs.groupByColumns,
                    aggregations: attrs.aggregations,
                },
            }),
        ]);
    }
}
exports.StdlibTableSource = StdlibTableSource;
//# sourceMappingURL=stdlib_table.js.map