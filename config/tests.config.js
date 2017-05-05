var webpack = require('webpack');
var WebpackShellPlugin = require('webpack-shell-plugin');
var nodeExternals = require('webpack-node-externals');
var path = require('path')

var clientConfig = {
    watch: true,    
    devtool: 'cheap-module-source-map',
    target: 'web',
    entry: [path.resolve('mocha!', __dirname, '../', 'src/browser/test/entry.js')],
    output : {
        publicPath: '/',
        filename: 'client.test.js',        
        path     : path.join(__dirname, '..', 'dist')        
    },
};

var serverConfig =  {
    watch: true,
    devtool: 'cheap-module-source-map',
    target: 'node',  
    entry: ['babel-polyfill', path.resolve('mocha!', __dirname, '../', 'src/server/test/entry.js')],
    context: path.resolve(__dirname, '../'),
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
            onBuildEnd: "mocha dist/*.test.js --no-exit --watch" //onBuildEnd //onBuildExit
        }),
    ],
    externals: [nodeExternals()],
};

module.exports = [clientConfig, serverConfig]