"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const { test } = require("node:test");
const {
  parseBinary,
  readBinary,
  assertBinaryArchitecture,
} = require("./binary_arch.cjs");

function pe(arch) {
  const size = arch === "ia32" ? 96 : 112;
  const bytes = Buffer.alloc(88 + size);
  bytes.write("MZ");
  bytes.writeUInt32LE(64, 60);
  bytes.write("PE\0\0", 64);
  bytes.writeUInt16LE({ ia32: 0x14c, x64: 0x8664, arm64: 0xaa64 }[arch], 68);
  bytes.writeUInt16LE(size, 84);
  bytes.writeUInt16LE(2, 86);
  bytes.writeUInt16LE(arch === "ia32" ? 0x10b : 0x20b, 88);
  return bytes;
}

function elf(arch, le = true) {
  const bytes = Buffer.alloc(64);
  bytes.set([0x7f, 0x45, 0x4c, 0x46, 2, le ? 1 : 2, 1]);
  const u16 = (value, offset) =>
    le
      ? bytes.writeUInt16LE(value, offset)
      : bytes.writeUInt16BE(value, offset);
  u16(2, 16);
  u16(arch === "x64" ? 62 : 183, 18);
  if (le) bytes.writeUInt32LE(1, 20);
  else bytes.writeUInt32BE(1, 20);
  u16(64, 52);
  return bytes;
}

function mach(arch, le = true) {
  const bytes = Buffer.alloc(32);
  const u32 = (value, offset) =>
    le
      ? bytes.writeUInt32LE(value, offset)
      : bytes.writeUInt32BE(value, offset);
  u32(0xfeedfacf, 0);
  u32(arch === "x64" ? 0x01000007 : 0x0100000c, 4);
  u32(2, 12);
  return bytes;
}

function fat(wide = false, le = false) {
  const stride = wide ? 32 : 20;
  const start = 8 + stride * 2;
  const bytes = Buffer.alloc(start + 64);
  const u32 = (value, offset) =>
    le
      ? bytes.writeUInt32LE(value, offset)
      : bytes.writeUInt32BE(value, offset);
  const u64 = (value, offset) =>
    le
      ? bytes.writeBigUInt64LE(BigInt(value), offset)
      : bytes.writeBigUInt64BE(BigInt(value), offset);
  u32(wide ? 0xcafebabf : 0xcafebabe, 0);
  u32(2, 4);
  ["x64", "arm64"].forEach((arch, i) => {
    const offset = 8 + i * stride;
    u32(arch === "x64" ? 0x01000007 : 0x0100000c, offset);
    if (wide) {
      u64(start + i * 32, offset + 8);
      u64(32, offset + 16);
    } else {
      u32(start + i * 32, offset + 8);
      u32(32, offset + 12);
    }
    mach(arch).copy(bytes, start + i * 32);
  });
  return bytes;
}

test("PE machine fields distinguish real Windows x86 ADB from native x64 and ARM64", () => {
  for (const arch of ["ia32", "x64", "arm64"])
    assert.deepEqual(parseBinary(pe(arch)), {
      format: "pe",
      architectures: [arch],
    });
  const bad = pe("x64");
  bad.writeUInt16LE(0x10b, 88);
  assert.throws(() => parseBinary(bad), /disagree/);
  bad.writeUInt16LE(0x9999, 68);
  assert.throws(() => parseBinary(bad), /Unsupported PE/);
});

test("ELF64 and thin Mach-O identify CPU and byte order", () => {
  for (const arch of ["x64", "arm64"])
    for (const le of [true, false]) {
      assert.deepEqual(parseBinary(elf(arch, le)), {
        format: "elf",
        architectures: [arch],
      });
      assert.deepEqual(parseBinary(mach(arch, le)), {
        format: "mach-o",
        architectures: [arch],
      });
    }
  const bad = elf("arm64");
  bad[4] = 1;
  assert.throws(() => parseBinary(bad), /ELF class/);
});

test("Mach-O fat32/fat64 inspect inner slices in both byte orders", () => {
  for (const wide of [false, true])
    for (const le of [false, true])
      assert.deepEqual(parseBinary(fat(wide, le)), {
        format: "mach-o",
        architectures: ["arm64", "x64"],
      });
});

