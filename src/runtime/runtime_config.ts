/*
 * Copyright (C) 2026 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 */

/** Runtime configuration supplied by a standalone host. */
export interface RuntimeConfig {
  readonly schemaVersion: 1;
  readonly host: {readonly kind: 'standalone'};
  readonly capture: {
    readonly provider: 'loopback-proxy-v1';
    readonly endpoint: string;
  };
  readonly ai?: {readonly provider: 'loopback-ai-v1'; readonly endpoint: string};
}

export const DEFAULT_RUNTIME_CONFIG: RuntimeConfig = {
  schemaVersion: 1,
  host: {kind: 'standalone'},
  capture: {provider: 'loopback-proxy-v1', endpoint: './capture/'},
  ai: undefined,
};

const MAX_CONFIG_BYTES = 64 * 1024;
let activeConfig = DEFAULT_RUNTIME_CONFIG;
let configDiagnostic: string | undefined;

export function getRuntimeConfig(): RuntimeConfig {
  return activeConfig;
}

export function getRuntimeConfigDiagnostic(): string | undefined {
  return configDiagnostic;
}

/**
 * Fetches and validates the host-provided configuration. Invalid or missing
 * configuration deliberately stays in launcher mode and reports the missing launcher contract.
 */
export async function loadRuntimeConfig(
  fetcher: typeof fetch = fetch,
): Promise<RuntimeConfig> {
  try {
    const response = await fetcher('./runtime-config.json', {
      cache: 'no-store',
      credentials: 'same-origin',
      redirect: 'error',
      headers: {Accept: 'application/json'},
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    if (response.redirected) {
      throw new Error('configuration fetch was redirected');
    }
    const contentType = response.headers.get('content-type');
    if (
      contentType === null ||
      !contentType.toLowerCase().startsWith('application/json')
    ) {
      throw new Error('configuration has an invalid content type');
    }
    const length = response.headers.get('content-length');
    if (length !== null && Number(length) > MAX_CONFIG_BYTES) {
      throw new Error('configuration exceeds size limit');
    }
    const text = await response.text();
    if (new TextEncoder().encode(text).byteLength > MAX_CONFIG_BYTES) {
      throw new Error('configuration exceeds size limit');
    }
    activeConfig = parseRuntimeConfig(JSON.parse(text));
    configDiagnostic = undefined;
  } catch (error) {
    activeConfig = DEFAULT_RUNTIME_CONFIG;
    configDiagnostic =
      'Runtime configuration is unavailable; start Winscope through the launcher to enable device capture.';
    console.warn(
      'Runtime configuration unavailable; launcher mode is required.',
      error,
    );
  }
  return activeConfig;
}

export function parseRuntimeConfig(value: unknown): RuntimeConfig {
  if (!isRecord(value) || value['schemaVersion'] !== 1) {
    throw new Error('unsupported runtime configuration schema');
  }
  const host = value['host'];
  if (!isRecord(host) || host['kind'] !== 'standalone') {
    throw new Error('unsupported runtime host');
  }
  const capture = value['capture'];
  if (!isRecord(capture)) throw new Error('missing capture configuration');
  const ai = parseAiConfig(value['ai']);
  if (capture['provider'] !== 'loopback-proxy-v1') {
    throw new Error('unsupported capture provider');
  }
  const configuredEndpoint = capture['endpoint'];
  if (typeof configuredEndpoint !== 'string') {
    throw new Error('loopback proxy endpoint is required');
  }
  validateRelativeSameOriginEndpoint(configuredEndpoint, 'capture');
  return {
    schemaVersion: 1,
    host: {kind: 'standalone'},
    capture: {provider: 'loopback-proxy-v1', endpoint: configuredEndpoint},
    ai,
  };
}

/** Resolves the validated relative proxy endpoint only when capture is enabled. */
export function getRuntimeProxyEndpoint(): string {
  if (activeConfig.capture.provider !== 'loopback-proxy-v1') {
    throw new Error(
      'The runtime configuration does not enable device capture.',
    );
  }
  return new URL(activeConfig.capture.endpoint, document.baseURI).toString();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function resetRuntimeConfigForTest(): void {
  activeConfig = DEFAULT_RUNTIME_CONFIG;
  configDiagnostic = undefined;
}

/** Test-only setup for consumers that exercise the configured proxy boundary. */
export function setRuntimeConfigForTest(config: RuntimeConfig): void {
  activeConfig = config;
}

function parseAiConfig(value: unknown): RuntimeConfig['ai'] {
  if (value === undefined) return undefined;
  if (!isRecord(value)) throw new Error('invalid AI configuration');
  if (value['provider'] !== 'loopback-ai-v1') {
    throw new Error('unsupported AI provider');
  }
  const endpoint = value['endpoint'];
  if (typeof endpoint !== 'string') {
    throw new Error('AI gateway endpoint is required');
  }
  validateRelativeSameOriginEndpoint(endpoint, 'AI gateway');
  return {provider: 'loopback-ai-v1', endpoint};
}

function validateRelativeSameOriginEndpoint(
  configuredEndpoint: string,
  name: string,
): void {
  if (
    configuredEndpoint.length === 0 ||
    configuredEndpoint.length > 2048 ||
    !configuredEndpoint.startsWith('./') ||
    configuredEndpoint.includes('?') ||
    configuredEndpoint.includes('#') ||
    configuredEndpoint.includes('\\') ||
    Array.from(configuredEndpoint).some((character) => {
      const code = character.charCodeAt(0);
      return code < 32 || code === 127;
    })
  ) {
    throw new Error(`${name} endpoint must be a relative path`);
  }
  let decodedEndpoint: string;
  try {
    decodedEndpoint = decodeURIComponent(configuredEndpoint);
  } catch {
    throw new Error(`${name} endpoint must be a relative path`);
  }
  if (decodedEndpoint.split('/').some((part) => part === '..')) {
    throw new Error(`${name} endpoint must be a relative path`);
  }
  const endpoint = new URL(configuredEndpoint, document.baseURI);
  if (
    endpoint.origin !== window.location.origin ||
    endpoint.protocol !== window.location.protocol ||
    endpoint.username !== '' ||
    endpoint.password !== ''
  ) {
    throw new Error(`${name} endpoint must be same-origin`);
  }
}
