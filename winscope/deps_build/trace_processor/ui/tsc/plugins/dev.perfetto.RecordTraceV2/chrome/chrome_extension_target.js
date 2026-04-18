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
exports.ChromeExtensionTarget = void 0;
const tslib_1 = require("tslib");
const mithril_1 = tslib_1.__importDefault(require("mithril"));
const deferred_1 = require("../../../base/deferred");
const result_1 = require("../../../base/result");
const string_utils_1 = require("../../../base/string_utils");
const utils_1 = require("../../../base/utils");
const chrome_extension_tracing_session_1 = require("./chrome_extension_tracing_session");
const EXTENSION_ID = 'lfmkphfpdbjijhpomgecfikhfohaoine';
const EXTENSION_URL = `https://g.co/chrome/tracing-extension`;
class ChromeExtensionTarget {
    id = 'chrome_extension';
    kind = 'LIVE_RECORDING';
    transportType = 'Extension';
    platform = 'CHROME';
    port;
    _connected = false;
    _extensionVersion;
    _connectPromise;
    chromeCategories;
    chromeCategoriesPromise = (0, deferred_1.defer)();
    session;
    async *runPreflightChecks() {
        yield {
            name: 'Tracing Extension',
            status: await (async () => {
                const err = (0, result_1.errResult)(`Not found. Please install ${EXTENSION_URL}`);
                if (!(0, utils_1.exists)(window.chrome) || !(0, utils_1.exists)(window.chrome.runtime)) {
                    return err;
                }
                await this.connectIfNeeded();
                return this._connected
                    ? (0, result_1.okResult)(`Connected (version: ${this._extensionVersion})`)
                    : err;
            })(),
        };
        if (this.platform === 'CHROME_OS') {
            yield {
                name: 'CrOS detection',
                status: (() => {
                    const userAgent = navigator.userAgent;
                    const isChromeOS = /CrOS/.test(userAgent);
                    return isChromeOS ? (0, result_1.okResult)(userAgent) : (0, result_1.errResult)(userAgent);
                })(),
            };
        }
    }
    async connectIfNeeded() {
        if (!(0, utils_1.exists)(window.chrome) || !(0, utils_1.exists)(window.chrome.runtime)) {
            return false;
        }
        if (this._connected)
            return true;
        this.port = window.chrome.runtime.connect(EXTENSION_ID);
        this.port.onMessage.addListener(this.onExtensionMessage.bind(this));
        this.port.onDisconnect.addListener(this.onExtensionDisconnect.bind(this));
        // This promise is resolved once the extension replies with 'version'.
        // Unfortunately the chrome.runtime API doesn't offer a way to tell if the
        // extension exists or not. The port is always connected. If the extension
        // doesn't exist, then we receive an onDisconnect soon after.
        const retPromise = (0, deferred_1.defer)();
        this._connectPromise = retPromise;
        // This will trigger a promise resolution once the extension replies with
        // the version (in onExtensionMessage() below);
        this.invokeExtensionMethod('ExtensionVersion');
        return retPromise;
    }
    disconnect() {
        this._connected = false;
        this.port?.disconnect();
        this.port = undefined;
    }
    get connected() {
        return this._connected;
    }
    get name() {
        return 'Chrome (this browser)';
    }
    get emitsCompressedtrace() {
        return this.platform === 'CHROME';
    }
    async getServiceState() {
        const categories = await this.getChromeCategories();
        if (!categories.ok)
            return categories;
        return (0, result_1.okResult)(categoriesToServiceState(categories.value));
    }
    async getChromeCategories() {
        if (this.chromeCategories === undefined) {
            if (!(await this.connectIfNeeded())) {
                return (0, result_1.errResult)('Tracing extension not detected');
            }
            this.chromeCategories = await this.chromeCategoriesPromise;
        }
        return (0, result_1.okResult)(this.chromeCategories);
    }
    async startTracing(traceConfig) {
        await this.connectIfNeeded();
        if (!this._connected) {
            return (0, result_1.errResult)('Cannot connect to the Chrome Tracing extension');
        }
        this.session = new chrome_extension_tracing_session_1.ChromeExtensionTracingSession(this, traceConfig);
        return (0, result_1.okResult)(this.session);
    }
    onExtensionMessage(msg) {
        if ('version' in msg) {
            this._connected = true;
            this._extensionVersion = `${msg.version}`;
            const cp = this._connectPromise;
            this._connectPromise = undefined;
            cp?.resolve(true);
            this.invokeExtensionMethod('GetCategories');
            return;
        }
        if (!('type' in msg)) {
            return;
        }
        if (msg.type === 'GetCategoriesResponse') {
            const cats = msg.categories;
            this.chromeCategoriesPromise.resolve(cats);
        }
        else {
            this.session?.onExtensionMessage(`${msg.type}`, msg);
        }
    }
    invokeExtensionMethod(method, data) {
        const requestData = (0, string_utils_1.binaryEncode)(data ?? new Uint8Array());
        this.port?.postMessage({ method, requestData });
    }
    onExtensionDisconnect() {
        if (this._connected) {
            console.log('Chrome tracing extension disconnected', chrome.runtime.lastError);
        }
        void chrome.runtime.lastError;
        this.port = undefined;
        this._connected = false;
        if (this._connectPromise) {
            this._connectPromise.resolve(false);
        }
        mithril_1.default.redraw();
    }
}
exports.ChromeExtensionTarget = ChromeExtensionTarget;
function categoriesToServiceState(categories) {
    return {
        producers: [{ id: 1, name: 'Chrome' }],
        dataSources: [
            {
                producerId: 1,
                dsDescriptor: {
                    name: 'track_event',
                    id: 1,
                    trackEventDescriptor: {
                        availableCategories: categories.map((cat) => ({ name: cat })),
                    },
                },
            },
        ],
    };
}
//# sourceMappingURL=chrome_extension_target.js.map