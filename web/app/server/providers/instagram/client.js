/* @flow */

var CONF = require('config');
var fs = require('fs');
var Promise = require('bluebird');

module.exports = class InstagramClient {
  instagramApi: any;
  accessToken: string;
  options: any;
  constructor(options?: any) {

    this.instagramApi = require('instagram-node').instagram();
    this.instagramApi.use({
      client_id: CONF.instagram.clientId,
      client_secret: CONF.instagram.clientSecret,
      redirect_uri: CONF.app.host + '/api/v1/auth/instagram_callback'
    });
    this.options = options || {};
  }

  getInstagramUrl(){
    return this.instagramApi.get_authorization_url(CONF.app.host + '/api/v1/auth/instagram_callback');
  }

  auth(code):void {
    return new Promise((resolve, reject) => {
        this.instagramApi.authorize_user(code, CONF.app.host + '/api/v1/auth/instagram_callback',
         (error, result) => {
            if (error) {
              console.log('auth error', error);
              reject(error.message);
            } else {
              this.accessToken = result.access_token;
              resolve(this.accessToken);
            }
          });
    });
  }

  getCheckins(offset: number, limit: number, callback: (err: any, checkins: any) => void): any {
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
  }

  getCheckinsWrapper(i, allCheckins, cb) {
    this.getCheckins(i, 250, (err, checkins) => {
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
    });
  }

  fetchAllData() {
    return new Promise((resolve, reject) => {
      return this.getCheckinsWrapper(0, [], (err, allCheckins) => {
        if (err) {
          reject(err);
        } else {
          console.log('fetched', allCheckins.length, 'checkins');
          resolve(allCheckins);
        }
      });
    });
  }

}
