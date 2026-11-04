/*
 * Copyright (C) 2026 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {INVALID_TIME_NS, Timestamp} from '@common/time/time';
import {Trace, TraceEntry} from '@trace_api/trace';
import {findCorrespondingEntry} from '@trace_api/trace_entry_finder';
import {TracePosition} from '@trace_api/trace_position';
import {TraceType} from '@trace_api/trace_type';
import {Traces} from '@trace_api/traces';
import {DataHierarchyTreeNode} from '@tree_node/hierarchy_tree_node';
import {PropertySource, PropertyTreeNode} from '@tree_node/property_tree_node';
import {TraceRect} from '@tree_node/trace_rect';

/** Omitted time uses the manual timeline position. Parsing belongs to the caller. */
export interface WinscopeTraceQuery {
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

export interface WinscopeTraceQueryOptions extends Omit<
  WinscopeTraceQuery,
  'time' | 'endTime'
> {
  endTimestamp?: Timestamp;
  /** Caller-supplied clock facts only; the service does not infer conversions. */
  clock?: {
    domain: 'REAL' | 'ELAPSED' | 'UNKNOWN';
    utcOffset?: string;
    bootTimeNs?: string;
    realTimeNs?: string;
  };
}

interface TraceBounds {
  firstTimestampNs?: string;
  lastTimestampNs?: string;
  count: number;
}

interface QueryCoverage {
  sourceIndex: number;
  traceType: string;
  selected: number;
  /** Observations inside range bounds or requested neighbor bounds, not physical frame matches.
   * null means the lookup failed, not that the range was empty.
   */
  available: number | null;
  hasMore: boolean | null;
  firstIndex?: number;
  nextIndex?: number;
  traceBounds?: TraceBounds;
  incompleteReasons: string[];
}

interface TargetSelection {
  filterSemantics: 'prioritize-target-retain-context';
  targets: Partial<Record<'layerId' | 'windowId' | 'displayId', string>>;
  matchedNodeIds: string[];
  missingReasons: string[];
}

export type WinscopeTraceJson =
  | null
  | boolean
  | number
  | string
  | WinscopeTraceJson[]
  | {[key: string]: WinscopeTraceJson};

export interface WinscopeTraceSnapshotEntry {
  traceType: string;
  /** Stable within this snapshot, including multiple traces of the same type. */
  sourceIndex: number;
  descriptors: string[];
  /** -1 and empty timestamp/time mean there is no matching entry. */
  index: number;
  timestampNs: string;
  time: string;
  match: string;
  /** Neighbors are chronological; matched identifies the viewer's primary entry. */
  role?: 'matched' | 'before' | 'after' | 'range';
  deltaNs?: string;
  framesRange?: {start: number; end: number};
  traceBounds?: TraceBounds;
  selection?: TargetSelection;
  idIndex?: Array<{
    field: 'transactionId' | 'transitionId';
    value: string | number;
    /** Path relative to this entry, into the retained serialized data. */
    dataPath: string;
  }>;
  data: WinscopeTraceJson;
  incompleteReasons: string[];
  truncated: boolean;
}

export interface WinscopeTraceSnapshot {
  schemaVersion: '1';
  mode: 'current' | 'timestamp';
  requestedTimestampNs: string;
  requestedTime: string;
  endTimestampNs?: string;
  queryType?: 'point' | 'neighbors' | 'range';
  clock?: NonNullable<WinscopeTraceQueryOptions['clock']>;
  capabilities?: {
    queryTypes: string[];
    limits: {
      maxOutputBytes: number;
      dataBytes: number;
      deadlineMs: number;
      maxTraces: number;
      maxBefore: number;
      maxAfter: number;
      defaultRangeLimit: number;
      maxRangeLimit: number;
      maxRangeEntries: number;
    };
    physicalFramesNotGuaranteed: true;
    rawMediaIncluded: false;
    captureOptions: 'unknown';
  };
  diagnostics?: {
    dataIncomplete: boolean;
    traceCount: number;
    queriedTraceCount: number;
  };
  /** Bounded number of sources requested after applying traceTypes. */
  requestedTraceCount?: number;
  rangeCoverage?: QueryCoverage[];
  neighborsCoverage?: QueryCoverage[];
  frameIndex?: number;
  activeTrace?: string;
  entries: WinscopeTraceSnapshotEntry[];
  incompleteReasons: string[];
  truncated: boolean;
  windowManager?: {
    status: 'available' | 'partial' | 'unavailable';
    entries: Array<{
      sourceIndex: number;
      index: number;
      requestedTimestampNs: string;
      timestampNs: string;
      time: string;
      deltaNs?: string;
      match: string;
      role?: WinscopeTraceSnapshotEntry['role'];
      dataPath: string;
      incompleteReasons: string[];
      truncated: boolean;
    }>;
    incompleteReasons: string[];
  };
}

/** New query results always include evidence fields; legacy snapshot fixtures remain valid. */
export interface WinscopeTraceQuerySnapshot extends WinscopeTraceSnapshot {
  queryType: NonNullable<WinscopeTraceSnapshot['queryType']>;
  clock: NonNullable<WinscopeTraceSnapshot['clock']>;
  capabilities: NonNullable<WinscopeTraceSnapshot['capabilities']>;
  diagnostics: NonNullable<WinscopeTraceSnapshot['diagnostics']>;
  requestedTraceCount: number;
}

const MAX_OUTPUT_BYTES = 96 * 1024;
const DATA_BYTES = 64 * 1024;
const MAX_TRACES = 128;
const MAX_ARRAY = 128;
const MAX_STRING = 2048;
const MAX_DEPTH = 24;
const QUERY_TIMEOUT_MS = 10_000;
const MAX_NEIGHBORS = 2;
const DEFAULT_RANGE_LIMIT = 5;
const MAX_RANGE_LIMIT = 8;
const MAX_RANGE_ENTRIES = 128;
const TARGET_FIELDS = ['layerId', 'windowId', 'displayId'] as const;
const QUERY_TRACE_TYPES = new Map<string, TraceType>([
  ['SURFACE_FLINGER', TraceType.SURFACE_FLINGER],
  ['WINDOW_MANAGER', TraceType.WINDOW_MANAGER],
  ['TRANSACTIONS', TraceType.TRANSACTIONS],
  ['TRANSITION', TraceType.TRANSITION],
  ['WM_TRANSITION', TraceType.WM_TRANSITION],
  ['SHELL_TRANSITION', TraceType.SHELL_TRANSITION],
  ['SCREEN_RECORDING', TraceType.SCREEN_RECORDING],
  ['SCREENSHOT', TraceType.SCREENSHOT],
  ['VIEW_CAPTURE', TraceType.VIEW_CAPTURE],
  ['PROTO_LOG', TraceType.PROTO_LOG],
]);
const encoder = new TextEncoder();

// The public hierarchy API only supports named eager reads, not enumeration.
// This fallback is deliberately partial; normal successful reads include ALL properties.
const EAGER_NAMES = [
  'id',
  'layerId',
  'nodeId',
  'parentId',
  'name',
  'className',
  'viewId',
  'isVisible',
  'isHidden',
  'flags',
  'type',
  'where',
  'displayId',
  'focusedDisplayId',
  'windowVisible',
  'decorViewVisible',
  'inputShown',
  'inputEditorInfo',
  'inputMethodManager',
  'editorInfo',
  'viewRootImpl',
  'curMethodId',
  'curFocusedWindowName',
  'lastImeTargetWindowName',
  'message',
  'tag',
  'level',
  'location',
  'ts',
  'transitionId',
  'transitionType',
  'status',
  'handler',
  'durationNs',
  'layers',
  'windows',
  'action',
  'keyCode',
  'deviceId',
  'source',
  'cujType',
  'canceled',
  'windowId',
  'token',
  'bufferData',
  'activeBuffer',
  'visibleRegion',
  'transform',
  'crop',
  'alpha',
  'z',
  'relativeZ',
  'zOrderRelativeOf',
  'transactionId',
];

class QueryTimeout extends Error {}

class ReadDeadline {
  private readonly end = Date.now() + QUERY_TIMEOUT_MS;

