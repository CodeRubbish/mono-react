import {Configuration} from "webpack";

export const commonConfig: (context: string) => Configuration = (context: string) => ({
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
});