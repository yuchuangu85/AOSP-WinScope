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
exports.ChromeExtensionTargetProvider = void 0;
const events_1 = require("../../../base/events");
const chrome_extension_target_1 = require("./chrome_extension_target");
class ChromeExtensionTargetProvider {
    id = 'chrome_extension';
    name = 'Chrome Tracing extension';
    icon = 'extension';
    description = 'Chrome using extension';
    supportedPlatforms = ['CHROME', 'CHROME_OS'];
    onTargetsChanged = new events_1.EvtSource();
    target = new chrome_extension_target_1.ChromeExtensionTarget();
    async *runPreflightChecks() { }
    async listTargets(platform) {
        this.target.platform = platform;
        return [this.target];
    }
    getChromeCategories() {
        return this.target.getChromeCategories();
    }
}
exports.ChromeExtensionTargetProvider = ChromeExtensionTargetProvider;
//# sourceMappingURL=chrome_extension_target_provider.js.map