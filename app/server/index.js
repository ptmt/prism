/* @flow */
var connect = require('connect');
var bodyParser = require('body-parser');
var rest = require('connect-rest');
var foursquarePrism = require('./foursquare');
var http = require('http');
var serveStatic = require('serve-static');
var livereload = require('gulp-livereload');

var app = connect()
  .use(bodyParser.urlencoded( { extended: true } ))
  .use(bodyParser.json())
  .use(function onerror(req, res, next) {
    console.log(req.method, '->', new Date(), req.url);
    next();
  })
  .use(rest.rester({
    context: '/api/v1'
  }))
  .use(serveStatic('dist'))
  .use(function onerror(err, req, res, next) {
    console.log(err);
    next();
  });

rest.get('/foursquare/iterate', foursquarePrism.iterate);
rest.get('/foursquare/signin', foursquarePrism.signin);
http.createServer(app).listen(9000);
