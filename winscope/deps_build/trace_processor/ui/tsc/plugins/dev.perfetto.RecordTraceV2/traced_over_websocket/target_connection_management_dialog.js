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
exports.showTracedConnectionManagementDialog = showTracedConnectionManagementDialog;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const traced_websocket_target_1 = require("./traced_websocket_target");
const preflight_check_renderer_1 = require("../pages/preflight_check_renderer");
const modal_1 = require("../../../widgets/modal");
const button_1 = require("../../../widgets/button");
const deferred_1 = require("../../../base/deferred");
/**
 * Shows a dialog that allows to add a connection to another websocket endpoint
 * other than the default 127.0.0.1:8037. This dialog is displayed when the user
 * clicks on "connect new device" in the "Target Device" page.
 */
async function showTracedConnectionManagementDialog(provider) {
    const resultPromise = (0, deferred_1.defer)();
    const key = 'TracedConnectioManagementDialog';
    (0, modal_1.showModal)({
        key,
        title: 'Connect to remote tracing service',
        content: () => (0, mithril_1.default)(TracedConnectioManagementDialog, { provider, resultPromise }),
    }).then(() => resultPromise.resolve(undefined));
    const targetOrUndefined = await resultPromise;
    (0, modal_1.closeModal)(key);
    return targetOrUndefined;
}
class TracedConnectioManagementDialog {
    target;
    checks;
    view({ attrs }) {
        const provider = attrs.provider;
        return (0, mithril_1.default)('.record-page', (0, mithril_1.default)('div', 'Forward port 8037 with ssh from the local host to the ' +
            'remote host where traced is running and invoke websocket_bridge.'), (0, mithril_1.default)('br'), (0, mithril_1.default)('code', "ssh -L8037:localhost:8037 <remote-machine> 'websocket_bridge'"), (0, mithril_1.default)('header', 'Connect a new target'), (0, mithril_1.default)('div', (0, mithril_1.default)('input', {
            placeholder: 'remote_machine:8037',
            onchange: (e) => this.testConnection(e.target.value ?? ''),
        }), (0, mithril_1.default)(button_1.Button, {
            icon: 'add',
            onclick: () => {
                if (this.target !== undefined) {
                    provider.targets.set(this.target.wsUrl, this.target);
                }
                attrs.resultPromise.resolve(this.target);
            },
        })), this.checks && this.checks.renderTable(), (0, mithril_1.default)('header', 'Manage targets'), (0, mithril_1.default)('table', ...Array.from(provider.targets.entries()).map(([wsUrl, target]) => (0, mithril_1.default)('tr', (0, mithril_1.default)('td', (0, mithril_1.default)(button_1.Button, {
            icon: 'delete',
            onclick: () => {
                target.disconnect();
                provider.targets.delete(wsUrl);
                provider.onTargetsChanged.notify();
            },
        })), (0, mithril_1.default)('td', (0, mithril_1.default)('code', wsUrl))))));
    }
    testConnection(userInput) {
        this.target && this.target.disconnect();
        this.target = undefined;
        this.checks = undefined;
        let wsUrl;
        if (userInput.match(/^ws(s?):\/\//)) {
            wsUrl = userInput;
        }
        else if (userInput.match(/^[^:/]+:\d+$/)) {
            wsUrl = `ws://${userInput}/traced`;
        }
        else if (userInput.match(/^[^:/]+$/)) {
            wsUrl = `ws://${userInput}:8037/traced`;
        }
        else {
            return;
        }
        this.target = new traced_websocket_target_1.TracedWebsocketTarget(wsUrl);
        this.checks = new preflight_check_renderer_1.PreflightCheckRenderer(this.target);
        this.checks.runPreflightChecks();
    }
}
//# sourceMappingURL=target_connection_management_dialog.js.map