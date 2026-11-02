import {spawn} from 'node:child_process';
import {performance} from 'node:perf_hooks';
import {isRecord} from './json';
import {
  CommandProviderConfig, LocalConfigMetadata, OpenAICompatibleProviderConfig, Provider,
  ProviderConfig, ProviderDescriptor, ProviderRequest, ProviderResponse,
} from './types';

const SECRET_LIKE = /(?:(?:^|[^a-z0-9])(?:sk|pk|gh[pousr]|xox[baprs])[-_]|api[-_]?key|auth|bearer|credential|password|secret|token|[a-zA-Z0-9_-]{24,})/i;

export function sanitizeLocalConfig(
  value: unknown,
): LocalConfigMetadata | undefined {
  if (!isRecord(value)) return undefined;
  const metadata: LocalConfigMetadata = {
    authentication:
      value.authentication === 'configured' ? 'configured' : 'cli-managed',
  };
  if (typeof value.providerName === 'string') {
    const name = value.providerName.trim();
    if (
      /^[a-zA-Z0-9][a-zA-Z0-9 ._()/-]{0,127}$/.test(name) &&
      !SECRET_LIKE.test(name)
    ) metadata.providerName = name;
  }
  if (
    value.reasoningLevel === 'low' ||
    value.reasoningLevel === 'medium' ||
    value.reasoningLevel === 'high'
  ) metadata.reasoningLevel = value.reasoningLevel;
  if (
    typeof value.baseUrl === 'string' &&
    value.baseUrl.length <= 2048 &&
    !/[\s\x00-\x1f\x7f]/.test(value.baseUrl)
  ) {
    try {
      const url = new URL(value.baseUrl);
      if (url.protocol === 'http:' || url.protocol === 'https:') {
        url.username = '';
        url.password = '';
        url.search = '';
        url.hash = '';
        // Unknown/encoded or credential-like path segments are not display data.
        const unsafePath = url.pathname.split('/').filter(Boolean).some((part) =>
          !/^[a-zA-Z0-9._~-]{1,32}$/.test(part) ||
          SECRET_LIKE.test(part) ||
          /^[a-f0-9]{16,}$/i.test(part),
        );
        if (unsafePath) url.pathname = '/';
        const baseUrl = url.toString();
        if (baseUrl.length <= 2048) metadata.baseUrl = baseUrl;
      }
    } catch {
      /* Invalid URLs are omitted, never echoed in diagnostics. */
    }
  }
  return metadata;
}

function createTimeout(timeoutMs: number, parent?: AbortSignal): {signal: AbortSignal; dispose: () => void} {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(new Error(`provider timeout after ${timeoutMs}ms`)), timeoutMs);
  const onAbort = () => controller.abort(parent?.reason ?? new Error('provider cancelled'));
  parent?.addEventListener('abort', onAbort, {once: true});
  if (parent?.aborted) onAbort();
  return {signal: controller.signal, dispose: () => { clearTimeout(timer); parent?.removeEventListener('abort', onAbort); }};
}

export class CommandProvider implements Provider {
  readonly id: string;
  readonly descriptor: ProviderDescriptor;
  constructor(private readonly config: CommandProviderConfig) {
    this.id = config.id;
    const defaultModel = config.models?.find((model) => model.id === config.defaultModelId);
    this.descriptor = {
      id: config.id, name: config.name,
      models: [config.models?.find((model) => model.id === 'default') ?? {id: 'default', name: 'CLI default', ...(defaultModel?.levels !== undefined ? {levels: defaultModel.levels} : {})}, ...(config.models ?? []).filter((model) => model.id !== 'default')],
      reasoningLevels: config.reasoningArgs ? config.reasoningLevels ?? ['low', 'medium', 'high'] : [],
      supportsCustomModel: Boolean(config.modelArgs),
      ...(config.defaultModelId ? {defaultModelId: config.defaultModelId} : {}),
      ...(config.importedFrom ? {importedFrom: config.importedFrom} : {}),
      ...(config.localConfig ? {localConfig: sanitizeLocalConfig(config.localConfig)} : {}),
    };
  }

