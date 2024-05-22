import alias from '@rollup/plugin-alias';
import typescript from 'rollup-plugin-typescript2';

export default [
    {
        input: 'src/index.ts',
        output: [
            {
                file: 'lib/index.js',
                format: 'cjs',
                exports: 'auto',
                sourcemap: false
            },
            {
                file: 'lib/index.es.js',
                format: 'esm',
                sourcemap: false
            }
        ],
        plugins: [
            alias(),
            typescript(),
        ]
    },
    {
        input: 'src/render.ts',
        output: [
            {
                file: 'lib/render.js',
                format: 'esm',
                sourcemap: false
            },
            {
                file: 'lib/render.cjs.js',
                format: 'cjs',
                exports: 'auto',
                sourcemap: false
            },
        ],
        plugins: [
            typescript(),
        ]
    },
    {
        input: 'src/preload.ts',
        output: [
            {
                file: 'lib/preload.js',
                format: 'cjs',
                exports: 'auto',
                sourcemap: false
            },
            {
                file: 'lib/preload.es.js',
                format: 'esm',
                sourcemap: false
            }
        ],
        plugins: [
            typescript(),
        ]
    }
];
