/* @flow */
var connect = require('connect');
var bodyParser = require('body-parser');
var rest = require('connect-rest');

var webpack          = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig    = require('../../config/webpack.config.dev');

var http = require('http');
var serveStatic = require('serve-static');
var mainController = require('./controllers/main');

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
  var webpackServer = new WebpackDevServer(webpack(webpackConfig), {
    publicPath: webpackConfig.output.publicPath,
    contentBase: 'http://localhost:9000',
    noInfo: true,
    hot: true,
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  }).listen(9001, 'localhost', function (err, result) {
    if (err) console.log(err);
    else console.log('Webpack server listening on port 9001');
  });
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
//rest.get('/foursquare/signin', foursquarePrism.signin);
http.createServer(app).listen(9000);
