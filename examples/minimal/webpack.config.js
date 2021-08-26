const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

const SanLoaderPlugin = require('../../lib/plugin');

module.exports = {
  entry: path.join(__dirname, './main.js'),
  output: {
    path: path.join(__dirname, './dist'),
  },
  mode: 'development',
  devServer: {
    port: 8888,
  },
  module: {
    rules: [
      {
        test: /\.san$/,
        use: [{ loader: path.join(__dirname, '../../index.js'), options: { esModule: true } }]
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      }
    ],
  },
  plugins: [
    new HTMLWebpackPlugin({ template: './index.html' }),
    new SanLoaderPlugin({ esModule: true }),
  ],
};
