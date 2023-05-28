import webpack, {Configuration} from "webpack";
import WebpackDevServer from "webpack-dev-server";
import path from "path";
import {OUTPUT_DIRECTORY_DEFAULT} from "../const";
import log from "./log";
import process from "process";

const runServer = async (server, name = '') => {
    await server.start();
};

export async function server(config: Configuration[], {port, rootPath}) {
    const compiler = webpack(config);
    const server = new WebpackDevServer({
        port: port,
        hot: true,
        static: path.resolve(rootPath, OUTPUT_DIRECTORY_DEFAULT),// 暂不支持用户指定输出目录
    }, compiler);
    try {
        await runServer(server);
    } catch (e) {
        log.error('start applications unify stop by error', e);
        process.exit(2);
    }
}