test("every truncated header prefix fails with a bounded parser error", () => {
  for (const bytes of [
    pe("ia32"),
    pe("x64"),
    pe("arm64"),
    elf("arm64"),
    mach("x64"),
    fat(),
    fat(true),
  ])
    for (let i = 0; i < bytes.length; i++)
      assert.throws(
        () => parseBinary(bytes.subarray(0, i)),
        (error) => error instanceof Error && !(error instanceof RangeError),
      );
  assert.throws(() => parseBinary("MZ"), /Buffer/);
  assert.throws(() => parseBinary(Buffer.from("not a native binary")));
});

test("malformed PE/ELF table offsets and Mach-O fat slices fail closed", () => {
  const bad = [];
  const mutate = (source, edit) => {
    const bytes = Buffer.from(source);
    edit(bytes);
    bad.push(bytes);
  };
  mutate(pe("x64"), (b) => b.writeUInt32LE(0xffffffff, 60));
  mutate(pe("x64"), (b) => b.writeUInt32LE(0, 60));
  mutate(pe("x64"), (b) => b.writeUInt16LE(1, 70));
  mutate(elf("x64"), (b) => {
    b.writeBigUInt64LE(2n ** 63n, 32);
    b.writeUInt16LE(1, 56);
  });
  mutate(elf("x64"), (b) => {
    b.writeBigUInt64LE(64n, 32);
    b.writeUInt16LE(56, 54);
    b.writeUInt16LE(1, 56);
  });
  mutate(mach("arm64"), (b) => b.writeUInt32LE(1, 16));
  mutate(mach("arm64"), (b) => b.writeUInt32LE(0xffffffff, 20));
  mutate(fat(), (b) => b.writeUInt32BE(65, 4));
  mutate(fat(), (b) => b.writeUInt32BE(0, 4));
  mutate(fat(), (b) => b.writeUInt32BE(0, 16));
  mutate(fat(), (b) => b.writeUInt32BE(0xffffffff, 20));
  mutate(fat(), (b) => b.writeUInt32BE(48, 36));
  mutate(fat(), (b) => b.writeUInt32BE(53, 24));
  mutate(fat(), (b) => b.writeUInt32BE(0x0100000c, 8));
  mutate(fat(), (b) => b.writeUInt32LE(0x0100000c, 52));
  mutate(fat(), (b) => b.writeUInt32BE(1, 12));
  mutate(fat(true), (b) => b.writeBigUInt64BE(2n ** 63n, 16));
  for (const bytes of bad) assert.throws(() => parseBinary(bytes));
});

test("positional file reader and architecture assertions use bytes, not filenames", async (t) => {
  const root = await fs.mkdtemp(
    path.join(os.tmpdir(), "winscope native header "),
  );
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const file = path.join(root, "adb-arm64.exe");
  await fs.writeFile(file, pe("ia32"));
  assert.deepEqual(await readBinary(file), parseBinary(pe("ia32")));
  await assertBinaryArchitecture(file, { platform: "win32", arch: "ia32" });
  await assert.rejects(
    assertBinaryArchitecture(file, { platform: "win32", arch: "arm64" }),
    /architecture mismatch/,
  );
  await assert.rejects(
    assertBinaryArchitecture(file, { platform: "linux", arch: "ia32" }),
    /architecture mismatch/,
  );
  await fs.writeFile(file, fat(true));
  await assertBinaryArchitecture(file, {
    platform: "darwin",
    arch: "universal",
  });
  await assert.rejects(
    assertBinaryArchitecture(file, { platform: "darwin", arch: "arm64" }),
    /architecture mismatch/,
  );
  await assertBinaryArchitecture(file, {
    platform: "darwin",
    arch: "arm64",
    allowUniversal: true,
  });
  await fs.writeFile(file, mach("arm64"));
  await assert.rejects(
    assertBinaryArchitecture(file, { platform: "darwin", arch: "universal" }),
    /architecture mismatch/,
  );
  await fs.writeFile(file, Buffer.from("MZ"));
  await assert.rejects(readBinary(file), /truncated/);
});
