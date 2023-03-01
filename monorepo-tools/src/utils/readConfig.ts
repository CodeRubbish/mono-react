import path from "path";
import fs from "fs";
import process from "process";
import log from "./log";
import {ROOT_PATH} from "../const";

const DEFAULT_CONFIG = 'monorepo-tools.config.js';
export default function readConfig(config?) {
    // 尝试读取指定配置文件
    if (config) {
        const config_file_path = path.resolve(ROOT_PATH, config);
        if (!fs.existsSync(config_file_path)) {
            log.error(`the config file ${config} does not exist`);
            process.exit(2);
        }
    } else {
        // 尝试读取默认配置文件
        const config_file_path = path.resolve(ROOT_PATH, DEFAULT_CONFIG);
        if (fs.existsSync(path.resolve(ROOT_PATH, DEFAULT_CONFIG))) {
            // 如果默认文件存在，则读取返回默认文件
            return require(config_file_path);
        }
    }
    return {};
}