var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin')
var WebpackNotifierPlugin = require('webpack-notifier');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

var isDevelopment = process.env.NODE_ENV === "development"

var extractSass = new ExtractTextPlugin({
    filename: "styles.css",
    disable: isDevelopment // TODO
});

const developmentPlugins = isDevelopment ? [
    // new WebpackNotifierPlugin({alwaysNotify: false}),
    new FriendlyErrorsWebpackPlugin(),
] : []

var baseConfig = {
    context: path.resolve(__dirname, '../'),
    devtool: 'cheap-module-source-map',
    watch: isDevelopment,
    module : {
        loaders: [
            {
                test: /\.json$/,
                use: 'json-loader'
            },
            {
                test: /\.xml$/,
                loader: 'xml-loader'
            },
            { 
                test   : /.jsx?$/,
                loader : 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(svg|png|ico)$/,
                loader: "file-loader"
            },
            { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
            { test: /\.(ttf|eot|svg|png|ico)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" },
            {
                test: /\.css$/,
                include: path.resolve(__dirname, '../', 'node_modules'), // oops, this also includes flexboxgrid
                loader: 'style-loader!css-loader?modules',
            },
            {
                test: /\.scss$/,
                use: extractSass.extract({
                    use: [
                        { loader: "css-loader", },
                        { loader: "sass-loader" }
                    ],
                    fallback: "style-loader"
                })
            },
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
        alias: {
            browser: path.join(__dirname, '/../', 'src/browser/'),
            server : path.join(__dirname, '/../', 'src/server/'),
        },
        enforceModuleExtension: false,
        extensions: ['.js', '.jsx'],
    }
};

module.exports = baseConfig
 