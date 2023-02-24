import scanProject from "../utils/scanProject";
import readConfig from "../utils/readConfig";
import log from "../utils/log";
import readWebpackConfigFromProject from "../utils/readWebpackConfigFromProject";
import getPorts from "../utils/getPorts";
import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";
import path from "path";

const DEFAULT_ROOT_DIR = 'packages';
export default async function serve(options) {
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
    if (unify) {
        // 所有项目都在一个端口启动时候，只获取一个端口
        ports = await getPorts(unify ? 1 : serveProjects.length);
    }
    const projectWebpackConfig = readWebpackConfigFromProject(serveProjects, serveConfig, projects, prod, ports);
    console.log(projectWebpackConfig);
    if (unify) {
        const compiler = webpack(projectWebpackConfig);
        const server = new WebpackDevServer({
            port: ports[0],
            hot: true,
            magicHtml: true,
            static: path.resolve(process.cwd(), 'dist'),
        }, compiler);
        runServer(server, '').catch((e) => console.log('应用启动失败：', e));
    }
};
const runServer = async (server, name = '') => {
    console.log('正在启动应用：' + name);
    await server.start();
    console.log('启动应用成功：' + name);
};