"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require("path");

var _path2 = _interopRequireWildcard(_path);

var _webpack = require("webpack");

var _webpack2 = _interopRequireWildcard(_webpack);

var _strip = require("strip-loader");

var _strip2 = _interopRequireWildcard(_strip);

var _writeStats = require("../utils/write-stats");

var _writeStats2 = _interopRequireWildcard(_writeStats);

var _notifyStats = require("../utils/notify-stats");

var _notifyStats2 = _interopRequireWildcard(_notifyStats);

"use strict";

exports["default"] = function (params) {
  var dist = _path2["default"].join(process.cwd(), params.dist);

  return {
    devtool: false,
    entry: {
      bundle: params.entry
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
      loaders: [{ test: /\.(jpe?g|png|gif|svg)$/, exclude: /node_modules/, loader: "file" }, { test: /\.js$/, exclude: /node_modules/, loaders: [_strip2["default"].loader("debug"), "babel?stage=0", "eslint"] }, { test: /\.json$/, exclude: /node_modules/, loader: "json" }]
    },
    progress: true,
    plugins: [new _webpack2["default"].NormalModuleReplacementPlugin(/debug/, _path2["default"].join("../utils/noop")), new _webpack2["default"].DefinePlugin({
      BROWSER: JSON.stringify(true),
      NODE_ENV: JSON.stringify("production")
    }), new _webpack2["default"].optimize.DedupePlugin(), new _webpack2["default"].optimize.OccurenceOrderPlugin(), new _webpack2["default"].optimize.UglifyJsPlugin({
      comments: false,
      compress: {
        warnings: false
      }
    }), function () {
      this.plugin("done", _writeStats2["default"](params));
    }]
  };
};

module.exports = exports["default"];