  expired(): boolean {
    return Date.now() >= this.end;
  }

  async read<T>(operation: () => Promise<T>): Promise<T> {
    if (this.expired()) throw new QueryTimeout();
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      return await Promise.race([
        Promise.resolve().then(operation),
        new Promise<never>((_, reject) => {
          timer = setTimeout(
            () => reject(new QueryTimeout()),
            this.end - Date.now(),
          );
        }),
      ]);
    } finally {
      clearTimeout(timer);
    }
  }
}

/** Reads viewer-corresponding entries without changing the timeline or active entry.
 * mode labels the request; the caller supplies the viewer's already-resolved position.
 * Parser APIs may populate their own normal lazy caches, and are not cancellable.
 */
export async function queryWinscopeTraceData(
  traces: Traces,
  position: TracePosition,
  mode: 'current' | 'timestamp' = 'current',
  options: WinscopeTraceQueryOptions = {},
): Promise<WinscopeTraceQuerySnapshot> {
  validateOptions(options, position.timestamp);
  const deadline = new ReadDeadline();
  const reasons = new Set<string>();
  const sources: Array<{trace: Trace<unknown>; sourceIndex: number}> = [];
  let sourceIndex = 0;
  let requestedTraceCount = 0;
  for (const trace of traces) {
    if (deadline.expired()) {
      reasons.add('query_deadline_exceeded');
      break;
    }
    const index = sourceIndex++;
    if (
      options.traceTypes &&
      !options.traceTypes.includes(TraceType[trace.type])
    ) {
      continue;
    }
    if (requestedTraceCount < MAX_TRACES) requestedTraceCount++;
    if (sources.length === MAX_TRACES) {
      reasons.add('trace_count_limit');
      break;
    }
    sources.push({trace, sourceIndex: index});
  }
  const queryType = options.endTimestamp
    ? 'range'
    : options.before || options.after
      ? 'neighbors'
      : 'point';
  const snapshot: WinscopeTraceQuerySnapshot = {
    schemaVersion: '1',
    mode,
    requestedTimestampNs: position.timestamp.getValueNs().toString(),
    requestedTime: formatTime(position.timestamp, reasons),
    ...(options.endTimestamp
      ? {
          endTimestampNs: options.endTimestamp.getValueNs().toString(),
          rangeCoverage: [],
        }
      : {}),
    queryType,
    ...(queryType === 'neighbors' ? {neighborsCoverage: []} : {}),
    clock: options.clock
      ? {
          domain: options.clock.domain,
          ...(options.clock.utcOffset !== undefined
            ? {utcOffset: options.clock.utcOffset}
            : {}),
          ...(options.clock.bootTimeNs !== undefined
            ? {bootTimeNs: options.clock.bootTimeNs}
            : {}),
          ...(options.clock.realTimeNs !== undefined
            ? {realTimeNs: options.clock.realTimeNs}
            : {}),
        }
      : {domain: 'UNKNOWN'},
    requestedTraceCount,
    capabilities: {
      queryTypes: ['point', 'neighbors', 'range'],
      limits: {
        maxOutputBytes: MAX_OUTPUT_BYTES,
        dataBytes: DATA_BYTES,
        deadlineMs: QUERY_TIMEOUT_MS,
        maxTraces: MAX_TRACES,
        maxBefore: MAX_NEIGHBORS,
        maxAfter: MAX_NEIGHBORS,
        defaultRangeLimit: DEFAULT_RANGE_LIMIT,
        maxRangeLimit: MAX_RANGE_LIMIT,
        maxRangeEntries: MAX_RANGE_ENTRIES,
      },
      physicalFramesNotGuaranteed: true,
      rawMediaIncluded: false,
      captureOptions: 'unknown',
    },
    diagnostics: {
      dataIncomplete: false,
      traceCount: traces.getSize(),
      queriedTraceCount: sources.length,
    },
    entries: [],
    incompleteReasons: [],
    truncated: reasons.size > 0,
  };
  if (position.frame !== undefined) snapshot.frameIndex = position.frame;
  if (position.entry) {
    snapshot.activeTrace = TraceType[position.entry.getFullTrace().type];
  }
  if (traces.getSize() === 0) reasons.add('no_loaded_traces');
  if (traces.getSize() && !sources.length) {
    reasons.add('no_matching_trace_types');
  }

  let remainingBytes = DATA_BYTES;
  for (const [ordinal, {trace, sourceIndex}] of sources.entries()) {
    let selected: Array<{
      value: TraceEntry<unknown>;
      role: WinscopeTraceSnapshotEntry['role'];
    }> = [];
    let bounds: TraceBounds | undefined;
    let lookupReason: string | undefined;
    const coverage: QueryCoverage | undefined = options.endTimestamp
      ? {
          sourceIndex,
          traceType: TraceType[trace.type],
          selected: 0,
          available: null,
          hasMore: null,
          incompleteReasons: [],
        }
      : undefined;
    if (coverage) snapshot.rangeCoverage!.push(coverage);
    const neighborsCoverage: QueryCoverage | undefined =
      queryType === 'neighbors'
        ? {
            sourceIndex,
            traceType: TraceType[trace.type],
            selected: 0,
            available: null,
            hasMore: null,
            incompleteReasons: [],
          }
        : undefined;
    if (neighborsCoverage) snapshot.neighborsCoverage!.push(neighborsCoverage);
    try {
      if (deadline.expired()) throw new QueryTimeout();
      bounds = {count: trace.lengthEntries};
      if (trace.lengthEntries) {
        const first = trace.getEntry(0);
        const last = trace.getEntry(-1);
        if (first.hasValidTimestamp()) {
          bounds.firstTimestampNs = first
            .getTimestamp()
            .getValueNs()
            .toString();
        }
        if (last.hasValidTimestamp()) {
          bounds.lastTimestampNs = last.getTimestamp().getValueNs().toString();
        }
      }
      if (coverage) {
        coverage.traceBounds = bounds;
        // Timestamp APIs include both endpoints without decoding any payloads.
        const first = trace.findFirstGreaterOrEqualEntry(position.timestamp);
        const last = trace.findLastLowerOrEqualEntry(options.endTimestamp!);
        const available =
          first &&
          last &&
          first.hasValidTimestamp() &&
          last.hasValidTimestamp() &&
          first.getIndex() <= last.getIndex()
            ? last.getIndex() - first.getIndex() + 1
            : 0;
        coverage.available = available;
        if (available) coverage.firstIndex = first!.getIndex();
        const count = Math.min(
          available,
          options.limit ?? DEFAULT_RANGE_LIMIT,
          MAX_RANGE_ENTRIES -
            snapshot.entries.length -
            (sources.length - ordinal - 1),
        );
        const offset = trace.lengthEntries ? trace.getEntry(0).getIndex() : 0;
        for (let i = 0; i < count; i++) {
          const value = trace.getEntry(first!.getIndex() - offset + i);
          if (
            !value.hasValidTimestamp() ||
            value.getTimestamp().getValueNs() <
              position.timestamp.getValueNs() ||
            value.getTimestamp().getValueNs() >
              options.endTimestamp!.getValueNs()
          ) {
            throw new Error('Invalid range timestamps');
          }
          selected.push({value, role: 'range'});
        }
        coverage.selected = count;
        coverage.hasMore = available > count;
        if (coverage.hasMore) {
          coverage.nextIndex = first!.getIndex() + count;
          coverage.incompleteReasons.push(
            count < Math.min(available, options.limit ?? DEFAULT_RANGE_LIMIT)
              ? 'global_range_entry_limit'
              : 'range_entry_limit',
          );
        }
      } else {
        // Preserve viewer dump, active-entry, frame and UI-pipeline semantics.
        const primary = findCorrespondingEntry(trace, position);
        if (primary) {
          selected.push({value: primary, role: 'matched'});
          const offset = trace.getEntry(0).getIndex();
          for (let i = 1; i <= (options.before ?? 0); i++) {
            const index = primary.getIndex() - offset - i;
            if (index >= 0 && index < trace.lengthEntries) {
              selected.push({value: trace.getEntry(index), role: 'before'});
            }
          }
          for (let i = 1; i <= (options.after ?? 0); i++) {
            const index = primary.getIndex() - offset + i;
            if (index >= 0 && index < trace.lengthEntries) {
              selected.push({value: trace.getEntry(index), role: 'after'});
            }
          }
          if (queryType === 'neighbors') {
            if (
              options.limit !== undefined &&
              selected.length > options.limit
            ) {
              // The viewer primary always wins; break equal-distance ties by index.
              const primaryNs = primary.getTimestamp().getValueNs();
              const distance = (value: TraceEntry<unknown>) => {
                const delta = value.getTimestamp().getValueNs() - primaryNs;
                return delta < 0n ? -delta : delta;
              };
              selected.sort((a, b) => {
                if (a.role === 'matched') return -1;
                if (b.role === 'matched') return 1;
                const delta = distance(a.value) - distance(b.value);
                return delta < 0n
                  ? -1
                  : delta > 0n
                    ? 1
                    : a.value.getIndex() - b.value.getIndex();
              });
              neighborsCoverage!.available = selected.length;
              selected = selected.slice(0, options.limit);
              neighborsCoverage!.incompleteReasons.push(
                'neighbors_entry_limit',
              );
            }
            selected.sort((a, b) => {
              const delta =
                a.value.getTimestamp().getValueNs() -
                b.value.getTimestamp().getValueNs();
              return delta < 0n
                ? -1
                : delta > 0n
                  ? 1
                  : a.value.getIndex() - b.value.getIndex();
            });
          }
        }
        if (neighborsCoverage) {
          neighborsCoverage.traceBounds = bounds;
          neighborsCoverage.available ??= selected.length;
          neighborsCoverage.selected = selected.length;
          neighborsCoverage.hasMore =
            neighborsCoverage.available > selected.length;
        }
      }
    } catch (error) {
      lookupReason =
        error instanceof QueryTimeout
          ? 'query_deadline_exceeded'
          : 'entry_lookup_failed';
      selected = [];
      if (coverage) {
        coverage.selected = 0;
        coverage.available = null;
        coverage.hasMore = null;
        coverage.incompleteReasons.push(lookupReason);
      }
      if (neighborsCoverage) {
        neighborsCoverage.selected = 0;
        neighborsCoverage.available = null;
        neighborsCoverage.hasMore = null;
        neighborsCoverage.incompleteReasons.push(lookupReason);
      }
    }
    coverage?.incompleteReasons.forEach((reason) => reasons.add(reason));
    neighborsCoverage?.incompleteReasons.forEach((reason) =>
      reasons.add(reason),
    );
    const sourceBudget = Math.floor(
      remainingBytes / (sources.length - ordinal),
    );
    const planned = selected.length ? selected : [undefined];
    for (const choice of planned) {
      const neighborsLimited =
        neighborsCoverage?.incompleteReasons.includes(
          'neighbors_entry_limit',
        ) ?? false;
      const entryReasons = new Set<string>(
        neighborsLimited ? ['neighbors_entry_limit'] : [],
      );
      const entry: WinscopeTraceSnapshotEntry = {
        traceType: TraceType[trace.type],
        sourceIndex,
        descriptors: [],
        index: -1,
        timestampNs: '',
        time: '',
        match: 'missing',
        role: choice?.role ?? (coverage ? 'range' : 'matched'),
        ...(bounds ? {traceBounds: bounds} : {}),
        data: null,
        incompleteReasons: [],
        truncated: neighborsLimited,
      };
      snapshot.entries.push(entry);
      const mark = (reason: string, truncated = false) => {
        entryReasons.add(reason);
        entry.truncated ||= truncated;
      };
      const serializer = new DataSerializer(
        Math.floor(sourceBudget / planned.length),
        deadline,
        mark,
        options,
        trace.type,
      );
      try {
        const descriptors = trace.getDescriptors();
        entry.descriptors = descriptors.slice(0, 4).map((value) => {
          if (value.length > 256) mark('descriptor_limit', true);
          return value.slice(0, 256);
        });
        if (descriptors.length > 4) mark('descriptor_limit', true);
        const selected = choice?.value;
        if (!selected) {
          mark(
            lookupReason ??
              (trace.lengthEntries === 0
                ? 'empty_trace'
                : coverage
                  ? coverage.available === 0
                    ? 'no_entries_in_range'
                    : 'global_range_entry_limit'
                  : 'no_matching_entry'),
            lookupReason === 'query_deadline_exceeded',
          );
        } else {
          entry.index = selected.getIndex();
          entry.timestampNs = selected.getTimestamp().getValueNs().toString();
          entry.time = formatTime(selected.getTimestamp(), entryReasons);
          entry.match = coverage
            ? 'range'
            : describeMatch(trace, selected, position);
          if (
            selected.hasValidTimestamp() &&
            position.timestamp.getValueNs() !== INVALID_TIME_NS
          ) {
            entry.deltaNs = (
              selected.getTimestamp().getValueNs() -
              position.timestamp.getValueNs()
            ).toString();
          }
          if (trace.hasFrameInfo()) {
            const frames = selected.getFramesRange();
            if (frames) {
              entry.framesRange = {start: frames.start, end: frames.end};
            }
          }
          if (!selected.hasValidTimestamp()) {
            mark(
              trace.isDump()
                ? 'dump_without_timestamp'
                : 'invalid_entry_timestamp',
            );
          }
          try {
            if (deadline.expired()) throw new QueryTimeout();
            if (trace.type === TraceType.SCREENSHOT) {
              // The screenshot parser creates an ImageBitmap during getValue().
              entry.data = {kind: 'media_metadata', videoTimeSeconds: null};
            } else if (trace.type === TraceType.SCREEN_RECORDING) {
              const value = await deadline.read(() => selected.getValue());
              // Never traverse frameData, thumbnail, frame, or any video/blob URL.
              const seconds = (
                value as {videoTimeSeconds?: unknown} | undefined
              )?.videoTimeSeconds;
              entry.data = {
                kind: 'media_metadata',
                videoTimeSeconds:
                  typeof seconds === 'number' && Number.isFinite(seconds)
                    ? seconds
                    : null,
              };
            } else {
              const value = await deadline.read(() => selected.getValue());
              await serializer.prepareTargets(value);
              entry.data = await serializer.serialize(value);
            }
          } catch (error) {
            mark(
              error instanceof QueryTimeout
                ? 'query_deadline_exceeded'
                : 'entry_decode_failed',
              error instanceof QueryTimeout,
            );
          }
        }
      } catch {
        mark('entry_lookup_failed');
      }
      remainingBytes -= serializer.usedBytes;
      entry.selection = serializer.selection;
      if (entry.selection) serializer.finishSelection();
      entry.incompleteReasons = [...entryReasons];
      entryReasons.forEach((reason) => reasons.add(reason));
      snapshot.truncated ||= entry.truncated;
    }
  }
  snapshot.incompleteReasons = [...reasons];
  enforceOutputLimit(snapshot);
  return snapshot;
}

