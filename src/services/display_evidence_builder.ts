import {Trace} from '@trace_api/trace';
import {TraceType} from '@trace_api/trace_type';
import {Traces} from '@trace_api/traces';
import {MediaBasedTraceEntry} from '@trace/media_based/media_based_trace_entry';

export interface DisplayEvidenceInput {
  video?: {
    frames: Array<{index: number; timestampMs: number; luma: number}>;
    frameDiffs: Array<{fromIndex: number; toIndex: number; value: number}>;
    durationMs?: number;
    frameRate?: number;
  };
  surfaceFlinger?: {notes?: string[]};
  windowManager?: {
    displayState: 'unknown';
    visibleWindows?: string[];
    notes?: string[];
  };
  transactions?: {count: number; sampleKeys?: string[]; notes?: string[]};
  metadata: {
    traceTypes: string[];
    sampledFrameCount?: number;
    evidenceVersion: '1';
  };
}

const DEFAULT_SAMPLE_LIMIT = 24;
const SAMPLE_SIZE = 32;

/** Builds bounded browser-side evidence without retaining raw trace/video bytes. */
export async function buildDisplayEvidence(
  traces: Traces,
  sampleLimit = DEFAULT_SAMPLE_LIMIT,
): Promise<DisplayEvidenceInput> {
  const traceTypes: string[] = [];
  traces.forEachTrace((trace) =>
    traceTypes.push(TraceType[trace.type] ?? String(trace.type)),
  );
  const result: DisplayEvidenceInput = {
    metadata: {traceTypes, evidenceVersion: '1'},
  };
  const screenRecording = traces.getTrace<MediaBasedTraceEntry>(
    TraceType.SCREEN_RECORDING,
  );
  await addTraceStructureEvidence(traces, result);
  if (!screenRecording || screenRecording.lengthEntries === 0) return result;

  const indices = sampledIndices(screenRecording.lengthEntries, sampleLimit);
  const entries = await Promise.all(
    indices.map((index) => screenRecording.getEntry(index).getValue()),
  );
  const videoBlob = entries.find((entry) => entry?.frameData)?.frameData;
  if (!videoBlob) {
    result.metadata.sampledFrameCount = 0;
    return result;
  }

  const video = document.createElement('video');
  video.muted = true;
  video.playsInline = true;
  video.preload = 'auto';
  const objectUrl = URL.createObjectURL(videoBlob);
  video.src = objectUrl;
  try {
    await waitForMetadata(video);
    const canvas = document.createElement('canvas');
    canvas.width = SAMPLE_SIZE;
    canvas.height = SAMPLE_SIZE;
    const context = canvas.getContext('2d', {willReadFrequently: true});
    if (!context) return result;

    const frames: Array<{index: number; timestampMs: number; luma: number}> =
      [];
    const frameDiffs: Array<{
      fromIndex: number;
      toIndex: number;
      value: number;
    }> = [];
    let previousPixels: Uint8ClampedArray | undefined;
    for (let i = 0; i < indices.length; i++) {
      const entry = entries[i];
      if (!entry) {
        continue;
      }
      await seekVideo(video, entry.videoTimeSeconds);
      context.drawImage(video, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
      const pixels = context.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE).data;
      frames.push({
        index: indices[i],
        timestampMs: entry.videoTimeSeconds * 1000,
        luma: averageLuma(pixels),
      });
      if (previousPixels) {
        frameDiffs.push({
          fromIndex: indices[i - 1],
          toIndex: indices[i],
          value: averagePixelDifference(previousPixels, pixels),
        });
      }
      previousPixels = pixels;
    }
    result.video = {
      frames,
      frameDiffs,
      durationMs: Number.isFinite(video.duration)
        ? video.duration * 1000
        : undefined,
      frameRate: frames.length > 1 ? estimateFrameRate(frames) : undefined,
    };
    result.metadata.sampledFrameCount = frames.length;
    return result;
  } finally {
    video.pause();
    video.removeAttribute('src');
    video.load();
    URL.revokeObjectURL(objectUrl);
  }
}

async function addTraceStructureEvidence(
  traces: Traces,
  result: DisplayEvidenceInput,
): Promise<void> {
  const surfaceFlinger = traces.getTrace(TraceType.SURFACE_FLINGER);
  const windowManager = traces.getTrace(TraceType.WINDOW_MANAGER);
  const transactions = traces.getTrace(TraceType.TRANSACTIONS);
  if (surfaceFlinger) {
    const summary = await summarizeHierarchyTrace(surfaceFlinger);
    result.surfaceFlinger = {
      notes: [
        `sampled ${summary.sampleCount} entries`,
        `observed hierarchy nodes: ${summary.nodeCount}`,
        ...(summary.names.length > 0
          ? [`layer/window names: ${summary.names.join(', ')}`]
          : []),
      ],
    };
  }
  if (windowManager) {
    const summary = await summarizeHierarchyTrace(windowManager);
    result.windowManager = {
      displayState: 'unknown',
      visibleWindows: summary.names,
      notes: [
        `sampled ${summary.sampleCount} entries`,
        `observed hierarchy nodes: ${summary.nodeCount}`,
      ],
    };
  }
  if (transactions) {
    const samples = await sampleEntryKeys(transactions);
    result.transactions = {
      count: transactions.lengthEntries,
      sampleKeys: samples.keys,
      notes: [`sampled ${samples.sampleCount} entries`],
    };
  }
}

