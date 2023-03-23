import {Configuration} from "webpack";
import {CommonArgs} from "./loader/interface";
import assets from "./assets";
import {CSSRegExp, LESSRegExp, NodeModuleRegExp, ScriptRegExp} from "./regExp";
import compose from "./loader/compose";
import babel from "./loader/babel";
import css from './loader/css';
import less from "./loader/less";
import ReactRefreshPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CompressionPlugin from "compression-webpack-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
import {CSS_CONTENTHASH_FILENAME, CSS_FILENAME, JS_CONTENTHASH_FILENAME, JS_FILENAME} from "./const";

export default function getCommonCfg(commonArgs: CommonArgs) {
    const {project, prod, unify} = commonArgs;
    const commonCfg: Configuration = {
        mode: prod ? "production" : "development",
        // 生产模式不暴露source-map
        devtool: prod ? undefined : "eval-cheap-module-source-map",
        output: {
            chunkFilename: prod ? JS_CONTENTHASH_FILENAME : JS_FILENAME,
            filename: prod ? JS_CONTENTHASH_FILENAME : JS_FILENAME,
            // 开发环境，编译结果保持在内存中，无需要clean/生产环境中，unify模式下根应用需要清理，其他应不用不需要。
            clean: prod ? unify ? project.isApplication() && project.isRoot() : true : false,
            // 模块联邦异步加载chunk
            crossOriginLoading: unify ? false : "anonymous",
        },
        module: {
            rules: [
                {
                    oneOf: [
                        {
                            test: ScriptRegExp,
                            exclude: NodeModuleRegExp,
                            use: compose(babel)(commonArgs)
                        },
                        {
                            test: LESSRegExp,
                            use: compose(css, less)(commonArgs)
                        },
                        {
                            test: CSSRegExp,
                            use: compose(css)(commonArgs)
                        },
                        ...assets,
                    ]
                }
            ]
        },
        plugins: getCommonPlugins(commonArgs),
        // 默认支持ts,tsx
        resolve: {
            extensions: ['.ts', '.tsx', '...'],
        },
    };
    if (prod) {
        commonCfg.optimization = {
            minimize: true,
            minimizer: [
                '...',
                new CssMinimizerPlugin(),
                new TerserPlugin({
                    terserOptions: {
                        compress: {
                            drop_console: true,
                            drop_debugger: true
                        },
                        format: {
                            comments: false,
                        },
                    },
                    extractComments: false,
                }),
            ],
        };
    }
    return commonCfg;
}
const DEVPlugins = [new ReactRefreshPlugin()];
const PRODPlugins = [
    new MiniCssExtractPlugin({
        filename: CSS_FILENAME,
        chunkFilename: CSS_CONTENTHASH_FILENAME,
    }),
    // gzip压缩
    new CompressionPlugin(),
];

function getCommonPlugins({prod}: CommonArgs) {
    return prod ? PRODPlugins : DEVPlugins;
}