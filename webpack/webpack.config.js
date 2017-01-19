var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
/* eslint-disable */

var PATHS = {
  src: path.resolve(__dirname + '/../src')
  , dist: path.resolve(__dirname + '/../assets/')
};

var plugins = [
  new webpack.optimize.DedupePlugin()
  , new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/)
  , new ExtractTextPlugin('assets/application.css', {allChunks: false})
]

if(process.env.NODE_ENV === 'production'){
  let prod = [
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
      comments: false,
      sourceMap: false,
      mangle: true,
      minimize: true
    })
    , new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ];
  plugins = plugins.concat(prod)
}

/* eslint-enable */
module.exports = {
  context: PATHS.src
  , devtool: (process.env.NODE_ENV === 'production') ? '' : 'inline-source-map'

  , entry: {
     application: ['./application.js']
  }

  , resolve: {
    modulesDirectories: ['stylesheets', 'images', 'node_modules', 'bower_components']
    , extensions: ['', '.js', '.jsx', '.css', '.scss', 'jpg', 'png', 'gif']
  }

  , plugins: plugins

  , output: {
    path: PATHS.dist // Save to Rails Asset Pipeline
    , publicPath: '/assets/' // Required for webpack-dev-server
    , filename: 'bundle.js'
  }

  , module: {
    preloaders: [{
      test: /\.scss/
      , loader: 'import-glob-loader'
    }]
    , loaders: [{
      test: /\.js|.jsx$/
      , loaders: ['babel']
      , include: PATHS.src
    },  {
        test: /\.scss|.css$/,
        loader: ExtractTextPlugin.extract('style-loader', ['css?sourceMap', 'sass?sourceMap', 'sass?import-glob!'])
    }
    , { test: /\.(png|jpg|gif)$/, loader: "file-loader?emitFile=false&name=[path][name].[ext]" }
    ]
  }
  ,  sassLoader: {
    includePaths: [path.resolve(__dirname, '../bower_components'), path.resolve(__dirname, '../stylesheets'), path.resolve(__dirname, '../assets'), path.resolve(__dirname, '../images')]
  }
}
