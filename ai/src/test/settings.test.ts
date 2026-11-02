import {strict as assert} from 'node:assert';
import {chmod, mkdtemp, readFile, readdir, rm, stat, symlink, writeFile} from 'node:fs/promises';
import {createServer, request as httpRequest} from 'node:http';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {test} from 'node:test';
import {AiGateway} from '../gateway';
import {CommandProvider, configureProvider, createDefaultProviderRegistry, localCommandConfig, OpenAICompatibleProvider, ProviderRegistry} from '../providers';
import {AgentRegistry} from '../registry';
import {AgentRuntime} from '../runtime';
import {defaultSettingsPath} from '../settings';
import {SkillRegistry} from '../skills';
import {AiSelection, ProviderConfiguration, ProviderDescriptor} from '../types';

const selection: AiSelection = {agentId: 'display-anomaly', providerId: 'codex', modelId: '__custom__', customModel: 'custom/model', reasoningLevel: 'high'};
const configuration: ProviderConfiguration = {baseUrl: 'https://manual.example/v1', providerName: 'Manual "quoted" \\ gateway', apiKeyEnv: 'WINSCOPE_MANUAL_KEY', timeoutMs: 1234};

async function start(settingsPath?: string, providers = createDefaultProviderRegistry()) {
  const agents = new AgentRegistry();
  agents.register({id: 'deterministic', name: 'Deterministic', skills: ['black-screen-diagnosis']});
  const gateway = new AiGateway(new AgentRuntime(agents, new SkillRegistry(), providers), {}, {settingsPath});
  await gateway.listen(0);
  const address = gateway.server.address();
  assert.ok(address && typeof address === 'object');
  const base = `http://127.0.0.1:${address.port}`;
  return {
    gateway, providers, base,
    post: (body: unknown, path = '/api/settings') => fetch(`${base}${path}`, {method: 'POST', headers: {'content-type': 'application/json'}, body: JSON.stringify(body)}),
    catalog: async () => await (await fetch(`${base}/api/providers`)).json() as {providers: ProviderDescriptor[]; selection?: AiSelection},
  };
}

test('settings persist active configuration and selection atomically, reopen and preserve other providers', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'winscope-settings-'));
  const path = join(directory, 'app', 'ai-settings.json');
  let context = await start(path);
  try {
    assert.equal((await context.catalog()).selection, undefined);
    const saved = await context.post({selection, configuration});
    assert.equal(saved.status, 200);
    const result = await saved.json() as {provider: ProviderDescriptor; selection: AiSelection};
    assert.equal(result.provider.configured, true);
    assert.deepEqual(result.provider.configuration, configuration);
    assert.deepEqual(result.selection, selection);
    assert.equal((await stat(join(directory, 'app'))).mode & 0o777, 0o700);
    assert.equal((await stat(path)).mode & 0o777, 0o600);
    assert.deepEqual(await readdir(join(directory, 'app')), ['ai-settings.json']);
    const claudeSelection = {...selection, providerId: 'claude', modelId: 'sonnet', customModel: 'ignored invalid hidden draft!'};
    const second = await context.post({selection: claudeSelection, configuration: {...configuration, baseUrl: 'https://claude.example'}});
    assert.equal(second.status, 200);
    assert.equal((await second.json() as {selection: AiSelection}).selection.customModel, '');
    await context.gateway.close();
    context = await start(path);
    const catalog = await context.catalog();
    assert.deepEqual(catalog.selection, {...claudeSelection, customModel: ''});
    assert.deepEqual(catalog.providers.find((item) => item.id === 'codex')?.configuration, configuration);
    assert.equal(catalog.providers.find((item) => item.id === 'claude')?.configured, true);
    const deterministic = {...selection, agentId: 'deterministic', providerId: '', modelId: 'default', customModel: ''};
    const response = await context.post({selection: deterministic});
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), {selection: deterministic});
    await context.gateway.close();
    context = await start(path);
    assert.deepEqual((await context.catalog()).selection, deterministic);
    assert.doesNotMatch(await readFile(path, 'utf8'), /executable|cwd|rawConfig|authentication|apiKey"|env"|args"/);
  } finally { await context.gateway.close(); await rm(directory, {recursive: true, force: true}); }
});

