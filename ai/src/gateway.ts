import {createServer, IncomingMessage, Server, ServerResponse} from 'node:http';
import {randomUUID} from 'node:crypto';
import {performance} from 'node:perf_hooks';
import {AgentRuntime} from './runtime';
import {AiSelection, ChatTurn, EvidenceInput, JsonObject, JsonValue, Provider, ReasoningLevel, RuntimeEvent, TextAttachment, TraceDataQuery} from './types';
import {buildHtmlReport, buildMarkdownReport} from './report';
import {importLocalProvider, isModelId, LocalConfigOptions} from './local_config';
import {isRecord} from './json';
import {CommandProvider, configureProvider, OpenAICompatibleProvider} from './providers';
import {GatewaySettingsOptions, hasOnlyFields, parseProviderConfiguration, readSettings, SavedAiSettings, SavedProviderSettings, writeSettings} from './settings';

const SHUTDOWN_TIMEOUT_MS = 5000;
const TRACE_QUERY_TIMEOUT_MS = 20_000;
const MAX_TRACE_QUERY_RESULT_BYTES = 128 * 1024;

type SessionStatus = 'running' | 'completed' | 'failed' | 'cancelled';
interface PendingTraceQuery {
  id: string;
  contextId: string;
  query: TraceDataQuery;
  resolve: (result: JsonObject) => void;
  reject: (error: Error) => void;
}
interface Session {
  id: string;
  title: string;
  agentId: string;
  providerId?: string;
  modelId?: string;
  reasoningLevel: ReasoningLevel;
  prompts: string[];
  history: ChatTurn[];
  events: Array<{id: number; event: RuntimeEvent}>;
  watchers: Set<ServerResponse>;
  controller: AbortController;
  run?: Promise<void>;
  status: SessionStatus;
  createdAt: number;
  updatedAt: number;
  result?: JsonValue;
  error?: string;
  traceQueryContextId?: string;
  pendingTraceQuery?: PendingTraceQuery;
}
interface TurnInput {
  prompt: string;
  agentId: string;
  providerId?: string;
  modelId?: string;
  reasoningLevel: ReasoningLevel;
  effectiveLevel?: ReasoningLevel;
  evidence?: EvidenceInput;
  attachments: TextAttachment[];
  traceQueryEnabled: boolean;
  traceQueryContextId?: string;
}
class HttpError extends Error {
  constructor(readonly statusCode: number, message: string) { super(message); }
}

