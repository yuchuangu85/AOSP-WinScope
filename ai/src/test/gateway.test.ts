import {strict as assert} from 'node:assert';
import {test} from 'node:test';
import {request as httpRequest} from 'node:http';
import {randomUUID} from 'node:crypto';
import {AiGateway} from '../gateway';
import {AgentRegistry} from '../registry';
import {ProviderRegistry} from '../providers';
import {AgentRuntime} from '../runtime';
import {SkillRegistry} from '../skills';
import {AgentRunResult, ProviderRequest, TraceDataQuery} from '../types';

test('gateway completes deterministic agent and exports report', async () => {
  const agents = new AgentRegistry();
  agents.register({
    id: 'deterministic-only',
    name: 'Deterministic only',
    skills: ['black-screen-diagnosis'],
  });
  const gateway = new AiGateway(
    new AgentRuntime(agents, new SkillRegistry(), new ProviderRegistry()),
  );
  await gateway.listen(0);
  const address = gateway.server.address();
  assert.ok(address && typeof address === 'object');
  const baseUrl = `http://127.0.0.1:${address.port}`;
  try {
    const start = await fetch(`${baseUrl}/api/analyze`, {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({
        agentId: 'deterministic-only',
        prompt: 'fixture',
        evidence: {
          video: {
            frames: [
              {index: 0, luma: 0.01},
              {index: 1, luma: 0.01},
            ],
          },
        },
      }),
    });
    assert.equal(start.status, 202);
    const session = (await start.json()) as {sessionId: string};
    let status: {status: string} = {status: 'running'};
    for (
      let attempt = 0;
      attempt < 20 && status.status === 'running';
      attempt++
    ) {
      await new Promise((resolve) => setTimeout(resolve, 10));
      status = (await (
        await fetch(`${baseUrl}/api/sessions/${session.sessionId}`)
      ).json()) as {status: string};
    }
    assert.equal(status.status, 'completed');
    const report = await fetch(
      `${baseUrl}/api/sessions/${session.sessionId}/report?format=markdown`,
    );
    assert.equal(report.status, 200);
    assert.match(await report.text(), /Winscope AI Analysis/);
  } finally {
    await gateway.close();
  }
});

async function setup(provider?: Parameters<ProviderRegistry['register']>[0], extraProviders: Array<Parameters<ProviderRegistry['register']>[0]> = [], agentProvider?: string | null) {
  const agents = new AgentRegistry();
  agents.register({id: 'chat', name: 'Chat', providerId: agentProvider === null ? undefined : agentProvider ?? provider?.id});
  const providers = new ProviderRegistry();
  if (provider) providers.register(provider);
  for (const extra of extraProviders) providers.register(extra);
  const gateway = new AiGateway(new AgentRuntime(agents, new SkillRegistry(), providers));
  await gateway.listen(0);
  const address = gateway.server.address();
  assert.ok(address && typeof address === 'object');
  const base = `http://127.0.0.1:${address.port}`;
  const post = (path: string, body: unknown) => fetch(`${base}${path}`, {method: 'POST', headers: {'content-type': 'application/json'}, body: JSON.stringify(body)});
  const detail = async (id: string) => await (await fetch(`${base}/api/sessions/${id}`)).json() as {status: string; result?: AgentRunResult; pendingTraceQuery?: {queryId: string; contextId: string; query: TraceDataQuery}; events: Array<{id: number; event: {type: string; data?: Record<string, unknown>}}>};
  const settled = async (id: string) => {
    for (let i = 0; i < 100; i++) {
      const session = await detail(id);
      if (session.status !== 'running') return session;
      await new Promise((resolve) => setTimeout(resolve, 5));
    }
    throw new Error('session did not settle');
  };
  return {gateway, base, post, detail, settled};
}

