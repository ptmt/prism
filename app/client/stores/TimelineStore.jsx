var Reflux = require('reflux')
var path = require('../map/path');
var L = require('leaflet');
var appConfig = require('./../config');
var appActions = require('./../actions');
var xhr = require('../lib/xhr');
var _ = require('lodash');

type IterationStep = {
  live: any;
  currentCheckin: any;
  player: any;
}


var TimelineStore = Reflux.createStore({

  init: function() {
    this.iterations = {}
    this.listenTo(appActions.start, this.start);
  },

  start: function() {
    xhr.getJson(appConfig.apiEndpoint + '/getTimeline', (err, data) => {
      if (err) {
        // something about it
      }
      // TODO: immutable
      this.iterations = data.iterations;
      this.keys = _.keys(this.iterations);
      var i = 0;
      setTimeout(() => {
        this.trigger(this.iterations[this.keys[i++]])
      }, 2000);
    });
  },

  nextIteration: function(map, layer) {
    var endpoint: string = appConfig.apiEndpoint + '/foursquare/iterate?debug=' + window.localStorage
      .getItem('debug'); // TODO: refactor it with DEMO

    getJson(endpoint, (err, data) => {

      if (err || !data || (!data.player)) {
        window.localStorage.setItem('auth', false);
        document.location.href = '/?logout';
        return;
      }

      // draw a point
      if (data.currentCheckin) {
        if (data.currentCheckin.venue && data.currentCheckin.venue.location
          .lat) {
          layer.addPoint([data.currentCheckin.venue.location.lat,
            data.currentCheckin.venue.location.lng, 1.5]);

          // change bounds if didn't fit
          if (!map.getBounds().contains(layer.bounds20)) {
            map.fitBounds(layer.bounds20, {
              animate: true
            });
          }

          if (data.live.prevprevCheckin && data.live.prevprevCheckin.venue) {
            path.drawLine(data.currentCheckin.venue.location, data.live
              .prevprevCheckin.venue.location, map);
          }
        }

        this.iterationStep = data;
        this.trigger(data);

        setTimeout(() => {
          this.nextIteration(map, layer);
        }, 1000);

      }


    });
    // var gameId = arguments[0]
    // if(this.gameData[gameId]) {
    //   this.trigger(this.gameData[gameId])
    // } else {
    //   var self = this
    //   request
    //   .get(appConfig.LOCAL_API_HOST + '/api/game/' + gameId)
    //   .end(function(err, res) {
    //     if(res.body && res.body.results) {
    //       self.gameData[gameId] = res.body.results
    //       self.trigger(res.body.results)
    //     }
    //   })
    // }
  }

})

module.exports = TimelineStore;
