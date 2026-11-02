import {EvidenceAnalysisResult, EvidenceFinding, EvidenceInput, VideoFrame} from './types';

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
  const findings: EvidenceFinding[] = [];
  for (const run of blackRuns(frames)) {
    if (run.length >= 2) findings.push({kind: 'black-screen', severity: run.length >= 5 ? 'critical' : 'warning', title: 'Black-screen candidate', reason: `Video evidence contains ${run.length} consecutive low-luma frames.`, frameIndexes: run, evidence: ['video.luma', ...(input.windowManager?.displayState ? ['window_manager.display_state'] : [])]});
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
  if (!input.windowManager) incompleteReasons.push('WindowManager evidence is missing');
  if (!input.transactions) incompleteReasons.push('Transactions evidence is missing');
  return {schemaVersion: '1', deterministic: true, complete: incompleteReasons.length === 0, incompleteReasons, coverage: {video: Boolean(input.video), frameLuma: hasLuma, frameDiff: hasDiff, surfaceFlinger: Boolean(input.surfaceFlinger), windowManager: Boolean(input.windowManager), transactions: Boolean(input.transactions)}, findings};
}
