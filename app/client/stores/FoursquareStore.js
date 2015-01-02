var Reflux = require('reflux')
var path = require('../map/path');
var L = require('leaflet');
var appConfig = require('./../config')
var appActions = require('./../actions')

type Callback < T > = (err: any, data ? : T) => void;

type IterationStep = {
  live: any;
  currentCheckin: any;
  player: any;
}

function getJson(url: string, callback: Callback < IterationStep > ) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);

  request.onload = function() {
    if (request.status === 200) {
      var json = JSON.parse(request.responseText);
      if (json.error) {
        return callback(json.error);
      }
      callback(null, json);
    } else {
      // We reached our target server, but it returned an error
      callback('error:' + request.responseText);
    }
  };

  request.onerror = function() {
    // There was a connection error of some sort
    callback('error');
  };

  request.send();
}

var foursquareStore = Reflux.createStore({

  init: function() {
    this.iterationStep = {}
    this.listenTo(appActions.startFoursquare, this.nextIteration)
  },

  nextIteration: function(map, layer) {
    var endpoint: string = appConfig.apiEndpoint + '/foursquare/iterate?debug=' + window.localStorage
      .getItem('debug');
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

module.exports = foursquareStore
