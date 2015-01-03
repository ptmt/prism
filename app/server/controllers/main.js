/* @flow */

var providers = require('../providers');
var Timeline = require('../models/timeline');

// TODO: add dependency injection
// like CacheManager or something to make it testable

class Request {
  query: any;
}

// because core.js Error
class HttpError extends Error {
  statusCode: number;
}

class MainController {
  static connected(req: Request, content: any, render: () => void) {
    render(null, "ok");
  }
  static getTimeline(req: Request, content: any, render: () => void) {
    // get data from each provider and recalculate timeline
    console.log('loaded ', providers.length, ' providers');
    req.timeline = new Timeline(providers);
    req.timeline.fetch().then(function(result) {
      render(null, result);
    });

  }
}

module.exports = MainController;
