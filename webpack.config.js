const webpack = require('webpack');
const path = require('path');

var proxyURL = 'http://local.financial.indexs'; // Your external HTML server
var proxy = {
  '*': { target: proxyURL }
};

module.exports = {
  entry: './src/app.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'app.bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            'scss': 'vue-style-loader!css-loader!sass-loader'
          }
        }
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
    host: 'local.financial.index',
    port: 8082
  },
  devtool: process.env.NODE_ENV === 'product' ? 'source-map' : 'eval-source-map',
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      mangle: true,
      compress: {
        warnings: false, // Suppress uglification warnings
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        screw_ie8: true
      },
      output: {
        comments: false,
      },
      exclude: [/\.min\.js$/gi] // skip pre-minified libs
    }),
  ]
};
