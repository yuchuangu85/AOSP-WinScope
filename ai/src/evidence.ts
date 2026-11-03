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

function hasWindowManagerData(value: unknown): boolean {
  if (Array.isArray(value)) return value.length > 0;
  // Names/descriptors alone establish trace presence, not a WM state observation.
  return isRecord(value) && Object.keys(value).some((key) =>
    !['name', 'kind', 'id', 'traceType', 'descriptors', 'metadata', 'sourceIndex', 'index',
      'timestampNs', 'requestedTimestampNs', 'time', 'match', 'deltaNs', 'dataPath',
      'incompleteReasons', 'truncated', 'status'].includes(key) && value[key] != null);
}

function windowManagerCoverage(input: EvidenceInput): {available: boolean; complete: boolean} {
  // A current snapshot takes precedence over a potentially stale legacy summary.
  const snapshot = isRecord(input.winscope) ? input.winscope : undefined;
  if (snapshot === undefined || (input.windowManager &&
      (snapshot.schemaVersion !== '1' || !Array.isArray(snapshot.entries)))) {
    const available = Boolean(input.windowManager);
    return {available, complete: available};
  }
  const entries = Array.isArray(snapshot.entries) ? snapshot.entries : [];
  const wmEntries = entries.flatMap((entry, position) =>
    isRecord(entry) && entry.traceType === 'WINDOW_MANAGER' ? [{entry, position}] : []);
  const actualEntries = wmEntries.filter(({entry}) =>
    Number.isInteger(entry.index) && (entry.index as number) >= 0 && entry.match !== 'missing' && hasWindowManagerData(entry.data));
  if (actualEntries.length === 0) return {available: false, complete: false};

  const requested = snapshot.requestedTimestampNs;
  // Aggregate snapshot reasons/truncation include unrelated traces. WM-specific
  // loss is reflected in its entries and reference metadata by the serializer.
  let complete = snapshot.schemaVersion === '1' &&
    (snapshot.mode === 'current' || snapshot.mode === 'timestamp') &&
    positiveTimestamp(requested) && snapshot.failed !== true && snapshot.error == null && actualEntries.length === wmEntries.length;
  for (const {entry} of actualEntries) {
    const timestamp = entry.timestampNs;
    const timed = positiveTimestamp(requested) && positiveTimestamp(timestamp);
    const match = timed && (
      (entry.match === 'exact' && BigInt(timestamp) === BigInt(requested)) ||
      (entry.match === 'before' && BigInt(timestamp) < BigInt(requested)) ||
      (entry.match === 'after' && BigInt(timestamp) > BigInt(requested)) ||
      ['active_entry', 'frame', 'dump'].includes(entry.match as string));
    complete &&= Boolean(match) && Number.isInteger(entry.sourceIndex) && (entry.sourceIndex as number) >= 0 &&
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
          ref.time === entry.time && ref.match === entry.match && !isIncomplete(ref) &&
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
    if (frameLuma(frame) !== undefined && frameLuma(frame)! <= 0.08) current.push(frame.index);
    else if (current.length > 0) { runs.push(current); current = []; }
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
  const findings: EvidenceFinding[] = [];
  for (const run of blackRuns(frames)) {
    if (run.length >= 2) findings.push({kind: 'black-screen', severity: run.length >= 5 ? 'critical' : 'warning', title: 'Black-screen candidate', reason: `Video evidence contains ${run.length} consecutive low-luma frames.`, frameIndexes: run, evidence: ['video.luma', ...(!input.winscope && input.windowManager?.displayState ? ['window_manager.display_state'] : [])]});
  }
  const flickerIndexes = diffs.flatMap((item) => {
    const value = typeof item === 'number' ? item : item.value;
    if (value < 0.2) return [];
    return typeof item === 'number' ? [] : [item.fromIndex, item.toIndex];
  });
  if (flickerIndexes.length >= 2) findings.push({kind: 'flicker', severity: 'warning', title: 'Flicker candidate', reason: `Video evidence contains ${flickerIndexes.length / 2} high-difference frame transitions.`, frameIndexes: [...new Set(flickerIndexes)], evidence: ['video.frame_diff']});
  const incompleteReasons: string[] = [];
  if (!input.video) incompleteReasons.push('screen recording evidence is missing');
  if (!hasLuma) incompleteReasons.push('video luminance evidence is missing');
  if (!hasDiff) incompleteReasons.push('video frame-difference evidence is missing');
  if (!input.surfaceFlinger) incompleteReasons.push('SurfaceFlinger evidence is missing');
  if (!wm.available) incompleteReasons.push('WindowManager evidence is missing');
  else if (!wm.complete) incompleteReasons.push('WindowManager evidence is incomplete');
  if (!input.transactions) incompleteReasons.push('Transactions evidence is missing');
  return {schemaVersion: '1', deterministic: true, complete: incompleteReasons.length === 0, incompleteReasons, coverage: {video: Boolean(input.video), frameLuma: hasLuma, frameDiff: hasDiff, surfaceFlinger: Boolean(input.surfaceFlinger), windowManager: wm.available, transactions: Boolean(input.transactions)}, findings};
}
