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
        stats.fs.topClients = {};
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

      /// MOST LIKED & MOST POPULAR
      this.calculationFunctions.push((currentCheckin, stats, socialPlayer) => {
        currentCheckin.likesCount = currentCheckin.likes.count || 0;
        currentCheckin.commentsCount = currentCheckin.comments.count || 0;
        currentCheckin.totalVenueCheckins = currentCheckin.venue ?
          currentCheckin.venue.stats.checkinsCount :
          0;
        if (stats.mostLikedCheckin == null) stats.mostLikedCheckin = currentCheckin;
        if (stats.mostPopularCheckin == null) stats.mostPopularCheckin = currentCheckin;
        if (stats.mostPopularCheckin.likesCount < currentCheckin.likesCount)
          stats.mostLikedCheckin = currentCheckin;
        if (stats.mostPopularCheckin.totalVenueCheckins < currentCheckin.totalVenueCheckins)
          stats.mostPopularCheckin = currentCheckin;
      });

      /// MY HOTTEST PLACE
      this.calculationFunctions.push((currentCheckin, stats, socialPlayer) =>
      {
         // current
         // rate = my_checkins * total_in_venue
         // TODO: calibrate it

         currentCheckin.myVenueCheckins = currentCheckin.venue &&  currentCheckin.venue.beenHere ? currentCheckin.venue.beenHere.count : 0;
         currentCheckin.t1Rate = currentCheckin.myVenueCheckins * currentCheckin.totalVenueCheckins;
         if (stats.hottestPlace == null) stats.hottestPlace = currentCheckin;
         if (stats.hottestPlace.t1Rate < currentCheckin.t1Rate) stats.hottestPlace = currentCheckin;
      });

      /// MY TOP CLIENT
      this.calculationFunctions.push((currentCheckin, stats, socialPlayer) =>
      {
        var clientName = currentCheckin.source.name;
        if (stats.fs.topClients[clientName]) {
          stats.fs.topClients[clientName]++;
        } else {
          stats.fs.topClients[clientName] = 1;
          socialPlayer.apply('geeks', ExperienceConstants.Foursquare.CHECKIN_WITH_NEW_FOURSQUARE_CLIENT);
          socialPlayer.achieve(currentCheckin.createdAt, "Check-in with a new client: " + clientName);
        }
        var sortable = [];
        for (var k in stats.fs.topClients) {
          sortable.push([k, stats.fs.topClients[k]])
        }
        sortable.sort(function(a, b) {return b[1] - a[1]})
        stats.fs.clients = sortable.map(function(s) {
          return s[0] + '(' + s[1] + ')';
        }).join(', ')
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
        p.apply(skill.Curiosity, ExperienceConstants.Foursquare.CHECKIN_AT_PLACE_WITH_MORE_THAN_100_CHECKINS, currentCheckin.totalVenueCheckins > 100);
        p.apply(skill.Curiosity, ExperienceConstants.Foursquare.CHECKIN_AT_PLACE_WITH_MORE_THAN_1000_CHECKINS, currentCheckin.totalVenueCheckins > 1000);
        p.apply(skill.Curiosity, ExperienceConstants.Foursquare.CHECKIN_AT_PLACE_WITH_MORE_THAN_10000_CHECKINS, currentCheckin.totalVenueCheckins > 10000);
        p.apply(skill.Sociality, ExperienceConstants.Foursquare.ONE_LIKE_TO_CHECKIN * currentCheckin.likesCount);
        p.apply(skill.Sociality, ExperienceConstants.Foursquare.MAYORSHIP_CHECKIN, currentCheckin.isMayor);
        p.apply(skill.Sociality, ExperienceConstants.Foursquare.ONE_COMMENT_TO_CHECKIN * currentCheckin.commentsCount);
        p.apply(skill.Sociality, ExperienceConstants.Foursquare.CHECKIN_WITH_PHOTO * currentCheckin.photosCount);

        p.apply(skill.Curiosity, ExperienceConstants.Foursquare.CHECKIN_AT_PLACE_REMOTE_FROM_LAST_AT_1000KM, stats.lastDistance > 1000);
        p.apply(skill.Curiosity, ExperienceConstants.Foursquare.CHECKIN_AT_PLACE_REMOTE_FROM_LAST_AT_5000KM, stats.lastDistance > 5000);
        p.apply(skill.Curiosity, ExperienceConstants.Foursquare.CHECKIN_AT_PLACE_REMOTE_FROM_LAST_AT_10000KM, stats.lastDistance > 10000);
        p.apply(skill.Curiosity, ExperienceConstants.Foursquare.CHECKIN_WITH_TOP_SPEED_MORE_THAN_100KMH, stats.topSpeed > 100);
        p.apply(skill.Curiosity, ExperienceConstants.Foursquare.CHECKIN_WITH_TOP_SPEED_MORE_THAN_500KMH, stats.topSpeed > 500);
        p.apply(skill.Curiosity, ExperienceConstants.Foursquare.CHECKIN_AT_JUST_CREATED_PLACE, currentCheckin.totalVenueCheckins == 0);
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
