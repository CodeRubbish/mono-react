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

const {ModuleFederationPlugin} = webpack.container;
/**
 * 读取项目的webpack的配置文件
 * @param runs 需要运行的应用
 * @param serveConfig 用户设置的配置
 * @param all 所有应用
 * @param isProd
 * @param ports
 */
export default function readWebpackConfigFromProject(runs: Project[], serveConfig, all, isProd, ports) {
    const webpackConfigs = [];
    const remotes = {};

    runs.forEach((project, index) => {
        const wpc = readWebpackConfig(project, remotes, serveConfig[project.name], isProd, ports[index] || ports[0], ports.length === 1);
        webpackConfigs.push(wpc);
    });
    console.log('remotes', remotes);
    return webpackConfigs;
}

function readWebpackConfig(project: Project, remotes, config, isProd, port, unify): Configuration {
    const commonConfig = getCommonCfg(isProd)(project.projectRootPath);
    const configFilePath = config?.webpack;
    const isRootApp = Boolean(config?.root && project.isApplication());
    const mfp: any = {
        name: project.name,
        remotes: remotes,
        filename: 'remoteEntry.js',
    };
    const exposes = readExposesFromProject(project);
    if (exposes) {
        mfp.exposes = exposes;
        const remotePath = isRootApp ? `http://localhost:${port}/remoteEntry.js` : `http://localhost:${port}/${project.name}/remoteEntry.js`;
        remotes[project.name] = `${project.name}@${remotePath}`;
    }
    const shared = readSharedFromRoot();
    if (remotes) {
        mfp.shared = shared;
    }
    const webpackConfig: Configuration = {
        entry: project.entry,
        output: {
            path: unify && !isRootApp ? path.resolve(process.cwd(), 'dist', project.name) : path.resolve(project.projectRootPath, 'dist'),
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