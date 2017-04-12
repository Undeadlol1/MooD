var nodeExternals = require('webpack-node-externals');
var path = require('path')
var nodeExternals = require('webpack-node-externals');

// TODO rework this to work with common.config.js
// TODO or export serverConfig from targets?
// module.exports = {
//   target: 'node', // in order to ignore built-in modules like path, fs, etc. 
//   externals: [nodeExternals()], // in order to ignore all modules in node_modules folder 
//   devtool: "cheap-module-source-map", // faster than 'source-map' 
//   node: {
//         __filename: true,
//         __dirname: true 
//     },
//   context: path.resolve(__dirname, '../'),
//   module : {
//         loaders: [
//             { 
//                 test   : /.jsx?$/,
//                 loader : 'babel-loader',
//                 exclude: /node_modules/,
//             },
//         ],
//     },
// };

module.exports = {
    entry: ['babel-polyfill', path.resolve('mocha!', __dirname, '../', 'src/server/test/entry.js')],
    target: 'node',  
    context: path.resolve(__dirname, '../'),
    node: {
        __filename: true,
        __dirname: true 
    },
    output: {
        filename: 'tests.js',
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