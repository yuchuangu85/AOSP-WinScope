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
exports.SqlSource = exports.SqlSourceNode = void 0;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const query_node_1 = require("../../query_node");
const column_controller_1 = require("../column_controller");
const protos_1 = tslib_1.__importDefault(require("../../../../protos"));
const text_paragraph_1 = require("../../../../widgets/text_paragraph");
const text_input_1 = require("../../../../widgets/text_input");
const operation_component_1 = require("../operations/operation_component");
class SqlSourceNode {
    type = query_node_1.NodeType.kSqlSource;
    prevNode = undefined;
    nextNode;
    sourceCols;
    finalCols;
    state;
    constructor(attrs) {
        this.state = attrs;
        this.sourceCols =
            attrs.sqlColumns?.map((c) => (0, column_controller_1.columnControllerRowFromName)(c)) ?? [];
        this.finalCols = (0, query_node_1.createFinalColumns)(this);
    }
    getState() {
        const newState = {
            sql: this.state.sql,
            sqlColumns: this.state.sqlColumns,
            preamble: this.state.preamble,
            sourceCols: (0, column_controller_1.newColumnControllerRows)(this.sourceCols),
            groupByColumns: (0, column_controller_1.newColumnControllerRows)(this.state.groupByColumns),
            filters: this.state.filters.map((f) => ({ ...f })),
            aggregations: this.state.aggregations.map((a) => ({ ...a })),
        };
        return newState;
    }
    validate() {
        return (this.state.sql !== undefined &&
            this.state.sqlColumns !== undefined &&
            this.state.preamble !== undefined &&
            this.sourceCols.length > 0);
    }
    getTitle() {
        return `Sql source`;
    }
    getStructuredQuery() {
        if (!this.validate())
            return;
        const sq = new protos_1.default.PerfettoSqlStructuredQuery();
        sq.id = `sql_source`;
        const sqlProto = new protos_1.default.PerfettoSqlStructuredQuery.Sql();
        if (this.state.sql)
            sqlProto.sql = this.state.sql;
        if (this.state.sqlColumns)
            sqlProto.columnNames = this.state.sqlColumns;
        if (this.state.preamble)
            sqlProto.preamble = this.state.preamble;
        sq.sql = sqlProto;
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
    getDetails() {
        return (0, mithril_1.default)(text_paragraph_1.TextParagraph, {
            text: `
        Running custom SQL returning columns ${this.state.sqlColumns?.join(', ')}.\n
        Preamble: \n${this.state.preamble ?? `NONE`}\n
        SQL: \n${this.state.sql ?? `NONE`}`,
        });
    }
}
exports.SqlSourceNode = SqlSourceNode;
class SqlSource {
    view({ attrs }) {
        return (0, mithril_1.default)('', (0, mithril_1.default)('', 'Preamble', (0, mithril_1.default)(text_input_1.TextInput, {
            id: 'preamble',
            type: 'string',
            oninput: (e) => {
                if (!e.target)
                    return;
                attrs.preamble = e.target.value.trim();
            },
        })), (0, mithril_1.default)('', 'Sql ', (0, mithril_1.default)(text_input_1.TextInput, {
            id: 'sql_source',
            type: 'string',
            oninput: (e) => {
                if (!e.target)
                    return;
                attrs.sql = e.target.value
                    .trim()
                    .split(';')[0];
            },
        })), (0, mithril_1.default)('', 'Column names (comma separated strings) ', (0, mithril_1.default)(text_input_1.TextInput, {
            id: 'columns',
            type: 'string',
            oninput: (e) => {
                if (!e.target)
                    return;
                attrs.sqlColumns = e.target.value
                    .split(',')
                    .map((col) => col.trim())
                    .filter(Boolean);
                attrs.sourceCols = attrs.sqlColumns.map((c) => (0, column_controller_1.columnControllerRowFromName)(c, true));
                attrs.groupByColumns = (0, column_controller_1.newColumnControllerRows)(attrs.sourceCols, false);
            },
        })), (0, mithril_1.default)(operation_component_1.Operator, {
            filter: { sourceCols: attrs.sourceCols, filters: attrs.filters },
            groupby: {
                groupByColumns: attrs.groupByColumns,
                aggregations: attrs.aggregations,
            },
        }));
    }
}
exports.SqlSource = SqlSource;
//# sourceMappingURL=sql_source.js.map