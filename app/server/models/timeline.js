/* @flow */
var moment = require('moment');
var async = require('async');
var Promise = require('bluebird');

type IterationStep = {
  currentGeo: any;
  stats: any;
  player: any;
}

type IterationMap = { [key:string]: IterationStep };

class Timeline {
  startdate: string;
  enddate: string;
  iterations: IterationMap;
  providers: Array<any>;
  constructor(providers: any) {
    this.providers = providers;
  };
  fetch():void {
    var stats = {};
    // var inits = providers.map((provider) => {
    //   //return async.apply(provider.init, stats); // TODO: pseudo race conditions?
    //   return provider.init(stats);
    // });
    return Promise.reduce(this.providers, (s, p) => {
      return p.init(s);
    }, stats).then(s => {
      this.stats = s;
      return Promise.resolve({
        stats: stats,
        startdate: '',
        enddate: ''
      });
    });
  }
}

module.exports = Timeline;
