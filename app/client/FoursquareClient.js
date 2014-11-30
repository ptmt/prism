/* global window, document, XMLHttpRequest */
/* @flow */
'use strict';
var path = require('./map/path');

function getJson(url, callback) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);

  request.onload = function() {
    if (request.status === 200) {
      var json = JSON.parse(request.responseText);
      if (json.error) {
        return callback(json.error);
      }
      callback(null, json);
    } else {
      // We reached our target server, but it returned an error
      callback('error:' + request.responseText);
    }
  };

  request.onerror = function() {
    // There was a connection error of some sort
    callback('error');
  };

  request.send();
}

function nextIteration(m, l) {
  var isDebug = window.localStorage.getItem('debug') === 'true';
  getJson('/api/foursquare/iterate?debug=' + isDebug, function(err, data) {
    // check if session is expired
    if (err || !(data.live) || (!data.player)) {
      window.localStorage.setItem('auth', false);
      document.location.href = '/?logout';
      return;
    }
    console.log(data.live);
    // draw a point
    if (data.currentCheckin) {
      if (data.currentCheckin.venue && data.currentCheckin.venue.location
        .lat) {
        l.addPoint([data.currentCheckin.venue.location.lat,
          data.currentCheckin.venue.location.lng, 1.5
        ]);
        if (!m.getBounds().contains(l.bounds20)) {
          m.fitBounds(l.bounds20, {
            animate: true
          });
        }
        path.drawLine(data.currentCheckin.venue.location,
          data.live.previousCheckin.venue.location, m);
      }
      setTimeout(function() {
        nextIteration(m, l);
      }, 1000);

    }

  });
}

module.exports.start = function(m, l) {
  nextIteration(m, l);
};
