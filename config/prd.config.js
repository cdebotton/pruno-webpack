"use strict";

import path from "path";
import webpack from "webpack";
import strip from "strip-loader";
import writeStats from "../utils/write-stats";
import notifyStats from "../utils/notify-stats";


export default (params) => {
  let dist = path.join(process.cwd(), params.dist);

  return {
    devtool: false,
    entry: {
      "bundle": params.entry
    },
    output: {
      path: dist,
      filename: "[name]-[chunkhash].js",
      chunkFilename: "[name]-[chunkhash].js",
      publicPath: "/"
    },
    module: {
      resolve: {
        extensions: ["", ".js"]
      },
      loaders: [
        { test: /\.(jpe?g|png|gif|svg)$/, exclude: /node_modules/, loader: "file" },
        { test: /\.js$/, exclude: /node_modules/, loaders: [strip.loader("debug"), "babel?stage=0", "eslint"] },
        { test: /\.json$/, exclude: /node_modules/, loader: "json" }
      ]
    },
    progress: true,
    plugins: [
      new webpack.NormalModuleReplacementPlugin(
        /debug/,
        path.join("../utils/noop")
      ),
      new webpack.DefinePlugin({
        BROWSER: JSON.stringify(true),
        NODE_ENV: JSON.stringify("production")
      }),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        comments: false,
        compress: {
          warnings: false
        }
      }),
      function() { this.plugin("done", writeStats(params)) }
    ]
  };
};