function validateOptions(
  options: WinscopeTraceQueryOptions,
  start: Timestamp,
): void {
  for (const [name, max, min] of [
    ['before', MAX_NEIGHBORS, 0],
    ['after', MAX_NEIGHBORS, 0],
    ['limit', MAX_RANGE_LIMIT, 1],
  ] as const) {
    const value = options[name];
    if (
      value !== undefined &&
      (!Number.isInteger(value) || value < min || value > max)
    ) {
      throw new Error(
        `Invalid ${name}: expected an integer from ${min} to ${max}`,
      );
    }
  }
  if (
    options.traceTypes !== undefined &&
    (!Array.isArray(options.traceTypes) ||
      !options.traceTypes.length ||
      options.traceTypes.length > QUERY_TRACE_TYPES.size ||
      new Set(options.traceTypes).size !== options.traceTypes.length ||
      options.traceTypes.some(
        (name) => typeof name !== 'string' || !QUERY_TRACE_TYPES.has(name),
      ))
  ) {
    throw new Error(
      'Invalid traceTypes: expected unique allowlisted TraceType enum names',
    );
  }
  if (
    options.endTimestamp &&
    (start.getValueNs() === INVALID_TIME_NS ||
      options.endTimestamp.getValueNs() === INVALID_TIME_NS ||
      options.endTimestamp.getValueNs() < start.getValueNs())
  ) {
    throw new Error(
      'Invalid endTimestamp: expected a valid timestamp at or after start',
    );
  }
  for (const name of TARGET_FIELDS) {
    const value = options[name];
    if (
      value !== undefined &&
      (typeof value !== 'string' || !value.length || value.length > 256)
    ) {
      throw new Error(`Invalid ${name}`);
    }
  }
  if (options.clock) {
    if (!['REAL', 'ELAPSED', 'UNKNOWN'].includes(options.clock.domain)) {
      throw new Error('Invalid clock domain');
    }
    for (const key of ['utcOffset', 'bootTimeNs', 'realTimeNs'] as const) {
      const value = options.clock[key];
      if (
        value !== undefined &&
        (typeof value !== 'string' || value.length > 256)
      ) {
        throw new Error(`Invalid clock ${key}`);
      }
    }
  }
}

