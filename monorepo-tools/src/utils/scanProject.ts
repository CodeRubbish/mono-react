import fs from 'fs';
import path from "path";
import {AppProject, LibProject} from "../project";
import isProject from "./isProject";
import {rootPath} from "../const";

/**
 * 扫描根路径下的所有项目
 * @param projectRootPath
 * @param config
 */
export default function scanProject(projectRootPath, config) {
    if (!projectRootPath) {
        projectRootPath = path.resolve(rootPath, 'packages');
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
    console.log('projects', projects);
    console.log('alias for all', alias);
    return projects.map(project => readProjectConfig(project, projectRootPath, config, alias)).filter(i => i);
}

function readProjectConfig(project, projectRootPath, config, alias) {
    const {name} = project;
    const prp = path.resolve(rootPath, projectRootPath, name);// project root path
    const entry = analysisEntry(name, config[name], prp);
    if (!entry) return null; // 无项目入口文件，放弃
    const html = analysisHtml(name, config[name], prp);
    return html ? new AppProject(name, entry, prp, alias, html) : new LibProject(name, entry, prp, alias);
}

/**
 * 判断项目入口是否存在，如果存在则返回入口，否则返回undefined;
 * @param projectName
 * @param config
 * @param projectRootPath
 */
function analysisEntry(projectName, config, projectRootPath) {
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
