"use strict";

var gulp = require("gulp");
var babel = require("gulp-babel");

gulp.task("babel", function() {
  gulp.src("./lib/**/*.js")
    .pipe(babel({
      stage: 0
    }))
    .pipe(gulp.dest("./dist"));
});

gulp.task("default", ["babel"]);
gulp.task("watch", function() {
  gulp.watch("./lib/**/*.js", ["default"]);
});
