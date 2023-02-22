import * as path from "path";
import * as process from "process";
import * as fs from "fs";
import chalk from "chalk";
import scanProject from "./scanProject";

const cwd = process.cwd();
const DEFAULT_CONFIG = 'monorepo-tools.config.js';
const DEFAULT_ROOT_DIR = 'packages';
export default function serve(options) {
    const {unify, prod, project, config} = options;
    const serveConfig = readConfig(config);
    const rootPath = serveConfig.rootDir || DEFAULT_ROOT_DIR;
    const projects = scanProject(rootPath);
};

function readConfig(config?) {
    // 尝试读取指定配置文件
    if (config) {
        const config_file_path = path.resolve(cwd, config);
        if (!fs.existsSync(config_file_path)) {
            console.log(chalk.bgRed.black(' error : ') + chalk.bgRed.black(`the config file ${config} does not exist`));
            process.exit(2);
        }
    } else {
        // 尝试读取默认配置文件
        const config_file_path = path.resolve(cwd, DEFAULT_CONFIG);
        if (fs.existsSync(path.resolve(cwd, DEFAULT_CONFIG))) {
            // 如果默认文件存在，则读取返回默认文件
            return require(config_file_path);
        }
    }
    return {};
}