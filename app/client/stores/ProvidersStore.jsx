var alt = require('../alt')
//var merge = require('object-assign')
var service = require('../lib/service');
var playbackActions = require('../actions')

module.exports = alt.createStore(class ProvidersStore {
  constructor() {
    this.bindActions(playbackActions)
    this.isDemo = false;
  }

  onInit() {
    // if this is demo scenario or user alredy logged in
    // then call fetchPrismTimeline() action
    if (document.location.href.indexOf('demo') > -1) {
      this.isDemo = true;
      service.fetchTimeline(true, (err, data) => {
        if (err) {
          playbackActions.error(err);
        } else {
          playbackActions.fetchTimelineCompleted(data);
        }
      });

    } else {
      // do nothing, just welcome screen?
      // or check if some provider already connected?
    }
  }

  onFetchTimelineCompleted(data) {
    console.log('fetched');
  }

  onError() {
    console.log('error');
  }
})
