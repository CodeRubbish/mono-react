import Project from "../project";
import webpack, {Configuration} from "webpack";
import log from "./log";
import {getCommonCfg} from "../config";
import {merge} from "webpack-merge";
import readSharedFromRoot from "./readSharedFromRoot";
import readExposesFromProject from "./readExposesFromProject";

const {ModuleFederationPlugin} = webpack.container;
/**
 * 读取项目的webpack的配置文件
 * @param runs 需要运行的应用
 * @param serveConfig 用户设置的配置
 * @param all 所有应用
 * @param isProd
 */
export default function readWebpackConfigFromProject(runs: Project[], serveConfig, all, isProd) {
    const webpackConfigs = [];
    const remotes = {};

    runs.forEach(project => {
        let wpc;
        if (project.isApplication()) {
            wpc = readAppWebpackConfig(project, remotes, serveConfig[project.name]?.webpack, isProd);
        } else if (project.isLibrary()) {
            wpc = readLibWebpackConfig(project, remotes, serveConfig[project.name]?.webpack, isProd);
        } else {
            log.error('incorrect application type,this is internal error,issue please');
            process.exit(2);
        }
        webpackConfigs.push(wpc);
    });
    return webpackConfigs;
}

function readAppWebpackConfig(project, remotes, configFilePath, isProd): Configuration {
    const commonConfig = getCommonCfg(isProd);
    const mfp: any = {
        name: project.name,
        remotes: remotes
    };
    const exposes = readExposesFromProject(project);
    if (exposes) {
        mfp.exposes = exposes;
    }
    const shared = readSharedFromRoot();
    if (remotes) {
        mfp.shared = shared;
    }
    return merge(commonConfig, {plugins: [new ModuleFederationPlugin(mfp)]});
}

function readLibWebpackConfig(project, remotes, configFilePath, isProd): Configuration {
    const commonConfig = getCommonCfg(isProd);
    const mfp: any = {
        name: project.name,
        remotes: remotes
    };
    const exposes = readExposesFromProject(project);
    if (exposes) {
        mfp.exposes = exposes;
    }
    const shared = readSharedFromRoot();
    if (remotes) {
        mfp.shared = shared;
    }
    return merge(commonConfig, {plugins: [new ModuleFederationPlugin(mfp)]});
}