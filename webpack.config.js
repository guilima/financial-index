const webpack = require('webpack');
const path = require('path');

var proxyURL = 'http://local.financial.indexs'; // Your external HTML server
var proxy = {
  '*': { target: proxyURL }
};

module.exports = {
  context: path.resolve(__dirname, './src'),
  entry: {
    app: './app.js',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin() // Enable HMR
  ],
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].bundle.js',
  },
  resolve: {
    alias: { vue: 'vue/dist/vue.esm.js' }
  },
  devServer: {

    open: true,
    publicPath: "/dist/",
    hot: true, // Tell the dev-server we're using HMW
    //https: true,
    host: 'local.financial.index',
    port: 8082,
    openPage: '',
  }
};
