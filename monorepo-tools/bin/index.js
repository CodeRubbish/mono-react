#!/usr/bin/env node
'use strict';

var commander = require('commander');
var webpack = require('webpack');
var path = require('path');
var WebpackBar = require('webpackbar');
var WebpackDevServer = require('webpack-dev-server');
var HtmlWebpackPlugin = require('html-webpack-plugin');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n["default"] = e;
  return Object.freeze(n);
}

var webpack__default = /*#__PURE__*/_interopDefaultLegacy(webpack);
var path__namespace = /*#__PURE__*/_interopNamespace(path);
var WebpackBar__default = /*#__PURE__*/_interopDefaultLegacy(WebpackBar);
var WebpackDevServer__default = /*#__PURE__*/_interopDefaultLegacy(WebpackDevServer);
var HtmlWebpackPlugin__default = /*#__PURE__*/_interopDefaultLegacy(HtmlWebpackPlugin);

var version = "1.0.0";

const { ModuleFederationPlugin } = webpack__default["default"].container;
const root = process.cwd();
const config = [
    {
        context: path__namespace.resolve('packages', 'base'),
        mode: 'development',
        devtool: "eval-cheap-module-source-map",
        entry: path__namespace.resolve('packages', 'base', 'src', 'index.ts'),
        output: {
            clean: false,
            path: path__namespace.resolve(root, 'dist'),
            chunkFilename: "chunk.[contenthash:8].js",
            filename: "[name].js",
        },
        module: {
            rules: [
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
                                ]
                            }
                        }
                    ]
                }
            ]
        },
        resolve: {
            extensions: ['.ts', '.tsx', '...'],
        },
        plugins: [
            new ModuleFederationPlugin({
                name: 'base',
                remotes: {
                    utils: 'utils@http://localhost:3000/utils/remoteEntry.js'
                }
            }),
            new WebpackBar__default["default"](),
            new HtmlWebpackPlugin__default["default"]({
                template: './public/index.html'
            })
        ]
    },
    {
        context: path__namespace.resolve('packages', 'utils'),
        entry: path__namespace.resolve('packages', 'utils', 'index.js'),
        mode: 'development',
        devtool: "eval-cheap-module-source-map",
        output: {
            clean: false,
            path: path__namespace.resolve(root, 'dist', 'utils'),
            chunkFilename: "chunk.[contenthash:8].js",
            filename: "[name].js",
        },
        plugins: [
            new ModuleFederationPlugin({
                name: 'utils',
                filename: 'remoteEntry.js',
                exposes: {
                    './add': './add.js',
                }
            }),
            new WebpackBar__default["default"]()
        ]
    },
];
function serve() {
    const compiler = webpack__default["default"](config);
    const server = new WebpackDevServer__default["default"]({
        port: 3000,
    }, compiler);
    server.startCallback(() => {
        console.log('listen on port 3000');
    });
    // compiler.run((error, {stats: statList}) => {
    //     for (let stats of statList) {
    //         if (stats.hasErrors()) {
    //             console.log(stats.toString({
    //                 chunks: false,  // Makes the build much quieter
    //                 colors: true    // Shows colors in the console
    //             }));
    //         }
    //     }
    // });
}

commander.program
    .name('monorepo-tools')
    .description('CLI to run monorepo for react module federation micro frontend project')
    .version(version);
commander.program.command('start')
    .option('--prod', 'production preset')
    .option('-p, --project', 'project')
    .action(() => {
    serve();
});
commander.program.parse();
