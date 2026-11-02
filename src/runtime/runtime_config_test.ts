import {DEFAULT_RUNTIME_CONFIG, getRuntimeConfig, getRuntimeConfigDiagnostic, loadRuntimeConfig, parseRuntimeConfig, resetRuntimeConfigForTest,} from './runtime_config';

describe('Runtime configuration', () => {
  afterEach(() => resetRuntimeConfigForTest());

  it('accepts launcher capture configuration', () => {
    expect(
      parseRuntimeConfig({
        schemaVersion: 1,
        host: {kind: 'standalone'},
        capture: {provider: 'loopback-proxy-v1', endpoint: './capture/'},
        optionalFutureField: true,
      }),
    ).toEqual(DEFAULT_RUNTIME_CONFIG);
  });

  it('exposes a bounded launcher capture startup diagnostic', async () => {
    const fetcher = jasmine.createSpy('fetcher').and.resolveTo(
      new Response(
        JSON.stringify({
          schemaVersion: 1,
          host: {kind: 'standalone'},
          capture: {provider: 'loopback-proxy-v1', endpoint: './capture/'},
        }),
        {headers: {'content-type': 'application/json'}},
      ),
    );

    await loadRuntimeConfig(fetcher);

    expect(getRuntimeConfigDiagnostic()).toBeUndefined();
  });

  it('accepts only clean relative loopback endpoints', () => {
    expect(
      parseRuntimeConfig({
        schemaVersion: 1,
        host: {kind: 'standalone'},
        capture: {provider: 'loopback-proxy-v1', endpoint: './proxy/'},
      }).capture,
    ).toEqual({
      provider: 'loopback-proxy-v1',
      endpoint: './proxy/',
    });
    expect(() =>
      parseRuntimeConfig({
        schemaVersion: 1,
        host: {kind: 'standalone'},
        capture: {
          provider: 'loopback-proxy-v1',
          endpoint: 'https://example.com/',
        },
      }),
    ).toThrowError(/relative path/);
    expect(() =>
      parseRuntimeConfig({
        schemaVersion: 1,
        host: {kind: 'standalone'},
        capture: {provider: 'loopback-proxy-v1', endpoint: './../proxy/'},
      }),
    ).toThrowError(/relative path/);
    expect(() =>
      parseRuntimeConfig({
        schemaVersion: 1,
        host: {kind: 'standalone'},
        capture: {provider: 'loopback-proxy-v1', endpoint: '/proxy/'},
      }),
    ).toThrowError(/relative path/);
  });

  it('accepts a same-origin AI gateway configuration', () => {
    expect(
      parseRuntimeConfig({
        schemaVersion: 1,
        host: {kind: 'standalone'},
        capture: {provider: 'loopback-proxy-v1', endpoint: './capture/'},
        ai: {provider: 'loopback-ai-v1', endpoint: './ai/'},
      }).ai,
    ).toEqual({provider: 'loopback-ai-v1', endpoint: './ai/'});
    expect(() =>
      parseRuntimeConfig({
        schemaVersion: 1,
        host: {kind: 'standalone'},
        capture: {provider: 'loopback-proxy-v1', endpoint: './capture/'},
        ai: {provider: 'loopback-ai-v1', endpoint: 'https://example.com/'},
      }),
    ).toThrowError(/relative path/);
  });

  it('requires launcher mode when runtime configuration is unavailable', async () => {
    const config = await loadRuntimeConfig(async () => {
      throw new Error('offline');
    });
    expect(config).toEqual(DEFAULT_RUNTIME_CONFIG);
    expect(getRuntimeConfigDiagnostic()).toContain('launcher');
  });

  it('uses a bounded JSON no-store request', async () => {
    const fetcher = jasmine.createSpy('fetcher').and.resolveTo(
      new Response(JSON.stringify(DEFAULT_RUNTIME_CONFIG), {
        headers: {'content-type': 'application/json'},
      }),
    );

    await loadRuntimeConfig(fetcher);

    expect(fetcher).toHaveBeenCalledOnceWith('./runtime-config.json', {
      cache: 'no-store',
      credentials: 'same-origin',
      redirect: 'error',
      headers: {Accept: 'application/json'},
    });
    expect(getRuntimeConfig()).toEqual(DEFAULT_RUNTIME_CONFIG);
  });

  it('rejects malformed, oversized, and non-JSON responses', async () => {
    const cases = [
      new Response('{', {headers: {'content-type': 'application/json'}}),
      new Response('x'.repeat(64 * 1024 + 1), {
        headers: {'content-type': 'application/json'},
      }),
      new Response(JSON.stringify(DEFAULT_RUNTIME_CONFIG), {
        headers: {'content-type': 'text/plain'},
      }),
      new Response(JSON.stringify({schemaVersion: 2}), {
        headers: {'content-type': 'application/json'},
      }),
    ];
    for (const response of cases) {
      const config = await loadRuntimeConfig(async () => response);
      expect(config).toEqual(DEFAULT_RUNTIME_CONFIG);
    }
  });

  it('rejects a response that reports a redirect', async () => {
    const response = {
      ok: true,
      redirected: true,
      headers: new Headers({'content-type': 'application/json'}),
      text: async () => JSON.stringify(DEFAULT_RUNTIME_CONFIG),
    } as Response;
    expect(await loadRuntimeConfig(async () => response)).toEqual(
      DEFAULT_RUNTIME_CONFIG,
    );
  });
});
