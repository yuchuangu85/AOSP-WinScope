import {readJsonFile, isRecord, optionalString, requiredString, stringArray} from './json';
import {readdir, stat} from 'node:fs/promises';
import {join, resolve} from 'node:path';
import {AgentDefinition, ChildAgentRef} from './types';

export const DEFAULT_AGENT: AgentDefinition = {id: 'display-anomaly', name: 'Display anomaly analyst', description: 'Analyzes black-screen and flicker evidence with deterministic skills before asking a model for interpretation.', providerId: 'codex', skills: ['black-screen-diagnosis', 'flicker-detection'], promptTemplate: 'Analyze the supplied Android display evidence. Separate observed facts, hypotheses, missing evidence and recommended next checks. User question: {{prompt}}\nEvidence and deterministic skill output:\n{{skills}}'};

export class AgentRegistry {
  private readonly agents = new Map<string, AgentDefinition>();
  constructor() { this.register(DEFAULT_AGENT); }
  register(agent: AgentDefinition): void {
    this.agents.set(agent.id, agent);
    for (const child of agent.customSubagents ?? []) this.register(child);
  }
  get(id: string): AgentDefinition { const agent = this.agents.get(id); if (!agent) throw new Error(`unknown agent: ${id}`); return agent; }
  list(): AgentDefinition[] { return [...this.agents.values()].sort((a, b) => a.id.localeCompare(b.id)); }
  async importFile(filePath: string): Promise<AgentDefinition[]> {
    const value = await readJsonFile<unknown>(filePath);
    const values = Array.isArray(value) ? value : isRecord(value) && Array.isArray(value.agents) ? value.agents : [value];
    const imported = values.map(parseAgent);
    imported.forEach((agent) => this.register(agent));
    return imported;
  }
  async importPath(pathValue: string): Promise<AgentDefinition[]> {
    const target = resolve(pathValue);
    const info = await stat(target);
    if (info.isFile()) return this.importFile(target);
    const entries = await readdir(target, {withFileTypes: true});
    const files = entries.filter((entry) => entry.isFile() && (entry.name === 'agent.json' || entry.name === 'agents.json')).map((entry) => join(target, entry.name));
    const nested = entries.filter((entry) => entry.isDirectory()).map((entry) => join(target, entry.name));
    const result: AgentDefinition[] = [];
    for (const file of files) result.push(...await this.importFile(file));
    for (const child of nested) result.push(...await this.importPath(child));
    return result;
  }
}

function parseAgent(value: unknown): AgentDefinition {
  if (!isRecord(value)) throw new Error('agent definition must be an object');
  const children: ChildAgentRef[] | undefined = Array.isArray(value.children) ? value.children.map((child) => {
    if (!isRecord(child)) throw new Error('agent child must be an object');
    return {agentId: requiredString(child.agentId, 'agent.children.agentId'), prompt: optionalString(child.prompt, 'agent.children.prompt')};
  }) : undefined;
  const customSubagents = Array.isArray(value.customSubagents) ? value.customSubagents.map(parseAgent) : undefined;
  return {id: requiredString(value.id, 'agent.id'), name: requiredString(value.name, 'agent.name'), description: optionalString(value.description, 'agent.description'), providerId: optionalString(value.providerId, 'agent.providerId'), skills: stringArray(value.skills, 'agent.skills'), children, customSubagents, promptTemplate: optionalString(value.promptTemplate, 'agent.promptTemplate')};
}
