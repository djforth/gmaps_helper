const smartImport = require('postcss-smart-import');
const cssNext = require('postcss-cssnext');

module.exports = {
  plugins: [smartImport, cssNext],
};
