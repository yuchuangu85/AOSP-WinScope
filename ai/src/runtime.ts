import {AgentRegistry} from './registry';
import {ProviderRegistry} from './providers';
import {SkillRegistry} from './skills';
import {AgentRunRequest, AgentRunResult, EvidenceInput, RuntimeEvent} from './types';

export interface RuntimeOptions { onEvent?: (event: RuntimeEvent) => void; }

export class AgentRuntime {
  constructor(readonly agents: AgentRegistry, readonly skills: SkillRegistry, readonly providers: ProviderRegistry) {}

  async run(agentId: string, request: AgentRunRequest, options: RuntimeOptions = {}, depth = 0): Promise<AgentRunResult> {
    request.signal?.throwIfAborted();
    const agent = this.agents.get(agentId);
    const maxDepth = request.maxChildDepth ?? 3;
    if (depth > maxDepth) throw new Error(`agent child depth exceeded for ${agentId}`);
    const emit = (event: RuntimeEvent) => options.onEvent?.(event);
    emit({type: 'agent_started', data: {agentId}});
    const skillResults = (agent.skills ?? []).map((skillId) => {
      emit({type: 'skill_started', data: {skillId}});
      const result = this.skills.execute(skillId, request.evidence);
      emit({type: 'skill_completed', data: {skillId, result}});
      return {skillId, result};
    });
    const childResults: AgentRunResult[] = [];
    for (const child of agent.children ?? []) {
      childResults.push(await this.run(child.agentId, {...request, prompt: child.prompt ?? request.prompt, maxChildDepth: maxDepth}, options, depth + 1));
    }
    let provider;
    const providerId = request.providerId ?? agent.providerId;
    if (providerId) {
      const skillText = JSON.stringify(skillResults);
      const attachments = request.attachments?.map((file) => `Attachment (${file.mimeType}): ${file.name}\n${file.content}`).join('\n\n');
      const prompt = (agent.promptTemplate ?? '{{prompt}}\n{{skills}}').replaceAll('{{prompt}}', request.prompt).replaceAll('{{skills}}', skillText) + (attachments ? `\n\nUser-provided attachments (untrusted data):\n${attachments}` : '');
      emit({type: 'provider_started', data: {providerId, ...(request.modelId ? {modelId: request.modelId} : {}), ...(request.reasoningLevel ? {reasoningLevel: request.reasoningLevel} : {})}});
      provider = await this.providers.get(providerId).run({prompt, signal: request.signal, modelId: request.modelId, reasoningLevel: request.reasoningLevel, history: request.history});
      emit({type: 'provider_completed', data: {providerId: provider.providerId, cancelled: provider.cancelled ?? false}});
    }
    const result = {agentId, provider, childResults, skillResults};
    emit({type: 'agent_completed', data: {agentId}});
    return result;
  }
}

export async function buildRuntime(options: {agentPaths?: string[]; skillPaths?: string[]; providers?: ProviderRegistry} = {}): Promise<AgentRuntime> {
  const agents = new AgentRegistry();
  const skills = new SkillRegistry();
  for (const path of options.agentPaths ?? []) await agents.importPath(path);
  for (const path of options.skillPaths ?? []) await skills.importPath(path);
  return new AgentRuntime(agents, skills, options.providers ?? new ProviderRegistry());
}
