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
exports.SHARE_SUBPAGE = void 0;
exports.shareRecordConfig = shareRecordConfig;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const gcs_uploader_1 = require("../../../base/gcs_uploader");
const logging_1 = require("../../../base/logging");
const copyable_link_1 = require("../../../widgets/copyable_link");
const modal_1 = require("../../../widgets/modal");
exports.SHARE_SUBPAGE = 'share';
async function shareRecordConfig(config) {
    const msg = 'This will generate a publicly-readable link to the ' +
        'current config which cannot be deleted. Continue?';
    if (!confirm(msg))
        return;
    const json = JSON.stringify(config);
    const uploader = new gcs_uploader_1.GcsUploader(json, { mimeType: 'application/json' });
    await uploader.waitForCompletion();
    const url = uploader.uploadedUrl;
    const hash = (0, logging_1.assertExists)(url.split('/').pop());
    (0, modal_1.showModal)({
        title: 'Permalink',
        content: (0, mithril_1.default)(copyable_link_1.CopyableLink, {
            url: `${self.location.origin}/#!/record/${exports.SHARE_SUBPAGE}/${hash}`,
        }),
    });
}
//# sourceMappingURL=config_sharing.js.map