function formatTime(timestamp: Timestamp, reasons: Set<string>): string {
  if (timestamp.getValueNs() === INVALID_TIME_NS) {
    reasons.add('invalid_timestamp');
    return '';
  }
  try {
    const formatted = timestamp.format();
    if (formatted.length > 256) reasons.add('time_format_limit');
    return formatted.slice(0, 256);
  } catch {
    reasons.add('timestamp_format_failed');
    return '';
  }
}

function describeMatch(
  trace: Trace<unknown>,
  entry: TraceEntry<unknown>,
  position: TracePosition,
): string {
  if (trace.isDump()) {
    return entry.hasValidTimestamp() ? 'dump' : 'dump_without_timestamp';
  }
  if (position.entry === entry) return 'active_entry';
  if (position.frame !== undefined && trace.hasFrameInfo()) {
    const frames = entry.getFramesRange();
    if (
      frames &&
      frames.start <= position.frame &&
      position.frame < frames.end
    ) {
      return 'frame';
    }
  }
  const timestamp = entry.getTimestamp().getValueNs();
  const requested = position.timestamp.getValueNs();
  return timestamp === requested
    ? 'exact'
    : timestamp < requested
      ? 'before'
      : 'after';
}

class DataSerializer {
  usedBytes = 0;
  private hierarchyCount = 0;
  private propertyCount = 0;
  private valueCount = 0;
  private readonly ancestors = new WeakSet<object>();
  private readonly prioritized = new WeakSet<DataHierarchyTreeNode>();
  private readonly observedFields = new Set<string>();
  private readonly matchedFields = new Set<string>();
  private readonly matchedNodes = new WeakSet<DataHierarchyTreeNode>();
  readonly selection?: TargetSelection;

