import type {RollupOptions} from 'rollup';
import typescript from "@rollup/plugin-typescript";
import json from '@rollup/plugin-json';
import shebang from 'rollup-plugin-preserve-shebang'; // 保留  shebang: '#!/usr/bin/env node'

const config: RollupOptions = {
    input: './src/index.ts',
    output: {
        file: 'bin/index.js',
        format: 'commonjs',
        sourcemap: true,
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
        "webpack-merge",
        'webpack-dev-server',
        'html-webpack-plugin',
        '@pmmmwh/react-refresh-webpack-plugin',
        "portfinder",
        "fs",
        "process",
        "html-loader",
        "chalk",
        "mini-css-extract-plugin",
        "generic-names"
    ],
};
export default config;