async function summarizeHierarchyTrace(
  trace: Trace<unknown>,
): Promise<{
  sampleCount: number;
  nodeCount: number;
  names: string[];
  signals: string[];
}> {
  const names = new Set<string>();
  const signals = new Set<string>();
  let nodeCount = 0;
  let sampleCount = 0;
  for (const index of sampledIndices(trace.lengthEntries, 3)) {
    const value = await trace.getEntry(index).getValue();
    sampleCount++;
    const candidate = value as {
      forEachNodeDfs?: (
        callback: (node: {name?: string}, depth: number) => void,
      ) => void;
    };
    if (typeof candidate?.forEachNodeDfs === 'function') {
      candidate.forEachNodeDfs((node) => {
        nodeCount++;
        const propertyNode = node as {
          getEagerPropertyByName?: (name: string) => unknown;
        };
        for (const key of [
          'vsyncId',
          'bufferData',
          'acquireFence',
          'presentFence',
          'releaseFence',
        ]) {
          if (
            typeof propertyNode.getEagerPropertyByName === 'function' &&
            propertyNode.getEagerPropertyByName(key) !== undefined
          ) {
            signals.add(key);
          }
        }
        if (typeof node.name === 'string' && names.size < 32) {
          names.add(node.name);
        }
      });
    } else if (value && typeof value === 'object') {
      nodeCount++;
      for (const key of Object.keys(value).slice(0, 16)) names.add(key);
    }
  }
  return {sampleCount, nodeCount, names: [...names], signals: [...signals]};
}

async function sampleEntryKeys(
  trace: Trace<unknown>,
): Promise<{sampleCount: number; keys: string[]}> {
  const keys = new Set<string>();
  let sampleCount = 0;
  for (const index of sampledIndices(trace.lengthEntries, 3)) {
    const value = await trace.getEntry(index).getValue();
    sampleCount++;
    if (value && typeof value === 'object') {
      for (const key of Object.keys(value).slice(0, 24)) keys.add(key);
    }
  }
  return {sampleCount, keys: [...keys]};
}

export function averageLuma(pixels: Uint8ClampedArray): number {
  if (pixels.length === 0) return 0;
  let total = 0;
  let count = 0;
  for (let i = 0; i + 2 < pixels.length; i += 4) {
    total +=
      (0.2126 * pixels[i] + 0.7152 * pixels[i + 1] + 0.0722 * pixels[i + 2]) /
      255;
    count++;
  }
  return count === 0 ? 0 : total / count;
}

export function averagePixelDifference(
  left: Uint8ClampedArray,
  right: Uint8ClampedArray,
): number {
  const length = Math.min(left.length, right.length);
  if (length === 0) return 0;
  let total = 0;
  for (let i = 0; i < length; i += 4) {
    total +=
      Math.abs(left[i] - right[i]) +
      Math.abs(left[i + 1] - right[i + 1]) +
      Math.abs(left[i + 2] - right[i + 2]);
  }
  return total / Math.max(1, Math.floor(length / 4) * 3 * 255);
}

function sampledIndices(length: number, limit: number): number[] {
  const count = Math.max(1, Math.min(length, Math.floor(limit)));
  if (count === 1) return [0];
  return Array.from({length: count}, (_, index) =>
    Math.min(length - 1, Math.round((index * (length - 1)) / (count - 1))),
  );
}

function estimateFrameRate(
  frames: Array<{timestampMs: number}>,
): number | undefined {
  const duration =
    frames[frames.length - 1].timestampMs - frames[0].timestampMs;
  return duration > 0 ? ((frames.length - 1) * 1000) / duration : undefined;
}

function waitForMetadata(video: HTMLVideoElement): Promise<void> {
  if (video.readyState >= 1) {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(
      () => reject(new Error('screen recording metadata timeout')),
      10_000,
    );
    video.addEventListener(
      'loadedmetadata',
      () => {
        window.clearTimeout(timer);
        resolve();
      },
      {once: true},
    );
    video.addEventListener(
      'error',
      () => {
        window.clearTimeout(timer);
        reject(new Error('screen recording could not be decoded'));
      },
      {once: true},
    );
    video.load();
  });
}

function seekVideo(
  video: HTMLVideoElement,
  timeSeconds: number,
): Promise<void> {
  if (Math.abs(video.currentTime - timeSeconds) < 0.0001) {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(
      () => reject(new Error('screen recording seek timeout')),
      10_000,
    );
    video.addEventListener(
      'seeked',
      () => {
        window.clearTimeout(timer);
        resolve();
      },
      {once: true},
    );
    video.addEventListener(
      'error',
      () => {
        window.clearTimeout(timer);
        reject(new Error('screen recording seek failed'));
      },
      {once: true},
    );
    video.currentTime = Math.max(0, timeSeconds);
  });
}
