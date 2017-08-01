'use strict';

let htmlWebpackPlugin = require('html-webpack-plugin');
let webpack = require('webpack');
let CleanPlugin = require('clean-webpack-plugin');
let defaultSettings = require('./cfg/defaults');
let path = require('path');
let fs = require('fs');


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
    path:'./dist/static/',
    filename: "script/[name].[hash:6].js",
    jsonpFunction:'Topthinking',
    publicPath:"/static/",
    chunkFilename: "script/[name].[chunkhash:6].js"
  },
  resolve:{
    root:__dirname+'./src/'
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress:{
                warnings: false
            },
      beautify:false,
      comments:false
    }),
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

var deleteFolder = function(path) {
    var files = [];
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolder(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};
deleteFolder('./dist/static/');
module.exports = config;