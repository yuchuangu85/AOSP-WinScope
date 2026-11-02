import {strict as assert} from 'node:assert';
import {mkdtemp, readFile, rm, writeFile} from 'node:fs/promises';
import {request as httpRequest} from 'node:http';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {test} from 'node:test';

import {AiGateway} from '../gateway';
import {CommandProvider, ProviderRegistry} from '../providers';
import {AgentRegistry} from '../registry';
import {AgentRuntime} from '../runtime';
import {SkillRegistry} from '../skills';
import {Provider, ProviderResponse} from '../types';

async function waitFor(check: () => boolean | Promise<boolean>): Promise<void> {
  const deadline = Date.now() + 3000;
  while (!await check()) {
    assert.ok(Date.now() < deadline, 'fixture did not reach the expected state');
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
}

function isAlive(pid: number): boolean {
  try { process.kill(pid, 0); return true; }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ESRCH') return false;
    throw error;
  }
}

async function commandFixture() {
  const directory = await mkdtemp(join(tmpdir(), 'winscope-shutdown-'));
  const executable = join(directory, 'provider.cjs');
  const pidPath = join(directory, 'provider.pid');
  const termPath = join(directory, 'sigterm');
  await writeFile(executable, `
const fs = require('node:fs');
process.on('SIGTERM', () => fs.writeFileSync(process.argv[3], 'received'));
const safety = setTimeout(() => process.exit(0), 15000);
let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  if (input.startsWith('complete')) {
    clearTimeout(safety);
    process.stdout.write('completed');
  } else {
    fs.writeFileSync(process.argv[2], String(process.pid));
  }
});
`);
  const provider = new CommandProvider({
    id: 'fixture', kind: 'command', executable: process.execPath,
    args: [executable, pidPath, termPath],
  });
  const pid = async () => {
    try { return Number(await readFile(pidPath, 'utf8')); }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return undefined;
      throw error;
    }
  };
  return {
    provider, termPath,
    ready: async () => {
      await waitFor(async () => (await pid()) !== undefined);
      const value = await pid();
      assert.ok(value && Number.isSafeInteger(value) && value > 0);
      return value;
    },
    cleanup: async () => {
      try {
        const value = await pid();
        if (value && isAlive(value)) {
          process.kill(value, 'SIGKILL');
          await waitFor(() => !isAlive(value));
        }
      } finally { await rm(directory, {recursive: true, force: true}); }
    },
  };
}

async function setup(provider?: Provider) {
  const agents = new AgentRegistry();
  agents.register({id: 'chat', name: 'Chat', providerId: provider?.id});
  const providers = new ProviderRegistry();
  if (provider) providers.register(provider);
  const gateway = new AiGateway(new AgentRuntime(agents, new SkillRegistry(), providers));
  await gateway.listen(0);
  const address = gateway.server.address();
  assert.ok(address && typeof address === 'object');
  const base = `http://127.0.0.1:${address.port}`;
  const start = async (prompt: string, path = '/api/analyze') => {
    const response = await fetch(`${base}${path}`, {
      method: 'POST', headers: {'content-type': 'application/json'},
      body: JSON.stringify({agentId: 'chat', prompt}),
    });
    assert.equal(response.status, 202);
    return await response.json() as {sessionId: string};
  };
  const completed = async (id: string) => waitFor(async () => {
    const response = await fetch(`${base}/api/sessions/${id}`);
    const session = await response.json() as {status: string};
    return session.status === 'completed';
  });
  return {gateway, base, start, completed};
}

