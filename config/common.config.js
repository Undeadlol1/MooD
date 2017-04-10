var path = require('path');
var fs = require('fs');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin')
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var WebpackNotifierPlugin = require('webpack-notifier');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// TODO webpack-build-notifier (seems better tgeb webpack-notifier)
var extractSass = new ExtractTextPlugin({
    filename: "styles.css",
    // disable: process.env.NODE_ENV === "development" // TODO
});


var isDevelopment = process.env.npm_lifecycle_event == 'start'

const developmentPlugins = isDevelopment ? [
    new WebpackNotifierPlugin({alwaysNotify: false}),
    new webpack.DefinePlugin({ // TODO
            'process.env.NODE_ENV': JSON.stringify('development')
    }),
] : []

var baseConfig = {
    context: path.resolve(__dirname, '../'),
    devtool: 'cheap-module-source-map',
    watch: isDevelopment,
    module : {
        loaders: [
            { 
                test   : /.jsx?$/,
                loader : 'babel-loader',
                // query: {
                //     presets: [
                //         'es2015',
                //         'react'
                //     ],
                //     plugins: []
                // },

                
                // options: { 
                //     presets: [ 
                //         'es2015' 
                //     ] 
                // },
                exclude: /node_modules/,
            },
            { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
            { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" },
            {
                test: /\.css$/,
                include: path.resolve(__dirname, '../', 'node_modules'), // oops, this also includes flexboxgrid
                loader: 'style-loader!css-loader?modules',
            },
            {
                test: /\.scss$/,
                use: extractSass.extract({
                    use: [
                        { loader: "css-loader" },
                        { loader: "sass-loader" }
                    ],
                    fallback: "style-loader"
                })
            }
        ],
    },
    plugins: [
        // new BundleAnalyzerPlugin({analyzerMode: 'static',}), // TODO do not include this in production
        new CopyWebpackPlugin([{
            from: 'src/server/public',
            to: 'public'
        }]),
        new ExtractTextPlugin({
            filename: "styles.css",
            disable: isDevelopment // TODO check if this works properly
        }),
        ...developmentPlugins
    ],
    resolve: {
        enforceModuleExtension: false,
        extensions: ['.js', '.jsx'],
    }
};

module.exports = baseConfig
 