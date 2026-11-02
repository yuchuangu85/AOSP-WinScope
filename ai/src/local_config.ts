import {spawn} from 'node:child_process';
import {constants} from 'node:fs';
import {access, open} from 'node:fs/promises';
import {homedir} from 'node:os';
import {delimiter, join, resolve} from 'node:path';
import {isRecord} from './json';
import {CommandProvider, localCommandConfig, sanitizeLocalConfig} from './providers';
import {LocalConfigMetadata, ModelDescriptor, ReasoningLevel} from './types';

export type LocalProviderId = 'codex' | 'claude';
export interface LocalConfigOptions {
  home?: string;
  env?: NodeJS.ProcessEnv;
  executables?: Partial<Record<LocalProviderId, string>>;
  timeoutMs?: number;
}

const MODEL_ID = /^[a-zA-Z0-9][a-zA-Z0-9._:/@\[\]-]{0,127}$/;
const MAX_CONFIG_BYTES = 4 * 1024 * 1024;
const SUPPORTED_LEVELS: ReasoningLevel[] = ['low', 'medium', 'high'];

export function isModelId(value: unknown): value is string {
  return typeof value === 'string' && MODEL_ID.test(value);
}

// Only descriptors leave this module. Authentication stays with the local CLI.
export async function importLocalProvider(
  id: LocalProviderId,
  options: LocalConfigOptions = {},
): Promise<CommandProvider> {
  const home = options.home ?? homedir();
  const env = options.env ?? process.env;
  const executable =
    options.executables?.[id] ?? (await findExecutable(id, home, env));
  const config = {...localCommandConfig(id), executable, cwd: home};
  if (id === 'codex') {
    const codexHome = resolve(home, env.CODEX_HOME ?? '.codex');
    await requireFile(
      join(codexHome, 'config.toml'),
      'Codex configuration was not found.',
    );
    const {model, models, localConfig} = await readCodex(
      executable,
      home,
      {...env, CODEX_HOME: codexHome},
      options.timeoutMs ?? 20_000,
    );
    return new CommandProvider({
      ...config,
      args: [...config.args!, '--skip-git-repo-check'],
      models,
      defaultModelId: model,
      env: {CODEX_HOME: codexHome},
      importedFrom: 'Codex local configuration',
      localConfig,
    });
  }
  const directory = resolve(home, env.CLAUDE_CONFIG_DIR ?? '.claude');
  const path = join(directory, 'settings.json');
  await requireFile(path, 'Claude configuration was not found.');
  let settings: unknown;
  try {
    settings = JSON.parse(await readBoundedFile(path));
  } catch {
    throw new Error('Claude configuration is invalid or unreadable.');
  }
  if (!isRecord(settings))
    throw new Error('Claude configuration must be an object.');
  const models = new Map<string, ModelDescriptor>();
  const add = (value: unknown, name?: unknown) => {
    if (isModelId(value))
      models.set(value, {
        id: value,
        name: typeof name === 'string' && name.length <= 256 ? name : value,
      });
  };
  // Process environment overrides user settings in the same way as the CLI.
  const environment = {
    ...(isRecord(settings.env) ? settings.env : {}),
    ...Object.fromEntries(
      Object.entries(env).filter(([, value]) => value !== undefined),
    ),
  };
  const model = environment.ANTHROPIC_MODEL ?? settings.model;
  if (model !== undefined && !isModelId(model))
    throw new Error('Claude configuration has an invalid model identifier.');
  add(model);
  if (
    isRecord(settings.modelPicker) &&
    Array.isArray(settings.modelPicker.options)
  ) {
    for (const option of settings.modelPicker.options)
      if (isRecord(option)) add(option.model, option.label);
  }
  for (const [key, value] of Object.entries(environment)) {
    if (/^ANTHROPIC_DEFAULT_[A-Z0-9_]+_MODEL$/.test(key))
      add(value, environment[`${key}_NAME`]);
  }
  for (const fallback of config.models ?? [])
    if (!models.has(fallback.id)) models.set(fallback.id, fallback);
  return new CommandProvider({
    ...config,
    models: [...models.values()],
    defaultModelId: isModelId(model) ? model : 'default',
    env: {CLAUDE_CONFIG_DIR: directory},
    importedFrom: 'Claude local configuration',
    localConfig: sanitizeLocalConfig({
      baseUrl: environment.ANTHROPIC_BASE_URL,
      providerName: 'Claude',
      authentication:
        hasCredential(environment.ANTHROPIC_AUTH_TOKEN) ||
        hasCredential(environment.ANTHROPIC_API_KEY)
          ? 'configured'
          : 'cli-managed',
      reasoningLevel: settings.effortLevel,
    }),
    args: [
      ...config.args!,
      '--setting-sources',
      'user',
      '--no-session-persistence',
    ],
  });
}

