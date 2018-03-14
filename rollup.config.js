// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: 'src/module/index.js',
  name: 'GoogleMapHelper',
  sourcemap: true,
  plugins: [
    resolve({
      browser: true,
      extensions: ['.js'],
    }),
    commonjs(),
    babel({
      exclude: 'node_modules/**', // only transpile our source code
      // , externalHelpers: true
      plugins: ['external-helpers']
      // , runtimeHelpers: true
    }),
    replace({
      ENVIRONMENT: JSON.stringify(process.env.NODE_ENV),
    }),
    uglify(),
  ],
  external: ['lodash/partial'],
  output: {
    file: 'index.js',
    format: 'umd',
  },
};
