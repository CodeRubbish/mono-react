import Project from "../project";
import path from "path";
import {PACKAGE_JSON} from "../const";

/**
 * 读取当前项目的环境变量配置
 * @param project
 * @param env
 */
export function readEnvFromProject(project: Project, env: string) {
  const package_json_path = path.resolve(project.projectRootPath, project.name, PACKAGE_JSON);
  const packageJSON = require(package_json_path);
  if (packageJSON.env) {
    return packageJSON.env[env];
  }
}