function hasCredential(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function codexMetadata(
  config: Record<string, unknown>,
  env: NodeJS.ProcessEnv,
): LocalConfigMetadata {
  const providerId =
    typeof config.model_provider === 'string' ? config.model_provider : 'openai';
  const provider =
    isRecord(config.model_providers) &&
    Object.hasOwn(config.model_providers, providerId) &&
    isRecord(config.model_providers[providerId])
    ? config.model_providers[providerId]
    : {};
  const envKey =
    typeof provider.env_key === 'string' ? provider.env_key : undefined;
  const configured =
    (envKey !== undefined &&
      Object.hasOwn(env, envKey) &&
      hasCredential(env[envKey])) ||
    ((providerId === 'openai' || provider.requires_openai_auth === true) &&
      hasCredential(env.OPENAI_API_KEY)) ||
    hasCredential(provider.experimental_bearer_token);
  const fallback = sanitizeLocalConfig({providerName: providerId});
  return sanitizeLocalConfig({
    baseUrl: provider.base_url,
    providerName:
      sanitizeLocalConfig({providerName: provider.name})?.providerName ??
      fallback?.providerName,
    authentication: configured ? 'configured' : 'cli-managed',
    reasoningLevel: config.model_reasoning_effort,
  })!;
}

async function requireFile(path: string, missing: string): Promise<void> {
  try {
    await access(path, constants.R_OK);
  } catch {
    throw new Error(missing);
  }
}

async function readBoundedFile(path: string): Promise<string> {
  const file = await open(path, 'r');
  try {
    if (!(await file.stat()).isFile()) throw new Error('not a file');
    const buffer = Buffer.alloc(MAX_CONFIG_BYTES + 1);
    let size = 0;
    while (size < buffer.length) {
      const {bytesRead} = await file.read(
        buffer,
        size,
        buffer.length - size,
        null,
      );
      if (!bytesRead) break;
      size += bytesRead;
    }
    if (size > MAX_CONFIG_BYTES) throw new Error('configuration is too large');
    return buffer.subarray(0, size).toString('utf8');
  } finally {
    await file.close();
  }
}

async function findExecutable(
  id: LocalProviderId,
  home: string,
  env: NodeJS.ProcessEnv,
): Promise<string> {
  const paths = [
    ...(env.PATH ?? '').split(delimiter),
    join(home, '.local', 'bin'),
    join(home, '.npm-global', 'bin'),
    join(home, '.volta', 'bin'),
    '/opt/homebrew/bin',
    '/usr/local/bin',
  ];
  for (const directory of paths.filter(Boolean)) {
    const path = resolve(
      directory,
      process.platform === 'win32' ? `${id}.exe` : id,
    );
    try {
      await access(path, constants.X_OK);
      return path;
    } catch {
      /* Try the next local installation. */
    }
  }
  throw new Error(
    `${id === 'codex' ? 'Codex' : 'Claude'} CLI was not found. Install it and make it available to the gateway.`,
  );
}

interface CodexConfiguration {
  model?: string;
  models: ModelDescriptor[];
  localConfig: LocalConfigMetadata;
}

// Let Codex parse TOML, profiles, provider overrides and its own model catalog.
// This probe never creates a thread or starts an agent/model turn.
function readCodex(
  executable: string,
  cwd: string,
  env: NodeJS.ProcessEnv,
  timeoutMs: number,
): Promise<CodexConfiguration> {
  return new Promise((resolve, reject) => {
    const child = spawn(executable, ['app-server'], {
      cwd,
      env,
      shell: false,
      detached: process.platform !== 'win32',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    let buffer = '';
    let total = 0;
    let model: string | undefined;
    let localConfig: LocalConfigMetadata = {authentication: 'cli-managed'};
    let nextId = 3;
    let settled = false;
    let completed = false;
    let outcome:
      | {value?: CodexConfiguration; error?: Error}
      | undefined;
    const models = new Map<string, ModelDescriptor>();
    const cursors = new Set<string>();
    let killTimer: ReturnType<typeof setTimeout> | undefined;
    const terminate = (signal: NodeJS.Signals) => {
      if (process.platform !== 'win32' && child.pid) {
        try {
          process.kill(-child.pid, signal);
        } catch {
          /* The owned process group already exited. */
        }
      } else child.kill(signal);
    };
    const complete = () => {
      if (completed || !outcome) return;
      completed = true;
      clearTimeout(timer);
      if (killTimer) clearTimeout(killTimer);
      terminate('SIGKILL');
      child.stdin.destroy();
      child.stdout.destroy();
      child.stderr.destroy();
      if (outcome.error) reject(outcome.error);
      else resolve(outcome.value!);
    };
    const finish = (error?: Error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      outcome = error
        ? {error}
        : {value: {model, models: [...models.values()], localConfig}};
      child.stdin.end();
      terminate('SIGTERM');
      // Descendants may retain stdio even after the CLI exits. Never wait
      // indefinitely for close to settle the request and release its lock.
      killTimer = setTimeout(complete, 250);
    };
    const send = (id: number | undefined, method: string, params?: unknown) =>
      child.stdin.write(
        JSON.stringify({
          ...(id !== undefined ? {id} : {}),
          method,
          ...(params !== undefined ? {params} : {}),
        }) + '\n',
      );
    const timer = setTimeout(
      () => finish(new Error('Codex configuration read timed out.')),
      timeoutMs,
    );
    child.on('error', () =>
      finish(new Error('Codex CLI could not be started.')),
    );
    child.stdin.on('error', () =>
      finish(new Error('Codex configuration reader disconnected.')),
    );
    // Drain but never expose raw stderr: CLI diagnostics can contain credentials.
    child.stderr.on('data', () => {});
    child.on('close', () => {
      if (!settled)
        finish(
          new Error(
            'Codex configuration reader disconnected. Update the Codex CLI and try again.',
          ),
        );
      complete();
    });
    child.stdout.setEncoding('utf8');
    child.stdout.on('data', (chunk: string) => {
      if (settled) return;
      total += Buffer.byteLength(chunk);
      if (total > 16 * 1024 * 1024)
        return finish(new Error('Codex configuration response is too large.'));
      buffer += chunk;
      while (buffer.includes('\n') && !settled) {
        const end = buffer.indexOf('\n');
        const line = buffer.slice(0, end);
        buffer = buffer.slice(end + 1);
        let message: unknown;
        try {
          message = JSON.parse(line);
        } catch {
          return finish(
            new Error('Codex configuration reader returned invalid JSON.'),
          );
        }
        if (!isRecord(message) || typeof message.id !== 'number') continue;
        if (message.error)
          return finish(
            new Error(
              'Codex configuration could not be read. Check the local configuration and CLI version.',
            ),
          );
        const result = message.result;
        if (!isRecord(result))
          return finish(
            new Error(
              'Codex configuration reader returned an invalid response.',
            ),
          );
        if (message.id === 1) {
          send(undefined, 'initialized');
          send(2, 'config/read', {includeLayers: false});
        } else if (message.id === 2) {
          if (!isRecord(result.config))
            return finish(
              new Error(
                'Codex configuration reader returned no configuration.',
              ),
            );
          if (
            result.config.model !== null &&
            result.config.model !== undefined &&
            !isModelId(result.config.model)
          )
            return finish(
              new Error('Codex configuration has an invalid model identifier.'),
            );
          model = isModelId(result.config.model)
            ? result.config.model
            : undefined;
          localConfig = codexMetadata(result.config, env);
          if (model) models.set(model, {id: model, name: model});
          send(nextId, 'model/list', {limit: 100, includeHidden: false});
        } else if (message.id === nextId) {
          if (!Array.isArray(result.data))
            return finish(
              new Error('Codex configuration reader returned no model list.'),
            );
          for (const item of result.data) {
            if (
              !isRecord(item) ||
              item.hidden === true ||
              !isModelId(item.model)
            )
              continue;
            const efforts = Array.isArray(item.supportedReasoningEfforts)
              ? item.supportedReasoningEfforts
                  .filter(isRecord)
                  .map((effort) => effort.reasoningEffort)
              : [];
            const levels = SUPPORTED_LEVELS.filter((level) =>
              efforts.includes(level),
            );
            models.set(item.model, {
              id: item.model,
              name:
                typeof item.displayName === 'string' &&
                item.displayName.length <= 256
                  ? item.displayName
                  : item.model,
              levels,
            });
          }
          if (typeof result.nextCursor === 'string' && result.nextCursor) {
            if (cursors.has(result.nextCursor) || cursors.size >= 20)
              return finish(
                new Error('Codex model list exceeded the pagination limit.'),
              );
            cursors.add(result.nextCursor);
            nextId++;
            send(nextId, 'model/list', {
              limit: 100,
              includeHidden: false,
              cursor: result.nextCursor,
            });
          } else finish();
        }
      }
    });
    send(1, 'initialize', {
      clientInfo: {name: 'winscope', version: '0.1.0'},
      capabilities: {experimentalApi: false},
    });
  });
}
