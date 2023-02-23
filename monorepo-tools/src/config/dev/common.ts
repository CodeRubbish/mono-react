import {Configuration} from "webpack";

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
            },
        ]
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