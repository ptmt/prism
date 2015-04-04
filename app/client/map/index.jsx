/* @flow */
/* global window, document */
var L = require('leaflet');
var MaskLayer = require('./mask.layer');
require('./tile.stamen').extendL(L);
require('./leaflet.lineext.js')(L);

module.exports.initMaskedLayer = function(): L.LeafletLayer {
  'use strict';

  return new MaskLayer(L, {
    debug:true,
    radius: 500, // radius in pixels or in meters (see useAbsoluteRadius)
    useAbsoluteRadius: true, // true: r in meters, false: r in pixels
    color: '#000', // the color of the layer
    opacity: 0.8, // opacity of the not covered area
    noMask: false, // true results in normal (filled) circled, instead masked circles
    lineColor: 'rgba(10,10,10,.1)' // color of the circle outline if noMask is true
  });
};

module.exports.initMap = function (): L.LeafletMap {
  'use strict';

  var map = L.map('map').setView([55.0398, 82.902], 13);
  map.addLayer(new L.StamenTileLayer('watercolor'));
  return map;

};
