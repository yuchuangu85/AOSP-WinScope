"use strict";

const fs = require("node:fs/promises");

const PE_ARCHES = { 0x14c: "ia32", 0x8664: "x64", 0xaa64: "arm64" };
const MACH_ARCHES = { 0x01000007: "x64", 0x0100000c: "arm64" };

function range(offset, length, size) {
  if (
    !Number.isSafeInteger(offset) ||
    !Number.isSafeInteger(length) ||
    offset < 0 ||
    length < 0 ||
    offset > size ||
    length > size - offset
  )
    throw new Error("Invalid or truncated binary header range");
}

// The same bounded parser drives in-memory fixtures and positional file reads.
function* inspect(size) {
  range(0, 4, size);
  const magic = yield [0, 4];
  if (magic[0] === 0x4d && magic[1] === 0x5a) {
    range(0, 64, size);
    const dos = yield [0, 64];
    const offset = dos.readUInt32LE(0x3c);
    if (offset < 64) throw new Error("Invalid PE header offset");
    range(offset, 24, size);
    const coff = yield [offset, 24];
    if (coff.readUInt32LE(0) !== 0x00004550)
      throw new Error("Invalid PE signature");
    const arch = PE_ARCHES[coff.readUInt16LE(4)];
    if (!arch) throw new Error("Unsupported PE machine architecture");
    const optionalSize = coff.readUInt16LE(20);
    const minimum = arch === "ia32" ? 96 : 112;
    if (optionalSize < minimum || !(coff.readUInt16LE(22) & 2))
      throw new Error("Invalid PE executable header");
    range(offset + 24, optionalSize + coff.readUInt16LE(6) * 40, size);
    const optional = yield [offset + 24, minimum];
    if (optional.readUInt16LE(0) !== (arch === "ia32" ? 0x10b : 0x20b))
      throw new Error("PE machine and optional header disagree");
    return { format: "pe", architectures: [arch] };
  }
  if (magic.readUInt32BE(0) === 0x7f454c46) {
    range(0, 64, size);
    const header = yield [0, 64];
    if (header[4] !== 2 || ![1, 2].includes(header[5]) || header[6] !== 1)
      throw new Error("Unsupported ELF class, encoding or version");
    const le = header[5] === 1;
    const u16 = (offset) =>
      le ? header.readUInt16LE(offset) : header.readUInt16BE(offset);
    const u32 = (offset) =>
      le ? header.readUInt32LE(offset) : header.readUInt32BE(offset);
    const u64 = (offset) =>
      Number(
        le ? header.readBigUInt64LE(offset) : header.readBigUInt64BE(offset),
      );
    const arch = { 62: "x64", 183: "arm64" }[u16(18)];
    if (!arch || ![2, 3].includes(u16(16)) || u32(20) !== 1 || u16(52) !== 64)
      throw new Error("Invalid or unsupported ELF64 executable header");
    for (const [offset, entrySize, count, minimum] of [
      [u64(32), u16(54), u16(56), 56],
      [u64(40), u16(58), u16(60), 64],
    ]) {
      if (count && (offset < 64 || entrySize < minimum))
        throw new Error("Invalid ELF64 table header");
      range(offset, entrySize * count, size);
    }
    return { format: "elf", architectures: [arch] };
  }

  const value = magic.readUInt32BE(0);
  const fat = [0xcafebabe, 0xbebafeca, 0xcafebabf, 0xbfbafeca].includes(value);
  function* thin(offset, length) {
    range(offset, 32, size);
    if (length < 32) throw new Error("Truncated Mach-O slice");
    const header = yield [offset, 32];
    const marker = header.readUInt32BE(0);
    if (![0xfeedfacf, 0xcffaedfe].includes(marker))
      throw new Error("Invalid or unsupported Mach-O magic");
    const u32 = (position) =>
      marker === 0xcffaedfe
        ? header.readUInt32LE(position)
        : header.readUInt32BE(position);
    const arch = MACH_ARCHES[u32(4)];
    if (!arch) throw new Error("Unsupported Mach-O CPU architecture");
    range(32, u32(20), length);
    if (u32(16) > Math.floor(u32(20) / 8))
      throw new Error("Invalid Mach-O load command count");
    return { arch, cpu: u32(4), subtype: u32(8) };
  }
  if (!fat) {
    const result = yield* thin(0, size);
    return { format: "mach-o", architectures: [result.arch] };
  }
  range(0, 8, size);
  const header = yield [0, 8];
  const le = [0xbebafeca, 0xbfbafeca].includes(value);
  const wide = [0xcafebabf, 0xbfbafeca].includes(value);
  const count = le ? header.readUInt32LE(4) : header.readUInt32BE(4);
  if (!count || count > 64)
    throw new Error("Invalid Mach-O fat architecture count");
  const stride = wide ? 32 : 20;
  const tableEnd = 8 + count * stride;
  range(8, count * stride, size);
  const table = yield [8, count * stride];
  const u32 = (offset) =>
    le ? table.readUInt32LE(offset) : table.readUInt32BE(offset);
  const u64 = (offset) =>
    Number(le ? table.readBigUInt64LE(offset) : table.readBigUInt64BE(offset));
  const slices = [];
  const architectures = [];
  for (let i = 0; i < count; i++) {
    const start = i * stride;
    const offset = wide ? u64(start + 8) : u32(start + 8);
    const length = wide ? u64(start + 16) : u32(start + 12);
    const alignment = u32(start + (wide ? 24 : 16));
    range(offset, length, size);
    if (
      offset < tableEnd ||
      alignment > 52 ||
      offset % 2 ** alignment !== 0 ||
      slices.some(
        (slice) => offset < slice.end && offset + length > slice.offset,
      )
    )
      throw new Error("Invalid or overlapping Mach-O fat slice");
    const result = yield* thin(offset, length);
    if (
      result.cpu !== u32(start) ||
      result.subtype !== u32(start + 4) ||
      architectures.includes(result.arch)
    )
      throw new Error("Mach-O fat architecture table disagrees with slices");
    slices.push({ offset, end: offset + length });
    architectures.push(result.arch);
  }
  return { format: "mach-o", architectures: architectures.sort() };
}

