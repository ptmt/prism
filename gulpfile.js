'use strict';

var gulp = require('gulp');

// Load plugins
var scope = process.env.NODE_ENV === 'PRODUCTION' ? ['dependencies'] : ['dependencies', 'devDependencies'];
var $ = require('gulp-load-plugins')({
    scope: scope, // which keys in the config to look within
});
console.log( process.env.NODE_ENV, process.env.NODE_ENV === 'PRODUCTION')
var livereload = process.env.NODE_ENV === 'PRODUCTION' ? $.size : $.livereload;


gulp.task('client-flow', function() {
  return gulp.src([
    'app/client/**/**.js',
    ])
    .pipe($.flowtype({
      declarations: './app/interfaces'
    }));
});

// HTML
gulp.task('html', function() {
  return gulp.src('app/*.html')
    //.pipe($.useref())
    .pipe(gulp.dest('dist'))
    .pipe($.size())
    .pipe(livereload());
});

// Images
gulp.task('images', function() {
  return gulp.src('app/images/**/*')
    .pipe($.imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('dist/images'))
    .pipe($.size())
    .pipe(livereload());
});


// Clean
gulp.task('clean', function() {
  return gulp.src(['dist/styles', 'dist/scripts', 'dist/images'], {
    read: false
  }).pipe($.clean());
});


// Default task
gulp.task('default', ['watch']);

gulp.task('server-compile', function() {
  return gulp.src([
    'app/server/**/**.js',
    ])
    // .pipe($.flowtype({
    //   declarations: './app/interfaces'
    // }))
    .pipe($.react({
      stripTypes: true,
      harmony: true
    }))
    // Output each file into the ./build/javascript/ directory
    .pipe(gulp.dest('./app/server.compiled/'))
    .on('error', function (error) {
      console.error('' + error);
    });
});

gulp.task( 'server:start', ['server-compile'], function() {
  $.developServer.listen({
    path: './app/server.compiled/index.js'
  }, $.livereload.listen );
});

// Bower helper
gulp.task('bower', function() {
  gulp.src('app/bower_components/**/*.js', {
      base: 'app/bower_components'
    })
    .pipe(gulp.dest('dist/bower_components/'));

});

gulp.task('fonts', function() {
  gulp.src('./app/fonts/*.*')
    .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('less', function () {
  gulp.src('./app/less/app.less')
    .pipe($.less({
      paths: ['./app/less/app.less' ] //require('path').join(__dirname, 'less', 'includes')
    }))
    .pipe(gulp.dest('./dist/styles'))
    .pipe(livereload());
});


// Bundle
gulp.task('bundle', ['images', 'less', 'fonts', 'bower']);

// Build
gulp.task('build', ['html', 'bundle', 'images', 'server-compile']);

gulp.task('server:restart', ['server-compile'], function () {
  $.developServer.changed( function( error ) {
    if( ! error ) $.livereload.changed();
  });
});


// Watch
gulp.task('watch', ['html', 'bundle', 'server:start'], function() {

  // Watch server-side js files
  gulp.watch(['app/server/**/*.js', 'app/interfaces/**/*.js'], ['server:restart']);//.on( 'change', restart );;

  // Watch .html files
  gulp.watch('app/*.html', ['html']);

  // Watch .jade files
  //gulp.watch('app/template/**/*.jade', ['jade', 'html']);

  // Watch .css files
  gulp.watch('app/less/*.less', ['less']);

  // Watch client .js files
  gulp.watch('app/client/**/*.js', ['client-flow']);

  // Watch image files
  gulp.watch('app/images/**/*', ['images']);
});
