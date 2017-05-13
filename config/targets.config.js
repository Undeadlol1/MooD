var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin')
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var WebpackNotifierPlugin = require('webpack-notifier');
var HtmlWebpackPlugin = require('html-webpack-plugin');
// TODO webpack-build-notifier (seems better tgeb webpack-notifier)
var merge = require('webpack-merge');
const BabiliPlugin = require('babili-webpack-plugin');
var nodeExternals = require('webpack-node-externals');

var commonConfig = require('./common.config.js')

// https://survivejs.com/webpack/optimizing/minifying/#enabling-a-performance-budget

// const productionConfig = merge([

//   {
//     performance: {
//       hints: 'warning', // 'error' or false are valid too
//       maxEntrypointSize: 100000, // in bytes
//       maxAssetSize: 450000, // in bytes
//     },
//   },

//   ...
// ]);


const isDevelopment = process.env.NODE_ENV === 'development'

const clientProductionPlugins = isDevelopment ? [] : [
    new webpack.DefinePlugin({ // <-- key to reducing React's size
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    // new webpack.optimize.DedupePlugin(), //dedupe similar code 
    // new webpack.optimize.UglifyJsPlugin(), //minify everything
    new BabiliPlugin(),
    new webpack.optimize.AggressiveMergingPlugin()//Merge chunks 
]


var serverConfig = merge(commonConfig, {
    name: 'server',
    target: 'node',  
    node: {
        __filename: true,
        __dirname: true 
    },
    entry  : ['babel-polyfill', './src/server/server.js'],
    output : {
        path     : path.join(__dirname, '..', 'dist'),
        filename : 'server.js',
        libraryTarget: "commonjs",
    },
    plugins: [
        new webpack.DefinePlugin({ // <-- key to reducing React's size
            'process.env': {
                'BROWSER': false,
                'isBrowser': false,
                'SERVER': true,
                'isServer': true,
            }
        }),
    ],
    // this is important. Without nodeModules in "externals" bundle will throw and error
    // bundling for node requires modules not to be packed on top of bundle, but to be found via "require"
    externals: [nodeExternals({
        whitelist: ['jquery', 'webpack/hot/dev-server', /^lodash/, 'react-router-transition/src/presets']
    })],
});

var clientConfig = merge(commonConfig, {
    name: 'client',
    target: 'web',
    entry  : {
        'vendor.js': ['react', 'redux', 'react-redux', 'redux-form', 'material-ui'], // TODO MAKE SURE TREE SHAKING WORKS HERE
        'scripts.js': './src/browser/app.jsx',
        // 'styles.css': './src/browser/styles.scss',
    },
    output : {
        publicPath: '/',
        filename : '[name]',
        path     : path.join(__dirname, '..', 'dist', 'public'),
    },
    plugins: [ // TODO MAKE SURE PLUGINS ARE ACTUALLY INCLUDED IN CONFIG
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor.js',
        }),
        // TODO this will be overriden in production!!!
        new webpack.DefinePlugin({ // <-- key to reducing React's size
            'process.env': {
                'BROWSER': true,
                'isBrowser': true,
                'SERVER': false,
                'isServer': false,
            }
        }),
        ...clientProductionPlugins
    ],
    // resolving is currently disable due to wrong modules resolving on lunix machines (might be because of babel, but unlikely)
    // resolve: {
    //     alias: {
    //         pages       : path.join(__dirname, '/../', 'src/browser/pages/'),
    //         components  : path.join(__dirname, '/../', 'src/browser/components/'),
    //     },
    // }
});

module.exports = [serverConfig, clientConfig]
 