export class AiGateway {
  private readonly sessions = new Map<string, Session>();
  private readonly importingProviders = new Set<string>();
  private settings: SavedAiSettings = {version: 1, providers: []};
  private selection?: AiSelection;
  private initialization?: Promise<void>;
  private closePromise?: Promise<void>;
  readonly server: Server;
  constructor(private readonly runtime: AgentRuntime, private readonly localConfigOptions: LocalConfigOptions = {}, private readonly settingsOptions: GatewaySettingsOptions = {}) {
    this.server = createServer((request, response) => void this.handle(request, response));
  }
  async listen(port: number, host = '127.0.0.1'): Promise<void> {
    if (this.closePromise) throw new Error('AI gateway is shutting down');
    if (host !== '127.0.0.1' && host !== 'localhost' && host !== '::1') throw new Error('AI gateway must bind to loopback');
    await (this.initialization ??= this.restoreSettings());
    if (this.closePromise) throw new Error('AI gateway is shutting down');
    return new Promise((resolve, reject) => {
      this.server.once('error', reject);
      this.server.listen(port, host, () => { this.server.off('error', reject); resolve(); });
    });
  }
  close(): Promise<void> {
    return this.closePromise ??= Promise.resolve().then(() => this.closeSessions());
  }
  private async closeSessions(): Promise<void> {
    const runs: Array<Promise<void>> = [];
    for (const session of this.sessions.values()) {
      if (session.run) runs.push(session.run);
      if (session.status === 'running') session.controller.abort();
      for (const watcher of session.watchers) watcher.end();
      session.watchers.clear();
    }
    const serverClosed = new Promise<void>((resolve, reject) => this.server.close((error) => {
      if (error && (error as NodeJS.ErrnoException).code !== 'ERR_SERVER_NOT_RUNNING') reject(error);
      else resolve();
    }));
    let timer: ReturnType<typeof setTimeout> | undefined;
    const deadline = new Promise<never>((_, reject) => {
      timer = setTimeout(() => {
        this.server.closeAllConnections();
        reject(new Error('AI gateway shutdown timed out'));
      }, SHUTDOWN_TIMEOUT_MS);
    });
    try {
      // Command cancellation settles only after SIGTERM/SIGKILL and child close.
      await Promise.race([Promise.all([serverClosed, Promise.allSettled(runs)]), deadline]);
    } finally {
      clearTimeout(timer);
    }
  }
  private async handle(request: IncomingMessage, response: ServerResponse): Promise<void> {
    response.setHeader('x-content-type-options', 'nosniff');
    const method = request.method ?? 'GET';
    try {
      if (!isLoopbackAuthority(request.headers.host)) throw new HttpError(403, 'loopback Host required');
      const origin = request.headers.origin;
      if (origin !== undefined && !isLoopbackOrigin(origin)) throw new HttpError(403, 'loopback Origin required');
      if (method !== 'GET' && method !== 'POST') throw new HttpError(405, 'method not allowed');
      if (method === 'POST' && !/^application\/json(?:\s*;|\s*$)/i.test(request.headers['content-type'] ?? '')) throw new HttpError(415, 'application/json required');
      if (this.closePromise) throw new HttpError(503, 'AI gateway is shutting down');
      const url = new URL(request.url ?? '/', 'http://localhost');
      if (method === 'GET' && url.pathname === '/health') return this.json(response, 200, {ok: true, service: 'winscope-ai'});
      if (method === 'GET' && url.pathname === '/api/providers') return this.json(response, 200, {providers: this.runtime.providers.list(), ...(this.selection ? {selection: this.selection} : {})});
      if (method === 'POST' && url.pathname === '/api/settings') return await this.saveSettings(request, response);
      if (method === 'POST' && url.pathname === '/api/providers/import-local') return await this.importLocalConfiguration(request, response);
      if (method === 'POST' && url.pathname === '/api/providers/list-models') return await this.listLocalModels(request, response);
      if (method === 'GET' && url.pathname === '/api/agents') return this.json(response, 200, {agents: this.runtime.agents.list()});
      if (method === 'GET' && url.pathname === '/api/skills') return this.json(response, 200, {skills: this.runtime.skills.list()});
      if (method === 'GET' && url.pathname === '/api/sessions') {
        return this.json(response, 200, {sessions: [...this.sessions.values()].sort((a, b) => b.updatedAt - a.updatedAt).map((session) => this.summary(session))});
      }
      if (method === 'POST' && url.pathname === '/api/analyze') return await this.startAnalysis(request, response);
      const match = url.pathname.match(/^\/api\/sessions\/([^/]+)(?:\/(continue|stream|cancel|report|trace-query\/([^/]+)))?$/);
      if (!match) return this.json(response, 404, {error: 'not found'});
      const session = this.sessions.get(decodeURIComponent(match[1]));
      if (!session) return this.json(response, 404, {error: 'session not found'});
      if (method === 'POST' && match[3]) return await this.acceptTraceQuery(request, response, session, match[3]);
      if (method === 'POST' && match[2] === 'continue') return await this.continueSession(request, response, session);
      if (method === 'GET' && match[2] === 'stream') {
        const after = Number(url.searchParams.get('after') ?? request.headers['last-event-id'] ?? 0);
        if (!Number.isSafeInteger(after) || after < 0 || after > session.events.length) throw new HttpError(400, 'invalid event cursor');
        return this.stream(response, session, after);
      }
      if (method === 'POST' && match[2] === 'cancel') {
        if (session.status === 'running') session.controller.abort();
        return this.json(response, 202, {...this.summary(session), status: session.status === 'running' ? 'cancelling' : session.status});
      }
      if (method === 'GET' && match[2] === 'report') return this.report(response, session, url.searchParams.get('format'));
      if (method === 'GET' && !match[2]) return this.json(response, 200, {...this.summary(session), events: session.events, result: session.result, error: session.error,
        ...(session.pendingTraceQuery ? {pendingTraceQuery: {
          queryId: session.pendingTraceQuery.id, contextId: session.pendingTraceQuery.contextId,
          query: session.pendingTraceQuery.query,
        }} : {}),
      });
      this.json(response, 404, {error: 'not found'});
    } catch (error) {
      this.json(response, error instanceof HttpError ? error.statusCode : 500, {error: error instanceof Error ? error.message : String(error)});
    }
  }
  private async listLocalModels(request: IncomingMessage, response: ServerResponse): Promise<void> {
    const body = await readJson(request);
    const id = body.providerId;
    if ((id !== 'codex' && id !== 'claude') || Object.keys(body).some((key) => key !== 'providerId')) {
      throw new HttpError(400, 'Choose Codex or Claude to read its model list.');
    }
    this.lockSettings(id);
    try {
      const provider = await importLocalProvider(id, this.localConfigOptions);
      if (this.closePromise) throw new HttpError(503, 'AI gateway is shutting down');
      const descriptor = provider.descriptor!;
      this.runtime.providers.register(provider);
      this.json(response, 200, {provider: descriptor});
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw new HttpError(422, error instanceof Error ? error.message : 'Model list could not be read.');
    } finally {
      this.importingProviders.delete(id);
    }
  }
  private async importLocalConfiguration(request: IncomingMessage, response: ServerResponse): Promise<void> {
    const body = await readJson(request);
    const id = body.providerId;
    if ((id !== 'codex' && id !== 'claude') || Object.keys(body).some((key) => key !== 'providerId')) {
      throw new HttpError(400, 'Choose Codex or Claude to read its local configuration.');
    }
    this.lockSettings(id);
    try {
      const provider = await importLocalProvider(id, this.localConfigOptions);
      if (this.closePromise) throw new HttpError(503, 'AI gateway is shutting down');
      const descriptor = provider.descriptor!;
      const modelId = descriptor.defaultModelId ?? 'default';
      const levels = descriptor.models.find((model) => model.id === modelId)?.levels ?? descriptor.reasoningLevels;
      const importedLevel = descriptor.localConfig?.reasoningLevel;
      const selection: AiSelection = {
        agentId: this.selection?.agentId ?? this.runtime.agents.list().find((agent) => agent.id === 'display-anomaly')?.id ?? this.runtime.agents.list()[0].id,
        providerId: id, modelId, customModel: '',
        reasoningLevel: importedLevel && levels.includes(importedLevel) ? importedLevel : levels[0] ?? 'medium',
      };
      const saved: SavedProviderSettings = {id, importLocal: true};
      await this.persistSettings(this.updatedSettings(selection, saved));
      this.runtime.providers.register(provider);
      this.json(response, 200, {provider: descriptor, selection});
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw new HttpError(422, error instanceof Error ? error.message : 'Local configuration could not be read.');
    } finally {
      this.importingProviders.delete(id);
    }
  }
  private lockSettings(id: string): void {
    if (this.closePromise) throw new HttpError(503, 'AI gateway is shutting down');
    if (this.importingProviders.size || [...this.sessions.values()].some((session) => session.status === 'running')) throw new HttpError(409, 'Wait for running sessions and provider settings to finish.');
    this.importingProviders.add(id);
  }
  private parseSelection(value: unknown): AiSelection {
    if (!isRecord(value) || !hasOnlyFields(value, ['agentId', 'providerId', 'modelId', 'customModel', 'reasoningLevel'])) throw new HttpError(400, 'invalid selection fields');
    const {agentId, providerId, modelId, customModel, reasoningLevel} = value;
    if (typeof agentId !== 'string' || typeof providerId !== 'string' || typeof modelId !== 'string' || typeof customModel !== 'string' || customModel.length > 128 || (reasoningLevel !== 'low' && reasoningLevel !== 'medium' && reasoningLevel !== 'high')) throw new HttpError(400, 'invalid selection');
    let defaultProvider: string | undefined;
    try { defaultProvider = this.runtime.agents.get(agentId).providerId; } catch { throw new HttpError(400, 'unknown agent'); }
    if (modelId === '__custom__' && !isModelId(customModel)) throw new HttpError(400, 'invalid custom model identifier');
    const activeId = providerId || defaultProvider;
    if (activeId) {
      const provider = this.runtime.providers.list().find((item) => item.id === activeId);
      if (!provider) throw new HttpError(400, 'unknown provider');
      const effectiveModel = modelId === '__custom__' ? customModel : modelId;
      if (!isModelId(effectiveModel)) throw new HttpError(400, 'invalid model identifier');
      const model = provider.models.find((item) => item.id === effectiveModel) ?? (effectiveModel === 'default' ? provider.models[0] : undefined);
      if (modelId === '__custom__' ? !provider.supportsCustomModel : !model) throw new HttpError(400, 'unsupported model');
      const levels = model?.levels ?? provider.reasoningLevels;
      if (levels.length && !levels.includes(reasoningLevel as ReasoningLevel)) throw new HttpError(400, 'provider/model does not support the selected reasoning level');
    } else if (modelId !== 'default') throw new HttpError(400, 'a provider is required for model selection');
    return {agentId, providerId, modelId, customModel: modelId === '__custom__' ? customModel : '', reasoningLevel};
  }
  private updatedSettings(selection: AiSelection, provider?: SavedProviderSettings): SavedAiSettings {
    return {version: 1, selection, providers: provider ? [...this.settings.providers.filter((item) => item.id !== provider.id), provider] : this.settings.providers};
  }
  private async persistSettings(settings: SavedAiSettings): Promise<void> {
    if (this.settingsOptions.settingsPath) {
      try { await writeSettings(this.settingsOptions.settingsPath, settings); }
      catch { throw new HttpError(500, 'AI settings could not be saved.'); }
    }
    this.settings = settings;
    this.selection = settings.selection;
  }
  private async saveSettings(request: IncomingMessage, response: ServerResponse): Promise<void> {
    const body = await readJson(request);
    this.lockSettings('settings');
    try {
      if (!hasOnlyFields(body, ['selection', 'configuration'])) throw new HttpError(400, 'invalid settings fields');
      const selection = this.parseSelection(body.selection);
      const activeId = selection.providerId || this.runtime.agents.get(selection.agentId).providerId;
      let provider = activeId ? this.runtime.providers.get(activeId) : undefined;
      let saved: SavedProviderSettings | undefined;
      if (body.configuration !== undefined) {
        if (!provider?.descriptor?.configuration) throw new HttpError(400, 'provider configuration is not supported');
        try { provider = configureProvider(provider, parseProviderConfiguration(body.configuration)); }
        catch (error) { throw new HttpError(400, error instanceof Error ? error.message : 'invalid provider configuration'); }
        const previous = this.settings.providers.find((item) => item.id === activeId);
        saved = {id: activeId!, ...(previous?.importLocal || provider.descriptor?.importedFrom ? {importLocal: true as const} : {}), configuration: (provider as CommandProvider | OpenAICompatibleProvider).configurationOverrides};
      }
      await this.persistSettings(this.updatedSettings(selection, saved));
      if (provider) this.runtime.providers.register(provider);
      this.json(response, 200, {selection, ...(provider ? {provider: provider.descriptor ?? this.runtime.providers.list().find((item) => item.id === activeId)} : {})});
    } finally { this.importingProviders.delete('settings'); }
  }
  private applyStoredConfiguration(provider: Provider, value: unknown): Provider {
    if (!provider.descriptor?.configuration || !isRecord(value) || !hasOnlyFields(value, ['baseUrl', 'providerName', 'apiKeyEnv', 'timeoutMs'])) throw new Error('invalid saved provider configuration');
    return configureProvider(provider, parseProviderConfiguration({...provider.descriptor.configuration, ...value}));
  }
  private async restoreSettings(): Promise<void> {
    if (!this.settingsOptions.settingsPath) return;
    let value: unknown;
    try { value = await readSettings(this.settingsOptions.settingsPath); } catch { return; }
    if (!isRecord(value) || value.version !== 1 || !hasOnlyFields(value, ['version', 'selection', 'providers']) || !Array.isArray(value.providers)) return;
    const restored: SavedProviderSettings[] = [];
    const seen = new Set<string>();
    for (const entry of value.providers) {
      if (!isRecord(entry) || typeof entry.id !== 'string' || !hasOnlyFields(entry, ['id', 'importLocal', 'configuration']) || (entry.importLocal !== undefined && entry.importLocal !== true) || seen.has(entry.id)) continue;
      seen.add(entry.id);
      if (entry.importLocal !== true && entry.configuration === undefined) continue;
      try {
        if (entry.importLocal && entry.id !== 'codex' && entry.id !== 'claude') continue;
        let provider: Provider = entry.importLocal === true
          ? await importLocalProvider(entry.id as 'codex' | 'claude', this.localConfigOptions)
          : this.runtime.providers.get(entry.id);
        if (entry.configuration !== undefined) provider = this.applyStoredConfiguration(provider, entry.configuration);
        if (this.closePromise) return;
        this.runtime.providers.register(provider);
        restored.push({id: entry.id, ...(entry.importLocal ? {importLocal: true} : {}), ...(entry.configuration !== undefined ? {configuration: (provider as CommandProvider | OpenAICompatibleProvider).configurationOverrides} : {})});
      } catch {
        // A stale marker is not evidence that the CLI is still configured.
      }
    }
    this.settings = {version: 1, providers: restored};
    try { this.selection = this.parseSelection(value.selection); this.settings.selection = this.selection; } catch { /* Ignore stale or malformed selections. */ }
  }
  private parseTurn(body: Record<string, unknown>, previous?: Session): TurnInput {
    if (this.closePromise) throw new HttpError(503, 'AI gateway is shutting down');
    // Child agents can use providers other than the top-level selection.
    if (this.importingProviders.size) throw new HttpError(409, 'Wait for the provider configuration to finish loading.');
    const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
    if (!prompt || prompt.length > 32_768) throw new HttpError(400, 'prompt must contain 1 to 32768 characters');
    const agentId = optionalString(body.agentId, 'agentId') ?? previous?.agentId ?? 'display-anomaly';
    if (previous && agentId !== previous.agentId) throw new HttpError(400, 'start a new session to change agent');
    let defaultProvider: string | undefined;
    try { defaultProvider = this.runtime.agents.get(agentId).providerId; }
    catch { throw new HttpError(400, 'unknown agent'); }
    const providerId = body.providerId === null
      ? defaultProvider
      : optionalString(body.providerId, 'providerId') ?? previous?.providerId ?? defaultProvider;
    const modelId = optionalString(body.modelId, 'modelId') ?? (providerId === previous?.providerId ? previous?.modelId : undefined);
    if (modelId && !isModelId(modelId)) throw new HttpError(400, 'invalid model identifier');
    const level = body.reasoningLevel ?? previous?.reasoningLevel ?? 'medium';
    if (level !== 'low' && level !== 'medium' && level !== 'high') throw new HttpError(400, 'invalid reasoning level');
    let effectiveLevel: ReasoningLevel | undefined;
    if (providerId) {
      const provider = this.runtime.providers.list().find((item) => item.id === providerId);
      if (!provider) throw new HttpError(400, 'unknown provider');
      const model = provider.models.find((item) => item.id === (modelId ?? 'default'))
        ?? ((!modelId || modelId === 'default') ? provider.models[0] : undefined);
      if (modelId && modelId !== 'default' && !model && !provider.supportsCustomModel) throw new HttpError(400, 'unsupported model');
      const levels = model?.levels ?? provider.reasoningLevels;
      if (body.reasoningLevel !== undefined && !levels.includes(level)) throw new HttpError(400, 'provider/model does not support the selected reasoning level');
      if (levels.includes(level)) effectiveLevel = level;
    } else if (modelId && modelId !== 'default') throw new HttpError(400, 'a provider is required for model selection');
    if (body.evidence !== undefined && (typeof body.evidence !== 'object' || body.evidence === null || Array.isArray(body.evidence))) throw new HttpError(400, 'evidence must be an object');
    if (body.traceQueryEnabled !== undefined && typeof body.traceQueryEnabled !== 'boolean') throw new HttpError(400, 'traceQueryEnabled must be a boolean');
    const traceQueryEnabled = body.traceQueryEnabled === true;
    const traceQueryContextId = optionalString(body.traceQueryContextId, 'traceQueryContextId');
    if (traceQueryEnabled && !traceQueryContextId) throw new HttpError(400, 'traceQueryContextId is required for trace queries');
    return {prompt, agentId, providerId, modelId, reasoningLevel: level, effectiveLevel, evidence: body.evidence as EvidenceInput | undefined, attachments: parseAttachments(body.attachments), traceQueryEnabled, traceQueryContextId};
  }
  private async startAnalysis(request: IncomingMessage, response: ServerResponse): Promise<void> {
    const input = this.parseTurn(await readJson(request));
    if (this.sessions.size >= 100) {
      const oldest = [...this.sessions.values()].filter((item) => item.status !== 'running').sort((a, b) => a.updatedAt - b.updatedAt)[0];
      if (!oldest) throw new HttpError(503, 'too many running sessions');
      this.sessions.delete(oldest.id);
    }
    const now = Date.now();
    const session: Session = {
      id: randomUUID(), title: input.prompt.replace(/\s+/g, ' ').slice(0, 80),
      agentId: input.agentId, providerId: input.providerId, modelId: input.modelId,
      reasoningLevel: input.reasoningLevel, prompts: [], history: [], events: [], watchers: new Set(),
      controller: new AbortController(), status: 'running', createdAt: now, updatedAt: now,
    };
    this.sessions.set(session.id, session);
    session.run = this.runSession(session, input);
    this.json(response, 202, this.summary(session));
  }
  private async continueSession(request: IncomingMessage, response: ServerResponse, session: Session): Promise<void> {
    const body = await readJson(request);
    // Recheck after reading the request body: two concurrent continues must not race.
    if (session.status === 'running') throw new HttpError(409, 'session is already running');
    if (session.prompts.length >= 24) throw new HttpError(409, 'session reached the 24-turn limit; start a new session');
    const input = this.parseTurn(body, session);
    session.controller = new AbortController();
    session.status = 'running';
    session.error = undefined;
    session.result = undefined;
    session.providerId = input.providerId;
    session.modelId = input.modelId;
    session.reasoningLevel = input.reasoningLevel;
    session.updatedAt = Date.now();
    session.run = this.runSession(session, input);
    this.json(response, 202, this.summary(session));
  }
  private async runSession(session: Session, input: TurnInput): Promise<void> {
    const startedAt = performance.now();
    const signal = session.controller.signal;
    session.traceQueryContextId = input.traceQueryEnabled ? input.traceQueryContextId : undefined;
    session.prompts.push(input.prompt);
    this.emit(session, {type: 'analysis_started', data: {
      sessionId: session.id, agentId: session.agentId, prompt: input.prompt, turn: session.prompts.length,
      reasoningLevel: session.reasoningLevel,
      ...(session.providerId ? {providerId: session.providerId} : {}),
      ...(session.modelId ? {modelId: session.modelId} : {}),
      attachments: input.attachments.map((file) => ({name: file.name, mimeType: file.mimeType, sizeBytes: Buffer.byteLength(file.content, 'utf8')})),
    }});
    try {
      const result = await this.runtime.run(session.agentId, {
        prompt: input.prompt, evidence: input.evidence, providerId: session.providerId,
        modelId: session.modelId, reasoningLevel: input.effectiveLevel,
        history: session.history, attachments: input.attachments, signal,
        ...(input.traceQueryEnabled ? {queryTrace: (query: TraceDataQuery) => this.queryTrace(session, signal, input.traceQueryContextId!, query)} : {}),
      }, {onEvent: (event) => this.emit(session, event)});
      if (result.provider?.timedOut) {
        session.status = 'failed';
        session.error = result.provider.output;
        this.emit(session, {type: 'error', message: result.provider.output});
      } else if (signal.aborted || result.provider?.cancelled) {
        session.status = 'cancelled';
        this.emit(session, {type: 'analysis_cancelled', message: 'Analysis stopped'});
      } else {
        session.status = 'completed';
        session.result = result as unknown as JsonValue;
        const attachmentContext = input.attachments.map((file) => `\nAttachment: ${file.name}\n${file.content}`).join('');
        session.history.push({role: 'user', content: boundedHistoryText(input.prompt + attachmentContext)}, {role: 'assistant', content: boundedHistoryText(result.provider?.output ?? JSON.stringify(result.skillResults))});
        // Keep recent full turns within a bounded model context; never silently truncate the current prompt.
        while (session.history.length > 2 && session.history.reduce((sum, turn) => sum + turn.content.length, 0) > 65_536) session.history.splice(0, 2);
        this.emit(session, {type: 'analysis_completed', data: {
          ...result as unknown as Record<string, JsonValue>,
          durationMs: Math.max(0, Math.round(performance.now() - startedAt)),
        }});
      }
    } catch (error) {
      session.status = signal.aborted ? 'cancelled' : 'failed';
      session.error = error instanceof Error ? error.message : String(error);
      this.emit(session, {type: session.status === 'cancelled' ? 'analysis_cancelled' : 'error', message: session.error});
    } finally {
      session.pendingTraceQuery?.reject(new Error('Trace query turn ended'));
      session.traceQueryContextId = undefined;
      session.updatedAt = Date.now();
      for (const watcher of session.watchers) watcher.end();
      session.watchers.clear();
    }
  }
  private async queryTrace(session: Session, signal: AbortSignal, contextId: string, query: TraceDataQuery): Promise<JsonObject> {
    if (this.closePromise || signal.aborted || session.controller.signal !== signal || session.status !== 'running' || session.traceQueryContextId !== contextId) throw new Error('Trace query turn is no longer running');
    if (session.pendingTraceQuery) throw new Error('A trace query is already pending');
    const validatedQuery = {...query, ...(query.traceTypes ? {traceTypes: [...query.traceTypes]} : {})};
    return new Promise<JsonObject>((resolve, reject) => {
      const cleanup = () => {
        clearTimeout(timer);
        signal.removeEventListener('abort', onAbort);
        if (session.pendingTraceQuery === pending) session.pendingTraceQuery = undefined;
      };
      const pending: PendingTraceQuery = {
        id: randomUUID(), contextId, query: validatedQuery,
        resolve: (result) => { cleanup(); resolve(result); },
        reject: (error) => { cleanup(); reject(error); },
      };
      const onAbort = () => pending.reject(new Error('Trace query cancelled'));
      const timer = setTimeout(() => pending.reject(new Error('Trace query timed out')), TRACE_QUERY_TIMEOUT_MS);
      session.pendingTraceQuery = pending;
      signal.addEventListener('abort', onAbort, {once: true});
      try {
        this.emit(session, {type: 'trace_query_requested', data: {
          queryId: pending.id, contextId, query: validatedQuery,
        }});
      } catch (error) { pending.reject(error instanceof Error ? error : new Error('Trace query request failed')); }
    });
  }
  private async acceptTraceQuery(request: IncomingMessage, response: ServerResponse, session: Session, queryId: string): Promise<void> {
    const pending = session.pendingTraceQuery;
    if (!pending) throw new HttpError(409, 'trace query is no longer pending');
    const isCurrent = () => !this.closePromise && session.status === 'running' && !session.controller.signal.aborted && session.pendingTraceQuery === pending && pending.id === queryId && session.traceQueryContextId === pending.contextId;
    if (!isCurrent()) throw new HttpError(409, 'trace query is no longer pending');
    const body = await readJson(request);
    // The turn may have ended or this query may have settled while the body was read.
    if (!isCurrent()) throw new HttpError(409, 'trace query is no longer pending');
    if (!hasOnlyFields(body, ['contextId', 'result', 'error']) || typeof body.contextId !== 'string' || Object.hasOwn(body, 'result') === Object.hasOwn(body, 'error')) throw new HttpError(400, 'expected contextId and exactly one trace query result or error');
    if (body.contextId !== pending.contextId) throw new HttpError(409, 'trace query context does not match');
    if (Object.hasOwn(body, 'result')) {
      if (!isRecord(body.result)) throw new HttpError(400, 'trace query result must be an object');
      if (Buffer.byteLength(JSON.stringify(body.result), 'utf8') > MAX_TRACE_QUERY_RESULT_BYTES) throw new HttpError(413, 'trace query result exceeds the 128 KiB limit');
      pending.resolve(body.result as JsonObject);
    } else {
      if (typeof body.error !== 'string' || !body.error.trim() || body.error.length > 512) throw new HttpError(400, 'trace query error must contain 1 to 512 characters');
      pending.reject(new Error(body.error));
    }
    this.json(response, 200, {ok: true});
  }
  private summary(session: Session): Record<string, unknown> {
    return {
      sessionId: session.id, title: session.title, agentId: session.agentId,
      providerId: session.providerId, modelId: session.modelId, reasoningLevel: session.reasoningLevel,
      createdAt: session.createdAt, updatedAt: session.updatedAt, status: session.status,
      lastPrompt: session.prompts.at(-1) ?? '',
    };
  }
  private emit(session: Session, event: RuntimeEvent): void {
    session.updatedAt = Date.now();
    const item = {id: session.events.length + 1, event};
    session.events.push(item);
    const payload = encodeEvent(item);
    for (const watcher of session.watchers) watcher.write(payload);
  }
  private stream(response: ServerResponse, session: Session, after: number): void {
    response.writeHead(200, {'content-type': 'text/event-stream', 'cache-control': 'no-cache', connection: 'keep-alive'});
    for (const item of session.events) if (item.id > after) response.write(encodeEvent(item));
    if (session.status === 'running') {
      session.watchers.add(response);
      response.on('close', () => session.watchers.delete(response));
    } else response.end();
  }
  private report(response: ServerResponse, session: Session, format: string | null): void {
    if (format !== null && format !== 'html' && format !== 'markdown') throw new HttpError(400, 'unsupported report format');
    if (session.status === 'running') throw new HttpError(409, 'analysis is still running');
    const isHtml = format === 'html';
    const body = isHtml ? buildHtmlReport(session.id, session.result, session.error) : buildMarkdownReport(session.id, session.result, session.error);
    response.writeHead(200, {
      'content-type': isHtml ? 'text/html; charset=utf-8' : 'text/markdown; charset=utf-8',
      'content-disposition': `attachment; filename="winscope-ai-${session.id}.${isHtml ? 'html' : 'md'}"`, 'cache-control': 'no-store',
    });
    response.end(body);
  }
  private json(response: ServerResponse, status: number, value: unknown): void {
    if (this.closePromise) response.shouldKeepAlive = false;
    response.writeHead(status, {'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store'});
    response.end(JSON.stringify(value));
  }
}
function isLoopbackAuthority(value: string | undefined): boolean {
  if (!value) return false;
  const match = /^(?:127\.0\.0\.1|localhost|\[::1\])(?::([0-9]{1,5}))?$/i.exec(value);
  return Boolean(match && (match[1] === undefined || (Number(match[1]) > 0 && Number(match[1]) <= 65_535)));
}
function isLoopbackOrigin(value: string): boolean {
  const match = /^https?:\/\/(.+)$/i.exec(value);
  return Boolean(match && isLoopbackAuthority(match[1]));
}
function boundedHistoryText(content: string): string {
  const note = '\n[Earlier context truncated to the 32 KiB per-message history limit]';
  return content.length > 32_768 ? content.slice(0, 32_768 - note.length) + note : content;
}
function encodeEvent(item: {id: number; event: RuntimeEvent}): string {
  return `id: ${item.id}\nevent: ${item.event.type}\ndata: ${JSON.stringify(item.event)}\n\n`;
}
function optionalString(value: unknown, field: string): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== 'string' || !value.trim() || value.length > 128) throw new HttpError(400, `invalid ${field}`);
  return value;
}
function parseAttachments(value: unknown): TextAttachment[] {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.length > 6) throw new HttpError(400, 'at most 6 text attachments are supported');
  let total = 0;
  return value.map((file: unknown) => {
    if (typeof file !== 'object' || file === null || Array.isArray(file)) throw new HttpError(400, 'invalid attachment');
    const {name, mimeType, content} = file as Record<string, unknown>;
    if (typeof name !== 'string' || !name.trim() || name.length > 128 || /[\\/\u0000-\u001f]/.test(name)) throw new HttpError(400, 'invalid attachment name');
    if (mimeType !== 'text/plain' && mimeType !== 'text/markdown' && mimeType !== 'application/json') throw new HttpError(400, 'only text, Markdown and JSON attachments are supported');
    if (typeof content !== 'string' || content.includes('\0')) throw new HttpError(400, 'attachment must contain text');
    const size = Buffer.byteLength(content, 'utf8');
    total += size;
    if (size > 65_536 || total > 262_144) throw new HttpError(413, 'attachments exceed the text size limit');
    return {name, mimeType, content};
  });
}
async function readJson(request: IncomingMessage): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of request) {
    const buffer = Buffer.from(chunk);
    size += buffer.length;
    if (size > 4 * 1024 * 1024) throw new HttpError(413, 'request body too large');
    chunks.push(buffer);
  }
  let value: unknown;
  try { value = JSON.parse(Buffer.concat(chunks).toString('utf8')); }
  catch { throw new HttpError(400, 'invalid JSON request body'); }
  if (typeof value !== 'object' || value === null || Array.isArray(value)) throw new HttpError(400, 'request body must be an object');
  return value as Record<string, unknown>;
}
