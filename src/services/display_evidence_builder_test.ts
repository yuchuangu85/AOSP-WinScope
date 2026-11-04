/* eslint-disable winscope/sort-imports */
import {
  makeRealTimestamp,
  makeZeroTimestamp,
} from '@common/time/testing/test_helpers';
import {ParserBuilder} from '@trace_api/testing/parser_builder';
import {TraceBuilder} from '@trace_api/testing/trace_builder';
import {Trace} from '@trace_api/trace';
import {TraceType} from '@trace_api/trace_type';
import {Traces} from '@trace_api/traces';
import {
  MediaBasedTraceEntry,
  VideoEntry,
} from '@trace/media_based/media_based_trace_entry';

import {
  averageLuma,
  averagePixelDifference,
  buildDisplayEvidence,
} from './display_evidence_builder';
/* eslint-enable winscope/sort-imports */

describe('Display evidence builder', () => {
  const startNs = 1_793_664_112_345_678_901n;
  const collection = (...sources: Array<Trace<unknown>>) => {
    const traces = new Traces();
    sources.forEach((trace) => traces.addTrace(trace));
    return traces;
  };
  const hierarchy = (name: string) => ({
    name,
    getAllChildren: () => [],
  });
  const recording = (length: number) =>
    new TraceBuilder<MediaBasedTraceEntry>()
      .setType(TraceType.SCREEN_RECORDING)
      .setEntries(
        Array.from(
          {length},
          (_, index) => new VideoEntry(new Blob(['video']), index / 60),
        ),
      )
      .setTimestamps(
        Array.from({length}, (_, index) =>
          makeRealTimestamp(startNs + BigInt(index) * 16_666_667n),
        ),
      )
      .build();

  it('computes normalized luminance from RGBA pixels', () => {
    expect(averageLuma(new Uint8ClampedArray([0, 0, 0, 255]))).toBe(0);
    expect(
      averageLuma(new Uint8ClampedArray([255, 255, 255, 255, 255])),
    ).toBeCloseTo(1, 10);
  });

  it('computes normalized RGB frame difference', () => {
    expect(
      averagePixelDifference(
        new Uint8ClampedArray([0, 0, 0, 255]),
        new Uint8ClampedArray([255, 255, 255, 255]),
      ),
    ).toBe(1);
  });

  it('reports limitations and no visual samples even without any traces', async () => {
    const evidence = await buildDisplayEvidence(new Traces());
    expect(evidence.video).toBeUndefined();
    expect(evidence.metadata.traceTypes).toEqual([]);
    expect(evidence.metadata.dataSources).toEqual([]);
    expect(evidence.metadata.timeBounds).toBeUndefined();
    expect(evidence.metadata.captureConfiguration).toBe('unknown');
    expect(evidence.metadata.sampledFrameCount).toBe(0);
    expect(evidence.metadata.evidenceVersion).toBe('1');
    expect(evidence.metadata.visualEvidence).toEqual({
      modelReceivedPixels: false,
      analysis: 'luma-and-frame-difference-only',
      sampling: 'uniform',
      sampleLimit: 24,
      pixelSampleSize: 32,
    });
    expect(evidence.metadata.evidenceLimitations.join(' ')).toContain(
      'completeness',
    );
    expect(evidence.metadata.evidenceLimitations.join(' ')).toContain(
      'WindowManager log level',
    );
    expect(evidence.metadata.evidenceLimitations.join(' ')).toContain(
      'No screen recording',
    );
  });

  it('keeps precise per-source endpoints and combined time bounds', async () => {
    const sf = new TraceBuilder()
      .setType(TraceType.SURFACE_FLINGER)
      .setEntries([hierarchy('layer.a'), hierarchy('layer.b')])
      .setTimestamps([
        makeRealTimestamp(startNs),
        makeRealTimestamp(startNs + 1n),
      ])
      .build();
    const tx = new TraceBuilder()
      .setType(TraceType.TRANSACTIONS)
      .setEntries([{id: 1}, {id: 2}])
      .setTimestamps([
        makeRealTimestamp(startNs - 2n),
        makeRealTimestamp(startNs + 20n),
      ])
      .build();
    const evidence = await buildDisplayEvidence(collection(sf, tx));
    expect(evidence.metadata.dataSources).toEqual([
      {
        name: 'SURFACE_FLINGER',
        entryCount: 2,
        firstTimestampNs: startNs.toString(),
        lastTimestampNs: (startNs + 1n).toString(),
      },
      {
        name: 'TRANSACTIONS',
        entryCount: 2,
        firstTimestampNs: (startNs - 2n).toString(),
        lastTimestampNs: (startNs + 20n).toString(),
      },
    ]);
    expect(evidence.metadata.timeBounds).toEqual({
      startTimestampNs: (startNs - 2n).toString(),
      endTimestampNs: (startNs + 20n).toString(),
    });
    expect(evidence.surfaceFlinger?.summaryOnly).toBeTrue();
    expect(evidence.surfaceFlinger?.sampledEntryCount).toBe(2);
    expect(evidence.transactions?.summaryOnly).toBeTrue();
    expect(evidence.transactions?.sampledEntryCount).toBe(2);
    expect(evidence.transactions?.count).toBe(2);
    expect(evidence.transactions?.sampleKeys).toEqual(['id']);
    expect(evidence.video).toBeUndefined();
    expect(JSON.parse(JSON.stringify(evidence)).metadata.timeBounds).toEqual(
      evidence.metadata.timeBounds,
    );
  });

  it('includes every imported source of the same type, not just the longest', async () => {
    const a = new TraceBuilder()
      .setEntries([{}])
      .setTimestamps([makeRealTimestamp(startNs)])
      .build();
    const b = new TraceBuilder()
      .setEntries([{}, {}])
      .setTimestamps([
        makeRealTimestamp(startNs + 1n),
        makeRealTimestamp(startNs + 2n),
      ])
      .build();
    const evidence = await buildDisplayEvidence(collection(a, b));
    expect(
      evidence.metadata.dataSources.map((source) => source.entryCount),
    ).toEqual([1, 2]);
  });

  it('builds metadata for other sources without decoding or retaining raw entry bytes', async () => {
    const parser = new ParserBuilder<Blob>()
      .setType(TraceType.PROTO_LOG)
      .setEntries([new Blob(['raw trace bytes'])])
      .setTimestamps([makeRealTimestamp(startNs)])
      .build();
    const read = spyOn(parser, 'getEntry').and.throwError(
      'must not decode metadata-only sources',
    );
    const source = new TraceBuilder()
      .setType(TraceType.PROTO_LOG)
      .setParser(parser)
      .build();
    const evidence = await buildDisplayEvidence(collection(source));
    expect(read).not.toHaveBeenCalled();
    expect(evidence.metadata.dataSources).toEqual([
      {
        name: 'PROTO_LOG',
        entryCount: 1,
        firstTimestampNs: startNs.toString(),
        lastTimestampNs: startNs.toString(),
      },
    ]);
    expect(JSON.stringify(evidence)).not.toContain('raw trace bytes');
  });

  it('counts only successful summary samples and preserves evidence from other sources', async () => {
    const parser = new ParserBuilder()
      .setType(TraceType.TRANSACTIONS)
      .setEntries([{firstKey: 1}, {omitted: 2}, {lastKey: 3}])
      .build();
    const read = parser.getEntry.bind(parser);
    spyOn(parser, 'getEntry').and.callFake((index) =>
      index === 1
        ? Promise.reject(new Error('raw parse details'))
        : read(index),
    );
    const tx = new TraceBuilder()
      .setType(TraceType.TRANSACTIONS)
      .setParser(parser)
      .build();
    const sf = new TraceBuilder().setEntries([hierarchy('layer')]).build();
    const evidence = await buildDisplayEvidence(collection(tx, sf));
    expect(evidence.transactions?.count).toBe(3);
    expect(evidence.transactions?.sampledEntryCount).toBe(2);
    expect(evidence.transactions?.sampleKeys).toEqual(['firstKey', 'lastKey']);
    expect(evidence.surfaceFlinger?.sampledEntryCount).toBe(1);
    expect(evidence.metadata.evidenceLimitations.join(' ')).toContain(
      'TRANSACTIONS key sample at index 1',
    );
    expect(JSON.stringify(evidence)).not.toContain('raw parse details');
  });

  it('does not access entry zero for any empty trace', async () => {
    const sources = [
      TraceType.SURFACE_FLINGER,
      TraceType.WINDOW_MANAGER,
      TraceType.TRANSACTIONS,
      TraceType.SCREEN_RECORDING,
    ].map((type) => new TraceBuilder().setType(type).setEntries([]).build());
    const reads = sources.map((source) =>
      spyOn(source, 'getEntry').and.throwError('empty trace accessed'),
    );
    const evidence = await buildDisplayEvidence(collection(...sources));
    reads.forEach((read) => expect(read).not.toHaveBeenCalled());
    expect(
      evidence.metadata.dataSources.every((source) => source.entryCount === 0),
    ).toBeTrue();
    expect(evidence.metadata.timeBounds).toBeUndefined();
    expect(evidence.metadata.visualEvidence.totalFrameCount).toBe(0);
    expect(evidence.metadata.sampledFrameCount).toBe(0);
    expect(evidence.surfaceFlinger?.sampledEntryCount).toBe(0);
    expect(evidence.transactions?.sampledEntryCount).toBe(0);
    expect(evidence.video).toBeUndefined();
  });

  it('does not describe hierarchy node names or property keys as visible windows', async () => {
    const wm = new TraceBuilder()
      .setType(TraceType.WINDOW_MANAGER)
      .setEntries([
        hierarchy('hidden.window'),
        {focusedWindow: 'not.a.node.name'},
      ])
      .build();
    const evidence = await buildDisplayEvidence(collection(wm));
    expect(evidence.windowManager?.displayState).toBe('unknown');
    expect(evidence.windowManager?.summaryOnly).toBeTrue();
    expect(evidence.windowManager?.sampledEntryCount).toBe(2);
    expect(evidence.windowManager?.visibleWindows).toBeUndefined();
    expect(evidence.windowManager?.sampledNodeNames).toEqual(['hidden.window']);
    expect(evidence.windowManager?.notes).toContain(
      'node names do not establish visibility',
    );
    expect(evidence.windowManager?.notes).toContain('sampled 2 entries');
  });

  it('clips huge UTF-8 node names and transaction keys without retaining raw payloads', async () => {
    const huge = '\u{1f600}'.repeat(70_000);
    const wm = new TraceBuilder()
      .setType(TraceType.WINDOW_MANAGER)
      .setEntries([hierarchy(huge)])
      .build();
    const sf = new TraceBuilder().setEntries([hierarchy(huge)]).build();
    const tx = new TraceBuilder()
      .setType(TraceType.TRANSACTIONS)
      .setEntries([{[huge]: new Blob(['raw bytes'])}])
      .build();
    const evidence = await buildDisplayEvidence(collection(wm, sf, tx));
    const name = evidence.windowManager!.sampledNodeNames![0];
    expect(new TextEncoder().encode(name).length).toBeLessThanOrEqual(256);
    expect(name).not.toContain('\ufffd');
    expect(
      new TextEncoder().encode(evidence.transactions!.sampleKeys![0]).length,
    ).toBeLessThanOrEqual(256);
    expect(evidence.metadata.evidenceLimitations.join(' ')).toContain(
      '256-byte',
    );
    expect(
      new TextEncoder().encode(JSON.stringify(evidence)).length,
    ).toBeLessThanOrEqual(32 * 1024);
    expect(JSON.stringify(evidence)).not.toContain(huge);
    expect(evidence.metadata.captureConfiguration).toBe('unknown');
  });

  it('bounds iterative hierarchy traversal globally and never invokes recursive DFS', async () => {
    const children = Array.from({length: 5000}, (_, index) =>
      hierarchy(`node.${index}`),
    );
    const root = {
      name: 'root',
      getAllChildren: () => children,
      forEachNodeDfs: jasmine
        .createSpy('recursive traversal')
        .and.throwError('must not recurse'),
    };
    const sf = new TraceBuilder().setEntries([root]).build();
    const wm = new TraceBuilder()
      .setType(TraceType.WINDOW_MANAGER)
      .setEntries([root])
      .build();
    const evidence = await buildDisplayEvidence(collection(sf, wm));
    expect(root.forEachNodeDfs).not.toHaveBeenCalled();
    expect(evidence.surfaceFlinger?.notes).toContain(
      'observed hierarchy nodes: 2048',
    );
    expect(evidence.windowManager?.notes).toContain(
      'observed hierarchy nodes: 0',
    );
    expect(evidence.metadata.evidenceLimitations.join(' ')).toContain('2048');
    expect(evidence.metadata.evidenceLimitations.join(' ')).toContain(
      'node name limit',
    );
  });

  it('detects cyclic hierarchy references without recursion or duplicate node counts', async () => {
    const root = {name: 'cyclic.root', getAllChildren: (): unknown[] => [root]};
    const source = new TraceBuilder()
      .setType(TraceType.WINDOW_MANAGER)
      .setEntries([root])
      .build();
    const evidence = await buildDisplayEvidence(collection(source));
    expect(evidence.windowManager?.sampledNodeNames).toEqual(['cyclic.root']);
    expect(evidence.windowManager?.notes).toContain(
      'observed hierarchy nodes: 1',
    );
    expect(evidence.metadata.evidenceLimitations.join(' ')).toContain('cycle');
  });

  it('does not overflow the call stack for a deeply nested hierarchy', async () => {
    type Node = {name: string; getAllChildren: () => Node[]};
    let root: Node = {name: 'leaf', getAllChildren: () => []};
    for (let depth = 0; depth < 10_000; depth++) {
      const child = root;
      root = {name: `depth.${depth}`, getAllChildren: () => [child]};
    }
    const source = new TraceBuilder().setEntries([root]).build();
    const evidence = await buildDisplayEvidence(collection(source));
    expect(evidence.surfaceFlinger?.sampledEntryCount).toBe(1);
    expect(evidence.surfaceFlinger?.notes).toContain(
      'observed hierarchy nodes: 2048',
    );
    expect(evidence.metadata.evidenceLimitations.join(' ')).toContain(
      '2048-node',
    );
  });

  it('keeps the entire overview within 32 KiB including JSON escaping and many sources', async () => {
    const escapedName = '\u0000'.repeat(257_000);
    const nodes = Array.from({length: 32}, (_, index) =>
      hierarchy(`${index}${escapedName}`),
    );
    const sf = new TraceBuilder()
      .setEntries([{name: 'root', getAllChildren: () => nodes}])
      .build();
    const wm = new TraceBuilder()
      .setType(TraceType.WINDOW_MANAGER)
      .setEntries([{name: 'root', getAllChildren: () => nodes}])
      .build();
    const keys = Object.fromEntries(
      Array.from({length: 24}, (_, index) => [
        `${index}${escapedName}`,
        'raw data',
      ]),
    );
    const tx = new TraceBuilder()
      .setType(TraceType.TRANSACTIONS)
      .setEntries([keys])
      .build();
    const sources = Array.from({length: 100}, () =>
      new TraceBuilder().setType(TraceType.PROTO_LOG).setEntries([{}]).build(),
    );
    const evidence = await buildDisplayEvidence(
      collection(sf, wm, tx, ...sources),
    );
    expect(
      new TextEncoder().encode(JSON.stringify(evidence)).length,
    ).toBeLessThanOrEqual(32 * 1024);
    expect(evidence.metadata.evidenceLimitations.join(' ')).toContain('32 KiB');
    expect(evidence.metadata.evidenceLimitations.join(' ')).toContain(
      'source limit',
    );
    expect(evidence.metadata.captureConfiguration).toBe('unknown');
    expect(evidence.windowManager?.summaryOnly).toBeTrue();
    expect(evidence.windowManager?.visibleWindows).toBeUndefined();
    expect(JSON.stringify(evidence)).not.toContain('raw data');
  });

  describe('shared overview deadline', () => {
    beforeEach(() => {
      jasmine.clock().install();
      jasmine.clock().mockDate(new Date(0));
    });
    afterEach(() => jasmine.clock().uninstall());
    const flush = async () => {
      for (let i = 0; i < 50; i++) await Promise.resolve();
    };

    it('returns partial metadata after a stalled hierarchy decoder and does not start later decodes', async () => {
      const sf = new TraceBuilder()
        .setEntries([hierarchy('unavailable')])
        .build();
      const sfEntry = sf.getEntry(0);
      let resolve: (value: unknown) => void = () => {};
      spyOn(sfEntry, 'getValue').and.returnValue(
        new Promise((done) => {
          resolve = done;
        }),
      );
      spyOn(sf, 'getEntry').and.returnValue(sfEntry);
      const tx = new TraceBuilder()
        .setType(TraceType.TRANSACTIONS)
        .setEntries([{id: 1}])
        .build();
      const txEntry = tx.getEntry(0);
      const readTx = spyOn(txEntry, 'getValue').and.callThrough();
      spyOn(tx, 'getEntry').and.returnValue(txEntry);
      let settled = false;
      const pending = buildDisplayEvidence(collection(sf, tx)).then((value) => {
        settled = true;
        return value;
      });
      await flush();
      jasmine.clock().tick(9999);
      await flush();
      expect(settled).toBeFalse();
      jasmine.clock().tick(1);
      await flush();
      expect(settled).toBeTrue();
      const evidence = await pending;
      expect(readTx).not.toHaveBeenCalled();
      expect(evidence.surfaceFlinger?.sampledEntryCount).toBe(0);
      expect(evidence.transactions?.sampledEntryCount).toBe(0);
      expect(evidence.metadata.dataSources.length).toBe(2);
      expect(evidence.metadata.evidenceLimitations.join(' ')).toContain(
        'deadline',
      );
      const serialized = JSON.stringify(evidence);
      resolve(hierarchy('late raw data'));
      await flush();
      expect(JSON.stringify(evidence)).toBe(serialized);
    });

    it('bounds a never-resolving video entry decode with the same overview deadline', async () => {
      const source = recording(3);
      const entry = source.getEntry(0);
      spyOn(entry, 'getValue').and.returnValue(new Promise(() => {}));
      const getEntry = source.getEntry.bind(source);
      spyOn(source, 'getEntry').and.callFake((index) =>
        index === 0 ? entry : getEntry(index),
      );
      let settled = false;
      const pending = buildDisplayEvidence(collection(source)).then((value) => {
        settled = true;
        return value;
      });
      await flush();
      jasmine.clock().tick(10_000);
      await flush();
      expect(settled).toBeTrue();
      const evidence = await pending;
      expect(evidence.metadata.sampledFrameCount).toBe(0);
      expect(evidence.metadata.evidenceLimitations.join(' ')).toContain(
        'deadline',
      );
    });
  });

  it('isolates endpoint and entry failures to their trace and does not copy raw error details', async () => {
    const failed = new TraceBuilder()
      .setType(TraceType.SURFACE_FLINGER)
      .setEntries([{}])
      .build();
    spyOn(failed, 'getEntry').and.throwError('secret raw payload');
    const tx = new TraceBuilder()
      .setType(TraceType.TRANSACTIONS)
      .setEntries([{transactionId: 1}])
      .build();
    const evidence = await buildDisplayEvidence(collection(failed, tx));
    expect(evidence.metadata.dataSources[0]).toEqual({
      name: 'SURFACE_FLINGER',
      entryCount: 1,
    });
    expect(evidence.transactions?.sampledEntryCount).toBe(1);
    expect(evidence.metadata.evidenceLimitations.join(' ')).toContain(
      'SURFACE_FLINGER',
    );
    expect(JSON.stringify(evidence)).not.toContain('secret raw payload');
  });

  it('omits invalid timestamps instead of presenting an untimed dump as a real time bound', async () => {
    const dump = new TraceBuilder()
      .setType(TraceType.WINDOW_MANAGER)
      .setEntries([{}])
      .setTimestamps([makeZeroTimestamp()])
      .build();
    const evidence = await buildDisplayEvidence(collection(dump));
    expect(evidence.metadata.dataSources[0]).toEqual({
      name: 'WINDOW_MANAGER',
      entryCount: 1,
    });
    expect(evidence.metadata.timeBounds).toBeUndefined();
    expect(evidence.metadata.evidenceLimitations.join(' ')).toContain(
      'timestamp',
    );
  });

  describe('video sampling', () => {
    let video: HTMLVideoElement;
    let context: CanvasRenderingContext2D;
    let pixels: number;
    let decodeFails: boolean;

    beforeEach(() => {
      pixels = 0;
      decodeFails = false;
      const canvas = document.createElement('canvas');
      context = canvas.getContext('2d')!;
      video = document.createElement('video');
      Object.defineProperty(video, 'readyState', {
        get: () => (decodeFails ? 0 : 1),
      });
      Object.defineProperty(video, 'duration', {value: 2});
      let currentTime = 0;
      Object.defineProperty(video, 'currentTime', {
        configurable: true,
        get: () => currentTime,
        set: (value: number) => {
          currentTime = value;
          video.dispatchEvent(new Event('seeked'));
        },
      });
      spyOn(video, 'pause');
      spyOn(video, 'load').and.callFake(() => {
        if (decodeFails) video.dispatchEvent(new Event('error'));
      });
      spyOn(context, 'drawImage');
      spyOn(context, 'getImageData').and.callFake(() => {
        pixels++;
        return new ImageData(
          new Uint8ClampedArray([pixels, pixels, pixels, 255]),
          1,
          1,
        );
      });
      const createElement = document.createElement.bind(document);
      spyOn(document, 'createElement').and.callFake((tag: string) => {
        if (tag === 'video') return video;
        if (tag === 'canvas') return canvas;
        return createElement(tag);
      });
      spyOn(URL, 'createObjectURL').and.returnValue(
        'blob:display-evidence-test',
      );
      spyOn(URL, 'revokeObjectURL');
    });

    it('labels uniform sampling with exact trace times, total count, bounds, and no device frameRate', async () => {
      const evidence = await buildDisplayEvidence(collection(recording(120)));
      const sampled = evidence.video!;
      const indices = Array.from({length: 24}, (_, index) =>
        Math.round((index * 119) / 23),
      );
      expect(sampled.totalFrameCount).toBe(120);
      expect(sampled.sampling).toBe('uniform');
      expect(sampled.frames.map((frame) => frame.index)).toEqual(indices);
      expect(sampled.frames.map((frame) => frame.traceTimestampNs)).toEqual(
        indices.map((index) =>
          (startNs + BigInt(index) * 16_666_667n).toString(),
        ),
      );
      expect(sampled.frames[23].timestampMs).toBe((119 / 60) * 1000);
      expect(sampled.frameRate).toBeUndefined();
      expect(sampled.durationMs).toBe(2000);
      expect(evidence.metadata.sampledFrameCount).toBe(24);
      expect(evidence.metadata.visualEvidence.totalFrameCount).toBe(120);
      expect(evidence.metadata.timeBounds?.endTimestampNs).toBe(
        (startNs + 119n * 16_666_667n).toString(),
      );
      expect(JSON.stringify(evidence)).not.toContain('frameRate');
      expect(URL.revokeObjectURL).toHaveBeenCalledWith(
        'blob:display-evidence-test',
      );
      expect(video.getAttribute('src')).toBeNull();
    });

    it('labels contiguous original indices as contiguous without estimating refresh rate', async () => {
      const evidence = await buildDisplayEvidence(collection(recording(3)));
      expect(evidence.video?.sampling).toBe('contiguous');
      expect(evidence.video?.frames.map((frame) => frame.index)).toEqual([
        0, 1, 2,
      ]);
      expect(evidence.video?.frameRate).toBeUndefined();
    });

    it('omits oversized timestamps without rounding them or exceeding the overview byte budget', async () => {
      const source = new TraceBuilder()
        .setType(TraceType.SCREEN_RECORDING)
        .setEntries([new VideoEntry(new Blob(['video']), 0)])
        .setTimestamps([makeRealTimestamp(10n ** 40_000n)])
        .build();
      const evidence = await buildDisplayEvidence(collection(source));
      expect(evidence.video?.frames.length).toBe(1);
      expect(evidence.video?.frames[0].traceTimestampNs).toBeUndefined();
      expect(evidence.metadata.dataSources[0].firstTimestampNs).toBeUndefined();
      expect(evidence.metadata.timeBounds).toBeUndefined();
      expect(evidence.metadata.evidenceLimitations.join(' ')).toContain(
        'Oversized',
      );
      expect(
        new TextEncoder().encode(JSON.stringify(evidence)).length,
      ).toBeLessThanOrEqual(32 * 1024);
    });

    it('labels partial coverage uniform even when the successful original indices are contiguous', async () => {
      (context.getImageData as jasmine.Spy).and.callFake(() => {
        if (video.currentTime === 2 / 60) {
          throw new Error('last sample unavailable');
        }
        return new ImageData(new Uint8ClampedArray([0, 0, 0, 255]), 1, 1);
      });
      const evidence = await buildDisplayEvidence(collection(recording(3)));
      expect(evidence.video?.frames.map((frame) => frame.index)).toEqual([
        0, 1,
      ]);
      expect(evidence.video?.totalFrameCount).toBe(3);
      expect(evidence.video?.sampling).toBe('uniform');

      const single = await buildDisplayEvidence(collection(recording(3)), 1);
      expect(single.video?.frames.map((frame) => frame.index)).toEqual([0]);
      expect(single.video?.sampling).toBe('uniform');
      expect(single.metadata.visualEvidence.modelReceivedPixels).toBeFalse();
    });

    it('uses original absolute indices and exact timestamps for a sliced recording', async () => {
      const sliced = recording(8).sliceTime(
        makeRealTimestamp(startNs + 2n * 16_666_667n),
        makeRealTimestamp(startNs + 6n * 16_666_667n),
      );
      const evidence = await buildDisplayEvidence(collection(sliced), 2);
      expect(evidence.video?.frames.map((frame) => frame.index)).toEqual([
        2, 5,
      ]);
      expect(evidence.video?.frames[0].traceTimestampNs).toBe(
        (startNs + 2n * 16_666_667n).toString(),
      );
      expect(evidence.video?.sampling).toBe('uniform');
    });

    it('computes differences from the previous successful sample when an entry is omitted or rejected', async () => {
      const parser = new ParserBuilder<MediaBasedTraceEntry | undefined>()
        .setType(TraceType.SCREEN_RECORDING)
        .setEntries([
          new VideoEntry(new Blob(['bytes']), 0),
          undefined,
          new VideoEntry(new Blob(['bytes']), 2),
          new VideoEntry(new Blob(['bytes']), 3),
        ])
        .build();
      const read = parser.getEntry.bind(parser);
      spyOn(parser, 'getEntry').and.callFake((index) =>
        index === 2 ? Promise.reject(new Error('unreadable')) : read(index),
      );
      const source = new TraceBuilder()
        .setType(TraceType.SCREEN_RECORDING)
        .setParser(parser)
        .build();
      const evidence = await buildDisplayEvidence(collection(source));
      expect(evidence.video?.frames.map((frame) => frame.index)).toEqual([
        0, 3,
      ]);
      expect(evidence.video?.sampling).toBe('uniform');
      expect(evidence.video?.frameDiffs).toEqual([
        {fromIndex: 0, toIndex: 3, value: 1 / 255},
      ]);
      expect(evidence.metadata.sampledFrameCount).toBe(2);
      expect(evidence.metadata.evidenceLimitations.join(' ')).toContain(
        'sample',
      );
    });

    it('retains successful samples when pixel extraction fails between frames', async () => {
      (context.getImageData as jasmine.Spy).and.callFake(() => {
        if (video.currentTime === 1 / 60) throw new Error('unavailable pixels');
        return new ImageData(
          new Uint8ClampedArray([pixels++, 0, 0, 255]),
          1,
          1,
        );
      });
      const evidence = await buildDisplayEvidence(collection(recording(3)));
      expect(evidence.video?.frames.map((frame) => frame.index)).toEqual([
        0, 2,
      ]);
      expect(evidence.video?.frameDiffs[0].fromIndex).toBe(0);
      expect(evidence.video?.sampling).toBe('uniform');
      expect(evidence.metadata.sampledFrameCount).toBe(2);
    });

    it('preserves structural evidence, metadata, and cleanup when decoding fails', async () => {
      decodeFails = true;
      const wm = new TraceBuilder()
        .setType(TraceType.WINDOW_MANAGER)
        .setEntries([hierarchy('app.window')])
        .build();
      const evidence = await buildDisplayEvidence(collection(wm, recording(3)));
      expect(evidence.windowManager?.sampledNodeNames).toEqual(['app.window']);
      expect(evidence.video?.totalFrameCount).toBe(3);
      expect(evidence.video?.frames).toEqual([]);
      expect(evidence.metadata.sampledFrameCount).toBe(0);
      expect(evidence.metadata.dataSources.length).toBe(2);
      expect(evidence.metadata.evidenceLimitations.join(' ')).toContain(
        'decode',
      );
      expect(URL.revokeObjectURL).toHaveBeenCalledWith(
        'blob:display-evidence-test',
      );
      expect(video.pause).toHaveBeenCalled();
      expect(video.getAttribute('src')).toBeNull();
    });

    it('times out stalled media metadata within the overview deadline and removes event listeners', async () => {
      jasmine.clock().install();
      jasmine.clock().mockDate(new Date(0));
      try {
        decodeFails = true;
        (video.load as jasmine.Spy).and.stub();
        const removed = spyOn(video, 'removeEventListener').and.callThrough();
        const flush = async () => {
          for (let i = 0; i < 80; i++) await Promise.resolve();
        };
        let settled = false;
        const pending = buildDisplayEvidence(collection(recording(24))).then(
          (value) => {
            settled = true;
            return value;
          },
        );
        await flush();
        jasmine.clock().tick(10_000);
        await flush();
        expect(settled).toBeTrue();
        const evidence = await pending;
        expect(evidence.metadata.sampledFrameCount).toBe(0);
        expect(evidence.metadata.evidenceLimitations.join(' ')).toContain(
          'deadline',
        );
        expect(removed).toHaveBeenCalledWith(
          'loadedmetadata',
          jasmine.any(Function),
        );
        expect(removed).toHaveBeenCalledWith('error', jasmine.any(Function));
        expect(URL.revokeObjectURL).toHaveBeenCalled();
        expect(video.getAttribute('src')).toBeNull();
      } finally {
        jasmine.clock().uninstall();
      }
    });

    it('shares one deadline across hierarchy reads, metadata, and multiple seeks', async () => {
      jasmine.clock().install();
      jasmine.clock().mockDate(new Date(0));
      try {
        decodeFails = true;
        (video.load as jasmine.Spy).and.callFake(() => {
          setTimeout(
            () => video.dispatchEvent(new Event('loadedmetadata')),
            2000,
          );
        });
        const seeks = jasmine.createSpy('seek');
        let currentTime = 0;
        Object.defineProperty(video, 'currentTime', {
          get: () => currentTime,
          set: (value: number) => {
            seeks(value);
            currentTime = value;
            setTimeout(() => video.dispatchEvent(new Event('seeked')), 3000);
          },
        });
        const sf = new TraceBuilder().setEntries([hierarchy('layer')]).build();
        const entry = sf.getEntry(0);
        spyOn(entry, 'getValue').and.callFake(
          () =>
            new Promise((resolve) => {
              setTimeout(() => resolve(hierarchy('layer')), 2000);
            }),
        );
        spyOn(sf, 'getEntry').and.returnValue(entry);
        const removed = spyOn(video, 'removeEventListener').and.callThrough();
        const flush = async () => {
          for (let i = 0; i < 80; i++) await Promise.resolve();
        };
        let settled = false;
        const pending = buildDisplayEvidence(
          collection(sf, recording(24)),
        ).then((value) => {
          settled = true;
          return value;
        });
        await flush();
        jasmine.clock().tick(2000);
        await flush();
        jasmine.clock().tick(2000);
        await flush();
        jasmine.clock().tick(3000);
        await flush();
        expect(settled).toBeFalse();
        jasmine.clock().tick(3000);
        await flush();
        expect(settled).toBeTrue();
        const evidence = await pending;
        expect(evidence.surfaceFlinger?.sampledEntryCount).toBe(1);
        expect(evidence.video?.frames.map((frame) => frame.index)).toEqual([
          0, 1,
        ]);
        expect(evidence.metadata.sampledFrameCount).toBe(2);
        expect(evidence.video?.sampling).toBe('uniform');
        expect(seeks).toHaveBeenCalledTimes(2);
        expect(removed).toHaveBeenCalledWith('seeked', jasmine.any(Function));
        expect(evidence.metadata.evidenceLimitations.join(' ')).toContain(
          'deadline',
        );
        expect(URL.revokeObjectURL).toHaveBeenCalled();
        const serialized = JSON.stringify(evidence);
        jasmine.clock().tick(30_000);
        await flush();
        expect(JSON.stringify(evidence)).toBe(serialized);
      } finally {
        jasmine.clock().uninstall();
      }
    });

    it('reports missing video bytes without pretending to have analyzed pixels', async () => {
      const source = new TraceBuilder()
        .setType(TraceType.SCREEN_RECORDING)
        .setEntries([{frameData: undefined, videoTimeSeconds: 0}])
        .build();
      const evidence = await buildDisplayEvidence(collection(source));
      expect(evidence.metadata.sampledFrameCount).toBe(0);
      expect(evidence.metadata.visualEvidence.modelReceivedPixels).toBeFalse();
      expect(evidence.metadata.evidenceLimitations.join(' ')).toContain(
        'video bytes',
      );
      expect(URL.createObjectURL).not.toHaveBeenCalled();
    });

    it('reports a missing canvas context and releases the video resource', async () => {
      spyOn(HTMLCanvasElement.prototype, 'getContext').and.returnValue(null);
      const evidence = await buildDisplayEvidence(collection(recording(3)));
      expect(evidence.metadata.sampledFrameCount).toBe(0);
      expect(evidence.metadata.evidenceLimitations.join(' ')).toContain(
        'canvas',
      );
      expect(URL.revokeObjectURL).toHaveBeenCalled();
    });

    it('caps the requested sample count at 24 and handles a zero sampling budget', async () => {
      const evidence = await buildDisplayEvidence(
        collection(recording(30)),
        100,
      );
      expect(evidence.video?.frames.length).toBe(24);
      const unsampled = await buildDisplayEvidence(collection(recording(3)), 0);
      expect(unsampled.metadata.sampledFrameCount).toBe(0);
      expect(unsampled.video?.frames).toEqual([]);
      expect(unsampled.metadata.visualEvidence.sampleLimit).toBe(0);
      expect(unsampled.metadata.evidenceLimitations.join(' ')).toContain(
        'zero sample limit',
      );
    });
  });
});