for (const continued of [false, true]) {
  test(`gateway close reaps a SIGTERM-ignoring ${continued ? 'continued' : 'initial'} command and closes SSE`, {
    skip: process.platform === 'win32', timeout: 10000,
  }, async () => {
    const fixture = await commandFixture();
    const context = await setup(fixture.provider);
    const streamController = new AbortController();
    try {
      let session = await context.start(continued ? 'complete first turn' : 'wait');
      if (continued) {
        await context.completed(session.sessionId);
        session = await context.start('wait', `/api/sessions/${session.sessionId}/continue`);
      }
      const pid = await fixture.ready();
      assert.equal(isAlive(pid), true);
      const stream = await fetch(`${context.base}/api/sessions/${session.sessionId}/stream`, {signal: streamController.signal});
      assert.equal(stream.headers.get('content-type'), 'text/event-stream');
      const ended = stream.text();
      void ended.catch(() => {});
      const closing = context.gateway.close();
      assert.equal(context.gateway.close(), closing, 'running sessions share one shutdown promise');
      await closing;
      assert.equal(isAlive(pid), false, 'close must wait for the owned child to exit and be reaped');
      assert.equal(await readFile(fixture.termPath, 'utf8'), 'received');
      assert.match(await ended, /analysis_started/);
      assert.equal(context.gateway.server.listening, false);
    } finally {
      streamController.abort();
      await fixture.cleanup();
      await context.gateway.close().catch(() => {});
    }
  });
}

test('idle, completed and never-listened gateways close promptly and idempotently', {timeout: 3000}, async () => {
  for (const completed of [false, true]) {
    const context = await setup();
    try {
      if (completed) {
        const session = await context.start('complete');
        await context.completed(session.sessionId);
      }
      const first = context.gateway.close();
      const second = context.gateway.close();
      const results = Promise.allSettled([first, second]);
      assert.equal(first, second, 'concurrent close calls must share shutdown completion');
      assert.deepEqual((await results).map((result) => result.status), ['fulfilled', 'fulfilled']);
      assert.equal(context.gateway.close(), first);
      await context.gateway.close();
      await assert.rejects(context.gateway.listen(0), /shutting down/);
    } finally { await context.gateway.close().catch(() => {}); }
  }
  const gateway = new AiGateway(new AgentRuntime(new AgentRegistry(), new SkillRegistry(), new ProviderRegistry()));
  await gateway.close();
  await gateway.close();
});

test('shutdown is bounded when a provider does not settle on abort', async (t) => {
  let finish: ((response: ProviderResponse) => void) | undefined;
  let reentrantClose: Promise<void> | undefined;
  const context = await setup({id: 'stuck', run: (request) => new Promise((resolve) => {
    finish = resolve;
    request.signal?.addEventListener('abort', () => { reentrantClose = gateway.close(); }, {once: true});
  })});
  const gateway = context.gateway;
  try {
    await context.start('wait');
    assert.ok(finish);
    t.mock.timers.enable({apis: ['setTimeout']});
    const closing = context.gateway.close();
    const rejected = assert.rejects(closing, /AI gateway shutdown timed out/);
    await Promise.resolve();
    assert.equal(reentrantClose, closing, 'abort callbacks must see the same shutdown promise');
    t.mock.timers.tick(5000);
    await rejected;
    assert.equal(context.gateway.close(), closing);
    assert.equal(context.gateway.server.listening, false);
  } finally {
    t.mock.timers.reset();
    finish?.({providerId: 'stuck', output: '', durationMs: 0, cancelled: true});
    await context.gateway.close().catch(() => {});
  }
});

for (const continued of [false, true]) {
  test(`shutdown rejects an in-flight ${continued ? 'continuation' : 'analysis'} body before starting a provider`, {timeout: 3000}, async () => {
    let calls = 0;
    const context = await setup({id: 'counted', run: async () => {
      calls++;
      return {providerId: 'counted', output: 'completed', durationMs: 0};
    }});
    try {
      let path = '/api/analyze';
      if (continued) {
        const session = await context.start('complete');
        await context.completed(session.sessionId);
        path = `/api/sessions/${session.sessionId}/continue`;
      }
      const accepted = new Promise<void>((resolve) => context.gateway.server.once('request', () => resolve()));
      const request = httpRequest(`${context.base}${path}`, {method: 'POST', headers: {'content-type': 'application/json'}});
      const response = new Promise<number | undefined>((resolve, reject) => {
        request.on('error', reject);
        request.on('response', (response) => {
          response.resume();
          response.on('end', () => resolve(response.statusCode));
        });
      });
      request.write('{"agentId":"chat",');
      await accepted;
      const closing = context.gateway.close();
      request.end('"prompt":"must not run"}');
      assert.equal(await response, 503);
      await closing;
      assert.equal(calls, continued ? 1 : 0);
    } finally { await context.gateway.close().catch(() => {}); }
  });
}
