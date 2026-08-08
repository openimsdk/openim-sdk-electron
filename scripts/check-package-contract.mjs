import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..'
);
const packageJson = JSON.parse(
  await readFile(path.join(packageRoot, 'package.json'), 'utf8')
);

async function sourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async entry => {
      const absolutePath = path.join(directory, entry.name);
      if (entry.isDirectory()) return sourceFiles(absolutePath);
      return entry.name.endsWith('.ts') ? [absolutePath] : [];
    })
  );
  return nested.flat();
}

const deepImports = [];
for (const sourceFile of await sourceFiles(path.join(packageRoot, 'src'))) {
  const source = await readFile(sourceFile, 'utf8');
  if (source.includes('@openim/wasm-client-sdk/')) {
    deepImports.push(path.relative(packageRoot, sourceFile));
  }
}
assert.deepEqual(
  deepImports,
  [],
  `Electron source imports private WASM SDK subpaths: ${deepImports.join(', ')}`
);

const wasmDevelopmentVersion =
  packageJson.devDependencies?.['@openim/wasm-client-sdk'];
assert(
  packageJson.version === wasmDevelopmentVersion ||
    packageJson.version.startsWith(`${wasmDevelopmentVersion}.`),
  'Electron wrapper version must share the WASM development version prefix'
);
const nativeAssetVersion = (
  await readFile(path.join(packageRoot, 'assets/version'), 'utf8')
).trim();
const coreSource = await readFile(
  path.join(packageRoot, 'src/core/index.ts'),
  'utf8'
);
const expectedNativeVersion = coreSource.match(
  /EXPECTED_NATIVE_SDK_VERSION\s*=\s*'([^']+)'/
)?.[1];
assert(
  expectedNativeVersion,
  'Expected native SDK version constant is missing'
);
assert.equal(
  nativeAssetVersion,
  expectedNativeVersion,
  'Native asset version must match the runtime ABI version guard'
);
assert.deepEqual(
  (await readdir(path.join(packageRoot, 'assets'))).sort(),
  ['linux_arm64', 'linux_x64', 'mac_arm64', 'mac_x64', 'version', 'win_x64'],
  'Electron assets must contain exactly the five supported native targets'
);
assert.deepEqual(packageJson.exports, {
  '.': {
    types: './lib/index.d.ts',
    import: './lib/index.mjs',
    require: './lib/index.js',
  },
  './render': {
    types: './lib/render.d.ts',
    import: './lib/render.mjs',
    require: './lib/render.cjs.js',
  },
  './preload': {
    types: './lib/preload.d.ts',
    import: './lib/preload.mjs',
    require: './lib/preload.js',
  },
  './lib/render': {
    types: './lib/render.d.ts',
    import: './lib/render.mjs',
    require: './lib/render.cjs.js',
  },
  './lib/preload': {
    types: './lib/preload.d.ts',
    import: './lib/preload.mjs',
    require: './lib/preload.js',
  },
  './lib/types/*': {
    types: './lib/types/*.d.ts',
  },
});

console.log('[electron-package-contract] source boundary and versions match');
