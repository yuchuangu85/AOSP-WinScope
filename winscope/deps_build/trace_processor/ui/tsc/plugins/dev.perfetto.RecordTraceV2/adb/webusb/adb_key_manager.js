"use strict";
// Copyright (C) 2022 The Android Open Source Project
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
exports.AdbKeyManager = void 0;
const assets_1 = require("../../../../base/assets");
const async_lazy_1 = require("../../../../base/async_lazy");
const result_1 = require("../../../../base/result");
const utils_1 = require("../../../../base/utils");
const adb_key_1 = require("./adb_key");
// How long we will store the key in memory
const KEY_IN_MEMORY_TIMEOUT = 1000 * 60 * 30; // 30 minutes
class AdbKeyManager {
    expiryTimerId = -1;
    key = new async_lazy_1.AsyncLazy();
    // Finds a key, by priority:
    // - Look in memory (i.e. this.key)
    // - Look in the credential store.
    // - Finally creates one from scratch if needed.
    async getOrCreateKey() {
        this.refreshKeyExpiry();
        return this.key.getOrCreate(async () => {
            // 2. We try to get the private key from the browser.
            // The mediation is set as 'optional', because we use
            // 'preventSilentAccess', which sometimes requests the user to click
            // on a button to allow the auth, but sometimes only shows a
            // notification and does not require the user to click on anything.
            // If we had set mediation to 'required', the user would have been
            // asked to click on a button every time.
            if (hasPasswordCredential()) {
                const options = {
                    password: true,
                    mediation: 'optional',
                };
                const credential = await navigator.credentials.get(options);
                await navigator.credentials.preventSilentAccess();
                if ((0, utils_1.exists)(credential) && 'password' in credential) {
                    return (0, result_1.okResult)(adb_key_1.AdbKey.deserialize(credential.password));
                }
            }
            // This can happen in two cases:
            // 1. The very first time when we have no credentials saved.
            // 2. If the user (accidentally) dismisses the "sign in" dialog.
            // We use this UX to prevent that if the user accidentally clicks Escape,
            // we invalidate the key and generates a new one, which would be
            // unauthorized.
            if (!confirm("Couldn't load the ADB key. Generate a new key?")) {
                return (0, result_1.errResult)("Couldn't load the ADB Key. " + 'Did you dismiss the sign-in dialog');
            }
            // 3. We generate a new key pair.
            const newKey = await adb_key_1.AdbKey.generateNewKeyPair();
            await storeKeyInBrowserCredentials(newKey);
            return (0, result_1.okResult)(newKey);
        });
    }
    refreshKeyExpiry() {
        if (this.expiryTimerId >= 0) {
            clearTimeout(this.expiryTimerId);
        }
        this.expiryTimerId = self.setTimeout(() => this.key.reset(), KEY_IN_MEMORY_TIMEOUT);
    }
}
exports.AdbKeyManager = AdbKeyManager;
// Update credential store with the given key.
async function storeKeyInBrowserCredentials(key) {
    if (!hasPasswordCredential()) {
        return;
    }
    const credential = new PasswordCredential({
        id: 'webusb-adb-key',
        password: key.serialize(),
        name: 'WebUSB ADB Key',
        iconURL: (0, assets_1.assetSrc)('assets/favicon.png'),
    });
    // The 'Save password?' Chrome dialogue only appears if the key is
    // not already stored in Chrome.
    await navigator.credentials.store(credential);
    // 'preventSilentAccess' guarantees the user is always notified when
    // credentials are accessed. Sometimes the user is asked to click a button
    // and other times only a notification is shown temporarily.
    await navigator.credentials.preventSilentAccess();
}
function hasPasswordCredential() {
    return 'PasswordCredential' in window;
}
//# sourceMappingURL=adb_key_manager.js.map