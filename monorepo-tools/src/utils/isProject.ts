import fs from "fs";
import path from "path";
import {PACKAGE_JSON} from "../const";

/**
 * 根据项目是否包含package.json判断是否为项目
 * @param dir
 * @param projectRootPath
 */
export default function isProject(dir: fs.Dirent, projectRootPath: string) {
    const package_json_path = path.resolve(projectRootPath, dir.name, PACKAGE_JSON);
    return fs.existsSync(package_json_path);
}