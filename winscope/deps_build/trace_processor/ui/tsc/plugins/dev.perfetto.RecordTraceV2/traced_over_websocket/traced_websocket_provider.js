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
exports.TracedWebsocketTargetProvider = void 0;
const events_1 = require("../../../base/events");
const target_connection_management_dialog_1 = require("./target_connection_management_dialog");
const traced_websocket_target_1 = require("./traced_websocket_target");
class TracedWebsocketTargetProvider {
    id = 'traced_websocket';
    name = 'WebSocket';
    description = 'Allows to talk to the traced service UNIX socket via a WebSocket. ' +
        'Requires launching the websocket_bridge on the host';
    icon = 'lan';
    supportedPlatforms = ['LINUX'];
    onTargetsChanged = new events_1.EvtSource();
    targets = new Map();
    constructor() {
        // Add the default target.
        const defaultWsUrl = 'ws://127.0.0.1:8037/traced';
        this.targets.set(defaultWsUrl, new traced_websocket_target_1.TracedWebsocketTarget(defaultWsUrl));
    }
    async listTargets() {
        return Array.from(this.targets.values());
    }
    pairNewTarget() {
        return (0, target_connection_management_dialog_1.showTracedConnectionManagementDialog)(this);
    }
    async *runPreflightChecks() { }
}
exports.TracedWebsocketTargetProvider = TracedWebsocketTargetProvider;
//# sourceMappingURL=traced_websocket_provider.js.map