/* @flow */

var CONF = require('config');
var fs = require('fs');
var Promise = require('bluebird');

module.exports = (function(){
                     
                      
               
  function FoursquareClient(options)       {"use strict";
    this.foursquareApi = require('node-foursquare')({
      'secrets': {
        'clientId': CONF.foursquare.clientId,
        'clientSecret': CONF.foursquare.clientSecret,
        'redirectUrl': CONF.app.host + '/api/v1/auth/foursquare_callback'
      },
      'winston' : {
        'loggers': {
           'core': {
             'console': {
               'level': 'warn'
             }
           },
           'venues': {
             'console': {
               'level': 'debug'
             }
           }
         }
      }
    });
    this.options = options || {};
  }

  FoursquareClient.prototype.getFoursquareUrl=function(){"use strict";
    return this.foursquareApi.getAuthClientRedirectUrl();
  };

  FoursquareClient.prototype.auth=function(code)      {"use strict";
    return new Promise(function(resolve, reject)  {
        this.foursquareApi.getAccessToken({
        code: code
      }, function(error, accessToken)  {
        this.accessToken = accessToken;
        if (error) {
          console.log('auth error', error);
          reject(error.message);
        } else {
          resolve(accessToken);
        }
      }.bind(this));
    }.bind(this));
  };

  FoursquareClient.prototype.getCheckins=function(offset        , limit        , callback)                                         {"use strict";
    offset = offset || 0;
    limit = limit || 250;
    if (!this.options.accessToken) {
      callback(null, JSON.parse(
        fs.readFileSync(__dirname + '/../../../../test/mock/foursquare.' + offset + '-' + limit + '.json')
      )); // TODO: move tests and mocks inside providers
    } else {
      var accessToken = this.options.accessToken;
      this.foursquareApi.Users.getCheckins('self', {
        offset: offset,
        limit: limit,
        sort: 'oldestfirst'
      }, accessToken,
      function(err, checkins) {
        //console.log(accessToken, err, checkins);
        fs.writeFile(__dirname + '/../../../../test/mock/foursquare.' + offset + '-' + limit + '.json',
          JSON.stringify(checkins));
        callback(err, checkins);
      });
    }
  };

  FoursquareClient.prototype.getCheckinsWrapper=function(i, allCheckins, cb) {"use strict";
    this.getCheckins(i, 250, function(err, checkins)  {
      if (err) {
        console.log('err', err);
        cb(err);
      } else {
        if (checkins.checkins.items.length < 250) {
          cb(null, allCheckins.concat(checkins.checkins.items));
        } else {
          this.getCheckinsWrapper(i + 250, allCheckins.concat(checkins.checkins.items), cb)
        }

      }
    }.bind(this));
  };

  FoursquareClient.prototype.fetchAllData=function() {"use strict";
    return new Promise(function(resolve, reject)  {
      return this.getCheckinsWrapper(0, [], function(err, allCheckins)  {
        if (err) {
          reject(err);
        } else {
          console.log('fetched', allCheckins.length, 'checkins');
          resolve(allCheckins);
        }
      });
    }.bind(this));
  };

return FoursquareClient;})()
