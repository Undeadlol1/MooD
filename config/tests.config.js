var nodeExternals = require('webpack-node-externals');
var path = require('path')

var clientConfig = {
    target: 'web',
    entry: [path.resolve('mocha!', __dirname, '../', 'src/browser/test/entry.js')],
    output : {
        publicPath: '/',
        filename: 'client.test.js',        
        path     : path.join(__dirname, '..', 'dist')        
    },
};

var serverConfig = {
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
        ]
    },
    externals: [nodeExternals()],
};

module.exports = [clientConfig, serverConfig]