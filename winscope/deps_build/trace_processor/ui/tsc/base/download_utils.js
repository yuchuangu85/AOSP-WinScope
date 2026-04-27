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
exports.download = download;
exports.downloadUrl = downloadUrl;
const tslib_1 = require("tslib");
const utils_1 = require("./utils");
/**
 * Downloads some content to a file.
 *
 * @param args The arguments for the download.
 * @param args.content The content to download.
 * @param args.fileName The name of the file to download.
 * @param args.mimeType The MIME type of the content.
 * @param args.filePicker If provided, the file picker will be used to save the file.
 */
async function download({ content, fileName, mimeType, filePicker, }) {
    let blob;
    if (content instanceof File || content instanceof Blob) {
        blob = content;
    }
    else {
        const inferredMimeType = typeof content === 'string' ? 'text/plain' : 'application/octet-stream';
        blob = new Blob([content], {
            type: mimeType ?? inferredMimeType,
        });
    }
    if (filePicker && (0, utils_1.exists)(window.showSaveFilePicker)) {
        try {
            const handle = await window.showSaveFilePicker({
                suggestedName: fileName,
                types: filePicker.types,
            });
            const writable = await handle.createWritable();
            await writable.write(blob);
            await writable.close();
        }
        catch (e) {
            console.error(e);
            // The user pressed cancel, do nothing.
        }
    }
    else {
        const env_1 = { stack: [], error: void 0, hasError: false };
        try {
            // No file picker available or requested, fallback to the old method.
            const url = tslib_1.__addDisposableResource(env_1, createUrl(blob), false);
            downloadUrl({ url: url.value, fileName });
        }
        catch (e_1) {
            env_1.error = e_1;
            env_1.hasError = true;
        }
        finally {
            tslib_1.__disposeResources(env_1);
        }
    }
}
/**
 * Initiate download of a resource identified by a URL.
 *
 * @param args The arguments for the download.
 * @param args.fileName The name of the file to download.
 * @param args.url The URL of the resource to download.
 */
function downloadUrl({ fileName, url }) {
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
function createUrl(blob) {
    const url = URL.createObjectURL(blob);
    return {
        [Symbol.dispose]: () => URL.revokeObjectURL(url),
        value: url,
    };
}
//# sourceMappingURL=download_utils.js.map