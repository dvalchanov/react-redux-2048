var webpack = require("webpack");
var config = require("./webpack.config");

var definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || "false")),
  "process.env": {
    NODE_ENV: JSON.stringify("development")
  }
});

config.entry = [
  "webpack-dev-server/client?http://localhost:3000",
  "webpack/hot/only-dev-server",
  "./src/scripts/main"
];

config.output.publicPath = "http://localhost:3000/";

config.plugins = config.plugins.concat([
  definePlugin,
  new webpack.NoErrorsPlugin()
]);

module.exports = config;
