import MiniCssExtractPlugin from "mini-css-extract-plugin";
import genericName from "generic-names";
import {RuleSetUseItem} from "webpack";
import {CommonArgs} from "./interface";
import {getGenerateRule} from "./common";

/**
 * produce loader to compile css and extract it in production
 */
export default function css({prod}: CommonArgs, index: number, list: RuleSetUseItem[]) {
    const generateRule = getGenerateRule(prod);
    const loaders: RuleSetUseItem[] = [
        // 生产模式下分离CSS样式
        prod ? MiniCssExtractPlugin.loader : require.resolve('style-loader'),
        {
            loader: require.resolve('css-loader'),
            options: {
                importLoaders: list.length,
                modules: {
                    auto: true, // 自动开启模块化,
                    getLocalIdent: (context, localIdentName, localName) => {
                        const {resourcePath, rootContext} = context;
                        return genericName(generateRule, {context: rootContext})(localName, resourcePath);
                    },
                }
            },
        },
    ];
    // 生产模式下使用postcss添加前缀
    if (prod) {
        (loaders[1] as any).options.importLoaders += 1;
        loaders.push({
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
        });
    }
    return loaders;
}