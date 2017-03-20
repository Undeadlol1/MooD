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


// this is important. Without nodeModules in "externals" bundle will throw and error
// bundling for node requires modules not to be packed on top of bundle, but to be found via "require"
var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(x => ['.bin'].indexOf(x) === -1)
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
});

var serverConfig = {
    name: 'server',
    target: 'node',  
    context: path.join(__dirname), // IMPORTANT this might be the reason of not being able to resolve files picking in express (leave to default)
    node: { // THIS IS THE MOTHER OF ALL EVIL
        __filename: true, // maybe set it to false for testing purposes (maybe static files picking and files to work with("sequilize/index") are colliding?)
        __dirname: true // ????  <<<<< this fucking shit causes sequilize non-importing error (false value)
    },
    entry  : { server: './src/server/server.js' },
    output : {
        libraryTarget: "commonjs", // ????
        path     : 'dist',
        filename : '[name].js',
        // publicPath: path.resolve(__dirname, '/public'), // github issue
        // publicPath: '/src/server/public/'
        // publicPath: '/server/public'
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        }),
        new webpack.DefinePlugin({ // ???? do we need this?
            $dirname: '__dirname', // ????
        }), // ????
        new CopyWebpackPlugin([{
            from: 'src/server/public',
            to: 'public'
        }]),
        new WebpackNotifierPlugin({alwaysNotify: false}),
    ],
    externals: [nodeModules],    
    // devtool: 'source-map',
    devtool: 'eval',
    watch: true,
    module : {
        loaders: [ { 
                test   : /.jsx?$/,
                loader : 'babel-loader',
            } 
        ],
    },
    resolve: {
    //    root: path.join(__dirname, "src/server"),
    //    modules: [
    //      path.join(__dirname, "src"),
    //      "node_modules"
    //    ],
    //    alias: {
    //        models: path.resolve(__dirname, '/src/server/data/models')
    //    }
  }
};

var clientConfig = {
    name: 'client',
    target: 'web',   
    context: path.join(__dirname), // IMPORTANT this might be the reason of not being able to resolve files picking in express (leave to default)
    entry  : {
        scripts: './src/browser/app.jsx',
        // styles: './src/browser/styles.scss',        
    },
    output : {
        // libraryTarget: "window", // ????
        path     : 'dist/public',
        filename : '[name].js',
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        }),
        new WebpackNotifierPlugin({alwaysNotify: false}),
        extractSass,
    ],   
    // devtool: 'source-map',
    devtool: 'eval',
    watch: true,
    module : {
        loaders: [
            { 
                test   : /.jsx?$/,
                loader : 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                include: /flexboxgrid/,
                // include: path.join(__dirname, 'node_modules'), // oops, this also includes flexboxgrid
                loader: 'style-loader!css-loader?modules',
                // exclude: /flexboxgrid/, // so we have to exclude it                
                // use: ExtractTextPlugin.extract({
                //     fallback: "style-loader",
                //     use: 'style-loader!css-loader?modules' // https://github.com/roylee0704/react-flexbox-grid
                // })
            },
            {
                test: /\.scss$/,
                // loader: 'style-loader!css-loader?sass-loader',
                // include: path.join(__dirname, 'node_modules'), // oops, this also includes flexboxgrid
                // exclude: /flexboxgrid/, // so we have to exclude it
                // include: /flexboxgrid/, // react-flexbox-grid dependency
                use: extractSass.extract({
                    use: [{
                        loader: "css-loader"                        
                    }, {
                        loader: "sass-loader"
                    }],
                    // use style-loader in development
                    fallback: "style-loader"
                })
            } 
        ],
    },
    resolve: {
        alias: {
            components  : __dirname + '/src/browser/components',
            pages       : __dirname + '/src/browser/pages',            
            // pages: '../components',
            // pages: './src/browser/pages',
            // redux: 'components/redux',
            // pages: 'components/common/utility',
        }, 
        enforceModuleExtension: false,
        extensions: ['.js', '.jsx']
    }
};

module.exports = [serverConfig, clientConfig]
 