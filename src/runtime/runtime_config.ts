/*
 * Copyright (C) 2026 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 */

/** Runtime configuration supplied by a standalone host. */
export interface RuntimeConfig {
  readonly schemaVersion: 1;
  readonly host: {readonly kind: 'standalone'};
  readonly capture:
    | {readonly provider: 'none'}
    | {readonly provider: 'loopback-proxy-v1'; readonly endpoint: string};
}

export const DEFAULT_RUNTIME_CONFIG: RuntimeConfig = {
  schemaVersion: 1,
  host: {kind: 'standalone'},
  capture: {provider: 'none'},
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
 * configuration deliberately degrades to file-only analysis.
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
      'Runtime configuration is unavailable; device capture is disabled and file-only analysis is active.';
    console.warn(
      'Runtime configuration unavailable; using file-only mode.',
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
  if (capture['provider'] === 'none') return DEFAULT_RUNTIME_CONFIG;
  if (capture['provider'] !== 'loopback-proxy-v1') {
    throw new Error('unsupported capture provider');
  }
  const configuredEndpoint = capture['endpoint'];
  if (typeof configuredEndpoint !== 'string') {
    throw new Error('loopback proxy endpoint is required');
  }
  if (
    !configuredEndpoint.startsWith('./') ||
    configuredEndpoint.includes('?') ||
    configuredEndpoint.includes('#') ||
    configuredEndpoint.split('/').includes('..')
  ) {
    throw new Error('capture endpoint must be a relative path');
  }
  const endpoint = new URL(configuredEndpoint, document.baseURI);
  if (
    endpoint.origin !== window.location.origin ||
    endpoint.protocol !== window.location.protocol
  ) {
    throw new Error('capture endpoint must be same-origin');
  }
  return {
    schemaVersion: 1,
    host: {kind: 'standalone'},
    capture: {provider: 'loopback-proxy-v1', endpoint: configuredEndpoint},
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
