var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var pkg = require('./package.json');
var connect = require('gulp-connect');

gulp.task('default', ['webserver']);

// Webserver task
gulp.task('webserver', function() {
  connect.server({
    port: 8090,
    livereload: true
  });
});

// Configure the browserSync task
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
});

// Dev task
gulp.task('dev', ['browserSync'], function() {
  gulp.watch('./css/*.css', browserSync.reload);
  gulp.watch('./*.html', browserSync.reload);
  gulp.watch('./*.js', browserSync.reload);
});
