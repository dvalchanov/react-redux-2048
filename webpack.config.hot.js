var webpack = require("webpack");
var config = require("./webpack.config");

config.entry = [
  "webpack-dev-server/client?http://localhost:3000",
  "webpack/hot/only-dev-server",
  "./src/scripts/main"
];

config.output.publicPath = "http://localhost:3000/";

config.plugins.push(new webpack.DefinePlugin({
  __DEV__: process.env.DEBUG || false
}));

module.exports = config;