  constructor(
    private readonly maxBytes: number,
    private readonly deadline: ReadDeadline,
    private readonly mark: (reason: string, truncated?: boolean) => void,
    options: WinscopeTraceQueryOptions,
    private readonly traceType: TraceType,
  ) {
    const targets: TargetSelection['targets'] = {};
    for (const field of TARGET_FIELDS) {
      if (options[field] !== undefined) targets[field] = options[field];
    }
    if (Object.keys(targets).length) {
      this.selection = {
        filterSemantics: 'prioritize-target-retain-context',
        targets,
        matchedNodeIds: [],
        missingReasons: [],
      };
    }
  }

  /** Only eager public fields are used to prioritize, never names or class internals. */
  async prepareTargets(value: unknown): Promise<void> {
    if (!this.selection || !(value instanceof DataHierarchyTreeNode)) return;
    const parents = new Map<
      DataHierarchyTreeNode,
      DataHierarchyTreeNode | undefined
    >();
    const pending: Array<{
      node: DataHierarchyTreeNode;
      parent?: DataHierarchyTreeNode;
    }> = [{node: value}];
    let visited = 0;
    while (pending.length && visited < 2048 && !this.deadline.expired()) {
      const {node, parent} = pending.pop()!;
      if (parents.has(node)) continue;
      parents.set(node, parent);
      visited++;
      try {
        for (const field of TARGET_FIELDS) {
          if (node.id === this.selection.targets[field])
            {this.observeTarget(node, field, node.id);}
          const property = node.getEagerPropertyByName(field);
          if (property) this.observeTarget(node, field, property.getValue());
          if (
            field === 'windowId' &&
            this.traceType === TraceType.WINDOW_MANAGER
          ) {
            const token = node.getEagerPropertyByName('token');
            if (token) this.observeTarget(node, field, token.getValue());
          }
        }
        const children = node.getAllChildren();
        if (children.length > 2048) {
          this.selection.missingReasons.push('target_search_limit');
        }
        const count = Math.min(
          children.length,
          Math.max(0, 2048 - visited - pending.length),
        );
        if (count < children.length) {
          this.selection.missingReasons.push('target_search_limit');
        }
        for (let i = count - 1; i >= 0; i--) {
          pending.push({node: children[i], parent: node});
        }
      } catch {
        this.selection.missingReasons.push('target_field_read_failed');
      }
    }
    if (pending.length) {
      this.selection.missingReasons.push('target_search_incomplete');
    }
    // Prioritize matched branches and explicit z-parent context, retaining siblings.
    for (const node of parents.keys()) {
      if (!this.matchedNodes.has(node)) continue;
      const context = [node];
      try {
        const zParent = node.getZParent();
        if (zParent) context.push(zParent);
      } catch {
        this.selection.missingReasons.push('target_zparent_unknown');
      }
      for (let item of context) {
        const seen = new Set<DataHierarchyTreeNode>();
        while (item && !seen.has(item)) {
          seen.add(item);
          this.prioritized.add(item);
          const parent = parents.get(item);
          if (!parent) break;
          item = parent;
        }
      }
    }
    this.selection.missingReasons.push(
      'target_prioritization_eager_fields_only',
    );
  }

