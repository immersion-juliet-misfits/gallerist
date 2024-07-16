const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const autoprefixer = require('autoprefixer');
require('dotenv').config();

const { NODE_ENV = 'development' } = process.env;
const isDev = NODE_ENV.includes('dev');

const config = {
  mode: isDev ? 'development' : 'production',
  devtool: isDev ? 'inline-source-map' : 'source-map',
  watch: isDev,
  stats: {
    excludeModules: /node_modules/,
  },
  entry: path.resolve(__dirname, './client/index.jsx'),
  output: {
    path: path.resolve(__dirname, './client/dist/'),
    publicPath: '/',
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-env'],
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.(scss|css)$/,
        use: [
          {
            // Adds CSS to the DOM by injecting a `<style>` tag
            loader: 'style-loader',
          },
          {
            // Interprets `@import` and `url()` like `import/require()` and will resolve them
            loader: 'css-loader',
          },
          {
            // Loader for webpack to process CSS with PostCSS
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  autoprefixer,
                ],
              },
            },
          },
          {
            // Loads a SASS/SCSS file and compiles it to CSS
            loader: 'sass-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './client/index.ejs'),
    }),
    new NodePolyfillPlugin(),
  ],
};

module.exports = config;
