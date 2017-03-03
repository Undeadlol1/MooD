var path = require('path');

module.exports = {
    name: 'server',
    target: 'node',
    context: __dirname,
    node: {
        __filename: true,
        __dirname: true
    },
    entry  : './src/server/index.js',
    watch: true,
    devtool: 'source-map',
    output : {
        path     : 'dist',
        filename : 'server.js',
        publicPath: '' // github issue
        // publicPath: __dirname + '/public/'
    },
    module : {
        loaders: [ { 
                test   : /.js$/,
                loader : 'babel-loader' 
            } 
        ]
    }
};
 