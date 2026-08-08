import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..'
);
const cppConstantPath = path.resolve(
  process.env.OPENIM_CPP_CONSTANT ??
    path.join(packageRoot, '../openim-sdk-cpp/go/constant.go')
);
const electronEventPath = path.join(packageRoot, 'src/constant/callback.ts');

const [goSource, tsSource] = await Promise.all([
  readFile(cppConstantPath, 'utf8'),
  readFile(electronEventPath, 'utf8'),
]);
const goBlock = goSource.match(/const\s*\(([\s\S]*?)\n\)/)?.[1];
const tsBlock = tsSource.match(
  /export enum NativeEvent\s*\{([\s\S]*?)\n\}/
)?.[1];
assert(goBlock, 'Could not parse the C++ bridge event constants');
assert(tsBlock, 'Could not parse the Electron native event enum');

const goEvents = [
  ...goBlock.matchAll(/^\s*([A-Z][A-Z0-9_]*)\s*(?:=\s*iota)?\s*$/gm),
].map(match => match[1]);
const electronEvents = [
  ...tsBlock.matchAll(/^\s*([A-Z][A-Z0-9_]*)\s*,\s*$/gm),
].map(match => match[1]);

assert.deepEqual(
  electronEvents,
  goEvents,
  'Electron NativeEvent values must remain in exactly the same order as openim-sdk-cpp'
);
console.log(
  `[electron-event-contract] ${electronEvents.length} native event values match`
);
