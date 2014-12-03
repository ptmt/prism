/* @flow */
/* global document, window */
'use strict';

var maps = require('./map');
var foursquareClient = require('./FoursquareClient');

document.addEventListener('DOMContentLoaded', function() {
  var map = maps.getMap();
  var layer = maps.initMaskedLayer();
  var isAuth = window.localStorage.getItem('auth') === 'true';
  var isDebug = window.localStorage.getItem('debug') === 'true' && document.location.href.indexOf('logout') === -1;

  layer.setData([]);
  map.addLayer(layer);
  if (document.location.href.indexOf('start') > -1) {
    window.localStorage.setItem('auth', true);
  }
  if (isAuth || isDebug) {
    foursquareClient.start(map, layer);
  } else {
    document.querySelectorAll('.signup-form')[0].style.display = 'block';
  }
});
