import {DesktopFileBatch, DesktopFiles, readDesktopFiles} from './desktop_files';

describe('desktop trace file intake', () => {
  let bridge: jasmine.SpyObj<DesktopFiles>;
  const batch: DesktopFileBatch = {
    token: 'approved-selection',
    files: [{name: 'layers.trace', size: 5, lastModified: 1234}],
  };

  beforeEach(() => {
    bridge = jasmine.createSpyObj('DesktopFiles', ['readChunk', 'complete', 'remember', 'onOpen']);
  });

  it('reads sequential chunks into an unchanged File and preserves metadata', async () => {
    bridge.readChunk.and.callFake(async (_token, _index, offset) =>
      new Uint8Array(offset === 0 ? [1, 2, 3] : [4, 5]));
    const [file] = await readDesktopFiles(bridge, batch);
    expect(file.name).toBe('layers.trace');
    expect(file.size).toBe(5);
    expect(file.lastModified).toBe(1234);
    expect(Array.from(new Uint8Array(await file.arrayBuffer()))).toEqual([1, 2, 3, 4, 5]);
    expect(bridge.readChunk.calls.allArgs()).toEqual([
      ['approved-selection', 0, 0], ['approved-selection', 0, 3],
    ]);
    expect(bridge.complete).not.toHaveBeenCalled();
    expect(bridge.remember).not.toHaveBeenCalled();
  });

  it('preserves file order and handles empty files without read requests', async () => {
    bridge.readChunk.and.resolveTo(new Uint8Array([1, 2, 3, 4, 5]));
    const files = await readDesktopFiles(bridge, {
      ...batch, files: [{name: 'empty', size: 0, lastModified: 0}, ...batch.files],
    });
    expect(files.map((file) => file.name)).toEqual(['empty', 'layers.trace']);
    expect(bridge.readChunk).toHaveBeenCalledOnceWith('approved-selection', 1, 0);
  });

  for (const chunk of [new Uint8Array(), new Uint8Array(6), new Uint8Array(4 * 1024 * 1024 + 1)]) {
    it(`rejects invalid chunk length ${chunk.length} without looping or accepting partial data`, async () => {
      bridge.readChunk.and.resolveTo(chunk);
      await expectAsync(readDesktopFiles(bridge, batch)).toBeRejectedWithError('Incomplete desktop file');
      expect(bridge.readChunk).toHaveBeenCalledTimes(1);
    });
  }

  it('propagates revoked or changed file errors without retrying', async () => {
    bridge.readChunk.and.rejectWith(new Error('File changed'));
    await expectAsync(readDesktopFiles(bridge, batch)).toBeRejectedWithError('File changed');
    expect(bridge.readChunk).toHaveBeenCalledTimes(1);
  });

  for (const invalid of [
    {token: '', files: []},
    {token: 'token', files: Array(65).fill(batch.files[0])},
    {token: 'token', files: [{name: 'bad', size: -1, lastModified: 0}]},
    {token: 'token', files: [{name: 'bad', size: 1.5, lastModified: 0}]},
  ]) {
    it('rejects malformed batches before reading', async () => {
      await expectAsync(readDesktopFiles(bridge, invalid)).toBeRejected();
      expect(bridge.readChunk).not.toHaveBeenCalled();
    });
  }
});
