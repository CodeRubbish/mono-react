import {Configuration} from "webpack";
import WebpackBar from "webpackbar";

export const commonConfig: Configuration = {
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
export const commonLoaders = {};