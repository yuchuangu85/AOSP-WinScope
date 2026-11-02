import {spawn} from 'node:child_process';
import {mkdtemp, writeFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createServer} from 'node:net';

const reservation = createServer();
await new Promise((resolve) => reservation.listen(0, '127.0.0.1', resolve));
const port = reservation.address().port;
await new Promise((resolve) => reservation.close(resolve));
const temp = await mkdtemp(join(tmpdir(), 'winscope-ai-e2e-'));
const agentDir = join(temp, 'agents');
await import('node:fs/promises').then(({mkdir}) => mkdir(agentDir));
await writeFile(join(agentDir, 'agent.json'), JSON.stringify({id: 'e2e-agent', name: 'E2E deterministic agent', skills: ['black-screen-diagnosis']}));
await writeFile(join(temp, 'config.json'), JSON.stringify({agentPaths: [agentDir]}));
const child = spawn(process.execPath, ['ai/dist/src/cli.js', 'serve', '--port', String(port), '--config', join(temp, 'config.json')], {stdio: ['ignore', 'ignore', 'pipe']});
try {
  const deadline = Date.now() + 15_000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) throw new Error(`gateway exited before startup (${child.exitCode})`);
    try { if ((await fetch(`http://127.0.0.1:${port}/health`)).ok) break; } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  const start = await fetch(`http://127.0.0.1:${port}/api/analyze`, {method: 'POST', headers: {'content-type': 'application/json'}, body: JSON.stringify({agentId: 'e2e-agent', prompt: 'fixture', evidence: {video: {frames: [{index: 0, luma: 0.01}, {index: 1, luma: 0.01}]}}})});
  if (start.status !== 202) throw new Error(`analysis start failed: ${start.status}`);
  const {sessionId} = await start.json();
  let status = 'running';
  for (let i = 0; i < 50 && status === 'running'; i++) { await new Promise((resolve) => setTimeout(resolve, 50)); status = (await (await fetch(`http://127.0.0.1:${port}/api/sessions/${sessionId}`)).json()).status; }
  if (status !== 'completed') throw new Error(`analysis status = ${status}`);
  const report = await fetch(`http://127.0.0.1:${port}/api/sessions/${sessionId}/report?format=html`);
  if (!report.ok || !(await report.text()).includes('Winscope AI Analysis')) throw new Error('report export failed');
  console.log(JSON.stringify({ok: true, sessionId, status}));
} finally {
  const exited = child.exitCode !== null ? Promise.resolve() : new Promise((resolve) => child.once('close', resolve));
  child.kill('SIGTERM');
  await exited;
  await rm(temp, {recursive: true, force: true});
}