  finishSelection(): void {
    if (!this.selection) return;
    for (const field of TARGET_FIELDS) {
      if (
        this.selection.targets[field] === undefined ||
        this.matchedFields.has(field)
      ) {
        continue;
      }
      this.selection.missingReasons.push(
        this.observedFields.has(field)
          ? `${field}_target_not_found`
          : `${field}_unknown`,
      );
    }
    this.selection.missingReasons = [...new Set(this.selection.missingReasons)];
    if (
      this.selection.missingReasons.some(
        (reason) => reason !== 'target_prioritization_eager_fields_only',
      )
    ) {
      this.mark('target_selection_incomplete');
    }
  }

  private observeTarget(
    node: DataHierarchyTreeNode,
    field: string,
    value: unknown,
  ): void {
    if (field === 'token' && this.traceType === TraceType.WINDOW_MANAGER)
      {field = 'windowId';}
    if (
      !this.selection ||
      !TARGET_FIELDS.includes(field as (typeof TARGET_FIELDS)[number])
    ) {
      return;
    }
    if (!['string', 'number', 'bigint'].includes(typeof value)) return;
    this.observedFields.add(field);
    const key = field as (typeof TARGET_FIELDS)[number];
    if (
      this.selection.targets[key] !== undefined &&
      String(value) === this.selection.targets[key]
    ) {
      this.matchedFields.add(key);
      this.matchedNodes.add(node);
    }
  }

