export type JsonObject = {[key: string]: JsonValue};
export type JsonValue = null | boolean | number | string | JsonValue[] | JsonObject;

export type ReasoningLevel = 'low' | 'medium' | 'high';

export interface ProviderConfiguration {
  baseUrl: string;
  providerName: string;
  apiKeyEnv: string;
  timeoutMs: number;
}

export interface AiSelection {
  agentId: string;
  providerId: string;
  modelId: string;
  customModel: string;
  reasoningLevel: ReasoningLevel;
}

export interface LocalConfigMetadata {
  baseUrl?: string;
  providerName?: string;
  authentication: 'configured' | 'cli-managed' | 'not-configured';
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
  configuration?: ProviderConfiguration;
  configured?: boolean;
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
  onReasoning?: (delta: string) => void;
  reasoningLevel?: ReasoningLevel;
  history?: ChatTurn[];
  signal?: AbortSignal;
  timeoutMs?: number;
}

export interface ProviderResponse {
  providerId: string;
  output: string;
  reasoning?: string;
  durationMs: number;
  exitCode?: number;
  timedOut?: boolean;
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
  jsonEvents?: boolean;
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
  configurationKind?: 'codex' | 'claude';
  importedApiKeyEnv?: string;
  importedProviderId?: string;
  importedCommandAuth?: boolean;
  configuration?: ProviderConfiguration;
  configurationOverrides?: Partial<ProviderConfiguration>;
  configured?: boolean;
  platform?: NodeJS.Platform;
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
  configuration?: ProviderConfiguration;
  configurationOverrides?: Partial<ProviderConfiguration>;
  configured?: boolean;
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
  traceTimestampNs?: string;
  luma?: number;
  averageLuma?: number;
}

export interface VideoEvidence {
  frames?: VideoFrame[];
  frameDiffs?: Array<number | {fromIndex: number; toIndex: number; value: number}>;
  durationMs?: number;
  frameRate?: number;
  totalFrameCount?: number;
  sampling?: 'uniform' | 'contiguous';
  clockDomain?: string;
}

export interface SurfaceFlingerEvidence {
  summaryOnly?: boolean;
  presentedFrameCount?: number;
  frameTimesMs?: number[];
  bufferLatches?: number;
  notes?: string[];
}

export interface WindowManagerEvidence {
  summaryOnly?: boolean;
  sampledNodeNames?: string[];
  displayState?: 'on' | 'off' | 'unknown';
  focusedWindow?: string;
  visibleWindows?: string[];
  transitions?: Array<{timestampMs?: number; type: string}>;
}

export interface TransactionEvidence {
  summaryOnly?: boolean;
  count?: number;
  sampleKeys?: string[];
  notes?: string[];
}

export type WinscopeTraceSnapshotEntry = JsonObject & {
  traceType: string;
  sourceIndex: number;
  index: number;
  timestampNs: string;
  time: string;
  match: string;
  role?: 'matched' | 'before' | 'after' | 'range';
  data: JsonValue;
  incompleteReasons: string[];
  truncated: boolean;
};

export type WinscopeTraceSnapshot = JsonObject & {
  schemaVersion: '1';
  mode: 'current' | 'timestamp';
  requestedTimestampNs: string;
  entries: WinscopeTraceSnapshotEntry[];
  incompleteReasons: string[];
  truncated: boolean;
  windowManager?: JsonObject & {
    status: 'available' | 'partial' | 'unavailable';
    entries: Array<JsonObject & {
      sourceIndex: number;
      index: number;
      requestedTimestampNs: string;
      timestampNs: string;
      time: string;
      deltaNs?: string;
      match: string;
      role?: 'matched' | 'before' | 'after' | 'range';
      dataPath: string;
      incompleteReasons: string[];
      truncated: boolean;
    }>;
    incompleteReasons: string[];
  };
};

export interface EvidenceInput {
  video?: VideoEvidence;
  surfaceFlinger?: SurfaceFlingerEvidence;
  windowManager?: WindowManagerEvidence;
  transactions?: TransactionEvidence;
  metadata?: JsonObject;
  // Kept open for older generic snapshots; validate timed WM data at consumption.
  winscope?: JsonObject;
}

export interface TraceDataQuery {
  time?: string;
  endTime?: string;
  before?: number;
  after?: number;
  limit?: number;
  traceTypes?: string[];
  layerId?: string;
  windowId?: string;
  displayId?: string;
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
    // An actual observation is available, possibly partial; not causal proof.
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
  queryTrace?: (query: TraceDataQuery) => Promise<JsonObject>;
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
