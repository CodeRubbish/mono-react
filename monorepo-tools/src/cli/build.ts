import scanProject from "../utils/scanProject";
import readConfig from "../utils/readConfig";
import log from "../utils/log";
import webpack from "webpack";
import {ROOT_DIR_DEFAULT} from "../const";
import process from "process";
import type {IConfig, IOptions} from "../types/interface";
import readWebpackConfigFromProject from "../utils/readWebpackConfigFromProject";

/**
 * 启动一个指定项目
 * @param options
 */
export default async function build(options: IOptions) {
    // 构建模式默认为生产模式
    const {prod = true, project, config} = options;
    const unify = typeof options.unify === 'undefined' ? false : typeof options.unify === "boolean" ? options.unify : +options.unify;
    const serveConfig: IConfig = readConfig(config);
    const rootPath = serveConfig.rootDir || ROOT_DIR_DEFAULT;
    const projects = scanProject(rootPath, serveConfig);
    let buildProjects = projects;// 默认构建所有项目
    // project 存在说明用户指定了字段，使用用户指定项目
    if (project) {
        const userProjects = project.split(/[,\s]/);// 用户指定了构建项目
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
    const projectWebpackConfig = readWebpackConfigFromProject(buildProjects, serveConfig, projects, true, {
        prod,
        unify
    });
    const compiler = webpack(projectWebpackConfig);
    compiler.run((err: any, stats) => {
        if (err) {
            console.error(err.stack || err);
            if (err.details) {
                console.error(err.details);
            }
            return;
        }
        const info = stats.toJson();

        if (stats.hasErrors()) {
            console.error(info.errors);
        }

        if (stats.hasWarnings()) {
            console.warn(info.warnings);
        }
    });

};