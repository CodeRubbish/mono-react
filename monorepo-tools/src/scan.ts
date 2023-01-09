import * as fs from 'fs';
import * as path from "path";
import * as process from "process";

export default function scan(projectRootPath?) {
    if (!projectRootPath) {
        projectRootPath = path.resolve(process.cwd(), 'packages');
    }
    const projects = fs.readdirSync(projectRootPath, {withFileTypes: true});
    console.log(projects);
}