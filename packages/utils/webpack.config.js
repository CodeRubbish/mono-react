const {ModuleFederationPlugin} = require('webpack').container;
module.exports = {
    entry: './index.js',
    mode: "development",
    output: {
        clean: true,
        chunkFilename: "chunk.[contenthash:8].js",
        filename: "[name].js",
    },
    plugins: [
        new ModuleFederationPlugin({
            name: 'utils',
            filename: 'remoteEntry.js',
            exposes: {
                'export': './index.js',
            }
        })
    ]
}