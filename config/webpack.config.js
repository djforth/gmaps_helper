/* eslint-env node */
const { join, resolve } = require('path');
const { readdirSync } = require('fs');
const webpack = require('webpack');
const extname = require('path-complete-extname');
const { env } = require('process');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { getIfUtils, removeEmpty } = require('webpack-config-utils');

const { ifProduction } = getIfUtils(env.NODE_ENV);

const dist = resolve('public');

const {
  EnvironmentPlugin,
  ContextReplacementPlugin,
  HotModuleReplacementPlugin,
  LoaderOptionsPlugin,
  NamedModulesPlugin,
  optimize,
} = webpack;

const rules = removeEmpty(
  readdirSync(resolve(__dirname, 'loaders'), 'utf8').map(file => {
    if (extname(file) === '.js') {
      const loader = require(join(resolve(__dirname, 'loaders'), file));

      if (typeof loader === 'function') {
        return loader(env.NODE_ENV);
      }

      return loader;
    }
  })
);

const config = {
  devtool: ifProduction('source-map', 'eval'),
  entry: {
    application: resolve('src', 'application.js'),
  },

  output: {
    filename: ifProduction('[name]-[hash].js', '[name].js'),
    chunkFilename: '[name].bundle.js',
    path: resolve('public'),
    pathinfo: true,
    publicPath: '/',
  },

  module: {
    rules,
  },

  plugins: [
    new ExtractTextPlugin({
      filename: ifProduction('[name]-[hash].css', '[name].css'),
      allChunks: true,
    }),
    new LodashModuleReplacementPlugin({
      currying: true,
    }),
    new EnvironmentPlugin(JSON.parse(JSON.stringify(env))),
    new ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
    new LoaderOptionsPlugin(
      ifProduction(
        {
          minimize: true,
          debug: false,
        },
        {
          debug: true,
        }
      )
    ),
    new HtmlWebpackPlugin({
      pins1: JSON.stringify({
        pins: [
          {
            id: 1,
            picture: '/map-pin.png',
            width: 21,
            height: 31,
            marker_anchor: [10, 25],
            // infowindow: 'Info Window',
            lat: 50.722273,
            lng: -1.873244,
          },
          {
            id: 2,
            picture: '/map-pin.png',
            width: 21,
            height: 31,
            marker_anchor: [10, 25],
            // infowindow: 'Info Window',
            lat: 51.5587,
            lng: -1.07548,
          },
        ],
      }),
      pins2: JSON.stringify({
        pins: {
          id: 1,
          // infowindow:
          //   "\u003cdiv class='details'>\u003ch3\u003eMy Info Window\u003c/h3\u003e\u003cp\u003eMy Address, Some Town. Postcode\u003c/p\u003e\u003c/div\u003e",
          lat: 50.722273,
          lng: -1.873244,
        },
        zoom: 16,
      }),
      title: 'Google maps',
      template: resolve('src', 'template.html'),
    }),
    new HotModuleReplacementPlugin(),
    new NamedModulesPlugin(),
  ],

  resolve: {
    extensions: ['.js', '.jsx', '.scss', '.css', '.png', '.svg', '.gif', 'jpeg', 'jpg'],
    alias: {
      images: resolve('packs', 'images'),
    },
    modules: [
      resolve('src', 'packs'),
      resolve('src', 'images'),
      resolve('src', 'stylesheets'),
      resolve('node_modules'),
    ],
  },

  resolveLoader: {
    modules: ['node_modules'],
  },

  stats: {
    cached: true,
    colors: true,
    errorDetails: true,
    errors: true,
  },

  devServer: {
    clientLogLevel: 'none',
    // , https: settings.dev_server.https
    // hot: true,
    host: 'localhost',
    port: 3000,
    // contentBase: output.path,
    hot: true,
    publicPath: '/',
    compress: false,
    contentBase: 'public',
  },
};

console.log('config', config.output);

module.exports = config;
