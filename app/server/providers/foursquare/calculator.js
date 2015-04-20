/* @flow */

var Player = require('../../models/player').Player;
var ExperienceConstants = require('../../models/constants');

class FoursquareCalculator  {
    calculationFunctions: any;
    initFunctions: any;
    temporary: any;

    constructor() {
      this.calculationFunctions = [];
      this.initFunctions = [];
      this.startRoutines();
      this.inProcessRoutines();
    }

    startRoutines(): void {
      this.initFunctions.push((stats, checkinsData) => {
        stats.fs = stats.fs || {};
        stats.fs.i = 0;
        stats.processedCheckins = 0;
        stats.checkinsSize = checkinsData.checkins.items.length;
        stats.topSpeed = 0;
        stats.avgSpeed = 0;
        stats.avgDistancePerCheckin = 0;
        stats.totalDistance = 0;
        stats.lastDistance = 0;
        stats.avgInterval = 0;
      });
    }

    inProcessRoutines(): void {
      this.calculationFunctions.push(function(currentCheckin, stats, socialPlayer) {
        stats.processedCheckins++;

        if (currentCheckin.venue && currentCheckin.venue.location) {
          currentCheckin.venue.location.colorCode = (765 / stats.checkinsSize * stats.processedCheckins);
          if (stats.previousCheckin && stats.previousCheckin.venue) {
            stats.lastDistance = Math.floor(calculateDistanceBetweenPoints(stats.previousCheckin.venue.location, currentCheckin.venue.location));
          }
        }

        stats.totalDistance += stats.lastDistance;

        if (stats.previousCheckin) {
          stats.avgDistancePerCheckin = Math.floor(stats.totalDistance / (stats.processedCheckins - 1));
          var deltaHours = (currentCheckin.createdAt - stats.previousCheckin.createdAt) / 3600;
          stats.avgInterval = stats.avgInterval ? Math.ceil((stats.avgInterval + deltaHours) / 2) : Math.round(deltaHours);
          stats.currentSpeed = Math.round(stats.lastDistance / deltaHours);
          if (stats.currentSpeed > stats.topSpeed) {
            stats.topSpeed = stats.currentSpeed;
          }
          stats.avgSpeed = Math.round(stats.avgDistancePerCheckin / stats.avgInterval); // not exactly avg speed
          //
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

      this.calculationFunctions.push(function(currentCheckin, stats, socialPlayer) {
        if (currentCheckin.lat != 0 || currentCheckin.lng != 0) {
          if (stats.previousCheckin) {
            stats.prevprevCheckin = JSON.parse(JSON.stringify(stats.previousCheckin));
          }
          stats.previousCheckin = currentCheckin;
        }
      });

      this.addExperienceAccumulationTasks();
    }

    addExperienceAccumulationTasks(): void
    {
      var skill = {
        Sociality: 'sociality',
        Curiosity: 'curiosity'
      }
      this.calculationFunctions.push((currentCheckin, stats, p) =>
      {
        p.apply(skill.Sociality, ExperienceConstants.Foursquare.BASE_CHECKIN, true);
        p.apply(skill.Curiosity, ExperienceConstants.Foursquare.ONE_KILOMETER_PASSED * stats.lastDistance);
        p.apply(skill.Curiosity, ExperienceConstants.Foursquare.CHECKIN_AT_PLACE_WITH_MORE_THAN_100_CHECKINS, currentCheckin.TotalVenueCheckins > 100);
        p.apply(skill.Curiosity, ExperienceConstants.Foursquare.CHECKIN_AT_PLACE_WITH_MORE_THAN_1000_CHECKINS, currentCheckin.TotalVenueCheckins > 1000);
        p.apply(skill.Curiosity, ExperienceConstants.Foursquare.CHECKIN_AT_PLACE_WITH_MORE_THAN_10000_CHECKINS, currentCheckin.TotalVenueCheckins > 10000);
        p.apply(skill.Sociality, ExperienceConstants.Foursquare.ONE_LIKE_TO_CHECKIN * currentCheckin.LikesCount);
        p.apply(skill.Sociality, ExperienceConstants.Foursquare.MAYORSHIP_CHECKIN, currentCheckin.IsMayor);
        p.apply(skill.Sociality, ExperienceConstants.Foursquare.ONE_COMMENT_TO_CHECKIN * currentCheckin.CommentsCount);
        p.apply(skill.Sociality, ExperienceConstants.Foursquare.CHECKIN_WITH_PHOTO * currentCheckin.PhotosCount);

        p.apply(skill.Curiosity, ExperienceConstants.Foursquare.CHECKIN_AT_PLACE_REMOTE_FROM_LAST_AT_1000KM, stats.LastDistance > 1000);
        p.apply(skill.Curiosity, ExperienceConstants.Foursquare.CHECKIN_AT_PLACE_REMOTE_FROM_LAST_AT_5000KM, stats.LastDistance > 5000);
        p.apply(skill.Curiosity, ExperienceConstants.Foursquare.CHECKIN_AT_PLACE_REMOTE_FROM_LAST_AT_10000KM, stats.LastDistance > 10000);
        p.apply(skill.Curiosity, ExperienceConstants.Foursquare.CHECKIN_WITH_TOP_SPEED_MORE_THAN_100KMH, stats.topSpeed > 100);
        p.apply(skill.Curiosity, ExperienceConstants.Foursquare.CHECKIN_WITH_TOP_SPEED_MORE_THAN_500KMH, stats.topSpeed > 500);
        p.apply(skill.Curiosity, ExperienceConstants.Foursquare.CHECKIN_AT_JUST_CREATED_PLACE, currentCheckin.TotalVenueCheckins == 0);
        //console.log('PLAYER', ExperienceConstants, p);
      });
  }
}

module.exports = FoursquareCalculator;


function toRad(angle) {
  return Math.PI * angle / 180.0;
}

function calculateDistanceBetweenPoints(previous, current) {
  if (!previous) return 0;
  if (current.lat == 0 && current.lng == 0) return 0;
  //console.log('calculate distanse between points', previous, current);
  var R = 6371; // radius in km
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
