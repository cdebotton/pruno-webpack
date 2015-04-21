"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _PrettyError = require("pretty-error");

var _PrettyError2 = _interopRequireWildcard(_PrettyError);

var notifyError = function notifyError(err) {
  var pe = new _PrettyError2["default"]();
  console.log(pe.render(err));
};

var notifyWarning = function notifyWarning(warning) {
  var pe = new _PrettyError2["default"]();
  console.log(pe.render(warning));
};

exports["default"] = function (stats) {
  var _stats$toJson = stats.toJson();

  var errors = _stats$toJson.errors;
  var warnings = _stats$toJson.warnings;

  if (errors.length) {
    errors.forEach(notifyError);
  } else if (warnings.length) {
    warnings.forEach(notifyWarning);
  } else {
    console.log(stats.toString({
      chunks: false,
      colors: true
    }));
  }
};

module.exports = exports["default"];