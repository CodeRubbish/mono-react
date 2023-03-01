import {Configuration} from "webpack";

export const commonConfig: Configuration = {
    mode: "production",
    devtool: "source-map",
    output: {
        clean: true,
        chunkFilename: "chunk.[contenthash].js",
        filename: "[name].[contenthash].js",
    },
    resolve: {
        extensions: ['.ts', '.tsx', '...'],
    },
};