import {randomUUID} from 'node:crypto';
import {constants} from 'node:fs';
import {lstat, mkdir, open, rename, rm} from 'node:fs/promises';
import {homedir} from 'node:os';
import {dirname, join} from 'node:path';
import {isRecord} from './json';
import {AiSelection, ProviderConfiguration} from './types';

export function isEnvName(value: unknown): value is string {
  return typeof value === 'string';
}

export interface GatewaySettingsOptions { settingsPath?: string; }
export interface SavedProviderSettings {
  id: string;
  importLocal?: true;
  configuration?: Partial<ProviderConfiguration>;
}
export interface SavedAiSettings {
  version: 1;
  selection?: AiSelection;
  providers: SavedProviderSettings[];
}

export function defaultSettingsPath(): string {
  return process.env.WINSCOPE_AI_SETTINGS || join(homedir(), '.winscope', 'ai-settings.json');
}

export function hasOnlyFields(value: Record<string, unknown>, fields: string[]): boolean {
  return Object.keys(value).every((key) => fields.includes(key));
}

export function parseProviderConfiguration(value: unknown): ProviderConfiguration {
  if (!isRecord(value) || !hasOnlyFields(value, ['baseUrl', 'providerName', 'apiKeyEnv', 'timeoutMs'])) throw new Error('invalid provider configuration fields');
  const {baseUrl, providerName, apiKeyEnv, timeoutMs} = value;
  if (typeof baseUrl !== 'string' || baseUrl.length > 2048 || /[\s\x00-\x1f\x7f\\]/.test(baseUrl)) throw new Error('invalid provider base URL');
  if (baseUrl) {
    let url: URL;
    try { url = new URL(baseUrl); } catch { throw new Error('invalid provider base URL'); }
    if (!/^https?:\/\//i.test(baseUrl) || !['http:', 'https:'].includes(url.protocol) || !url.hostname || url.username || url.password || /[?#]/.test(baseUrl) || /^https?:\/\/[^/]*@/i.test(baseUrl) || /%(?:0[0-9a-f]|1[0-9a-f]|7f)/i.test(baseUrl)) throw new Error('invalid provider base URL');
  }
  if (typeof providerName !== 'string' || providerName.length > 128 || /[\x00-\x1f\x7f]/.test(providerName)) throw new Error('invalid provider name');
  if (typeof apiKeyEnv !== 'string') throw new Error('invalid API key environment variable');
  if (typeof timeoutMs !== 'number' || !Number.isInteger(timeoutMs) || timeoutMs < 1000 || timeoutMs > 600_000) throw new Error('timeout must be between 1000 and 600000 milliseconds');
  return {baseUrl, providerName, apiKeyEnv, timeoutMs};
}

export async function readSettings(path: string): Promise<unknown> {
  const file = await open(path, constants.O_RDONLY | constants.O_NOFOLLOW);
  try {
    const info = await file.stat();
    if (!info.isFile() || info.size > 1024 * 1024) throw new Error('invalid AI settings file');
    const bytes = Buffer.alloc(1024 * 1024 + 1);
    let size = 0;
    while (size < bytes.length) {
      const {bytesRead} = await file.read(bytes, size, bytes.length - size, null);
      if (!bytesRead) break;
      size += bytesRead;
    }
    if (size > 1024 * 1024) throw new Error('invalid AI settings file');
    return JSON.parse(bytes.subarray(0, size).toString('utf8'));
  } finally { await file.close(); }
}

export async function writeSettings(path: string, settings: SavedAiSettings): Promise<void> {
  const directory = dirname(path);
  await mkdir(directory, {recursive: true, mode: 0o700});
  if (!(await lstat(directory)).isDirectory()) throw new Error('invalid AI settings directory');
  try {
    if (!(await lstat(path)).isFile()) throw new Error('invalid AI settings file');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
  }
  const temporary = join(directory, `.ai-settings-${randomUUID()}.tmp`);
  try {
    const file = await open(temporary, 'wx', 0o600);
    try {
      await file.writeFile(JSON.stringify(settings, null, 2) + '\n', 'utf8');
      await file.sync();
    } finally { await file.close(); }
    await rename(temporary, path);
  } finally { await rm(temporary, {force: true}); }
}
