var path = require("path");
var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var config = require("./webpack.config");

var definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify("false"),
  "process.env": {
    NODE_ENV: JSON.stringify("production")
  }
});

config.devtool = "source-map";

config.output = {
  path: path.resolve("./build"),
  filename: "[name].min.js",
  publicPath: ""
};

config.plugins = [
  definePlugin,
  new HtmlWebpackPlugin({
    title: "React + Redux Starter",
    template: "src/index.html"
  }),
  new webpack.ProvidePlugin({
    React: "react"
  }),
  new ExtractTextPlugin("[name].min.css", {
    allChunks: true
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: "vendor",
    path: "[name].min.js",
    minChunks: function (module, count) {
      return module.resource && module.resource.indexOf(path.join(__dirname, 'node_modules')) !== -1;
    }
  }),
  new webpack.optimize.OccurenceOrderPlugin(true),
  new webpack.optimize.DedupePlugin(),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    },
    sourceMap: false
  }),
];

module.exports = config;
