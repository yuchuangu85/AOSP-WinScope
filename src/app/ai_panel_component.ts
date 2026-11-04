import {CommonModule} from '@angular/common';
import {AfterViewInit, Component, ElementRef, EventEmitter, HostListener, inject, Input, NgZone, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild,} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipModule} from '@angular/material/tooltip';
import {language, translate, TranslatePipe} from '@common/i18n';
import {AiChatTurn, formatAnalysisDuration, formatConversationResponse, projectConversation,} from '@services/ai_conversation';
import {AI_DIAGNOSTIC_PROMPTS, AiDiagnosticExampleId, AiDiagnosticPromptId, diagnosticExamplePrompt, diagnosticExamples, diagnosticExampleText, diagnosticPrompt} from '@services/ai_diagnostic_prompts';
import {AiAttachment, AiCatalog, AiEvent, AiGatewayClient, AiProvider, AiSessionSummary, AiTraceQueryRequest,} from '@services/ai_gateway_client';
import {isAiTraceQuery} from '@services/ai_trace_query_validation';
import {WinscopeTraceQuery, WinscopeTraceSnapshot} from '@services/winscope_trace_query';

import {AiMarkdownComponent} from './ai_markdown_component';
import {AiModelSelection, AiSettingsValue} from './ai_settings_component';

interface Draft {
  text: string;
  attachments: AiAttachment[];
  includeEvidence: boolean;
}

