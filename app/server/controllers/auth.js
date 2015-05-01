/* @flow */

var FoursquareService = require('../providers/foursquare/service');
var f = new FoursquareService();

// because core.js Error
class HttpError extends Error {
  statusCode: number;
}

class AuthController {

  // trying to create Foursquare login url and redirect to it
  static foursquare(req: any, content: any, cb: () => void) {
    return cb(null, 'end', {
      statusCode: 302,
      headers: {
        'Location': f.getFoursquareUrl(),
        'Content-Length': '0'
      }
    })
  }

  // return access code to client
  static foursquare_callback(req: any, content: any, cb: () => void) {
    f.auth(req.query.code).then(accessToken => {
      return cb(null, 'end', {
        statusCode: 302,
        headers: {
          'Location': '/?foursquareToken=' + accessToken,
          'Content-Length': '0'
        }
      })
    }).catch(error => {
      return cb(null, 'end', {
        statusCode: 302,
        headers: {
          'Location': '/?server_error=' + error,
          'Content-Length': '0'
        }
      })
    });
  }

  // auth with code
  static foursquare_auth(req: any, content: any, cb: () => void) {
    f.auth(req.query.code, (err, accessToken) => {
      console.log(req.query.code, err, accessToken);
      cb(err, accessToken);
    })
  }
  // static getTimeline(req: Request, content: any, render: () => void) {
  //   // get data from each provider and recalculate timeline
  //   //console.log('loaded ', providers.length, ' providers');
  //   req.timeline = new Timeline(providers);
  //   req.timeline.fetch().then(function(result) {
  //     render(null, result);
  //   });
  // }
}

module.exports = AuthController;
