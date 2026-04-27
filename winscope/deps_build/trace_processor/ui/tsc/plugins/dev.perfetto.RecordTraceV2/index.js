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
const adb_websocket_target_provider_1 = require("./adb/websocket/adb_websocket_target_provider");
const adb_webusb_target_provider_1 = require("./adb/webusb/adb_webusb_target_provider");
const chrome_extension_target_provider_1 = require("./chrome/chrome_extension_target_provider");
const advanced_1 = require("./pages/advanced");
const android_1 = require("./pages/android");
const perfetto_sdk_1 = require("./pages/perfetto_sdk");
const buffer_config_page_1 = require("./pages/buffer_config_page");
const chrome_1 = require("./pages/chrome");
const instructions_page_1 = require("./pages/instructions_page");
const cpu_1 = require("./pages/cpu");
const gpu_1 = require("./pages/gpu");
const memory_1 = require("./pages/memory");
const power_1 = require("./pages/power");
const record_page_1 = require("./pages/record_page");
const stack_sampling_1 = require("./pages/stack_sampling");
const target_selection_page_1 = require("./pages/target_selection_page");
const recording_manager_1 = require("./recording_manager");
const traced_websocket_provider_1 = require("./traced_over_websocket/traced_websocket_provider");
const saved_configs_1 = require("./pages/saved_configs");
const wdp_target_provider_1 = require("./adb/web_device_proxy/wdp_target_provider");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
class default_1 {
    static id = 'dev.perfetto.RecordTraceV2';
    static recordingMgr;
    static onActivate(app) {
        app.sidebar.addMenuItem({
            section: 'navigation',
            text: 'Record new trace',
            href: '#!/record',
            icon: 'fiber_smart_record',
            sortOrder: 2,
        });
        app.pages.registerPage({
            route: '/record',
            render: (subpage) => {
                return (0, mithril_1.default)(record_page_1.RecordPageV2, {
                    subpage,
                    app,
                    getRecordingManager: () => this.getRecordingManager(app),
                });
            },
        });
        app.commands.registerCommand({
            id: 'dev.perfetto.RecordTraceV2.disconnectTarget',
            name: 'Disconnect the current device',
            callback: () => {
                const recMgr = this.getRecordingManager(app);
                if (recMgr.currentTarget) {
                    recMgr.currentTarget.disconnect();
                }
            },
        });
    }
    // Lazily initialize the RecordingManager at first call. This is to prevent
    // providers to connect to sockets / devtools (which in turn can trigger
    // security UX in the browser) before the user has even done anything.
    static getRecordingManager(app) {
        if (this.recordingMgr === undefined) {
            const recMgr = new recording_manager_1.RecordingManager(app);
            this.recordingMgr = recMgr;
            recMgr.registerProvider(new adb_webusb_target_provider_1.AdbWebusbTargetProvider());
            recMgr.registerProvider(new adb_websocket_target_provider_1.AdbWebsocketTargetProvider());
            recMgr.registerProvider(new wdp_target_provider_1.WebDeviceProxyTargetProvider());
            const chromeProvider = new chrome_extension_target_provider_1.ChromeExtensionTargetProvider();
            recMgr.registerProvider(chromeProvider);
            recMgr.registerProvider(new traced_websocket_provider_1.TracedWebsocketTargetProvider());
            recMgr.registerPage((0, target_selection_page_1.targetSelectionPage)(recMgr), (0, buffer_config_page_1.bufferConfigPage)(recMgr), (0, instructions_page_1.instructionsPage)(recMgr), (0, saved_configs_1.savedConfigsPage)(recMgr), (0, chrome_1.chromeRecordSection)(() => chromeProvider.getChromeCategories()), (0, cpu_1.cpuRecordSection)(), (0, gpu_1.gpuRecordSection)(), (0, power_1.powerRecordSection)(), (0, memory_1.memoryRecordSection)(), (0, android_1.androidRecordSection)(), (0, perfetto_sdk_1.perfettoSDKRecordSection)(), (0, stack_sampling_1.stackSamplingRecordSection)(), (0, advanced_1.advancedRecordSection)());
            recMgr.restorePluginStateFromLocalstorage();
        }
        // For devtools debugging purposes.
        window.recordingMgr = this.recordingMgr;
        return this.recordingMgr;
    }
}
exports.default = default_1;
//# sourceMappingURL=index.js.map