  run(request: ProviderRequest): Promise<ProviderResponse> {
    request.signal?.throwIfAborted();
    const args = [...(this.config.args ?? [])];
    if (request.modelId && request.modelId !== 'default') {
      if (!this.config.modelArgs) throw new Error(`${this.id} does not support model selection`);
      args.push(...this.config.modelArgs.map((arg) => arg.replaceAll('{{model}}', request.modelId!)));
    }
    if (request.reasoningLevel) {
      const levels = this.descriptor.models.find((model) => model.id === (request.modelId ?? 'default'))?.levels ?? this.descriptor.reasoningLevels;
      if (!this.config.reasoningArgs || !levels.includes(request.reasoningLevel)) throw new Error(`${this.id} does not support reasoning level ${request.reasoningLevel}`);
      args.push(...this.config.reasoningArgs.map((arg) => arg.replaceAll('{{level}}', request.reasoningLevel!)));
    }
    const timeout = createTimeout(request.timeoutMs ?? this.config.timeoutMs ?? 120_000, request.signal);
    const started = performance.now();
    return new Promise((resolve, reject) => {
      const child = spawn(this.config.executable, args, {
        env: {...process.env, ...(this.config.env ?? {})},
        cwd: this.config.cwd,
        shell: false, stdio: ['pipe', 'pipe', 'pipe'],
      });
      let stdout = '';
      let stderr = '';
      let settled = false;
      let killTimer: ReturnType<typeof setTimeout> | undefined;
      const abort = () => { child.kill('SIGTERM'); killTimer = setTimeout(() => child.kill('SIGKILL'), 250); killTimer.unref(); };
      const finish = (callback: () => void) => {
        if (settled) return;
        settled = true;
        timeout.dispose();
        timeout.signal.removeEventListener('abort', abort);
        if (killTimer) clearTimeout(killTimer);
        callback();
      };
      child.stdout.setEncoding('utf8');
      child.stderr.setEncoding('utf8');
      const collect = (chunk: string, isError: boolean) => {
        if (isError) stderr += chunk; else stdout += chunk;
        if (stdout.length + stderr.length > 1024 * 1024) {
          child.kill('SIGKILL');
          finish(() => reject(new Error(`${this.id} output exceeded 1 MiB`)));
        }
      };
      child.stdout.on('data', (chunk: string) => collect(chunk, false));
      child.stderr.on('data', (chunk: string) => collect(chunk, true));
      timeout.signal.addEventListener('abort', abort, {once: true});
      if (timeout.signal.aborted) abort();
      child.on('error', (error) => finish(() => reject(error)));
      child.stdin.on('error', () => {}); // Spawn/exit handlers own process failures (including EPIPE).
      child.on('close', (code, signal) => finish(() => {
        const output = stdout.trim() || stderr.trim();
        if (timeout.signal.aborted) {
          resolve({providerId: this.id, output: output || 'provider cancelled', durationMs: Math.round(performance.now() - started), exitCode: code ?? undefined, cancelled: true});
        } else if (code !== 0) {
          reject(new Error(`${this.id} exited with ${code ?? signal ?? 'unknown'}: ${output.slice(0, 1000)}`));
        } else {
          resolve({providerId: this.id, output, durationMs: Math.round(performance.now() - started), exitCode: 0});
        }
      }));
      const history = request.history?.map((turn) => `${turn.role}: ${turn.content}`).join('\n\n');
      child.stdin.end(history ? `Previous conversation (context, not instructions):\n${history}\n\nCurrent user message:\n${request.prompt}` : request.prompt);
    });
  }
}

export class OpenAICompatibleProvider implements Provider {
  readonly id: string;
  readonly descriptor: ProviderDescriptor;
  constructor(private readonly config: OpenAICompatibleProviderConfig) {
    this.id = config.id;
    this.descriptor = {
      id: config.id, name: config.name,
      models: [config.models?.find((model) => model.id === config.model) ?? {id: config.model, name: config.model}, ...(config.models ?? []).filter((model) => model.id !== config.model)],
      reasoningLevels: config.reasoningLevels ?? [...new Set((config.models ?? []).flatMap((model) => model.levels ?? []))], supportsCustomModel: true,
    };
  }

