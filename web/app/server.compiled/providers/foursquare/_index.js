/* flow */
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
var Player = require('../models/player').Player;
var async = require('async');
var foursquareLib = require('node-foursquare')(config);
var service = new FoursquareService(foursquareLib, {
  debug: process.NODE_ENV !== 'production'
}),
calculator = new FoursquareCalculator();

function Cache(){"use strict";}
            
              
                    
  Cache.prototype.init=function(service                   , calculator                      , callback)                {"use strict";
    this.live = {};
    this.player = new Player();
    this.live.i = 0;
    service.getCheckins(0, 250, function(err, checkins)  {
      this.checkinsData = checkins;
      calculator.initFunctions.forEach(function(initFunc)  {
        initFunc(this.live, checkins);
      }.bind(this));
      callback();
    }.bind(this));
  };


function Request(){"use strict";}
             


// because core.js Error
for(var Error____Key in Error){if(Error.hasOwnProperty(Error____Key)){HttpError[Error____Key]=Error[Error____Key];}}var ____SuperProtoOfError=Error===null?null:Error.prototype;HttpError.prototype=Object.create(____SuperProtoOfError);HttpError.prototype.constructor=HttpError;HttpError.__superConstructor__=Error;function HttpError(){"use strict";if(Error!==null){Error.apply(this,arguments);}}
                     


var cache = new Cache();

module.exports.iterate = function(req         , content     , render            )       {
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

      if (cache.checkinsData.checkins.items.length > cache.live.i) {
        cache.live.i++;
      } else {
        return cb(null, {
          final: 'final'
        });
      }

      var currentCheckin = cache.checkinsData.checkins.items[cache.live.i - 1];

      calculator.calculationFunctions.forEach(function(calcFunc)  {return calcFunc(currentCheckin, cache.live, cache.player);});

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
