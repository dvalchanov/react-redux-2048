var config = require("./webpack.config");
var webpack = require("webpack");
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
config.plugins = config.commonPlugins.concat([
  definePlugin,
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin()
]);
module.exports = config;
