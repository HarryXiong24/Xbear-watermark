// rollup.config.js
import { resolve } from 'path';
import babel from 'rollup-plugin-babel';
import noderesolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import html from 'rollup-plugin-generate-html-template';
import postcss from 'rollup-plugin-postcss';
import cssnano from 'cssnano';
import cssnext from 'postcss-cssnext';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

import { uglify } from 'rollup-plugin-uglify';
import { name } from './package.json';

const isProduction = process.env.NODE_ENV === 'production';

const plugins = isProduction
  ? [uglify()]
  : [
      serve({
        open: true,
        contentBase: 'dist',
        port: 8099,
      }),
      livereload('dist'),
    ];

export default {
  input: './src/main.ts', // 入口文件
  output: [
    {
      file: './dist/bundle.cjs.js', // 打包后的存放文件
      format: 'cjs', // 输出格式  "amd", "cjs", "system", "es", "iife", "umd".
      name: 'bundleName', // 如果 iife, umd 需要指定一个全局变量
      sourcemap: true, // 生成 bundle.map.js 文件，方便调试
    },
    {
      file: './dist/bundle.es.js', // 打包后的存放文件
      format: 'es', // 输出格式  "amd", "cjs", "system", "es", "iife", "umd".
      name: 'bundleName', // 如果 iife, umd 需要指定一个全局变量
      sourcemap: true, // 生成 bundle.map.js 文件，方便调试
    },
    {
      file: './dist/bundle.umd.js', // 打包后的存放文件
      format: 'umd', // 输出格式  "amd", "cjs", "system", "es", "iife", "umd".
      name: 'bundleName', // 如果 iife, umd 需要指定一个全局变量
      sourcemap: true, // 生成 bundle.map.js 文件，方便调试
    },
  ],
  watch: {
    include: 'src/**',
  },
  plugins: [
    typescript(),
    noderesolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**',
    }),
    terser(),
    postcss({
      plugins: [cssnext, cssnano],
      // 输出路径
      extract: resolve(__dirname, `./dist/${name}.css`),
    }),
    html({
      template: './index.html',
      target: './dist/index.html',
      replaceVars: {
        __STYLE_URL__: `${name}.css`,
      },
    }),
    ...plugins,
  ],
};
