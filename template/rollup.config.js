import { rollup } from 'rollup';

// Rollup plugins
import vue from 'rollup-plugin-vue';
import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import uglify from 'rollup-plugin-uglify';
import { minify } from 'uglify-js-harmony';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import livereload from 'rollup-plugin-livereload'
import serve from 'rollup-plugin-serve'
import visualizer from 'rollup-plugin-visualizer';
import postcss from 'rollup-plugin-postcss';

// PostCSS plugins
import cssnano from 'cssnano';
import cssnext from 'postcss-cssnext';
import cssimport from 'postcss-smart-import';
import csssorting from 'postcss-sorting';
import cssutilities from 'postcss-utilities';

// Plugin options
const plugins = [
  vue({
    css: './src/app.css'
  }),
  json(),
  babel({
    exclude: 'node_modules/**',
  }),
  eslint(
    exclude: [ 'src/assets/styles/**' ]
  ),
  uglify({}, minify)
  commonjs(),
  resolve({
    jsnext: true,
    main: true,
    browser: true,
  }),
  Visualizer(),
  postcss({
    plugins: [
      cssnext({
        warnForDuplicates: false,
        browsers: [
          '> 1%',
          'last 2 versions',
          'not ie <= 8'
        ]
      }),
      cssnano(),
      cssimport(),
      csssorting(),
      cssutilities()
    ],
    sourceMap: true,
    extensions: [ '.css' ],
    extract: './dist/app.min.css'
  })
]

const config = {
  entry: './src/app.js',
  dest: './dist/app.min.js',
  sourceMap: true,
  format: 'IIFE',
  plugins: plugins
}

const isProduction = process.env.NODE_ENV === 'production'
const isDevelopment = process.env.NODE_ENV === 'development'

if (isProduction) {
  config.sourceMap = false
  config.plugins.push(uglify({}, minify))
}

if (isDevelopment) {
  config.plugins.push(livereload())
  config.plugins.push(serve({
    contentBase: './dist/',
    port: 8080,
    open: true
  }))
}

export default config
