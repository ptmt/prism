'use strict';

var gulp = require('gulp');

// Load plugins
var $ = require('gulp-load-plugins')();

gulp.task('client-flow', function() {
  return gulp.src([
    'app/client/**/**.js',
    ])
    .pipe($.flowtype({
      declarations: './app/interfaces'
    }));
})
// Scripts
gulp.task('scripts', function() {
  var browserify = require('browserify');
  var source = require('vinyl-source-stream');
  var buffer = require('vinyl-buffer');
  var reactify = require('reactify');

  var bundler = browserify({
    entries: ['./app/client/app.js'],
    debug: true
  });

  bundler.transform('reactify', {es6: true, stripTypes: true})

  var bundle = function() {
    return bundler
    .bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe($.sourcemaps.init({loadMaps: true}))
    .pipe($.uglify())
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/scripts/'))
    .pipe($.livereload());
  };

  return bundle();
});

// HTML
gulp.task('html', function() {
  return gulp.src('app/*.html')
    //.pipe($.useref())
    .pipe(gulp.dest('dist'))
    .pipe($.size())
    .pipe($.livereload());
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
    .pipe($.livereload());
});

gulp.task('test', function() {
  require('common-node').run('./node_modules/.bin/_mocha');
});

// Clean
gulp.task('clean', function() {
  return gulp.src(['dist/styles', 'dist/scripts', 'dist/images'], {
    read: false
  }).pipe($.clean());
});

// Bundle
gulp.task('bundle', ['scripts', 'less', 'bower']);

// Build
gulp.task('build', ['html', 'bundle', 'images']);

// Default task
gulp.task('default', ['watch']);

gulp.task('flow', function() {
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
    .pipe(gulp.dest('./app/server.compiled/'));
});

gulp.task( 'server:start', ['flow'], function() {
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

gulp.task('less', function () {
  gulp.src('./app/less/app.less')
    .pipe($.less({
      paths: ['./app/less/app.less' ] //require('path').join(__dirname, 'less', 'includes')
    }))
    .pipe(gulp.dest('./dist/styles'))
    .pipe($.livereload());
});


gulp.task('server:restart', ['flow'], function () {
  $.developServer.changed( function( error ) {
    if( ! error ) $.livereload.changed();
  });
  // gulp.src('./app/server.compiled/app.js')
  //   .pipe($.developServer({
  //     path: './app/server.compiled/index.js'
  //   }))
  //   .pipe($.livereload());
});


// Watch
gulp.task('watch', ['html', 'bundle', 'server:start'], function() {

  // function restart( file ) {
  //   $.developServer.changed( function( error ) {
  //     gulp.task('flow');
  //     if( ! error ) $.livereload.changed( file.path );
  //   });
  // }

  // Watch server-side js files
  gulp.watch(['app/server/**/*.js', 'app/interfaces/**/*.js'], ['server:restart']);//.on( 'change', restart );;

  // Watch .html files
  gulp.watch('app/*.html', ['html']);

  // Watch .jade files
  //gulp.watch('app/template/**/*.jade', ['jade', 'html']);

  // Watch .css files
  gulp.watch('app/less/*.less', ['less']);

  // Watch client .js files
  gulp.watch('app/client/**/*.js', ['client-flow', 'scripts']);

  // Watch image files
  gulp.watch('app/images/**/*', ['images']);
});
