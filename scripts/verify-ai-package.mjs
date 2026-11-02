import {readFile, readdir, stat} from 'node:fs/promises';
import {join, resolve} from 'node:path';

const root = resolve(new URL('..', import.meta.url).pathname);
const aiRoot = join(root, 'ai');
const required = ['package.json', 'tsconfig.json', 'README.md', 'src/cli.ts', 'src/gateway.ts', 'src/mcp.ts', 'src/providers.ts', 'src/registry.ts', 'src/skills.ts', 'src/evidence.ts', 'external-sources.json'];
for (const relative of required) {
  const path = join(aiRoot, relative);
  if (!(await stat(path)).isFile()) throw new Error(`missing AI package file: ${relative}`);
}
const sources = JSON.parse(await readFile(join(aiRoot, 'external-sources.json'), 'utf8'));
if (sources.schemaVersion !== 1 || !Array.isArray(sources.sources) || sources.sources.length !== 1) throw new Error('invalid AI external source manifest');
const source = sources.sources[0];
if (!/^[0-9a-f]{40}$/.test(source.revision)) throw new Error('SmartPerfetto revision is not pinned');
if (source.copiedIntoWinscope !== false || source.bundledAtRuntime !== false) throw new Error('SmartPerfetto source must remain external');
const files = [];
async function walk(dir) {
  for (const entry of await readdir(dir, {withFileTypes: true})) {
    const path = join(dir, entry.name);
    if (entry.name === 'dist' || entry.name === 'node_modules') continue;
    if (entry.isDirectory()) await walk(path);
    else files.push(path);
  }
}
await walk(aiRoot);
for (const path of files) {
  const text = await readFile(path, 'utf8');
  if (/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|sk-[A-Za-z0-9]{20,}/.test(text)) throw new Error(`possible credential in AI package: ${path}`);
}
console.log(JSON.stringify({ok: true, sourceRevision: source.revision, checkedFiles: files.length}));
