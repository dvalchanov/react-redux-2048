var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var config = require("./webpack.config.hot");

var compiler = webpack(config);

// In a separate file
var host = config.host || "localhost";
var port = config.port || 3000;

var server = new WebpackDevServer(compiler, {
  publicPath: config.output.publicPath,
  hot: true,
  inline: true,
  watch: true,
  sourceMap: true,
  stats: {colors: true},
  historyApiFallback: true
});

server.listen(port, host, function(err) {
  if (err) console.log(err);
  console.log("Listening at " + host + ":" + port);
});
