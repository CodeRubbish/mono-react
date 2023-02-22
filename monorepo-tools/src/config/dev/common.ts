import {Configuration} from "webpack";

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