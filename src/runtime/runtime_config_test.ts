import {
  DEFAULT_RUNTIME_CONFIG,
  getRuntimeConfig,
  parseRuntimeConfig,
  resetRuntimeConfigForTest,
  loadRuntimeConfig,
} from './runtime_config';

describe('Runtime configuration', () => {
  afterEach(() => resetRuntimeConfigForTest());

  it('accepts standalone file-only configuration', () => {
    expect(
      parseRuntimeConfig({
        schemaVersion: 1,
        host: {kind: 'standalone'},
        capture: {provider: 'none'},
        optionalFutureField: true,
      }),
    ).toEqual(DEFAULT_RUNTIME_CONFIG);
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

  it('degrades fetch failures to file-only mode', async () => {
    const config = await loadRuntimeConfig(async () => {
      throw new Error('offline');
    });
    expect(config).toEqual(DEFAULT_RUNTIME_CONFIG);
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
});
