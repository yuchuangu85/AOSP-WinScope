import {strict as assert} from 'node:assert';
import {
  chmod,
  copyFile,
  mkdir,
  mkdtemp,
  readFile,
  realpath,
  rm,
  writeFile,
} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join, relative} from 'node:path';
import {test} from 'node:test';
import {importLocalProvider, isModelId} from '../local_config';
import {AiGateway} from '../gateway';
import {CommandProvider, createDefaultProviderRegistry} from '../providers';
import {AgentRegistry} from '../registry';
import {AgentRuntime} from '../runtime';
import {SkillRegistry} from '../skills';
import {AiSelection, ProviderDescriptor} from '../types';

async function fixture(
  options: {
    failure?: boolean;
    hang?: boolean;
    holdPipes?: boolean;
    codexConfig?: Record<string, unknown>;
    claudeSettings?: Record<string, unknown>;
  } = {},
) {
  const home = await mkdtemp(join(tmpdir(), 'winscope-config-'));
  await mkdir(join(home, '.codex'));
  await mkdir(join(home, '.claude'));
  await writeFile(join(home, '.codex/config.toml'), 'model = "custom/codex"\n');
  const codexConfig = options.codexConfig ?? {
    model: 'custom/codex',
    model_provider: 'fixture',
    model_reasoning_effort: 'high',
    model_providers: {
      fixture: {
        name: 'Fixture Gateway',
        base_url: 'https://url-user:URL_PASSWORD@codex.example/v1?api_key=QUERY_SECRET#FRAGMENT_SECRET',
        env_key: 'WINSCOPE_TEST_PROVIDER_KEY',
        experimental_bearer_token: 'SECRET_TOKEN',
        http_headers: {Authorization: 'Bearer SECRET_TOKEN'},
      },
    },
    secret: 'SECRET_TOKEN',
  };
  const settings = options.claudeSettings ?? {
    model: 'custom/claude[1m]',
    effortLevel: 'medium',
    env: {
      ANTHROPIC_AUTH_TOKEN: 'SECRET_TOKEN',
      ANTHROPIC_BASE_URL: 'https://url-user:URL_PASSWORD@claude.example/api/v1?api_key=QUERY_SECRET#FRAGMENT_SECRET',
      ANTHROPIC_DEFAULT_OPUS_MODEL: 'custom/opus',
      ANTHROPIC_DEFAULT_OPUS_MODEL_NAME: 'Configured Opus',
    },
    modelPicker: {
      options: [
        {model: 'custom/second[1m]', label: 'Second model'},
        {model: 'custom/claude[1m]', label: 'Configured Claude'},
        {model: '--invalid'},
      ],
    },
  };
  await writeFile(
    join(home, '.claude/settings.json'),
    JSON.stringify(settings),
  );
  const executable = join(home, 'local-ai');
  await writeFile(
    executable,
    `#!${process.execPath}
const readline = require('node:readline');
if (process.argv[2] === 'app-server') {
  if (${Boolean(options.holdPipes)}) {
    const child=require('node:child_process').spawn(process.execPath,['-e','process.on("SIGTERM",()=>{});setInterval(()=>{},1000)'],{stdio:['ignore',process.stdout,process.stderr]});
    require('node:fs').writeFileSync(${JSON.stringify(join(home, 'descendant.pid'))},String(child.pid));
  }
  readline.createInterface({input:process.stdin}).on('line', line => {
    const m=JSON.parse(line);
    if (${Boolean(options.hang || options.holdPipes)}) return;
    if (m.id === undefined) return;
    let result;
    if(m.method==='initialize') result={serverInfo:{name:'fixture'}};
    if(m.method==='config/read') result={config:${JSON.stringify(codexConfig)}};
    if(m.method==='model/list') result=m.params.cursor ? {data:[{model:'custom/second',displayName:'Second Codex',supportedReasoningEfforts:[{reasoningEffort:'high'}]}],nextCursor:null} : {data:[{model:'custom/codex',displayName:'Configured Codex',supportedReasoningEfforts:[{reasoningEffort:'low'},{reasoningEffort:'high'},{reasoningEffort:'xhigh'}]},{model:'hidden',hidden:true},{model:'bad model'}],nextCursor:'page-2'};
    console.log(JSON.stringify(${Boolean(options.failure)} ? {id:m.id,error:{message:'SECRET_TOKEN private details'}} : {id:m.id,result}));
  });
} else {
  let input='';process.stdin.setEncoding('utf8');process.stdin.on('data',s=>input+=s);process.stdin.on('end',()=>console.log(JSON.stringify({args:process.argv.slice(2),input,cwd:process.cwd(),codexHome:process.env.CODEX_HOME,claudeHome:process.env.CLAUDE_CONFIG_DIR})));
}
`,
  );
  await chmod(executable, 0o700);
  const windowsNpm = join(home, 'AppData', 'Roaming', 'npm');
  await mkdir(windowsNpm, {recursive: true});
  const shim = process.platform === 'win32'
    ? `@echo off\r\n"${process.execPath}" "${executable}" %*\r\n`
    : `#!/bin/sh\nexec ${JSON.stringify(process.execPath)} ${JSON.stringify(executable)} "$@"\n`;
  for (const id of ['codex', 'claude']) {
    const shimPath = join(windowsNpm, `${id}.cmd`);
    await writeFile(shimPath, shim);
    await chmod(shimPath, 0o700);
  }
  return {
    home,
    windowsNpm,
    windowsShim: join(windowsNpm, 'codex.cmd'),
    options: {
      home,
      env: {
        ...process.env,
        ANTHROPIC_MODEL: undefined,
        ANTHROPIC_BASE_URL: undefined,
        ANTHROPIC_API_KEY: undefined,
        ANTHROPIC_AUTH_TOKEN: undefined,
        OPENAI_API_KEY: undefined,
        CODEX_API_KEY: undefined,
        WINSCOPE_TEST_PROVIDER_KEY: undefined,
        CODEX_HOME: undefined,
        CLAUDE_CONFIG_DIR: undefined,
      },
      executables: {codex: executable, claude: executable},
    },
    cleanup: () => rm(home, {recursive: true, force: true}),
  };
}

