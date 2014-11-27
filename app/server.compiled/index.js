/* @flow */
var rest = require('connect-rest');
var foursquarePrism = require('./foursquare');

module.exports = function()             {
  'use strict';
  return [rest.rester()];
};

rest.get('/api/foursquare/iterate', foursquarePrism.iterate);
