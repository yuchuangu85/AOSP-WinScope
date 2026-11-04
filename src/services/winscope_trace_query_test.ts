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

import {CornerRadii} from '@common/geometry/corner_radii';
import {Rect} from '@common/geometry/rect';
import {Region} from '@common/geometry/region';
import {TransformMatrix} from '@common/geometry/transform_matrix';
import {makeRealTimestamp, makeZeroTimestamp,} from '@common/time/testing/test_helpers';
import {ParserBuilder} from '@trace_api/testing/parser_builder';
import {TraceBuilder} from '@trace_api/testing/trace_builder';
import {Trace} from '@trace_api/trace';
import {findCorrespondingEntry} from '@trace_api/trace_entry_finder';
import {TracePosition} from '@trace_api/trace_position';
import {TraceType} from '@trace_api/trace_type';
import {Traces} from '@trace_api/traces';
import {VideoEntry} from '@trace/media_based/media_based_trace_entry';
import {HierarchyTreeNode} from '@tree_node/hierarchy_tree_node';
import {OperationChain} from '@tree_node/operation_chain';
import {PropertiesProvider} from '@tree_node/properties_provider';
import {PropertySource, PropertyTreeNode} from '@tree_node/property_tree_node';
import {HierarchyTreeBuilder} from '@tree_node/testing/hierarchy_tree_builder';
import {PropertyTreeBuilder} from '@tree_node/testing/property_tree_builder';
import {TraceRect} from '@tree_node/trace_rect';

import {queryWinscopeTraceData, WinscopeTraceJson, WinscopeTraceQuery, WinscopeTraceSnapshot,} from './winscope_trace_query';

