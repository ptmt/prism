/* @flow */
var CONF = require('config');
var FoursquareService = require('./service');
var FoursquareCalculator = require('./calculator');
var config = {
  'secrets': {
    'clientId': CONF.foursquare.clientId,
    'clientSecret': CONF.foursquare.clientSecret,
    'redirectUrl': CONF.app.host + '/api/v1/foursquare/callback'
  }
};
var async = require('async');
var foursquareLib = require('node-foursquare')(config);
var service = new FoursquareService(foursquareLib, {
  debug: process.NODE_ENV !== 'production'
}),
calculator = new FoursquareCalculator();

class Cache {
  live: any;
  player: any;
  checkinsData: any;
  init(service: FoursquareService, calculator: FoursquareCalculator, callback: Function):void {
    this.live = {};
    this.player = {};
    this.live.i = 0;
    service.getCheckins(0, 250, (err, checkins) => {
      this.checkinsData = checkins;
      calculator.initFunctions.forEach((initFunc) => {
        initFunc(this.live);
      });
      callback();
    });
  }
}

class Request {
  query: any;
}

// because core.js Error
class HttpError extends Error {
  statusCode: number;
}

var cache = new Cache();

module.exports.iterate = function(req: Request, content: any, render: () => void): void {
  async.waterfall([
    function check(cb) {
      if (!cache.checkinsData) {
        if (req.query.debug) {
          cache.init(service, calculator, cb);
        } else {
          var error = new HttpError('Session expired');
          error.statusCode = 401;
          return cb(error);
        }
      } else {
        cb();
      }
    }, function calculateData(cb) {
      var currentCheckin = cache.checkinsData.checkins.items[cache.live.i];

      calculator.calculationFunctions.forEach(function(calcFunc) {
        calcFunc(currentCheckin, cache.live, cache.player); //currentCheckin, stats, socialPlayer
      });

      if (cache.checkinsData.checkins.items.length > cache.live.i) {
        cache.live.i++;
      } else {
        return cb(null, {
          final: 'final'
        });
      }

      return cb(null, {
        live: cache.live,
        currentCheckin: currentCheckin,
        player: cache.player
      });

    }
  ], function (err, data) {
    render(err, data);
  });

}
