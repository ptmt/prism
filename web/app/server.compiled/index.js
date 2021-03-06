/* @flow */
var connect = require('connect');
var bodyParser = require('body-parser');
var rest = require('connect-rest');
var http = require('http');
var serveStatic = require('serve-static');
var mainController = require('./controllers/main');
var authController = require('./controllers/auth');

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

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  var devServer = require('./dev');
  // use webpack dev server for serving js files
  app.use('/scripts', function (req, res) {
    res.redirect = function(to) {
      res.writeHead(302, {
        'Location': to,
        'Content-Length': '0'
      });
      res.end();
    }
    res.redirect('http://localhost:9001' + req._parsedUrl.path);
  });
}

rest.get('/connected', mainController.connected);
rest.get('/gettimeline', mainController.getTimeline);
rest.get('/auth/foursquare', authController.foursquare);
rest.get('/auth/instagram', authController.instagram);
rest.get('/auth/foursquare_callback', authController.foursquare_callback);
rest.get('/auth/instagram_callback', authController.instagram_callback);
var port = process.env.NODE_PORT || 9000;
http.createServer(app).listen(port);
