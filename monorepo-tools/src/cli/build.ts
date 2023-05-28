import type {IOptions} from "../types/interface";
import readWebpackConfigFromProject from "../utils/readWebpackConfigFromProject";
import {resolveOptions} from "../utils/resolveOptions";
import {resolveUseProjects} from "../utils/resolveUseProjects";
import {compile} from "../utils/compile";

/**
 * 启动一个指定项目
 * @param options
 */
export default async function build(options: IOptions) {
    // 构建模式默认为生产模式
    const {prod, project, config, serveConfig, env, unify, rootPath} = resolveOptions(options);
    const {useProjects, projects} = resolveUseProjects(project, rootPath, serveConfig);
    const projectWebpackConfig = readWebpackConfigFromProject(useProjects, serveConfig, projects, true, {
        prod,
        unify
    });
    compile(projectWebpackConfig);
};