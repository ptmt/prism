/* global window, document, XMLHttpRequest */
'use strict';
//var map = require('./map');
//var maskedLayer = require('./map').initMaskedLayer();

function getJson(url, callback) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);

  request.onload = function () {
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

  request.onerror = function () {
    // There was a connection error of some sort
    callback('error');
  };

  request.send();
}

function nextIteration(m, l) {
  getJson('/api/v1/foursquare/iterate', function (err, data) {
    // check if session is expired
    if (err || !(data.live) || (!data.player)) {
      window.localStorage.setItem('auth', false);
      document.location.href = '/';
      return;
    }
    console.log(data.currentCheckin);
    // draw a point
    if (data.currentCheckin) {
      if (data.currentCheckin.venue && data.currentCheckin.venue.location.lat) {
        l.addPoint([data.currentCheckin.venue.location.lat,
        data.currentCheckin.venue.location.lng, 1.5]);
        if (!m.getBounds().contains(l.bounds20)) {
          m.fitBounds(l.bounds20, {
            animate: true
          });
        }
        // if (l.bounds20) {
        //   m.panInsideBounds(l.bounds20, {
        //     animate: true
        //   });
        // }
        // if (l.centerView) {
        //   m.setView(l.centerView, 12, {
        //     animate: true
        //   });
        // }
        //console.log(this.bounds.getSouthWest(), bounds.getNorthEast());
        // var loc = new MM.Location(data.CurrentCheckin.LocationLat, data.CurrentCheckin
        //   .LocationLng);
        // loc.isMayor = data.CurrentCheckin.IsMayor;
        // loc.colorCode = encodeToColor((data.Live.i + data.Response.Offset),
        //   data.Response.Count);
        // loc.radius = loc.isMayor ? 80 : 40;
        // loc.radius = data.CurrentCheckin.MyVenueCheckins + loc.radius;
        // pathlayer.addLocation(loc);
        // spotlayer.addLocation(loc);
        //m.addLayer(maskedLayer);
      }
      //setTimeout(function() {
      nextIteration(m, l);
      //}, 500);

    }

  });
}

module.exports.start = function (m, l) {
  nextIteration(m, l);
};
