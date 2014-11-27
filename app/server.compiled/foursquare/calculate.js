var FoursquareCalculating = function() {
  this.calculationFunctions = [];
  this.initFunctions = [];
  this.startRoutines();
  this.endRoutines();
};

module.exports = FoursquareCalculating;

FoursquareCalculating.prototype.startRoutines = function() {

  this.initFunctions.push(function(stats) {
    stats.i = 0;
    stats.totalCheckins = 0;
    stats.topSpeed = 0;
    stats.avgSpeed = 0;
    stats.avgDistancePerCheckin = 0;
  });

  this.calculationFunctions.push(function(currentCheckin, stats, socialPlayer) {
    if (currentCheckin.venue && currentCheckin.venue.location) {
      currentCheckin.venue.location.colorCode = stats.i;
    }
    stats.totalCheckins++;
    stats.lastDistance = calculateDistanceBetweenPoints(stats.previousCheckin,
      currentCheckin);
    stats.TotalDistance += stats.LastDistance;
    stats.avgDistancePerCheckin = stats.TotalDistance / stats.totalCheckins;
    if (stats.PreviousCheckin != null) {
      // var deltaTime = (currentCheckin.CreatedAt - stats.previousCheckin.CreatedAt);
      // if (Math.Abs(delta.TotalMinutes) > 0)
      // {
      //     stats.KeyValue["CurrentSpeed"] = (double)stats.LastDistance / Math.Abs(delta.TotalMinutes) * 60d;
      //     if ((double)stats.KeyValue["CurrentSpeed"] > (double)stats.KeyValue["TopSpeed"])
      //         stats.KeyValue["TopSpeed"] = stats.KeyValue["CurrentSpeed"];
      //     stats.KeyValue["AvgSpeed"] = ((double)stats.KeyValue["AvgSpeed"] + (double)stats.KeyValue["CurrentSpeed"]) / 2;
      // }
    }
  });
}

FoursquareCalculating.prototype.endRoutines = function() {
  this.calculationFunctions.push(function(currentCheckin, stats, socialPlayer) {
    if (currentCheckin.lat != 0 || currentCheckin.lng != 0)
      stats.previousCheckin = currentCheckin;
  });
}

function toRad(angle) {
  return Math.PI * angle / 180.0;
}

function calculateDistanceBetweenPoints(previous, current) {
  if (previous == null) return 0;
  if (current.lat == 0 && current.lng == 0) return 0;

  var R = 6371; // km
  var dLat = toRad(current.lat - previous.lat);
  var dLon = toRad(current.lng - previous.lng);
  var lat1 = toRad(current.lat);
  var lat2 = toRad(previous.lat);

  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
}