  async serialize(value: unknown, depth = 0): Promise<WinscopeTraceJson> {
    if (this.deadline.expired()) return this.omit('query_deadline_exceeded');
    if (depth > MAX_DEPTH) return this.omit('depth_limit');
    if (++this.valueCount > 4096) return this.omit('value_count_limit');
    if (!this.reserve(16)) return null;
    if (value === null || value === undefined) return null;
    if (typeof value === 'bigint') return this.string(value.toString(), false);
    if (typeof value === 'string') return this.string(value);
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') {
      if (Number.isFinite(value)) return value;
      this.mark('non_finite_number');
      return String(value);
    }
    if (typeof value !== 'object') return this.omit('unsupported_value');
    if (this.ancestors.has(value)) return this.omit('cycle');
    this.ancestors.add(value);
    try {
      if (value instanceof DataHierarchyTreeNode) {
        return await this.hierarchy(value, depth);
      }
      if (value instanceof PropertyTreeNode) {
        return await this.property(value, depth);
      }
      if (Array.isArray(value)) return await this.children(value, depth);
      // Accept data records, not parser/class internals, typed arrays, Blobs or media.
      const prototype = Object.getPrototypeOf(value);
      if (prototype !== Object.prototype && prototype !== null) {
        return this.omit('non_data_object_omitted');
      }
      const result: {[key: string]: WinscopeTraceJson} = {};
      let count = 0;
      for (const key of Object.keys(value)) {
        if (count++ === MAX_ARRAY) {
          this.omit('object_property_limit');
          break;
        }
        if (!this.reserve(16)) break;
        if (
          /^(?:_.*|parser|raw|rawData|rawBytes|blob|frameData|thumbnail|videoData|video|frame)$/i.test(
            key,
          )
        ) {
          this.omit('non_data_field_omitted');
          continue;
        }
        const descriptor = Object.getOwnPropertyDescriptor(value, key);
        if (!descriptor || !('value' in descriptor)) {
          this.omit('accessor_omitted');
          continue;
        }
        const name = this.string(key);
        if (name === null) break;
        // defineProperty keeps data keys such as __proto__ inert.
        Object.defineProperty(result, name, {
          value: await this.serialize(descriptor.value, depth + 1),
          enumerable: true,
        });
      }
      return result;
    } catch {
      this.mark('value_read_failed');
      return null;
    } finally {
      this.ancestors.delete(value);
    }
  }

  private async hierarchy(
    node: DataHierarchyTreeNode,
    depth: number,
  ): Promise<WinscopeTraceJson> {
    if (++this.hierarchyCount > 256) return this.omit('hierarchy_count_limit');
    if (!this.reserve(128)) return null;
    const result: {[key: string]: WinscopeTraceJson} = {
      kind: 'hierarchy',
      id: this.string(node.id),
      name: this.string(node.name),
      properties: null,
      children: [],
    };
    for (const [field, read] of [
      ['parentId', () => node.getParent()?.id ?? null],
      ['zParentId', () => node.getZParent()?.id ?? null],
      [
        'relativeChildIds',
        () => {
          const children = node.getRelativeChildren();
          if (children.length > MAX_ARRAY) this.omit('array_limit');
          return children.slice(0, MAX_ARRAY).map((child) => child.id);
        },
      ],
      ['rects', () => node.getRects()],
      ['secondaryRects', () => node.getSecondaryRects()],
      [
        'warnings',
        () => {
          const warnings = node.getWarnings();
          if (warnings.length > MAX_ARRAY) this.omit('array_limit');
          return warnings.slice(0, MAX_ARRAY).map((warning) => warning.message);
        },
      ],
    ] as const) {
      try {
        const value = read();
        result[field] =
          field === 'rects' || field === 'secondaryRects'
            ? await this.rects(value as TraceRect[], depth + 1)
            : await this.serialize(value, depth + 1);
      } catch {
        this.mark(`hierarchy_${field}_unknown`);
      }
    }
    try {
      const properties = await this.deadline.read(() =>
        node.getAllProperties(),
      );
      result['properties'] = await this.serialize(properties, 0);
    } catch (error) {
      this.mark(
        error instanceof QueryTimeout
          ? 'query_deadline_exceeded'
          : 'lazy_properties_failed',
        error instanceof QueryTimeout,
      );
      if (!this.deadline.expired()) {
        this.mark('eager_property_fallback_is_partial');
        const eager: WinscopeTraceJson[] = [];
        for (const name of EAGER_NAMES) {
          try {
            const property = node.getEagerPropertyByName(name);
            if (property) eager.push(await this.serialize(property, 0));
          } catch {
            this.mark('eager_property_read_failed');
          }
        }
        result['properties'] = eager;
      }
    }
    if (this.selection) {
      // Reuse bounded serialized properties; do not re-read getters or providers.
      const pending = [result['properties']];
      let visited = 0;
      while (pending.length && visited++ < 4096 && !this.deadline.expired()) {
        const property = pending.pop();
        if (!property || typeof property !== 'object') continue;
        if (Array.isArray(property)) {
          pending.push(...property);
        } else {
          if (
            property['kind'] === 'property' &&
            typeof property['name'] === 'string'
          ) {
            this.observeTarget(node, property['name'], property['value']);
          }
          pending.push(...Object.values(property));
        }
      }
    }
    if (
      this.selection &&
      this.matchedNodes.has(node) &&
      this.selection.matchedNodeIds.length < MAX_ARRAY
    ) {
      this.selection.matchedNodeIds.push(node.id);
    }
    try {
      const children = node.getAllChildren();
      if (this.selection) {
        // Keep target branches ahead of siblings without sorting unbounded arrays.
        const priority: DataHierarchyTreeNode[] = [];
        const siblings: DataHierarchyTreeNode[] = [];
        for (
          let i = 0;
          i < children.length && i < 2048 && !this.deadline.expired();
          i++
        ) {
          const child = children[i];
          if (this.prioritized.has(child)) priority.push(child);
          else if (siblings.length < MAX_ARRAY) siblings.push(child);
        }
        if (children.length > MAX_ARRAY) this.omit('array_limit');
        result['children'] = await this.children(
          [...priority, ...siblings],
          depth,
        );
      } else {
        result['children'] = await this.children(children, depth);
      }
    } catch {
      this.mark('hierarchy_children_failed');
    }
    return result;
  }

  private async rects(
    rects: TraceRect[],
    depth: number,
  ): Promise<WinscopeTraceJson> {
    if (rects.length > MAX_ARRAY) this.omit('array_limit');
    const result: WinscopeTraceJson[] = [];
    for (const rect of rects.slice(0, MAX_ARRAY)) {
      if (this.deadline.expired() || this.usedBytes >= this.maxBytes) break;
      const transform = rect.transform;
      const radii = rect.cornerRadii;
      if ((rect.fillRegion?.rects.length ?? 0) > MAX_ARRAY) {
        this.omit('array_limit');
      }
      result.push(
        await this.serialize(
          {
            id: rect.id,
            name: rect.name,
            x: rect.x,
            y: rect.y,
            w: rect.w,
            h: rect.h,
            groupId: rect.groupId,
            isVisible: rect.isVisible,
            isDisplay: rect.isDisplay,
            isActiveDisplay: rect.isActiveDisplay,
            depth: rect.depth,
            isSpy: rect.isSpy,
            ...(rect.opacity !== undefined ? {opacity: rect.opacity} : {}),
            transform: {
              dsdx: transform.dsdx,
              dtdx: transform.dtdx,
              tx: transform.tx,
              dtdy: transform.dtdy,
              dsdy: transform.dsdy,
              ty: transform.ty,
            },
            ...(radii
              ? {
                  cornerRadii: {
                    tl: radii.tl,
                    tr: radii.tr,
                    bl: radii.bl,
                    br: radii.br,
                  },
                }
              : {}),
            ...(rect.fillRegion
              ? {
                  fillRegion: {
                    rects: rect.fillRegion.rects
                      .slice(0, MAX_ARRAY)
                      .map((r) => ({x: r.x, y: r.y, w: r.w, h: r.h})),
                  },
                }
              : {}),
          },
          depth,
        ),
      );
    }
    return result;
  }

  private async property(
    node: PropertyTreeNode,
    depth: number,
  ): Promise<WinscopeTraceJson> {
    if (++this.propertyCount > 1024) return this.omit('property_count_limit');
    if (!this.reserve(128)) return null;
    const result: {[key: string]: WinscopeTraceJson} = {
      kind: 'property',
      id: this.string(node.id),
      name: this.string(node.name),
      source: PropertySource[node.source],
      value: null,
      children: [],
    };
    try {
      result['value'] = await this.serialize(node.getValue(), depth + 1);
    } catch {
      this.mark('property_value_failed');
    }
    try {
      const formatted = node.formattedValue();
      if (formatted) result['formattedValue'] = this.string(formatted);
    } catch {
      this.mark('property_format_failed');
    }
    try {
      result['children'] = await this.children(node.getAllChildren(), depth);
    } catch {
      this.mark('property_children_failed');
    }
    return result;
  }

  private async children(
    values: readonly unknown[],
    depth: number,
  ): Promise<WinscopeTraceJson[]> {
    const result: WinscopeTraceJson[] = [];
    if (values.length > MAX_ARRAY) this.omit('array_limit');
    for (let i = 0; i < Math.min(values.length, MAX_ARRAY); i++) {
      if (!this.reserve(4)) break;
      if (this.deadline.expired()) {
        this.omit('query_deadline_exceeded');
        break;
      }
      result.push(await this.serialize(values[i], depth + 1));
    }
    return result;
  }

  private string(value: string, clip = true): string | null {
    if (/^(?:data:|blob:)/i.test(value)) return this.omit('media_url_omitted');
    if (clip && value.length > MAX_STRING) {
      value = value.slice(0, MAX_STRING);
      this.omit('string_limit');
    }
    // Bigints are never rounded or clipped: if they cannot fit, omit explicitly.
    return this.reserve(encoder.encode(JSON.stringify(value)).length)
      ? value
      : null;
  }

  private reserve(bytes: number): boolean {
    if (this.usedBytes + bytes > this.maxBytes) {
      this.omit('data_size_limit');
      return false;
    }
    this.usedBytes += bytes;
    return true;
  }

  private omit(reason: string): null {
    this.mark(reason, true);
    return null;
  }
}

