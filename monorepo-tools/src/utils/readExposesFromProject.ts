import path from "path";
import fs from "fs";
import Project from "../project";
import log from "./log";

/**
 * 以每个项目的exposes为基准读取共享文件
 * @param project
 */
export default function readExposesFromProject(project: Project) {
    const exposes = path.resolve(project.projectRootPath, 'exposes');
    const res = {};
    if (fs.existsSync(exposes)) {
        const files = fs.readdirSync(exposes, {withFileTypes: true});
        files.forEach(file => {
            if (!file.isFile()) return log.warn(`exposes will only scan for file,${file.name} will be ignore`);
            res[`./${file.name.split('.')[0]}`] = `./exposes/${file.name}`;
        });
        return res;
    }
    return null;
}