const webpackConfigUtils = require('webpack-config-utils');
const { getIfUtils, removeEmpty } = webpackConfigUtils;

module.exports = env => {
  const { ifProduction } = getIfUtils(env);
  return {
    test: /\.(jpg|jpeg|png|gif|svg|eot|ttf|woff|woff2)$/i,
    use: removeEmpty([
      {
        loader: 'file-loader',
        options: {
          limit: 1000,
          output: 'packs',
          name: ifProduction('[path][name]-[hash].[ext]', '[path][name].[ext]'),
        },
      },

      ifProduction({
        loader: 'img-loader',
        options: {
          output: 'packs',
          name: '[name]-[hash].[ext]',
        },
      }),
    ]),
  };
};
