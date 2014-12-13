/* @flow */
var rest = require('connect-rest');
var foursquarePrism = require('./foursquare');

module.exports = function(): Array<any> {
  'use strict';
  return [
  	function log(req, res, next) {
  	  console.log(req.method, '->', new Date(), req.url);
  	  next();
  	},
  	rest.rester(),
  	function onerror(err, req, res, next) {
  	  console.log(err);
  	  next();
  	}];
};

rest.get('/api/foursquare/iterate', foursquarePrism.iterate);
