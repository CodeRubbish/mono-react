import {Configuration, RuleSetRule} from "webpack";

const oneOfLoader: RuleSetRule[] = [
    {
        test: /\.tsx?$/,
        use: [
            {
                loader: require.resolve('babel-loader'),
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
            },
        ]
    },
    {
        test: /\.(le|c)ss$/,
        use: [
            require.resolve('style-loader'),
            {
                loader: require.resolve('css-loader'),
                options: {
                    importLoaders: 2,
                    modules: {
                        auto: true // 自动开启模块化
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
export const commonConfig: Configuration = {
    mode: "development",
    devtool: "eval-cheap-module-source-map",
    output: {
        clean: true,
        chunkFilename: "chunk.[name].js",
        filename: "[name].js",
    },
    module: {
        rules: [
            {oneOf: oneOfLoader}
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '...'],
    },
};