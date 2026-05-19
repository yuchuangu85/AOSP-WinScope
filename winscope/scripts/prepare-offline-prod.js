#!/usr/bin/env node
/*
 * Prepares dist/prod for offline static hosting across desktop OS/CPU variants.
 * The browser executes WebAssembly, so runtime compatibility depends on the
 * browser's wasm support, not whether the host is macOS Intel/ARM or Windows
 * x64/ARM. This script avoids missing-file failures in offline packages that
 * only ship the wasm32 trace processor.
 */
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const distDir = path.join(repoRoot, 'dist', 'prod');
const jsDir = path.join(distDir, 'js');
const engineBundle = path.join(distDir, 'engine_bundle.js');
const wasm32 = path.join(distDir, 'trace_processor.wasm');
const wasm64 = path.join(distDir, 'trace_processor_memory64.wasm');
const legacyHashes = [
  '47e584da0ef9357889fb',
  '4d28cf7806398b663cb7',
  '8fffaa387b9656c26e6f',
];

function copyFilePortable(src, dest) {
  if (fs.existsSync(dest) && fs.lstatSync(dest).isSymbolicLink()) {
    fs.unlinkSync(dest);
  }
  fs.copyFileSync(src, dest);
  // Preserve source mode where possible, but avoid relying on symlinks because
  // Windows zip/unzip and static hosts frequently do not preserve them.
  fs.chmodSync(dest, fs.statSync(src).mode);
}

function existsAsRealFile(file) {
  return fs.existsSync(file) && !fs.lstatSync(file).isSymbolicLink();
}

function patchEngineForWasm32Fallback() {
  if (!fs.existsSync(engineBundle)) return false;
  const text = fs.readFileSync(engineBundle, 'utf8');
  if (
    text.includes(
      'WinScope offline package ships only wasm32 trace_processor.wasm',
    ) ||
    text.includes(
      'WinScope offline package in this repo ships only trace_processor.wasm',
    )
  ) {
    return false;
  }
  const marker = 'function hasMemory64Support() {';
  const index = text.indexOf(marker);
  if (index < 0) return false;
  const patched = text.replace(
    marker,
    `${marker}\n\t    // WinScope offline package ships only wasm32 trace_processor.wasm.\n\t    return false;`,
  );
  fs.writeFileSync(engineBundle, patched);
  return true;
}

function prepareTraceProcessorWasm() {
  if (!fs.existsSync(wasm32)) {
    throw new Error(`Missing required wasm32 trace processor: ${wasm32}`);
  }

  if (!existsAsRealFile(wasm64)) {
    copyFilePortable(wasm32, wasm64);
    const patched = patchEngineForWasm32Fallback();
    console.log(
      `Created wasm32 fallback ${path.basename(wasm64)} and ${patched ? 'patched' : 'kept'} engine_bundle.js`,
    );
  }
}

function prepareLegacyJsHashCopies() {
  if (!fs.existsSync(jsDir)) return;
  const indexHtml = path.join(distDir, 'index.html');
  const indexText = fs.existsSync(indexHtml)
    ? fs.readFileSync(indexHtml, 'utf8')
    : '';
  const currentFiles = [
    ...indexText.matchAll(/js\/([^"']+\.[0-9a-f]{20}\.js)/g),
  ]
    .map((match) => match[1])
    .filter((file) => fs.existsSync(path.join(jsDir, file)));

  for (const file of currentFiles) {
    const match = file.match(/^(.*)\.([0-9a-f]{20})\.js$/);
    if (!match) continue;
    const [, prefix, currentHash] = match;
    for (const legacyHash of legacyHashes) {
      if (legacyHash === currentHash) continue;
      const legacyFile = `${prefix}.${legacyHash}.js`;
      const legacyPath = path.join(jsDir, legacyFile);
      if (!existsAsRealFile(legacyPath)) {
        copyFilePortable(path.join(jsDir, file), legacyPath);
      }
    }
  }

  // Some older locally generated index.html variants referenced this pnpm chunk,
  // but the current webpack build no longer emits it. Keep a harmless empty file
  // so stale browser cache does not fail the offline app boot.
  for (const legacyHash of legacyHashes) {
    const pnpmStub = path.join(jsDir, `npm..pnpm.${legacyHash}.js`);
    if (!existsAsRealFile(pnpmStub)) {
      if (fs.existsSync(pnpmStub) && fs.lstatSync(pnpmStub).isSymbolicLink()) {
        fs.unlinkSync(pnpmStub);
      }
      fs.writeFileSync(
        pnpmStub,
        '/* compatibility stub for stale cached WinScope index.html */\n',
      );
    }
  }
}
prepareTraceProcessorWasm();
prepareLegacyJsHashCopies();
