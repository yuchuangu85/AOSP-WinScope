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
import {PropertyTreeNode} from '@tree_node/property_tree_node';
import {HierarchyTreeBuilder} from '@tree_node/testing/hierarchy_tree_builder';
import {PropertyTreeBuilder} from '@tree_node/testing/property_tree_builder';

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

  it('includes explicit WindowManager requested/matched times and exact signed offsets with payload references', async () => {
    const ns = 1_793_621_012_123_456_789n;
    const wm = new TraceBuilder().setType(TraceType.WINDOW_MANAGER)
      .setEntries([{focusedWindow: 'app.first', alpha: 0}, {focusedWindow: 'app.second', alpha: 1}])
      .setTimestamps([makeRealTimestamp(ns), makeRealTimestamp(ns + 10n)]).build();
    const snapshot = await queryWinscopeTraceData(collection(wm), position(ns + 5n), 'timestamp');
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
    expect((await queryWinscopeTraceData(collection(temporalTrace()), position(20n))).windowManager?.status).toBe('unavailable');
    const wm = temporalTrace(TraceType.WINDOW_MANAGER);
    const missing = await queryWinscopeTraceData(collection(wm), position(5n), 'timestamp');
    expect(missing.windowManager?.status).toBe('unavailable');
    expect(missing.windowManager?.entries[0].deltaNs).toBeUndefined();
    const dump = new TraceBuilder().setType(TraceType.WINDOW_MANAGER)
      .setEntries([{focusedWindow: 'dump.window'}]).setTimestamps([makeZeroTimestamp()]).build();
    const untimed = await queryWinscopeTraceData(collection(dump), position(20n));
    expect(untimed.windowManager?.status).toBe('partial');
    expect(untimed.windowManager?.entries[0].deltaNs).toBeUndefined();
    expect(untimed.windowManager?.incompleteReasons).toContain('window_manager_timestamp_unavailable');
  });

  it('labels partial WindowManager payloads honestly and respects the total snapshot budget', async () => {
    const wm = new TraceBuilder().setType(TraceType.WINDOW_MANAGER)
      .setEntries([{window: 'a'.repeat(3000)}]).setTimestamps([makeRealTimestamp(20n)]).build();
    const snapshot = await queryWinscopeTraceData(collection(wm), position(20n));
    expect(snapshot.windowManager?.status).toBe('partial');
    expect(snapshot.windowManager?.entries[0].truncated).toBeTrue();
    expect(snapshot.windowManager?.incompleteReasons).toContain('string_limit');
    assertSafe(snapshot);
  });

  it('keeps WindowManager references consistent when many sources hit the snapshot limit', async () => {
    const traces = new Traces();
    for (let index = 0; index < 128; index++) {
      traces.addTrace(new TraceBuilder().setType(TraceType.WINDOW_MANAGER)
        .setDescriptors(['窗口'.repeat(150)])
        .setEntries([{focusedWindow: `window-${index}`, flags: index}])
        .setTimestamps([makeRealTimestamp(20n)]).build());
    }
    const snapshot = await queryWinscopeTraceData(traces, position(20n));
    assertSafe(snapshot);
    expect(snapshot.windowManager!.entries.length).toBe(snapshot.entries.length);
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
