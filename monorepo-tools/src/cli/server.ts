import path from "path";

const express = require('express');
const webpackDevMiddleware = require('webpack-dev-middleware');


export function server(compiler, port) {
    const app = express();
    // 告知 express 使用 webpack-dev-middleware，
    // 以及将 webpack.config.js 配置文件作为基础配置。
    console.log(path.resolve(process.cwd(), 'dist'));
    app.use(
        webpackDevMiddleware(compiler)
    );

    // 将文件 serve 到 port 3000。
    app.listen(port, function () {
        console.log('Example app listening on port 3000!\n');
    });

}