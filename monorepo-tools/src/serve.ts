import webpack, {Configuration} from "webpack";
import * as path from "path";
import WebpackBar from 'webpackbar';
import WebpackDevServer from 'webpack-dev-server';
import HtmlWebpackPlugin from "html-webpack-plugin";
import ReactRefreshPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import {getDevConfig} from "./getDevConfig";
import {merge} from "webpack-merge";
import {commonConfig} from "./config/dev/common";
import {isApplication} from "./scan";

const {ModuleFederationPlugin} = webpack.container;
const root = process.cwd();
const config: Configuration [] = [
    {
        mode: "development",
        devtool: "eval-cheap-module-source-map",
        context: path.resolve('packages', 'base'),
        entry: path.resolve('packages', 'base', 'src', 'index.ts'),
        output: {
            path: path.resolve(root, 'dist'),
        },
        plugins: [
            new ModuleFederationPlugin({
                name: 'base',
                remotes: {
                    utils: 'utils@http://localhost:3000/utils/remoteEntry.js'
                },
                shared: {
                    react: "17.0.2",
                    "react-dom": "17.0.2",
                }
            }),
            new WebpackBar(),
            new HtmlWebpackPlugin({
                template: './public/index.html'
            }),
            new ReactRefreshPlugin(),
        ],
        resolve: {
            extensions: ['.ts', '.tsx', '...'],
        },
    },
    {
        context: path.resolve('packages', 'utils'),
        entry: path.resolve('packages', 'utils', 'index.js'),
        mode: 'development',
        devtool: "eval-cheap-module-source-map",
        output: {
            clean: false,
            path: path.resolve(root, 'dist', 'utils'),
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
            new WebpackBar(),
        ],
        resolve: {
            extensions: ['.ts', '.tsx', '...'],
        },
    },
];

function readConfigFromProject(projects, ports) {
    const webpackConfig: Configuration[] = [];
    const remotes = {};
    projects.forEach((project, index) => {
        if (!isApplication(project)) {
            remotes[project.name] = `${project.name}@http://localhost:${ports[index]}/remoteEntry.js`;
        }
    });
    console.log(remotes);
    const shared = require(path.resolve(root, 'package.json')).dependencies;
    for (const project of projects) {
        let config = getDevConfig(project);
        let extra = {};
        if (!isApplication(project)) {
            extra = {
                exposes: {'./add': './src/add.ts'},
            };
        }
        config = merge(config, {
            plugins: [
                new ModuleFederationPlugin({
                    filename: 'remoteEntry.js',
                    name: project.name,
                    remotes,
                    shared,
                    ...extra
                }),
            ]
        });
        webpackConfig.push(config);
    }
    return webpackConfig;
}

export default function serve(projects, ports) {
    const webpackConfigs = readConfigFromProject(projects, ports);
    const {length} = webpackConfigs;
    const runServer = async (server, name) => {
        console.log('正在启动应用：' + name);
        await server.start();
        console.log('启动应用成功：' + name);
    };
    for (let i = 0; i < length; i++) {
        const compiler = webpack(webpackConfigs[i]);
        const server = new WebpackDevServer({
            port: ports[i],
            hot: true,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Method": "GET"
            }
        }, compiler);
        runServer(server, projects[i].name).catch(() => console.log('应用启动失败：' + projects[i].name));
    }
}