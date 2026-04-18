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
exports.showPopupWindow = showPopupWindow;
const deferred_1 = require("./deferred");
const DEFAULT_TIMEOUT_MS = 30_000;
/**
 * Opens a URL in a new popup-style tab.
 * @returns A promise for a result that is resolved successfully if the popup
 * closes, or unsuccessfully if popups are blocked or the timeout expires.
 */
function showPopupWindow(args) {
    const popup = window.open(args.url, '_blank', `width=${args.width ?? 500},height=${args.height ?? 500},` +
        'scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no');
    const promise = (0, deferred_1.defer)();
    if (popup === null) {
        promise.resolve(false);
        return promise;
    }
    const deadline = performance.now() + (args.timeoutMs ?? DEFAULT_TIMEOUT_MS);
    const interval = setInterval(() => {
        if (popup.closed) {
            clearInterval(interval);
            promise.resolve(true);
        }
        if (performance.now() >= deadline) {
            clearInterval(interval);
            promise.resolve(false);
        }
    }, 500);
    return promise;
}
//# sourceMappingURL=popup_window.js.map