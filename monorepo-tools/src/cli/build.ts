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
export default async function build(options: IOptions) {
    // 构建模式默认以生产模式启动
    const {unify, prod = true, project, config} = options;
    const serveConfig: IConfig = readConfig(config);
    const rootPath = serveConfig.rootDir || ROOT_DIR_DEFAULT;
    const projects = scanProject(rootPath, serveConfig);
    let buildProjects = projects;// 默认构建所有项目
    if (project) {
        const userProjects = project.split(',');// 用户指定了构建项目
        buildProjects = [];
        userProjects.forEach(projectName => {
            const matchProject = projects.find(_ => _.name === projectName);
            if (!matchProject) return log.warn(`the project ${projectName} does not exist`);
            buildProjects.push(matchProject);
        });
    }
    if (buildProjects.length === 0) {
        log.error('there are no project to build,please make sure you have any project or specify the right project name');
        process.exit(2);
    }
    let ports;
    const projectWebpackConfig = readWebpackConfigFromProject(buildProjects, serveConfig, projects, prod, ports);
    console.log(projectWebpackConfig);
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