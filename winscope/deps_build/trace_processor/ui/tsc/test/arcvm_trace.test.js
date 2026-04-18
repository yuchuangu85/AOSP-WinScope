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
const test_1 = require("@playwright/test");
const perfetto_ui_test_helper_1 = require("./perfetto_ui_test_helper");
test_1.test.describe.configure({ mode: 'serial' });
let pth;
let page;
test_1.test.beforeAll(async ({ browser }, _testInfo) => {
    page = await browser.newPage();
    pth = new perfetto_ui_test_helper_1.PerfettoTestHelper(page);
    await pth.openTraceFile('arcvm_trace.pb.gz');
});
(0, test_1.test)('sched_tracks', async () => {
    // Tests CPU number and machine labels of sched tracks.
    await pth.waitForIdleAndScreenshot('sched_tracks.png');
});
(0, test_1.test)('ftrace_events', async () => {
    // Tests CPU number and machine labels of ftrace tracks.
    await page
        .locator('.pf-middle-ellipsis-left')
        .getByText('Ftrace Events')
        .click();
    await pth.waitForIdleAndScreenshot('ftrace_events.png');
});
//# sourceMappingURL=arcvm_trace.test.js.map