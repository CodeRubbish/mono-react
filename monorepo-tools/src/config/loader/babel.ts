import {RuleSetUseItem} from "webpack";
import {CommonArgs} from "./interface";

/**
 * less编译在生产环境和开发环境一致
 */
export default function babel({project, prod}: CommonArgs, index: number, list: RuleSetUseItem[]) {
    const generateRule = getGenerateRule(prod);
    const loaders: RuleSetUseItem[] = [
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
                        context: project.projectRootPath
                    }
                    ],
                ]
            }
        },
    ];
    if (!prod) {
        // 开发模式下，启动组件热更新
        (loaders[0] as any).options.plugins.unshift('react-refresh/babel');
    }
    return loaders;
}