import type {RollupOptions} from 'rollup';
import typescript from "@rollup/plugin-typescript";
import json from '@rollup/plugin-json';
import shebang from 'rollup-plugin-preserve-shebang';

const config: RollupOptions = {
    input: './src/index.ts',
    output: {
        file: 'bin/index.js',
        format: 'commonjs'
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
        "chalk"
    ],
};
export default config;