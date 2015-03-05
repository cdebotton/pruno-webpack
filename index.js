"use strict";

var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var util = require("gulp-util");
var configure = require("./utils/configure");

function WebpackTask(params) {
  this.params = (params || {});
};

WebpackTask.getDefaults = function() {
  return {
    "entry": "::src/index.js",
    "dist": "::dist/bundle.js",
    "config": false,
    "hot-load": true,
    "uglify": false,
    "es6": true,
    "es7": false,
    "context": false,
    "devtool": "eval-source-map",
    "devport": 9000
  };
};

WebpackTask.prototype.enqueue = function(gulp, params, callback) {
  var config = configure(params);

  webpack(config, function(err, stats) {
    if (err) throw new util.PluginError("pruno-webpack", err);

    util.log("[pruno-webpack]", stats.toString({
      progress: true,
      colors: true
    }));

    callback();
  });
};

WebpackTask.prototype.generateWatcher = function(gulp, params, callback) {
  return function() {
  var config = configure(params);

    return new WebpackDevServer(webpack(config), {
      publicPath: config.output.publicPath,
      hot: params["hot-load"],
      inline: true,
      noInfo: true,
      inlineSourceMaps: true
    }).listen(params.devport, "localhost", function(err, result) {
      if (err) throw new util.PluginError("pruno-webpack", err);

      util.log("[pruno-webpack]", "WebpackDevServer ready at http://localhost:9000.");
    });
  };
};

module.exports = WebpackTask;
