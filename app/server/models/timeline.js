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
  timestamps: Array<string>;
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
        // Build the iterations map, where key is a time label
        // because different providers have different timestamps
        this.providers.forEach(provider => {
          var iteration = provider.calculateNextIteration(stats, player);
          while (iteration) {
            this.iterations[iteration.key] = iteration;
            iteration = provider.calculateNextIteration(stats, player);
          }
          // Cleanup for each providers
          provider.cleanup(this.iterations);
        });
        // Build the timestamps array
        // for the playback controls and for easy iterations
        this.timestamps = Object.keys(this.iterations).sort();

        return Promise.resolve({
          iterations: this.iterations,
          timestamps: this.timestamps,
          providers: this.providers.map(p=> p.name)
        })
      });
  }
}

module.exports.Timeline = Timeline;
