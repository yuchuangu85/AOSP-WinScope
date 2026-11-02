export interface AiProviderConfiguration {
  baseUrl: string;
  providerName: string;
  apiKeyEnv: string;
  timeoutMs: number;
}

export interface AiSettingsSelection {
  agentId: string;
  providerId: string;
  modelId: string;
  customModel: string;
  reasoningLevel: string;
}

export interface AiProvider {
  id: string;
  name?: string;
  models?: Array<{id: string; name: string; levels?: string[]}>;
  reasoningLevels?: string[];
  supportsCustomModel?: boolean;
  defaultModelId?: string;
  importedFrom?: string;
  configured?: boolean;
  configuration?: AiProviderConfiguration;
  localConfig?: {
    baseUrl?: string;
    providerName?: string;
    authentication: 'configured' | 'cli-managed' | 'not-configured';
    reasoningLevel?: string;
  };
}

export interface AiCatalog {
  providers: AiProvider[];
  selection?: AiSettingsSelection;
  agents: Array<{
    id: string;
    name: string;
    description?: string;
    providerId?: string;
  }>;
  skills: Array<{id: string; name: string; description?: string; kind: string}>;
}

export interface AiEvent {
  id?: number;
  type: string;
  message?: string;
  data?: unknown;
}

export interface AiFindingLink {
  title: string;
  frameIndex: number;
}

export interface AiSessionSummary {
  sessionId: string;
  title: string;
  agentId: string;
  providerId?: string;
  modelId?: string;
  reasoningLevel: string;
  status: string;
  createdAt: number;
  updatedAt: number;
  lastPrompt: string;
}

export interface AiSessionDetail extends AiSessionSummary {
  events: Array<{id: number; event: AiEvent}>;
  result?: unknown;
  error?: string;
}

export interface AiAttachment {
  name: string;
  mimeType: string;
  content: string;
}

export interface AiAnalysisOptions {
  sessionId?: string;
  providerId?: string | null;
  modelId?: string;
  reasoningLevel?: string;
  attachments?: AiAttachment[];
}

export type AiSessionResponse = AiSessionSummary;

export type FetchLike = typeof fetch;

export class AiGatewayClient {
  constructor(
    private readonly endpoint: string,
    private readonly fetcher: FetchLike = (input, init) => fetch(input, init),
  ) {}

  async catalog(signal?: AbortSignal): Promise<AiCatalog> {
    const [providers, agents, skills] = await Promise.all([
      this.getJson<{providers: AiProvider[]; selection?: AiSettingsSelection}>(
        'api/providers',
        signal,
      ),
      this.getJson<{agents: AiCatalog['agents']}>('api/agents', signal),
      this.getJson<{skills: AiCatalog['skills']}>('api/skills', signal),
    ]);
    return {
      providers: providers.providers,
      agents: agents.agents,
      skills: skills.skills,
      ...(providers.selection ? {selection: providers.selection} : {}),
    };
  }

  async listSessions(signal?: AbortSignal): Promise<AiSessionSummary[]> {
    const body = await this.getJson<{sessions: AiSessionSummary[]}>(
      'api/sessions',
      signal,
    );
    return body.sessions;
  }

  async importLocalConfig(
    providerId: 'codex' | 'claude',
    signal?: AbortSignal,
  ): Promise<AiProvider> {
    const body = await this.getJson<{provider: AiProvider}>(
      'api/providers/import-local',
      signal,
      {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({providerId}),
      },
    );
    return body.provider;
  }

  async saveSettings(
    selection: AiSettingsSelection,
    configuration?: AiProviderConfiguration,
    signal?: AbortSignal,
  ): Promise<{selection: AiSettingsSelection; provider?: AiProvider}> {
    return this.getJson('api/settings', signal, {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({
        selection,
        ...(configuration ? {configuration} : {}),
      }),
    });
  }

  async getSession(
    sessionId: string,
    signal?: AbortSignal,
  ): Promise<AiSessionDetail> {
    return this.getJson<AiSessionDetail>(
      `api/sessions/${encodeURIComponent(sessionId)}`,
      signal,
    );
  }

