var gulp = require("gulp");
var strip = require("gulp-strip-comments");

gulp.task("starter", function() {
  gulp.src("webpack.config.hot.js")
    .pipe(strip())
    .pipe(gulp.dest("dist"));
});