test('settings validation rejects unknown fields, invalid active models, URLs, env names and timeouts without mutation', async () => {
  const context = await start();
  try {
    const invalid = [
      {}, {selection, env: {KEY: 'RAW_SECRET'}}, {selection: {...selection, cwd: '/tmp'}},
      ...[{agentId: 'missing'}, {providerId: 'missing'}, {modelId: 'not-listed'}, {modelId: '__custom__', customModel: 'bad;command'}, {reasoningLevel: 'max'}, {reasoningLevel: ['high']}].map((patch) => ({selection: {...selection, ...patch}})),
      ...['ftp://example/v1', 'file:///tmp/config', 'https://user:RAW_SECRET@example/v1', 'https://@example/v1', 'https://example/v1?key=RAW_SECRET', 'https://example/v1#RAW_SECRET', 'https://example/v1?', 'https://example/v1#', 'https://example/\nRAW_SECRET', 'https://example/%0aRAW_SECRET', 'https:\\example/v1'].map((baseUrl) => ({selection, configuration: {...configuration, baseUrl}})),
      ...['bad-name', 'RAW SECRET', 'KEY=secret', '1KEY'].map((apiKeyEnv) => ({selection, configuration: {...configuration, apiKeyEnv}})),
      ...[999, 600001, 1000.1, '1000', null].map((timeoutMs) => ({selection, configuration: {...configuration, timeoutMs}})),
      ...[{apiKey: 'RAW_SECRET'}, {args: ['--dangerous']}, {executable: '/bin/sh'}, {env: {KEY: 'RAW_SECRET'}}, {providerName: 'bad\nname'}].map((patch) => ({selection, configuration: {...configuration, ...patch}})),
      {selection: {...selection, providerId: 'ds', modelId: 'default', customModel: ''}, configuration},
      {selection: {...selection, agentId: 'deterministic', providerId: '', modelId: 'default', customModel: ''}, configuration},
    ];
    for (const body of invalid) {
      const result = await context.post(body);
      assert.equal(result.status, 400, JSON.stringify(body));
      assert.doesNotMatch(await result.text(), /RAW_SECRET|dangerous|\/bin\/sh/);
    }
    assert.equal((await context.catalog()).selection, undefined);
    assert.equal(context.providers.get('codex').descriptor?.configured, false);
    const accepted = await context.post({selection, configuration});
    assert.equal(accepted.status, 200);
    await accepted.text();
    assert.deepEqual((await context.catalog()).selection, selection, 'no settingsPath still supports in-memory settings');
  } finally { await context.gateway.close(); }
});

test('invalid, absent or unsafe persisted settings do not crash or claim configured', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'winscope-invalid-settings-'));
  const path = join(directory, 'ai-settings.json');
  try {
    for (const contents of [undefined, '{ RAW_SECRET', JSON.stringify({version: 2, providers: []}), JSON.stringify({version: 1, providers: [{id: 'codex', configuration: {baseUrl: 'file:///RAW_SECRET'}}], selection: {...selection, agentId: 'missing'}})]) {
      if (contents !== undefined) await writeFile(path, contents);
      const context = await start(path);
      try {
        const catalog = await context.catalog();
        assert.equal(catalog.providers.find((item) => item.id === 'codex')?.configured, false);
        assert.equal(catalog.selection, undefined);
        assert.doesNotMatch(JSON.stringify(catalog), /RAW_SECRET/);
      } finally { await context.gateway.close(); }
    }
    const target = join(directory, 'do-not-touch.json');
    await writeFile(target, 'preserved');
    await rm(path);
    await symlink(target, path);
    const context = await start(path);
    try {
      const failed = await context.post({selection, configuration});
      assert.equal(failed.status, 500);
      assert.equal(await readFile(target, 'utf8'), 'preserved');
      assert.equal((await context.catalog()).selection, undefined);
    } finally { await context.gateway.close(); }
  } finally { await rm(directory, {recursive: true, force: true}); }
});

