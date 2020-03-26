const path = require('path');
const Dotenv = require('dotenv-webpack');
const TerserJSPlugin = require('terser-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = (_, argv) => ({
  entry: './src/app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: argv.mode === 'production' ? '[name].[hash].js' : '[name].js'
  },
  optimization: {
    minimizer: [new TerserJSPlugin({extractComments: false}), new OptimizeCSSAssetsPlugin({})],
    moduleIds: 'hashed',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            scss: 'vue-style-loader!css-loader!sass-loader'
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          argv.mode === 'production' ?
          MiniCssExtractPlugin.loader :
          'vue-style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  },
  resolve: {
    modules: [path.resolve(__dirname, './src'), 'node_modules'],
    alias: { vue: 'vue/dist/vue.esm.js' }
  },
  devServer: {
    host: 'localhost',
    port: 8082,
    publicPath: '/dist/'
  },
  plugins: [
    new Dotenv({
      path: path.resolve(__dirname, './.env.' + argv.mode)
    }),
    new VueLoaderPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './index.ejs',
      title: 'Indíces de valores financiais',
      filename: '../index.html',
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackHarddiskPlugin(),
    new MiniCssExtractPlugin({
      filename: argv.mode !== 'production' ? '[name].css' : '[name].[hash].css',
      chunkFilename: argv.mode !== 'production' ? '[id].css' : '[id].[hash].css'
    })
  ]
});
