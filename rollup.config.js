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
                format: 'cjs',
                exports: 'auto',
                sourcemap: false
            },
            {
                file: 'lib/render.es.js',
                format: 'esm',
                sourcemap: false
            }
        ],
        plugins: [
            typescript(),
        ]
    }
];
