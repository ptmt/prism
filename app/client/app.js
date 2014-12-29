/* @flow */
/* global document, window */
'use strict';

var maps = require('./map');
//var foursquareClient = require('./FoursquareClient');
var React = require('react');
var WelcomeWindow = require('./components/WelcomeWindow.react');
var TopToolbar = require('./components/TopToolbar.react');
var appActions = require('./actions')

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
    React.render(<TopToolbar />, document.querySelector('.toolbar-container'));
    appActions.startFoursquare(map, layer);
  } else {
    React.render(
      <WelcomeWindow />,
      document.querySelector('.signup-form-container')
    );
    //document.querySelectorAll('.signup-form')[0].style.display = 'block';
  }
});
