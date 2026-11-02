import {AiGatewayClient, parseSseEventBlock} from './ai_gateway_client';

describe('AiGatewayClient', () => {
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
