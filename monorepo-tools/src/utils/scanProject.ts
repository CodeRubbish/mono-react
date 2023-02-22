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
    const entry = analysisEntry(name, config[name]);
    if (!entry) return null; // 无项目入口文件，放弃
    const html = analysisHtml(name, config[name]);
    return html ? new AppProject(name, entry, html) : new LibProject(name, entry);
}

/**
 * 判断项目入口是否存在，如果存在则返回入口，否则返回undefined;
 * @param projectName
 */
function analysisEntry(projectName, config) {
    const entry = config?.entry || path.resolve(root, 'packages', projectName, 'src', 'index.ts');
    if (fs.existsSync(entry)) {
        return entry;
    }
}

/**
 * 根据项目名称分析项目类型
 * @param projectName
 */
function analysisHtml(projectName, config) {
    const html = config?.htmlTemplate || path.resolve(root, 'packages', projectName, 'public', 'index.html');
    if (fs.existsSync(html)) {
        return html;
    } else {
        return null;
    }
}
