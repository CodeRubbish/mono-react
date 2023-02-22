import {Configuration} from "webpack";
import ReactRefreshPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import path from "path";
import {isApplication} from "./scan";
import {merge} from "webpack-merge";
import HtmlWebpackPlugin from "html-webpack-plugin";

const root = process.cwd();
const commonConfig: Configuration = {
    mode: "development",
    devtool: "eval-cheap-module-source-map",
    output: {
        clean: true,
        chunkFilename: "chunk.[name].js",
        filename: "[name].js",
    },
    resolve: {
        extensions: ['.ts', '.tsx', '...'],
    },
};
const normalConfig: Configuration = {
    module: {
        rules: [
            {
                oneOf: [
                    {
                        test: /\.less$/,
                        use: [],
                    },
                    {
                        test: /\.scss$/,
                        use: [],
                    },
                    {

                    }
                ]
            }
        ]
    },
};
const generateConfig = project => {
    const {name, entry, htmlTemplate} = project;
    let config: Configuration = {
        context: path.resolve('packages', name),
        entry,
        output: {
            path: path.resolve(root, 'packages', name, 'dist'),
        },
    };
    if (isApplication(project)) {
        const oneOfLoader = [
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
            },
            {
                test: /\.html$/,
                loader: require.resolve('html-loader')
            }
        ];
        config = {
            ...config,
            module: {
                rules: [
                    {
                        oneOf: oneOfLoader
                    }
                ]
            },
            plugins: [
                new HtmlWebpackPlugin({
                    template: htmlTemplate,
                }),
                new ReactRefreshPlugin(),
            ],
        };
    } else {
        config = {};
    }
    return config;
};
export const getDevConfig = (project) => {
    const config = generateConfig(project);
    return merge(commonConfig, config);
};