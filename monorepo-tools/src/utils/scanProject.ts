import * as fs from 'fs';
import * as path from "path";
import * as process from "process";
import {AppProject, LibProject} from "../project";

const root = process.cwd();

/**
 * 扫描根路径下的所有项目
 * @param projectRootPath
 */
export default function scanProject(projectRootPath, config) {
    if (!projectRootPath) {
        projectRootPath = path.resolve(process.cwd(), 'packages');
    }
    const projects = fs.readdirSync(projectRootPath, {withFileTypes: true}).filter(dir => dir.isDirectory());
    return projects.map(project => readProjectConfig(project, config)).filter(i => i);
}

function readProjectConfig(project, config) {
    const {name} = project;
    const prp = path.resolve(root, 'packages', name);
    const entry = analysisEntry(name, config[name], prp);
    if (!entry) return null; // 无项目入口文件，放弃
    const html = analysisHtml(name, config[name], prp);
    return html ? new AppProject(name, entry, prp, html) : new LibProject(name, entry, prp);
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
