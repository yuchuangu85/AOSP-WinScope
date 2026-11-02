import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { createServer } from "node:net";
import {
  cp,
  chmod,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  writeFile,
} from "node:fs/promises";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";

// Real production bundle + real Go launcher + real gateway. The model is a
// deterministic local subprocess so this test never needs credentials/network.
const root = resolve(new URL("..", import.meta.url).pathname);
const work = await mkdtemp(join(tmpdir(), "winscope-ai-browser-"));
const webRoot = join(work, "web");
const evidenceDir = join(root, "dist/validation");
let ai, launcher, browser, socket;
let nextCommand = 1;
const pending = new Map();
const runtimeErrors = [];
async function waitUntil(predicate, label, timeout = 20_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    try {
      const value = await predicate();
      if (value) return value;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Timeout: ${label}`);
}
async function command(executable, args) {
  const child = spawn(executable, args, {
    cwd: root,
    stdio: ["ignore", "pipe", "pipe"],
  });
  let output = "";
  child.stdout.on("data", (data) => {
    output += data;
  });
  child.stderr.on("data", (data) => {
    output += data;
  });
  await new Promise((resolve, reject) => {
    child.on("error", reject);
    child.on("close", (code) =>
      code === 0 ? resolve() : reject(new Error(output)),
    );
  });
}
async function availablePort() {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const port = server.address().port;
  await new Promise((resolve) => server.close(resolve));
  return port;
}
function cdp(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = nextCommand++;
    const timer = setTimeout(() => {
      pending.delete(id);
      reject(new Error(`CDP timeout: ${method}`));
    }, 20_000);
    pending.set(id, { resolve, reject, timer });
    socket.send(JSON.stringify({ id, method, params }));
  });
}
async function evaluate(expression) {
  const result = await cdp("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (result.exceptionDetails)
    throw new Error(JSON.stringify(result.exceptionDetails));
  return result.result?.value;
}
const condition = (expression) =>
  waitUntil(() => evaluate(expression), expression);
const click = (selector) =>
  evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
async function typeMessage(text) {
  await evaluate(
    `(() => {const input = document.querySelector('.composer-input'); input.focus(); input.value = ${JSON.stringify(text)}; input.dispatchEvent(new Event('input', {bubbles:true}));})()`,
  );
}
async function chooseProviderField(provider, field, value) {
  const selector = `.provider-settings[data-provider="${provider}"] [data-field="${field}"]`;
  await condition(
    `document.querySelector(${JSON.stringify(selector)}) !== null`,
  );
  await evaluate(`(() => {
    const control=document.querySelector(${JSON.stringify(selector)});
    control.value=${JSON.stringify(value)};
    control.dispatchEvent(new Event(control.tagName==='SELECT'?'change':'input',{bubbles:true}));
  })()`);
}
async function screenshot(name) {
  const result = await cdp("Page.captureScreenshot", { format: "png" });
  await writeFile(join(evidenceDir, name), Buffer.from(result.data, "base64"));
}
const languageBrowserEvidence = [];
async function selectInterfaceLanguage(selector, value) {
  await evaluate(`(() => {
    const select=document.querySelector(${JSON.stringify(selector)});
    if(!select) throw new Error('Interface language selector is unavailable');
    select.value=${JSON.stringify(value)};
    select.dispatchEvent(new Event('change',{bubbles:true}));
  })()`);
  await condition(`document.documentElement.lang === ${JSON.stringify(value)}`);
}
async function chooseThemeMode(mode) {
  await evaluate(`(() => {
    const select=document.querySelector('.theme-mode-select');
    if(!select || select.disabled) throw new Error('Color theme selector is unavailable');
    select.value=${JSON.stringify(mode)};
    select.dispatchEvent(new Event('change',{bubbles:true}));
  })()`);
  await condition(
    `document.querySelector('.theme-mode-select')?.value === ${JSON.stringify(mode)}`,
  );
}
async function emulateColorScheme(scheme) {
  await cdp("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-color-scheme", value: scheme }],
  });
  await condition(
    `matchMedia('(prefers-color-scheme: dark)').matches === ${scheme === "dark"}`,
  );
  // Let media-query change events and Angular rendering finish before asserting.
  await evaluate(
    "new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve())))",
  );
}
async function themeSettingsRegression() {
  assert.equal(
    await evaluate(
      "document.querySelector('.toolbar button.dark-mode') === null",
    ),
    true,
    "Theme controls are available only in Settings > General",
  );
  languageBrowserEvidence.push({ check: "toolbar-theme-button-removed" });
  assert.deepEqual(
    await evaluate(
      "Array.from(document.querySelector('.theme-mode-select').options,option=>option.value)",
    ),
    ["system", "dark", "light"],
  );
  assert.deepEqual(
    await evaluate(
      "['.interface-language-select','.theme-mode-select'].map(selector=>document.querySelector(selector).getBoundingClientRect().height)",
    ),
    [32, 32],
  );
  await chooseThemeMode("system");
  for (const scheme of ["light", "dark", "light"]) {
    await emulateColorScheme(scheme);
    await condition(
      `document.body.classList.contains('dark-mode') === ${scheme === "dark"}`,
    );
    assert.equal(
      await evaluate("localStorage.getItem('theme-mode')"),
      "system",
    );
    assert.equal(
      await evaluate("localStorage.getItem('dark-mode')"),
      String(scheme === "dark"),
    );
    if (scheme === "dark") await screenshot("settings-general-system-dark.png");
  }
  languageBrowserEvidence.push({
    check: "theme-system-live-follow",
    schemes: ["light", "dark", "light"],
  });

  for (const mode of ["dark", "light"]) {
    const dark = mode === "dark";
    await chooseThemeMode(mode);
    await condition(
      `document.body.classList.contains('dark-mode') === ${dark}`,
    );
    for (const scheme of [mode, dark ? "light" : "dark"]) {
      await emulateColorScheme(scheme);
      assert.equal(
        await evaluate("document.body.classList.contains('dark-mode')"),
        dark,
        "An explicit theme ignores system color-scheme changes",
      );
    }
    await evaluate("window.__themeBeforeReload = true");
    await cdp("Page.reload");
    await condition(
      "window.__themeBeforeReload === undefined && document.querySelector('.toolbar .settings-button') !== null",
    );
    await condition(
      `document.body.classList.contains('dark-mode') === ${dark}`,
    );
    await click(".toolbar .settings-button");
    await condition(
      `document.querySelector('.theme-mode-select')?.value === ${JSON.stringify(mode)}`,
    );
    assert.equal(await evaluate("localStorage.getItem('theme-mode')"), mode);
    assert.equal(
      await evaluate("localStorage.getItem('dark-mode')"),
      String(dark),
    );
    if (mode === "light") await screenshot("settings-general-light.png");
  }
  languageBrowserEvidence.push({
    check: "theme-explicit-override-and-reload",
    modes: ["dark", "light"],
  });

  await chooseThemeMode("system");
  await cdp("Emulation.setEmulatedMedia", { media: "", features: [] });
  await condition(
    "document.body.classList.contains('dark-mode') === matchMedia('(prefers-color-scheme: dark)').matches",
  );
  assert.equal(await evaluate("localStorage.getItem('theme-mode')"), "system");
}
let generalSettingsChecked = false;
async function selectLandingLanguage(value) {
  await click(".toolbar .settings-button");
  await condition(
    "document.querySelector('.interface-language-select') !== null",
  );
  assert.equal(
    await evaluate("document.querySelector('.toolbar select') === null"),
    true,
  );
  assert.equal(
    await evaluate("document.querySelector('ai-panel') === null"),
    true,
  );
  if (!generalSettingsChecked) {
    await click('.settings-menu [data-section="general"]');
    await evaluate(
      "document.querySelector('.settings-menu [data-section=\"general\"]').focus()",
    );
    for (const [key, code, section] of [
      ["ArrowDown", 40, "ai"],
      ["ArrowUp", 38, "general"],
    ]) {
      await cdp("Input.dispatchKeyEvent", {
        type: "keyDown",
        key,
        code: key,
        windowsVirtualKeyCode: code,
      });
      await cdp("Input.dispatchKeyEvent", {
        type: "keyUp",
        key,
        code: key,
        windowsVirtualKeyCode: code,
      });
      await condition(
        `document.querySelector('.settings-menu [data-section="${section}"]')?.getAttribute('aria-selected') === 'true'`,
      );
    }
    await themeSettingsRegression();
    await screenshot("settings-general-desktop.png");
    generalSettingsChecked = true;
  }
  await selectInterfaceLanguage(".interface-language-select", value);
  await click(".settings-close-button");
  await condition("document.querySelector('app-settings') === null");
}
async function languageLandingRegression() {
  await condition(
    "document.querySelector('.toolbar .settings-button') !== null",
  );
  assert.equal(
    await evaluate(
      "document.querySelector('.toolbar .language-selector') === null",
    ),
    true,
  );
  // Native stable selectors keep this test independent of the host browser locale.
  await selectLandingLanguage("en");
  await condition(
    "document.querySelector('.welcome-info')?.textContent.includes('Welcome to Winscope')",
  );
  assert.equal(await evaluate("localStorage.getItem('language')"), "en");
  await selectLandingLanguage("zh-CN");
  await condition(
    "document.querySelector('.welcome-info')?.textContent.includes('欢迎使用 Winscope')",
  );


  assert.equal(await evaluate("localStorage.getItem('language')"), "zh-CN");
  const normalUrl = await evaluate("location.href");
  await screenshot("i18n-landing-chinese.png");
  await evaluate("window.__i18nBeforeNavigation = true");
  await cdp("Page.reload");
  await condition(
    "window.__i18nBeforeNavigation === undefined && document.querySelector('.toolbar .settings-button') !== null",
  );
  await condition("document.documentElement.lang === 'zh-CN'");
  await condition(
    "document.querySelector('.welcome-info')?.textContent.includes('欢迎使用 Winscope')",
  );
  languageBrowserEvidence.push({
    check: "landing-translation-and-reload",
    language: "zh-CN",
    persisted: true,
  });

  const privacyUrl = new URL(normalUrl);
  privacyUrl.searchParams.set("no-persistence", "");
  await evaluate("window.__i18nBeforeNavigation = true");
  await cdp("Page.navigate", { url: privacyUrl.toString() });
  await condition(
    "window.__i18nBeforeNavigation === undefined && document.querySelector('.privacy-mode-diagnostic') !== null && document.querySelector('.toolbar .settings-button') !== null",
  );
  const detected = await evaluate(
    "navigator.languages.find(value=>/^(en|zh)(-|$)/i.test(value))?.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en'",
  );
  assert.equal(
    await evaluate("document.documentElement.lang"),
    detected,
    "Privacy mode ignores saved language and uses browser preference",
  );
  await selectLandingLanguage("en");
  await condition(
    "document.querySelector('.privacy-mode-diagnostic')?.textContent.includes('Privacy mode is active')",
  );
  assert.equal(
    await evaluate("localStorage.getItem('language')"),
    "zh-CN",
    "Privacy language choice does not overwrite the saved preference",
  );
  await selectLandingLanguage("zh-CN");
  await condition(
    "document.querySelector('.privacy-mode-diagnostic')?.textContent.includes('隐私模式已启用')",
  );
  assert.equal(await evaluate("localStorage.getItem('language')"), "zh-CN");
  languageBrowserEvidence.push({
    check: "privacy-language-no-read-or-write",
    detected,
    savedPreference: "zh-CN",
  });
  await evaluate("window.__i18nBeforeNavigation = true");
  await cdp("Page.navigate", { url: normalUrl });
  await condition(
    "window.__i18nBeforeNavigation === undefined && document.documentElement.lang === 'zh-CN' && document.querySelector('.privacy-mode-diagnostic') === null",
  );
  await selectLandingLanguage("en");
  await condition(
    "document.querySelector('.welcome-info')?.textContent.includes('Welcome to Winscope')",
  );
  assert.equal(await evaluate("localStorage.getItem('language')"), "en");
}
async function languageAiRegression() {
  const initial = await evaluate(
    `({draft:document.querySelector('.composer-input').value,width:innerWidth,height:innerHeight,dark:document.body.classList.contains('dark-mode')})`,
  );
  const draft = "Settings · 用户草稿 <b>verbatim</b> · fixture-model";
  await typeMessage(draft);
  await click(".toolbar .settings-button");
  await condition(
    "document.querySelector('.interface-language-select') !== null",
  );
  assert.equal(
    await evaluate(
      "getComputedStyle(document.querySelector('.ai-panel')).display",
    ),
    "none",
  );
  assert.equal(
    await evaluate("document.querySelector('ai-panel app-settings') === null"),
    true,
  );
  await evaluate("document.querySelector('.settings-header h2').focus()");
  await cdp("Input.dispatchKeyEvent", {
    type: "keyDown",
    key: "Tab",
    code: "Tab",
    windowsVirtualKeyCode: 9,
  });
  await cdp("Input.dispatchKeyEvent", {
    type: "keyUp",
    key: "Tab",
    code: "Tab",
    windowsVirtualKeyCode: 9,
  });
  await condition(
    "document.querySelector('app-settings').contains(document.activeElement)",
  );
  await click('.settings-menu [data-section="ai"]');
  await condition("document.querySelector('ai-settings select') !== null");
  const runtimeControls = () =>
    evaluate(
      `Array.from(document.querySelectorAll('ai-settings select')).filter(select=>select.dataset.field!=='reasoning').map(select=>({value:select.value,options:Array.from(select.options).filter(option=>option.value && option.value!=='__custom__').map(option=>({value:option.value,label:option.textContent}))}))`,
    );
  const before = await runtimeControls();
  await click('.settings-menu [data-section="general"]');
  await selectInterfaceLanguage(".interface-language-select", "zh-CN");
  await condition(
    "document.querySelector('.settings-header h2')?.textContent.trim() === '设置'",
  );
  assert.equal(
    await evaluate(
      "document.querySelector('.interface-language-select').getAttribute('aria-label')",
    ),
    "界面语言",
  );
  await click('.settings-menu [data-section="ai"]');
  await condition(
    "document.querySelector('ai-settings [aria-label=\"智能体\"]') !== null",
  );
  assert.deepEqual(
    await runtimeControls(),
    before,
    "Provider, model and agent IDs/names remain verbatim across language changes",
  );
  await screenshot("i18n-ai-settings-chinese.png");
  await click(".settings-cancel");
  await condition(
    "document.querySelector('app-settings') === null && document.querySelector('.composer-input') !== null",
  );
  assert.equal(
    await evaluate("document.querySelector('.composer-input').value"),
    draft,
  );
  assert.equal(
    await evaluate(
      "document.querySelector('.composer-input').getAttribute('aria-label')",
    ),
    "消息",
  );
  assert.equal(
    await evaluate("document.querySelector('.composer-input').placeholder"),
    "向 WinScope 提问",
  );
  const stored = await evaluate("JSON.stringify({...localStorage})");
  assert.equal(
    stored.includes(draft),
    false,
    "Draft is never persisted with language preferences",
  );

  // Run Chinese responsive screenshots here, not in the shared workflow tail.
  await cdp("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: false,
  });
  for (const theme of ["light", "dark"]) {
    await evaluate(
      `document.body.classList.toggle('dark-mode',${theme === "dark"})`,
    );
    const metrics = await evaluate(`(() => {
      const panel=document.querySelector('.ai-panel'),header=document.querySelector('.ai-panel-header'),composer=document.querySelector('.ai-composer');
      const h=header.getBoundingClientRect(),c=composer.getBoundingClientRect();
      return {language:document.documentElement.lang,width:innerWidth,headerHeight:h.height,overflow:panel.scrollWidth>panel.clientWidth,composerRight:c.right,sendAria:composer.querySelector('.composer-primary').getAttribute('aria-label'),draft:composer.querySelector('.composer-input').value};
    })()`);
    assert.equal(metrics.language, "zh-CN");
    assert.equal(metrics.width, 390);
    assert.equal(metrics.headerHeight, 40);
    assert.equal(metrics.overflow, false);
    assert.ok(metrics.composerRight <= metrics.width);
    assert.equal(metrics.sendAria, "发送消息");
    assert.equal(metrics.draft, draft);
    languageBrowserEvidence.push({
      check: "ai-chinese-mobile",
      theme,
      ...metrics,
    });
    await screenshot(`i18n-ai-mobile-${theme}.png`);
  }
  await cdp("Emulation.setDeviceMetricsOverride", {
    width: initial.width,
    height: initial.height,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await evaluate(`document.body.classList.toggle('dark-mode',${initial.dark})`);
  await click(".toolbar .settings-button");
  await condition(
    "document.querySelector('.interface-language-select') !== null",
  );
  await selectInterfaceLanguage(".interface-language-select", "en");
  await click(".settings-cancel");
  await condition(
    "document.querySelector('app-settings') === null && document.querySelector('.composer-input')?.placeholder === 'Message WinScope'",
  );
  assert.equal(
    await evaluate("document.querySelector('.composer-input').value"),
    draft,
  );
  await typeMessage(initial.draft);
  await writeFile(
    join(evidenceDir, "i18n-browser.json"),
    JSON.stringify(
      {
        ok: true,
        checks: languageBrowserEvidence,
        screenshots: [
          "i18n-landing-chinese.png",
          "i18n-ai-settings-chinese.png",
          "i18n-ai-mobile-light.png",
          "i18n-ai-mobile-dark.png",
        ],
      },
      null,
      2,
    ) + "\n",
  );
}
async function localConfigurationRegression(providerCapture, claudeHome) {
  const originalDraft = await evaluate(
    "document.querySelector('.composer-input').value",
  );
  await click(".ai-settings-button");
  await condition(
    "document.querySelector('[aria-label=\"Get Codex configuration\"]') !== null",
  );
  const codex = '.provider-settings[data-provider="codex"]';
  const claude = '.provider-settings[data-provider="claude"]';
  assert.equal(
    await evaluate(
      "document.querySelector('select[aria-label=Provider]') === null",
    ),
    true,
  );
  await click('[aria-label="Get Codex configuration"]');
  await condition(
    `document.querySelector('${codex} [data-field=model]')?.value === 'fixture/codex'`,
  );
  assert.equal(
    await evaluate(
      `document.querySelector('${codex} [data-field=base-url]').value`,
    ),
    "https://codex.fixture.invalid/v1",
  );
  await condition(
    "document.querySelector('[data-field=active-provider]')?.value === 'Codex'",
  );
  await chooseProviderField("codex", "model", "__custom__");
  await chooseProviderField("codex", "custom-model", "invalid inactive!");
  await click('.settings-menu [data-section="general"]');
  await click('.settings-menu [data-section="ai"]');
  const settingsPath = join(claudeHome, "settings.json");
  const originalSettings = await readFile(settingsPath, "utf8");
  await writeFile(settingsPath, "{ invalid FIXTURE_SECRET");
  await click('[aria-label="Get Claude configuration"]');
  await condition(`document.querySelector('${claude} [role=alert]') !== null`);
  assert.equal(
    await evaluate(
      "document.querySelector('[data-field=active-provider]').value",
    ),
    "Codex",
  );
  assert.equal(
    await evaluate(
      `document.querySelector('${claude} [role=alert]').textContent.includes('FIXTURE_SECRET')`,
    ),
    false,
  );
  await writeFile(settingsPath, originalSettings);
  await click('[aria-label="Get Claude configuration"]');
  await condition(
    `document.querySelector('${claude} [data-field=model]')?.value === 'fixture/claude[1m]'`,
  );
  assert.equal(
    await evaluate(
      `document.querySelector('${codex} [data-field=custom-model]').value`,
    ),
    "invalid inactive!",
  );
  assert.equal(
    await evaluate(
      `document.querySelector('${claude} [data-field=base-url]').value`,
    ),
    "https://claude.fixture.invalid/v1",
  );
  assert.equal(
    await evaluate(
      "document.querySelector('[data-field=active-provider]').value",
    ),
    "Claude",
  );
  assert.equal(
    await evaluate(
      `document.querySelector('${claude} [data-field=model]').textContent.includes('Fixture Claude alternative')`,
    ),
    true,
  );
  const browserData = await evaluate(
    "fetch('./ai/api/providers').then(r=>r.text())",
  );
  assert.equal(browserData.includes("FIXTURE_SECRET"), false);
  await screenshot("ai-local-config-settings.png");
  await click(".settings-save");
  await condition("document.querySelector('app-settings') === null");
  assert.equal(
    await evaluate("document.querySelector('.composer-input').value"),
    originalDraft,
  );
  for (const [index, [provider, model]] of [
    ["claude", "fixture/claude-alternative[1m]"],
    ["codex", "fixture/codex"],
    ["claude", "fixture/claude-alternative[1m]"],
  ].entries()) {
    if (index > 0) {
      await click(".ai-settings-button");
      await condition(
        `document.querySelector('[aria-label="Get ${provider === "codex" ? "Codex" : "Claude"} configuration"]') !== null`,
      );
      await click(
        `[aria-label="Get ${provider === "codex" ? "Codex" : "Claude"} configuration"]`,
      );
      await condition(
        `document.querySelector('[data-field=active-provider]')?.value === '${provider === "codex" ? "Codex" : "Claude"}' && !document.querySelector('.settings-save').disabled`,
      );
      await click(".settings-save");
      await condition("document.querySelector('app-settings') === null");
    }
    assert.deepEqual(
      await evaluate(
        "Array.from(document.querySelector('select[aria-label=\"Conversation model\"]').querySelectorAll('optgroup'),g=>g.label)",
      ),
      [provider === "codex" ? "Codex" : "Claude"],
    );
    await evaluate(`(() => {
      const s=document.querySelector('select[aria-label="Conversation model"]');
      const group=[...s.querySelectorAll('optgroup')].find(g=>g.label===${JSON.stringify(provider === "codex" ? "Codex" : "Claude")});
      const option=[...group.querySelectorAll('option')].find(o=>JSON.parse(o.value)[1]===${JSON.stringify(model)});
      if(!option)throw new Error('Imported model is missing');
      s.value=option.value;s.dispatchEvent(new Event('change',{bubbles:true}));
    })()`);
    const count = await evaluate(
      "document.querySelectorAll('.chat-turn[data-status=completed]').length",
    );
    await typeMessage(`Imported ${provider} selection`);
    await click(".ai-analyze-button");
    await condition(
      `document.querySelectorAll('.chat-turn[data-status=completed]').length === ${count + 1}`,
    );
    const latest = await evaluate(
      "fetch('./ai/api/sessions').then(r=>r.json()).then(r=>r.sessions[0])",
    );
    assert.equal(latest.providerId, provider);
    assert.equal(latest.modelId, model);
    const captured = JSON.parse(await readFile(providerCapture, "utf8"));
    assert.ok(captured.args.includes(model));
    assert.ok(
      captured.args.includes(provider === "codex" ? "exec" : "--print"),
    );
  }
  await screenshot("ai-local-config-composer.png");
}
const compactDensityEvidence = [];
async function applicationSettingsMetrics(label, { short = false } = {}) {
  await condition(
    "document.querySelector('app-settings .provider-settings') !== null",
  );
  const metrics = await evaluate(`(() => {
    const box=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom};};
    const dialog=document.querySelector('app-settings .settings-dialog'),menu=dialog.querySelector('.settings-menu'),content=dialog.querySelector('.settings-content'),footer=dialog.querySelector('.settings-footer');
    return {viewport:{width:innerWidth,height:innerHeight},theme:document.body.classList.contains('dark-mode')?'dark':'light',dialog:box(dialog),menu:box(menu),content:{...box(content),clientHeight:content.clientHeight,scrollHeight:content.scrollHeight,overflowY:getComputedStyle(content).overflowY},footer:box(footer),horizontalOverflow:dialog.scrollWidth>dialog.clientWidth,aiHidden:!document.querySelector('.ai-panel')||getComputedStyle(document.querySelector('.ai-panel')).display==='none',tabs:[...menu.querySelectorAll('[role=tab]')].map(e=>({selected:e.getAttribute('aria-selected'),...box(e)})),fieldHeights:[...dialog.querySelectorAll('.provider-settings input,.provider-settings select')].filter(e=>e.getClientRects().length).map(e=>box(e).height),actions:[...footer.querySelectorAll('button')].map(e=>({label:e.getAttribute('aria-label'),...box(e)}))};
  })()`);
  assert.equal(
    metrics.horizontalOverflow,
    false,
    `${label}: no settings overflow`,
  );
  assert.equal(
    metrics.aiHidden,
    true,
    `${label}: settings is independent of AI`,
  );
  assert.equal(metrics.tabs.length, 2, `${label}: General and AI menus`);
  assert.equal(metrics.tabs.filter((tab) => tab.selected === "true").length, 1);
  assert.ok(
    metrics.menu.right <= metrics.content.x + 1,
    `${label}: menu remains on the left`,
  );
  assert.ok(metrics.dialog.right <= metrics.viewport.width + 1);
  assert.ok(metrics.fieldHeights.length >= 4);
  for (const height of metrics.fieldHeights)
    assert.equal(height, 32, `${label}: compact settings fields`);
  for (const action of metrics.actions)
    assert.ok(action.height > 0 && action.height <= 32);
  assert.ok(
    metrics.footer.bottom <= metrics.viewport.height,
    `${label}: footer stays visible`,
  );
  if (short) {
    assert.equal(metrics.viewport.height, 640);
    assert.equal(metrics.content.overflowY, "auto");
    assert.ok(metrics.content.scrollHeight > metrics.content.clientHeight);
  }
  compactDensityEvidence.push({ label, ...metrics });
  return metrics;
}
async function compactDensityMetrics(
  label,
  { settings = false, short = false } = {},
) {
  if (settings) return applicationSettingsMetrics(label, { short });
  const metrics = await evaluate(`(() => {
    const box = (element) => {const r=element.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,bottom:r.bottom,right:r.right};};
    const header=document.querySelector('.ai-panel-header');
    const controls=[...header.querySelectorAll('button')].filter(element=>getComputedStyle(element).display!=='none').map(element=>({label:element.getAttribute('aria-label'),...box(element)}));
    const panel=document.querySelector('.ai-panel'), composer=document.querySelector('.ai-composer');
    return {
      viewport:{width:innerWidth,height:innerHeight},
      theme:document.body.classList.contains('dark-mode')?'dark':'light',
      header:box(header),headerControls:controls,
      toolbar:box(document.querySelector('.toolbar')),
      globalButton:box(document.querySelector('.new-session-button').getBoundingClientRect().height ? document.querySelector('.new-session-button') : document.querySelector('.toolbar .ai-open-button')),
      horizontalOverflow:panel.scrollWidth>panel.clientWidth,
      composer:composer?{...box(composer),radius:getComputedStyle(composer).borderRadius,gap:getComputedStyle(composer).gap,input:box(composer.querySelector('.composer-input')),send:box(composer.querySelector('.composer-primary'))}:null,
    };
  })()`);
  assert.equal(
    metrics.header.height,
    40,
    `${label}: AI header is 40px border-box`,
  );
  assert.equal(metrics.toolbar.height, 32, `${label}: app toolbar stays 32px`);
  assert.equal(
    metrics.horizontalOverflow,
    false,
    `${label}: no horizontal overflow`,
  );
  assert.ok(
    metrics.globalButton.height > 0 && metrics.globalButton.height <= 32,
    `${label}: shared Material button uses compact density`,
  );
  assert.ok(
    metrics.headerControls.length >= 6,
    `${label}: report/settings/close actions remain present`,
  );
  for (const control of metrics.headerControls) {
    assert.equal(control.width, 32, `${label}: ${control.label} is 32px wide`);
    assert.equal(control.height, 32, `${label}: ${control.label} is 32px high`);
    assert.equal(
      control.y,
      metrics.headerControls[0].y,
      `${label}: all header actions, including reports, share one row`,
    );
    assert.ok(
      control.bottom <= metrics.header.bottom && control.y >= metrics.header.y,
      `${label}: ${control.label} stays inside the compact header`,
    );
  }
  if (metrics.composer) {
    assert.equal(
      metrics.composer.radius,
      "28px",
      `${label}: compact chrome does not change composer radius`,
    );
    assert.equal(
      metrics.composer.gap,
      "12px",
      `${label}: composer keeps reference text/toolbar gap`,
    );
    assert.equal(
      metrics.composer.send.width,
      34,
      `${label}: send target keeps reference width`,
    );
    assert.equal(
      metrics.composer.send.height,
      34,
      `${label}: send target keeps reference height`,
    );
  }
  if (short) {
    assert.equal(
      metrics.viewport.height,
      640,
      `${label}: short viewport is actually rendered at 640px`,
    );
    if (metrics.composer) {
      assert.ok(
        metrics.composer.y >= metrics.header.bottom,
        `${label}: composer does not overlap the header`,
      );
      assert.ok(
        metrics.composer.bottom <= metrics.viewport.height,
        `${label}: composer remains fully visible`,
      );
    }
  }
  compactDensityEvidence.push({ label, ...metrics });
  return metrics;
}
async function composerReferenceEvidence() {
  const referenceRoot = process.env.WINSCOPE_COMPOSER_REFERENCE_ROOT;
  if (!referenceRoot) return;
  const source = join(referenceRoot, "packages/client");
  const [base, tokens, shadows, input] = await Promise.all([
    readFile(join(source, "ui-theme/src/styles/base.css"), "utf8"),
    readFile(join(source, "ui-theme/src/styles/design-platform.css"), "utf8"),
    readFile(
      join(source, "ui-theme/src/styles/gradient-shadow-text.css"),
      "utf8",
    ),
    readFile(
      join(source, "ui-conversation/src/client/skeleton/InputBar.module.css"),
      "utf8",
    ),
  ]);
  const capture = async (selector, frame = false) => {
    const box = await evaluate(
      `(() => {const e=${frame ? `document.querySelector('#composer-reference').contentDocument.querySelector('${selector}')` : `document.querySelector('${selector}')`};const r=e.getBoundingClientRect();const f=${frame ? `document.querySelector('#composer-reference').getBoundingClientRect()` : "{x:0,y:0}"};return {x:r.x+f.x-4,y:r.y+f.y-4,width:r.width+8,height:r.height+8,scale:1};})()`,
    );
    return (await cdp("Page.captureScreenshot", { format: "png", clip: box }))
      .data;
  };
  await evaluate("document.querySelector('.composer-input').blur()");
  const actual = await capture(".ai-composer");
  const geometry = await evaluate(
    "(() => {const e=document.querySelector('.ai-composer');return {width:e.getBoundingClientRect().width,dark:document.body.classList.contains('dark-mode'),background:getComputedStyle(document.querySelector('.ai-panel')).backgroundColor};})()",
  );
  // Isolated source/token-derived specimen, NOT a live reference-app screenshot.
  // Model controls are omitted intentionally per the user's configuration-placement override.
  const markup = `<style>${base}\n${tokens}\n${shadows}\n${input}\nbody{margin:0;padding:12px;background:${geometry.background};--dsh-composer-card-max-width:${geometry.width}px} .card{width:${geometry.width}px}.input{color:var(--dsw-alias-label-primary)}.ref-context{font:13px var(--dsw-font-family);color:var(--dsw-alias-label-secondary);opacity:.5}.plus{font:20px var(--dsw-font-family);line-height:1}</style><body ${geometry.dark ? "data-ds-dark-theme" : ""}><div class="hero"><div class="card"><div class="scroll"><div class="grow"><div class="input" contenteditable="true"></div><div class="placeholder">Message WinScope</div></div></div><div class="row"><div class="tools"><button class="add plus">+</button><span class="ref-context">Trace context</span></div><div class="trailing"><button class="primary" disabled><svg width="16" height="16" viewBox="0 0 16 16"><path d="M8 14V2M3 7l5-5 5 5" stroke="white" fill="none" stroke-width="2"/></svg></button></div></div></div></div></body>`;
  await evaluate(
    `new Promise(resolve=>{const f=document.createElement('iframe');f.id='composer-reference';f.style.cssText='position:fixed;inset:0 auto auto 0;width:${Math.ceil(geometry.width + 24)}px;height:240px;border:0;z-index:9999';f.onload=()=>requestAnimationFrame(()=>resolve(true));f.srcdoc=${JSON.stringify(markup)};document.body.append(f);})`,
  );
  const reference = await capture(".card", true);
  const metrics = await evaluate(
    "(() => {const d=document.querySelector('#composer-reference').contentDocument,c=d.querySelector('.card'),i=d.querySelector('.input');return {radius:getComputedStyle(c).borderRadius,gap:getComputedStyle(c).gap,inputHeight:i.getBoundingClientRect().height,plus:d.querySelector('.add').getBoundingClientRect().width,send:d.querySelector('.primary').getBoundingClientRect().width};})()",
  );
  assert.equal(metrics.radius, "28px");
  assert.equal(metrics.gap, "12px");
  assert.equal(metrics.inputHeight, 52);
  assert.equal(metrics.plus, 28);
  assert.equal(metrics.send, 34);
  await evaluate("document.querySelector('#composer-reference').remove()");
  const compare = await evaluate(
    `(async()=>{const load=src=>new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=reject;i.src=src;});const a=await load('data:image/png;base64,${actual}'),b=await load('data:image/png;base64,${reference}');const c=document.createElement('canvas');c.width=a.width;c.height=a.height;const x=c.getContext('2d');x.drawImage(a,0,0);const left=x.getImageData(0,0,c.width,c.height);x.clearRect(0,0,c.width,c.height);x.drawImage(b,0,0);const right=x.getImageData(0,0,c.width,c.height);const diff=x.createImageData(c.width,c.height);let changed=0;for(let p=0;p<left.data.length;p+=4){const delta=Math.max(...[0,1,2].map(i=>Math.abs(left.data[p+i]-right.data[p+i])));if(delta>24)changed++;diff.data[p]=delta>24?255:left.data[p]*.25;diff.data[p+1]=left.data[p+1]*.25;diff.data[p+2]=left.data[p+2]*.25;diff.data[p+3]=255;}x.putImageData(diff,0,0);return {width:c.width,height:c.height,referenceHeight:b.height,changedPixelRatio:changed/(c.width*c.height),diff:c.toDataURL('image/png').split(',')[1]};})()`,
  );
  await mkdir(join(evidenceDir, "ai-composer"), { recursive: true });
  await writeFile(
    join(evidenceDir, "ai-composer/actual.png"),
    Buffer.from(actual, "base64"),
  );
  await writeFile(
    join(evidenceDir, "ai-composer/reference-specimen.png"),
    Buffer.from(reference, "base64"),
  );
  await writeFile(
    join(evidenceDir, "ai-composer/diff.png"),
    Buffer.from(compare.diff, "base64"),
  );
  delete compare.diff;
  await writeFile(
    join(evidenceDir, "ai-composer/comparison.json"),
    JSON.stringify(
      {
        sourceDerivedNotLive: true,
        referenceRevision: "ce7073d51254c26cd63b22a60835b8f948deb447",
        metrics,
        pixels: compare,
        intentionalDifferences: [
          "models moved to AI settings",
          "WinScope trace context",
          "native text area and existing icon glyphs",
        ],
        qualification:
          "geometry and secondary pixel evidence only; not live product parity",
      },
      null,
      2,
    ) + "\n",
  );
}
async function stop(child) {
  if (!child || child.exitCode !== null) return;
  const exited = new Promise((resolve) => child.once("exit", resolve));
  child.kill("SIGTERM");
  let timer;
  await Promise.race([
    exited,
    new Promise((resolve) => {
      timer = setTimeout(() => {
        child.kill("SIGKILL");
        resolve();
      }, 6000);
    }),
  ]);
  clearTimeout(timer);
}
try {
  await mkdir(evidenceDir, { recursive: true });
  await cp(process.env.WINSCOPE_AI_WEB_ROOT ?? join(root, "dist/prod"), webRoot, { recursive: true });
  await mkdir(join(work, "agents"));
  await mkdir(join(work, "proxy"));
  await cp(
    join(root, "src/adb/winscope_proxy.py"),
    join(work, "proxy/winscope_proxy.py"),
  );
  const providerFile = join(work, "fixture-provider.cjs");
  const providerCapture = join(work, "provider-capture.json");
  await writeFile(
    providerFile,
    `const fs=require('node:fs'); let text=''; process.stdin.setEncoding('utf8'); process.stdin.on('data',c=>text+=c); process.stdin.on('end',()=>{const answer=()=>{fs.writeFileSync(${JSON.stringify(providerCapture)},JSON.stringify({args:process.argv.slice(2),context:text}));console.log('The available evidence is incomplete. Load a screen recording and SurfaceFlinger trace to correlate black-screen intervals. Your attached notes have been included in the analysis context.');}; if(text.includes('wait-for-stop')) setTimeout(answer,30000); else answer();});`,
  );
  await writeFile(join(work, "notes.txt"), "ATTACHED_NOTE_EVIDENCE");
  const cliDirectory = join(work, "bin");
  const codexHome = join(work, ".codex");
  const claudeHome = join(work, ".claude");
  for (const directory of [cliDirectory, codexHome, claudeHome])
    await mkdir(directory);
  await writeFile(join(codexHome, "config.toml"), 'model = "fixture/codex"\n');
  await writeFile(
    join(claudeHome, "settings.json"),
    JSON.stringify({
      model: "fixture/claude[1m]",
      env: {
        ANTHROPIC_AUTH_TOKEN: "FIXTURE_SECRET",
        ANTHROPIC_BASE_URL:
          "https://claude.fixture.invalid/v1?token=FIXTURE_SECRET",
      },
      modelPicker: {
        options: [
          {
            model: "fixture/claude-alternative[1m]",
            label: "Fixture Claude alternative",
          },
        ],
      },
    }),
  );
  const localCli = `#!${process.execPath}
