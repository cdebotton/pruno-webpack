"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require("path");

var _path2 = _interopRequireWildcard(_path);

var _webpack = require("webpack");

var _webpack2 = _interopRequireWildcard(_webpack);

var _writeStats = require("../utils/write-stats");

var _writeStats2 = _interopRequireWildcard(_writeStats);

var _notifyStats = require("../utils/notify-stats");

var _notifyStats2 = _interopRequireWildcard(_notifyStats);

"use strict";

exports["default"] = function (params) {
  var WEBPACK_HOST = "localhost";
  var WEBPACK_PORT = parseInt(process.env.PORT) + 1 || 3001;

  var dist = _path2["default"].join(process.cwd(), params.dist);

  return {
    devtool: "eval",
    entry: {
      bundle: ["webpack-dev-server/client?http://" + WEBPACK_HOST + ":" + WEBPACK_PORT, "webpack/hot/only-dev-server", params.entry]
    },
    output: {
      path: dist,
      filename: "[name]-[chunkhash].js",
      chunkFilname: "[name-[chunkhash].js",
      publicPath: "http://" + WEBPACK_HOST + ":" + WEBPACK_PORT + "/"
    },
    module: {
      resolve: {
        extensions: ["", ".js"]
      },
      loaders: [{ test: /\.(jpe?g|png|gif|svg)$/, loader: "file" }, { test: /\.js$/, exclude: /node_modules/, loaders: ["react-hot", "babel?stage=0", "eslint"] }, { test: /\.json$/, exclude: /node_modules/, loader: "json" }]
    },
    progress: true,
    plugins: [new _webpack2["default"].HotModuleReplacementPlugin(), new _webpack2["default"].NoErrorsPlugin(), new _webpack2["default"].ProgressPlugin(function (percentage, message) {
      var MOVE_LEFT = new Buffer("1b5b3130303044", "hex").toString();
      var CLEAR_LINE = new Buffer("1b5b304b", "hex").toString();

      process.stdout.write(CLEAR_LINE + Math.round(percentage * 100) + ":" + message + MOVE_LEFT);
    }), new _webpack2["default"].DefinePlugin({
      BROWSER: JSON.stringify(true),
      NODE_ENV: JSON.stringify("development")
    }), new _webpack2["default"].optimize.DedupePlugin(), new _webpack2["default"].optimize.OccurenceOrderPlugin(), function () {
      this.plugin("done", _notifyStats2["default"]);
    }, function () {
      this.plugin("done", _writeStats2["default"](params));
    }]
  };
};

module.exports = exports["default"];