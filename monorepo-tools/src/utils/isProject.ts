import fs from "fs";
import path from "path";

const PACKAGEJSON = 'package.json';
/**
 * 根据项目是否包含package.json判断是否为项目
 * @param dir
 * @param projectRootPath
 */
export default function isProject(dir: fs.Dirent, projectRootPath: string) {
    const package_json_path = path.resolve(projectRootPath, dir.name, PACKAGEJSON);
    return fs.existsSync(package_json_path);
}