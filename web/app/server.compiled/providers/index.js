var fs = require('fs');
var path = require('path');
var providers = [];
/*
 * Scan all folders in ./providers directory and autoload it as providers
 */
fs
.readdirSync(__dirname)
.filter(function (file) {
  return (file.indexOf('.') === -1 && file.indexOf('skip') === -1);
})
.forEach(function (file) {
  var Provider = require(path.join(__dirname, file));
  var provider = new Provider();
  providers.push(provider);
});

module.exports = providers;
