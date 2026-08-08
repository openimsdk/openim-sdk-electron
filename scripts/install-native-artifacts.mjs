import assert from 'node:assert/strict';
import {
  copyFile,
  mkdir,
  readFile,
  readdir,
  rm,
  writeFile,
} from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..'
);
const sourceRoot = path.resolve(process.argv[2] ?? 'native-artifacts');
const assetsRoot = path.join(packageRoot, 'assets');
const expectedVersion = (
  await readFile(path.join(assetsRoot, 'version'), 'utf8')
).trim();
const targets = Object.freeze({
  mac_arm64: {
    library: 'libopenimsdk.dylib',
    format: 'mach',
    machine: 0x0100000c,
  },
  mac_x64: {
    library: 'libopenimsdk.dylib',
    format: 'mach',
    machine: 0x01000007,
  },
  linux_arm64: { library: 'libopenimsdk.so', format: 'elf', machine: 183 },
  linux_x64: { library: 'libopenimsdk.so', format: 'elf', machine: 62 },
  win_x64: { library: 'libopenimsdk.dll', format: 'pe', machine: 0x8664 },
});

function validateBinary(target, binary, expected) {
  assert(binary.length > 64, `${target} native library is unexpectedly small`);
  if (expected.format === 'mach') {
    assert.equal(
      binary.readUInt32LE(0),
      0xfeedfacf,
      `${target} is not a 64-bit Mach-O`
    );
    assert.equal(
      binary.readUInt32LE(4),
      expected.machine,
      `${target} has the wrong CPU type`
    );
    return;
  }
  if (expected.format === 'elf') {
    assert.equal(
      binary.subarray(0, 4).toString('hex'),
      '7f454c46',
      `${target} is not ELF`
    );
    assert.equal(binary[4], 2, `${target} is not a 64-bit ELF library`);
    assert.equal(
      binary.readUInt16LE(18),
      expected.machine,
      `${target} has the wrong CPU type`
    );
    return;
  }

  assert.equal(
    binary.subarray(0, 2).toString('ascii'),
    'MZ',
    `${target} is not PE`
  );
  const peOffset = binary.readUInt32LE(0x3c);
  assert.equal(
    binary.subarray(peOffset, peOffset + 4).toString('ascii'),
    'PE\0\0'
  );
  assert.equal(
    binary.readUInt16LE(peOffset + 4),
    expected.machine,
    `${target} has the wrong CPU type`
  );
}

await rm(assetsRoot, { recursive: true, force: true });
await mkdir(assetsRoot, { recursive: true });

for (const [target, expected] of Object.entries(targets)) {
  const { library } = expected;
  const artifactDirectory = path.join(sourceRoot, `openim-native-${target}`);
  const version = (
    await readFile(path.join(artifactDirectory, 'version'), 'utf8')
  ).trim();
  assert.equal(
    version,
    expectedVersion,
    `${target} was built from ${version}; expected ${expectedVersion}`
  );

  const entries = await readdir(artifactDirectory);
  assert(entries.includes(library), `${target} artifact is missing ${library}`);
  assert(
    entries.includes('libopenimsdk.h'),
    `${target} artifact is missing its C header`
  );
  const binary = await readFile(path.join(artifactDirectory, library));
  validateBinary(target, binary, expected);

  const targetDirectory = path.join(assetsRoot, target);
  await mkdir(targetDirectory, { recursive: true });
  await copyFile(
    path.join(artifactDirectory, library),
    path.join(targetDirectory, library)
  );
}

await writeFile(path.join(assetsRoot, 'version'), expectedVersion);
console.log(
  `[electron-native-assets] installed ${
    Object.keys(targets).length
  } ${expectedVersion} slices`
);
