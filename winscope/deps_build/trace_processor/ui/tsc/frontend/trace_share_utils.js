"use strict";
// Copyright (C) 2020 The Android Open Source Project
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
exports.isShareable = isShareable;
exports.shareTrace = shareTrace;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const permalink_1 = require("./permalink");
const modal_1 = require("../widgets/modal");
const copyable_link_1 = require("../widgets/copyable_link");
const app_impl_1 = require("../core/app_impl");
function isShareable(trace) {
    return app_impl_1.AppImpl.instance.isInternalUser && trace.traceInfo.downloadable;
}
const STATE_HASH_PLACEHOLDER = 'perfettoStateHashPlaceholder';
function urlHasPlaceholder(url) {
    return url.includes(STATE_HASH_PLACEHOLDER);
}
async function shareTrace(trace) {
    const traceSource = trace.traceInfo.source;
    const traceUrl = traceSource.url ?? '';
    const hasPlaceholder = urlHasPlaceholder(traceUrl);
    if (isShareable(trace)) {
        // Just upload the trace and create a permalink.
        const result = confirm(`Upload UI state and generate a permalink? ` +
            `The trace will be accessible by anybody with the permalink.`);
        if (result) {
            const traceUrl = await (0, permalink_1.uploadTraceBlob)(trace);
            const hash = await (0, permalink_1.createPermalink)(trace, traceUrl);
            (0, modal_1.showModal)({
                title: 'Permalink',
                content: (0, mithril_1.default)(copyable_link_1.CopyableLink, {
                    url: `${self.location.origin}/#!/?s=${hash}`,
                }),
            });
        }
    }
    else {
        if (traceUrl) {
            if (hasPlaceholder) {
                // Trace is not sharable, but has a URL and a placeholder. Upload the
                // state and return the URL with the placeholder filled in.
                // Trace is not sharable, but has a URL with no placeholder.
                // Just upload the trace and create a permalink.
                const result = confirm(`Upload UI state and generate a permalink? ` +
                    `The state (not the trace) will be accessible by anybody with the permalink.`);
                if (result) {
                    const hash = await (0, permalink_1.createPermalink)(trace, undefined);
                    const urlWithHash = traceUrl.replace(STATE_HASH_PLACEHOLDER, hash);
                    (0, modal_1.showModal)({
                        title: 'Permalink',
                        content: (0, mithril_1.default)(copyable_link_1.CopyableLink, { url: urlWithHash }),
                    });
                }
            }
            else {
                // Trace is not sharable, has a URL, but no placeholder.
                (0, modal_1.showModal)({
                    title: 'Cannot create permalink from external trace',
                    content: (0, mithril_1.default)('', (0, mithril_1.default)('p', 'This trace was opened by an external site and as such cannot ' +
                        'be re-shared preserving the UI state. '), (0, mithril_1.default)('p', 'By using the URL below you can open this trace again.'), (0, mithril_1.default)('p', 'Clicking will copy the URL into the clipboard.'), (0, mithril_1.default)(copyable_link_1.CopyableLink, { url: traceUrl })),
                });
            }
        }
        else {
            // Trace is not sharable and has no URL. Nothing we can do. Just tell the
            // user.
            (0, modal_1.showModal)({
                title: 'Cannot create permalink',
                content: (0, mithril_1.default)('p', 'This trace was opened by an external site and as such cannot ' +
                    'be re-shared preserving the UI state. '),
            });
        }
    }
}
//# sourceMappingURL=trace_share_utils.js.map