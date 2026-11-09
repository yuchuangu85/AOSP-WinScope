import {performance} from 'node:perf_hooks';
import {isRecord} from './json';
import {spawnCommand} from './process';
import {isEnvName, parseProviderConfiguration} from './settings';
import {
  CommandProviderConfig, LocalConfigMetadata, OpenAICompatibleProviderConfig, Provider,
  ProviderConfig, ProviderConfiguration, ProviderDescriptor, ProviderRequest, ProviderResponse,
} from './types';

const DEFAULT_PROVIDER_TIMEOUT_MS = 600_000;
const SECRET_LIKE = /(?:(?:^|[^a-z0-9])(?:sk|pk|gh[pousr]|xox[baprs])[-_]|api[-_]?key|auth|bearer|credential|password|secret|token|[a-zA-Z0-9_-]{24,})/i;

export function sanitizeLocalConfig(
  value: unknown,
): LocalConfigMetadata | undefined {
  if (!isRecord(value)) return undefined;
  const metadata: LocalConfigMetadata = {
    authentication:
      value.authentication === 'configured' ? 'configured' : value.authentication === 'not-configured' ? 'not-configured' : 'cli-managed',
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

function configurationDifference(value: ProviderConfiguration, baseline: ProviderConfiguration): Partial<ProviderConfiguration> {
  return Object.fromEntries(Object.entries(value).filter(([key, item]) => item !== '' && item !== baseline[key as keyof ProviderConfiguration]));
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
    if (config.configurationKind) {
      const metadata = this.descriptor.localConfig;
      this.descriptor.configuration = config.configuration ? parseProviderConfiguration(config.configuration) : {
        baseUrl: metadata?.baseUrl ?? (config.importedFrom ? '' : config.configurationKind === 'codex' ? 'https://api.openai.com/v1' : 'https://api.anthropic.com'),
        providerName: metadata?.providerName ?? (config.configurationKind === 'codex' ? 'OpenAI' : 'Claude'),
        apiKeyEnv: isEnvName(config.importedApiKeyEnv) ? config.importedApiKeyEnv : config.importedFrom ? '' : config.configurationKind === 'codex' ? 'OPENAI_API_KEY' : 'ANTHROPIC_API_KEY',
        timeoutMs: config.timeoutMs ?? DEFAULT_PROVIDER_TIMEOUT_MS,
      };
      this.descriptor.configured = config.configured ?? Boolean(config.importedFrom);
      const apiKeyEnv = config.configurationOverrides?.apiKeyEnv;
      if (apiKeyEnv) {
        const env = {...process.env, ...config.env};
        this.descriptor.localConfig = {
          ...metadata,
          authentication: env[apiKeyEnv]?.trim() ? 'configured' : 'not-configured',
        };
      }
    }
  }

  withConfiguration(configuration: ProviderConfiguration): CommandProvider {
    if (!this.config.configurationKind) throw new Error('provider configuration is not supported');
    const baseline = new CommandProvider({...this.config, configuration: undefined, configurationOverrides: undefined}).descriptor.configuration!;
    const parsed = parseProviderConfiguration(configuration);
    const overrides = this.config.importedFrom
      ? configurationDifference(parsed, baseline)
      : Object.fromEntries(Object.entries(parsed).filter(([, value]) => value !== ''));
    if (this.config.importedCommandAuth && overrides.apiKeyEnv) throw new Error('API key overrides are not supported for command-authenticated Codex providers; keep authentication managed by the CLI.');
    if (this.config.configurationKind === 'codex' && this.config.importedFrom && (!this.config.importedProviderId || !/^[A-Za-z0-9_-]+$/.test(this.config.importedProviderId)) && Object.keys(overrides).some((key) => key !== 'timeoutMs')) throw new Error('Manual overrides are not supported for this imported Codex provider identifier.');
    return new CommandProvider({...this.config, configuration: parsed, configurationOverrides: overrides, configured: true});
  }

  get configurationOverrides(): Partial<ProviderConfiguration> { return {...this.config.configurationOverrides}; }

  run(request: ProviderRequest): Promise<ProviderResponse> {
    request.signal?.throwIfAborted();
    const args = [...(this.config.args ?? [])];
    const env = {...process.env, ...(this.config.env ?? {})};
    const configuration = this.config.configuration;
    const changed = this.config.configurationOverrides ?? configuration;
    if (configuration && changed && this.config.configurationKind === 'codex' && Object.keys(changed).some((key) => key !== 'timeoutMs')) {
      // Codex treats override paths as dotted keys, not TOML key syntax.
      // Identifiers are restricted above; values use TOML-compatible JSON strings.
      const importedId = this.config.importedProviderId;
      const target = importedId && !['openai', 'ollama', 'lmstudio'].includes(importedId) ? importedId : undefined;
      const prefix = target ? `model_providers.${target}` : 'model_providers.winscope';
      const overrides: Record<string, string | boolean> = target ? {} : {
        model_provider: 'winscope',
        [`${prefix}.name`]: configuration.providerName || 'WinScope',
        [`${prefix}.base_url`]: configuration.baseUrl || 'https://api.openai.com/v1',
        [`${prefix}.wire_api`]: 'responses',
        [`${prefix}.requires_openai_auth`]: !configuration.apiKeyEnv,
        ...(configuration.apiKeyEnv ? {[`${prefix}.env_key`]: configuration.apiKeyEnv} : {}),
      };
      if (target) {
        if (changed.baseUrl) overrides[`${prefix}.base_url`] = changed.baseUrl;
        if (changed.providerName) overrides[`${prefix}.name`] = changed.providerName;
        if (changed.apiKeyEnv) {
          overrides[`${prefix}.env_key`] = changed.apiKeyEnv;
          overrides[`${prefix}.requires_openai_auth`] = !changed.apiKeyEnv;
        }
      }
      for (const [key, value] of Object.entries(overrides)) args.push('-c', `${key}=${JSON.stringify(value)}`);
    }
    if (configuration && this.config.configurationKind === 'claude') {
      if (changed?.baseUrl) env.ANTHROPIC_BASE_URL = configuration.baseUrl;
      if (changed?.apiKeyEnv) {
        const key = env[configuration.apiKeyEnv] ?? '';
        // Empty counterparts also mask user settings.env values in the CLI.
        env.ANTHROPIC_API_KEY = configuration.apiKeyEnv === 'ANTHROPIC_AUTH_TOKEN' ? '' : key;
        env.ANTHROPIC_AUTH_TOKEN = configuration.apiKeyEnv === 'ANTHROPIC_AUTH_TOKEN' ? key : '';
      }
      env.API_TIMEOUT_MS = String(configuration.timeoutMs);
    }
    if (request.modelId && request.modelId !== 'default') {
      if (!this.config.modelArgs) throw new Error(`${this.id} does not support model selection`);
      args.push(...this.config.modelArgs.map((arg) => arg.replaceAll('{{model}}', request.modelId!)));
    }
    if (request.reasoningLevel) {
      const levels = this.descriptor.models.find((model) => model.id === (request.modelId ?? 'default'))?.levels ?? this.descriptor.reasoningLevels;
      if (!this.config.reasoningArgs || !levels.includes(request.reasoningLevel)) throw new Error(`${this.id} does not support reasoning level ${request.reasoningLevel}`);
      args.push(...this.config.reasoningArgs.map((arg) => arg.replaceAll('{{level}}', request.reasoningLevel!)));
    }
    const timeout = createTimeout(request.timeoutMs ?? configuration?.timeoutMs ?? this.config.timeoutMs ?? DEFAULT_PROVIDER_TIMEOUT_MS, request.signal);
    const started = performance.now();
    return new Promise((resolve, reject) => {
      const child = spawnCommand(this.config.executable, args, {
        env,
        cwd: this.config.cwd,
        shell: false, stdio: ['pipe', 'pipe', 'pipe'],
      }, this.config.platform);
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
      let jsonBuffer = '';
      let jsonLastMessage = '';
      let jsonReasoning = '';
      const emitJsonReasoning = (text: string) => {
        const value = text.trim();
        if (!value || !request.onReasoning) return;
        jsonReasoning += (jsonReasoning ? '\n\n' : '') + value;
        request.onReasoning(value);
      };
      const consumeJsonChunk = (chunk: string) => {
        jsonBuffer += chunk;
        while (jsonBuffer.includes('\n')) {
          const end = jsonBuffer.indexOf('\n');
          const line = jsonBuffer.slice(0, end).trim();
          jsonBuffer = jsonBuffer.slice(end + 1);
          if (!line) continue;
          let event: unknown;
          try { event = JSON.parse(line); } catch { continue; }
          if (!isRecord(event) || !isRecord(event.item)) continue;
          const item = event.item;
          const itemType = item.type;
          if (itemType === 'agent_message' && typeof item.text === 'string') {
            if (jsonLastMessage) emitJsonReasoning(jsonLastMessage);
            jsonLastMessage = item.text;
          } else if (itemType === 'reasoning') {
            const text = typeof item.text === 'string' ? item.text : typeof item.summary === 'string' ? item.summary : '';
            if (text) emitJsonReasoning(text);
          } else if (itemType === 'command_execution' && event.type === 'item.started') {
            const command = typeof item.command === 'string' ? item.command : 'tool';
            emitJsonReasoning(`Running tool: ${command}`);
          }
        }
      };
      child.stdout.on('data', (chunk: string) => {
        collect(chunk, false);
        if (this.config.jsonEvents) consumeJsonChunk(chunk);
      });
      child.stderr.on('data', (chunk: string) => collect(chunk, true));
      timeout.signal.addEventListener('abort', abort, {once: true});
      if (timeout.signal.aborted) abort();
      child.on('error', () => finish(() => reject(new Error(`${this.id} could not be started`))));
      child.stdin.on('error', () => {}); // Spawn/exit handlers own process failures (including EPIPE).
      child.on('close', (code, signal) => finish(() => {
        const output = stdout.trim() || stderr.trim();
        if (this.config.jsonEvents && jsonBuffer.trim()) consumeJsonChunk(jsonBuffer + '\n');
        const rawOutput = this.config.jsonEvents && jsonLastMessage ? jsonLastMessage : output;
        const separated = splitEmbeddedReasoning(rawOutput);
        const reasoning = [jsonReasoning, separated.reasoning].filter(Boolean).join('\n\n');
        if (timeout.signal.aborted) {
          const timedOut = !request.signal?.aborted;
          resolve({providerId: this.id, output: separated.output || (timedOut ? 'AI provider timed out' : 'provider cancelled'), ...(reasoning ? {reasoning} : {}), durationMs: Math.round(performance.now() - started), exitCode: code ?? undefined, ...(timedOut ? {timedOut: true, cancelled: true} : {cancelled: true})});
        } else if (code !== 0) {
          reject(new Error(`${this.id} exited with ${code ?? signal ?? 'unknown'}`));
        } else {
          resolve({providerId: this.id, output: separated.output, ...(reasoning ? {reasoning} : {}), durationMs: Math.round(performance.now() - started), exitCode: 0});
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
    const metadata = sanitizeLocalConfig({baseUrl: config.baseUrl, providerName: config.name});
    this.descriptor.configuration = config.configuration ? parseProviderConfiguration(config.configuration) : {
      baseUrl: metadata?.baseUrl ?? '', providerName: metadata?.providerName ?? '',
      apiKeyEnv: isEnvName(config.apiKeyEnv) ? config.apiKeyEnv : '', timeoutMs: config.timeoutMs ?? DEFAULT_PROVIDER_TIMEOUT_MS,
    };
    this.descriptor.configured = config.configured ?? false;
    const apiKeyEnv = config.configurationOverrides?.apiKeyEnv || config.apiKeyEnv;
    if (apiKeyEnv) {
      this.descriptor.localConfig = {
        authentication: process.env[apiKeyEnv]?.trim() ? 'configured' : 'not-configured',
      };
    }
  }

  withConfiguration(configuration: ProviderConfiguration): OpenAICompatibleProvider {
    const baseline = new OpenAICompatibleProvider({...this.config, configuration: undefined, configurationOverrides: undefined}).descriptor.configuration!;
    const parsed = parseProviderConfiguration(configuration);
    return new OpenAICompatibleProvider({...this.config, configuration: parsed, configurationOverrides: configurationDifference(parsed, baseline), configured: true});
  }

  get configurationOverrides(): Partial<ProviderConfiguration> { return {...this.config.configurationOverrides}; }

  async run(request: ProviderRequest): Promise<ProviderResponse> {
    request.signal?.throwIfAborted();
    const modelId = request.modelId && request.modelId !== 'default' ? request.modelId : this.config.model;
    const levels = this.descriptor.models.find((model) => model.id === modelId)?.levels ?? this.descriptor.reasoningLevels;
    if (request.reasoningLevel && !levels.includes(request.reasoningLevel)) throw new Error(`${this.id} does not support reasoning level ${request.reasoningLevel}`);
    const configuration = this.config.configuration;
    const timeout = createTimeout(request.timeoutMs ?? configuration?.timeoutMs ?? this.config.timeoutMs ?? DEFAULT_PROVIDER_TIMEOUT_MS, request.signal);
    const started = performance.now();
    try {
      const headers: Record<string, string> = {'content-type': 'application/json'};
      const apiKeyEnv = this.config.configurationOverrides?.apiKeyEnv || this.config.apiKeyEnv;
      const apiKey = apiKeyEnv ? process.env[apiKeyEnv] : undefined;
      if (apiKey) headers.authorization = `Bearer ${apiKey}`;
      const streaming = Boolean(request.onReasoning);
      const response = await fetch(`${(this.config.configurationOverrides?.baseUrl || this.config.baseUrl).replace(/\/$/, '')}/chat/completions`, {
        method: 'POST', headers,
        body: JSON.stringify({
          model: modelId,
          messages: [...(request.history ?? []), {role: 'user', content: request.prompt}],
          ...(streaming ? {stream: true} : {}),
          ...(request.reasoningLevel ? {reasoning_effort: request.reasoningLevel} : {}),
        }), signal: timeout.signal,
      });
      if (!response.ok) throw new Error(`provider HTTP ${response.status}`);
      if (streaming && response.headers.get('content-type')?.includes('text/event-stream') && response.body) {
        const streamed = await readOpenAiStream(response.body, request.onReasoning!);
        return {providerId: this.id, ...streamed, durationMs: Math.round(performance.now() - started)};
      }
      const text = await response.text();
      let payload: {choices?: Array<{message?: {content?: unknown; reasoning?: unknown; reasoning_content?: unknown; thinking?: unknown}}>};
      try { payload = JSON.parse(text); } catch { throw new Error('provider returned invalid JSON'); }
      const message = payload.choices?.[0]?.message;
      const rawOutput = textContent(message?.content);
      if (rawOutput === undefined) throw new Error('provider response has no text content');
      const embedded = splitEmbeddedReasoning(rawOutput);
      const explicitReasoning = textContent(message?.reasoning_content) ?? textContent(message?.reasoning) ?? textContent(message?.thinking);
      const reasoning = [explicitReasoning, embedded.reasoning].filter(Boolean).join('\n\n');
      if (Buffer.byteLength(rawOutput + reasoning, 'utf8') > MAX_PROVIDER_OUTPUT_BYTES) {
        throw new Error('provider output exceeded 1 MiB');
      }
      return {providerId: this.id, output: embedded.output, ...(reasoning ? {reasoning} : {}), durationMs: Math.round(performance.now() - started)};
    } catch (error) {
      if (timeout.signal.aborted) {
        const timedOut = !request.signal?.aborted;
        return {providerId: this.id, output: error instanceof Error && !timedOut ? error.message : timedOut ? 'AI provider timed out' : 'provider cancelled', durationMs: Math.round(performance.now() - started), ...(timedOut ? {timedOut: true, cancelled: true} : {cancelled: true})};
      }
      throw error;
    } finally { timeout.dispose(); }
  }
}

const MAX_PROVIDER_OUTPUT_BYTES = 1024 * 1024;

function textContent(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function splitEmbeddedReasoning(value: string): {output: string; reasoning?: string} {
  const start = /^\s*<think>/.exec(value);
  if (!start) return {output: value};
  const end = value.indexOf('</think>', start[0].length);
  return {
    output: end < 0 ? '' : value.slice(end + '</think>'.length).replace(/^\r?\n/, ''),
    reasoning: value.slice(start[0].length, end < 0 ? undefined : end),
  };
}

async function readOpenAiStream(
  body: ReadableStream<Uint8Array>,
  onReasoning: (delta: string) => void,
): Promise<{output: string; reasoning?: string}> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let output = '';
  let reasoning = '';
  let bytes = 0;
  let sawContent = false;
  let finished = false;
  const consume = (block: string): void => {
    const data = block.split(/\r?\n/).filter((line) => line.startsWith('data:'))
      .map((line) => line.slice(5).trimStart()).join('\n');
    if (!data) return;
    if (data === '[DONE]') { finished = true; return; }
    let payload: unknown;
    try { payload = JSON.parse(data); } catch { throw new Error('provider returned invalid stream JSON'); }
    if (!isRecord(payload) || payload.error) throw new Error('provider returned a stream error');
    const choice = Array.isArray(payload.choices) ? payload.choices[0] : undefined;
    if (!isRecord(choice)) return;
    const delta = isRecord(choice.delta) ? choice.delta : {};
    const thought = textContent(delta.reasoning_content) ?? textContent(delta.reasoning) ?? textContent(delta.thinking) ?? '';
    if (thought) {
      reasoning += thought;
      onReasoning(thought);
    }
    if (typeof delta.content === 'string') { output += delta.content; sawContent = true; }
    if (choice.finish_reason !== undefined && choice.finish_reason !== null) finished = true;
  };
  try {
    while (!finished) {
      const chunk = await reader.read();
      bytes += chunk.value?.byteLength ?? 0;
      if (bytes > MAX_PROVIDER_OUTPUT_BYTES) throw new Error('provider stream exceeded 1 MiB');
      buffer += decoder.decode(chunk.value ?? new Uint8Array(), {stream: !chunk.done});
      const blocks = buffer.split(/\r?\n\r?\n/);
      buffer = blocks.pop() ?? '';
      for (const block of blocks) {
        consume(block);
        if (finished) break;
      }
      if (chunk.done) {
        if (!finished && buffer.trim()) consume(buffer);
        if (!finished) throw new Error('provider stream ended before completion');
        break;
      }
    }
    if (!sawContent) throw new Error('provider response has no text content');
    const embedded = splitEmbeddedReasoning(output);
    if (embedded.reasoning) {
      onReasoning((reasoning ? '\n\n' : '') + embedded.reasoning);
      reasoning = [reasoning, embedded.reasoning].filter(Boolean).join('\n\n');
    }
    return {output: embedded.output, ...(reasoning ? {reasoning} : {})};
  } finally {
    await reader.cancel().catch(() => undefined);
    reader.releaseLock();
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

export function configureProvider(provider: Provider, configuration: ProviderConfiguration): Provider {
  if (provider instanceof OpenAICompatibleProvider || provider instanceof CommandProvider) return provider.withConfiguration(configuration);
  throw new Error('provider configuration is not supported');
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
    id, name: 'Codex', kind: 'command', executable: 'codex', configurationKind: 'codex',
    args: ['exec', '--sandbox', 'read-only', '--ephemeral', '--color', 'never', '--skip-git-repo-check', '--json'],
    jsonEvents: true,
    modelArgs: ['--model', '{{model}}'], reasoningArgs: ['-c', 'model_reasoning_effort="{{level}}"'],
  } : {
    id, name: 'Claude', kind: 'command', executable: 'claude', configurationKind: 'claude',
    args: ['--print', '--output-format', 'text', '--tools', ''],
    models: [{id: 'opus', name: 'Opus'}, {id: 'sonnet', name: 'Sonnet'}],
    modelArgs: ['--model', '{{model}}'], reasoningArgs: ['--effort', '{{level}}'],
  };
}
