import {ENV_DEV, ENV_PROD, ROOT_DIR_DEFAULT} from "../const";
import {IConfig, IOptions} from "../types/interface";
import readConfig from "./readConfig";
import scanProject from "./scanProject";

export function resolveOptions(options: IOptions, isProd = true) {
    // 构建模式默认为生产模式
    const {prod = isProd, project, config, env: use_env} = options;
    const env = use_env ? use_env : prod ? ENV_PROD : ENV_DEV;
    const unify = typeof options.unify === 'undefined' ? false : typeof options.unify === "boolean" ? options.unify : +options.unify;
    const serveConfig: IConfig = readConfig(config);
    const rootPath = serveConfig.rootDir || ROOT_DIR_DEFAULT;
    return {prod, project, config, serveConfig, env, unify, rootPath};
}