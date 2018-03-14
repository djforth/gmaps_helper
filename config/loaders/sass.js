const ExtractTextPlugin = require('extract-text-webpack-plugin');

const { getIfUtils, removeEmpty } = require('webpack-config-utils');

const { resolve } = require('path');

const includePaths = () => {
  let paths = ['node_modules', resolve('src', 'images'), resolve('src', 'stylesheets')];
  return removeEmpty(paths);
};

module.exports = env => {
  const { ifDevelopment } = getIfUtils(env);
  const extract = {
    fallback: 'style-loader',
    use: [
      {
        loader: 'css-loader',
        options: {
          minimize: false,
          sourceMap: true,
        },
      },
      'resolve-url-loader',
      {
        loader: 'postcss-loader',
        options: { sourceMap: true },
      },
      {
        loader: 'sass-loader',
        options: {
          includePaths: includePaths(),
          outputStyle: 'extended',
          sourceMap: true,
          sourceComments: ifDevelopment(),
        },
      },
    ],
  };
  return {
    test: /\.(scss|sass|css)(\.erb)?$/i,
    use: ['css-hot-loader'].concat(ExtractTextPlugin.extract(extract)),
  };
};
