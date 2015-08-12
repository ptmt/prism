/* @flow */

var providers = require('../providers');
var { Timeline } = require('../models/timeline');

// TODO: add dependency injection
// like CacheManager or something to make it testable

class Request {
  query: any;
  timeline: any;
}

// because core.js Error
class HttpError extends Error {
  statusCode: number;
}

class MainController {
  static getTimeline(req: Request, content: any, render: () => void) {
    // get data from each provider and recalculate timeline
    //console.log('loaded ', providers.length, ' providers');
    //console.log(req.query.tokens, JSON.parse(decodeURIComponent(req.query.tokens)));
    req.timeline = new Timeline(req.query ? JSON.parse(decodeURIComponent(req.query.tokens)) : {}, providers);
    req.timeline.fetch().then(function(result) {
      render(null, result);
    }).catch(error => {
      console.log(error)
      render(error);
    });

  }
}

module.exports = MainController;
