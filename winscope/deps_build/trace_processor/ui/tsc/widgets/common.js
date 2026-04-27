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
exports.Intent = void 0;
exports.classForIntent = classForIntent;
exports.classForSpacing = classForSpacing;
const logging_1 = require("../base/logging");
var Intent;
(function (Intent) {
    Intent["None"] = "None";
    Intent["Primary"] = "Primary";
    Intent["Success"] = "Success";
    Intent["Danger"] = "Danger";
    Intent["Warning"] = "Warning";
})(Intent || (exports.Intent = Intent = {}));
function classForIntent(intent) {
    switch (intent) {
        case Intent.None:
            return undefined;
        case Intent.Primary:
            return 'pf-intent-primary';
        case Intent.Success:
            return 'pf-intent-success';
        case Intent.Danger:
            return 'pf-intent-danger';
        case Intent.Warning:
            return 'pf-intent-warning';
        default:
            return (0, logging_1.assertUnreachable)(intent);
    }
}
function classForSpacing(spacing) {
    switch (spacing) {
        case 'none':
            return 'pf-spacing-none';
        case 'small':
            return 'pf-spacing-small';
        case 'medium':
            return 'pf-spacing-medium';
        case 'large':
            return 'pf-spacing-large';
        default:
            (0, logging_1.assertUnreachable)(spacing);
    }
}
//# sourceMappingURL=common.js.map