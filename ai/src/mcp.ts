import {readFile} from 'node:fs/promises';
import {AgentRuntime} from './runtime';

export async function runMcpServer(runtime: AgentRuntime, input: NodeJS.ReadableStream = process.stdin, output: NodeJS.WritableStream = process.stdout): Promise<void> {
  let buffer = '';
  for await (const chunk of input) {
    buffer += String(chunk);
    let newline;
    while ((newline = buffer.indexOf('\n')) >= 0) {
      const line = buffer.slice(0, newline).trim(); buffer = buffer.slice(newline + 1);
      if (!line) continue;
      let request: any;
      try { request = JSON.parse(line); } catch { write(output, {jsonrpc: '2.0', id: null, error: {code: -32700, message: 'parse error'}}); continue; }
      const response = await dispatch(runtime, request);
      if (response !== undefined) write(output, response);
    }
  }
}

async function dispatch(runtime: AgentRuntime, request: any): Promise<any> {
  if (request.method === 'notifications/initialized') return undefined;
  if (request.method === 'initialize') return {jsonrpc: '2.0', id: request.id, result: {protocolVersion: '2024-11-05', capabilities: {tools: {}}, serverInfo: {name: 'winscope-ai', version: '0.1.0'}}};
  if (request.method === 'tools/list') return {jsonrpc: '2.0', id: request.id, result: {tools: toolDefinitions()}};
  if (request.method !== 'tools/call') return error(request.id, -32601, 'method not found');
  try { const result = await callTool(runtime, request.params?.name, request.params?.arguments ?? {}); return {jsonrpc: '2.0', id: request.id, result: {content: [{type: 'text', text: JSON.stringify(result)}]}}; }
  catch (e) { return {jsonrpc: '2.0', id: request.id, result: {isError: true, content: [{type: 'text', text: e instanceof Error ? e.message : String(e)}]}}; }
}

function toolDefinitions() { return ['list_agents', 'list_skills', 'analyze_trace', 'run_agent', 'import_agent', 'import_skill'].map((name) => ({name, description: `WinScope AI ${name}`, inputSchema: {type: 'object'}})); }
async function callTool(runtime: AgentRuntime, name: string, args: any): Promise<unknown> {
  switch (name) {
    case 'list_agents': return runtime.agents.list();
    case 'list_skills': return runtime.skills.list();
    case 'analyze_trace': return runtime.skills.execute(args.skillId ?? 'black-screen-diagnosis', args.evidence);
    case 'run_agent': return runtime.run(args.agentId ?? 'display-anomaly', {prompt: String(args.prompt ?? ''), evidence: args.evidence});
    case 'import_agent': return runtime.agents.importPath(String(args.path));
    case 'import_skill': return runtime.skills.importPath(String(args.path));
    default: throw new Error(`unknown tool: ${name}`);
  }
}
function error(id: unknown, code: number, message: string) { return {jsonrpc: '2.0', id, error: {code, message}}; }
function write(output: NodeJS.WritableStream, value: unknown): void { output.write(`${JSON.stringify(value)}\n`); }
