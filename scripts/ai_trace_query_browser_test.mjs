import assert from 'node:assert/strict';
import {AiGateway} from '../ai/dist/src/gateway.js';
import {AgentRuntime} from '../ai/dist/src/runtime.js';
import {AgentRegistry} from '../ai/dist/src/registry.js';
import {ProviderRegistry} from '../ai/dist/src/providers.js';
import {SkillRegistry} from '../ai/dist/src/skills.js';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';

// Deterministic model responses exercise actual browser HTTP/SSE round trips.
const agents = new AgentRegistry();
agents.register({id: 'display-anomaly', name: 'Evidence integration', providerId: 'fixture', skills: ['black-screen-diagnosis']});
const providers = new ProviderRegistry();
const calls = [];
providers.register({id: 'fixture', async run(request) {
  calls.push(request.prompt);
  const matches = [...request.prompt.matchAll(/BEGIN_UNTRUSTED_TRACE_EVIDENCE\n([^\n]*)\nEND_UNTRUSTED_TRACE_EVIDENCE/g)];
  const results = matches.map((match) => JSON.parse(match[1])).filter((item) => item.tool === 'winscope_query_trace');
  let output;
  if (!results.length) output = JSON.stringify({tool: 'winscope_query_trace', arguments: {
    time: '1s', endTime: '3s', limit: 2,
    traceTypes: ['SURFACE_FLINGER', 'WINDOW_MANAGER', 'TRANSACTIONS', 'TRANSITION'], layerId: '42', displayId: '0',
  }});
  else if (results.length === 1) output = JSON.stringify({tool: 'winscope_query_trace', arguments: {
    before: 1, after: 1, limit: 3, traceTypes: ['SURFACE_FLINGER', 'WINDOW_MANAGER'], windowId: 'window-token',
  }});
  else {
    assert.ok(results[0].snapshot.rangeCoverage.some((source) => source.hasMore));
    assert.ok(results[0].snapshot.entries.some((entry) => entry.traceType === 'TRANSACTIONS'));
    assert.ok(results[0].snapshot.entries.some((entry) => entry.traceType === 'TRANSITION'));
    assert.ok(results[1].snapshot.entries.some((entry) => entry.role === 'before'));
    assert.match(request.prompt, /focusedWindow|window-token/);
    assert.match(request.prompt, /"alpha"|"visible"/);
    assert.match(request.prompt, /"clock":\{"domain":"ELAPSED"/);
    output = 'Actual interval, neighboring SF/WM, transaction and transition evidence received. Limited ranges are not complete causal proof.';
  }
  return {providerId: 'fixture', output, durationMs: 0};
}});
const gateway = new AiGateway(new AgentRuntime(agents, new SkillRegistry(), providers));
await gateway.listen(19901);
const root = fileURLToPath(new URL('../', import.meta.url));
try {
  const child = spawn('npx', ['ng', 'test', 'winscope', '--configuration=ci', '--no-watch', '--no-progress',
    '--code-coverage=false', '--main=src/main_diagnostic_http_unit.ts', '--karma-config=karma.config.diagnostic.js'],
  {cwd: root, stdio: 'inherit'});
  const code = await new Promise((resolve, reject) => {child.once('error', reject); child.once('exit', resolve);});
  assert.equal(code, 0, 'browser integration failed');
  assert.equal(calls.length, 3, 'model must receive both real browser query results before its final answer');
  console.log(JSON.stringify({ok: true, transport: 'real-http-sse', providerCalls: calls.length}));
} finally {
  await gateway.close();
}
