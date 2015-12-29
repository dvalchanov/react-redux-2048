var config = require("./webpack.config");
var path = require("path");
var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

/**
 * Define global application variables.
 */
var definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(false),
  "process.env": {
    NODE_ENV: JSON.stringify("production")
  }
});

/**
 * Output configuration for production.
 */
config.output = {
  path: path.resolve("./build"),
  filename: "[name].min.js",
  publicPath: ""
};

/**
 * Add production specific plugins to the common ones.
 */
config.plugins = config.commonPlugins.concat([
  definePlugin,
  new ExtractTextPlugin("[name].min.css", {
    allChunks: true
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: "vendor",
    path: "[name].min.js",
    minChunks: function (module, count) {
      return module.resource && module.resource.indexOf(path.resolve('node_modules')) !== -1;
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
]);

/**
 * Export the configuration object.
 */
module.exports = config;
