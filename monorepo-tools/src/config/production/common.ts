import {Configuration, RuleSetRule} from "webpack";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import genericName from "generic-names";

const generateRule = "[hash:base64:16]";

const oneOfLoader: (context) => RuleSetRule[] = (context) => [
    {
        test: /\.tsx?$/,
        exclude: /[\\/]node_modules[\\/]/,
        use: [
            {
                loader: require.resolve('babel-loader'),
                options: {
                    presets: [
                        [
                            '@babel/preset-env', {
                            useBuiltIns: "usage",
                            corejs: "3"
                        }
                        ],
                        '@babel/preset-react',
                        '@babel/preset-typescript',
                    ],
                    plugins: [
                        "@babel/plugin-transform-runtime",
                        [
                            'babel-plugin-react-css-modules', {
                            "generateScopedName": generateRule,
                            context
                        }
                        ],
                    ]
                }
            },
        ]
    },
    {
        test: /\.(le|c)ss$/,
        exclude: /[\\/]node_modules[\\/]/,
        use: [
            MiniCssExtractPlugin.loader,
            {
                loader: require.resolve('css-loader'),
                options: {
                    importLoaders: 2,
                    modules: {
                        auto: true, // 自动开启模块化,
                        getLocalIdent: (context, localIdentName, localName) => {
                            const {resourcePath, rootContext} = context;
                            return genericName(generateRule, {context: rootContext})(localName, resourcePath);
                        },
                    }
                },
            },
            {
                loader: require.resolve('postcss-loader'),
                options: {
                    postcssOptions: {
                        plugins: [
                            [
                                "postcss-preset-env",
                                {
                                    // Options
                                },
                            ],
                        ],
                    }
                }
            },
            {
                loader: require.resolve('less-loader'),
                options: {
                    lessOptions: {
                        strictMath: 'always', // 符合3.x用户使用习惯
                    },
                }
            }
        ],
    },
    {
        test: /\.(png|svg|apng|avif|bmp|gif|ico|cur|jpg|jpeg|jfif|pjpeg|pjp|tif|tiff|webp)$/,
        type: 'asset',
        generator: {
            filename: "images/[contenthash][ext][query]"
        }
    },
    {
        test: /\.(woff|otf|woff2|ttf)$/,
        type: 'asset/resource',
        generator: {
            filename: "font/[contenthash][ext][query]"
        }
    },
    {
        test: /\.html$/,
        loader: require.resolve('html-loader')
    }
];
const commonConfig: (context) => Configuration = (context) => ({
    mode: "production",
    context: context,
    devtool: "none",
    output: {
        clean: true,
        chunkFilename: "chunk.[contenthash:8].js",
        filename: "[name].[contenthash:8].js",
    },
    module: {
        rules: [
            {oneOf: oneOfLoader(context)}
        ]
    },
    plugins: [
        new MiniCssExtractPlugin(),
    ],
    resolve: {
        extensions: ['.ts', '.tsx', '...'],
    },
});
export default commonConfig;
