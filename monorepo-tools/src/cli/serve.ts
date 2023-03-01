import scanProject from "../utils/scanProject";
import readConfig from "../utils/readConfig";
import log from "../utils/log";
import readWebpackConfigFromProject from "../utils/readWebpackConfigFromProject";
import getPorts from "../utils/getPorts";
import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";
import path from "path";
import {OUTPUT_DIRECTORY_DEFAULT} from "../const";
import process from "process";

const DEFAULT_ROOT_DIR = 'packages';

interface IOptions {
    unify: boolean | number; // 是否以单个端口模式启动，为number时候为指定端口号
    prod: boolean; // 是否以生产模式启动，便于调试线上环境异常，由于生产模式启用content hash，所以默认关闭热更新
    project: string;// 指定启动项目列表，可仅启动指定项目，其余项目采用线上的远端模块地址
    config: IConfig; // 配置项
}

interface IConfig {
}

/**
 * 启动一个指定项目
 * @param options
 */
export default async function serve(options: IOptions) {
    const {unify, prod, project, config} = options;
    const serveConfig = readConfig(config);
    const rootPath = serveConfig.rootDir || DEFAULT_ROOT_DIR;
    const projects = scanProject(rootPath, serveConfig);
    let serveProjects = projects;// 默认启动所有项目
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
    if (typeof unify !== "undefined") {
        // 所有项目都在一个端口启动时候，只获取一个端口,如果用户指定了端口，则使用指定端口
        ports = Number.isNaN(+unify) ? await getPorts(unify ? 1 : serveProjects.length) : [+unify];
    }
    const projectWebpackConfig = readWebpackConfigFromProject(serveProjects, serveConfig, projects, prod, ports);
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