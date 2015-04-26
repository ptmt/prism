/* @flow */

var Player = require('../../models/player').Player;
var Provider = require('../../models/provider');
var Promise = require('bluebird');
var FoursquareService = require('./service.js');
var FoursquareCalculator = require('./calculator');
var _ = require('lodash');
//var moment = require('moment');

/*
 * Entry point for provider
 * must implements required methods
 */
class FoursquareProvider extends Provider {
  name: string;
  checkinsData: any;
  service: FoursquareService;
  calculator: FoursquareCalculator;

  /*
   * Init function which retrieve information from remote endpoint
   * and execute init calculation functions
   */
  init(stats: any, cb: Function) {
    this.name = 'Foursquare';
    this.service = new FoursquareService({
      demo: process.NODE_ENV !== 'production'
    });
    this.calculator = new FoursquareCalculator();

    return new Promise((resolve, reject) => {
      this.service.getCheckins(0, 250, (err, checkins) => {
        this.checkinsData = checkins;
        this.calculator.initFunctions.forEach((initFunc) => {
          initFunc(stats, checkins);
        });
        if (err) {
          reject(err);
        } else {
          resolve(stats);
        }
      });
    });
  }

  calculateNextIteration(stats: any, player: any): ?PrismIteration {
    //console.log(player);
    if (this.checkinsData.checkins.items.length > stats.fs.i) {
      stats.fs.i++;
    } else {
      return null;
    }

    var currentCheckin = this.checkinsData.checkins.items[stats.fs.i - 1];

    this.calculator.calculationFunctions.forEach((calcFunc) => calcFunc(currentCheckin, stats, player));

    return {
      stats: _.cloneDeep(stats),
      currentPoint: this.transformToPoint(currentCheckin),
      player: _.cloneDeep(player),
      key: this.extractKey(currentCheckin)
    };
  }

  transformToPoint(item:any):PrismPoint {
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
  }

  cleanup(iterations: any) {
    for (var key in iterations) {
      var i = iterations[key];
      i.stats.prevprevCheckin = null;
      i.stats.previousCheckin = null;
      i.stats.hottestPlace = this.transformToPoint(i.stats.hottestPlace);
      i.stats.mostPopularCheckin = this.transformToPoint(i.stats.mostPopularCheckin);
      i.stats.mostLikedCheckin = this.transformToPoint(i.stats.mostLikedCheckin);
    }
  }

  extractKey(item: any) {
    return item.createdAt;
  }
}

module.exports = FoursquareProvider;
