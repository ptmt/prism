/* @flow */

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
}

module.exports = MainController
