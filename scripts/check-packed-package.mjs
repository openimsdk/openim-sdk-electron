import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const result = JSON.parse(
  execFileSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], {
    encoding: 'utf8',
  })
)[0];
const files = new Set(result.files.map(file => file.path));
const requiredFiles = [
  'lib/index.js',
  'lib/index.mjs',
  'lib/index.d.ts',
  'lib/render.mjs',
  'lib/render.cjs.js',
  'lib/render.d.ts',
  'lib/preload.js',
  'lib/preload.mjs',
  'lib/preload.d.ts',
  'assets/version',
  'assets/mac_arm64/libopenimsdk.dylib',
  'assets/mac_x64/libopenimsdk.dylib',
  'assets/linux_arm64/libopenimsdk.so',
  'assets/linux_x64/libopenimsdk.so',
  'assets/win_x64/libopenimsdk.dll',
];

for (const file of requiredFiles) {
  assert(files.has(file), `Packed package is missing ${file}`);
}
assert(
  ![...files].some(file => file.startsWith('assets/win_ia32/')),
  'Packed package must not contain the unsupported win_ia32 native slice'
);
const deprecatedMarkerCount = [
  'lib/render.d.ts',
  'lib/types/entity.d.ts',
  'lib/types/params.d.ts',
].reduce(
  (count, filename) =>
    count + (readFileSync(filename, 'utf8').match(/@deprecated/g) || []).length,
  0
);
assert(
  deprecatedMarkerCount >= 12,
  `Packed declarations retained only ${deprecatedMarkerCount} compatibility deprecation markers`
);

console.log(
  `[electron-packed-package] ${result.files.length} packed files verified`
);
