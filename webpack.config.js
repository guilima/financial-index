const webpack = require('webpack');
const path = require('path');

module.exports = {
  context: path.resolve(__dirname, './src'),
  entry: {
    app: './app.js',
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].bundle.js',
  },
  resolve: {
    alias: { vue: 'vue/dist/vue.esm.js' }
  }
};
