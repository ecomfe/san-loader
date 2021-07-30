const SanLoaderPlugin = require('san-loader/lib/plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');

const { join } = require('path');

module.exports = {
  entry: join(__dirname, './main.js'),
  output: {
    path: join(__dirname, './dist'),
  },
  devServer: {
    port: 8888,
  },
  module: {
    rules: [
      {
        test: /\.san$/,
        use: [{ loader: 'san-loader', options: { esModule: true } }]
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
