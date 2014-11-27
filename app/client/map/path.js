module.exports.drawLine = function(point, prevpoint, map) {

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
  console.log(color, prevpoint, point);
  var path = L.polyline([
    [prevpoint.lat, prevpoint.lng],
    [point.lat, point.lng]
  ], {
    color: color,
    weight: 1,
    opacity: 0.3
  }).addTo(map);

  path.showExtremities('arrowM');

};