test('custom settings paths preserve existing parent permissions and WINSCOPE_AI_SETTINGS is honored', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'winscope-parent-mode-'));
  await chmod(directory, 0o755);
  const path = join(directory, 'settings.json');
  const before = process.env.WINSCOPE_AI_SETTINGS;
  const context = await start(path);
  try {
    process.env.WINSCOPE_AI_SETTINGS = path;
    assert.equal(defaultSettingsPath(), path);
    const result = await context.post({selection, configuration});
    assert.equal(result.status, 200);
    await result.text();
    assert.equal((await stat(directory)).mode & 0o777, 0o755);
    assert.equal((await stat(path)).mode & 0o777, 0o600);
  } finally {
    if (before === undefined) delete process.env.WINSCOPE_AI_SETTINGS; else process.env.WINSCOPE_AI_SETTINGS = before;
    await context.gateway.close(); await rm(directory, {recursive: true, force: true});
  }
});

function command(kind: 'codex' | 'claude', extra: Partial<import('../types').CommandProviderConfig> = {}) {
  const baseline = localCommandConfig(kind);
  const script = 'process.stdin.resume();process.stdin.on("end",()=>console.log(JSON.stringify({args:process.argv.slice(1),baseUrl:process.env.ANTHROPIC_BASE_URL,keyMatches:process.env.ANTHROPIC_API_KEY==="PRIVATE_VALUE",token:process.env.ANTHROPIC_AUTH_TOKEN,timeout:process.env.API_TIMEOUT_MS,home:process.env.CODEX_HOME})))';
  return new CommandProvider({...baseline, executable: process.execPath, args: ['-e', script, '--', ...baseline.args!], ...extra});
}

test('Codex overrides use escaped TOML values, env_key references and read-only packaged-app arguments', async () => {
  const provider = configureProvider(command('codex'), configuration);
  const result = await provider.run({prompt: 'x', modelId: 'model', reasoningLevel: 'high'});
  const args = JSON.parse(result.output).args as string[];
  for (const flag of ['exec', '--sandbox', 'read-only', '--ephemeral', '--skip-git-repo-check']) assert.ok(args.includes(flag));
  assert.equal(args.filter((arg) => arg === '--skip-git-repo-check').length, 1);
  assert.ok(args.includes(`model_providers.winscope.name=${JSON.stringify(configuration.providerName)}`));
  assert.ok(args.includes('model_providers.winscope.env_key="WINSCOPE_MANUAL_KEY"'));
  assert.ok(args.includes('model_providers.winscope.base_url="https://manual.example/v1"'));
  assert.doesNotMatch(JSON.stringify(args), /PRIVATE_VALUE/);
  const builtin = command('codex');
  const defaultArgs = JSON.parse((await configureProvider(builtin, builtin.descriptor.configuration!).run({prompt: 'x'})).output).args as string[];
  assert.ok(defaultArgs.includes('model_providers.winscope.env_key="OPENAI_API_KEY"'), 'manual non-imported defaults are explicit settings');
  for (const reserved of ['openai', 'ollama', 'lmstudio']) {
    const imported = command('codex', {importedFrom: 'Local CLI', importedProviderId: reserved});
    const args = JSON.parse((await configureProvider(imported, configuration).run({prompt: 'x'})).output).args as string[];
    assert.ok(args.includes('model_provider="winscope"'));
    assert.ok(!args.some((arg) => arg.startsWith(`model_providers."${reserved}"`)));
  }
  const commandAuth = command('codex', {importedFrom: 'Local CLI', importedProviderId: 'gateway', importedCommandAuth: true});
  assert.throws(() => configureProvider(commandAuth, configuration), /command-authenticated/);
});

