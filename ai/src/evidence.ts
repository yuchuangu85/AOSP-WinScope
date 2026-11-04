import {EvidenceAnalysisResult, EvidenceFinding, EvidenceInput, VideoFrame} from './types';
import {isRecord} from './json';

function positiveTimestamp(value: unknown): value is string {
  return typeof value === 'string' && value.length <= 128 && /^[0-9]+$/.test(value) && BigInt(value) > 0n;
}

function isIncomplete(value: Record<string, unknown>): boolean {
  return (value.truncated !== undefined && value.truncated !== false) ||
    (value.incompleteReasons !== undefined && (!Array.isArray(value.incompleteReasons) || value.incompleteReasons.length > 0)) ||
    value.failed === true || value.error != null;
}

const DESCRIPTOR_KEYS = new Set(['name', 'kind', 'type', 'id', 'layerId', 'windowId', 'displayId',
  'parentId', 'zParentId', 'nodeId', 'className', 'viewId', 'traceType', 'descriptors', 'metadata',
  'sourceIndex', 'index', 'timestampNs', 'requestedTimestampNs', 'time', 'match', 'deltaNs', 'dataPath',
  'incompleteReasons', 'truncated', 'status', 'role', 'summaryOnly', 'count', 'sampleKeys', 'notes',
  'names', 'sampledNodeNames', 'nodeCount', 'sampleCount', 'presentedFrameCount', 'bufferLatches', 'visibleWindows',
  'source', 'formattedValue', 'warnings', 'relativeChildIds']);

function hasTraceData(value: unknown, depth = 0): boolean {
  if (depth > 32) return false;
  if (Array.isArray(value)) return value.some((item) => hasTraceData(item, depth + 1));
  if (!isRecord(value) || value.summaryOnly === true) return false;
  if (value.kind === 'property') {
    const observed = !DESCRIPTOR_KEYS.has(value.name as string) && value.value != null &&
      (typeof value.value !== 'object' || hasTraceData(value.value, depth + 1));
    return observed || hasTraceData(value.children, depth + 1);
  }
  // Descriptors and summary counts establish presence, not state observations.
  return Object.keys(value).some((key) => !DESCRIPTOR_KEYS.has(key) &&
    value[key] != null && (typeof value[key] !== 'object'
      ? !(key === 'displayState' && value[key] === 'unknown')
      : Array.isArray(value[key]) && !['children', 'properties', 'entries', 'layers', 'windows', 'transactions'].includes(key)
        ? (value[key] as unknown[]).some((item) => item != null && (typeof item !== 'object' || hasTraceData(item, depth + 1)))
        : hasTraceData(value[key], depth + 1)));
}

function validEntryTime(entry: Record<string, unknown>, requested: unknown): boolean {
  if (!positiveTimestamp(requested) || !positiveTimestamp(entry.timestampNs)) return false;
  const timestamp = BigInt(entry.timestampNs);
  const target = BigInt(requested);
  // Neighbors are relative to the matched entry, which itself may precede or
  // follow the requested position. Their match describes their own association.
  if (entry.role !== undefined && !['matched', 'before', 'after', 'range'].includes(entry.role as string)) return false;
  return (entry.match === 'exact' && timestamp === target) ||
    (entry.match === 'before' && timestamp < target) ||
    (entry.match === 'after' && timestamp > target) ||
    ['active_entry', 'frame', 'dump'].includes(entry.match as string) ||
    (entry.role === 'range' && entry.match === 'range');
}

function sourceRangesComplete(snapshot: Record<string, unknown>, traceType: string, entries: Record<string, unknown>[]): boolean {
  if (snapshot.rangeCoverage === undefined) return true;
  if (!Array.isArray(snapshot.rangeCoverage)) return false;
  const sources = new Set(entries.map((entry) => entry.sourceIndex));
  const seen = new Set<unknown>();
  // Range limits belong to their source, not every trace in the snapshot.
  return snapshot.rangeCoverage.every((coverage) => {
    if (!isRecord(coverage)) return false;
    if (coverage.traceType !== traceType && !sources.has(coverage.sourceIndex)) return true;
    if (coverage.traceType !== traceType || seen.has(coverage.sourceIndex)) return false;
    seen.add(coverage.sourceIndex);
    return Number.isInteger(coverage.sourceIndex) && (coverage.sourceIndex as number) >= 0 &&
      coverage.hasMore === false && !isIncomplete(coverage) &&
      Number.isInteger(coverage.selected) && (coverage.selected as number) >= 0 &&
      coverage.available === coverage.selected &&
      entries.filter((entry) => entry.sourceIndex === coverage.sourceIndex && entry.match !== 'missing').length === coverage.selected;
  });
}

