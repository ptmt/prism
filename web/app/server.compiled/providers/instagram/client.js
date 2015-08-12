/* @flow */

var CONF = require('config');
var fs = require('fs');
var Promise = require('bluebird');

module.exports = (function(){
                    
                      
               
  function InstagramClient(options)       {"use strict";

    this.instagramApi = require('instagram-node').instagram();
    this.instagramApi.use({
      client_id: CONF.instagram.clientId,
      client_secret: CONF.instagram.clientSecret,
      redirect_uri: CONF.app.host + '/api/v1/auth/instagram_callback'
    });
    this.options = options || {};
  }

  InstagramClient.prototype.getInstagramUrl=function(){"use strict";
    return this.instagramApi.get_authorization_url(CONF.app.host + '/api/v1/auth/instagram_callback');
  };

  InstagramClient.prototype.auth=function(code)      {"use strict";
    return new Promise(function(resolve, reject)  {
        this.instagramApi.authorize_user(code, CONF.app.host + '/api/v1/auth/instagram_callback',
         function(error, result)  {
            if (error) {
              console.log('auth error', error);
              reject(error.message);
            } else {
              this.accessToken = result.access_token;
              resolve(this.accessToken);
            }
          }.bind(this));
    }.bind(this));
  };

  InstagramClient.prototype.getCheckins=function(offset        , limit        , callback)                                         {"use strict";
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
        // fs.writeFile(__dirname + '/../../../../test/mock/foursquare.' + offset + '-' + limit + '.json',
        //   JSON.stringify(checkins));
        callback(err, checkins);
      });
    }
  };

  InstagramClient.prototype.getCheckinsWrapper=function(i, allCheckins, cb) {"use strict";
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

  InstagramClient.prototype.fetchAllData=function() {"use strict";
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

return InstagramClient;})()