function parseBinary(buffer) {
  if (!Buffer.isBuffer(buffer))
    throw new TypeError("Binary input must be a Buffer");
  const parser = inspect(buffer.length);
  let step = parser.next();
  while (!step.done) {
    const [offset, length] = step.value;
    step = parser.next(buffer.subarray(offset, offset + length));
  }
  return step.value;
}

async function readBinary(file) {
  const handle = await fs.open(file, "r");
  try {
    const stat = await handle.stat();
    if (!stat.isFile()) throw new Error("Binary must be a regular file");
    const parser = inspect(stat.size);
    let step = parser.next();
    while (!step.done) {
      const [offset, length] = step.value;
      const buffer = Buffer.alloc(length);
      let read = 0;
      while (read < length) {
        const { bytesRead } = await handle.read(
          buffer,
          read,
          length - read,
          offset + read,
        );
        if (!bytesRead) throw new Error("Truncated binary header read");
        read += bytesRead;
      }
      step = parser.next(buffer);
    }
    return step.value;
  } finally {
    await handle.close();
  }
}

async function assertBinaryArchitecture(
  file,
  { platform, arch, allowUniversal = false },
) {
  const result = await readBinary(file);
  const format = { win32: "pe", linux: "elf", darwin: "mach-o" }[platform];
  const expected = arch === "universal" ? ["arm64", "x64"] : [arch];
  if (
    !format ||
    result.format !== format ||
    (allowUniversal && platform === "darwin" && arch !== "universal"
      ? !result.architectures.includes(arch)
      : result.architectures.length !== expected.length ||
        expected.some((value) => !result.architectures.includes(value)))
  )
    throw new Error(
      `Binary architecture mismatch: ${file}; expected ${platform}-${arch}, found ${result.format}-${result.architectures.join("+")}`,
    );
  return result;
}

module.exports = { parseBinary, readBinary, assertBinaryArchitecture };
