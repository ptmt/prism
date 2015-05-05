/* @flow */

var foursquareClient = new (require('../providers/foursquare/client'))();
var instagramClient = new (require('../providers/instagram/client'))();

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
        'Location': foursquareClient.getFoursquareUrl(),
        'Content-Length': '0'
      }
    })
  }

  // return access code to client
  static foursquare_callback(req: any, content: any, cb: () => void) {
    foursquareClient.auth(req.query.code).then(accessToken => {
      return cb(null, 'end', {
        statusCode: 302,
        headers: {
          'Location': '/?provider=foursquare&setToken=' + accessToken,
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

  static instagram(req: any, content: any, cb: () => void) {
    return cb(null, 'end', {
      statusCode: 302,
      headers: {
        'Location': instagramClient.getInstagramUrl(),
        'Content-Length': '0'
      }
    })
  }

  static instagram_callback(req: any, content: any, cb: () => void) {
    instagramClient.auth(req.query.code).then(accessToken => {
      return cb(null, 'end', {
        statusCode: 302,
        headers: {
          'Location': '/?provider=instagram&setToken=' + accessToken,
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




}

module.exports = AuthController;
