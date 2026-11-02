import {A11yModule} from '@angular/cdk/a11y';
import {CommonModule} from '@angular/common';
import {Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild,} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {language, translate, TranslatePipe} from '@common/i18n';
import {AiChatTurn, formatConversationResponse, projectConversation,} from '@services/ai_conversation';
import {AiAttachment, AiCatalog, AiEvent, AiGatewayClient, AiProvider, AiSessionSummary,} from '@services/ai_gateway_client';

import {AiModelSelection, AiSettingsValue} from './ai_settings_component';

interface Draft {
  text: string;
  attachments: AiAttachment[];
  includeEvidence: boolean;
}

@Component({
  selector: 'ai-panel',
  standalone: true,
  imports: [
    A11yModule,
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
export class AiPanelComponent implements OnInit, OnChanges, OnDestroy {
  readonly language = language;
  @Input() endpoint: string | undefined;
  @Input() evidence: unknown;
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

  catalog: AiCatalog = {providers: [], agents: [], skills: []};
  sessions: AiSessionSummary[] = [];
  selectedAgent = 'display-anomaly';
  selectedProvider = '';
  selectedModel = 'default';
  customModel = '';
  selectedLevel = 'medium';
  prompt = '';
  searchQuery = '';
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
  private client?: AiGatewayClient;
  private events: AiEvent[] = [];
  private readonly controller = new AbortController();
  private streamController?: AbortController;
  private customModelProviderId?: string;
  private revision = 0;
  private initialized = false;
  private settingsPending = false;
  private catalogPending = false;
  private readonly drafts = new Map<string, Draft>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['settingsCatalog'] && this.settingsCatalog) {
      this.catalogPending = true;
    }
    if (changes['defaults'] && this.defaults) {
      this.settingsPending = true;
    }
    if (this.initialized) this.applyPendingSettings();
    if (changes['suspended'] && !this.suspended && this.initialized) this.focusComposer();
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
      if (!this.sessionId && this.defaults) this.settingsPending = true;
      this.applyPendingSettings();
      this.selectionReady.emit(this.modelSelection);
    }
  }

  ngOnDestroy(): void {
    this.revision++;
    this.composerObserver?.disconnect();
    this.controller.abort();
    this.streamController?.abort();
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
      (!this.running && this.defaults?.selection.providerId) ||
      this.resolvedProviderId
    );
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
      if (this.defaults && (!this.sessionId || this.defaults.selection.providerId)) {
        this.applySettings(this.defaults.selection);
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
    this.prompt = text;
    this.resizeComposer();
    this.focusComposer();
  }

  async refreshSessions(): Promise<void> {
    if (!this.client) return;
    try {
      const sessions = await this.client.listSessions(this.controller.signal);
      if (!this.controller.signal.aborted) this.sessions = sessions;
    } catch (error) {
      this.showError(error);
    }
  }

  newSession(): void {
    this.saveDraft();
    this.revision++;
    this.streamController?.abort();
    this.submitting = false;
    this.sessionId = '';
    this.events = [];
    this.turns = [];
    this.running = false;
    this.loading = false;
    this.settingsPending = !!this.defaults;
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
      this.settingsPending = !!this.defaults?.selection.providerId;
      this.applyPendingSettings();
      this.rememberActiveSession(id);
      this.scrollToLatest();
      if (this.running) void this.watchSession(id, revision);
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
    if (
      this.defaults?.selection.providerId &&
      this.resolvedProviderId !== this.defaults.selection.providerId
    ) {
      this.applySettings(this.defaults.selection);
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
    this.error = '';
    this.notice = '';
    this.running = true;
    this.submitting = true;
    this.reportPreview = '';
    this.followTail = true;
    // Clear only the submitted draft. Text typed while the request runs is kept.
    this.prompt = '';
    this.attachments = [];
    this.resizeComposer();
    try {
      const session = await this.client.startAnalysis(
        prompt,
        this.selectedAgent,
        this.includeEvidence ? this.evidence : undefined,
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
        },
      );
      if (revision !== this.revision) {
        void this.refreshSessions();
        return;
      }
      this.submitting = false;
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
      void this.refreshSessions();
    }
  }

  async cancel(): Promise<void> {
    if (!this.client || !this.sessionId || this.submitting) return;
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
      const cap = Math.min(336, Math.round(window.innerHeight * 0.4));
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

  scrollToLatest(): void {
    this.followTail = true;
    requestAnimationFrame(() => {
      if (this.followTail && !this.controller.signal.aborted) {
        const element = this.transcript?.nativeElement;
        if (element) element.scrollTop = element.scrollHeight;
      }
    });
  }

  private async watchSession(id: string, revision: number): Promise<void> {
    this.streamController?.abort();
    const controller = new AbortController();
    this.streamController = controller;
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
      if (revision === this.revision && !controller.signal.aborted) {
        this.showError(error);
      }
    } finally {
      if (revision === this.revision) {
        this.running = !terminal;
        this.applyPendingSettings();
      }
      void this.refreshSessions();
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
