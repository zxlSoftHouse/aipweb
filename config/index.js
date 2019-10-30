'use strict'
// Template version: 1.2.6
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {},

    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 5678, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: true,
    errorOverlay: true,
    notifyOnErrors: false,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: false,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,
    devtool: 'cheap-source-map',
    cacheBusting: true,
    cssSourceMap: false,

    proxyTable: {
      '/api': {
        //target: 'http://192.168.20.18:8080',
        // target: 'http://192.168.20.20:8080',//生产环境mock地址 
        target: 'http://172.16.1.145:8080',//生产环境mock地址 张
        secure: false,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
      '/hkvsapi': {
        target: 'https://open.ys7.com',
        secure: false,
        changeOrigin: true,
        pathRewrite: {
          '^/hkvsapi': ''
        }
      },
      '/ledapi': {
        target: 'http://118.31.2.114:8866',
        secure: false,
        changeOrigin: true,
        pathRewrite: {
          '^/ledapi': ''
        }
      },
      // '/api': {
      //   target: 'https://www.easy-mock.com/mock/5c4fc69f9ccfcd0ae7ea0946/front',//生产环境mock地址 
      //   secure: false,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/api': ''
      //   }
      // },
    }
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../docs/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../docs'),
    assetsSubDirectory: 'static',

    // you can set by youself according to actual condition
    assetsPublicPath: './',

    /**
     * Source Maps
     */

    productionSourceMap: false,
    devtool: '#source-map',
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
