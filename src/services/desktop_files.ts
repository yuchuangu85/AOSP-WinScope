export interface DesktopFileBatch {
  token: string;
  files: Array<{name: string; size: number; lastModified: number}>;
}

export interface DesktopFiles {
  onOpen(callback: (batch: DesktopFileBatch) => void): () => void;
  readChunk(token: string, index: number, offset: number): Promise<Uint8Array>;
  complete(token: string, indexes: number[]): void;
  remember(files: File[]): void;
}

export function getDesktopFiles(): DesktopFiles | undefined {
  return (window as Window & {winscopeFiles?: DesktopFiles}).winscopeFiles;
}

/** Read only main-process-authorized selections, without one giant IPC payload. */
export async function readDesktopFiles(bridge: DesktopFiles, batch: DesktopFileBatch): Promise<File[]> {
  if (!batch || typeof batch.token !== 'string' || !Array.isArray(batch.files) || !batch.files.length || batch.files.length > 64) {
    throw new Error('Invalid desktop file selection');
  }
  const files: File[] = [];
  for (const [index, descriptor] of batch.files.entries()) {
    if (!descriptor || typeof descriptor.name !== 'string' || !Number.isSafeInteger(descriptor.size) || descriptor.size < 0 || !Number.isFinite(descriptor.lastModified)) {
      throw new Error('Invalid desktop file metadata');
    }
    const parts: ArrayBuffer[] = [];
    let offset = 0;
    while (offset < descriptor.size) {
      const chunk = await bridge.readChunk(batch.token, index, offset);
      if (!(chunk instanceof Uint8Array) || !chunk.length || chunk.length > 4 * 1024 * 1024 || chunk.length > descriptor.size - offset) {
        throw new Error('Incomplete desktop file');
      }
      parts.push(new Uint8Array(chunk).buffer);
      offset += chunk.length;
    }
    files.push(new File(parts, descriptor.name, {lastModified: descriptor.lastModified}));
  }
  return files;
}
