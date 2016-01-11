var path = require("path");
var webpack = require("webpack");
var autoprefixer = require("autoprefixer");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

/**
 * Check if currently in development environment.
 */
var isDev = process.env.NODE_ENV !== "production";

/**
 * Get loader for specific type.
 *
 * @param {String} type
 * @returns {String}
 */
function getLoader(type) {
  return "css?modules&importLoaders=2&sourceMap&localIdentName=[local]_[hash:base64:5]!" +
         type +
         "?outputStyle=expanded&sourceMap";
}

/**
 * Webpack configuration.
 */
var config = {

  /**
   * Context to resolve relative paths.
   */
  context: __dirname,

  /**
   * Entry point for the application.
   */
  entry: {
    src: "./src/scripts/main"
  },

  /**
   * Output settings.
   */
  output: {
    path: path.resolve("./build"),
    filename: "assets/[name]-[hash].js",
    publicPath: "/"
  },

  /**
   * Common plugins for production and development.
   */
  commonPlugins: [
    new HtmlWebpackPlugin({
      title: "2048 - implemented with React and Redux",
      template: "src/index.html"
    }),
    new webpack.ProvidePlugin({
      React: "react"
    })
  ],

  module: {
    /**
     * Loaders to be executed ahead of the others.
     *
     * Example:
     * - Eslint checks should be made before the code is transformed.
     */
    preLoaders: [

      /**
       * Eslint loader.
       */
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint"
      }
    ],

    /**
     * Loaders to be used for code transformation.
     */
    loaders: [

      /**
       * Implement Hot Module Replacement and Babel transpiler.
       */
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loaders: ["react-hot", "babel"]
      },

      /**
       * Load .json files.
       */
      {
        test: /\.json$/,
        loader: "json-loader"
      },

      /**
       * Load .less files.
       *
       * If the environment is different than `development` extract the css, should not
       * be used otherwise, because HMR won't work.
       */
      {
        test: /\.less$/,
        loader: isDev ?
                "style!".concat(getLoader("less")) :
                ExtractTextPlugin.extract("style", getLoader("less"))
      },

      /**
       * Load .sass files.
       *
       * If the environment is different than `development` extract the css, should not
       * be used otherwise, because HMR won't work.
       */
      {
        test: /\.scss$/,
        loader: isDev ?
                "style!".concat(getLoader("sass")) :
                ExtractTextPlugin.extract("style", getLoader("sass"))
      },

      /**
       * Load .jpg pictures.
       */
      {
        test: /\.(jpg)$/,
        loader: "url?limit=25000"
      },

      /**
       * Load .png, .gif, .svg pictures.
       */
      {
        test: /\.(png|gif|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader?hash=sha512&digest=hex&name=assets/[name].[ext]"
      },

      /**
       * Load .woff, .woff2 fonts.
       */
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=application/font-woff"
      },

      /**
       * Load .ttf, .eot fonts.
       */
      {
        test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader?name=assets/[hash].[ext]"
      }
    ]
  },

  /**
   * Post css.
   */
  postcss: [autoprefixer],

  /**
   * Resolve modules.
   */
  resolve: {

    /**
     * Alias for resolving modules names.
     */
    alias: {
      js: path.join(__dirname, "src", "scripts"),
      img: path.join(__dirname, "src", "images"),
      css: path.join(__dirname, "src", "styles")
    },

    /**
     * Directories to be resolved.
     */
    modulesDirectories: [
      "src",
      "node_modules",
      "bower_components"
    ],

    /**
     * Files with the following extensions should be resolved.
     */
    extensions: ["", ".json", ".js"]
  }
};

/**
 * Export the configuration object.
 */
module.exports = config;
