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
gulp.task('scripts', ['client-flow'], function() {
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
    .pipe($.connect.reload());
  };

  return bundle();
});

// HTML
gulp.task('html', function() {
  return gulp.src('app/*.html')
    //.pipe($.useref())
    .pipe(gulp.dest('dist'))
    .pipe($.size())
    .pipe($.connect.reload());
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
    .pipe($.connect.reload());
});

gulp.task('test', function() {
  require('common-node').run('./node_modules/.bin/_mocha'); //common-node ./node_modules/.bin/_mocha
});

// Clean
gulp.task('clean', function() {
  return gulp.src(['dist/styles', 'dist/scripts', 'dist/images'], {
    read: false
  }).pipe($.clean());
});

// Bundle
gulp.task('bundle', ['scripts', 'less', 'bower'], function() {
  return gulp.src('./app/*.html')
     // .pipe($.useref.assets())
     // .pipe($.useref.restore())
     // .pipe($.useref())
     .pipe(gulp.dest('dist'));
});

// Build
gulp.task('build', ['html', 'bundle', 'images']);

// Default task
gulp.task('default', ['watch']);

gulp.task('flow', function() {
  return gulp.src([
    'app/server/**/**.js',
    ])
    .pipe($.flowtype({
      declarations: './app/interfaces'
    }))
    .pipe($.react({
      stripTypes: true,
      harmony: true
    }))
    // Output each file into the ./build/javascript/ directory
    .pipe(gulp.dest('./app/server.compiled/'));
});



//Connect
gulp.task('connect', ['flow'], function() {
  $.connect.server({
    root: ['dist'],
    port: 9000,
    livereload: true,
    middleware: require('./app/server.compiled/index.js')
  });
});

gulp.task('kill', function() {
  $.connect.serverClose();
});

gulp.task('restart', ['kill', 'connect']);

// Bower helper
gulp.task('bower', function() {
  gulp.src('app/bower_components/**/*.js', {
      base: 'app/bower_components'
    })
    .pipe(gulp.dest('dist/bower_components/'));

});

gulp.task('less', function () {
  gulp.src('./app/less/**/*.less')
    .pipe($.less({
      paths: [ require('path').join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('./dist/styles'))
    .pipe($.connect.reload());
});

// gulp.task('styles', ['less'], function() {
//   gulp.src('app/styles/**/*.css')
//     .pipe(gulp.dest('dist/styles/'))
//     .pipe($.connect.reload());
// });


// Watch
gulp.task('watch', ['html', 'bundle', 'connect'], function() {

  // Watch server-side js files
  gulp.watch(['gulpfile.js', 'app/server/**/*.js', 'app/interfaces/**/*.js'], ['restart']);

  // Watch .html files
  gulp.watch('app/*.html', ['html']);

  // Watch .jade files
  //gulp.watch('app/template/**/*.jade', ['jade', 'html']);

  // Watch .css files
  gulp.watch('app/less/*.less', ['less']);

  // Watch client .js files
  gulp.watch('app/client/**/*.js', ['scripts']);

  // Watch image files
  gulp.watch('app/images/**/*', ['images']);
});