test('Codex imports effective config and paginated models through read-only structured RPC', async () => {
  const context = await fixture();
  try {
    const provider = await importLocalProvider('codex', context.options);
    const descriptor = provider.descriptor;
    assert.equal(descriptor.defaultModelId, 'custom/codex');
    assert.equal(descriptor.importedFrom, 'Codex local configuration');
    assert.deepEqual(descriptor.localConfig, {
      baseUrl: 'https://codex.example/v1',
      providerName: 'Fixture Gateway',
      authentication: 'configured',
      reasoningLevel: 'high',
    });
    assert.deepEqual(
      descriptor.models.map((model) => model.id),
      ['default', 'custom/codex', 'custom/second'],
    );
    assert.deepEqual(descriptor.models[1].levels, ['low', 'high']);
    assert.doesNotMatch(
      JSON.stringify(descriptor),
      /SECRET_TOKEN|URL_PASSWORD|QUERY_SECRET|FRAGMENT_SECRET|url-user|env_key|http_headers|experimental_bearer_token|codexHome|executable/,
    );
    const result = JSON.parse(
      (
        await provider.run({
          prompt: 'test',
          modelId: 'custom/second',
          reasoningLevel: 'high',
        })
      ).output,
    );
    assert.deepEqual(result.args, [
      'exec',
      '--sandbox',
      'read-only',
      '--ephemeral',
      '--color',
      'never',
      '--skip-git-repo-check',
      '--model',
      'custom/second',
      '-c',
      'model_reasoning_effort="high"',
    ]);
    assert.equal(result.codexHome, join(context.home, '.codex'));
    assert.equal(result.cwd, await realpath(context.home));
  } finally {
    await context.cleanup();
  }
});

test('Windows discovers npm .cmd shims and runs imported providers', async () => {
  const context = await fixture();
  try {
    const env = {...context.options.env, PATH: ''};
    const codex = await importLocalProvider('codex', {
      home: context.home,
      env,
      platform: 'win32',
    });
    const claude = await importLocalProvider('claude', {
      home: context.home,
      env,
      platform: 'win32',
    });
    assert.equal(codex.descriptor.defaultModelId, 'custom/codex');
    assert.equal(claude.descriptor.defaultModelId, 'custom/claude[1m]');
    const result = JSON.parse((await codex.run({prompt: 'windows shim'})).output);
    assert.equal(result.codexHome, join(context.home, '.codex'));
  } finally {
    await context.cleanup();
  }
});

