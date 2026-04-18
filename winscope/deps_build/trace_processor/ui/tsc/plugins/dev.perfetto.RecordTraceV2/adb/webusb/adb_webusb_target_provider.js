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
exports.AdbWebusbTargetProvider = void 0;
const utils_1 = require("../../../../base/utils");
const adb_key_manager_1 = require("./adb_key_manager");
const adb_webusb_utils_1 = require("./adb_webusb_utils");
const result_1 = require("../../../../base/result");
const adb_webusb_target_1 = require("./adb_webusb_target");
const events_1 = require("../../../../base/events");
class AdbWebusbTargetProvider {
    id = 'adb_webusb';
    name = 'WebUsb';
    icon = 'usb';
    supportedPlatforms = ['ANDROID'];
    description = 'This is the easiest option to use but requires exclusive access to the ' +
        'device. If you are an android developer and use ADB, you should use the ' +
        'websocket option instead.';
    adbKeyMgr = new adb_key_manager_1.AdbKeyManager();
    targets = new Map();
    onTargetsChanged = new events_1.EvtSource();
    constructor() {
        if (!(0, utils_1.exists)(navigator.usb))
            return;
        navigator.usb.addEventListener('disconnect', () => this.refreshTargets());
        navigator.usb.addEventListener('connect', () => this.refreshTargets());
    }
    async listTargets() {
        if (!(0, utils_1.exists)(navigator.usb))
            return [];
        await this.refreshTargets();
        return Array.from(this.targets.values());
    }
    async pairNewTarget() {
        if (!(0, utils_1.exists)(navigator.usb))
            return undefined;
        let usbdev;
        try {
            usbdev = await navigator.usb.requestDevice({
                filters: [adb_webusb_utils_1.ADB_DEVICE_FILTER],
            });
        }
        catch (err) {
            if (`${err.name}` === 'NotFoundError') {
                return undefined; // The user just clicked cancel.
            }
            throw err;
        }
        const usbiface = (0, adb_webusb_utils_1.getAdbWebUsbInterface)(usbdev);
        if (usbiface === undefined)
            return undefined;
        const key = (0, adb_webusb_utils_1.usbDeviceToStr)(usbdev);
        this.removeTarget(key);
        // If the user re-pairs the same device, remove it from the list and keep
        // the new one.
        const newTarget = new adb_webusb_target_1.AdbWebusbTarget(usbiface, this.adbKeyMgr);
        this.targets.set(key, newTarget);
        this.onTargetsChanged.notify();
        return newTarget;
    }
    async *runPreflightChecks() {
        if (!(0, utils_1.exists)(navigator.usb)) {
            yield {
                name: 'WebUSB support',
                status: (0, result_1.errResult)(`Not supported`),
            };
        }
    }
    async refreshTargets() {
        let triggerOnTrgetsChanged = false;
        const usbDevices = await this.listUsbDevices();
        // Find and disconnected devices.
        for (const key of this.targets.keys()) {
            if (!usbDevices.has(key)) {
                // Entry disconnected.
                this.removeTarget(key);
                triggerOnTrgetsChanged = true;
            }
        }
        for (const [key, usbiface] of usbDevices.entries()) {
            if (this.targets.has(key))
                continue; // We already have this target.
            const newTarget = new adb_webusb_target_1.AdbWebusbTarget(usbiface, this.adbKeyMgr);
            this.targets.set(key, newTarget);
            triggerOnTrgetsChanged = true;
        }
        triggerOnTrgetsChanged && this.onTargetsChanged.notify();
    }
    removeTarget(key) {
        const target = this.targets.get(key);
        if (target === undefined)
            return;
        this.targets.delete(key);
        target.disconnect();
    }
    async listUsbDevices() {
        const devices = new Map();
        // NOTE: getDevices() only returns the previously paired devices. It will
        // not list connected devices that never got paired. In order to discover
        // those we need to call navigator.usb.requestDevices() which prompts the
        // "pair device" dialog. See pairNewTarget().
        for (const dev of await navigator.usb.getDevices()) {
            const usbiface = (0, adb_webusb_utils_1.getAdbWebUsbInterface)(dev);
            if (usbiface === undefined)
                continue;
            const key = (0, adb_webusb_utils_1.usbDeviceToStr)(dev);
            devices.set(key, usbiface);
        }
        return devices;
    }
}
exports.AdbWebusbTargetProvider = AdbWebusbTargetProvider;
//# sourceMappingURL=adb_webusb_target_provider.js.map