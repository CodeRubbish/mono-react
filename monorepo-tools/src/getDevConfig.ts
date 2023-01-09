import * as path from "path";
import * as fs from 'fs';
import webpack from "webpack";
import WebpackBar from 'webpackbar';
import WebpackDevServer from 'webpack-dev-server';
import HtmlWebpackPlugin from "html-webpack-plugin";
import ReactRefreshPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import {WebpackConfiguration} from "webpack-cli";
import {merge} from 'webpack-merge';

const {ModuleFederationPlugin} = webpack.container;

const commonConfig: WebpackConfiguration = {
    mode: "development",
    devtool: "eval-cheap-module-source-map",
    output: {
        clean: true,
        chunkFilename: "chunk.[name].js",
        filename: "[name].js",
    },
    stats: {
        colors: true,
        hash: false,
        version: false,
        timings: false,
        assets: false,
        chunks: false,
        modules: false,
        reasons: false,
        children: false,
        source: false,
        errors: false,
        errorDetails: false,
        warnings: false,
        publicPath: false
    },
    plugins: [
        new WebpackBar(),
        new ReactRefreshPlugin(),
    ],
    resolve: {
        extensions: ['.ts', '.tsx', '...'],
    },
    module: {
        rules: [
            {
                oneOf: [
                    {
                        test: /\.tsx?$/,
                        use: [
                            {
                                loader: 'babel-loader',
                                options: {
                                    presets: [
                                        '@babel/preset-env',
                                        '@babel/preset-react',
                                        '@babel/preset-typescript',
                                    ],
                                    plugins: [
                                        'react-refresh/babel'
                                    ]
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    }
};
const getDevConfig = (project) => {
    // const config = generateConfig(project);
    // merge(commonConfig, config);
};