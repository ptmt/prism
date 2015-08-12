/* @flow */

var Player = require('../../models/player').Player;
var Provider = require('../../models/provider');
var Promise = require('bluebird');
var _ = require('lodash');
var InstagramClient = require('./client.js');
// var FoursquareCalculator = require('./calculator');

//var moment = require('moment');

/*
 * Entry point for provider
 * must implements required methods
 */

module.exports = (function(){for(var Provider____Key in Provider){if(Provider.hasOwnProperty(Provider____Key)){InstagramProvider[Provider____Key]=Provider[Provider____Key];}}var ____SuperProtoOfProvider=Provider===null?null:Provider.prototype;InstagramProvider.prototype=Object.create(____SuperProtoOfProvider);InstagramProvider.prototype.constructor=InstagramProvider;InstagramProvider.__superConstructor__=Provider;
                    
  // service: FoursquareService;
  // calculator: FoursquareCalculator;

  function InstagramProvider() {"use strict";
    this.name = "Instagram";
  }

  /*
   * Init function which retrieve information from remote endpoint
   * and execute init calculation functions
   */
  InstagramProvider.prototype.init=function(stats     , accessToken)         {"use strict";
    this.client = new InstagramClient({
      accessToken: accessToken
    });
    this.calculator = new FoursquareCalculator();

    return new Promise(function(resolve, reject)  {
      this.service.fetchAllData().then(function(checkins)  {
        this.checkinsData = checkins;
        this.calculator.initFunctions.forEach(function(initFunc)  {
          initFunc(stats, checkins);
        });
        resolve(stats);
      }.bind(this));
    }.bind(this));
  };

  InstagramProvider.prototype.calculateNextIteration=function(stats     , player)                       {"use strict";
    //console.log(player);
    if (this.checkinsData.length > stats.fs.i) {
      stats.fs.i++;
    } else {
      return null;
    }

    var currentCheckin = this.checkinsData[stats.fs.i - 1];

    this.calculator.calculationFunctions.forEach(function(calcFunc)  {return calcFunc(currentCheckin, stats, player);});

    return {
      stats: _.cloneDeep(stats),
      currentPoint: this.transformToPoint(currentCheckin),
      player: _.cloneDeep(player),
      key: this.extractKey(currentCheckin)
    };
  };

  InstagramProvider.prototype.transformToPoint=function(item)                {"use strict";
    //console.log(item);
    if (item.posts.count > 0) {
      //console.log(item.posts);
      //return false;
    }
    var caption = item.venue ? item.venue.name : '<deleted>';
    if (item.shout) {
      caption += ' // ' + item.shout;
    }
    return {
      name: item.venue ? item.venue.name : '<deleted>',
      caption: caption,
      lat: item.venue ? item.venue.location.lat : 0,
      lng: item.venue ? item.venue.location.lng : 0,
      r: 1,
      photo: item.photos.count > 0 ?item.photos.items[0].prefix + '680x680' + item.photos.items[0].suffix : '',
      likes: item.likesCount,
      comments: item.commentsCount,
      source: 'Foursquare'
    }
  };

  InstagramProvider.prototype.cleanup=function(iterations)      {"use strict";
    for (var key in iterations) {
      var i = iterations[key];
      i.stats.prevprevCheckin = null;
      i.stats.previousCheckin = null;
      i.stats.hottestPlace = this.transformToPoint(i.stats.hottestPlace);
      i.stats.mostPopularCheckin = this.transformToPoint(i.stats.mostPopularCheckin);
      i.stats.mostLikedCheckin = this.transformToPoint(i.stats.mostLikedCheckin);
    }
  };

  InstagramProvider.prototype.extractKey=function(item)      {"use strict";
    return item.createdAt;
  };
return InstagramProvider;})()