test('Claude overrides affect only child env and preserve imported paths and authentication metadata', async () => {
  const before = process.env.ANTHROPIC_BASE_URL;
  const provider = command('claude', {importedFrom: 'Local CLI', importedApiKeyEnv: 'ANTHROPIC_AUTH_TOKEN', localConfig: {authentication: 'configured', baseUrl: 'https://old.example', providerName: 'Claude'}, env: {CODEX_HOME: '/preserved/home', WINSCOPE_MANUAL_KEY: 'PRIVATE_VALUE'}});
  const configured = configureProvider(provider, configuration);
  const result = JSON.parse((await configured.run({prompt: 'x'})).output);
  assert.equal(result.baseUrl, configuration.baseUrl);
  assert.equal(result.keyMatches, true);
  assert.equal(result.token, '');
  assert.equal(result.timeout, '1234');
  assert.equal(result.home, '/preserved/home');
  assert.equal(process.env.ANTHROPIC_BASE_URL, before);
  assert.deepEqual(configured.descriptor?.localConfig, provider.descriptor.localConfig);
  assert.doesNotMatch(JSON.stringify(configured.descriptor), /PRIVATE_VALUE|preserved/);
  const builtin = command('claude', {env: {ANTHROPIC_API_KEY: 'PRIVATE_VALUE', ANTHROPIC_AUTH_TOKEN: 'STALE'}});
  const defaults = JSON.parse((await configureProvider(builtin, builtin.descriptor.configuration!).run({prompt: 'x'})).output);
  assert.equal(defaults.keyMatches, true);
  assert.equal(defaults.token, '', 'manual API key selection suppresses a stale inherited auth token');
});

test('manual authentication status reflects the selected environment variable without exposing its value', () => {
  const provider = command('claude', {
    importedFrom: 'Local CLI', importedApiKeyEnv: 'ANTHROPIC_AUTH_TOKEN',
    localConfig: {authentication: 'configured'},
    env: {WINSCOPE_PRESENT_KEY: 'PRIVATE_VALUE', WINSCOPE_MISSING_KEY: ''},
  });
  const missing = configureProvider(provider, {...configuration, apiKeyEnv: 'WINSCOPE_MISSING_KEY'});
  assert.equal(missing.descriptor?.localConfig?.authentication, 'not-configured');
  assert.equal(missing.descriptor?.configured, true);
  const present = configureProvider(provider, {...configuration, apiKeyEnv: 'WINSCOPE_PRESENT_KEY'});
  assert.equal(present.descriptor?.localConfig?.authentication, 'configured');
  assert.doesNotMatch(JSON.stringify(present.descriptor), /PRIVATE_VALUE/);
  const compatible = new OpenAICompatibleProvider({
    id: 'api', kind: 'openai-compatible', baseUrl: 'https://example/v1', model: 'model',
    apiKeyEnv: 'WINSCOPE_UNSET_KEY_FOR_TEST',
  });
  assert.equal(compatible.descriptor.localConfig?.authentication, 'not-configured');
});

