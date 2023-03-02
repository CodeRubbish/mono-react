import Project from "../project";
import webpack, {Configuration} from "webpack";
import log from "./log";
import {getCommonCfg} from "../config";
import {merge} from "webpack-merge";
import readSharedFromRoot from "./readSharedFromRoot";
import readExposesFromProject from "./readExposesFromProject";
import path from "path";
import fs from "fs";
import HtmlWebpackPlugin from "html-webpack-plugin";
import {OUTPUT_DIRECTORY_DEFAULT, REMOTE_ENTRY, ROOT_PATH} from "../const";
import {IConfig, IProject} from "../types/interface";
// TODO: 合并读取webpack配置
const {ModuleFederationPlugin} = webpack.container;
/**
 * 读取项目的webpack的配置文件
 * @param buildProjects 需要运行的应用
 * @param serveConfig 用户设置的配置
 * @param all 所有应用
 * @param isProd
 * @param unify
 */
export default function readBuildWebpackConfigFromProject(buildProjects: Project[], serveConfig: IConfig, all, isProd, unify) {
    const webpackConfigs = [];
    const remotes = {};
    const remoteProjects = all.filter(project => !buildProjects.includes(project));
    remoteProjects.forEach(project => {
        // TODO 增加环境变量
        remotes[project.name] = `${project.name}@${path.resolve(serveConfig[project.name].deployUrl, REMOTE_ENTRY)}`; // 远端项目使用其部署地址
    });
    buildProjects.forEach((project) => {
        const wpc = readWebpackConfig(project, remotes, serveConfig[project.name], isProd, unify);
        webpackConfigs.push(wpc);
    });
    console.log('remotes', remotes);
    return webpackConfigs;
}

function readWebpackConfig(project: Project, remotes: Record<string, string>, config: IProject, isProd, unify): Configuration {
    const commonConfig = getCommonCfg(isProd)(project.projectRootPath);
    const configFilePath = config?.webpack;
    const isRootApp = Boolean(config?.root && project.isApplication());
    const shared = readSharedFromRoot();
    const mfp: any = {
        name: project.name,
        remotes: remotes,
        filename: REMOTE_ENTRY,
        shared,
    };
    const exposes = readExposesFromProject(project);
    if (exposes) {
        mfp.exposes = exposes;
        const remotePath = path.resolve(config.deployUrl, REMOTE_ENTRY);
        remotes[project.name] = `${project.name}@${remotePath}`;
    }
    const webpackConfig: Configuration = {
        entry: project.entry,
        output: {
            // 如果统一构建，则输出到根目录下。独立启动，输出到各自项目目录下
            path: unify ? path.resolve(ROOT_PATH, OUTPUT_DIRECTORY_DEFAULT, isRootApp ? './' : project.name)
                : path.resolve(project.projectRootPath, OUTPUT_DIRECTORY_DEFAULT),
            publicPath: unify && !isRootApp ? `/${project.name}/` : '/'
        },
        ...((project.isApplication() ? readAppWebpackCfg : readLibWebpackCfg)(project))
    };
    let customWebpackConfig = {};
    if (typeof configFilePath !== "undefined") {
        const customCfgPath = path.resolve(project.projectRootPath, configFilePath);
        if (!fs.existsSync(customCfgPath)) {
            log.warn(`config file${customCfgPath} for ${project.name} does not exist `);
        } else {
            customWebpackConfig = require(customCfgPath);
        }
    }

    return merge(commonConfig, webpackConfig, customWebpackConfig, {plugins: [new ModuleFederationPlugin(mfp)]});
}

function readAppWebpackCfg(project): Configuration {
    const config: Configuration = {
        plugins: [
            new HtmlWebpackPlugin({
                template: project.htmlTemplate
            }),
        ],
        resolve: {
            alias: project.alias ?? {}
        }
    };
    return config;
}

function readLibWebpackCfg(project) {
    const config: Configuration = {
        resolve: {
            alias: project.alias ?? {}
        }
    };
    return config;
}