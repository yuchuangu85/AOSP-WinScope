import {strict as assert} from 'node:assert';
import {test} from 'node:test';
import {request as httpRequest} from 'node:http';
import {AiGateway} from '../gateway';
import {AgentRegistry} from '../registry';
import {ProviderRegistry} from '../providers';
import {AgentRuntime} from '../runtime';
import {SkillRegistry} from '../skills';

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
  const detail = async (id: string) => await (await fetch(`${base}/api/sessions/${id}`)).json() as {status: string; events: Array<{id: number; event: {type: string; data?: Record<string, unknown>}}>};
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
