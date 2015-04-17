"use strict";

import path from "path";
import webpack from "webpack";
import writeStats from "../utils/write-stats";
import notifyStats from "../utils/notify-stats";

export default (params) => {
  const WEBPACK_HOST = "localhost";
  const WEBPACK_PORT = parseInt(process.env.PORT) + 1 || 3001;

  return {
    devtool: "eval",
    entry: {
      "bundle": [
        `webpack-dev-server/client?http://${WEBPACK_HOST}:${WEBPACK_PORT}`,
        "webpack/hot/only-dev-server",
        params.entry
      ]
    },
    output: {
      path: params.dist,
      filename: "[name]-[chunkhash].js",
      chunkFilname: "[name-[chunkhash].js",
      publicPath: `http://${WEBPACK_HOST}:${WEBPACK_PORT}/`
    },
    module: {
      resolve: {
        extensions: ["", ".js"]
      },
      loaders: [
        { test: /\.(jpe?g|png|gif|svg)$/, loader: "file" },
        { test: /\.js$/, exclude: /node_modules/, loaders: ["react-hot", "babel?stage=0", "eslint"] },
        { test: /\.json$/, exclude: /node_modules/, loader: "json" }
      ]
    },
    progress: true,
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
      new webpack.ProgressPlugin(function(percentage, message) {
        let MOVE_LEFT = new Buffer("1b5b3130303044", "hex").toString();
        let CLEAR_LINE = new Buffer("1b5b304b", "hex").toString();

        process.stdout.write(CLEAR_LINE + Math.round(percentage * 100) + ":" +
          message + MOVE_LEFT);
      }),
      new webpack.DefinePlugin({
        BROWSER: JSON.stringify(true),
        NODE_ENV: JSON.stringify("development")
      }),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurenceOrderPlugin(),
      function() { this.plugin("done", notifyStats) },
      function() { this.plugin("done", writeStats(params)) }
    ]
  };
};

