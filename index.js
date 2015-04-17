"use strict";

require("babel/register")({ stage: 0 });
require("pretty-error").start().skipNodeFiles();
var WebpackTask = require("./lib/WebpackTask");

module.exports = WebpackTask;