test('Claude imports configured default, aliases and custom picker without exposing credentials', async () => {
  const context = await fixture();
  try {
    const provider = await importLocalProvider('claude', context.options);
    assert.equal(provider.descriptor.defaultModelId, 'custom/claude[1m]');
    assert.deepEqual(provider.descriptor.localConfig, {
      baseUrl: 'https://claude.example/api/v1',
      providerName: 'Claude',
      authentication: 'configured',
      reasoningLevel: 'medium',
    });
    assert.equal(
      provider.descriptor.models.find((model) => model.id === 'custom/opus')
        ?.name,
      'Configured Opus',
    );
    assert.equal(
      provider.descriptor.models.find(
        (model) => model.id === 'custom/claude[1m]',
      )?.name,
      'Configured Claude',
    );
    assert.ok(
      provider.descriptor.models.some(
        (model) => model.id === 'custom/second[1m]',
      ),
    );
    assert.ok(
      !provider.descriptor.models.some((model) => model.id === '--invalid'),
    );
    assert.doesNotMatch(
      JSON.stringify(provider.descriptor),
      /SECRET_TOKEN|URL_PASSWORD|QUERY_SECRET|FRAGMENT_SECRET|url-user/,
    );
    const result = JSON.parse(
      (
        await provider.run({
          prompt: 'test',
          modelId: 'custom/claude[1m]',
          reasoningLevel: 'high',
        })
      ).output,
    );
    assert.deepEqual(result.args.slice(-4), [
      '--model',
      'custom/claude[1m]',
      '--effort',
      'high',
    ]);
    assert.equal(result.claudeHome, join(context.home, '.claude'));
    assert.equal(result.cwd, await realpath(context.home));
    const override = await importLocalProvider('claude', {
      ...context.options,
      env: {...context.options.env, ANTHROPIC_MODEL: 'override-model'},
    });
    assert.equal(override.descriptor.defaultModelId, 'override-model');
  } finally {
    await context.cleanup();
  }
});

test('Codex metadata counts only selected provider credentials and supported effort', async () => {
  const cases: Array<{
    config: Record<string, unknown>;
    env?: NodeJS.ProcessEnv;
    authentication: 'configured' | 'cli-managed';
    providerName?: string;
    reasoningLevel?: 'low' | 'medium' | 'high';
  }> = [
    {config: {}, authentication: 'cli-managed', providerName: 'openai'},
    {config: {}, env: {OPENAI_API_KEY: 'SECRET_TOKEN'}, authentication: 'configured', providerName: 'openai'},
    {config: {model_provider: 'fixture', model_providers: {fixture: {env_key: 'WINSCOPE_TEST_PROVIDER_KEY'}}}, env: {WINSCOPE_TEST_PROVIDER_KEY: 'SECRET_TOKEN'}, authentication: 'configured', providerName: 'fixture'},
    {config: {model_provider: 'fixture', model_providers: {fixture: {env_key: 'WINSCOPE_TEST_PROVIDER_KEY'}}}, env: {WINSCOPE_TEST_PROVIDER_KEY: '  ', OPENAI_API_KEY: 'UNRELATED_SECRET'}, authentication: 'cli-managed', providerName: 'fixture'},
    {config: {model_provider: 'fixture', model_providers: {fixture: {}, other: {experimental_bearer_token: 'SECRET_TOKEN'}}}, env: {ANTHROPIC_API_KEY: 'UNRELATED_SECRET'}, authentication: 'cli-managed', providerName: 'fixture'},
    {config: {model_provider: 'fixture', model_providers: {fixture: {experimental_bearer_token: 'SECRET_TOKEN'}}, model_reasoning_effort: 'low'}, authentication: 'configured', providerName: 'fixture', reasoningLevel: 'low'},
    {config: {model_provider: 'fixture', model_providers: {fixture: {requires_openai_auth: true}}, model_reasoning_effort: 'medium'}, env: {OPENAI_API_KEY: 'SECRET_TOKEN'}, authentication: 'configured', providerName: 'fixture', reasoningLevel: 'medium'},
    {config: {model_provider: 'fixture', model_providers: {fixture: {experimental_bearer_token: '  ', api_key: 'SECRET_TOKEN', name: 'Bearer sk-SECRET_TOKEN'}}, model_reasoning_effort: 'xhigh'}, authentication: 'cli-managed', providerName: 'fixture'},
    {config: {model_provider: 'sk-SECRET_TOKEN', model_providers: {}, model_reasoning_effort: {secret: 'SECRET_TOKEN'}}, authentication: 'cli-managed'},
  ];
  for (const item of cases) {
    const context = await fixture({codexConfig: item.config});
    try {
      const provider = await importLocalProvider('codex', {
        ...context.options,
        env: {...context.options.env, ...item.env},
      });
      assert.deepEqual(provider.descriptor.localConfig, {
        authentication: item.authentication,
        ...(item.providerName ? {providerName: item.providerName} : {}),
        ...(item.reasoningLevel ? {reasoningLevel: item.reasoningLevel} : {}),
      });
      assert.doesNotMatch(JSON.stringify(provider.descriptor), /SECRET_TOKEN|UNRELATED_SECRET|env_key|api_key|experimental_bearer_token/);
    } finally {
      await context.cleanup();
    }
  }
});

