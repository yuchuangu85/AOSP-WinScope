"use strict";
// Copyright (C) 2021 The Android Open Source Project
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
exports.PerfettoTestHelper = void 0;
const tslib_1 = require("tslib");
const test_1 = require("@playwright/test");
const fs_1 = tslib_1.__importDefault(require("fs"));
const path_1 = tslib_1.__importDefault(require("path"));
const logging_1 = require("../base/logging");
// Define the locators for elements you always want to mask.
const GLOBAL_MASKS = [
    // Hide the footer when running integration tests, as the version code and the
    // tiny text with pending queries can fail the screenshot diff test.
    (page) => page.locator('.pf-sidebar__footer'),
];
class PerfettoTestHelper {
    page;
    cachedSidebarSize;
    constructor(page) {
        this.page = page;
    }
    resetFocus() {
        return this.page.click('.pf-sidebar img.pf-sidebar__brand');
    }
    async sidebarSize() {
        if (this.cachedSidebarSize === undefined) {
            const size = await this.page.locator('main > .pf-sidebar').boundingBox();
            this.cachedSidebarSize = (0, logging_1.assertExists)(size);
        }
        return this.cachedSidebarSize;
    }
    async navigate(fragment) {
        await this.page.goto('/?testing=1' + fragment);
        await this.waitForPerfettoIdle();
        await this.page.click('body');
    }
    async openTraceFile(traceName, args) {
        args = { testing: '1', ...args };
        const qs = Object.entries(args ?? {})
            .map(([k, v]) => `${k}=${v}`)
            .join('&');
        await this.page.goto('/?' + qs);
        const file = await this.page.waitForSelector('input.trace_file', {
            state: 'attached',
        });
        await this.page.evaluate(() => localStorage.setItem('dismissedPanningHint', 'true'));
        const tracePath = this.getTestTracePath(traceName);
        (0, logging_1.assertExists)(file).setInputFiles(tracePath);
        await this.waitForPerfettoIdle();
        await this.page.mouse.move(0, 0);
    }
    waitForPerfettoIdle(idleHysteresisMs) {
        return this.page.evaluate(async (ms) => window.waitForPerfettoIdle(ms), idleHysteresisMs);
    }
    async waitForIdleAndScreenshot(screenshotName, opts) {
        await this.page.mouse.move(0, 0); // Move mouse out of the way.
        await this.waitForPerfettoIdle();
        // Get instances of the global locators for the current page.
        const globalMaskLocators = GLOBAL_MASKS.map((getLocator) => getLocator(this.page));
        // Combine global masks with any masks specific to this test call.
        const allMasks = [...globalMaskLocators, ...(opts?.mask || [])];
        // Call the original expect with the combined masks.
        await test_1.expect.soft(this.page).toHaveScreenshot(screenshotName, {
            ...opts,
            mask: allMasks,
        });
    }
    async toggleTrackGroup(locator) {
        await locator.locator('.pf-track__shell').first().click();
        await this.waitForPerfettoIdle();
    }
    locateTrack(name, trackGroup) {
        return (trackGroup ?? this.page).locator(`.pf-track[ref="${name}"]`);
    }
    pinTrackUsingShellBtn(track) {
        track.locator('button[title="Pin to top"]').click({ force: true });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async runCommand(cmdId, ...args) {
        await this.page.evaluate((arg) => self.app.commands.runCommand(arg.cmdId, ...arg.args), { cmdId, args });
    }
    async searchSlice(name) {
        const omnibox = this.page.locator('input[ref=omnibox]');
        await omnibox.focus();
        await omnibox.fill(name);
        await this.waitForPerfettoIdle();
        await omnibox.press('Enter');
        await this.waitForPerfettoIdle();
    }
    getTestTracePath(fname) {
        const parts = ['test', 'data', fname];
        if (process.cwd().endsWith('/ui')) {
            parts.unshift('..');
        }
        const fPath = path_1.default.join(...parts);
        if (!fs_1.default.existsSync(fPath)) {
            throw new Error(`Could not locate file ${fPath}, cwd=${process.cwd()}`);
        }
        return fPath;
    }
    async clickMenuItem(text) {
        await this.page
            .locator('.pf-popup-content .pf-menu-item', { hasText: text })
            .click();
    }
    async switchToTab(text) {
        await this.page.locator('.pf-split-panel__tab', { hasText: text }).click();
    }
    async scheduleFullRedraw() {
        await this.page.evaluate(() => self.app.raf.scheduleFullRedraw());
    }
}
exports.PerfettoTestHelper = PerfettoTestHelper;
//# sourceMappingURL=perfetto_ui_test_helper.js.map