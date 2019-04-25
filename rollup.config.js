// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import { uglify } from 'rollup-plugin-uglify';
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: 'src/module/index.js',

  plugins: [
    resolve({
      mainFields: ['jsnext:main', 'main'],
      browser: true,
      extensions: ['.js'],
    }),
    commonjs(),
    babel({
      exclude: 'node_modules/**', // only transpile our source code
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
    name: 'GoogleMapHelper',
    globals: {
      'lodash/partial': 'partial',
    },
    sourcemap: true,
  },
};