test('Claude metadata follows merged environment and never mistakes CLI-managed auth for missing login', async () => {
  const context = await fixture();
  try {
    const provider = await importLocalProvider('claude', {
      ...context.options,
      env: {
        ...context.options.env,
        ANTHROPIC_BASE_URL: 'http://url-user:URL_PASSWORD@127.0.0.1:8080/v1?token=QUERY_SECRET#FRAGMENT_SECRET',
        ANTHROPIC_AUTH_TOKEN: '  ',
        ANTHROPIC_API_KEY: 'ENV_SECRET',
      },
    });
    assert.deepEqual(provider.descriptor.localConfig, {
      authentication: 'configured',
      providerName: 'Claude',
      baseUrl: 'http://127.0.0.1:8080/v1',
      reasoningLevel: 'medium',
    });
    assert.equal(provider.descriptor.configuration?.apiKeyEnv, 'ANTHROPIC_API_KEY');
    assert.doesNotMatch(JSON.stringify(provider.descriptor), /SECRET|url-user/);
    for (const effortLevel of ['low', 'medium', 'high', 'max', null, {secret: 'SECRET_TOKEN'}]) {
      await writeFile(join(context.home, '.claude/settings.json'), JSON.stringify({
        effortLevel,
        env: {ANTHROPIC_AUTH_TOKEN: 'SETTINGS_SECRET', ANTHROPIC_API_KEY: 'SETTINGS_SECRET'},
      }));
      const cliManaged = await importLocalProvider('claude', {
        ...context.options,
        env: {...context.options.env, ANTHROPIC_AUTH_TOKEN: '', ANTHROPIC_API_KEY: '  '},
      });
      assert.deepEqual(cliManaged.descriptor.localConfig, {
        authentication: 'cli-managed',
        providerName: 'Claude',
        ...(typeof effortLevel === 'string' && ['low', 'medium', 'high'].includes(effortLevel) ? {reasoningLevel: effortLevel} : {}),
      });
      assert.doesNotMatch(JSON.stringify(cliManaged.descriptor), /SECRET|ANTHROPIC_/);
    }
    await writeFile(join(context.home, '.claude/settings.json'), JSON.stringify({env: {ANTHROPIC_API_KEY: 'SETTINGS_SECRET'}}));
    const apiKey = await importLocalProvider('claude', context.options);
    assert.equal(apiKey.descriptor.localConfig?.authentication, 'configured');
    await writeFile(join(context.home, '.claude/settings.json'), '{}');
    const cliManaged = await importLocalProvider('claude', context.options);
    assert.deepEqual(cliManaged.descriptor.localConfig, {authentication: 'cli-managed', providerName: 'Claude'});
  } finally {
    await context.cleanup();
  }
});

test('local config overrides respect CODEX_HOME/CLAUDE_CONFIG_DIR and errors never echo file content', async () => {
  const context = await fixture();
  try {
    const env = {
      ...context.options.env,
      CODEX_HOME: join(context.home, 'missing'),
      CLAUDE_CONFIG_DIR: join(context.home, 'other'),
    };
    await assert.rejects(
      importLocalProvider('codex', {...context.options, env}),
      /configuration was not found/,
    );
    await mkdir(env.CLAUDE_CONFIG_DIR);
    await writeFile(
      join(env.CLAUDE_CONFIG_DIR, 'settings.json'),
      '{"secret":"SECRET_TOKEN", invalid',
    );
    await assert.rejects(
      importLocalProvider('claude', {...context.options, env}),
      {message: 'Claude configuration is invalid or unreadable.'},
    );
    await writeFile(
      join(env.CLAUDE_CONFIG_DIR, 'settings.json'),
      JSON.stringify({model: 'alternative[1m]'}),
    );
    const provider = await importLocalProvider('claude', {
      ...context.options,
      env,
    });
    assert.equal(provider.descriptor.defaultModelId, 'alternative[1m]');
  } finally {
    await context.cleanup();
  }
});

test('Codex failures and timeouts are bounded, redacted and dispose their child process', async () => {
  for (const mode of [{failure: true}, {hang: true}]) {
    const context = await fixture(mode);
    try {
      await assert.rejects(
        importLocalProvider('codex', {...context.options, timeoutMs: 150}),
        (error: Error) => {
          assert.doesNotMatch(error.message, /SECRET_TOKEN|private details/);
          assert.match(error.message, /could not be read|timed out/);
          return true;
        },
      );
    } finally {
      await context.cleanup();
    }
  }
});

