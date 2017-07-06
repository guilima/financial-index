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
    publicPath: "/dist/",
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
      }
    ]
  },
  resolve: {
    alias: { vue: 'vue/dist/vue.esm.js' }
  },
  devServer: {
    host: 'local.financial.index',
    port: 8082
  },
  devtool: '#eval-source-map'
};