import {Trace} from '@trace_api/trace';
import {TraceType} from '@trace_api/trace_type';
import {Traces} from '@trace_api/traces';
import {MediaBasedTraceEntry} from '@trace/media_based/media_based_trace_entry';

export interface DisplayEvidenceInput {
  video?: {
    frames: Array<{
      index: number;
      timestampMs: number;
      traceTimestampNs?: string;
      luma: number;
    }>;
    frameDiffs: Array<{fromIndex: number; toIndex: number; value: number}>;
    totalFrameCount: number;
    sampling: 'uniform' | 'contiguous';
    durationMs?: number;
    /** Legacy input compatibility only; sampled intervals are not a device frame rate. */
    frameRate?: number;
  };
  surfaceFlinger?: {
    summaryOnly: true;
    sampledEntryCount: number;
    notes?: string[];
  };
  windowManager?: {
    summaryOnly: true;
    sampledEntryCount: number;
    displayState: 'unknown';
    /** Legacy compatibility only; hierarchy names do not establish visibility. */
    visibleWindows?: string[];
    sampledNodeNames?: string[];
    notes?: string[];
  };
  transactions?: {
    count: number;
    summaryOnly: true;
    sampledEntryCount: number;
    sampleKeys?: string[];
    notes?: string[];
  };
  metadata: {
    traceTypes: string[];
    sampledFrameCount?: number;
    evidenceVersion: '1';
    evidenceLimitations: string[];
    captureConfiguration: 'unknown';
    dataSources: Array<{
      name: string;
      entryCount: number;
      firstTimestampNs?: string;
      lastTimestampNs?: string;
    }>;
    /** Union of imported source endpoints, not proof of synchronized coverage. */
    timeBounds?: {startTimestampNs: string; endTimestampNs: string};
    visualEvidence: {
      modelReceivedPixels: false;
      analysis: 'luma-and-frame-difference-only';
      sampling: 'uniform';
      sampleLimit: number;
      pixelSampleSize: number;
      totalFrameCount?: number;
    };
  };
}

const DEFAULT_SAMPLE_LIMIT = 24;
const SAMPLE_SIZE = 32;
const OVERVIEW_TIMEOUT_MS = 10_000;
const OVERVIEW_BYTE_LIMIT = 32 * 1024;
const HIERARCHY_NODE_LIMIT = 2048;
const SOURCE_LIMIT = 64;
const NAME_BYTE_LIMIT = 256;

/** One budget covers structure decoding, traversal, and all media operations. */
class OverviewBudget {
  private readonly deadline = Date.now() + OVERVIEW_TIMEOUT_MS;
  remainingNodes = HIERARCHY_NODE_LIMIT;

  constructor(private readonly limitations: string[]) {}

  note(reason: string): void {
    if (!this.limitations.includes(reason)) this.limitations.push(reason);
  }

  remainingMs(): number {
    const remaining = Math.max(0, this.deadline - Date.now());
    if (remaining === 0) {
      this.note(
        'Overview shared 10-second deadline reached; evidence is partial and remaining work was omitted.',
      );
    }
    return remaining;
  }

  check(): void {
    if (this.remainingMs() === 0) throw new Error('overview deadline');
  }

  async wait<T>(operation: () => Promise<T>): Promise<T> {
    this.check();
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      return await Promise.race([
        new Promise<never>((_, reject) => {
          timer = setTimeout(() => {
            this.note(
              'Overview shared 10-second deadline reached; evidence is partial and remaining work was omitted.',
            );
            reject(new Error('overview deadline'));
          }, this.remainingMs());
        }),
        operation(),
      ]);
    } finally {
      if (timer !== undefined) clearTimeout(timer);
    }
  }

  clip(value: string): string {
    // Inspect only a bounded prefix, preserving complete Unicode code points.
    let bytes = 0;
    let end = 0;
    for (const point of value) {
      const code = point.codePointAt(0)!;
      const size =
        code <= 0x7f ? 1 : code <= 0x7ff ? 2 : code <= 0xffff ? 3 : 4;
      if (bytes + size > NAME_BYTE_LIMIT) break;
      bytes += size;
      end += point.length;
    }
    if (end < value.length) {
      this.note(
        'Overview names and keys were clipped to the 256-byte UTF-8 limit.',
      );
    }
    return value.slice(0, end);
  }
}

