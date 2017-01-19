var path = require('path');
var webpack = require('webpack');
// var ExtractTextPlugin = require('extract-text-webpack-plugin');
// var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

var devFlagPlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false'))
});

/* eslint-disable */
var PATHS = {
  src: path.resolve(__dirname + '/../dummy')
  , dist: path.resolve(__dirname + '/../assets/javascripts')
};

/* eslint-enable */
module.exports = {
  context: PATHS.src
  , devtool: 'inline-source-map'
  , entry: {
    application: [
      'webpack-dev-server/client?http://localhost:3001'
      // , 'webpack-hot-middleware/client'
      , 'webpack/hot/only-dev-server'
      , './application.js'
    ]
  }

  // entry: ['babel-polyfill', path.join(PATHS.src, '/app.js')]

  , resolve: {
    modulesDirectories: ['stylesheets', 'images', 'node_modules', 'bower_components']
    , extensions: ['', '.js', '.jsx', '.css', '.scss', 'jpg', 'png', 'gif']
  }

  , plugins: [
    new webpack.optimize.OccurenceOrderPlugin()
    , new webpack.HotModuleReplacementPlugin()
    , new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/)
    // , new ExtractTextPlugin('assets/application.css', {allChunks: false})
    , new webpack.NoErrorsPlugin()
    , devFlagPlugin
  ]

  , output: {
    path: PATHS.dist
    , publicPath: 'http://localhost:3001/' // Required for webpack-dev-server
    , filename: 'assets/[name].js'
  }

  , module: {
    // preloaders: [{
    //   test: /\.scss/,
    //   loader: 'import-glob-loader'
    // }]
    loaders: [{
      test: /\.js|.jsx$/
      , loaders: ['babel']
      , include: PATHS.src
    }
    // ,  {
    //     test: /\.scss|.css$/,
    //     loader: ExtractTextPlugin.extract('style-loader', ['css?sourceMap', 'sass?sourceMap', 'sass?import-glob!'])
    // }
    // , { test: /\.(png|jpg|gif)$/, loader: "file-loader?emitFile=false&name=[path][name].[ext]" }
    ]
  }
  // ,  sassLoader: {
  //   includePaths: [path.resolve(__dirname, '../bower_components'), path.resolve(__dirname, '../stylesheets'), path.resolve(__dirname, '../assets'), path.resolve(__dirname, '../images')]
  // }
};