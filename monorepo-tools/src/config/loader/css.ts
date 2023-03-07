import MiniCssExtractPlugin from "mini-css-extract-plugin";
import genericName from "generic-names";
import {RuleSetRule} from "webpack";

/**
 * produce loader to compile css and extract it in production
 */
export default function css({prod = false}, index, list) {
    const generateRule = prod ? "[hash:base64:16]" : "[name]__[local]___[hash:base64:8]";
    const loaders: RuleSetRule['use'] = [
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