/* global alert, window, document, XMLHttpRequest */
'use strict';

function getJson(url, callback) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);

  request.onload = function () {
    if (request.status === 200) {
      console.log(request);
      callback(null, JSON.parse(request.responseText));
    } else {
      // We reached our target server, but it returned an error
      callback('error');
    }
  };

  request.onerror = function () {
    // There was a connection error of some sort
    callback('error');
  };

  request.send();
}

function nextIteration() {
  getJson('/api/v1/foursquare/iterate', function (err, data) {
    // check if session is expired
    if (err || !(data.live) || (!data.player)) {
      window.localStorage.setItem('auth', false);
      document.location.href = '/';
    }
    console.log(data.currentCheckin);
    // draw a point
    if (data.currentCheckin.LocationLat != 0) {
      var loc = new MM.Location(data.CurrentCheckin.LocationLat, data.CurrentCheckin
        .LocationLng);
      loc.isMayor = data.CurrentCheckin.IsMayor;
      loc.colorCode = encodeToColor((data.Live.i + data.Response.Offset),
        data.Response.Count);
      loc.radius = loc.isMayor ? 80 : 40;
      loc.radius = data.CurrentCheckin.MyVenueCheckins + loc.radius;
      pathlayer.addLocation(loc);
      spotlayer.addLocation(loc);
    }
  });
}

module.exports.start = function () {
  nextIteration();
};
