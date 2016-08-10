var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {

  entry: ['whatwg-fetch', './src/main.js'],
  output: {
    path: './build',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.pug$/,
        loader: 'pug'
      },
      {
        test: /\.css$/,
        loader: 'style!css'
      },
      {
        test: /\.png$/,
        loader: 'file'
      },
      {
        test: /\.svg$/,
        loader: 'file'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/views/index.pug'
    }),
    new webpack.ProvidePlugin({
      $: "jquery"
    })
  ]
};