  async startAnalysis(
    prompt: string,
    agentId: string,
    evidence?: unknown,
    signal?: AbortSignal,
    options: AiAnalysisOptions = {},
  ): Promise<AiSessionResponse> {
    const {sessionId, ...selection} = options;
    const path = sessionId
      ? `api/sessions/${encodeURIComponent(sessionId)}/continue`
      : 'api/analyze';
    return this.getJson<AiSessionResponse>(path, signal, {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({prompt, agentId, evidence, ...selection}),
    });
  }

  async cancel(sessionId: string): Promise<void> {
    await this.getJson(
      `api/sessions/${encodeURIComponent(sessionId)}/cancel`,
      undefined,
      {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: '{}',
      },
    );
  }

  async report(
    sessionId: string,
    format: 'markdown' | 'html' = 'markdown',
  ): Promise<Blob> {
    const response = await this.fetcher(
      this.url(
        `api/sessions/${encodeURIComponent(sessionId)}/report?format=${format}`,
      ),
      {method: 'GET', cache: 'no-store'},
    );
    if (!response.ok) throw new Error(`AI report failed (${response.status})`);
    return response.blob();
  }

  async stream(
    sessionId: string,
    onEvent: (event: AiEvent) => void,
    signal?: AbortSignal,
    after = 0,
  ): Promise<void> {
    const response = await this.fetcher(
      this.url(
        `api/sessions/${encodeURIComponent(sessionId)}/stream?after=${after}`,
      ),
      {
        method: 'GET',
        cache: 'no-store',
        signal,
        headers: {Accept: 'text/event-stream'},
      },
    );
    if (!response.ok || !response.body) {
      throw new Error(`AI stream failed (${response.status})`);
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    try {
      while (true) {
        const chunk = await reader.read();
        buffer += decoder.decode(chunk.value ?? new Uint8Array(), {
          stream: !chunk.done,
        });
        if (buffer.length > 4 * 1024 * 1024) {
          throw new Error('AI stream event is too large');
        }
        const blocks = buffer.split(/\r?\n\r?\n/);
        buffer = blocks.pop() ?? '';
        for (const block of blocks) {
          const event = parseSseEventBlock(block);
          if (event) onEvent(event);
        }
        if (chunk.done) break;
      }
      const finalEvent = parseSseEventBlock(buffer);
      if (finalEvent) onEvent(finalEvent);
    } finally {
      await reader.cancel().catch(() => undefined);
      reader.releaseLock();
    }
  }

  private async getJson<T>(
    path: string,
    signal?: AbortSignal,
    init: RequestInit = {},
  ): Promise<T> {
    const response = await this.fetcher(this.url(path), {
      ...init,
      cache: 'no-store',
      signal,
    });
    const text = await response.text();
    let body: unknown;
    try {
      body = text ? JSON.parse(text) : {};
    } catch {
      throw new Error('AI gateway returned invalid JSON');
    }
    if (!response.ok) {
      const message =
        typeof body === 'object' && body !== null && 'error' in body
          ? String((body as {error: unknown}).error)
          : `HTTP ${response.status}`;
      throw new Error(message);
    }
    return body as T;
  }

  private url(path: string): string {
    return new URL(path, new URL(this.endpoint, document.baseURI)).toString();
  }
}

export function parseSseEventBlock(block: string): AiEvent | undefined {
  let eventType = 'message';
  let id: number | undefined;
  const dataLines: string[] = [];
  for (const line of block.split(/\r?\n/)) {
    if (line.startsWith('id:')) {
      const parsed = Number(line.slice(3).trim());
      if (Number.isSafeInteger(parsed) && parsed > 0) id = parsed;
    }
    if (line.startsWith('event:')) {
      eventType = line.slice(6).trim() || eventType;
    }
    if (line.startsWith('data:')) dataLines.push(line.slice(5).trimStart());
  }
  if (dataLines.length === 0) return undefined;
  const text = dataLines.join('\n');
  try {
    const value = JSON.parse(text) as Record<string, unknown>;
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      return {id, type: eventType, message: text};
    }
    return {
      id,
      type: typeof value['type'] === 'string' ? value['type'] : eventType,
      message:
        typeof value['message'] === 'string' ? value['message'] : undefined,
      data: value['data'],
    };
  } catch {
    return {id, type: eventType, message: text};
  }
}
