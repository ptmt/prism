/* @flow */
var L = require('Leaflet');

type Point = {
  lat: string;
  lng: string;
  colorCode: number;
}
module.exports.drawLine = function(point: Point, prevpoint: Point, map: L.LeafletMap) {

  //var p1 = map.coordinatePoint(point.coord);
  //var p2 = map.coordinatePoint(prevpoint.coord);

  var red = Math.round(point.colorCode);
  if (red > 255) red = 255;
  var green = Math.round(point.colorCode - 255);
  if (green < 0) green = 0;
  if (green > 255) green = 255;
  var blue = Math.round(point.colorCode - 510);
  if (blue < 0) blue = 0;
  if (blue > 255) blue = 255;
  var color = 'rgb(' + red + ',' + green + ',' + blue + ')';
  //if (typeof this.ctx.setLineDash == 'function')
  //  this.ctx.setLineDash([5]);
  var polyline = L.polyline([
    [prevpoint.lat, prevpoint.lng],
    [point.lat, point.lng]
  ], {
    color: color,
    weight: 2,
    opacity: 0.3
  });

  polyline.addTo(map);
  polyline.showExtremities('arrowM');

};
