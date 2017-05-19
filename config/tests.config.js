var path = require('path')
var webpack = require('webpack');
var merge = require('webpack-merge');
var commonConfig = require('./common.config.js')
var nodeExternals = require('webpack-node-externals');
var WebpackShellPlugin = require('webpack-shell-plugin');

var stats = {
    hash: false,
    chunks: false,
    modules: false,
    version: false,
    children: false,
};

var clientConfig =  merge(commonConfig, {
    watch: true,    
    devtool: 'cheap-module-source-map',
    target: 'web',
    entry: [path.resolve('mocha!', __dirname, '../', 'src/browser/test/entry.js')],
    output : {
        publicPath: '/',
        filename: 'client.test.js',        
        path     : path.join(__dirname, '..', 'dist')        
    },
    stats
});

var serverConfig =   merge(commonConfig, {
    watch: true,
    devtool: 'cheap-module-source-map',
    target: 'node',  
    entry: ['babel-polyfill', path.resolve('mocha!', __dirname, '../', 'src/server/test/entry.js')],
    node: {
        __filename: true,
        __dirname: true 
    },
    output: {
        filename: 'server.test.js',
        path     : path.join(__dirname, '..', 'dist'),
        libraryTarget: "commonjs", // ????
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loaders: ['babel-loader'],
                exclude: /node_modules/,                
            }
        ],
    },
    plugins: [
        new WebpackShellPlugin({
            onBuildEnd: "mocha dist/*.test.js --opts ./mocha.opts" //onBuildEnd //onBuildExit
        }),
    ],
    // this is important. Without nodeModules in "externals" bundle will throw and error
    // bundling for node requires modules not to be packed on top of bundle, but to be found via "require"
    externals: [nodeExternals({
        whitelist: ['jquery', 'webpack/hot/dev-server', /^lodash/, 'react-router-transition/src/presets'] // TODO remove jquery
    })],
    stats
});

module.exports = [clientConfig, serverConfig]