test('gateway import refreshes providers, executes the selected model, preserves sessions and retries safely', async () => {
  const context = await fixture();
  const registry = createDefaultProviderRegistry();
  const gateway = new AiGateway(
    new AgentRuntime(new AgentRegistry(), new SkillRegistry(), registry),
    context.options,
  );
  await gateway.listen(0);
  const address = gateway.server.address();
  assert.ok(address && typeof address === 'object');
  const base = `http://127.0.0.1:${address.port}`;
  const post = (path: string, body: unknown, headers = {}) =>
    fetch(`${base}${path}`, {
      method: 'POST',
      headers: {'content-type': 'application/json', ...headers},
      body: JSON.stringify(body),
    });
  try {
    for (const body of [
      {providerId: 'other'},
      {providerId: 'codex', path: '/etc/passwd'},
      {providerId: 'claude', executable: '/bin/sh'},
      {providerId: 'claude', env: {ANTHROPIC_API_KEY: 'SECRET_TOKEN'}},
      {},
    ]) {
      const response = await post('/api/providers/import-local', body);
      assert.equal(response.status, 400);
      await response.text();
    }
    const blocked = await post(
      '/api/providers/import-local',
      {providerId: 'claude'},
      {origin: 'https://attacker.invalid'},
    );
    assert.equal(blocked.status, 403);
    await blocked.text();
    const listed = await post('/api/providers/list-models', {providerId: 'codex'});
    assert.equal(listed.status, 200);
    const listedDescriptor = JSON.parse(await listed.text()).provider as ProviderDescriptor;
    assert.equal(listedDescriptor.id, 'codex');
    assert.ok(listedDescriptor.models.some((model) => model.id === 'custom/codex'));

    const imported = new Map<string, ProviderDescriptor>();
    for (const providerId of ['codex', 'claude']) {
      const response = await post('/api/providers/import-local', {providerId});
      assert.equal(response.status, 200);
      const text = await response.text();
      assert.doesNotMatch(text, /SECRET_TOKEN|URL_PASSWORD|QUERY_SECRET|FRAGMENT_SECRET|url-user|executable|env_key|http_headers|experimental_bearer_token/);
      const descriptor = JSON.parse(text).provider as ProviderDescriptor;
      assert.equal(descriptor.id, providerId);
      assert.deepEqual(descriptor.localConfig, providerId === 'codex' ? {
        authentication: 'configured', providerName: 'Fixture Gateway', baseUrl: 'https://codex.example/v1', reasoningLevel: 'high',
      } : {
        authentication: 'configured', providerName: 'Claude', baseUrl: 'https://claude.example/api/v1', reasoningLevel: 'medium',
      });
      imported.set(providerId, descriptor);
    }
    const list = (await (await fetch(`${base}/api/providers`)).json()) as {
      providers: ProviderDescriptor[];
    };
    for (const [id, descriptor] of imported)
      assert.deepEqual(list.providers.find((provider) => provider.id === id), descriptor);
    assert.doesNotMatch(JSON.stringify(list), /SECRET_TOKEN|URL_PASSWORD|QUERY_SECRET|FRAGMENT_SECRET|url-user|executable|env_key|http_headers|experimental_bearer_token/);
    assert.ok(
      list.providers
        .find((provider) => provider.id === 'claude')
        ?.models.some((model) => model.id === 'custom/claude[1m]'),
    );
    const start = await post('/api/analyze', {
      prompt: 'fixture prompt',
      providerId: 'claude',
      modelId: 'custom/claude[1m]',
      reasoningLevel: 'high',
    });
    assert.equal(start.status, 202);
    const summary = (await start.json()) as {sessionId: string};
    let detail: {status: string; result?: {provider: {output: string}}} = {
      status: 'running',
    };
    for (let i = 0; i < 100 && detail.status === 'running'; i++) {
      await new Promise((resolve) => setTimeout(resolve, 10));
      detail = (await (
        await fetch(`${base}/api/sessions/${summary.sessionId}`)
      ).json()) as typeof detail;
    }
    assert.equal(detail.status, 'completed');
    assert.deepEqual(
      JSON.parse(detail.result!.provider.output).args.slice(-4),
      ['--model', 'custom/claude[1m]', '--effort', 'high'],
    );
    const before = registry.get('claude');
    await writeFile(
      join(context.home, '.claude/settings.json'),
      '{ invalid SECRET_TOKEN',
    );
    const failed = await post('/api/providers/import-local', {
      providerId: 'claude',
    });
    assert.equal(failed.status, 422);
    assert.doesNotMatch(await failed.text(), /SECRET_TOKEN/);
    assert.equal(registry.get('claude'), before);
    await writeFile(
      join(context.home, '.claude/settings.json'),
      JSON.stringify({model: 'changed-model'}),
    );
    const retry = await post('/api/providers/import-local', {
      providerId: 'claude',
    });
    assert.equal(retry.status, 200);
    assert.equal(
      ((await retry.json()) as {provider: {defaultModelId: string}}).provider
        .defaultModelId,
      'changed-model',
    );
    assert.equal(
      (
        (await (await fetch(`${base}/api/sessions`)).json()) as {
          sessions: unknown[];
        }
      ).sessions.length,
      1,
    );
  } finally {
    await gateway.close();
    await context.cleanup();
  }
});