@Component({
  selector: 'ai-panel',
  standalone: true,
  providers: [{
    provide: MAT_TOOLTIP_DEFAULT_OPTIONS,
    useFactory: () => ({...inject(MAT_TOOLTIP_DEFAULT_OPTIONS, {skipSelf: true}), disableTooltipInteractivity: true}),
  }],
  imports: [
    AiMarkdownComponent,
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatProgressBarModule,
    MatTooltipModule,
    TranslatePipe,
  ],
  templateUrl: './ai_panel_component.ng.html',
  styleUrls: ['./ai_panel_component.scss'],
})
export class AiPanelComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  readonly language = language;
  readonly diagnosticPrompts = AI_DIAGNOSTIC_PROMPTS;
  selectedDiagnostic: AiDiagnosticPromptId = 'black-screen';
  showDiagnosticExamples = true;
  @Input() endpoint: string | undefined;
  @Input() evidence: unknown;
  @Input() traceQuery?: (query: WinscopeTraceQuery) => Promise<WinscopeTraceSnapshot>;
  @Input() suspended = false;
  @Input() defaults?: AiSettingsValue;
  @Input() settingsCatalog?: AiCatalog;
  @Output() readonly closed = new EventEmitter<void>();
  @Output() readonly frameSelected = new EventEmitter<number>();
  @Output() readonly settingsRequested = new EventEmitter<void>();
  @Output() readonly selectionReady = new EventEmitter<AiModelSelection>();
  composer?: ElementRef<HTMLTextAreaElement>;
  @ViewChild('composer') set composerElement(
    element: ElementRef<HTMLTextAreaElement> | undefined,
  ) {
    this.composerObserver?.disconnect();
    this.composer = element;
    if (element && typeof ResizeObserver !== 'undefined') {
      let width = 0;
      this.composerObserver = new ResizeObserver(([entry]) => {
        if (entry.contentRect.width !== width) {
          width = entry.contentRect.width;
          this.resizeComposer();
        }
      });
      this.composerObserver.observe(element.nativeElement);
    }
    this.resizeComposer();
  }
  @ViewChild('transcript') transcript?: ElementRef<HTMLElement>;
  @ViewChild('windowPanel') windowPanel?: ElementRef<HTMLElement>;
  @ViewChild('sidebarToggle', {read: ElementRef}) sidebarToggle?: ElementRef<HTMLButtonElement>;
  @ViewChild('modelSearch') modelSearch?: ElementRef<HTMLInputElement>;

  readonly minWindowSize = {width: 640, height: 420};
  windowSize?: {width: number; height: number};
  windowPosition?: {left: number; top: number};
  compactWindow = window.innerWidth <= 760;
  sidebarCollapsed = false;

  catalog: AiCatalog = {providers: [], agents: [], skills: []};
  sessions: AiSessionSummary[] = [];
  selectedAgent = 'display-anomaly';
  selectedProvider = '';
  selectedModel = 'default';
  customModel = '';
  selectedLevel = 'medium';
  prompt = '';
  searchQuery = '';
  modelSearchQuery = '';
  attachments: AiAttachment[] = [];
  includeEvidence = true;
  turns: AiChatTurn[] = [];
  error = '';
  notice = '';
  sessionId = '';
  running = false;
  submitting = false;
  loading = false;
  attaching = false;
  sidebarOpen = false;
  followTail = true;
  reportPreview = '';
  reportBusy = false;
  dropActive = false;
  private dropDepth = 0;
  private compositionEndedAt = -Infinity;
  private composerObserver?: ResizeObserver;
  private windowObserver?: ResizeObserver;
  private readonly zone = inject(NgZone);
  private windowResize?: {
    pointerId: number;
    handle: HTMLElement;
    x: number;
    y: number;
    width: number;
    height: number;
    scale: number;
  };
  private windowDrag?: {
    pointerId: number;
    handle: HTMLElement;
    x: number;
    y: number;
    left: number;
    top: number;
    scale: number;
  };
  private client?: AiGatewayClient;
  private events: AiEvent[] = [];
  private readonly controller = new AbortController();
  private streamController?: AbortController;
  private customModelProviderId?: string;
  private revision = 0;
  private sessionRefresh = 0;
  private initialized = false;
  private settingsPending = false;
  private catalogPending = false;
  private readonly drafts = new Map<string, Draft>();
  private traceQueryRun?: {
    contextId: string;
    sessionId?: string;
    query: NonNullable<AiPanelComponent['traceQuery']>;
    handled: Map<string, symbol>;
    cancelled?: boolean;
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['traceQuery'] && !changes['traceQuery'].firstChange) this.traceQueryRun = undefined;
    if (changes['settingsCatalog'] && this.settingsCatalog) {
      this.catalogPending = true;
    }
    if (changes['defaults'] && this.defaults) {
      this.settingsPending = true;
    }
    if (this.initialized) this.applyPendingSettings();
    if (changes['suspended'] && this.suspended) {
      this.endWindowResize();
      this.endWindowDrag();
    }
    if (changes['suspended'] && !this.suspended && this.initialized) this.focusComposer();
  }

  ngAfterViewInit(): void {
    this.focusComposer();
    if (typeof ResizeObserver !== 'undefined' && this.windowPanel) {
      this.windowObserver = new ResizeObserver(() => {
        if (!this.windowPanel?.nativeElement.offsetWidth) return;
        this.zone.run(() => {
          this.updateWindowLayout();
          this.resizeComposer();
        });
      });
      this.windowObserver.observe(this.windowPanel.nativeElement);
    }
  }

  async ngOnInit(): Promise<void> {
    if (!this.endpoint) {
      this.initialized = true;
      this.applyPendingSettings();
      this.selectionReady.emit(this.modelSelection);
      return;
    }
    this.client = new AiGatewayClient(this.endpoint);
    this.loading = true;
    try {
      const catalog = await this.client.catalog(this.controller.signal);
      this.catalog = this.settingsCatalog ?? catalog;
      if (
        !this.catalog.agents.some((agent) => agent.id === this.selectedAgent)
      ) {
        this.selectedAgent = this.catalog.agents[0]?.id ?? '';
      }
      this.resetModel();
      await this.refreshSessions();
      const restored = this.readActiveSession();
      if (
        restored &&
        this.sessions.some((session) => session.sessionId === restored)
      ) {
        await this.selectSession(restored);
      } else if (restored) {
        this.rememberActiveSession('');
        this.notice =
          'The previous conversation is no longer available. Gateway history is kept in memory.';
      }
    } catch (error) {
      this.showError(error);
    } finally {
      this.loading = false;
      this.initialized = true;
      if (!this.sessionId && this.defaultSelection) this.settingsPending = true;
      this.applyPendingSettings();
      this.selectionReady.emit(this.modelSelection);
    }
  }

  ngOnDestroy(): void {
    this.traceQueryRun = undefined;
    this.revision++;
    this.composerObserver?.disconnect();
    this.windowObserver?.disconnect();
    this.endWindowResize();
    this.endWindowDrag();
    this.controller.abort();
    this.streamController?.abort();
  }

  get sidebarVisible(): boolean {
    return this.compactWindow ? this.sidebarOpen : !this.sidebarCollapsed;
  }

  toggleSidebar(): void {
    if (this.compactWindow) this.sidebarOpen = !this.sidebarOpen;
    else this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  closeSidebar(): void {
    if (this.compactWindow) this.sidebarOpen = false;
    else this.sidebarCollapsed = true;
    this.sidebarToggle?.nativeElement.focus();
  }

  beginWindowResize(event: PointerEvent): void {
    const panel = this.windowPanel?.nativeElement;
    if (event.button !== 0 || !event.isPrimary || this.suspended || this.windowResize || this.windowDrag || !panel?.offsetWidth) return;
    const handle = event.currentTarget as HTMLElement;
    const bounds = this.windowBounds();
    this.windowResize = {
      pointerId: event.pointerId, handle, x: event.clientX, y: event.clientY,
      width: panel.offsetWidth, height: panel.offsetHeight, scale: bounds.scale,
    };
    handle.setPointerCapture(event.pointerId);
    event.preventDefault();
  }

  moveWindowResize(event: PointerEvent): void {
    const start = this.windowResize;
    if (!start || event.pointerId !== start.pointerId) return;
    this.setWindowSize(
      start.width + (event.clientX - start.x) / start.scale,
      start.height + (event.clientY - start.y) / start.scale,
    );
    event.preventDefault();
  }

  endWindowResize(event?: PointerEvent): void {
    const resize = this.windowResize;
    if (!resize || (event && event.pointerId !== resize.pointerId)) return;
    this.windowResize = undefined;
    if (resize.handle.hasPointerCapture(resize.pointerId)) resize.handle.releasePointerCapture(resize.pointerId);
  }

  resizeWindowKey(event: KeyboardEvent): void {
    const panel = this.windowPanel?.nativeElement;
    if (this.suspended || !panel?.offsetWidth || event.altKey || event.ctrlKey || event.metaKey) return;
    const step = event.shiftKey ? 64 : 16;
    const delta: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0], ArrowRight: [step, 0],
      ArrowUp: [0, -step], ArrowDown: [0, step],
    };
    if (event.key !== 'Home' && !delta[event.key]) return;
    event.preventDefault();
    event.stopPropagation();
    if (event.key === 'Home') this.resetWindowSize();
    else this.setWindowSize(panel.offsetWidth + delta[event.key][0], panel.offsetHeight + delta[event.key][1]);
  }

  resetWindowSize(): void {
    this.endWindowResize();
    this.endWindowDrag();
    this.windowSize = undefined;
    this.windowPosition = undefined;
    this.resizeComposer();
  }

  beginWindowDrag(event: PointerEvent): void {
    const panel = this.windowPanel?.nativeElement;
    if (event.button !== 0 || !event.isPrimary || this.suspended || this.windowDrag || this.windowResize || !panel?.offsetWidth) return;
    if (event.target instanceof Element && event.target.closest('button, input, textarea, select, a, [contenteditable]')) return;
    const rect = panel.getBoundingClientRect();
    const scale = this.viewportBounds().scale;
    const handle = event.currentTarget as HTMLElement;
    this.windowDrag = {pointerId: event.pointerId, handle, x: event.clientX, y: event.clientY,
      left: rect.left / scale, top: rect.top / scale, scale};
    handle.setPointerCapture(event.pointerId);
    handle.focus({preventScroll: true});
    event.preventDefault();
  }

  moveWindowDrag(event: PointerEvent): void {
    const drag = this.windowDrag;
    if (!drag || event.pointerId !== drag.pointerId) return;
    this.setWindowPosition(drag.left + (event.clientX - drag.x) / drag.scale,
      drag.top + (event.clientY - drag.y) / drag.scale);
    event.preventDefault();
  }

  endWindowDrag(event?: PointerEvent): void {
    const drag = this.windowDrag;
    if (!drag || (event && event.pointerId !== drag.pointerId)) return;
    this.windowDrag = undefined;
    if (drag.handle.hasPointerCapture(drag.pointerId)) drag.handle.releasePointerCapture(drag.pointerId);
  }

  moveWindowKey(event: KeyboardEvent): void {
    if (event.target !== event.currentTarget || this.suspended || event.altKey || event.ctrlKey || event.metaKey) return;
    const panel = this.windowPanel?.nativeElement;
    if (!panel?.offsetWidth) return;
    const step = event.shiftKey ? 64 : 16;
    const delta: Record<string, [number, number]> = {ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step]};
    if (event.key !== 'Home' && !delta[event.key]) return;
    event.preventDefault();
    event.stopPropagation();
    if (event.key === 'Home') this.resetWindowPosition();
    else {
      const scale = this.viewportBounds().scale;
      const rect = panel.getBoundingClientRect();
      this.setWindowPosition(rect.left / scale + delta[event.key][0], rect.top / scale + delta[event.key][1]);
    }
  }

  resetWindowPosition(): void {
    this.endWindowDrag();
    const panel = this.windowPanel?.nativeElement;
    if (!panel?.offsetWidth) return;
    const bounds = this.viewportBounds();
    this.setWindowPosition(bounds.left + (bounds.width - panel.offsetWidth) / 2,
      bounds.top + (bounds.height - panel.offsetHeight) / 2);
  }

  @HostListener('window:resize')
  onViewportResize(): void {
    if (!this.windowPanel?.nativeElement.offsetWidth) return;
    this.endWindowResize();
    this.endWindowDrag();
    const panel = this.windowPanel.nativeElement;
    const bounds = this.viewportBounds();
    if (this.windowSize) {
      this.windowSize = {
        width: Math.min(bounds.width, Math.max(Math.min(this.minWindowSize.width, bounds.width), this.windowSize.width)),
        height: Math.min(bounds.height, Math.max(Math.min(this.minWindowSize.height, bounds.height), this.windowSize.height)),
      };
    }
    if (this.windowPosition || this.windowSize) {
      const rect = panel.getBoundingClientRect();
      this.setWindowPosition(this.windowPosition?.left ?? rect.left / bounds.scale,
        this.windowPosition?.top ?? rect.top / bounds.scale);
    }
    this.updateWindowLayout();
    this.resizeComposer();
  }

  private setWindowSize(width: number, height: number): void {
    const bounds = this.windowBounds();
    this.windowSize = {
      width: Math.min(bounds.width, Math.max(Math.min(this.minWindowSize.width, bounds.width), Math.round(width))),
      height: Math.min(bounds.height, Math.max(Math.min(this.minWindowSize.height, bounds.height), Math.round(height))),
    };
  }

  private setWindowPosition(left: number, top: number): void {
    const panel = this.windowPanel!.nativeElement;
    const bounds = this.viewportBounds();
    const width = Math.min(this.windowSize?.width ?? panel.offsetWidth, bounds.width);
    const height = Math.min(this.windowSize?.height ?? panel.offsetHeight, bounds.height);
    this.windowPosition = {
      left: Math.min(bounds.left + bounds.width - width, Math.max(bounds.left, Math.round(left))),
      top: Math.min(bounds.top + bounds.height - height, Math.max(bounds.top, Math.round(top))),
    };
  }

  private viewportBounds(): {left: number; top: number; width: number; height: number; scale: number} {
    const panel = this.windowPanel!.nativeElement;
    const rect = panel.getBoundingClientRect();
    const scale = panel.offsetWidth ? rect.width / panel.offsetWidth : 1;
    const gap = parseFloat(getComputedStyle(panel).getPropertyValue('--ai-window-gap')) || 0;
    return {left: gap, top: 32 + gap,
      width: Math.max(1, window.innerWidth / scale - 2 * gap),
      height: Math.max(1, window.innerHeight / scale - 32 - 2 * gap), scale};
  }

  private windowBounds(): {width: number; height: number; scale: number} {
    const panel = this.windowPanel!.nativeElement;
    const rect = panel.getBoundingClientRect();
    const scale = panel.offsetWidth ? rect.width / panel.offsetWidth : 1;
    const gap = parseFloat(getComputedStyle(panel).getPropertyValue('--ai-window-gap')) || 0;
    return {
      width: Math.max(1, (window.innerWidth - rect.left) / scale - gap),
      height: Math.max(1, (window.innerHeight - rect.top) / scale - gap),
      scale,
    };
  }

  private updateWindowLayout(): void {
    const width = this.windowPanel?.nativeElement.offsetWidth;
    if (!width) return;
    const compact = width <= 760;
    if (compact !== this.compactWindow) {
      this.compactWindow = compact;
      this.sidebarOpen = false;
    }
  }

  get filteredSessions(): AiSessionSummary[] {
    const query = this.searchQuery.trim().toLowerCase();
    return this.sessions.filter((session) =>
      `${session.title} ${session.lastPrompt}`.toLowerCase().includes(query),
    );
  }

  get activeSession(): AiSessionSummary | undefined {
    return this.sessions.find(
      (session) => session.sessionId === this.sessionId,
    );
  }

  activityText(activity: string): string {
    const skill = /^(Running|Completed) skill: (.*)$/.exec(activity);
    if (skill) {
      return translate(`${skill[1]} skill: {id}`, {id: skill[2]});
    }
    const provider = /^Waiting for (.*)…$/.exec(activity);
    return provider
      ? translate('Waiting for {id}…', {id: provider[1]})
      : translate(activity);
  }

  responseText(turn: AiChatTurn): string {
    return formatConversationResponse(turn, translate);
  }

  durationText(durationMs: number): string {
    return formatAnalysisDuration(durationMs, translate);
  }

  errorText(error: string): string {
    const status = /^AI (report|stream) failed \((\d+)\)$/.exec(error);
    return status
      ? translate(`AI ${status[1]} failed ({status})`, {status: status[2]})
      : translate(error);
  }

  get provider(): AiProvider | undefined {
    return this.catalog.providers.find(
      (provider) => provider.id === this.resolvedProviderId,
    );
  }

  private get resolvedProviderId(): string {
    return (
      this.selectedProvider ||
      this.catalog.agents.find((agent) => agent.id === this.selectedAgent)
        ?.providerId ||
      ''
    );
  }

  private get activeProviderId(): string {
    // A running conversation keeps its last-run routing until a terminal event.
    return (
      (!this.running && this.defaultSelection?.providerId) ||
      this.resolvedProviderId
    );
  }

  private get defaultSelection(): AiModelSelection | undefined {
    return this.defaults?.selection.providerId
      ? this.defaults.selection
      : this.catalog.selection ?? this.defaults?.selection;
  }

  get levels(): string[] {
    return (
      this.provider?.models?.find((model) => model.id === this.selectedModel)
        ?.levels ??
      this.provider?.reasoningLevels ??
      []
    );
  }

  get runtimeDisabled(): boolean {
    return this.running || this.loading || this.suspended;
  }

  get conversationModels(): Array<{
    providerId: string;
    name: string;
    models: Array<{value: string; modelId: string; name: string}>;
  }> {
    const activeProviderId = this.activeProviderId;
    const groups = this.catalog.providers.filter(
      (provider) => provider.id === activeProviderId,
    ).map((provider) => {
      const descriptors = [...(provider.models ?? [])];
      if (
        provider.defaultModelId &&
        !descriptors.some((model) => model.id === provider.defaultModelId)
      ) {
        descriptors.unshift({id: provider.defaultModelId, name: provider.defaultModelId});
      }
      if (!descriptors.length) {
        descriptors.push({id: 'default', name: translate('Provider default')});
      }
      const models = descriptors.map((model) => ({
        value: JSON.stringify([provider.id, model.id]),
        modelId: model.id,
        name: model.name,
      }));
      const customModel = this.customModelFor(provider.id);
      if (provider.supportsCustomModel && customModel) {
        models.push({
          value: JSON.stringify([provider.id, '__custom__']),
          modelId: '__custom__',
          name: translate('Custom model: {name}', {name: customModel}),
        });
      }
      return {
        providerId: provider.id,
        name: provider.name || provider.id,
        models,
      };
    });
    if (!activeProviderId) {
      groups.unshift({
        providerId: '',
        name: translate('Deterministic skills'),
        models: [
          {
            value: JSON.stringify(['', 'default']),
            modelId: 'default',
            name: translate('No model · deterministic skills'),
          },
        ],
      });
    }
    return groups;
  }

  get conversationModel(): string {
    return JSON.stringify([this.resolvedProviderId, this.selectedModel]);
  }

  get conversationModelLabel(): string {
    return this.conversationModels.flatMap((group) => group.models)
      .find((model) => model.value === this.conversationModel)?.name ??
      (this.selectedModel === '__custom__' ? this.customModel : this.selectedModel);
  }

  get filteredConversationModels(): AiPanelComponent['conversationModels'] {
    const query = this.modelSearchQuery.trim().toLowerCase();
    if (!query) return this.conversationModels;
    return this.conversationModels.map((group) => ({
      ...group,
      models: group.models.filter((model) =>
        [model.name, model.modelId, model.modelId === '__custom__' ? this.customModelFor(group.providerId) : '']
          .some((value) => value.toLowerCase().includes(query)),
      ),
    })).filter((group) => group.models.length > 0);
  }

  openModelSearch(): void {
    this.modelSearchQuery = '';
    requestAnimationFrame(() => {
      if (!this.controller.signal.aborted && !this.suspended && this.modelSearch?.nativeElement.isConnected) {
        this.modelSearch.nativeElement.focus({preventScroll: true});
      }
    });
  }

  clearModelSearch(): void {
    this.modelSearchQuery = '';
    this.modelSearch?.nativeElement.focus({preventScroll: true});
  }

  onModelSearchKey(event: KeyboardEvent): void {
    if (event.isComposing || event.keyCode === 229) {
      event.stopPropagation();
      return;
    }
    if (event.key === 'Escape' || event.key === 'Tab') return;
    // Text editing belongs to the input, not the menu's typeahead or composer.
    event.stopPropagation();
    if (event.key === 'Enter') event.preventDefault();
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const options = this.modelSearch?.nativeElement.closest('.conversation-model-list')
        ?.querySelectorAll<HTMLButtonElement>('.model-option:not(:disabled)');
      (event.key === 'ArrowDown' ? options?.[0] : options?.[options.length - 1])?.focus();
    }
  }

  changeConversationModel(value: string): void {
    if (this.runtimeDisabled) return;
    for (const group of this.conversationModels) {
      const model = group.models.find((option) => option.value === value);
      if (!model) continue;
      if (model.modelId === '__custom__') {
        this.customModel = this.customModelFor(group.providerId);
        this.customModelProviderId = group.providerId;
      }
      this.selectedProvider = group.providerId;
      this.selectedModel = model.modelId;
      this.selectedLevel = this.defaults?.providerSelections[group.providerId]?.reasoningLevel ?? this.selectedLevel;
      this.resetLevel();
      return;
    }
  }

  private customModelFor(providerId: string): string {
    const local = (this.customModelProviderId ?? this.provider?.id) === providerId ? this.customModel : '';
    const model = local || this.defaults?.providerSelections[providerId]?.customModel || '';
    return /^[a-zA-Z0-9][a-zA-Z0-9._:/@[\]-]{0,127}$/.test(model) ? model : '';
  }

  get canReport(): boolean {
    return (
      !!this.sessionId &&
      !this.running &&
      !this.loading &&
      this.turns.length > 0
    );
  }

  resetModel(): void {
    if (this.running) return;
    this.selectedModel =
      this.provider?.defaultModelId ?? this.provider?.models?.[0]?.id ?? 'default';
    this.customModel = '';
    this.customModelProviderId = undefined;
    this.resetLevel();
  }

  resetLevel(): void {
    if (this.running) return;
    if (!this.levels.includes(this.selectedLevel)) {
      this.selectedLevel = this.levels[0] ?? 'medium';
    }
  }

  openSettings(): void {
    this.settingsRequested.emit();
  }

  get modelSelection(): AiModelSelection {
    return {
      agentId: this.selectedAgent,
      providerId: this.selectedProvider,
      modelId: this.selectedModel,
      customModel: this.customModel,
      reasoningLevel: this.selectedLevel,
    };
  }

  applySettings(selection: AiModelSelection): void {
    if (this.running || this.loading) return;
    const agentId = this.sessionId ? this.selectedAgent : selection.agentId;
    const providerId = selection.providerId || this.catalog.agents.find(
      (agent) => agent.id === agentId,
    )?.providerId || '';
    if (providerId !== this.activeProviderId) return;
    this.selectedAgent = agentId;
    this.selectedProvider = selection.providerId;
    this.selectedModel = selection.modelId;
    this.customModel = selection.customModel;
    this.customModelProviderId = this.provider?.id;
    this.selectedLevel = selection.reasoningLevel;
    this.normalizeModel();
  }

  private applyPendingSettings(): void {
    if (this.running || this.loading) return;
    const catalogChanged = this.catalogPending;
    if (this.catalogPending) {
      this.catalog = this.settingsCatalog ?? this.catalog;
      this.catalogPending = false;
    }
    if (this.settingsPending) {
      this.settingsPending = false;
      const selection = this.defaultSelection;
      if (selection && (!this.sessionId || selection.providerId)) {
        this.applySettings(selection);
      }
    }
    if (catalogChanged) this.normalizeModel();
  }

  private normalizeModel(): void {
    if (
      this.provider?.supportsCustomModel &&
      this.selectedModel !== 'default' &&
      this.selectedModel !== '__custom__' &&
      this.selectedModel !== this.provider.defaultModelId &&
      !this.provider.models?.some((model) => model.id === this.selectedModel)
    ) {
      this.customModel = this.selectedModel;
      this.customModelProviderId = this.provider.id;
      this.selectedModel = '__custom__';
    }
    this.resetLevel();
  }

  onEscape(event: Event): void {
    event.stopPropagation();
    if (this.windowResize) {
      this.endWindowResize();
      return;
    }
    if (this.windowDrag) {
      this.endWindowDrag();
      return;
    }
    if (this.compactWindow && this.sidebarOpen) {
      this.closeSidebar();
      return;
    }
    if (!this.suspended) this.closed.emit();
  }

  focusCard(event: MouseEvent): void {
    const target = event.target;
    if (
      target instanceof Element &&
      !target.closest('button, input, textarea, select, a')
    ) {
      event.preventDefault();
      this.composer?.nativeElement.focus({preventScroll: true});
    }
  }

  usePrompt(text: string): void {
    this.prompt = translate(text);
    this.resizeComposer();
    this.focusComposer();
  }

  useDiagnosticPrompt(id: AiDiagnosticPromptId): void {
    this.selectedDiagnostic = id;
    this.showDiagnosticExamples = true;
    this.prompt = diagnosticPrompt(id, language());
    this.resizeComposer();
    this.focusComposer();
  }

  get selectedDiagnosticExamples() {
    return diagnosticExamples(this.selectedDiagnostic);
  }

  exampleText(id: AiDiagnosticExampleId): string {
    return diagnosticExampleText(id, language());
  }

  useDiagnosticExample(id: AiDiagnosticExampleId): void {
    this.prompt = diagnosticExamplePrompt(id, language());
    this.resizeComposer();
    this.focusComposer();
  }

  openDiagnosticExamples(): void {
    this.showDiagnosticExamples = true;
    this.scrollToLatest();
  }

  toggleTraceContext(): void {
    this.includeEvidence = !this.includeEvidence;
    if (!this.includeEvidence) this.traceQueryRun = undefined;
  }

  async refreshSessions(background = false): Promise<void> {
    if (!this.client) return;
    const revision = this.revision;
    const refresh = ++this.sessionRefresh;
    try {
      const sessions = await this.client.listSessions(this.controller.signal);
      if (!this.controller.signal.aborted && revision === this.revision && refresh === this.sessionRefresh) this.sessions = sessions;
    } catch (error) {
      if (!background && revision === this.revision && refresh === this.sessionRefresh && !this.error) this.showError(error);
    }
  }

  newSession(): void {
    this.showDiagnosticExamples = true;
    this.traceQueryRun = undefined;
    this.saveDraft();
    this.revision++;
    this.streamController?.abort();
    this.submitting = false;
    this.sessionId = '';
    this.events = [];
    this.turns = [];
    this.running = false;
    this.loading = false;
    this.settingsPending = !!this.defaultSelection;
    this.applyPendingSettings();
    this.error = '';
    this.reportPreview = '';
    this.sidebarOpen = false;
    this.followTail = true;
    this.restoreDraft();
    this.rememberActiveSession('');
    this.focusComposer();
  }

  async selectSession(id: string): Promise<void> {
    if (!this.client) return;
    this.showDiagnosticExamples = false;
    if (this.traceQueryRun?.sessionId !== id) this.traceQueryRun = undefined;
    this.saveDraft();
    const revision = ++this.revision;
    this.streamController?.abort();
    this.submitting = false;
    this.sessionId = id;
    this.loading = true;
    this.running = false;
    this.events = [];
    this.turns = [];
    this.error = '';
    this.reportPreview = '';
    this.sidebarOpen = false;
    this.followTail = true;
    this.restoreDraft();
    try {
      const session = await this.client.getSession(id, this.controller.signal);
      if (revision !== this.revision) return;
      this.selectedAgent = session.agentId;
      this.selectedProvider = session.providerId ?? '';
      const configured = this.provider?.models?.some(
        (model) => model.id === session.modelId,
      ) || session.modelId === this.provider?.defaultModelId;
      this.selectedModel =
        session.modelId && !configured && this.provider?.supportsCustomModel
          ? '__custom__'
          : (session.modelId ?? this.provider?.models?.[0]?.id ?? 'default');
      this.customModel =
        this.selectedModel === '__custom__' ? (session.modelId ?? '') : '';
      this.customModelProviderId = this.provider?.id;
      this.selectedLevel = session.reasoningLevel;
      this.events = session.events.map(({id, event}) => ({...event, id}));
      this.turns = projectConversation(this.events);
      this.running = session.status === 'running';
      this.loading = false;
      this.settingsPending = !!this.defaultSelection?.providerId;
      this.applyPendingSettings();
      this.rememberActiveSession(id);
      this.scrollToLatest();
      if (this.running) {
        if (session.pendingTraceQuery) {
          this.traceQueryRun?.handled.delete(session.pendingTraceQuery.queryId);
        }
        void this.watchSession(id, revision, session.pendingTraceQuery);
      }
    } catch (error) {
      if (revision === this.revision) this.showError(error);
    } finally {
      if (revision === this.revision) this.loading = false;
      if (revision === this.revision) this.selectionReady.emit(this.modelSelection);
    }
  }

  async submit(): Promise<void> {
    if (
      !this.client ||
      !this.prompt.trim() ||
      this.running ||
      this.loading ||
      this.attaching ||
      this.suspended
    ) {
      return;
    }
    this.applyPendingSettings();
    const selection = this.defaultSelection;
    if (selection?.providerId && this.resolvedProviderId !== selection.providerId) {
      this.applySettings(selection);
    }
    if (this.activeProviderId && !this.provider) {
      this.error = 'The selected provider is unavailable.';
      return;
    }
    if (this.selectedModel === '__custom__' && !this.customModel.trim()) {
      this.error = 'Enter a model identifier.';
      return;
    }
    if (
      this.selectedModel === '__custom__' &&
      !/^[a-zA-Z0-9][a-zA-Z0-9._:/@[\]-]{0,127}$/.test(this.customModel.trim())
    ) {
      this.error =
        'Enter a valid model identifier (1–128 letters, digits, periods, underscores, colons, slashes, @, brackets or hyphens).';
      return;
    }
    if (this.attachments.length && !this.provider) {
      this.error =
        'Select a provider to analyze text notes. Deterministic skills use trace context only.';
      return;
    }
    const prompt = this.prompt.trim();
    const revision = this.revision;
    const draft: Draft = {
      text: this.prompt,
      attachments: [...this.attachments],
      includeEvidence: this.includeEvidence,
    };
    const traceQueryRun = draft.includeEvidence && this.traceQuery ? {
      contextId: crypto.randomUUID(),
      query: this.traceQuery,
      handled: new Map<string, symbol>(),
      sessionId: undefined as string | undefined,
    } : undefined;
    this.traceQueryRun = traceQueryRun;
    const baseEvidence = draft.includeEvidence ? this.evidence : undefined;
    this.error = '';
    this.notice = '';
    this.running = true;
    this.submitting = true;
    this.showDiagnosticExamples = false;
    this.reportPreview = '';
    this.followTail = true;
    // Clear only the submitted draft. Text typed while the request runs is kept.
    this.prompt = '';
    this.attachments = [];
    this.resizeComposer();
    try {
      const current = traceQueryRun ? await traceQueryRun.query({}) : undefined;
      if (revision !== this.revision || this.controller.signal.aborted) return;
      if (traceQueryRun && (this.traceQueryRun !== traceQueryRun || !this.includeEvidence)) {
        throw new Error('Trace context changed. Send the message again.');
      }
      const evidence = current ? {
        ...(typeof baseEvidence === 'object' && baseEvidence !== null ? baseEvidence : {}),
        winscope: current,
      } : baseEvidence;
      const session = await this.client.startAnalysis(
        prompt,
        this.selectedAgent,
        evidence,
        this.controller.signal,
        {
          sessionId: this.sessionId || undefined,
          providerId: this.selectedProvider || this.provider?.id || null,
          modelId:
            this.selectedModel === '__custom__'
              ? this.customModel.trim()
              : this.selectedModel,
          reasoningLevel: this.levels.length ? this.selectedLevel : undefined,
          attachments: draft.attachments,
          ...(traceQueryRun ? {
            traceQueryEnabled: true,
            traceQueryContextId: traceQueryRun.contextId,
          } : {}),
        },
      );
      if (revision !== this.revision) {
        void this.refreshSessions(true);
        return;
      }
      this.submitting = false;
      if (traceQueryRun) traceQueryRun.sessionId = session.sessionId;
      if (!this.sessionId) this.drafts.delete('');
      this.sessionId = session.sessionId;
      this.rememberActiveSession(this.sessionId);
      // The server's replay includes this turn's user message and terminal event,
      // including when an entirely deterministic run finished before POST returned.
      await this.watchSession(this.sessionId, revision);
    } catch (error) {
      if (revision === this.revision) {
        this.submitting = false;
        this.showError(error);
        this.running = false;
        this.applyPendingSettings();
        if (!this.prompt) {
          this.prompt = draft.text;
          this.attachments = draft.attachments;
          this.resizeComposer();
        }
      }
    } finally {
      void this.refreshSessions(true);
    }
  }

  async cancel(): Promise<void> {
    if (!this.client || !this.sessionId || this.submitting) return;
    if (this.traceQueryRun) this.traceQueryRun.cancelled = true;
    this.traceQueryRun = undefined;
    try {
      await this.client.cancel(this.sessionId);
    } catch (error) {
      this.showError(error);
    }
  }

  selectFrame(index: number): void {
    this.frameSelected.emit(index);
    this.closed.emit();
  }

  retry(): void {
    const last = this.turns[this.turns.length - 1];
    if (!last || this.running) return;
    this.prompt = last.prompt;
    this.notice = 'Retry uses the currently selected trace context and notes.';
    this.resizeComposer();
    this.focusComposer();
  }

  onComposerKey(event: KeyboardEvent): void {
    if (
      event.key === 'Enter' &&
      !event.shiftKey &&
      !event.altKey &&
      !event.repeat &&
      performance.now() - this.compositionEndedAt > 10 &&
      !event.isComposing &&
      event.keyCode !== 229
    ) {
      event.preventDefault();
      void this.submit();
    }
  }

  onCompositionEnd(): void {
    this.compositionEndedAt = performance.now();
  }

  resizeComposer(): void {
    // ngModel/programmatic changes must reach the DOM before measuring wrapping.
    requestAnimationFrame(() => {
      const element = this.composer?.nativeElement;
      if (!element || this.controller.signal.aborted) return;
      element.style.height = 'auto';
      const cap = Math.min(336, Math.round((this.windowPanel?.nativeElement.clientHeight ?? window.innerHeight) * 0.4));
      element.style.height = `${Math.min(element.scrollHeight, cap)}px`;
    });
  }

  onDraftWheel(event: WheelEvent): void {
    const draft = this.composer?.nativeElement;
    const transcript = this.transcript?.nativeElement;
    if (!draft || !transcript || event.ctrlKey || !event.deltaY) return;
    const atEdge =
      event.deltaY < 0
        ? draft.scrollTop <= 0
        : draft.scrollTop + draft.clientHeight >= draft.scrollHeight - 1;
    if (atEdge && transcript.scrollHeight > transcript.clientHeight) {
      event.preventDefault();
      transcript.scrollTop += event.deltaY;
      this.onTranscriptScroll();
    }
  }

  onPaste(event: ClipboardEvent): void {
    const files = Array.from(event.clipboardData?.files ?? []);
    if (!files.length) return; // Textarea pastes plain text, never clipboard HTML.
    event.preventDefault();
    void this.addNotes(files);
  }

  onDragEnter(event: DragEvent): void {
    if (!event.dataTransfer?.types.includes('Files')) return;
    event.preventDefault();
    this.dropDepth++;
    this.dropActive = true;
  }

  onDragOver(event: DragEvent): void {
    if (!event.dataTransfer?.types.includes('Files')) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.dropDepth = Math.max(0, this.dropDepth - 1);
    this.dropActive = this.dropDepth > 0;
  }

  onDrop(event: DragEvent): void {
    const files = Array.from(event.dataTransfer?.files ?? []);
    if (!files.length && !event.dataTransfer?.types.includes('Files')) return;
    event.preventDefault();
    this.dropDepth = 0;
    this.dropActive = false;
    void this.addNotes(files);
  }

  async attachFiles(input: HTMLInputElement): Promise<void> {
    const files = Array.from(input.files ?? []);
    input.value = '';
    await this.addNotes(files);
  }

  async addNotes(files: File[]): Promise<void> {
    if (this.attaching || !files.length) return;
    const revision = this.revision;
    this.attaching = true;
    this.error = '';
    try {
      const additions: AiAttachment[] = [];
      for (const file of files) {
        if (this.attachments.length + additions.length >= 6) {
          throw new Error('Attach at most 6 text notes.');
        }
        if (
          !/\.(txt|md|json)$/i.test(file.name) ||
          file.size > 64 * 1024 ||
          file.name.length > 128 ||
          /[\\/]/.test(file.name) ||
          Array.from(file.name).some(
            (character) => character.charCodeAt(0) < 32,
          )
        ) {
          throw new Error(
            'Only .txt, .md and .json notes up to 64 KiB are supported. Load trace/video files in WinScope instead.',
          );
        }
        const content = new TextDecoder('utf-8', {fatal: true}).decode(
          await file.arrayBuffer(),
        );
        if (content.includes('\0')) {
          throw new Error('Attachments must be UTF-8 text notes.');
        }
        const mimeType = /\.json$/i.test(file.name)
          ? 'application/json'
          : /\.md$/i.test(file.name)
            ? 'text/markdown'
            : 'text/plain';
        additions.push({name: file.name, mimeType, content});
        if (
          new TextEncoder().encode(
            [...this.attachments, ...additions]
              .map((item) => item.content)
              .join(''),
          ).length >
          256 * 1024
        ) {
          throw new Error('Attached notes exceed the 256 KiB total limit.');
        }
      }
      if (revision === this.revision) {
        this.attachments = [...this.attachments, ...additions];
      }
    } catch (error) {
      if (revision === this.revision) this.showError(error);
    } finally {
      this.attaching = false;
    }
  }

  async previewReport(): Promise<void> {
    if (this.reportPreview) {
      this.reportPreview = '';
      return;
    }
    const id = this.sessionId;
    const revision = this.revision;
    this.reportBusy = true;
    try {
      const blob = await this.client?.report(id, 'markdown');
      const text = await blob?.text();
      if (revision === this.revision) this.reportPreview = text ?? '';
    } catch (error) {
      if (revision === this.revision) this.showError(error);
    } finally {
      this.reportBusy = false;
    }
  }

  async copyReport(): Promise<void> {
    const blob = await this.client
      ?.report(this.sessionId, 'markdown')
      .catch((error) => {
        this.showError(error);
        return undefined;
      });
    if (blob) await this.copyText(await blob.text());
  }

  async copyText(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
      this.notice = 'Copied to clipboard.';
    } catch {
      this.error =
        'Clipboard is unavailable. Select and copy the text directly.';
    }
  }

  async exportReport(format: 'markdown' | 'html'): Promise<void> {
    if (!this.client || !this.sessionId) return;
    try {
      const sessionId = this.sessionId;
      const blob = await this.client.report(sessionId, format);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `winscope-ai-${sessionId}.${format === 'html' ? 'html' : 'md'}`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      this.showError(error);
    }
  }

  onTranscriptScroll(): void {
    const element = this.transcript?.nativeElement;
    if (element) {
      this.followTail =
        element.scrollHeight - element.scrollTop - element.clientHeight < 80;
    }
  }

  onResponseLayoutChanged(): void {
    if (this.followTail) this.scrollToLatest();
  }

  scrollToLatest(): void {
    this.followTail = true;
    requestAnimationFrame(() => {
      if (this.followTail && !this.controller.signal.aborted) {
        const element = this.transcript?.nativeElement;
        if (element) element.scrollTop = element.scrollHeight;
      }
    });
  }

  private async watchSession(id: string, revision: number, pending?: AiTraceQueryRequest): Promise<void> {
    this.streamController?.abort();
    const controller = new AbortController();
    this.streamController = controller;
    if (pending) void this.answerTraceQuery(id, pending, revision, controller.signal);
    let terminal = false;
    try {
      const after = this.events[this.events.length - 1]?.id ?? 0;
      await this.client?.stream(
        id,
        (event) => {
          if (revision !== this.revision || controller.signal.aborted) return;
          if (event.id && this.events.some((item) => item.id === event.id)) {
            return;
          }
          this.events = [...this.events, event];
          this.turns = projectConversation(this.events);
          if (event.type === 'trace_query_requested') {
            void this.answerTraceQuery(id, event.data, revision, controller.signal);
          }
          if (
            event.type === 'analysis_completed' ||
            event.type === 'analysis_cancelled' || event.type === 'error'
          ) {
            terminal = true;
          }
          if (this.followTail) this.scrollToLatest();
        },
        controller.signal,
        after,
      );
      if (revision === this.revision) {
        if (!terminal) {
          this.error =
            'Connection interrupted. Select this conversation again to reconnect.';
        }
      }
    } catch (error) {
      if (!terminal && revision === this.revision && !controller.signal.aborted) {
        this.showError(error);
      }
    } finally {
      if (revision === this.revision) {
        this.running = !terminal;
        this.applyPendingSettings();
      }
      void this.refreshSessions(true);
    }
  }

  private async answerTraceQuery(
    sessionId: string,
    data: unknown,
    revision: number,
    signal: AbortSignal,
  ): Promise<void> {
    const run = this.traceQueryRun;
    if (revision !== this.revision || signal.aborted || this.controller.signal.aborted ||
      typeof data !== 'object' || data === null) return;
    const request = data as AiTraceQueryRequest;
    if (typeof request.contextId !== 'string' || !request.contextId.trim() || request.contextId.length > 128 ||
      typeof request.queryId !== 'string' || !/^[a-zA-Z0-9-]{1,128}$/.test(request.queryId)) return;
    const query = request.query;
    if (!isAiTraceQuery(query)) {
      if (run?.sessionId === sessionId && request.contextId === run.contextId) {
        await this.client?.respondToTraceQuery(sessionId, request.queryId, run.contextId,
          {error: 'Invalid trace query options.'}, signal).catch((error) => {
            if (!signal.aborted && revision === this.revision) this.showError(error);
          });
      }
      return;
    }
    if (!run) {
      await this.declineTraceQuery(sessionId, request, revision, signal);
      return;
    }
    if (run.sessionId !== sessionId || request.contextId !== run.contextId || run.handled.has(request.queryId)) return;
    const attempt = Symbol();
    run.handled.set(request.queryId, attempt);
    let response: {result: WinscopeTraceSnapshot} | {error: string};
    try {
      response = {result: await run.query(query)};
    } catch (error) {
      response = {error: (error instanceof Error ? error.message : 'Trace query failed.').slice(0, 512)};
    }
    if (this.traceQueryRun !== run || revision !== this.revision || signal.aborted || this.controller.signal.aborted) {
      if (run.handled.get(request.queryId) === attempt) run.handled.delete(request.queryId);
      if (!run.cancelled && revision === this.revision && !signal.aborted && !this.controller.signal.aborted) {
        await this.declineTraceQuery(sessionId, request, revision, signal);
      }
      return;
    }
    try {
      await this.client?.respondToTraceQuery(sessionId, request.queryId, run.contextId, response, signal);
    } catch (error) {
      if (run.handled.get(request.queryId) === attempt) run.handled.delete(request.queryId);
      if (!signal.aborted && revision === this.revision) this.showError(error);
    }
  }

  private async declineTraceQuery(sessionId: string, request: AiTraceQueryRequest,
    revision: number, signal: AbortSignal): Promise<void> {
    try {
      await this.client?.respondToTraceQuery(sessionId, request.queryId, request.contextId,
        {error: 'Trace query authorization is no longer available.'}, signal);
    } catch (error) {
      if (!signal.aborted && revision === this.revision) this.showError(error);
    }
  }

  private saveDraft(): void {
    this.drafts.set(this.sessionId, {
      text: this.prompt,
      attachments: [...this.attachments],
      includeEvidence: this.includeEvidence,
    });
  }

  private restoreDraft(): void {
    const draft = this.drafts.get(this.sessionId);
    this.prompt = draft?.text ?? '';
    this.attachments = draft?.attachments ?? [];
    this.includeEvidence = draft?.includeEvidence ?? true;
    this.resizeComposer();
  }

  private readActiveSession(): string | null {
    try {
      return sessionStorage.getItem(`winscope.ai.active.${this.endpoint}`);
    } catch {
      return null;
    }
  }

  private rememberActiveSession(id: string): void {
    try {
      const key = `winscope.ai.active.${this.endpoint}`;
      if (id) sessionStorage.setItem(key, id);
      else sessionStorage.removeItem(key);
    } catch {
      /* Storage may be disabled. Server history remains usable. */
    }
  }

  private focusComposer(): void {
    requestAnimationFrame(() => {
      if (!this.controller.signal.aborted) this.composer?.nativeElement.focus();
    });
  }

  private showError(error: unknown): void {
    if (!this.controller.signal.aborted) {
      this.error = error instanceof Error ? error.message : String(error);
    }
  }
}
