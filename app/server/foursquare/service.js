'use strict';

var fs = require('fs-base');
var Fiber = require('fibers');

var FoursquareService = function (foursquare, options) {
  this.foursquare = foursquare;
  this.options = options || {};
};
FoursquareService.prototype.auth = function (code) {
  function getAccessTokenSync(foursquare, code) {
    var fiber = Fiber.current;
    foursquare.getAccessToken({
      code: code
    }, function (error, accessToken) {
      if (error) {
        fiber.throwInto(error);
      } else {
        fiber.run(accessToken);
      }
    });
    return Fiber.yield();
  }

  this.accessToken = getAccessTokenSync(this.foursquare, code);
};

FoursquareService.prototype.getCheckins = function (offset, limit) {
  offset = offset || 0;
  limit = limit || 250;

  if (this.options.debug) {
    return JSON.parse(
      fs.read('./test/mock/foursquare.' + offset + '-' + limit + '.json')
    );
  } else {
    //  function getCheckinsSync(accessToken) {
    var fiber = Fiber.current;
    this.foursquare.Users.getCheckins('self', {
        offset: offset,
        limit: limit,
        sort: 'oldestfirst'
      }, this.accessToken,
      function (error, checkins) {
        console.log('error', error);
        if (error) {
          fiber.throwInto(error);
        } else {
          fiber.run(checkins);
        }
      });
    return Fiber.yield();
  }
  //  }
};

module.exports = FoursquareService;