if(process.argv[2]==='app-server'){
  require('node:readline').createInterface({input:process.stdin}).on('line',line=>{
    const m=JSON.parse(line);if(m.id===undefined)return;
    let result={};
    if(m.method==='config/read')result={config:{model:'fixture/codex',model_reasoning_effort:'high',model_provider:'fixture',model_providers:{fixture:{name:'Codex fixture',base_url:'https://codex.fixture.invalid/v1?token=FIXTURE_SECRET'}}}};
    if(m.method==='model/list')result={data:[{model:'fixture/codex',displayName:'Fixture Codex',supportedReasoningEfforts:[{reasoningEffort:'high'}]}],nextCursor:null};
    console.log(JSON.stringify({id:m.id,result}));
  });
}else require(${JSON.stringify(providerFile)});
`;
  for (const name of ["codex", "claude"]) {
    const file = join(cliDirectory, name);
    await writeFile(file, localCli);
    await chmod(file, 0o700);
  }
  await writeFile(
    join(work, "agents/agent.json"),
    JSON.stringify({
      id: "display-anomaly",
      name: "Display analyst",
      providerId: "browser-fixture",
      skills: ["black-screen-diagnosis"],
    }),
  );
  await writeFile(
    join(work, "config.json"),
    JSON.stringify({
      agentPaths: [join(work, "agents")],
      providers: [
        {
          id: "browser-fixture",
          kind: "command",
          name: "Browser fixture",
          executable: process.execPath,
          args: [providerFile],
          models: [{ id: "fixture-model", name: "Fixture model" }],
          modelArgs: ["--model", "{{model}}"],
          reasoningArgs: ["--effort", "{{level}}"],
        },
      ],
    }),
  );
  const assets = [];
  async function walk(directory, relative = "web") {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      if (entry.isDirectory())
        await walk(join(directory, entry.name), `${relative}/${entry.name}`);
      else
        assets.push({
          path: `${relative}/${entry.name}`,
          sha256: createHash("sha256")
            .update(await readFile(join(directory, entry.name)))
            .digest("hex"),
        });
    }
  }
  await walk(webRoot);
  assert.ok(
    assets.some((asset) => asset.path === "web/index.html"),
    "Production snapshot must contain index.html",
  );
  const snapshotIndex = await readFile(join(webRoot, "index.html"), "utf8");
  for (const [, name] of snapshotIndex.matchAll(/src="([^"/]+\.js)"/g)) {
    assert.ok(
      assets.some((asset) => asset.path === `web/${name}`),
      `Production snapshot is missing ${name}`,
    );
  }
  await writeFile(
    join(work, "manifest.json"),
    JSON.stringify({ schemaVersion: 1, assets }),
  );
  const aiPort = await availablePort();
  ai = spawn(
    process.execPath,
    [
      join(root, "ai/dist/src/cli.js"),
      "serve",
      "--port",
      String(aiPort),
      "--config",
      join(work, "config.json"),
    ],
    {
      stdio: ["ignore", "ignore", "pipe"],
      env: {
        ...process.env,
        PATH: `${cliDirectory}:${process.env.PATH}`,
        CODEX_HOME: codexHome,
        CLAUDE_CONFIG_DIR: claudeHome,
        ANTHROPIC_MODEL: undefined,
      },
    },
  );
  let aiLog = "";
  ai.stderr.on("data", (chunk) => {
    aiLog += chunk;
  });
  await waitUntil(
    async () => (await fetch(`http://127.0.0.1:${aiPort}/health`)).ok,
    `gateway startup ${aiLog}`,
  );
  const executable = join(work, "winscope-launcher");
  await command("go", ["build", "-o", executable, "./cmd/launcher"]);
  launcher = spawn(
    executable,
    ["--root", work, "--ai-url", `http://127.0.0.1:${aiPort}`],
    { stdio: ["ignore", "pipe", "pipe"] },
  );
  let launchLog = "";
  launcher.stdout.on("data", (chunk) => {
    launchLog += chunk;
  });
  launcher.stderr.on("data", (chunk) => {
    launchLog += chunk;
  });
  const origin = await waitUntil(
    () =>
      launchLog.match(
        /Winscope is available at (http:\/\/127\.0\.0\.1:\d+)/,
      )?.[1],
    "launcher ready",
  ).catch((error) => {
    throw new Error(`${error.message}: ${launchLog}`);
  });
  browser = spawn(
    process.env.CHROME_BIN ??
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    [
      "--headless=new",
      "--disable-gpu",
      "--no-sandbox",
      "--no-first-run",
      "--no-default-browser-check",
      "--remote-debugging-port=0",
      `--user-data-dir=${join(work, "chrome-profile")}`,
      "--window-size=1440,1000",
      origin,
    ],
    { stdio: ["ignore", "ignore", "ignore"] },
  );
  const cdpPort = await waitUntil(
    async () =>
      (
        await readFile(join(work, "chrome-profile/DevToolsActivePort"), "utf8")
      ).split("\n")[0],
    "Chrome debugging port",
  );
  const target = await waitUntil(
    async () =>
      (
        await (await fetch(`http://127.0.0.1:${cdpPort}/json/list`)).json()
      ).find((target) => target.type === "page"),
    "Chrome page",
  );
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve);
    socket.addEventListener("error", reject);
  });
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.method === "Runtime.exceptionThrown")
      runtimeErrors.push(message.params.exceptionDetails.text);
    const item = pending.get(message.id);
    if (!item) return;
    pending.delete(message.id);
    clearTimeout(item.timer);
    if (message.error) item.reject(new Error(message.error.message));
    else item.resolve(message.result);
  });
  await cdp("Runtime.enable");
  await cdp("Page.enable");
  await cdp("Browser.setDownloadBehavior", {
    behavior: "allow",
    downloadPath: join(work, "downloads"),
  });
  await condition("document.querySelector('.ai-open-button') !== null");
  await languageLandingRegression();
  await click(".ai-open-button");
  await condition(
    "document.querySelector('.ai-settings-button') !== null && !document.querySelector('.ai-settings-button').disabled",
  );
  await languageAiRegression();
  await click('[aria-label="AI settings"]');
  await condition(
    'document.querySelector(\'.provider-settings[data-provider="browser-fixture"] option[value="fixture-model"]\') !== null',
  );
  await chooseProviderField("browser-fixture", "model", "fixture-model");
  await chooseProviderField("browser-fixture", "reasoning", "high");
  await compactDensityMetrics("desktop-settings", { settings: true });
  await screenshot("ai-composer-settings.png");
  await click(".settings-save");
  await condition("document.querySelector('app-settings') === null");
  assert.equal(
    await evaluate(
      "document.querySelector('.ai-composer select[aria-label=\"Conversation model\"]')?.value",
    ),
    JSON.stringify(["browser-fixture", "fixture-model"]),
  );
  const initialGeometry = await evaluate(`(() => {
    const card=document.querySelector('.ai-composer'), input=document.querySelector('.composer-input'), plus=document.querySelector('.composer-add'), send=document.querySelector('.composer-primary');
    const c=getComputedStyle(card), i=getComputedStyle(input), box=element=>({width:element.getBoundingClientRect().width,height:element.getBoundingClientRect().height});
    return {radius:c.borderRadius,border:c.borderWidth,gap:c.gap,plus:box(plus),send:box(send),input:box(input),font:i.fontSize,lineHeight:i.lineHeight,outline:i.outlineStyle,card:box(card)};
  })()`);
  assert.ok(
    initialGeometry.card.width <= 952,
    "Composer respects the reference max width",
  );
  assert.equal(initialGeometry.radius, "28px");
  assert.equal(initialGeometry.border, "0px");
  assert.equal(initialGeometry.gap, "12px");
  assert.equal(initialGeometry.plus.width, 28);
  assert.equal(initialGeometry.send.width, 34);
  assert.equal(initialGeometry.input.height, 52);
  assert.equal(initialGeometry.lineHeight, "24px");
  assert.equal(initialGeometry.outline, "none");
  await screenshot("ai-composer-empty.png");
  await composerReferenceEvidence();
  await click('[aria-label="Composer actions"]');
  await condition(
    "document.querySelector('[aria-label=\"Attach text notes\"]') !== null",
  );
  await screenshot("ai-composer-actions.png");
  await cdp("Input.dispatchKeyEvent", {
    type: "keyDown",
    key: "Escape",
    code: "Escape",
    windowsVirtualKeyCode: 27,
  });
  await cdp("Input.dispatchKeyEvent", {
    type: "keyUp",
    key: "Escape",
    code: "Escape",
    windowsVirtualKeyCode: 27,
  });
  await condition(
    "document.querySelector('.cdk-overlay-pane .mat-mdc-menu-panel') === null",
  );
  assert.equal(await evaluate("!!document.querySelector('ai-panel')"), true);
  // Paste/drop use actual files, and removal returns the compact card to its empty state.
  await evaluate(
    `(() => { const transfer=new DataTransfer();transfer.items.add(new File(['Dropped context'],'drop.md')); const card=document.querySelector('.ai-composer');card.dispatchEvent(new DragEvent('dragenter',{dataTransfer:transfer,bubbles:true,cancelable:true}));card.dispatchEvent(new DragEvent('drop',{dataTransfer:transfer,bubbles:true,cancelable:true}));})()`,
  );
  await condition(
    "document.querySelector('.attachment-chip')?.textContent.includes('drop.md')",
  );
  await click('[aria-label="Remove drop.md"]');
  await evaluate(
    `(() => {const transfer=new DataTransfer();transfer.items.add(new File(['Pasted context'],'paste.txt'));document.querySelector('.composer-input').dispatchEvent(new ClipboardEvent('paste',{clipboardData:transfer,bubbles:true,cancelable:true}));})()`,
  );
  await condition(
    "document.querySelector('.attachment-chip')?.textContent.includes('paste.txt')",
  );
  await click('[aria-label="Remove paste.txt"]');
  const documentNode = await cdp("DOM.getDocument");
  const fileNode = await cdp("DOM.querySelector", {
    nodeId: documentNode.root.nodeId,
    selector: "ai-panel input[type=file]",
  });
  await cdp("DOM.setFileInputFiles", {
    nodeId: fileNode.nodeId,
    files: [join(work, "notes.txt")],
  });
  await condition(
    "document.querySelector('.attachment-chip')?.textContent.includes('notes.txt')",
  );
  await typeMessage("Analyze the black-screen fixture");
  await cdp("Input.dispatchKeyEvent", {
    type: "keyDown",
    key: "Enter",
    code: "Enter",
    windowsVirtualKeyCode: 13,
  });
  await cdp("Input.dispatchKeyEvent", {
    type: "keyUp",
    key: "Enter",
    code: "Enter",
    windowsVirtualKeyCode: 13,
  });
  await condition(
    "document.querySelector('.chat-turn[data-status=completed]') !== null",
  );
  const first = await evaluate(
    "fetch('./ai/api/sessions').then(r=>r.json()).then(r=>r.sessions[0])",
  );
  assert.equal(first.modelId, "fixture-model");
  assert.equal(first.reasoningLevel, "high");
  const firstDetail = await evaluate(
    `fetch('./ai/api/sessions/${first.sessionId}').then(r=>r.json())`,
  );
  assert.match(firstDetail.result.provider.output, /evidence is incomplete/);
  const firstCapture = JSON.parse(await readFile(providerCapture, "utf8"));
  assert.match(firstCapture.context, /ATTACHED_NOTE_EVIDENCE/);
  assert.deepEqual(firstCapture.args, [
    "--model",
    "fixture-model",
    "--effort",
    "high",
  ]);
  await condition("document.querySelector('.session-row.active') !== null");
  await click('[aria-label="Preview report"]');
  await condition(
    "document.querySelector('.report-preview pre')?.textContent.includes('Winscope AI Analysis')",
  );
  await click('[aria-label="Export Markdown report"]');
  await click('[aria-label="Export HTML report"]');
  await waitUntil(
    async () =>
      (await readdir(join(work, "downloads"))).filter((name) =>
        /\.(md|html)$/.test(name),
      ).length === 2,
    "report downloads",
  );
  await click('[aria-label="Close report preview"]');
  await typeMessage("Follow up on my previous question");
  await click(".ai-analyze-button");
  await condition(
    "document.querySelectorAll('.chat-turn[data-status=completed]').length === 2",
  );
  const followed = await evaluate(
    `fetch('./ai/api/sessions/${first.sessionId}').then(r=>r.json())`,
  );
  assert.match(followed.result.provider.output, /evidence is incomplete/);
  const followCapture = JSON.parse(await readFile(providerCapture, "utf8"));
  assert.match(followCapture.context, /Previous conversation/);
  assert.match(followCapture.context, /Analyze the black-screen fixture/);
  await screenshot("ai-workflow-desktop.png");
  // Close/reopen and full-page refresh must restore the same two-turn session.
  await click('[aria-label="Close AI analysis"]');
  await click(".ai-open-button");
  await condition("document.querySelectorAll('.chat-turn').length === 2");
  await cdp("Page.reload");
  await condition(
    "document.querySelector('.ai-open-button') !== null && document.querySelector('ai-panel') === null",
  );
  await click(".ai-open-button");
  await condition("document.querySelectorAll('.chat-turn').length === 2");
  await click('[aria-label="AI settings"]');
  await condition(
    "document.querySelector('.provider-settings[data-provider=\"browser-fixture\"] [data-field=model]') !== null",
  );
  assert.equal(
    await evaluate(
      "document.querySelector('.provider-settings[data-provider=\"browser-fixture\"] [data-field=model]').value",
    ),
    "fixture-model",
  );
  await click(".settings-cancel");
  await click(".new-session-button");
  await typeMessage("Draft for a new conversation");
  await click(".session-row");
  await condition("document.querySelectorAll('.chat-turn').length === 2");
  await click(".new-session-button");
  assert.equal(
    await evaluate("document.querySelector('.composer-input').value"),
    "Draft for a new conversation",
  );
  await typeMessage("wait-for-stop");
  await click(".ai-analyze-button");
  await condition(
    "document.querySelector('.chat-turn[data-status=running]') !== null && !document.querySelector('.ai-stop-button').disabled",
  );
  await click(".ai-stop-button");
  await condition(
    "document.querySelector('.chat-turn[data-status=cancelled]') !== null",
  );
  await click(".retry-button");
  assert.equal(
    await evaluate("document.querySelector('.composer-input').value"),
    "wait-for-stop",
  );
  // Settings validate atomically; invalid model IDs never reach a provider.
  await click('[aria-label="AI settings"]');
  await chooseProviderField("browser-fixture", "model", "__custom__");
  await chooseProviderField("browser-fixture", "custom-model", "bad model!");
  await click(".settings-save");
  await condition("document.querySelector('.settings-error') !== null");
  await click(".settings-cancel");
  assert.equal(
    await evaluate("document.querySelector('.composer-input').value"),
    "wait-for-stop",
  );
  await localConfigurationRegression(providerCapture, claudeHome);
  // Auto-grow is bounded to 14 lines, with one native textarea scrollport.
  await typeMessage(
    Array.from({ length: 30 }, (_, index) => `Line ${index}`).join("\n"),
  );
  await condition(
    "document.querySelector('.composer-input').clientHeight >= 330",
  );
  assert.ok(
    await evaluate(
      "document.querySelector('.composer-input').getBoundingClientRect().height <= 336",
    ),
  );
  await screenshot("ai-composer-multiline.png");
  await typeMessage("Review my display trace");
  await evaluate("document.body.classList.remove('dark-mode')");
  assert.equal(
    await evaluate(
      "getComputedStyle(document.querySelector('.ai-composer')).backgroundColor",
    ),
    "rgb(255, 255, 255)",
  );
  await compactDensityMetrics("desktop-light");
  await screenshot("ai-density-desktop-light.png");
  await screenshot("ai-composer-light.png");
  await evaluate("document.body.classList.add('dark-mode')");
  assert.equal(
    await evaluate(
      "getComputedStyle(document.querySelector('.ai-composer')).backgroundColor",
    ),
    "rgb(44, 44, 46)",
  );
  await compactDensityMetrics("desktop-dark");
  await screenshot("ai-density-desktop-dark.png");
  await screenshot("ai-composer-dark.png");
  await cdp("Emulation.setDeviceMetricsOverride", {
    width: 1280,
    height: 640,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await compactDensityMetrics("short-desktop-composer", { short: true });
  await screenshot("ai-density-short-composer.png");
  await click('[aria-label="AI settings"]');
  await condition(
    "document.querySelector('app-settings .settings-content') !== null",
  );
  await chooseProviderField("claude", "model", "__custom__");
  await condition(
    "document.querySelector('.provider-settings[data-provider=\"claude\"] [data-field=custom-model]') !== null",
  );
  await compactDensityMetrics("short-desktop-settings", {
    settings: true,
    short: true,
  });
  const settingsScrolled = await evaluate(
    "(() => {const content=document.querySelector('app-settings .settings-content');content.scrollTop=content.scrollHeight;return content.scrollTop>0;})()",
  );
  assert.equal(
    settingsScrolled,
    true,
    "Settings body scrolls while its footer actions remain available",
  );
  await compactDensityMetrics("short-desktop-settings-scrolled", {
    settings: true,
    short: true,
  });
  await screenshot("ai-density-short-settings.png");
  await click(".settings-cancel");
  await cdp("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await click(".history-toggle");
  await condition("document.querySelector('.ai-sidebar.open') !== null");
  await screenshot("ai-workflow-mobile-history.png");
  await click(".sidebar-backdrop");
  const layout = await evaluate(
    "(() => {const p=document.querySelector('.ai-panel').getBoundingClientRect();const c=document.querySelector('.ai-composer').getBoundingClientRect();return {panelRight:p.right,composerRight:c.right,width:innerWidth,overflow:document.querySelector('.ai-panel').scrollWidth>document.querySelector('.ai-panel').clientWidth};})()",
  );
  const headerButtons = await evaluate(
    `({settings:document.querySelector('.ai-settings-button').getBoundingClientRect().y,close:document.querySelector('[aria-label="Close AI analysis"]').getBoundingClientRect().y})`,
  );
  assert.equal(
    headerButtons.settings,
    headerButtons.close,
    "Header actions share one row on narrow windows",
  );
  assert.equal(layout.overflow, false);
  assert.ok(layout.composerRight <= layout.width);
  await screenshot("ai-workflow-mobile.png");
  await compactDensityMetrics("mobile-dark");
  await screenshot("ai-density-mobile-dark.png");
  await evaluate("document.body.classList.remove('dark-mode')");
  await compactDensityMetrics("mobile-light");
  await screenshot("ai-density-mobile-light.png");
  await click('[aria-label="AI settings"]');
  await condition("document.querySelector('ai-settings') !== null");
  await compactDensityMetrics("mobile-light-settings", { settings: true });
  await screenshot("ai-density-mobile-settings.png");
  await click(".settings-cancel");
  assert.deepEqual(runtimeErrors, []);
  const result = {
    ok: true,
    browser: "chrome-cdp-headless",
    transport: "real-go-launcher",
    checks: [
      "session-browser",
      "model-and-effort",
      "text-attachment-content",
      "enter-send",
      "multi-turn-history",
      "report-preview",
      "markdown-and-html-download",
      "close-reopen-restore",
      "page-refresh-restore",
      "per-session-drafts",
      "stop",
      "retry-prompt",
      "settings-validation-and-cancel",
      "toolbar-settings-entry-and-no-toolbar-language-selector",
      "independent-settings-general-ai-left-navigation",
      "provider-specific-config-fields-and-draft-isolation",
      "last-successful-import-selects-single-provider",
      "failed-import-preserves-active-provider",
      "composer-only-active-provider-models",
      "general-settings-theme-and-menu-keyboard",
      "theme-system-live-follow",
      "theme-explicit-override-and-reload",
      "toolbar-theme-button-removed",
      "local-codex-claude-import-and-model-refresh",
      "composer-model-provider-routing",
      "composer-geometry",
      "plus-menu",
      "paste-and-drop-notes",
      "multiline-height-cap",
      "light-and-dark",
      "390px-layout",
      "compact-40px-header-all-actions-one-row",
      "32px-header-icons-and-settings-fields",
      "compact-material-density",
      "compact-desktop-mobile-light-dark",
      "640px-composer-and-scrollable-settings-footer",
    ],
    screenshots: [
      "ai-workflow-desktop.png",
      "ai-workflow-mobile-history.png",
      "ai-workflow-mobile.png",
      "ai-composer-empty.png",
      "ai-composer-settings.png",
      "settings-general-desktop.png",
      "settings-general-system-dark.png",
      "settings-general-light.png",
      "ai-local-config-settings.png",
      "ai-local-config-composer.png",
      "ai-composer-actions.png",
      "ai-composer-multiline.png",
      "ai-composer-light.png",
      "ai-composer-dark.png",
      "ai-density-desktop-light.png",
      "ai-density-desktop-dark.png",
      "ai-density-short-composer.png",
      "ai-density-short-settings.png",
      "ai-density-mobile-light.png",
      "ai-density-mobile-dark.png",
      "ai-density-mobile-settings.png",
    ],
  };
  result.composerGeometry = initialGeometry;
  result.compactDensity = compactDensityEvidence;
  await writeFile(
    join(evidenceDir, "ai-compact-density.json"),
    JSON.stringify({ ok: true, metrics: compactDensityEvidence }, null, 2) +
      "\n",
  );
  await writeFile(
    join(evidenceDir, "ai-workflow-browser.json"),
    JSON.stringify(result, null, 2) + "\n",
  );
  console.log(JSON.stringify(result));
} catch (error) {
  if (socket?.readyState === WebSocket.OPEN)
    console.error(
      await evaluate(
        "document.querySelector('app-settings')?.textContent || document.querySelector('ai-panel')?.textContent",
      ).catch(() => ""),
    );
  throw error;
} finally {
  socket?.close();
  for (const item of pending.values()) clearTimeout(item.timer);
  await stop(browser);
  await stop(launcher);
  await stop(ai);
  await rm(work, { recursive: true, force: true });
}
