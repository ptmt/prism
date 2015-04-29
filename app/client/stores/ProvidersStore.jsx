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
      service.fetchTimeline({}, (err, data) => {
        this.isLoading = false;
        if (err) {
          prismActions.error(err);
        } else {
          prismActions.fetchTimelineCompleted(data);
        }
      });
    } else {
      // do nothing, just welcome screen?
      if (document.location.href.indexOf('foursquareCode') > -1) {
        this.isDemo = true;
        this.isLoading = true;
        var code = document.location.href.split('foursquareCode')[1].split('=')[1];
        if (supportsStorage) {
          window.localStorage['foursquare.code'] = code;
        }
        // then fetch timeline with code
        service.fetchTimeline({foursquare: code}, (err, data) => {
          this.isLoading = false;
          if (err) {
            prismActions.error(err);
          } else {
            prismActions.fetchTimelineCompleted(data);
          }
        });
      }
    }
  }


});

function supportsStorage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}
