import * as fs from 'fs';
import * as path from "path";
import * as process from "process";

const root = process.cwd();

enum ProjectType {
    Application,
    Lib,
}

export function isApplication(project) {
    return project.type === ProjectType.Application;
}

export function isLib(project) {
    return project.type === ProjectType.Lib;
}

/**
 * 判断项目入口是否存在，如果存在则返回入口，否则返回undefined;
 * @param projectName
 */
function analysisEntry(projectName) {
    const entry = path.resolve(root, 'packages', projectName, 'src', 'index.ts');
    if (fs.existsSync(entry)) {
        return entry;
    }
}

/**
 * 根据项目名称分析项目类型
 * @param projectName
 */
function analysisType(projectName) {
    const html = path.resolve(root, 'packages', projectName, 'public', 'index.html');
    if (fs.existsSync(html)) {
        return {
            type: ProjectType.Application,
            htmlTemplate: html,
        };
    } else {
        return {
            type: ProjectType.Lib
        };
    }
}

function readProjectConfig(project) {
    const {name} = project;
    const entry = analysisEntry(name);
    if (!entry) return null;
    const type = analysisType(name);
    return {
        name,
        entry,
        ...type
    };
}

/**
 * 扫描根路径下的所有项目
 * @param projectRootPath
 */
export default function scanProject(projectRootPath?) {
    if (!projectRootPath) {
        projectRootPath = path.resolve(process.cwd(), 'packages');
    }
    const projects = fs.readdirSync(projectRootPath, {withFileTypes: true}).filter(dir => dir.isDirectory());
    return projects.map(readProjectConfig).filter(i => i);
}