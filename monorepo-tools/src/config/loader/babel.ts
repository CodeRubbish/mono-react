import {RuleSetUseItem} from "webpack";
import {CommonArgs} from "./interface";
import {getGenerateRule} from './common';
import {readBabelConfig} from "../../utils/readBabelConfig";

/**
 * less编译在生产环境和开发环境一致
 */
export default function babel({project, prod}: CommonArgs, index: number, list: RuleSetUseItem[]) {
    const babelConfig = readBabelConfig(project);
    const generateRule = getGenerateRule(prod);
    const BABEL_DEFAULT_CONFIG = {
        presets: [
            [
                require.resolve('@babel/preset-env'), {
                useBuiltIns: "usage",
                corejs: "3"
            }
            ],
            require.resolve('@babel/preset-react'),
            require.resolve('@babel/preset-typescript'),
        ],
        plugins: [
            require.resolve("@babel/plugin-transform-runtime"),
            [
                require.resolve('babel-plugin-react-css-modules'), {
                "generateScopedName": generateRule,
                context: project.projectRootPath
            }
            ],
        ]
    };
    const loaders: RuleSetUseItem[] = [
        {
            loader: require.resolve('babel-loader'),
            options: mixin(BABEL_DEFAULT_CONFIG, babelConfig)
        },
    ];
    if (!prod) {
        // 开发模式下，启动组件热更新
        (loaders[0] as any).options.plugins.unshift('react-refresh/babel');
    }
    return loaders;
}

interface BabelConfig {
    presets?: any[],
    plugins?: any[]
}

const mixin = (...configs: BabelConfig[]): BabelConfig => {
    const map = config => {
        if (typeof config !== "string") {
            return [require.resolve(config[0]), config[1]];
        }
        return require.resolve(config);
    };
    return configs.reduce((prev, next) => {
        if (next) {
            const {presets, plugins} = next;
            if (presets) prev.presets.push(...presets.map(map));
            if (plugins) prev.plugins.push(...plugins.map(map));
        }
        return prev;
    });
};