import {AiGatewayClient, AiProviderConfiguration, AiSettingsSelection, parseSseEventBlock} from './ai_gateway_client';

describe('AiGatewayClient', () => {
  it('explains a failed send without retrying a potentially accepted POST', async () => {
    const fetcher = jasmine.createSpy('fetch').and.rejectWith(new TypeError('Failed to fetch'));
    const client = new AiGatewayClient('./ai/', fetcher);
    await expectAsync(client.startAnalysis('Question', 'display')).toBeRejectedWithError(
      'Could not reach the AI gateway. Check the connection and try again.',
    );
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('distinguishes connection and reader failures on the event stream from a failed send', async () => {
    const fetcher = jasmine.createSpy('fetch').and.rejectWith(new TypeError('NetworkError'));
    const client = new AiGatewayClient('./ai/', fetcher);
    await expectAsync(client.stream('a', () => undefined)).toBeRejectedWithError(
      'The AI connection was interrupted. Reopen this conversation to reconnect.',
    );
    const body = new ReadableStream<Uint8Array>({
      pull(controller) { controller.error(new TypeError('network error')); },
    });
    fetcher.and.resolveTo(new Response(body));
    await expectAsync(client.stream('a', () => undefined)).toBeRejectedWithError(
      'The AI connection was interrupted. Reopen this conversation to reconnect.',
    );
  });

  it('preserves an explicit abort rather than describing it as a network failure', async () => {
    const controller = new AbortController();
    const reason = new DOMException('Cancelled', 'AbortError');
    controller.abort(reason);
    const fetcher = jasmine.createSpy('fetch').and.rejectWith(reason);
    await expectAsync(new AiGatewayClient('./ai/', fetcher).startAnalysis('Question', 'display', undefined, controller.signal))
      .toBeRejectedWith(reason);
  });

  const selection: AiSettingsSelection = {
    agentId: 'display',
    providerId: 'codex',
    modelId: '__custom__',
    customModel: 'local/model[1m]',
    reasoningLevel: 'high',
  };

  for (const persisted of [false, true]) {
    it(`loads provider descriptors ${persisted ? 'with' : 'without'} a persisted selection`, async () => {
      const providers = [{id: 'codex', configured: true}];
      const agents = [{id: 'display', name: 'Display analyst', providerId: 'codex'}];
      const skills = [{id: 'frames', name: 'Frames', kind: 'deterministic'}];
      const fetcher = jasmine.createSpy('fetch').and.callFake(async (url: string) => {
        const path = new URL(url).pathname;
        switch (path) {
          case '/ai/api/providers':
            return new Response(JSON.stringify({providers, ...(persisted ? {selection} : {})}));
          case '/ai/api/agents':
            return new Response(JSON.stringify({agents}));
          case '/ai/api/skills':
            return new Response(JSON.stringify({skills}));
          default:
            throw new Error('Unexpected catalog request: ' + path);
        }
      });
      const controller = new AbortController();
      const loaded = await new AiGatewayClient('./ai/', fetcher).catalog(controller.signal);
      expect(loaded).toEqual({providers, agents, skills, ...(persisted ? {selection} : {})});
      expect(Object.hasOwn(loaded, 'selection')).toBe(persisted);
      expect(fetcher).toHaveBeenCalledTimes(3);
      for (const [, init] of fetcher.calls.allArgs()) {
        expect(init).toEqual({cache: 'no-store', signal: controller.signal});
        expect(init.body).toBeUndefined();
      }
    });
  }

  it('posts only the selected settings and optional configuration with an abort signal', async () => {
    const configuration: AiProviderConfiguration = {
      baseUrl: 'https://service.example/v1',
      providerName: 'Local service',
      apiKeyEnv: 'CODEX_API_KEY',
      timeoutMs: 30_000,
    };
    const provider = {id: 'codex', configured: true, configuration};
    const saved = {selection: {...selection, customModel: 'persisted/model'}, provider};
    const fetcher = jasmine.createSpy('fetch').and.callFake(async () =>
      new Response(JSON.stringify(saved)),
    );
    const controller = new AbortController();
    const client = new AiGatewayClient('./ai/', fetcher);
    expect(await client.saveSettings(selection, configuration, controller.signal)).toEqual(saved);
    const [url, init] = fetcher.calls.mostRecent().args;
    expect(url).toBe(new URL('ai/api/settings', document.baseURI).toString());
    expect(init).toEqual(jasmine.objectContaining({
      method: 'POST',
      cache: 'no-store',
      signal: controller.signal,
      headers: {'content-type': 'application/json'},
    }));
    expect(JSON.parse(init.body)).toEqual({selection, configuration});
    expect(JSON.parse(init.body).configuration.apiKey).toBeUndefined();
    expect(selection.customModel).toBe('local/model[1m]');
  });

  it('omits configuration when saving only a selection and accepts responses without a provider', async () => {
    const fetcher = jasmine.createSpy('fetch').and.callFake(async () =>
      new Response(JSON.stringify({selection})),
    );
    const result = await new AiGatewayClient('./ai/', fetcher).saveSettings(selection);
    expect(result).toEqual({selection});
    expect(result.provider).toBeUndefined();
    const [, init] = fetcher.calls.mostRecent().args;
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body)).toEqual({selection});
    expect(Object.hasOwn(JSON.parse(init.body), 'configuration')).toBeFalse();
  });

  it('propagates settings failures so the caller can retry without changing the request', async () => {
    const fetcher = jasmine.createSpy('fetch').and.callFake(async () =>
      new Response('{"error":"Invalid provider configuration"}', {status: 400}),
    );
    const client = new AiGatewayClient('./ai/', fetcher);
    await expectAsync(client.saveSettings(selection)).toBeRejectedWithError('Invalid provider configuration');
    fetcher.and.callFake(async () => new Response(JSON.stringify({selection})));
    expect(await client.saveSettings(selection)).toEqual({selection});
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(fetcher.calls.allArgs().map(([, init]) => JSON.parse(init.body)))
      .toEqual([{selection}, {selection}]);
  });

  it('parses JSON SSE events with monotonic IDs', () => {
    expect(
      parseSseEventBlock(
        'id: 2\nevent: progress\ndata: {"type":"skill_started","data":{"skillId":"x"}}',
      ),
    ).toEqual({
      id: 2,
      type: 'skill_started',
      message: undefined,
      data: {skillId: 'x'},
    });
  });
  it('posts read-only trace query results to the exact session and query with an abort signal', async () => {
    const fetcher = jasmine.createSpy('fetch').and.resolveTo(new Response('{"ok":true}'));
    const client = new AiGatewayClient('./ai/', fetcher);
    const controller = new AbortController();
    const result = {requestedTimestampNs: '1793621012123456789', entries: [{alpha: 0}]};
    await client.respondToTraceQuery('session/1', 'query/2', 'context-3', {result}, controller.signal);
    const [url, init] = fetcher.calls.mostRecent().args;
    expect(url).toContain('/api/sessions/session%2F1/trace-query/query%2F2');
    expect(JSON.parse(init.body)).toEqual({contextId: 'context-3', result});
    expect(init.signal).toBe(controller.signal);
    expect(init.method).toBe('POST');
    expect(init.cache).toBe('no-store');
  });

  it('posts trace query errors without fabricating a snapshot', async () => {
    const fetcher = jasmine.createSpy('fetch').and.resolveTo(new Response('{"ok":true}'));
    await new AiGatewayClient('./ai/', fetcher).respondToTraceQuery('a', 'q', 'c', {error: 'No trace data'});
    expect(JSON.parse(fetcher.calls.mostRecent().args[1].body)).toEqual({contextId: 'c', error: 'No trace data'});
  });
  it('rejects empty SSE blocks and safely handles primitive data', () => {
    expect(parseSseEventBlock('event: progress')).toBeUndefined();
    expect(parseSseEventBlock('event: message\ndata: null')?.message).toBe(
      'null',
    );
  });
  it('passes actual model/level, text notes and continuation ID', async () => {
    const fetcher = jasmine
      .createSpy('fetch')
      .and.resolveTo(new Response('{"sessionId":"a"}'));
    const client = new AiGatewayClient('./ai/', fetcher);
    await client.startAnalysis('Follow up', 'display', {video: {}}, undefined, {
      sessionId: 'a/b',
      providerId: 'local',
      modelId: 'test-model',
      reasoningLevel: 'high',
      attachments: [
        {name: 'a.txt', mimeType: 'text/plain', content: 'Actual notes'},
      ],
    });
    const [url, init] = fetcher.calls.mostRecent().args;
    expect(url).toContain('/ai/api/sessions/a%2Fb/continue');
    const body = JSON.parse(init.body);
    expect(body.modelId).toBe('test-model');
    expect(body.reasoningLevel).toBe('high');
    expect(body.attachments[0].content).toBe('Actual notes');
    expect(body.sessionId).toBeUndefined();
  });
  it('restores session lists and details through same-origin requests', async () => {
    const fetcher = jasmine
      .createSpy('fetch')
      .and.callFake(
        async (url: string) =>
          new Response(
            JSON.stringify(
              url.endsWith('api/sessions')
                ? {sessions: [{sessionId: 'a'}]}
                : {sessionId: 'a', events: []},
            ),
          ),
      );
    const client = new AiGatewayClient('./ai/', fetcher);
    expect((await client.listSessions())[0].sessionId).toBe('a');
    expect((await client.getSession('a')).events).toEqual([]);
  });
  it('reassembles split UTF-8/CRLF SSE blocks and passes replay cursor', async () => {
    const bytes = new TextEncoder().encode(
      'id: 7\r\nevent: progress\r\ndata: {"message":"你好"}\r\n\r\n',
    );
    const stream = new ReadableStream({
      start(controller) {
        for (const byte of bytes) controller.enqueue(Uint8Array.of(byte));
        controller.close();
      },
    });
    const fetcher = jasmine
      .createSpy('fetch')
      .and.resolveTo(new Response(stream));
    const received: unknown[] = [];
    await new AiGatewayClient('./ai/', fetcher).stream(
      'a',
      (event) => received.push(event),
      undefined,
      6,
    );
    expect(fetcher.calls.mostRecent().args[0]).toContain('stream?after=6');
    expect(received).toEqual([
      {id: 7, type: 'progress', message: '你好', data: undefined},
    ]);
  });
  it('surfaces gateway errors rather than hiding failed requests', async () => {
    const client = new AiGatewayClient(
      './ai/',
      async () => new Response('{"error":"Session expired"}', {status: 404}),
    );
    await expectAsync(client.getSession('missing')).toBeRejectedWithError(
      'Session expired',
    );
  });

  it('imports a native CLI configuration with only its provider ID and abort signal', async () => {
    const provider = {
      id: 'codex',
      defaultModelId: 'gpt-model[1m]',
      importedFrom: 'Codex local configuration',
      models: [{id: 'gpt-model[1m]', name: 'GPT model'}],
    };
    const fetcher = jasmine.createSpy('fetch').and.callFake(async () =>
      new Response(JSON.stringify({provider})),
    );
    const client = new AiGatewayClient('./ai/', fetcher);
    const controller = new AbortController();
    for (const providerId of ['codex', 'claude'] as const) {
      expect(await client.importLocalConfig(providerId, controller.signal)).toEqual(provider);
      const [url, init] = fetcher.calls.mostRecent().args;
      expect(url).toContain('/ai/api/providers/import-local');
      expect(init).toEqual(jasmine.objectContaining({
        method: 'POST',
        cache: 'no-store',
        signal: controller.signal,
        headers: {'content-type': 'application/json'},
      }));
      expect(JSON.parse(init.body)).toEqual({providerId});
    }
  });

  it('propagates local import failures so the caller can retry', async () => {
    const fetcher = jasmine.createSpy('fetch').and.callFake(async () =>
      new Response('{"error":"Local configuration unavailable"}', {status: 400}),
    );
    const client = new AiGatewayClient('./ai/', fetcher);
    await expectAsync(client.importLocalConfig('claude')).toBeRejectedWithError('Local configuration unavailable');
    fetcher.and.callFake(async () => new Response('{"provider":{"id":"claude"}}'));
    expect((await client.importLocalConfig('claude')).id).toBe('claude');
  });
});
