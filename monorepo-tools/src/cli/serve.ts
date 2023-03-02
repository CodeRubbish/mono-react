import scanProject from "../utils/scanProject";
import readConfig from "../utils/readConfig";
import log from "../utils/log";
import readWebpackConfigFromProject from "../utils/readWebpackConfigFromProject";
import getPorts from "../utils/getPorts";
import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";
import path from "path";
import {OUTPUT_DIRECTORY_DEFAULT, ROOT_DIR_DEFAULT} from "../const";
import process from "process";
import type {IConfig, IOptions} from "../types/interface";

/**
 * 启动一个指定项目
 * @param options
 */
export default async function serve(options: IOptions) {
    const {prod, project, config} = options;
    const unify = typeof options.unify === 'undefined' ? false : typeof options.unify === "boolean" ? options.unify : +options.unify;
    const serveConfig: IConfig = readConfig(config);
    // 用于扫描项目的根地址
    const rootPath = serveConfig.rootDir || ROOT_DIR_DEFAULT;
    // 在指定根路径下扫描项目
    const projects = scanProject(rootPath, serveConfig);
    // 默认启动所有项目
    let serveProjects = projects;
    // project 存在说明用户指定了字段，使用用户指定项目
    if (project) {
        const userProjects = project.split(',');
        serveProjects = [];
        userProjects.forEach(projectName => {
            const matchProject = projects.find(_ => _.name === projectName);
            if (!matchProject) return log.warn(`the project ${projectName} does not exist`);
            serveProjects.push(matchProject);
        });
    }
    if (serveProjects.length === 0) {
        log.error('there are no project to run,please make sure you have any project or specify the right project name');
        process.exit(2);
    }
    let ports;
    if (unify === true) {
        // 所有项目都在一个端口启动时候
        ports = await getPorts(unify ? 1 : serveProjects.length);
    }
    const projectWebpackConfig = readWebpackConfigFromProject(serveProjects, serveConfig, projects, false, {
        prod,
        ports,
        unify
    });
    if (unify) {
        const compiler = webpack(projectWebpackConfig);
        const server = new WebpackDevServer({
            port: ports[0],
            hot: true,
            magicHtml: true,
            static: path.resolve(rootPath, OUTPUT_DIRECTORY_DEFAULT),// 暂不支持用户指定输出目录
        }, compiler);
        try {
            await runServer(server);
        } catch (e) {
            log.error('start applications unify stop by error', e);
            process.exit(2);
        }
    }
};
const runServer = async (server, name = '') => {
    console.log('application start：' + name);
    await server.start();
    console.log('application start success：' + name);
};