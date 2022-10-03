import type {RollupOptions} from 'rollup';
import typescript from "@rollup/plugin-typescript";
import json from '@rollup/plugin-json';
import shebang from 'rollup-plugin-preserve-shebang';

const config: RollupOptions = {
    input: './src/index.ts',
    output: {
        file: 'bin/index.js',
        format: 'cjs'
    },
    plugins: [
        json(),
        typescript(),
        shebang()
    ],
    external: [
        'commander',
        'webpack',
        'path',
        'webpackbar',
        'webpack-dev-server',
        'html-webpack-plugin',
    ],
};
export default config;