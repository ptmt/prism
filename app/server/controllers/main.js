/* @flow */

var providers = require('../providers');
var Timeline = require('../models/timeline').Timeline;

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
    console.log(JSON.parse(req.query.codes));
    req.timeline = new Timeline(req.query ? JSON.parse(req.query.codes) : {}, providers);
    req.timeline.fetch().then(function(result) {
      render(null, result);
    });

  }
}

module.exports = MainController;
