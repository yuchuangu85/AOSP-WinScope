import {readJsonFile, isRecord, requiredString} from './json';
import {ProviderConfig} from './types';
import {ProviderRegistry, createDefaultProviderRegistry, providerFromConfig} from './providers';
import {AgentRegistry} from './registry';
import {SkillRegistry} from './skills';
import {AgentRuntime} from './runtime';

export interface AiConfig {providers?: ProviderConfig[]; agentPaths?: string[]; skillPaths?: string[];}
export async function loadRuntime(configPath?: string): Promise<AgentRuntime> {
  const providers = createDefaultProviderRegistry();
  const agents = new AgentRegistry();
  const skills = new SkillRegistry();
  if (configPath) {
    const value = await readJsonFile<unknown>(configPath);
    if (!isRecord(value)) throw new Error('AI config must be an object');
    if (Array.isArray(value.providers)) for (const provider of value.providers) providers.register(providerFromConfig(provider as ProviderConfig));
    if (Array.isArray(value.agentPaths)) for (const path of value.agentPaths) if (typeof path === 'string') await agents.importPath(path);
    if (Array.isArray(value.skillPaths)) for (const path of value.skillPaths) if (typeof path === 'string') await skills.importPath(path);
  }
  return new AgentRuntime(agents, skills, providers);
}
