var alt = require('../alt')
//var merge = require('object-assign')
var service = require('../lib/service');
var prismActions = require('../actions')

module.exports = alt.createStore(class ProvidersStore {
  constructor() {
    this.bindActions(prismActions)
    this.isDemo = false;
    this.isLoading = false;
  }

  onInit() {
    // if this is demo scenario or user already logged in
    // then call fetchPrismTimeline() action
    if (document.location.href.indexOf('demo') > -1) {
      this.isDemo = true;
      this.isLoading = true;
      service.fetchTimeline(true, (err, data) => {
        this.isLoading = false;
        if (err) {
          prismActions.error(err);
        } else {
          prismActions.fetchTimelineCompleted(data);
        }
      });
    } else {
      // do nothing, just welcome screen?
      // or check if some provider already connected?
    }
  }


})
