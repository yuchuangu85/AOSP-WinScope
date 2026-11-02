import {
  readJsonFile,
  isRecord,
  jsonValue,
  optionalString,
  requiredString,
  stringArray,
} from './json';
import {analyzeDisplayEvidence} from './evidence';
import {EvidenceInput, JsonValue, SkillDefinition} from './types';
import {readdir, stat} from 'node:fs/promises';
import {join, resolve} from 'node:path';

export interface AnalysisSkillProvider {
  listSkills(): SkillDefinition[];
  executeSkill(skillId: string, evidence?: EvidenceInput): JsonValue;
}

export const BUILTIN_SKILLS: SkillDefinition[] = [
  {
    id: 'black-screen-diagnosis',
    name: 'Black-screen diagnosis',
    kind: 'deterministic-evidence',
    analyzer: 'black-screen',
    description:
      'Find consecutive low-luma frames and correlate missing display evidence.',
  },
  {
    id: 'flicker-detection',
    name: 'Flicker detection',
    kind: 'deterministic-evidence',
    analyzer: 'flicker',
    description:
      'Find abrupt frame differences and incomplete display evidence.',
  },
];

export class SkillRegistry implements AnalysisSkillProvider {
  private readonly skills = new Map<string, SkillDefinition>();
  constructor() {
    for (const skill of BUILTIN_SKILLS) this.register(skill);
  }
  register(skill: SkillDefinition): void {
    this.skills.set(skill.id, skill);
  }
  get(id: string): SkillDefinition {
    const skill = this.skills.get(id);
    if (!skill) throw new Error(`unknown skill: ${id}`);
    return skill;
  }
  list(): SkillDefinition[] {
    return [...this.skills.values()].sort((a, b) => a.id.localeCompare(b.id));
  }
  listSkills(): SkillDefinition[] {
    return this.list();
  }
  executeSkill(id: string, evidence?: EvidenceInput): JsonValue {
    return this.execute(id, evidence);
  }
  execute(id: string, evidence?: EvidenceInput): JsonValue {
    const skill = this.get(id);
    if (skill.kind === 'deterministic-evidence')
      return jsonValue(analyzeDisplayEvidence(evidence));
    return {kind: 'prompt', skillId: skill.id, prompt: skill.prompt ?? ''};
  }
  async importFile(filePath: string): Promise<SkillDefinition[]> {
    const value = await readJsonFile<unknown>(filePath);
    const values = Array.isArray(value)
      ? value
      : isRecord(value) && Array.isArray(value.skills)
        ? value.skills
        : [value];
    const imported = values.map(parseSkill);
    imported.forEach((skill) => this.register(skill));
    return imported;
  }
  async importPath(pathValue: string): Promise<SkillDefinition[]> {
    const target = resolve(pathValue);
    const info = await stat(target);
    if (info.isFile()) return this.importFile(target);
    const entries = await readdir(target, {withFileTypes: true});
    const files = entries
      .filter(
        (entry) =>
          entry.isFile() &&
          (entry.name === 'skill.json' || entry.name === 'skills.json'),
      )
      .map((entry) => join(target, entry.name));
    const nested = entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => join(target, entry.name));
    const result: SkillDefinition[] = [];
    for (const file of files) result.push(...(await this.importFile(file)));
    for (const child of nested) result.push(...(await this.importPath(child)));
    return result;
  }
}

function parseSkill(value: unknown): SkillDefinition {
  if (!isRecord(value)) throw new Error('skill definition must be an object');
  const kind =
    value.kind === 'prompt'
      ? 'prompt'
      : value.kind === 'deterministic-evidence'
        ? 'deterministic-evidence'
        : undefined;
  if (!kind)
    throw new Error('skill kind must be prompt or deterministic-evidence');
  const analyzer =
    value.analyzer === 'black-screen' || value.analyzer === 'flicker'
      ? value.analyzer
      : undefined;
  return {
    id: requiredString(value.id, 'skill.id'),
    name: requiredString(value.name, 'skill.name'),
    description: optionalString(value.description, 'skill.description'),
    kind,
    analyzer,
    prompt: optionalString(value.prompt, 'skill.prompt'),
  };
}
