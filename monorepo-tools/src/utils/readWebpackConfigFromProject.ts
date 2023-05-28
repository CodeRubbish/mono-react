import webpack, {Configuration} from "webpack";
import path from "path";
import fs from "fs";
import HtmlWebpackPlugin from "html-webpack-plugin";
import Project from "../project";
import log from "./log";
import {getCommonCfg} from "../config";
import {merge} from "webpack-merge";
import readSharedFromRoot from "./readSharedFromRoot";
import readExposesFromProject from "./readExposesFromProject";
import {OUTPUT_DIRECTORY_DEFAULT, REMOTE_ENTRY, ROOT_PATH} from "../const";
import {IConfig, IProject} from "../types/interface";

interface IReadConfig {
    prod: boolean;
    ports?: number[];
    unify: boolean | number;
}

const {ModuleFederationPlugin} = webpack.container;
/**
 * 读取项目的webpack的配置文件
 * @param projects 需要运行的应用
 * @param serveConfig 用户设置的配置
 * @param allProject 所有应用
 * @param isBuild 构建模式下使用部署地址当作远端连接
 * @param prod
 * @param ports
 * @param unify
 */
export default function readWebpackConfigFromProject(projects: Project[], serveConfig: IConfig, allProject: Project[], isBuild: boolean, {
    prod,
    ports,
    unify
}: IReadConfig) {
    const webpackConfigs:Configuration[] = [];
    const remotes = {};
    const remoteProjects = allProject.filter(project => !projects.includes(project));
    remoteProjects.forEach(project => {
        // TODO 增加环境变量
        remotes[project.name] = `${project.name}@${path.join(serveConfig[project.name].deployUrl, REMOTE_ENTRY)}`; // 远端项目使用其部署地址
    });
    const rootProjectName: string | undefined = Object.keys((serveConfig || {})).find(projectName => {
        if (projects.find(item => item.name === projectName)) {
            if (serveConfig[projectName].root) {
                return true;
            }
        }
        return false;
    });
    projects.forEach((project, index) => {
        const config = serveConfig[project.name];
        // 从所有项目中读取webpack配置文件
        const wpc = readWebpackConfig(project, remotes, config, isBuild, {
            prod,
            port: isBuild ? undefined : typeof unify === 'number' ? unify : typeof unify === 'boolean' ? ports[0] : ports[index],
            unify,
            isRootApp: rootProjectName == project.name
        });
        webpackConfigs.push(wpc);
    });
    log.info('remotes', remotes);
    return webpackConfigs;
}

function readWebpackConfig(project: Project, remotes: Record<string, string>, config: IProject, isBuild, {
    prod,
    port,
    unify,
    isRootApp
}): Configuration {
    const commonConfig = getCommonCfg({prod, project, unify});
    const configFilePath = config?.webpack;
    const shared = readSharedFromRoot();
    const mfp: any = {
        name: project.name,
        remotes: remotes,
        filename: REMOTE_ENTRY,
        shared
    };
    const exposes = readExposesFromProject(project);
    if (exposes) {
        mfp.exposes = exposes;
        let remotePath;
        if (isBuild) {
            remotePath = `${config.deployUrl}/${REMOTE_ENTRY}`;
        } else {
            remotePath = `http://localhost:${port}/${isRootApp ? '' : project.name + '/'}${REMOTE_ENTRY}`;
        }
        remotes[project.name] = `${project.name}@${remotePath}`;
    }
    const webpackConfig: Configuration = {
        entry: project.entry,
        context: project.projectRootPath,
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