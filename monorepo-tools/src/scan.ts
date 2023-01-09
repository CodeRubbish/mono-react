import * as fs from 'fs';
import * as path from "path";
import * as process from "process";

const root = process.cwd();

function analysisEntry(projectName) {
    const entry = path.resolve(root, 'packages', projectName, 'src', 'index.ts');
    if (fs.existsSync(entry)) {
        return entry;
    }
}

function analysisType(projectName) {
    const html = path.resolve(root, 'packages', projectName, 'public', 'index.html');
    console.log(html);
    if (fs.existsSync(html)) {
        return {
            type: 'project',
            htmlTemplate: html,
        };
    } else {
        return {type: 'lib'};
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

export default function scan(projectRootPath?) {
    if (!projectRootPath) {
        projectRootPath = path.resolve(process.cwd(), 'packages');
    }
    const projects = fs.readdirSync(projectRootPath, {withFileTypes: true}).filter(dir => dir.isDirectory());
    return projects.map(readProjectConfig).filter(i => i);
}