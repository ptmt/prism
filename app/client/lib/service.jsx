/* @flow */

var Request = require('./request');
var Cache = require('./cache');
var cache = new Cache(window.localStorage);

type PrismPoint = {
  source: string; // should be Enum (like Foursquare / Twitter / Instagram / etc.)
  lng: string;
  lat: string;
  description: string;
  link: string;
}

type PrismIteration = {
  currentPoint: PrismPoint;
  stats: any;
  player: any;
}

type IterationMap = { [key:string]: PrismIteration };

type Timeline = {
  startdate: string;
  enddate: string;
  iterations: IterationMap;
  providers: Array<any>;
}

// class TimelineRequest extends Request<Timeline> {};
//
// class VersionRequest extends Request<string> {};
//
// class AutocompletionRequest extends Request<Array<any>> {};

// TODO: rewrite with promises?
module.exports = {
  fetchTimeline: function(tokens: any, callback: Function) {
    //console.log(tokens, JSON.stringify(tokens));
    cache.setAsync('/api/v1/gettimeline?tokens=' + encodeURIComponent(JSON.stringify(tokens)), callback);
  }
}
