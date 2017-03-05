var path = require('path');
var webpack = require('webpack');

module.exports = {
    name: 'server',
    target: 'node',
    context: __dirname,
    node: {
        __filename: true,
        __dirname: true
    },
    entry  : {
        browser: './src/browser/app.jsx',
        server: './src/server/server.js',
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        })
    ],
    watch: true,
    devtool: 'source-map',
    output : {
        path     : 'dist',
        filename : '[name].js',
        publicPath: '' // github issue
        // publicPath: __dirname + '/public/'
    },
    module : {
        loaders: [ { 
                test   : /.jsx?$/,
                loader : 'babel-loader' 
            } 
        ]
    }
};
 