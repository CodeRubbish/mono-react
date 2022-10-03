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
        mode: 'development',
        devtool: "eval-cheap-module-source-map",
        entry: path.resolve('packages', 'base', 'src', 'index.ts'),
        output: {
            clean: false,
            path: path.resolve(root, 'dist', 'base'),
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
                                ],
                                plugins: [
                                    'react-refresh/babel'
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
        ]
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
        ]
    },
];
export default function serve() {
    const compiler = webpack(config);
    const server = new WebpackDevServer({
        port: 3000,
        hot: 'only',
    }, compiler);
    server.start();
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