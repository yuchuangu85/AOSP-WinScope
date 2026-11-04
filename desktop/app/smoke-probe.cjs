"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");
const { Menu, dialog } = require("electron");

// Hosted runners do not ship the development font stack, so glyph baselines and
// line heights differ from a developer workstation. The smoke lane asserts the
// pane-header layout contract at a font-tolerant tolerance instead of the
// pixel-exact workstation value.
const HEADER_LAYOUT = { minHeight: 30, maxHeight: 42, maxCenterOffset: 8 };

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
  const initialConfirmTraceReset = await evaluate(
    "localStorage.getItem('confirm-trace-reset') !== 'false'",
  );
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
    assert.equal(
      await evaluate(
        "document.querySelector('.confirm-trace-reset input[type=checkbox]').checked",
      ),
      await evaluate("localStorage.getItem('confirm-trace-reset') !== 'false'"),
      "General settings reflects the restored confirmation preference",
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
  await until(
    () => Menu.getApplicationMenu()?.getMenuItemById("open-file")?.enabled,
    "native File menu",
  );
  assert.equal(
    Menu.getApplicationMenu().getMenuItemById("open-file").accelerator,
    "CmdOrCtrl+O",
  );
  const initialRecentFiles =
    Menu.getApplicationMenu().getMenuItemById("open-recent").submenu.items
      .length;
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
      const bar=document.querySelector('.toolbar'),logo=bar.querySelector('.logo'),actions=bar.querySelector('.icon-actions'),file=bar.querySelector('.download-file-info');
      return {viewport:{width:innerWidth,height:innerHeight},bar:box(bar),logo:box(logo),actions:box(actions),drag:getComputedStyle(bar).webkitAppRegion,actionsDrag:getComputedStyle(actions).webkitAppRegion,
        fileCenterOffset:file?Math.abs((file.getBoundingClientRect().y+file.getBoundingClientRect().height/2)-(bar.getBoundingClientRect().y+bar.getBoundingClientRect().height/2)):null,
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
    if (metrics.fileCenterOffset !== null)
      assert.ok(
        metrics.fileCenterOffset < 1,
        `${label}: filename text is vertically centered`,
      );
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
      return {scale:${scale},viewportHeight:innerHeight,scrollHeight:document.documentElement.scrollHeight,footerBottom:footer.bottom,cards:[...document.querySelectorAll('.landing-grid .collect-card,.landing-grid .upload-card')].map(card=>({height:card.getBoundingClientRect().height,bottomGap:(footer.top-card.getBoundingClientRect().bottom)/zoom}))};
    })()`);
    // A host display smaller than the 1440x960 window (for example a 1024x768 CI
    // screen) cannot fit the home layout at every display scale. In that case the
    // footer moves below the fold and the page must scroll instead of clipping.
    const footerPinned =
      Math.abs(metrics.footerBottom - metrics.viewportHeight) < 1;
    if (footerPinned) {
      assert.equal(metrics.cards.length, 2);
      for (const card of metrics.cards) {
        assert.ok(card.height > 100);
        assert.ok(card.bottomGap >= -1 && card.bottomGap <= 12);
      }
    } else {
      assert.ok(
        metrics.footerBottom > metrics.viewportHeight,
        `homepage footer must be pinned or scrollable at ${scale}% zoom`,
      );
      assert.ok(
        metrics.scrollHeight > metrics.viewportHeight,
        `homepage must scroll when the footer is below the fold at ${scale}% zoom`,
      );
      assert.equal(metrics.cards.length, 2);
      for (const card of metrics.cards) assert.ok(card.height > 100);
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
  let resetConfirmationVerified = false;
  let nativeOpenVerified = false;
  let recentReopenVerified = false;
  const paneHeaderEvidence = [];
  const timelinePointerEvidence = [];
  const fixture = process.env.WINSCOPE_DESKTOP_SMOKE_TRACE;
  if (fixture) {
    contents.debugger.attach("1.3");
    try {
      await contents.debugger.sendCommand("DOM.enable");
      async function loadFixture() {
        if (!nativeOpenVerified) {
          const originalDialog = dialog.showOpenDialog;
          try {
            dialog.showOpenDialog = async () => ({
              canceled: false,
              filePaths: [fixture],
            });
            Menu.getApplicationMenu().getMenuItemById("open-file").click();
            await until(
              () =>
                evaluate(
                  "document.querySelector('.load-btn')?.disabled === false",
                ),
              "native file intake",
            );
          } finally {
            dialog.showOpenDialog = originalDialog;
          }
          await until(
            () =>
              Menu.getApplicationMenu().getMenuItemById("recent-file-0")
                ?.label === fixture,
            "successfully opened file becomes recent",
          );
          nativeOpenVerified = true;
        } else {
          const { root } =
            await contents.debugger.sendCommand("DOM.getDocument");
          const { nodeId } = await contents.debugger.sendCommand(
            "DOM.querySelector",
            { nodeId: root.nodeId, selector: "#fileDropRef" },
          );
          await contents.debugger.sendCommand("DOM.setFileInputFiles", {
            nodeId,
            files: [fixture],
          });
        }
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
      async function readTimelinePointer() {
        return evaluate(`(() => {
          const canvas=document.querySelector('#mini-timeline-canvas');
          const ctx=canvas.getContext('2d'),transform=ctx.getTransform();
          const rect=canvas.getBoundingClientRect();
          const width=canvas.width/transform.a,height=canvas.height/transform.d;
          const padding=Math.ceil(height/12);
          const slider=document.querySelector('#timeline-slider-box');
          const cursor=slider.querySelector('.cursor');
          const swatch=document.createElement('canvas');
          swatch.width=swatch.height=1;
          const colorContext=swatch.getContext('2d');
          const color=getComputedStyle(canvas).getPropertyValue('--active-pointer-color').trim();
          colorContext.fillStyle=color;
          colorContext.fillRect(0,0,1,1);
          const rgb=[...colorContext.getImageData(0,0,1,1).data].slice(0,3);
          // Only the opaque top triangle: trace entries start below this band,
          // and the hover line uses the same RGB but only 0.4 alpha.
          const scanY=Math.max(1,Math.floor(transform.d));
          const scanHeight=Math.max(1,Math.floor(height/24*transform.d));
          const pixels=ctx.getImageData(0,scanY,canvas.width,scanHeight).data;
          let first=canvas.width,last=-1,count=0;
          for(let y=0;y<scanHeight;y++) for(let x=0;x<canvas.width;x++) {
            const i=(y*canvas.width+x)*4;
            if(pixels[i+3]>=250 && rgb.every((value,c)=>Math.abs(pixels[i+c]-value)<=2)) {
              first=Math.min(first,x);last=Math.max(last,x);count++;
            }
          }
          return {rect:{x:rect.x,y:rect.y,width:rect.width,height:rect.height},
            width,height,padding,usableFrom:padding,usableTo:width-2*padding,
            devicePixelRatio,bitmapScale:{x:transform.a,y:transform.d},color,rgb,
            paintedLogicalX:last>=first?(first+last+1)/2/transform.a:null,
            markerPixels:count,markerBitmapColumns:last>=first?[first,last]:null,
            cursorFraction:parseFloat(cursor.style.left)/slider.offsetWidth,
            sliderWidth:slider.offsetWidth,sliderSelectionWidth:parseFloat(slider.querySelector('.slider').style.width),
            events:window.__winscopeSmokePointerEvents || []};
        })()`);
      }
      async function settleTimelinePointer() {
        await evaluate(
          "new Promise(resolve=>setTimeout(()=>requestAnimationFrame(()=>requestAnimationFrame(resolve)),150))",
        );
        return readTimelinePointer();
      }
      async function dispatchPointer(type, point, buttons = 0) {
        await contents.debugger.sendCommand("Input.dispatchMouseEvent", {
          type,
          x: point.x,
          y: point.y,
          button: type === "mouseMoved" ? "none" : "left",
          buttons,
          clickCount: type === "mouseMoved" ? 0 : 1,
        });
      }
      for (const scale of [80, 100, 140]) {
        await selectDisplayScale(scale);
        await evaluate("document.querySelector('#reset-zoom-btn').click()");
        const fullRange = await settleTimelinePointer();
        assert.ok(fullRange.width > 100 && fullRange.height > 24);
        assert.ok(
          Math.abs(fullRange.sliderSelectionWidth - fullRange.sliderWidth) < 1,
          "Pointer regression requires the full timeline range after reset",
        );
        await evaluate(`(() => {
          const canvas=document.querySelector('#mini-timeline-canvas');
          window.__winscopeSmokePointerEvents=[];
          window.__winscopeSmokePointerListener=event=>{
            window.__winscopeSmokePointerEvents.push({type:event.type,trusted:event.isTrusted,
              clientX:event.clientX,clientY:event.clientY,offsetX:event.offsetX,offsetY:event.offsetY,buttons:event.buttons});
          };
          for(const type of ['mousedown','mousemove','mouseup'])
            canvas.addEventListener(type,window.__winscopeSmokePointerListener,true);
        })()`);
        const evidence = { scale, fullRange, interactions: [] };
        timelinePointerEvidence.push(evidence);
        // The blank marker band selects an explicit timestamp, not a trace row:
        // no discrete-entry snapping is expected. Allow only coordinate rounding.
        const pointAt = (fraction) => ({
          x:
            fullRange.rect.x +
            ((fullRange.usableFrom +
              fraction * (fullRange.usableTo - fullRange.usableFrom)) /
              fullRange.width) *
              fullRange.rect.width,
          y: fullRange.rect.y + fullRange.rect.height / 24,
        });
        async function recordAlignment(kind, point, extra = {}) {
          const measured = await settleTimelinePointer();
          const logicalX =
            ((point.x - measured.rect.x) / measured.rect.width) *
            measured.width;
          const expectedFraction =
            (logicalX - measured.usableFrom) /
            (measured.usableTo - measured.usableFrom);
          const selectedLogicalX =
            measured.usableFrom +
            measured.cursorFraction * (measured.usableTo - measured.usableFrom);
          const paintedRenderedX =
            measured.rect.x +
            (measured.paintedLogicalX / measured.width) * measured.rect.width;
          const aligned =
            measured.paintedLogicalX !== null &&
            Math.abs(selectedLogicalX - logicalX) <= 2 &&
            Math.abs(paintedRenderedX - point.x) <= 2 &&
            Math.abs(measured.paintedLogicalX - selectedLogicalX) <= 2;
          evidence.interactions.push({
            kind,
            point,
            expectedFraction,
            selectedLogicalX,
            paintedRenderedX,
            aligned,
            ...extra,
            ...measured,
          });
          return measured;
        }
        try {
          for (const fraction of [0.25, 0.65, 0.85]) {
            await evaluate("window.__winscopeSmokePointerEvents=[]");
            const point = pointAt(fraction);
            await dispatchPointer("mouseMoved", point);
            await dispatchPointer("mousePressed", point, 1);
            await dispatchPointer("mouseReleased", point);
            await recordAlignment("click", point);
          }
          const beforeDrag = await readTimelinePointer();
          assert.notEqual(
            beforeDrag.paintedLogicalX,
            null,
            "Painted marker is visible",
          );
          const start = {
            x:
              beforeDrag.rect.x +
              (beforeDrag.paintedLogicalX / beforeDrag.width) *
                beforeDrag.rect.width,
            y: pointAt(0).y,
          };
          const target = pointAt(0.4);
          await evaluate("window.__winscopeSmokePointerEvents=[]");
          await dispatchPointer("mouseMoved", start);
          await dispatchPointer("mousePressed", start, 1);
          const grabbed = await evaluate(
            "document.querySelector('#mini-timeline-canvas').style.cursor === 'grabbing'",
          );
          for (const fraction of [0.25, 0.5, 0.75, 1])
            await dispatchPointer(
              "mouseMoved",
              {
                x: start.x + (target.x - start.x) * fraction,
                y: target.y,
              },
              1,
            );
          await dispatchPointer("mouseReleased", target);
          await recordAlignment("drag", target, { start, grabbed });
          await fs.writeFile(
            path.join(output, `timeline-pointer-scale-${scale}.png`),
            (await contents.capturePage()).toPNG(),
          );
        } finally {
          await evaluate(`(() => {
            const canvas=document.querySelector('#mini-timeline-canvas');
            for(const type of ['mousedown','mousemove','mouseup'])
              canvas.removeEventListener(type,window.__winscopeSmokePointerListener,true);
            delete window.__winscopeSmokePointerListener;
            delete window.__winscopeSmokePointerEvents;
          })()`);
        }
      }
      await fs.writeFile(
        path.join(output, "timeline-pointer-alignment.json"),
        JSON.stringify(timelinePointerEvidence, null, 2) + "\n",
      );
      for (const evidence of timelinePointerEvidence) {
        for (const interaction of evidence.interactions) {
          assert.ok(
            interaction.events.length > 0 &&
              interaction.events.every((event) => event.trusted) &&
              interaction.events.filter((event) => event.type === "mousedown")
                .length === 1 &&
              interaction.events.filter((event) => event.type === "mouseup")
                .length === 1 &&
              (interaction.kind !== "drag" ||
                interaction.events.filter(
                  (event) => event.type === "mousemove" && event.buttons === 1,
                ).length === 4),
            "CDP pointer events must reach the real canvas as trusted input",
          );
          assert.ok(
            interaction.aligned &&
              (interaction.kind !== "drag" || interaction.grabbed),
            `Timeline ${interaction.kind} alignment at ${evidence.scale}%: ${JSON.stringify(interaction)}`,
          );
        }
      }
      for (const locale of ["en", "zh-CN"]) {
        await selectInterfaceLanguage(locale);
        for (const scale of [80, 90, 100, 110, 120, 130, 140]) {
          await selectDisplayScale(scale);
          const metrics = await evaluate(`(() => {
            const zoom=Number(document.documentElement.style.zoom)||1;
            const selectors=['rects-view > .view-header > .title-section','hierarchy-view > .view-header > .title-section','surface-flinger-property-groups > .title-section'];
            return {locale:${JSON.stringify(locale)},scale:${scale},clientFontSize:parseFloat(getComputedStyle(document.querySelector('.toolbar .download-file-info')).fontSize),headers:selectors.map(selector=>{
              const header=document.querySelector('.viewers '+selector);
              if(!header) return {selector,missing:true};
              const box=header.getBoundingClientRect();
              return {selector,height:box.height/zoom,renderedHeight:box.height,items:[...header.querySelectorAll('.section-title,mat-icon,input')].filter(item=>item.getBoundingClientRect().height>0).map(item=>{const r=item.getBoundingClientRect(),style=getComputedStyle(item);const range=document.createRange();range.selectNodeContents(item);const text=range.getBoundingClientRect();return {kind:item.tagName,text:item.textContent.trim(),fontSize:parseFloat(style.fontSize),renderedWidth:r.width,renderedHeight:r.height,textHeight:text.height,centerOffset:Math.abs((r.top+r.height/2)-(box.top+box.height/2))/zoom};})};
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
            assert.ok(
              header.height >= HEADER_LAYOUT.minHeight &&
                header.height <= HEADER_LAYOUT.maxHeight,
            );
            for (const item of header.items) {
              if (item.kind === "SPAN")
                assert.equal(
                  item.fontSize,
                  metrics.clientFontSize,
                  "Pane title matches the client toolbar text size",
                );
              if (item.kind === "MAT-ICON") {
                assert.equal(
                  item.fontSize,
                  18,
                  "Pane icons use the compact toolbar size",
                );
                assert.ok(
                  Math.abs(item.renderedWidth - (18 * scale) / 100) < 1,
                  "Pane icon scales from 18px",
                );
              }
            }
            for (const item of header.items)
              assert.ok(
                item.centerOffset <= HEADER_LAYOUT.maxCenterOffset,
                JSON.stringify({ header: header.selector, item }),
              );
          }
          const baseline = paneHeaderEvidence.find(
            (entry) => entry.locale === locale,
          );
          if (baseline) {
            const ratio = scale / baseline.scale;
            for (const [index, header] of metrics.headers.entries()) {
              const reference = baseline.headers[index];
              assert.ok(
                Math.abs(
                  header.renderedHeight - reference.renderedHeight * ratio,
                ) < 1,
                "Viewer header follows display scale",
              );
              const items = header.items.filter(
                (item) => item.kind !== "INPUT",
              );
              const referenceItems = reference.items.filter(
                (item) => item.kind !== "INPUT",
              );
              assert.equal(items.length, referenceItems.length);
              for (const [itemIndex, item] of items.entries()) {
                const previous = referenceItems[itemIndex];
                assert.equal(item.text, previous.text);
                assert.ok(
                  Math.abs(
                    item.renderedHeight - previous.renderedHeight * ratio,
                  ) < 1,
                  "Viewer title and icon boxes follow display scale",
                );
                assert.ok(
                  Math.abs(
                    item.renderedWidth - previous.renderedWidth * ratio,
                  ) < 1,
                  "Viewer title and icon widths follow display scale",
                );
                assert.ok(
                  Math.abs(item.textHeight - previous.textHeight * ratio) < 2,
                  "Viewer title and icon glyphs follow display scale",
                );
              }
            }
          }
          paneHeaderEvidence.push(metrics);
          if ([80, 100, 140].includes(scale))
            await fs.writeFile(
              path.join(output, `pane-headers-${locale}-${scale}.png`),
              (await contents.capturePage()).toPNG(),
            );
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
      async function openResetConfirmation() {
        await evaluate(
          "document.querySelector('.reset-traces-button').click()",
        );
        await until(
          () => evaluate("document.querySelector('warning-dialog') !== null"),
          "reset confirmation",
        );
        await until(
          () =>
            evaluate(
              "document.activeElement?.matches('warning-dialog .warning-action-buttons button.not-last')",
            ),
          "Cancel receives initial focus",
        );
        assert.equal(
          await evaluate("document.querySelector('.viewers') !== null"),
          true,
          "Opening confirmation must not clear trace data",
        );
        const bounds = await evaluate(
          "(()=>{const r=document.querySelector('.cdk-overlay-pane:has(warning-dialog)').getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:innerWidth,height:innerHeight}})()",
        );
        assert.ok(
          bounds.left >= -1 &&
            bounds.right <= bounds.width + 1 &&
            bounds.top >= -1 &&
            bounds.bottom <= bounds.height + 1,
          JSON.stringify(bounds),
        );
      }
      async function closeResetConfirmation(confirm, doNotAskAgain) {
        await evaluate(`(() => {
          const dialog=document.querySelector('warning-dialog'),checkbox=dialog.querySelector('input[type=checkbox]');
          if(checkbox.checked!==${doNotAskAgain}) checkbox.click();
          dialog.querySelector(${JSON.stringify(confirm ? ".warning-action-buttons button:last-child" : ".warning-action-buttons button.not-last")}).click();
        })()`);
        await until(
          () => evaluate("document.querySelector('warning-dialog') === null"),
          "reset confirmation closes",
        );
      }
      async function waitForCollection() {
        await until(
          () =>
            evaluate(
              "document.querySelector('.landing-grid .collect-card') !== null && document.querySelector('.landing-grid .upload-card') !== null && document.querySelector('.viewers') === null && document.querySelector('timeline') === null && document.querySelector('.reset-traces-button').disabled && Math.abs(document.querySelector('.landing-status-bar').getBoundingClientRect().bottom-innerHeight)<1",
            ),
          "reset returns to empty collection workspace",
        );
      }
      async function setResetConfirmation(enabled) {
        await evaluate(
          "document.querySelector('.toolbar .settings-button').click()",
        );
        await until(
          () =>
            evaluate(
              "document.querySelector('.confirm-trace-reset input[type=checkbox]') !== null",
            ),
          "reset confirmation setting",
        );
        await evaluate(
          `(() => {const checkbox=document.querySelector('.confirm-trace-reset input[type=checkbox]');if(checkbox.checked!==${enabled}) checkbox.click();})()`,
        );
        await until(
          () =>
            evaluate(
              `localStorage.getItem('confirm-trace-reset') === '${enabled}'`,
            ),
          "confirmation preference persists",
        );
        await evaluate(
          "document.querySelector('.settings-close-button').click()",
        );
        await until(
          () => evaluate("document.querySelector('app-settings') === null"),
          "settings close",
        );
      }

      await selectDisplayScale(140);
      win.setContentSize(800, 600);
      await openResetConfirmation();
      await fs.writeFile(
        path.join(output, "reset-confirmation-scaled.png"),
        (await contents.capturePage()).toPNG(),
      );
      await closeResetConfirmation(false, true);
      assert.equal(
        await evaluate(
          "document.querySelector('.viewers') !== null && localStorage.getItem('confirm-trace-reset') !== 'false'",
        ),
        true,
        "Cancel must not suppress future confirmation",
      );
      win.setContentSize(1440, 960);
      await selectDisplayScale(100);
      await openResetConfirmation();
      await contents.debugger.sendCommand("Input.dispatchKeyEvent", {
        type: "keyDown",
        key: "Escape",
        code: "Escape",
        windowsVirtualKeyCode: 27,
      });
      await contents.debugger.sendCommand("Input.dispatchKeyEvent", {
        type: "keyUp",
        key: "Escape",
        code: "Escape",
        windowsVirtualKeyCode: 27,
      });
      await until(
        () =>
          evaluate(
            "document.querySelector('warning-dialog') === null && document.querySelector('.viewers') !== null",
          ),
        "Escape cancels without clearing data",
      );
      await openResetConfirmation();
      await closeResetConfirmation(true, true);
      await waitForCollection();
      assert.equal(
        await evaluate("localStorage.getItem('confirm-trace-reset')"),
        "false",
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
      await evaluate("document.querySelector('.reset-traces-button').click()");
      await waitForCollection();
      assert.equal(
        await evaluate("document.querySelector('warning-dialog') === null"),
        true,
        "Do not ask again bypasses the dialog",
      );
      await setResetConfirmation(true);
      await loadFixture();
      await openResetConfirmation();
      await closeResetConfirmation(false, false);
      assert.equal(
        await evaluate("document.querySelector('.viewers') !== null"),
        true,
      );
      await setResetConfirmation(false);
      resetConfirmationVerified = true;
    } finally {
      contents.debugger.detach();
    }
  } else if (initialRecentFiles > 0) {
    Menu.getApplicationMenu().getMenuItemById("recent-file-0").click();
    await until(
      () => evaluate("document.querySelector('.load-btn')?.disabled === false"),
      "reopen persisted recent file",
    );
    await evaluate("document.querySelector('.load-btn').click()");
    await until(
      () =>
        evaluate(
          "document.querySelector('.viewers .trace-view-content')?.children.length > 0",
        ),
      "recent trace viewer",
    );
    recentReopenVerified = true;
    await evaluate("document.querySelector('.reset-traces-button').click()");
    await until(
      () =>
        evaluate(
          "document.querySelector('.landing-grid') !== null && document.querySelector('.viewers') === null",
        ),
      "collection after recent trace",
    );
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
    initialConfirmTraceReset,
    displayScale: 80,
    homepageScaleEvidence,
    paneHeaderEvidence,
    timelinePointerEvidence,
    traceResetVerified,
    resetConfirmationVerified,
    initialRecentFiles,
    nativeOpenVerified,
    recentReopenVerified,
    aiOrigin: services.aiOrigin,
    launcherPid: services.launcherPid,
    aiPid: services.aiPid,
    checks: [
      "single-custom-title-bar-and-native-file-menu",
      ...(nativeOpenVerified
        ? ["native-file-open-through-parser-and-recent-record"]
        : []),
      ...(recentReopenVerified
        ? ["persisted-recent-file-reopen-through-parser"]
        : []),
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
      ...(timelinePointerEvidence.length
        ? ["timeline-click-drag-alignment-at-display-scales"]
        : []),
      ...(traceResetVerified
        ? [
            "toolbar-reset-and-reload-trace",
            "pane-header-equal-height-and-vertical-centering",
            "viewer-title-and-icon-rendered-size-follows-all-display-presets",
          ]
        : []),
      ...(resetConfirmationVerified
        ? ["reset-confirm-cancel-escape-suppress-and-restore"]
        : []),
    ],
    devicesDetected: devices.value.length,
  };
  await fs.writeFile(
    path.join(output, "titlebar-layout.json"),
    JSON.stringify(
      {
        nativeFileMenu: true,
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
