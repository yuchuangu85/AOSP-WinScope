import {strict as assert} from 'node:assert';
import {mkdtemp, readFile, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {test} from 'node:test';
import {analyzeDisplayEvidence} from '../evidence';
import {CommandProvider, ProviderRegistry} from '../providers';
import {AgentRegistry} from '../registry';
import {SkillRegistry} from '../skills';
import {AgentRuntime} from '../runtime';

test('deterministic evidence analysis reports black and flicker candidates', () => {
  const result = analyzeDisplayEvidence({
    video: {
      frames: [
        {index: 1, luma: 0.01},
        {index: 2, luma: 0.02},
        {index: 3, luma: 0.8},
      ],
      frameDiffs: [{fromIndex: 2, toIndex: 3, value: 0.8}],
    },
    surfaceFlinger: {},
    windowManager: {displayState: 'on'},
    transactions: {count: 1},
  });
  assert.equal(result.deterministic, true);
  assert.equal(
    result.findings.some((finding) => finding.kind === 'black-screen'),
    true,
  );
  assert.equal(
    result.findings.some((finding) => finding.kind === 'flicker'),
    true,
  );
  assert.equal(result.complete, true);
});

test('external agent and skill manifests are imported', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'winscope-ai-'));
  await writeFile(
    join(dir, 'skill.json'),
    JSON.stringify({
      id: 'custom-skill',
      name: 'Custom',
      kind: 'prompt',
      prompt: 'custom',
    }),
  );
  await writeFile(
    join(dir, 'agent.json'),
    JSON.stringify({
      id: 'custom-agent',
      name: 'Custom agent',
      customSubagents: [{id: 'child-agent', name: 'Child'}],
    }),
  );
  const skills = new SkillRegistry();
  const agents = new AgentRegistry();
  await skills.importPath(dir);
  await agents.importPath(dir);
  assert.equal(skills.get('custom-skill').prompt, 'custom');
  assert.equal(agents.get('child-agent').name, 'Child');
});

test('command provider runs without a shell', async () => {
  const provider = new CommandProvider({
    id: 'test',
    kind: 'command',
    executable: process.execPath,
    args: ['-e', "process.stdin.on('data',()=>process.stdout.write('ok'))"],
  });
  const result = await provider.run({prompt: 'hello'});
  assert.equal(result.output, 'ok');
});

test('agent runtime executes deterministic skills before provider', async () => {
  const agents = new AgentRegistry();
  agents.register({
    id: 'test-agent',
    name: 'Test',
    skills: ['black-screen-diagnosis'],
  });
  const skills = new SkillRegistry();
  const providers = new ProviderRegistry();
  const runtime = new AgentRuntime(agents, skills, providers);
  const result = await runtime.run('test-agent', {
    prompt: 'test',
    evidence: {
      video: {
        frames: [
          {index: 0, luma: 0.01},
          {index: 1, luma: 0.01},
        ],
      },
    },
  });
  assert.equal(result.skillResults.length, 1);
  assert.equal(result.provider, undefined);
});

test('labelled black-screen and flicker fixtures retain expected evidence boundaries', async () => {
  for (const fixtureName of ['black-screen.json', 'flicker.json']) {
    const fixture = JSON.parse(
      await readFile(
        resolve(__dirname, '../../../fixtures', fixtureName),
        'utf8',
      ),
    ) as {
      evidence: Parameters<typeof analyzeDisplayEvidence>[0];
      expected: {findingKinds: string[]; complete: boolean};
    };
    const result = analyzeDisplayEvidence(fixture.evidence);
    assert.equal(result.complete, fixture.expected.complete);
    assert.deepEqual(
      [...new Set(result.findings.map((finding) => finding.kind))].sort(),
      fixture.expected.findingKinds.sort(),
    );
  }
});

test('command provider applies configured model and reasoning arguments, not shell text', async () => {
  const provider = new CommandProvider({
    id: 'selectable', kind: 'command', executable: process.execPath,
    args: ['-e', 'let input="";process.stdin.on("data",c=>input+=c);process.stdin.on("end",()=>process.stdout.write(JSON.stringify({args:process.argv.slice(1),input})))', '--'],
    modelArgs: ['--model', '{{model}}'], reasoningArgs: ['--effort', '{{level}}'],
  });
  const result = await provider.run({prompt: 'follow-up', modelId: 'test-model', reasoningLevel: 'high', history: [{role: 'assistant', content: 'earlier answer'}]});
  const output = JSON.parse(result.output);
  assert.deepEqual(output.args, ['--model', 'test-model', '--effort', 'high']);
  assert.match(output.input, /earlier answer/);
  assert.match(output.input, /follow-up/);
});

test('already cancelled provider requests do not spawn processes', async () => {
  const controller = new AbortController();
  controller.abort();
  const provider = new CommandProvider({id: 'cancelled', kind: 'command', executable: '/must/not/spawn'});
  assert.throws(() => provider.run({prompt: 'x', signal: controller.signal}), /abort/i);
});
