/* @flow */

var FoursquareService = require('../providers/foursquare/service');
var f = new FoursquareService();

// because core.js Error
class HttpError extends Error {
  statusCode: number;
}

class AuthController {
  static foursquare(req: any, content: any, cb: () => void) {
    // res.writeHead(302, {
    //   'Location': f.getFoursquareUrl(),
    //   'Content-Length': '0'
    // });
    // res.end();
    //
    console.log(f.getFoursquareUrl());
    return cb(null, 'end', {
      statusCode: 302,
      headers: {
        'Location': f.getFoursquareUrl(),
        'Content-Length': '0'
      }
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
