import {Configuration} from "webpack";
import {CommonArgs} from "./loader/interface";
import assets from "./assets";
import {CSSRegExp, LESSRegExp, NodeModuleRegExp, ScriptRegExp} from "./regExp";
import compose from "./loader/compose";
import babel from "./loader/babel";
import css from './loader/css';
import less from "./loader/less";

function getCommonCfg(commonArgs: CommonArgs) {
    const {project, prod, unify} = commonArgs;
    const commonCfg: Configuration = {
        mode: prod ? "production" : "development",
        // 生产模式不暴露source-map
        devtool: prod ? undefined : "eval-cheap-module-source-map",
        output: {
            chunkFilename: prod ? CONTENTHASH_FILENAME : FILENAME,
            filename: prod ? CONTENTHASH_FILENAME : FILENAME,
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
        }
    };
}

const FILENAME = "chunk.[name].js";
const CONTENTHASH_FILENAME = "[name].[contenthash:8].js";
