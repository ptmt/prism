/* @flow */
var moment = require('moment');
var async = require('async');
var Promise = require('bluebird');
var Player = require('./player').Player;

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

class Timeline {
  startdate: string;
  enddate: string;
  iterations: IterationMap;
  providers: Array<any>;
  constructor(providers: any) {
    this.providers = providers;
    this.iterations = {};
  };
  initAll(): Promise {
    var stats = {};
    return Promise.reduce(this.providers, (s, p) => {
      return p.init(s);
    }, stats).then(s => {
      return Promise.resolve(stats);
    });
  };

  fetch():any {
    return this.initAll()
      .then(stats => {
        var player = new Player();
        this.providers.forEach(provider => {
          var iteration = provider.calculateNextIteration(stats, player);
          while (iteration) {
            this.iterations[iteration.key] = iteration;
            iteration = provider.calculateNextIteration(stats, player);
          }
        });
        return Promise.resolve({
          iterations: this.iterations
        })
      });
  }
}

module.exports.Timeline = Timeline;