function traceCoverage(input: EvidenceInput, traceType: string, legacy: unknown): {available: boolean; complete: boolean} {
  const snapshot = isRecord(input.winscope) ? input.winscope : undefined;
  if (snapshot?.schemaVersion !== '1' || !Array.isArray(snapshot.entries)) {
    const available = hasTraceData(legacy);
    return {available, complete: available && isRecord(legacy) && !isIncomplete(legacy)};
  }
  const entries = snapshot.entries.filter((entry) => isRecord(entry) && entry.traceType === traceType);
  const actual = entries.filter((entry) => isRecord(entry) && Number.isInteger(entry.index) &&
    (entry.index as number) >= 0 && entry.match !== 'missing' && hasTraceData(entry.data));
  return {available: actual.length > 0, complete: actual.length > 0 && actual.length === entries.length &&
    sourceRangesComplete(snapshot, traceType, entries as Record<string, unknown>[]) &&
    !snapshot.failed && snapshot.error == null && (snapshot.mode === 'current' || snapshot.mode === 'timestamp') &&
    actual.every((entry) => isRecord(entry) && Number.isInteger(entry.sourceIndex) && (entry.sourceIndex as number) >= 0 &&
      typeof entry.time === 'string' && entry.time.length > 0 && validEntryTime(entry, snapshot.requestedTimestampNs) && !isIncomplete(entry))};
}

function windowManagerCoverage(input: EvidenceInput): {available: boolean; complete: boolean} {
  // A current snapshot takes precedence over a potentially stale legacy summary.
  const snapshot = isRecord(input.winscope) ? input.winscope : undefined;
  if (snapshot === undefined || (input.windowManager &&
      (snapshot.schemaVersion !== '1' || !Array.isArray(snapshot.entries)))) {
    const available = hasTraceData(input.windowManager);
    return {available, complete: available && isRecord(input.windowManager) && !isIncomplete(input.windowManager)};
  }
  const entries = Array.isArray(snapshot.entries) ? snapshot.entries : [];
  const wmEntries = entries.flatMap((entry, position) =>
    isRecord(entry) && entry.traceType === 'WINDOW_MANAGER' ? [{entry, position}] : []);
  const actualEntries = wmEntries.filter(({entry}) =>
    Number.isInteger(entry.index) && (entry.index as number) >= 0 && entry.match !== 'missing' && hasTraceData(entry.data));
  if (actualEntries.length === 0) return {available: false, complete: false};

  const requested = snapshot.requestedTimestampNs;
  // Aggregate snapshot reasons/truncation include unrelated traces. WM-specific
  // loss is reflected in its entries and reference metadata by the serializer.
  let complete = snapshot.schemaVersion === '1' &&
    (snapshot.mode === 'current' || snapshot.mode === 'timestamp') &&
    positiveTimestamp(requested) && snapshot.failed !== true && snapshot.error == null && actualEntries.length === wmEntries.length &&
    sourceRangesComplete(snapshot, 'WINDOW_MANAGER', wmEntries.map(({entry}) => entry));
  for (const {entry} of actualEntries) {
    complete &&= validEntryTime(entry, requested) && Number.isInteger(entry.sourceIndex) && (entry.sourceIndex as number) >= 0 &&
      typeof entry.time === 'string' && entry.time.length > 0 && !isIncomplete(entry);
  }

  // Metadata can qualify raw data, but cannot substitute for it or upgrade it.
  const metadata = snapshot.windowManager;
  if (metadata !== undefined) {
    complete &&= isRecord(metadata) && metadata.status === 'available' && !isIncomplete(metadata) &&
      Array.isArray(metadata.entries) && metadata.entries.length === wmEntries.length &&
      wmEntries.every(({entry, position}) => {
        const refs = (metadata.entries as unknown[]).filter((ref) => isRecord(ref) && ref.dataPath === `entries.${position}.data`);
        if (refs.length !== 1 || !isRecord(refs[0])) return false;
        const ref = refs[0];
        return ref.sourceIndex === entry.sourceIndex && ref.index === entry.index &&
          ref.requestedTimestampNs === requested && ref.timestampNs === entry.timestampNs &&
          ref.time === entry.time && ref.match === entry.match && (ref.role === undefined || ref.role === entry.role) && !isIncomplete(ref) &&
          (ref.deltaNs === undefined || (positiveTimestamp(entry.timestampNs) && positiveTimestamp(requested) &&
            ref.deltaNs === (BigInt(entry.timestampNs) - BigInt(requested)).toString()));
      });
  }
  return {available: true, complete};
}

