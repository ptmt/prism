var webpack          = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig    = require('../../config/webpack.config.dev');

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
