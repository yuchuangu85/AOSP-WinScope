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
    // This trace is quite large, bump the timeout up a little
    test_1.test.setTimeout(60_000);
    page = await browser.newPage();
    pth = new perfetto_ui_test_helper_1.PerfettoTestHelper(page);
    await pth.openTraceFile('ui-funcgraph.pftrace');
});
(0, test_1.test)('cpu funcgraph', async () => {
    const grp = pth.locateTrack('CPU');
    await grp.scrollIntoViewIfNeeded();
    await pth.toggleTrackGroup(grp);
    const funcgraphGrp = pth.locateTrack('CPU/Funcgraph', grp);
    await funcgraphGrp.scrollIntoViewIfNeeded();
    await pth.toggleTrackGroup(funcgraphGrp);
    const funcgraph = pth.locateTrack('CPU/Funcgraph/swapper4 -funcgraph', funcgraphGrp);
    await funcgraph.scrollIntoViewIfNeeded();
    await pth.waitForIdleAndScreenshot('cpu_funcgraph.png');
});
(0, test_1.test)('thread funcgraph', async () => {
    const grp = pth.locateTrack('iperf 3442');
    await grp.scrollIntoViewIfNeeded();
    await pth.toggleTrackGroup(grp);
    const funcgraph = pth.locateTrack('iperf 3442/Funcgraph (3450)', grp);
    await funcgraph.scrollIntoViewIfNeeded();
    await pth.waitForIdleAndScreenshot('thread_funcgraph.png');
});
//# sourceMappingURL=funcgraph_trace.test.js.map