import fs from 'fs';
import path from "path";
import Project, {AppProject, LibProject} from "../project";
import isProject from "./isProject";
import {ROOT_PATH} from "../const";
import {IConfig, IProject} from "../types/interface";
import {Configuration} from "webpack";

/**
 * 扫描根路径下的所有项目
 * @param projectRootPath
 * @param config
 */
export default function scanProject(projectRootPath: string, config: IConfig) {
    if (!projectRootPath) {
        projectRootPath = path.resolve(ROOT_PATH, 'packages');
    }
    const directories = fs.readdirSync(projectRootPath, {withFileTypes: true})
        .filter(dir => dir.isDirectory());
    const projects = [];
    const alias = {};
    directories.forEach(dir => {
        if (isProject(dir, projectRootPath)) {
            projects.push(dir);
        } else {
            alias[`@${dir.name}`] = path.resolve(projectRootPath, dir.name);
        }
    });
    return projects.map(project => readProjectConfig(project, projectRootPath, config, alias)).filter(i => i);
}

function readProjectConfig(project: Project, projectRootPath: string, config: IConfig, alias: Configuration['resolve']['alias']) {
    const {name} = project;
    const projectConfig: IProject = config[name] || {};
    const prp = path.resolve(projectRootPath, name);// project root path
    const entry = analysisEntry(name, projectConfig, prp);
    if (!entry) return null; // 无项目入口文件，放弃
    const html = analysisHtml(name, projectConfig, prp);
    return html ? new AppProject(name, entry, prp, alias, html, projectConfig.options) : new LibProject(name, entry, prp, alias, projectConfig.options);
}

/**
 * 判断项目入口是否存在，如果存在则返回入口，否则返回undefined;
 * @param projectName
 * @param config
 * @param projectRootPath
 */
function analysisEntry(projectName: string, config: IProject, projectRootPath) {
    const entry = config?.entry || path.resolve(projectRootPath, 'src', 'index.ts');
    if (fs.existsSync(entry)) {
        return entry;
    }
}

/**
 * 根据项目名称分析项目类型
 * @param projectName
 * @param config
 * @param projectRootPath
 */
function analysisHtml(projectName, config, projectRootPath) {
    const html = config?.htmlTemplate || path.resolve(projectRootPath, 'public', 'index.html');
    if (fs.existsSync(html)) {
        return html;
    } else {
        return null;
    }
}