function enforceOutputLimit(snapshot: WinscopeTraceQuerySnapshot): void {
  const size = () => {
    refreshEvidence(snapshot);
    addWindowManagerTimeEvidence(snapshot);
    return encoder.encode(JSON.stringify(snapshot)).length;
  };
  if (size() <= MAX_OUTPUT_BYTES) return;
  snapshot.truncated = true;
  if (!snapshot.incompleteReasons.includes('serialized_output_limit')) {
    snapshot.incompleteReasons.push('serialized_output_limit');
  }
  // Descriptors can dominate with many sources; keep sourceIndex/traceType and
  // useful data before considering dropping an entry entirely.
  for (const entry of [...snapshot.entries].reverse()) {
    if (size() <= MAX_OUTPUT_BYTES) return;
    if (entry.descriptors.length === 0) continue;
    entry.descriptors = [];
    entry.truncated = true;
    entry.incompleteReasons.push('serialized_output_limit');
  }
  // Defensive final gate includes metadata, JSON escaping, and multi-byte UTF-8.
  // Discard the largest payload first, retaining entry identity and diagnostics.
  const largestFirst = [...snapshot.entries].sort(
    (a, b) =>
      encoder.encode(JSON.stringify(b.data)).length -
      encoder.encode(JSON.stringify(a.data)).length,
  );
  for (const entry of largestFirst) {
    if (size() <= MAX_OUTPUT_BYTES) return;
    entry.data = null;
    entry.truncated = true;
    entry.incompleteReasons.push('serialized_output_limit');
  }
  while (snapshot.entries.length && size() > MAX_OUTPUT_BYTES) {
    snapshot.entries.pop();
  }
  size();
}

/** Recompute references after limiting, never retain an index into omitted data. */
function refreshEvidence(snapshot: WinscopeTraceQuerySnapshot): void {
  const reasons = new Set(snapshot.incompleteReasons);
  for (const entry of snapshot.entries) {
    entry.idIndex = collectIds(entry.data);
    entry.incompleteReasons.forEach((reason) => reasons.add(reason));
  }
  for (const coverage of [
    ...(snapshot.rangeCoverage ?? []),
    ...(snapshot.neighborsCoverage ?? []),
  ]) {
    const retained = snapshot.entries.filter(
      (entry) => entry.sourceIndex === coverage.sourceIndex && entry.index >= 0,
    );
    if (retained.length < coverage.selected) {
      if (snapshot.queryType === 'range') {
        coverage.nextIndex = retained.length
          ? retained[retained.length - 1].index + 1
          : coverage.firstIndex;
      }
      coverage.selected = retained.length;
      coverage.hasMore = true;
      coverage.incompleteReasons.push('serialized_output_limit');
    }
    for (const entry of retained) {
      entry.incompleteReasons.forEach((reason) => {
        if (!coverage.incompleteReasons.includes(reason)) {
          coverage.incompleteReasons.push(reason);
        }
      });
    }
    coverage.incompleteReasons.forEach((reason) => reasons.add(reason));
  }
  snapshot.incompleteReasons = [...reasons];
  snapshot.diagnostics.dataIncomplete = snapshot.truncated || reasons.size > 0;
}

function collectIds(
  data: WinscopeTraceJson,
): WinscopeTraceSnapshotEntry['idIndex'] {
  const result: NonNullable<WinscopeTraceSnapshotEntry['idIndex']> = [];
  let visited = 0;
  const visit = (value: WinscopeTraceJson, path: string) => {
    if (
      ++visited > 4096 ||
      result.length >= 32 ||
      !value ||
      typeof value !== 'object'
    ) {
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((child, index) => visit(child, `${path}.${index}`));
      return;
    }
    const add = (field: string, id: WinscopeTraceJson, dataPath: string) => {
      if (
        (field === 'transactionId' || field === 'transitionId') &&
        (typeof id === 'number' || typeof id === 'string') &&
        String(id).length <= 256 &&
        result.length < 32
      ) {
        result.push({field, value: id, dataPath});
      }
    };
    if (value['kind'] === 'property' && typeof value['name'] === 'string') {
      add(value['name'], value['value'], `${path}.value`);
    }
    for (const [key, child] of Object.entries(value)) {
      add(key, child, `${path}.${key}`);
      visit(child, `${path}.${key}`);
    }
  };
  visit(data, 'data');
  return result.length ? result : undefined;
}

/** Reference the bounded payload rather than duplicating large window hierarchies. */
function addWindowManagerTimeEvidence(snapshot: WinscopeTraceSnapshot): void {
  const reasons = new Set<string>();
  let readable = false;
  const entries = snapshot.entries.flatMap((entry, index) => {
    if (entry.traceType !== 'WINDOW_MANAGER') return [];
    const coverage = snapshot.rangeCoverage?.find(
      (item) => item.sourceIndex === entry.sourceIndex,
    );
    const entryReasons = [
      ...new Set([
        ...entry.incompleteReasons,
        ...(coverage?.incompleteReasons ?? []),
      ]),
    ];
    const hasData =
      entry.index >= 0 && entry.match !== 'missing' && entry.data !== null;
    readable ||= hasData;
    if (!hasData && !entryReasons.length) {
      entryReasons.push('window_manager_data_unavailable');
    }
    const timed =
      /^\d{1,128}$/.test(entry.timestampNs) &&
      BigInt(entry.timestampNs) > 0n &&
      /^\d{1,128}$/.test(snapshot.requestedTimestampNs) &&
      BigInt(snapshot.requestedTimestampNs) > 0n;
    if (
      !timed &&
      !entryReasons.includes('window_manager_timestamp_unavailable')
    ) {
      entryReasons.push('window_manager_timestamp_unavailable');
    }
    entryReasons.forEach((reason) => reasons.add(reason));
    return [
      {
        sourceIndex: entry.sourceIndex,
        index: entry.index,
        requestedTimestampNs: snapshot.requestedTimestampNs,
        timestampNs: entry.timestampNs,
        time: entry.time,
        ...(timed
          ? {
              deltaNs: (
                BigInt(entry.timestampNs) -
                BigInt(snapshot.requestedTimestampNs)
              ).toString(),
            }
          : {}),
        match: entry.match,
        role: entry.role,
        dataPath: `entries.${index}.data`,
        incompleteReasons: entryReasons,
        truncated: entry.truncated,
      },
    ];
  });
  if (!entries.length) reasons.add('window_manager_trace_not_loaded');
  snapshot.windowManager = {
    status: !readable
      ? 'unavailable'
      : entries.some(
            (entry) => entry.truncated || entry.incompleteReasons.length,
          )
        ? 'partial'
        : 'available',
    entries,
    incompleteReasons: [...reasons],
  };
}
