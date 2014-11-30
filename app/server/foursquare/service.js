/* @flow */
'use strict';

var fs = require('fs');

class FoursquareService {
  foursquareApi: any;
  accessToken: string;
  options: any;
  constructor(foursquareApi:any, options?: any) {
    this.foursquareApi = foursquareApi;
    this.options = options;
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
    if (this.options.debug) {
      callback(null, JSON.parse(
        fs.readFileSync(__dirname + '/../../../test/mock/foursquare.' + offset + '-' + limit + '.json')
      ));
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
