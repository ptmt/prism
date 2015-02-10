var Reflux = require('reflux')
var appConfig = require('./../config');
var appActions = require('./../actions');
var xhr = require('../lib/xhr');

var ProvidersStore = Reflux.createStore({

  init() {
    this.listenTo(appActions.welcome, this.welcome);
  },

  welcome() {
    // if this is debug scenario or user alredy logged in
    // then call getTimeline() action
    this.trigger({
      foursquare: true
    });
  }
  
})

module.exports = ProvidersStore;
