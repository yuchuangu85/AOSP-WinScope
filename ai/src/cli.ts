#!/usr/bin/env node
import {readFile} from 'node:fs/promises';
import {AiGateway} from './gateway';
import {loadRuntime} from './config';
import {runMcpServer} from './mcp';
import {defaultSettingsPath} from './settings';

const args = process.argv.slice(2);
const command = args[0] ?? 'help';
const value = (name: string): string | undefined => { const index = args.indexOf(name); return index >= 0 ? args[index + 1] : undefined; };

async function main(): Promise<void> {
  const runtime = await loadRuntime(value('--config') ?? process.env.WINSCOPE_AI_CONFIG);
  if (command === 'list-agents') return console.log(JSON.stringify(runtime.agents.list(), null, 2));
  if (command === 'list-skills') return console.log(JSON.stringify(runtime.skills.list(), null, 2));
  if (command === 'import-agent') return console.log(JSON.stringify(await runtime.agents.importPath(required('--path')), null, 2));
  if (command === 'import-skill') return console.log(JSON.stringify(await runtime.skills.importPath(required('--path')), null, 2));
  if (command === 'run-agent') {
    const evidencePath = value('--evidence');
    const evidence = evidencePath ? JSON.parse(await readFile(evidencePath, 'utf8')) : undefined;
    const result = await runtime.run(value('--agent') ?? 'display-anomaly', {prompt: value('--prompt') ?? '', evidence}, {onEvent: (event) => console.error(`[${event.type}]`, event.message ?? '')});
    console.log(JSON.stringify(result, null, 2)); return;
  }
  if (command === 'mcp') return runMcpServer(runtime);
  if (command === 'serve') {
    const gateway = new AiGateway(runtime, {}, {settingsPath: defaultSettingsPath()}); const port = Number(value('--port') ?? 7341); await gateway.listen(port); console.error(`winscope-ai listening on http://127.0.0.1:${port}`); await new Promise<void>(() => {}); return;
  }
  console.log('Usage: winscope-ai <serve|mcp|run-agent|list-agents|list-skills|import-agent|import-skill>');
}
function required(name: string): string { const result = value(name); if (!result) throw new Error(`${name} is required`); return result; }
main().catch((error) => { console.error(error instanceof Error ? error.message : String(error)); process.exitCode = 1; });
