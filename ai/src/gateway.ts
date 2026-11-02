import {createServer, IncomingMessage, Server, ServerResponse} from 'node:http';
import {randomUUID} from 'node:crypto';
import {AgentRuntime} from './runtime';
import {ChatTurn, EvidenceInput, JsonValue, ReasoningLevel, RuntimeEvent, TextAttachment} from './types';
import {buildHtmlReport, buildMarkdownReport} from './report';
import {importLocalProvider, isModelId, LocalConfigOptions, LocalProviderId} from './local_config';

type SessionStatus = 'running' | 'completed' | 'failed' | 'cancelled';
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
  status: SessionStatus;
  createdAt: number;
  updatedAt: number;
  result?: JsonValue;
  error?: string;
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
}
class HttpError extends Error {
  constructor(readonly statusCode: number, message: string) { super(message); }
}

export class AiGateway {
  private readonly sessions = new Map<string, Session>();
  private readonly importingProviders = new Set<LocalProviderId>();
  readonly server: Server;
  constructor(private readonly runtime: AgentRuntime, private readonly localConfigOptions: LocalConfigOptions = {}) {
    this.server = createServer((request, response) => void this.handle(request, response));
  }
  listen(port: number, host = '127.0.0.1'): Promise<void> {
    if (host !== '127.0.0.1' && host !== 'localhost' && host !== '::1') return Promise.reject(new Error('AI gateway must bind to loopback'));
    return new Promise((resolve, reject) => {
      this.server.once('error', reject);
      this.server.listen(port, host, () => { this.server.off('error', reject); resolve(); });
    });
  }
  close(): Promise<void> {
    for (const session of this.sessions.values()) {
      session.controller.abort();
      for (const watcher of session.watchers) watcher.end();
    }
    return new Promise((resolve, reject) => this.server.close((error) => error ? reject(error) : resolve()));
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
      const url = new URL(request.url ?? '/', 'http://localhost');
      if (method === 'GET' && url.pathname === '/health') return this.json(response, 200, {ok: true, service: 'winscope-ai'});
      if (method === 'GET' && url.pathname === '/api/providers') return this.json(response, 200, {providers: this.runtime.providers.list()});
      if (method === 'POST' && url.pathname === '/api/providers/import-local') return await this.importLocalConfiguration(request, response);
      if (method === 'GET' && url.pathname === '/api/agents') return this.json(response, 200, {agents: this.runtime.agents.list()});
      if (method === 'GET' && url.pathname === '/api/skills') return this.json(response, 200, {skills: this.runtime.skills.list()});
      if (method === 'GET' && url.pathname === '/api/sessions') {
        return this.json(response, 200, {sessions: [...this.sessions.values()].sort((a, b) => b.updatedAt - a.updatedAt).map((session) => this.summary(session))});
      }
      if (method === 'POST' && url.pathname === '/api/analyze') return await this.startAnalysis(request, response);
      const match = url.pathname.match(/^\/api\/sessions\/([^/]+)(?:\/(continue|stream|cancel|report))?$/);
      if (!match) return this.json(response, 404, {error: 'not found'});
      const session = this.sessions.get(decodeURIComponent(match[1]));
      if (!session) return this.json(response, 404, {error: 'session not found'});
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
      if (method === 'GET' && !match[2]) return this.json(response, 200, {...this.summary(session), events: session.events, result: session.result, error: session.error});
      this.json(response, 404, {error: 'not found'});
    } catch (error) {
      this.json(response, error instanceof HttpError ? error.statusCode : 500, {error: error instanceof Error ? error.message : String(error)});
    }
  }
  private async importLocalConfiguration(request: IncomingMessage, response: ServerResponse): Promise<void> {
    const body = await readJson(request);
    const id = body.providerId;
    if ((id !== 'codex' && id !== 'claude') || Object.keys(body).some((key) => key !== 'providerId')) {
      throw new HttpError(400, 'Choose Codex or Claude to read its local configuration.');
    }
    if (this.importingProviders.size || [...this.sessions.values()].some((session) => session.status === 'running')) {
      throw new HttpError(409, 'Wait for the provider to finish before reading its configuration.');
    }
    this.importingProviders.add(id);
    try {
      const provider = await importLocalProvider(id, this.localConfigOptions);
      this.runtime.providers.register(provider);
      this.json(response, 200, {provider: provider.descriptor});
    } catch (error) {
      throw new HttpError(422, error instanceof Error ? error.message : 'Local configuration could not be read.');
    } finally {
      this.importingProviders.delete(id);
    }
  }
  private parseTurn(body: Record<string, unknown>, previous?: Session): TurnInput {
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
    return {prompt, agentId, providerId, modelId, reasoningLevel: level, effectiveLevel, evidence: body.evidence as EvidenceInput | undefined, attachments: parseAttachments(body.attachments)};
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
    void this.runSession(session, input);
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
    void this.runSession(session, input);
    this.json(response, 202, this.summary(session));
  }
  private async runSession(session: Session, input: TurnInput): Promise<void> {
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
        history: session.history, attachments: input.attachments, signal: session.controller.signal,
      }, {onEvent: (event) => this.emit(session, event)});
      if (session.controller.signal.aborted || result.provider?.cancelled) {
        session.status = 'cancelled';
        this.emit(session, {type: 'analysis_cancelled', message: 'Analysis stopped'});
      } else {
        session.status = 'completed';
        session.result = result as unknown as JsonValue;
        const attachmentContext = input.attachments.map((file) => `\nAttachment: ${file.name}\n${file.content}`).join('');
        session.history.push({role: 'user', content: boundedHistoryText(input.prompt + attachmentContext)}, {role: 'assistant', content: boundedHistoryText(result.provider?.output ?? JSON.stringify(result.skillResults))});
        // Keep recent full turns within a bounded model context; never silently truncate the current prompt.
        while (session.history.length > 2 && session.history.reduce((sum, turn) => sum + turn.content.length, 0) > 65_536) session.history.splice(0, 2);
        this.emit(session, {type: 'analysis_completed', data: result as unknown as JsonValue});
      }
    } catch (error) {
      session.status = session.controller.signal.aborted ? 'cancelled' : 'failed';
      session.error = error instanceof Error ? error.message : String(error);
      this.emit(session, {type: session.status === 'cancelled' ? 'analysis_cancelled' : 'error', message: session.error});
    } finally {
      session.updatedAt = Date.now();
      for (const watcher of session.watchers) watcher.end();
      session.watchers.clear();
    }
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