function frameLuma(frame: VideoFrame): number | undefined {
  const value = frame.luma ?? frame.averageLuma;
  return typeof value === 'number' && Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : undefined;
}

function blackRuns(frames: VideoFrame[]): number[][] {
  const runs: number[][] = [];
  let current: number[] = [];
  for (const frame of frames) {
    const black = Number.isInteger(frame.index) && frame.index >= 0 && frameLuma(frame) !== undefined && frameLuma(frame)! <= 0.08;
    if (current.length > 0 && (!black || frame.index !== current[current.length - 1] + 1)) {
      runs.push(current);
      current = [];
    }
    if (black) current.push(frame.index);
  }
  if (current.length > 0) runs.push(current);
  return runs;
}

export function analyzeDisplayEvidence(input: EvidenceInput = {}): EvidenceAnalysisResult {
  const frames = input.video?.frames ?? [];
  const diffs = input.video?.frameDiffs ?? [];
  const hasLuma = frames.some((frame) => frameLuma(frame) !== undefined);
  const hasDiff = diffs.length > 0;
  const wm = windowManagerCoverage(input);
  const sf = traceCoverage(input, 'SURFACE_FLINGER', input.surfaceFlinger);
  const transactions = traceCoverage(input, 'TRANSACTIONS', input.transactions);
  const sparse = input.video?.sampling === 'uniform' || frames.some((frame, index) =>
    !Number.isInteger(frame.index) || frame.index < 0 || (index > 0 && frame.index !== frames[index - 1].index + 1)) ||
    diffs.some((item) => typeof item !== 'number' && item.toIndex !== item.fromIndex + 1);
  const sampled = sparse || (input.video?.sampling !== undefined && input.video.totalFrameCount === undefined) ||
    (input.video?.totalFrameCount !== undefined &&
    (input.video.totalFrameCount !== frames.length || frames[0]?.index !== 0));
  const findings: EvidenceFinding[] = [];
  for (const run of blackRuns(frames)) {
    if (run.length >= 2) findings.push({kind: 'black-screen', severity: run.length >= 5 ? 'critical' : 'warning', title: 'Black-screen candidate', reason: `Video evidence contains ${run.length} consecutive low-luma frames.`, frameIndexes: run, evidence: ['video.luma', ...(!input.winscope && wm.available && ['on', 'off'].includes(input.windowManager?.displayState ?? '') ? ['window_manager.display_state'] : [])]});
  }
  const flickerIndexes = diffs.flatMap((item) => {
    const value = typeof item === 'number' ? item : item.value;
    if (!Number.isFinite(value) || value < 0.2) return [];
    return typeof item === 'number' || !Number.isInteger(item.fromIndex) || item.fromIndex < 0 ||
      !Number.isInteger(item.toIndex) || item.toIndex <= item.fromIndex ? [] : [item.fromIndex, item.toIndex];
  });
  if (flickerIndexes.length >= 2) findings.push({kind: 'flicker', severity: 'warning', title: 'Flicker candidate', reason: sparse
    ? `Video evidence contains ${flickerIndexes.length / 2} high-difference sampled transitions, not proof of flicker or its interval.`
    : `Video evidence contains ${flickerIndexes.length / 2} high-difference frame transitions.`, frameIndexes: [...new Set(flickerIndexes)], evidence: ['video.frame_diff']});
  const incompleteReasons: string[] = [];
  if (!input.video) incompleteReasons.push('screen recording evidence is missing');
  if (!hasLuma) incompleteReasons.push('video luminance evidence is missing');
  if (!hasDiff) incompleteReasons.push('video frame-difference evidence is missing');
  if (sparse) incompleteReasons.push('video sampling is sparse; single-frame anomalies may be missed');
  else if (sampled) incompleteReasons.push('video sampling is incomplete; unsampled frames may contain anomalies');
  if (!sf.available) incompleteReasons.push('SurfaceFlinger evidence is missing');
  else if (!sf.complete) incompleteReasons.push('SurfaceFlinger evidence is incomplete');
  if (!wm.available) incompleteReasons.push('WindowManager evidence is missing');
  else if (!wm.complete) incompleteReasons.push('WindowManager evidence is incomplete');
  if (!transactions.available) incompleteReasons.push('Transactions evidence is missing');
  else if (!transactions.complete) incompleteReasons.push('Transactions evidence is incomplete');
  return {schemaVersion: '1', deterministic: true, complete: incompleteReasons.length === 0, incompleteReasons, coverage: {video: Boolean(input.video), frameLuma: hasLuma, frameDiff: hasDiff, surfaceFlinger: sf.available, windowManager: wm.available, transactions: transactions.available}, findings};
}