test('model identifiers admit provider namespaces/context suffixes but reject shell syntax', () => {
  for (const id of ['free/claude-opus[1m]', 'model:latest', 'team@model'])
    assert.ok(isModelId(id), id);
  for (const id of [
    '--flag',
    'model x',
    'model;echo',
    '$(id)',
    '',
    'x'.repeat(129),
  ])
    assert.ok(!isModelId(id), id);
});

test('gateway serializes imports and blocks starting turns while their provider is being refreshed', async () => {
  const context = await fixture({hang: true});
  const gateway = new AiGateway(
    new AgentRuntime(
      new AgentRegistry(),
      new SkillRegistry(),
      createDefaultProviderRegistry(),
    ),
    {...context.options, timeoutMs: 300},
  );
  await gateway.listen(0);
  const address = gateway.server.address();
  assert.ok(address && typeof address === 'object');
  const base = `http://127.0.0.1:${address.port}`;
  const post = (path: string, body: unknown) =>
    fetch(`${base}${path}`, {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(body),
    });
  try {
    const pending = post('/api/providers/import-local', {providerId: 'codex'});
    await new Promise((resolve) => setTimeout(resolve, 50));
    const duplicate = await post('/api/providers/import-local', {
      providerId: 'codex',
    });
    assert.equal(duplicate.status, 409);
    await duplicate.text();
    const save = await post('/api/settings', {selection: {agentId: 'display-anomaly', providerId: 'codex', modelId: 'default', customModel: '', reasoningLevel: 'medium'}});
    assert.equal(save.status, 409);
    await save.text();
    const start = await post('/api/analyze', {
      providerId: 'codex',
      prompt: 'must not start',
    });
    assert.equal(start.status, 409);
    await start.text();
    const first = await pending;
    assert.equal(first.status, 422);
    await first.text();
    const retry = await post('/api/providers/import-local', {
      providerId: 'claude',
    });
    assert.equal(retry.status, 200);
    await retry.text();
  } finally {
    await gateway.close();
    await context.cleanup();
  }
});

test('gateway never replaces the provider used by a running conversation', async () => {
  const context = await fixture();
  const providers = createDefaultProviderRegistry();
  let complete!: () => void;
  providers.register({
    id: 'claude',
    run: async () => {
      await new Promise<void>((resolve) => {
        complete = resolve;
      });
      return {providerId: 'claude', output: 'finished', durationMs: 0};
    },
  });
  const agents = new AgentRegistry();
  agents.register({
    id: 'parent',
    name: 'Parent',
    children: [{agentId: 'child'}, {agentId: 'child'}],
  });
  agents.register({id: 'child', name: 'Child', providerId: 'claude'});
  const gateway = new AiGateway(
    new AgentRuntime(agents, new SkillRegistry(), providers),
    context.options,
  );
  await gateway.listen(0);
  const address = gateway.server.address();
  assert.ok(address && typeof address === 'object');
  const base = `http://127.0.0.1:${address.port}`;
  const post = (path: string, body: unknown) =>
    fetch(`${base}${path}`, {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(body),
    });
  try {
    const started = await post('/api/analyze', {
      agentId: 'parent',
      prompt: 'running',
    });
    assert.equal(started.status, 202);
    await started.text();
    const before = providers.get('claude');
    const blocked = await post('/api/providers/import-local', {
      providerId: 'claude',
    });
    assert.equal(blocked.status, 409);
    await blocked.text();
    assert.equal(providers.get('claude'), before);
  } finally {
    complete?.();
    await gateway.close();
    await context.cleanup();
  }
});

