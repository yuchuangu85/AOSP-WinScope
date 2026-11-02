import {strict as assert} from 'node:assert';
import {createServer} from 'node:http';
import {test} from 'node:test';
import {CommandProvider, OpenAICompatibleProvider, createDefaultProviderRegistry} from '../providers';

test('OpenAI-compatible requests use selected model, supported effort and chat history', async () => {
  let captured: Record<string, unknown> | undefined;
  const server = createServer(async (request, response) => {
    const chunks = [];
    for await (const chunk of request) chunks.push(Buffer.from(chunk));
    captured = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    response.setHeader('content-type', 'application/json');
    response.end(JSON.stringify({choices: [{message: {content: 'answer'}}]}));
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  assert.ok(address && typeof address === 'object');
  try {
    const provider = new OpenAICompatibleProvider({id: 'local', kind: 'openai-compatible', baseUrl: `http://127.0.0.1:${address.port}/v1`, model: 'configured', reasoningLevels: ['low', 'high']});
    const result = await provider.run({prompt: 'current', modelId: 'chosen', reasoningLevel: 'high', history: [{role: 'user', content: 'earlier'}, {role: 'assistant', content: 'previous answer'}]});
    assert.equal(result.output, 'answer');
    assert.deepEqual(captured, {model: 'chosen', reasoning_effort: 'high', messages: [{role: 'user', content: 'earlier'}, {role: 'assistant', content: 'previous answer'}, {role: 'user', content: 'current'}]});
    await assert.rejects(provider.run({prompt: 'x', reasoningLevel: 'medium'}), /does not support/);
  } finally {
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
});

test('built-in model catalogs expose real selection capabilities without credentials', () => {
  const catalog = createDefaultProviderRegistry().list();
  assert.equal(catalog.find((provider) => provider.id === 'codex')?.supportsCustomModel, true);
  assert.deepEqual(catalog.find((provider) => provider.id === 'codex')?.reasoningLevels, ['low', 'medium', 'high']);
  assert.ok(catalog.find((provider) => provider.id === 'claude')?.models.some((model) => model.id === 'sonnet'));
  assert.deepEqual(catalog.find((provider) => provider.id === 'ds')?.reasoningLevels, []);
  assert.equal(catalog.find((provider) => provider.id === 'codex')?.configuration?.apiKeyEnv, 'OPENAI_API_KEY');
  assert.equal(catalog.find((provider) => provider.id === 'codex')?.configured, false);
  assert.equal(catalog.find((provider) => provider.id === 'claude')?.configured, false);
  assert.equal(catalog.find((provider) => provider.id === 'ds')?.configuration, undefined);
  assert.equal(catalog.find((provider) => provider.id === 'codex')?.localConfig, undefined);
});

test('command descriptors project only safe local metadata, not raw configuration or keys', () => {
  const localConfig = {
    baseUrl: 'https://url-user:URL_PASSWORD@api.example/api/v1?key=QUERY_SECRET#FRAGMENT_SECRET',
    providerName: 'Local Gateway',
    authentication: 'configured' as const,
    reasoningLevel: 'high' as const,
    apiKey: 'RAW_SECRET',
    env: {OPENAI_API_KEY: 'RAW_SECRET'},
    rawConfig: {password: 'RAW_SECRET'},
  };
  const provider = new CommandProvider({
    id: 'metadata', kind: 'command', executable: '/private/command',
    env: {OPENAI_API_KEY: 'RAW_SECRET'}, cwd: '/private/home',
    defaultModelId: 'configured', importedFrom: 'Local configuration',
    localConfig,
  });
  assert.deepEqual(provider.descriptor.localConfig, {
    baseUrl: 'https://api.example/api/v1', providerName: 'Local Gateway',
    authentication: 'configured', reasoningLevel: 'high',
  });
  assert.equal(provider.descriptor.defaultModelId, 'configured');
  assert.equal(provider.descriptor.importedFrom, 'Local configuration');
  assert.doesNotMatch(JSON.stringify(provider.descriptor), /SECRET|URL_PASSWORD|url-user|apiKey|OPENAI_API_KEY|rawConfig|executable|private|cwd/);
  localConfig.providerName = 'Mutated Gateway';
  assert.equal(provider.descriptor.localConfig?.providerName, 'Local Gateway');
});

test('local metadata URLs retain safe routes and omit unsafe protocols, paths and oversized input', () => {
  const cases: Array<[string, string | undefined]> = [
    ['https://api.example/v1', 'https://api.example/v1'],
    ['http://user:URL_PASSWORD@[::1]:8080/api/v1?key=QUERY_SECRET#FRAGMENT_SECRET', 'http://[::1]:8080/api/v1'],
    ['https://api.example/v1/sk-short-secret', 'https://api.example/'],
    ['https://api.example/v1/prefix.sk-short', 'https://api.example/'],
    ['https://api.example/SECRET_TOKEN/v1', 'https://api.example/'],
    ['https://api.example/v1/%73k-SECRET', 'https://api.example/'],
    ['https://api.example/v1/abcdefghijklmnopqrstuvwxyz123456', 'https://api.example/'],
    ['https://api.example/v1/abcdef0123456789', 'https://api.example/'],
    ['https://api.example/v1/eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMifQ.signature', 'https://api.example/'],
    ['file:///private/SECRET', undefined],
    ['javascript:alert(1)', undefined],
    ['ftp://api.example/v1', undefined],
    ['not a URL SECRET', undefined],
    ['https://api.example/v1?key=' + 'x'.repeat(2048), undefined],
    ['https://api.example/v1\nSECRET', undefined],
  ];
  for (const [baseUrl, expected] of cases) {
    const provider = new CommandProvider({
      id: 'metadata', kind: 'command', executable: 'unused',
      localConfig: {authentication: 'cli-managed', baseUrl},
    });
    assert.deepEqual(provider.descriptor.localConfig, {
      authentication: 'cli-managed', ...(expected ? {baseUrl: expected} : {}),
    });
  }
});

test('local metadata omits credential-like, control-character and oversized provider names', () => {
  for (const providerName of ['Gateway sk-short', 'Bearer abc', 'SECRET_TOKEN', 'Gateway\nprivate', 'x'.repeat(129)]) {
    const provider = new CommandProvider({
      id: 'metadata', kind: 'command', executable: 'unused',
      localConfig: {authentication: 'cli-managed', providerName},
    });
    assert.deepEqual(provider.descriptor.localConfig, {authentication: 'cli-managed'});
  }
});

test('per-model effort overrides provider defaults in command execution', async () => {
  const {CommandProvider} = await import('../providers');
  const provider = new CommandProvider({
    id: 'model-effort', kind: 'command', executable: process.execPath,
    args: ['-e', 'process.stdin.resume();process.stdin.on("end",()=>process.stdout.write(JSON.stringify(process.argv.slice(1))))', '--'],
    models: [{id: 'special', name: 'Special', levels: ['high']}],
    modelArgs: ['--model', '{{model}}'], reasoningArgs: ['--effort', '{{level}}'], reasoningLevels: ['low'],
  });
  const result = await provider.run({prompt: 'x', modelId: 'special', reasoningLevel: 'high'});
  assert.deepEqual(JSON.parse(result.output), ['--model', 'special', '--effort', 'high']);
  assert.throws(() => provider.run({prompt: 'x', modelId: 'special', reasoningLevel: 'low'}), /does not support/);
});

test('configured default model preserves per-model effort through OpenAI execution', async () => {
  let captured: Record<string, unknown> | undefined;
  const server = createServer(async (request, response) => {
    const chunks = [];
    for await (const chunk of request) chunks.push(Buffer.from(chunk));
    captured = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    response.end(JSON.stringify({choices: [{message: {content: 'answer'}}]}));
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  assert.ok(address && typeof address === 'object');
  try {
    const provider = new OpenAICompatibleProvider({
      id: 'effort', kind: 'openai-compatible', baseUrl: `http://127.0.0.1:${address.port}`, model: 'special',
      models: [{id: 'special', name: 'Special', levels: ['high']}], reasoningLevels: ['low'],
    });
    assert.deepEqual(provider.descriptor.models[0].levels, ['high']);
    await provider.run({prompt: 'x', modelId: 'default', reasoningLevel: 'high'});
    assert.equal(captured?.model, 'special');
    assert.equal(captured?.reasoning_effort, 'high');
    await assert.rejects(provider.run({prompt: 'x', modelId: 'special', reasoningLevel: 'low'}), /does not support/);
  } finally { await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve())); }
});
