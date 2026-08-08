import alias from '@rollup/plugin-alias';
import resolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';

const resolveLocalTypescript = () =>
  resolve({
    extensions: ['.mjs', '.js', '.json', '.node', '.ts'],
    resolveOnly: [/^\.\.?\//],
  });
const typescriptOptions = {
  include: ['*.ts', '**/*.ts', '**/*.tsx', '**/*.cts', '**/*.mts'],
};

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'lib/index.js',
        format: 'cjs',
        exports: 'auto',
        sourcemap: false,
      },
      {
        file: 'lib/index.es.js',
        format: 'esm',
        sourcemap: false,
      },
      {
        file: 'lib/index.mjs',
        format: 'esm',
        sourcemap: false,
      },
    ],
    plugins: [alias(), typescript(typescriptOptions), resolveLocalTypescript()],
  },
  {
    input: 'src/render.ts',
    output: [
      {
        file: 'lib/render.js',
        format: 'esm',
        sourcemap: false,
      },
      {
        file: 'lib/render.mjs',
        format: 'esm',
        sourcemap: false,
      },
      {
        file: 'lib/render.cjs.js',
        format: 'cjs',
        exports: 'auto',
        sourcemap: false,
      },
    ],
    plugins: [typescript(typescriptOptions), resolveLocalTypescript()],
  },
  {
    input: 'src/preload.ts',
    output: [
      {
        file: 'lib/preload.js',
        format: 'cjs',
        exports: 'auto',
        sourcemap: false,
      },
      {
        file: 'lib/preload.es.js',
        format: 'esm',
        sourcemap: false,
      },
      {
        file: 'lib/preload.mjs',
        format: 'esm',
        sourcemap: false,
      },
    ],
    plugins: [typescript(typescriptOptions), resolveLocalTypescript()],
  },
];