test('Codex timeout settles even when a descendant retains its pipes', async () => {
  const context = await fixture({holdPipes: true});
  let pid: number | undefined;
  const started = Date.now();
  try {
    await assert.rejects(
      importLocalProvider('codex', {...context.options, timeoutMs: 1000}),
      /timed out/,
    );
    assert.ok(
      Date.now() - started < 2500,
      'probe must settle without waiting for descendant-held pipes',
    );
    pid = Number(await readFile(join(context.home, 'descendant.pid'), 'utf8'));
    let alive = true;
    for (let i = 0; i < 100 && alive; i++) {
      try {
        process.kill(pid, 0);
      } catch {
        alive = false;
      }
      if (alive) await new Promise((resolve) => setTimeout(resolve, 10));
    }
    assert.equal(alive, false, 'owned descendant must be terminated');
  } finally {
    if (pid)
      try {
        process.kill(pid, 'SIGKILL');
      } catch {
        /* Already gone. */
      }
    await context.cleanup();
  }
});

test('relative PATH discovery pins an absolute executable before changing cwd', async () => {
  const context = await fixture();
  try {
    await copyFile(
      context.options.executables.claude,
      join(context.home, 'claude'),
    );
    await chmod(join(context.home, 'claude'), 0o700);
    const provider = await importLocalProvider('claude', {
      home: context.home,
      env: {
        ...context.options.env,
        PATH: relative(process.cwd(), context.home),
      },
    });
    const result = JSON.parse(
      (await provider.run({prompt: 'path check'})).output,
    );
    assert.equal(result.cwd, await realpath(context.home));
  } finally {
    await context.cleanup();
  }
});

test('CLI default and omitted models inherit configured model effort restrictions in provider and gateway', async () => {
  for (const levels of [['high'] as const, [] as const]) {
    const provider = new CommandProvider({
      id: 'codex',
      kind: 'command',
      executable: process.execPath,
      args: [
        '-e',
        'process.stdin.resume();process.stdin.on("end",()=>console.log("ok"))',
        '--',
      ],
      models: [{id: 'special', name: 'Special', levels: [...levels]}],
      defaultModelId: 'special',
      modelArgs: ['--model', '{{model}}'],
      reasoningArgs: ['--effort', '{{level}}'],
    });
    assert.deepEqual(provider.descriptor.models[0].levels, levels);
    for (const modelId of [undefined, 'default']) {
      assert.throws(
        () => provider.run({prompt: 'x', modelId, reasoningLevel: 'medium'}),
        /does not support/,
      );
      if (levels.length)
        assert.equal(
          (await provider.run({prompt: 'x', modelId, reasoningLevel: 'high'}))
            .output,
          'ok',
        );
    }
    const providers = createDefaultProviderRegistry();
    providers.register(provider);
    const gateway = new AiGateway(
      new AgentRuntime(new AgentRegistry(), new SkillRegistry(), providers),
    );
    await gateway.listen(0);
    const address = gateway.server.address();
    assert.ok(address && typeof address === 'object');
    try {
      for (const modelId of [undefined, 'default']) {
        const response: Response = await fetch(
          `http://127.0.0.1:${address.port}/api/analyze`,
          {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({
              prompt: 'x',
              modelId,
              reasoningLevel: 'medium',
            }),
          },
        );
        assert.equal(response.status, 400);
        await response.text();
      }
    } finally {
      await gateway.close();
    }
  }
});

