/* @flow */

var CONF = require('config');
var fs = require('fs');
var Promise = require('bluebird');

class FoursquareService {
  foursquareApi: any;
  accessToken: string;
  options: any;
  constructor(options?: any) {
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

  getFoursquareUrl(){
    return this.foursquareApi.getAuthClientRedirectUrl();
  }

  auth():void {
    return new Promise((resolve, reject) => {
        this.foursquareApi.getAccessToken({
        code: this.authCode
      }, (error, accessToken) => {
        this.accessToken = accessToken;
        if (error) {
          console.log('err', error);
          reject(error.message);
        } else {
          resolve(accessToken);
        }
      });
    });
  }

  getCheckins(offset: number, limit: number, callback: (err: any, checkins: any) => void): any {
    offset = offset || 0;
    limit = limit || 250;
    if (!this.options.authCode) {
      callback(null, JSON.parse(
        fs.readFileSync(__dirname + '/../../../../test/mock/foursquare.' + offset + '-' + limit + '.json')
      )); // TODO: move tests and mocks inside providers
    } else {
      var accessToken = this.accessToken;
      this.foursquareApi.Users.getCheckins('self', {
        offset: offset,
        limit: limit,
        sort: 'oldestfirst'
      }, accessToken,
      function(err, checkins) {
        console.log(accessToken, err, checkins);
        callback(err, checkins);
      });
    }
  }

  getCheckinsWrapper() {
    return new Promise((resolve, reject) => {
      return this.getCheckins(0, 250, (err, checkins) => {
        if (err) {
          console.log('err', err);
          reject(err);
        } else {
          resolve(checkins);
        }
      });
    });
  }

  fetchAllData() {
    return this.auth()
        .then(this.getCheckinsWrapper);
  }

}

module.exports = FoursquareService;
