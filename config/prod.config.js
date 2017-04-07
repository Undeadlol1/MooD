var path = require('path');
var fs = require('fs');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin')
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var WebpackNotifierPlugin = require('webpack-notifier');
// TODO webpack-build-notifier (seems better tgeb webpack-notifier)
var extractSass = new ExtractTextPlugin({
    filename: "styles.css",
    // disable: process.env.NODE_ENV === "development"
});
var merge = require('webpack-merge');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');
var commonConfig = require('./common.config.js')

// this is important. Without nodeModules in "externals" bundle will throw and error
// bundling for node requires modules not to be packed on top of bundle, but to be found via "require"
var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(x => ['.bin'].indexOf(x) === -1)
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
});



const isDevelopment = process.env.npm_lifecycle_event === 'start'

const clientProductionPlugins = isDevelopment ? [] : [
    new webpack.DefinePlugin({ // <-- key to reducing React's size
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    // new webpack.optimize.DedupePlugin(), //dedupe similar code 
    new webpack.optimize.UglifyJsPlugin(), //minify everything
    new webpack.optimize.AggressiveMergingPlugin()//Merge chunks 
]



const serverConfig = merge(commonConfig, {
    // name: 'server',
    target: 'node',  
    node: {
        __filename: true,
        __dirname: true 
    },
    entry  : ['babel-polyfill', './src/server/server.js'],
    output : {
        path     : 'dist',
        filename : 'server.js',
        libraryTarget: "commonjs",
    },
    plugins: [],
    externals: [nodeModules],
});

const clientConfig = merge(commonConfig, {
    // name: 'client',
    target: 'web',
    entry  : { scripts: './src/browser/app.jsx', },
    output : {
        path     : 'dist/public',
        filename : '[name].js',
    },   
    plugins: [
        new BrowserSyncPlugin({ // TODO TRY THIS IN DEVELOPMENT CONFIG
            // browse to http://localhost:3000/ during development, 
            // ./public directory is being served 
            host: 'localhost',
            port: 3000,
            server: { baseDir: ['public'] }
        }),
        ...clientProductionPlugins
    ],
    resolve: {
        alias: {
            components  : path.join(__dirname, '/../', 'src/browser/components/'),
            pages       : path.join(__dirname, '/../', 'src/browser/pages/'),
        },
    }
});

module.exports = [serverConfig, clientConfig]