/* @flow */
var L = require('leaflet');

type Point = {
  lat: string;
  lng: string;
  colorCode: number;
}
module.exports.drawLine = function(colorCode: number, point: Point, prevpoint: Point, map: L.LeafletMap) {
  //console.log(point, prevpoint);
  //var p1 = map.coordinatePoint(point.coord);
  //var p2 = map.coordinatePoint(prevpoint.coord);

  var red = Math.round(colorCode);
  if (red > 255) red = 255;
  var green = Math.round(colorCode - 255);
  if (green < 0) green = 0;
  if (green > 255) green = 255;
  var blue = Math.round(colorCode - 510);
  if (blue < 0) blue = 0;
  if (blue > 255) blue = 255;
  var color = 'rgb(' + red + ',' + green + ',' + blue + ')';
  //if (typeof this.ctx.setLineDash == 'function')
  //  this.ctx.setLineDash([5]);
  var polyline = L.polyline([
  ], {
    color: color,
    weight: 2,
    opacity: 0.3
  });
  polyline.addTo(map);
  // [prevpoint.lat, prevpoint.lng],
  // [point.lat, point.lng]
  //var i = 0;
  //polyline.addLatLng(L.latLng(prevpoint.lat, prevpoint.lng));

  var i = 0;
  nextStep(polyline, prevpoint, point, i);

  //polyline.showExtremities('arrowM');

};

function nextStep(polyline, p1, p2, i) {
  var RENDER_FRAMES = 10;
  requestAnimationFrame(() => {
    polyline.addLatLng(
      L.latLng(
        p1.lat + i*(p2.lat - p1.lat)/RENDER_FRAMES,
        p1.lng + i*(p2.lng - p1.lng)/RENDER_FRAMES));
    if (i < RENDER_FRAMES) {
      nextStep(polyline, p1, p2, i+1)
    }
  });
}
