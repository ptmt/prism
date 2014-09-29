'use strict';

var Application = require('stick').Application;
var app = exports.app = new Application();
var CONF = require('config');

app.configure('notfound', 'params', 'route', 'static');
app.static('dist', 'index.html');

var utils = require('./utils');
var config = {
  'secrets': {
    'clientId': CONF.foursquare.clientId,
    'clientSecret': CONF.foursquare.clientSecret,
    'redirectUrl': CONF.app.host + '/api/v1/foursquare/callback'
  }
};

var foursquareLib = require('node-foursquare')(config);
var FoursquareService = require('./foursquare/service');
var fq = new FoursquareService(foursquareLib, {
  debug: process.NODE_ENV !== 'production'
});

app.get('/api/v1/foursquare/signin', function () {
  return utils.redirect(foursquareLib.getAuthClientRedirectUrl());
});

app.get('/api/v1/foursquare/callback', function (req) {
  fq.auth(req.queryParams.code);
  app.cache = {};
  app.cache.live = {};
  app.cache.player = {};
  app.cache.live.i = 0;
  app.cache.checkinsData = fq.getCheckins();
  return utils.redirect('/?start');
});

app.get('/api/v1/foursquare/iterate', function () {
  if (!app.cache) {
    return utils.json({error: 'Session is expired'});
  }
  var currentCheckin = app.cache.checkinsData.checkins.items[app.cache.live.i];
  if (app.cache.checkinsData.checkins.items.length > app.cache.live.i) {
    app.cache.live.i++;
  } else {
    app.cache.live.i = 0;
  }

  return utils.json({
    live: app.cache.live,
    currentCheckin: currentCheckin,
    player: app.cache.player
  });
});