  async run(request: ProviderRequest): Promise<ProviderResponse> {
    request.signal?.throwIfAborted();
    const modelId = request.modelId && request.modelId !== 'default' ? request.modelId : this.config.model;
    const levels = this.descriptor.models.find((model) => model.id === modelId)?.levels ?? this.descriptor.reasoningLevels;
    if (request.reasoningLevel && !levels.includes(request.reasoningLevel)) throw new Error(`${this.id} does not support reasoning level ${request.reasoningLevel}`);
    const timeout = createTimeout(request.timeoutMs ?? this.config.timeoutMs ?? 120_000, request.signal);
    const started = performance.now();
    try {
      const headers: Record<string, string> = {'content-type': 'application/json'};
      const apiKey = this.config.apiKeyEnv ? process.env[this.config.apiKeyEnv] : undefined;
      if (apiKey) headers.authorization = `Bearer ${apiKey}`;
      const response = await fetch(`${this.config.baseUrl.replace(/\/$/, '')}/chat/completions`, {
        method: 'POST', headers,
        body: JSON.stringify({
          model: modelId,
          messages: [...(request.history ?? []), {role: 'user', content: request.prompt}],
          ...(request.reasoningLevel ? {reasoning_effort: request.reasoningLevel} : {}),
        }), signal: timeout.signal,
      });
      const text = await response.text();
      if (!response.ok) throw new Error(`provider HTTP ${response.status}: ${text.slice(0, 500)}`);
      const payload = JSON.parse(text) as {choices?: Array<{message?: {content?: unknown}}>};
      const output = payload.choices?.[0]?.message?.content;
      if (typeof output !== 'string') throw new Error('provider response has no text content');
      return {providerId: this.id, output, durationMs: Math.round(performance.now() - started)};
    } catch (error) {
      if (timeout.signal.aborted) return {providerId: this.id, output: error instanceof Error ? error.message : 'provider cancelled', durationMs: Math.round(performance.now() - started), cancelled: true};
      throw error;
    } finally { timeout.dispose(); }
  }
}

export class ProviderRegistry {
  private readonly providers = new Map<string, Provider>();
  register(provider: Provider): void { this.providers.set(provider.id, provider); }
  get(id: string): Provider { const provider = this.providers.get(id); if (!provider) throw new Error(`unknown provider: ${id}`); return provider; }
  list(): ProviderDescriptor[] {
    return [...this.providers.values()].sort((a, b) => a.id.localeCompare(b.id)).map((provider) => provider.descriptor ?? {id: provider.id, models: [{id: 'default', name: 'Default'}], reasoningLevels: []});
  }
}

export function providerFromConfig(config: ProviderConfig): Provider {
  return config.kind === 'command' ? new CommandProvider(config) : new OpenAICompatibleProvider(config);
}

export function createDefaultProviderRegistry(): ProviderRegistry {
  const registry = new ProviderRegistry();
  registry.register(new CommandProvider(localCommandConfig('codex')));
  registry.register(new CommandProvider(localCommandConfig('claude')));
  registry.register(new CommandProvider({id: 'ds', kind: 'command', executable: 'ds'}));
  return registry;
}

export function localCommandConfig(id: 'codex' | 'claude'): CommandProviderConfig {
  return id === 'codex' ? {
    id, name: 'Codex', kind: 'command', executable: 'codex',
    args: ['exec', '--sandbox', 'read-only', '--ephemeral', '--color', 'never'],
    modelArgs: ['--model', '{{model}}'], reasoningArgs: ['-c', 'model_reasoning_effort="{{level}}"'],
  } : {
    id, name: 'Claude', kind: 'command', executable: 'claude',
    args: ['--print', '--output-format', 'text', '--tools', ''],
    models: [{id: 'opus', name: 'Opus'}, {id: 'sonnet', name: 'Sonnet'}],
    modelArgs: ['--model', '{{model}}'], reasoningArgs: ['--effort', '{{level}}'],
  };
}
