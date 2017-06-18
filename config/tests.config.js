var webpack = require('webpack');
var WebpackShellPlugin = require('webpack-shell-plugin');
var nodeExternals = require('webpack-node-externals');
var path = require('path')
var commonConfig = require('./common.config.js')
var merge = require('webpack-merge');
var config = require('../config.js')
var extend = require('lodash/assignIn')

const serverVariables =  extend({
                            BROWSER: false,
                            isBrowser: false,
                            SERVER: true,
                            isServer: true,
                        }, config)

const clientVariables =  extend({
                            BROWSER: true,
                            isBrowser: true,
                            SERVER: false,
                            isServer: false,
                        }, config)

var clientConfig =  merge(commonConfig, {
    // copy+paste from
    // https://semaphoreci.com/community/tutorials/testing-react-components-with-enzyme-and-mocha
    externals: {
        "jsdom": "window",
        "cheerio": "window",
        "react/addons": 'react',
        "react/lib/ReactContext": 'react',
        "react/lib/ExecutionEnvironment": 'react',
    },
    target: 'web',
    // TODO do wee need mocha!?
    entry: ['babel-polyfill', path.resolve('mocha!', __dirname, '../', 'src/browser/test/browser.tests.entry.js')],
    output : {
        publicPath: '/',
        filename: 'client.test.js',
        path     : path.join(__dirname, '..', 'dist')
    },
    plugins: [
        new webpack.EnvironmentPlugin(clientVariables),
        new WebpackShellPlugin({
            onBuildEnd: "mocha dist/*.test.js --opts ./mocha.opts" //onBuildEnd //onBuildExit
        }),
    ],
    // nodeExternals required for client because some modules throw errors otherwise
    externals: [nodeExternals({
        whitelist: ['webpack/hot/dev-server', /^lodash/, 'react-router-transition/src/presets']
    })],
});

var serverConfig =   merge(commonConfig, {
    target: 'node',
    // TODO do wee need mocha!?
    entry: ['babel-polyfill', path.resolve('mocha!', __dirname, '../', 'src/server/test/server.tests.entry.js')],
    node: {
        __filename: true,
        __dirname: true
    },
    output: {
        filename: 'server.test.js',
        path     : path.join(__dirname, '..', 'dist'),
        libraryTarget: "commonjs", // ????
    },
    plugins: [
        new webpack.EnvironmentPlugin(serverVariables),
    ],
    // this is important. Without nodeModules in "externals" bundle will throw and error
    // bundling for node requires modules not to be packed on top of bundle, but to be found via "require"
    externals: [nodeExternals({
        whitelist: ['webpack/hot/dev-server', /^lodash/, 'react-router-transition/src/presets']
    })],
});

module.exports = [clientConfig, serverConfig]