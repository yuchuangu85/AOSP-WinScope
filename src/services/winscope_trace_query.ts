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

/** Omitted time uses the manual timeline position. Parsing belongs to the caller. */
export interface WinscopeTraceQuery {
  time?: string;
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
  data: WinscopeTraceJson;
  incompleteReasons: string[];
  truncated: boolean;
}

export interface WinscopeTraceSnapshot {
  schemaVersion: '1';
  mode: 'current' | 'timestamp';
  requestedTimestampNs: string;
  requestedTime: string;
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
      dataPath: string;
      incompleteReasons: string[];
      truncated: boolean;
    }>;
    incompleteReasons: string[];
  };
}

const MAX_OUTPUT_BYTES = 96 * 1024;
const DATA_BYTES = 64 * 1024;
const MAX_TRACES = 128;
const MAX_ARRAY = 128;
const MAX_STRING = 2048;
const MAX_DEPTH = 24;
const QUERY_TIMEOUT_MS = 10_000;
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
): Promise<WinscopeTraceSnapshot> {
  const deadline = new ReadDeadline();
  const reasons = new Set<string>();
  const snapshot: WinscopeTraceSnapshot = {
    schemaVersion: '1',
    mode,
    requestedTimestampNs: position.timestamp.getValueNs().toString(),
    requestedTime: formatTime(position.timestamp, reasons),
    entries: [],
    incompleteReasons: [],
    truncated: false,
  };
  if (position.frame !== undefined) snapshot.frameIndex = position.frame;
  if (position.entry) {
    snapshot.activeTrace = TraceType[position.entry.getFullTrace().type];
  }
  if (traces.getSize() === 0) reasons.add('no_loaded_traces');
  if (traces.getSize() > MAX_TRACES) {
    reasons.add('trace_count_limit');
    snapshot.truncated = true;
  }

  let remainingBytes = DATA_BYTES;
  for (const trace of traces) {
    if (snapshot.entries.length === MAX_TRACES) break;
    const entryReasons = new Set<string>();
    const entry: WinscopeTraceSnapshotEntry = {
      traceType: TraceType[trace.type],
      sourceIndex: snapshot.entries.length,
      descriptors: [],
      index: -1,
      timestampNs: '',
      time: '',
      match: 'missing',
      data: null,
      incompleteReasons: [],
      truncated: false,
    };
    snapshot.entries.push(entry);
    const mark = (reason: string, truncated = false) => {
      entryReasons.add(reason);
      entry.truncated ||= truncated;
    };
    const serializer = new DataSerializer(
      Math.floor(
        remainingBytes /
          (Math.min(traces.getSize(), MAX_TRACES) - entry.sourceIndex),
      ),
      deadline,
      mark,
    );
    try {
      const descriptors = trace.getDescriptors();
      entry.descriptors = descriptors.slice(0, 4).map((value) => {
        if (value.length > 256) mark('descriptor_limit', true);
        return value.slice(0, 256);
      });
      if (descriptors.length > 4) mark('descriptor_limit', true);
      // Do not replace this with a nearest-timestamp lookup: viewers also use
      // dump, active-entry, frame, and UI-pipeline ordering semantics here.
      const selected = findCorrespondingEntry(trace, position);
      if (!selected) {
        mark(trace.lengthEntries === 0 ? 'empty_trace' : 'no_matching_entry');
      } else {
        entry.index = selected.getIndex();
        entry.timestampNs = selected.getTimestamp().getValueNs().toString();
        entry.time = formatTime(selected.getTimestamp(), entryReasons);
        entry.match = describeMatch(trace, selected, position);
        if (!selected.hasValidTimestamp()) {
          mark(
            trace.isDump()
              ? 'dump_without_timestamp'
              : 'invalid_entry_timestamp',
          );
        }
        try {
          if (deadline.expired()) throw new QueryTimeout();
          const value = await deadline.read(() => selected.getValue());
          if (
            trace.type === TraceType.SCREEN_RECORDING ||
            trace.type === TraceType.SCREENSHOT
          ) {
            // Never traverse frameData, thumbnail, frame, or any video/blob URL.
            const seconds = (value as {videoTimeSeconds?: unknown} | undefined)
              ?.videoTimeSeconds;
            entry.data = {
              kind: 'media_metadata',
              videoTimeSeconds:
                typeof seconds === 'number' && Number.isFinite(seconds)
                  ? seconds
                  : null,
            };
          } else {
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
    entry.incompleteReasons = [...entryReasons];
    entryReasons.forEach((reason) => reasons.add(reason));
    snapshot.truncated ||= entry.truncated;
  }
  snapshot.incompleteReasons = [...reasons];
  enforceOutputLimit(snapshot);
  return snapshot;
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

  constructor(
    private readonly maxBytes: number,
    private readonly deadline: ReadDeadline,
    private readonly mark: (reason: string, truncated?: boolean) => void,
  ) {}

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
    try {
      result['children'] = await this.children(node.getAllChildren(), depth);
    } catch {
      this.mark('hierarchy_children_failed');
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

function enforceOutputLimit(snapshot: WinscopeTraceSnapshot): void {
  const size = () => {
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
}

/** Reference the bounded payload rather than duplicating large window hierarchies. */
function addWindowManagerTimeEvidence(snapshot: WinscopeTraceSnapshot): void {
  const reasons = new Set<string>();
  let readable = false;
  const entries = snapshot.entries.flatMap((entry, index) => {
    if (entry.traceType !== 'WINDOW_MANAGER') return [];
    const entryReasons = [...entry.incompleteReasons];
    const hasData = entry.index >= 0 && entry.match !== 'missing' && entry.data !== null;
    readable ||= hasData;
    if (!hasData && !entryReasons.length) entryReasons.push('window_manager_data_unavailable');
    const timed = /^\d{1,128}$/.test(entry.timestampNs) && BigInt(entry.timestampNs) > 0n &&
      /^\d{1,128}$/.test(snapshot.requestedTimestampNs) && BigInt(snapshot.requestedTimestampNs) > 0n;
    if (!timed && !entryReasons.includes('window_manager_timestamp_unavailable')) {
      entryReasons.push('window_manager_timestamp_unavailable');
    }
    entryReasons.forEach((reason) => reasons.add(reason));
    return [{sourceIndex: entry.sourceIndex, index: entry.index,
      requestedTimestampNs: snapshot.requestedTimestampNs, timestampNs: entry.timestampNs,
      time: entry.time, ...(timed ? {deltaNs: (BigInt(entry.timestampNs) - BigInt(snapshot.requestedTimestampNs)).toString()} : {}),
      match: entry.match, dataPath: `entries.${index}.data`,
      incompleteReasons: entryReasons, truncated: entry.truncated}];
  });
  if (!entries.length) reasons.add('window_manager_trace_not_loaded');
  snapshot.windowManager = {
    status: !readable ? 'unavailable' : entries.some((entry) => entry.truncated || entry.incompleteReasons.length) ? 'partial' : 'available',
    entries,
    incompleteReasons: [...reasons],
  };
}
