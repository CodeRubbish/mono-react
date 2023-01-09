import webpack, {Configuration} from "webpack";
import * as path from "path";
import WebpackBar from 'webpackbar';
import WebpackDevServer from 'webpack-dev-server';
import HtmlWebpackPlugin from "html-webpack-plugin";
import ReactRefreshPlugin from "@pmmmwh/react-refresh-webpack-plugin";

const {ModuleFederationPlugin} = webpack.container;
const root = process.cwd();
const config: Configuration [] = [
    {
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
    },
    {
        context: path.resolve('packages', 'utils'),
        entry: path.resolve('packages', 'utils', 'index.js'),
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
        ]
    },
];

function isProject(type) {
    return type === 'project';
}

function isLib(type) {
    return type === 'lib';
}

function readConfigFromProject(projects) {
    const webpackConfig: Configuration[] = [];
    const remotes = {};
    for (const project of projects) {
        const {name, entry, type, htmlTemplate} = project;
        let config: Configuration = {
            context: path.resolve('packages', name),
            entry,
            output: {
                path: path.resolve(root, 'packages', name, 'dist'),
            },
            mode: 'development',
            devtool: "eval-cheap-module-source-map",
        };
        if (isProject(type)) {
            config = {
                ...config,
                resolve: {
                    extensions: ['.ts', '.tsx', '...']
                },
                plugins: [
                    new ModuleFederationPlugin({
                        name: name,
                        remotes: remotes,
                    }),
                    new HtmlWebpackPlugin({
                        template: htmlTemplate
                    }),
                    new ReactRefreshPlugin(),
                ],
            };
        } else if (isLib(type)) {
            config = {
                ...config,
                plugins: [
                    new ModuleFederationPlugin({
                        name: name,
                        remotes: remotes,
                    }),
                ]
            };
        }

        webpackConfig.push(config);
    }
    return webpackConfig;
}

export default function serve(projects, ports) {
    const webpackConfigs = readConfigFromProject(projects);
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
            hot: true
        }, compiler);
        runServer(server, projects[i].name).catch(() => console.log('应用启动失败：' + projects[i].name));
    }
}