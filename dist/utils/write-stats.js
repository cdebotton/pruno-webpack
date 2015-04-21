"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require("fs");

var _fs2 = _interopRequireWildcard(_fs);

var _path = require("path");

var _path2 = _interopRequireWildcard(_path);

exports["default"] = function (params) {
  var FILEPATH = _path2["default"].resolve(params.stats);

  return function (stats) {
    var publicPath = this.options.output.publicPath;

    var json = stats.toJson();

    var getChunks = function getChunks(name) {
      var ext = arguments[1] === undefined ? "js" : arguments[1];

      var chunk = json.assetsByChunkName[name];

      if (!Array.isArray(chunk)) {
        chunk = [chunk];
      }

      return chunk.filter(function (chunk) {
        return _path2["default"].extname(chunk) === "." + ext;
      }).map(function (chunk) {
        return publicPath + chunk;
      });
    };

    var script = getChunks("bundle", "js");
    var css = getChunks("bundle", "css");

    _fs2["default"].writeFileSync(FILEPATH, JSON.stringify({ script: script, css: css }));
  };
};

module.exports = exports["default"];