function finishOverview(
  result: DisplayEvidenceInput,
  budget: OverviewBudget,
): void {
  const size = () => new TextEncoder().encode(JSON.stringify(result)).length;
  // All retained strings and collections are bounded before serialization.
  if (size() <= OVERVIEW_BYTE_LIMIT) return;
  budget.note(
    'Overview output was truncated to the 32 KiB UTF-8 JSON budget; omitted content is not evidence.',
  );
  const layerNames =
    result.surfaceFlinger?.notes?.findIndex((note) =>
      note.startsWith('layer/window names:'),
    ) ?? -1;
  if (layerNames >= 0) result.surfaceFlinger!.notes!.splice(layerNames, 1);
  while (size() > OVERVIEW_BYTE_LIMIT) {
    if (result.windowManager?.sampledNodeNames?.length) {
      result.windowManager.sampledNodeNames.pop();
    } else if (result.transactions?.sampleKeys?.length) {
      result.transactions.sampleKeys.pop();
    } else if (result.metadata.dataSources.length) {
      result.metadata.dataSources.pop();
      result.metadata.traceTypes.pop();
    } else {
      // Reserve the original caveats and final truncation reason.
      result.metadata.evidenceLimitations.splice(3, 1);
    }
  }
}

/** Builds bounded browser-side evidence without retaining raw trace/video bytes. */
export async function buildDisplayEvidence(
  traces: Traces,
  sampleLimit = DEFAULT_SAMPLE_LIMIT,
): Promise<DisplayEvidenceInput> {
  sampleLimit = Number.isFinite(sampleLimit)
    ? Math.max(0, Math.min(DEFAULT_SAMPLE_LIMIT, Math.floor(sampleLimit)))
    : DEFAULT_SAMPLE_LIMIT;
  const result: DisplayEvidenceInput = {
    metadata: {
      traceTypes: [],
      evidenceVersion: '1',
      sampledFrameCount: 0,
      captureConfiguration: 'unknown',
      dataSources: [],
      evidenceLimitations: [
        'Imported traces do not establish capture completeness, trace buffer configuration, dropped entries, or WindowManager log level.',
        'Source time bounds describe imported endpoints, not continuous or synchronized coverage across sources.',
        'The model receives no pixels; visual evidence contains only luminance and RGB frame differences from bounded 32x32 samples. Unsampled events and visual content cannot be established.',
      ],
      visualEvidence: {
        modelReceivedPixels: false,
        analysis: 'luma-and-frame-difference-only',
        sampling: 'uniform',
        sampleLimit,
        pixelSampleSize: SAMPLE_SIZE,
      },
    },
  };
  const budget = new OverviewBudget(result.metadata.evidenceLimitations);
  try {
    traces = addDataSources(traces, result, budget);
    const screenRecording = traces.getTrace<MediaBasedTraceEntry>(
      TraceType.SCREEN_RECORDING,
    );
    await addTraceStructureEvidence(traces, result, budget);
    const limitations = result.metadata.evidenceLimitations;
    if (!screenRecording) {
      limitations.push(
        'No screen recording is available; no visual samples were analyzed.',
      );
      return result;
    }
    result.metadata.visualEvidence.totalFrameCount =
      screenRecording.lengthEntries;
    if (screenRecording.lengthEntries === 0) {
      limitations.push(
        'The screen recording is empty; no visual samples were analyzed.',
      );
      return result;
    }

    const sampledVideo: NonNullable<DisplayEvidenceInput['video']> = {
      frames: [],
      frameDiffs: [],
      totalFrameCount: screenRecording.lengthEntries,
      sampling: 'uniform',
    };
    result.video = sampledVideo;
    const indices = sampledIndices(screenRecording.lengthEntries, sampleLimit);
    if (indices.length === 0) {
      limitations.push(
        'Video sampling is disabled by the zero sample limit; no visual samples were analyzed.',
      );
      return result;
    }
    const entries = await Promise.all(
      indices.map(async (index) => {
        try {
          const entry = screenRecording.getEntry(index);
          const value = await budget.wait(() => entry.getValue());
          if (!value) {
            limitations.push(
              `Screen recording sample at index ${index} is missing.`,
            );
            return undefined;
          }
          let traceTimestampNs = entry.hasValidTimestamp()
            ? entry.getTimestamp().getValueNs().toString()
            : undefined;
          if (traceTimestampNs && traceTimestampNs.length > NAME_BYTE_LIMIT) {
            traceTimestampNs = undefined;
            budget.note(
              'Oversized screen recording timestamps were omitted to respect the overview string budget.',
            );
          }
          if (traceTimestampNs === undefined) {
            limitations.push(
              `Screen recording sample at index ${index} has no valid trace timestamp.`,
            );
          }
          return {index: entry.getIndex(), traceTimestampNs, value};
        } catch {
          limitations.push(
            `Screen recording sample at index ${index} could not be read.`,
          );
          return undefined;
        }
      }),
    );
    const videoBlob = entries.find((entry) => entry?.value.frameData)?.value
      .frameData;
    if (!videoBlob) {
      limitations.push(
        'No video bytes are available in the selected screen recording samples.',
      );
      return result;
    }

    let video: HTMLVideoElement | undefined;
    let objectUrl: string | undefined;
    try {
      budget.check();
      video = document.createElement('video');
      video.muted = true;
      video.playsInline = true;
      video.preload = 'auto';
      objectUrl = URL.createObjectURL(videoBlob);
      video.src = objectUrl;
      await waitForMetadata(video, budget);
      sampledVideo.durationMs = Number.isFinite(video.duration)
        ? video.duration * 1000
        : undefined;
      const canvas = document.createElement('canvas');
      canvas.width = SAMPLE_SIZE;
      canvas.height = SAMPLE_SIZE;
      const context = canvas.getContext('2d', {willReadFrequently: true});
      if (!context) {
        limitations.push(
          'A canvas context is unavailable; no visual samples were analyzed.',
        );
        return result;
      }

      let previousPixels: Uint8ClampedArray | undefined;
      let previousIndex: number | undefined;
      for (const entry of entries) {
        if (budget.remainingMs() === 0) break;
        if (!entry) continue;
        try {
          if (
            !Number.isFinite(entry.value.videoTimeSeconds) ||
            entry.value.videoTimeSeconds < 0
          ) {
            throw new Error('invalid video time');
          }
          await seekVideo(video, entry.value.videoTimeSeconds, budget);
          budget.check();
          context.drawImage(video, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
          const pixels = context.getImageData(
            0,
            0,
            SAMPLE_SIZE,
            SAMPLE_SIZE,
          ).data;
          sampledVideo.frames.push({
            index: entry.index,
            timestampMs: entry.value.videoTimeSeconds * 1000,
            traceTimestampNs: entry.traceTimestampNs,
            luma: averageLuma(pixels),
          });
          if (previousPixels && previousIndex !== undefined) {
            sampledVideo.frameDiffs.push({
              fromIndex: previousIndex,
              toIndex: entry.index,
              value: averagePixelDifference(previousPixels, pixels),
            });
          }
          previousPixels = pixels;
          previousIndex = entry.index;
        } catch {
          limitations.push(
            `Screen recording sample at original index ${entry.index} could not be decoded or sampled.`,
          );
        }
      }
      sampledVideo.sampling =
        sampledVideo.frames.length > 0 &&
        sampledVideo.frames.length === sampledVideo.totalFrameCount &&
        sampledVideo.frames.every(
          (frame, index, frames) =>
            index === 0 || frame.index === frames[index - 1].index + 1,
        )
          ? 'contiguous'
          : 'uniform';
      result.metadata.sampledFrameCount = sampledVideo.frames.length;
      return result;
    } catch {
      limitations.push(
        'The screen recording could not be decoded or sampled (media error or timeout); structural evidence is preserved.',
      );
      return result;
    } finally {
      try {
        if (video) {
          video.pause();
          video.removeAttribute('src');
          video.load();
        }
      } catch {
        limitations.push('Screen recording media cleanup failed.');
      } finally {
        if (objectUrl) URL.revokeObjectURL(objectUrl);
      }
    }
  } finally {
    finishOverview(result, budget);
  }
}

function addDataSources(
  traces: Traces,
  result: DisplayEvidenceInput,
  budget: OverviewBudget,
): Traces {
  const included = new Traces();
  let startNs: bigint | undefined;
  let endNs: bigint | undefined;
  for (const trace of traces) {
    if (budget.remainingMs() === 0) break;
    if (included.getSize() === SOURCE_LIMIT) {
      budget.note(
        'Overview source limit of 64 reached; additional imported sources were omitted.',
      );
      break;
    }
    included.addTrace(trace);
    const name = TraceType[trace.type] ?? String(trace.type);
    const source: DisplayEvidenceInput['metadata']['dataSources'][number] = {
      name,
      entryCount: trace.lengthEntries,
    };
    result.metadata.traceTypes.push(name);
    result.metadata.dataSources.push(source);
    if (trace.lengthEntries === 0) continue;
    for (const [field, index] of [
      ['firstTimestampNs', 0],
      ['lastTimestampNs', trace.lengthEntries - 1],
    ] as const) {
      try {
        const entry = trace.getEntry(index);
        if (!entry.hasValidTimestamp()) throw new Error('invalid timestamp');
        const ns = entry.getTimestamp().getValueNs();
        const timestampNs = ns.toString();
        if (timestampNs.length > NAME_BYTE_LIMIT) {
          throw new Error('oversized timestamp');
        }
        source[field] = timestampNs;
        if (startNs === undefined || ns < startNs) startNs = ns;
        if (endNs === undefined || ns > endNs) endNs = ns;
      } catch {
        result.metadata.evidenceLimitations.push(
          `${name} endpoint timestamp ${field} is unavailable; time bounds may be incomplete.`,
        );
      }
    }
    if (trace.isCorrupted()) {
      result.metadata.evidenceLimitations.push(
        `${name} is marked corrupted; imported evidence may be incomplete.`,
      );
    }
  }
  if (startNs !== undefined && endNs !== undefined) {
    result.metadata.timeBounds = {
      startTimestampNs: startNs.toString(),
      endTimestampNs: endNs.toString(),
    };
  }
  return included;
}

async function addTraceStructureEvidence(
  traces: Traces,
  result: DisplayEvidenceInput,
  budget: OverviewBudget,
): Promise<void> {
  const surfaceFlinger = traces.getTrace(TraceType.SURFACE_FLINGER);
  const windowManager = traces.getTrace(TraceType.WINDOW_MANAGER);
  const transactions = traces.getTrace(TraceType.TRANSACTIONS);
  const limitations = result.metadata.evidenceLimitations;
  if (surfaceFlinger) {
    const summary = await summarizeHierarchyTrace(
      surfaceFlinger,
      limitations,
      budget,
    );
    result.surfaceFlinger = {
      summaryOnly: true,
      sampledEntryCount: summary.sampleCount,
      notes: [
        `sampled ${summary.sampleCount} entries`,
        `observed hierarchy nodes: ${summary.nodeCount}`,
        ...(summary.names.length > 0
          ? [`layer/window names: ${summary.names.join(', ')}`]
          : []),
        'node names do not establish visibility',
      ],
    };
    limitations.push(
      'SurfaceFlinger evidence is a bounded hierarchy summary, not actual snapshots or presentation/fence evidence.',
    );
  }
  if (windowManager) {
    const summary = await summarizeHierarchyTrace(
      windowManager,
      limitations,
      budget,
    );
    result.windowManager = {
      summaryOnly: true,
      sampledEntryCount: summary.sampleCount,
      displayState: 'unknown',
      sampledNodeNames: summary.names,
      notes: [
        `sampled ${summary.sampleCount} entries`,
        `observed hierarchy nodes: ${summary.nodeCount}`,
        'node names do not establish visibility',
      ],
    };
    limitations.push(
      'WindowManager evidence is a bounded hierarchy summary; visibility and display state are not inferred.',
    );
  }
  if (transactions) {
    const samples = await sampleEntryKeys(transactions, limitations, budget);
    result.transactions = {
      count: transactions.lengthEntries,
      summaryOnly: true,
      sampledEntryCount: samples.sampleCount,
      sampleKeys: samples.keys,
      notes: [`sampled ${samples.sampleCount} entries`],
    };
    limitations.push(
      'Transactions evidence contains only entry counts and sampled keys, not actual transaction snapshots.',
    );
  }
}

async function summarizeHierarchyTrace(
  trace: Trace<unknown>,
  limitations: string[],
  budget: OverviewBudget,
): Promise<{
  sampleCount: number;
  nodeCount: number;
  names: string[];
}> {
  const names = new Set<string>();
  let nodeCount = 0;
  let sampleCount = 0;
  for (const index of sampledIndices(trace.lengthEntries, 3)) {
    if (budget.remainingMs() === 0) break;
    if (budget.remainingNodes === 0) {
      budget.note(
        'Overview hierarchy traversal reached the shared 2048-node limit; hierarchy summaries are partial.',
      );
      break;
    }
    try {
      const value = await budget.wait(() => trace.getEntry(index).getValue());
      if (value === undefined || value === null) {
        throw new Error('missing entry');
      }
      const stack: unknown[] = [value];
      const visited = new Set<object>();
      while (
        stack.length > 0 &&
        budget.remainingMs() > 0 &&
        budget.remainingNodes > 0
      ) {
        const node = stack.pop();
        budget.remainingNodes--;
        if (!node || typeof node !== 'object') continue;
        if (visited.has(node)) {
          budget.note(
            'Overview hierarchy cycle or repeated node reference omitted.',
          );
          continue;
        }
        visited.add(node);
        nodeCount++;
        const candidate = node as {
          name?: unknown;
          getAllChildren?: () => readonly unknown[];
        };
        if (typeof candidate.getAllChildren !== 'function') continue;
        if (typeof candidate.name === 'string') {
          if (names.size < 32) {
            names.add(budget.clip(candidate.name));
          } else {
            budget.note(
              'Overview node name limit of 32 per hierarchy summary reached; additional names omitted.',
            );
          }
        }
        const children = candidate.getAllChildren();
        const count = Math.min(
          children.length,
          budget.remainingNodes - stack.length,
        );
        if (count < children.length) {
          budget.note(
            'Overview hierarchy traversal reached the shared 2048-node limit; hierarchy summaries are partial.',
          );
        }
        for (let child = count - 1; child >= 0; child--) {
          stack.push(children[child]);
        }
      }
      sampleCount++;
    } catch {
      limitations.push(
        `${TraceType[trace.type]} hierarchy sample at index ${index} could not be read.`,
      );
    }
  }
  return {sampleCount, nodeCount, names: [...names]};
}

async function sampleEntryKeys(
  trace: Trace<unknown>,
  limitations: string[],
  budget: OverviewBudget,
): Promise<{sampleCount: number; keys: string[]}> {
  const keys = new Set<string>();
  let sampleCount = 0;
  for (const index of sampledIndices(trace.lengthEntries, 3)) {
    if (budget.remainingMs() === 0) break;
    try {
      const value = await budget.wait(() => trace.getEntry(index).getValue());
      if (value === undefined || value === null) {
        throw new Error('missing entry');
      }
      sampleCount++;
      if (typeof value === 'object') {
        let count = 0;
        for (const key in value) {
          if (Object.prototype.hasOwnProperty.call(value, key)) {
            if (
              budget.remainingMs() === 0 ||
              count === 24 ||
              keys.size === 24
            ) {
              budget.note(
                'Overview transaction key limit reached; additional keys omitted.',
              );
              break;
            }
            count++;
            keys.add(budget.clip(key));
          }
        }
      }
    } catch {
      limitations.push(
        `${TraceType[trace.type]} key sample at index ${index} could not be read.`,
      );
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
  const count = Math.max(0, Math.min(length, Math.floor(limit)));
  if (count === 0) return [];
  if (count === 1) return [0];
  return Array.from({length: count}, (_, index) =>
    Math.min(length - 1, Math.round((index * (length - 1)) / (count - 1))),
  );
}

function waitForMetadata(
  video: HTMLVideoElement,
  budget: OverviewBudget,
): Promise<void> {
  budget.check();
  if (video.readyState >= 1) {
    return Promise.resolve();
  }
  return waitForMediaEvent(video, 'loadedmetadata', () => video.load(), budget);
}

function seekVideo(
  video: HTMLVideoElement,
  timeSeconds: number,
  budget: OverviewBudget,
): Promise<void> {
  budget.check();
  if (Math.abs(video.currentTime - timeSeconds) < 0.0001) {
    return Promise.resolve();
  }
  return waitForMediaEvent(
    video,
    'seeked',
    () => {
      video.currentTime = Math.max(0, timeSeconds);
    },
    budget,
  );
}

async function waitForMediaEvent(
  video: HTMLVideoElement,
  event: 'seeked' | 'loadedmetadata',
  start: () => void,
  budget: OverviewBudget,
): Promise<void> {
  let loaded: () => void = () => {};
  let failed: () => void = () => {};
  try {
    await budget.wait(
      () =>
        new Promise<void>((resolve, reject) => {
          loaded = resolve;
          failed = () => reject(new Error('screen recording media error'));
          video.addEventListener(event, loaded);
          video.addEventListener('error', failed);
          start();
        }),
    );
  } finally {
    video.removeEventListener(event, loaded);
    video.removeEventListener('error', failed);
  }
}
