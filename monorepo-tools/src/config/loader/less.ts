import {RuleSetRule, RuleSetUseItem} from "webpack";
import {CommonArgs} from "./interface";

/**
 * less编译在生产环境和开发环境一致
 */
export default function less({project}: CommonArgs, index: number, list: RuleSetUseItem[]) {
    const loaders: RuleSetRule['use'] = [
        {
            loader: require.resolve('less-loader'),
            options: {
                lessOptions: project?.lessOptions ?? {}
            }
        }
    ];
    return loaders;
}