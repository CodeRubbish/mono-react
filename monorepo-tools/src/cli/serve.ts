import scanProject from "../utils/scanProject";
import readConfig from "../utils/readConfig";
import log from "../utils/log";
import readWebpackConfigFromProject from "../utils/readWebpackConfigFromProject";

const DEFAULT_ROOT_DIR = 'packages';
export default function serve(options) {
    const {unify, prod, project, config} = options;
    const serveConfig = readConfig(config);
    if (unify !== undefined) {
        // cli 中的优先级更高
        serveConfig.unify = unify;
    }
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
    const projectWebpackConfig = readWebpackConfigFromProject(serveProjects, serveConfig, projects, prod);
};
