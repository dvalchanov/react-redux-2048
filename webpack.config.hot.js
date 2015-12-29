var config = require("./webpack.config");
var webpack = require("webpack");

/**
 * Define global application variables.
 */
var definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || false)),
  "process.env": {
    NODE_ENV: JSON.stringify("development")
  }
});

config.devtool = "source-map";

/**
 * Change entry to use webpack-dev-server for hot reload.
 */
config.entry = [
  "webpack-dev-server/client?http://localhost:3000",
  "webpack/hot/only-dev-server",
  "./src/scripts/main"
];

/**
 * Use the local server for public path.
 */
config.output.publicPath = "http://localhost:3000/";

/**
 * Add development specific plugins to the common ones.
 */
config.plugins = config.commonPlugins.concat([
  definePlugin,
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin()
]);

/**
 * Export the configuration object.
 */
module.exports = config;