async function requestedTraceQuery(context: Awaited<ReturnType<typeof setup>>, sessionId: string, after = 0) {
  for (let i = 0; i < 100; i++) {
    const session = await context.detail(sessionId);
    const item = session.events.find((item) => item.id > after && item.event.type === 'trace_query_requested');
    if (item) {
      const data = item.event.data as {queryId: string; contextId: string; query: TraceDataQuery};
      assert.match(data.queryId, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
      return {...data, eventId: item.id};
    }
    assert.equal(session.status, 'running', 'session ended without requesting trace data');
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
  throw new Error('trace query was not requested');
}

function traceQueryProvider() {
  return {id: 'query', run: async (request: ProviderRequest) => ({
    providerId: 'query', durationMs: 0,
    output: request.prompt.includes('BEGIN_UNTRUSTED_TRACE_EVIDENCE') ? 'final answer' : JSON.stringify({tool: 'winscope_query_trace', arguments: {}}),
  })};
}

test('gateway transports a current trace query result to the provider and does not persist the snapshot', async () => {
  const requests: ProviderRequest[] = [];
  const provider = traceQueryProvider();
  const context = await setup({...provider, run: async (request) => {
    requests.push({...request, history: request.history?.map((turn) => ({...turn}))});
    return provider.run(request);
  }});
  const contextId = randomUUID();
  try {
    const start = await context.post('/api/analyze', {agentId: 'chat', prompt: 'inspect current trace', traceQueryEnabled: true, traceQueryContextId: contextId});
    assert.equal(start.status, 202);
    const session = await start.json() as {sessionId: string};
    const requested = await requestedTraceQuery(context, session.sessionId);
    assert.equal(requested.contextId, contextId);
    assert.deepEqual(requested.query, {});
    assert.deepEqual((await context.detail(session.sessionId)).pendingTraceQuery,
      {queryId: requested.queryId, contextId, query: {}});
    const result = {timeline: {position: 42}, rows: [{name: 'frame', value: 1}]};
    const acknowledged = await context.post(`/api/sessions/${session.sessionId}/trace-query/${requested.queryId}`, {contextId, result});
    assert.equal(acknowledged.status, 200);
    assert.deepEqual(await acknowledged.json(), {ok: true});
    const detail = await context.settled(session.sessionId);
    assert.equal(detail.status, 'completed');
    assert.equal(detail.pendingTraceQuery, undefined);
    assert.equal(detail.result?.provider?.output, 'final answer');
    assert.ok(requests[1].prompt.includes(JSON.stringify(result)), 'provider must receive the actual browser snapshot');
    assert.equal(JSON.stringify(detail.events).includes(JSON.stringify(result)), false);
    assert.equal(JSON.stringify(detail.result).includes(JSON.stringify(result)), false);
    const replay = await fetch(`${context.base}/api/sessions/${session.sessionId}/stream`);
    const replayText = await replay.text();
    assert.match(replayText, /event: trace_query_requested/);
    assert.equal(replayText.includes(JSON.stringify(result)), false);
    const duplicate = await context.post(`/api/sessions/${session.sessionId}/trace-query/${requested.queryId}`, {contextId, result});
    assert.equal(duplicate.status, 409);
    await duplicate.text();
    const continued = await context.post(`/api/sessions/${session.sessionId}/continue`, {prompt: 'follow up without trace access'});
    assert.equal(continued.status, 202);
    await context.settled(session.sessionId);
    assert.equal(requests[2].prompt.includes('Read-only WinScope trace query API'), false);
    assert.equal(JSON.stringify(requests[2].history).includes(JSON.stringify(result)), false);
  } finally { await context.gateway.close(); }
});

test('gateway transports specified trace queries and does not make trace-query options sticky', async () => {
  let calls = 0;
  const provider = {id: 'query', run: async () => {
    calls++;
    return {providerId: 'query', durationMs: 0, output: calls === 2 ? 'final answer' : JSON.stringify({tool: 'winscope_query_trace', arguments: {time: '1s200ms'}})};
  }};
  const context = await setup(provider);
  const contextId = randomUUID();
  try {
    const start = await context.post('/api/analyze', {agentId: 'chat', prompt: 'inspect a time', traceQueryEnabled: true, traceQueryContextId: contextId});
    const session = await start.json() as {sessionId: string};
    const requested = await requestedTraceQuery(context, session.sessionId);
    assert.deepEqual(requested.query, {time: '1s200ms'});
    const acknowledged = await context.post(`/api/sessions/${session.sessionId}/trace-query/${requested.queryId}`, {contextId, result: {position: 1200}});
    assert.equal(acknowledged.status, 200);
    assert.equal((await context.settled(session.sessionId)).status, 'completed');
    const continued = await context.post(`/api/sessions/${session.sessionId}/continue`, {prompt: 'no query now'});
    assert.equal(continued.status, 202);
    assert.equal((await context.settled(session.sessionId)).status, 'completed');
    assert.equal((await context.detail(session.sessionId)).events.some((item) => item.event.type === 'trace_query_requested' && item.id > requested.eventId), false);
    assert.equal(calls, 3, 'the disabled continuation must treat tool JSON as the final answer');
    const enabledWithoutContext = await context.post(`/api/sessions/${session.sessionId}/continue`, {prompt: 'query', traceQueryEnabled: true});
    assert.equal(enabledWithoutContext.status, 400, 'context must not be inherited from the earlier turn');
    await enabledWithoutContext.text();
  } finally { await context.gateway.close(); }
});

test('gateway preserves complete extended queries in pending metadata and SSE without retaining raw evidence', async () => {
  const queries: TraceDataQuery[] = [
    {time: '1s200ms', before: 0, after: 2, limit: 8,
      traceTypes: ['SURFACE_FLINGER', 'WINDOW_MANAGER', 'TRANSACTIONS', 'TRANSITION', 'WM_TRANSITION',
        'SHELL_TRANSITION', 'SCREEN_RECORDING', 'SCREENSHOT', 'VIEW_CAPTURE', 'PROTO_LOG'],
      layerId: '9007199254740993', windowId: 'literal $(not-code)', displayId: '0'},
    {time: '18446744073709551614ns', endTime: '18446744073709551615ns', limit: 1,
      traceTypes: ['WM_TRANSITION', 'SHELL_TRANSITION'], layerId: '0', windowId: 'false', displayId: '42'},
  ];
  const requests: ProviderRequest[] = [];
  const context = await setup({id: 'query', run: async (request) => {
    requests.push(request);
    return {providerId: 'query', durationMs: 0, output: requests.length <= queries.length
      ? JSON.stringify({tool: 'winscope_query_trace', arguments: queries[requests.length - 1]}) : 'final answer'};
  }});
  const contextId = randomUUID();
  try {
    const start = await context.post('/api/analyze', {agentId: 'chat', prompt: 'inspect filters', traceQueryEnabled: true, traceQueryContextId: contextId});
    const session = await start.json() as {sessionId: string};
    let lastId = 0;
    for (const query of queries) {
      const requested = await requestedTraceQuery(context, session.sessionId, lastId);
      lastId = requested.eventId;
      assert.deepEqual(requested.query, query);
      assert.deepEqual((await context.detail(session.sessionId)).pendingTraceQuery,
        {queryId: requested.queryId, contextId, query});
      const acknowledged = await context.post(`/api/sessions/${session.sessionId}/trace-query/${requested.queryId}`, {
        contextId, result: {privateRawValue: 'not-for-events-or-history', queryMetadata: query,
          entries: [{role: 'after', timestampNs: '18446744073709551615', data: {alpha: 0, visible: false}}]},
      });
      assert.equal(acknowledged.status, 200);
      await acknowledged.text();
      const duplicate = await context.post(`/api/sessions/${session.sessionId}/trace-query/${requested.queryId}`, {contextId, result: {}});
      assert.equal(duplicate.status, 409);
      await duplicate.text();
    }
    const detail = await context.settled(session.sessionId);
    assert.equal(detail.status, 'completed');
    assert.doesNotMatch(JSON.stringify(detail), /not-for-events-or-history|privateRawValue/);
    assert.match(requests[2].prompt, /privateRawValue/);
    const stream = await (await fetch(`${context.base}/api/sessions/${session.sessionId}/stream`)).text();
    for (const query of queries) assert.ok(stream.includes(JSON.stringify(query)));
    assert.doesNotMatch(stream, /not-for-events-or-history|privateRawValue/);
    const continued = await context.post(`/api/sessions/${session.sessionId}/continue`, {prompt: 'follow up'});
    assert.equal(continued.status, 202);
    await context.settled(session.sessionId);
    assert.doesNotMatch(JSON.stringify(requests[3].history), /privateRawValue|not-for-events-or-history/);
  } finally { await context.gateway.close(); }
});

test('gateway rejects invalid trace-query options and acknowledgements', async () => {
  const context = await setup(traceQueryProvider());
  const contextId = randomUUID();
  try {
    for (const body of [
      {agentId: 'chat', prompt: 'bad', traceQueryEnabled: 'yes'},
      {agentId: 'chat', prompt: 'bad', traceQueryEnabled: null},
      {agentId: 'chat', prompt: 'bad', traceQueryEnabled: 1},
      {agentId: 'chat', prompt: 'bad', traceQueryEnabled: true},
      {agentId: 'chat', prompt: 'bad', traceQueryContextId: null},
      {agentId: 'chat', prompt: 'bad', traceQueryContextId: 42},
      {agentId: 'chat', prompt: 'bad', traceQueryContextId: ''},
      {agentId: 'chat', prompt: 'bad', traceQueryEnabled: true, traceQueryContextId: 'x'.repeat(129)},
    ]) {
      const response = await context.post('/api/analyze', body);
      assert.equal(response.status, 400);
      await response.text();
    }
    const start = await context.post('/api/analyze', {agentId: 'chat', prompt: 'query', traceQueryEnabled: true, traceQueryContextId: contextId});
    const session = await start.json() as {sessionId: string};
    const requested = await requestedTraceQuery(context, session.sessionId);
    const wrongContext = await context.post(`/api/sessions/${session.sessionId}/trace-query/${requested.queryId}`, {contextId: randomUUID(), result: {ok: true}});
    assert.equal(wrongContext.status, 409);
    await wrongContext.text();
    const both = await context.post(`/api/sessions/${session.sessionId}/trace-query/${requested.queryId}`, {contextId, result: {}, error: 'nope'});
    assert.equal(both.status, 400);
    await both.text();
    for (const body of [{contextId}, {result: {}}, {contextId, result: null}, {contextId, result: []}, {contextId, result: {}, extra: true}, {contextId, error: ''}, {contextId, error: 42}, {contextId, error: 'e'.repeat(513)}]) {
      const invalid = await context.post(`/api/sessions/${session.sessionId}/trace-query/${requested.queryId}`, body);
      assert.equal(invalid.status, 400, JSON.stringify(body));
      await invalid.text();
    }
    const oversized = await context.post(`/api/sessions/${session.sessionId}/trace-query/${requested.queryId}`, {contextId, result: {data: 'x'.repeat(128 * 1024)}});
    assert.equal(oversized.status, 413);
    await oversized.text();
    const utf8Oversized = await context.post(`/api/sessions/${session.sessionId}/trace-query/${requested.queryId}`, {contextId, result: {data: '\u00e9'.repeat(65_536)}});
    assert.equal(utf8Oversized.status, 413, 'the result limit counts UTF-8 bytes');
    await utf8Oversized.text();
    const wrongId = await context.post(`/api/sessions/${session.sessionId}/trace-query/${randomUUID()}`, {contextId, result: {}});
    assert.equal(wrongId.status, 409);
    await wrongId.text();
    const duplicate = await context.post(`/api/sessions/missing/trace-query/${requested.queryId}`, {contextId, result: {ok: true}});
    assert.equal(duplicate.status, 404);
    await duplicate.text();
    const acknowledged = await context.post(`/api/sessions/${session.sessionId}/trace-query/${requested.queryId}`, {contextId, error: 'browser query failed'});
    assert.equal(acknowledged.status, 200);
    assert.equal((await context.settled(session.sessionId)).status, 'completed');
  } finally { await context.gateway.close(); }
});

test('gateway isolates trace queries across running sessions and cleans waiting queries on cancel and close', {timeout: 3000}, async () => {
  const context = await setup({id: 'query', run: async () => ({providerId: 'query', output: JSON.stringify({tool: 'winscope_query_trace', arguments: {}}), durationMs: 0})});
  const contextId = randomUUID();
  try {
    const start = await context.post('/api/analyze', {agentId: 'chat', prompt: 'cancel query', traceQueryEnabled: true, traceQueryContextId: contextId});
    const session = await start.json() as {sessionId: string};
    const requested = await requestedTraceQuery(context, session.sessionId);
    const second = await context.post('/api/analyze', {agentId: 'chat', prompt: 'close query', traceQueryEnabled: true, traceQueryContextId: contextId});
    const secondSession = await second.json() as {sessionId: string};
    await requestedTraceQuery(context, secondSession.sessionId);
    const wrongSession = await context.post(`/api/sessions/${secondSession.sessionId}/trace-query/${requested.queryId}`, {contextId, result: {wrong: true}});
    assert.equal(wrongSession.status, 409);
    await wrongSession.text();
    const cancelled = await context.post(`/api/sessions/${session.sessionId}/cancel`, {});
    assert.equal(cancelled.status, 202);
    assert.equal((await context.settled(session.sessionId)).status, 'cancelled');
    const stale = await context.post(`/api/sessions/${session.sessionId}/trace-query/${requested.queryId}`, {contextId, result: {late: true}});
    assert.equal(stale.status, 409);
    await stale.text();
    const nextContextId = randomUUID();
    const continued = await context.post(`/api/sessions/${session.sessionId}/continue`, {prompt: 'new turn', traceQueryEnabled: true, traceQueryContextId: nextContextId});
    assert.equal(continued.status, 202);
    const next = await requestedTraceQuery(context, session.sessionId, requested.eventId);
    assert.equal(next.contextId, nextContextId);
    for (const [queryId, staleContext] of [[requested.queryId, contextId], [next.queryId, contextId]]) {
      const oldTurn = await context.post(`/api/sessions/${session.sessionId}/trace-query/${queryId}`, {contextId: staleContext, result: {late: true}});
      assert.equal(oldTurn.status, 409, 'old turns cannot acknowledge a query in the current running turn');
      await oldTurn.text();
    }
    await context.gateway.close();
    assert.equal(context.gateway.server.listening, false);
  } finally { await context.gateway.close().catch(() => {}); }
});

test('gateway accepts a 128 KiB result and rejects duplicates while the next query is pending', async () => {
  let calls = 0;
  const context = await setup({id: 'query', run: async () => ({
    providerId: 'query', durationMs: 0,
    output: ++calls <= 2 ? JSON.stringify({tool: 'winscope_query_trace', arguments: {}}) : 'final answer',
  })});
  const contextId = randomUUID();
  try {
    const start = await context.post('/api/analyze', {agentId: 'chat', prompt: 'two queries', traceQueryEnabled: true, traceQueryContextId: contextId});
    const session = await start.json() as {sessionId: string};
    const first = await requestedTraceQuery(context, session.sessionId);
    const result = {data: 'x'.repeat(128 * 1024 - Buffer.byteLength(JSON.stringify({data: ''})))};
    assert.equal(Buffer.byteLength(JSON.stringify(result)), 128 * 1024);
    const accepted = await context.post(`/api/sessions/${session.sessionId}/trace-query/${first.queryId}`, {contextId, result});
    assert.equal(accepted.status, 200);
    await accepted.text();
    const second = await requestedTraceQuery(context, session.sessionId, first.eventId);
    assert.notEqual(first.queryId, second.queryId);
    const duplicate = await context.post(`/api/sessions/${session.sessionId}/trace-query/${first.queryId}`, {contextId, result: {}});
    assert.equal(duplicate.status, 409);
    await duplicate.text();
    const failed = await context.post(`/api/sessions/${session.sessionId}/trace-query/${second.queryId}`, {contextId, error: 'e'.repeat(512)});
    assert.equal(failed.status, 200);
    await failed.text();
    assert.equal((await context.settled(session.sessionId)).status, 'completed');
  } finally { await context.gateway.close(); }
});

test('gateway expires an unanswered trace query after a 20-second deadline and rejects late acknowledgements', async (t) => {
  const setTimeout = globalThis.setTimeout;
  let deadlineScheduled = false;
  t.mock.method(globalThis, 'setTimeout', (callback: () => void, delay?: number, ...args: unknown[]) => {
    if (delay === 20_000) deadlineScheduled = true;
    return setTimeout(callback, delay === 20_000 ? 50 : delay, ...args);
  });
  const context = await setup(traceQueryProvider());
  const contextId = randomUUID();
  try {
    const start = await context.post('/api/analyze', {agentId: 'chat', prompt: 'timeout', traceQueryEnabled: true, traceQueryContextId: contextId});
    const session = await start.json() as {sessionId: string};
    const requested = await requestedTraceQuery(context, session.sessionId);
    assert.equal(deadlineScheduled, true);
    const detail = await context.settled(session.sessionId);
    assert.equal(detail.status, 'completed', 'runtime should recover with a bounded tool error');
    const late = await context.post(`/api/sessions/${session.sessionId}/trace-query/${requested.queryId}`, {contextId, result: {late: true}});
    assert.equal(late.status, 409);
    await late.text();
  } finally { await context.gateway.close(); }
});

test('gateway restores transcript, continues with actual model/history/attachments, and resumes SSE by cursor', async () => {
  const requests: Array<import('../types').ProviderRequest> = [];
  const context = await setup({
    id: 'test', descriptor: {id: 'test', models: [{id: 'a', name: 'A'}, {id: 'b', name: 'B'}], reasoningLevels: ['low', 'medium', 'high']},
    run: async (request) => { requests.push({...request, history: request.history?.map((turn) => ({...turn}))}); return {providerId: 'test', output: `answer ${requests.length}`, durationMs: 0}; },
  });
  try {
    const start = await context.post('/api/analyze', {agentId: 'chat', prompt: 'first question', modelId: 'a', reasoningLevel: 'low', attachments: [{name: 'note.md', mimeType: 'text/markdown', content: 'actual attachment contents'}]});
    assert.equal(start.status, 202);
    const summary = await start.json() as {sessionId: string; title: string; providerId: string; modelId: string};
    assert.equal(summary.title, 'first question');
    assert.equal(summary.providerId, 'test');
    assert.equal(summary.modelId, 'a');
    const first = await context.settled(summary.sessionId);
    assert.equal(first.status, 'completed');
    assert.equal(first.events[0].event.type, 'analysis_started');
    const firstDuration = first.events.find((item) => item.event.type === 'analysis_completed')?.event.data?.durationMs;
    assert.equal(typeof firstDuration, 'number');
    assert.ok((firstDuration as number) >= 0);
    assert.equal(JSON.stringify(first.events).includes('actual attachment contents'), false);
    assert.match(requests[0].prompt, /actual attachment contents/);
    const cursor = first.events.at(-1)!.id;
    const follow = await context.post(`/api/sessions/${summary.sessionId}/continue`, {prompt: 'follow-up', modelId: 'b', reasoningLevel: 'high'});
    assert.equal(follow.status, 202);
    await context.settled(summary.sessionId);
    assert.equal(requests[1].modelId, 'b');
    assert.equal(requests[1].reasoningLevel, 'high');
    assert.equal(requests[1].history?.[0].content.includes('first question'), true);
    assert.equal(requests[1].history?.[1].content, 'answer 1');
    const replay = await (await fetch(`${context.base}/api/sessions/${summary.sessionId}/stream?after=${cursor}`)).text();
    assert.match(replay, /follow-up/);
    assert.doesNotMatch(replay, /first question/);
    const restored = await context.detail(summary.sessionId);
    assert.equal(restored.events.filter((item) => item.event.type === 'analysis_started').length, 2);
    const list = await (await fetch(`${context.base}/api/sessions`)).json() as {sessions: Array<{sessionId: string; lastPrompt: string; reasoningLevel: string}>};
    assert.equal(list.sessions[0].sessionId, summary.sessionId);
    assert.equal(list.sessions[0].lastPrompt, 'follow-up');
    assert.equal(list.sessions[0].reasoningLevel, 'high');
  } finally { await context.gateway.close(); }
});

test('gateway rejects malformed settings, unsupported attachments, unknown sessions, and invalid cursors', async () => {
  const context = await setup({id: 'fixed', run: async () => ({providerId: 'fixed', output: 'ok', durationMs: 0})});
  try {
    for (const settings of [{modelId: 'unknown'}, {reasoningLevel: 'high'}, {reasoningLevel: 'critical'}, {providerId: 'missing'}, {modelId: '--shell'}, {agentId: 'missing'}]) {
      const response = await context.post('/api/analyze', {agentId: 'chat', prompt: 'test', ...settings});
      assert.equal(response.status, 400, JSON.stringify(settings));
      await response.text();
    }
    for (const attachment of [
      {name: 'photo.png', mimeType: 'image/png', content: 'x'},
      {name: '/private/path.txt', mimeType: 'text/plain', content: 'x'},
      {name: 'note.txt', mimeType: 'text/plain', content: '\0'},
    ]) {
      const response = await context.post('/api/analyze', {agentId: 'chat', prompt: 'test', attachments: [attachment]});
      assert.equal(response.status, 400);
      await response.text();
    }
    const large = await context.post('/api/analyze', {agentId: 'chat', prompt: 'test', attachments: [{name: 'note.txt', mimeType: 'text/plain', content: 'x'.repeat(65_537)}]});
    assert.equal(large.status, 413);
    await large.text();
    const missing = await context.post('/api/sessions/missing/continue', {prompt: 'x'});
    assert.equal(missing.status, 404);
    await missing.text();
    const start = await context.post('/api/analyze', {agentId: 'chat', prompt: 'valid'});
    const session = await start.json() as {sessionId: string};
    await context.settled(session.sessionId);
    for (const cursor of ['NaN', '-1', '9999', '0.5']) {
      const response = await fetch(`${context.base}/api/sessions/${session.sessionId}/stream?after=${cursor}`);
      assert.equal(response.status, 400);
      await response.text();
    }
    const malformed = await fetch(`${context.base}/api/analyze`, {method: 'POST', headers: {'content-type': 'application/json'}, body: '{'});
    assert.equal(malformed.status, 400);
    await malformed.text();
  } finally { await context.gateway.close(); }
});

test('gateway serializes turns and cancellation emits cancelled instead of completed', async () => {
  let finish: (() => void) | undefined;
  const context = await setup({id: 'slow', run: (request) => new Promise((resolve) => {
    finish = () => resolve({providerId: 'slow', output: 'ignored on cancellation', durationMs: 0, cancelled: request.signal?.aborted});
  })});
  try {
    const start = await context.post('/api/analyze', {agentId: 'chat', prompt: 'first'});
    const session = await start.json() as {sessionId: string};
    const concurrent = await context.post(`/api/sessions/${session.sessionId}/continue`, {prompt: 'must not start'});
    assert.equal(concurrent.status, 409);
    await concurrent.text();
    const earlyReport = await fetch(`${context.base}/api/sessions/${session.sessionId}/report`);
    assert.equal(earlyReport.status, 409);
    await earlyReport.text();
    const cancelled = await context.post(`/api/sessions/${session.sessionId}/cancel`, {});
    assert.equal(cancelled.status, 202);
    await cancelled.text();
    finish!();
    const detail = await context.settled(session.sessionId);
    assert.equal(detail.status, 'cancelled');
    assert.equal(detail.events.at(-1)?.event.type, 'analysis_cancelled');
    assert.equal(detail.events.some((item) => item.event.type === 'analysis_completed'), false);
  } finally { finish?.(); await context.gateway.close(); }
});

test('explicit null provider resets to agent default (including providerless agents), omission preserves selection', async () => {
  for (const providerless of [false, true]) {
    const calls: string[] = [];
    const makeProvider = (id: string) => ({id, run: async () => {
      calls.push(id);
      return {providerId: id, output: id, durationMs: 0};
    }});
    const context = await setup(makeProvider('agent-default'), [makeProvider('override')], providerless ? null : undefined);
    try {
      const start = await context.post('/api/analyze', {agentId: 'chat', prompt: 'first', providerId: 'override'});
      const session = await start.json() as {sessionId: string};
      assert.equal((await context.settled(session.sessionId)).status, 'completed');
      const preserve = await context.post(`/api/sessions/${session.sessionId}/continue`, {prompt: 'preserve override'});
      assert.equal(preserve.status, 202);
      assert.equal((await preserve.json() as {providerId: string}).providerId, 'override');
      await context.settled(session.sessionId);
      const reset = await context.post(`/api/sessions/${session.sessionId}/continue`, {prompt: 'reset', providerId: null});
      assert.equal(reset.status, 202);
      assert.equal((await reset.json() as {providerId?: string}).providerId, providerless ? undefined : 'agent-default');
      assert.equal((await context.settled(session.sessionId)).status, 'completed');
      assert.deepEqual(calls, providerless ? ['override', 'override'] : ['override', 'override', 'agent-default']);
    } finally { await context.gateway.close(); }
  }
});

test('gateway and provider execution agree on model-specific effort overrides', async () => {
  const {CommandProvider} = await import('../providers');
  const provider = new CommandProvider({
    id: 'selectable', kind: 'command', executable: process.execPath,
    args: ['-e', 'process.stdin.resume();process.stdin.on("end",()=>process.stdout.write("selected"))', '--'],
    models: [{id: 'special', name: 'Special', levels: ['high']}],
    modelArgs: ['--model', '{{model}}'], reasoningArgs: ['--effort', '{{level}}'], reasoningLevels: ['low'],
  });
  const context = await setup(provider);
  try {
    const start = await context.post('/api/analyze', {agentId: 'chat', prompt: 'x', modelId: 'special', reasoningLevel: 'high'});
    assert.equal(start.status, 202);
    const session = await start.json() as {sessionId: string};
    assert.equal((await context.settled(session.sessionId)).status, 'completed');
    const unsupported = await context.post(`/api/sessions/${session.sessionId}/continue`, {prompt: 'x', modelId: 'special', reasoningLevel: 'low'});
    assert.equal(unsupported.status, 400);
    await unsupported.text();
  } finally { await context.gateway.close(); }
});

test('gateway rejects DNS-rebinding/cross-origin/simple mutations before invoking a provider', async () => {
  let calls = 0;
  const context = await setup({id: 'guarded', run: async () => {
    calls++;
    return {providerId: 'guarded', output: 'ok', durationMs: 0};
  }});
  try {
    const body = JSON.stringify({agentId: 'chat', prompt: 'must not run'});
    const rejectedHeaders: Array<Record<string, string>> = [
      {'host': 'attacker.invalid'},
      {'host': 'localhost.attacker.invalid'},
      {'host': '127.0.0.1.attacker.invalid'},
      {'host': 'localhost:65536'},
      {'origin': 'https://attacker.invalid'},
      {'origin': 'http://localhost.attacker.invalid'},
      {'origin': 'null'},
      {'origin': 'http://user@127.0.0.1:1234'},
    ];
    for (const headers of rejectedHeaders) {
      // Node fetch ignores custom Host; use raw HTTP to exercise the wire authority.
      const response = await new Promise<{status: number; cors: string | string[] | undefined}>((resolve, reject) => {
        const request = httpRequest(`${context.base}/api/analyze`, {method: 'POST', headers: {'content-type': 'application/json', ...headers}}, (response) => {
          response.resume();
          response.on('end', () => resolve({status: response.statusCode ?? 0, cors: response.headers['access-control-allow-origin']}));
        });
        request.on('error', reject);
        request.end(body);
      });
      assert.equal(response.status, 403, JSON.stringify(headers));
      assert.equal(response.cors, undefined);
    }
    for (const contentType of [undefined, 'text/plain', 'application/x-www-form-urlencoded', 'application/jsonx']) {
      const response = await fetch(`${context.base}/api/analyze`, {method: 'POST', headers: contentType ? {'content-type': contentType} : {}, body});
      assert.equal(response.status, 415);
      await response.text();
    }
    const options = await fetch(`${context.base}/api/analyze`, {method: 'OPTIONS', headers: {origin: 'http://attacker.invalid', 'access-control-request-method': 'POST'}});
    assert.equal(options.status, 403);
    assert.equal(options.headers.get('access-control-allow-origin'), null);
    await options.text();
    const localOptions = await fetch(`${context.base}/api/analyze`, {method: 'OPTIONS', headers: {origin: 'http://localhost:63142'}});
    assert.equal(localOptions.status, 405);
    await localOptions.text();
    assert.equal(calls, 0);
    // Loopback frontend and launcher may run on another local port. CLI requests omit Origin.
    for (const origin of [undefined, 'http://127.0.0.1:63142', 'http://localhost:63142', 'http://[::1]:63142']) {
      const response = await fetch(`${context.base}/api/analyze`, {method: 'POST', headers: {'content-type': 'application/json; charset=utf-8', ...(origin ? {origin} : {})}, body});
      assert.equal(response.status, 202, origin);
      const session = await response.json() as {sessionId: string};
      assert.equal((await context.settled(session.sessionId)).status, 'completed');
    }
    assert.equal(calls, 4);
  } finally { await context.gateway.close(); }
});

test('gateway cannot be configured to listen on a public interface', async () => {
  const gateway = new AiGateway(new AgentRuntime(new AgentRegistry(), new SkillRegistry(), new ProviderRegistry()));
  await assert.rejects(gateway.listen(0, '0.0.0.0'), /must bind to loopback/);
});
