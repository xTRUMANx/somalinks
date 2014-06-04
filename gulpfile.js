var gulp = require("gulp"),
  browserify = require("gulp-browserify"),
  react = require("gulp-react"),
  rename = require("gulp-rename"),
  uglify = require("gulp-uglify");

gulp.task("jsx-transform", function(){
  gulp.
    src("./ui/**/*.react.js").
    pipe(react()).
    pipe(rename(function(path){
      var basename = path.basename.substr(0, path.basename.lastIndexOf(".react"));
      path.basename = basename;
    })).
    pipe(gulp.dest("./ui-transformed"));
});

gulp.task("bundle", ["jsx-transform"],function(){
  gulp.
    src("./ui-transformed/index.js").
    pipe(browserify()).
    pipe(rename("bundle.js")).
    pipe(gulp.dest("./public/js")).
    pipe(uglify()).
    pipe(rename("bundle.min.js")).
    pipe(gulp.dest("./public/js"));
});

gulp.task("watch", function(){
  gulp.watch("./ui/*", ["jsx-transform", "bundle"]);
});

gulp.task("default", ["bundle", "watch"]);
