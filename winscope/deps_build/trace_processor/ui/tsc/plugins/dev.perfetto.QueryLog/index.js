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
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
function formatMillis(millis) {
    return millis.toFixed(1);
}
class default_1 {
    static id = 'dev.perfetto.QueryLog';
    async onTraceLoad(trace) {
        const tabUri = `${trace.pluginId}#QueryLogTab`;
        trace.commands.registerCommand({
            id: `dev.perfetto.ShowQueryLogTab`,
            name: 'Show query log tab',
            callback: () => {
                trace.tabs.showTab(tabUri);
            },
        });
        trace.tabs.registerTab({
            isEphemeral: false,
            uri: tabUri,
            content: {
                getTitle() {
                    return 'Query log';
                },
                render() {
                    // Show the logs in reverse order
                    const queryLog = Array.from(trace.engine.queryLog).reverse();
                    return (0, mithril_1.default)('table.pf-query-log-table', (0, mithril_1.default)('tr', (0, mithril_1.default)('th', 'Query'), (0, mithril_1.default)('th', 'Tag'), (0, mithril_1.default)('th', 'Status'), (0, mithril_1.default)('th', 'Start time (ms)'), (0, mithril_1.default)('th', 'Duration (ms)')), queryLog.map((ql) => (0, mithril_1.default)('tr', (0, mithril_1.default)('td', ql.query), (0, mithril_1.default)('td', ql.tag), (0, mithril_1.default)('td', ql.success === undefined
                        ? 'Running...'
                        : ql.success
                            ? 'Completed'
                            : 'Failed'), (0, mithril_1.default)('td', formatMillis(ql.startTime)), (0, mithril_1.default)('td', ql.endTime === undefined
                        ? '...'
                        : formatMillis(ql.endTime - ql.startTime)))));
                },
            },
        });
    }
}
exports.default = default_1;
//# sourceMappingURL=index.js.map