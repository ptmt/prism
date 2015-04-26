var alt = require('../alt')
//var merge = require('object-assign')
var service = require('../lib/service');
var prismActions = require('../actions')

module.exports = alt.createStore(class TimelineStore {
  constructor() {
    this.bindActions(prismActions)
    this.iterations = [];
  }

  onFetchTimelineCompleted(data) {
    this.timeline = data;
  }
  
  onError() {
    console.log('error');
  }
});
