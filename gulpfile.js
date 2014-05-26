var gulp = require("gulp"),
  browserify = require("gulp-browserify"),
  react = require("gulp-react"),
  rename = require("gulp-rename"),
  uglify = require("gulp-uglify");

gulp.task("jsx-transform", function(){
  gulp.
    src("./ui/*").
    pipe(react()).
    pipe(gulp.dest("./ui-transformed"));
});

gulp.task("bundle", function(){
  gulp.
    src("./ui").
    pipe(browserify({
      transform: ["reactify"]
    })).
    pipe(rename("bundle.js")).
    pipe(gulp.dest("./public/js"));
});

gulp.task("uglify", ["bundle"], function(){
  gulp.
    src("./public/js/bundle.js").
    pipe(uglify()).
    pipe(rename("bundle.min.js")).
    pipe(gulp.dest("./public/js"));
});

gulp.task("watch", function(){
  gulp.watch("./ui/*", ["jsx-transform", "uglify"]);
});

gulp.task("default", ["jsx-transform", "uglify", "watch"]);
