import {OverlayContainer} from '@angular/cdk/overlay';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatTooltip} from '@angular/material/tooltip';
import {By} from '@angular/platform-browser';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {setLanguage} from '@common/i18n';
import {AiCatalog, AiEvent, AiGatewayClient, AiProvider, AiSessionDetail, AiSessionSummary,} from '@services/ai_gateway_client';
import {WinscopeTraceSnapshot} from '@services/winscope_trace_query';

import {AiPanelComponent} from './ai_panel_component';
import {AiSettingsValue} from './ai_settings_component';

const catalog: AiCatalog = {
  providers: [
    {
      id: 'test',
      models: [
        {id: 'default', name: 'Default'},
        {id: 'test-model', name: 'Test model'},
      ],
      reasoningLevels: ['low', 'medium', 'high'],
      supportsCustomModel: true,
    },
  ],
  agents: [
    {id: 'display-anomaly', name: 'Display analyst', providerId: 'test'},
  ],
  skills: [],
};
const session: AiSessionSummary = {
  sessionId: 'a',
  title: 'Saved conversation',
  agentId: 'display-anomaly',
  providerId: 'test',
  modelId: 'test-model',
  reasoningLevel: 'high',
  status: 'completed',
  createdAt: 1,
  updatedAt: 2,
  lastPrompt: 'Saved question',
};
const events: AiEvent[] = [
  {id: 1, type: 'analysis_started', data: {prompt: 'Saved question'}},
  {
    id: 2,
    type: 'analysis_completed',
    data: {provider: {output: 'Saved answer'}},
  },
];
const detail: AiSessionDetail = {
  ...session,
  events: events.map((event) => ({id: event.id ?? 0, event})),
};
const imported: AiProvider = {
  id: 'codex',
  name: 'Codex',
  defaultModelId: 'preferred[1m]',
  importedFrom: 'Codex local configuration',
  supportsCustomModel: true,
  models: [
    {id: 'default', name: 'Codex default'},
    {id: 'preferred[1m]', name: 'Preferred', levels: ['low', 'high']},
  ],
};
const configuredDefaults: AiSettingsValue = {
  selection: {
    agentId: 'display-anomaly',
    providerId: 'codex',
    modelId: 'preferred[1m]',
    customModel: '',
    reasoningLevel: 'high',
  },
  providerSelections: {
    codex: {
      modelId: 'preferred[1m]',
      customModel: '',
      reasoningLevel: 'high',
    },
  },
};

