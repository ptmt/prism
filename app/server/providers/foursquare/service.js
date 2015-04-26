/* @flow */

var CONF = require('config');
var fs = require('fs');

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
      }
    });
    this.options = options || {};
  }

  getFoursquareUrl(){
    return this.foursquareApi.getAuthClientRedirectUrl();
  }

  auth(code:string, callback: any):void {
    this.foursquareApi.getAccessToken({
      code: code
    }, function(error, accessToken) {
      callback(error);
      this.accessToken = accessToken;
    });
  }
  getCheckins(offset: number, limit: number, callback: (err: any, checkins: any) => void): any {
    offset = offset || 0;
    limit = limit || 250;
    if (this.options.demo) {
      callback(null, JSON.parse(
        fs.readFileSync(__dirname + '/../../../../test/mock/foursquare.' + offset + '-' + limit + '.json')
      )); // TODO: move tests and mocks inside providers
    } else {
      this.foursquareApi.Users.getCheckins('self', {
        offset: offset,
        limit: limit,
        sort: 'oldestfirst'
      }, this.accessToken,
      function(err, checkins) {
        callback(err, checkins);
      });
    }
  }
}

module.exports = FoursquareService;
