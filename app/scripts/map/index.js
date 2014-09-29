/* global window, document */
var L = require('leaflet');
var MaskLayer = require('./mask.layer');
require('./tile.stamen').extendL(L);

module.exports.initMaskedLayer = function() {
  return new MaskLayer(L, {
    debug:true,
    radius: 200, // radius in pixels or in meters (see useAbsoluteRadius)
    useAbsoluteRadius: true, // true: r in meters, false: r in pixels
    color: '#000', // the color of the layer
    opacity: 0.8, // opacity of the not covered area
    noMask: false, // true results in normal (filled) circled, instead masked circles
    lineColor: 'rgba(10,10,10,.1)' // color of the circle outline if noMask is true
  });
}
module.exports.init = function () {
  'use strict';

  function getSize() {
    return new MM.Point(window.innerWidth, window.innerHeight);
  }

  function resize() {
    try {
      size = getSize();
      if (mapObject) {
        mapObject.setSize(size);
      }
    } catch (e) {}
  }

  var map = L.map('map').setView([55.0398, 82.902], 13);
  //   L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  //     attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  // }).addTo(map);
  //var layer = new L.StamenTileLayer('watercolor');
  map.addLayer(new L.StamenTileLayer('toner'));

  //maskedLayer.setData([[55.03, 82.9,1], [55.03, 82.899]]);
  //console.log(L.TileLayer.MaskCanvas);
  //map.addLayer(maskedLayer);\
  return map;

  // var mapInDom = document.querySelectorAll('.map-container')[0],
  //   size = getSize(),
  //   providerName = mapInDom.getAttribute('data-provider'),
  //   provider = new MM.StamenTileLayer(providerName);
  //
  // var spotlayer = new SpotlightLayer();
  // var pathlayer = new PathLayer();
  // //var doc = document.documentElement;
  //
  //
  // MM.addEvent(window, 'resize', resize);
  //
  // var mapObject = new MM.Map(mapInDom[0], provider, size, [new MM.DragHandler(),
  //   new MM.DoubleClickHandler(), new MM.TouchHandler(), new MM.MouseWheelHandler()
  //   ]);
  //
  // mapObject.autoSize = true;
  // mapObject.addLayer(pathlayer);
  // mapObject.addLayer(spotlayer);
  //
  // //var didSetLimits = provider.setCoordLimits(mapObject);
  //
  // mapObject.setCenterZoom(new MM.Location(55.0398, 82.902), 12);

  //var hasher = new MM.Hash(mapObject);

};
