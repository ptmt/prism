var webpack = require('webpack');

module.exports = {
  // Entry point for static analyzer:
  entry: [
    'webpack-dev-server/client?http://localhost:9001',
    'webpack/hot/dev-server',
    './app/client/app.jsx'
  ],

  output: {
    // Where to put build results when doing production builds:
    // (Server doesn't write to the disk, but this is required.)
    path: __dirname,

    // Filename to use in HTML
    filename: 'app.js',

    // Path to use in HTML
    publicPath: 'http://localhost:9001/scripts/'
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
    //new webpack.optimize.CommonsChunkPlugin('lib', 'lib.js')
  ],

  resolve: {
    // Allow to omit extensions when requiring these files
    extensions: ['', '.js', '.jsx']
  },

  module: {
    loaders: [
      // Pass *.jsx files through jsx-loader transform
      {
        test: /\.jsx$/,
        loaders: ['react-hot', 'jsx?harmony&stripTypes']
      }
    ]
  },
  devtool: "#inline-source-map",
  externals: { }
};
