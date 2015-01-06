/* @flow */

var Player = require('../../models/player').Player;
var Provider = require('../../models/provider');
var Promise = require('bluebird');
var FoursquareService = require('./service.js');
var FoursquareCalculator = require('./calculator');

/*
 * Entry point for provider
 * must implements required methods
 */
class FoursquareProvider extends Provider {
  checkinsData: any;
  service: FoursquareService;
  calculator: FoursquareCalculator;

  /*
   * Init function which retrieve information from remote endpoint
   * fill the local cache and execute init calculation functions
   */
  init(stats, cb) {
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
    console.log(player);
    if (this.checkinsData.checkins.items.length > stats.fs.i) {
      stats.fs.i++;
    } else {
      return null;
    }

    var currentCheckin = this.checkinsData.checkins.items[stats.fs.i - 1];

    this.calculator.calculationFunctions.forEach((calcFunc) => calcFunc(currentCheckin, stats, player));

    return {
      stats: stats,
      currentPoint: this.transformToPoint(currentCheckin),
      player: player
    };
  }

  transformToPoint(item:any):PrismPoint {
    return {
      source: 'Foursquare'
    }
  }
}

module.exports = FoursquareProvider;
