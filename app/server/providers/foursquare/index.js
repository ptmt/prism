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
}

module.exports = FoursquareProvider;
