import Project from "../project";
import path from "path";
import fs from "fs";
import {DEFAULT_BUILD_ENV, DEFAULT_SERVE_ENV, ENV_DEV, ENV_PROD, ENVIRONMENT_DEFAULT} from "../const";

/**
 * 读取当前项目的环境变量配置
 * @param project
 * @param env
 * @param isBuild
 */
export function readEnvFromProject(project: Project, env: string, isBuild: boolean): Record<string, any> {
    const environment_path = path.resolve(project.projectRootPath, ENVIRONMENT_DEFAULT);
    const DEFAULT_ENV = isBuild ? DEFAULT_BUILD_ENV : DEFAULT_SERVE_ENV;
    if (!fs.existsSync(environment_path)) {
        return DEFAULT_ENV;
    }
    const environment = require(environment_path);
    if (environment[env]) {
        return environment[env];
    }
    const useEnv = isBuild ? ENV_PROD : ENV_DEV;
    return environment[useEnv] || environment[ENV_DEV] || DEFAULT_ENV;
}