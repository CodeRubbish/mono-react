import log from "../utils/log";
import readWebpackConfigFromProject from "../utils/readWebpackConfigFromProject";
import getPorts from "../utils/getPorts";
import process from "process";
import type {IOptions} from "../types/interface";
import {resolveOptions} from "../utils/resolveOptions";
import {resolveUseProjects} from "../utils/resolveUseProjects";
import {server} from "../utils/server";

/**
 * 启动一个指定项目
 * @param options
 */
export default async function serve(options: IOptions) {
    const {prod, project, config, serveConfig, env, unify, rootPath} = resolveOptions(options, false);
    const {useProjects, projects} = resolveUseProjects(project, rootPath, serveConfig);
    let ports;
    if (unify === true) {
        // 所有项目都在一个端口启动时候
        ports = await getPorts(unify ? 1 : useProjects.length);
    } else {
        log.error('it is only support unify model to serve project');
        process.exit(2);
    }
    // 当前仅支持在同一个端口启动
    const projectWebpackConfig = readWebpackConfigFromProject(useProjects, serveConfig, projects, false, {
        prod,
        ports,
        unify
    });
    await server(projectWebpackConfig, {port: ports[0], rootPath});
};