describe('WinscopeTraceQuery', () => {
  const position = (ns: bigint) =>
    TracePosition.fromTimestamp(makeRealTimestamp(ns));
  const collection = (...values: Array<Trace<unknown>>) => {
    const traces = new Traces();
    values.forEach((trace) => traces.addTrace(trace));
    return traces;
  };
  // Jasmine's recursive Expected<T> type cannot instantiate recursive JSON unions.
  const record = (value: unknown) => value as {[key: string]: unknown};
  const assertSafe = (snapshot: WinscopeTraceSnapshot) => {
    const serialized = JSON.stringify(snapshot);
    expect(JSON.stringify(JSON.parse(serialized))).toBe(serialized);
    expect(
      new TextEncoder().encode(JSON.stringify(snapshot)).length,
    ).toBeLessThanOrEqual(96 * 1024);
  };
  const temporalTrace = (type = TraceType.SURFACE_FLINGER) =>
    new TraceBuilder<string>()
      .setType(type)
      .setEntries(['ten', 'twenty', 'thirty'])
      .setTimestamps([10n, 20n, 30n].map(makeRealTimestamp))
      .build();

  it('preserves primary viewer matching among timestamp-sorted neighbors, exact deltas and frames', async () => {
    const trace = new TraceBuilder<string>()
      .setEntries(['a', 'b', 'c', 'd', 'e'])
      .setTimestamps([10n, 20n, 30n, 40n, 50n].map(makeRealTimestamp))
      .setFrame(0, 0)
      .setFrame(1, 1)
      .setFrame(2, 2)
      .setFrame(3, 3)
      .setFrame(4, 4)
      .build();
    const requested = TracePosition.fromTraceEntry(
      trace.getEntry(2),
      makeRealTimestamp(35n),
    );
    Object.freeze(requested);
    const snapshot = await queryWinscopeTraceData(
      collection(trace),
      requested,
      'current',
      {before: 2, after: 2},
    );
    expect(snapshot.queryType).toBe('neighbors');
    expect(snapshot.entries.map((entry) => entry.index)).toEqual([
      0, 1, 2, 3, 4,
    ]);
    expect(snapshot.entries.map((entry) => entry.role)).toEqual([
      'before',
      'before',
      'matched',
      'after',
      'after',
    ]);
    expect(snapshot.entries.map((entry) => entry.deltaNs)).toEqual([
      '-25',
      '-15',
      '-5',
      '5',
      '15',
    ]);
    expect(snapshot.entries[2].match).toBe('active_entry');
    expect(snapshot.entries[2].framesRange).toEqual({start: 2, end: 3});
    expect(snapshot.entries[0].traceBounds).toEqual({
      firstTimestampNs: '10',
      lastTimestampNs: '50',
      count: 5,
    });
    expect(requested.entry!.getIndex()).toBe(2);
    expect(requested.timestamp.getValueNs()).toBe(35n);
    const edge = await queryWinscopeTraceData(
      collection(trace),
      position(10n),
      'timestamp',
      {before: 2, after: 2},
    );
    expect(edge.entries.map((entry) => entry.index)).toEqual([0, 1, 2]);
    const missing = await queryWinscopeTraceData(
      collection(trace),
      position(1n),
      'timestamp',
      {before: 2, after: 2},
    );
    expect(missing.entries.length).toBe(1);
    expect(missing.entries[0].index).toBe(-1);
    assertSafe(snapshot);
  });

  it('selects inclusive range bounds oldest first with duplicates, precision and continuation', async () => {
    const ns = 1793664112345678901n;
    const trace = new TraceBuilder<string>()
      .setType(TraceType.WINDOW_MANAGER)
      .setEntries(['outside', 'a', 'b', 'c', 'last', 'outside'])
      .setTimestamps(
        [-1n, 0n, 0n, 1n, 2n, 3n].map((offset) =>
          makeRealTimestamp(ns + offset),
        ),
      )
      .build();
    const snapshot = await queryWinscopeTraceData(
      collection(trace),
      position(ns),
      'timestamp',
      {endTimestamp: makeRealTimestamp(ns + 2n), limit: 2},
    );
    expect(snapshot.queryType).toBe('range');
    expect(snapshot.endTimestampNs).toBe((ns + 2n).toString());
    expect(snapshot.entries.map((entry) => entry.index)).toEqual([1, 2]);
    expect(snapshot.entries.map((entry) => entry.match)).toEqual([
      'range',
      'range',
    ]);
    expect(snapshot.entries.map((entry) => entry.role)).toEqual([
      'range',
      'range',
    ]);
    expect(snapshot.entries.map((entry) => entry.deltaNs)).toEqual(['0', '0']);
    expect(snapshot.rangeCoverage![0]).toEqual(
      jasmine.objectContaining({
        selected: 2,
        available: 4,
        hasMore: true,
        nextIndex: 3,
      }),
    );
    expect(snapshot.incompleteReasons).toContain('range_entry_limit');
    expect(snapshot.diagnostics.dataIncomplete).toBeTrue();
    const full = await queryWinscopeTraceData(
      collection(trace),
      position(ns),
      'timestamp',
      {endTimestamp: makeRealTimestamp(ns + 2n)},
    );
    expect(full.entries.map((entry) => String(entry.data))).toEqual([
      'a',
      'b',
      'c',
      'last',
    ]);
    expect(full.rangeCoverage![0].hasMore).toBeFalse();
    expect(full.rangeCoverage![0].nextIndex).toBeUndefined();
    expect(full.windowManager!.entries.map((entry) => entry.dataPath)).toEqual([
      'entries.0.data',
      'entries.1.data',
      'entries.2.data',
      'entries.3.data',
    ]);
    assertSafe(snapshot);
    assertSafe(full);
  });

  it('limits neighbors per trace, retaining the matched primary before choosing closest timestamps', async () => {
    const ns = 1793664112345678901n;
    const parser = new ParserBuilder<string>()
      .setEntries(['far', 'before', 'primary', 'near', 'next'])
      .setTimestamps(
        [1n, 90n, 100n, 101n, 102n].map((delta) =>
          makeRealTimestamp(ns + delta),
        ),
      )
      .build();
    const read = spyOn(parser, 'getEntry').and.callThrough();
    const trace = new TraceBuilder<string>()
      .setParser(parser)
      .setType(TraceType.WINDOW_MANAGER)
      .build();
    const requested = TracePosition.fromTraceEntry(trace.getEntry(2));
    Object.freeze(requested);
    const snapshot = await queryWinscopeTraceData(
      collection(trace),
      requested,
      'current',
      {before: 2, after: 2, limit: 1},
    );
    expect(snapshot.entries.map((entry) => entry.index)).toEqual([2]);
    expect(snapshot.entries[0].role).toBe('matched');
    expect(snapshot.entries[0].match).toBe('active_entry');
    expect(snapshot.entries[0].data as unknown).toBe('primary');
    expect(snapshot.entries[0].incompleteReasons).toContain(
      'neighbors_entry_limit',
    );
    expect(snapshot.entries[0].truncated).toBeTrue();
    expect(snapshot.incompleteReasons).toContain('neighbors_entry_limit');
    expect(snapshot.truncated).toBeTrue();
    expect(snapshot.diagnostics.dataIncomplete).toBeTrue();
    expect(snapshot.neighborsCoverage![0]).toEqual(
      jasmine.objectContaining({selected: 1, available: 5, hasMore: true}),
    );
    expect(snapshot.neighborsCoverage![0].incompleteReasons).toContain(
      'neighbors_entry_limit',
    );
    expect(snapshot.windowManager!.status).toBe('partial');
    expect(snapshot.windowManager!.entries.length).toBe(1);
    expect(snapshot.windowManager!.entries[0].dataPath).toBe('entries.0.data');
    expect(read).toHaveBeenCalledTimes(1);
    expect(read).toHaveBeenCalledWith(2);
    for (const [limit, expected] of [
      [2, [2, 3]],
      [3, [2, 3, 4]],
      [4, [1, 2, 3, 4]],
    ] as const) {
      const limited = await queryWinscopeTraceData(
        collection(trace),
        requested,
        'current',
        {before: 2, after: 2, limit},
      );
      expect(limited.entries.map((entry) => entry.index)).toEqual([
        ...expected,
      ]);
      expect(
        limited.entries.filter((entry) => entry.role === 'matched').length,
      ).toBe(1);
      expect(limited.neighborsCoverage![0].selected).toBe(limit);
      assertSafe(limited);
    }
    const unbounded = await queryWinscopeTraceData(
      collection(trace),
      requested,
      'current',
      {before: 2, after: 2},
    );
    expect(unbounded.entries.map((entry) => entry.index)).toEqual([
      0, 1, 2, 3, 4,
    ]);
    expect(unbounded.neighborsCoverage![0]).toEqual(
      jasmine.objectContaining({selected: 5, available: 5, hasMore: false}),
    );
    expect(unbounded.incompleteReasons).not.toContain('neighbors_entry_limit');
    expect(unbounded.truncated).toBeFalse();
    expect(requested.entry!.getIndex()).toBe(2);
    assertSafe(snapshot);
  });

  it('uses stable neighbor ties, applies each trace limit independently and does not truncate naturally short queries', async () => {
    const first = temporalTrace(TraceType.WINDOW_MANAGER);
    const second = temporalTrace();
    const snapshot = await queryWinscopeTraceData(
      collection(first, second),
      position(20n),
      'timestamp',
      {before: 2, after: 2, limit: 2},
    );
    expect(
      snapshot.entries.map((entry) => [
        entry.sourceIndex,
        entry.index,
        entry.role,
      ]),
    ).toEqual([
      [0, 0, 'before'],
      [0, 1, 'matched'],
      [1, 0, 'before'],
      [1, 1, 'matched'],
    ]);
    expect(
      snapshot.neighborsCoverage!.map((coverage) => coverage.selected),
    ).toEqual([2, 2]);
    expect(
      snapshot.neighborsCoverage!.map((coverage) => coverage.available),
    ).toEqual([3, 3]);
    const edge = await queryWinscopeTraceData(
      collection(first),
      position(10n),
      'timestamp',
      {before: 2, limit: 1},
    );
    expect(edge.entries.map((entry) => entry.index)).toEqual([0]);
    expect(edge.neighborsCoverage![0]).toEqual(
      jasmine.objectContaining({selected: 1, available: 1, hasMore: false}),
    );
    expect(edge.truncated).toBeFalse();
    const point = await queryWinscopeTraceData(
      collection(first),
      position(20n),
      'timestamp',
      {limit: 1},
    );
    expect(point.entries.map((entry) => entry.index)).toEqual([1]);
    expect(point.incompleteReasons).not.toContain('neighbors_entry_limit');
    const empty = await queryWinscopeTraceData(
      collection(first),
      position(1n),
      'timestamp',
      {before: 2, after: 2, limit: 1},
    );
    expect(empty.neighborsCoverage![0]).toEqual(
      jasmine.objectContaining({selected: 0, available: 0, hasMore: false}),
    );
    expect(empty.incompleteReasons).not.toContain('neighbors_entry_limit');
    assertSafe(snapshot);
  });

  it('keeps one global UTF-8 budget and accurate neighbor coverage across large limited sources', async () => {
    const traces = collection(
      ...Array.from({length: 128}, () =>
        new TraceBuilder()
          .setType(TraceType.WINDOW_MANAGER)
          .setEntries(
            Array.from({length: 5}, () => ({text: '界'.repeat(8000)})),
          )
          .setTimestamps([10n, 20n, 30n, 40n, 50n].map(makeRealTimestamp))
          .build(),
      ),
    );
    const snapshot = await queryWinscopeTraceData(
      traces,
      position(30n),
      'timestamp',
      {before: 2, after: 2, limit: 1},
    );
    expect(snapshot.requestedTraceCount).toBe(128);
    expect(snapshot.entries.length).toBeLessThanOrEqual(128);
    expect(
      snapshot.entries.every(
        (entry) => entry.index === 2 && entry.role === 'matched',
      ),
    ).toBeTrue();
    for (const coverage of snapshot.neighborsCoverage!) {
      expect(coverage.available).toBe(5);
      expect(coverage.selected).toBe(
        snapshot.entries.filter(
          (entry) =>
            entry.sourceIndex === coverage.sourceIndex && entry.index >= 0,
        ).length,
      );
      expect(coverage.hasMore).toBeTrue();
    }
    expect(snapshot.diagnostics.dataIncomplete).toBeTrue();
    snapshot.windowManager!.entries.forEach((entry, index) =>
      expect(entry.dataPath).toBe(`entries.${index}.data`),
    );
    assertSafe(snapshot);
  });

  it('does not substitute nearest entries or invent timestamps for empty ranges and dumps', async () => {
    const empty = new TraceBuilder().setEntries([]).build();
    const dump = new TraceBuilder()
      .setEntries([{valid: false}])
      .setTimestamps([makeZeroTimestamp()])
      .build();
    const traces = collection(temporalTrace(), empty, dump);
    for (const [start, end] of [
      [1n, 9n],
      [11n, 19n],
      [31n, 40n],
    ] as const) {
      const snapshot = await queryWinscopeTraceData(
        traces,
        position(start),
        'timestamp',
        {endTimestamp: makeRealTimestamp(end)},
      );
      expect(
        snapshot.entries.every(
          (entry) =>
            entry.index === -1 &&
            entry.timestampNs === '' &&
            entry.data === null,
        ),
      ).toBeTrue();
      expect(snapshot.rangeCoverage!.map((item) => item.available)).toEqual([
        0, 0, 0,
      ]);
      expect(
        snapshot.rangeCoverage!.every(
          (item) => item.hasMore === false && item.selected === 0,
        ),
      ).toBeTrue();
      expect(snapshot.entries[2].traceBounds).toEqual({count: 1});
      expect(snapshot.entries[2].deltaNs).toBeUndefined();
      assertSafe(snapshot);
    }
  });

  it('handles sliced traces using absolute identities for neighbors and range coverage', async () => {
    const trace = new TraceBuilder()
      .setEntries(['a', 'b', 'c', 'd', 'e'])
      .setTimestamps([10n, 20n, 30n, 40n, 50n].map(makeRealTimestamp))
      .build()
      .sliceEntries(1, 4);
    const neighbors = await queryWinscopeTraceData(
      collection(trace),
      position(30n),
      'timestamp',
      {before: 2, after: 2},
    );
    expect(neighbors.entries.map((entry) => entry.index)).toEqual([1, 2, 3]);
    const range = await queryWinscopeTraceData(
      collection(trace),
      position(10n),
      'timestamp',
      {endTimestamp: makeRealTimestamp(50n), limit: 2},
    );
    expect(range.entries.map((entry) => entry.index)).toEqual([1, 2]);
    expect(range.rangeCoverage![0]).toEqual(
      jasmine.objectContaining({available: 3, nextIndex: 3}),
    );
  });

  it('defaults ranges to five, allows eight and caps the entire range snapshot globally', async () => {
    const trace = () =>
      new TraceBuilder()
        .setEntries(Array.from({length: 12}, (_, index) => index))
        .setTimestamps(
          Array.from({length: 12}, (_, index) =>
            makeRealTimestamp(BigInt(index + 1)),
          ),
        )
        .build();
    const options = {endTimestamp: makeRealTimestamp(20n)};
    const defaultLimit = await queryWinscopeTraceData(
      collection(trace()),
      position(1n),
      'timestamp',
      options,
    );
    expect(defaultLimit.entries.length).toBe(5);
    const maxLimit = await queryWinscopeTraceData(
      collection(trace()),
      position(1n),
      'timestamp',
      {...options, limit: 8},
    );
    expect(maxLimit.entries.length).toBe(8);
    const snapshot = await queryWinscopeTraceData(
      collection(...Array.from({length: 140}, trace)),
      position(1n),
      'timestamp',
      {...options, limit: 8},
    );
    expect(snapshot.requestedTraceCount).toBe(128);
    expect(snapshot.rangeCoverage!.length).toBe(128);
    expect(snapshot.entries.length).toBeLessThanOrEqual(128);
    expect(
      snapshot.rangeCoverage!.reduce((sum, item) => sum + item.selected, 0),
    ).toBeLessThanOrEqual(128);
    expect(snapshot.incompleteReasons).toContain('global_range_entry_limit');
    expect(snapshot.incompleteReasons).toContain('trace_count_limit');
    assertSafe(snapshot);
  });

  it('validates options and exact enum names including WM_TRANSITION and SHELL_TRANSITION', async () => {
    const sources = collection(
      temporalTrace(),
      temporalTrace(TraceType.WM_TRANSITION),
      temporalTrace(TraceType.SHELL_TRANSITION),
    );
    const snapshot = await queryWinscopeTraceData(
      sources,
      position(20n),
      'current',
      {traceTypes: ['WM_TRANSITION', 'SHELL_TRANSITION']},
    );
    expect(snapshot.entries.map((entry) => entry.traceType)).toEqual([
      'WM_TRANSITION',
      'SHELL_TRANSITION',
    ]);
    expect(snapshot.entries.map((entry) => entry.sourceIndex)).toEqual([1, 2]);
    expect(snapshot.requestedTraceCount).toBe(2);
    for (const name of [
      'wm_transition',
      'UNKNOWN',
      '0',
      '__proto__',
      'toString',
      'INPUT_METHOD_CLIENTS',
    ]) {
      await expectAsync(
        queryWinscopeTraceData(sources, position(20n), 'current', {
          traceTypes: [name],
        }),
      ).toBeRejected();
    }
    for (const options of [
      {before: 3},
      {after: -1},
      {limit: 9},
      {limit: 0},
      {before: 0.5},
      {after: NaN},
      {endTimestamp: makeRealTimestamp(10n)},
      {endTimestamp: makeZeroTimestamp()},
      {layerId: ''},
      {traceTypes: []},
      {traceTypes: ['WINDOW_MANAGER', 'WINDOW_MANAGER']},
    ]) {
      await expectAsync(
        queryWinscopeTraceData(sources, position(20n), 'current', options),
      ).toBeRejected();
    }
    const none = await queryWinscopeTraceData(
      sources,
      position(20n),
      'current',
      {traceTypes: ['TRANSACTIONS']},
    );
    expect(none.entries.length).toBe(0);
    expect(none.incompleteReasons).toContain('no_matching_trace_types');
  });

  it('exports caller-supplied clock facts and capabilities without guessing capture options', async () => {
    const clock = {
      domain: 'ELAPSED' as const,
      utcOffset: '+08:00',
      bootTimeNs: '0',
      realTimeNs: '1793664112345678901',
    };
    const snapshot = await queryWinscopeTraceData(
      collection(temporalTrace()),
      position(20n),
      'current',
      {clock},
    );
    expect(snapshot.clock).toEqual(clock);
    expect(snapshot.clock).not.toBe(clock);
    expect(snapshot.capabilities).toEqual(
      jasmine.objectContaining({
        queryTypes: ['point', 'neighbors', 'range'],
        physicalFramesNotGuaranteed: true,
        rawMediaIncluded: false,
        captureOptions: 'unknown',
      }),
    );
    expect(snapshot.diagnostics.dataIncomplete).toBeFalse();
    expect(
      (await queryWinscopeTraceData(collection(temporalTrace()), position(20n)))
        .clock,
    ).toEqual({domain: 'UNKNOWN'});
  });

  it('projects public geometry, parent and relative relationships, raw warnings and zero properties', async () => {
    const root = new HierarchyTreeBuilder()
      .setId('root')
      .setName('root')
      .setChildren([
        {
          id: 1,
          name: 'not visibility evidence',
          properties: {valid: false, alpha: 0, z: 0, activeBuffer: {width: 0}},
        },
        {id: 2, name: 'z parent'},
      ])
      .build();
    const child = root.getAllChildren()[0];
    const zParent = root.getAllChildren()[1];
    child.setZParent(zParent);
    zParent.addRelativeChild(child);
    child.addWarning({message: 'Raw warning: hidden? 0'});
    const rect = new TraceRect(
      0,
      0,
      100,
      0,
      'rect',
      'raw rect',
      new CornerRadii(0, 1, 2, 3),
      new TransformMatrix(0, 1, 0, -1, 0, 3),
      0,
      false,
      true,
      false,
      0,
      0,
      false,
      new Region([new Rect(0, 1, 2, 3)]),
    );
    child.setRects([rect]);
    child.setSecondaryRects([rect]);
    child.getEagerPropertyByName('alpha')!.setFormatter({format: () => '0'});
    const snapshot = await queryWinscopeTraceData(
      collection(new TraceBuilder().setEntries([root]).build()),
      position(20n),
    );
    const children = record(snapshot.entries[0].data)['children'] as unknown[];
    const data = record(children[0]);
    expect(data['parentId']).toBe(root.id);
    expect(data['zParentId']).toBe(zParent.id);
    expect(record(children[1])['relativeChildIds']).toEqual([child.id]);
    expect(data['warnings']).toEqual(['Raw warning: hidden? 0']);
    const geometry = record((data['rects'] as unknown[])[0]);
    expect(geometry).toEqual(
      jasmine.objectContaining({
        x: 0,
        y: 0,
        w: 100,
        h: 0,
        groupId: 0,
        isVisible: false,
        isDisplay: true,
        opacity: 0,
        transform: {dsdx: 0, dtdx: 1, tx: 0, dtdy: -1, dsdy: 0, ty: 3},
        cornerRadii: {tl: 0, tr: 1, bl: 2, br: 3},
        fillRegion: {rects: [{x: 0, y: 1, w: 2, h: 3}]},
      }),
    );
    expect(data['secondaryRects']).toEqual(data['rects']);
    const properties = record(data['properties'])['children'] as unknown[];
    expect(
      properties.map((value) => [
        record(value)['name'],
        record(value)['value'],
      ]),
    ).toContain(['valid', false]);
    expect(
      properties.map((value) => [
        record(value)['name'],
        record(value)['value'],
      ]),
    ).toContain(['alpha', 0]);
    expect(snapshot.truncated).toBeFalse();
    assertSafe(snapshot);
  });

  it('retains calculated properties and diagnostic eager fallback fields', async () => {
    const root = new HierarchyTreeBuilder()
      .setId('layer')
      .setName('layer')
      .setProperties({
        bufferData: {width: 0},
        activeBuffer: 0,
        visibleRegion: [],
        transform: {dsdx: 0},
        crop: {left: 0},
        alpha: 0,
        z: 0,
        relativeZ: 0,
        transactionId: 0n,
      })
      .addChildProperty({
        name: 'computedVisibility',
        value: false,
        source: PropertySource.CALCULATED,
      })
      .build();
    const trace = collection(new TraceBuilder().setEntries([root]).build());
    const full = await queryWinscopeTraceData(trace, position(20n));
    expect(JSON.stringify(full)).toContain('CALCULATED');
    expect(JSON.stringify(full)).toContain('computedVisibility');
    spyOn(root, 'getAllProperties').and.rejectWith(new Error('lazy failed'));
    const partial = await queryWinscopeTraceData(trace, position(20n));
    const props = record(partial.entries[0].data)['properties'] as unknown[];
    expect(props.map((prop) => record(prop)['name'])).toEqual(
      jasmine.arrayContaining([
        'bufferData',
        'activeBuffer',
        'visibleRegion',
        'transform',
        'crop',
        'alpha',
        'z',
        'relativeZ',
        'transactionId',
      ]),
    );
    expect(partial.incompleteReasons).toContain(
      'eager_property_fallback_is_partial',
    );
    assertSafe(partial);
  });

  it('prioritizes exact target branches and z-parent context, retaining siblings and the original tree', async () => {
    const root = new HierarchyTreeBuilder()
      .setId('root')
      .setName('root')
      .setChildren([
        {id: 1, name: 'sibling', properties: {layerId: 1}},
        {
          id: 2,
          name: 'ancestor',
          children: [
            {
              id: 3,
              name: 'target',
              properties: {layerId: 0, windowId: 'w', displayId: 0},
            },
          ],
        },
        {id: 4, name: 'z parent'},
      ])
      .build();
    const original = [...root.getAllChildren()];
    const target = original[1].getAllChildren()[0];
    target.setZParent(original[2]);
    const snapshot = await queryWinscopeTraceData(
      collection(new TraceBuilder().setEntries([root]).build()),
      position(20n),
      'current',
      {layerId: '0', windowId: 'w', displayId: '0'},
    );
    const children = record(snapshot.entries[0].data)['children'] as unknown[];
    expect(children.map((child) => record(child)['id'])).toEqual([
      original[1].id,
      original[2].id,
      original[0].id,
    ]);
    expect(snapshot.entries[0].selection).toEqual(
      jasmine.objectContaining({
        filterSemantics: 'prioritize-target-retain-context',
        matchedNodeIds: [target.id],
      }),
    );
    expect(root.getAllChildren()).toEqual(original);
    expect(snapshot.entries[0].selection!.missingReasons).not.toContain(
      'layerId_target_not_found',
    );
    assertSafe(snapshot);
  });

  it('finds late target branches before the sibling limit and labels unknown or absent targets honestly', async () => {
    const root = new HierarchyTreeBuilder()
      .setId('root')
      .setName('root')
      .setChildren(
        Array.from({length: 160}, (_, index) => ({
          id: index,
          name: `layer${index}`,
          properties: {layerId: index},
        })),
      )
      .build();
    const trace = collection(new TraceBuilder().setEntries([root]).build());
    const snapshot = await queryWinscopeTraceData(
      trace,
      position(20n),
      'current',
      {layerId: '150'},
    );
    expect(
      record((record(snapshot.entries[0].data)['children'] as unknown[])[0])[
        'id'
      ],
    ).toBe(root.getAllChildren()[150].id);
    expect(snapshot.entries[0].selection!.matchedNodeIds).toContain(
      root.getAllChildren()[150].id,
    );
    const missing = await queryWinscopeTraceData(
      trace,
      position(20n),
      'current',
      {layerId: '999', windowId: 'missing'},
    );
    expect(missing.entries[0].selection!.matchedNodeIds.length).toBe(0);
    expect(missing.entries[0].selection!.missingReasons).toContain(
      'layerId_target_not_found',
    );
    expect(missing.entries[0].selection!.missingReasons).toContain(
      'windowId_unknown',
    );
    assertSafe(snapshot);
    assertSafe(missing);
  });

  it('indexes actual transaction and transition IDs in root and child range properties without inferred relationships', async () => {
    const root = new HierarchyTreeBuilder()
      .setId('transactions')
      .setName('transactions')
      .setProperties({transactionId: 0n})
      .setChildren([
        {
          id: 1,
          name: 'transaction',
          properties: {transactionId: 9007199254740993123n, layerId: 17n},
        },
        {id: 2, name: 'transition', properties: {transitionId: 77n}},
      ])
      .build();
    const snapshot = await queryWinscopeTraceData(
      collection(
        new TraceBuilder()
          .setType(TraceType.TRANSACTIONS)
          .setEntries([root])
          .setTimestamps([makeRealTimestamp(10n)])
          .build(),
      ),
      position(10n),
      'timestamp',
      {endTimestamp: makeRealTimestamp(10n)},
    );
    const entry = snapshot.entries[0];
    expect(entry.idIndex!.map((id) => [id.field, id.value])).toEqual([
      ['transactionId', '0'],
      ['transactionId', '9007199254740993123'],
      ['transitionId', '77'],
    ]);
    for (const id of entry.idIndex!) {
      const value = id.dataPath
        .split('.')
        .reduce<unknown>((current, key) => record(current)[key], entry);
      expect(value).toBe(id.value);
    }
    expect(snapshot.rangeCoverage![0]).toEqual(
      jasmine.objectContaining({available: 1, selected: 1, hasMore: false}),
    );
    expect(JSON.stringify(snapshot)).not.toContain('relationships');
    assertSafe(snapshot);
  });

  it('prioritizes late WM token branches for windowId and preserves exact node IDs and raw token fields', async () => {
    const root = new HierarchyTreeBuilder()
      .setId('root')
      .setName('WM')
      .setChildren(
        Array.from({length: 160}, (_, index) => ({
          id: index,
          name: `WindowState ${index}`,
          properties: {
            token: index,
            title: `window${index}`,
            containerType: 'WindowState',
            isVisible: false,
            parentToken: 0,
          },
        })),
      )
      .build();
    const original = [...root.getAllChildren()];
    const target = original[150];
    expect(target.getEagerPropertyByName('windowId')).toBeUndefined();
    expect(target.getEagerPropertyByName('token')!.getValue<number>()).toBe(
      150,
    );
    const traces = collection(
      new TraceBuilder()
        .setType(TraceType.WINDOW_MANAGER)
        .setEntries([root])
        .build(),
    );
    for (const windowId of ['150', target.id]) {
      const snapshot = await queryWinscopeTraceData(
        traces,
        position(20n),
        'current',
        {windowId},
      );
      const child = record(
        (record(snapshot.entries[0].data)['children'] as unknown[])[0],
      );
      expect(child['id']).toBe(target.id);
      expect(snapshot.entries[0].selection!.matchedNodeIds).toContain(
        target.id,
      );
      expect(snapshot.entries[0].selection!.missingReasons).not.toContain(
        'windowId_unknown',
      );
      expect(snapshot.entries[0].selection!.missingReasons).not.toContain(
        'windowId_target_not_found',
      );
      const properties = record(child['properties'])['children'] as unknown[];
      expect(
        properties.map((prop) => [record(prop)['name'], record(prop)['value']]),
      ).toContain(['token', 150]);
      expect(properties.map((prop) => record(prop)['name'])).not.toContain(
        'windowId',
      );
      expect(root.getAllChildren()).toEqual(original);
      assertSafe(snapshot);
    }
    const zero = await queryWinscopeTraceData(
      traces,
      position(20n),
      'current',
      {windowId: '0'},
    );
    expect(zero.entries[0].selection!.matchedNodeIds).toContain(original[0].id);
    const missing = await queryWinscopeTraceData(
      traces,
      position(20n),
      'current',
      {windowId: '999'},
    );
    expect(missing.entries[0].selection!.missingReasons).toContain(
      'windowId_target_not_found',
    );
    const otherTrace = await queryWinscopeTraceData(
      collection(
        new TraceBuilder()
          .setType(TraceType.SURFACE_FLINGER)
          .setEntries([root])
          .build(),
      ),
      position(20n),
      'current',
      {windowId: '150'},
    );
    expect(otherTrace.entries[0].selection!.matchedNodeIds.length).toBe(0);
    expect(otherTrace.entries[0].selection!.missingReasons).toContain(
      'windowId_unknown',
    );
  });

  it('never decodes a screenshot or touches recording pixels', async () => {
    const screenshot = new ParserBuilder()
      .setType(TraceType.SCREENSHOT)
      .setEntries([{}])
      .build();
    const decode = spyOn(screenshot, 'getEntry').and.throwError(
      'would create bitmap',
    );
    const pixels = jasmine
      .createSpy('pixels')
      .and.throwError('pixels accessed');
    const media = {videoTimeSeconds: 0};
    Object.defineProperty(media, 'frameData', {get: pixels, enumerable: true});
    Object.defineProperty(media, 'thumbnail', {get: pixels, enumerable: true});
    const snapshot = await queryWinscopeTraceData(
      collection(
        new TraceBuilder()
          .setType(TraceType.SCREENSHOT)
          .setParser(screenshot)
          .build(),
        new TraceBuilder()
          .setType(TraceType.SCREEN_RECORDING)
          .setEntries([media])
          .build(),
      ),
      position(20n),
    );
    expect(decode).not.toHaveBeenCalled();
    expect(pixels).not.toHaveBeenCalled();
    expect(snapshot.entries.map((entry) => entry.data as unknown)).toEqual([
      {kind: 'media_metadata', videoTimeSeconds: null},
      {kind: 'media_metadata', videoTimeSeconds: 0},
    ]);
    assertSafe(snapshot);
  });

  it('keeps range availability distinct from decoder failures and unknown lookup coverage', async () => {
    const parser = new ParserBuilder<string>()
      .setEntries(['one', 'bad', 'three'])
      .setTimestamps([10n, 20n, 30n].map(makeRealTimestamp))
      .build();
    const getEntry = parser.getEntry.bind(parser);
    spyOn(parser, 'getEntry').and.callFake((index) =>
      index === 1 ? Promise.reject(new Error('bad decode')) : getEntry(index),
    );
    const trace = new TraceBuilder<string>()
      .setParser(parser)
      .setType(TraceType.WINDOW_MANAGER)
      .build();
    const broken = temporalTrace();
    spyOn(broken, 'findFirstGreaterOrEqualEntry').and.throwError(
      'bad timestamps',
    );
    const snapshot = await queryWinscopeTraceData(
      collection(trace, broken),
      position(10n),
      'timestamp',
      {endTimestamp: makeRealTimestamp(30n)},
    );
    expect(snapshot.entries.slice(0, 3).map((entry) => entry.index)).toEqual([
      0, 1, 2,
    ]);
    expect(snapshot.entries[1].data as unknown).toBeNull();
    expect(snapshot.entries[2].data as unknown).toBe('three');
    expect(snapshot.rangeCoverage![0]).toEqual(
      jasmine.objectContaining({available: 3, selected: 3, hasMore: false}),
    );
    expect(snapshot.rangeCoverage![0].incompleteReasons).toContain(
      'entry_decode_failed',
    );
    expect(snapshot.rangeCoverage![1]).toEqual(
      jasmine.objectContaining({available: null, selected: 0, hasMore: null}),
    );
    expect(snapshot.windowManager!.status).toBe('partial');
    expect(snapshot.windowManager!.entries.map((entry) => entry.role)).toEqual([
      'range',
      'range',
      'range',
    ]);
    expect(snapshot.diagnostics.dataIncomplete).toBeTrue();
    assertSafe(snapshot);
  });

  it('marks limited WindowManager ranges partial and reports every observation relative to the start', async () => {
    const snapshot = await queryWinscopeTraceData(
      collection(temporalTrace(TraceType.WINDOW_MANAGER)),
      position(10n),
      'timestamp',
      {endTimestamp: makeRealTimestamp(30n), limit: 2},
    );
    expect(snapshot.entries.map((entry) => entry.index)).toEqual([0, 1]);
    expect(snapshot.windowManager!.status).toBe('partial');
    expect(
      snapshot.windowManager!.entries.map((entry) => entry.deltaNs),
    ).toEqual(['0', '10']);
    expect(snapshot.windowManager!.incompleteReasons).toContain(
      'range_entry_limit',
    );
    expect(
      snapshot.windowManager!.entries.every((entry) => entry.role === 'range'),
    ).toBeTrue();
    assertSafe(snapshot);
  });

  it('shares one deadline across range payloads and later traces without starting more decodes', async () => {
    jasmine.clock().install();
    jasmine.clock().mockDate();
    try {
      const parser = new ParserBuilder<string>()
        .setEntries(['blocked', 'later'])
        .setTimestamps([10n, 20n].map(makeRealTimestamp))
        .build();
      let started!: () => void;
      const reading = new Promise<void>((resolve) => {
        started = resolve;
      });
      const read = spyOn(parser, 'getEntry').and.callFake(() => {
        started();
        return new Promise(() => {});
      });
      const later = new ParserBuilder<string>()
        .setEntries(['later'])
        .setTimestamps([makeRealTimestamp(10n)])
        .build();
      const laterRead = spyOn(later, 'getEntry').and.callThrough();
      const pending = queryWinscopeTraceData(
        collection(
          new TraceBuilder().setParser(parser).build(),
          new TraceBuilder().setParser(later).build(),
        ),
        position(10n),
        'timestamp',
        {endTimestamp: makeRealTimestamp(20n)},
      );
      await reading;
      jasmine.clock().tick(10_001);
      const snapshot = await pending;
      expect(read).toHaveBeenCalledTimes(1);
      expect(laterRead).not.toHaveBeenCalled();
      expect(snapshot.rangeCoverage![0]).toEqual(
        jasmine.objectContaining({available: 2, selected: 2, hasMore: false}),
      );
      expect(snapshot.rangeCoverage![1]).toEqual(
        jasmine.objectContaining({available: null, selected: 0, hasMore: null}),
      );
      expect(
        snapshot.entries.every((entry) =>
          entry.incompleteReasons.includes('query_deadline_exceeded'),
        ),
      ).toBeTrue();
      expect(snapshot.diagnostics.dataIncomplete).toBeTrue();
      expect(snapshot.truncated).toBeTrue();
      assertSafe(snapshot);
    } finally {
      jasmine.clock().uninstall();
    }
  });

  it('includes explicit WindowManager requested/matched times and exact signed offsets with payload references', async () => {
    const ns = 1_793_621_012_123_456_789n;
    const wm = new TraceBuilder()
      .setType(TraceType.WINDOW_MANAGER)
      .setEntries([
        {focusedWindow: 'app.first', alpha: 0},
        {focusedWindow: 'app.second', alpha: 1},
      ])
      .setTimestamps([makeRealTimestamp(ns), makeRealTimestamp(ns + 10n)])
      .build();
    const snapshot = await queryWinscopeTraceData(
      collection(wm),
      position(ns + 5n),
      'timestamp',
    );
    const windowManager = snapshot.windowManager!;
    expect(windowManager.status).toBe('available');
    expect(windowManager.entries.length).toBe(1);
    const entry = windowManager.entries[0];
    expect(entry.requestedTimestampNs).toBe((ns + 5n).toString());
    expect(entry.timestampNs).toBe(ns.toString());
    expect(entry.deltaNs).toBe('-5');
    expect(entry.match).toBe('before');
    expect(entry.dataPath).toBe('entries.0.data');
    expect(JSON.stringify(snapshot.entries[0].data)).toContain('app.first');
    expect(JSON.stringify(windowManager)).not.toContain('app.first');
    assertSafe(snapshot);
  });

  it('reports missing or untimed WindowManager without making up alignment', async () => {
    expect(
      (await queryWinscopeTraceData(collection(temporalTrace()), position(20n)))
        .windowManager?.status,
    ).toBe('unavailable');
    const wm = temporalTrace(TraceType.WINDOW_MANAGER);
    const missing = await queryWinscopeTraceData(
      collection(wm),
      position(5n),
      'timestamp',
    );
    expect(missing.windowManager?.status).toBe('unavailable');
    expect(missing.windowManager?.entries[0].deltaNs).toBeUndefined();
    const dump = new TraceBuilder()
      .setType(TraceType.WINDOW_MANAGER)
      .setEntries([{focusedWindow: 'dump.window'}])
      .setTimestamps([makeZeroTimestamp()])
      .build();
    const untimed = await queryWinscopeTraceData(
      collection(dump),
      position(20n),
    );
    expect(untimed.windowManager?.status).toBe('partial');
    expect(untimed.windowManager?.entries[0].deltaNs).toBeUndefined();
    expect(untimed.windowManager?.incompleteReasons).toContain(
      'window_manager_timestamp_unavailable',
    );
  });

  it('labels partial WindowManager payloads honestly and respects the total snapshot budget', async () => {
    const wm = new TraceBuilder()
      .setType(TraceType.WINDOW_MANAGER)
      .setEntries([{window: 'a'.repeat(3000)}])
      .setTimestamps([makeRealTimestamp(20n)])
      .build();
    const snapshot = await queryWinscopeTraceData(
      collection(wm),
      position(20n),
    );
    expect(snapshot.windowManager?.status).toBe('partial');
    expect(snapshot.windowManager?.entries[0].truncated).toBeTrue();
    expect(snapshot.windowManager?.incompleteReasons).toContain('string_limit');
    assertSafe(snapshot);
  });

  it('keeps WindowManager references consistent when many sources hit the snapshot limit', async () => {
    const traces = new Traces();
    for (let index = 0; index < 128; index++) {
      traces.addTrace(
        new TraceBuilder()
          .setType(TraceType.WINDOW_MANAGER)
          .setDescriptors(['窗口'.repeat(150)])
          .setEntries([{focusedWindow: `window-${index}`, flags: index}])
          .setTimestamps([makeRealTimestamp(20n)])
          .build(),
      );
    }
    const snapshot = await queryWinscopeTraceData(traces, position(20n));
    assertSafe(snapshot);
    expect(snapshot.windowManager!.entries.length).toBe(
      snapshot.entries.length,
    );
    snapshot.windowManager!.entries.forEach((entry, index) => {
      expect(entry.dataPath).toBe(`entries.${index}.data`);
      expect(entry.sourceIndex).toBe(snapshot.entries[index].sourceIndex);
      expect(entry.truncated).toBe(snapshot.entries[index].truncated);
    });
  });

  it('accepts omitted query time and reports an empty collection', async () => {
    const query: WinscopeTraceQuery = {};
    expect(query.time).toBeUndefined();
    const snapshot = await queryWinscopeTraceData(new Traces(), position(20n));
    expect(snapshot.schemaVersion).toBe('1');
    expect(snapshot.mode).toBe('current');
    expect(snapshot.requestedTimestampNs).toBe('20');
    expect(snapshot.requestedTime).toBe(makeRealTimestamp(20n).format());
    expect(snapshot.entries.length).toBe(0);
    expect(snapshot.incompleteReasons).toContain('no_loaded_traces');
    assertSafe(snapshot);
  });

  it('uses viewer temporal matching before, exactly at, between and after entries', async () => {
    const trace = temporalTrace();
    for (const [ns, index, match] of [
      [5n, -1, 'missing'],
      [10n, 0, 'exact'],
      [25n, 1, 'before'],
      [40n, 2, 'before'],
    ] as const) {
      const snapshot = await queryWinscopeTraceData(
        collection(trace),
        position(ns),
        'timestamp',
      );
      const entry = snapshot.entries[0];
      expect(snapshot.mode).toBe('timestamp');
      expect(entry.index).toBe(index);
      expect(entry.match).toBe(match);
      expect(entry.index).toBe(
        findCorrespondingEntry(trace, position(ns))?.getIndex() ?? -1,
      );
      if (index === -1) {
        expect(entry.incompleteReasons).toContain('no_matching_entry');
      }
      assertSafe(snapshot);
    }
  });

  it('preserves manual active-entry identity, frame mapping, and the input position', async () => {
    const active = new TraceBuilder<string>()
      .setType(TraceType.WINDOW_MANAGER)
      .setEntries(['wm0', 'wm1', 'wm2'])
      .setTimestamps([10n, 20n, 30n].map(makeRealTimestamp))
      .setFrame(0, 5)
      .setFrame(1, 5)
      .setFrame(2, 6)
      .build();
    const other = new TraceBuilder<string>()
      .setType(TraceType.SURFACE_FLINGER)
      .setEntries(['sf0', 'sf1'])
      .setTimestamps([1n, 2n].map(makeRealTimestamp))
      .setFrame(0, 4)
      .setFrame(1, 5)
      .build();
    const requested = TracePosition.fromTraceEntry(
      active.getEntry(1),
      makeRealTimestamp(100n),
    );
    const before = TracePosition.fromTraceEntry(
      active.getEntry(1),
      makeRealTimestamp(100n),
    );
    Object.freeze(requested);
    const snapshot = await queryWinscopeTraceData(
      collection(active, other),
      requested,
    );
    expect(
      requested.timestamp.getValueNs() === before.timestamp.getValueNs() &&
        requested.frame === before.frame &&
        requested.entry?.getIndex() === before.entry?.getIndex(),
    ).toBeTrue();
    expect(snapshot.requestedTimestampNs).toBe('100');
    expect(snapshot.frameIndex).toBe(5);
    expect(snapshot.activeTrace).toBe('WINDOW_MANAGER');
    expect(snapshot.entries.map((entry) => entry.index)).toEqual([1, 1]);
    expect(snapshot.entries.map((entry) => entry.match)).toEqual([
      'active_entry',
      'frame',
    ]);
    expect(String(snapshot.entries[0].data)).toBe('wm1');
    expect(String(snapshot.entries[1].data)).toBe('sf1');
    assertSafe(snapshot);
  });

  it('uses pipeline ordering and frame fallback exactly as viewers do in either mode', async () => {
    const wm = temporalTrace(TraceType.WINDOW_MANAGER);
    const sf = temporalTrace(TraceType.SURFACE_FLINGER);
    for (const mode of ['current', 'timestamp'] as const) {
      const requested = TracePosition.fromTraceEntry(wm.getEntry(1));
      const snapshot = await queryWinscopeTraceData(
        collection(wm, sf),
        requested,
        mode,
      );
      expect(snapshot.entries[1].index).toBe(2);
      expect(snapshot.entries[1].match).toBe('after');
      const reverse = await queryWinscopeTraceData(
        collection(wm, sf),
        TracePosition.fromTraceEntry(sf.getEntry(1)),
        mode,
      );
      expect(reverse.entries[0].index).toBe(0);
      expect(reverse.entries[0].match).toBe('before');
    }
    const framed = new TraceBuilder<string>()
      .setEntries(['a', 'b'])
      .setTimestamps([10n, 20n].map(makeRealTimestamp))
      .setFrame(0, 2)
      .setFrame(1, 3)
      .build();
    const requested = TracePosition.fromTraceEntry(framed.getEntry(1));
    spyOn(sf, 'hasFrameInfo').and.returnValue(true);
    spyOn(sf, 'getFrame').and.returnValue(
      new TraceBuilder<string>().setEntries([]).build(),
    );
    const fallback = await queryWinscopeTraceData(collection(sf), requested);
    expect(fallback.entries[0].index).toBe(
      findCorrespondingEntry(sf, requested)?.getIndex() ?? -1,
    );
  });

  it('retains same-type sources, dumps without time, and empty traces', async () => {
    const dump = new TraceBuilder<string>()
      .setEntries(['untimed'])
      .setTimestamps([makeZeroTimestamp()])
      .setDescriptors(['dump.winscope'])
      .build();
    const second = temporalTrace();
    const empty = new TraceBuilder<string>().setEntries([]).build();
    const snapshot = await queryWinscopeTraceData(
      collection(dump, second, empty),
      position(20n),
    );
    expect(snapshot.entries.length).toBe(3);
    expect(snapshot.entries[0].descriptors).toEqual(['dump.winscope']);
    expect(snapshot.entries.map((entry) => entry.sourceIndex)).toEqual([
      0, 1, 2,
    ]);
    expect(snapshot.entries[0].timestampNs).toBe('0');
    expect(snapshot.entries[0].time).toBe('');
    expect(snapshot.entries[0].match).toBe('dump_without_timestamp');
    expect(String(snapshot.entries[0].data)).toBe('untimed');
    expect(snapshot.entries[0].incompleteReasons).toContain(
      'dump_without_timestamp',
    );
    expect(snapshot.entries[2].incompleteReasons).toContain('empty_trace');
    assertSafe(snapshot);
  });

  it('serializes actual hierarchy, nested property values, sources and formatted values', async () => {
    const root = new HierarchyTreeBuilder()
      .setId(1)
      .setName('display')
      .setProperties({
        visible: true,
        bounds: {left: 12},
        exactId: 9007199254740993123n,
      })
      .setChildren([{id: 2, name: 'window', properties: {title: 'Settings'}}])
      .build();
    const snapshot = await queryWinscopeTraceData(
      collection(
        new TraceBuilder<HierarchyTreeNode>()
          .setEntries([root])
          .setTimestamps([makeRealTimestamp(10n)])
          .build(),
      ),
      position(20n),
    );
    const data = record(snapshot.entries[0].data);
    expect(data['name']).toBe('display');
    const properties = record(data['properties']);
    const children = properties['children'] as WinscopeTraceJson[];
    const visible = record(
      children.find((child) => record(child)['name'] === 'visible') ?? null,
    );
    expect(visible['value']).toBeTrue();
    const encoded = JSON.stringify(data);
    expect(encoded).toContain('9007199254740993123');
    expect(encoded).toContain('Settings');
    expect(encoded).toContain('left');
    expect(encoded).toContain('PROTO');
    expect(snapshot.truncated).toBeFalse();

    const property = new PropertyTreeBuilder()
      .setRootId('p')
      .setName('count')
      .setValue(42n)
      .setFormatter({format: () => '42 layers'})
      .build();
    const direct = await queryWinscopeTraceData(
      collection(
        new TraceBuilder<PropertyTreeNode>().setEntries([property]).build(),
      ),
      position(20n),
    );
    expect(record(direct.entries[0].data)['value']).toBe('42');
    expect(record(direct.entries[0].data)['formattedValue']).toBe('42 layers');
    assertSafe(snapshot);
    assertSafe(direct);
  });

  it('retains eager properties and child data after a real lazy provider fails', async () => {
    const eager = new PropertyTreeBuilder()
      .setRootId('root')
      .setName('properties')
      .setChildren([{name: 'layerId', value: 12345678901234567890n}])
      .build();
    const provider = new PropertiesProvider(
      eager,
      async () => {
        throw new Error('decode');
      },
      undefined,
      OperationChain.emptyChain<PropertyTreeNode>(),
      OperationChain.emptyChain<PropertyTreeNode>(),
      OperationChain.emptyChain<PropertyTreeNode>(),
    );
    const root = new HierarchyTreeNode('root', 'layer', provider);
    root.addOrReplaceChild(
      new HierarchyTreeBuilder()
        .setId('child')
        .setName('child')
        .setProperties({childValue: 7})
        .build(),
    );
    const snapshot = await queryWinscopeTraceData(
      collection(
        new TraceBuilder<HierarchyTreeNode>().setEntries([root]).build(),
      ),
      position(20n),
    );
    expect(snapshot.entries[0].incompleteReasons).toContain(
      'lazy_properties_failed',
    );
    expect(snapshot.entries[0].incompleteReasons).toContain(
      'eager_property_fallback_is_partial',
    );
    expect(JSON.stringify(snapshot.entries[0].data)).toContain(
      '12345678901234567890',
    );
    expect(JSON.stringify(snapshot.entries[0].data)).toContain('childValue');
    assertSafe(snapshot);
  });

  it('keeps sibling properties after a value or formatter fails', async () => {
    const root = new PropertyTreeBuilder()
      .setRootId('p')
      .setName('properties')
      .setChildren([
        {name: 'broken', value: 1},
        {name: 'good', value: 2},
      ])
      .build();
    const broken = root.getChildByName('broken')!;
    spyOn(broken, 'getValue').and.throwError('bad value');
    spyOn(broken, 'formattedValue').and.throwError('bad formatter');
    const snapshot = await queryWinscopeTraceData(
      collection(
        new TraceBuilder<PropertyTreeNode>().setEntries([root]).build(),
      ),
      position(20n),
    );
    expect(snapshot.entries[0].incompleteReasons).toContain(
      'property_value_failed',
    );
    expect(snapshot.entries[0].incompleteReasons).toContain(
      'property_format_failed',
    );
    expect(
      record(
        (
          record(snapshot.entries[0].data)['children'] as WinscopeTraceJson[]
        )[1],
      )['value'],
    ).toBe(2);
    assertSafe(snapshot);
  });

  it('handles cycles, precise bigints, unsupported objects, getters and binary data', async () => {
    const value: {[key: string]: unknown} = {
      exact: 123456789012345678901n,
      binary: new Uint8Array([1, 2]),
      rawData: 'not exported',
      url: 'blob:private',
      infinite: Infinity,
      shared: {valid: true},
    };
    value['cycle'] = value;
    value['again'] = value['shared'];
    const getter = jasmine.createSpy('getter').and.throwError('do not execute');
    Object.defineProperty(value, 'accessor', {get: getter, enumerable: true});
    const snapshot = await queryWinscopeTraceData(
      collection(new TraceBuilder<object>().setEntries([value]).build()),
      position(20n),
    );
    const data = record(snapshot.entries[0].data);
    expect(data['exact']).toBe('123456789012345678901');
    expect(data['cycle']).toBeNull();
    expect(data['shared']).toEqual(data['again']);
    expect(data['binary']).toBeNull();
    expect(data['rawData']).toBeUndefined();
    expect(getter).not.toHaveBeenCalled();
    expect(snapshot.entries[0].incompleteReasons).toContain('cycle');
    expect(snapshot.entries[0].truncated).toBeTrue();
    assertSafe(snapshot);
  });

  it('detects cycles in actual hierarchy and property nodes without following parents', async () => {
    const root = new HierarchyTreeBuilder()
      .setId('root')
      .setName('root')
      .build();
    const property = new PropertyTreeBuilder()
      .setRootId('p')
      .setName('properties')
      .build();
    property.addOrReplaceChild(property);
    spyOn(root, 'getAllProperties').and.resolveTo(property);
    root.addOrReplaceChild(root);
    const snapshot = await queryWinscopeTraceData(
      collection(
        new TraceBuilder<HierarchyTreeNode>().setEntries([root]).build(),
      ),
      position(20n),
    );
    expect(snapshot.incompleteReasons).toContain('cycle');
    expect(snapshot.truncated).toBeTrue();
    assertSafe(snapshot);
  });

  it('preserves nanoseconds above Number.MAX_SAFE_INTEGER exactly', async () => {
    const ns = 1793664112345678901n;
    const snapshot = await queryWinscopeTraceData(
      collection(
        new TraceBuilder<string>()
          .setEntries(['value'])
          .setTimestamps([makeRealTimestamp(ns)])
          .build(),
      ),
      position(ns + 1n),
      'timestamp',
    );
    expect(snapshot.requestedTimestampNs).toBe('1793664112345678902');
    expect(snapshot.entries[0].timestampNs).toBe('1793664112345678901');
    assertSafe(snapshot);
  });

  it('reports decode and lookup failures without losing successful traces', async () => {
    const parser = new ParserBuilder<string>().setEntries(['bad']).build();
    spyOn(parser, 'getEntry').and.rejectWith(new Error('decode failure'));
    const bad = new TraceBuilder<string>().setParser(parser).build();
    const lookup = temporalTrace();
    spyOn(lookup, 'getEntry').and.throwError('lookup failure');
    const good = temporalTrace();
    const snapshot = await queryWinscopeTraceData(
      collection(bad, lookup, good),
      position(20n),
    );
    expect(snapshot.entries[0].incompleteReasons).toContain(
      'entry_decode_failed',
    );
    expect(snapshot.entries[1].incompleteReasons).toContain(
      'entry_lookup_failed',
    );
    expect(String(snapshot.entries[2].data)).toBe('twenty');
    assertSafe(snapshot);
  });

  it('exports screen recording metadata only', async () => {
    const media = new VideoEntry(new Blob(['private video content']), 1.25);
    const snapshot = await queryWinscopeTraceData(
      collection(
        new TraceBuilder<VideoEntry>()
          .setType(TraceType.SCREEN_RECORDING)
          .setEntries([media])
          .build(),
      ),
      position(20n),
    );
    expect(snapshot.entries[0].data as unknown).toEqual({
      kind: 'media_metadata',
      videoTimeSeconds: 1.25,
    });
    expect(JSON.stringify(snapshot)).not.toContain('private video content');
    expect(JSON.stringify(snapshot)).not.toContain('frameData');
    assertSafe(snapshot);
  });

  it('bounds a large real hierarchy and multi-byte output across traces', async () => {
    const root = new HierarchyTreeBuilder()
      .setId('root')
      .setName('root')
      .setProperties({text: '界'.repeat(8000)})
      .build();
    for (let i = 0; i < 1000; i++) {
      root.addOrReplaceChild(
        new HierarchyTreeBuilder()
          .setId(i)
          .setName(`window${i}`)
          .setProperties({
            title: '界'.repeat(8000),
            values: Array.from({length: 500}, (_, n) => n),
          })
          .build(),
      );
    }
    const traces = collection(
      ...Array.from({length: 5}, (_, i) =>
        new TraceBuilder<HierarchyTreeNode>()
          .setEntries([root])
          .setDescriptors([`source${i}`])
          .build(),
      ),
    );
    const snapshot = await queryWinscopeTraceData(traces, position(20n));
    expect(snapshot.entries.length).toBe(5);
    expect(snapshot.truncated).toBeTrue();
    expect(snapshot.incompleteReasons).toContain('array_limit');
    expect(snapshot.incompleteReasons).toContain('string_limit');
    expect(snapshot.incompleteReasons).toContain('data_size_limit');
    expect(JSON.stringify(snapshot.entries[0].data)).toContain('root');
    snapshot.entries.forEach((entry) => expect(entry.truncated).toBeTrue());
    assertSafe(snapshot);
  });

  it('bounds deep property trees', async () => {
    const deep = new PropertyTreeBuilder()
      .setRootId('p')
      .setName('deep')
      .build();
    let child = deep;
    for (let i = 0; i < 100; i++) {
      const next = new PropertyTreeBuilder()
        .setRootId(`${i}`)
        .setName('next')
        .setValue(i)
        .build();
      child.addOrReplaceChild(next);
      child = next;
    }
    child.addOrReplaceChild(deep);
    const snapshot = await queryWinscopeTraceData(
      collection(
        new TraceBuilder<PropertyTreeNode>().setEntries([deep]).build(),
      ),
      position(20n),
    );
    expect(snapshot.incompleteReasons).toContain('depth_limit');
    assertSafe(snapshot);
  });

  it('caps trace counts and includes multi-byte descriptors in the final UTF-8 limit', async () => {
    const traces = new Traces();
    for (let i = 0; i < 200; i++) {
      traces.addTrace(
        new TraceBuilder<string>()
          .setEntries(['value'])
          .setDescriptors(Array.from({length: 4}, () => '\u754c'.repeat(300)))
          .build(),
      );
    }
    const snapshot = await queryWinscopeTraceData(traces, position(20n));
    expect(snapshot.entries.length).toBeLessThanOrEqual(128);
    expect(snapshot.incompleteReasons).toContain('trace_count_limit');
    expect(snapshot.incompleteReasons).toContain('serialized_output_limit');
    expect(snapshot.truncated).toBeTrue();
    assertSafe(snapshot);
  });

  it('times out a never-resolving entry decoder', async () => {
    jasmine.clock().install();
    jasmine.clock().mockDate();
    try {
      const parser = new ParserBuilder<string>()
        .setEntries(['blocked'])
        .build();
      let started!: () => void;
      const reading = new Promise<void>((resolve) => {
        started = resolve;
      });
      spyOn(parser, 'getEntry').and.callFake(() => {
        started();
        return new Promise(() => {});
      });
      const pending = queryWinscopeTraceData(
        collection(new TraceBuilder<string>().setParser(parser).build()),
        position(20n),
      );
      await reading;
      jasmine.clock().tick(10_001);
      const snapshot = await pending;
      expect(snapshot.entries[0].index).toBe(0);
      expect(snapshot.entries[0].data as unknown).toBeNull();
      expect(snapshot.incompleteReasons).toContain('query_deadline_exceeded');
      expect(snapshot.truncated).toBeTrue();
      assertSafe(snapshot);
    } finally {
      jasmine.clock().uninstall();
    }
  });

  it('returns partial data after one shared deadline, even if lazy properties never resolve', async () => {
    jasmine.clock().install();
    jasmine.clock().mockDate();
    try {
      const root = new HierarchyTreeBuilder()
        .setId('root')
        .setName('retained')
        .build();
      let started!: () => void;
      const reading = new Promise<void>((resolve) => {
        started = resolve;
      });
      spyOn(root, 'getAllProperties').and.callFake(() => {
        started();
        return new Promise(() => {});
      });
      const later = new ParserBuilder<string>().setEntries(['later']).build();
      const laterRead = spyOn(later, 'getEntry').and.callThrough();
      const pending = queryWinscopeTraceData(
        collection(
          new TraceBuilder<HierarchyTreeNode>().setEntries([root]).build(),
          new TraceBuilder<string>().setParser(later).build(),
        ),
        position(20n),
      );
      await reading;
      jasmine.clock().tick(10_001);
      const snapshot = await pending;
      expect(record(snapshot.entries[0].data)['name']).toBe('retained');
      expect(snapshot.entries[0].incompleteReasons).toContain(
        'query_deadline_exceeded',
      );
      expect(snapshot.entries[1].incompleteReasons).toContain(
        'query_deadline_exceeded',
      );
      expect(laterRead).not.toHaveBeenCalled();
      expect(snapshot.truncated).toBeTrue();
      assertSafe(snapshot);
    } finally {
      jasmine.clock().uninstall();
    }
  });
});
