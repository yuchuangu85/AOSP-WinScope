export type JsonObject = {[key: string]: JsonValue};
export type JsonValue = null | boolean | number | string | JsonValue[] | JsonObject;

export type ReasoningLevel = 'low' | 'medium' | 'high';

export interface LocalConfigMetadata {
  baseUrl?: string;
  providerName?: string;
  authentication: 'configured' | 'cli-managed';
  reasoningLevel?: ReasoningLevel;
}

export interface ModelDescriptor {
  id: string;
  name: string;
  levels?: ReasoningLevel[];
}

export interface ProviderDescriptor {
  id: string;
  name?: string;
  models: ModelDescriptor[];
  reasoningLevels: ReasoningLevel[];
  supportsCustomModel?: boolean;
  defaultModelId?: string;
  importedFrom?: string;
  localConfig?: LocalConfigMetadata;
}

export interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
}

export interface TextAttachment {
  name: string;
  mimeType: string;
  content: string;
}

export interface ProviderRequest {
  prompt: string;
  modelId?: string;
  reasoningLevel?: ReasoningLevel;
  history?: ChatTurn[];
  signal?: AbortSignal;
  timeoutMs?: number;
}

export interface ProviderResponse {
  providerId: string;
  output: string;
  durationMs: number;
  exitCode?: number;
  cancelled?: boolean;
}

export interface Provider {
  readonly id: string;
  readonly descriptor?: ProviderDescriptor;
  run(request: ProviderRequest): Promise<ProviderResponse>;
}

export interface CommandProviderConfig {
  id: string;
  kind: 'command';
  executable: string;
  args?: string[];
  name?: string;
  models?: ModelDescriptor[];
  modelArgs?: string[];
  reasoningArgs?: string[];
  reasoningLevels?: ReasoningLevel[];
  env?: Record<string, string>;
  cwd?: string;
  defaultModelId?: string;
  importedFrom?: string;
  localConfig?: LocalConfigMetadata;
  timeoutMs?: number;
}

export interface OpenAICompatibleProviderConfig {
  id: string;
  kind: 'openai-compatible';
  baseUrl: string;
  model: string;
  name?: string;
  models?: ModelDescriptor[];
  reasoningLevels?: ReasoningLevel[];
  apiKeyEnv?: string;
  timeoutMs?: number;
}

export type ProviderConfig = CommandProviderConfig | OpenAICompatibleProviderConfig;

export interface ChildAgentRef {
  agentId: string;
  prompt?: string;
}

export interface AgentDefinition {
  id: string;
  name: string;
  description?: string;
  providerId?: string;
  skills?: string[];
  children?: ChildAgentRef[];
  customSubagents?: AgentDefinition[];
  promptTemplate?: string;
}

export interface SkillDefinition {
  id: string;
  name: string;
  description?: string;
  kind: 'deterministic-evidence' | 'prompt';
  analyzer?: 'black-screen' | 'flicker';
  prompt?: string;
}

export interface VideoFrame {
  index: number;
  timestampMs?: number;
  luma?: number;
  averageLuma?: number;
}

export interface VideoEvidence {
  frames?: VideoFrame[];
  frameDiffs?: Array<number | {fromIndex: number; toIndex: number; value: number}>;
  durationMs?: number;
  frameRate?: number;
}

export interface SurfaceFlingerEvidence {
  presentedFrameCount?: number;
  frameTimesMs?: number[];
  bufferLatches?: number;
  notes?: string[];
}

export interface WindowManagerEvidence {
  displayState?: 'on' | 'off' | 'unknown';
  focusedWindow?: string;
  visibleWindows?: string[];
  transitions?: Array<{timestampMs?: number; type: string}>;
}

export interface TransactionEvidence {
  count?: number;
  sampleKeys?: string[];
  notes?: string[];
}

export interface EvidenceInput {
  video?: VideoEvidence;
  surfaceFlinger?: SurfaceFlingerEvidence;
  windowManager?: WindowManagerEvidence;
  transactions?: TransactionEvidence;
  metadata?: JsonObject;
}

export type FindingKind = 'black-screen' | 'flicker';

export interface EvidenceFinding {
  kind: FindingKind;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  reason: string;
  frameIndexes: number[];
  evidence: string[];
}

export interface EvidenceAnalysisResult {
  schemaVersion: '1';
  deterministic: true;
  complete: boolean;
  incompleteReasons: string[];
  coverage: {
    video: boolean;
    frameLuma: boolean;
    frameDiff: boolean;
    surfaceFlinger: boolean;
    windowManager: boolean;
    transactions: boolean;
  };
  findings: EvidenceFinding[];
}

export interface AgentRunRequest {
  prompt: string;
  evidence?: EvidenceInput;
  signal?: AbortSignal;
  maxChildDepth?: number;
  providerId?: string;
  reasoningLevel?: ReasoningLevel;
  modelId?: string;
  history?: ChatTurn[];
  attachments?: TextAttachment[];
}

export interface AgentRunResult {
  agentId: string;
  provider?: ProviderResponse;
  childResults: AgentRunResult[];
  skillResults: Array<{skillId: string; result: JsonValue}>;
}

export interface RuntimeEvent {
  type: string;
  message?: string;
  data?: JsonValue;
}
