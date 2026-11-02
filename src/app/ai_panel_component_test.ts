import {ComponentFixture, TestBed} from '@angular/core/testing';
import {setLanguage} from '@common/i18n';
import {AiCatalog, AiEvent, AiGatewayClient, AiProvider, AiSessionDetail, AiSessionSummary,} from '@services/ai_gateway_client';

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
      imports: [AiPanelComponent],
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
        .querySelector('.ai-composer select')
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
    const select: HTMLSelectElement = fixture.nativeElement.querySelector(
      '[aria-label="Conversation model"]',
    );
    expect(select.querySelectorAll('optgroup').length).toBe(1);
    expect(select.querySelector('optgroup')?.label).toBe('Codex');
    component.changeConversationModel(JSON.stringify(['test', 'default']));
    expect(component.selectedProvider).toBe('codex');
    expect(component.selectedModel).toBe('preferred[1m]');
    select.value = JSON.stringify(['codex', 'default']);
    select.dispatchEvent(new Event('change', {bubbles: true}));
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
    const select: HTMLSelectElement = fixture.nativeElement.querySelector(
      '[aria-label="Conversation model"]',
    );
    const customValue = JSON.stringify(['test', '__custom__']);
    expect(select.value).toBe(customValue);
    expect(select.textContent).toContain('custom/model@[1m]');
    component.changeConversationModel(JSON.stringify(['codex', 'default']));
    component.applySettings({...configuredDefaults.selection});
    expect(component.selectedProvider).toBe('test');
    expect(component.selectedModel).toBe('__custom__');
    component.changeConversationModel(JSON.stringify(['test', 'default']));
    expect(component.selectedModel).toBe('default');
    fixture.detectChanges();
    expect(select.textContent).toContain('custom/model@[1m]');
    component.changeConversationModel(customValue);
    expect(component.selectedProvider).toBe('test');
    expect(component.selectedModel).toBe('__custom__');
    component.prompt = 'Use custom';
    await component.submit();
    expect(start.calls.mostRecent().args[4].modelId).toBe('custom/model@[1m]');
    setLanguage('zh-CN');
    fixture.detectChanges();
    expect(select.getAttribute('aria-label')).toBe('会话模型');
    expect(select.textContent).toContain('自定义模型：custom/model@[1m]');
  });

  it('offers a deterministic fallback for a providerless agent', async () => {
    loadCatalog.and.resolveTo({
      ...catalog,
      providers: [...catalog.providers, imported],
      agents: [{id: 'evidence', name: 'Evidence'}],
    });
    await initialize();
    const select: HTMLSelectElement = fixture.nativeElement.querySelector(
      '[aria-label="Conversation model"]',
    );
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
    const select: HTMLSelectElement = fixture.nativeElement.querySelector('[aria-label="Conversation model"]');
    expect(select.textContent).toContain('saved/codex[1m]');
    expect(select.textContent).not.toContain('inactive/test[1m]');
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
    const select: HTMLSelectElement = fixture.nativeElement.querySelector(
      '[aria-label="会话模型"]',
    );
    expect(component.selectedModel).toBe('Privacy');
    expect(select.value).toBe(JSON.stringify(['test', 'Privacy']));
    expect(select.querySelector('optgroup')?.label).toBe('Settings');
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
