'use strict';

let htmlWebpackPlugin = require('html-webpack-plugin');
let webpack = require('webpack');
let fs =require('fs');
let defaultSettings = require('./cfg/defaults');
require('./mock/server');

let config = {
  entry:{
    app:'./src/app.js',
    vendor: [
      "jquery",
      "font-awesome-webpack",
      "bootstrap-loader",
      "angular", 
      'angular-ui-router',
      'oclazyload',
      './src/common/lib/angular-toastr/index',
      './src/common/lib/angular-bootstrap/index',
      'angular-file-upload'
    ]
  },
  output:{
    path:__dirname+'/dist/',
    filename: "script/[name].[hash:6].js",
    jsonpFunction:'Topthinking',
    chunkFilename: "script/[name].[chunkhash:6].js"
  },
  devServer:{
    historyApiFallback:true,
    hot:true,
    inline:true,
    progress:true,
    port:defaultSettings.port,
    proxy: {
            '**/*': {
                target: 'htstp://localhost:3000',
                pathRewrite:JSON.parse(fs.readFileSync('./rewrite.json')),
                secure: false
            }
        }
  },
  resolve:{
    root:__dirname+'./src/'
  },
  plugins: [
    new htmlWebpackPlugin({
      chunks: ['app', 'vendor'],
      favicon:'./src/favicon.ico',
      template:'./src/app.html',
      filename:'index.html',
      inject:'body',
      minify:{
            removeEmptyAttributes: true,
            removeAttributeQuotes: true,
            collapseBooleanAttributes: true,
            collapseWhitespace: true
          }
    }),
    new webpack.ProvidePlugin({
      $:'jquery',
      jQuery:"jquery",
      "window.jQuery":"jquery"
    }),
    new webpack.optimize.CommonsChunkPlugin('vendor', 'script/vendor.[hash:6].js')
  ],
  module: defaultSettings.getDefaultModules()
};

module.exports = config;