test('OpenAI-compatible saved overrides drive fetch URL, auth and timeout without changing response text', async () => {
  let url: string | undefined;
  let authorization: string | undefined;
  const server = createServer((request, response) => {
    url = request.url; authorization = request.headers.authorization;
    response.end(JSON.stringify({choices: [{message: {content: 'unaltered answer'}}]}));
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address(); assert.ok(address && typeof address === 'object');
  const old = process.env.WINSCOPE_MANUAL_KEY;
  process.env.WINSCOPE_MANUAL_KEY = 'PRIVATE_VALUE';
  const provider = new OpenAICompatibleProvider({id: 'openai', kind: 'openai-compatible', baseUrl: 'https://unused.invalid', model: 'model'});
  try {
    const configured = configureProvider(provider, {...configuration, baseUrl: `http://127.0.0.1:${address.port}/edited`});
    assert.equal((await configured.run({prompt: 'x'})).output, 'unaltered answer');
    assert.equal(url, '/edited/chat/completions');
    assert.equal(authorization, 'Bearer PRIVATE_VALUE');
    assert.doesNotMatch(JSON.stringify(configured.descriptor), /PRIVATE_VALUE/);
  } finally {
    if (old === undefined) delete process.env.WINSCOPE_MANUAL_KEY; else process.env.WINSCOPE_MANUAL_KEY = old;
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});

test('saved timeout is enforced for command and HTTP execution', async () => {
  const provider = command('codex', {args: ['-e', 'process.stdin.resume();setInterval(()=>{},1000)', '--']});
  const started = Date.now();
  const result = await configureProvider(provider, {...provider.descriptor.configuration!, timeoutMs: 1000}).run({prompt: 'x'});
  assert.equal(result.cancelled, true);
  assert.ok(Date.now() - started < 2500);
  const server = createServer((request) => request.resume());
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address(); assert.ok(address && typeof address === 'object');
  try {
    const http = new OpenAICompatibleProvider({id: 'http', kind: 'openai-compatible', baseUrl: `http://127.0.0.1:${address.port}`, model: 'model'});
    const result = await configureProvider(http, {...http.descriptor.configuration!, timeoutMs: 1000}).run({prompt: 'x'});
    assert.equal(result.cancelled, true);
  } finally { server.closeAllConnections(); await new Promise<void>((resolve) => server.close(() => resolve())); }
});

test('provider error paths do not echo credentials or raw HTTP/CLI diagnostics', async () => {
  const cli = command('codex', {args: ['-e', 'process.stdin.resume();process.stdin.on("end",()=>{console.error("RAW_SECRET");process.exitCode=1})']});
  await assert.rejects(cli.run({prompt: 'x'}), (error: Error) => !error.message.includes('RAW_SECRET') && error.message.includes('exited with 1'));
  const server = createServer((request, response) => { request.resume(); response.writeHead(401); response.end('RAW_SECRET'); });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address(); assert.ok(address && typeof address === 'object');
  try {
    const http = new OpenAICompatibleProvider({id: 'http', kind: 'openai-compatible', baseUrl: `http://127.0.0.1:${address.port}`, model: 'model'});
    await assert.rejects(http.run({prompt: 'x'}), {message: 'provider HTTP 401'});
  } finally { await new Promise<void>((resolve) => server.close(() => resolve())); }
});

test('a gateway without settingsPath never writes, even when the deployment env path is set', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'winscope-no-settings-'));
  const before = process.env.WINSCOPE_AI_SETTINGS;
  process.env.WINSCOPE_AI_SETTINGS = join(directory, 'must-not-exist.json');
  const context = await start();
  try {
    const result = await context.post({selection, configuration});
    assert.equal(result.status, 200); await result.text();
    assert.deepEqual(await readdir(directory), []);
  } finally {
    if (before === undefined) delete process.env.WINSCOPE_AI_SETTINGS; else process.env.WINSCOPE_AI_SETTINGS = before;
    await context.gateway.close(); await rm(directory, {recursive: true, force: true});
  }
});

test('running sessions block settings and imports without changing active providers', async () => {
  const providers = createDefaultProviderRegistry();
  let finish!: () => void;
  const original = {id: 'waiting', run: () => new Promise<import('../types').ProviderResponse>((resolve) => { finish = () => resolve({providerId: 'waiting', output: 'done', durationMs: 0}); })};
  providers.register(original);
  const context = await start(undefined, providers);
  try {
    const running = await context.post({agentId: 'display-anomaly', providerId: 'waiting', prompt: 'wait'}, '/api/analyze');
    assert.equal(running.status, 202); await running.text();
    const blocked = await context.post({selection, configuration});
    assert.equal(blocked.status, 409); await blocked.text();
    const imported = await context.post({providerId: 'codex'}, '/api/providers/import-local');
    assert.equal(imported.status, 409); await imported.text();
    assert.equal(providers.get('waiting'), original);
    assert.equal((await context.catalog()).selection, undefined);
  } finally { finish?.(); await context.gateway.close(); }
});

test('concurrent saves are serialized and settings retain Host protections', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'winscope-lock-'));
  const context = await start(join(directory, 'settings.json'));
  try {
    // Request-body completion and route order give both requests an opportunity to contend.
    const first = context.post({selection, configuration});
    const second = context.post({selection, configuration});
    const results = await Promise.all([first, second]);
    assert.ok(results.some((result) => result.status === 200));
    assert.ok(results.every((result) => result.status === 200 || result.status === 409));
    for (const result of results) await result.text();
    const body = JSON.stringify({selection, configuration});
    const forbidden = await new Promise<number>((resolve, reject) => {
      const request = httpRequest(`${context.base}/api/settings`, {method: 'POST', headers: {'content-type': 'application/json', host: 'attacker.invalid'}}, (response) => { response.resume(); response.on('end', () => resolve(response.statusCode!)); });
      request.on('error', reject); request.end(body);
    });
    assert.equal(forbidden, 403);
  } finally { await context.gateway.close(); await rm(directory, {recursive: true, force: true}); }
});
