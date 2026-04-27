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
exports.PreflightCheckRenderer = void 0;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const spinner_1 = require("../../../widgets/spinner");
const icon_1 = require("../../../widgets/icon");
const anchor_1 = require("../../../widgets/anchor");
class PreflightCheckRenderer {
    testTarget;
    results = new Array();
    allChecksCompleted = false;
    numChecksFailed = 0;
    constructor(testTarget) {
        this.testTarget = testTarget;
    }
    async runPreflightChecks() {
        this.allChecksCompleted = false;
        this.numChecksFailed = 0;
        for await (const check of this.testTarget.runPreflightChecks()) {
            const entry = { ...check, result: check.status };
            this.results.push(entry);
            this.numChecksFailed += check.status.ok ? 0 : 1;
            mithril_1.default.redraw();
        }
        this.allChecksCompleted = true;
        mithril_1.default.redraw();
        return this.numChecksFailed === 0;
    }
    renderIcon() {
        const attrs = { filled: true, className: 'preflight-checks-icon' };
        if (!this.allChecksCompleted) {
            return (0, mithril_1.default)(spinner_1.Spinner);
        }
        if (this.numChecksFailed > 0) {
            attrs.className += ' ok';
            return (0, mithril_1.default)(icon_1.Icon, { icon: 'report', ...attrs });
        }
        attrs.className += ' error';
        return (0, mithril_1.default)(icon_1.Icon, { icon: 'check_circle', ...attrs });
    }
    renderTable() {
        return (0, mithril_1.default)('table.preflight-checks-table', this.results.map((res) => (0, mithril_1.default)('tr', (0, mithril_1.default)('td', res.name), (0, mithril_1.default)('td', res.result === undefined
            ? (0, mithril_1.default)(spinner_1.Spinner)
            : res.result.ok
                ? (0, mithril_1.default)('span.ok', (0, anchor_1.linkify)(res.result.value))
                : (0, mithril_1.default)('span.error', (0, anchor_1.linkify)(res.result.error)), res.remediation && (0, mithril_1.default)('div', (0, mithril_1.default)(res.remediation))))));
    }
}
exports.PreflightCheckRenderer = PreflightCheckRenderer;
//# sourceMappingURL=preflight_check_renderer.js.map