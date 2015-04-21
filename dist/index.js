"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _webpack = require("webpack");

var _webpack2 = _interopRequireWildcard(_webpack);

var _WebpackDevServer = require("webpack-dev-server");

var _WebpackDevServer2 = _interopRequireWildcard(_WebpackDevServer);

var _fs = require("fs");

var _fs2 = _interopRequireWildcard(_fs);

var _util = require("gulp-util");

var _util2 = _interopRequireWildcard(_util);

var debug = require("debug")("webpack");

var WebpackTask = (function () {
  function WebpackTask() {
    var params = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, WebpackTask);

    this.params = params;
  }

  _createClass(WebpackTask, [{
    key: "enqueue",
    value: function enqueue(gulp, params, callback) {
      _webpack2["default"](WebpackTask.getConfigFile(params), function (err, stats) {
        if (err) {
          throw new _util2["default"].PluginError("webpack", err);
        }

        callback();
      });
    }
  }, {
    key: "generateWatcher",
    value: function generateWatcher(gulp, params) {
      return function () {
        var serverFile = params.serverFile;

        if (serverFile) {
          require(path.join(process.cwd(), serverFile))(params);
        } else {
          var config = WebpackTask.getConfigFile(params);
          var port = params.port;
          var host = params.host;

          var compiler = _webpack2["default"](config);

          var server = new _WebpackDevServer2["default"](compiler, {
            contentBase: "http://" + params.host + ":" + params.port,
            quiet: true,
            noInfo: true,
            hot: true,
            publicPath: config.output.publicPath
          });

          return server.listen(params.port, params.host, function () {
            debug("Webpack development server listening on %s:%s.", params.host, params.port);
          });
        }
      };
    }
  }], [{
    key: "getConfigFile",
    value: function getConfigFile(params) {
      var configFile = params.configFile;

      if (configFile) {
        return module.parent.require(configFile);
      } else {
        var env = process.env.NODE_ENV === "production" ? "prd" : "dev";
        return require("./config/" + env + ".config.js")(params);
      }
    }
  }, {
    key: "getDefaults",
    value: function getDefaults() {
      return {
        entry: "::src/index.js",
        dist: "::dist",
        port: parseInt(process.env.PORT) + 1 || 3001,
        host: process.env.HOST || "localhost"
      };
    }
  }]);

  return WebpackTask;
})();

exports["default"] = WebpackTask;
module.exports = exports["default"];