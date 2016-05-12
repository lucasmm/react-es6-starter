'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var babelify = require('babelify');
var browserSync = require('browser-sync').create();

gulp.task('javascript', function () {
  // set up the browserify instance on a task basis
  var b = browserify({
    entries: './app/components/app.js',
    debug: true,
    // defining transforms here will avoid crashing your stream
    transform: [babelify]
  });

  return b.bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        .pipe(uglify())
        .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./public/dist/js/'));
});

gulp.task('watch', function(){
  gulp.watch('app/**/*',['javascript'])
});

gulp.task('serve', ['javascript'], function() {

    browserSync.init({
        server: "./public"
    });

    gulp.watch('app/**/*',['javascript'])
    gulp.watch('public/*.html').on('change', browserSync.reload);
    gulp.watch('public/dist/js/**/*').on('change', browserSync.reload);
});
