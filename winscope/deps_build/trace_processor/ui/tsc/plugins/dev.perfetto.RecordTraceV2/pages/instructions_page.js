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
exports.instructionsPage = instructionsPage;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const clipboard_1 = require("../../../base/clipboard");
const trace_config_utils_wasm_1 = require("../config/trace_config_utils_wasm");
const protos_1 = tslib_1.__importDefault(require("../../../protos"));
const anchor_1 = require("../../../widgets/anchor");
function instructionsPage(recMgr) {
    return {
        kind: 'GLOBAL_PAGE',
        id: 'cmdline',
        icon: 'terminal',
        title: 'Cmdline instructions',
        subtitle: 'Show cmdline instructions',
        render() {
            return (0, mithril_1.default)(InstructionsPage, { recMgr });
        },
        serialize() { },
        deserialize() { },
    };
}
class InstructionsPage {
    configTxt = '';
    cmdline;
    docsLink;
    constructor({ attrs }) {
        // Generate the config PBTX.
        const cfg = attrs.recMgr.genTraceConfig();
        const cfgBytes = protos_1.default.TraceConfig.encode(cfg).finish().slice();
        (0, trace_config_utils_wasm_1.traceConfigToTxt)(cfgBytes).then((txt) => {
            this.configTxt = txt;
            mithril_1.default.redraw();
        });
        // Generate the cmdline instructions.
        switch (attrs.recMgr.currentPlatform) {
            case 'ANDROID':
                this.cmdline =
                    'cat config.pbtx | adb shell perfetto' +
                        ' -c - --txt -o /data/misc/perfetto-traces/trace.pftrace';
                this.docsLink = 'https://perfetto.dev/docs/quickstart/android-tracing';
                break;
            case 'LINUX':
                this.cmdline = 'perfetto -c config.pbtx --txt -o /tmp/trace.pftrace';
                this.docsLink = 'https://perfetto.dev/docs/quickstart/linux-tracing';
                break;
            case 'CHROME':
            case 'CHROME_OS':
                this.docsLink = 'https://perfetto.dev/docs/quickstart/chrome-tracing';
                this.cmdline =
                    'There is no cmdline support for Chrome/CrOS.\n' +
                        'You must use the recording UI via the extension to record traces.';
        }
    }
    view() {
        return [
            this.docsLink &&
                (0, mithril_1.default)('p', 'See the documentation on ', (0, mithril_1.default)(anchor_1.Anchor, { href: this.docsLink, target: '_blank' }, this.docsLink.replace('https://', ''))),
            this.cmdline && (0, mithril_1.default)('.code-snippet', (0, mithril_1.default)('code', this.cmdline)),
            (0, mithril_1.default)('p', 'Save the file below as: config.pbtx'),
            (0, mithril_1.default)('.code-snippet', (0, mithril_1.default)('button', {
                title: 'Copy to clipboard',
                onclick: () => (0, clipboard_1.copyToClipboard)(this.configTxt),
            }, (0, mithril_1.default)('i.material-icons', 'assignment')), (0, mithril_1.default)('code', this.configTxt)),
        ];
    }
}
//# sourceMappingURL=instructions_page.js.map