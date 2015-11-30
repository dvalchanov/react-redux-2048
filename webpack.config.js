var path = require("path");
var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");

var settings = require("./settings.json");

module.exports = {
  context: __dirname,

  entry: {
    src: "./src/scripts/main"
  },

  output: {
    path: path.resolve("./dist"),
    filename: "assets/[name]-[hash].js",
    publicPath: "/"
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: "React + Redux Starter",
      template: "src/index.html"
    })
  ],

  module: {
    preLoaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint"
      }
    ],
    loaders: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loaders: ["react-hot", "babel"]
      },
      {
        test: /\.json$/,
        loader: "json-loader"
      },
      {
        test: /\.less$/,
        loader: "style!css?modules&importLoaders=2&sourceMap&localIdentName=[local]_[hash:base64:5]!less?outputStyle=expanded&sourceMap"
      },
      {
        test: /\.scss$/,
        loader: "style!css?modules&importLoaders=2&sourceMap&localIdentName=[local]_[hash:base64:5]!sass?outputStyle=expanded&sourceMap"
      },
      {
        test: /\.(jpg)$/,
        loader: "url?limit=25000"
      },
      {
        test: /\.(png|gif|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loaders: [
          "file-loader?hash=sha512&digest=hex&name=assets/[hash].[ext]"
        ]
      },
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=application/font-woff"
      },
      {
        test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader?name=assets/[hash].[ext]"
      }
    ]
  },

  postcss: [
    require("autoprefixer")
  ],

  resolve: {
    modulesDirectories: [
      "src",
      "node_modules",
      "bower_components"
    ],
    extensions: ["", ".json", ".js"]
  }
};