for (const id of ['codex', 'claude'] as const) {
  test(`${id} import persists only a marker; unchanged saves and restart preserve CLI ownership`, async () => {
    const context = await fixture();
    const settingsPath = join(context.home, '.winscope', 'ai-settings.json');
    const sourcePath = join(context.home, id === 'codex' ? '.codex/config.toml' : '.claude/settings.json');
    const originalSource = await readFile(sourcePath, 'utf8');
    let providers = createDefaultProviderRegistry();
    let gateway = new AiGateway(new AgentRuntime(new AgentRegistry(), new SkillRegistry(), providers), context.options, {settingsPath});
    const listen = async () => {
      await gateway.listen(0);
      const address = gateway.server.address(); assert.ok(address && typeof address === 'object');
      return `http://127.0.0.1:${address.port}`;
    };
    let base = await listen();
    const post = (path: string, body: unknown) => fetch(`${base}${path}`, {method: 'POST', headers: {'content-type': 'application/json'}, body: JSON.stringify(body)});
    try {
      const imported = await post('/api/providers/import-local', {providerId: id});
      assert.equal(imported.status, 200);
      const value = await imported.json() as {provider: ProviderDescriptor; selection: AiSelection};
      assert.equal(value.provider.configured, true);
      assert.equal(value.provider.configuration?.apiKeyEnv, id === 'codex' ? 'WINSCOPE_TEST_PROVIDER_KEY' : 'ANTHROPIC_AUTH_TOKEN');
      assert.equal(value.selection.providerId, id);
      assert.equal(value.selection.modelId, value.provider.defaultModelId);
      const saved = await post('/api/settings', {selection: value.selection, configuration: value.provider.configuration});
      assert.equal(saved.status, 200);
      await saved.text();
      assert.deepEqual((providers.get(id) as CommandProvider).configurationOverrides, {});
      let args = JSON.parse((await providers.get(id).run({prompt: 'baseline'})).output).args as string[];
      assert.ok(!args.some((arg) => /base_url|env_key|model_provider=/.test(arg)), 'sanitized display values must not become CLI overrides');
      assert.equal(await readFile(sourcePath, 'utf8'), originalSource);
      let stored = await readFile(settingsPath, 'utf8');
      assert.doesNotMatch(stored, /SECRET_TOKEN|URL_PASSWORD|QUERY_SECRET|FRAGMENT_SECRET|url-user|executable|cwd|http_headers|rawConfig/);
      assert.deepEqual(JSON.parse(stored).providers, [{id, importLocal: true, configuration: {}}]);
      const editedConfiguration = {...value.provider.configuration!, baseUrl: 'https://manual.example/edited', apiKeyEnv: 'MANUAL_AUTH_ENV', timeoutMs: 4321};
      const edited = await post('/api/settings', {selection: value.selection, configuration: editedConfiguration});
      assert.equal(edited.status, 200); await edited.text();
      await gateway.close();
      providers = createDefaultProviderRegistry();
      gateway = new AiGateway(new AgentRuntime(new AgentRegistry(), new SkillRegistry(), providers), context.options, {settingsPath});
      base = await listen();
      const catalog = await (await fetch(`${base}/api/providers`)).json() as {providers: ProviderDescriptor[]; selection: AiSelection};
      assert.deepEqual(catalog.selection, value.selection);
      assert.deepEqual(catalog.providers.find((provider) => provider.id === id)?.configuration, editedConfiguration);
      const run = JSON.parse((await providers.get(id).run({prompt: 'restored'})).output);
      args = run.args;
      if (id === 'codex') {
        assert.ok(args.some((arg) => arg.includes('base_url="https://manual.example/edited"')));
        assert.ok(args.some((arg) => arg.includes('env_key="MANUAL_AUTH_ENV"')));
        assert.equal(run.codexHome, join(context.home, '.codex'));
      } else {
        assert.equal(run.claudeHome, join(context.home, '.claude'));
        assert.ok(args.includes('--setting-sources'));
        assert.ok(args.includes('--no-session-persistence'));
      }
      const cleared = await post('/api/settings', {selection: value.selection, configuration: {...value.provider.configuration!, apiKeyEnv: ''}});
      assert.equal(cleared.status, 200); await cleared.text();
      assert.deepEqual((providers.get(id) as CommandProvider).configurationOverrides, {});
      args = JSON.parse((await providers.get(id).run({prompt: 'cleared'})).output).args;
      assert.ok(!args.some((arg) => arg.includes('env_key=')));
      const reedited = await post('/api/settings', {selection: value.selection, configuration: editedConfiguration});
      assert.equal(reedited.status, 200); await reedited.text();
      const reset = await post('/api/providers/import-local', {providerId: id});
      assert.equal(reset.status, 200);
      assert.deepEqual((await reset.json() as {provider: ProviderDescriptor}).provider.configuration, value.provider.configuration);
      stored = await readFile(settingsPath, 'utf8');
      assert.deepEqual(JSON.parse(stored).providers, [{id, importLocal: true}]);
      await gateway.close();
      await rm(sourcePath);
      providers = createDefaultProviderRegistry();
      gateway = new AiGateway(new AgentRuntime(new AgentRegistry(), new SkillRegistry(), providers), context.options, {settingsPath});
      base = await listen();
      const failedRestore = await (await fetch(`${base}/api/providers`)).json() as {providers: ProviderDescriptor[]};
      assert.equal(failedRestore.providers.find((provider) => provider.id === id)?.configured, false);
      assert.equal(failedRestore.providers.find((provider) => provider.id === id)?.importedFrom, undefined);
    } finally { await gateway.close(); await context.cleanup(); }
  });
}