describe('AiPanelComponent', () => {
  let fixture: ComponentFixture<AiPanelComponent>;
  let component: AiPanelComponent;
  let start: jasmine.Spy;
  let get: jasmine.Spy;
  let stream: jasmine.Spy;
  let loadCatalog: jasmine.Spy;

  beforeEach(async () => {
    setLanguage('en');
    sessionStorage.removeItem('winscope.ai.active../ai/');
    await TestBed.configureTestingModule({
      imports: [AiPanelComponent, NoopAnimationsModule],
    }).compileComponents();
    loadCatalog = spyOn(AiGatewayClient.prototype, 'catalog').and.resolveTo(
      catalog,
    );
    spyOn(AiGatewayClient.prototype, 'listSessions').and.resolveTo([session]);
    get = spyOn(AiGatewayClient.prototype, 'getSession').and.resolveTo(detail);
    start = spyOn(AiGatewayClient.prototype, 'startAnalysis').and.resolveTo(
      session,
    );
    stream = spyOn(AiGatewayClient.prototype, 'stream').and.callFake(
      async (_id: string, onEvent: (event: AiEvent) => void) => {
        events.forEach(onEvent);
      },
    );
    fixture = TestBed.createComponent(AiPanelComponent);
    component = fixture.componentInstance;
  });
  afterEach(() => {
    fixture.destroy();
    setLanguage('en');
    sessionStorage.removeItem('winscope.ai.active../ai/');
  });
  async function initialize(): Promise<void> {
    component.endpoint = './ai/';
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  function modelTrigger(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('.model-select');
  }

  async function openModelMenu(): Promise<HTMLElement> {
    modelTrigger().querySelector<HTMLElement>('.model-label')!.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    return TestBed.inject(OverlayContainer).getContainerElement()
      .querySelector<HTMLElement>('.conversation-model-list')!;
  }

  async function settleWindow(): Promise<void> {
    fixture.detectChanges();
    await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    await fixture.whenStable();
    fixture.detectChanges();
  }

  function resizeHandle(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('.ai-window-resize');
  }

  function pointerResize(type: string, x: number, y: number, pointerId = 1, button = 0): void {
    resizeHandle().dispatchEvent(new PointerEvent(type, {pointerId, button, clientX: x, clientY: y, bubbles: true, cancelable: true}));
  }

  function mockPointerCapture(): jasmine.Spy {
    spyOn(resizeHandle(), 'setPointerCapture');
    spyOn(resizeHandle(), 'hasPointerCapture').and.returnValue(true);
    return spyOn(resizeHandle(), 'releasePointerCapture');
  }

  it('collapses and reopens desktop history without changing the conversation, search or draft', async () => {
    await initialize();
    await settleWindow();
    component.prompt = 'Unsent message';
    component.searchQuery = 'Saved';
    component.sessionId = 'a';
    component.running = true;
    const selection = component.modelSelection;
    const sidebar: HTMLElement = fixture.nativeElement.querySelector('.ai-sidebar');
    const toggle: HTMLButtonElement = fixture.nativeElement.querySelector('.history-toggle');
    expect(component.compactWindow).toBeFalse();
    expect(toggle.getAttribute('aria-controls')).toBe(sidebar.id);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    toggle.click();
    fixture.detectChanges();
    expect(sidebar.hidden).toBeTrue();
    expect(getComputedStyle(sidebar).display).toBe('none');
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    toggle.click();
    fixture.detectChanges();
    expect(sidebar.hidden).toBeFalse();
    sidebar.querySelector<HTMLButtonElement>('[aria-label="Close conversation browser"]')!.click();
    fixture.detectChanges();
    expect(sidebar.hidden).toBeTrue();
    expect(document.activeElement).toBe(toggle);
    toggle.click();
    fixture.detectChanges();
    expect(component.prompt).toBe('Unsent message');
    expect(component.searchQuery).toBe('Saved');
    expect(component.sessionId).toBe('a');
    expect(component.running).toBeTrue();
    expect(component.modelSelection).toEqual(selection);
  });

  it('uses an overlay for a compact resized window and retains the desktop collapse preference', async () => {
    await initialize();
    await settleWindow();
    component.toggleSidebar();
    component.windowSize = {width: 640, height: 420};
    await settleWindow();
    expect(component.compactWindow).toBeTrue();
    expect(component.sidebarVisible).toBeFalse();
    const closed = spyOn(component.closed, 'emit');
    fixture.nativeElement.querySelector('.history-toggle').click();
    fixture.detectChanges();
    expect(component.sidebarVisible).toBeTrue();
    expect(fixture.nativeElement.querySelector('.ai-sidebar.open')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.sidebar-backdrop')).not.toBeNull();
    component.onEscape(new KeyboardEvent('keydown', {key: 'Escape'}));
    fixture.detectChanges();
    expect(component.sidebarVisible).toBeFalse();
    expect(closed).not.toHaveBeenCalled();
    component.toggleSidebar();
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.sidebar-backdrop').click();
    fixture.detectChanges();
    expect(component.sidebarOpen).toBeFalse();
    component.windowSize = {width: 900, height: 650};
    await settleWindow();
    expect(component.compactWindow).toBeFalse();
    expect(component.sidebarVisible).toBeFalse();
    component.toggleSidebar();
    fixture.detectChanges();
    expect(component.sidebarVisible).toBeTrue();
  });

  it('clamps pointer resizing to the minimum window dimensions and available viewport', async () => {
    await initialize();
    const panel = component.windowPanel!.nativeElement;
    const maximum = {width: panel.offsetWidth, height: panel.offsetHeight};
    const release = mockPointerCapture();
    pointerResize('pointerdown', 1000, 700);
    pointerResize('pointermove', -10000, -10000);
    fixture.detectChanges();
    expect(component.windowSize).toEqual(component.minWindowSize);
    expect(panel.offsetWidth).toBe(640);
    expect(panel.offsetHeight).toBe(420);
    pointerResize('pointermove', 10000, 10000);
    fixture.detectChanges();
    expect(component.windowSize!.width).toBeCloseTo(maximum.width, 0);
    expect(component.windowSize!.height).toBeCloseTo(maximum.height, 0);
    pointerResize('pointerup', 10000, 10000);
    expect(release).toHaveBeenCalledOnceWith(1);
    const size = {...component.windowSize!};
    pointerResize('pointermove', -10000, -10000);
    expect(component.windowSize).toEqual(size);
  });

  it('ignores secondary or unrelated pointers and releases resizing when cancelled or suspended', async () => {
    await initialize();
    const release = mockPointerCapture();
    pointerResize('pointerdown', 100, 100, 2, 2);
    pointerResize('pointermove', 0, 0, 2);
    expect(component.windowSize).toBeUndefined();
    pointerResize('pointerdown', 100, 100);
    pointerResize('pointermove', 0, 0, 2);
    expect(component.windowSize).toBeUndefined();
    pointerResize('pointercancel', 100, 100);
    expect(release).toHaveBeenCalledOnceWith(1);
    pointerResize('pointerdown', 100, 100);
    fixture.componentRef.setInput('suspended', true);
    fixture.detectChanges();
    expect(release).toHaveBeenCalledTimes(2);
    pointerResize('pointermove', 0, 0);
    expect(component.windowSize).toBeUndefined();
  });

  it('supports independent keyboard width and height resizing and resetting without clearing the draft', async () => {
    await initialize();
    component.windowSize = {width: 900, height: 650};
    component.prompt = 'Preserve this draft';
    await settleWindow();
    resizeHandle().dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowLeft', bubbles: true}));
    fixture.detectChanges();
    expect(component.windowSize).toEqual({width: 884, height: 650});
    resizeHandle().dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowUp', shiftKey: true, bubbles: true}));
    fixture.detectChanges();
    expect(component.windowSize).toEqual({width: 884, height: 586});
    resizeHandle().dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowRight', ctrlKey: true, bubbles: true}));
    expect(component.windowSize).toEqual({width: 884, height: 586});
    resizeHandle().dispatchEvent(new KeyboardEvent('keydown', {key: 'Home', bubbles: true}));
    fixture.detectChanges();
    expect(component.windowSize).toBeUndefined();
    expect(component.windowPanel!.nativeElement.style.width).toBe('');
    expect(component.prompt).toBe('Preserve this draft');
    component.windowSize = {width: 800, height: 500};
    fixture.detectChanges();
    resizeHandle().dispatchEvent(new MouseEvent('dblclick', {bubbles: true}));
    fixture.detectChanges();
    expect(component.windowSize).toBeUndefined();
  });

  it('converts physical pointer movement to CSS size at a non-default display scale', async () => {
    await initialize();
    component.windowSize = {width: 900, height: 500};
    fixture.detectChanges();
    const panel = component.windowPanel!.nativeElement;
    spyOn(panel, 'getBoundingClientRect').and.callFake(() => new DOMRect(10, 50, panel.offsetWidth * 1.25, panel.offsetHeight * 1.25));
    mockPointerCapture();
    pointerResize('pointerdown', 100, 100);
    pointerResize('pointermove', 150, 125);
    expect(component.windowSize).toEqual({width: 940, height: 520});
    pointerResize('pointerup', 150, 125);
  });

  it('keeps a long composer below the header and inside the minimum window height', async () => {
    await initialize();
    component.windowSize = {width: 640, height: 420};
    component.prompt = Array.from({length: 30}, (_, index) => `Line ${index}`).join('\n');
    fixture.detectChanges();
    component.resizeComposer();
    await settleWindow();
    const input: HTMLTextAreaElement = fixture.nativeElement.querySelector('.composer-input');
    const composer: HTMLElement = fixture.nativeElement.querySelector('.ai-composer');
    const header: HTMLElement = fixture.nativeElement.querySelector('.ai-panel-header');
    const panel = component.windowPanel!.nativeElement;
    expect(input.clientHeight).toBeLessThanOrEqual(Math.ceil(panel.clientHeight * 0.4));
    expect(input.scrollHeight).toBeGreaterThan(input.clientHeight);
    expect(composer.getBoundingClientRect().top).toBeGreaterThanOrEqual(header.getBoundingClientRect().bottom);
    expect(composer.getBoundingClientRect().bottom).toBeLessThanOrEqual(panel.getBoundingClientRect().bottom);
  });

  it('renders a clear unavailable state without an endpoint', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain(
      'AI gateway is not configured',
    );
  });

  it('uses explicit saved defaults for restored and new conversations', async () => {
    fixture.componentRef.setInput('defaults', {
      selection: {
        agentId: 'display-anomaly',
        providerId: 'test',
        modelId: 'default',
        customModel: '',
        reasoningLevel: 'low',
      },
      providerSelections: {},
    });
    sessionStorage.setItem('winscope.ai.active../ai/', 'a');
    const ready = spyOn(component.selectionReady, 'emit');
    await initialize();
    expect(component.modelSelection.modelId).toBe('default');
    expect(component.selectedLevel).toBe('low');
    expect(ready).toHaveBeenCalledWith(
      jasmine.objectContaining({modelId: 'default', reasoningLevel: 'low'}),
    );
    component.newSession();
    expect(component.modelSelection.modelId).toBe('default');
    expect(component.selectedLevel).toBe('low');
  });

  it('preserves restored routing when defaults have no explicit active provider', async () => {
    loadCatalog.and.resolveTo({
      ...catalog,
      providers: [...catalog.providers, {...imported, reasoningLevels: ['high']}],
    });
    get.and.resolveTo({...detail, providerId: 'codex', modelId: 'historical/model[1m]'});
    fixture.componentRef.setInput('defaults', {
      selection: {...configuredDefaults.selection, providerId: '', modelId: 'default'},
      providerSelections: {},
    });
    sessionStorage.setItem('winscope.ai.active../ai/', 'a');
    await initialize();
    expect(component.selectedProvider).toBe('codex');
    expect(component.selectedModel).toBe('__custom__');
    expect(component.customModel).toBe('historical/model[1m]');
    expect(component.conversationModels.map((group) => group.providerId)).toEqual(['codex']);
    fixture.componentRef.setInput('defaults', {
      selection: {...component.modelSelection, providerId: '', modelId: 'default', reasoningLevel: 'low'},
      providerSelections: {},
    });
    fixture.detectChanges();
    expect(component.selectedModel).toBe('__custom__');
    expect(component.selectedLevel).toBe('high');
    component.prompt = 'Continue historical routing';
    await component.submit();
    expect(start.calls.mostRecent().args[4]).toEqual(jasmine.objectContaining({
      providerId: 'codex', modelId: 'historical/model[1m]', reasoningLevel: 'high',
    }));
  });

  it('routes a saved transcript through the configured active provider without changing its session agent', async () => {
    loadCatalog.and.resolveTo({...catalog, providers: [...catalog.providers, imported]});
    fixture.componentRef.setInput('defaults', {
      ...configuredDefaults,
      selection: {...configuredDefaults.selection, agentId: 'different-agent'},
    });
    sessionStorage.setItem('winscope.ai.active../ai/', 'a');
    const ready = spyOn(component.selectionReady, 'emit');
    await initialize();
    expect(component.sessionId).toBe('a');
    expect(component.turns[0].response).toBe('Saved answer');
    expect(component.selectedAgent).toBe(detail.agentId);
    expect(component.conversationModel).toBe(JSON.stringify(['codex', 'preferred[1m]']));
    expect(ready).toHaveBeenCalledWith(jasmine.objectContaining({
      agentId: detail.agentId, providerId: 'codex', modelId: 'preferred[1m]', reasoningLevel: 'high',
    }));
    component.prompt = 'Continue with active provider';
    await component.submit();
    expect(start.calls.mostRecent().args[1]).toBe(detail.agentId);
    expect(start.calls.mostRecent().args[4]).toEqual(jasmine.objectContaining({
      sessionId: 'a', providerId: 'codex', modelId: 'preferred[1m]', reasoningLevel: 'high',
    }));
  });

  it('keeps the configured routing across session switches and applies idle settings without replacing agents', async () => {
    await initialize();
    await component.selectSession('a');
    fixture.componentRef.setInput('settingsCatalog', {...catalog, providers: [...catalog.providers, imported]});
    fixture.componentRef.setInput('defaults', configuredDefaults);
    fixture.detectChanges();
    expect(component.selectedProvider).toBe('codex');
    expect(component.selectedModel).toBe('preferred[1m]');
    component.prompt = 'Draft for a';
    get.and.resolveTo({...detail, sessionId: 'b', agentId: 'evidence', providerId: 'test', modelId: 'default'});
    await component.selectSession('b');
    expect(component.selectedAgent).toBe('evidence');
    expect(component.selectedModel).toBe('preferred[1m]');
    expect(component.selectedLevel).toBe('high');
    component.prompt = 'Draft for b';
    get.and.resolveTo(detail);
    await component.selectSession('a');
    expect(component.prompt).toBe('Draft for a');
    expect(component.selectedAgent).toBe(detail.agentId);
    expect(component.selectedProvider).toBe('codex');
    expect(component.selectedModel).toBe('preferred[1m]');
    component.newSession();
    expect(component.selectedAgent).toBe(configuredDefaults.selection.agentId);
    expect(component.conversationModel).toBe(JSON.stringify(['codex', 'preferred[1m]']));
  });

  it('hides and resumes the workspace without discarding its active stream or draft', async () => {
    await initialize();
    get.and.resolveTo({
      ...detail,
      status: 'running',
      events: [detail.events[0]],
    });
    stream.and.returnValue(new Promise<void>(() => undefined));
    await component.selectSession('a');
    component.prompt = 'Preserve this draft';
    const signal = stream.calls.mostRecent().args[2] as AbortSignal;
    const close = spyOn(component.closed, 'emit');
    fixture.componentRef.setInput('suspended', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.ai-panel').style.display).toBe(
      'none',
    );
    expect(signal.aborted).toBeFalse();
    component.onEscape(new KeyboardEvent('keydown', {key: 'Escape'}));
    expect(close).not.toHaveBeenCalled();
    fixture.componentRef.setInput('settingsCatalog', {
      ...catalog,
      providers: [...catalog.providers, imported],
    });
    fixture.componentRef.setInput('suspended', false);
    fixture.detectChanges();
    expect(component.catalog.providers.length).toBe(1);
    expect(component.sessionId).toBe('a');
    expect(component.prompt).toBe('Preserve this draft');
    expect(signal.aborted).toBeFalse();
  });

  it('switches chrome, accessibility and cached notices without translating conversation content', async () => {
    await initialize();
    component.sessions = [{...session, title: 'Settings'}];
    component.sessionId = 'a';
    component.turns = [
      {
        id: 1,
        prompt: 'Settings',
        response: 'Privacy',
        status: 'completed',
        activity: 'Completed',
        attachments: [],
        links: [],
      },
    ];
    component.prompt = 'My next question';
    component.attachments = [
      {name: 'AI settings', mimeType: 'text/plain', content: 'Untouched note'},
    ];
    component.notice = 'Copied to clipboard.';
    component.error =
      'Only .txt, .md and .json notes up to 64 KiB are supported. Load trace/video files in WinScope instead.';
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const textarea = fixture.nativeElement.querySelector(
      'textarea',
    ) as HTMLTextAreaElement;
    expect(textarea.placeholder).toBe('Message WinScope');
    setLanguage('zh-CN');
    fixture.detectChanges();
    expect(textarea.placeholder).toBe('向 WinScope 提问');
    expect(textarea.getAttribute('aria-label')).toBe('消息');
    expect(textarea.value).toBe('My next question');
    expect(
      fixture.nativeElement.querySelector('.conversation-heading h2')
        .textContent,
    ).toBe('Settings');
    expect(
      fixture.nativeElement.querySelector('.user-message .message-text')
        .textContent,
    ).toBe('Settings');
    expect(
      fixture.nativeElement.querySelector('.assistant-content').textContent,
    ).toBe('Privacy');
    expect(
      fixture.nativeElement.querySelector('.turn-status').textContent,
    ).toBe('已完成');
    expect(
      fixture.nativeElement.querySelector('.session-meta').textContent,
    ).toContain('已完成');
    expect(
      fixture.nativeElement
        .querySelector('.attachment-remove')
        .getAttribute('aria-label'),
    ).toBe('移除 AI settings');
    expect(
      fixture.nativeElement.querySelector('.attachment-info').textContent,
    ).toContain('AI settings');
    expect(
      fixture.nativeElement.querySelector('.attachment-info').textContent,
    ).toContain('个字符 · 文本备注');
    expect(fixture.nativeElement.querySelector('.ai-notice').textContent).toBe(
      '已复制到剪贴板。',
    );
    expect(
      fixture.nativeElement.querySelector('.ai-error').textContent,
    ).toContain('仅支持不超过 64 KiB');
    expect(component.activityText('Running skill: black-screen')).toBe(
      '正在运行技能：black-screen',
    );
    expect(component.activityText('Waiting for lm-studio…')).toBe(
      '正在等待 lm-studio…',
    );
    expect(component.errorText('AI report failed (503)')).toBe(
      'AI 报告获取失败（503）',
    );
    expect(component.errorText('AI stream failed (404)')).toBe(
      'AI 流式连接失败（404）',
    );
    expect(component.errorText('Could not reach the AI gateway. Check the connection and try again.'))
      .toBe('无法连接 AI 网关，请检查连接后重试。');
    expect(component.errorText('The AI connection was interrupted. Reopen this conversation to reconnect.'))
      .toBe('AI 连接已中断，请重新打开此会话以恢复连接。');
    component.error = 'Provider diagnostic: keep exact IDs';
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.ai-error').textContent).toBe(
      component.error,
    );
    setLanguage('en');
    fixture.detectChanges();
    expect(textarea.placeholder).toBe('Message WinScope');
    expect(fixture.nativeElement.querySelector('.ai-notice').textContent).toBe(
      'Copied to clipboard.',
    );
  });

  it('renders assistant Markdown while copying its original source and leaving user messages literal', async () => {
    await initialize();
    const reply = '# Analysis\n\n**Observed:** `alpha = 0`\n\n| Layer | Alpha |\n|---|---|\n|app|0|';
    component.turns = [{id: 1, prompt: '# User text **must stay literal**', response: reply,
      attachments: [], links: [], status: 'completed', activity: 'Completed'}];
    const copy = spyOn(component, 'copyText').and.resolveTo();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.assistant-content h1')?.textContent.trim()).toBe('Analysis');
    expect(fixture.nativeElement.querySelector('.assistant-content table')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.user-message h1, .user-message strong')).toBeNull();
    expect(fixture.nativeElement.querySelector('.user-message .message-text').textContent).toBe('# User text **must stay literal**');
    fixture.nativeElement.querySelector('[aria-label="Copy response"]').click();
    expect(copy).toHaveBeenCalledOnceWith(reply);
  });
  describe('read-only trace query bridge', () => {
    const snapshot: WinscopeTraceSnapshot = {
      schemaVersion: '1', mode: 'current', requestedTimestampNs: '2000000000',
      requestedTime: '2s', entries: [], incompleteReasons: [], truncated: false,
    };

    it('sends WindowManager time alignment and actual window properties with the current snapshot', async () => {
      await initialize();
      const current: WinscopeTraceSnapshot = {
        ...snapshot,
        entries: [{traceType: 'WINDOW_MANAGER', sourceIndex: 0, descriptors: ['wm.trace'],
          index: 12, timestampNs: '1999999990', time: '1s999ms999990ns', match: 'before',
          data: {focusedWindow: 'app.window', alpha: 0}, incompleteReasons: [], truncated: false}],
        windowManager: {status: 'available', incompleteReasons: [], entries: [{sourceIndex: 0,
          index: 12, requestedTimestampNs: '2000000000', timestampNs: '1999999990',
          time: '1s999ms999990ns', deltaNs: '-10', match: 'before', dataPath: 'entries.0.data',
          incompleteReasons: [], truncated: false}]},
      };
      component.traceQuery = jasmine.createSpy('query').and.resolveTo(current);
      component.prompt = 'Analyze WindowManager at the current time';
      await component.submit();
      const evidence = start.calls.mostRecent().args[2];
      expect(evidence.winscope.windowManager.entries[0].deltaNs).toBe('-10');
      expect(evidence.winscope.windowManager.entries[0].requestedTimestampNs).toBe('2000000000');
      expect(evidence.winscope.entries[0].data.focusedWindow).toBe('app.window');
    });

    it('captures the current manual frame on send and answers a specified-time request once', async () => {
      await initialize();
      const query = jasmine.createSpy('query').and.callFake(async (request: {time?: string}) => ({
        ...snapshot, ...(request.time ? {mode: 'timestamp', requestedTime: request.time} : {}),
      }));
      component.traceQuery = query;
      const respond = spyOn(AiGatewayClient.prototype, 'respondToTraceQuery').and.resolveTo();
      let requestEvent: AiEvent;
      stream.and.callFake(async (_id: string, onEvent: (event: AiEvent) => void) => {
        const options = start.calls.mostRecent().args[4];
        requestEvent = {id: 2, type: 'trace_query_requested', data: {
          contextId: options.traceQueryContextId, queryId: 'query-1', query: {time: '1s500ms'},
        }};
        onEvent({id: 1, type: 'analysis_started', data: {prompt: 'Analyze at 1s500ms'}});
        onEvent(requestEvent);
        onEvent(requestEvent);
        await Promise.resolve();
        await Promise.resolve();
        onEvent({id: 3, type: 'analysis_completed', data: {provider: {output: 'Actual analysis'}}});
      });
      component.prompt = 'Analyze at 1s500ms';
      await component.submit();
      expect(query.calls.allArgs()).toEqual([[{}], [{time: '1s500ms'}]]);
      expect(start.calls.mostRecent().args[2]).toEqual({winscope: snapshot});
      expect(start.calls.mostRecent().args[4].traceQueryEnabled).toBeTrue();
      expect(respond).toHaveBeenCalledTimes(1);
      expect(respond.calls.mostRecent().args.slice(0, 4)).toEqual([
        'a', 'query-1', start.calls.mostRecent().args[4].traceQueryContextId,
        {result: {...snapshot, mode: 'timestamp', requestedTime: '1s500ms'}},
      ]);
      expect(component.turns[0].response).toBe('Actual analysis');
    });

    it('sends no trace or query capability when trace context is disabled', async () => {
      await initialize();
      component.traceQuery = jasmine.createSpy('query').and.resolveTo(snapshot);
      component.includeEvidence = false;
      component.evidence = {private: 'local data'};
      component.prompt = 'General question';
      await component.submit();
      expect(component.traceQuery).not.toHaveBeenCalled();
      expect(start.calls.mostRecent().args[2]).toBeUndefined();
      expect(start.calls.mostRecent().args[4].traceQueryEnabled).toBeUndefined();
      expect(start.calls.mostRecent().args[4].traceQueryContextId).toBeUndefined();
    });

    it('ignores stale context IDs and sends a bounded query error rather than old data', async () => {
      await initialize();
      const query = jasmine.createSpy('query').and.callFake(async (request: {time?: string}) => {
        if (request.time) throw new Error('Invalid trace query time.');
        return snapshot;
      });
      component.traceQuery = query;
      const respond = spyOn(AiGatewayClient.prototype, 'respondToTraceQuery').and.resolveTo();
      stream.and.callFake(async (_id: string, onEvent: (event: AiEvent) => void) => {
        const contextId = start.calls.mostRecent().args[4].traceQueryContextId;
        onEvent({id: 2, type: 'trace_query_requested', data: {contextId: 'old-context', queryId: 'old', query: {}}});
        onEvent({id: 3, type: 'trace_query_requested', data: {contextId, queryId: 'current', query: {time: 'outside'}}});
        await Promise.resolve();
        await Promise.resolve();
        onEvent({id: 4, type: 'analysis_completed', data: {}});
      });
      component.prompt = 'Analyze time';
      await component.submit();
      expect(query).toHaveBeenCalledTimes(2);
      expect(respond).toHaveBeenCalledTimes(1);
      expect(respond.calls.mostRecent().args[3]).toEqual({error: 'Invalid trace query time.'});
    });

    it('drops a pending result after cancellation', async () => {
      await initialize();
      let finishQuery!: (value: WinscopeTraceSnapshot) => void;
      component.traceQuery = jasmine.createSpy('query').and.callFake(async (request: {time?: string}) => {
        if (!request.time) return snapshot;
        return new Promise<WinscopeTraceSnapshot>((resolve) => { finishQuery = resolve; });
      });
      const respond = spyOn(AiGatewayClient.prototype, 'respondToTraceQuery').and.resolveTo();
      const cancel = spyOn(AiGatewayClient.prototype, 'cancel').and.resolveTo();
      stream.and.callFake(async (_id: string, onEvent: (event: AiEvent) => void) => {
        onEvent({id: 2, type: 'trace_query_requested', data: {
          contextId: start.calls.mostRecent().args[4].traceQueryContextId,
          queryId: 'pending', query: {time: '1s'},
        }});
        await component.cancel();
        finishQuery(snapshot);
        await Promise.resolve();
        onEvent({id: 3, type: 'analysis_cancelled'});
      });
      component.prompt = 'Analyze time';
      await component.submit();
      expect(cancel).toHaveBeenCalledOnceWith('a');
      expect(respond).not.toHaveBeenCalled();
    });

    it('preserves the draft and prevents sending when current data cannot be read', async () => {
      await initialize();
      component.traceQuery = jasmine.createSpy('query').and.rejectWith(new Error('The loaded traces have changed.'));
      component.prompt = 'Analyze current time';
      await component.submit();
      expect(start).not.toHaveBeenCalled();
      expect(component.prompt).toBe('Analyze current time');
      expect(component.running).toBeFalse();
      expect(component.error).toBe('The loaded traces have changed.');
    });

    it('revokes a pending result when trace context is turned off', async () => {
      await initialize();
      let finishQuery!: (value: WinscopeTraceSnapshot) => void;
      component.traceQuery = jasmine.createSpy('query').and.callFake(async (request: {time?: string}) => {
        if (!request.time) return snapshot;
        return new Promise<WinscopeTraceSnapshot>((resolve) => { finishQuery = resolve; });
      });
      const respond = spyOn(AiGatewayClient.prototype, 'respondToTraceQuery').and.resolveTo();
      stream.and.callFake(async (_id: string, onEvent: (event: AiEvent) => void) => {
        onEvent({id: 2, type: 'trace_query_requested', data: {
          contextId: start.calls.mostRecent().args[4].traceQueryContextId,
          queryId: 'pending', query: {time: '1s'},
        }});
        component.toggleTraceContext();
        finishQuery(snapshot);
        await Promise.resolve();
        onEvent({id: 3, type: 'analysis_completed', data: {}});
      });
      component.prompt = 'Analyze time';
      await component.submit();
      expect(component.includeEvidence).toBeFalse();
      expect(respond).toHaveBeenCalledTimes(1);
      expect(respond.calls.mostRecent().args[3]).toEqual({error: 'Trace query authorization is no longer available.'});
    });

    it('does not send the initial snapshot if trace consent is revoked during the read', async () => {
      await initialize();
      let finishQuery!: (value: WinscopeTraceSnapshot) => void;
      component.traceQuery = () => new Promise((resolve) => { finishQuery = resolve; });
      component.prompt = 'Private question';
      const submission = component.submit();
      component.toggleTraceContext();
      finishQuery(snapshot);
      await submission;
      expect(start).not.toHaveBeenCalled();
      expect(component.prompt).toBe('Private question');
      expect(component.running).toBeFalse();
      expect(component.submitting).toBeFalse();
      expect(component.includeEvidence).toBeFalse();
    });

    it('recovers an authorized pending query when reconnecting the same running conversation', async () => {
      await initialize();
      const query = jasmine.createSpy('query').and.resolveTo(snapshot);
      component.traceQuery = query;
      const respond = spyOn(AiGatewayClient.prototype, 'respondToTraceQuery').and.resolveTo();
      stream.and.callFake(async () => undefined);
      component.prompt = 'Analyze current position';
      await component.submit();
      const contextId = start.calls.mostRecent().args[4].traceQueryContextId;
      const pendingTraceQuery = {contextId, queryId: 'pending-reconnect', query: {time: '1s'}};
      get.and.resolveTo({...detail, status: 'running', pendingTraceQuery,
        events: [
          {id: 1, event: {type: 'analysis_started', data: {prompt: 'Analyze current position'}}},
          {id: 2, event: {type: 'trace_query_requested', data: pendingTraceQuery}},
        ],
      });
      stream.and.callFake(async (_id: string, onEvent: (event: AiEvent) => void) => {
        await Promise.resolve();
        await Promise.resolve();
        onEvent({id: 3, type: 'analysis_completed', data: {provider: {output: 'Reconnected answer'}}});
      });
      await component.selectSession('a');
      await fixture.whenStable();
      expect(query.calls.allArgs()).toEqual([[{}], [{time: '1s'}]]);
      expect(respond).toHaveBeenCalledTimes(1);
      expect(respond.calls.mostRecent().args.slice(0, 4)).toEqual(['a', 'pending-reconnect', contextId, {result: snapshot}]);
    });

    it('declines a restored pending query without reconstructing consent from server events', async () => {
      await initialize();
      const query = jasmine.createSpy('query').and.resolveTo(snapshot);
      component.traceQuery = query;
      const pendingTraceQuery = {contextId: 'old-context', queryId: 'old-query', query: {}};
      get.and.resolveTo({...detail, status: 'running', pendingTraceQuery});
      const respond = spyOn(AiGatewayClient.prototype, 'respondToTraceQuery').and.resolveTo();
      stream.and.callFake(async (_id: string, onEvent: (event: AiEvent) => void) => {
        onEvent({id: 3, type: 'analysis_completed', data: {}});
      });
      await component.selectSession('a');
      expect(query).not.toHaveBeenCalled();
      expect(respond.calls.mostRecent().args[3]).toEqual({error: 'Trace query authorization is no longer available.'});
    });

    it('declines later SSE queries after restoring a session without trace authorization', async () => {
      await initialize();
      const query = jasmine.createSpy('query').and.resolveTo(snapshot);
      component.traceQuery = query;
      get.and.resolveTo({...detail, status: 'running'});
      const respond = spyOn(AiGatewayClient.prototype, 'respondToTraceQuery').and.resolveTo();
      stream.and.callFake(async (_id: string, onEvent: (event: AiEvent) => void) => {
        onEvent({id: 3, type: 'trace_query_requested', data: {
          contextId: 'restored-context', queryId: 'later-query', query: {time: '1s'},
        }});
        await Promise.resolve();
        onEvent({id: 4, type: 'analysis_completed', data: {}});
      });
      await component.selectSession('a');
      await fixture.whenStable();
      expect(query).not.toHaveBeenCalled();
      expect(respond.calls.mostRecent().args.slice(0, 4)).toEqual([
        'a', 'later-query', 'restored-context', {error: 'Trace query authorization is no longer available.'},
      ]);
    });

    it('offers a localized current-frame question without sending automatically', async () => {
      await initialize();
      component.traceQuery = jasmine.createSpy('query').and.resolveTo(snapshot);
      setLanguage('zh-CN');
      fixture.detectChanges();
      fixture.nativeElement.querySelector('.composer-add').click();
      fixture.detectChanges();
      await fixture.whenStable();
      const overlay = TestBed.inject(OverlayContainer).getContainerElement();
      const button = Array.from(overlay.querySelectorAll<HTMLButtonElement>('button'))
        .find((item) => item.textContent?.includes('分析当前帧'))!;
      expect(button.disabled).toBeFalse();
      button.click();
      await settleWindow();
      expect(component.prompt).toBe('获取当前时间轴位置的 WinScope 数据并进行分析。');
      expect(start).not.toHaveBeenCalled();
      expect(component.traceQuery).not.toHaveBeenCalled();
    });
  });

  describe('localized prompt suggestions', () => {
    const suggestions = [
      {
        label: {'en': 'Investigate a black screen', 'zh-CN': '排查黑屏'},
        prompt: {
          'en': 'Investigate black-screen intervals in the available evidence',
          'zh-CN': '排查现有证据中的黑屏时间段。',
        },
      },
      {
        label: {'en': 'Find flicker evidence', 'zh-CN': '查找闪烁证据'},
        prompt: {
          'en': 'Find flicker and explain what evidence is missing',
          'zh-CN': '查找闪烁证据，并说明还缺少哪些证据。',
        },
      },
    ];

    async function clickSuggestion(
      entry: 'empty state' | 'composer menu',
      label: string,
    ): Promise<void> {
      let buttons: NodeListOf<HTMLButtonElement>;
      if (entry === 'composer menu') {
        fixture.nativeElement.querySelector('.composer-add').click();
        fixture.detectChanges();
        await fixture.whenStable();
        buttons = TestBed.inject(OverlayContainer).getContainerElement()
          .querySelectorAll('button[mat-menu-item]');
      } else {
        buttons = fixture.nativeElement.querySelectorAll('.suggestions button');
      }
      const button = Array.from(buttons).find((item) => item.textContent?.includes(label));
      expect(button).withContext(`Missing suggestion: ${label}`).toBeDefined();
      button!.click();
      await settleWindow();
    }

    for (const entry of ['empty state', 'composer menu'] as const) {
      for (const locale of ['en', 'zh-CN'] as const) {
        for (const suggestion of suggestions) {
          it(`inserts ${suggestion.label.en} in ${locale} from the ${entry} without sending`, async () => {
            await initialize();
            setLanguage(locale);
            fixture.detectChanges();
            await clickSuggestion(entry, suggestion.label[locale]);
            const textarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
            expect(component.prompt).toBe(suggestion.prompt[locale]);
            expect(textarea.value).toBe(suggestion.prompt[locale]);
            expect(document.activeElement).toBe(textarea);
            expect(start).not.toHaveBeenCalled();
          });
        }
      }

      it(`uses the language at click time in the ${entry} and preserves existing drafts on language changes`, async () => {
        await initialize();
        await clickSuggestion(entry, suggestions[0].label.en);
        component.prompt += ' My own note';
        await settleWindow();
        const draft = component.prompt;
        setLanguage('zh-CN');
        await settleWindow();
        expect(component.prompt).toBe(draft);
        expect(fixture.nativeElement.querySelector('textarea').value).toBe(draft);
        await clickSuggestion(entry, suggestions[1].label['zh-CN']);
        expect(component.prompt).toBe(suggestions[1].prompt['zh-CN']);
        setLanguage('en');
        await settleWindow();
        expect(component.prompt).toBe(suggestions[1].prompt['zh-CN']);
        await clickSuggestion(entry, suggestions[0].label.en);
        expect(component.prompt).toBe(suggestions[0].prompt.en);
        expect(start).not.toHaveBeenCalled();
      });

      it(`follows resolved system language changes in the ${entry} without changing the draft`, async () => {
        await initialize();
        const browserLanguages = spyOnProperty(navigator, 'languages', 'get')
          .and.returnValue(['zh-TW']);
        setLanguage('system');
        fixture.detectChanges();
        await clickSuggestion(entry, suggestions[0].label['zh-CN']);
        expect(component.prompt).toBe(suggestions[0].prompt['zh-CN']);
        browserLanguages.and.returnValue(['en-US']);
        window.dispatchEvent(new Event('languagechange'));
        await settleWindow();
        expect(component.prompt).toBe(suggestions[0].prompt['zh-CN']);
        await clickSuggestion(entry, suggestions[1].label.en);
        expect(component.prompt).toBe(suggestions[1].prompt.en);
        expect(start).not.toHaveBeenCalled();
      });
    }
  });

  it('loads searchable history and restores the active transcript and controls', async () => {
    sessionStorage.setItem('winscope.ai.active../ai/', 'a');
    await initialize();
    expect(component.turns[0].response).toBe('Saved answer');
    expect(component.selectedModel).toBe('test-model');
    expect(component.selectedLevel).toBe('high');
    component.searchQuery = 'missing';
    expect(component.filteredSessions).toEqual([]);
    component.searchQuery = 'saved';
    expect(component.filteredSessions.length).toBe(1);
    expect(
      fixture.nativeElement.querySelector('.user-message').textContent,
    ).toContain('Saved question');
  });
  it('continues the same session with model, effort, context and actual attachment text', async () => {
    await initialize();
    await component.selectSession('a');
    component.prompt = 'Follow-up';
    component.evidence = {video: {}};
    component.attachments = [
      {name: 'notes.md', mimeType: 'text/markdown', content: 'Actual context'},
    ];
    await component.submit();
    const args = start.calls.mostRecent().args;
    expect(args[0]).toBe('Follow-up');
    expect(args[2]).toEqual({video: {}});
    expect(args[4]).toEqual(
      jasmine.objectContaining({
        sessionId: 'a',
        providerId: 'test',
        modelId: 'test-model',
        reasoningLevel: 'high',
        attachments: [
          {
            name: 'notes.md',
            mimeType: 'text/markdown',
            content: 'Actual context',
          },
        ],
      }),
    );
    expect(stream.calls.mostRecent().args[3]).toBe(2);
  });
  it('excludes trace context when removed and keeps new draft text typed during submission', async () => {
    await initialize();
    let resolve!: (value: AiSessionSummary) => void;
    start.and.returnValue(
      new Promise<AiSessionSummary>((done) => {
        resolve = done;
      }),
    );
    component.prompt = 'First prompt';
    component.includeEvidence = false;
    component.evidence = {video: {}};
    const pending = component.submit();
    component.prompt = 'Next draft';
    resolve(session);
    await pending;
    expect(component.prompt).toBe('Next draft');
    expect(start.calls.mostRecent().args[2]).toBeUndefined();
  });
  it('keeps per-session drafts and ignores late session responses', async () => {
    await initialize();
    component.prompt = 'New conversation draft';
    let resolve!: (value: AiSessionDetail) => void;
    get.and.returnValue(
      new Promise<AiSessionDetail>((done) => {
        resolve = done;
      }),
    );
    const pending = component.selectSession('a');
    component.newSession();
    resolve(detail);
    await pending;
    expect(component.sessionId).toBe('');
    expect(component.prompt).toBe('New conversation draft');
    expect(component.turns).toEqual([]);
  });
  it('supports Enter send, Shift+Enter newline and IME safety', async () => {
    await initialize();
    const submit = spyOn(component, 'submit').and.resolveTo();
    component.onComposerKey(
      new KeyboardEvent('keydown', {key: 'Enter', shiftKey: true}),
    );
    component.onComposerKey(
      new KeyboardEvent('keydown', {key: 'Enter', isComposing: true}),
    );
    expect(submit).not.toHaveBeenCalled();
    const event = new KeyboardEvent('keydown', {
      key: 'Enter',
      cancelable: true,
    });
    component.onComposerKey(event);
    expect(event.defaultPrevented).toBeTrue();
    expect(submit).toHaveBeenCalledTimes(1);
  });

  it('shows localized completion duration without changing the response or showing a timer on old turns', async () => {
    await initialize();
    component.turns = [
      {id: 1, prompt: 'First', response: 'Answer', status: 'completed', activity: 'Completed', attachments: [], links: [], durationMs: 1250},
      {id: 2, prompt: 'Legacy', response: 'Old answer', status: 'completed', activity: 'Completed', attachments: [], links: []},
    ];
    setLanguage('zh-CN');
    fixture.detectChanges();
    const statuses = fixture.nativeElement.querySelectorAll('.turn-status');
    expect(statuses[0].textContent).toContain('已完成');
    expect(statuses[0].textContent).toContain('用时：1.3 秒');
    expect(statuses[1].querySelector('.turn-duration')).toBeNull();
    setLanguage('en');
    fixture.detectChanges();
    expect(statuses[0].textContent).toContain('Elapsed: 1.3 s');
  });

  it('keeps space and arrow keys local to the AI window without cancelling native editing', async () => {
    await initialize();
    const submit = spyOn(component, 'submit').and.resolveTo();
    const global = jasmine.createSpy('document shortcut');
    document.addEventListener('keydown', global);
    try {
      for (const selector of ['.composer-input', '.session-search input', '.composer-add']) {
        const target = fixture.nativeElement.querySelector(selector) as HTMLElement;
        expect(target).withContext(selector).not.toBeNull();
        for (const key of [' ', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']) {
          const event = new KeyboardEvent('keydown', {key, keyCode: key === ' ' ? 32 : 0, bubbles: true, cancelable: true});
          target.dispatchEvent(event);
          expect(event.defaultPrevented).withContext(`${selector} ${key}`).toBeFalse();
        }
      }
      expect(global).not.toHaveBeenCalled();
      expect(submit).not.toHaveBeenCalled();
    } finally { document.removeEventListener('keydown', global); }
  });

  it('still sends Enter and closes Escape after isolating keyboard events', async () => {
    await initialize();
    const submit = spyOn(component, 'submit').and.resolveTo();
    const closed = spyOn(component.closed, 'emit');
    const textarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('.composer-input');
    const enter = new KeyboardEvent('keydown', {key: 'Enter', bubbles: true, cancelable: true});
    textarea.dispatchEvent(enter);
    expect(enter.defaultPrevented).toBeTrue();
    expect(submit).toHaveBeenCalledTimes(1);
    textarea.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape', bubbles: true, cancelable: true}));
    expect(closed).toHaveBeenCalledTimes(1);
  });
  it('reads real text notes and rejects binary/oversized attachments', async () => {
    await initialize();
    const input = document.createElement('input');
    input.type = 'file';
    const transfer = new DataTransfer();
    transfer.items.add(new File(['Hello notes'], 'note.txt'));
    input.files = transfer.files;
    await component.attachFiles(input);
    expect(component.attachments[0].content).toBe('Hello notes');
    const invalid = new DataTransfer();
    invalid.items.add(new File(['binary'], 'trace.mp4'));
    input.files = invalid.files;
    await component.attachFiles(input);
    expect(component.error).toContain('Only .txt');
    expect(component.attachments.length).toBe(1);
  });
  it('previews untrusted reports as text, copies and exports both formats', async () => {
    await initialize();
    await component.selectSession('a');
    const report = spyOn(AiGatewayClient.prototype, 'report').and.resolveTo(
      new Blob(['<script>unsafe()</script>']),
    );
    const copy = spyOn(component, 'copyText').and.resolveTo();
    const click = spyOn(HTMLAnchorElement.prototype, 'click');
    await component.previewReport();
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('.report-preview script'),
    ).toBeNull();
    expect(
      fixture.nativeElement.querySelector('.report-preview pre').textContent,
    ).toContain('<script>');
    await component.copyReport();
    expect(copy).toHaveBeenCalledWith('<script>unsafe()</script>');
    await component.exportReport('markdown');
    await component.exportReport('html');
    expect(report).toHaveBeenCalledWith('a', 'markdown');
    expect(report).toHaveBeenCalledWith('a', 'html');
    expect(click).toHaveBeenCalledTimes(2);
  });
  it('disconnects the stream without cancelling analysis when the panel closes', async () => {
    await initialize();
    const cancel = spyOn(AiGatewayClient.prototype, 'cancel').and.resolveTo();
    const running = {...detail, status: 'running', events: [detail.events[0]]};
    get.and.resolveTo(running);
    stream.and.returnValue(new Promise<void>(() => undefined));
    await component.selectSession('a');
    const signal = stream.calls.mostRecent().args[2] as AbortSignal;
    component.ngOnDestroy();
    expect(signal.aborted).toBeTrue();
    expect(cancel).not.toHaveBeenCalled();
  });
  it('keeps the report filename tied to its original session across a switch', async () => {
    await initialize();
    await component.selectSession('a');
    let resolve!: (blob: Blob) => void;
    spyOn(AiGatewayClient.prototype, 'report').and.returnValue(
      new Promise<Blob>((done) => {
        resolve = done;
      }),
    );
    let filename = '';
    spyOn(HTMLAnchorElement.prototype, 'click').and.callFake(function (
      this: HTMLAnchorElement,
    ) {
      filename = this.download;
    });
    const download = component.exportReport('html');
    component.newSession();
    resolve(new Blob(['Report A']));
    await download;
    expect(filename).toBe('winscope-ai-a.html');
  });

  it('reveals the existing timeline when navigating to a finding', () => {
    const frame = spyOn(component.frameSelected, 'emit');
    const closed = spyOn(component.closed, 'emit');
    component.selectFrame(4);
    expect(frame).toHaveBeenCalledWith(4);
    expect(closed).toHaveBeenCalled();
  });
  it('does not submit repeated or Alt-modified Enter and preserves native newlines', async () => {
    await initialize();
    const send = spyOn(component, 'submit').and.resolveTo();
    for (const options of [{repeat: true}, {altKey: true}, {shiftKey: true}]) {
      component.onComposerKey(
        new KeyboardEvent('keydown', {key: 'Enter', ...options}),
      );
    }
    expect(send).not.toHaveBeenCalled();
  });
  it('requests independent settings without embedding settings or changing the draft', async () => {
    await initialize();
    expect(
      fixture.nativeElement
        .querySelector('.ai-composer .model-select')
        .getAttribute('aria-label'),
    ).toBe('Conversation model');
    component.prompt = 'Draft to keep';
    const requested = spyOn(component.settingsRequested, 'emit');
    fixture.nativeElement.querySelector('.ai-settings-button').click();
    expect(requested).toHaveBeenCalledOnceWith();
    expect(fixture.nativeElement.querySelector('ai-settings')).toBeNull();
    expect(fixture.nativeElement.querySelector('app-settings')).toBeNull();
    expect(component.prompt).toBe('Draft to keep');
  });

  it('opens every available model directly from the borderless label and marks the selected item', async () => {
    await initialize();
    component.prompt = 'Keep the composer draft';
    const trigger = modelTrigger();
    expect(trigger.tagName).toBe('BUTTON');
    expect(fixture.nativeElement.querySelector('.model-select select')).toBeNull();
    expect(getComputedStyle(trigger).borderWidth).toBe('0px');
    expect(getComputedStyle(trigger).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    const menu = await openModelMenu();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    const tooltip = fixture.debugElement.query(By.css('.model-select')).injector.get(MatTooltip);
    expect(tooltip.disabled).toBeTrue();
    const options = Array.from(menu.querySelectorAll<HTMLButtonElement>('[data-model-value]'));
    expect(options.map((option) => option.querySelector('.model-option-label')?.textContent?.trim())).toEqual(['Default', 'Test model']);
    expect(options.map((option) => option.getAttribute('role'))).toEqual(['menuitemradio', 'menuitemradio']);
    expect(options.map((option) => option.getAttribute('aria-checked'))).toEqual(['true', 'false']);
    options[1].click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.selectedModel).toBe('test-model');
    expect(trigger.querySelector('.model-label')?.textContent).toBe('Test model');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(tooltip.disabled).toBeFalse();
    expect(component.prompt).toBe('Keep the composer draft');
  });

  it('dismisses the model menu on Escape or outside click without closing the conversation or losing its draft', async () => {
    await initialize();
    component.prompt = 'Unsent draft';
    const closed = spyOn(component.closed, 'emit');
    const menu = await openModelMenu();
    menu.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape', keyCode: 27, bubbles: true}));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(modelTrigger().getAttribute('aria-expanded')).toBe('false');
    await openModelMenu();
    TestBed.inject(OverlayContainer).getContainerElement()
      .querySelector<HTMLElement>('.cdk-overlay-backdrop')!.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(modelTrigger().getAttribute('aria-expanded')).toBe('false');
    expect(component.prompt).toBe('Unsent draft');
    expect(component.selectedModel).toBe('default');
    expect(closed).not.toHaveBeenCalled();
  });

  it('restricts same-ID composer models to the active provider without changing history or supported effort', async () => {
    await initialize();
    component.catalog = {
      ...catalog,
      providers: [...catalog.providers, imported],
    };
    fixture.componentRef.setInput('defaults', configuredDefaults);
    component.prompt = 'Keep this draft';
    component.turns = [
      {
        id: 1,
        prompt: 'History',
        response: 'Answer',
        status: 'completed',
        activity: 'Completed',
        links: [],
        attachments: [],
      },
    ];
    component.selectedLevel = 'high';
    fixture.detectChanges();
    await fixture.whenStable();
    const menu = await openModelMenu();
    expect(menu.querySelectorAll('.model-group').length).toBe(1);
    expect(menu.querySelector('.model-group')?.getAttribute('aria-label')).toBe('Codex');
    component.changeConversationModel(JSON.stringify(['test', 'default']));
    expect(component.selectedProvider).toBe('codex');
    expect(component.selectedModel).toBe('preferred[1m]');
    Array.from(menu.querySelectorAll<HTMLButtonElement>('[data-model-value]'))
      .find((option) => option.getAttribute('data-model-value') === JSON.stringify(['codex', 'default']))!.click();
    expect(component.selectedProvider).toBe('codex');
    expect(component.selectedModel).toBe('default');
    expect(component.selectedLevel).toBe('medium');
    component.selectedLevel = 'high';
    component.changeConversationModel(
      JSON.stringify(['codex', 'preferred[1m]']),
    );
    expect(component.selectedLevel).toBe('high');
    component.changeConversationModel('not an option');
    expect(component.selectedModel).toBe('preferred[1m]');
    expect(component.prompt).toBe('Keep this draft');
    expect(component.turns[0].prompt).toBe('History');
    await component.submit();
    expect(start.calls.mostRecent().args[4]).toEqual(
      jasmine.objectContaining({
        providerId: 'codex',
        modelId: 'preferred[1m]',
        reasoningLevel: 'high',
      }),
    );
  });

  it('preserves a custom model within the active provider and rejects inactive provider overrides', async () => {
    await initialize();
    component.catalog = {
      ...catalog,
      providers: [...catalog.providers, imported],
    };
    component.applySettings({
      ...component.modelSelection,
      providerId: 'test',
      modelId: '__custom__',
      customModel: 'custom/model@[1m]',
    });
    fixture.detectChanges();
    await fixture.whenStable();
    const select = modelTrigger();
    const menu = await openModelMenu();
    const customValue = JSON.stringify(['test', '__custom__']);
    expect(select.value).toBe(customValue);
    expect(menu.textContent).toContain('custom/model@[1m]');
    component.changeConversationModel(JSON.stringify(['codex', 'default']));
    component.applySettings({...configuredDefaults.selection});
    expect(component.selectedProvider).toBe('test');
    expect(component.selectedModel).toBe('__custom__');
    component.changeConversationModel(JSON.stringify(['test', 'default']));
    expect(component.selectedModel).toBe('default');
    fixture.detectChanges();
    expect(menu.textContent).toContain('custom/model@[1m]');
    component.changeConversationModel(customValue);
    expect(component.selectedProvider).toBe('test');
    expect(component.selectedModel).toBe('__custom__');
    component.prompt = 'Use custom';
    await component.submit();
    expect(start.calls.mostRecent().args[4].modelId).toBe('custom/model@[1m]');
    setLanguage('zh-CN');
    fixture.detectChanges();
    expect(select.getAttribute('aria-label')).toBe('会话模型');
    expect(menu.textContent).toContain('自定义模型：custom/model@[1m]');
  });

  it('offers a deterministic fallback for a providerless agent', async () => {
    loadCatalog.and.resolveTo({
      ...catalog,
      providers: [...catalog.providers, imported],
      agents: [{id: 'evidence', name: 'Evidence'}],
    });
    await initialize();
    const select = modelTrigger();
    expect(select.value).toBe(JSON.stringify(['', 'default']));
    expect(select.textContent).toContain('No model · deterministic skills');
    expect(component.conversationModels.map((group) => group.providerId)).toEqual(['']);
    component.changeConversationModel(JSON.stringify(['codex', 'default']));
    component.applySettings(configuredDefaults.selection);
    expect(component.provider).toBeUndefined();
    component.changeConversationModel(select.value);
    component.prompt = 'Evidence only';
    await component.submit();
    expect(start.calls.mostRecent().args[4]).toEqual(
      jasmine.objectContaining({
        providerId: null,
        modelId: 'default',
        reasoningLevel: undefined,
      }),
    );
  });

  it('exposes saved custom models only for the active provider and sends their exact identifier', async () => {
    await initialize();
    fixture.componentRef.setInput('settingsCatalog', {...catalog, providers: [...catalog.providers, {...imported, reasoningLevels: ['high']}]});
    fixture.componentRef.setInput('defaults', {
      selection: {...configuredDefaults.selection, modelId: 'default'},
      providerSelections: {
        codex: {modelId: '__custom__', customModel: 'saved/codex[1m]', reasoningLevel: 'high'},
        test: {modelId: '__custom__', customModel: 'inactive/test[1m]', reasoningLevel: 'low'},
      },
    });
    fixture.detectChanges();
    const menu = await openModelMenu();
    expect(menu.textContent).toContain('saved/codex[1m]');
    expect(menu.textContent).not.toContain('inactive/test[1m]');
    component.applySettings({...component.modelSelection, providerId: 'test'});
    component.changeConversationModel(JSON.stringify(['test', '__custom__']));
    expect(component.selectedProvider).toBe('codex');
    component.changeConversationModel(JSON.stringify(['codex', '__custom__']));
    expect(component.customModel).toBe('saved/codex[1m]');
    expect(component.selectedLevel).toBe('high');
    component.prompt = 'Use saved provider custom model';
    await component.submit();
    expect(start.calls.mostRecent().args[4]).toEqual(jasmine.objectContaining({providerId: 'codex', modelId: 'saved/codex[1m]'}));
  });

  it('uses an explicit active provider for a providerless agent instead of offering deterministic routing', async () => {
    loadCatalog.and.resolveTo({
      ...catalog,
      providers: [...catalog.providers, imported],
      agents: [{id: 'display-anomaly', name: 'Evidence'}],
    });
    fixture.componentRef.setInput('defaults', configuredDefaults);
    await initialize();
    expect(component.conversationModels.map((group) => group.providerId)).toEqual(['codex']);
    component.changeConversationModel(JSON.stringify(['', 'default']));
    expect(component.selectedProvider).toBe('codex');
    component.prompt = 'Use active model';
    await component.submit();
    expect(start.calls.mostRecent().args[4]).toEqual(jasmine.objectContaining({
      providerId: 'codex', modelId: 'preferred[1m]', reasoningLevel: 'high',
    }));
  });

  it('fails closed when an explicit active provider is absent instead of sending to an inactive provider', async () => {
    fixture.componentRef.setInput('defaults', configuredDefaults);
    await initialize();
    expect(component.conversationModels).toEqual([]);
    component.changeConversationModel(JSON.stringify(['test', 'test-model']));
    component.applySettings({...configuredDefaults.selection, providerId: 'test'});
    expect(component.selectedProvider).toBe('codex');
    component.prompt = 'Do not fall back';
    await component.submit();
    expect(start).not.toHaveBeenCalled();
    expect(component.error).toBe('The selected provider is unavailable.');
    expect(component.prompt).toBe('Do not fall back');
  });

  it('keeps its model and draft while refreshed capabilities normalize unsupported effort', async () => {
    await initialize();
    component.selectedModel = 'test-model';
    component.selectedLevel = 'low';
    component.prompt = 'Keep current draft';
    fixture.componentRef.setInput('settingsCatalog', {
      ...catalog,
      providers: [{...catalog.providers[0], models: [{id: 'test-model', name: 'Test model', levels: ['high']}]}],
    });
    fixture.detectChanges();
    expect(component.selectedModel).toBe('test-model');
    expect(component.selectedLevel).toBe('high');
    expect(component.prompt).toBe('Keep current draft');
    fixture.componentRef.setInput('settingsCatalog', {...catalog, providers: [{...catalog.providers[0], models: [{id: 'new-model', name: 'New model'}]}]});
    fixture.detectChanges();
    expect(component.selectedModel).toBe('__custom__');
    expect(component.customModel).toBe('test-model');
    expect(component.prompt).toBe('Keep current draft');
  });

  it('uses the provider default even without a descriptor and never translates provider/model names', async () => {
    loadCatalog.and.resolveTo({
      ...catalog,
      providers: [{id: 'test', name: 'Settings', defaultModelId: 'Privacy'}],
    });
    await initialize();
    setLanguage('zh-CN');
    fixture.detectChanges();
    const select = modelTrigger();
    const menu = await openModelMenu();
    expect(component.selectedModel).toBe('Privacy');
    expect(select.value).toBe(JSON.stringify(['test', 'Privacy']));
    expect(menu.querySelector('.model-group')?.getAttribute('aria-label')).toBe('Settings');
    expect(select.textContent).toContain('Privacy');
  });

  it('disables composer routing while running or loading and rejects runtime changes', async () => {
    await initialize();
    for (const state of ['running', 'loading', 'suspended'] as const) {
      component[state] = true;
      fixture.detectChanges();
      await fixture.whenStable();
      expect(
        fixture.nativeElement.querySelector('[aria-label="Conversation model"]')
          .disabled,
      ).toBeTrue();
      component.changeConversationModel(JSON.stringify(['test', 'test-model']));
      expect(component.selectedModel).toBe('default');
      component[state] = false;
    }
  });

  it('keeps a restored running session on its last provider until terminal before applying active settings and capabilities', async () => {
    loadCatalog.and.resolveTo({...catalog, providers: [...catalog.providers, imported]});
    fixture.componentRef.setInput('defaults', configuredDefaults);
    get.and.resolveTo({...detail, status: 'running', events: [detail.events[0]]});
    let finish!: () => void;
    let receive!: (event: AiEvent) => void;
    stream.and.callFake((_id: string, onEvent: (event: AiEvent) => void) => {
      receive = onEvent;
      return new Promise<void>((resolve) => { finish = resolve; });
    });
    await initialize();
    await component.selectSession('a');
    component.prompt = 'Keep running draft';
    const originalCatalog = component.catalog;
    const signal = stream.calls.mostRecent().args[2] as AbortSignal;
    fixture.componentRef.setInput('settingsCatalog', {
      ...catalog,
      providers: [
        {...catalog.providers[0], models: [{id: 'other', name: 'Other', levels: ['low']}]},
        {...imported, models: [{id: 'preferred[1m]', name: 'Preferred', levels: ['low']}]},
      ],
    });
    fixture.detectChanges();
    component.applySettings(configuredDefaults.selection);
    component.resetModel();
    component.resetLevel();
    expect(component.running).toBeTrue();
    expect(component.catalog).toBe(originalCatalog);
    expect(component.selectedProvider).toBe('test');
    expect(component.selectedModel).toBe('test-model');
    expect(component.selectedLevel).toBe('high');
    expect(component.conversationModels.map((group) => group.providerId)).toEqual(['test']);
    expect(component.conversationModel).toBe(JSON.stringify(['test', 'test-model']));
    expect(signal.aborted).toBeFalse();
    await component.submit();
    expect(start).not.toHaveBeenCalled();
    receive(events[1]);
    finish();
    await fixture.whenStable();
    expect(component.running).toBeFalse();
    expect(component.catalog).not.toBe(originalCatalog);
    expect(component.selectedProvider).toBe('codex');
    expect(component.selectedModel).toBe('preferred[1m]');
    expect(component.selectedLevel).toBe('low');
    expect(component.selectedAgent).toBe(detail.agentId);
    expect(component.sessionId).toBe('a');
    expect(component.turns[0].response).toBe('Saved answer');
    expect(component.prompt).toBe('Keep running draft');
    stream.and.callFake(async (_id: string, onEvent: (event: AiEvent) => void) => {
      onEvent({...events[0], id: 3});
      onEvent({...events[1], id: 4});
    });
    await component.submit();
    expect(start.calls.mostRecent().args[4]).toEqual(jasmine.objectContaining({
      sessionId: 'a', providerId: 'codex', modelId: 'preferred[1m]', reasoningLevel: 'low',
    }));
  });

  it('defers settings received during submission without changing the in-flight request or displayed selection', async () => {
    await initialize();
    let accept!: (value: AiSessionSummary) => void;
    start.and.returnValue(new Promise<AiSessionSummary>((resolve) => { accept = resolve; }));
    component.prompt = 'Use current provider';
    const sending = component.submit();
    const lastRun = component.modelSelection;
    fixture.componentRef.setInput('settingsCatalog', {...catalog, providers: [...catalog.providers, imported]});
    fixture.componentRef.setInput('defaults', configuredDefaults);
    fixture.detectChanges();
    expect(component.modelSelection).toEqual(lastRun);
    expect(component.conversationModels.map((group) => group.providerId)).toEqual(['test']);
    expect(start.calls.mostRecent().args[4]).toEqual(jasmine.objectContaining({
      providerId: 'test', modelId: 'default', reasoningLevel: 'medium',
    }));
    accept(session);
    await sending;
    expect(component.running).toBeFalse();
    expect(component.modelSelection).toEqual(configuredDefaults.selection);
    expect(component.conversationModel).toBe(JSON.stringify(['codex', 'preferred[1m]']));
  });

  it('keeps an interrupted running session locked without a terminal event even with an older completed turn', async () => {
    await initialize();
    get.and.resolveTo({...detail, status: 'running'});
    stream.and.resolveTo();
    await component.selectSession('a');
    await fixture.whenStable();
    fixture.componentRef.setInput('settingsCatalog', {...catalog, providers: [...catalog.providers, imported]});
    fixture.componentRef.setInput('defaults', configuredDefaults);
    fixture.detectChanges();
    expect(component.running).toBeTrue();
    expect(component.selectedProvider).toBe('test');
    expect(component.selectedModel).toBe('test-model');
    expect(component.selectedLevel).toBe('high');
    expect(component.conversationModels.map((group) => group.providerId)).toEqual(['test']);
    expect(component.error).toContain('Connection interrupted');
    component.prompt = 'Must wait for terminal';
    await component.submit();
    expect(start).not.toHaveBeenCalled();
  });

  for (const terminalType of ['analysis_completed', 'analysis_cancelled', 'error']) {
    it(`does not replace ${terminalType} with a network error after the terminal event`, async () => {
      await initialize();
      stream.and.callFake(async (_id: string, onEvent: (event: AiEvent) => void) => {
        onEvent(events[0]);
        onEvent({type: terminalType, data: {provider: {output: 'Preserved answer'}}, message: 'Provider failure'});
        throw new TypeError('network error');
      });
      component.prompt = 'Question';
      await component.submit();
      expect(component.error).toBe('');
      expect(component.running).toBeFalse();
      expect(component.turns[0].status).toBe(
        terminalType === 'analysis_completed' ? 'completed' : terminalType === 'analysis_cancelled' ? 'cancelled' : 'failed',
      );
    });
  }

  it('keeps the stream error when a background history refresh also fails', async () => {
    await initialize();
    (AiGatewayClient.prototype.listSessions as jasmine.Spy).and.rejectWith(new TypeError('History network error'));
    stream.and.rejectWith(new Error('The AI connection was interrupted. Reopen this conversation to reconnect.'));
    component.prompt = 'Question';
    await component.submit();
    await fixture.whenStable();
    expect(component.error).toBe('The AI connection was interrupted. Reopen this conversation to reconnect.');
    expect(component.running).toBeTrue();
  });

  it('restores unsent text and notes after a failed POST without sending a duplicate request', async () => {
    await initialize();
    start.and.rejectWith(new Error('Could not reach the AI gateway. Check the connection and try again.'));
    component.prompt = 'Keep this question';
    component.attachments = [{name: 'notes.txt', mimeType: 'text/plain', content: 'Keep these notes'}];
    await component.submit();
    expect(start).toHaveBeenCalledTimes(1);
    expect(component.prompt).toBe('Keep this question');
    expect(component.attachments[0].content).toBe('Keep these notes');
    expect(component.submitting).toBeFalse();
    expect(component.running).toBeFalse();
    expect(component.error).toBe('Could not reach the AI gateway. Check the connection and try again.');
  });

  it('keeps a completed answer usable when background history refresh fails', async () => {
    await initialize();
    (AiGatewayClient.prototype.listSessions as jasmine.Spy).and.rejectWith(new TypeError('History network error'));
    component.prompt = 'Question';
    await component.submit();
    await fixture.whenStable();
    expect(component.error).toBe('');
    expect(component.running).toBeFalse();
    expect(component.turns[0].response).toBe('Saved answer');
  });

  it('does not apply stale history refresh results after selecting a different conversation', async () => {
    await initialize();
    let finish!: (value: AiSessionSummary[]) => void;
    (AiGatewayClient.prototype.listSessions as jasmine.Spy).and.returnValue(new Promise<AiSessionSummary[]>((resolve) => { finish = resolve; }));
    const refreshing = component.refreshSessions(true);
    component.newSession();
    finish([{...session, sessionId: 'stale'}]);
    await refreshing;
    expect(component.sessions.some((item) => item.sessionId === 'stale')).toBeFalse();
  });

  it('preserves running historical routing after terminal when defaults have no explicit provider', async () => {
    loadCatalog.and.resolveTo({...catalog, providers: [...catalog.providers, imported]});
    get.and.resolveTo({...detail, providerId: 'codex', modelId: 'preferred[1m]', status: 'running', events: [detail.events[0]]});
    let finish!: () => void;
    let receive!: (event: AiEvent) => void;
    stream.and.callFake((_id: string, onEvent: (event: AiEvent) => void) => {
      receive = onEvent;
      return new Promise<void>((resolve) => { finish = resolve; });
    });
    fixture.componentRef.setInput('defaults', {
      selection: {...configuredDefaults.selection, providerId: '', modelId: 'default', reasoningLevel: 'low'},
      providerSelections: {},
    });
    await initialize();
    await component.selectSession('a');
    expect(component.selectedProvider).toBe('codex');
    expect(component.selectedModel).toBe('preferred[1m]');
    receive(events[1]);
    finish();
    await fixture.whenStable();
    expect(component.running).toBeFalse();
    expect(component.selectedProvider).toBe('codex');
    expect(component.selectedModel).toBe('preferred[1m]');
    expect(component.selectedLevel).toBe('high');
  });

  it('applies independent settings while suspended and submits the saved selection on return', async () => {
    await initialize();
    fixture.componentRef.setInput('suspended', true);
    fixture.componentRef.setInput('defaults', {
      selection: {
        agentId: 'display-anomaly',
        providerId: 'test',
        modelId: 'test-model',
        customModel: '',
        reasoningLevel: 'high',
      },
      providerSelections: {},
    });
    fixture.detectChanges();
    expect(component.selectedModel).toBe('test-model');
    component.prompt = 'Use configured model';
    await component.submit();
    expect(start).not.toHaveBeenCalled();
    fixture.componentRef.setInput('suspended', false);
    fixture.detectChanges();
    await component.submit();
    expect(start.calls.mostRecent().args[4]).toEqual(
      jasmine.objectContaining({
        providerId: 'test',
        modelId: 'test-model',
        reasoningLevel: 'high',
      }),
    );
  });

  it('uses the same actual note intake for paste and drop and ignores late IME Enter', async () => {
    await initialize();
    const add = spyOn(component, 'addNotes').and.resolveTo();
    const transfer = new DataTransfer();
    const note = new File(['Pasted notes'], 'paste.md');
    transfer.items.add(note);
    const paste = new ClipboardEvent('paste', {
      clipboardData: transfer,
      cancelable: true,
    });
    component.onPaste(paste);
    expect(paste.defaultPrevented).toBeTrue();
    const enter = new DragEvent('dragenter', {
      dataTransfer: transfer,
      cancelable: true,
    });
    component.onDragEnter(enter);
    component.onDragEnter(enter);
    expect(component.dropActive).toBeTrue();
    component.onDragLeave(new DragEvent('dragleave', {cancelable: true}));
    expect(component.dropActive).toBeTrue();
    const drop = new DragEvent('drop', {
      dataTransfer: transfer,
      cancelable: true,
    });
    component.onDrop(drop);
    expect(drop.defaultPrevented).toBeTrue();
    expect(component.dropActive).toBeFalse();
    expect(add).toHaveBeenCalledTimes(2);
    expect(add).toHaveBeenCalledWith([note]);
    const send = spyOn(component, 'submit').and.resolveTo();
    component.onCompositionEnd();
    component.onComposerKey(new KeyboardEvent('keydown', {key: 'Enter'}));
    expect(send).not.toHaveBeenCalled();
  });
  it('does not cancel a previous turn while a continuation is being accepted', async () => {
    await initialize();
    await component.selectSession('a');
    let resolve!: (value: AiSessionSummary) => void;
    start.and.returnValue(
      new Promise<AiSessionSummary>((done) => {
        resolve = done;
      }),
    );
    const cancel = spyOn(AiGatewayClient.prototype, 'cancel').and.resolveTo();
    component.prompt = 'Continuation';
    const sending = component.submit();
    expect(component.submitting).toBeTrue();
    await component.cancel();
    expect(cancel).not.toHaveBeenCalled();
    resolve(session);
    await sending;
    expect(component.submitting).toBeFalse();
  });
  it('does not expose stale model settings while a conversation is restoring', async () => {
    await initialize();
    let resolve!: (value: AiSessionDetail) => void;
    get.and.returnValue(
      new Promise<AiSessionDetail>((done) => {
        resolve = done;
      }),
    );
    const restoring = component.selectSession('a');
    component.applySettings({
      agentId: 'wrong',
      providerId: 'test',
      modelId: 'test-model',
      customModel: '',
      reasoningLevel: 'low',
    });
    expect(component.selectedAgent).toBe('display-anomaly');
    resolve(detail);
    await restoring;
    expect(component.modelSelection.modelId).toBe('test-model');
  });

  it('does not resurrect notes removed while a pasted file is being read', async () => {
    await initialize();
    component.attachments = [
      {
        name: 'remove.txt',
        mimeType: 'text/plain',
        content: 'Sensitive note removed by user',
      },
    ];
    let resolve!: (value: ArrayBuffer) => void;
    const file = new File(['new note'], 'new.txt');
    spyOn(file, 'arrayBuffer').and.returnValue(
      new Promise<ArrayBuffer>((done) => {
        resolve = done;
      }),
    );
    const reading = component.addNotes([file]);
    component.attachments.splice(0, 1);
    resolve(new TextEncoder().encode('new note').buffer);
    await reading;
    expect(component.attachments.map((item) => item.name)).toEqual(['new.txt']);
  });
});
