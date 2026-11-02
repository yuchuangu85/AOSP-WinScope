"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");
const { Menu } = require("electron");

async function until(read, label) {
  const deadline = Date.now() + 60000;
  while (Date.now() < deadline) {
    const value = await read();
    if (value) return value;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Desktop smoke timed out: ${label}`);
}

async function run({ app, getWindow, services }) {
  const win = getWindow();
  const contents = win.webContents;
  const evaluate = (expression) => contents.executeJavaScript(expression, true);
  const output = process.env.WINSCOPE_DESKTOP_SMOKE;
  await fs.mkdir(output, { recursive: true });
  await until(
    () =>
      evaluate(
        "document.querySelector('.landing-status-bar .welcome-info') !== null",
      ),
    "homepage",
  );
  const initialLanguage = await evaluate("document.documentElement.lang");
  const initialLanguagePreference = await evaluate(
    "localStorage.getItem('language') || 'system'",
  );
  const systemLanguage = await evaluate(
    "navigator.languages.find(locale=>/^(en|zh)(-|$)/i.test(locale))?.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en'",
  );
  async function selectInterfaceLanguage(preference) {
    await evaluate(
      "document.querySelector('.toolbar .settings-button').click()",
    );
    await until(
      () =>
        evaluate(
          "document.querySelector('.interface-language-select') !== null",
        ),
      "language preferences",
    );
    assert.deepEqual(
      await evaluate(
        "[...document.querySelector('.interface-language-select').options].map(option=>option.value)",
      ),
      ["system", "en", "zh-CN"],
    );
    await evaluate(`(() => {
      const select=document.querySelector('.interface-language-select');
      select.value=${JSON.stringify(preference)};
      select.dispatchEvent(new Event('change',{bubbles:true}));
      document.querySelector('.settings-close-button').click();
    })()`);
    await until(
      () =>
        evaluate(
          `document.documentElement.lang === ${JSON.stringify(preference === "system" ? systemLanguage : preference)} && document.querySelector('app-settings') === null`,
        ),
      "resolved interface language",
    );
  }
  const initialDisplayScale = await evaluate(
    "Math.round((Number(document.documentElement.style.zoom) || 1) * 100)",
  );
  async function selectDisplayScale(scale) {
    await evaluate(
      "document.querySelector('.toolbar .settings-button').click()",
    );
    await until(
      () =>
        evaluate("document.querySelector('.display-scale-select') !== null"),
      "display-size presets",
    );
    const presets = await evaluate(
      "[...document.querySelector('.display-scale-select').options].map(option=>option.textContent.trim())",
    );
    assert.deepEqual(presets, [
      "80%",
      "90%",
      "100%",
      "110%",
      "120%",
      "130%",
      "140%",
    ]);
    await evaluate(`(() => {
      const select=document.querySelector('.display-scale-select');
      select.selectedIndex=[...select.options].findIndex(option=>option.textContent.trim()===${JSON.stringify(`${scale}%`)});
      select.dispatchEvent(new Event('change',{bubbles:true}));
      document.querySelector('.settings-close-button').click();
    })()`);
    await until(
      () =>
        evaluate(
          `Number(document.documentElement.style.zoom) === ${scale / 100} && document.querySelector('app-settings') === null`,
        ),
      "display-size application",
    );
    await evaluate(
      "new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))",
    );
  }
  // Keep the existing fixed-size chrome checks independent of the saved scale.
  if (initialDisplayScale !== 100) await selectDisplayScale(100);
  assert.equal(
    Menu.getApplicationMenu(),
    null,
    "The former application menu must be removed",
  );
  await until(
    () =>
      evaluate(
        `document.documentElement.dataset.winscopeDesktop === ${JSON.stringify(process.platform)}`,
      ),
    "desktop title bar marker",
  );
  const chromeEvidence = [];
  async function checkTitleBar(label) {
    const metrics = await evaluate(`(() => {
      const box = e => {const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom};};
      const bar=document.querySelector('.toolbar'),logo=bar.querySelector('.logo'),actions=bar.querySelector('.icon-actions');
      return {viewport:{width:innerWidth,height:innerHeight},bar:box(bar),logo:box(logo),actions:box(actions),drag:getComputedStyle(bar).webkitAppRegion,actionsDrag:getComputedStyle(actions).webkitAppRegion,
        buttons:[...bar.querySelectorAll('button')].filter(e=>e.getClientRects().length).map(e=>({name:e.className,...box(e),drag:getComputedStyle(e).webkitAppRegion}))};
    })()`);
    assert.equal(
      metrics.bar.y,
      0,
      `${label}: toolbar begins at the window top`,
    );
    assert.equal(
      metrics.bar.height,
      32,
      `${label}: exactly one 32px title bar`,
    );
    assert.equal(metrics.drag, "drag");
    assert.equal(metrics.actionsDrag, "no-drag");
    if (process.platform === "darwin")
      assert.ok(
        metrics.logo.x >= 88,
        `${label}: native traffic-light space is reserved`,
      );
    for (const button of metrics.buttons) {
      assert.equal(button.drag, "no-drag");
      assert.ok(
        button.x >= metrics.logo.right &&
          button.right <= metrics.viewport.width,
        `${label}: toolbar button fits without covering window controls`,
      );
      assert.ok(
        button.y >= 0 && button.bottom <= 32,
        `${label}: button stays inside the title bar`,
      );
    }
    chromeEvidence.push({ label, ...metrics });
    await fs.writeFile(
      path.join(output, `titlebar-${label}.png`),
      (await contents.capturePage()).toPNG(),
    );
  }
  await checkTitleBar("home-wide");
  if (process.platform === "darwin")
    assert.deepEqual(win.getWindowButtonPosition(), { x: 12, y: 9 });
  const isolation = await evaluate(
    `({node:typeof window.require,process:typeof window.process,bridge:typeof window.electron,frames:window.frames.length})`,
  );
  assert.equal(isolation.node, "undefined");
  assert.equal(isolation.process, "undefined");
  assert.equal(isolation.bridge, "undefined");
  const preferences = contents.getLastWebPreferences();
  assert.equal(preferences.nodeIntegration, false);
  assert.equal(preferences.sandbox, true);
  assert.equal(preferences.contextIsolation, true);
  assert.equal(preferences.webSecurity, true);
  const config = await evaluate(
    "fetch('./runtime-config.json').then(r=>r.json())",
  );
  assert.equal(config.capture.provider, "loopback-proxy-v1");
  assert.equal(config.ai.provider, "loopback-ai-v1");
  const devices = await evaluate(
    "fetch('./capture/devices/').then(async r=>({status:r.status,value:await r.json()}))",
  );
  assert.equal(devices.status, 200);
  assert.ok(Array.isArray(devices.value));
  const agents = await evaluate(
    "fetch('./ai/api/agents').then(async r=>({status:r.status,value:await r.json()}))",
  );
  assert.equal(agents.status, 200);
  assert.ok(agents.value.agents.length > 0);
  const point = await evaluate(
    "(() => {const r=document.querySelector('.toolbar .settings-button').getBoundingClientRect();return {x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)};})()",
  );
  contents.sendInputEvent({
    type: "mouseDown",
    ...point,
    button: "left",
    clickCount: 1,
  });
  contents.sendInputEvent({
    type: "mouseUp",
    ...point,
    button: "left",
    clickCount: 1,
  });
  await until(
    () =>
      evaluate("document.querySelector('.interface-language-select') !== null"),
    "settings",
  );
  for (const theme of ["light", "dark"]) {
    await evaluate(
      `(() => {const e=document.querySelector('.theme-mode-select');e.value=${JSON.stringify(theme)};e.dispatchEvent(new Event('change',{bubbles:true}));document.querySelector('.settings-close-button').click();})()`,
    );
    await until(
      () =>
        evaluate(
          `document.body.classList.contains('dark-mode') === ${theme === "dark"}`,
        ),
      `${theme} theme`,
    );
    win.setContentSize(800, 600);
    await evaluate(
      "new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))",
    );
    await checkTitleBar(`home-compact-${theme}`);
    win.setContentSize(1440, 960);
    await evaluate(
      "document.querySelector('.toolbar .settings-button').click()",
    );
    await until(
      () =>
        evaluate(
          "document.querySelector('.interface-language-select') !== null",
        ),
      "settings reopen",
    );
  }
  await evaluate(
    `(() => {const e=document.querySelector('.interface-language-select');e.value='zh-CN';e.dispatchEvent(new Event('change',{bubbles:true}));document.querySelector('.settings-close-button').click();})()`,
  );
  await until(
    () => evaluate("document.documentElement.lang === 'zh-CN'"),
    "language",
  );
  await evaluate("document.querySelector('.ai-open-button').click()");
  await until(
    () => evaluate("document.querySelector('.composer-input') !== null"),
    "integrated AI workspace",
  );
  await evaluate(
    "document.querySelector('.ai-panel-header > button:last-child').click()",
  );
  await until(
    () => evaluate("document.querySelector('ai-panel') === null"),
    "AI workspace closed",
  );
  const screenshot = await contents.capturePage();
  await fs.writeFile(
    path.join(output, "desktop-homepage.png"),
    screenshot.toPNG(),
  );

  const homepageScaleEvidence = [];
  for (const scale of [80, 100, 140]) {
    await selectDisplayScale(scale);
    const metrics = await evaluate(`(() => {
      const footer=document.querySelector('.landing-status-bar').getBoundingClientRect();
      const zoom=Number(document.documentElement.style.zoom)||1;
      return {scale:${scale},viewportHeight:innerHeight,footerBottom:footer.bottom,cards:[...document.querySelectorAll('.landing-grid .collect-card,.landing-grid .upload-card')].map(card=>({height:card.getBoundingClientRect().height,bottomGap:(footer.top-card.getBoundingClientRect().bottom)/zoom}))};
    })()`);
    assert.ok(Math.abs(metrics.footerBottom - metrics.viewportHeight) < 1);
    assert.equal(metrics.cards.length, 2);
    for (const card of metrics.cards) {
      assert.ok(card.height > 100);
      assert.ok(card.bottomGap >= -1 && card.bottomGap <= 12);
    }
    homepageScaleEvidence.push(metrics);
    await fs.writeFile(
      path.join(output, `homepage-scale-${scale}.png`),
      (await contents.capturePage()).toPNG(),
    );
  }
  await selectDisplayScale(100);

  let traceLoaded = false;
  let traceResetVerified = false;
  const paneHeaderEvidence = [];
  const fixture = process.env.WINSCOPE_DESKTOP_SMOKE_TRACE;
  if (fixture) {
    contents.debugger.attach("1.3");
    try {
      await contents.debugger.sendCommand("DOM.enable");
      async function loadFixture() {
        const { root } = await contents.debugger.sendCommand("DOM.getDocument");
        const { nodeId } = await contents.debugger.sendCommand(
          "DOM.querySelector",
          { nodeId: root.nodeId, selector: "#fileDropRef" },
        );
        await contents.debugger.sendCommand("DOM.setFileInputFiles", {
          nodeId,
          files: [fixture],
        });
        await until(
          () =>
            evaluate("document.querySelector('.load-btn')?.disabled === false"),
          "trace upload",
        );
        await evaluate("document.querySelector('.load-btn').click()");
        await until(
          () =>
            evaluate(
              "document.querySelector('.viewers .trace-view-content')?.children.length > 0 && document.querySelector('.tabs-navigation-bar .tab-title') !== null",
            ),
          "trace viewer",
        );
      }
      await loadFixture();
      traceLoaded = true;
      for (const locale of ["en", "zh-CN"]) {
        await selectInterfaceLanguage(locale);
        for (const scale of [80, 100, 140]) {
          await selectDisplayScale(scale);
          const metrics = await evaluate(`(() => {
            const zoom=Number(document.documentElement.style.zoom)||1;
            const selectors=['rects-view > .view-header > .title-section','hierarchy-view > .view-header > .title-section','surface-flinger-property-groups > .title-section'];
            return {locale:${JSON.stringify(locale)},scale:${scale},headers:selectors.map(selector=>{
              const header=document.querySelector('.viewers '+selector);
              if(!header) return {selector,missing:true};
              const box=header.getBoundingClientRect();
              return {selector,height:box.height/zoom,items:[...header.querySelectorAll('.section-title,mat-icon,input')].filter(item=>item.getBoundingClientRect().height>0).map(item=>{const r=item.getBoundingClientRect();return {kind:item.tagName,centerOffset:Math.abs((r.top+r.height/2)-(box.top+box.height/2))/zoom};})};
            })};
          })()`);
          assert.equal(
            metrics.headers.some((header) => header.missing),
            false,
          );
          const heights = metrics.headers.map((header) => header.height);
          assert.ok(
            Math.max(...heights) - Math.min(...heights) < 1,
            JSON.stringify(metrics),
          );
          for (const header of metrics.headers) {
            assert.ok(header.height >= 32 && header.height <= 40);
            for (const item of header.items)
              assert.ok(
                item.centerOffset <= 1.5,
                JSON.stringify({ header: header.selector, item }),
              );
          }
          paneHeaderEvidence.push(metrics);
          if (scale === 100)
            await fs.writeFile(
              path.join(output, `pane-headers-${locale}.png`),
              (await contents.capturePage()).toPNG(),
            );
        }
      }
      await selectDisplayScale(100);
      win.setContentSize(800, 600);
      await evaluate(
        "new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))",
      );
      await checkTitleBar("trace-compact");
      win.setContentSize(1440, 960);
      await fs.writeFile(
        path.join(output, "desktop-trace.png"),
        (await contents.capturePage()).toPNG(),
      );
      const preferencesBeforeReset = await evaluate(
        "['language','theme-mode','display-scale'].map(key=>localStorage.getItem(key))",
      );
      assert.equal(
        await evaluate(
          "document.querySelector('.reset-traces-button').disabled",
        ),
        false,
      );
      await evaluate("document.querySelector('.reset-traces-button').click()");
      await until(
        () =>
          evaluate(
            "document.querySelector('.landing-grid .collect-card') !== null && document.querySelector('.landing-grid .upload-card') !== null && document.querySelector('.viewers') === null && document.querySelector('timeline') === null && document.querySelector('.reset-traces-button').disabled",
          ),
        "reset returns to empty collection workspace",
      );
      assert.deepEqual(
        await evaluate(
          "['language','theme-mode','display-scale'].map(key=>localStorage.getItem(key))",
        ),
        preferencesBeforeReset,
      );
      assert.equal(
        await evaluate("document.querySelector('#fileDropRef').files.length"),
        0,
      );
      await fs.writeFile(
        path.join(output, "desktop-after-reset.png"),
        (await contents.capturePage()).toPNG(),
      );
      traceResetVerified = true;
      await loadFixture();
    } finally {
      contents.debugger.detach();
    }
  }
  await selectDisplayScale(80);
  await selectInterfaceLanguage("system");
  await new Promise((resolve) => setTimeout(resolve, 1200));
  const result = {
    ok: true,
    packaged: app.isPackaged,
    appVersion: app.getVersion(),
    electron: process.versions.electron,
    node: process.versions.node,
    platform: process.platform,
    arch: process.arch,
    origin: services.origin,
    initialLanguage,
    initialLanguagePreference,
    systemLanguage,
    initialDisplayScale,
    displayScale: 80,
    homepageScaleEvidence,
    paneHeaderEvidence,
    traceResetVerified,
    aiOrigin: services.aiOrigin,
    launcherPid: services.launcherPid,
    aiPid: services.aiPid,
    checks: [
      "single-custom-title-bar-and-no-native-menu",
      "drag-regions-and-caption-safe-area",
      "compact-titlebar-light-dark",
      "sandboxed-renderer",
      "bundled-capture",
      "bundled-AI",
      "settings-language",
      "system-language-preference",
      "display-scale-presets-and-fixed-homepage-gap",
      "AI-workspace",
      ...(traceLoaded ? ["real-perfetto-trace-upload-and-view"] : []),
      ...(traceResetVerified
        ? [
            "toolbar-reset-and-reload-trace",
            "pane-header-equal-height-and-vertical-centering",
          ]
        : []),
    ],
    devicesDetected: devices.value.length,
  };
  await fs.writeFile(
    path.join(output, "titlebar-layout.json"),
    JSON.stringify(
      {
        menuRemoved: true,
        platform: process.platform,
        measurements: chromeEvidence,
      },
      null,
      2,
    ) + "\n",
  );
  await fs.writeFile(
    path.join(output, "result.json"),
    JSON.stringify(result, null, 2) + "\n",
  );
}

module.exports = { run };
